import { readFile } from "node:fs/promises";
import * as legacy from "./index-legacy.js";
import * as catalogV2 from "./catalog-v2.js";
import {
  ADVANCED_BLOCK_NAMES,
  COMPACT_ATTRIBUTE_ALIASES,
  COMPACT_BLOCK_ALIASES,
  VIRTUAL_BLOCK_COUNT,
  VIRTUAL_FAMILIES,
  prepareSource
} from "./v2-preprocess.js";
import {
  DESIGN_COUNTS,
  DENSITIES,
  FONT_PRESETS,
  MOTIONS,
  PALETTES,
  RECIPE_COUNT,
  SHADOWS,
  SHAPES,
  SURFACES,
  VISUAL_SYSTEMS,
  designCssForRecipes,
  listRecipes,
  resolveRecipe
} from "./v2-design.js";
import { V2_STATIC_CSS } from "./v2-styles.js";
import { V2_RUNTIME_JS } from "./v2-runtime.js";

export const VERSION = "0.2.0";
export const AppBlocksError = legacy.AppBlocksError;

const marketingAdvancedNames = new Set([
  "carousel", "slide", "marquee", "ticker", "spotlight", "backdrop", "shape", "blob", "orbit", "particles",
  "constellation", "logo-cloud", "social-proof", "feature-wall", "hero-canvas", "footer-stack"
]);
const applicationAdvancedNames = new Set([
  "drawer", "dropdown", "popover", "tooltip", "command-palette", "context-menu", "nav-dock", "pagination", "mega-menu",
  "scroll-progress", "accordion", "accordion-item", "segmented", "segment", "counter", "gauge", "progress", "range",
  "file-drop", "upload-zone", "switch", "rating", "skeleton", "avatar", "avatars", "data-grid", "stat-card", "auth-shell",
  "wizard", "wizard-step", "notification-center", "split-pane", "resizable", "calendar", "chat", "message", "tree",
  "tree-item", "search-box", "filter-bar", "action-bar", "profile-card", "product-card", "metric-card"
]);
const catalogV2Items = Array.isArray(catalogV2.CATALOG) ? catalogV2.CATALOG : [];
const panelTemplate = legacy.CATALOG.find((item) => item.name === "panel") ?? legacy.CATALOG[0];
const generatedAdvancedCatalog = ADVANCED_BLOCK_NAMES.map((name) => {
  const template = catalogV2Items.find((item) => item.name === name) ?? panelTemplate;
  const category = marketingAdvancedNames.has(name) ? "marketing" : applicationAdvancedNames.has(name) ? "application" : "layout";
  return Object.freeze({
    ...template,
    name,
    category,
    summary: `High-quality ${name.replace(/-/g, " ")} contract with responsive styling, accessible states and allowlisted browser behavior.`
  });
});
const generatedVirtualCatalog = VIRTUAL_FAMILIES.map((family) => {
  const template = legacy.CATALOG.find((item) => item.name === family.canonical) ?? panelTemplate;
  const category = ["hero", "cta", "pricing", "testimonials", "feature"].includes(family.canonical)
    ? "marketing"
    : ["form", "table", "dialog", "chart", "metric", "app-shell"].includes(family.canonical)
      ? "application"
      : "layout";
  return Object.freeze({
    ...template,
    name: `virtual-${family.canonical}`,
    category,
    summary: `One thousand deterministic ${family.canonical} aliases selected with the compact ${family.prefix}000 through ${family.prefix}999 family.`
  });
});
const catalogGroups = [legacy.CATALOG, generatedAdvancedCatalog, generatedVirtualCatalog, catalogV2Items];
const byName = new Map();
for (const item of catalogGroups.flat()) {
  if (item?.name && !byName.has(item.name)) byName.set(item.name, Object.freeze({ ...item }));
}
export const CATALOG = Object.freeze(Array.from(byName.values()));

function compactItem(item) {
  return {
    name: item.name,
    category: item.category,
    summary: item.summary,
    kind: item.kind ?? "block",
    variants: item.variants ?? [],
    attributes: item.attributes ?? [],
    children: item.children ?? []
  };
}

function virtualManifest(name) {
  for (const family of VIRTUAL_FAMILIES) {
    const match = name.match(new RegExp(`^${family.prefix}(\\d{3})$`));
    if (!match) continue;
    const number = Number(match[1]);
    return {
      name,
      category: ["hero", "cta", "pricing", "testimonials", "feature"].includes(family.canonical)
        ? "marketing"
        : ["form", "table", "dialog", "chart", "metric", "app-shell"].includes(family.canonical)
          ? "application"
          : "layout",
      summary: `Deterministic ${family.canonical} preset ${number} from the ${family.prefix}000-${family.prefix}999 virtual family.`,
      kind: "virtual",
      canonical: family.canonical,
      preset: number,
      attributes: ["variant", "class"],
      children: ["*"]
    };
  }
  return undefined;
}

export function getBlock(name) {
  return byName.get(name) ?? virtualManifest(String(name));
}

export function getCatalog(options = {}) {
  const category = options.category;
  return category ? CATALOG.filter((item) => item.category === category) : Array.from(CATALOG);
}

