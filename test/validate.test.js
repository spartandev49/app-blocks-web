import test from "node:test";
import assert from "node:assert/strict";
import { AppBlocksError, assertValid, compile, parse, validate } from "../src/index.js";

test("suggests the nearest known block", () => {
  const ast = parse(`site "Atlas"\n  page "/"\n    featre\n`);
  const diagnostics = validate(ast);
  assert.equal(diagnostics[0].message, "Unknown block 'featre'");
  assert.match(diagnostics[0].hint, /feature/);
});

test("rejects executable URL schemes", () => {
  const ast = parse(`site "Atlas"\n  page "/"\n    button "Run" href="javascript:alert(1)"\n`);
  assert.throws(() => assertValid(ast), AppBlocksError);
  assert.match(validate(ast)[0].message, /Unsafe href/);
});

test("requires visible form labels and image alternatives", () => {
  const ast = parse(`site "Atlas"\n  page "/"\n    form\n      field name=email\n    image src=/cover.png\n`);
  const messages = validate(ast).map((item) => item.message);
  assert(messages.includes("Field requires a persistent label"));
  assert(messages.includes("Image requires alt text"));
});

test("strict mode promotes unknown attributes to errors", () => {
  const ast = parse(`site "Atlas"\n  page "/"\n    hero mystery=true\n`);
  assert.equal(validate(ast)[0].severity, "warning");
  assert.equal(validate(ast, { strict: true })[0].severity, "error");
});

test("validates variants and built-in icon names", () => {
  const ast = parse(`site "Atlas"\n  page "/"\n    hero variant=sideways\n      title "Atlas" level=1\n      button "Run" icon=rocket\n`);
  const diagnostics = validate(ast);
  assert(diagnostics.some((item) => item.message === "Unknown 'hero' variant 'sideways'"));
  assert(diagnostics.some((item) => item.message === "Unknown icon 'rocket'"));
  assert(diagnostics.every((item) => item.severity === "warning"));
  assert.throws(() => assertValid(ast, { strict: true }), AppBlocksError);
});

test("IDs are unique per rendered page rather than across the project", () => {
  const valid = parse(`site "Atlas"\n  page "/"\n    section id=intro\n  page "/guide/"\n    section id=intro\n`);
  assert(!validate(valid).some((item) => item.message.includes("Duplicate id")));

  const invalid = parse(`site "Atlas"\n  page "/"\n    section id=intro\n    panel id=intro\n`);
  assert(validate(invalid).some((item) => item.message === "Duplicate id 'intro'"));
});

test("validates deployment origins and image-logo alternatives", () => {
  const ast = parse(`site "Atlas" origin=example.com\n  page "/"\n    logos\n      logo src=/atlas.svg\n`);
  const messages = validate(ast).map((item) => item.message);
  assert(messages.includes("Site origin must be an absolute HTTP(S) URL"));
  assert(messages.includes("Image logo requires alt text"));
});

test("enforces child contracts and one page heading", () => {
  const invalidChild = parse(`site "Atlas"\n  page "/"\n    hero\n      title "Atlas" level=1\n      table\n`);
  assert(validate(invalidChild).some((item) => item.message === "'table' is not allowed inside 'hero'"));

  const missingHeading = parse(`site "Atlas"\n  page "/"\n    text "No heading"\n`);
  assert(validate(missingHeading).some((item) => item.message.includes("requires exactly one level-1 title")));
});

test("distinguishes local actions from URL actions and allowlists URL schemes", () => {
  const localAction = parse(`site "Atlas"\n  page "/"\n    title "Atlas" level=1\n    button "Notify" action="toast:Saved"\n`);
  assert(!validate(localAction).some((item) => item.message.includes("URL scheme")));

  const unsafeForm = parse(`site "Atlas"\n  page "/"\n    title "Atlas" level=1\n    form action="file:///tmp/records"\n      field name=name label=Name\n`);
  assert(validate(unsafeForm).some((item) => item.message === "Unsafe action URL scheme"));
});

test("rejects unknown built-in style packs in strict mode", () => {
  const ast = parse(`site "Atlas" theme=neon\n  page "/"\n    title "Atlas" level=1\n`);
  assert.equal(validate(ast).find((item) => item.message === "Unknown theme 'neon'")?.severity, "warning");
  assert.throws(() => assertValid(ast, { strict: true }), AppBlocksError);
});

test("rejects unsafe site-level visual configuration", () => {
  const ast = parse(`site "Atlas" origin=https://example.com/path accent="red;display:none" motion=sometimes\n  page "/"\n    title "Atlas" level=1\n`);
  const messages = validate(ast).map((item) => item.message);
  assert(messages.includes("Site origin must be an absolute HTTP(S) URL"));
  assert(messages.includes("Site accent must be a six-digit hex color"));
  assert(messages.includes("Site motion must be true or false"));
});

test("escapes user content rather than rendering raw HTML", async () => {
  const source = `site "Atlas"\n  page "/"\n    hero\n      title "<script>alert('x')</script>" level=1\n`;
  const result = await compile(source);
  const html = result.files.get("index.html");
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
});
