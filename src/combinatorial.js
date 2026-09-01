import { CATALOG as LEGACY_CATALOG } from "./catalog.js";

const freeze = (value) => Object.freeze(value);
const pad = (value, width) => String(value).padStart(width, "0");

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
  'Gill Sans, "Trebuchet MS", ui-sans-serif, sans-serif',
  'Franklin Gothic, Arial Narrow, ui-sans-serif, sans-serif',
  'Copperplate, Rockwell, ui-serif, serif',
  'Courier, ui-monospace, monospace',
  '"SFMono-Regular", Consolas, ui-monospace, monospace',
  'Chalkboard, "Comic Sans MS", ui-rounded, sans-serif',
  'Geneva, Verdana, ui-sans-serif, sans-serif',
  'Corbel, Calibri, ui-sans-serif, sans-serif',
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
  'Gill Sans, "Trebuchet MS", ui-sans-serif, sans-serif',
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

const SHAPES = freeze([
  "square", "soft", "rounded", "pill", "ticket", "notched", "cut", "squircle",
  "arch", "capsule", "bevel", "diamond", "leaf", "blob", "wave", "tab",
  "folder", "shield", "hex", "octagon", "speech", "ribbon", "stamp", "window"
]);
const SURFACES = freeze(["flat", "paper", "raised", "glass", "outline", "inset", "gradient", "noise", "grid", "glow", "ink", "frost"]);
const MOTIONS = freeze(["none", "fade", "rise", "drop", "slide-left", "slide-right", "scale", "blur", "flip", "tilt", "spring", "stagger", "parallax", "float", "pulse", "reveal"]);
const DENSITIES = freeze(["airy", "comfortable", "balanced", "compact", "dense", "editorial", "dashboard", "touch"]);
const SHADOWS = freeze(["none", "hairline", "soft", "medium", "strong", "long", "glow", "ink"]);
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

