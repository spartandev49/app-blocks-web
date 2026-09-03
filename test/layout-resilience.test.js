import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTasteCss,
  compile,
  isLayoutCompatible,
  layoutsForBlock,
  normalizeTasteSource,
  resolveTasteProfile
} from "../src/index.js";

test("layout compatibility prevents page-scale layouts on narrow leaf containers", () => {
  assert.equal(isLayoutCompatible("grid", "technical-grid"), true);
  assert.equal(isLayoutCompatible("panel", "ledger"), false);
  assert.equal(isLayoutCompatible("panel", "dense-cockpit"), false);
  assert.equal(isLayoutCompatible("stack", "technical-grid"), false);
  assert(layoutsForBlock("panel").includes("quiet-column"));
});

test("incompatible emitted layouts produce source-located diagnostics and no dangerous class", () => {
  const source = `st "Unsafe" ts=t4839201 pk=application dv=7 mi=4 vd=5
  pg "/" title="Unsafe"
    pnl tl=ledger
      ttl "Safe fallback" lvl=1
`;
  const normalized = normalizeTasteSource(source);
  assert.equal(normalized.diagnostics.length, 1);
  assert.match(normalized.diagnostics[0].message, /not compatible with panel/);
  assert.doesNotMatch(normalized.source, /ab-t5-layout-ledger/);
});

test("strict compilation rejects an incompatible structural layout", async () => {
  const source = `st "Unsafe" ts=t4839201 pk=application dv=7 mi=4 vd=5
  pg "/" title="Unsafe"
    pnl tl=ledger
      ttl "Safe fallback" lvl=1
`;
  await assert.rejects(() => compile(source, { strict: true }), (error) => {
    assert.match(error?.message ?? "", /Taste normalization failed/);
    assert.match(error?.diagnostics?.[0]?.message ?? "", /not compatible with panel/);
    return true;
  });
});

test("generated Taste CSS contains intrinsic layout safety contracts", () => {
  const css = buildTasteCss(resolveTasteProfile({ taste: "t4839201" }));
  assert.match(css, /AppBlocks 0\.4\.1 intrinsic layout and typography safety/);
  assert.match(css, /white-space:nowrap!important/);
  assert.match(css, /grid-template-columns:repeat\(auto-fit,minmax\(min\(100%,17rem\),1fr\)\)!important/);
  assert.match(css, /\.ab-main>:/);
  assert.match(css, /\.ab-sidebar\{[\s\S]*position:relative!important/);
  const safety = css.slice(css.indexOf("AppBlocks 0.4.1 intrinsic layout"));
  assert.doesNotMatch(safety, /:where\(h1,h2,h3,h4[^}]+overflow-wrap:anywhere/);
});
