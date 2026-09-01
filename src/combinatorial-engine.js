import {
  CATALOG as LEGACY_CATALOG,
  compactCatalog as legacyCompactCatalog,
  getBlock as legacyGetBlock,
  getCatalog as legacyGetCatalog
} from "./catalog.js";

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

export function resolvePalette(value = 0) {
  const index = typeof value === "number" ? normalizeIndex(value, 64) : hashString(value) % 64;
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
  const index = typeof value === "number" ? normalizeIndex(value, count) : hashString(value) % count;
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
  const prefix = match[1].toLowerCase();
  const number = Number.parseInt(match[2], 10);
  return { id: `${prefix}${pad(number, 3)}`, prefix, number, family: VIRTUAL_FAMILIES[prefix] };
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
  const style = virtualStyle(match.number);
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
  return freeze({ ...match, target: match.family.target, category: match.family.category, attrs: freeze(attrs), classes: freeze(classes), style });
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

const MACROS = freeze({
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
  "progress-bar": ["metric", "A labelled metric with a generated linear progress treatment.", "ab-x-progress-bar"],
  "progress-ring": ["metric", "A compact metric presented with a circular progress treatment when supported.", "ab-x-progress-ring"],
  skeleton: ["panel", "A reduced-motion-safe loading placeholder for pending interface content.", "ab-x-skeleton", { variant: "plain" }],
  toast: ["status", "A transient status message surface connected to the generated live region.", "ab-x-toast"],
  notification: ["status", "A persistent notification surface for application feedback and alerts.", "ab-x-notification"],
  "alert-banner": ["status", "A full-width alert surface for important recoverable information.", "ab-x-alert-banner"],
  "success-state": ["status", "A semantic success result surface with optional next actions.", "ab-x-success-state"],
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
export const SEMANTIC_CATALOG = freeze(Object.entries(MACROS).map(([name, definition]) => {
  const base = BASE_BY_NAME.get(definition[0]) ?? {};
  return freeze({
    name,
    category: base.category ?? "application",
    summary: definition[1],
    kind: "block",
    variants: base.variants ?? [],
    attributes: base.attributes ?? [],
    children: base.children ?? [],
    examples: [name]
  });
}));
export const SEMANTIC_MACRO_COUNT = SEMANTIC_CATALOG.length;
export const EXTENDED_CATALOG = freeze([...LEGACY_CATALOG, ...SEMANTIC_CATALOG]);
const MACRO_BY_NAME = new Map(SEMANTIC_CATALOG.map((item) => [item.name, item]));

export const CATALOG = LEGACY_CATALOG;

function virtualManifest(name) {
  const virtual = resolveVirtualBlock(name);
  if (!virtual) return undefined;
  const base = BASE_BY_NAME.get(virtual.target) ?? {};
  return freeze({
    name: virtual.id,
    category: virtual.category,
    summary: `Generated ${virtual.family.family} ${virtual.id}; expands to ${virtual.target} with deterministic shape, surface, motion, density and shadow settings.`,
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
  return legacyGetBlock(normalized) ?? MACRO_BY_NAME.get(normalized) ?? virtualManifest(normalized) ?? recipeManifest(normalized);
}

export function getCatalog(options = {}) {
  if (!options.includeMacros && !options.extended) return legacyGetCatalog(options);
  const category = options.category ? String(options.category) : "";
  return category ? EXTENDED_CATALOG.filter((item) => item.category === category) : [...EXTENDED_CATALOG];
}

function compactOne(item, compactTemplate) {
  if (Object.hasOwn(compactTemplate, "n")) {
    return {
      n: item.name,
      ...(Object.hasOwn(compactTemplate, "k") ? { k: item.kind } : {}),
      ...(Object.hasOwn(compactTemplate, "c") ? { c: item.category } : {}),
      ...(Object.hasOwn(compactTemplate, "s") ? { s: item.summary } : {}),
      ...(item.variants?.length ? { v: item.variants } : {}),
      ...(item.attributes?.length ? { a: item.attributes } : {}),
      ...(item.children?.length ? { ch: item.children } : {})
    };
  }
  return {
    name: item.name,
    ...(Object.hasOwn(compactTemplate, "kind") ? { kind: item.kind } : {}),
    ...(Object.hasOwn(compactTemplate, "category") ? { category: item.category } : {}),
    ...(Object.hasOwn(compactTemplate, "summary") ? { summary: item.summary } : {}),
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

function normalizeAttributes(tokens, isSite, design) {
  const output = [];
  for (const token of tokens) {
    const parts = tokenParts(token);
    if (!parts) { output.push(token); continue; }
    if (isSite && DESIGN_KEYS[parts.key]) {
      design[DESIGN_KEYS[parts.key]] = decodeDslValue(parts.value);
      design.active = true;
      continue;
    }
    output.push(`${ATTRIBUTE_ALIASES[parts.key] ?? parts.key}=${parts.value}`);
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
  const macro = MACROS[authoredName];
  const name = virtual?.target ?? macro?.[0] ?? BLOCK_ALIASES[authoredName] ?? authoredName;
  const attrs = normalizeAttributes(tokens, name === "site", design);
  if (macro) {
    applyDefaults(attrs, macro[3] ?? {});
    setAttribute(attrs, "class", macro[2], true);
  }
  if (virtual) {
    applyDefaults(attrs, virtual.attrs);
    setAttribute(attrs, "class", virtual.classes.join(" "), true);
  }
  return `${indentation}${[name, ...attrs].join(" ")}${comment ? ` ${comment}` : ""}`;
}

export function normalizeCompactSource(source) {
  const input = String(source ?? "");
  const selection = { active: false };
  const normalized = input.split(/\r?\n/).map((line) => transformLine(line, selection)).join("\n");
  return freeze({ source: normalized, design: freeze({ ...selection }) });
}

function parseAxis(value, prefix, count, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const match = new RegExp(`^${prefix}?(\\d+)$`, "i").exec(String(value));
  return match ? normalizeIndex(match[1], count) : hashString(value) % count;
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
    active: Boolean(selection.active), recipe,
    primary: safeHex(selection.primary), secondary: safeHex(selection.secondary), background: safeHex(selection.background), foreground: safeHex(selection.foreground),
    fontDisplay: safeFontStack(selection.fontDisplay, recipe.font.display), fontBody: safeFontStack(selection.fontBody, recipe.font.body), fontMono: safeFontStack(selection.fontMono, recipe.font.mono)
  });
}

export function designManifest(selection = {}) {
  const design = resolveDesign(selection);
  if (!design.active) return { active: false, recipes: RECIPE_COUNT, virtualBlocks: VIRTUAL_BLOCK_COUNT, semanticMacros: SEMANTIC_MACRO_COUNT };
  const recipe = design.recipe;
  return {
    active: true, recipe: recipe.id, palette: recipe.palette.id, font: recipe.font.id, shape: recipe.shape.id,
    surface: recipe.surface.id, motion: recipe.motion.id, density: recipe.density.id, shadow: recipe.shadow.id,
    recipes: RECIPE_COUNT, virtualBlocks: VIRTUAL_BLOCK_COUNT, semanticMacros: SEMANTIC_MACRO_COUNT
  };
}
