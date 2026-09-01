import { ADVANCED_BLOCK_NAMES, VIRTUAL_FAMILIES } from "./v2-preprocess.js";

const freeze = (value) => Object.freeze(value);

export const PALETTES = freeze([
  { name: "cobalt", bg: "#f7f9ff", paper: "#ffffff", paper2: "#edf2ff", ink: "#10172a", muted: "#59657c", line: "#ced7ee", accent: "#315efb", accent2: "#1736a3", soft: "#e4ebff", mode: "light" },
  { name: "ultraviolet", bg: "#faf8ff", paper: "#ffffff", paper2: "#f0ebff", ink: "#1d1434", muted: "#675b7d", line: "#d9cfee", accent: "#7657ff", accent2: "#4930b8", soft: "#ece7ff", mode: "light" },
  { name: "orchid", bg: "#fff8fe", paper: "#ffffff", paper2: "#fceafb", ink: "#2a1428", muted: "#795b75", line: "#ead0e6", accent: "#c33fb0", accent2: "#812574", soft: "#f9e2f5", mode: "light" },
  { name: "raspberry", bg: "#fff8fa", paper: "#ffffff", paper2: "#ffeaf0", ink: "#2d121b", muted: "#7b5963", line: "#efd0d8", accent: "#d52c61", accent2: "#8f173c", soft: "#ffe1ea", mode: "light" },
  { name: "ember", bg: "#fff9f6", paper: "#ffffff", paper2: "#ffede5", ink: "#2e1710", muted: "#7c6057", line: "#edd4ca", accent: "#e3542d", accent2: "#9a2c12", soft: "#ffe4da", mode: "light" },
  { name: "amber", bg: "#fffbf3", paper: "#ffffff", paper2: "#fff1cf", ink: "#2b2110", muted: "#75674d", line: "#e8dab8", accent: "#b86b00", accent2: "#7d4300", soft: "#ffedc0", mode: "light" },
  { name: "citron", bg: "#fbfdf4", paper: "#ffffff", paper2: "#f1f7d6", ink: "#202712", muted: "#626c4a", line: "#d8e0bd", accent: "#718f12", accent2: "#455d00", soft: "#edf5c7", mode: "light" },
  { name: "forest", bg: "#f6fcf8", paper: "#ffffff", paper2: "#e5f6ea", ink: "#10251a", muted: "#536c5c", line: "#c9e1d1", accent: "#18854f", accent2: "#075a32", soft: "#daf2e3", mode: "light" },
  { name: "mint", bg: "#f4fdfb", paper: "#ffffff", paper2: "#ddf7f0", ink: "#102721", muted: "#526e66", line: "#c6e5dc", accent: "#148b72", accent2: "#065b49", soft: "#d5f4eb", mode: "light" },
  { name: "lagoon", bg: "#f3fcfd", paper: "#ffffff", paper2: "#dcf4f7", ink: "#0e262b", muted: "#4f6c72", line: "#c4e3e7", accent: "#07879a", accent2: "#005966", soft: "#d3f1f4", mode: "light" },
  { name: "sky", bg: "#f5fbff", paper: "#ffffff", paper2: "#e2f3ff", ink: "#102330", muted: "#566a78", line: "#c9e0ee", accent: "#167fc4", accent2: "#075385", soft: "#dbefff", mode: "light" },
  { name: "slate", bg: "#f7f9fb", paper: "#ffffff", paper2: "#edf1f5", ink: "#18202a", muted: "#5d6977", line: "#d1d8e0", accent: "#536579", accent2: "#2e3b49", soft: "#e8edf2", mode: "light" },
  { name: "graphite", bg: "#f7f7f7", paper: "#ffffff", paper2: "#ededed", ink: "#171717", muted: "#666666", line: "#d2d2d2", accent: "#353535", accent2: "#111111", soft: "#e8e8e8", mode: "light" },
  { name: "sand", bg: "#fcfaf5", paper: "#fffefb", paper2: "#f3ede1", ink: "#282218", muted: "#716859", line: "#ddd4c4", accent: "#8b623a", accent2: "#5d3d20", soft: "#efe5d6", mode: "light" },
  { name: "clay", bg: "#fcf8f5", paper: "#fffdfa", paper2: "#f3e8df", ink: "#2b201a", muted: "#75635a", line: "#dfd0c6", accent: "#a45738", accent2: "#70331d", soft: "#f1e1d7", mode: "light" },
  { name: "rosewater", bg: "#fff9f9", paper: "#ffffff", paper2: "#f9ebec", ink: "#2a1c1e", muted: "#756165", line: "#e5d1d4", accent: "#a85663", accent2: "#713542", soft: "#f6e3e6", mode: "light" },
  { name: "midnight", bg: "#090d18", paper: "#111827", paper2: "#182236", ink: "#f2f5ff", muted: "#a6b0c6", line: "#2b3852", accent: "#7c9cff", accent2: "#b7c6ff", soft: "#1d2b50", mode: "dark" },
  { name: "deep-violet", bg: "#110b1e", paper: "#1b122d", paper2: "#251a3b", ink: "#f7f1ff", muted: "#b8a8cc", line: "#3a2a52", accent: "#b094ff", accent2: "#ddceff", soft: "#30204f", mode: "dark" },
  { name: "night-orchid", bg: "#180b17", paper: "#241222", paper2: "#31182f", ink: "#fff2fd", muted: "#c1a5bd", line: "#4a2946", accent: "#f080df", accent2: "#ffc4f4", soft: "#44203e", mode: "dark" },
  { name: "black-cherry", bg: "#180a0f", paper: "#251117", paper2: "#321720", ink: "#fff2f5", muted: "#c1a4ac", line: "#4c2731", accent: "#ff6f9d", accent2: "#ffc1d5", soft: "#451d2b", mode: "dark" },
  { name: "charcoal-ember", bg: "#170d09", paper: "#25150f", paper2: "#321c14", ink: "#fff4ee", muted: "#c1aaa0", line: "#4b2d22", accent: "#ff825f", accent2: "#ffc6b5", soft: "#46251a", mode: "dark" },
  { name: "bronze-night", bg: "#141007", paper: "#211a0d", paper2: "#2d2412", ink: "#fff7df", muted: "#bdb095", line: "#463a20", accent: "#e5a42f", accent2: "#ffda8a", soft: "#3f3014", mode: "dark" },
  { name: "moss-night", bg: "#0e1208", paper: "#171d0e", paper2: "#202817", ink: "#f6fadd", muted: "#adb59a", line: "#354029", accent: "#a4c64c", accent2: "#d5e993", soft: "#2d3a1c", mode: "dark" },
  { name: "pine-night", bg: "#07120c", paper: "#0e1e15", paper2: "#14291d", ink: "#edfff4", muted: "#9fb9a9", line: "#254231", accent: "#4fd38a", accent2: "#a3edc2", soft: "#173a27", mode: "dark" },
  { name: "teal-night", bg: "#061312", paper: "#0c201e", paper2: "#122b28", ink: "#ebfffc", muted: "#9dbab6", line: "#234542", accent: "#43d7c1", accent2: "#9ff1e5", soft: "#153b36", mode: "dark" },
  { name: "ocean-night", bg: "#061116", paper: "#0c1c24", paper2: "#122732", ink: "#ecfaff", muted: "#9fb6bf", line: "#24404b", accent: "#51c6e6", accent2: "#a8e9f7", soft: "#163744", mode: "dark" },
  { name: "blue-night", bg: "#07101b", paper: "#0e1a2a", paper2: "#14243a", ink: "#eef6ff", muted: "#a2b3c6", line: "#273d57", accent: "#62aef5", accent2: "#b1d8ff", soft: "#193351", mode: "dark" },
  { name: "steel-night", bg: "#0b0f14", paper: "#141b23", paper2: "#1b2530", ink: "#f1f5f9", muted: "#a5b0bd", line: "#303d4b", accent: "#8fa6bd", accent2: "#ced9e4", soft: "#253443", mode: "dark" },
  { name: "carbon", bg: "#090909", paper: "#141414", paper2: "#1e1e1e", ink: "#f6f6f6", muted: "#adadad", line: "#363636", accent: "#d4d4d4", accent2: "#ffffff", soft: "#292929", mode: "dark" },
  { name: "espresso", bg: "#120e0b", paper: "#1e1712", paper2: "#292019", ink: "#fff8f0", muted: "#b9aa9c", line: "#42352b", accent: "#d3a172", accent2: "#f2cfad", soft: "#38291e", mode: "dark" },
  { name: "aubergine", bg: "#130c12", paper: "#20141e", paper2: "#2b1b29", ink: "#fff4fd", muted: "#bba8b8", line: "#443142", accent: "#d898c9", accent2: "#f4cae9", soft: "#392338", mode: "dark" },
  { name: "ink", bg: "#07090d", paper: "#10141b", paper2: "#181e28", ink: "#f8fafc", muted: "#a7b0be", line: "#2c3543", accent: "#f3c969", accent2: "#ffe7a8", soft: "#332d1e", mode: "dark" }
]);

