import test from "node:test";
import assert from "node:assert/strict";
import { compile as compileLegacy } from "../src/compiler.js";
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
  resolveFontPair,
  resolvePalette,
  resolveRecipe,
  resolveVirtualBlock
} from "../src/index.js";

function firstFile(files, suffix) {
  const name = [...files.keys()].find((candidate) => candidate.endsWith(suffix));
  return name ? files.get(name) : undefined;
}

function findMetricPair(value, depth = 0, seen = new Set()) {
  if (!value || typeof value !== "object" || Array.isArray(value) || seen.has(value) || depth > 7) return null;
  seen.add(value);
  if (value.source && typeof value.source === "object" && value.output && typeof value.output === "object") return value;
  for (const child of Object.values(value)) {
    const found = findMetricPair(child, depth + 1, seen);
    if (found) return found;
  }
  return null;
}

test("canonical generation-1 source remains byte-for-byte isolated", async () => {
  const source = `site "Legacy"\n  page "/" title="Legacy"\n    hero\n      title "Legacy path" level=1\n      text "The original compiler remains the source of truth."\n`;
  const legacy = await compileLegacy(source, { strict: true });
  const current = await compile(source, { strict: true });
  assert.deepEqual([...current.files.entries()], [...legacy.files.entries()]);
  assert.deepEqual(current.manifest, legacy.manifest);
  assert.deepEqual(current.diagnostics, legacy.diagnostics);
  assert.equal(current.capabilities, undefined);
});

test("the default catalog stays stable while the generated address space expands", () => {
  assert.equal(getCatalog().length, CATALOG.length);
  assert.equal(getCatalog({ includeMacros: true }).length, EXTENDED_CATALOG.length);
  assert.equal(EXTENDED_CATALOG.length > CATALOG.length, true);
  assert.equal(RECIPE_COUNT, 10_000);
  assert.equal(VIRTUAL_BLOCK_COUNT, 10_000);
  assert.equal(DESIGN_AXES.fontPairings, 320);
  assert.equal(resolvePalette("p12").index, 12);
  assert.equal(resolveFontPair("f084").index, 84);
  assert.equal(getBlock("carousel")?.name, "carousel");
  assert.equal(getBlock("b203")?.name, "b203");
  assert.equal(getBlock("r0421")?.name, "r0421");
});

test("all site recipes resolve to unique deterministic tuples", () => {
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

test("virtual IDs resolve to canonical contracts and stable visual classes", () => {
  const button = resolveVirtualBlock("b203");
  const hero = resolveVirtualBlock("hr017");
  const frame = resolveVirtualBlock("fr999");
  assert.equal(button?.target, "button");
  assert.equal(button?.classes.includes("ab-v-b203"), true);
  assert.equal(button?.classSupported, true);
  assert.equal(hero?.target, "hero");
  assert.equal(hero?.classes.includes("ab-vf-hero"), true);
  assert.equal(hero?.classSupported, true);
  assert.equal(frame?.target, "panel");
});

test("compact attributes normalize independently after an earlier alias", () => {
  const normalized = normalizeCompactSource(`st "Compact"\n  pg "/" title="Compact"\n    hero\n      title "Build more with less" lvl=1\n      button "Start" h="/start"\n`);
  assert.equal(normalized.used, true);
  assert.match(normalized.source, /^site "Compact"/m);
  assert.match(normalized.source, /page "\/" title="Compact"/);
  assert.match(normalized.source, /title "Build more with less" level=1/);
  assert.match(normalized.source, /button "Start" href="\/start"/);
  assert.equal(normalized.features.aliases, true);
});

test("generation 2 compiles a small source into coordinated assets with exact metrics", async () => {
  const source = `st "Compact" r=r0421\n  pg "/" title="Compact"\n    hr017\n      ttl "Build more with less" lvl=1\n      txt "A complete interface from a small source file."\n      b203 "Start" h="/start"\n`;
  const result = await compile(source, { strict: true });
  const html = firstFile(result.files, ".html");
  const css = firstFile(result.files, "appblocks.css");
  const runtime = firstFile(result.files, "appblocks.js");
  const design = JSON.parse(result.files.get("appblocks.design.json"));
  const extendedCatalog = JSON.parse(result.files.get("appblocks.extended-catalog.json"));

  assert.match(html, /data-ab-engine="2"/);
  assert.match(html, /data-ab-recipe="r0421"/);
  assert.match(html, /ab-v-hr017/);
  assert.match(html, /ab-v-b203/);
  assert.match(css, /AppBlocks Web generation 2/);
  assert.match(css, /ab-motion-12\.is-ab-visible/);
  assert.match(runtime, /data-ab-carousel-ready/);
  assert.equal(design.axes.recipes, 10_000);
  assert.equal(design.virtualBlocks, 10_000);
  assert.equal(extendedCatalog.length, EXTENDED_CATALOG.length);
  assert.equal(result.capabilities.recipes, 10_000);

  const measured = [...result.files.values()].reduce((metrics, value) => {
    metrics.bytes += Buffer.byteLength(value);
    metrics.characters += value.length;
    return metrics;
  }, { bytes: 0, characters: 0 });
  const pair = findMetricPair(result.manifest);
  assert.ok(pair, "expected the legacy manifest to expose source/output metrics");
  assert.equal(pair.output.bytes, measured.bytes);
  const outputTokens = pair.output.estimatedTokens ?? pair.output.estimated_tokens ?? pair.output.tokens;
  if (outputTokens !== undefined) assert.equal(outputTokens, Math.ceil(measured.characters / 4));
});
