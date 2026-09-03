#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildTasteCss,
  compile,
  isLayoutCompatible,
  normalizeTasteSource,
  resolveTasteProfile
} from "../src/index.js";

const source = await readFile(new URL("../examples/taste-showcase.ab", import.meta.url), "utf8");
const result = await compile(source, {
  filename: "taste-showcase.ab",
  strict: true,
  tasteStrict: true
});
const css = result.files.get("appblocks.css") ?? buildTasteCss(resolveTasteProfile({ taste: "t4839201" }));
const runtime = result.files.get("appblocks.js") ?? "";

assert.equal(isLayoutCompatible("grid", "technical-grid"), true);
assert.equal(isLayoutCompatible("panel", "technical-grid"), false);
assert.equal(isLayoutCompatible("panel", "ledger"), false);
assert.equal(isLayoutCompatible("stack", "dense-cockpit"), false);

const unsafe = `st "Unsafe" ts=t4839201 pk=application dv=7 mi=4 vd=5
  pg "/" title="Unsafe"
    pnl tl=ledger
      ttl "Unsafe panel" lvl=1
`;
const normalized = normalizeTasteSource(unsafe);
assert.match(normalized.diagnostics[0]?.message ?? "", /not compatible with panel/);
assert.doesNotMatch(normalized.source, /ab-t5-layout-ledger/);

assert.match(css, /AppBlocks 0\.4\.1 intrinsic layout and typography safety/);
assert.match(css, /\.ab-main>:where\(/);
assert.match(css, /white-space:nowrap!important/);
assert.match(css, /\.ab-sidebar\{[\s\S]*position:relative!important/);
assert.match(css, /\.ab-table-card\{overflow-x:auto!important/);
assert.doesNotMatch(css, /var\(--t5-local-pad,inherit\)/);
assert.match(runtime, /classList\.add\("is-ab-visible"\)/);

console.log("Layout contract audit passed: intrinsic tracks, safe typography, compatible structural layouts, mobile application chrome, and legacy-motion neutralization are present.");
