import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const cli = new URL("../bin/appblocks-v2.js", import.meta.url);

function run(args) {
  return spawnSync(process.execPath, [cli.pathname, ...args], { cwd: root, encoding: "utf8" });
}

test("CLI inspects Taste DNA, element looks and Motion 5 recipes", () => {
  const taste = run(["taste", "t4839201"]);
  assert.equal(taste.status, 0, taste.stderr);
  assert.equal(JSON.parse(taste.stdout).id, "t4839201");

  const look = run(["look", "e731024"]);
  assert.equal(look.status, 0, look.stderr);
  assert.equal(JSON.parse(look.stdout).id, "e731024");

  const motion = run(["motion", "y73124"]);
  assert.equal(motion.status, 0, motion.stderr);
  assert.equal(JSON.parse(motion.stdout).id, "y73124");
});

test("CLI runs the strict Taste audit", () => {
  const result = run(["audit", "examples/taste-showcase.ab", "--strict", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.score, 100);
  assert.equal(report.passed, true);
});

test("CLI builds a base-path Taste site with all manifests", async () => {
  const output = await mkdtemp(join(tmpdir(), "appblocks-taste-"));
  try {
    const result = run(["build", "examples/taste-showcase.ab", "--out", output, "--base", "/taste/", "--strict", "--taste-strict"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Taste 100\/100/);
    const html = await readFile(join(output, "index.html"), "utf8");
    const taste = JSON.parse(await readFile(join(output, "appblocks.taste.json"), "utf8"));
    const motion = JSON.parse(await readFile(join(output, "appblocks.motion5.json"), "utf8"));
    assert.match(html, /href="\/taste\/appblocks\.css"/);
    assert.equal(taste.engine, 5);
    assert.equal(motion.engine, 5);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