export function resolvePalette(value = 0) {
  const index = typeof value === "number" ? normalizeIndex(value, 64) : normalizeIndex(hashString(value), 64);
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
  const index = typeof value === "number" ? normalizeIndex(value, count) : normalizeIndex(hashString(value), count);
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
  const parsed = parseRecipeNumber(id);
  if (parsed === null) return null;
  const paletteIndex = parsed % 64;
  const fontIndex = Math.floor(parsed / 64) % (DISPLAY_STACKS.length * BODY_STACKS.length);
  const shapeIndex = (parsed * 7 + Math.floor(parsed / 64)) % SHAPES.length;
  const surfaceIndex = (parsed * 11 + Math.floor(parsed / 17)) % SURFACES.length;
  const motionIndex = (parsed * 13 + Math.floor(parsed / 29)) % MOTIONS.length;
  const densityIndex = (parsed * 5 + Math.floor(parsed / 41)) % DENSITIES.length;
  const shadowIndex = (parsed * 3 + Math.floor(parsed / 53)) % SHADOWS.length;
  return freeze({
    id: `r${pad(parsed, 4)}`,
    index: parsed,
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
  b: { family: "button", target: "button", category: "navigation", variants: ["solid", "outline", "ghost", "quiet", "icon"] },
  h: { family: "header", target: "header", category: "navigation", variants: ["bar", "split", "floating", "editorial"] },
  ft: { family: "footer", target: "footer", category: "navigation", variants: ["standard", "compact", "index"] },
  hr: { family: "hero", target: "hero", category: "marketing", variants: ["split", "editorial", "centered", "console", "manifesto"] },
  fr: { family: "frame", target: "panel", category: "layout", variants: ["plain", "bordered", "raised", "ink"] },
  cd: { family: "card", target: "card", category: "application", variants: [] },
  sc: { family: "section", target: "section", category: "layout", variants: ["plain", "paper", "ink", "accent", "ruled"] },
  fm: { family: "form", target: "form", category: "application", variants: [] },
  tb: { family: "table", target: "table", category: "application", variants: [] },
  nv: { family: "navigation", target: "nav", category: "navigation", variants: [] }
});

export const VIRTUAL_BLOCK_COUNT = Object.keys(VIRTUAL_FAMILIES).length * VIRTUAL_BLOCKS_PER_FAMILY;

function virtualMatch(name) {
  const match = /^(ft|hr|fr|cd|sc|fm|tb|nv|b|h)(\d{3})$/i.exec(String(name ?? ""));
  if (!match) return null;
  const number = Number.parseInt(match[2], 10);
  const prefix = match[1].toLowerCase();
  return { id: `${prefix}${pad(number, 3)}`, prefix, number, family: VIRTUAL_FAMILIES[prefix] };
}

function styleForIndex(index) {
  return {
    shape: index % SHAPES.length,
    surface: (index * 5 + 1) % SURFACES.length,
    motion: (index * 7 + 1) % MOTIONS.length,
    density: (index * 3 + 2) % DENSITIES.length,
    shadow: (index * 11 + 1) % SHADOWS.length
  };
}

export function resolveVirtualBlock(name) {
  const match = virtualMatch(name);
  if (!match) return null;
  const style = styleForIndex(match.number);
  const variant = match.family.variants.length ? match.family.variants[match.number % match.family.variants.length] : null;
  const attrs = {};
  if (variant) attrs.variant = variant;
  if (match.family.target === "header" && match.number % 3 === 0) attrs.sticky = true;
  if (["hero", "section"].includes(match.family.target) && style.motion !== 0) attrs.reveal = true;
  if (match.family.target === "table" && match.number % 2 === 0) attrs.sortable = true;
  if (match.family.target === "table" && match.number % 3 === 0) attrs.filter = true;
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
  return freeze({ ...match, target: match.family.target, category: match.family.category, attrs: freeze(attrs), classes: freeze(classes), style: freeze(style) });
}

export const BLOCK_ALIASES = freeze({
  st: "site", pg: "page", mn: "main", sec: "section", gr: "grid", stk: "stack", cols: "columns", div: "divider", spc: "spacer",
  hd: "header", nav: "nav", ln: "link", bt: "button", bc: "breadcrumbs", ftr: "footer",
  eye: "eyebrow", ttl: "title", hdn: "heading", txt: "text", bdg: "badge", tg: "tag", ic: "icon", img: "image", cb: "code-block", qt: "quote", lst: "list", it: "item",
  hero: "hero", vis: "visual", pf: "proof", lgs: "logos", sts: "stats", stat: "stat", feats: "features", feat: "feature", spl: "split", steps: "steps", step: "step", testi: "testimonials", price: "pricing", tier: "tier", cmp: "comparison", fq: "faq", qu: "question", call: "cta", news: "newsletter", gal: "gallery", time: "timeline",
  art: "article", prs: "prose", co: "callout",
  app: "app-shell", side: "sidebar", tool: "toolbar", mets: "metrics", met: "metric", ch: "chart", bar: "bar", tbl: "table", col: "column", row: "row", cell: "cell", frm: "form", fld: "field", opt: "option", tabs: "tabs", tab: "tab", pnl: "panel", dlg: "dialog", kb: "kanban", lane: "lane", crd: "card", actv: "activity", evt: "event", empty: "empty-state", status: "status", cat: "catalog"
});

export const ATTRIBUTE_ALIASES = freeze({
  v: "variant", h: "href", i: "icon", cl: "class", l: "label", t: "tone", rv: "reveal", sp: "span", w: "width", a: "align",
  n: "name", val: "value", req: "required", ph: "placeholder", sel: "selected", cur: "current", stk: "sticky", dlg: "dialog", act: "action",
  typ: "type", dis: "disabled", ld: "loading", op: "open", trg: "target", lvl: "level", sz: "size", minl: "minlength", maxl: "maxlength",
  sort: "sortable", filt: "filter", demo: "demo", sub: "submit", ok: "success"
});

const MACRO_DEFINITIONS = freeze({
  frame: ["panel", "A general framed surface with recipe-driven shape, material and elevation.", "ab-x-frame"],
  "browser-frame": ["panel", "A browser-window presentation frame for product screenshots and interactive demonstrations.", "ab-x-browser-frame", { variant: "raised" }],
  "phone-frame": ["panel", "A responsive phone-device frame for mobile interface demonstrations.", "ab-x-phone-frame", { variant: "raised" }],
  "laptop-frame": ["panel", "A wide device frame for application and dashboard previews.", "ab-x-laptop-frame", { variant: "raised" }],
  "window-frame": ["panel", "A desktop-window frame with a compact title-bar treatment.", "ab-x-window-frame", { variant: "bordered" }],
  "glass-card": ["card", "A translucent card surface with readable contrast and restrained blur.", "ab-x-glass-card"],
  "gradient-card": ["card", "A card with a palette-aware gradient surface and complete content slots.", "ab-x-gradient-card"],
  "hover-card": ["card", "An elevated card with keyboard-safe hover and focus motion.", "ab-x-hover-card"],
  "feature-card": ["feature", "A compact capability card with icon, heading, explanation and optional action.", "ab-x-feature-card"],
  "profile-card": ["card", "A profile summary card for people, teams or account identities.", "ab-x-profile-card"],
  "team-card": ["card", "A team summary card with status, description and available actions.", "ab-x-team-card"],
  "task-card": ["card", "A task or work-item card suitable for boards, lists and operational views.", "ab-x-task-card"],
  carousel: ["gallery", "A horizontally navigable content carousel with generated previous and next controls.", "ab-x-carousel", { variant: "rail" }],
  slide: ["item", "One semantic item within a generated carousel or presentation rail.", "ab-x-slide"],
  "masonry-grid": ["gallery", "A responsive masonry-style artifact collection that degrades to a normal grid.", "ab-x-masonry", { variant: "masonry" }],
  marquee: ["logos", "A continuously moving, reduced-motion-safe row for marks, labels or short proof items.", "ab-x-marquee"],
  ticker: ["logos", "A compact motion-safe ticker for short updates, metrics or category labels.", "ab-x-ticker"],
  accordion: ["faq", "An accessible disclosure group for expandable information and settings.", "ab-x-accordion"],
  "accordion-item": ["question", "One native disclosure item within an accordion group.", "ab-x-accordion-item"],
  dropdown: ["question", "A native disclosure-based dropdown surface with keyboard support.", "ab-x-dropdown"],
  drawer: ["dialog", "A modal side drawer with native focus management and focus return.", "ab-x-drawer"],
  sheet: ["dialog", "A bottom-sheet dialog that becomes centered on larger screens.", "ab-x-sheet"],
  modal: ["dialog", "A native modal surface with generated close behavior and accessible focus handling.", "ab-x-modal"],
  "command-palette": ["dialog", "A keyboard-addressable command palette opened with Control or Command plus K.", "ab-x-command-palette"],
  popover: ["panel", "A compact contextual surface for nearby actions or supporting information.", "ab-x-popover", { variant: "raised" }],
  tooltip: ["badge", "A concise supporting label styled for contextual hints without hiding essential content.", "ab-x-tooltip"],
  "button-group": ["stack", "A wrapping group of related actions with consistent spacing and focus visibility.", "ab-x-button-group"],
  "split-button": ["stack", "A grouped primary action and secondary disclosure action.", "ab-x-split-button"],
  "icon-button": ["button", "A compact icon-forward action retaining an accessible text label.", "ab-x-icon-button", { variant: "icon" }],
  fab: ["button", "A floating primary action button with safe mobile positioning.", "ab-x-fab", { variant: "solid" }],
  pagination: ["nav", "An accessible navigation group for moving through paginated records.", "ab-x-pagination"],
  "mega-menu": ["nav", "A responsive multi-group navigation surface for large information architectures.", "ab-x-mega-menu"],
  "nav-rail": ["sidebar", "A compact application navigation rail that expands responsively.", "ab-x-nav-rail"],
  topbar: ["toolbar", "A task-focused top application bar for titles, filters and actions.", "ab-x-topbar"],
  "filter-bar": ["toolbar", "A responsive row of search, filter and sorting controls.", "ab-x-filter-bar"],
  "breadcrumbs-bar": ["breadcrumbs", "A dedicated breadcrumb navigation bar with semantic current-location treatment.", "ab-x-breadcrumbs-bar"],
  "mega-footer": ["footer", "A multi-column footer for large sites with grouped navigation and legal context.", "ab-x-mega-footer", { variant: "standard" }],
  "announcement-bar": ["status", "A prominent but accessible announcement strip for temporary site-wide information.", "ab-x-announcement"],
  "cookie-banner": ["status", "A consent-information surface intended for connection to reviewed preference logic.", "ab-x-cookie-banner"],
  avatar: ["image", "A responsive identity image with consistent sizing and circular treatment.", "ab-x-avatar"],
  "avatar-stack": ["logos", "An overlapping group of identity images or text marks with accessible labels.", "ab-x-avatar-stack"],
  chip: ["badge", "A compact categorical chip for filters, selections and metadata.", "ab-x-chip"],
  pill: ["badge", "A fully rounded status or category label with complete contrast states.", "ab-x-pill"],
  "status-badge": ["badge", "A concise status label using semantic success, warning and danger treatments.", "ab-x-status-badge"],
  counter: ["stat", "A numeric statistic that can animate once when it enters the viewport.", "ab-x-counter"],
  "progress-bar": ["metric", "A labeled metric with a native generated linear progress treatment.", "ab-x-progress-bar"],
  "progress-ring": ["metric", "A compact metric presented with a circular progress treatment when supported.", "ab-x-progress-ring"],
  skeleton: ["panel", "A reduced-motion-safe loading placeholder for pending interface content.", "ab-x-skeleton", { variant: "plain" }],
  toast: ["status", "A transient status message surface connected to the generated live region.", "ab-x-toast"],
  notification: ["status", "A persistent notification surface for application feedback and alerts.", "ab-x-notification"],
  "alert-banner": ["status", "A full-width alert surface for important recoverable information.", "ab-x-alert-banner"],
  "success-state": ["status", "A semantic success result surface with optional next actions.", "ab-x-success-state", { variant: "success" }],
  "error-state": ["empty-state", "A recoverable error result with explanation and a next action.", "ab-x-error-state"],
  "loading-state": ["empty-state", "A clearly labelled pending state that remains legible without animation.", "ab-x-loading-state"],
  search: ["field", "A labelled native search control with autocomplete-friendly semantics.", "ab-x-search", { type: "search" }],
  range: ["field", "A labelled native range control with keyboard and pointer support.", "ab-x-range", { type: "range" }],
  "file-drop": ["field", "A native file input enhanced with drag-and-drop visual feedback.", "ab-x-file-drop", { type: "file" }],
  toggle: ["field", "A labelled checkbox rendered as a switch-style binary control.", "ab-x-toggle", { type: "checkbox" }],
  checkbox: ["field", "A labelled native checkbox control with complete focus and disabled states.", "ab-x-checkbox", { type: "checkbox" }],
  radio: ["field", "A labelled native radio control for one-of-many selections.", "ab-x-radio", { type: "radio" }],
  select: ["field", "A labelled native select control populated by option children.", "ab-x-select", { type: "select" }],
  textarea: ["field", "A labelled multiline text control with validation and help text support.", "ab-x-textarea", { type: "textarea" }],
  "date-picker": ["field", "A labelled native date input that preserves platform accessibility.", "ab-x-date-picker", { type: "date" }],
  "time-picker": ["field", "A labelled native time input that preserves platform accessibility.", "ab-x-time-picker", { type: "time" }],
  "color-picker": ["field", "A labelled native color input for safe local color selection.", "ab-x-color-picker", { type: "color" }],
  segmented: ["tabs", "A keyboard-operable segmented control implemented through the tab contract.", "ab-x-segmented"],
  segment: ["tab", "One selectable segment and its associated content panel.", "ab-x-segment"],
  stepper: ["steps", "An ordered multi-step process or progress indicator with responsive layout.", "ab-x-stepper", { variant: "rail" }],
  "step-item": ["step", "One labelled stage within a stepper, onboarding flow or process.", "ab-x-step-item"],
  "data-grid": ["table", "A filterable and sortable structured data grid using native table semantics.", "ab-x-data-grid"],
  "calendar-grid": ["table", "A structured calendar-like data surface suitable for schedules and availability.", "ab-x-calendar-grid"],
  schedule: ["table", "A structured schedule table for times, owners, locations and statuses.", "ab-x-schedule"],
  inbox: ["table", "A dense message or work queue with filtering and sortable columns.", "ab-x-inbox"],
  feed: ["activity", "A chronological feed of events, updates or notifications.", "ab-x-feed"],
  "chat-thread": ["activity", "A chronological conversation surface built from semantic event items.", "ab-x-chat-thread"],
  message: ["event", "One message or event within a conversation, feed or activity stream.", "ab-x-message"],
  "dashboard-shell": ["app-shell", "A responsive application shell for dashboards and operational workspaces.", "ab-x-dashboard-shell"],
  "kanban-board": ["kanban", "A responsive workflow board with named lanes and task cards.", "ab-x-kanban-board"],
  "kanban-column": ["lane", "One named workflow stage within a generated Kanban board.", "ab-x-kanban-column"],
  "metric-grid": ["metrics", "A dense responsive group of application metrics and trends.", "ab-x-metric-grid", { variant: "grid" }],
  "stat-grid": ["stats", "A responsive group of public-facing statistics or evidence values.", "ab-x-stat-grid", { variant: "cards" }],
  "chart-card": ["panel", "A framed chart surface with room for heading, controls and explanation.", "ab-x-chart-card", { variant: "raised" }],
  "settings-panel": ["form", "A structured settings form with native validation and submission behavior.", "ab-x-settings-panel"],
  "auth-form": ["form", "A compact authentication form contract ready for a reviewed backend adapter.", "ab-x-auth-form"],
  "checkout-form": ["form", "A structured checkout form surface ready for a reviewed payment adapter.", "ab-x-checkout-form"],
  "cart-table": ["table", "A structured cart or order table with quantities, prices and actions.", "ab-x-cart-table"],
  "product-card": ["card", "A commerce product card with media, details, price and action slots.", "ab-x-product-card"],
  "product-grid": ["grid", "A responsive commerce grid for product-card children.", "ab-x-product-grid", { variant: "three" }],
  "review-card": ["testimonial", "A supplied review or quotation card with explicit attribution fields.", "ab-x-review-card"],
  rating: ["stat", "A compact rating value with a visible label and supporting detail.", "ab-x-rating"],
  "logo-wall": ["logos", "A wrapping proof wall for supplied customer, partner or technology marks.", "ab-x-logo-wall"],
  "social-proof": ["proof", "A grounded evidence section combining mechanism, supplied numbers and links.", "ab-x-social-proof", { variant: "rail" }],
  "feature-grid": ["features", "A responsive capability grid composed from semantic feature children.", "ab-x-feature-grid", { variant: "grid" }],
  "pricing-grid": ["pricing", "A responsive pricing surface composed from tier contracts.", "ab-x-pricing-grid", { variant: "cards" }],
  "comparison-table": ["comparison", "A side-by-side capability comparison backed by a semantic table.", "ab-x-comparison-table"],
  "faq-list": ["faq", "An accessible list of native question and answer disclosures.", "ab-x-faq-list"],
  "hero-split": ["hero", "A two-column first-viewport promise with actions and a visual surface.", "ab-x-hero-split", { variant: "split" }],
  "hero-centered": ["hero", "A centered first-viewport promise for focused product or campaign pages.", "ab-x-hero-centered", { variant: "centered" }],
  "hero-console": ["hero", "A technical first-viewport composition with code or terminal evidence.", "ab-x-hero-console", { variant: "console" }],
  "terminal-window": ["code-block", "A copyable terminal-style source surface with a dark visual treatment.", "ab-x-terminal-window", { variant: "dark" }],
  "code-editor": ["code-block", "A copyable editor-style source surface for examples and generated output.", "ab-x-code-editor", { variant: "dark" }],
  "video-frame": ["visual", "A responsive media placeholder for connection to a reviewed video implementation.", "ab-x-video-frame", { variant: "grid" }],
  "map-frame": ["visual", "A responsive map placeholder for connection to a reviewed map implementation.", "ab-x-map-frame", { variant: "grid" }],
  "media-object": ["split", "A responsive media-and-copy composition that stacks cleanly on small screens.", "ab-x-media-object", { variant: "media-left" }],
  "docs-layout": ["article", "A long-form documentation surface with readable measure and structured children.", "ab-x-docs-layout"],
  "callout-note": ["callout", "A neutral informational annotation for documentation and reading surfaces.", "ab-x-callout-note", { variant: "note" }],
  "callout-tip": ["callout", "A positive practical annotation for documentation and onboarding content.", "ab-x-callout-tip", { variant: "tip" }],
  "callout-warning": ["callout", "A warning annotation for constraints, risks or destructive operations.", "ab-x-callout-warning", { variant: "warning" }],
  "timeline-list": ["timeline", "A chronological sequence of supplied milestones, events or releases.", "ab-x-timeline-list"],
  "timeline-item": ["event", "One supplied milestone or event within a chronological timeline.", "ab-x-timeline-item"]
});

const BASE_BY_NAME = new Map(LEGACY_CATALOG.map((item) => [item.name, item]));

function macroManifest(name, definition) {
  const [target, summary] = definition;
  const base = BASE_BY_NAME.get(target) ?? {};
  return freeze({
    name,
    category: base.category ?? "application",
    summary,
    kind: "block",
    variants: base.variants ?? [],
    attributes: base.attributes ?? [],
    children: base.children ?? [],
    examples: [`${name}`]
  });
}

const MACRO_CATALOG = Object.entries(MACRO_DEFINITIONS).map(([name, definition]) => macroManifest(name, definition));
export const CATALOG = freeze([...LEGACY_CATALOG, ...MACRO_CATALOG]);
const CATALOG_BY_NAME = new Map(CATALOG.map((item) => [item.name, item]));

function virtualManifest(name) {
  const virtual = resolveVirtualBlock(name);
  if (!virtual) return undefined;
  const base = BASE_BY_NAME.get(virtual.target) ?? {};
  return freeze({
    name: virtual.id,
    category: virtual.category,
    summary: `Generated ${virtual.family.family} recipe ${virtual.id}; expands to ${virtual.target} with deterministic shape, surface, motion, density and shadow settings.`,
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
    summary: `Generated site design recipe ${recipe.id} using palette ${recipe.palette.id}, font pair ${recipe.font.id}, ${recipe.shape.name} shape, ${recipe.surface.name} surface and ${recipe.motion.name} motion.`,
    kind: "structural",
    variants: [],
    attributes: ["palette", "font", "shape", "surface", "motion-preset", "density", "shadow"],
    children: [],
    examples: [`site "Project" recipe=${recipe.id}`]
  });
}

export function getBlock(name) {
  const normalized = String(name ?? "").toLowerCase();
  return CATALOG_BY_NAME.get(normalized) ?? virtualManifest(normalized) ?? recipeManifest(normalized);
}

export function getCatalog(options = {}) {
  const category = options.category ? String(options.category) : "";
  return category ? CATALOG.filter((item) => item.category === category) : [...CATALOG];
}

export function compactCatalog() {
  return CATALOG.map((item) => ({
    n: item.name,
    c: item.category,
    s: item.summary,
    ...(item.variants?.length ? { v: item.variants } : {}),
    ...(item.attributes?.length ? { a: item.attributes } : {}),
    ...(item.children?.length ? { ch: item.children } : {})
  }));
}

function splitComment(value) {
  let quote = "";
  let escaped = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\" && quote) {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
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
    if (escaped) {
      token += character;
      escaped = false;
      continue;
    }
    if (character === "\\" && quote) {
      token += character;
      escaped = true;
      continue;
    }
    if (quote) {
      token += character;
      if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      token += character;
      continue;
    }
    if (["[", "{", "("].includes(character)) depth += 1;
    if (["]", "}", ")"].includes(character)) depth = Math.max(0, depth - 1);
    if (/\s/.test(character) && depth === 0) {
      if (token) tokens.push(token);
      token = "";
    } else {
      token += character;
    }
  }
  if (token) tokens.push(token);
  return tokens;
}

