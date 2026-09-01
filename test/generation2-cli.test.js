import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const node = process.execPath;
const cli = new URL("../bin/appblocks-v2.js", import.meta.url);

function run(args) {
  return spawnSync(node, [cli.pathname, ...args], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
}

test("generation 2 CLI resolves design, component and motion recipes", () => {
  const recipe = run(["recipe", "r7314"]);
  assert.equal(recipe.status, 0, recipe.stderr);
  assert.equal(JSON.parse(recipe.stdout).id, "r7314");

  const virtual = run(["virtual", "b203"]);
  assert.equal(virtual.status, 0, virtual.stderr);
  assert.equal(JSON.parse(virtual.stdout).id, "b203");

  const motion = run(["motion", "x731"]);
  assert.equal(motion.status, 0, motion.stderr);
  assert.equal(JSON.parse(motion.stdout).id, "x731");

  const preset = run(["motion", "cinematic", "hero"]);
  assert.equal(preset.status, 0, preset.stderr);
  assert.equal(JSON.parse(preset.stdout).id, "cinematic");
});

test("generation 2 CLI normalizes compact design and motion files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "appblocks-generation2-"));
  const filename = join(directory, "compact.ab");
  await writeFile(filename, `st "CLI" r=r0042 fx=cinematic\n  pg "/" title="CLI"\n    hr017 sx=depth cx=hero\n      ttl "CLI" lvl=1\n      b203 "Start" h="/start" hx=magnetic px=ripple\n`, "utf8");
  const normalized = run(["normalize", filename]);
  assert.equal(normalized.status, 0, normalized.stderr);
  assert.match(normalized.stdout, /^site "CLI"/m);
  assert.doesNotMatch(normalized.stdout, /\bfx=|\bsx=|\bcx=|\bhx=|\bpx=/);
  assert.match(normalized.stdout, /hero .*ab-v-hr017/);
  assert.match(normalized.stdout, /hero .*ab-scroll-depth/);
  const buttonLine = normalized.stdout.split("\n").find((line) => line.includes('button "Start"')) ?? "";
  assert.match(buttonLine, /href="\/start"/);
  assert.match(buttonLine, /ab-hover-magnetic/);
  assert.match(buttonLine, /ab-press-ripple/);
});

test("generation 2 CLI builds deployable base-path motion output", async () => {
  const directory = await mkdtemp(join(tmpdir(), "appblocks-generation2-build-"));
  const filename = join(directory, "compact.ab");
  const output = join(directory, "dist");
  await writeFile(filename, `st "CLI" r=r0042 fx=polished\n  pg "/" title="CLI"\n    hr017\n      ttl "CLI" lvl=1\n      b203 "Start" h="/start" hx=shine px=ripple\n`, "utf8");

  const built = run(["build", filename, "--out", output, "--base", "/product/", "--strict"]);
  assert.equal(built.status, 0, built.stderr);

  const html = await readFile(join(output, "index.html"), "utf8");
  const motion = JSON.parse(await readFile(join(output, "appblocks.motion.json"), "utf8"));
  assert.match(html, /href="\/product\/appblocks\.css"/);
  assert.match(html, /src="\/product\/appblocks\.js"/);
  assert.match(html, /href="\/product\/start"/);
  assert.match(html, /data-ab-motion-engine="3"/);
  assert.equal(motion.engine, 3);
  assert.equal(motion.profile, "polished");
});
