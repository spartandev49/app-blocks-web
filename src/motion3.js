import { getBlock } from "./generation2.js";

const freeze = (value) => Object.freeze(value);
const unique = (values) => [...new Set(values.filter(Boolean))];
const pad = (value, width = 3) => String(value).padStart(width, "0");

export const MOTION_ENGINE_VERSION = 3;
export const MOTION_RECIPE_COUNT = 1_000;

export const MOTION_PROFILES = freeze([
  "off",
  "quiet",
  "polished",
  "dynamic",
  "cinematic",
  "playful",
  "editorial",
  "application",
  "commerce",
  "dramatic"
]);

export const ENTER_EFFECTS = freeze([
  "none",
  "fade",
  "rise",
  "fall",
  "slide-left",
  "slide-right",
  "scale-up",
  "scale-down",
  "blur",
  "flip-x",
  "flip-y",
  "rotate",
  "clip-up",
  "clip-left",
  "clip-right",
  "wipe-up",
  "pop",
  "spring",
  "zoom",
  "bounce"
]);

export const SCROLL_EFFECTS = freeze([
  "none",
  "reveal",
  "parallax-y",
  "parallax-x",
  "scale",
  "rotate",
  "fade",
  "blur",
  "tilt",
  "skew",
  "clip",
  "depth",
  "progress",
  "pin"
]);

export const HOVER_EFFECTS = freeze([
  "none",
  "lift",
  "glow",
  "shine",
  "fill",
  "underline",
  "arrow",
  "magnetic",
  "tilt",
  "spotlight",
  "border-draw",
  "icon-slide",
  "jelly",
  "bounce",
  "pulse",
  "soften"
]);

export const PRESS_EFFECTS = freeze([
  "none",
  "compress",
  "push",
  "depress",
  "ripple",
  "bounce",
  "rubber",
  "pulse"
]);

export const LOOP_EFFECTS = freeze([
  "none",
  "float",
  "breathe",
  "pulse",
  "bob",
  "sway",
  "wiggle",
  "shimmer",
  "gradient",
  "spin",
  "glow",
  "dash"
]);

export const CHOREOGRAPHIES = freeze([
  "none",
  "children",
  "cascade",
  "grid",
  "stack",
  "hero",
  "wave",
  "radial",
  "list"
]);

export const MOTION_EASINGS = freeze([
  "standard",
  "smooth",
  "snappy",
  "spring",
  "expo",
  "back",
  "linear",
  "elastic"
]);

export const MOTION_DURATIONS = freeze([
  "instant",
  "quick",
  "fast",
  "normal",
  "slow",
  "cinematic"
]);

export const MOTION_DELAYS = freeze(["0", "1", "2", "3", "4", "5", "6", "7", "8"]);
export const MOTION_STAGGERS = freeze(["0", "1", "2", "3", "4", "5", "6", "7", "8"]);
export const MOTION_ORIGINS = freeze([
  "center",
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-right",
  "bottom-left"
]);
export const MOTION_INTENSITIES = freeze(["subtle", "normal", "strong", "extreme"]);

const PROFILE_ALIASES = freeze({
  none: "off",
  disabled: "off",
  minimal: "quiet",
  subtle: "quiet",
  professional: "polished",
  product: "polished",
  energetic: "dynamic",
  bold: "dynamic",
  film: "cinematic",
  fun: "playful",
  magazine: "editorial",
  app: "application",
  dashboard: "application",
  shop: "commerce",
  retail: "commerce",
  intense: "dramatic"
});

const EMPTY_SELECTION = freeze({
  enter: "none",
  scroll: "none",
  hover: "none",
  press: "none",
  loop: "none",
  choreography: "none",
  ease: "smooth",
  duration: "normal",
  delay: "0",
  stagger: "2",
  origin: "center",
  intensity: "normal",
  repeat: false
});

const PRESET_DEFINITIONS = {
  off: { ...EMPTY_SELECTION, duration: "instant" },
  quiet: {
    ...EMPTY_SELECTION,
    enter: "fade",
    hover: "soften",
    press: "compress",
    ease: "standard",
    duration: "fast",
    stagger: "1",
    intensity: "subtle"
  },
  polished: {
    ...EMPTY_SELECTION,
    enter: "rise",
    scroll: "reveal",
    hover: "lift",
    press: "compress",
    choreography: "cascade",
    ease: "smooth",
    duration: "normal",
    stagger: "2"
  },
  dynamic: {
    ...EMPTY_SELECTION,
    enter: "pop",
    scroll: "parallax-y",
    hover: "magnetic",
    press: "ripple",
    choreography: "wave",
    ease: "spring",
    duration: "normal",
    stagger: "2",
    intensity: "strong"
  },
  cinematic: {
    ...EMPTY_SELECTION,
    enter: "clip-up",
    scroll: "depth",
    hover: "spotlight",
    press: "compress",
    choreography: "hero",
    ease: "expo",
    duration: "cinematic",
    delay: "1",
    stagger: "3",
    origin: "bottom",
    intensity: "strong"
  },
  playful: {
    ...EMPTY_SELECTION,
    enter: "bounce",
    scroll: "rotate",
    hover: "jelly",
    press: "bounce",
    loop: "bob",
    choreography: "wave",
    ease: "elastic",
    duration: "slow",
    stagger: "2",
    intensity: "strong"
  },
  editorial: {
    ...EMPTY_SELECTION,
    enter: "wipe-up",
    scroll: "parallax-y",
    hover: "underline",
    press: "push",
    choreography: "stack",
    ease: "expo",
    duration: "slow",
    stagger: "3",
    origin: "left"
  },
  application: {
    ...EMPTY_SELECTION,
    enter: "fade",
    scroll: "reveal",
    hover: "glow",
    press: "depress",
    choreography: "grid",
    ease: "snappy",
    duration: "fast",
    stagger: "1",
    intensity: "subtle"
  },
  commerce: {
    ...EMPTY_SELECTION,
    enter: "scale-up",
    scroll: "scale",
    hover: "shine",
    press: "ripple",
    choreography: "grid",
    ease: "smooth",
    duration: "normal",
    stagger: "2"
  },
  dramatic: {
    ...EMPTY_SELECTION,
    enter: "zoom",
    scroll: "depth",
    hover: "tilt",
    press: "rubber",
    loop: "breathe",
    choreography: "radial",
    ease: "back",
    duration: "cinematic",
    stagger: "4",
    intensity: "extreme"
  },
  hero: {
    ...EMPTY_SELECTION,
    enter: "clip-up",
    scroll: "depth",
    choreography: "hero",
    ease: "expo",
    duration: "cinematic",
    stagger: "3",
    intensity: "strong"
  },
  section: {
    ...EMPTY_SELECTION,
    enter: "rise",
    scroll: "reveal",
    choreography: "cascade",
    ease: "smooth",
    duration: "slow",
    stagger: "2"
  },
  collection: {
    ...EMPTY_SELECTION,
    enter: "fade",
    choreography: "grid",
    ease: "smooth",
    duration: "normal",
    stagger: "2"
  },
  card: {
    ...EMPTY_SELECTION,
    enter: "rise",
    hover: "lift",
    press: "compress",
    ease: "spring",
    duration: "normal"
  },
  button: {
    ...EMPTY_SELECTION,
    hover: "shine",
    press: "ripple",
    ease: "snappy",
    duration: "fast"
  },
  nav: {
    ...EMPTY_SELECTION,
    enter: "fall",
    hover: "underline",
    press: "push",
    ease: "snappy",
    duration: "fast",
    intensity: "subtle"
  },
  modal: {
    ...EMPTY_SELECTION,
    enter: "scale-up",
    choreography: "cascade",
    ease: "spring",
    duration: "normal",
    stagger: "1"
  },
  media: {
    ...EMPTY_SELECTION,
    enter: "scale-up",
    scroll: "parallax-y",
    hover: "tilt",
    ease: "smooth",
    duration: "slow"
  },
  data: {
    ...EMPTY_SELECTION,
    enter: "fade",
    choreography: "list",
    ease: "snappy",
    duration: "fast",
    stagger: "1",
    intensity: "subtle"
  },
  cta: {
    ...EMPTY_SELECTION,
    enter: "pop",
    hover: "glow",
    choreography: "hero",
    ease: "spring",
    duration: "slow",
    intensity: "strong"
  }
};

