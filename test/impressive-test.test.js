import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compile } from "../src/index.js";

const root = new URL("../", import.meta.url);

test("the impressive AppBlocks test compiles into five complete animated routes", async () => {
  const source = await readFile(new URL("examples/impressive-test.ab", root), "utf8");
  const result = await compile(source, {
    filename: "impressive-test.ab",
    base: "/app-blocks-web/test/",
    strict: true
  });

  assert.equal(result.capabilities?.motionEngine, 3);
  assert.equal(result.manifest.pages.length, 5);
  assert.deepEqual(
    result.manifest.pages.map((page) => page.route),
    ["/", "/work/", "/method/", "/brief/", "/lab/"]
  );

  for (const file of ["index.html", "work/index.html", "method/index.html", "brief/index.html", "lab/index.html"]) {
    assert.equal(result.files.has(file), true, `missing ${file}`);
  }

  const home = result.files.get("index.html") ?? "";
  const lab = result.files.get("lab/index.html") ?? "";
  const css = result.files.get("appblocks.css") ?? "";
  const runtime = result.files.get("appblocks.js") ?? "";
  const motion = JSON.parse(result.files.get("appblocks.motion.json") ?? "{}");

  assert.match(home, /data-ab-motion-engine="3"/);
  assert.match(home, /href="\/app-blocks-web\/test\/work\/"/);
  assert.match(home, /ab-scroll-depth/);
  assert.match(home, /ab-scroll-parallax-y/);
  assert.match(home, /ab-hover-magnetic/);
  assert.match(home, /ab-press-ripple/);
  assert.match(home, /EIDOLON/);
  assert.match(lab, /EIDOLON command palette/);
  assert.match(lab, /Fictional spatial scenes/);

  assert.match(css, /ab-hover-magnetic/);
  assert.match(css, /ab-press-ripple/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(runtime, /requestAnimationFrame/);
  assert.match(runtime, /pointermove/);
  assert.doesNotMatch(runtime, /\beval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(runtime, /\.innerHTML\s*=|\.outerHTML\s*=|document\.write\s*\(/);

  assert.equal(motion.engine, 3);
  assert.equal(motion.profile, "cinematic");
  assert.equal(motion.usage.hover.includes("magnetic"), true);
  assert.equal(motion.usage.press.includes("ripple"), true);
  assert.equal(motion.usage.scroll.includes("depth"), true);
});
