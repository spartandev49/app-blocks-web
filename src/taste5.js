const freeze = (value) => Object.freeze(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));
const pad = (value, width) => String(value).padStart(width, "0");

export const TASTE_ENGINE_VERSION = 5;
export const TASTE_RECIPE_COUNT = 10_000_000;
export const ELEMENT_LOOK_COUNT = 1_000_000;
export const TASTE_MINIMUM_SCORE = 88;

export const PAGE_KINDS = freeze([
  "saas", "consumer", "agency", "portfolio", "editorial", "event",
  "documentation", "commerce", "application", "public-service", "media", "community"
]);

export const TASTE_GENRES = freeze([
  "modernist", "neo-industrial", "editorial", "kinetic", "technical", "organic",
  "brutalist", "quiet-luxury", "retro-future", "playful", "studio", "monochrome",
  "architectural", "soft-tech", "high-contrast", "print-led", "utilitarian", "cinematic",
  "catalogue", "workshop", "experimental", "institutional", "sport", "cultural"
]);

export const MACROSTRUCTURES = freeze([
  "editorial-axis", "asymmetric-field", "modular-bento", "poster-stack", "sticky-narrative",
  "technical-grid", "artifact-stage", "split-studio", "catalogue-wall", "cinematic-sequence",
  "ledger", "spatial-map", "index-first", "feature-stack", "portfolio-field",
  "manifesto", "workbench", "long-document", "commerce-story", "component-playground"
]);

export const HERO_ARCHITECTURES = freeze([
  "asymmetric-split", "editorial-manifesto", "media-mask", "kinetic-type", "curtain-reveal",
  "scroll-pinned", "artifact-first", "typographic-stage", "offset-window", "wide-ledger",
  "layered-collage", "product-theatre", "split-index", "side-caption", "architectural-frame",
  "quiet-statement", "cinematic-image", "modular-intro", "scroll-cue-free", "content-first"
]);

export const NAV_ARCHITECTURES = freeze([
  "minimal-split", "floating-rail", "editorial-index", "compact-bar", "edge-dock", "utility-led",
  "wordmark-led", "section-tabs", "asymmetric-nav", "command-nav", "stacked-masthead", "quiet-nav"
]);

export const FOOTER_ARCHITECTURES = freeze([
  "closing-statement", "compact-legal", "editorial-colophon", "action-band", "index-footer", "split-signoff",
  "contact-led", "minimal-rule", "newsletter-close", "utility-footer", "brand-canvas", "quiet-colophon"
]);

export const GEOMETRIES = freeze([
  "sharp", "micro-soft", "soft", "rounded", "squircle", "cut-corner",
  "notched", "ticket", "capsule-controls", "architectural", "organic", "mixed-rule"
]);

export const SURFACE_LANGUAGES = freeze([
  "flat", "paper", "matte", "ink", "canvas", "blueprint", "metal", "chrome",
  "mesh", "noise", "frost", "foil", "terminal", "linework", "photographic", "tonal"
]);

export const SECTION_RHYTHMS = freeze([
  "gallery-air", "measured", "compressed", "chaptered", "alternating", "overlap",
  "rail", "stacked", "offset", "full-bleed", "ledger", "editorial"
]);

export const ASSET_TREATMENTS = freeze([
  "full-bleed", "contained", "masked", "monochrome", "duotone", "soft-contrast",
  "hard-crop", "editorial-crop", "layered", "edge-to-edge", "grain", "clean"
]);

export const BLOCK_LAYOUTS = freeze([
  "auto", "asymmetric-split", "editorial-stack", "artifact-stage", "sticky-story", "modular-bento",
  "technical-grid", "horizontal-rail", "layered-collage", "ledger", "full-bleed", "offset",
  "masonry", "split-studio", "index-list", "cinematic", "workbench", "quiet-column",
  "media-left", "media-right", "comparison-rail", "dense-cockpit", "gallery-wall", "closing-band"
]);

export const TYPE_VOICES = freeze([
  "auto", "display", "editorial", "condensed", "mono", "whisper", "shout", "outline",
  "lede", "numeral", "label", "body", "caption", "data", "wordmark", "quote"
]);

export const TASTE_ROLES = freeze([
  "auto", "focal", "supporting", "quiet", "utility", "evidence",
  "navigation", "action", "artifact", "data", "narrative", "status"
]);

export const ENTER_MOTIONS = freeze([
  "none", "fade", "rise", "fall", "slide-left", "slide-right", "scale", "blur",
  "clip-up", "clip-left", "clip-right", "wipe", "fold", "unmask", "spring", "settle",
  "focus-in", "type-rise", "image-reveal", "stagger-rise", "drift", "snap", "soft-pop", "cinematic"
]);

