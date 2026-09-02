import {
  CHOREOGRAPHIES,
  ENTER_MOTIONS,
  HOVER_MOTIONS,
  LOOP_MOTIONS,
  PRESS_MOTIONS,
  SCROLL_MOTIONS,
  TASTE_ROLES
} from "./taste5.js";

const freeze = (value) => Object.freeze(value);
const pad = (value, width) => String(value).padStart(width, "0");

export const MOTION5_ENGINE_VERSION = 5;
export const MOTION5_RECIPE_COUNT = 100_000;
export const MOTION5_DURATIONS = freeze(["instant", "quick", "fast", "normal", "slow", "cinematic"]);
export const MOTION5_EASINGS = freeze(["standard", "smooth", "snappy", "spring", "expo", "emphasized"]);
export const MOTION5_INTENSITIES = freeze(["subtle", "normal", "strong", "extreme"]);

function parseRecipe(value) {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value < MOTION5_RECIPE_COUNT) return value;
  const match = /^(?:y|m5)?(\d{1,5})$/i.exec(String(value ?? "").trim());
  if (!match) return null;
  const index = Number.parseInt(match[1], 10);
  return index >= 0 && index < MOTION5_RECIPE_COUNT ? index : null;
}

function pick(values, index, multiplier, offset = 0) {
  return values[(index * multiplier + offset) % values.length];
}

function mixedRadix(index, lengths) {
  let remainder = index;
  return lengths.map((length) => {
    const digit = remainder % length;
    remainder = Math.floor(remainder / length);
    return digit;
  });
}

export function resolveMotion5Recipe(value = "y00000") {
  const index = parseRecipe(value);
  if (index === null) return null;
  // 7,919 is coprime with 100,000, so this is a bijection over the address space.
  const permuted = (index * 7_919 + 12_347) % MOTION5_RECIPE_COUNT;
  const [enterIndex, scrollIndex, hoverIndex, pressIndex, repeatIndex] = mixedRadix(permuted, [
    ENTER_MOTIONS.length,
    SCROLL_MOTIONS.length,
    HOVER_MOTIONS.length,
    PRESS_MOTIONS.length,
    2
  ]);
  return freeze({
    id: `y${pad(index, 5)}`,
    index,
    kind: "motion5-recipe",
    enter: ENTER_MOTIONS[enterIndex],
    scroll: SCROLL_MOTIONS[scrollIndex],
    hover: HOVER_MOTIONS[hoverIndex],
    press: PRESS_MOTIONS[pressIndex],
    loop: pick(LOOP_MOTIONS, permuted, 19, 5),
    choreography: pick(CHOREOGRAPHIES, permuted, 23, 6),
    duration: pick(MOTION5_DURATIONS, permuted, 29, 1),
    easing: pick(MOTION5_EASINGS, permuted, 31, 2),
    intensity: pick(MOTION5_INTENSITIES, permuted, 37, 3),
    repeat: Boolean(repeatIndex)
  });
}

const ROLE_DEFAULTS = freeze({
  focal: freeze({ enter: "cinematic", scroll: "depth", hover: "none", press: "none", loop: "none", choreography: "hero" }),
  supporting: freeze({ enter: "rise", scroll: "reveal", hover: "soft-lift", press: "compress", loop: "none", choreography: "cascade" }),
  quiet: freeze({ enter: "fade", scroll: "none", hover: "quiet", press: "none", loop: "none", choreography: "none" }),
  utility: freeze({ enter: "fade", scroll: "none", hover: "focus", press: "depress", loop: "none", choreography: "none" }),
  evidence: freeze({ enter: "unmask", scroll: "image-scale", hover: "spotlight", press: "compress", loop: "none", choreography: "editorial" }),
  navigation: freeze({ enter: "fall", scroll: "none", hover: "underline", press: "push", loop: "none", choreography: "sequence" }),
  action: freeze({ enter: "soft-pop", scroll: "none", hover: "magnetic", press: "ripple", loop: "none", choreography: "none" }),
  artifact: freeze({ enter: "image-reveal", scroll: "parallax-y", hover: "image-zoom", press: "none", loop: "none", choreography: "none" }),
  data: freeze({ enter: "fade", scroll: "reveal", hover: "quiet", press: "depress", loop: "none", choreography: "list" }),
  narrative: freeze({ enter: "rise", scroll: "word-reveal", hover: "none", press: "none", loop: "none", choreography: "editorial" }),
  status: freeze({ enter: "soft-pop", scroll: "none", hover: "quiet", press: "compress", loop: "pulse", choreography: "none" }),
  auto: freeze({ enter: "rise", scroll: "reveal", hover: "soft-lift", press: "compress", loop: "none", choreography: "cascade" })
});

