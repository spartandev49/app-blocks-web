const BLOCK_ALIASES = Object.freeze({
  st: "site", pg: "page", m: "meta", hd: "header", nv: "nav", l: "link", bt: "button", ft: "footer",
  h: "hero", ey: "eyebrow", ti: "title", tx: "text", im: "image", ic: "icon", bd: "badge", tg: "tag",
  sc: "section", gr: "grid", sk: "stack", co: "columns", pn: "panel", cd: "card", sp: "split", dv: "divider",
  fs: "features", f: "feature", ss: "stats", s: "stat", pr: "pricing", tr: "tier", fq: "faq", q: "question",
  ct: "cta", fm: "form", fd: "field", op: "option", tb: "table", cl: "column", rw: "row", ce: "cell",
  ap: "app-shell", sb: "sidebar", tl: "toolbar", ms: "metrics", mt: "metric", ch: "chart", br: "bar",
  ts: "tabs", t: "tab", dg: "dialog", kb: "kanban", ln: "lane", ac: "activity", ev: "event",
  ar: "article", ps: "prose", cb: "code-block", ca: "callout", ls: "list", it: "item"
});

const ATTRIBUTE_ALIASES = Object.freeze({
  r: "recipe", v: "variant", c: "class", i: "id", hr: "href", ico: "icon", a: "align", g: "gap", w: "width",
  rv: "reveal", t: "tone", n: "name", lb: "label", ph: "placeholder", req: "required", sel: "selected",
  cur: "current", act: "action", dlg: "dialog", typ: "type", val: "value", src: "src", alt: "alt",
  sh: "shape", sf: "surface", sy: "system", ff: "font", pal: "palette", den: "density", mot: "motion", dep: "shadow"
});

const ADVANCED_BLOCKS = Object.freeze({
  frame: ["panel", "abx-frame"],
  "browser-frame": ["panel", "abx-browser-frame"],
  "device-frame": ["panel", "abx-device-frame"],
  "window-frame": ["panel", "abx-window-frame"],
  "glass-panel": ["panel", "abx-glass-panel"],
  "floating-panel": ["panel", "abx-floating-panel"],
  carousel: ["section", "abx-carousel"],
  slide: ["panel", "abx-slide"],
  marquee: ["section", "abx-marquee"],
  ticker: ["section", "abx-ticker"],
  drawer: ["panel", "abx-drawer"],
  dropdown: ["panel", "abx-dropdown"],
  popover: ["panel", "abx-popover"],
  tooltip: ["badge", "abx-tooltip"],
  "command-palette": ["panel", "abx-command-palette"],
  "context-menu": ["panel", "abx-context-menu"],
  "nav-dock": ["nav", "abx-nav-dock"],
  pagination: ["nav", "abx-pagination"],
  "mega-menu": ["nav", "abx-mega-menu"],
  "scroll-progress": ["divider", "abx-scroll-progress"],
  accordion: ["faq", "abx-accordion"],
  "accordion-item": ["question", "abx-accordion-item"],
  segmented: ["tabs", "abx-segmented"],
  segment: ["tab", "abx-segment"],
  counter: ["stat", "abx-counter"],
  gauge: ["metric", "abx-gauge"],
  progress: ["metric", "abx-progress"],
  range: ["field", "abx-range"],
  "file-drop": ["field", "abx-file-drop"],
  "upload-zone": ["field", "abx-file-drop"],
  switch: ["field", "abx-switch"],
  rating: ["field", "abx-rating"],
  skeleton: ["panel", "abx-skeleton"],
  avatar: ["badge", "abx-avatar"],
  avatars: ["stack", "abx-avatars"],
  spotlight: ["section", "abx-spotlight"],
  backdrop: ["section", "abx-backdrop"],
  shape: ["panel", "abx-shape"],
  blob: ["panel", "abx-blob"],
  orbit: ["visual", "abx-orbit"],
  particles: ["visual", "abx-particles"],
  constellation: ["visual", "abx-constellation"],
  "code-window": ["code-block", "abx-code-window"],
  "terminal-window": ["code-block", "abx-terminal-window"],
  "data-grid": ["table", "abx-data-grid"],
  "stat-card": ["metric", "abx-stat-card"],
  "auth-shell": ["app-shell", "abx-auth-shell"],
  wizard: ["steps", "abx-wizard"],
  "wizard-step": ["step", "abx-wizard-step"],
  "timeline-item": ["event", "abx-timeline-item"],
  "notification-center": ["activity", "abx-notification-center"],
  "split-pane": ["columns", "abx-split-pane"],
  resizable: ["columns", "abx-resizable"],
  calendar: ["table", "abx-calendar"],
  chat: ["activity", "abx-chat"],
  message: ["event", "abx-message"],
  tree: ["list", "abx-tree"],
  "tree-item": ["item", "abx-tree-item"],
  "empty-illustration": ["empty-state", "abx-empty-illustration"],
  "search-box": ["field", "abx-search-box"],
  "filter-bar": ["toolbar", "abx-filter-bar"],
  "action-bar": ["toolbar", "abx-action-bar"],
  "sticky-note": ["callout", "abx-sticky-note"],
  "media-card": ["card", "abx-media-card"],
  "profile-card": ["card", "abx-profile-card"],
  "product-card": ["card", "abx-product-card"],
  "metric-card": ["metric", "abx-metric-card"],
  "comparison-card": ["panel", "abx-comparison-card"],
  "logo-cloud": ["logos", "abx-logo-cloud"],
  "social-proof": ["proof", "abx-social-proof"],
  "feature-wall": ["features", "abx-feature-wall"],
  "hero-canvas": ["hero", "abx-hero-canvas"],
  "footer-stack": ["footer", "abx-footer-stack"]
});

