import { readdir, readFile } from "node:fs/promises";
import { compile } from "../src/index.js";

const directory = new URL("../examples/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".appblocks")).sort();
const rows = [];
for (const file of files) {
  const source = await readFile(new URL(file, directory), "utf8");
  const result = await compile(source, { filename: file, strict: true });
  rows.push({
    example: file,
    pages: result.manifest.pages.length,
    blocks: result.manifest.blocks.total,
    sourceBytes: result.manifest.source.bytes,
    generatedBytes: result.manifest.output.bytes,
    expansion: result.manifest.output.expansionRatio
  });
}
console.table(rows);
console.log("Token figures in build manifests are transparent four-characters-per-token estimates. Expansion above uses exact UTF-8 bytes.");
const showcase = rows.find((row) => row.example === "showcase.appblocks");
if (!showcase || showcase.expansion < 10) {
  console.error(`Showcase expansion target failed: ${showcase?.expansion ?? "missing"}× < 10×`);
  process.exitCode = 1;
}