export const MOTION_PRESETS = freeze(Object.fromEntries(
  Object.entries(PRESET_DEFINITIONS).map(([name, definition]) => [
    name,
    freeze({ id: name, kind: "preset", ...definition })
  ])
));

const DURATION_MS = freeze({ instant: 1, quick: 180, fast: 320, normal: 560, slow: 820, cinematic: 1_120 });
const DELAY_MS = freeze([0, 45, 90, 140, 210, 300, 420, 560, 720]);
const STAGGER_MS = freeze([0, 30, 50, 70, 95, 125, 160, 205, 260]);
const INTENSITY_FACTORS = freeze({ subtle: 0.58, normal: 1, strong: 1.38, extreme: 1.82 });
const EASING_VALUES = freeze({
  standard: "cubic-bezier(.2,.7,.2,1)",
  smooth: "cubic-bezier(.22,1,.36,1)",
  snappy: "cubic-bezier(.2,.9,.3,1)",
  spring: "cubic-bezier(.16,1.25,.3,1)",
  expo: "cubic-bezier(.16,1,.3,1)",
  back: "cubic-bezier(.34,1.56,.64,1)",
  linear: "linear",
  elastic: "cubic-bezier(.5,1.75,.25,.85)"
});

const EFFECT_KEYS = freeze([
  "enter", "scroll", "hover", "press", "loop", "choreography", "ease", "duration", "delay", "stagger", "origin", "intensity"
]);

function normalizeProfile(value, fallback = "polished") {
  const raw = String(value ?? "").trim().toLowerCase();
  const normalized = PROFILE_ALIASES[raw] ?? raw;
  return MOTION_PROFILES.includes(normalized) ? normalized : fallback;
}

function parseMotionRecipeNumber(id) {
  const match = /^(?:fx|x)?(\d{1,3})$/i.exec(String(id ?? "").trim());
  if (!match) return null;
  const index = Number.parseInt(match[1], 10);
  return index >= 0 && index < MOTION_RECIPE_COUNT ? index : null;
}

function pick(list, index, multiplier, offset = 0) {
  return list[(index * multiplier + Math.floor(index / Math.max(2, offset + 2)) + offset) % list.length];
}

export function resolveMotionRecipe(id = "x000") {
  const index = parseMotionRecipeNumber(id);
  if (index === null) return null;
  const loopPool = ["none", "none", "none", "none", "float", "breathe", "pulse", "bob", "sway", "shimmer", "glow"];
  const scrollPool = ["none", "reveal", "parallax-y", "parallax-x", "scale", "rotate", "fade", "blur", "tilt", "clip", "depth", "progress"];
  const hoverPool = HOVER_EFFECTS.filter((name) => name !== "none");
  const pressPool = PRESS_EFFECTS.filter((name) => name !== "none");
  const choreographyPool = CHOREOGRAPHIES.filter((name) => name !== "none");
  const recipe = {
    id: `x${pad(index)}`,
    index,
    kind: "recipe",
    enter: pick(ENTER_EFFECTS.slice(1), index, 7, 1),
    scroll: pick(scrollPool, index, 11, 2),
    hover: pick(hoverPool, index, 13, 3),
    press: pick(pressPool, index, 17, 4),
    loop: pick(loopPool, index, 19, 5),
    choreography: pick(choreographyPool, index, 23, 6),
    ease: pick(MOTION_EASINGS, index, 29, 1),
    duration: pick(MOTION_DURATIONS.slice(1), index, 31, 2),
    delay: String((index * 3 + Math.floor(index / 41)) % MOTION_DELAYS.length),
    stagger: String((index * 5 + Math.floor(index / 29)) % MOTION_STAGGERS.length),
    origin: pick(MOTION_ORIGINS, index, 37, 3),
    intensity: pick(MOTION_INTENSITIES, index, 41, 1),
    repeat: index % 11 === 0
  };
  if (recipe.scroll === "parallax-y" || recipe.scroll === "parallax-x") {
    if (recipe.hover === "magnetic") recipe.hover = "spotlight";
  }
  if (recipe.loop !== "none" && ["jelly", "bounce"].includes(recipe.hover)) recipe.hover = "glow";
  return freeze(recipe);
}

function autoPresetName(blockName) {
  const name = String(blockName ?? "").toLowerCase();
  if (name === "button") return "button";
  if (name === "link" || name === "nav" || name === "header" || name === "footer" || name === "sidebar") return "nav";
  if (name === "hero") return "hero";
  if (["section", "split", "proof", "features", "steps", "pricing", "comparison", "faq", "article"].includes(name)) return "section";
  if (["grid", "stats", "metrics", "kanban", "gallery", "testimonials"].includes(name)) return "collection";
  if (["card", "feature", "tier", "step", "testimonial", "panel", "metric", "lane"].includes(name)) return "card";
  if (name === "dialog") return "modal";
  if (["visual", "image", "code-block"].includes(name)) return "media";
  if (["table", "form", "tabs", "activity"].includes(name)) return "data";
  if (name === "cta") return "cta";
  if (name === "app-shell" || name === "toolbar") return "application";
  return "polished";
}

export function resolveMotion(value = "auto", blockName = "") {
  const raw = String(value ?? "auto").trim().toLowerCase();
  const recipe = resolveMotionRecipe(raw);
  if (recipe) return recipe;
  const presetName = raw === "auto" ? autoPresetName(blockName) : (PROFILE_ALIASES[raw] ?? raw);
  return MOTION_PRESETS[presetName] ?? null;
}

function splitComment(value) {
  let quote = "";
  let escaped = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (escaped) { escaped = false; continue; }
    if (character === "\\" && quote) { escaped = true; continue; }
    if (quote) { if (character === quote) quote = ""; continue; }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (character === "#" && (index === 0 || /\s/.test(value[index - 1]))) {
      return { code: value.slice(0, index).trimEnd(), comment: value.slice(index) };
    }
  }
  return { code: value, comment: "" };
}

function tokenize(value) {
  const tokens = [];
  let token = "";
  let quote = "";
  let escaped = false;
  let depth = 0;
  for (const character of value.trim()) {
    if (escaped) { token += character; escaped = false; continue; }
    if (character === "\\" && quote) { token += character; escaped = true; continue; }
    if (quote) { token += character; if (character === quote) quote = ""; continue; }
    if (character === '"' || character === "'") { quote = character; token += character; continue; }
    if (["[", "{", "("].includes(character)) depth += 1;
    if (["]", "}", ")"].includes(character)) depth = Math.max(0, depth - 1);
    if (/\s/.test(character) && depth === 0) {
      if (token) tokens.push(token);
      token = "";
    } else token += character;
  }
  if (token) tokens.push(token);
  return tokens;
}

function decodeDslValue(value) {
  const text = String(value ?? "");
  if (text.startsWith('"') && text.endsWith('"')) {
    try { return JSON.parse(text); } catch { return text.slice(1, -1); }
  }
  if (text.startsWith("'") && text.endsWith("'")) return text.slice(1, -1).replace(/\\'/g, "'");
  return text;
}

function encodeDslValue(value) {
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return JSON.stringify(String(value));
}

function tokenParts(token) {
  const equals = token.indexOf("=");
  return equals > 0 ? { key: token.slice(0, equals).toLowerCase(), value: token.slice(equals + 1) } : null;
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["true", "1", "yes", "on", "always"].includes(normalized)) return true;
  if (["false", "0", "no", "off", "once"].includes(normalized)) return false;
  return fallback;
}

const ATTRIBUTE_MAP = freeze({
  fx: "preset", animation: "preset", animate: "preset", "motion-fx": "preset",
  en: "enter", enter: "enter", entrance: "enter",
  sx: "scroll", scroll: "scroll",
  hx: "hover", hover: "hover",
  px: "press", press: "press",
  lx: "loop", loop: "loop",
  cx: "choreography", choreo: "choreography", choreography: "choreography",
  ez: "ease", ease: "ease",
  du: "duration", duration: "duration", speed: "duration",
  dl: "delay", delay: "delay",
  sg: "stagger", stagger: "stagger",
  og: "origin", "transform-origin": "origin",
  ix: "intensity", intensity: "intensity",
  rp: "repeat", repeat: "repeat", once: "once",
  profile: "profile", "motion-profile": "profile"
});