export const SCROLL_MOTIONS = freeze([
  "none", "reveal", "parallax-y", "parallax-x", "scale", "fade", "blur", "tilt",
  "depth", "clip", "progress", "sticky-stack", "horizontal-pan", "word-reveal", "image-scale",
  "counterflow", "section-wipe", "focus-shift"
]);

export const HOVER_MOTIONS = freeze([
  "none", "lift", "soft-lift", "shine", "fill", "underline", "arrow", "magnetic",
  "tilt", "spotlight", "border-trace", "icon-shift", "image-zoom", "focus", "reveal-copy",
  "swap-text", "chroma", "pressable", "quiet", "elastic"
]);

export const PRESS_MOTIONS = freeze([
  "none", "compress", "push", "depress", "ripple", "bounce", "rubber", "pulse", "snap", "confirm"
]);

export const LOOP_MOTIONS = freeze([
  "none", "float", "breathe", "pulse", "bob", "sway", "shimmer", "gradient",
  "spin", "glow", "dash", "drift", "marquee", "orbit", "scan"
]);

export const CHOREOGRAPHIES = freeze([
  "none", "children", "cascade", "grid", "stack", "hero", "wave", "radial",
  "list", "editorial", "counterflow", "sequence"
]);

const TYPEFACE_SYSTEMS = [
  ["space-manrope", "Space Grotesk", "Manrope", "IBM Plex Mono"],
  ["archivo-manrope", "Archivo", "Manrope", "IBM Plex Mono"],
  ["bricolage-figtree", "Bricolage Grotesque", "Figtree", "IBM Plex Mono"],
  ["syne-manrope", "Syne", "Manrope", "Space Mono"],
  ["sora-figtree", "Sora", "Figtree", "IBM Plex Mono"],
  ["outfit-source", "Outfit", "Source Sans 3", "IBM Plex Mono"],
  ["unbounded-manrope", "Unbounded", "Manrope", "Space Mono"],
  ["ibm-plex", "IBM Plex Sans", "IBM Plex Sans", "IBM Plex Mono"],
  ["archivo-source", "Archivo", "Source Sans 3", "IBM Plex Mono"],
  ["space-source", "Space Grotesk", "Source Sans 3", "Space Mono"],
  ["bricolage-manrope", "Bricolage Grotesque", "Manrope", "IBM Plex Mono"],
  ["sora-manrope", "Sora", "Manrope", "IBM Plex Mono"],
  ["newsreader-source", "Newsreader", "Source Sans 3", "IBM Plex Mono"],
  ["dmserif-manrope", "DM Serif Display", "Manrope", "IBM Plex Mono"],
  ["cormorant-source", "Cormorant Garamond", "Source Sans 3", "Space Mono"],
  ["newsreader-newsreader", "Newsreader", "Newsreader", "IBM Plex Mono"],
  ["archivo-ibm", "Archivo", "IBM Plex Sans", "IBM Plex Mono"],
  ["syne-figtree", "Syne", "Figtree", "Space Mono"],
  ["space-figtree", "Space Grotesk", "Figtree", "Space Mono"],
  ["outfit-manrope", "Outfit", "Manrope", "IBM Plex Mono"],
  ["sora-source", "Sora", "Source Sans 3", "IBM Plex Mono"],
  ["bricolage-source", "Bricolage Grotesque", "Source Sans 3", "IBM Plex Mono"],
  ["unbounded-figtree", "Unbounded", "Figtree", "Space Mono"],
  ["ibm-condensed", "IBM Plex Sans Condensed", "IBM Plex Sans", "IBM Plex Mono"],
  ["archivo-condensed", "Archivo", "Archivo", "IBM Plex Mono"],
  ["space-ibm", "Space Grotesk", "IBM Plex Sans", "IBM Plex Mono"],
  ["newsreader-manrope", "Newsreader", "Manrope", "IBM Plex Mono"],
  ["dmserif-source", "DM Serif Display", "Source Sans 3", "Space Mono"],
  ["cormorant-manrope", "Cormorant Garamond", "Manrope", "IBM Plex Mono"],
  ["syne-source", "Syne", "Source Sans 3", "Space Mono"],
  ["outfit-figtree", "Outfit", "Figtree", "IBM Plex Mono"],
  ["ibm-source", "IBM Plex Sans", "Source Sans 3", "IBM Plex Mono"]
];

export const TYPOGRAPHY_SYSTEMS = freeze(TYPEFACE_SYSTEMS.map(([name, display, body, mono], index) => freeze({
  id: `ty${pad(index, 2)}`,
  index,
  name,
  display,
  body,
  mono,
  serif: /Newsreader|Serif|Cormorant/.test(display)
})));

