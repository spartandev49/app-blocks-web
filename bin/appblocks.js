#!/usr/bin/env node
import { watch } from "node:fs";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  AppBlocksError,
  VERSION,
  buildFile,
  compactCatalog,
  formatDiagnostics,
  getBlock,
  parse,
  validate
} from "../src/index.js";

const HELP = `AppBlocks Web ${VERSION}

Usage:
  appblocks build <file> [--out public] [--base /] [--strict]
  appblocks dev <file> [--port 4173] [--host 127.0.0.1]
  appblocks validate <file> [--strict] [--json]
  appblocks inspect <file> [--json]
  appblocks catalog [block] [--json]
  appblocks tokens <file> [--json]

Commands:
  build      Validate and compile a deployable static site.
  dev        Build, watch and serve with live reload.
  validate   Parse and validate without writing files.
  inspect    Print the canonical AppBlocks syntax tree.
  catalog    Search or inspect machine-readable block contracts.
  tokens     Report source-to-generated expansion statistics.
`;

function parseArguments(argv) {
  const positionals = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      positionals.push(value);
      continue;
    }
    const [rawKey, inline] = value.slice(2).split(/=(.*)/s);
    if (inline !== undefined) options[rawKey] = inline;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) options[rawKey] = argv[++index];
    else options[rawKey] = true;
  }
  return { positionals, options };
}

function requireFile(positionals) {
  const filename = positionals[1];
  if (!filename) throw new Error(`The '${positionals[0] ?? "command"}' command requires an .appblocks file.`);
  return path.resolve(filename);
}

function printDiagnostics(items, source, json = false) {
  if (!items.length) return;
  if (json) console.log(JSON.stringify(items, null, 2));
  else console.error(formatDiagnostics(items, source));
}

async function buildCommand(positionals, options) {
  const filename = requireFile(positionals);
  const outDir = path.resolve(String(options.out ?? "public"));
  const result = await buildFile(filename, { outDir, base: options.base, strict: Boolean(options.strict) });
  printDiagnostics(result.diagnostics, await readFile(filename, "utf8"));
  console.log(`Built ${result.manifest.pages.length} pages and ${result.manifest.blocks.total} blocks to ${outDir}`);
  console.log(`Expansion: ${result.manifest.source.estimatedTokens} estimated input tokens → ${result.manifest.output.estimatedTokens} generated (${result.manifest.output.expansionRatio}× by bytes)`);
}

async function validateCommand(positionals, options) {
  const filename = requireFile(positionals);
  const source = await readFile(filename, "utf8");
  const ast = parse(source, { filename });
  const diagnostics = validate(ast, { strict: Boolean(options.strict) });
  printDiagnostics(diagnostics, source, Boolean(options.json));
  const errors = diagnostics.filter((item) => item.severity === "error");
  if (errors.length) process.exitCode = 1;
  else if (!options.json) console.log(`Valid: ${filename}${diagnostics.length ? ` (${diagnostics.length} warnings)` : ""}`);
}

async function inspectCommand(positionals) {
  const filename = requireFile(positionals);
  const source = await readFile(filename, "utf8");
  console.log(JSON.stringify(parse(source, { filename }), (key, value) => key === "filename" ? undefined : value, 2));
}

function catalogCommand(positionals, options) {
  const query = positionals[1];
  if (query) {
    const exact = getBlock(query);
    const matches = exact ? [exact] : compactCatalog().filter((item) => `${item.name} ${item.category} ${item.summary}`.toLowerCase().includes(query.toLowerCase()));
    if (!matches.length) throw new Error(`No block matches '${query}'.`);
    if (options.json) console.log(JSON.stringify(matches.length === 1 ? matches[0] : matches, null, 2));
    else for (const item of matches) console.log(`${item.name.padEnd(16)} ${item.category.padEnd(12)} ${item.summary}`);
    return;
  }
  const catalog = compactCatalog();
  if (options.json) console.log(JSON.stringify(catalog, null, 2));
  else for (const item of catalog) console.log(`${item.name.padEnd(16)} ${item.category.padEnd(12)} ${item.summary}`);
}