function decodeDslValue(value) {
  const text = String(value ?? "");
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    if (text.startsWith('"')) {
      try { return JSON.parse(text); } catch { return text.slice(1, -1); }
    }
    return text.slice(1, -1).replace(/\\'/g, "'");
  }
  return text;
}

function encodeDslValue(value) {
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return JSON.stringify(String(value));
}

function tokenParts(token) {
  const equals = token.indexOf("=");
  if (equals <= 0) return null;
  return { key: token.slice(0, equals), value: token.slice(equals + 1) };
}

function setAttribute(tokens, key, value, { mergeClass = false } = {}) {
  const index = tokens.findIndex((token) => tokenParts(token)?.key === key);
  if (index === -1) {
    tokens.push(`${key}=${encodeDslValue(value)}`);
    return;
  }
  if (mergeClass) {
    const parts = tokenParts(tokens[index]);
    const existing = decodeDslValue(parts.value);
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
  r: "recipe", recipe: "recipe", design: "recipe",
  p: "palette", palette: "palette",
  f: "font", font: "font",
  s: "shape", shape: "shape",
  sf: "surface", surface: "surface",
  mo: "motion", "motion-preset": "motion",
  dn: "density", density: "density",
  sd: "shadow", shadow: "shadow",
  primary: "primary", secondary: "secondary", background: "background", foreground: "foreground",
  "font-display": "fontDisplay", "font-body": "fontBody", "font-mono": "fontMono"
});