const FAMILY_DEFINITIONS = Object.freeze([
  ["hd", "header", "abx-header", ["bar", "split", "floating", "editorial"]],
  ["ft", "footer", "abx-footer", ["standard", "compact", "index"]],
  ["fr", "panel", "abx-frame", ["plain", "bordered", "raised", "ink"]],
  ["nv", "nav", "abx-nav", []],
  ["fm", "form", "abx-form", []],
  ["tb", "table", "abx-table", []],
  ["dg", "dialog", "abx-dialog", []],
  ["ct", "cta", "abx-cta", ["band", "editorial", "ink"]],
  ["pr", "pricing", "abx-pricing", ["cards", "table", "ledger"]],
  ["ts", "testimonials", "abx-testimonials", ["single", "grid", "carousel"]],
  ["ch", "chart", "abx-chart", ["bars", "spark", "distribution"]],
  ["mt", "metric", "abx-metric", []],
  ["sh", "app-shell", "abx-app-shell", []],
  ["h", "hero", "abx-hero", ["split", "editorial", "centered", "console", "manifesto"]],
  ["b", "button", "abx-button", ["solid", "outline", "ghost", "quiet", "icon"]],
  ["s", "section", "abx-section", ["plain", "paper", "ink", "accent", "ruled"]],
  ["c", "card", "abx-card", []],
  ["g", "grid", "abx-grid", ["auto", "two", "three", "four", "bento"]],
  ["f", "feature", "abx-feature", []],
  ["p", "panel", "abx-panel", ["plain", "bordered", "raised", "ink"]]
]);

