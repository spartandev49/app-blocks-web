import test from "node:test";
import assert from "node:assert/strict";
import { AppBlocksError, parse } from "../src/index.js";

test("parses nested blocks, quoted text and typed values", () => {
  const ast = parse(`site "Atlas" theme=signal enabled=true scale=1.25\n  meta description="A precise site"\n  page "/" title="Home"\n    hero variant=split tags=[fast,safe,"model ready"]\n      title "Build once" level=1\n`);
  const site = ast.children[0];
  const page = site.children[1];
  const hero = page.children[0];
  assert.equal(site.args[0], "Atlas");
  assert.equal(site.attrs.enabled, true);
  assert.equal(site.attrs.scale, 1.25);
  assert.deepEqual(hero.attrs.tags, ["fast", "safe", "model ready"]);
  assert.equal(hero.children[0].loc.line, 5);
});

test("keeps equals and comments inside quoted content", () => {
  const ast = parse(`site "A=B # product"\n  page "/"\n    text "key=value # retained" # removed\n`);
  assert.equal(ast.children[0].args[0], "A=B # product");
  assert.equal(ast.children[0].children[0].children[0].args[0], "key=value # retained");
});

test("reports malformed indentation with a source location", () => {
  assert.throws(
    () => parse(`site "Atlas"\n   page "/"\n`),
    (error) => error instanceof AppBlocksError && error.diagnostics[0].line === 2 && /multiples of two/.test(error.diagnostics[0].message)
  );
});

test("reports unterminated strings", () => {
  assert.throws(
    () => parse(`site "Atlas\n`),
    (error) => error instanceof AppBlocksError && /Unterminated/.test(error.diagnostics[0].message)
  );
});
