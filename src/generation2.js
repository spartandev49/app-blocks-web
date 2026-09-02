import {
  CATALOG as LEGACY_CATALOG,
  compactCatalog as legacyCompactCatalog,
  getBlock as legacyGetBlock,
  getCatalog as legacyGetCatalog
} from "./catalog.js";

const freeze = (value) => Object.freeze(value);
const pad = (value, width) => String(value).padStart(width, "0");

export const CATALOG = LEGACY_CATALOG;
export const RECIPE_COUNT = 10_000;
export const VIRTUAL_BLOCKS_PER_FAMILY = 1_000;

const DISPLAY_STACKS = freeze([
  'Inter, ui-sans-serif, system-ui, sans-serif',
  '"Arial Black", Impact, ui-sans-serif, sans-serif',
  'Avenir, "Avenir Next", ui-sans-serif, sans-serif',
  'Futura, "Century Gothic", ui-sans-serif, sans-serif',
  'Helvetica, Arial, ui-sans-serif, sans-serif',
  '"Trebuchet MS", ui-sans-serif, sans-serif',
  'Verdana, ui-sans-serif, sans-serif',
  'Tahoma, ui-sans-serif, sans-serif',
  'Georgia, "Times New Roman", ui-serif, serif',
  'Baskerville, Georgia, ui-serif, serif',
  'Garamond, "Times New Roman", ui-serif, serif',
  'Palatino, "Book Antiqua", ui-serif, serif',
  'Rockwell, "Roboto Slab", ui-serif, serif',
  'Didot, Bodoni, ui-serif, serif',
  'Optima, Candara, ui-sans-serif, sans-serif',
  '"Gill Sans", "Trebuchet MS", ui-sans-serif, sans-serif',
  '"Franklin Gothic", "Arial Narrow", ui-sans-serif, sans-serif',
  'Copperplate, Rockwell, ui-serif, serif',
  '"SFMono-Regular", Consolas, ui-monospace, monospace',
  'Cambria, Georgia, ui-serif, serif'
]);

const BODY_STACKS = freeze([
  'Inter, ui-sans-serif, system-ui, sans-serif',
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Avenir, "Avenir Next", ui-sans-serif, sans-serif',
  'Helvetica, Arial, ui-sans-serif, sans-serif',
  'Verdana, ui-sans-serif, sans-serif',
  'Tahoma, ui-sans-serif, sans-serif',
  'Optima, Candara, ui-sans-serif, sans-serif',
  '"Gill Sans", "Trebuchet MS", ui-sans-serif, sans-serif',
  'Georgia, "Times New Roman", ui-serif, serif',
  'Baskerville, Georgia, ui-serif, serif',
  'Palatino, "Book Antiqua", ui-serif, serif',
  'Cambria, Georgia, ui-serif, serif',
  'Charter, Georgia, ui-serif, serif',
  'Calibri, Corbel, ui-sans-serif, sans-serif',
  '"SFMono-Regular", Consolas, ui-monospace, monospace',
  'Courier, ui-monospace, monospace'
]);

const MONO_STACKS = freeze([
  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace',
  'Monaco, Consolas, "Courier New", monospace',
  '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
  '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
  '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
  '"Source Code Pro", "SFMono-Regular", Consolas, monospace',
  'Courier, ui-monospace, monospace'
]);

export const SHAPES = freeze([
  "square", "soft", "rounded", "pill", "ticket", "notched", "cut", "squircle",
  "arch", "capsule", "bevel", "diamond", "leaf", "blob", "wave", "tab",
  "folder", "shield", "hex", "octagon", "speech", "ribbon", "stamp", "window"
]);
export const SURFACES = freeze(["flat", "paper", "raised", "glass", "outline", "inset", "gradient", "noise", "grid", "glow", "ink", "frost"]);
export const MOTIONS = freeze(["none", "fade", "rise", "drop", "slide-left", "slide-right", "scale", "blur", "flip", "tilt", "spring", "stagger", "parallax", "float", "pulse", "reveal"]);
export const DENSITIES = freeze(["airy", "comfortable", "balanced", "compact", "dense", "editorial", "dashboard", "touch"]);
export const SHADOWS = freeze(["none", "hairline", "soft", "medium", "strong", "long", "glow", "ink"]);
const PALETTE_MOODS = freeze(["signal", "ocean", "forest", "ember", "orchid", "cobalt", "citrus", "slate", "rose", "mint", "sand", "night", "coral", "aqua", "violet", "mono"]);