const DURATION_ALIASES = freeze({
  "0": "instant", "1": "quick", "2": "fast", "3": "normal", "4": "slow", "5": "cinematic",
  rapid: "quick", short: "fast", medium: "normal", long: "slow", film: "cinematic"
});
const INTENSITY_ALIASES = freeze({
  "0": "subtle", "1": "normal", "2": "strong", "3": "extreme",
  low: "subtle", medium: "normal", high: "strong", max: "extreme"
});

function canonicalEffect(key, value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (key === "enter") return ENTER_EFFECTS.includes(raw) ? raw : null;
  if (key === "scroll") return SCROLL_EFFECTS.includes(raw) ? raw : null;
  if (key === "hover") return HOVER_EFFECTS.includes(raw) ? raw : null;
  if (key === "press") return PRESS_EFFECTS.includes(raw) ? raw : null;
  if (key === "loop") return LOOP_EFFECTS.includes(raw) ? raw : null;
  if (key === "choreography") return CHOREOGRAPHIES.includes(raw) ? raw : null;
  if (key === "ease") return MOTION_EASINGS.includes(raw) ? raw : null;
  if (key === "duration") {
    const normalized = DURATION_ALIASES[raw] ?? raw;
    return MOTION_DURATIONS.includes(normalized) ? normalized : null;
  }
  if (key === "delay") return MOTION_DELAYS.includes(raw) ? raw : null;
  if (key === "stagger") return MOTION_STAGGERS.includes(raw) ? raw : null;
  if (key === "origin") return MOTION_ORIGINS.includes(raw) ? raw : null;
  if (key === "intensity") {
    const normalized = INTENSITY_ALIASES[raw] ?? raw;
    return MOTION_INTENSITIES.includes(normalized) ? normalized : null;
  }
  return null;
}

function parsePackedFx(value) {
  const raw = String(value ?? "").trim();
  const output = { preset: "", overrides: {} };
  if (!raw) return output;
  const parts = raw.split(/[\s,+|]+/).map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const separator = part.indexOf(":");
    if (separator > 0) {
      const mapped = ATTRIBUTE_MAP[part.slice(0, separator).toLowerCase()];
      if (!mapped || ["preset", "profile", "once", "repeat"].includes(mapped)) continue;
      const effect = canonicalEffect(mapped, part.slice(separator + 1));
      if (effect) output.overrides[mapped] = effect;
      continue;
    }
    if (resolveMotion(part)) output.preset = part;
  }
  return output;
}

function selectionToClasses(selection) {
  if (!selection || selection.id === "off") return [];
  const classes = ["ab-m3"];
  if (selection.id) classes.push(`ab-fx-${selection.id}`);
  if (selection.enter && selection.enter !== "none") classes.push(`ab-enter-${selection.enter}`);
  if (selection.scroll && selection.scroll !== "none") classes.push(`ab-scroll-${selection.scroll}`);
  if (selection.hover && selection.hover !== "none") classes.push(`ab-hover-${selection.hover}`);
  if (selection.press && selection.press !== "none") classes.push(`ab-press-${selection.press}`);
  if (selection.loop && selection.loop !== "none") classes.push(`ab-loop-${selection.loop}`);
  if (selection.choreography && selection.choreography !== "none") classes.push(`ab-choreo-${selection.choreography}`);
  classes.push(
    `ab-ease-${selection.ease}`,
    `ab-duration-${selection.duration}`,
    `ab-delay-${selection.delay}`,
    `ab-stagger-${selection.stagger}`,
    `ab-origin-${selection.origin}`,
    `ab-intensity-${selection.intensity}`
  );
  if (selection.repeat) classes.push("ab-repeat");
  return unique(classes);
}

function mergeClassToken(tokens, classes) {
  if (!classes.length) return tokens;
  const index = tokens.findIndex((token) => tokenParts(token)?.key === "class");
  if (index === -1) {
    tokens.push(`class=${encodeDslValue(classes.join(" "))}`);
    return tokens;
  }
  const existing = decodeDslValue(tokenParts(tokens[index]).value);
  const merged = unique(`${existing} ${classes.join(" ")}`.split(/\s+/)).join(" ");
  tokens[index] = `class=${encodeDslValue(merged)}`;
  return tokens;
}

function classValue(tokens) {
  const token = tokens.find((item) => tokenParts(item)?.key === "class");
  return token ? String(decodeDslValue(tokenParts(token).value)) : "";
}

function virtualMarker(tokens) {
  const match = /\bab-v-(ft|hr|fr|cd|sc|fm|tb|nv|b|h)(\d{3})\b/i.exec(classValue(tokens));
  if (!match) return null;
  return { prefix: match[1].toLowerCase(), number: Number.parseInt(match[2], 10) };
}

function virtualSelection(blockName, marker) {
  const index = marker.number;
  const base = resolveMotionRecipe(`x${pad(index)}`) ?? MOTION_PRESETS.polished;
  const selection = { ...base, id: `x${pad(index)}`, kind: "virtual-auto", loop: "none", repeat: false };
  if (blockName === "button") {
    selection.enter = "none";
    selection.scroll = "none";
    selection.choreography = "none";
    selection.hover = HOVER_EFFECTS[1 + (index % (HOVER_EFFECTS.length - 1))];
    selection.press = PRESS_EFFECTS[1 + ((index * 3) % (PRESS_EFFECTS.length - 1))];
  } else if (blockName === "hero") {
    selection.enter = ["clip-up", "rise", "zoom", "scale-up"][index % 4];
    selection.scroll = ["depth", "parallax-y", "scale", "reveal"][index % 4];
    selection.hover = "none";
    selection.press = "none";
    selection.choreography = ["hero", "cascade", "wave"][index % 3];
  } else if (["card", "panel", "feature", "tier", "step"].includes(blockName)) {
    selection.enter = ["rise", "scale-up", "fade", "pop"][index % 4];
    selection.scroll = index % 3 === 0 ? "reveal" : "none";
    selection.hover = ["lift", "glow", "tilt", "spotlight", "shine"][index % 5];
    selection.press = "compress";
    selection.choreography = "none";
  } else if (["section", "grid", "features", "stats", "metrics"].includes(blockName)) {
    selection.enter = ["fade", "rise", "clip-up"][index % 3];
    selection.scroll = index % 4 === 0 ? "parallax-y" : "reveal";
    selection.hover = "none";
    selection.press = "none";
    selection.choreography = ["cascade", "grid", "children", "wave"][index % 4];
  } else if (blockName === "header") {
    selection.enter = "fall";
    selection.scroll = "none";
    selection.hover = "none";
    selection.press = "none";
    selection.choreography = "children";
    selection.intensity = "subtle";
  } else if (blockName === "footer") {
    selection.enter = "rise";
    selection.scroll = "reveal";
    selection.hover = "none";
    selection.press = "none";
    selection.choreography = "cascade";
  } else if (blockName === "form" || blockName === "table") {
    selection.enter = "fade";
    selection.scroll = "reveal";
    selection.hover = "none";
    selection.press = "none";
    selection.choreography = blockName === "table" ? "list" : "cascade";
    selection.intensity = "subtle";
  } else if (blockName === "nav") {
    selection.enter = "fade";
    selection.scroll = "none";
    selection.hover = "none";
    selection.press = "none";
    selection.choreography = "children";
    selection.intensity = "subtle";
  }
  if ((selection.scroll === "parallax-y" || selection.scroll === "parallax-x") && selection.hover === "magnetic") selection.hover = "spotlight";
  return freeze(selection);
}

const AUTO_PROFILE_BLOCKS = freeze(new Set([
  "page", "main", "section", "grid", "columns",
  "header", "nav", "link", "button", "footer",
  "hero", "visual", "proof", "stats", "stat", "features", "feature", "split", "steps", "step",
  "testimonials", "testimonial", "pricing", "tier", "comparison", "faq", "cta", "gallery",
  "article", "app-shell", "toolbar", "metrics", "metric", "chart", "table", "form", "tabs", "panel",
  "dialog", "kanban", "lane", "card", "activity", "empty-state", "status", "image", "code-block"
]));

