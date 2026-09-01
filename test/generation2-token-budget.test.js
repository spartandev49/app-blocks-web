import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCompactSource } from "../src/index.js";

test("compact virtual blocks materially reduce authored model output", () => {
  const compact = `st "Token demo" r=r7314\n  pg "/" title="Token demo"\n    hr017\n      ttl "Build more with less" lvl=1\n      txt "The model selects complete visual recipes with short identifiers."\n      b203 "Start" h="/start"\n`;
  const normalized = normalizeCompactSource(compact);
  assert.equal(normalized.used, true);
  assert.equal(normalized.source.length > compact.length, true);
  assert.equal(compact.length / normalized.source.length < 0.72, true);
  assert.match(normalized.source, /ab-shape-/);
  assert.match(normalized.source, /ab-surface-/);
  assert.match(normalized.source, /ab-motion-/);
  assert.match(normalized.source, /ab-density-/);
  assert.match(normalized.source, /ab-shadow-/);
});