function normalize(value, values, fallback) {
  const text = String(value ?? "").trim().toLowerCase();
  return values.includes(text) ? text : fallback;
}

function durationForDial(dial, role) {
  if (dial <= 2) return "instant";
  if (role === "utility" || role === "navigation" || role === "data") return dial >= 8 ? "normal" : "fast";
  if (dial >= 9) return "cinematic";
  if (dial >= 6) return "slow";
  return "normal";
}

function intensityForDial(dial) {
  if (dial <= 3) return "subtle";
  if (dial <= 6) return "normal";
  if (dial <= 8) return "strong";
  return "extreme";
}

function scaleByDial(selection, dial, role) {
  const output = { ...selection };
  if (dial <= 2) {
    output.enter = "none";
    output.scroll = "none";
    output.loop = "none";
    output.choreography = "none";
    if (role !== "action" && role !== "utility" && role !== "navigation") output.hover = "none";
  } else if (dial <= 4) {
    output.scroll = ["reveal", "none"].includes(output.scroll) ? output.scroll : "reveal";
    output.loop = "none";
    output.choreography = ["none", "children", "list"].includes(output.choreography) ? output.choreography : "children";
    if (["magnetic", "tilt", "chroma", "elastic"].includes(output.hover)) output.hover = "soft-lift";
  } else if (dial <= 7) {
    if (["horizontal-pan", "sticky-stack", "counterflow", "section-wipe"].includes(output.scroll)) output.scroll = "parallax-y";
    if (["orbit", "scan", "marquee"].includes(output.loop)) output.loop = "none";
  }
  if (role === "utility" || role === "data") output.loop = "none";
  return output;
}

export function resolveTasteMotion(profile, blockName = "section", roleValue = "auto", explicit = {}) {
  const role = normalize(roleValue, TASTE_ROLES, "auto");
  const dial = Number(profile?.motionIntensity ?? 5);
  const base = ROLE_DEFAULTS[role] ?? ROLE_DEFAULTS.auto;
  const selection = scaleByDial({
    enter: normalize(explicit.enter, ENTER_MOTIONS, base.enter),
    scroll: normalize(explicit.scroll, SCROLL_MOTIONS, base.scroll),
    hover: normalize(explicit.hover, HOVER_MOTIONS, base.hover),
    press: normalize(explicit.press, PRESS_MOTIONS, base.press),
    loop: normalize(explicit.loop, LOOP_MOTIONS, base.loop),
    choreography: normalize(explicit.choreography, CHOREOGRAPHIES, base.choreography),
    duration: normalize(explicit.duration, MOTION5_DURATIONS, durationForDial(dial, role)),
    easing: normalize(explicit.easing, MOTION5_EASINGS, dial >= 7 ? "spring" : "smooth"),
    intensity: normalize(explicit.intensity, MOTION5_INTENSITIES, intensityForDial(dial)),
    repeat: Boolean(explicit.repeat)
  }, dial, role);
  return freeze({
    id: `auto-${String(blockName).toLowerCase()}-${role}`,
    kind: "motion5-selection",
    role,
    dial,
    ...selection
  });
}

export function motion5Classes(selection) {
  if (!selection) return [];
  const classes = ["ab-t5-motion"];
  for (const key of ["enter", "scroll", "hover", "press", "loop", "choreography", "duration", "easing", "intensity"]) {
    const value = selection[key];
    if (!value || value === "none") continue;
    const prefix = key === "choreography" ? "choreo" : key;
    classes.push(`ab-t5-${prefix}-${value}`);
  }
  if (selection.repeat) classes.push("ab-t5-repeat");
  return classes;
}

export function motion5Manifest(profile, usage = {}) {
  return {
    engine: MOTION5_ENGINE_VERSION,
    recipes: MOTION5_RECIPE_COUNT,
    strategy: "native-css-view-timelines-with-observer-fallback",
    scheduler: "single-active-set-animation-frame-loop",
    rawScrollListeners: false,
    reducedMotion: true,
    finePointerGuard: true,
    dial: profile.motionIntensity,
    vocabulary: {
      entrance: ENTER_MOTIONS,
      scroll: SCROLL_MOTIONS,
      hover: HOVER_MOTIONS,
      press: PRESS_MOTIONS,
      loop: LOOP_MOTIONS,
      choreography: CHOREOGRAPHIES
    },
    usage: {
      selections: usage.selections ?? 0,
      entrance: [...(usage.entrance ?? [])],
      scroll: [...(usage.scroll ?? [])],
      hover: [...(usage.hover ?? [])],
      press: [...(usage.press ?? [])],
      loop: [...(usage.loop ?? [])],
      choreography: [...(usage.choreography ?? [])]
    }
  };
}
