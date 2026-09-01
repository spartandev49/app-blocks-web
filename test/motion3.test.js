import test from "node:test";
import assert from "node:assert/strict";
import { compile as compileLegacy } from "../src/compiler.js";
import {
  CHOREOGRAPHIES,
  ENTER_EFFECTS,
  HOVER_EFFECTS,
  LOOP_EFFECTS,
  MOTION_ENGINE_VERSION,
  MOTION_PRESETS,
  MOTION_PROFILES,
  MOTION_RECIPE_COUNT,
  PRESS_EFFECTS,
  SCROLL_EFFECTS,
  compile,
  normalizeMotionSource,
  normalizeSource,
  resolveMotion,
  resolveMotionRecipe
} from "../src/index.js";

function firstFile(files, suffix) {
  const name = [...files.keys()].find((candidate) => candidate.endsWith(suffix));
  return name ? files.get(name) : undefined;
}

function signature(recipe) {
  return [
    recipe.enter,
    recipe.scroll,
    recipe.hover,
    recipe.press,
    recipe.loop,
    recipe.choreography,
    recipe.ease,
    recipe.duration,
    recipe.delay,
    recipe.stagger,
    recipe.origin,
    recipe.intensity,
    recipe.repeat
  ].join(":");
}

test("motion engine exposes a broad finite allowlisted vocabulary", () => {
  assert.equal(MOTION_ENGINE_VERSION, 3);
  assert.equal(MOTION_RECIPE_COUNT, 1_000);
  assert.equal(MOTION_PROFILES.length, 10);
  assert.equal(ENTER_EFFECTS.length >= 20, true);
  assert.equal(SCROLL_EFFECTS.length >= 14, true);
  assert.equal(HOVER_EFFECTS.length >= 16, true);
  assert.equal(PRESS_EFFECTS.length >= 8, true);
  assert.equal(LOOP_EFFECTS.length >= 12, true);
  assert.equal(CHOREOGRAPHIES.length >= 9, true);
  assert.ok(MOTION_PRESETS.cinematic);
  assert.ok(MOTION_PRESETS.button);
});

test("all 1,000 motion recipes resolve deterministically to unique signatures", () => {
  const signatures = new Set();
  for (let index = 0; index < MOTION_RECIPE_COUNT; index += 1) {
    const id = `x${String(index).padStart(3, "0")}`;
    const recipe = resolveMotionRecipe(id);
    assert.ok(recipe, id);
    assert.equal(recipe.id, id);
    assert.equal(recipe.index, index);
    assert.ok(ENTER_EFFECTS.includes(recipe.enter));
    assert.ok(SCROLL_EFFECTS.includes(recipe.scroll));
    assert.ok(HOVER_EFFECTS.includes(recipe.hover));
    assert.ok(PRESS_EFFECTS.includes(recipe.press));
    assert.ok(LOOP_EFFECTS.includes(recipe.loop));
    assert.ok(CHOREOGRAPHIES.includes(recipe.choreography));
    signatures.add(signature(recipe));
  }
  assert.equal(signatures.size, MOTION_RECIPE_COUNT);
  assert.deepEqual(resolveMotionRecipe("x731"), resolveMotionRecipe("x731"));
  assert.equal(resolveMotionRecipe("x1000"), null);
});

test("global profiles choreograph canonical blocks and explicit tokens override them", () => {
  const source = `site "Motion" fx=cinematic\n  page "/" title="Motion"\n    hero\n      title "Motion system" level=1\n      text "A compact global profile supplies coordinated choreography."\n      button "Launch" href="/start" fx="button hx:magnetic px:ripple"\n    section sx=parallax-y en=clip-up cx=cascade du=slow ix=strong\n      title "Scroll-linked" level=2\n      text "One line selects entrance, scroll and child timing."\n`;
  const normalized = normalizeMotionSource(source);
  assert.equal(normalized.used, true);
  assert.equal(normalized.profile, "cinematic");
  assert.equal(normalized.features.profileAuto, true);
  assert.equal(normalized.features.explicit, true);
  assert.equal(normalized.features.scrollLinked, true);
  assert.equal(normalized.features.microinteractions, true);
  assert.equal(normalized.features.choreography, true);
  assert.doesNotMatch(normalized.source, /\b(?:fx|sx|en|cx|du|ix|hx|px)=/);
  assert.match(normalized.source, /hero class="[^"]*ab-enter-clip-up/);
  assert.match(normalized.source, /button "Launch" href="\/start" class="[^"]*ab-hover-magnetic[^"]*ab-press-ripple/);
  assert.match(normalized.source, /section class="[^"]*ab-enter-clip-up[^"]*ab-scroll-parallax-y[^"]*ab-choreo-cascade/);
});

test("virtual block IDs receive deterministic motion without additional authored tokens", () => {
  const source = `st "Virtual motion" r=r0421\n  pg "/" title="Virtual motion"\n    hr017\n      ttl "Animated by address" lvl=1\n      txt "Virtual IDs select visual and motion behavior."\n      b203 "Start" h="/start"\n`;
  const normalized = normalizeSource(source);
  assert.equal(normalized.compactUsed, true);
  assert.equal(normalized.motionUsed, true);
  assert.equal(normalized.motion.features.virtualAuto, true);
  assert.match(normalized.source, /ab-v-hr017/);
  assert.match(normalized.source, /ab-v-b203/);
  assert.match(normalized.source, /ab-m3/);
  assert.match(normalized.source, /ab-hover-/);
  assert.match(normalized.source, /ab-press-/);
});

