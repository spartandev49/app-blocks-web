import test from "node:test";
import assert from "node:assert/strict";
import { compile as compileV3 } from "../src/compiler-v3.js";
import {
  BLOCK_LAYOUTS,
  CATALOG,
  CHOREOGRAPHIES as MOTION3_CHOREOGRAPHIES,
  ELEMENT_LOOK_COUNT,
  FOOTER_ARCHITECTURES,
  HERO_ARCHITECTURES,
  NAV_ARCHITECTURES,
  TASTE_AXES,
  TASTE_ENGINE_VERSION,
  TASTE_MINIMUM_SCORE,
  TASTE_PALETTES,
  TASTE_RECIPE_COUNT,
  auditTasteSource,
  buildTasteCss,
  compile,
  defaultTasteForBlock,
  normalizeSource,
  normalizeTasteSource,
  resolveElementLook,
  resolveTasteDNA,
  resolveTasteProfile
} from "../src/index.js";
import {
  ASSET_TREATMENTS,
  CHOREOGRAPHIES,
  ENTER_MOTIONS,
  HOVER_MOTIONS,
  LOOP_MOTIONS,
  MACROSTRUCTURES,
  PRESS_MOTIONS,
  SCROLL_MOTIONS,
  SECTION_RHYTHMS,
  SURFACE_LANGUAGES,
  TASTE_ROLES,
  TYPE_VOICES
} from "../src/taste5.js";

const tasteSource = `st "Test" ts=t4839201 pk=application gn=technical dv=7 mi=6 vd=5
  pg "/" title="Test"
    sec tl=asymmetric-split te=rise tsc=reveal
      ttl "A complete interface" lvl=1 tty=display
      txt "Real content rendered through deterministic visual decisions."
      b203 "Continue" act="toast:Continued" th=magnetic tp=ripple
    sec tl=ledger tsf=paper tr=data
      ttl "Operational detail" lvl=2
      txt "A second composition proves the source is not one repeated card pattern."
`;

function mapEntries(map) {
  return [...map.entries()].sort(([left], [right]) => left.localeCompare(right));
}

test("Taste Engine exposes ten million deterministic visual DNAs", () => {
  assert.equal(TASTE_ENGINE_VERSION, 5);
  assert.equal(TASTE_RECIPE_COUNT, 10_000_000);
  assert(TASTE_AXES.coreAddressSpace >= TASTE_RECIPE_COUNT);
  assert.equal(resolveTasteDNA("t0000000").id, "t0000000");
  assert.equal(resolveTasteDNA("t9999999").id, "t9999999");
  assert.equal(resolveTasteDNA("t10000000"), null);
  assert.equal(resolveTasteDNA("garbage"), null);

  const indexes = [0, 1, 19, 20, 399, 400, 17_291, 999_999, 4_839_201, 9_999_999];
  const signatures = indexes.map((index) => resolveTasteDNA(index).coreSignature);
  assert.equal(new Set(signatures).size, signatures.length);
  for (const index of indexes) assert.deepEqual(resolveTasteDNA(index), resolveTasteDNA(index));
});

test("all palette accents ship a computed WCAG AA foreground", () => {
  assert.equal(TASTE_PALETTES.length, 48);
  for (const palette of TASTE_PALETTES) {
    assert(palette.light.accentContrast >= 4.5, `${palette.id} light contrast ${palette.light.accentContrast}`);
    assert(palette.dark.accentContrast >= 4.5, `${palette.id} dark contrast ${palette.dark.accentContrast}`);
    assert.notEqual(palette.light.accentInk, palette.light.accent);
    assert.notEqual(palette.dark.accentInk, palette.dark.accent);
  }
});

test("one million element look addresses resolve without collapsing the bounds", () => {
  assert.equal(ELEMENT_LOOK_COUNT, 1_000_000);
  assert.equal(resolveElementLook("e000000").id, "e000000");
  assert.equal(resolveElementLook("lk999999").id, "e999999");
  assert.equal(resolveElementLook("e1000000"), null);
  const indexes = Array.from({ length: 10_000 }, (_, index) => index * 97);
  const signatures = indexes.map((index) => {
    const look = resolveElementLook(index);
    return [look.shape.index, look.border.index, look.shadow.index, look.surface.index, look.density.index, look.tone.index].join(":");
  });
  assert.equal(new Set(signatures).size, signatures.length);
});

test("every canonical AppBlocks block receives a role, layout, surface, type and look", () => {
  const profile = resolveTasteProfile({ taste: "t4839201", pageKind: "application", variance: 8, motionIntensity: 7, visualDensity: 4 });
  for (const block of CATALOG) {
    const resolved = defaultTasteForBlock(profile, block.name, 17);
    assert(TASTE_ROLES.includes(resolved.role), `${block.name} role`);
    assert(resolved.layout, `${block.name} layout`);
    assert(SURFACE_LANGUAGES.includes(resolved.surface), `${block.name} surface`);
    assert(TYPE_VOICES.includes(resolved.type), `${block.name} type`);
    assert(resolved.look?.id?.startsWith("e"), `${block.name} look`);
  }
});

test("Taste normalization strips model tokens and expands finite visual and motion classes", () => {
  const taste = normalizeTasteSource(tasteSource);
  assert.equal(taste.used, true);
  assert.equal(taste.profile.dna.id, "t4839201");
  assert.equal(taste.diagnostics.length, 0);
  assert.equal(taste.audit.score, 100);
  assert.doesNotMatch(taste.source, /\b(?:ts|pk|gn|dv|mi|vd|tl|tsf|tr|tty|te|tsc|th|tp)=/);
  assert.match(taste.source, /ab-t5-block-section/);
  assert.match(taste.source, /ab-t5-layout-asymmetric-split/);
  assert.match(taste.source, /ab-t5-hover-magnetic/);
  assert.match(taste.source, /ab-t5-press-ripple/);

  const combined = normalizeSource(tasteSource);
  assert.equal(combined.tasteUsed, true);
  assert.equal(combined.features.taste, true);
  assert.equal(combined.features.motion5, true);
  assert.match(combined.source, /^site /m);
});

