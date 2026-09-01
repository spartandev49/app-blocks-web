const freeze = (value) => Object.freeze(value);

const palette = (paper, surface, ink, muted, accent, accent2 = accent) => freeze({
  paper, surface, ink, muted, accent, accent2
});

export const PALETTES = freeze({
  blueprint: palette("#f5f2ea", "#fffdf7", "#101b2c", "#68738a", "#154de7", "#0b38b6"),
  ocean: palette("#eef8ff", "#ffffff", "#10283a", "#5d7180", "#087ea4", "#075985"),
  cyan: palette("#ecfeff", "#f8ffff", "#083344", "#4f6c75", "#06b6d4", "#0e7490"),
  mint: palette("#effdf7", "#fbfffd", "#102d24", "#5a756c", "#10b981", "#047857"),
  forest: palette("#f2f8f1", "#fcfffb", "#17281a", "#637267", "#2f7d32", "#1b5e20"),
  lime: palette("#f8fde9", "#fefff9", "#24320f", "#707c58", "#65a30d", "#3f6212"),
  amber: palette("#fff9e8", "#fffefa", "#35240b", "#7d6d50", "#d97706", "#a84c00"),
  sunset: palette("#fff4ec", "#fffdf9", "#3a1f18", "#80665e", "#f05a28", "#c43d14"),
  coral: palette("#fff1ef", "#fffafa", "#3c1c1c", "#816466", "#ef6351", "#c83e31"),
  rose: palette("#fff1f4", "#fffafb", "#3c1720", "#85616b", "#e11d48", "#be123c"),
  magenta: palette("#fff0fb", "#fffaff", "#3b1534", "#82627a", "#c026d3", "#86198f"),
  violet: palette("#f7f2ff", "#fdfbff", "#27183d", "#716282", "#7c3aed", "#5b21b6"),
  indigo: palette("#f0f2ff", "#fbfbff", "#1b2342", "#646d89", "#4f46e5", "#3730a3"),
  midnight: palette("#edf1f8", "#f9fbff", "#101827", "#606a7b", "#304ffe", "#1733c7"),
  slate: palette("#f2f5f7", "#fcfdfe", "#17212b", "#65717e", "#475569", "#334155"),
  graphite: palette("#f3f3f3", "#fdfdfd", "#171717", "#6b6b6b", "#404040", "#202020"),
  sand: palette("#f7f1e5", "#fffdf8", "#2f261c", "#7b6e5d", "#ad6f32", "#82501f"),
  clay: palette("#f8eee9", "#fffaf7", "#38241f", "#806b64", "#b4533c", "#853827"),
  coffee: palette("#f4eee9", "#fffaf6", "#2e211c", "#75665f", "#795548", "#4e342e"),
  gold: palette("#fbf7e7", "#fffef8", "#302a16", "#776f55", "#b48a19", "#80620f"),
  luxury: palette("#f8f4eb", "#fffdf7", "#1b1711", "#6f6657", "#9b7a2f", "#654d16"),
  mono: palette("#f5f5f5", "#ffffff", "#111111", "#666666", "#111111", "#333333"),
  brutal: palette("#fffdf0", "#ffffff", "#080808", "#585858", "#ff3d00", "#121212"),
  candy: palette("#fff2fb", "#fffaff", "#32142b", "#80647a", "#ff4fa3", "#7c4dff"),
  bubblegum: palette("#fff0f6", "#fffaff", "#351628", "#806476", "#ec4899", "#8b5cf6"),
  lavender: palette("#f8f3ff", "#fefbff", "#2e1d3c", "#756683", "#a855f7", "#7e22ce"),
  teal: palette("#ecfaf8", "#fafffe", "#102f2b", "#5e7673", "#0f9f8f", "#0f766e"),
  aqua: palette("#ebfbfb", "#faffff", "#0d3032", "#5d777a", "#14b8a6", "#0e7490"),
  crimson: palette("#fff1f1", "#fffafa", "#3a1619", "#826166", "#c1121f", "#8f0d16"),
  copper: palette("#f9f0e9", "#fffaf6", "#39231a", "#7c675d", "#b5653b", "#7f3e22"),
  moss: palette("#f3f7ed", "#fcfff9", "#222d1b", "#6c7562", "#5f7f3a", "#3c5a22"),
  arctic: palette("#eef9fb", "#fbffff", "#102b33", "#61757c", "#29a6c7", "#16738f")
});

