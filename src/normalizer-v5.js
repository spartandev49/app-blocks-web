import { normalizeSource as normalizeGeneration3Source } from "./normalizer-v3.js";
import { BLOCK_ALIASES, MACROS, getBlock, resolveVirtualBlock } from "./generation2.js";
import {
  ASSET_TREATMENTS,
  BLOCK_LAYOUTS,
  CHOREOGRAPHIES,
  ENTER_MOTIONS,
  ELEMENT_LOOK_COUNT,
  FOOTER_ARCHITECTURES,
  GEOMETRIES,
  HOVER_MOTIONS,
  LOOP_MOTIONS,
  MACROSTRUCTURES,
  HERO_ARCHITECTURES,
  NAV_ARCHITECTURES,
  PAGE_KINDS,
  PRESS_MOTIONS,
  SCROLL_MOTIONS,
  SECTION_RHYTHMS,
  SURFACE_LANGUAGES,
  TASTE_GENRES,
  TASTE_ROLES,
  TYPE_VOICES,
  auditTasteSource,
  defaultTasteForBlock,
  resolveElementLook,
  resolveTasteDNA,
  resolveTasteProfile
} from "./taste5.js";
import {
  MOTION5_DURATIONS,
  MOTION5_EASINGS,
  MOTION5_INTENSITIES,
  motion5Classes,
  resolveTasteMotion
} from "./motion5.js";

const freeze = (value) => Object.freeze(value);

const SITE_KEYS = freeze({
  ts: "taste", taste: "taste", dna: "taste", "taste-dna": "taste",
  pk: "pageKind", "page-kind": "pageKind", kind: "pageKind",
  gn: "genre", genre: "genre",
  dv: "variance", variance: "variance", "design-variance": "variance",
  mi: "motionIntensity", "motion-intensity": "motionIntensity",
  vd: "visualDensity", "visual-density": "visualDensity",
  md: "mode", mode: "mode", "taste-mode": "mode"
});

const LOCAL_KEYS = freeze({
  tl: "layout", "taste-layout": "layout",
  tsf: "surface", "taste-surface": "surface",
  tr: "role", "taste-role": "role",
  tty: "type", "taste-type": "type", "type-voice": "type",
  lk: "look", look: "look", "element-look": "look",
  te: "enter", "taste-enter": "enter",
  tsc: "scroll", "taste-scroll": "scroll",
  th: "hover", "taste-hover": "hover",
  tp: "press", "taste-press": "press",
  ta: "loop", "taste-loop": "loop",
  tc: "choreography", "taste-choreography": "choreography",
  tdu: "duration", "taste-duration": "duration",
  tez: "easing", "taste-easing": "easing",
  tix: "intensity", "taste-intensity": "intensity",
  trp: "repeat", "taste-repeat": "repeat"
});

const LAYOUT_ELIGIBLE_BLOCKS = new Set([
  "page", "main", "header", "footer", "hero", "section", "grid", "stack",
  "columns", "panel", "article", "prose"
]);

// Automatic Taste varies the global page, hero, navigation and footer. Local
// layout and material changes are opt-in so unrelated leaf blocks do not become
// competing grids, cards or surfaces.
const AUTO_LAYOUT_BLOCKS = new Set();
const AUTO_SURFACE_BLOCKS = new Set();
const AUTO_LOOK_BLOCKS = new Set();

const ENTRANCE_BLOCKS = new Set([
  "hero", "section", "proof", "logos", "stats", "features", "split", "steps",
  "testimonials", "pricing", "comparison", "faq", "cta", "gallery", "timeline",
  "article", "app-shell", "kanban", "activity", "catalog", "visual", "image"
]);

const SCROLL_BLOCKS = new Set([
  "hero", "section", "proof", "stats", "features", "split", "steps",
  "testimonials", "pricing", "cta", "gallery", "timeline", "article",
  "visual", "image"
]);

const INTERACTIVE_BLOCKS = new Set([
  "link", "button", "logo", "image", "feature", "testimonial", "tier",
  "question", "field", "tab", "item", "panel", "card", "status"
]);