function normalizeAttributeTokens(tokens, isSite, design) {
  const output = [];
  for (const token of tokens) {
    const parts = tokenParts(token);
    if (!parts) {
      output.push(token);
      continue;
    }
    if (isSite && DESIGN_KEYS[parts.key]) {
      design[DESIGN_KEYS[parts.key]] = decodeDslValue(parts.value);
      design.active = true;
      continue;
    }
    const key = ATTRIBUTE_ALIASES[parts.key] ?? parts.key;
    output.push(`${key}=${parts.value}`);
  }
  return output;
}

function transformLine(line, design) {
  if (!line.trim()) return line;
  const indentation = line.match(/^\s*/)?.[0] ?? "";
  const { code, comment } = splitComment(line.slice(indentation.length));
  if (!code.trim()) return line;
  const tokens = tokenize(code);
  if (!tokens.length) return line;

  const authoredName = tokens.shift().toLowerCase();
  const virtual = resolveVirtualBlock(authoredName);
  const macro = MACRO_DEFINITIONS[authoredName];
  let name = virtual?.target ?? macro?.[0] ?? BLOCK_ALIASES[authoredName] ?? authoredName;
  let attrs = normalizeAttributeTokens(tokens, name === "site", design);

  if (macro) {
    const [, , className, defaults = {}] = macro;
    applyDefaults(attrs, defaults);
    setAttribute(attrs, "class", className, { mergeClass: true });
  }

  if (virtual) {
    applyDefaults(attrs, virtual.attrs);
    setAttribute(attrs, "class", virtual.classes.join(" "), { mergeClass: true });
  }

  const rebuilt = [name, ...attrs].join(" ");
  return `${indentation}${rebuilt}${comment ? ` ${comment}` : ""}`;
}

