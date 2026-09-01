export {
  ATTRIBUTE_ALIASES,
  BLOCK_ALIASES,
  CATALOG,
  DESIGN_AXES,
  DENSITIES,
  EXTENDED_CATALOG,
  MACROS,
  MOTIONS,
  RECIPE_COUNT,
  SEMANTIC_CATALOG,
  SEMANTIC_MACRO_COUNT,
  SHADOWS,
  SHAPES,
  SURFACES,
  VIRTUAL_BLOCK_COUNT,
  VIRTUAL_BLOCKS_PER_FAMILY,
  compactCatalog,
  designManifest,
  getBlock,
  getCatalog,
  resolveDesign,
  resolveFontPair,
  resolvePalette,
  resolveRecipe,
  resolveVirtualBlock
} from "./generation2.js";
export { normalizeCompactSource } from "./normalizer-v2.js";
export { ADVANCED_CSS, ADVANCED_RUNTIME, buildDesignCss } from "./generation2-assets.js";
export { buildFile, compile, normalizeBase, writeBuild } from "./compiler-v3.js";
export { AppBlocksError, formatDiagnostic, formatDiagnostics } from "./diagnostics.js";
export { parse } from "./parser-v2.js";
export { renderNode, renderPage } from "./render.js";
export { assertValid, validate } from "./validate.js";
export { VERSION } from "./version.js";
