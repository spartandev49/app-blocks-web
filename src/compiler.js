import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { compactCatalog } from "./catalog.js";
import { parse } from "./parser.js";
import { renderPage } from "./render.js";
import { assertValid } from "./validate.js";
import { child, outputPathForRoute, text, walk } from "./utils.js";
import { VERSION } from "./version.js";

function normalizeBase(value = "/") {
  let base = String(value || "/");
  if (!base.startsWith("/")) base = `/${base}`;
  if (!base.endsWith("/")) base += "/";
  return base.replace(/\/{2,}/g, "/");
}

function siteMetadata(site) {
  const metaNode = child(site, "meta");
  return metaNode?.attrs ?? {};
}

function countBlocks(ast) {
  const counts = {};
  let total = 0;
  walk(ast, (node) => {
    if (node.name === "document") return;
    counts[node.name] = (counts[node.name] ?? 0) + 1;
    total += 1;
  });
  return { total, counts };
}

function estimateTokens(value) {
  return Math.max(1, Math.ceil(String(value).length / 4));
}

export async function compile(source, options = {}) {
  const ast = parse(source, { filename: options.filename });
  const diagnostics = assertValid(ast, { strict: options.strict });
  const site = ast.children.find((node) => node.name === "site");
  const pages = site.children.filter((node) => node.name === "page");
  const base = normalizeBase(options.base ?? site.attrs.base ?? "/");
  const context = {
    siteName: text(site, "AppBlocks site"),
    theme: site.attrs.theme ?? "blueprint",
    lang: site.attrs.lang ?? "en",
    base,
    origin: site.attrs.origin ?? "",
    accent: site.attrs.accent ?? "",
    motion: site.attrs.motion !== false,
    meta: siteMetadata(site),
    version: VERSION,
    sharedHeader: child(site, "header"),
    sharedFooter: child(site, "footer")
  };
  const files = new Map();
  for (const page of pages) files.set(outputPathForRoute(page.args[0]), renderPage(page, context));
  const [css, runtime] = await Promise.all([
    readFile(new URL("./appblocks.css", import.meta.url), "utf8"),
    readFile(new URL("./runtime.js", import.meta.url), "utf8")
  ]);
  files.set("appblocks.css", css);
  files.set("appblocks.js", runtime);
  files.set("appblocks.catalog.json", `${JSON.stringify({ version: 1, engine: VERSION, blocks: compactCatalog() }, null, 2)}\n`);
  const blockStats = countBlocks(ast);
  const generatedBytesWithoutManifest = [...files.values()].reduce((total, value) => total + Buffer.byteLength(value), 0);
  const generatedCharactersWithoutManifest = [...files.values()].reduce((total, value) => total + value.length, 0);
  const sourceBytes = Buffer.byteLength(source);
  const manifest = {
    format: "appblocks-web-build",
    version: 1,
    engine: VERSION,
    project: context.siteName,
    base,
    pages: pages.map((page) => ({ route: page.args[0], file: outputPathForRoute(page.args[0]), title: page.attrs.title ?? context.siteName })),
    files: [...files.keys(), "appblocks.manifest.json"],
    blocks: blockStats,
    source: {
      bytes: sourceBytes,
      estimatedTokens: estimateTokens(source)
    },
    output: {
      bytes: generatedBytesWithoutManifest,
      estimatedTokens: Math.max(1, Math.ceil(generatedCharactersWithoutManifest / 4)),
      expansionRatio: Number((generatedBytesWithoutManifest / Math.max(1, sourceBytes)).toFixed(2))
    }
  };
  let manifestText = "";
  let outputBytes = generatedBytesWithoutManifest;
  let outputCharacters = generatedCharactersWithoutManifest;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    manifest.output.bytes = outputBytes;
    manifest.output.estimatedTokens = Math.max(1, Math.ceil(outputCharacters / 4));
    manifest.output.expansionRatio = Number((outputBytes / Math.max(1, sourceBytes)).toFixed(2));
    const candidate = `${JSON.stringify(manifest, null, 2)}\n`;
    const nextBytes = generatedBytesWithoutManifest + Buffer.byteLength(candidate);
    const nextCharacters = generatedCharactersWithoutManifest + candidate.length;
    manifestText = candidate;
    if (nextBytes === outputBytes && nextCharacters === outputCharacters) break;
    outputBytes = nextBytes;
    outputCharacters = nextCharacters;
  }
  manifest.output.bytes = outputBytes;
  manifest.output.estimatedTokens = Math.max(1, Math.ceil(outputCharacters / 4));
  manifest.output.expansionRatio = Number((outputBytes / Math.max(1, sourceBytes)).toFixed(2));
  manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
  files.set("appblocks.manifest.json", manifestText);
  return { ast, diagnostics, files, manifest };
}

function safeOutputPath(outDir, relativePath) {
  const root = path.resolve(outDir);
  const target = path.resolve(root, relativePath);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error(`Unsafe output path: ${relativePath}`);
  return target;
}

async function removeStaleFiles(outDir, nextFiles) {
  try {
    const previous = JSON.parse(await readFile(path.join(outDir, "appblocks.manifest.json"), "utf8"));
    for (const file of previous.files ?? []) {
      if (nextFiles.has(file)) continue;
      const target = safeOutputPath(outDir, file);
      await rm(target, { force: true });
    }
  } catch (error) {
    if (error?.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
  }
}

export async function writeBuild(result, outDir) {
  const root = path.resolve(outDir);
  const nextFiles = new Set(result.files.keys());
  await mkdir(root, { recursive: true });
  await removeStaleFiles(root, nextFiles);
  for (const [relativePath, contents] of result.files) {
    const target = safeOutputPath(root, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, contents, "utf8");
  }
  return { outDir: root, files: [...nextFiles] };
}

export async function buildFile(filename, options = {}) {
  const source = await readFile(filename, "utf8");
  const result = await compile(source, { ...options, filename });
  if (options.outDir) await writeBuild(result, options.outDir);
  return result;
}

export { normalizeBase };
