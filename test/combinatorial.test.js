import test from "node:test";
import assert from "node:assert/strict";
import {
  CATALOG,
  DESIGN_AXES,
  EXTENDED_CATALOG,
  RECIPE_COUNT,
  VIRTUAL_BLOCK_COUNT,
  compile,
  getBlock,
  getCatalog,
  normalizeCompactSource,
  resolveRecipe,
  resolveVirtualBlock
} from "../src/index.js";

test("legacy catalog remains stable while the generated address space expands", () => {
  assert.equal(CATALOG.length >= 80, true);
  assert.equal(EXTENDED_CATALOG.length >= 150, true);
  assert.equal(getCatalog().length, CATALOG.length);
  assert.equal(getCatalog({ includeMacros: true }).length, EXTENDED_CATALOG.length);
  assert.equal(RECIPE_COUNT, 10_000);
  assert.equal(VIRTUAL_BLOCK_COUNT, 10_000);
  assert.equal(DESIGN_AXES.fontPairings >= 300, true);
  assert.equal(getBlock("carousel")?.name, "carousel");
  assert.equal(getBlock("b203")?.name, "b203");
  assert.equal(getBlock("r0421")?.name, "r0421");
});

test("all 10,000 site recipes resolve to unique deterministic axis tuples", () => {
  const tuples = new Set();
  for (let index = 0; index < RECIPE_COUNT; index += 1) {
    const recipe = resolveRecipe(`r${String(index).padStart(4, "0")}`);
    assert.ok(recipe);
    tuples.add([
      recipe.palette.index,
      recipe.font.index,
      recipe.shape.index,
      recipe.surface.index,
      recipe.motion.index,
      recipe.density.index,
      recipe.shadow.index
    ].join(":"));
  }
  assert.equal(tuples.size, RECIPE_COUNT);
});

test("virtual block ids expand to supported canonical blocks and stable classes", () => {
  const button = resolveVirtualBlock("b203");
  const hero = resolveVirtualBlock("hr017");
  const frame = resolveVirtualBlock("fr999");
  assert.equal(button?.target, "button");
  assert.equal(button?.classes.includes("ab-v-b203"), true);
  assert.equal(hero?.target, "hero");
  assert.equal(hero?.classes.includes("ab-vf-hero"), true);
  assert.equal(frame?.target, "panel");
});

test("compact aliases and semantic macros normalize before strict validation", () => {
  const normalized = normalizeCompactSource(`st "Compact" r=r0421\n  pg "/" title="Compact"\n    hr017\n      ttl "Build more with less" lvl=1\n      txt "A complete interface from a small source file."\n      b203 "Start" h="/start"\n    carousel\n      slide "One"\n`);
  assert.match(normalized.source, /^site "Compact"/m);
  assert.match(normalized.source, /page "\/"/);
  assert.match(normalized.source, /hero .*ab-v-hr017/);
  assert.match(normalized.source, /button "Start" href="\/start"/);
  assert.match(normalized.source, /gallery .*ab-x-carousel/);
  assert.match(normalized.source, /item "One" .*ab-x-slide/);
  assert.equal(normalized.source.includes("recipe="), false);
  assert.equal(normalized.design.recipe, "r0421");
});

test("compiler injects selected design assets and preserves exact manifest accounting", async () => {
  const source = `st "Compact" r=r0421\n  pg "/" title="Compact"\n    hr017\n      ttl "Build more with less" lvl=1\n      txt "A complete interface from a small source file."\n      b203 "Start" h="/start"\n`;
  const result = await compile(source, { strict: true });
  const html = result.files.get("index.html");
  const css = result.files.get("appblocks.css");
  const runtime = result.files.get("appblocks.js");
  const design = JSON.parse(result.files.get("appblocks.design.json"));
  assert.match(html, /data-ab-engine="2"/);
  assert.match(html, /data-ab-recipe="r0421"/);
  assert.match(html, /ab-v-hr017/);
  assert.match(html, /ab-v-b203/);
  assert.match(css, /AppBlocks Web combinatorial layer/);
  assert.match(css, /--ab-font-display:/);
  assert.match(runtime, /data-ab-carousel-ready/);
  assert.equal(design.axes.recipes, 10_000);
  assert.equal(design.virtualBlocks, 10_000);
  assert.equal(result.capabilities.recipes, 10_000);
  const bytes = [...result.files.values()].reduce((sum, value) => sum + Buffer.byteLength(value), 0);
  const output = result.manifest.output ?? result.manifest.metrics?.output ?? result.manifest.statistics?.output;
  assert.equal(output.bytes, bytes);
});
