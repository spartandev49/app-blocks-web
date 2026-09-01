import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  MOTION_ENGINE_VERSION,
  MOTION_RECIPE_COUNT,
  compile,
  formatDiagnostics,
  VERSION
} from "../src/index.js";

const root = new URL("../", import.meta.url);

async function packageMetadata() {
  return JSON.parse(await readFile(new URL("package.json", root), "utf8"));
}

async function compileFixture(name) {
  const source = await readFile(new URL(`examples/${name}`, root), "utf8");
  try {
    return await compile(source, { filename: name, strict: true });
  } catch (error) {
    const diagnostics = error?.diagnostics?.length ? `\n${formatDiagnostics(error.diagnostics, source)}` : "";
    assert.fail(`${error?.message ?? String(error)}${diagnostics}`);
  }
}

test("generation 2 and motion engine 3 ship as a coherent 0.3 package release", async () => {
  const metadata = await packageMetadata();
  assert.equal(VERSION, "0.3.0");
  assert.equal(metadata.version, VERSION);
  assert.equal(metadata.types, "./src/index-v3.d.ts");
  assert.equal(metadata.bin.appblocks, "./bin/appblocks.js");
  assert.equal(metadata.bin["appblocks-v2"], "./bin/appblocks-v2.js");
  assert.equal(metadata.exports["./generation2"], "./src/generation2.js");
  assert.equal(metadata.exports["./motion"].import, "./src/motion3.js");
  assert.equal(metadata.exports["./motion"].types, "./src/motion3.d.ts");
  assert.equal(metadata.scripts["build:motion"].includes("motion-showcase.ab"), true);
  assert(metadata.files.includes("LLMS-COMPACT.txt"));
  assert.equal(MOTION_ENGINE_VERSION, 3);
  assert.equal(MOTION_RECIPE_COUNT, 1_000);
});

test("the shipped generation-2 example passes strict compilation and runtime safety checks", async () => {
  const result = await compileFixture("generation2-showcase.ab");
  assert.equal(result.capabilities?.generation, 2);
  assert.equal(result.manifest.engine, VERSION);
  assert(result.files.has("appblocks.design.json"));
  assert(result.files.has("appblocks.extended-catalog.json"));
  assert(result.files.has("appblocks.motion.json"));

  const runtime = result.files.get("appblocks.js") ?? "";
  const css = result.files.get("appblocks.css") ?? "";
  assert.doesNotMatch(runtime, /\beval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(runtime, /\.innerHTML\s*=|\.outerHTML\s*=|document\.write\s*\(/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
});

test("the public motion showcase compiles with its complete motion manifest", async () => {
  const result = await compileFixture("motion-showcase.ab");
  const motion = JSON.parse(result.files.get("appblocks.motion.json"));
  const html = [...result.files.entries()].find(([name]) => name.endsWith("index.html"))?.[1] ?? "";
  const css = result.files.get("appblocks.css") ?? "";
  const runtime = result.files.get("appblocks.js") ?? "";

  assert.equal(result.capabilities?.motionEngine, 3);
  assert.equal(result.capabilities?.motionRecipes, 1_000);
  assert.equal(result.capabilities?.motionProfile, "cinematic");
  assert.equal(motion.engine, 3);
  assert.equal(motion.profile, "cinematic");
  assert.equal(motion.features.scrollLinked, true);
  assert.equal(motion.features.microinteractions, true);
  assert.equal(motion.features.choreography, true);
  assert.match(html, /data-ab-motion-profile="cinematic"/);
  assert.match(css, /AppBlocks Web motion engine 3/);
  assert.match(runtime, /pointermove/);
  assert.match(runtime, /requestAnimationFrame/);
});

test("compact model instructions include motion tokens and strict verification", async () => {
  const instructions = await readFile(new URL("LLMS-COMPACT.txt", root), "utf8");
  assert.match(instructions, /r0000-r9999/);
  assert.match(instructions, /x000-x999/);
  assert.match(instructions, /appblocks-v2 motion x731/);
  assert.match(instructions, /appblocks-v2 check file\.ab --strict/);
  assert.match(instructions, /Exactly one/);
});
