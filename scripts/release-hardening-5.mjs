import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFile(file(path), "utf8");
const write = (path, value) => writeFile(file(path), value.endsWith("\n") ? value : `${value}\n`);

let design = await read("src/v2-design.js");
design = design.replace(
/export function resolveRecipe\(value = "d0000"\) \{[\s\S]*?\n\}\n\nexport function listRecipes/,
`export function resolveRecipe(value = "d0000") {
  const index = recipeNumber(value);
  const paletteIndex = index % PALETTES.length;
  const displayFontIndex = index % FONT_PRESETS.length;
  const bodyFontIndex = Math.floor(index / FONT_PRESETS.length) % FONT_PRESETS.length;
  const systemIndex = index % VISUAL_SYSTEMS.length;
  const displayFont = FONT_PRESETS[displayFontIndex];
  const bodyFont = FONT_PRESETS[bodyFontIndex];
  const font = freeze({
    name: \`\${displayFont.name}+\${bodyFont.name}\`,
    display: displayFont.display,
    body: bodyFont.body,
    mono: bodyFont.mono,
    tracking: displayFont.tracking
  });
  return freeze({
    id: \`d\${String(index).padStart(4, "0")}\`,
    index,
    palette: PALETTES[paletteIndex],
    font,
    system: VISUAL_SYSTEMS[systemIndex],
    shape: SHAPES[(index * 7 + Math.floor(index / 13)) % SHAPES.length],
    surface: SURFACES[(index * 11 + Math.floor(index / 17)) % SURFACES.length],
    motion: MOTIONS[(index * 13 + Math.floor(index / 19)) % MOTIONS.length],
    density: DENSITIES[(index * 17 + Math.floor(index / 23)) % DENSITIES.length],
    shadow: SHADOWS[(index * 19 + Math.floor(index / 29)) % SHADOWS.length],
    style: index % 12,
    layout: Math.floor(index / 7) % 10,
    signature: \`\${index}:\${paletteIndex}:\${displayFontIndex}:\${bodyFontIndex}:\${systemIndex}:\${index % 12}:\${Math.floor(index / 7) % 10}\`
  });
}

export function listRecipes`
);
design = design.replace(
  'fonts: FONT_PRESETS.length,',
  'fontFoundations: FONT_PRESETS.length,\n  fonts: FONT_PRESETS.length * FONT_PRESETS.length,'
);
await write("src/v2-design.js", design);

let test = await read("test/combinatorial-design.test.js");
test = test.replace('assert.equal(FONT_PRESETS.length, 30);', 'assert.equal(FONT_PRESETS.length, 30);\n  assert.equal(DESIGN_COUNTS.fontFoundations, 30);\n  assert.equal(DESIGN_COUNTS.fonts, 900);');
test = test.replace('assert.equal(fonts.size, FONT_PRESETS.length);', 'assert.equal(fonts.size, DESIGN_COUNTS.fonts);');
await write("test/combinatorial-design.test.js", test);

for (const path of ["README.md", "LLMS.txt", "LLMS-COMPACT.txt", "CHANGELOG.md", "docs/DESIGN_ENGINE.md", "docs/ARCHITECTURE.md"]) {
  let source = await read(path);
  source = source
    .replaceAll("30 font pairings", "30 font foundations and 900 display/body pairings")
    .replaceAll("30 font pairing", "30 font foundations and 900 display/body pairing")
    .replace("| Font pairings | 30 | recipe-selected or `ff=<name>` |", "| Font foundations | 30 | recipe-selected or `ff=<name>` |\n| Display/body pairings | 900 | selected deterministically by recipe |");
  await write(path, source);
}

let types = await read("src/index.d.ts");
types = types.replace('export interface DesignRegistryCounts { recipes: number; virtualBlocks: number; palettes: number; fonts: number;', 'export interface DesignRegistryCounts { recipes: number; virtualBlocks: number; palettes: number; fontFoundations: number; fonts: number;');
await write("src/index.d.ts", types);

console.log("Expanded 30 curated font foundations into 900 deterministic display/body pairings.");
