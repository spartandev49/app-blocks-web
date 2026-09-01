import test from "node:test";
import assert from "node:assert/strict";
import {
  CATALOG,
  DESIGN_COUNTS,
  FONT_PRESETS,
  PALETTES,
  RECIPE_COUNT,
  VIRTUAL_BLOCK_COUNT,
  VISUAL_SYSTEMS,
  compile,
  getBlock,
  normalizeSource,
  resolveRecipe
} from "../src/index.js";

test("the design registry exposes 10000 unique deterministic recipes", () => {
  assert.equal(RECIPE_COUNT, 10000);
  assert.equal(DESIGN_COUNTS.recipes, 10000);
  assert.equal(PALETTES.length, 32);
  assert.equal(FONT_PRESETS.length, 30);
  assert.equal(VISUAL_SYSTEMS.length, 18);
  assert(VIRTUAL_BLOCK_COUNT >= 20000);

  const signatures = new Set();
  const palettes = new Set();
  const fonts = new Set();
  const systems = new Set();
  for (let index = 0; index < RECIPE_COUNT; index += 1) {
    const recipe = resolveRecipe(index);
    signatures.add(recipe.signature);
    palettes.add(recipe.palette.name);
    fonts.add(recipe.font.name);
    systems.add(recipe.system);
  }
  assert.equal(signatures.size, RECIPE_COUNT);
  assert.equal(palettes.size, PALETTES.length);
  assert.equal(fonts.size, FONT_PRESETS.length);
  assert.equal(systems.size, VISUAL_SYSTEMS.length);
  assert.deepEqual(resolveRecipe("d0421"), resolveRecipe(421));
});

test("compact aliases and virtual blocks normalize to canonical AppBlocks", () => {
  const source = `st "Acme" r=d0421\n  pg "/" title="Acme"\n    h017\n      ti "A complete site from compact blocks" level=1\n      tx "The compiler owns responsive layout and interaction behavior."\n      b203 "Open workspace" hr=/app/\n    fr088\n      ti "One reusable frame" level=2\n      tx "The recipe and virtual IDs expand deterministically."\n`;
  const normalized = normalizeSource(source);
  assert.match(normalized, /^site "Acme"/m);
  assert.match(normalized, /page "\/"[^\n]*class="[^"]*ab-recipe-d0421/);
  assert.match(normalized, /hero[^\n]*abx-virtual-h017/);
  assert.match(normalized, /button "Open workspace"[^\n]*href=\/app\//);
  assert.match(normalized, /panel[^\n]*abx-virtual-fr088/);
  assert.doesNotMatch(normalized, /\br=d0421\b/);
});

test("compact source strictly compiles to styled interactive output", async () => {
  const source = `st "Acme" r=d0421\n  pg "/" title="Acme"\n    h017\n      ti "A complete site from compact blocks" level=1\n      tx "The compiler owns responsive layout and interaction behavior."\n      b203 "Open workspace" hr=/app/\n    fr088\n      ti "One reusable frame" level=2\n      tx "The recipe and virtual IDs expand deterministically."\n  pg "/app/" title="Workspace" layout=app\n    ap\n      tl\n        ti "Workspace" level=1\n      ms\n        mt value=24 label="Active records" progress=68\n`;
  const result = await compile(source, { filename: "compact.appblocks", strict: true });
  const home = result.files.get("index.html");
  assert.match(home, /ab-recipe-d0421/);
  assert.match(home, /ab-system-/);
  assert.match(home, /abx-virtual-h017/);
  assert.match(home, /abx-virtual-b203/);
  assert.match(result.files.get("appblocks.css"), /AppBlocks Web 0\.2 combinatorial design layer/);
  assert.match(result.files.get("appblocks.css"), /\.ab-recipe-d0421\{/);
  assert.match(result.files.get("appblocks.js"), /appblocks:design-ready/);
  assert.equal(result.manifest.source.bytes, Buffer.byteLength(source));
  assert.equal(result.manifest.design.primaryRecipe, "d0421");
  assert.deepEqual(result.manifest.pages.map((page) => page.route), ["/", "/app/"]);
  assert(result.manifest.output.expansionRatio >= 10);
});

test("advanced interaction blocks become safe canonical components", async () => {
  const source = `site "Interaction Lab" recipe=d0907\n  page "/" title="Interaction Lab"\n    title "Interaction Lab" level=1\n    carousel id=stories autoplay=2800\n      slide\n        title "First slide" level=2\n        text "A keyboard-operable generated carousel."\n      slide\n        title "Second slide" level=2\n        text "Autoplay pauses during focus and hover."\n    button "Open settings" action=drawer:settings\n    drawer id=settings\n      title "Settings" level=2\n      range name=scale label="Interface scale" min=80 max=120 value=100\n      file-drop name=assets label="Upload assets" multiple=true\n      button "Close" action=close-drawer\n    command-palette id=commands\n      search-box name=query label="Search commands"\n    counter value=12500 label="Generated combinations"\n`;
  const result = await compile(source, { strict: true });
  const html = result.files.get("index.html");
  assert.match(html, /abx-carousel/);
  assert.match(html, /abx-slide/);
  assert.match(html, /abx-opt-autoplay-2800/);
  assert.match(html, /abx-drawer/);
  assert.match(html, /abx-range/);
  assert.match(html, /type="range"/);
  assert.match(html, /abx-file-drop/);
  assert.match(html, /type="file"/);
  assert.match(html, /abx-command-palette/);
  assert.match(html, /abx-counter/);
  assert.match(result.files.get("appblocks.js"), /initCarousels/);
  assert.match(result.files.get("appblocks.js"), /initDrawers/);
  assert.match(result.files.get("appblocks.js"), /initCommandPalette/);
});

test("the catalog stays compact while documenting expanded capability", () => {
  assert(CATALOG.length >= 150, `expected at least 150 contracts, got ${CATALOG.length}`);
  assert.equal(getBlock("carousel").category, "marketing");
  assert.equal(getBlock("command-palette").category, "application");
  const virtual = getBlock("h731");
  assert.equal(virtual.canonical, "hero");
  assert.equal(virtual.preset, 731);
  assert.equal(virtual.kind, "virtual");
});