function profileSelection(blockName, profile, order) {
  const profileBase = resolveMotion(profile, blockName) ?? MOTION_PRESETS.polished;
  const blockBase = resolveMotion("auto", blockName) ?? MOTION_PRESETS.polished;
  const selection = {
    ...blockBase,
    ease: profileBase.ease,
    duration: profileBase.duration,
    intensity: profileBase.intensity,
    stagger: profileBase.stagger,
    delay: String(Math.min(3, order % 4)),
    repeat: false,
    id: `${profile}-${autoPresetName(blockName)}`,
    kind: "profile-auto"
  };
  if (profile === "off") return MOTION_PRESETS.off;
  if (profile === "quiet") {
    selection.scroll = "none";
    selection.loop = "none";
    if (selection.hover !== "none") selection.hover = "soften";
    selection.enter = ["button", "link", "nav"].includes(blockName) ? "none" : "fade";
    selection.choreography = ["grid", "features", "stats", "metrics"].includes(blockName) ? "children" : "none";
  }
  if (profile === "cinematic" && blockName === "hero") {
    Object.assign(selection, MOTION_PRESETS.hero, {
      id: "cinematic-hero",
      ease: profileBase.ease,
      duration: profileBase.duration,
      intensity: profileBase.intensity
    });
  }
  if (profile === "playful" && blockName === "button") {
    selection.hover = "jelly";
    selection.press = "bounce";
  }
  if (profile === "application" && ["table", "form", "tabs", "app-shell"].includes(blockName)) {
    selection.enter = "fade";
    selection.scroll = "none";
    selection.choreography = blockName === "table" ? "list" : "grid";
  }
  if (profile === "commerce" && ["card", "tier", "feature"].includes(blockName)) {
    selection.enter = "scale-up";
    selection.hover = "shine";
    selection.press = "ripple";
  }
  return freeze(selection);
}

function validateSelection(selection) {
  return ENTER_EFFECTS.includes(selection.enter)
    && SCROLL_EFFECTS.includes(selection.scroll)
    && HOVER_EFFECTS.includes(selection.hover)
    && PRESS_EFFECTS.includes(selection.press)
    && LOOP_EFFECTS.includes(selection.loop)
    && CHOREOGRAPHIES.includes(selection.choreography)
    && MOTION_EASINGS.includes(selection.ease)
    && MOTION_DURATIONS.includes(selection.duration)
    && MOTION_DELAYS.includes(String(selection.delay))
    && MOTION_STAGGERS.includes(String(selection.stagger))
    && MOTION_ORIGINS.includes(selection.origin)
    && MOTION_INTENSITIES.includes(selection.intensity);
}

function recordSelection(state, selection, explicit) {
  if (!selection || selection.id === "off") return;
  if (selection.kind === "recipe" || /^x\d{3}$/.test(selection.id ?? "")) state.used.recipes.add(selection.id);
  else if (selection.id) state.used.presets.add(selection.id);
  for (const key of ["enter", "scroll", "hover", "press", "loop", "choreography"]) {
    const value = selection[key];
    if (value && value !== "none") state.used[key].add(value);
  }
  if (explicit) state.features.explicit = true;
  if (selection.scroll !== "none") state.features.scrollLinked = true;
  if (selection.hover !== "none" || selection.press !== "none") state.features.microinteractions = true;
  if (selection.loop !== "none") state.features.ambient = true;
  if (selection.choreography !== "none") state.features.choreography = true;
}

function transformLine(line, state) {
  if (!line.trim()) return line;
  const indentation = line.match(/^\s*/)?.[0] ?? "";
  const { code, comment } = splitComment(line.slice(indentation.length));
  if (!code.trim()) return line;
  const tokens = tokenize(code);
  if (!tokens.length) return line;
  const name = tokens.shift().toLowerCase();
  const tasteManaged = tokens.some((token) => {
    const parts = tokenParts(token);
    return (parts?.key === "class" || parts?.key === "cl") && /(?:^|\s)ab-t5(?:-|\s|$)/.test(String(decodeDslValue(parts.value)));
  });
  const definition = getBlock(name);
  const classSupported = Boolean(definition?.attributes?.includes("class"));
  const output = [];
  const raw = {};
  const originalMotionTokens = [];
  let explicit = false;

  for (const token of tokens) {
    const parts = tokenParts(token);
    if (!parts) { output.push(token); continue; }
    const mapped = ATTRIBUTE_MAP[parts.key];
    if (!mapped || (name === "site" && parts.key === "origin")) { output.push(token); continue; }
    const value = decodeDslValue(parts.value);
    originalMotionTokens.push(token);
    explicit = true;
    if (mapped === "once") { raw.repeat = !parseBoolean(value, true); continue; }
    if (mapped === "repeat") { raw.repeat = parseBoolean(value, false); continue; }
    if (mapped === "profile") {
      const normalizedProfile = normalizeProfile(value, "");
      if (!normalizedProfile) {
        output.push(token);
        state.invalid.push({ line: state.line, key: parts.key, value: String(value) });
      } else raw.profile = normalizedProfile;
      continue;
    }
    if (mapped === "preset") {
      const packed = parsePackedFx(value);
      const preset = packed.preset || String(value);
      if (!resolveMotion(preset, name)) {
        output.push(token);
        state.invalid.push({ line: state.line, key: parts.key, value: String(value) });
      } else {
        raw.preset = preset;
        Object.assign(raw, packed.overrides);
      }
      continue;
    }
    const effect = canonicalEffect(mapped, value);
    if (!effect) {
      output.push(token);
      state.invalid.push({ line: state.line, key: parts.key, value: String(value) });
    } else raw[mapped] = effect;
  }

  if (name === "site") {
    if (!explicit) return line;
    const profileName = raw.profile ?? (raw.preset && !resolveMotionRecipe(raw.preset) ? normalizeProfile(raw.preset, "") : "");
    const base = resolveMotion(raw.preset || profileName || "polished", "site");
    if (!base) return line;
    const root = { ...base };
    for (const key of EFFECT_KEYS) if (raw[key] !== undefined) root[key] = raw[key];
    if (raw.repeat !== undefined) root.repeat = raw.repeat;
    if (!validateSelection(root)) return line;
    state.profile = profileName || (base.kind === "preset" && MOTION_PROFILES.includes(base.id) ? base.id : "custom");
    state.root = freeze(root);
    state.profileEnabled = state.profile !== "off";
    state.features.profile = true;
    state.features.motion = true;
    state.usedAny = true;
    recordSelection(state, root, true);
    return `${indentation}${[name, ...output].join(" ")}${comment ? ` ${comment}` : ""}`;
  }

  let selection = null;
  if (explicit) {
    const packedBase = resolveMotion(raw.preset || "auto", name);
    if (!packedBase) return line;
    const resolved = { ...packedBase };
    for (const key of EFFECT_KEYS) if (raw[key] !== undefined) resolved[key] = raw[key];
    if (raw.repeat !== undefined) resolved.repeat = raw.repeat;
    if (!validateSelection(resolved)) return line;
    selection = freeze(resolved);
  } else if (!tasteManaged) {
    const marker = virtualMarker(output);
    if (marker) {
      selection = virtualSelection(name, marker);
      state.features.virtualAuto = true;
    } else if (state.profileEnabled && AUTO_PROFILE_BLOCKS.has(name)) {
      selection = profileSelection(name, state.profile, state.profileOrder);
      state.profileOrder += 1;
      state.features.profileAuto = true;
    }
  }

  if (!selection || selection.id === "off") {
    if (explicit) {
      state.usedAny = true;
      state.features.motion = true;
    }
    return explicit ? `${indentation}${[name, ...output].join(" ")}${comment ? ` ${comment}` : ""}` : line;
  }

  if (!classSupported) {
    return explicit ? `${indentation}${[name, ...output, ...originalMotionTokens].join(" ")}${comment ? ` ${comment}` : ""}` : line;
  }

  mergeClassToken(output, selectionToClasses(selection));
  state.usedAny = true;
  state.features.motion = true;
  recordSelection(state, selection, explicit);
  return `${indentation}${[name, ...output].join(" ")}${comment ? ` ${comment}` : ""}`;
}

function freezeUsage(used) {
  return freeze(Object.fromEntries(Object.entries(used).map(([key, values]) => [key, freeze([...values].sort())])));
}

export function normalizeMotionSource(source) {
  const input = String(source ?? "");
  const state = {
    line: 0,
    usedAny: false,
    profile: "polished",
    root: MOTION_PRESETS.polished,
    profileEnabled: false,
    profileOrder: 0,
    invalid: [],
    features: {
      motion: false,
      profile: false,
      profileAuto: false,
      explicit: false,
      virtualAuto: false,
      scrollLinked: false,
      microinteractions: false,
      ambient: false,
      choreography: false
    },
    used: {
      recipes: new Set(), presets: new Set(), enter: new Set(), scroll: new Set(), hover: new Set(), press: new Set(), loop: new Set(), choreography: new Set()
    }
  };
  const output = input.split(/\r?\n/).map((line, index) => {
    state.line = index + 1;
    return transformLine(line, state);
  }).join("\n");
  return freeze({
    source: state.usedAny ? output : input,
    used: state.usedAny,
    profile: state.profile,
    root: state.root,
    features: freeze({ ...state.features }),
    usage: freezeUsage(state.used),
    invalid: freeze(state.invalid.map((item) => freeze({ ...item })))
  });
}