export function normalizeCompactSource(source) {
  const input = String(source ?? "");
  const design = { active: false };
  const normalized = input.split(/\r?\n/).map((line) => transformLine(line, design)).join("\n");
  const hadFinalNewline = /\r?\n$/.test(input);
  return freeze({ source: hadFinalNewline && !normalized.endsWith("\n") ? `${normalized}\n` : normalized, design: freeze({ ...design }) });
}

function parseAxis(value, prefix, count, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const text = String(value);
  const numeric = new RegExp(`^${prefix}?(\\d+)$`, "i").exec(text);
  return numeric ? normalizeIndex(numeric[1], count) : normalizeIndex(hashString(text), count);
}

function safeHex(value) {
  const text = String(value ?? "").trim();
  return /^#[0-9a-f]{3,8}$/i.test(text) ? text : "";
}

function safeFontStack(value, fallback) {
  const text = String(value ?? "").trim();
  if (!text || text.length > 240 || /[;{}<>\n\r]/.test(text)) return fallback;
  return text;
}

export function resolveDesign(selection = {}) {
  const base = resolveRecipe(selection.recipe ?? "r0000") ?? resolveRecipe("r0000");
  const paletteIndex = parseAxis(selection.palette, "p", 64, base.palette.index);
  const fontCount = DISPLAY_STACKS.length * BODY_STACKS.length;
  const fontIndex = parseAxis(selection.font, "f", fontCount, base.font.index);
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

const RADIUS_VALUES = freeze(["0", ".35rem", ".7rem", "999px", ".2rem .9rem", ".2rem 1rem .2rem 1rem", "0 1rem 0 1rem", "1.2rem", "2rem 2rem .6rem .6rem", "999px", ".2rem", ".4rem", "1.6rem .2rem", "38% 62% 58% 42% / 46% 35% 65% 54%", "1.2rem 3rem", ".8rem .8rem 0 0", ".5rem .5rem 1.4rem 1.4rem", "1.5rem 1.5rem .5rem .5rem", ".55rem", ".65rem", "1.2rem 1.2rem 1.2rem .2rem", ".2rem 1rem", ".25rem", ".65rem"]);
const SHADOW_VALUES = freeze(["none", "0 0 0 1px color-mix(in srgb, var(--ab-ink) 10%, transparent)", "0 .45rem 1.2rem rgb(15 23 42 / .10)", "0 .8rem 2rem rgb(15 23 42 / .16)", "0 1.2rem 3.2rem rgb(15 23 42 / .22)", ".7rem .7rem 0 color-mix(in srgb, var(--ab-accent) 22%, transparent)", "0 0 2rem color-mix(in srgb, var(--ab-accent) 34%, transparent)", ".35rem .35rem 0 var(--ab-ink)"]);

function generatedAxisCss() {
  const shapes = RADIUS_VALUES.map((radius, index) => `.ab-shape-${index}{--ab-local-radius:${radius};border-radius:var(--ab-local-radius)!important}`).join("\n");
  const surfaces = SURFACES.map((surface, index) => {
    const rules = [
      "background:transparent",
      "background:var(--ab-paper)",
      "background:var(--ab-surface);border:1px solid var(--ab-line)",
      "background:color-mix(in srgb,var(--ab-surface) 76%,transparent);backdrop-filter:blur(16px);border:1px solid color-mix(in srgb,var(--ab-line) 72%,transparent)",
      "background:transparent;border:1px solid var(--ab-line-strong)",
      "background:var(--ab-paper-2);box-shadow:inset 0 0 0 1px var(--ab-line)",
      "background:linear-gradient(135deg,color-mix(in srgb,var(--ab-accent) 15%,var(--ab-surface)),var(--ab-surface))",
      "background:var(--ab-paper);background-image:radial-gradient(rgb(15 23 42 / .06) .6px,transparent .6px);background-size:6px 6px",
      "background:var(--ab-paper);background-image:linear-gradient(var(--ab-line) 1px,transparent 1px),linear-gradient(90deg,var(--ab-line) 1px,transparent 1px);background-size:24px 24px",
      "background:var(--ab-surface);box-shadow:0 0 2.5rem color-mix(in srgb,var(--ab-accent) 24%,transparent)",
      "background:var(--ab-ink);color:var(--ab-paper)",
      "background:color-mix(in srgb,var(--ab-paper) 82%,white);backdrop-filter:blur(22px);border:1px solid white"
    ][index];
    return `.ab-surface-${index}{${rules}}`;
  }).join("\n");
  const densities = DENSITIES.map((density, index) => {
    const space = ["1.5", "1.25", "1", ".82", ".68", "1.12", ".76", "1.35"][index];
    return `.ab-density-${index}{--ab-local-space:${space};gap:calc(var(--ab-local-space)*.75rem)}`;
  }).join("\n");
  const shadows = SHADOW_VALUES.map((shadow, index) => `.ab-shadow-${index}{box-shadow:${shadow}!important}`).join("\n");
  const motions = MOTIONS.map((motion, index) => {
    const transforms = ["none", "none", "translateY(22px)", "translateY(-22px)", "translateX(26px)", "translateX(-26px)", "scale(.94)", "scale(.98)", "perspective(700px) rotateX(8deg)", "rotate(-1.5deg) translateY(12px)", "translateY(30px) scale(.96)", "translateY(18px)", "translateY(var(--ab-parallax-y,18px))", "translateY(16px)", "scale(.98)", "translateY(24px)" ];
    return `.js .ab-motion-${index}{opacity:${index === 0 ? "1" : "0"};transform:${transforms[index]};transition:opacity var(--ab-slow,.7s) var(--ab-ease,ease),transform var(--ab-slow,.7s) var(--ab-ease,ease),filter var(--ab-slow,.7s) var(--ab-ease,ease);${index === 7 ? "filter:blur(9px)" : ""}}.js .ab-motion-${index}.is-ab-visible{opacity:1;transform:none;filter:none}`;
  }).join("\n");
  return `${shapes}\n${surfaces}\n${densities}\n${shadows}\n${motions}`;
}

export const ADVANCED_CSS = `
/* AppBlocks Web combinatorial layer */
${generatedAxisCss()}
.ab-vf-button{position:relative;isolation:isolate;min-height:2.75rem;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
.ab-vf-button:hover{transform:translateY(-2px)}
.ab-vf-button:active{transform:translateY(0) scale(.98)}
.ab-vf-header,.ab-vf-footer,.ab-vf-hero,.ab-vf-frame,.ab-vf-card,.ab-vf-section{padding:calc(var(--ab-local-space,1)*1rem)}
.ab-vf-header{border-bottom:1px solid var(--ab-line);backdrop-filter:blur(16px)}
.ab-vf-footer{border-top:1px solid var(--ab-line)}
.ab-vf-card,.ab-x-hover-card{transition:transform .24s ease,box-shadow .24s ease}
.ab-vf-card:hover,.ab-x-hover-card:hover{transform:translateY(-4px)}
.ab-x-frame,.ab-x-browser-frame,.ab-x-phone-frame,.ab-x-laptop-frame,.ab-x-window-frame{position:relative;overflow:hidden}
.ab-x-browser-frame,.ab-x-window-frame{padding-top:2.7rem!important}
.ab-x-browser-frame::before,.ab-x-window-frame::before{content:"";position:absolute;inset:.85rem auto auto 1rem;width:2.5rem;height:.65rem;background:radial-gradient(circle at .35rem 50%,#ff605c .27rem,transparent .29rem),radial-gradient(circle at 1.25rem 50%,#ffbd44 .27rem,transparent .29rem),radial-gradient(circle at 2.15rem 50%,#00ca4e .27rem,transparent .29rem)}
.ab-x-phone-frame{max-width:25rem;margin-inline:auto;border:.65rem solid var(--ab-ink)!important;border-radius:2.2rem!important}
.ab-x-phone-frame::before{content:"";display:block;width:32%;height:.35rem;margin:-.15rem auto .8rem;border-radius:999px;background:var(--ab-ink)}
.ab-x-laptop-frame{border:.45rem solid var(--ab-ink)!important;border-bottom-width:1.1rem!important}
.ab-x-glass-card{background:color-mix(in srgb,var(--ab-surface) 72%,transparent)!important;backdrop-filter:blur(18px);border:1px solid color-mix(in srgb,white 50%,var(--ab-line))!important}
.ab-x-gradient-card{background:linear-gradient(145deg,color-mix(in srgb,var(--ab-accent) 20%,var(--ab-surface)),color-mix(in srgb,var(--ab-accent-2) 13%,var(--ab-surface)))!important}
.ab-x-carousel{display:flex!important;grid-auto-flow:column;grid-auto-columns:minmax(min(82vw,22rem),1fr);gap:1rem;overflow-x:auto!important;scroll-snap-type:x mandatory;scrollbar-width:thin;overscroll-behavior-inline:contain}
.ab-x-carousel>*{flex:0 0 min(82vw,22rem);scroll-snap-align:start}
.ab-carousel-controls{display:flex;justify-content:flex-end;gap:.5rem;margin:.65rem 0 1rem}
.ab-carousel-controls button{display:inline-grid;place-items:center;min-width:2.75rem;min-height:2.75rem;border:1px solid var(--ab-line);border-radius:999px;background:var(--ab-surface);color:var(--ab-ink);font:inherit;cursor:pointer}
.ab-x-marquee,.ab-x-ticker{overflow:hidden;white-space:nowrap}
.ab-x-marquee>* ,.ab-x-ticker>*{animation:ab-x-marquee 24s linear infinite}
@keyframes ab-x-marquee{to{transform:translateX(-35%)}}
.ab-x-drawer[open]{width:min(30rem,92vw);height:100dvh;max-height:none;margin:0 0 0 auto;border-radius:0!important}
.ab-x-sheet[open]{width:min(48rem,100%);margin:auto auto 0;max-height:82dvh;border-radius:1.3rem 1.3rem 0 0!important}
.ab-x-command-palette[open]{width:min(44rem,calc(100% - 1rem));margin:10vh auto auto}
.ab-x-popover{max-width:24rem}
.ab-x-button-group,.ab-x-split-button,.ab-x-pagination{display:flex!important;flex-flow:row wrap;align-items:center;gap:.5rem}
.ab-x-fab{position:fixed!important;z-index:80;right:clamp(1rem,3vw,2rem);bottom:clamp(1rem,3vw,2rem);border-radius:999px!important;box-shadow:var(--ab-shadow-lg)!important}
.ab-x-avatar{aspect-ratio:1;object-fit:cover;border-radius:50%!important}
.ab-x-avatar-stack{display:flex!important;align-items:center}
.ab-x-avatar-stack>*+*{margin-left:-.7rem}
.ab-x-chip,.ab-x-pill,.ab-x-status-badge{border-radius:999px!important}
.ab-x-progress-ring{border-radius:50%!important;aspect-ratio:1;display:grid;place-content:center;background:conic-gradient(var(--ab-accent) calc(var(--ab-progress,50)*1%),var(--ab-line) 0)}
.ab-x-skeleton{min-height:5rem;color:transparent!important;background:linear-gradient(100deg,var(--ab-paper-2) 20%,var(--ab-surface) 40%,var(--ab-paper-2) 60%);background-size:220% 100%;animation:ab-x-skeleton 1.35s ease-in-out infinite}
@keyframes ab-x-skeleton{to{background-position-x:-220%}}
.ab-x-file-drop{outline:2px dashed var(--ab-line-strong);outline-offset:.35rem;transition:background .2s ease,outline-color .2s ease}
.ab-x-file-drop.is-dragover{background:var(--ab-accent-soft);outline-color:var(--ab-accent)}
.ab-x-toggle input[type=checkbox]{appearance:none;width:2.8rem;height:1.55rem;border:1px solid var(--ab-line-strong);border-radius:999px;background:var(--ab-paper-2);cursor:pointer;transition:.2s ease}
.ab-x-toggle input[type=checkbox]::before{content:"";display:block;width:1.15rem;height:1.15rem;margin:.14rem;border-radius:50%;background:var(--ab-muted);transition:.2s ease}
.ab-x-toggle input[type=checkbox]:checked{background:var(--ab-accent)}
.ab-x-toggle input[type=checkbox]:checked::before{transform:translateX(1.22rem);background:white}
.ab-x-announcement,.ab-x-cookie-banner,.ab-x-alert-banner{width:100%;border-radius:0!important}
.ab-x-media-object{align-items:center}
.ab-parallax{will-change:transform}
[data-ab-stagger]>*{transition-delay:calc(var(--ab-stagger,0)*55ms)}
@media (max-width:760px){.ab-x-drawer[open],.ab-x-sheet[open]{width:100%;max-width:none}.ab-x-carousel>*{flex-basis:88vw}.ab-x-fab{right:1rem;bottom:1rem}}
@media (prefers-reduced-motion:reduce){.js [class*="ab-motion-"]{opacity:1!important;transform:none!important;filter:none!important}.ab-x-marquee>*,.ab-x-ticker>*,.ab-x-skeleton{animation:none!important}.ab-parallax{transform:none!important}}
`;

export const ADVANCED_RUNTIME = String.raw`
;(() => {
  const onReady = (callback) => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", callback, { once: true }) : callback();
  onReady(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
    const animated = [...document.querySelectorAll('[class*="ab-motion-"]')];
    animated.forEach((element) => {
      if (element.classList.contains("ab-motion-11")) {
        element.dataset.abStagger = "true";
        [...element.children].forEach((child, index) => child.style.setProperty("--ab-stagger", String(index)));
      }
    });
    if (reduced || !("IntersectionObserver" in window)) {
      animated.forEach((element) => element.classList.add("is-ab-visible"));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-ab-visible");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
      animated.forEach((element) => observer.observe(element));
    }

    const parallax = reduced ? [] : [...document.querySelectorAll(".ab-parallax")];
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      parallax.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const offset = Math.max(-28, Math.min(28, (window.innerHeight / 2 - bounds.top) * 0.035));
        element.style.setProperty("--ab-parallax-y", `${offset}px`);
      });
    };
    if (parallax.length) {
      window.addEventListener("scroll", () => {
        if (!frame) frame = window.requestAnimationFrame(updateParallax);
      }, { passive: true });
      updateParallax();
    }

    document.querySelectorAll(".ab-x-carousel:not([data-ab-carousel-ready])").forEach((carousel, carouselIndex) => {
      carousel.dataset.abCarouselReady = "true";
      carousel.setAttribute("role", "region");
      if (!carousel.getAttribute("aria-label")) carousel.setAttribute("aria-label", `Carousel ${carouselIndex + 1}`);
      const controls = document.createElement("div");
      controls.className = "ab-carousel-controls";
      const makeButton = (label, direction, glyph) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", label);
        button.textContent = glyph;
        button.addEventListener("click", () => carousel.scrollBy({ left: carousel.clientWidth * 0.82 * direction, behavior: reduced ? "auto" : "smooth" }));
        return button;
      };
      controls.append(makeButton("Previous items", -1, "←"), makeButton("Next items", 1, "→"));
      carousel.insertAdjacentElement("afterend", controls);
    });

    document.addEventListener("keydown", (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      const palette = document.querySelector("dialog.ab-x-command-palette");
      if (!palette) return;
      event.preventDefault();
      if (!palette.open) palette.showModal();
      palette.querySelector('input[type="search"],input,button')?.focus();
    });

    document.querySelectorAll(".ab-x-file-drop").forEach((field) => {
      ["dragenter", "dragover"].forEach((type) => field.addEventListener(type, (event) => {
        event.preventDefault();
        field.classList.add("is-dragover");
      }));
      ["dragleave", "drop"].forEach((type) => field.addEventListener(type, () => field.classList.remove("is-dragover")));
    });

    const counters = [...document.querySelectorAll(".ab-x-counter")];
    const animateCounter = (element) => {
      if (reduced || element.dataset.abCounted) return;
      const valueNode = element.querySelector("[data-value],strong,b") ?? element;
      const match = valueNode.textContent.match(/-?\d+(?:[.,]\d+)?/);
      if (!match) return;
      const target = Number(match[0].replace(",", "."));
      if (!Number.isFinite(target)) return;
      element.dataset.abCounted = "true";
      const prefix = valueNode.textContent.slice(0, match.index);
      const suffix = valueNode.textContent.slice((match.index ?? 0) + match[0].length);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 700);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased * 10) / 10;
        valueNode.textContent = `${prefix}${current}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (reduced || !("IntersectionObserver" in window)) counters.forEach(animateCounter);
    else {
      const counterObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }), { threshold: 0.35 });
      counters.forEach((counter) => counterObserver.observe(counter));
    }
  });
})();
`;

export function buildDesignCss(selection = {}) {
  const design = resolveDesign(selection);
  if (!design.active) return "";
  const { recipe } = design;
  const hue = recipe.palette.hue;
  const secondaryHue = recipe.palette.secondaryHue;
  const saturation = recipe.palette.saturation;
  const primary = design.primary || `hsl(${hue} ${saturation}% 46%)`;
  const secondary = design.secondary || `hsl(${secondaryHue} ${Math.max(45, saturation - 8)}% 48%)`;
  const background = design.background || `hsl(${hue} 22% 97%)`;
  const foreground = design.foreground || `hsl(${hue} 28% 12%)`;
  const radius = RADIUS_VALUES[recipe.shape.index];
  const shadow = SHADOW_VALUES[recipe.shadow.index];
  const densityScale = [1.16, 1.08, 1, .92, .84, 1.05, .88, 1.12][recipe.density.index];
  return `