export const FONT_PRESETS = freeze([
  { name: "neo-grotesk", display: "Inter, ui-sans-serif, system-ui, sans-serif", body: "Inter, ui-sans-serif, system-ui, sans-serif", mono: "ui-monospace, SFMono-Regular, Menlo, monospace", tracking: "-.035em" },
  { name: "humanist", display: "Avenir Next, Avenir, Segoe UI, sans-serif", body: "Avenir Next, Avenir, Segoe UI, sans-serif", mono: "Cascadia Mono, Consolas, monospace", tracking: "-.025em" },
  { name: "geometric", display: "Futura, Century Gothic, Avenir Next, sans-serif", body: "Avenir Next, Segoe UI, sans-serif", mono: "IBM Plex Mono, Consolas, monospace", tracking: "-.045em" },
  { name: "swiss", display: "Helvetica Neue, Helvetica, Arial, sans-serif", body: "Helvetica Neue, Helvetica, Arial, sans-serif", mono: "SFMono-Regular, Menlo, monospace", tracking: "-.04em" },
  { name: "editorial", display: "Iowan Old Style, Baskerville, Times New Roman, serif", body: "Avenir Next, Segoe UI, sans-serif", mono: "ui-monospace, Menlo, monospace", tracking: "-.025em" },
  { name: "literary", display: "Charter, Bitstream Charter, Georgia, serif", body: "Charter, Bitstream Charter, Georgia, serif", mono: "Courier Prime, ui-monospace, monospace", tracking: "-.02em" },
  { name: "transitional", display: "Baskerville, Baskerville Old Face, Georgia, serif", body: "Baskerville, Georgia, serif", mono: "ui-monospace, Menlo, monospace", tracking: "-.025em" },
  { name: "modern-serif", display: "Didot, Bodoni MT, Times New Roman, serif", body: "Avenir Next, Segoe UI, sans-serif", mono: "ui-monospace, Menlo, monospace", tracking: "-.035em" },
  { name: "slab", display: "Rockwell, Rockwell Nova, Courier New, serif", body: "Avenir Next, Segoe UI, sans-serif", mono: "Rockwell, Courier New, monospace", tracking: "-.03em" },
  { name: "technical", display: "Bahnschrift, DIN Alternate, Arial Narrow, sans-serif", body: "Bahnschrift, Segoe UI, sans-serif", mono: "Cascadia Code, Consolas, monospace", tracking: "-.03em" },
  { name: "industrial", display: "Arial Black, Helvetica Neue, sans-serif", body: "Arial, Helvetica, sans-serif", mono: "Lucida Console, monospace", tracking: "-.055em" },
  { name: "rounded", display: "Arial Rounded MT Bold, Nunito, ui-rounded, sans-serif", body: "Trebuchet MS, Segoe UI, sans-serif", mono: "SFMono-Regular, monospace", tracking: "-.035em" },
  { name: "friendly", display: "Trebuchet MS, Avenir Next, sans-serif", body: "Trebuchet MS, Segoe UI, sans-serif", mono: "Cascadia Mono, monospace", tracking: "-.03em" },
  { name: "windows", display: "Segoe UI Variable Display, Segoe UI, sans-serif", body: "Segoe UI Variable Text, Segoe UI, sans-serif", mono: "Cascadia Code, Consolas, monospace", tracking: "-.035em" },
  { name: "apple", display: "-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif", body: "-apple-system, BlinkMacSystemFont, SF Pro Text, sans-serif", mono: "SFMono-Regular, Menlo, monospace", tracking: "-.04em" },
  { name: "android", display: "Roboto, Noto Sans, Arial, sans-serif", body: "Roboto, Noto Sans, Arial, sans-serif", mono: "Roboto Mono, monospace", tracking: "-.035em" },
  { name: "open-source", display: "Liberation Sans, DejaVu Sans, sans-serif", body: "Liberation Sans, DejaVu Sans, sans-serif", mono: "Liberation Mono, DejaVu Sans Mono, monospace", tracking: "-.03em" },
  { name: "newspaper", display: "Georgia, Times New Roman, serif", body: "Arial, Helvetica, sans-serif", mono: "Courier New, monospace", tracking: "-.035em" },
  { name: "magazine", display: "Didot, Georgia, serif", body: "Gill Sans, Trebuchet MS, sans-serif", mono: "Courier New, monospace", tracking: "-.04em" },
  { name: "academic", display: "Palatino Linotype, Book Antiqua, Palatino, serif", body: "Palatino Linotype, Georgia, serif", mono: "Courier New, monospace", tracking: "-.02em" },
  { name: "classic", display: "Garamond, Baskerville, Georgia, serif", body: "Garamond, Georgia, serif", mono: "Courier New, monospace", tracking: "-.02em" },
  { name: "book", display: "Hoefler Text, Iowan Old Style, Georgia, serif", body: "Hoefler Text, Iowan Old Style, Georgia, serif", mono: "Menlo, monospace", tracking: "-.018em" },
  { name: "terminal", display: "Cascadia Code, SFMono-Regular, Consolas, monospace", body: "Cascadia Mono, SFMono-Regular, Consolas, monospace", mono: "Cascadia Code, SFMono-Regular, Consolas, monospace", tracking: "-.04em" },
  { name: "code", display: "JetBrains Mono, Cascadia Code, Consolas, monospace", body: "Inter, Segoe UI, sans-serif", mono: "JetBrains Mono, Cascadia Code, Consolas, monospace", tracking: "-.045em" },
  { name: "console", display: "Lucida Console, Monaco, monospace", body: "Lucida Sans Unicode, Segoe UI, sans-serif", mono: "Lucida Console, Monaco, monospace", tracking: "-.04em" },
  { name: "condensed", display: "Arial Narrow, Bahnschrift Condensed, sans-serif", body: "Arial, Helvetica, sans-serif", mono: "Cascadia Mono, monospace", tracking: "-.025em" },
  { name: "wide", display: "Copperplate, Copperplate Gothic Light, serif", body: "Avenir Next, Segoe UI, sans-serif", mono: "Menlo, monospace", tracking: ".005em" },
  { name: "display", display: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif", body: "Arial, Helvetica, sans-serif", mono: "Consolas, monospace", tracking: "-.045em" },
  { name: "soft-serif", display: "Cochin, Georgia, serif", body: "Avenir Next, Segoe UI, sans-serif", mono: "Menlo, monospace", tracking: "-.025em" },
  { name: "system-mix", display: "ui-serif, Georgia, serif", body: "ui-sans-serif, system-ui, sans-serif", mono: "ui-monospace, monospace", tracking: "-.03em" }
]);

export const VISUAL_SYSTEMS = freeze([
  "signal", "editorial", "blueprint", "aurora", "brutalist", "glass", "paper", "terminal", "luxury",
  "playful", "industrial", "organic", "minimal", "maximal", "dashboard", "spatial", "retro", "cinematic"
]);
export const SHAPES = freeze(["square", "soft", "round", "pill", "cut", "notch", "ticket", "arch", "blob", "mixed"]);
export const SURFACES = freeze(["flat", "bordered", "raised", "glass", "paper", "ink", "gradient", "mesh"]);
export const MOTIONS = freeze(["none", "fade", "rise", "slide", "scale", "blur", "flip", "spring", "stagger", "parallax", "marquee", "magnetic"]);
export const DENSITIES = freeze(["airy", "comfortable", "balanced", "compact", "dense", "editorial", "display", "data"]);
export const SHADOWS = freeze(["none", "hairline", "soft", "medium", "hard", "float", "glow", "layered"]);
export const RECIPE_COUNT = 10000;

function recipeNumber(value) {
  const match = String(value ?? "d0000").toLowerCase().match(/(?:d|recipe-?)?(\d{1,4})/);
  return Math.max(0, Math.min(RECIPE_COUNT - 1, Number(match?.[1] ?? 0)));
}

export function resolveRecipe(value = "d0000") {
  const index = recipeNumber(value);
  const slot = (index * 97) % (PALETTES.length * FONT_PRESETS.length * VISUAL_SYSTEMS.length);
  const paletteIndex = slot % PALETTES.length;
  const fontIndex = Math.floor(slot / PALETTES.length) % FONT_PRESETS.length;
  const systemIndex = Math.floor(slot / (PALETTES.length * FONT_PRESETS.length)) % VISUAL_SYSTEMS.length;
  return freeze({
    id: `d${String(index).padStart(4, "0")}`,
    index,
    palette: PALETTES[paletteIndex],
    font: FONT_PRESETS[fontIndex],
    system: VISUAL_SYSTEMS[systemIndex],
    shape: SHAPES[(index * 7 + Math.floor(index / 13)) % SHAPES.length],
    surface: SURFACES[(index * 11 + Math.floor(index / 17)) % SURFACES.length],
    motion: MOTIONS[(index * 13 + Math.floor(index / 19)) % MOTIONS.length],
    density: DENSITIES[(index * 17 + Math.floor(index / 23)) % DENSITIES.length],
    shadow: SHADOWS[(index * 19 + Math.floor(index / 29)) % SHADOWS.length],
    style: index % 12,
    layout: Math.floor(index / 7) % 10,
    signature: `${slot}:${index % 12}:${Math.floor(index / 7) % 10}`
  });
}

export function listRecipes({ start = 0, limit = 100 } = {}) {
  const first = Math.max(0, Math.min(RECIPE_COUNT, Number(start) || 0));
  const count = Math.max(0, Math.min(1000, Number(limit) || 100));
  return Array.from({ length: Math.min(count, RECIPE_COUNT - first) }, (_, offset) => resolveRecipe(first + offset));
}

export const DESIGN_COUNTS = freeze({
  recipes: RECIPE_COUNT,
  virtualBlocks: VIRTUAL_FAMILIES.reduce((total, family) => total + family.count, 0),
  palettes: PALETTES.length,
  fonts: FONT_PRESETS.length,
  systems: VISUAL_SYSTEMS.length,
  shapes: SHAPES.length,
  surfaces: SURFACES.length,
  motions: MOTIONS.length,
  densities: DENSITIES.length,
  shadows: SHADOWS.length,
  advancedBlocks: ADVANCED_BLOCK_NAMES.length
});

const manifest = (name, category, summary, options = {}) => ({
  name,
  category,
  summary,
  kind: options.kind ?? "block",
  variants: options.variants ?? [],
  attributes: options.attributes ?? [],
  children: options.children ?? [],
  examples: options.examples ?? []
});

const CATEGORY_BY_NAME = new Map([
  ...["carousel", "slide", "marquee", "ticker", "spotlight", "backdrop", "shape", "blob", "orbit", "particles", "constellation", "logo-cloud", "social-proof", "feature-wall", "hero-canvas", "footer-stack"].map((name) => [name, "marketing"]),
  ...["drawer", "dropdown", "popover", "tooltip", "command-palette", "context-menu", "nav-dock", "pagination", "mega-menu", "scroll-progress", "accordion", "accordion-item", "segmented", "segment", "counter", "gauge", "progress", "range", "file-drop", "upload-zone", "switch", "rating", "skeleton", "avatar", "avatars", "data-grid", "stat-card", "auth-shell", "wizard", "wizard-step", "notification-center", "split-pane", "resizable", "calendar", "chat", "message", "tree", "tree-item", "search-box", "filter-bar", "action-bar", "profile-card", "product-card", "metric-card"].map((name) => [name, "application"])
]);

export const ADVANCED_CATALOG = freeze(ADVANCED_BLOCK_NAMES.map((name) => manifest(
  name,
  CATEGORY_BY_NAME.get(name) ?? "layout",
  `High-quality ${name.replace(/-/g, " ")} contract with responsive styling, accessible states and allowlisted browser behavior.`,
  { attributes: ["id", "variant", "class", "motion", "shape", "surface"], children: ["*"] }
)));

export const VIRTUAL_CATALOG = freeze(VIRTUAL_FAMILIES.map((family) => manifest(
  `virtual-${family.canonical}`,
  ["hero", "cta", "pricing", "testimonials", "feature"].includes(family.canonical) ? "marketing" : ["form", "table", "dialog", "chart", "metric", "app-shell"].includes(family.canonical) ? "application" : "layout",
  `${family.count.toLocaleString("en-US")} deterministic ${family.canonical} aliases selected with the compact ${family.prefix}000 through ${family.prefix}999 naming family.`,
  { kind: "structural", attributes: ["variant", "class"], children: ["*"] }
)));

export function designCssForRecipes(recipeIds = ["d0000"], overrides = {}) {
  const ids = [...new Set(recipeIds.length ? recipeIds : ["d0000"])];
  const rules = [];
  const radius = { square: "0", soft: ".45rem", round: "1rem", pill: "999px", cut: ".2rem 1.1rem .2rem 1.1rem", notch: ".15rem", ticket: ".65rem", arch: "2rem 2rem .4rem .4rem", blob: "38% 62% 56% 44% / 46% 38% 62% 54%", mixed: ".25rem 1.2rem .45rem 1.7rem" };
  const density = { airy: "1.25", comfortable: "1.1", balanced: "1", compact: ".88", dense: ".76", editorial: "1.16", display: "1.3", data: ".82" };
  const shadow = {
    none: "none", hairline: "0 1px 0 rgba(0,0,0,.08)", soft: "0 10px 30px rgba(15,23,42,.09)", medium: "0 18px 50px rgba(15,23,42,.15)",
    hard: "7px 7px 0 rgba(15,23,42,.22)", float: "0 28px 80px rgba(15,23,42,.2)", glow: "0 0 0 1px color-mix(in srgb,var(--ab-accent) 32%,transparent),0 18px 70px color-mix(in srgb,var(--ab-accent) 24%,transparent)", layered: "0 1px 2px rgba(0,0,0,.08),0 12px 28px rgba(0,0,0,.12),0 32px 90px rgba(0,0,0,.09)"
  };

  for (const id of ids) {
    const recipe = resolveRecipe(id);
    const palette = overrides.palette ? PALETTES.find((item) => item.name === overrides.palette) ?? recipe.palette : recipe.palette;
    const font = overrides.font ? FONT_PRESETS.find((item) => item.name === overrides.font) ?? recipe.font : recipe.font;
    const shape = overrides.shape && SHAPES.includes(overrides.shape) ? overrides.shape : recipe.shape;
    const surface = overrides.surface && SURFACES.includes(overrides.surface) ? overrides.surface : recipe.surface;
    const recipeDensity = overrides.density && DENSITIES.includes(overrides.density) ? overrides.density : recipe.density;
    const recipeShadow = overrides.shadow && SHADOWS.includes(overrides.shadow) ? overrides.shadow : recipe.shadow;
    rules.push(`.ab-recipe-${recipe.id}{--ab-bg:${palette.bg};--ab-paper:${palette.paper};--ab-paper-2:${palette.paper2};--ab-surface:${palette.paper};--ab-ink:${palette.ink};--ab-muted:${palette.muted};--ab-line:${palette.line};--ab-line-strong:color-mix(in srgb,${palette.line} 62%,${palette.ink});--ab-accent:${palette.accent};--ab-accent-2:${palette.accent2};--ab-accent-soft:${palette.soft};--ab-display:${font.display};--ab-body:${font.body};--ab-mono:${font.mono};--ab-display-track:${font.tracking};--ab-radius:${radius[shape]};--ab-density:${density[recipeDensity]};--ab-shadow-md:${shadow[recipeShadow]};--ab-system:${recipe.system};--ab-surface-mode:${surface};--ab-recipe-motion:${recipe.motion};color-scheme:${palette.mode};}`);
  }
  for (const palette of PALETTES) rules.push(`.ab-palette-${palette.name}{--ab-bg:${palette.bg};--ab-paper:${palette.paper};--ab-paper-2:${palette.paper2};--ab-surface:${palette.paper};--ab-ink:${palette.ink};--ab-muted:${palette.muted};--ab-line:${palette.line};--ab-accent:${palette.accent};--ab-accent-2:${palette.accent2};--ab-accent-soft:${palette.soft};color-scheme:${palette.mode};}`);
  for (const font of FONT_PRESETS) rules.push(`.ab-font-${font.name}{--ab-display:${font.display};--ab-body:${font.body};--ab-mono:${font.mono};--ab-display-track:${font.tracking};}`);
  return rules.join("\n");
}