export function motionManifest(normalized = {}) {
  return {
    engine: MOTION_ENGINE_VERSION,
    recipeCount: MOTION_RECIPE_COUNT,
    profile: normalized.profile ?? "polished",
    root: normalized.root ? {
      id: normalized.root.id,
      enter: normalized.root.enter,
      scroll: normalized.root.scroll,
      hover: normalized.root.hover,
      press: normalized.root.press,
      loop: normalized.root.loop,
      choreography: normalized.root.choreography,
      ease: normalized.root.ease,
      duration: normalized.root.duration,
      delay: normalized.root.delay,
      stagger: normalized.root.stagger,
      origin: normalized.root.origin,
      intensity: normalized.root.intensity,
      repeat: Boolean(normalized.root.repeat)
    } : null,
    features: { ...(normalized.features ?? {}) },
    usage: { ...(normalized.usage ?? {}) },
    catalog: {
      profiles: [...MOTION_PROFILES],
      enter: [...ENTER_EFFECTS],
      scroll: [...SCROLL_EFFECTS],
      hover: [...HOVER_EFFECTS],
      press: [...PRESS_EFFECTS],
      loop: [...LOOP_EFFECTS],
      choreography: [...CHOREOGRAPHIES],
      easing: [...MOTION_EASINGS],
      duration: [...MOTION_DURATIONS],
      origin: [...MOTION_ORIGINS],
      intensity: [...MOTION_INTENSITIES]
    }
  };
}

export function buildMotionProfileCss(normalized = {}) {
  if (!normalized.used) return "";
  const selection = normalized.root ?? MOTION_PRESETS.polished;
  const duration = DURATION_MS[selection.duration] ?? DURATION_MS.normal;
  const delay = DELAY_MS[Number(selection.delay)] ?? 0;
  const stagger = STAGGER_MS[Number(selection.stagger)] ?? STAGGER_MS[2];
  const intensity = INTENSITY_FACTORS[selection.intensity] ?? 1;
  const easing = EASING_VALUES[selection.ease] ?? EASING_VALUES.smooth;
  return `
html[data-ab-motion-engine="${MOTION_ENGINE_VERSION}"]{
  --ab-m3-duration:${duration}ms;
  --ab-m3-delay:${delay}ms;
  --ab-m3-stagger:${stagger}ms;
  --ab-m3-intensity:${intensity};
  --ab-m3-distance:${Math.round(32 * intensity)}px;
  --ab-m3-ease:${easing};
}
`;
}