test("invalid Taste values stay visible as source-located diagnostics", () => {
  const result = normalizeTasteSource(`st "Bad" ts=t99999999 dv=17\n  pg "/" title="Bad"\n    sec tl=banana tsf=plasma\n      ttl "Bad" lvl=1\n`);
  assert(result.diagnostics.length >= 4);
  assert(result.diagnostics.some((item) => /Unknown Taste DNA/.test(item.message)));
  assert(result.diagnostics.some((item) => /design variance/.test(item.message)));
  assert(result.diagnostics.some((item) => /Unknown Taste layout/.test(item.message)));
  assert(result.diagnostics.some((item) => /Unknown Taste surface/.test(item.message)));
});

test("every declared architecture and motion token has generated CSS", () => {
  const css = buildTasteCss(resolveTasteProfile({ taste: "t4839201" }));
  const checks = [
    [HERO_ARCHITECTURES, "ab-t5-hero-"],
    [NAV_ARCHITECTURES, "ab-t5-nav-"],
    [FOOTER_ARCHITECTURES, "ab-t5-footer-"],
    [[...new Set([...BLOCK_LAYOUTS, ...MACROSTRUCTURES, ...SECTION_RHYTHMS, ...ASSET_TREATMENTS])], "ab-t5-layout-"],
    [ENTER_MOTIONS.filter((value) => value !== "none"), "ab-t5-enter-"],
    [SCROLL_MOTIONS.filter((value) => value !== "none"), "ab-t5-scroll-"],
    [HOVER_MOTIONS.filter((value) => value !== "none"), "ab-t5-hover-"],
    [PRESS_MOTIONS.filter((value) => value !== "none"), "ab-t5-press-"],
    [LOOP_MOTIONS.filter((value) => value !== "none"), "ab-t5-loop-"],
    [CHOREOGRAPHIES.filter((value) => value !== "none"), "ab-t5-choreo-"]
  ];
  for (const [values, prefix] of checks) {
    for (const value of values) assert(css.includes(`.${prefix}${value}`), `${prefix}${value}`);
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /min-height:100dvh/);
  assert.doesNotMatch(css, /transition\s*:\s*all\b/i);
  assert.equal(MOTION3_CHOREOGRAPHIES.includes("hero"), true);
});

test("Taste compilation emits deployable manifests, markers and safe runtime", async () => {
  const result = await compile(tasteSource, { filename: "taste-test.ab", strict: true, tasteStrict: true });
  assert.equal(result.capabilities.tasteEngine, 5);
  assert.equal(result.capabilities.tasteRecipes, 10_000_000);
  assert.equal(result.capabilities.elementLooks, 1_000_000);
  assert.equal(result.capabilities.motionEngine, 5);
  assert.equal(result.taste.audit.score, 100);
  assert(result.files.has("appblocks.taste.json"));
  assert(result.files.has("appblocks.motion5.json"));
  const html = [...result.files.entries()].find(([name]) => name.endsWith("index.html"))?.[1] ?? "";
  const css = result.files.get("appblocks.css") ?? "";
  const runtime = result.files.get("appblocks.js") ?? "";
  assert.match(html, /data-ab-taste-engine="5"/);
  assert.match(html, /data-ab-taste-score="100"/);
  assert.match(html, /fonts\.googleapis\.com/);
  assert.match(css, /AppBlocks Web Taste Engine 5/);
  assert.match(runtime, /single|requestAnimationFrame/);
  assert.doesNotMatch(runtime, /addEventListener\(\s*["']scroll["']/);
  assert.doesNotMatch(runtime, /\beval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(runtime, /\.innerHTML\s*=|\.outerHTML\s*=|document\.write\s*\(/);
});

test("Taste quality gate rejects generic authored structure", async () => {
  const generic = `st "Generic" ts=t0000000 pk=saas dv=8 mi=7 vd=4\n  pg "/" title="Generic"\n    hero variant=centered\n      eyebrow "SECTION 01"\n      ttl "Unlock the power of seamless next-gen workflows for your entire organization today" lvl=1\n      txt "Elevate your business with a revolutionary game-changer that changes everything for modern teams everywhere in the world."\n    features v=grid\n      feat\n        hdn "One"\n      feat\n        hdn "Two"\n      feat\n        hdn "Three"\n`;
  const report = auditTasteSource(generic, { taste: "t0000000", pageKind: "saas", variance: 8, motionIntensity: 7, visualDensity: 4 });
  assert(report.score < TASTE_MINIMUM_SCORE);
  await assert.rejects(() => compile(generic, { strict: true, tasteStrict: true }), /Taste quality gate failed/);
});

test("canonical non-Taste source remains byte-for-byte on the Generation 3 path", async () => {
  const source = `site "Legacy"\n  page "/" title="Legacy"\n    hero variant=split\n      title "Legacy source" level=1\n      text "No Taste tokens are present."\n`;
  const [legacy, current] = await Promise.all([
    compileV3(source, { filename: "legacy.appblocks", strict: true }),
    compile(source, { filename: "legacy.appblocks", strict: true })
  ]);
  assert.deepEqual(mapEntries(current.files), mapEntries(legacy.files));
  assert.deepEqual(current.manifest, legacy.manifest);
  assert.equal(current.capabilities?.tasteEngine, undefined);
});