export function compactCatalog() {
  return CATALOG.map(compactItem);
}

export function normalizeSource(source, options = {}) {
  return prepareSource(source, options).source;
}

export function parse(source, options = {}) {
  return legacy.parse(prepareSource(source, options).source, options);
}

export function validate(ast, options = {}) {
  return legacy.validate(ast, options);
}

export function assertValid(ast, options = {}) {
  return legacy.assertValid(ast, options);
}

function addRecipeClasses(html) {
  return html
    .replace(/<html(?![^>]*data-appblocks-design=)/, '<html data-appblocks-design="2"')
    .replace(/ab-recipe-(d\d{4})/g, (match, id) => {
      const recipe = resolveRecipe(id);
      return `${match} ab-system-${recipe.system} ab-recipe-motion-${recipe.motion} ab-shape-${recipe.shape} ab-surface-${recipe.surface}`;
    });
}

function exactSizes(files) {
  let bytes = 0;
  let characters = 0;
  for (const value of files.values()) {
    bytes += Buffer.byteLength(value);
    characters += value.length;
  }
  return { bytes, estimatedTokens: Math.ceil(characters / 4) };
}

function stabilizeManifest(result, originalSource, design) {
  const sourceBytes = Buffer.byteLength(originalSource);
  result.manifest.format = "appblocks-web-build";
  result.manifest.engine = `app-blocks-web@${VERSION}`;
  result.manifest.source = {
    bytes: sourceBytes,
    estimatedTokens: Math.ceil(originalSource.length / 4)
  };
  result.manifest.design = {
    version: 2,
    recipes: design.recipes,
    primaryRecipe: design.recipe,
    palette: design.palette || null,
    font: design.font || null,
    system: design.system || null,
    virtualBlocks: design.virtualBlocks,
    advancedBlocks: design.advancedBlocks,
    registry: DESIGN_COUNTS
  };
  result.manifest.files = Array.from(result.files.keys()).sort();

  for (let attempt = 0; attempt < 20; attempt += 1) {
    result.files.set("appblocks.manifest.json", `${JSON.stringify(result.manifest, null, 2)}\n`);
    const size = exactSizes(result.files);
    const next = {
      ...size,
      expansionRatio: Number((size.bytes / Math.max(1, sourceBytes)).toFixed(2))
    };
    const stable = result.manifest.output?.bytes === next.bytes &&
      result.manifest.output?.estimatedTokens === next.estimatedTokens &&
      result.manifest.output?.expansionRatio === next.expansionRatio;
    result.manifest.output = next;
    if (stable) break;
  }
  result.files.set("appblocks.manifest.json", `${JSON.stringify(result.manifest, null, 2)}\n`);
}

function decorateResult(result, originalSource, prepared) {
  const css = result.files.get("appblocks.css") ?? "";
  const runtime = result.files.get("appblocks.js") ?? "";
  result.files.set("appblocks.css", `${css.trimEnd()}\n\n${designCssForRecipes(prepared.design.recipes, prepared.design)}\n\n${V2_STATIC_CSS.trim()}\n`);
  result.files.set("appblocks.js", `${runtime.trimEnd()}\n\n${V2_RUNTIME_JS.trim()}\n`);

  for (const [path, value] of Array.from(result.files)) {
    if (path.endsWith(".html")) result.files.set(path, addRecipeClasses(value));
  }

  result.files.set("appblocks.catalog.json", `${JSON.stringify({
    format: "appblocks-web-catalog",
    version: 2,
    blocks: compactCatalog(),
    design: DESIGN_COUNTS,
    compact: {
      blockAliases: COMPACT_BLOCK_ALIASES,
      attributeAliases: COMPACT_ATTRIBUTE_ALIASES,
      virtualFamilies: VIRTUAL_FAMILIES
    }
  }, null, 2)}\n`);

  stabilizeManifest(result, originalSource, prepared.design);
  return result;
}

export async function compile(source, options = {}) {
  const originalSource = String(source ?? "");
  const prepared = prepareSource(originalSource, options);
  const result = await legacy.compile(prepared.source, options);
  return decorateResult(result, originalSource, prepared);
}

export async function buildFile(filename, options = {}) {
  const source = await readFile(filename, "utf8");
  const { outDir, ...compileOptions } = options;
  const result = await compile(source, { ...compileOptions, filename });
  if (outDir) await writeBuild(result, outDir);
  return result;
}

export const writeBuild = legacy.writeBuild;

export {
  ADVANCED_BLOCK_NAMES,
  COMPACT_ATTRIBUTE_ALIASES,
  COMPACT_BLOCK_ALIASES,
  DESIGN_COUNTS,
  DENSITIES,
  FONT_PRESETS,
  MOTIONS,
  PALETTES,
  RECIPE_COUNT,
  SHADOWS,
  SHAPES,
  SURFACES,
  VIRTUAL_BLOCK_COUNT,
  VIRTUAL_FAMILIES,
  VISUAL_SYSTEMS,
  listRecipes,
  prepareSource,
  resolveRecipe
};