const PALETTE_FAMILIES = freeze([
  { name: "cobalt", hue: 222, saturation: 66 },
  { name: "emerald", hue: 151, saturation: 58 },
  { name: "vermilion", hue: 9, saturation: 72 },
  { name: "saffron", hue: 42, saturation: 76 },
  { name: "deep-rose", hue: 345, saturation: 62 },
  { name: "teal", hue: 178, saturation: 56 },
  { name: "indigo", hue: 248, saturation: 58 },
  { name: "coral", hue: 15, saturation: 68 },
  { name: "oxide", hue: 21, saturation: 48 },
  { name: "ultramarine", hue: 230, saturation: 72 },
  { name: "forest", hue: 136, saturation: 42 },
  { name: "cranberry", hue: 350, saturation: 58 },
  { name: "electric-blue", hue: 207, saturation: 76 },
  { name: "moss", hue: 95, saturation: 38 },
  { name: "terracotta", hue: 18, saturation: 52 },
  { name: "plum", hue: 302, saturation: 42 },
  { name: "cyan", hue: 190, saturation: 64 },
  { name: "brick", hue: 7, saturation: 48 },
  { name: "amber", hue: 37, saturation: 68 },
  { name: "jade", hue: 162, saturation: 50 },
  { name: "navy", hue: 215, saturation: 50 },
  { name: "magenta", hue: 320, saturation: 58 },
  { name: "olive", hue: 74, saturation: 38 },
  { name: "scarlet", hue: 356, saturation: 72 }
]);

