import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
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

test("generation 2 CLI resolves recipes and virtual blocks", () => {
  const recipe = run(["recipe", "r7314"]);
  assert.equal(recipe.status, 0, recipe.stderr);
  assert.equal(JSON.parse(recipe.stdout).id, "r7314");

  const virtual = run(["virtual", "b203"]);
  assert.equal(virtual.status, 0, virtual.stderr);
  assert.equal(JSON.parse(virtual.stdout).id, "b203");
});

test("generation 2 CLI normalizes compact files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "appblocks-generation2-"));
  const filename = join(directory, "compact.ab");
  await writeFile(filename, `st "CLI" r=r0042\n  pg "/" title="CLI"\n    hr017\n      ttl "CLI" lvl=1\n      b203 "Start" h="/start"\n`, "utf8");
  const normalized = run(["normalize", filename]);
  assert.equal(normalized.status, 0, normalized.stderr);
  assert.match(normalized.stdout, /^site "CLI"/m);
  assert.match(normalized.stdout, /hero .*ab-v-hr017/);
  assert.match(normalized.stdout, /button "Start" href="\/start"/);
});
