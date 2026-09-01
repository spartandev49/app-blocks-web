import test from "node:test";
import assert from "node:assert/strict";
import { CATALOG, compactCatalog, getBlock, getCatalog } from "../src/index.js";

test("catalog names are unique and machine-readable", () => {
  const names = CATALOG.map((item) => item.name);
  assert.equal(new Set(names).size, names.length);
  assert(CATALOG.length >= 80);
  assert.equal(getBlock("hero").category, "marketing");
  assert(getCatalog({ category: "application" }).length >= 20);
  assert.doesNotThrow(() => JSON.stringify(compactCatalog()));
});

test("every catalog item has a useful model-facing summary", () => {
  for (const item of CATALOG) {
    assert.match(item.name, /^[a-z][a-z0-9-]*$/);
    assert(item.summary.length >= 20, `${item.name} summary is too short`);
    assert(Array.isArray(item.attributes));
    assert(Array.isArray(item.children));
  }
});
