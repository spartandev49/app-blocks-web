import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  ELEMENT_LOOK_COUNT,
  MOTION5_ENGINE_VERSION,
  MOTION5_RECIPE_COUNT,
  TASTE_ENGINE_VERSION,
  TASTE_RECIPE_COUNT,
  VERSION,
  compile,
  formatDiagnostics
} from "../src/index.js";

const root = new URL("../", import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Taste Engine 5 ships as the coherent AppBlocks Web 0.4 release", async () => {
  const metadata = JSON.parse(await text("package.json"));
  assert.equal(VERSION, "0.4.0");
  assert.equal(metadata.version, VERSION);
  assert.equal(metadata.types, "./src/index-v5.d.ts");
  assert.equal(metadata.exports["./taste"].import, "./src/taste5.js");
  assert.equal(metadata.exports["./motion5"].import, "./src/motion5.js");
  assert(metadata.files.includes("LLMS-TASTE.txt"));
  assert(metadata.files.includes("THIRD_PARTY_NOTICES.md"));
  assert(metadata.files.includes(".agents"));
  assert.equal(TASTE_ENGINE_VERSION, 5);
  assert.equal(TASTE_RECIPE_COUNT, 10_000_000);
  assert.equal(ELEMENT_LOOK_COUNT, 1_000_000);
  assert.equal(MOTION5_ENGINE_VERSION, 5);
  assert.equal(MOTION5_RECIPE_COUNT, 100_000);
});

test("the public Taste showcase passes strict compilation and quality gates", async () => {
  const source = await text("examples/taste-showcase.ab");
  let result;
  try {
    result = await compile(source, { filename: "taste-showcase.ab", strict: true, tasteStrict: true });
  } catch (error) {
    const diagnostics = error?.diagnostics?.length ? `\n${formatDiagnostics(error.diagnostics, source)}` : "";
    assert.fail(`${error?.message ?? String(error)}${diagnostics}`);
  }
  assert.equal(result.taste.audit.score, 100);
  assert.equal(result.taste.audit.findings.length, 0);
  assert.equal(result.files.has("appblocks.taste.json"), true);
  assert.equal(result.files.has("appblocks.motion5.json"), true);
  assert.equal([...result.files.keys()].filter((name) => name.endsWith("index.html")).length, 3);
});

test("the release contains model training, design documentation and exact upstream attribution", async () => {
  const [compact, taste, authoring, notice, agent] = await Promise.all([
    text("LLMS-COMPACT.txt"),
    text("LLMS-TASTE.txt"),
    text("docs/AUTHORING_FOR_LLMS.md"),
    text("THIRD_PARTY_NOTICES.md"),
    text(".agents/skills/taste-skill/SKILL.md")
  ]);
  assert.match(compact, /t0000000-t9999999/);
  assert.match(compact, /e000000-e999999/);
  assert.match(taste, /DESIGN READ/i);
  assert.match(taste, /design variance/i);
  assert.match(taste, /real image/i);
  assert.match(authoring, /Taste/i);
  assert.match(notice, /Leonxlnx\/taste-skill/);
  assert.match(notice, /ccbc15639c97057cbfcf32ecebc38ef716e4bb37/);
  assert.match(agent, /Taste Engine 5/);
});
