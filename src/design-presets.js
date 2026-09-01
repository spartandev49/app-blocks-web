import {
  BORDERS, DENSITIES, FONT_NAMES, HOVERS, LAYERS, MOTIONS, PALETTE_NAMES, SHADOWS, SHAPES, SPACING, SURFACES,
  DESIGN_RECIPE_COUNT, NAMED_RECIPES, decodeDesignRecipe
} from "./design-data.js";

const freeze = (value) => Object.freeze(value);

function stableSalt(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export const BLOCK_ALIASES = freeze({
  st: "site", pg: "page", mn: "main", sec: "section", g: "grid", stk: "stack", cols: "columns",
  div: "divider", sp: "spacer", hd: "header", nv: "nav", l: "link", b: "button", bc: "breadcrumbs", ft: "footer",
  ey: "eyebrow", t: "title", hh: "heading", tx: "text", bd: "badge", tg: "tag", ic: "icon", im: "image",
  cb: "code-block", q: "quote", ls: "list", it: "item", h: "hero", vis: "visual", pf: "proof", lgs: "logos",
  sts: "stats", stt: "stat", fts: "features", fe: "feature", spl: "split", stepset: "steps", stepitem: "step",
  tm: "testimonials", test: "testimonial", pr: "pricing", tieritem: "tier", cmp: "comparison", fq: "faq", qs: "question",
  ct: "cta", nl: "newsletter", gal: "gallery", tl: "timeline", art: "article", pro: "prose", co: "callout",
  app: "app-shell", sb: "sidebar", tb: "toolbar", mx: "metrics", mt: "metric", ch: "chart", br: "bar",
  tbl: "table", cl: "column", rw: "row", ce: "cell", fm: "form", fld: "field", opt: "option", tabsx: "tabs",
  tabx: "tab", pn: "panel", dlg: "dialog", kb: "kanban", ln: "lane", cd: "card", act: "activity", ev: "event",
  empty: "empty-state", statusx: "status", cat: "catalog", fr: "frame", clu: "cluster", sw: "switcher", reelx: "reel",
  cov: "cover", ctr: "center", lay: "layers", dockx: "dock", sv: "split-view", mas: "masonry", ar: "aspect",
  ann: "announcement", mm: "mega-menu", mg: "menu-group", pag: "pagination", cmdbar: "command-bar", sub: "subnav",
  av: "avatar", avg: "avatar-group", chipx: "chip", key: "kbd", prog: "progress", sk: "skeleton", sep: "separator",
  rate: "rating", med: "media", fig: "figure", cap: "caption", mq: "marquee", cnt: "counter", spot: "spotlight",
  ben: "benefits", beni: "benefit", uc: "use-cases", uci: "use-case", ints: "integrations", inti: "integration",
  case: "case-study", teamx: "team", personx: "person", contactx: "contact", fl: "feature-list", flr: "feature-row",
  acc: "accordion", acci: "accordion-item", car: "carousel", sli: "slide", dr: "drawer", dd: "dropdown", menu: "menu",
  mi: "menu-item", cmd: "command", ci: "command-item", tog: "toggle", rng: "range", drop: "file-drop",
  note: "notification", dlst: "data-list", di: "data-item", cal: "calendar", day: "calendar-day", seg: "segmented",
  segi: "segment", tip: "tooltip", pop: "popover", spin: "spinner"
});

export const ATTRIBUTE_ALIASES = freeze({
  v: "variant", to: "href", i: "icon", a: "align", w: "width", g: "gap", r: "recipe", p: "palette", f: "font",
  df: "display-font", mf: "mono-font", sh: "shape", sf: "surface", ms: "motion-style", an: "animation", dl: "delay",
  du: "duration", stg: "stagger", dn: "density", sd: "shadow", bd: "border", hv: "hover", px: "parallax",
  scr: "scroll", cls: "class", lbl: "label", ph: "placeholder", req: "required", dis: "disabled", sel: "selected",
  cur: "current", tgt: "target", dlg: "dialog", act: "action", val: "value", maxv: "max", minv: "min"
});

export const GLOBAL_STYLE_ATTRIBUTES = freeze([
  "recipe", "palette", "font", "display-font", "mono-font", "shape", "surface", "motion-style", "density", "shadow",
  "border", "hover", "animation", "delay", "duration", "stagger", "parallax", "scroll", "pad", "margin", "layer",
  "paper", "surface-color", "ink", "ink-2", "accent-2", "font-src", "font-name", "display-src", "display-name"
]);

const virtualFamily = (prefix, base, variants) => freeze({ prefix, base, variants: freeze(variants), count: 512 });

export const VIRTUAL_FAMILIES = freeze([
  virtualFamily("feat", "features", ["grid", "bento", "ledger", "index", "spotlight", "alternating", "cards", "list"]),
  virtualFamily("pnl", "panel", ["plain", "bordered", "raised", "ink", "glass", "gradient", "floating", "brutal"]),
  virtualFamily("sec", "section", ["plain", "paper", "ink", "accent", "ruled", "glass", "gradient", "mesh"]),
  virtualFamily("chr", "chart", ["bars", "spark", "distribution", "line", "area", "donut", "radar", "heatmap"]),
  virtualFamily("gal", "gallery", ["grid", "rail", "masonry", "carousel", "filmstrip", "stack", "spotlight", "bento"]),
  virtualFamily("app", "app-shell", ["sidebar", "topbar", "split", "canvas", "dense", "floating", "rail", "command"]),
  virtualFamily("tbl", "table", ["plain", "striped", "cards", "compact", "ledger", "glass", "bordered", "floating"]),
  virtualFamily("cta", "cta", ["band", "editorial", "ink", "split", "floating", "gradient", "minimal", "poster"]),
  virtualFamily("hd", "header", ["bar", "split", "floating", "editorial", "minimal", "centered", "stacked", "mega"]),
  virtualFamily("ft", "footer", ["standard", "compact", "index", "columns", "mega", "centered", "split", "floating"]),
  virtualFamily("fr", "frame", ["browser", "phone", "tablet", "window", "card", "glass", "terminal", "photo"]),
  virtualFamily("fm", "form", ["plain", "stacked", "inline", "cards", "glass", "split", "compact", "floating"]),
  virtualFamily("cd", "card", ["plain", "bordered", "raised", "glass", "gradient", "brutal", "interactive", "media"]),
  virtualFamily("gr", "grid", ["auto", "two", "three", "four", "bento", "masonry", "dashboard", "editorial"]),
  virtualFamily("h", "hero", ["split", "editorial", "centered", "console", "manifesto", "immersive", "asymmetric", "layered"]),
  virtualFamily("b", "button", ["solid", "outline", "ghost", "quiet", "soft", "gradient", "glass", "elevated"])
]);

export const VIRTUAL_PRESET_COUNT = VIRTUAL_FAMILIES.reduce((total, family) => total + family.count, 0);

export function resolveVirtualBlock(name) {
  const raw = String(name ?? "").toLowerCase();
  const families = [...VIRTUAL_FAMILIES].sort((left, right) => right.prefix.length - left.prefix.length);
  for (const family of families) {
    const match = new RegExp(`^${family.prefix}(\\d{3})$`).exec(raw);
    if (!match) continue;
    const index = Number(match[1]);
    if (index >= family.count) return null;
    const salt = stableSalt(`${family.prefix}:${family.base}`);
    const variantIndex = index % family.variants.length;
    const shapeIndex = Math.floor(index / family.variants.length) % SHAPES.length;
    const group = Math.floor(index / (family.variants.length * SHAPES.length));
    const attrs = {
      variant: family.variants[variantIndex],
      shape: SHAPES[shapeIndex],
      surface: SURFACES[(group + variantIndex * 3 + shapeIndex * 5 + salt) % SURFACES.length],
      animation: MOTIONS[(index * 5 + Math.floor(index / 17) + salt) % MOTIONS.length],
      hover: HOVERS[(index * 7 + Math.floor(index / 13) + salt) % HOVERS.length],
      density: DENSITIES[(index * 5 + Math.floor(index / 11) + salt) % DENSITIES.length],
      shadow: SHADOWS[(index * 3 + Math.floor(index / 7) + salt) % SHADOWS.length]
    };
    return freeze({ name: raw, base: family.base, family: family.prefix, index, attrs: freeze(attrs) });
  }
  return null;
}

export function virtualCatalogSummary() {
  return {
    count: VIRTUAL_PRESET_COUNT,
    format: "<family><000-511>",
    families: VIRTUAL_FAMILIES.map(({ prefix, base, count, variants }) => ({ prefix, base, count, variants }))
  };
}

function quantize(value, step, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return Math.max(min, Math.min(max, Math.round(number / step) * step));
}

export function designClassNames(attrs = {}) {
  const recipe = decodeDesignRecipe(attrs.recipe) ?? {};
  const values = { ...recipe, ...attrs };
  const classes = [];
  if (values.palette && PALETTE_NAMES.includes(String(values.palette))) classes.push(`ab-palette-${values.palette}`);
  if (values.font && FONT_NAMES.includes(String(values.font))) classes.push(`ab-font-${values.font}`);
  if (values["display-font"] && FONT_NAMES.includes(String(values["display-font"]))) classes.push(`ab-display-font-${values["display-font"]}`);
  if (values["mono-font"] && FONT_NAMES.includes(String(values["mono-font"]))) classes.push(`ab-mono-font-${values["mono-font"]}`);
  if (values.shape && SHAPES.includes(String(values.shape))) classes.push(`ab-shape-${values.shape}`);
  if (values.surface && SURFACES.includes(String(values.surface))) classes.push(`ab-surface-${values.surface}`);
  if (values.density && DENSITIES.includes(String(values.density))) classes.push(`ab-density-${values.density}`);
  if (values.shadow && SHADOWS.includes(String(values.shadow))) classes.push(`ab-shadow-${values.shadow}`);
  if (values.border && BORDERS.includes(String(values.border))) classes.push(`ab-border-${values.border}`);
  if (values.hover && HOVERS.includes(String(values.hover))) classes.push(`ab-hover-${values.hover}`);
  const animation = values.animation ?? values["motion-style"];
  if (animation && MOTIONS.includes(String(animation))) classes.push(`ab-animate-${animation}`);
  const delay = quantize(values.delay, 50, 0, 2000);
  const duration = quantize(values.duration, 100, 100, 3000);
  if (delay !== "") classes.push(`ab-delay-${delay}`);
  if (duration !== "") classes.push(`ab-duration-${duration}`);
  if (values.pad && SPACING.includes(String(values.pad))) classes.push(`ab-pad-${values.pad}`);
  if (values.margin && SPACING.includes(String(values.margin))) classes.push(`ab-margin-${values.margin}`);
  if (values.layer && LAYERS.includes(String(values.layer))) classes.push(`ab-layer-${values.layer}`);
  return classes;
}

export function designDataAttributes(attrs = {}) {
  const attributes = [];
  const animation = attrs.animation ?? attrs["motion-style"];
  if (animation && MOTIONS.includes(String(animation))) attributes.push(["data-animation", String(animation)]);
  if (attrs.parallax !== undefined && attrs.parallax !== false) attributes.push(["data-parallax", String(attrs.parallax === true ? "0.15" : attrs.parallax)]);
  if (attrs.scroll) attributes.push(["data-scroll", String(attrs.scroll)]);
  if (attrs.stagger !== undefined) attributes.push(["data-stagger", String(attrs.stagger)]);
  return attributes;
}

export function compactDesignCatalog() {
  return {
    recipes: { named: Object.keys(NAMED_RECIPES), encoded: { format: "d0000-d9999", count: DESIGN_RECIPE_COUNT } },
    palettes: PALETTE_NAMES,
    fonts: FONT_NAMES,
    shapes: SHAPES,
    surfaces: SURFACES,
    motions: MOTIONS,
    densities: DENSITIES,
    shadows: SHADOWS,
    borders: BORDERS,
    hovers: HOVERS,
    spacing: SPACING,
    layers: LAYERS,
    aliases: { blocks: BLOCK_ALIASES, attributes: ATTRIBUTE_ALIASES },
    virtualBlocks: virtualCatalogSummary()
  };
}
