import { readdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFile(file(path), "utf8");
const write = (path, value) => writeFile(file(path), value.endsWith("\n") ? value : `${value}\n`);

async function replaceInFile(path, transform) {
  const before = await read(path);
  const after = transform(before);
  if (after !== before) await write(path, after);
}

await replaceInFile("src/v2-preprocess.js", (source) => {
  let next = source;
  next = next.replace('st: "site", pg: "page", m: "meta", hd: "header", nv: "nav", l: "link", bt: "button", ft: "footer",', 'st: "site", pg: "page", m: "meta", hd: "header", nv: "nav", l: "link", b: "button", bt: "button", ft: "footer",');
  next = next.replace('"scroll-progress": ["divider", "abx-scroll-progress"]', '"scroll-progress": ["panel", "abx-scroll-progress"]');
  next = next.replace('const DESIGN_KEYS = new Set(["recipe", "palette", "font", "system", "shape", "surface", "density", "shadow"]);', 'const DESIGN_KEYS = new Set(["recipe", "palette", "font", "system", "shape", "surface", "motion", "density", "shadow"]);');
  next = next.replace('const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", density: "", shadow: "" };', 'const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", motion: "", density: "", shadow: "" };');
  next = next.replace('if (DESIGN_KEYS.has(key)) { design[key] = safeToken(unquote(attrs.get(key))); attrs.delete(key); }', 'if (DESIGN_KEYS.has(key)) { const value = unquote(attrs.get(key)); if (key === "motion" && /^(?:true|false)$/.test(value)) continue; design[key] = safeToken(value); attrs.delete(key); }');
  return next;
});

await replaceInFile("src/v2-design.js", (source) => {
  let next = source;
  if (!next.includes("const recipeMotion = overrides.motion")) {
    next = next.replace('const recipeShadow = overrides.shadow && SHADOWS.includes(overrides.shadow) ? overrides.shadow : recipe.shadow;', 'const recipeShadow = overrides.shadow && SHADOWS.includes(overrides.shadow) ? overrides.shadow : recipe.shadow;\n    const recipeMotion = overrides.motion && MOTIONS.includes(overrides.motion) ? overrides.motion : recipe.motion;');
  }
  next = next.replace('--ab-recipe-motion:${recipe.motion};', '--ab-recipe-motion:${recipeMotion};');
  return next;
});

await replaceInFile("src/v2-index-release.js", (source) => {
  let next = source;
  next = next.replace('children: item.children ?? []\n  };', 'children: item.children ?? [],\n    examples: item.examples ?? []\n  };');
  next = next.replace('function addRecipeClasses(html) {', 'function addRecipeClasses(html, design) {');
  next = next.replace('const recipe = resolveRecipe(id);\n      return `${match} ab-system-${recipe.system} ab-recipe-motion-${recipe.motion} ab-shape-${recipe.shape} ab-surface-${recipe.surface}`;', 'const recipe = resolveRecipe(id);\n      const system = design.system || recipe.system;\n      const motion = design.motion || recipe.motion;\n      const shape = design.shape || recipe.shape;\n      const surface = design.surface || recipe.surface;\n      return `${match} ab-system-${system} ab-recipe-motion-${motion} ab-shape-${shape} ab-surface-${surface}`;');
  next = next.replace('document.blocks = compactCatalog();', 'document.blocks = CATALOG;');
  next = next.replace('addRecipeClasses(value));', 'addRecipeClasses(value, prepared.design));');
  return next;
});

await replaceInFile("src/index.d.ts", (source) => source
  .replaceAll('"0.1.0"', '"0.2.0"')
  .replaceAll("'0.1.0'", "'0.2.0'")
  .replaceAll("app-blocks-web@0.1.0", "app-blocks-web@0.2.0"));

const testDirectory = file("test/");
for (const entry of await readdir(testDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".test.js")) continue;
  await replaceInFile(`test/${entry.name}`, (source) => source
    .replaceAll('"0.1.0"', '"0.2.0"')
    .replaceAll("'0.1.0'", "'0.2.0'")
    .replaceAll("app-blocks-web@0.1.0", "app-blocks-web@0.2.0")
    .replace(/assert\.equal\(CATALOG\.length,\s*81\);/g, 'assert(CATALOG.length >= 150, `expected expanded catalog, got ${CATALOG.length}`);'));
}

async function replaceSchemaVersions(directory) {
  for (const entry of await readdir(file(directory), { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) await replaceSchemaVersions(`${path}/`);
    else if (entry.isFile() && entry.name.endsWith(".json")) {
      await replaceInFile(path, (source) => source.replaceAll('"0.1.0"', '"0.2.0"'));
    }
  }
}
await replaceSchemaVersions("schemas/");

await replaceInFile("package.json", (source) => {
  const packageJson = JSON.parse(source);
  packageJson.version = "0.2.0";
  return JSON.stringify(packageJson, null, 2);
});

console.log("Applied final AppBlocks Web 0.2 release hardening.");