export const MOTION3_CSS = `
/* AppBlocks Web motion engine 3 */
html[data-ab-motion-engine="3"]{--ab-m3-duration:560ms;--ab-m3-delay:0ms;--ab-m3-stagger:70ms;--ab-m3-intensity:1;--ab-m3-distance:32px;--ab-m3-ease:cubic-bezier(.22,1,.36,1);--ab-page-progress:0}
html[data-ab-motion-profile="off"]{--ab-m3-duration:1ms;--ab-m3-delay:0ms;--ab-m3-stagger:0ms;--ab-m3-intensity:0;--ab-m3-distance:0px}
html[data-ab-motion-profile="quiet"]{--ab-m3-duration:320ms;--ab-m3-stagger:30ms;--ab-m3-intensity:.58;--ab-m3-distance:18px;--ab-m3-ease:cubic-bezier(.2,.7,.2,1)}
html[data-ab-motion-profile="dynamic"]{--ab-m3-duration:560ms;--ab-m3-stagger:70ms;--ab-m3-intensity:1.38;--ab-m3-distance:44px;--ab-m3-ease:cubic-bezier(.16,1.25,.3,1)}
html[data-ab-motion-profile="cinematic"]{--ab-m3-duration:1120ms;--ab-m3-stagger:95ms;--ab-m3-intensity:1.38;--ab-m3-distance:52px;--ab-m3-ease:cubic-bezier(.16,1,.3,1)}
html[data-ab-motion-profile="playful"]{--ab-m3-duration:820ms;--ab-m3-stagger:70ms;--ab-m3-intensity:1.38;--ab-m3-distance:42px;--ab-m3-ease:cubic-bezier(.5,1.75,.25,.85)}
html[data-ab-motion-profile="editorial"]{--ab-m3-duration:820ms;--ab-m3-stagger:95ms;--ab-m3-distance:38px;--ab-m3-ease:cubic-bezier(.16,1,.3,1)}
html[data-ab-motion-profile="application"]{--ab-m3-duration:320ms;--ab-m3-stagger:30ms;--ab-m3-intensity:.58;--ab-m3-distance:18px;--ab-m3-ease:cubic-bezier(.2,.9,.3,1)}
html[data-ab-motion-profile="commerce"]{--ab-m3-duration:560ms;--ab-m3-stagger:70ms;--ab-m3-distance:30px;--ab-m3-ease:cubic-bezier(.22,1,.36,1)}
html[data-ab-motion-profile="dramatic"]{--ab-m3-duration:1120ms;--ab-m3-stagger:125ms;--ab-m3-intensity:1.82;--ab-m3-distance:64px;--ab-m3-ease:cubic-bezier(.34,1.56,.64,1)}
.ab-m3{--ab-m3-local-duration:var(--ab-m3-duration);--ab-m3-local-delay:var(--ab-m3-delay);--ab-m3-local-stagger:var(--ab-m3-stagger);--ab-m3-local-intensity:var(--ab-m3-intensity);--ab-m3-local-distance:var(--ab-m3-distance);--ab-m3-local-ease:var(--ab-m3-ease);--ab-m3-scroll-x:0px;--ab-m3-scroll-y:0px;--ab-m3-scroll-scale:1;--ab-m3-scroll-rotate:0deg;--ab-m3-scroll-opacity:1;--ab-m3-scroll-blur:0px;--ab-m3-scroll-skew:0deg;--ab-m3-magnetic-x:0px;--ab-m3-magnetic-y:0px;--ab-m3-tilt-x:0deg;--ab-m3-tilt-y:0deg;--ab-m3-spot-x:50%;--ab-m3-spot-y:50%;transform-origin:var(--ab-m3-origin,center)}
.ab-ease-standard{--ab-m3-local-ease:cubic-bezier(.2,.7,.2,1)}.ab-ease-smooth{--ab-m3-local-ease:cubic-bezier(.22,1,.36,1)}.ab-ease-snappy{--ab-m3-local-ease:cubic-bezier(.2,.9,.3,1)}.ab-ease-spring{--ab-m3-local-ease:cubic-bezier(.16,1.25,.3,1)}.ab-ease-expo{--ab-m3-local-ease:cubic-bezier(.16,1,.3,1)}.ab-ease-back{--ab-m3-local-ease:cubic-bezier(.34,1.56,.64,1)}.ab-ease-linear{--ab-m3-local-ease:linear}.ab-ease-elastic{--ab-m3-local-ease:cubic-bezier(.5,1.75,.25,.85)}
.ab-duration-instant{--ab-m3-local-duration:1ms}.ab-duration-quick{--ab-m3-local-duration:180ms}.ab-duration-fast{--ab-m3-local-duration:320ms}.ab-duration-normal{--ab-m3-local-duration:560ms}.ab-duration-slow{--ab-m3-local-duration:820ms}.ab-duration-cinematic{--ab-m3-local-duration:1120ms}
.ab-delay-0{--ab-m3-local-delay:0ms}.ab-delay-1{--ab-m3-local-delay:45ms}.ab-delay-2{--ab-m3-local-delay:90ms}.ab-delay-3{--ab-m3-local-delay:140ms}.ab-delay-4{--ab-m3-local-delay:210ms}.ab-delay-5{--ab-m3-local-delay:300ms}.ab-delay-6{--ab-m3-local-delay:420ms}.ab-delay-7{--ab-m3-local-delay:560ms}.ab-delay-8{--ab-m3-local-delay:720ms}
.ab-stagger-0{--ab-m3-local-stagger:0ms}.ab-stagger-1{--ab-m3-local-stagger:30ms}.ab-stagger-2{--ab-m3-local-stagger:50ms}.ab-stagger-3{--ab-m3-local-stagger:70ms}.ab-stagger-4{--ab-m3-local-stagger:95ms}.ab-stagger-5{--ab-m3-local-stagger:125ms}.ab-stagger-6{--ab-m3-local-stagger:160ms}.ab-stagger-7{--ab-m3-local-stagger:205ms}.ab-stagger-8{--ab-m3-local-stagger:260ms}
.ab-intensity-subtle{--ab-m3-local-intensity:.58;--ab-m3-local-distance:18px}.ab-intensity-normal{--ab-m3-local-intensity:1;--ab-m3-local-distance:32px}.ab-intensity-strong{--ab-m3-local-intensity:1.38;--ab-m3-local-distance:46px}.ab-intensity-extreme{--ab-m3-local-intensity:1.82;--ab-m3-local-distance:64px}
.ab-origin-center{--ab-m3-origin:center}.ab-origin-top{--ab-m3-origin:top}.ab-origin-right{--ab-m3-origin:right}.ab-origin-bottom{--ab-m3-origin:bottom}.ab-origin-left{--ab-m3-origin:left}.ab-origin-top-left{--ab-m3-origin:top left}.ab-origin-top-right{--ab-m3-origin:top right}.ab-origin-bottom-right{--ab-m3-origin:bottom right}.ab-origin-bottom-left{--ab-m3-origin:bottom left}
.js .ab-m3[class*="ab-enter-"]{opacity:0;transform:var(--ab-m3-enter-transform,none);filter:var(--ab-m3-enter-filter,none);clip-path:var(--ab-m3-enter-clip,inset(0));transition:opacity var(--ab-m3-local-duration) var(--ab-m3-local-ease) var(--ab-m3-local-delay),transform var(--ab-m3-local-duration) var(--ab-m3-local-ease) var(--ab-m3-local-delay),filter var(--ab-m3-local-duration) var(--ab-m3-local-ease) var(--ab-m3-local-delay),clip-path var(--ab-m3-local-duration) var(--ab-m3-local-ease) var(--ab-m3-local-delay)}
.js .ab-m3.is-ab-m3-visible{opacity:1;transform:none;filter:none;clip-path:inset(0)}
.ab-enter-fade{--ab-m3-enter-transform:none}.ab-enter-rise{--ab-m3-enter-transform:translate3d(0,var(--ab-m3-local-distance),0)}.ab-enter-fall{--ab-m3-enter-transform:translate3d(0,calc(var(--ab-m3-local-distance) * -1),0)}.ab-enter-slide-left{--ab-m3-enter-transform:translate3d(var(--ab-m3-local-distance),0,0)}.ab-enter-slide-right{--ab-m3-enter-transform:translate3d(calc(var(--ab-m3-local-distance) * -1),0,0)}.ab-enter-scale-up{--ab-m3-enter-transform:scale(.9)}.ab-enter-scale-down{--ab-m3-enter-transform:scale(1.1)}.ab-enter-blur{--ab-m3-enter-transform:scale(.98);--ab-m3-enter-filter:blur(12px)}.ab-enter-flip-x{--ab-m3-enter-transform:perspective(900px) rotateX(18deg)}.ab-enter-flip-y{--ab-m3-enter-transform:perspective(900px) rotateY(-18deg)}.ab-enter-rotate{--ab-m3-enter-transform:rotate(-3deg) translateY(var(--ab-m3-local-distance))}.ab-enter-clip-up{--ab-m3-enter-transform:translateY(calc(var(--ab-m3-local-distance) * .45));--ab-m3-enter-clip:inset(100% 0 0 0)}.ab-enter-clip-left{--ab-m3-enter-transform:translateX(calc(var(--ab-m3-local-distance) * .45));--ab-m3-enter-clip:inset(0 100% 0 0)}.ab-enter-clip-right{--ab-m3-enter-transform:translateX(calc(var(--ab-m3-local-distance) * -.45));--ab-m3-enter-clip:inset(0 0 0 100%)}.ab-enter-wipe-up{--ab-m3-enter-transform:translateY(calc(var(--ab-m3-local-distance) * .3));--ab-m3-enter-clip:inset(100% 0 0 0)}.ab-enter-pop{--ab-m3-enter-transform:scale(.78) translateY(calc(var(--ab-m3-local-distance) * .35))}.ab-enter-spring{--ab-m3-enter-transform:translateY(var(--ab-m3-local-distance)) scale(.92)}.ab-enter-zoom{--ab-m3-enter-transform:scale(.72);--ab-m3-enter-filter:blur(5px)}.ab-enter-bounce{--ab-m3-enter-transform:translateY(calc(var(--ab-m3-local-distance) * 1.4)) scale(.94)}
.js .ab-m3[class*="ab-choreo-"]>*{opacity:0;transform:translate3d(0,calc(var(--ab-m3-local-distance) * .55),0);transition:opacity var(--ab-m3-local-duration) var(--ab-m3-local-ease),transform var(--ab-m3-local-duration) var(--ab-m3-local-ease),filter var(--ab-m3-local-duration) var(--ab-m3-local-ease);transition-delay:calc(var(--ab-m3-local-delay) + var(--ab-m3-order,0) * var(--ab-m3-local-stagger))}
.js .ab-m3.is-ab-m3-visible[class*="ab-choreo-"]>*{opacity:1;transform:none;filter:none}.js .ab-choreo-grid>*{transform:translate3d(0,var(--ab-m3-local-distance),0) scale(.94)}.js .ab-choreo-stack>*{transform:translate3d(calc(var(--ab-m3-order,0) * -4px),var(--ab-m3-local-distance),0) rotate(calc(var(--ab-m3-order,0) * -.3deg))}.js .ab-choreo-hero>*{transform:translate3d(0,calc(var(--ab-m3-local-distance) * .8),0);filter:blur(5px)}.js .ab-choreo-wave>*{transform:translate3d(0,calc(var(--ab-m3-local-distance) * (1 + var(--ab-m3-wave,0))),0) rotate(calc(var(--ab-m3-wave,0) * 2deg))}.js .ab-choreo-radial>*{transform:translate3d(var(--ab-m3-radial-x,0px),var(--ab-m3-radial-y,var(--ab-m3-local-distance)),0) scale(.88)}.js .ab-choreo-list>*{transform:translate3d(var(--ab-m3-list-x,0px),calc(var(--ab-m3-local-distance) * .45),0)}
.ab-m3[class*="ab-scroll-"]{will-change:translate,scale,rotate,opacity,filter,clip-path;translate:var(--ab-m3-scroll-x) var(--ab-m3-scroll-y);scale:var(--ab-m3-scroll-scale);rotate:var(--ab-m3-scroll-rotate);opacity:var(--ab-m3-scroll-opacity);filter:blur(var(--ab-m3-scroll-blur))}.ab-scroll-skew{transform:skewY(var(--ab-m3-scroll-skew))}.ab-scroll-tilt{transform:perspective(900px) rotateX(var(--ab-m3-tilt-x)) rotateY(var(--ab-m3-tilt-y))}.ab-scroll-clip{clip-path:inset(var(--ab-m3-scroll-clip,0%) 0 0)}.ab-scroll-depth{transform:perspective(1100px) rotateX(var(--ab-m3-depth-rotate,0deg))}.js .ab-m3.is-ab-m3-visible.ab-scroll-skew{transform:skewY(var(--ab-m3-scroll-skew))}.js .ab-m3.is-ab-m3-visible.ab-scroll-tilt{transform:perspective(900px) rotateX(var(--ab-m3-tilt-x)) rotateY(var(--ab-m3-tilt-y))}.js .ab-m3.is-ab-m3-visible.ab-scroll-depth{transform:perspective(1100px) rotateX(var(--ab-m3-depth-rotate,0deg))}.js .ab-m3.is-ab-m3-visible.ab-hover-tilt:hover{transform:perspective(850px) rotateX(var(--ab-m3-tilt-x)) rotateY(var(--ab-m3-tilt-y))}.ab-scroll-progress{position:relative}.ab-scroll-progress::after{content:"";position:absolute;z-index:3;inset:auto 0 0;height:2px;background:var(--ab-accent);transform:scaleX(var(--ab-m3-progress,0));transform-origin:left}.ab-scroll-pin{position:sticky;top:clamp(1rem,8vh,6rem)}
.ab-m3[class*="ab-hover-"],.ab-m3[class*="ab-press-"]{position:relative;isolation:isolate}.ab-hover-lift{transition:translate var(--ab-m3-local-duration) var(--ab-m3-local-ease),box-shadow var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-lift:hover{translate:0 calc(var(--ab-m3-local-distance) * -.14);box-shadow:0 1rem 2.4rem color-mix(in srgb,var(--ab-ink) 15%,transparent)}.ab-hover-glow{transition:box-shadow var(--ab-m3-local-duration) var(--ab-m3-local-ease),filter var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-glow:hover{box-shadow:0 0 0 1px color-mix(in srgb,var(--ab-accent) 50%,transparent),0 0 2.2rem color-mix(in srgb,var(--ab-accent) 42%,transparent);filter:saturate(1.08)}.ab-hover-shine,.ab-hover-fill,.ab-hover-spotlight,.ab-hover-border-draw{overflow:hidden}.ab-hover-shine::before{content:"";position:absolute;z-index:-1;inset:-80% auto -80% -45%;width:32%;background:linear-gradient(90deg,transparent,rgb(255 255 255 / .52),transparent);transform:skewX(-18deg) translateX(-230%);transition:transform calc(var(--ab-m3-local-duration) * 1.4) var(--ab-m3-local-ease)}.ab-hover-shine:hover::before{transform:skewX(-18deg) translateX(620%)}.ab-hover-fill::before{content:"";position:absolute;z-index:-1;inset:0;background:color-mix(in srgb,var(--ab-accent) 18%,transparent);transform:scaleX(0);transform-origin:left;transition:transform var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-fill:hover::before{transform:scaleX(1)}.ab-hover-underline::after{content:"";position:absolute;left:0;right:0;bottom:-.16em;height:.12em;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-underline:hover::after{transform:scaleX(1);transform-origin:left}.ab-hover-arrow::after{content:"→";display:inline-block;margin-inline-start:.5em;transition:transform var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-arrow:hover::after{transform:translateX(.35em)}.ab-hover-magnetic{translate:var(--ab-m3-magnetic-x) var(--ab-m3-magnetic-y);transition:translate 140ms ease-out,box-shadow var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-tilt{transform:perspective(850px) rotateX(var(--ab-m3-tilt-x)) rotateY(var(--ab-m3-tilt-y));transition:transform 140ms ease-out,box-shadow var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-spotlight::before{content:"";position:absolute;z-index:-1;inset:-1px;background:radial-gradient(circle at var(--ab-m3-spot-x) var(--ab-m3-spot-y),color-mix(in srgb,var(--ab-accent) 30%,transparent),transparent 44%);opacity:0;transition:opacity var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-spotlight:hover::before{opacity:1}.ab-hover-border-draw::after{content:"";position:absolute;pointer-events:none;inset:0;border:2px solid var(--ab-accent);border-radius:inherit;clip-path:inset(0 100% 100% 0);transition:clip-path var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-border-draw:hover::after{clip-path:inset(0)}.ab-hover-icon-slide :where(svg,.ab-icon){transition:transform var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-icon-slide:hover :where(svg,.ab-icon){transform:translateX(.3rem)}.ab-hover-jelly:hover{animation:ab-m3-jelly 560ms both}.ab-hover-bounce:hover{animation:ab-m3-hover-bounce 520ms both}.ab-hover-pulse:hover{animation:ab-m3-hover-pulse 900ms ease-in-out infinite}.ab-hover-soften{transition:opacity var(--ab-m3-local-duration) var(--ab-m3-local-ease),filter var(--ab-m3-local-duration) var(--ab-m3-local-ease)}.ab-hover-soften:hover{filter:saturate(1.08) contrast(1.02);opacity:.9}
.ab-press-compress:active{scale:.96}.ab-press-push:active{translate:0 2px}.ab-press-depress:active{translate:0 2px;box-shadow:inset 0 .15rem .5rem rgb(0 0 0 / .18)}.ab-press-bounce:active{animation:ab-m3-press-bounce 340ms both}.ab-press-rubber:active{animation:ab-m3-rubber 430ms both}.ab-press-pulse:active{animation:ab-m3-press-pulse 360ms both}.ab-m3-ripple{position:absolute;z-index:0;border-radius:50%;pointer-events:none;background:currentColor;opacity:.18;transform:translate(-50%,-50%) scale(0);animation:ab-m3-ripple 620ms ease-out forwards}
.ab-loop-float{animation:ab-m3-float 4.8s ease-in-out infinite}.ab-loop-breathe{animation:ab-m3-breathe 4s ease-in-out infinite}.ab-loop-pulse{animation:ab-m3-loop-pulse 2.4s ease-in-out infinite}.ab-loop-bob{animation:ab-m3-bob 2.8s ease-in-out infinite}.ab-loop-sway{animation:ab-m3-sway 4.2s ease-in-out infinite}.ab-loop-wiggle{animation:ab-m3-wiggle 1.7s ease-in-out infinite}.ab-loop-shimmer{background-size:220% 100%;animation:ab-m3-shimmer 3.2s linear infinite}.ab-loop-gradient{background-size:220% 220%;animation:ab-m3-gradient 7s ease infinite}.ab-loop-spin{animation:ab-m3-spin 10s linear infinite}.ab-loop-glow{animation:ab-m3-glow 3s ease-in-out infinite}.ab-loop-dash{background-image:linear-gradient(90deg,transparent,color-mix(in srgb,var(--ab-accent) 24%,transparent),transparent);background-size:260% 100%;animation:ab-m3-dash 3.6s linear infinite}.ab-m3[class*="ab-loop-"]:hover{animation-play-state:paused}
@keyframes ab-m3-jelly{0%,100%{scale:1}30%{scale:1.06 .94}55%{scale:.97 1.03}75%{scale:1.02 .98}}@keyframes ab-m3-hover-bounce{0%,100%{translate:0 0}45%{translate:0 -7px}70%{translate:0 -2px}}@keyframes ab-m3-hover-pulse{50%{scale:1.035}}@keyframes ab-m3-press-bounce{50%{scale:.92}}@keyframes ab-m3-rubber{30%{scale:1.08 .9}60%{scale:.96 1.04}}@keyframes ab-m3-press-pulse{50%{scale:.93;filter:brightness(.94)}}@keyframes ab-m3-ripple{to{opacity:0;transform:translate(-50%,-50%) scale(1)}}@keyframes ab-m3-float{50%{translate:0 -10px}}@keyframes ab-m3-breathe{50%{scale:1.035}}@keyframes ab-m3-loop-pulse{50%{opacity:.68}}@keyframes ab-m3-bob{50%{translate:0 -6px}}@keyframes ab-m3-sway{25%{rotate:-1deg}75%{rotate:1deg}}@keyframes ab-m3-wiggle{20%,80%{rotate:-1.4deg}40%,60%{rotate:1.4deg}}@keyframes ab-m3-shimmer{to{background-position:-220% 0}}@keyframes ab-m3-gradient{50%{background-position:100% 50%}}@keyframes ab-m3-spin{to{rotate:1turn}}@keyframes ab-m3-glow{50%{filter:drop-shadow(0 0 1.2rem color-mix(in srgb,var(--ab-accent) 52%,transparent))}}@keyframes ab-m3-dash{to{background-position:-260% 0}}
@media (hover:none),(pointer:coarse){.ab-hover-magnetic,.ab-hover-tilt{translate:0 0;transform:none}}
@media (prefers-reduced-motion:reduce){html[data-ab-motion-engine="3"]{--ab-m3-duration:1ms;--ab-m3-delay:0ms;--ab-m3-stagger:0ms;--ab-m3-distance:0px}.js .ab-m3,.js .ab-m3[class*="ab-enter-"],.js .ab-m3[class*="ab-choreo-"]>*{opacity:1!important;transform:none!important;translate:0 0!important;scale:1!important;rotate:0deg!important;filter:none!important;clip-path:none!important;transition:none!important;animation:none!important}.ab-m3::before,.ab-m3::after{animation:none!important;transition:none!important}}
`;