export const FONT_PRESETS = freeze({
  system: freeze({ body: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace' }),
  product: freeze({ body: 'Inter, Aptos, ui-sans-serif, system-ui, sans-serif', display: 'Inter, Aptos Display, ui-sans-serif, system-ui, sans-serif', mono: '"SFMono-Regular", Consolas, monospace' }),
  humanist: freeze({ body: 'Optima, Candara, "Noto Sans", Arial, sans-serif', display: 'Optima, Candara, "Noto Sans", Arial, sans-serif', mono: 'Consolas, monospace' }),
  geometric: freeze({ body: 'Avenir, Montserrat, Futura, "Trebuchet MS", sans-serif', display: 'Futura, Avenir Next, Montserrat, sans-serif', mono: '"SFMono-Regular", Consolas, monospace' }),
  grotesk: freeze({ body: 'Helvetica Neue, Helvetica, Arial, sans-serif', display: 'Arial Black, Helvetica Neue, Arial, sans-serif', mono: 'Consolas, monospace' }),
  swiss: freeze({ body: 'Helvetica Neue, Arial, sans-serif', display: 'Helvetica Neue, Arial, sans-serif', mono: 'Courier New, monospace' }),
  editorial: freeze({ body: 'Georgia, Cambria, "Times New Roman", serif', display: 'Bodoni 72, Didot, Georgia, serif', mono: 'Courier New, monospace' }),
  classic: freeze({ body: 'Georgia, Cambria, "Times New Roman", serif', display: 'Georgia, Cambria, "Times New Roman", serif', mono: 'Courier New, monospace' }),
  "modern-serif": freeze({ body: 'Charter, Constantia, Georgia, serif', display: 'Iowan Old Style, Baskerville, Georgia, serif', mono: 'Menlo, monospace' }),
  slab: freeze({ body: 'Rockwell, "Roboto Slab", Georgia, serif', display: 'Rockwell Extra Bold, Rockwell, Georgia, serif', mono: 'Courier New, monospace' }),
  news: freeze({ body: 'Charter, Georgia, serif', display: 'Franklin Gothic Medium, Arial Narrow, Arial, sans-serif', mono: 'Courier New, monospace' }),
  academic: freeze({ body: 'Palatino Linotype, Book Antiqua, Palatino, serif', display: 'Palatino Linotype, Book Antiqua, Palatino, serif', mono: 'Latin Modern Mono, Courier New, monospace' }),
  legal: freeze({ body: 'Century Schoolbook, Georgia, serif', display: 'Baskerville, Times New Roman, serif', mono: 'Courier New, monospace' }),
  luxury: freeze({ body: 'Avenir, Gill Sans, sans-serif', display: 'Didot, Bodoni 72, Times New Roman, serif', mono: 'Menlo, monospace' }),
  studio: freeze({ body: 'Gill Sans, Calibri, sans-serif', display: 'Avenir Next, Futura, sans-serif', mono: 'Menlo, monospace' }),
  creator: freeze({ body: 'Trebuchet MS, Arial, sans-serif', display: 'Avenir Next, Trebuchet MS, sans-serif', mono: 'Consolas, monospace' }),
  rounded: freeze({ body: 'Nunito, Avenir Next Rounded, Trebuchet MS, sans-serif', display: 'Arial Rounded MT Bold, Avenir Next Rounded, sans-serif', mono: 'SFMono-Regular, monospace' }),
  soft: freeze({ body: 'Aptos, Calibri, ui-sans-serif, sans-serif', display: 'Aptos Display, Calibri, ui-sans-serif, sans-serif', mono: 'Cascadia Mono, monospace' }),
  condensed: freeze({ body: 'Arial Narrow, Roboto Condensed, Arial, sans-serif', display: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', mono: 'Consolas, monospace' }),
  technical: freeze({ body: 'Bahnschrift, DIN Alternate, Arial, sans-serif', display: 'Bahnschrift Condensed, DIN Condensed, Arial Narrow, sans-serif', mono: 'Cascadia Code, Consolas, monospace' }),
  terminal: freeze({ body: 'Cascadia Mono, SFMono-Regular, Consolas, monospace', display: 'Cascadia Mono, SFMono-Regular, Consolas, monospace', mono: 'Cascadia Mono, SFMono-Regular, Consolas, monospace' }),
  code: freeze({ body: 'IBM Plex Sans, Aptos, Arial, sans-serif', display: 'IBM Plex Sans, Aptos Display, Arial, sans-serif', mono: 'IBM Plex Mono, Cascadia Code, Consolas, monospace' }),
  fintech: freeze({ body: 'Aptos, Inter, Arial, sans-serif', display: 'Avenir Next, Aptos Display, sans-serif', mono: 'Cascadia Mono, Consolas, monospace' }),
  healthcare: freeze({ body: 'Frutiger, Myriad Pro, Segoe UI, sans-serif', display: 'Frutiger, Myriad Pro, Segoe UI, sans-serif', mono: 'Consolas, monospace' }),
  athletic: freeze({ body: 'Arial, Helvetica, sans-serif', display: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', mono: 'Consolas, monospace' }),
  gaming: freeze({ body: 'Trebuchet MS, Arial, sans-serif', display: 'Copperplate, Impact, fantasy', mono: 'Cascadia Mono, Consolas, monospace' }),
  scifi: freeze({ body: 'Eurostile, Microgramma, Arial, sans-serif', display: 'Bank Gothic, Eurostile, Arial, sans-serif', mono: 'Cascadia Mono, Consolas, monospace' }),
  retro: freeze({ body: 'Courier New, Courier, monospace', display: 'Cooper Black, Rockwell Extra Bold, serif', mono: 'Courier New, monospace' }),
  deco: freeze({ body: 'Gill Sans, Arial, sans-serif', display: 'Copperplate, Didot, serif', mono: 'Courier New, monospace' }),
  brutal: freeze({ body: 'Arial, Helvetica, sans-serif', display: 'Arial Black, Impact, sans-serif', mono: 'Courier New, monospace' }),
  playful: freeze({ body: 'Comic Sans MS, Chalkboard SE, sans-serif', display: 'Marker Felt, Chalkboard SE, sans-serif', mono: 'Courier New, monospace' }),
  commerce: freeze({ body: 'Aptos, Helvetica Neue, Arial, sans-serif', display: 'Avenir Next, Helvetica Neue, sans-serif', mono: 'SFMono-Regular, Consolas, monospace' })
});

export const SHAPES = freeze(["square", "subtle", "rounded", "soft", "pill", "organic", "cut", "ticket", "arch", "blob", "diamond", "notched", "scoop", "slant", "brutal", "window"]);
export const SURFACES = freeze(["plain", "paper", "raised", "sunken", "glass", "frosted", "gradient", "mesh", "noise", "outline", "ink", "accent", "aurora", "spotlight"]);
export const MOTIONS = freeze(["none", "fade", "rise", "fall", "slide-left", "slide-right", "zoom", "pop", "blur", "flip", "wipe", "rotate", "float", "drift", "pulse", "glow", "bounce", "spring"]);
export const DENSITIES = freeze(["air", "comfortable", "standard", "compact", "dense", "micro"]);
export const SHADOWS = freeze(["none", "hairline", "soft", "medium", "deep", "float", "hard", "glow"]);
export const BORDERS = freeze(["none", "hairline", "solid", "strong", "double", "dashed", "dotted", "brutal", "gradient", "glow"]);
export const HOVERS = freeze(["none", "lift", "press", "glow", "tilt", "scale", "slide", "invert", "underline", "shine", "magnetic", "reveal"]);
export const SPACING = freeze(["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"]);
export const LAYERS = freeze(["base", "raised", "sticky", "overlay", "modal", "toast"]);
export const PALETTE_NAMES = freeze(Object.keys(PALETTES));
export const FONT_NAMES = freeze(Object.keys(FONT_PRESETS));

export const DEFAULT_DESIGN = freeze({
  palette: "blueprint",
  font: "system",
  shape: "rounded",
  surface: "plain",
  motionStyle: "rise",
  density: "standard",
  shadow: "soft"
});

export const NAMED_RECIPES = freeze({
  saas: freeze({ palette: "blueprint", font: "product", shape: "rounded", surface: "plain", motionStyle: "rise", density: "standard", shadow: "soft" }),
  dashboard: freeze({ palette: "slate", font: "technical", shape: "subtle", surface: "raised", motionStyle: "fade", density: "compact", shadow: "hairline" }),
  editorial: freeze({ palette: "sand", font: "editorial", shape: "square", surface: "paper", motionStyle: "fade", density: "air", shadow: "none" }),
  portfolio: freeze({ palette: "mono", font: "studio", shape: "subtle", surface: "plain", motionStyle: "slide-left", density: "air", shadow: "hairline" }),
  luxury: freeze({ palette: "luxury", font: "luxury", shape: "subtle", surface: "paper", motionStyle: "blur", density: "air", shadow: "deep" }),
  fintech: freeze({ palette: "indigo", font: "fintech", shape: "rounded", surface: "glass", motionStyle: "rise", density: "compact", shadow: "soft" }),
  health: freeze({ palette: "mint", font: "healthcare", shape: "soft", surface: "paper", motionStyle: "fade", density: "comfortable", shadow: "soft" }),
  legal: freeze({ palette: "coffee", font: "legal", shape: "square", surface: "paper", motionStyle: "fade", density: "comfortable", shadow: "hairline" }),
  gaming: freeze({ palette: "violet", font: "gaming", shape: "cut", surface: "aurora", motionStyle: "glow", density: "compact", shadow: "glow" }),
  brutal: freeze({ palette: "brutal", font: "brutal", shape: "brutal", surface: "plain", motionStyle: "pop", density: "compact", shadow: "hard" }),
  terminal: freeze({ palette: "graphite", font: "terminal", shape: "square", surface: "ink", motionStyle: "none", density: "dense", shadow: "hairline" }),
  playful: freeze({ palette: "candy", font: "rounded", shape: "blob", surface: "gradient", motionStyle: "bounce", density: "comfortable", shadow: "float" }),
  commerce: freeze({ palette: "rose", font: "commerce", shape: "rounded", surface: "paper", motionStyle: "rise", density: "standard", shadow: "soft" }),
  studio: freeze({ palette: "graphite", font: "studio", shape: "square", surface: "plain", motionStyle: "slide-right", density: "air", shadow: "none" }),
  news: freeze({ palette: "mono", font: "news", shape: "square", surface: "paper", motionStyle: "fade", density: "dense", shadow: "none" }),
  "sci-fi": freeze({ palette: "cyan", font: "scifi", shape: "cut", surface: "mesh", motionStyle: "glow", density: "compact", shadow: "glow" }),
  retro: freeze({ palette: "amber", font: "retro", shape: "brutal", surface: "noise", motionStyle: "pop", density: "compact", shadow: "hard" }),
  minimal: freeze({ palette: "mono", font: "swiss", shape: "square", surface: "plain", motionStyle: "fade", density: "air", shadow: "none" })
});

export const DESIGN_RECIPE_COUNT = 10000;

function fromAxis(names, cursor) {
  return names[cursor % names.length];
}

function stableSalt(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function decodeDesignRecipe(value) {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) return { ...value };
  const raw = String(value).trim().toLowerCase();
  if (NAMED_RECIPES[raw]) return { ...NAMED_RECIPES[raw], recipe: raw };
  const match = /^d(\d{1,4})$/.exec(raw);
  if (!match) return null;
  const index = Number(match[1]);
  if (index < 0 || index >= DESIGN_RECIPE_COUNT) return null;
  const paletteIndex = index % PALETTE_NAMES.length;
  const fontIndex = Math.floor(index / PALETTE_NAMES.length) % FONT_NAMES.length;
  const group = Math.floor(index / (PALETTE_NAMES.length * FONT_NAMES.length));
  return {
    recipe: `d${String(index).padStart(4, "0")}`,
    palette: PALETTE_NAMES[paletteIndex],
    font: FONT_NAMES[fontIndex],
    shape: SHAPES[(group + paletteIndex * 3 + fontIndex * 5) % SHAPES.length],
    surface: SURFACES[(index * 7 + Math.floor(index / 97) * 3 + 11) % SURFACES.length],
    motionStyle: MOTIONS[(index * 11 + Math.floor(index / 31) * 5 + 7) % MOTIONS.length],
    density: DENSITIES[(index * 5 + Math.floor(index / 67) + 3) % DENSITIES.length],
    shadow: SHADOWS[(index * 3 + Math.floor(index / 43) + 5) % SHADOWS.length]
  };
}

function supported(value, values, fallback) {
  return values.includes(String(value)) ? String(value) : fallback;
}

export function resolveDesign(attrs = {}, fallback = DEFAULT_DESIGN) {
  const recipe = decodeDesignRecipe(attrs.recipe) ?? {};
  const base = { ...DEFAULT_DESIGN, ...fallback, ...recipe };
  return {
    recipe: recipe.recipe ?? (typeof attrs.recipe === "string" ? attrs.recipe : attrs.recipe ? "custom" : base.recipe ?? ""),
    palette: supported(attrs.palette ?? base.palette, PALETTE_NAMES, DEFAULT_DESIGN.palette),
    font: supported(attrs.font ?? base.font, FONT_NAMES, DEFAULT_DESIGN.font),
    displayFont: supported(attrs["display-font"] ?? base.displayFont ?? attrs.font ?? base.font, FONT_NAMES, DEFAULT_DESIGN.font),
    monoFont: supported(attrs["mono-font"] ?? base.monoFont ?? "terminal", FONT_NAMES, "terminal"),
    shape: supported(attrs.shape ?? base.shape, SHAPES, DEFAULT_DESIGN.shape),
    surface: supported(attrs.surface ?? base.surface, SURFACES, DEFAULT_DESIGN.surface),
    motionStyle: supported(attrs["motion-style"] ?? base.motionStyle, MOTIONS, DEFAULT_DESIGN.motionStyle),
    density: supported(attrs.density ?? base.density, DENSITIES, DEFAULT_DESIGN.density),
    shadow: supported(attrs.shadow ?? base.shadow, SHADOWS, DEFAULT_DESIGN.shadow)
  };
}