export const DESIGN_AXES = freeze({
  recipes: RECIPE_COUNT,
  palettes: 64,
  fontPairings: DISPLAY_STACKS.length * BODY_STACKS.length,
  shapes: SHAPES.length,
  surfaces: SURFACES.length,
  motions: MOTIONS.length,
  densities: DENSITIES.length,
  shadows: SHADOWS.length
});

function normalizeIndex(value, count) {
  const number = Number.parseInt(String(value).replace(/\D/g, ""), 10);
  if (!Number.isFinite(number)) return 0;
  return ((number % count) + count) % count;
}

function hashString(value) {
  let hash = 2166136261;
  for (const character of String(value ?? "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function addressIndex(value, prefix, count) {
  if (typeof value === "number") return normalizeIndex(value, count);
  const match = new RegExp(`^${prefix}?(\\d+)$`, "i").exec(String(value ?? ""));
  return match ? normalizeIndex(match[1], count) : hashString(value) % count;
}

export function resolvePalette(value = 0) {
  const index = addressIndex(value, "p", 64);
  const hue = (index * 47 + Math.floor(index / 8) * 19) % 360;
  const secondaryHue = (hue + 38 + (index % 5) * 17) % 360;
  const saturation = 56 + (index % 4) * 7;
  return freeze({
    id: `p${pad(index, 2)}`,
    index,
    name: `${PALETTE_MOODS[index % PALETTE_MOODS.length]}-${Math.floor(index / PALETTE_MOODS.length) + 1}`,
    hue,
    secondaryHue,
    saturation
  });
}

export function resolveFontPair(value = 0) {
  const count = DISPLAY_STACKS.length * BODY_STACKS.length;
  const index = addressIndex(value, "f", count);
  const displayIndex = index % DISPLAY_STACKS.length;
  const bodyIndex = Math.floor(index / DISPLAY_STACKS.length) % BODY_STACKS.length;
  return freeze({
    id: `f${pad(index, 3)}`,
    index,
    name: `display-${displayIndex + 1}-body-${bodyIndex + 1}`,
    display: DISPLAY_STACKS[displayIndex],
    body: BODY_STACKS[bodyIndex],
    mono: MONO_STACKS[(displayIndex + bodyIndex) % MONO_STACKS.length]
  });
}

function parseRecipeNumber(id) {
  const match = /^(?:r|d)?(\d{1,4})$/i.exec(String(id ?? ""));
  if (!match) return null;
  const index = Number.parseInt(match[1], 10);
  return index >= 0 && index < RECIPE_COUNT ? index : null;
}

export function resolveRecipe(id = "r0000") {
  const index = parseRecipeNumber(id);
  if (index === null) return null;
  const paletteIndex = index % 64;
  const fontIndex = Math.floor(index / 64) % DESIGN_AXES.fontPairings;
  const shapeIndex = (index * 7 + Math.floor(index / 64)) % SHAPES.length;
  const surfaceIndex = (index * 11 + Math.floor(index / 17)) % SURFACES.length;
  const motionIndex = (index * 13 + Math.floor(index / 29)) % MOTIONS.length;
  const densityIndex = (index * 5 + Math.floor(index / 41)) % DENSITIES.length;
  const shadowIndex = (index * 3 + Math.floor(index / 53)) % SHADOWS.length;
  return freeze({
    id: `r${pad(index, 4)}`,
    index,
    palette: resolvePalette(paletteIndex),
    font: resolveFontPair(fontIndex),
    shape: freeze({ id: `s${pad(shapeIndex, 2)}`, index: shapeIndex, name: SHAPES[shapeIndex] }),
    surface: freeze({ id: `u${pad(surfaceIndex, 2)}`, index: surfaceIndex, name: SURFACES[surfaceIndex] }),
    motion: freeze({ id: `m${pad(motionIndex, 2)}`, index: motionIndex, name: MOTIONS[motionIndex] }),
    density: freeze({ id: `d${densityIndex}`, index: densityIndex, name: DENSITIES[densityIndex] }),
    shadow: freeze({ id: `z${shadowIndex}`, index: shadowIndex, name: SHADOWS[shadowIndex] })
  });
}

const VIRTUAL_FAMILIES = freeze({
  b: { family: "button", target: "button", category: "navigation" },
  h: { family: "header", target: "header", category: "navigation" },
  ft: { family: "footer", target: "footer", category: "navigation" },
  hr: { family: "hero", target: "hero", category: "marketing" },
  fr: { family: "frame", target: "panel", category: "layout" },
  cd: { family: "card", target: "card", category: "application" },
  sc: { family: "section", target: "section", category: "layout" },
  fm: { family: "form", target: "form", category: "application" },
  tb: { family: "table", target: "table", category: "application" },
  nv: { family: "navigation", target: "nav", category: "navigation" }
});

export const VIRTUAL_BLOCK_COUNT = Object.keys(VIRTUAL_FAMILIES).length * VIRTUAL_BLOCKS_PER_FAMILY;

function virtualMatch(name) {
  const match = /^(ft|hr|fr|cd|sc|fm|tb|nv|b|h)(\d{3})$/i.exec(String(name ?? ""));
  if (!match) return null;
  const prefix = match[1].toLowerCase();
  const number = Number.parseInt(match[2], 10);
  return { id: `${prefix}${pad(number, 3)}`, prefix, number, family: VIRTUAL_FAMILIES[prefix] };
}

function blockSupports(block, attribute) {
  return Boolean(block?.attributes?.includes(attribute));
}

function virtualStyle(index) {
  return freeze({
    shape: index % SHAPES.length,
    surface: (index * 5 + 1) % SURFACES.length,
    motion: (index * 7 + 1) % MOTIONS.length,
    density: (index * 3 + 2) % DENSITIES.length,
    shadow: (index * 11 + 1) % SHADOWS.length
  });
}

export function resolveVirtualBlock(name) {
  const match = virtualMatch(name);
  if (!match) return null;
  const base = legacyGetBlock(match.family.target);
  const style = virtualStyle(match.number);
  const variants = match.family.target === "button"
    ? (base?.variants ?? []).filter((variant) => variant !== "icon")
    : (base?.variants ?? []);
  const attrs = {};
  if (variants.length) attrs.variant = variants[match.number % variants.length];
  if (blockSupports(base, "sticky") && match.number % 3 === 0) attrs.sticky = true;
  if (blockSupports(base, "reveal") && style.motion !== 0) attrs.reveal = true;
  if (blockSupports(base, "sortable") && match.number % 2 === 0) attrs.sortable = true;
  if (blockSupports(base, "filter") && match.number % 3 === 0) attrs.filter = true;
  const classes = [
    `ab-vf-${match.family.family}`,
    `ab-v-${match.id}`,
    `ab-shape-${style.shape}`,
    `ab-surface-${style.surface}`,
    `ab-motion-${style.motion}`,
    `ab-density-${style.density}`,
    `ab-shadow-${style.shadow}`
  ];
  if (style.motion === 12) classes.push("ab-parallax");
  return freeze({
    ...match,
    target: match.family.target,
    category: match.family.category,
    attrs: freeze(attrs),
    classes: freeze(classes),
    classSupported: blockSupports(base, "class"),
    style
  });
}

export const BLOCK_ALIASES = freeze({
  st: "site", pg: "page", mn: "main", sec: "section", gr: "grid", stk: "stack", cols: "columns", div: "divider", spc: "spacer",
  hd: "header", nav: "nav", ln: "link", bt: "button", bc: "breadcrumbs", ftr: "footer",
  eye: "eyebrow", ttl: "title", hdn: "heading", txt: "text", bdg: "badge", tg: "tag", ic: "icon", img: "image", cb: "code-block", qt: "quote", lst: "list", it: "item",
  vis: "visual", pf: "proof", lgs: "logos", sts: "stats", stat: "stat", feats: "features", feat: "feature", spl: "split", steps: "steps", step: "step", testi: "testimonials", price: "pricing", tier: "tier", cmp: "comparison", fq: "faq", qu: "question", call: "cta", news: "newsletter", gal: "gallery", time: "timeline",
  art: "article", prs: "prose", co: "callout",
  app: "app-shell", side: "sidebar", tool: "toolbar", mets: "metrics", met: "metric", ch: "chart", bar: "bar", tbl: "table", col: "column", row: "row", cell: "cell", frm: "form", fld: "field", opt: "option", tabs: "tabs", tab: "tab", pnl: "panel", dlg: "dialog", kb: "kanban", lane: "lane", crd: "card", actv: "activity", evt: "event", empty: "empty-state", status: "status", cat: "catalog"
});

export const ATTRIBUTE_ALIASES = freeze({
  v: "variant", h: "href", i: "icon", cl: "class", l: "label", t: "tone", rv: "reveal", sp: "span", w: "width", a: "align",
  n: "name", val: "value", req: "required", ph: "placeholder", sel: "selected", cur: "current", stk: "sticky", dlg: "dialog", act: "action",
  typ: "type", dis: "disabled", ld: "loading", op: "open", trg: "target", lvl: "level", sz: "size", minl: "minlength", maxl: "maxlength",
  sort: "sortable", filt: "filter", demo: "demo", sub: "submit", ok: "success"
});

const MACRO_GROUPS = freeze({
  panel: ["frame", "browser-frame", "phone-frame", "laptop-frame", "window-frame", "chart-card", "skeleton", "popover"],
  card: ["glass-card", "gradient-card", "hover-card", "profile-card", "team-card", "task-card", "product-card"],
  feature: ["feature-card"],
  gallery: ["carousel", "masonry-grid"],
  logos: ["marquee", "ticker", "logo-wall", "avatar-stack"],
  faq: ["accordion", "faq-list"],
  question: ["accordion-item", "dropdown"],
  dialog: ["drawer", "sheet", "modal", "command-palette"],
  stack: ["button-group", "split-button"],
  button: ["icon-button", "fab"],
  nav: ["pagination", "mega-menu"],
  sidebar: ["nav-rail"],
  toolbar: ["topbar", "filter-bar"],
  breadcrumbs: ["breadcrumbs-bar"],
  footer: ["mega-footer"],
  status: ["announcement-bar", "cookie-banner", "toast", "notification", "alert-banner", "success-state"],
  image: ["avatar"],
  badge: ["chip", "pill", "status-badge", "tooltip"],
  stat: ["counter", "rating"],
  metric: ["progress-bar", "progress-ring"],
  "empty-state": ["error-state", "loading-state"],
  field: ["search", "range", "file-drop", "toggle", "checkbox", "radio", "select", "textarea", "date-picker", "time-picker", "color-picker"],
  tabs: ["segmented"],
  tab: ["segment"],
  steps: ["stepper"],
  step: ["step-item"],
  table: ["data-grid", "calendar-grid", "schedule", "inbox", "cart-table"],
  activity: ["feed", "chat-thread"],
  event: ["message", "timeline-item"],
  "app-shell": ["dashboard-shell"],
  kanban: ["kanban-board"],
  lane: ["kanban-column"],
  metrics: ["metric-grid"],
  stats: ["stat-grid"],
  form: ["settings-panel", "auth-form", "checkout-form"],
  grid: ["product-grid"],
  testimonial: ["review-card"],
  proof: ["social-proof"],
  features: ["feature-grid"],
  pricing: ["pricing-grid"],
  comparison: ["comparison-table"],
  hero: ["hero-split", "hero-centered", "hero-console"],
  "code-block": ["terminal-window", "code-editor"],
  visual: ["video-frame", "map-frame"],
  split: ["media-object"],
  article: ["docs-layout"],
  callout: ["callout-note", "callout-tip", "callout-warning"],
  timeline: ["timeline-list"]
});

const MACRO_DEFAULTS = freeze({
  "browser-frame": { variant: "raised" }, "phone-frame": { variant: "raised" }, "laptop-frame": { variant: "raised" }, "window-frame": { variant: "bordered" },
  carousel: { variant: "rail" }, "masonry-grid": { variant: "masonry" }, "icon-button": { variant: "icon" }, fab: { variant: "solid" },
  search: { type: "search" }, range: { type: "range" }, "file-drop": { type: "file" }, toggle: { type: "checkbox" }, checkbox: { type: "checkbox" },
  radio: { type: "radio" }, select: { type: "select" }, textarea: { type: "textarea" }, "date-picker": { type: "date" }, "time-picker": { type: "time" }, "color-picker": { type: "color" },
  "metric-grid": { variant: "grid" }, "stat-grid": { variant: "cards" }, "product-grid": { variant: "three" }, "feature-grid": { variant: "grid" },
  "pricing-grid": { variant: "cards" }, "social-proof": { variant: "rail" }, "hero-split": { variant: "split" }, "hero-centered": { variant: "centered" },
  "hero-console": { variant: "console" }, "terminal-window": { variant: "dark" }, "code-editor": { variant: "dark" }, "media-object": { variant: "media-left" },
  "callout-note": { variant: "note" }, "callout-tip": { variant: "tip" }, "callout-warning": { variant: "warning" }
});

const MACRO_SUMMARIES = freeze({
  frame: "A general framed surface.", "browser-frame": "A browser-window presentation frame.", "phone-frame": "A responsive phone-device frame.", "laptop-frame": "A wide laptop presentation frame.", "window-frame": "A desktop-window presentation frame.",
  carousel: "A horizontally navigable content gallery with generated controls.", drawer: "A native modal side drawer.", sheet: "A responsive native bottom sheet.", modal: "A native accessible modal surface.", "command-palette": "A keyboard-addressable command surface opened with Control or Command plus K.",
  search: "A labelled native search field.", range: "A labelled native range control.", "file-drop": "A native file input with drag-and-drop feedback.", toggle: "A labelled checkbox rendered as a switch.",
  "data-grid": "A sortable and filterable native data table.", "dashboard-shell": "A responsive application shell.", "kanban-board": "A responsive workflow board.",
  "hero-split": "A split first-viewport composition.", "hero-centered": "A centered first-viewport composition.", "hero-console": "A technical first-viewport composition.",
  "feature-grid": "A responsive feature collection.", "pricing-grid": "A responsive pricing collection.", "comparison-table": "A semantic capability comparison.", "faq-list": "An accessible disclosure list."
});

const MACRO_DEFINITIONS = {};
for (const [target, names] of Object.entries(MACRO_GROUPS)) {
  for (const name of names) {
    MACRO_DEFINITIONS[name] = freeze({
      name,
      target,
      className: `ab-x-${name}`,
      defaults: freeze({ ...(MACRO_DEFAULTS[name] ?? {}) }),
      summary: MACRO_SUMMARIES[name] ?? `A generated ${name.replaceAll("-", " ")} pattern backed by the canonical ${target} contract.`
    });
  }
}
export const MACROS = freeze(MACRO_DEFINITIONS);

function safeDefaults(definition) {
  const base = legacyGetBlock(definition.target);
  const output = {};
  for (const [key, value] of Object.entries(definition.defaults)) {
    if (!blockSupports(base, key)) continue;
    if (key === "variant" && base?.variants?.length && !base.variants.includes(value)) continue;
    output[key] = value;
  }
  return output;
}

export const SEMANTIC_CATALOG = freeze(Object.values(MACROS).map((definition) => {
  const base = legacyGetBlock(definition.target) ?? {};
  return freeze({
    name: definition.name,
    category: base.category ?? "application",
    summary: definition.summary,
    kind: "block",
    variants: base.variants ?? [],
    attributes: base.attributes ?? [],
    children: base.children ?? [],
    examples: [definition.name]
  });
}));
export const SEMANTIC_MACRO_COUNT = SEMANTIC_CATALOG.length;
export const EXTENDED_CATALOG = freeze([...LEGACY_CATALOG, ...SEMANTIC_CATALOG]);
const MACRO_MANIFESTS = new Map(SEMANTIC_CATALOG.map((item) => [item.name, item]));

function virtualManifest(name) {
  const virtual = resolveVirtualBlock(name);
  if (!virtual) return undefined;
  const base = legacyGetBlock(virtual.target) ?? {};
  return freeze({
    name: virtual.id,
    category: virtual.category,
    summary: `Generated ${virtual.family.family} ${virtual.id}; expands to ${virtual.target} with deterministic design classes.`,
    kind: "block",
    variants: base.variants ?? [],
    attributes: base.attributes ?? [],
    children: base.children ?? [],
    examples: [virtual.id]
  });
}

function recipeManifest(name) {
  const recipe = resolveRecipe(name);
  if (!recipe) return undefined;
  return freeze({
    name: recipe.id,
    category: "document",
    summary: `Generated site recipe ${recipe.id} using ${recipe.palette.id}, ${recipe.font.id}, ${recipe.shape.name}, ${recipe.surface.name} and ${recipe.motion.name}.`,
    kind: "structural",
    variants: [],
    attributes: ["palette", "font", "shape", "surface", "motion-preset", "density", "shadow"],
    children: [],
    examples: [`site "Project" recipe=${recipe.id}`]
  });
}

export function getBlock(name) {
  const normalized = String(name ?? "").toLowerCase();
  return legacyGetBlock(normalized) ?? MACRO_MANIFESTS.get(normalized) ?? virtualManifest(normalized) ?? recipeManifest(normalized);
}

export function getCatalog(options = {}) {
  if (!options.includeMacros && !options.extended) return legacyGetCatalog(options);
  const category = options.category ? String(options.category) : "";
  return category ? EXTENDED_CATALOG.filter((item) => item.category === category) : [...EXTENDED_CATALOG];
}

function compactOne(item, template) {
  if (Object.hasOwn(template, "n")) {
    return {
      n: item.name,
      ...(Object.hasOwn(template, "k") ? { k: item.kind } : {}),
      ...(Object.hasOwn(template, "c") ? { c: item.category } : {}),
      ...(Object.hasOwn(template, "s") ? { s: item.summary } : {}),
      ...(item.variants?.length ? { v: item.variants } : {}),
      ...(item.attributes?.length ? { a: item.attributes } : {}),
      ...(item.children?.length ? { ch: item.children } : {})
    };
  }
  return {
    name: item.name,
    ...(Object.hasOwn(template, "kind") ? { kind: item.kind } : {}),
    ...(Object.hasOwn(template, "category") ? { category: item.category } : {}),
    ...(Object.hasOwn(template, "summary") ? { summary: item.summary } : {}),
    ...(item.variants?.length ? { variants: item.variants } : {}),
    ...(item.attributes?.length ? { attributes: item.attributes } : {}),
    ...(item.children?.length ? { children: item.children } : {})
  };
}

export function compactCatalog(options = {}) {
  const legacy = legacyCompactCatalog(options);
  if (!options.includeMacros && !options.extended) return legacy;
  const template = legacy[0] ?? { n: "" };
  const category = options.category ? String(options.category) : "";
  const macros = category ? SEMANTIC_CATALOG.filter((item) => item.category === category) : SEMANTIC_CATALOG;
  return [...legacy, ...macros.map((item) => compactOne(item, template))];
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
    if (character === "#" && (index === 0 || /\s/.test(value[index - 1]))) return { code: value.slice(0, index).trimEnd(), comment: value.slice(index) };
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
  return equals > 0 ? { key: token.slice(0, equals), value: token.slice(equals + 1) } : null;
}

function setAttribute(tokens, key, value, mergeClass = false) {
  const index = tokens.findIndex((token) => tokenParts(token)?.key === key);
  if (index === -1) {
    tokens.push(`${key}=${encodeDslValue(value)}`);
    return;
  }
  if (mergeClass) {
    const existing = decodeDslValue(tokenParts(tokens[index]).value);
    const merged = [...new Set(`${existing} ${value}`.split(/\s+/).filter(Boolean))].join(" ");
    tokens[index] = `${key}=${encodeDslValue(merged)}`;
  }
}

function applyDefaults(tokens, defaults = {}) {
  for (const [key, value] of Object.entries(defaults)) {
    if (!tokens.some((token) => tokenParts(token)?.key === key)) setAttribute(tokens, key, value);
  }
}

const DESIGN_KEYS = freeze({
  r: "recipe", recipe: "recipe", design: "recipe", p: "palette", palette: "palette", f: "font", font: "font", s: "shape", shape: "shape",
  sf: "surface", surface: "surface", mo: "motion", "motion-preset": "motion", dn: "density", density: "density", sd: "shadow", shadow: "shadow",
  primary: "primary", secondary: "secondary", background: "background", foreground: "foreground",
  "font-display": "fontDisplay", "font-body": "fontBody", "font-mono": "fontMono"
});

function normalizeAttributes(tokens, isSite, state) {
  const output = [];
  for (const token of tokens) {
    const parts = tokenParts(token);
    if (!parts) { output.push(token); continue; }
    if (isSite && DESIGN_KEYS[parts.key]) {
      state.design[DESIGN_KEYS[parts.key]] = decodeDslValue(parts.value);
      state.design.active = true;
      state.features.design = true;
      state.used = true;
      continue;
    }
    const alias = ATTRIBUTE_ALIASES[parts.key];
    if (alias && alias !== parts.key) {
      state.features.aliases = true;
      state.used = true;
    }
    output.push(`${alias ?? parts.key}=${parts.value}`);
  }
  return output;
}

function transformLine(line, state) {
  if (!line.trim()) return line;
  const indentation = line.match(/^\s*/)?.[0] ?? "";
  const { code, comment } = splitComment(line.slice(indentation.length));
  if (!code.trim()) return line;
  const tokens = tokenize(code);
  if (!tokens.length) return line;
  const authoredName = tokens.shift().toLowerCase();
  const alias = BLOCK_ALIASES[authoredName];
  const virtual = resolveVirtualBlock(authoredName);
  const macro = MACROS[authoredName];
  const name = virtual?.target ?? macro?.target ?? alias ?? authoredName;
  const lineUsesBlockFeature = Boolean(virtual || macro || (alias && alias !== authoredName));
  if (virtual) state.features.virtual = true;
  if (macro) state.features.macros = true;
  if (alias && alias !== authoredName) state.features.aliases = true;
  if (lineUsesBlockFeature) state.used = true;
  const beforeAttributes = state.used;
  const attrs = normalizeAttributes(tokens, name === "site", state);
  const lineUsesAttributeFeature = state.used !== beforeAttributes || state.features.design;
  if (!lineUsesBlockFeature && !lineUsesAttributeFeature) return line;
  if (macro) {
    applyDefaults(attrs, safeDefaults(macro));
    const base = legacyGetBlock(macro.target);
    if (blockSupports(base, "class")) setAttribute(attrs, "class", macro.className, true);
  }
  if (virtual) {
    applyDefaults(attrs, virtual.attrs);
    if (virtual.classSupported) setAttribute(attrs, "class", virtual.classes.join(" "), true);
  }
  return `${indentation}${[name, ...attrs].join(" ")}${comment ? ` ${comment}` : ""}`;
}

export function normalizeCompactSource(source) {
  const input = String(source ?? "");
  const state = {
    used: false,
    design: { active: false },
    features: { aliases: false, macros: false, virtual: false, design: false }
  };
  const normalized = input.split(/\r?\n/).map((line) => transformLine(line, state)).join("\n");
  return freeze({
    source: state.used ? normalized : input,
    used: state.used,
    design: freeze({ ...state.design }),
    features: freeze({ ...state.features })
  });
}

function parseAxis(value, prefix, count, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return addressIndex(value, prefix, count);
}

function safeHex(value) {
  const text = String(value ?? "").trim();
  return /^#[0-9a-f]{3,8}$/i.test(text) ? text : "";
}

function safeFontStack(value, fallback) {
  const text = String(value ?? "").trim();
  return !text || text.length > 240 || /[;{}<>\n\r]/.test(text) ? fallback : text;
}

export function resolveDesign(selection = {}) {
  const base = resolveRecipe(selection.recipe ?? "r0000") ?? resolveRecipe("r0000");
  const paletteIndex = parseAxis(selection.palette, "p", 64, base.palette.index);
  const fontIndex = parseAxis(selection.font, "f", DESIGN_AXES.fontPairings, base.font.index);
  const shapeIndex = parseAxis(selection.shape, "s", SHAPES.length, base.shape.index);
  const surfaceIndex = parseAxis(selection.surface, "u", SURFACES.length, base.surface.index);
  const motionIndex = parseAxis(selection.motion, "m", MOTIONS.length, base.motion.index);
  const densityIndex = parseAxis(selection.density, "d", DENSITIES.length, base.density.index);
  const shadowIndex = parseAxis(selection.shadow, "z", SHADOWS.length, base.shadow.index);
  const recipe = freeze({
    ...base,
    palette: resolvePalette(paletteIndex),
    font: resolveFontPair(fontIndex),
    shape: freeze({ id: `s${pad(shapeIndex, 2)}`, index: shapeIndex, name: SHAPES[shapeIndex] }),
    surface: freeze({ id: `u${pad(surfaceIndex, 2)}`, index: surfaceIndex, name: SURFACES[surfaceIndex] }),
    motion: freeze({ id: `m${pad(motionIndex, 2)}`, index: motionIndex, name: MOTIONS[motionIndex] }),
    density: freeze({ id: `d${densityIndex}`, index: densityIndex, name: DENSITIES[densityIndex] }),
    shadow: freeze({ id: `z${shadowIndex}`, index: shadowIndex, name: SHADOWS[shadowIndex] })
  });
  return freeze({
    active: Boolean(selection.active),
    recipe,
    primary: safeHex(selection.primary),
    secondary: safeHex(selection.secondary),
    background: safeHex(selection.background),
    foreground: safeHex(selection.foreground),
    fontDisplay: safeFontStack(selection.fontDisplay, recipe.font.display),
    fontBody: safeFontStack(selection.fontBody, recipe.font.body),
    fontMono: safeFontStack(selection.fontMono, recipe.font.mono)
  });
}

export function designManifest(selection = {}, features = {}) {
  const design = resolveDesign(selection);
  const common = {
    active: design.active,
    recipes: RECIPE_COUNT,
    virtualBlocks: VIRTUAL_BLOCK_COUNT,
    semanticMacros: SEMANTIC_MACRO_COUNT,
    features: { ...features }
  };
  if (!design.active) return common;
  const recipe = design.recipe;
  return {
    ...common,
    recipe: recipe.id,
    palette: recipe.palette.id,
    font: recipe.font.id,
    shape: recipe.shape.id,
    surface: recipe.surface.id,
    motion: recipe.motion.id,
    density: recipe.density.id,
    shadow: recipe.shadow.id
  };
}