// Type-voice classes belong on actual type-bearing nodes. Applying them to
// structural containers makes display weight, line-height, and numeral scale
// leak into every descendant, which destroys hierarchy and can create extreme
// wrapping in statistics and application surfaces.
const TYPE_CLASS_BLOCKS = new Set([
  "title", "heading", "text", "eyebrow", "badge", "tag", "code", "quote",
  "stat", "metric", "bar", "button", "link"
]);

const CHOREOGRAPHY_BLOCKS = new Set([
  "hero", "section", "proof", "logos", "stats", "features", "split", "steps",
  "testimonials", "pricing", "comparison", "faq", "cta", "gallery", "timeline",
  "app-shell", "kanban", "activity", "metrics"
]);

const ALL_LAYOUTS = freeze([...new Set([
  ...BLOCK_LAYOUTS,
  ...MACROSTRUCTURES,
  ...HERO_ARCHITECTURES,
  ...NAV_ARCHITECTURES,
  ...FOOTER_ARCHITECTURES,
  ...SECTION_RHYTHMS,
  ...ASSET_TREATMENTS,
  "counterflow", "workspace-canvas"
])]);

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

function tokenParts(token) {
  const equals = token.indexOf("=");
  return equals > 0 ? { key: token.slice(0, equals).toLowerCase(), value: token.slice(equals + 1) } : null;
}

