import { readdir, readFile } from "node:fs/promises";
import { compile, normalizeCompactSource } from "../src/index.js";

const directory = new URL("../examples/", import.meta.url);
const files = (await readdir(directory)).filter((file) => /\.(?:appblocks|ab)$/.test(file)).sort();
const rows = [];

for (const file of files) {
  const source = await readFile(new URL(file, directory), "utf8");
  const normalized = normalizeCompactSource(source);
  const result = await compile(source, { filename: file, strict: true });
  rows.push({
    example: file,
    generation: result.capabilities?.generation ?? 1,
    pages: result.manifest.pages.length,
    blocks: result.manifest.blocks.total,
    sourceBytes: result.manifest.source.bytes,
    canonicalBytes: Buffer.byteLength(normalized.source),
    sourceShare: Number((Buffer.byteLength(source) / Math.max(1, Buffer.byteLength(normalized.source))).toFixed(2)),
    generatedBytes: result.manifest.output.bytes,
    expansion: result.manifest.output.expansionRatio
  });
}

console.table(rows);
console.log("Token figures in build manifests are transparent four-characters-per-token estimates. Byte figures use exact UTF-8 sizes.");

const showcase = rows.find((row) => row.example === "showcase.appblocks");
if (!showcase || showcase.expansion < 10) {
  console.error(`Showcase expansion target failed: ${showcase?.expansion ?? "missing"}× < 10×`);
  process.exitCode = 1;
}

const generation2 = rows.find((row) => row.example === "generation2-showcase.ab");
if (!generation2 || generation2.generation !== 2) {
  console.error("Generation-2 benchmark fixture did not activate generation 2.");
  process.exitCode = 1;
} else if (generation2.sourceShare >= 0.8) {
  console.error(`Compact-source target failed: ${generation2.sourceShare} must be below 0.8 of canonical source.`);
  process.exitCode = 1;
}