export const MOTION3_RUNTIME = String.raw`
;(() => {
  const ready = (callback) => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", callback, { once: true }) : callback();
  ready(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = media.matches || root.dataset.motion === "off" || root.dataset.abMotionProfile === "off";
    const nodes = [...document.querySelectorAll(".ab-m3")];
    nodes.forEach((element) => {
      [...element.children].forEach((child, index, children) => {
        child.style.setProperty("--ab-m3-order", String(index));
        const wave = children.length > 1 ? Math.sin((index / (children.length - 1)) * Math.PI) : 0;
        child.style.setProperty("--ab-m3-wave", wave.toFixed(4));
        child.style.setProperty("--ab-m3-list-x", (index % 2 === 0 ? -12 : 12) + "px");
        const angle = children.length ? (index / children.length) * Math.PI * 2 : 0;
        child.style.setProperty("--ab-m3-radial-x", (Math.cos(angle) * 18).toFixed(2) + "px");
        child.style.setProperty("--ab-m3-radial-y", (Math.sin(angle) * 18).toFixed(2) + "px");
      });
    });
    const revealNodes = nodes.filter((element) => [...element.classList].some((name) => name.startsWith("ab-enter-") || name.startsWith("ab-choreo-")));
    if (reduced || !("IntersectionObserver" in window)) revealNodes.forEach((element) => element.classList.add("is-ab-m3-visible"));
    else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-ab-m3-visible");
            if (!entry.target.classList.contains("ab-repeat")) revealObserver.unobserve(entry.target);
          } else if (entry.target.classList.contains("ab-repeat")) entry.target.classList.remove("is-ab-m3-visible");
        });
      }, { rootMargin: "0px 0px -8%", threshold: [0, .08, .22] });
      revealNodes.forEach((element) => revealObserver.observe(element));
    }
    const scrollNodes = reduced ? [] : nodes.filter((element) => [...element.classList].some((name) => name.startsWith("ab-scroll-") && name !== "ab-scroll-none"));
    const activeScrollNodes = new Set();
    let scheduled = 0;
    let lastScrollY = window.scrollY;
    const intensity = (element) => element.classList.contains("ab-intensity-extreme") ? 1.82 : element.classList.contains("ab-intensity-strong") ? 1.38 : element.classList.contains("ab-intensity-subtle") ? .58 : 1;
    const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
    const updateScrollMotion = () => {
      scheduled = 0;
      if (document.hidden) return;
      const viewport = window.innerHeight || 1;
      const documentHeight = Math.max(1, document.documentElement.scrollHeight - viewport);
      root.style.setProperty("--ab-page-progress", clamp(window.scrollY / documentHeight, 0, 1).toFixed(4));
      const velocity = clamp((window.scrollY - lastScrollY) / 48, -1, 1);
      lastScrollY = window.scrollY;
      activeScrollNodes.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const travel = viewport + Math.max(1, bounds.height);
        const progress = clamp((viewport - bounds.top) / travel, 0, 1);
        const center = clamp((bounds.top + bounds.height / 2 - viewport / 2) / (viewport / 2 + bounds.height / 2), -1, 1);
        const visibility = clamp(1 - Math.abs(center), 0, 1);
        const factor = intensity(element);
        const distance = 56 * factor;
        element.style.setProperty("--ab-m3-progress", progress.toFixed(4));
        element.style.setProperty("--ab-m3-visibility", visibility.toFixed(4));
        element.style.setProperty("--ab-m3-scroll-x", element.classList.contains("ab-scroll-parallax-x") ? (-center * distance).toFixed(2) + "px" : "0px");
        element.style.setProperty("--ab-m3-scroll-y", element.classList.contains("ab-scroll-parallax-y") || element.classList.contains("ab-scroll-depth") ? (-center * distance).toFixed(2) + "px" : "0px");
        element.style.setProperty("--ab-m3-scroll-scale", element.classList.contains("ab-scroll-scale") || element.classList.contains("ab-scroll-depth") ? (.9 + visibility * .1).toFixed(4) : "1");
        element.style.setProperty("--ab-m3-scroll-rotate", element.classList.contains("ab-scroll-rotate") ? (center * -5 * factor).toFixed(2) + "deg" : "0deg");
        element.style.setProperty("--ab-m3-scroll-opacity", element.classList.contains("ab-scroll-fade") ? (.28 + visibility * .72).toFixed(4) : "1");
        element.style.setProperty("--ab-m3-scroll-blur", element.classList.contains("ab-scroll-blur") || element.classList.contains("ab-scroll-depth") ? ((1 - visibility) * 8 * factor).toFixed(2) + "px" : "0px");
        element.style.setProperty("--ab-m3-scroll-skew", element.classList.contains("ab-scroll-skew") ? (center * 3.2 * factor).toFixed(2) + "deg" : "0deg");
        element.style.setProperty("--ab-m3-scroll-clip", element.classList.contains("ab-scroll-clip") ? ((1 - visibility) * 22).toFixed(2) + "%" : "0%");
        element.style.setProperty("--ab-m3-tilt-x", element.classList.contains("ab-scroll-tilt") ? (center * 5 * factor).toFixed(2) + "deg" : "0deg");
        element.style.setProperty("--ab-m3-tilt-y", element.classList.contains("ab-scroll-tilt") ? (velocity * -3 * factor).toFixed(2) + "deg" : "0deg");
        element.style.setProperty("--ab-m3-depth-rotate", element.classList.contains("ab-scroll-depth") ? (center * 3 * factor).toFixed(2) + "deg" : "0deg");
      });
      if (activeScrollNodes.size) scheduled = window.requestAnimationFrame(updateScrollMotion);
    };
    const scheduleScrollMotion = () => { if (!scheduled && activeScrollNodes.size && !document.hidden) scheduled = window.requestAnimationFrame(updateScrollMotion); };
    if (scrollNodes.length) {
      if ("IntersectionObserver" in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => entry.isIntersecting ? activeScrollNodes.add(entry.target) : activeScrollNodes.delete(entry.target));
          scheduleScrollMotion();
        }, { rootMargin: "35% 0px 35%", threshold: 0 });
        scrollNodes.forEach((element) => scrollObserver.observe(element));
      } else scrollNodes.forEach((element) => activeScrollNodes.add(element));
      window.addEventListener("resize", scheduleScrollMotion, { passive: true });
      document.addEventListener("visibilitychange", scheduleScrollMotion);
      scheduleScrollMotion();
    }
    const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (finePointer) {
      document.querySelectorAll(".ab-hover-magnetic,.ab-hover-tilt,.ab-hover-spotlight").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
          const bounds = element.getBoundingClientRect();
          const x = clamp((event.clientX - bounds.left) / Math.max(1, bounds.width), 0, 1);
          const y = clamp((event.clientY - bounds.top) / Math.max(1, bounds.height), 0, 1);
          element.style.setProperty("--ab-m3-spot-x", (x * 100).toFixed(2) + "%");
          element.style.setProperty("--ab-m3-spot-y", (y * 100).toFixed(2) + "%");
          if (element.classList.contains("ab-hover-magnetic")) {
            element.style.setProperty("--ab-m3-magnetic-x", ((x - .5) * 16).toFixed(2) + "px");
            element.style.setProperty("--ab-m3-magnetic-y", ((y - .5) * 12).toFixed(2) + "px");
          }
          if (element.classList.contains("ab-hover-tilt")) {
            element.style.setProperty("--ab-m3-tilt-x", ((.5 - y) * 10).toFixed(2) + "deg");
            element.style.setProperty("--ab-m3-tilt-y", ((x - .5) * 12).toFixed(2) + "deg");
          }
        });
        element.addEventListener("pointerleave", () => {
          element.style.setProperty("--ab-m3-magnetic-x", "0px");
          element.style.setProperty("--ab-m3-magnetic-y", "0px");
          element.style.setProperty("--ab-m3-tilt-x", "0deg");
          element.style.setProperty("--ab-m3-tilt-y", "0deg");
        });
      });
    }
    document.querySelectorAll(".ab-press-ripple").forEach((element) => {
      element.addEventListener("click", (event) => {
        if (reduced) return;
        const bounds = element.getBoundingClientRect();
        const size = Math.max(bounds.width, bounds.height) * 2;
        const ripple = document.createElement("span");
        ripple.className = "ab-m3-ripple";
        ripple.setAttribute("aria-hidden", "true");
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.left = (event.clientX - bounds.left) + "px";
        ripple.style.top = (event.clientY - bounds.top) + "px";
        element.append(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
        window.setTimeout(() => ripple.remove(), 900);
      });
    });
  });
})();
`;