const ALLOWED_FOR_MAPPED = Object.freeze({
  panel: new Set(["variant", "id", "class"]),
  section: new Set(["id", "variant", "label", "width", "align", "reveal", "class"]),
  nav: new Set(["label", "class"]),
  badge: new Set(["variant", "icon", "class"]),
  divider: new Set(["variant", "label", "class"]),
  faq: new Set(["id", "class"]),
  question: new Set(["open", "class"]),
  tabs: new Set(["id", "label", "class"]),
  tab: new Set(["id", "selected", "label", "class"]),
  stat: new Set(["value", "label", "detail", "tone", "class"]),
  metric: new Set(["value", "label", "change", "tone", "progress", "class"]),
  field: new Set(["name", "label", "type", "placeholder", "value", "required", "autocomplete", "help", "options", "min", "max", "step", "pattern", "minlength", "maxlength", "multiple", "accept", "checked", "disabled", "readonly", "class"]),
  stack: new Set(["gap", "align", "class"]),
  visual: new Set(["variant", "label", "class"]),
  "code-block": new Set(["language", "label", "copy", "variant", "class"]),
  table: new Set(["id", "label", "filter", "sortable", "empty", "class"]),
  "app-shell": new Set(["name", "section", "class"]),
  steps: new Set(["id", "variant", "class"]),
  step: new Set(["number", "icon", "class"]),
  event: new Set(["date", "time", "icon", "class"]),
  activity: new Set(["label", "class"]),
  columns: new Set(["variant", "gap", "align", "class"]),
  list: new Set(["ordered", "class"]),
  item: new Set(["icon", "value", "href", "class"]),
  "empty-state": new Set(["title", "text", "icon", "action", "class"]),
  toolbar: new Set(["class"]),
  callout: new Set(["variant", "title", "icon", "class"]),
  card: new Set(["id", "status", "class"]),
  logos: new Set(["label", "muted", "class"]),
  proof: new Set(["variant", "label", "class"]),
  features: new Set(["id", "variant", "label", "class"]),
  hero: new Set(["id", "variant", "align", "visual", "reveal", "class"]),
  footer: new Set(["variant", "logo", "note", "class"]),
  header: new Set(["variant", "logo", "href", "sticky", "theme-toggle", "class"]),
  pricing: new Set(["id", "variant", "currency", "class"]),
  testimonials: new Set(["variant", "placeholder", "class"]),
  chart: new Set(["variant", "label", "unit", "class"]),
  button: new Set(["href", "variant", "tone", "icon", "action", "target", "dialog", "type", "disabled", "loading", "class"]),
  grid: new Set(["variant", "min", "gap", "class"]),
  feature: new Set(["icon", "span", "tone", "class"]),
  form: new Set(["id", "action", "method", "demo", "submit", "success", "target", "class"])
});

const DESIGN_KEYS = new Set(["recipe", "palette", "font", "system", "shape", "surface", "density", "shadow"]);

function splitComment(input) {
  let quote = "";
  let escaped = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (escaped) { escaped = false; continue; }
    if (char === "\\") { escaped = true; continue; }
    if (quote) { if (char === quote) quote = ""; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === "#" && index > 0 && /\s/.test(input[index - 1])) return [input.slice(0, index).trimEnd(), input.slice(index)];
  }
  return [input, ""];
}