async function tokensCommand(positionals, options) {
  const filename = requireFile(positionals);
  const result = await buildFile(filename, { base: options.base });
  const report = {
    sourceBytes: result.manifest.source.bytes,
    sourceEstimatedTokens: result.manifest.source.estimatedTokens,
    generatedBytes: result.manifest.output.bytes,
    generatedEstimatedTokens: result.manifest.output.estimatedTokens,
    expansionRatio: result.manifest.output.expansionRatio,
    pages: result.manifest.pages.length,
    blocks: result.manifest.blocks.total,
    note: "Token counts use a transparent four-characters-per-token estimate; byte expansion is exact."
  };
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else console.log(`${report.sourceEstimatedTokens} estimated AppBlocks tokens compile into ${report.generatedEstimatedTokens} estimated output tokens (${report.expansionRatio}× by exact bytes) across ${report.pages} pages and ${report.blocks} blocks.\n${report.note}`);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp"
};

function liveReloadScript() {
  return `<script>(()=>{const e=new EventSource('/__appblocks/events');e.addEventListener('reload',()=>location.reload());e.addEventListener('error-build',x=>console.error('AppBlocks rebuild failed:',x.data));})()</script>`;
}

async function devCommand(positionals, options) {
  const filename = requireFile(positionals);
  const outDir = path.resolve(String(options.out ?? ".appblocks-dev"));
  const host = String(options.host ?? "127.0.0.1");
  const port = Number(options.port ?? 4173);
  const clients = new Set();
  let rebuilding = false;
  let queued = false;

  const rebuild = async () => {
    if (rebuilding) { queued = true; return; }
    rebuilding = true;
    try {
      const result = await buildFile(filename, { outDir, base: "/", strict: Boolean(options.strict) });
      console.log(`[appblocks] rebuilt ${result.manifest.pages.length} pages at ${new Date().toLocaleTimeString()}`);
      clients.forEach((response) => response.write("event: reload\ndata: ok\n\n"));
    } catch (error) {
      const message = error instanceof AppBlocksError ? formatDiagnostics(error.diagnostics, await readFile(filename, "utf8")) : error.message;
      console.error(message);
      clients.forEach((response) => response.write(`event: error-build\ndata: ${JSON.stringify(message)}\n\n`));
    } finally {
      rebuilding = false;
      if (queued) { queued = false; rebuild(); }
    }
  };

  await rebuild();
  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host ?? `${host}:${port}`}`);
    if (url.pathname === "/__appblocks/events") {
      response.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
      response.write("retry: 500\n\n");
      clients.add(response);
      request.on("close", () => clients.delete(response));
      return;
    }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { response.writeHead(400).end("Bad request"); return; }
    if (pathname.includes("\0")) { response.writeHead(400).end("Bad request"); return; }
    let relative = pathname.replace(/^\/+/, "");
    if (!relative || relative.endsWith("/")) relative += "index.html";
    else if (!path.extname(relative)) relative += "/index.html";
    const root = path.resolve(outDir);
    const target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(`${root}${path.sep}`)) { response.writeHead(403).end("Forbidden"); return; }
    try {
      let contents = await readFile(target);
      const extension = path.extname(target);
      if (extension === ".html") contents = Buffer.from(contents.toString("utf8").replace("</body>", `${liveReloadScript()}</body>`));
      response.writeHead(200, { "Content-Type": MIME[extension] ?? "application/octet-stream", "Cache-Control": "no-store" });
      response.end(contents);
    } catch (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }
  });
  server.listen(port, host, () => console.log(`AppBlocks dev server: http://${host}:${port}`));
  let timer;
  const watcher = watch(filename, () => { clearTimeout(timer); timer = setTimeout(rebuild, 80); });
  const shutdown = () => { watcher.close(); clients.forEach((client) => client.end()); server.close(() => process.exit(0)); };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

async function main() {
  const { positionals, options } = parseArguments(process.argv.slice(2));
  const command = positionals[0];
  if (command === "version" || options.version) { console.log(VERSION); return; }
  if (!command || command === "help" || options.help) { console.log(HELP); return; }
  if (command === "build") return buildCommand(positionals, options);
  if (command === "dev") return devCommand(positionals, options);
  if (command === "validate") return validateCommand(positionals, options);
  if (command === "inspect") return inspectCommand(positionals, options);
  if (command === "catalog") return catalogCommand(positionals, options);
  if (command === "tokens") return tokensCommand(positionals, options);
  throw new Error(`Unknown command '${command}'.\n\n${HELP}`);
}

main().catch(async (error) => {
  if (error instanceof AppBlocksError) {
    const filename = process.argv.find((value) => value.endsWith(".appblocks"));
    const source = filename ? await readFile(filename, "utf8").catch(() => "") : "";
    console.error(formatDiagnostics(error.diagnostics, source));
  } else console.error(`error: ${error.message}`);
  process.exitCode = 1;
});
