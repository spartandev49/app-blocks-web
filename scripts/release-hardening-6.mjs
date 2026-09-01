import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFile(file(path), "utf8");
const write = (path, value) => writeFile(file(path), value.endsWith("\n") ? value : `${value}\n`);

let guide = await read("docs/DESIGN_ENGINE.md");
guide = guide.replace(
  /^\| Font[^\n]*\|\s*$/m,
  "| Font foundations | 30 | recipe-selected or `ff=<name>` |\n| Display/body pairings | 900 | selected deterministically by recipe |"
);
guide = guide.replaceAll("32 palettes, 30 font foundations and 900 display/body pairings and 18 visual systems", "32 palettes, 30 font foundations, 900 display/body pairings and 18 visual systems");
await write("docs/DESIGN_ENGINE.md", guide);

for (const path of ["README.md", "LLMS.txt", "LLMS-COMPACT.txt", "CHANGELOG.md", "docs/ARCHITECTURE.md"]) {
  let source = await read(path);
  source = source
    .replaceAll("32 palettes, 30 font foundations and 900 display/body pairings and 18 visual systems", "32 palettes, 30 font foundations, 900 display/body pairings and 18 visual systems")
    .replaceAll("30 font foundations and 900 display/body pairingss", "30 font foundations and 900 display/body pairings");
  await write(path, source);
}

let benchmark = await read("scripts/write-v2-benchmark.mjs");
benchmark = benchmark.replace(
  '${DESIGN_COUNTS.palettes} palettes, ${DESIGN_COUNTS.fonts} font pairings and ${DESIGN_COUNTS.systems} visual systems',
  '${DESIGN_COUNTS.palettes} palettes, ${DESIGN_COUNTS.fontFoundations} font foundations, ${DESIGN_COUNTS.fonts} display/body pairings and ${DESIGN_COUNTS.systems} visual systems'
);
await write("scripts/write-v2-benchmark.mjs", benchmark);

console.log("Aligned typography counts across docs and generated benchmark labels.");