test("motion-only canonical source compiles without loading generation-2 design CSS", async () => {
  const source = `site "Motion only" fx=polished\n  page "/" title="Motion only"\n    hero\n      title "Motion without compact syntax" level=1\n      text "Canonical source can opt into the motion engine."\n      button "Continue" href="/continue" hx=shine px=ripple\n`;
  const result = await compile(source, { strict: true });
  const html = firstFile(result.files, ".html");
  const css = firstFile(result.files, "appblocks.css");
  const runtime = firstFile(result.files, "appblocks.js");
  const manifest = JSON.parse(result.files.get("appblocks.motion.json"));

  assert.equal(result.capabilities?.generation, 2);
  assert.equal(result.capabilities?.compactSyntax, false);
  assert.equal(result.capabilities?.motionEngine, 3);
  assert.equal(result.capabilities?.motionRecipes, 1_000);
  assert.equal(result.capabilities?.motionProfile, "polished");
  assert.match(html, /data-ab-motion-engine="3"/);
  assert.match(html, /data-ab-motion-profile="polished"/);
  assert.match(css, /AppBlocks Web motion engine 3/);
  assert.doesNotMatch(css, /AppBlocks Web generation 2/);
  assert.match(runtime, /IntersectionObserver/);
  assert.match(runtime, /requestAnimationFrame/);
  assert.equal(manifest.engine, 3);
  assert.equal(manifest.recipeCount, 1_000);
  assert.equal(manifest.profile, "polished");
});

test("combined compact and motion source emits safe responsive motion assets", async () => {
  const source = `st "Kinetic" r=r7314 fx=dynamic\n  pg "/" title="Kinetic"\n    hr017 fx="hero sx:depth"\n      ttl "Motion in a handful of tokens" lvl=1\n      txt "Entrance, scroll choreography and microinteractions expand at compile time."\n      b203 "Try it" h="/start" hx=magnetic px=ripple\n    sc247 sx=parallax-y cx=grid\n      ttl "A motion vocabulary" lvl=2\n      gr v=three cx=wave\n        cd014 hx=tilt en=rise\n          ttl "Scroll" lvl=3\n          txt "Viewport progress drives transforms through one animation-frame loop."\n        cd375 hx=spotlight en=scale-up\n          ttl "Hover" lvl=3\n          txt "Pointer effects stay finite and dependency-free."\n        cd728 hx=shine en=fade\n          ttl "Press" lvl=3\n          txt "Buttons can ripple, compress, push, bounce or pulse."\n`;
  const result = await compile(source, { strict: true });
  const html = firstFile(result.files, ".html");
  const css = firstFile(result.files, "appblocks.css");
  const runtime = firstFile(result.files, "appblocks.js");
  const manifest = JSON.parse(result.files.get("appblocks.motion.json"));

  assert.equal(result.capabilities?.compactSyntax, true);
  assert.equal(result.capabilities?.motionEngine, 3);
  assert.equal(result.capabilities?.features.scrollLinked, true);
  assert.equal(result.capabilities?.features.microinteractions, true);
  assert.match(html, /ab-scroll-depth/);
  assert.match(html, /ab-hover-magnetic/);
  assert.match(html, /ab-press-ripple/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /ab-hover-magnetic/);
  assert.match(css, /ab-m3-ripple/);
  assert.match(runtime, /pointermove/);
  assert.match(runtime, /animationend/);
  assert.doesNotMatch(runtime, /\beval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(runtime, /\.innerHTML\s*=|\.outerHTML\s*=|document\.write\s*\(/);
  assert.equal(manifest.usage.hover.includes("magnetic"), true);
  assert.equal(manifest.usage.press.includes("ripple"), true);
});

test("invalid motion tokens remain visible to strict validation", async () => {
  const source = `site "Invalid motion"\n  page "/" title="Invalid motion"\n    hero fx=teleport\n      title "Invalid" level=1\n`;
  await assert.rejects(() => compile(source, { strict: true }), /teleport|fx|Unknown|attribute/i);
});

test("canonical generation-1 source remains byte-for-byte isolated from motion engine 3", async () => {
  const source = `site "Legacy motion isolation"\n  page "/" title="Legacy motion isolation"\n    hero\n      title "No opt-in" level=1\n      text "This remains on the original compiler path."\n`;
  const legacy = await compileLegacy(source, { strict: true });
  const current = await compile(source, { strict: true });
  assert.deepEqual([...current.files.entries()], [...legacy.files.entries()]);
  assert.deepEqual(current.manifest, legacy.manifest);
  assert.equal(current.capabilities, undefined);
  assert.equal(current.files.has("appblocks.motion.json"), false);
});

test("named presets resolve into block-aware defaults", () => {
  const button = resolveMotion("auto", "button");
  const hero = resolveMotion("auto", "hero");
  const cinematic = resolveMotion("cinematic", "section");
  assert.equal(button?.hover, "shine");
  assert.equal(button?.press, "ripple");
  assert.equal(hero?.choreography, "hero");
  assert.equal(cinematic?.scroll, "depth");
});
