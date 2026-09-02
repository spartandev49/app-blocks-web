import test from "node:test";
import assert from "node:assert/strict";
import {
  CHOREOGRAPHIES,
  ENTER_MOTIONS,
  HOVER_MOTIONS,
  LOOP_MOTIONS,
  PRESS_MOTIONS,
  SCROLL_MOTIONS,
  resolveTasteProfile
} from "../src/taste5.js";
import {
  MOTION5_DURATIONS,
  MOTION5_EASINGS,
  MOTION5_ENGINE_VERSION,
  MOTION5_INTENSITIES,
  MOTION5_RECIPE_COUNT,
  motion5Classes,
  motion5Manifest,
  resolveMotion5Recipe,
  resolveTasteMotion
} from "../src/motion5.js";

test("Motion Engine 5 exposes a broad finite vocabulary", () => {
  assert.equal(MOTION5_ENGINE_VERSION, 5);
  assert.equal(MOTION5_RECIPE_COUNT, 100_000);
  assert(ENTER_MOTIONS.length >= 24);
  assert(SCROLL_MOTIONS.length >= 18);
  assert(HOVER_MOTIONS.length >= 20);
  assert(PRESS_MOTIONS.length >= 10);
  assert(LOOP_MOTIONS.length >= 15);
  assert(CHOREOGRAPHIES.length >= 12);
});

test("all one hundred thousand motion addresses have unique deterministic core tuples", () => {
  const signatures = new Set();
  const coverage = {
    enter: new Set(), scroll: new Set(), hover: new Set(), press: new Set(),
    loop: new Set(), choreography: new Set(), duration: new Set(), easing: new Set(), intensity: new Set(), repeat: new Set()
  };
  for (let index = 0; index < MOTION5_RECIPE_COUNT; index += 1) {
    const recipe = resolveMotion5Recipe(index);
    const signature = [recipe.enter, recipe.scroll, recipe.hover, recipe.press, recipe.repeat].join("|");
    assert(!signatures.has(signature), `collision at y${String(index).padStart(5, "0")}`);
    signatures.add(signature);
    for (const key of Object.keys(coverage)) coverage[key].add(String(recipe[key]));
  }
  assert.equal(signatures.size, MOTION5_RECIPE_COUNT);
  assert.equal(coverage.enter.size, ENTER_MOTIONS.length);
  assert.equal(coverage.scroll.size, SCROLL_MOTIONS.length);
  assert.equal(coverage.hover.size, HOVER_MOTIONS.length);
  assert.equal(coverage.press.size, PRESS_MOTIONS.length);
  assert.equal(coverage.loop.size, LOOP_MOTIONS.length);
  assert.equal(coverage.choreography.size, CHOREOGRAPHIES.length);
  assert.equal(coverage.duration.size, MOTION5_DURATIONS.length);
  assert.equal(coverage.easing.size, MOTION5_EASINGS.length);
  assert.equal(coverage.intensity.size, MOTION5_INTENSITIES.length);
  assert.equal(coverage.repeat.size, 2);
  assert.equal(resolveMotion5Recipe("y100000"), null);
});

test("motion intensity dials scale role-aware behavior instead of only labelling it", () => {
  const low = resolveTasteProfile({ taste: "t0000000", motionIntensity: 2 });
  const high = resolveTasteProfile({ taste: "t0000000", motionIntensity: 9 });
  const lowCard = resolveTasteMotion(low, "card", "supporting");
  const highCard = resolveTasteMotion(high, "card", "supporting");
  assert.equal(lowCard.enter, "none");
  assert.equal(lowCard.scroll, "none");
  assert.equal(lowCard.loop, "none");
  assert.notEqual(highCard.enter, "none");
  assert.equal(highCard.duration, "cinematic");
  assert.equal(highCard.intensity, "extreme");
  assert(motion5Classes(highCard).some((name) => name.startsWith("ab-t5-enter-")));
});

test("motion manifests describe the scheduler and accessibility path honestly", () => {
  const profile = resolveTasteProfile({ taste: "t0000000", motionIntensity: 8 });
  const manifest = motion5Manifest(profile, { selections: 3, scroll: new Set(["reveal"]), hover: new Set(["magnetic"]) });
  assert.equal(manifest.engine, 5);
  assert.equal(manifest.recipes, 100_000);
  assert.equal(manifest.rawScrollListeners, false);
  assert.equal(manifest.reducedMotion, true);
  assert.equal(manifest.finePointerGuard, true);
  assert.deepEqual(manifest.usage.scroll, ["reveal"]);
});
