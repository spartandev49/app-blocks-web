import { readFile } from "node:fs/promises";
import {
  compile as compileLegacy,
  normalizeBase,
  writeBuild
} from "./compiler.js";
import {
  DESIGN_AXES,
  VIRTUAL_BLOCK_COUNT,
  compactCatalog,
  designManifest,
  normalizeCompactSource
} from "./combinatorial-engine.js";
import { ADVANCED_CSS, ADVANCED_RUNTIME, buildDesignCss } from "./combinatorial-assets.js";

function appendAsset(files, name, addition) {
  const current = files.get(name) ?? "";
  files.set(name, `${String(current).trimEnd()}\n\n${String(addition).trim()}\n`);
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function decorateHtml(html, design) {
  const attributes = [
    'data-ab-engine="2"',
    `data-ab-recipes="${DESIGN_AXES.recipes}"`,
    `data-ab-virtual-blocks="${VIRTUAL_BLOCK_COUNT}"`
  ];
  if (design.active) {
    for (const key of ["recipe", "palette", "font", "shape", "surface", "motion", "density", "shadow"]) {
      attributes.push(`data-ab-${key}="${escapeAttribute(design[key])}"`);
    }
  }
  return String(html).replace(/<html\b([^>]*)>/i, (_match, existing) => `<html${existing} ${attributes.join(" ")}>`);
}

function estimatedTokens(text) {
  return Math.ceil(String(text).length / 4);
}

function updateManifestFile(files, manifest, source) {
  const manifestName = "appblocks.manifest.json";
  manifest.source = {
    ...(manifest.source ?? {}),
    bytes: Buffer.byteLength(source),
    estimatedTokens: estimatedTokens(source)
  };

  for (let pass = 0; pass < 12; pass += 1) {
    files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
    const outputBytes = [...files.values()].reduce((sum, value) => sum + Buffer.byteLength(String(value)), 0);
    const outputCharacters = [...files.values()].reduce((sum, value) => sum + String(value).length, 0);
    const next = {
      ...(manifest.output ?? {}),
      bytes: outputBytes,
      estimatedTokens: Math.ceil(outputCharacters / 4),
      expansionRatio: manifest.source.bytes ? Number((outputBytes / manifest.source.bytes).toFixed(2)) : 0
    };
    const stable = manifest.output?.bytes === next.bytes
      && manifest.output?.estimatedTokens === next.estimatedTokens
      && manifest.output?.expansionRatio === next.expansionRatio;
    manifest.output = next;
    if (stable) break;
  }
  files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
}

export async function compile(source, options = {}) {
  const authoredSource = String(source ?? "");
  const normalized = normalizeCompactSource(authoredSource);
  const legacy = await compileLegacy(normalized.source, options);
  const files = new Map(legacy.files);
  const design = designManifest(normalized.design);

  appendAsset(files, "appblocks.css", `${ADVANCED_CSS}\n${buildDesignCss(normalized.design)}`);
  appendAsset(files, "appblocks.js", ADVANCED_RUNTIME);
  files.set("appblocks.catalog.json", `${JSON.stringify(compactCatalog(), null, 2)}\n`);

  for (const [name, contents] of [...files.entries()]) {
    if (name.endsWith(".html")) files.set(name, decorateHtml(contents, design));
  }

  const manifest = {
    ...legacy.manifest,
    engine: {
      generation: 2,
      compactSyntax: true,
      recipes: DESIGN_AXES.recipes,
      virtualBlocks: VIRTUAL_BLOCK_COUNT,
      semanticBlocks: compactCatalog().length
    },
    design
  };
  updateManifestFile(files, manifest, authoredSource);

  return {
    ...legacy,
    files,
    manifest,
    normalizedSource: normalized.source,
    design
  };
}

export async function buildFile(filename, options = {}) {
  const source = await readFile(filename, "utf8");
  const result = await compile(source, { ...options, filename: options.filename ?? filename });
  if (options.outDir) await writeBuild(result, options.outDir);
  return result;
}

export { normalizeBase, writeBuild };
