import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compile, VERSION } from "../src/index.js";

const root = new URL("../", import.meta.url);

async function packageMetadata() {
  return JSON.parse(await readFile(new URL("package.json", root), "utf8"));
}

test("generation 2 is exposed as a coherent 0.2 package release", async () => {
  const metadata = await packageMetadata();
  assert.equal(VERSION, "0.2.0");
  assert.equal(metadata.version, VERSION);
  assert.equal(metadata.bin.appblocks, "./bin/appblocks.js");
  assert.equal(metadata.bin["appblocks-v2"], "./bin/appblocks-v2.js");
  assert.equal(metadata.exports["./generation2"], "./src/generation2.js");
  assert(metadata.files.includes("LLMS-COMPACT.txt"));
});

test("the shipped compact example passes strict compilation and runtime safety checks", async () => {
  const source = await readFile(new URL("examples/generation2-showcase.ab", root), "utf8");
  const result = await compile(source, { filename: "generation2-showcase.ab", strict: true });
  assert.equal(result.capabilities?.generation, 2);
  assert.equal(result.manifest.engine, VERSION);
  assert(result.files.has("appblocks.design.json"));
  assert(result.files.has("appblocks.extended-catalog.json"));

  const runtime = result.files.get("appblocks.js") ?? "";
  const css = result.files.get("appblocks.css") ?? "";
  assert.doesNotMatch(runtime, /\beval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(runtime, /\.innerHTML\s*=|\.outerHTML\s*=|document\.write\s*\(/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
});

test("compact model instructions are included and reference strict verification", async () => {
  const instructions = await readFile(new URL("LLMS-COMPACT.txt", root), "utf8");
  assert.match(instructions, /r0000-r9999/);
  assert.match(instructions, /appblocks-v2 check file\.ab --strict/);
  assert.match(instructions, /Exactly one/);
});