function scanTokens(input) {
  const tokens = [];
  let current = "";
  let quote = "";
  let escaped = false;
  for (const char of input) {
    if (escaped) { current += char; escaped = false; continue; }
    if (char === "\\") { current += char; escaped = true; continue; }
    if (quote) {
      current += char;
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") { current += char; quote = char; continue; }
    if (/\s/.test(char)) {
      if (current) { tokens.push(current); current = ""; }
      continue;
    }
    current += char;
  }
  if (current) tokens.push(current);
  return tokens;
}

function unquote(value = "") {
  const text = String(value);
  if (text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))) {
    return text.slice(1, -1).replace(/\\([\\"'])/g, "$1");
  }
  return text;
}

function quote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function safeToken(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "default";
}

function normalizeRecipe(value) {
  const match = String(value ?? "").toLowerCase().match(/^(?:d|recipe-?)?(\d{1,4})$/);
  if (!match) return "d0000";
  return `d${String(Math.min(9999, Number(match[1]))).padStart(4, "0")}`;
}

function parseParts(tokens) {
  const positional = [];
  const attrs = new Map();
  for (const token of tokens) {
    const equal = token.indexOf("=");
    if (equal <= 0) { positional.push(token); continue; }
    const rawKey = token.slice(0, equal);
    const key = ATTRIBUTE_ALIASES[rawKey] ?? rawKey;
    attrs.set(key, token.slice(equal + 1));
  }
  return { positional, attrs };
}

function mergeClass(attrs, ...classes) {
  const existing = attrs.has("class") ? unquote(attrs.get("class")) : "";
  const merged = [...new Set([existing, ...classes].flatMap((value) => String(value || "").split(/\s+/)).filter(Boolean))];
  if (merged.length) attrs.set("class", quote(merged.join(" ")));
}

function axisClasses(family, number) {
  return [
    family,
    `abx-style-${number % 12}`,
    `abx-shape-${Math.floor(number / 3) % 10}`,
    `abx-depth-${Math.floor(number / 7) % 8}`,
    `abx-motion-${Math.floor(number / 11) % 12}`,
    `abx-density-${Math.floor(number / 17) % 8}`,
    `abx-layout-${Math.floor(number / 23) % 10}`
  ];
}

function resolveFamily(name) {
  for (const [prefix, canonical, familyClass, variants] of FAMILY_DEFINITIONS) {
    const match = name.match(new RegExp(`^${prefix}(\\d{3})$`));
    if (!match) continue;
    const number = Number(match[1]);
    return { canonical, familyClass, variants, number, id: `${prefix}${match[1]}` };
  }
  return null;
}

function preserveMappedAttrs(canonical, attrs, optionClasses) {
  const allowed = ALLOWED_FOR_MAPPED[canonical] ?? new Set(["id", "class"]);
  for (const [key, rawValue] of [...attrs]) {
    if (allowed.has(key)) continue;
    if (key === "motion" && /^(?:true|false)$/.test(unquote(rawValue))) continue;
    optionClasses.push(`abx-opt-${safeToken(key)}-${safeToken(unquote(rawValue))}`);
    attrs.delete(key);
  }
}

function applyMappedDefaults(canonical, attrs, positional) {
  if (canonical === "field") {
    if (!attrs.has("type")) attrs.set("type", "text");
    if (!attrs.has("name")) attrs.set("name", safeToken(attrs.has("id") ? unquote(attrs.get("id")) : positional[0] ? unquote(positional[0]) : "field"));
    if (!attrs.has("label")) attrs.set("label", quote(positional[0] ? unquote(positional[0]) : "Field"));
  }
  if (canonical === "tab") {
    if (!attrs.has("id")) attrs.set("id", safeToken(attrs.has("label") ? unquote(attrs.get("label")) : positional[0] ? unquote(positional[0]) : "tab"));
    if (!attrs.has("label") && positional[0]) attrs.set("label", positional[0]);
  }
  if (canonical === "stat" && !attrs.has("value") && positional[0]) attrs.set("value", positional.shift());
  if (canonical === "metric" && !attrs.has("value") && positional[0]) attrs.set("value", positional.shift());
  if (canonical === "visual" && !attrs.has("variant")) attrs.set("variant", "orbit");
  if (canonical === "code-block" && !attrs.has("copy")) attrs.set("copy", "true");
  if (canonical === "range") attrs.set("type", "range");
}

function readGlobalDesign(source) {
  const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", density: "", shadow: "" };
  for (const line of String(source).split(/\r?\n/)) {
    const body = line.trim();
    if (!body || body.startsWith("#")) continue;
    const [withoutComment] = splitComment(body);
    const tokens = scanTokens(withoutComment);
    const name = BLOCK_ALIASES[tokens.shift()] ?? body.split(/\s+/, 1)[0];
    if (name !== "site") continue;
    const { attrs } = parseParts(tokens);
    for (const [key, rawValue] of attrs) {
      if (key === "recipe") design.recipe = normalizeRecipe(unquote(rawValue));
      else if (Object.prototype.hasOwnProperty.call(design, key)) design[key] = safeToken(unquote(rawValue));
    }
    break;
  }
  return design;
}

export function prepareSource(source, options = {}) {
  const input = String(source ?? "");
  const design = readGlobalDesign(input);
  if (options.recipe) design.recipe = normalizeRecipe(options.recipe);
  const recipeIds = new Set([design.recipe]);
  const virtualBlocks = [];
  const advancedBlocks = [];
  const output = [];

  for (const originalLine of input.split(/\r?\n/)) {
    if (!originalLine.trim() || originalLine.trimStart().startsWith("#")) { output.push(originalLine); continue; }
    const indent = originalLine.match(/^\s*/)?.[0] ?? "";
    const [body, comment] = splitComment(originalLine.slice(indent.length));
    const tokens = scanTokens(body);
    if (!tokens.length) { output.push(originalLine); continue; }

    const rawName = tokens.shift();
    let name = BLOCK_ALIASES[rawName] ?? rawName;
    const { positional, attrs } = parseParts(tokens);
    const optionClasses = [];
    let mapped = false;

    const family = resolveFamily(name);
    if (family) {
      name = family.canonical;
      mapped = true;
      virtualBlocks.push(family.id);
      optionClasses.push(...axisClasses(family.familyClass, family.number), `abx-virtual-${family.id}`);
      if (family.variants.length && !attrs.has("variant")) attrs.set("variant", family.variants[family.number % family.variants.length]);
    } else if (ADVANCED_BLOCKS[name]) {
      const [canonical, className] = ADVANCED_BLOCKS[name];
      advancedBlocks.push(name);
      name = canonical;
      mapped = true;
      optionClasses.push(className);
    }

    if (name === "site") {
      for (const key of [...attrs.keys()]) {
        if (key === "recipe") { design.recipe = normalizeRecipe(unquote(attrs.get(key))); recipeIds.add(design.recipe); attrs.delete(key); continue; }
        if (DESIGN_KEYS.has(key)) { design[key] = safeToken(unquote(attrs.get(key))); attrs.delete(key); }
      }
    }

    if (name === "page") {
      const localRecipe = attrs.has("recipe") ? normalizeRecipe(unquote(attrs.get("recipe"))) : design.recipe;
      attrs.delete("recipe");
      recipeIds.add(localRecipe);
      mergeClass(attrs, `ab-recipe-${localRecipe}`,
        design.palette && `ab-palette-${design.palette}`,
        design.font && `ab-font-${design.font}`,
        design.system && `ab-system-${design.system}`,
        design.shape && `ab-shape-${design.shape}`,
        design.surface && `ab-surface-${design.surface}`,
        design.density && `ab-density-${design.density}`,
        design.shadow && `ab-shadow-${design.shadow}`);
    }

    if (mapped) {
      applyMappedDefaults(name, attrs, positional);
      preserveMappedAttrs(name, attrs, optionClasses);
      mergeClass(attrs, optionClasses);
    }

    if ((name === "field") && optionClasses.includes("abx-range")) attrs.set("type", "range");
    if ((name === "field") && optionClasses.includes("abx-file-drop")) attrs.set("type", "file");
    if ((name === "field") && optionClasses.includes("abx-switch")) attrs.set("type", "checkbox");
    if ((name === "field") && optionClasses.includes("abx-rating")) attrs.set("type", "range");

    const rebuilt = [name, ...positional, ...[...attrs].map(([key, value]) => `${key}=${value}`)].join(" ");
    output.push(`${indent}${rebuilt}${comment ? ` ${comment}` : ""}`);
  }

  return {
    source: output.join("\n"),
    design: {
      ...design,
      recipes: [...recipeIds],
      virtualBlocks,
      advancedBlocks,
      sourceBytes: Buffer.byteLength(input),
      sourceCharacters: input.length
    }
  };
}

export const COMPACT_BLOCK_ALIASES = BLOCK_ALIASES;
export const COMPACT_ATTRIBUTE_ALIASES = ATTRIBUTE_ALIASES;
export const ADVANCED_BLOCK_NAMES = Object.freeze(Object.keys(ADVANCED_BLOCKS));
export const VIRTUAL_FAMILIES = Object.freeze(FAMILY_DEFINITIONS.map(([prefix, canonical]) => ({ prefix, canonical, count: 1000 })));
export const VIRTUAL_BLOCK_COUNT = VIRTUAL_FAMILIES.reduce((total, family) => total + family.count, 0);