html[data-ab-engine="2"]{
  --ab-accent:${primary};--ab-accent-2:${secondary};--ab-accent-soft:color-mix(in srgb,${primary} 14%,transparent);
  --ab-paper:${background};--ab-paper-2:color-mix(in srgb,${background} 92%,${foreground});--ab-surface:color-mix(in srgb,${background} 96%,white);
  --ab-ink:${foreground};--ab-muted:color-mix(in srgb,${foreground} 62%,${background});--ab-line:color-mix(in srgb,${foreground} 14%,transparent);--ab-line-strong:color-mix(in srgb,${foreground} 28%,transparent);
  --ab-font-display:${design.fontDisplay};--ab-font-body:${design.fontBody};--ab-display:${design.fontDisplay};--ab-sans:${design.fontBody};--ab-mono:${design.fontMono};
  --ab-radius:${radius};--ab-shadow-sm:${shadow};--ab-shadow-md:${shadow};--ab-shadow-lg:${shadow};--ab-density-scale:${densityScale};
}
html[data-ab-engine="2"] body{font-family:var(--ab-font-body);background:var(--ab-paper);color:var(--ab-ink)}
html[data-ab-engine="2"] :where(h1,h2,h3,.ab-title,.ab-heading){font-family:var(--ab-font-display)}
html[data-ab-engine="2"][data-theme="dark"]{--ab-paper:hsl(${hue} 22% 8%);--ab-paper-2:hsl(${hue} 20% 11%);--ab-surface:hsl(${hue} 18% 14%);--ab-ink:hsl(${hue} 18% 94%);--ab-muted:hsl(${hue} 12% 68%);--ab-line:rgb(255 255 255 / .13);--ab-line-strong:rgb(255 255 255 / .25)}
`;
}

export function designManifest(selection = {}) {
  const design = resolveDesign(selection);
  if (!design.active) return { active: false, recipes: RECIPE_COUNT, virtualBlocks: VIRTUAL_BLOCK_COUNT };
  const recipe = design.recipe;
  return {
    active: true,
    recipe: recipe.id,
    palette: recipe.palette.id,
    font: recipe.font.id,
    shape: recipe.shape.id,
    surface: recipe.surface.id,
    motion: recipe.motion.id,
    density: recipe.density.id,
    shadow: recipe.shadow.id,
    recipes: RECIPE_COUNT,
    virtualBlocks: VIRTUAL_BLOCK_COUNT
  };
}