function decodeValue(value) {
  const text = String(value ?? "");
  if (text.startsWith('"') && text.endsWith('"')) {
    try { return JSON.parse(text); } catch { return text.slice(1, -1); }
  }
  if (text.startsWith("'") && text.endsWith("'")) return text.slice(1, -1).replace(/\\'/g, "'");
  if (text === "true") return true;
  if (text === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);
  return text;
}

function encodeValue(value) {
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return JSON.stringify(String(value));
}

function canonicalBlock(name) {
  const normalized = String(name ?? "").toLowerCase();
  if (BLOCK_ALIASES[normalized]) return BLOCK_ALIASES[normalized];
  const virtual = resolveVirtualBlock(normalized);
  if (virtual) return virtual.target;
  const macro = MACROS[normalized];
  if (macro) return macro.target;
  return normalized;
}

function supportsClass(authoredName, canonical) {
  const block = getBlock(authoredName) ?? getBlock(canonical);
  return Boolean(block?.attributes?.includes("class"));
}

function mergeClass(tokens, classes) {
  const safe = [...new Set(classes.filter(Boolean).filter((name) => /^[a-zA-Z_][\w-]*$/.test(name)))];
  if (!safe.length) return;
  const index = tokens.findIndex((token) => tokenParts(token)?.key === "class" || tokenParts(token)?.key === "cl");
  if (index === -1) {
    tokens.push(`class=${encodeValue(safe.join(" "))}`);
    return;
  }
  const existing = String(decodeValue(tokenParts(tokens[index]).value));
  const merged = [...new Set(`${existing} ${safe.join(" ")}`.split(/\s+/).filter(Boolean))].join(" ");
  tokens[index] = `class=${encodeValue(merged)}`;
}

function diagnostic(message, line, hint = "") {
  return freeze({ message, line, column: 1, hint, severity: "error" });
}

function validateValue(kind, value) {
  if (value === undefined) return true;
  if (kind === "layout") return ALL_LAYOUTS.includes(String(value));
  if (kind === "surface") return SURFACE_LANGUAGES.includes(String(value));
  if (kind === "role") return TASTE_ROLES.includes(String(value));
  if (kind === "type") return TYPE_VOICES.includes(String(value));
  if (kind === "look") return Boolean(resolveElementLook(value));
  if (kind === "enter") return ENTER_MOTIONS.includes(String(value));
  if (kind === "scroll") return SCROLL_MOTIONS.includes(String(value));
  if (kind === "hover") return HOVER_MOTIONS.includes(String(value));
  if (kind === "press") return PRESS_MOTIONS.includes(String(value));
  if (kind === "loop") return LOOP_MOTIONS.includes(String(value));
  if (kind === "choreography") return CHOREOGRAPHIES.includes(String(value));
  if (kind === "duration") return MOTION5_DURATIONS.includes(String(value));
  if (kind === "easing") return MOTION5_EASINGS.includes(String(value));
  if (kind === "intensity") return MOTION5_INTENSITIES.includes(String(value));
  if (kind === "repeat") return typeof value === "boolean" || ["true", "false", "1", "0"].includes(String(value));
  return true;
}

function scanSelection(source) {
  const selection = { active: false };
  let invalidTaste = null;
  for (const line of String(source ?? "").split(/\r?\n/)) {
    const indentation = line.match(/^\s*/)?.[0] ?? "";
    const { code } = splitComment(line.slice(indentation.length));
    const tokens = tokenize(code);
    if (!tokens.length) continue;
    const canonical = canonicalBlock(tokens[0]);
    for (const token of tokens.slice(1)) {
      const parts = tokenParts(token);
      if (!parts) continue;
      const siteKey = SITE_KEYS[parts.key];
      const localKey = LOCAL_KEYS[parts.key];
      if (siteKey && canonical === "site") {
        selection.active = true;
        selection[siteKey] = decodeValue(parts.value);
        if (siteKey === "taste" && !resolveTasteDNA(selection[siteKey])) invalidTaste = selection[siteKey];
      } else if (localKey) {
        selection.active = true;
      }
    }
  }
  return { selection, invalidTaste };
}

function globalClasses(profile, canonical, blockTaste) {
  const classes = [];
  if (canonical === "page") {
    const macrostructure = MACROSTRUCTURES.includes(blockTaste?.layout) ? blockTaste.layout : profile.macrostructure.name;
    classes.push(
      "ab-t5-page",
      `ab-t5-kind-${profile.pageKind}`,
      `ab-t5-genre-${profile.genre}`,
      `ab-t5-macro-${macrostructure}`,
      `ab-t5-rhythm-${profile.rhythm.name}`,
      `ab-t5-asset-${profile.assetTreatment.name}`
    );
  }
  if (canonical === "header") {
    const architecture = NAV_ARCHITECTURES.includes(blockTaste?.layout) ? blockTaste.layout : profile.navigation.name;
    classes.push(`ab-t5-nav-${architecture}`);
  }
  if (canonical === "footer") {
    const architecture = FOOTER_ARCHITECTURES.includes(blockTaste?.layout) ? blockTaste.layout : profile.footer.name;
    classes.push(`ab-t5-footer-${architecture}`);
  }
  if (canonical === "hero") {
    const architecture = HERO_ARCHITECTURES.includes(blockTaste?.layout) ? blockTaste.layout : profile.hero.name;
    classes.push(`ab-t5-hero-${architecture}`);
  }
  return classes;
}

function filteredMotion(canonical, motion, explicit) {
  const selection = { ...motion };
  if (!ENTRANCE_BLOCKS.has(canonical) && explicit.enter === undefined) selection.enter = "none";
  if (!SCROLL_BLOCKS.has(canonical) && explicit.scroll === undefined) selection.scroll = "none";
  if (!INTERACTIVE_BLOCKS.has(canonical) && explicit.hover === undefined) selection.hover = "none";
  if (!INTERACTIVE_BLOCKS.has(canonical) && explicit.press === undefined) selection.press = "none";
  if (canonical !== "status" && explicit.loop === undefined) selection.loop = "none";
  if (!CHOREOGRAPHY_BLOCKS.has(canonical) && explicit.choreography === undefined) selection.choreography = "none";
  return freeze(selection);
}

function transformLine(line, lineNumber, profile, state) {
  if (!line.trim()) return line;
  const indentation = line.match(/^\s*/)?.[0] ?? "";
  const { code, comment } = splitComment(line.slice(indentation.length));
  if (!code.trim()) return line;
  const tokens = tokenize(code);
  if (!tokens.length) return line;
  const authoredName = tokens[0].toLowerCase();
  const canonical = canonicalBlock(authoredName);
  const explicit = {};
  const output = [tokens[0]];

  for (const token of tokens.slice(1)) {
    const parts = tokenParts(token);
    if (!parts) {
      output.push(token);
      continue;
    }
    if (canonical === "site" && SITE_KEYS[parts.key]) continue;
    const localKey = LOCAL_KEYS[parts.key];
    if (!localKey) {
      output.push(token);
      continue;
    }
    const value = decodeValue(parts.value);
    explicit[localKey] = value;
    if (!validateValue(localKey, value)) {
      state.diagnostics.push(diagnostic(
        `Unknown Taste ${localKey} value '${String(value)}'.`,
        lineNumber,
        localKey === "look" ? `Use e000000 through e${String(ELEMENT_LOOK_COUNT - 1).padStart(6, "0")}.` : "Use an allowlisted Taste value from LLMS-TASTE.txt."
      ));
    }
  }

  if (canonical !== "site" && canonical !== "meta" && supportsClass(authoredName, canonical)) {
    const blockTaste = defaultTasteForBlock(profile, canonical, lineNumber, explicit);
    const motion = filteredMotion(canonical, resolveTasteMotion(profile, canonical, blockTaste.role, explicit), explicit);
    const look = blockTaste.look;
    const useLayout = LAYOUT_ELIGIBLE_BLOCKS.has(canonical) && (explicit.layout !== undefined || AUTO_LAYOUT_BLOCKS.has(canonical));
    const useSurface = explicit.surface !== undefined || AUTO_SURFACE_BLOCKS.has(canonical);
    const useLook = explicit.look !== undefined || AUTO_LOOK_BLOCKS.has(canonical);
    const specializedArchitecture = ["hero", "header", "footer"].includes(canonical);
    const hasMotion = [motion.enter, motion.scroll, motion.hover, motion.press, motion.loop, motion.choreography].some((value) => value && value !== "none");
    const classes = [
      "ab-t5",
      `ab-t5-block-${canonical}`,
      `ab-t5-role-${blockTaste.role}`,
      ...(TYPE_CLASS_BLOCKS.has(canonical) ? [`ab-t5-type-${blockTaste.type}`] : []),
      `ab-t5-seq-${blockTaste.sequence}`,
      ...(useLayout && !specializedArchitecture && canonical !== "page" ? [`ab-t5-layout-${blockTaste.layout}`] : []),
      ...(useSurface && canonical !== "page" ? [`ab-t5-surface-${blockTaste.surface}`] : []),
      ...(useLook && canonical !== "page" ? [
        `ab-t5-shape-${look.shape.index}`,
        `ab-t5-border-${look.border.index}`,
        `ab-t5-shadow-${look.shadow.index}`,
        `ab-t5-density-${look.density.index}`,
        `ab-t5-tone-${look.tone.index}`
      ] : []),
      ...globalClasses(profile, canonical, blockTaste),
      ...(hasMotion ? motion5Classes(motion) : [])
    ];
    mergeClass(output, classes);
    state.usage.blocks += 1;
    if (useLook) state.usage.looks += 1;
    if (useLayout || specializedArchitecture) state.usage.layouts.add(blockTaste.layout);
    if (useSurface) state.usage.surfaces.add(blockTaste.surface);
    state.usage.roles.add(blockTaste.role);
    state.usage.typeVoices.add(blockTaste.type);
    if (hasMotion) {
      state.motion.selections += 1;
      state.motion.entrance.add(motion.enter);
      state.motion.scroll.add(motion.scroll);
      state.motion.hover.add(motion.hover);
      state.motion.press.add(motion.press);
      state.motion.loop.add(motion.loop);
      state.motion.choreography.add(motion.choreography);
    }
  }

  return `${indentation}${output.join(" ")}${comment ? ` ${comment}` : ""}`;
}

export function normalizeTasteSource(source) {
  const authoredSource = String(source ?? "");
  const scanned = scanSelection(authoredSource);
  if (!scanned.selection.active) {
    return freeze({
      source: authoredSource,
      used: false,
      profile: null,
      audit: null,
      diagnostics: freeze([]),
      usage: freeze({ blocks: 0, looks: 0, layouts: freeze([]), surfaces: freeze([]), roles: freeze([]), typeVoices: freeze([]) }),
      motion: freeze({ selections: 0, entrance: freeze([]), scroll: freeze([]), hover: freeze([]), press: freeze([]), loop: freeze([]), choreography: freeze([]) }),
      features: freeze({ taste: false, motion5: false })
    });
  }

  const diagnostics = [];
  if (scanned.invalidTaste !== null) {
    diagnostics.push(diagnostic(
      `Unknown Taste DNA '${String(scanned.invalidTaste)}'.`,
      1,
      "Use t0000000 through t9999999."
    ));
  }
  if (scanned.selection.pageKind && !PAGE_KINDS.includes(String(scanned.selection.pageKind))) {
    diagnostics.push(diagnostic(`Unknown page kind '${String(scanned.selection.pageKind)}'.`, 1, `Use one of: ${PAGE_KINDS.join(", ")}.`));
  }
  if (scanned.selection.genre && !TASTE_GENRES.includes(String(scanned.selection.genre))) {
    diagnostics.push(diagnostic(`Unknown Taste genre '${String(scanned.selection.genre)}'.`, 1, `Use one of: ${TASTE_GENRES.join(", ")}.`));
  }
  for (const [key, label] of [["variance", "design variance"], ["motionIntensity", "motion intensity"], ["visualDensity", "visual density"]]) {
    if (scanned.selection[key] !== undefined) {
      const value = Number(scanned.selection[key]);
      if (!Number.isInteger(value) || value < 1 || value > 10) diagnostics.push(diagnostic(`${label} must be an integer from 1 to 10.`, 1));
    }
  }

  const profile = resolveTasteProfile(scanned.selection);
  const state = {
    diagnostics,
    usage: {
      blocks: 0,
      looks: 0,
      layouts: new Set(),
      surfaces: new Set(),
      roles: new Set(),
      typeVoices: new Set()
    },
    motion: {
      selections: 0,
      entrance: new Set(),
      scroll: new Set(),
      hover: new Set(),
      press: new Set(),
      loop: new Set(),
      choreography: new Set()
    }
  };
  const normalizedLines = authoredSource.split(/\r?\n/).map((line, index) => transformLine(line, index + 1, profile, state));
  const normalizedSource = normalizedLines.join("\n");
  const audit = auditTasteSource(authoredSource, profile);
  const usage = freeze({
    blocks: state.usage.blocks,
    looks: state.usage.looks,
    layouts: freeze([...state.usage.layouts]),
    surfaces: freeze([...state.usage.surfaces]),
    roles: freeze([...state.usage.roles]),
    typeVoices: freeze([...state.usage.typeVoices])
  });
  const motion = freeze({
    selections: state.motion.selections,
    entrance: freeze([...state.motion.entrance]),
    scroll: freeze([...state.motion.scroll]),
    hover: freeze([...state.motion.hover]),
    press: freeze([...state.motion.press]),
    loop: freeze([...state.motion.loop]),
    choreography: freeze([...state.motion.choreography])
  });
  return freeze({
    source: normalizedSource,
    used: true,
    profile,
    audit,
    diagnostics: freeze(state.diagnostics),
    usage,
    motion,
    features: freeze({ taste: true, motion5: true })
  });
}


export function normalizeSource(source) {
  const authoredSource = String(source ?? "");
  const taste = normalizeTasteSource(authoredSource);
  if (!taste.used) {
    const base = normalizeGeneration3Source(authoredSource);
    return Object.freeze({
      ...base,
      tasteUsed: false,
      taste: null,
      features: Object.freeze({ ...base.features, taste: false, motion5: false })
    });
  }
  const base = normalizeGeneration3Source(taste.source);
  return Object.freeze({
    ...base,
    source: base.source,
    used: true,
    tasteUsed: true,
    taste,
    features: Object.freeze({ ...base.features, ...taste.features })
  });
}