function hslToRgb(hue, saturation, lightness) {
  const h = (((hue % 360) + 360) % 360) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  if (s === 0) return [l, l, l];
  const q = l < .5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (offset) => {
    let t = h + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [channel(1 / 3), channel(0), channel(-1 / 3)];
}

function relativeLuminance(rgb) {
  const linear = rgb.map((channel) => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}

function contrastRatio(left, right) {
  const bright = Math.max(left, right);
  const dark = Math.min(left, right);
  return (bright + .05) / (dark + .05);
}

function contrastInk(hue, saturation, lightness) {
  const background = relativeLuminance(hslToRgb(hue, saturation, lightness));
  const light = { value: `hsl(${hue} 8% 99.5%)`, luminance: relativeLuminance(hslToRgb(hue, 8, 99.5)) };
  const dark = { value: `hsl(${hue} 24% 1.5%)`, luminance: relativeLuminance(hslToRgb(hue, 24, 1.5)) };
  const lightRatio = contrastRatio(background, light.luminance);
  const darkRatio = contrastRatio(background, dark.luminance);
  const winner = lightRatio >= darkRatio ? light : dark;
  return freeze({ value: winner.value, ratio: Number(Math.max(lightRatio, darkRatio).toFixed(2)) });
}

export const TASTE_PALETTES = freeze(Array.from({ length: 48 }, (_, index) => {
  const family = PALETTE_FAMILIES[index % PALETTE_FAMILIES.length];
  const variant = Math.floor(index / PALETTE_FAMILIES.length);
  const hue = (family.hue + (variant ? 8 : 0)) % 360;
  const saturation = Math.max(34, Math.min(78, family.saturation + (variant ? -8 : 0)));
  const accentLight = Math.max(34, Math.min(48, 40 + ((index * 5) % 8) - (family.name === "saffron" || family.name === "amber" ? 4 : 0)));
  const accentDark = Math.max(58, Math.min(72, 64 + ((index * 3) % 7)));
  const lightInk = contrastInk(hue, saturation, accentLight);
  const darkInk = contrastInk(hue, Math.max(42, saturation - 6), accentDark);
  return freeze({
    id: `tp${pad(index, 2)}`,
    index,
    name: `${family.name}-${variant + 1}`,
    hue,
    saturation,
    light: freeze({
      background: `hsl(${hue} 18% 97%)`,
      surface: `hsl(${hue} 16% 99%)`,
      surface2: `hsl(${hue} 15% 93%)`,
      ink: `hsl(${hue} 22% 10%)`,
      muted: `hsl(${hue} 12% 35%)`,
      accent: `hsl(${hue} ${saturation}% ${accentLight}%)`,
      accentInk: lightInk.value,
      accentContrast: lightInk.ratio,
      line: `hsl(${hue} 14% 81%)`
    }),
    dark: freeze({
      background: `hsl(${hue} 18% 7%)`,
      surface: `hsl(${hue} 16% 10%)`,
      surface2: `hsl(${hue} 14% 15%)`,
      ink: `hsl(${hue} 12% 94%)`,
      muted: `hsl(${hue} 10% 69%)`,
      accent: `hsl(${hue} ${Math.max(42, saturation - 6)}% ${accentDark}%)`,
      accentInk: darkInk.value,
      accentContrast: darkInk.ratio,
      line: `hsl(${hue} 12% 27%)`
    })
  });
}));

const LOOK_SHAPES = freeze(["sharp", "micro", "soft", "round", "squircle", "notch", "cut", "ticket", "arch", "capsule", "organic", "frame"]);
const LOOK_BORDERS = freeze(["none", "hairline", "solid", "double", "accent", "inset", "offset", "trace"]);
const LOOK_SHADOWS = freeze(["none", "hairline", "soft", "medium", "deep", "long", "tinted", "ink", "inner", "lift", "ambient", "crisp"]);
const LOOK_SURFACES = SURFACE_LANGUAGES;
const LOOK_DENSITIES = freeze(["airy", "spacious", "balanced", "compact", "dense", "editorial", "touch", "data", "poster", "micro"]);
const LOOK_TONES = freeze(["neutral", "accent", "quiet", "ink", "paper", "warm", "cool", "contrast", "muted", "signal"]);

export const TASTE_AXES = freeze({
  recipes: TASTE_RECIPE_COUNT,
  elementLooks: ELEMENT_LOOK_COUNT,
  pageKinds: PAGE_KINDS.length,
  genres: TASTE_GENRES.length,
  macrostructures: MACROSTRUCTURES.length,
  heroes: HERO_ARCHITECTURES.length,
  navigations: NAV_ARCHITECTURES.length,
  footers: FOOTER_ARCHITECTURES.length,
  typography: TYPOGRAPHY_SYSTEMS.length,
  palettes: TASTE_PALETTES.length,
  geometries: GEOMETRIES.length,
  surfaces: SURFACE_LANGUAGES.length,
  sectionRhythms: SECTION_RHYTHMS.length,
  assetTreatments: ASSET_TREATMENTS.length,
  coreAddressSpace: MACROSTRUCTURES.length * HERO_ARCHITECTURES.length * NAV_ARCHITECTURES.length * FOOTER_ARCHITECTURES.length * TYPOGRAPHY_SYSTEMS.length * TASTE_PALETTES.length
});

function hashString(value) {
  let hash = 2166136261;
  for (const character of String(value ?? "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function parseAddress(value, prefix, count, width) {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value < count) return value;
  const text = String(value ?? "").trim();
  const match = new RegExp(`^(?:${prefix})?(\\d{1,${width}})$`, "i").exec(text);
  if (!match) return null;
  const index = Number.parseInt(match[1], 10);
  return index >= 0 && index < count ? index : null;
}

function mixedRadix(index, lengths) {
  let remainder = index;
  return lengths.map((length) => {
    const digit = remainder % length;
    remainder = Math.floor(remainder / length);
    return digit;
  });
}

export function resolveTasteDNA(value = "t0000000") {
  const index = parseAddress(value, "t", TASTE_RECIPE_COUNT, 7);
  if (index === null) return null;
  const [macroIndex, heroIndex, navIndex, footerIndex, typeIndex, paletteIndex] = mixedRadix(index, [
    MACROSTRUCTURES.length,
    HERO_ARCHITECTURES.length,
    NAV_ARCHITECTURES.length,
    FOOTER_ARCHITECTURES.length,
    TYPOGRAPHY_SYSTEMS.length,
    TASTE_PALETTES.length
  ]);
  const seed = hashString(`taste:${index}`);
  const pageKindIndex = (seed + Math.floor(index / 97)) % PAGE_KINDS.length;
  const genreIndex = (seed * 3 + Math.floor(index / 193)) % TASTE_GENRES.length;
  const geometryIndex = (seed * 5 + Math.floor(index / 389)) % GEOMETRIES.length;
  const surfaceIndex = (seed * 7 + Math.floor(index / 769)) % SURFACE_LANGUAGES.length;
  const rhythmIndex = (seed * 11 + Math.floor(index / 1543)) % SECTION_RHYTHMS.length;
  const assetIndex = (seed * 13 + Math.floor(index / 3079)) % ASSET_TREATMENTS.length;
  const mode = ((seed >>> 4) + index) % 3 === 0 ? "dark" : "auto";
  const variance = 4 + ((seed >>> 8) % 7);
  const motionIntensity = 3 + ((seed >>> 12) % 8);
  const visualDensity = 2 + ((seed >>> 16) % 8);
  return freeze({
    id: `t${pad(index, 7)}`,
    index,
    kind: "taste-dna",
    coreSignature: `${macroIndex}:${heroIndex}:${navIndex}:${footerIndex}:${typeIndex}:${paletteIndex}`,
    pageKind: PAGE_KINDS[pageKindIndex],
    genre: TASTE_GENRES[genreIndex],
    macrostructure: freeze({ id: `ma${pad(macroIndex, 2)}`, index: macroIndex, name: MACROSTRUCTURES[macroIndex] }),
    hero: freeze({ id: `he${pad(heroIndex, 2)}`, index: heroIndex, name: HERO_ARCHITECTURES[heroIndex] }),
    navigation: freeze({ id: `na${pad(navIndex, 2)}`, index: navIndex, name: NAV_ARCHITECTURES[navIndex] }),
    footer: freeze({ id: `fo${pad(footerIndex, 2)}`, index: footerIndex, name: FOOTER_ARCHITECTURES[footerIndex] }),
    typography: TYPOGRAPHY_SYSTEMS[typeIndex],
    palette: TASTE_PALETTES[paletteIndex],
    geometry: freeze({ id: `ge${pad(geometryIndex, 2)}`, index: geometryIndex, name: GEOMETRIES[geometryIndex] }),
    surface: freeze({ id: `su${pad(surfaceIndex, 2)}`, index: surfaceIndex, name: SURFACE_LANGUAGES[surfaceIndex] }),
    rhythm: freeze({ id: `rh${pad(rhythmIndex, 2)}`, index: rhythmIndex, name: SECTION_RHYTHMS[rhythmIndex] }),
    assetTreatment: freeze({ id: `as${pad(assetIndex, 2)}`, index: assetIndex, name: ASSET_TREATMENTS[assetIndex] }),
    mode,
    variance,
    motionIntensity,
    visualDensity
  });
}

export function resolveElementLook(value = "e000000") {
  const index = parseAddress(value, "(?:e|lk)", ELEMENT_LOOK_COUNT, 6);
  if (index === null) return null;
  const [shape, border, shadow, surface, density, tone] = mixedRadix(index, [
    LOOK_SHAPES.length,
    LOOK_BORDERS.length,
    LOOK_SHADOWS.length,
    LOOK_SURFACES.length,
    LOOK_DENSITIES.length,
    LOOK_TONES.length
  ]);
  return freeze({
    id: `e${pad(index, 6)}`,
    index,
    kind: "element-look",
    shape: freeze({ index: shape, name: LOOK_SHAPES[shape] }),
    border: freeze({ index: border, name: LOOK_BORDERS[border] }),
    shadow: freeze({ index: shadow, name: LOOK_SHADOWS[shadow] }),
    surface: freeze({ index: surface, name: LOOK_SURFACES[surface] }),
    density: freeze({ index: density, name: LOOK_DENSITIES[density] }),
    tone: freeze({ index: tone, name: LOOK_TONES[tone] })
  });
}

function normalizeEnum(value, values, fallback) {
  const text = String(value ?? "").trim().toLowerCase();
  return values.includes(text) ? text : fallback;
}

function normalizeDial(value, fallback) {
  const number = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(number) ? clamp(number, 1, 10) : fallback;
}

export function resolveTasteProfile(selection = {}) {
  const dna = resolveTasteDNA(selection.taste ?? selection.dna ?? selection.recipe ?? "t0000000") ?? resolveTasteDNA("t0000000");
  const pageKind = normalizeEnum(selection.pageKind ?? selection.kind, PAGE_KINDS, dna.pageKind);
  const genre = normalizeEnum(selection.genre, TASTE_GENRES, dna.genre);
  const mode = normalizeEnum(selection.mode, ["light", "dark", "auto"], dna.mode);
  return freeze({
    active: selection.active !== false,
    dna,
    pageKind,
    genre,
    mode,
    variance: normalizeDial(selection.variance, dna.variance),
    motionIntensity: normalizeDial(selection.motionIntensity, dna.motionIntensity),
    visualDensity: normalizeDial(selection.visualDensity, dna.visualDensity),
    macrostructure: dna.macrostructure,
    hero: dna.hero,
    navigation: dna.navigation,
    footer: dna.footer,
    typography: dna.typography,
    palette: dna.palette,
    geometry: dna.geometry,
    surface: dna.surface,
    rhythm: dna.rhythm,
    assetTreatment: dna.assetTreatment
  });
}

const ROLE_BY_BLOCK = freeze({
  site: "quiet", page: "narrative", main: "narrative", header: "navigation", footer: "navigation", nav: "navigation", link: "navigation",
  button: "action", breadcrumbs: "navigation", hero: "focal", title: "focal", heading: "supporting", text: "narrative", eyebrow: "quiet",
  badge: "status", tag: "status", icon: "utility", image: "artifact", visual: "artifact", "code-block": "artifact", code: "data", quote: "evidence",
  proof: "evidence", logos: "evidence", logo: "evidence", stats: "data", stat: "data", features: "supporting", feature: "supporting",
  split: "narrative", steps: "narrative", step: "supporting", testimonials: "evidence", testimonial: "evidence", pricing: "evidence", tier: "supporting",
  comparison: "data", faq: "narrative", question: "narrative", cta: "action", newsletter: "action", gallery: "artifact", timeline: "narrative",
  article: "narrative", prose: "narrative", callout: "status", "app-shell": "utility", sidebar: "navigation", toolbar: "utility", metrics: "data",
  metric: "data", chart: "data", bar: "data", table: "data", column: "data", row: "data", cell: "data", form: "utility", field: "utility",
  option: "utility", tabs: "navigation", tab: "narrative", panel: "supporting", dialog: "utility", kanban: "data", lane: "data", card: "supporting",
  activity: "data", event: "data", "empty-state": "status", status: "status", section: "narrative", grid: "supporting", stack: "supporting",
  columns: "supporting", divider: "quiet", spacer: "quiet", list: "narrative", item: "supporting"
});

export const BLOCK_LAYOUT_COMPATIBILITY = freeze({
  page: MACROSTRUCTURES,
  main: ["auto", "editorial-stack", "quiet-column", "workbench", "long-document"],
  hero: HERO_ARCHITECTURES,
  header: NAV_ARCHITECTURES,
  footer: FOOTER_ARCHITECTURES,
  section: BLOCK_LAYOUTS,
  grid: [
    "auto", "modular-bento", "technical-grid", "horizontal-rail", "layered-collage",
    "ledger", "masonry", "split-studio", "index-list", "workbench", "dense-cockpit",
    "quiet-column", "comparison-rail", "gallery-wall", "offset", "counterflow"
  ],
  stack: ["auto", "editorial-stack", "quiet-column", "offset", "index-list", "closing-band"],
  columns: [
    "auto", "asymmetric-split", "split-studio", "media-left", "media-right",
    "artifact-stage", "sticky-story", "counterflow", "quiet-column", "editorial-stack"
  ],
  panel: [
    "auto", "editorial-stack", "quiet-column", "offset", "media-left", "media-right",
    "artifact-stage", "closing-band"
  ],
  article: ["auto", "quiet-column", "editorial-stack", "ledger", "long-document"],
  prose: ["auto", "quiet-column", "editorial-stack", "ledger", "long-document"],
  features: ["auto", "modular-bento", "technical-grid", "index-list", "horizontal-rail"],
  gallery: ["auto", "gallery-wall", "masonry", "horizontal-rail", "layered-collage", "full-bleed"],
  pricing: ["auto", "ledger", "comparison-rail", "offset", "technical-grid"],
  testimonials: ["auto", "editorial-stack", "horizontal-rail", "offset", "layered-collage"],
  steps: ["auto", "sticky-story", "ledger", "index-list", "counterflow"],
  proof: ["auto", "artifact-stage", "ledger", "offset", "full-bleed"],
  cta: ["auto", "closing-band", "cinematic", "quiet-column", "full-bleed"],
  table: ["auto", "dense-cockpit", "ledger", "technical-grid"],
  form: ["auto", "quiet-column", "workbench", "technical-grid"],
  "app-shell": ["auto", "workbench", "dense-cockpit", "technical-grid"],
  sidebar: ["auto", ...NAV_ARCHITECTURES],
  toolbar: ["auto", "ledger", "quiet-column", "workbench"],
  tabs: ["auto", "workbench", "quiet-column", "horizontal-rail"],
  kanban: ["auto", "horizontal-rail", "dense-cockpit", "workbench"],
  card: ["auto", "quiet-column", "editorial-stack", "offset"],
  feature: ["auto", "quiet-column", "editorial-stack", "offset"],
  image: ["auto", ...ASSET_TREATMENTS],
  visual: ["auto", ...ASSET_TREATMENTS],
  dialog: ["auto", "quiet-column", "workbench"]
});

export function layoutsForBlock(blockName) {
  const canonical = String(blockName ?? "").toLowerCase();
  return BLOCK_LAYOUT_COMPATIBILITY[canonical] ?? freeze(["auto"]);
}

export function isLayoutCompatible(blockName, layout) {
  if (layout === undefined || layout === null || layout === "") return true;
  return layoutsForBlock(blockName).includes(String(layout));
}

function pick(values, seed) {
  return values[Math.abs(seed) % values.length];
}

export function defaultTasteForBlock(profile, blockName, line = 1, explicit = {}) {
  const canonical = String(blockName ?? "section").toLowerCase();
  const seed = hashString(`${profile.dna.id}:${canonical}:${line}`);
  const role = normalizeEnum(explicit.role, TASTE_ROLES, ROLE_BY_BLOCK[canonical] ?? "supporting");
  const layoutPool = layoutsForBlock(canonical);
  const explicitLayout = isLayoutCompatible(canonical, explicit.layout) ? explicit.layout : undefined;
  const layout = normalizeEnum(explicitLayout, layoutPool, pick(layoutPool, seed));
  const look = resolveElementLook(explicit.look ?? (seed % ELEMENT_LOOK_COUNT));
  const surface = normalizeEnum(explicit.surface, SURFACE_LANGUAGES, look?.surface.name ?? profile.surface.name);
  let type = normalizeEnum(explicit.type, TYPE_VOICES, "auto");
  if (type === "auto") {
    if (canonical === "title" || canonical === "hero") type = "display";
    else if (["stat", "metric", "bar", "code", "code-block"].includes(canonical)) type = "data";
    else if (["eyebrow", "badge", "tag"].includes(canonical)) type = "label";
    else if (canonical === "quote") type = "quote";
    else type = "body";
  }
  return freeze({
    role,
    layout,
    surface,
    type,
    look,
    sequence: seed % 12
  });
}

function gradeForScore(score) {
  if (score >= 96) return "exceptional";
  if (score >= 92) return "tasteful";
  if (score >= 88) return "strong";
  if (score >= 76) return "serviceable";
  return "generic";
}

function countMatches(text, pattern) {
  return [...String(text).matchAll(pattern)].length;
}

function quotedWords(line) {
  const match = /["']([^"']+)["']/.exec(line);
  return match ? match[1].trim().split(/\s+/).filter(Boolean) : [];
}

export function auditTasteSource(source, profileInput = {}) {
  const text = String(source ?? "");
  const profile = profileInput?.dna ? profileInput : resolveTasteProfile(profileInput);
  const findings = [];
  let score = 100;
  const deduct = (points, code, message, line = 0) => {
    score -= points;
    findings.push(freeze({ code, points, message, line }));
  };

  const lines = text.split(/\r?\n/);
  const tasteActive = /(?:^|\s)(?:ts|taste|taste-dna)=/m.test(text);
  if (!tasteActive) deduct(40, "taste.missing", "Choose a deterministic Taste DNA with ts=t0000000 through ts=t9999999.");

  const heroLines = lines.map((line, index) => ({ line, index: index + 1 })).filter(({ line }) => /^\s*(?:hero|hr\d{3})\b/.test(line));
  for (const hero of heroLines) {
    if (/\b(?:variant=)?centered\b|\btl=(?:centered|quiet-column)\b/.test(hero.line) && profile.variance > 4) {
      deduct(10, "hero.center-bias", "High-variance pages should not default to a centered hero.", hero.index);
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*(?:title|ttl)\b/.test(line)) {
      const words = quotedWords(line);
      const levelOne = /(?:level|lvl)=1\b/.test(line);
      if (levelOne && words.length > 12) deduct(5, "hero.headline-long", "Primary headline is likely to wrap beyond two lines.", index + 1);
    }
    if (/^\s*(?:text|txt)\b/.test(line)) {
      const words = quotedWords(line);
      const previous = lines.slice(Math.max(0, index - 4), index).join("\n");
      if (/^\s*(?:hero|hr\d{3})\b/m.test(previous) && words.length > 24) {
        deduct(4, "hero.copy-long", "Hero supporting copy should stay concise enough to keep the CTA in the first viewport.", index + 1);
      }
    }
  }

  const equalThree = countMatches(text, /^\s*(?:grid|gr)\b[^\n]*(?:variant|v)=three\b/gm)
    + countMatches(text, /^\s*(?:features|feats)\b[^\n]*(?:variant|v)=grid\b/gm);
  if (equalThree) deduct(Math.min(14, equalThree * 7), "layout.equal-three", "Replace equal three-column feature rows with a structurally varied composition.");

  const fakeChrome = countMatches(text, /^\s*(?:browser-frame|phone-frame|laptop-frame|terminal-window|hero-console)\b/gm)
    + countMatches(text, /^\s*(?:visual|vis)\b[^\n]*(?:compiler|dashboard|terminal)/gm);
  if (fakeChrome) deduct(Math.min(18, fakeChrome * 6), "asset.fake-chrome", "Use real images, real screenshots, or actual live components instead of redrawn product chrome.");

  const images = countMatches(text, /^\s*(?:image|img)\b/gm);
  const marketingKind = !["application", "documentation", "public-service"].includes(profile.pageKind);
  if (marketingKind && images < 2) deduct(10, "asset.insufficient", "Marketing and portfolio routes need at least two real visual assets.");

  const sections = Math.max(1, countMatches(text, /^\s*(?:section|sec|features|feats|split|spl|proof|pf|steps|pricing|price|gallery|gal|testimonials|faq|fq|cta|call)\b/gm));
  const eyebrows = countMatches(text, /^\s*(?:eyebrow|eye)\b/gm);
  const allowedEyebrows = Math.ceil(sections / 3);
  if (eyebrows > allowedEyebrows) deduct(Math.min(12, (eyebrows - allowedEyebrows) * 3), "type.eyebrow-repeat", "Use eyebrows selectively; repeated micro-labels create a templated rhythm.");

  const authoredLayouts = new Set([...text.matchAll(/\b(?:tl|taste-layout)=([\w-]+)/g)].map((match) => match[1]));
  if (sections >= 5 && authoredLayouts.size < 3) deduct(8, "layout.low-variety", "Use at least three section layout families on a multi-section page.");

  const marquees = countMatches(text, /^\s*(?:marquee|ticker)\b/gm);
  if (marquees > 1) deduct((marquees - 1) * 5, "motion.marquee-repeat", "Use at most one marquee per page.");

  const slopPhrases = [
    /\bunlock the power\b/gi, /\bseamless(?:ly)?\b/gi, /\brevolutioni[sz]e\b/gi,
    /\bnext[- ]gen\b/gi, /\belevate your\b/gi, /\bgame[- ]changer\b/gi,
    /\bAcme\b/g, /\bNexus\b/g, /\bSmartFlow\b/g, /\bJane Doe\b/g, /\bJohn Doe\b/g
  ];
  const slopCount = slopPhrases.reduce((count, pattern) => count + countMatches(text, pattern), 0);
  if (slopCount) deduct(Math.min(15, slopCount * 3), "copy.generic", "Replace generic AI marketing language and placeholder identities with concrete product language.");

  const emDashes = countMatches(text, /—/g);
  if (emDashes) deduct(Math.min(6, emDashes), "copy.em-dash", "Use plain punctuation rather than decorative em dashes in compact product copy.");

  const duplicatedCtaLabels = (() => {
    const labels = [...text.matchAll(/^\s*(?:button|bt|b\d{3})\s+["']([^"']+)["']/gm)].map((match) => match[1].trim().toLowerCase());
    return labels.filter((label, index) => labels.indexOf(label) !== index).length;
  })();
  if (duplicatedCtaLabels > 2) deduct(4, "cta.repetition", "Reduce repeated CTA labels and give each action a distinct job.");

  const sourceHasMotion = /\b(?:fx|te|tsc|th|tp|ta|tc)=/.test(text);
  if (profile.motionIntensity > 4 && !sourceHasMotion) deduct(6, "motion.claimed-not-shown", "A motion intensity above four should include visible entrance, scroll, or interaction behavior.");

  score = Math.max(0, Math.min(100, score));
  return freeze({
    engine: TASTE_ENGINE_VERSION,
    score,
    grade: gradeForScore(score),
    passed: score >= TASTE_MINIMUM_SCORE,
    minimum: TASTE_MINIMUM_SCORE,
    findings: freeze(findings),
    metrics: freeze({ sections, eyebrows, allowedEyebrows, images, marquees, authoredLayouts: authoredLayouts.size }),
    profile: freeze({
      dna: profile.dna.id,
      pageKind: profile.pageKind,
      genre: profile.genre,
      variance: profile.variance,
      motionIntensity: profile.motionIntensity,
      visualDensity: profile.visualDensity
    })
  });
}

export function tasteManifest(profile, audit, usage = {}) {
  return {
    engine: TASTE_ENGINE_VERSION,
    recipes: TASTE_RECIPE_COUNT,
    elementLooks: ELEMENT_LOOK_COUNT,
    axes: TASTE_AXES,
    dna: profile.dna.id,
    pageKind: profile.pageKind,
    genre: profile.genre,
    mode: profile.mode,
    dials: {
      designVariance: profile.variance,
      motionIntensity: profile.motionIntensity,
      visualDensity: profile.visualDensity
    },
    structure: {
      macrostructure: profile.macrostructure.name,
      hero: profile.hero.name,
      navigation: profile.navigation.name,
      footer: profile.footer.name,
      sectionRhythm: profile.rhythm.name
    },
    visual: {
      typography: profile.typography.name,
      palette: profile.palette.name,
      geometry: profile.geometry.name,
      surface: profile.surface.name,
      assetTreatment: profile.assetTreatment.name
    },
    usage: {
      blocks: usage.blocks ?? 0,
      layouts: [...(usage.layouts ?? [])],
      surfaces: [...(usage.surfaces ?? [])],
      roles: [...(usage.roles ?? [])],
      typeVoices: [...(usage.typeVoices ?? [])],
      looks: usage.looks ?? 0
    },
    audit
  };
}
