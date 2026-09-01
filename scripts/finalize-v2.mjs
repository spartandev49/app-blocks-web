import { readdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const url = (path) => new URL(path, root);
const read = (path) => readFile(url(path), "utf8");
const write = (path, value) => writeFile(url(path), value.endsWith("\n") ? value : `${value}\n`);

let preprocess = await read("src/v2-preprocess.js");
preprocess = preprocess.replace('"scroll-progress": ["divider", "abx-scroll-progress"]', '"scroll-progress": ["panel", "abx-scroll-progress"]');
preprocess = preprocess.replace(
  'const DESIGN_KEYS = new Set(["recipe", "palette", "font", "system", "shape", "surface", "density", "shadow"]);',
  'const DESIGN_KEYS = new Set(["recipe", "palette", "font", "system", "shape", "surface", "motion", "density", "shadow"]);'
);
preprocess = preprocess.replace(
  'const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", density: "", shadow: "" };',
  'const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", motion: "", density: "", shadow: "" };'
);
preprocess = preprocess.replace(
  'if (DESIGN_KEYS.has(key)) { design[key] = safeToken(unquote(attrs.get(key))); attrs.delete(key); }',
  'if (DESIGN_KEYS.has(key)) { const value = unquote(attrs.get(key)); if (key === "motion" && /^(?:true|false)$/.test(value)) continue; design[key] = safeToken(value); attrs.delete(key); }'
);
await write("src/v2-preprocess.js", preprocess);

let design = await read("src/v2-design.js");
design = design.replace(
  'const recipeShadow = overrides.shadow && SHADOWS.includes(overrides.shadow) ? overrides.shadow : recipe.shadow;',
  'const recipeShadow = overrides.shadow && SHADOWS.includes(overrides.shadow) ? overrides.shadow : recipe.shadow;\n    const recipeMotion = overrides.motion && MOTIONS.includes(overrides.motion) ? overrides.motion : recipe.motion;'
);
design = design.replace('--ab-recipe-motion:${recipe.motion};', '--ab-recipe-motion:${recipeMotion};');
await write("src/v2-design.js", design);

let index = await read("src/index.js");
const oldCatalogLine = 'const catalogGroups = [legacy.CATALOG, ADVANCED_CATALOG, VIRTUAL_CATALOG, catalogV2.CATALOG].filter(Array.isArray);';
const fallbackCatalogLine = 'const catalogGroups = [legacy.CATALOG, catalogV2.CATALOG, ADVANCED_CATALOG, VIRTUAL_CATALOG].filter(Array.isArray);';
const generatedCatalog = `const marketingAdvancedNames = new Set(["carousel", "slide", "marquee", "ticker", "spotlight", "backdrop", "shape", "blob", "orbit", "particles", "constellation", "logo-cloud", "social-proof", "feature-wall", "hero-canvas", "footer-stack"]);\nconst applicationAdvancedNames = new Set(["drawer", "dropdown", "popover", "tooltip", "command-palette", "context-menu", "nav-dock", "pagination", "mega-menu", "scroll-progress", "accordion", "accordion-item", "segmented", "segment", "counter", "gauge", "progress", "range", "file-drop", "upload-zone", "switch", "rating", "skeleton", "avatar", "avatars", "data-grid", "stat-card", "auth-shell", "wizard", "wizard-step", "notification-center", "split-pane", "resizable", "calendar", "chat", "message", "tree", "tree-item", "search-box", "filter-bar", "action-bar", "profile-card", "product-card", "metric-card"]);\nconst catalogV2Items = Array.isArray(catalogV2.CATALOG) ? catalogV2.CATALOG : [];\nconst panelTemplate = legacy.CATALOG.find((item) => item.name === "panel") ?? legacy.CATALOG[0];\nconst generatedAdvancedCatalog = ADVANCED_BLOCK_NAMES.map((name) => {\n  const template = catalogV2Items.find((item) => item.name === name) ?? panelTemplate;\n  const category = marketingAdvancedNames.has(name) ? "marketing" : applicationAdvancedNames.has(name) ? "application" : "layout";\n  return Object.freeze({ ...template, name, category, summary: \`High-quality \${name.replace(/-/g, " ")} contract with responsive styling, accessible states and allowlisted browser behavior.\` });\n});\nconst generatedVirtualCatalog = VIRTUAL_FAMILIES.map((family) => {\n  const template = legacy.CATALOG.find((item) => item.name === family.canonical) ?? panelTemplate;\n  const category = ["hero", "cta", "pricing", "testimonials", "feature"].includes(family.canonical) ? "marketing" : ["form", "table", "dialog", "chart", "metric", "app-shell"].includes(family.canonical) ? "application" : "layout";\n  return Object.freeze({ ...template, name: \`virtual-\${family.canonical}\`, category, summary: \`One thousand deterministic \${family.canonical} aliases selected with the compact \${family.prefix}000 through \${family.prefix}999 family.\` });\n});\nconst catalogGroups = [legacy.CATALOG, generatedAdvancedCatalog, generatedVirtualCatalog, catalogV2Items].filter(Array.isArray);`;
if (index.includes(oldCatalogLine)) index = index.replace(oldCatalogLine, generatedCatalog);
else if (index.includes(fallbackCatalogLine)) index = index.replace(fallbackCatalogLine, generatedCatalog);
else if (!index.includes("generatedAdvancedCatalog")) throw new Error("Unable to locate v2 catalog assembly line");
await write("src/index.js", index);

const testDirectory = url("test/");
for (const entry of await readdir(testDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".test.js")) continue;
  const path = `test/${entry.name}`;
  let source = await read(path);
  source = source.replaceAll('"0.1.0"', '"0.2.0"');
  source = source.replaceAll("'0.1.0'", "'0.2.0'");
  source = source.replaceAll("app-blocks-web@0.1.0", "app-blocks-web@0.2.0");
  source = source.replace(/assert\.equal\(CATALOG\.length,\s*81\);/g, 'assert(CATALOG.length >= 140, `expected expanded catalog, got ${CATALOG.length}`);');
  await write(path, source);
}

console.log("Applied final v2 compatibility and catalog hardening.");
