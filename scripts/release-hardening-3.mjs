import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFile(file(path), "utf8");
const write = (path, value) => writeFile(file(path), value.endsWith("\n") ? value : `${value}\n`);

let preprocess = await read("src/v2-preprocess.js");
preprocess = preprocess.replace(
  'const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", motion: "", density: "", shadow: "" };',
  'const design = { recipe: "d0000", palette: "", font: "", system: "", shape: "", surface: "", motion: "", density: "", shadow: "", pageRecipes: [] };'
);
preprocess = preprocess.replace(
`    if (name === "page") {
      const localRecipe = attrs.has("recipe") ? normalizeRecipe(unquote(attrs.get("recipe"))) : design.recipe;
      attrs.delete("recipe");
      recipeIds.add(localRecipe);
      mergeClass(attrs, \`ab-recipe-\${localRecipe}\`,
        design.palette && \`ab-palette-\${design.palette}\`,
        design.font && \`ab-font-\${design.font}\`,
        design.system && \`ab-system-\${design.system}\`,
        design.shape && \`ab-shape-\${design.shape}\`,
        design.surface && \`ab-surface-\${design.surface}\`,
        design.density && \`ab-density-\${design.density}\`,
        design.shadow && \`ab-shadow-\${design.shadow}\`);
    }`,
`    if (name === "page") {
      const localRecipe = attrs.has("recipe") ? normalizeRecipe(unquote(attrs.get("recipe"))) : design.recipe;
      attrs.delete("recipe");
      recipeIds.add(localRecipe);
      design.pageRecipes.push({ route: unquote(positional[0] ?? "/"), recipe: localRecipe });
    }`
);
await write("src/v2-preprocess.js", preprocess);

let entry = await read("src/v2-index-release.js");
entry = entry.replace(
/function addRecipeClasses\(html, design\) \{[\s\S]*?\n\}\n\nfunction exactSizes/,
`function routeForOutput(path) {
  if (path === "index.html") return "/";
  if (path.endsWith("/index.html")) return \`/\${path.slice(0, -"/index.html".length).replace(/^\\/+|\\/+$/g, "")}/\`;
  return \`/\${path.replace(/\\.html$/, "").replace(/^\\/+/, "")}\`;
}

function addRecipeClasses(html, path, design) {
  const route = routeForOutput(path);
  const recipeId = design.pageRecipes?.find((page) => page.route === route)?.recipe ?? design.recipe;
  const recipe = resolveRecipe(recipeId);
  const classes = [
    \`ab-recipe-\${recipe.id}\`,
    \`ab-system-\${design.system || recipe.system}\`,
    \`ab-recipe-motion-\${design.motion || recipe.motion}\`,
    \`ab-shape-\${design.shape || recipe.shape}\`,
    \`ab-surface-\${design.surface || recipe.surface}\`,
    design.palette && \`ab-palette-\${design.palette}\`,
    design.font && \`ab-font-\${design.font}\`,
    design.density && \`ab-density-\${design.density}\`,
    design.shadow && \`ab-shadow-\${design.shadow}\`
  ].filter(Boolean);
  const withMarker = html.replace(/<html(?![^>]*data-appblocks-design=)/, '<html data-appblocks-design="2"');
  return withMarker.replace(/<body([^>]*)>/, (match, attributes) => {
    const classMatch = attributes.match(/\\sclass=(['"])(.*?)\\1/);
    if (classMatch) {
      const existing = classMatch[2].split(/\\s+/).filter(Boolean);
      const merged = Array.from(new Set([...existing, ...classes])).join(" ");
      return \`<body\${attributes.replace(classMatch[0], \` class=\${classMatch[1]}\${merged}\${classMatch[1]}\`)}>\`;
    }
    return \`<body\${attributes} class="\${classes.join(" ")}">\`;
  });
}

function exactSizes`
);
entry = entry.replace('addRecipeClasses(value, prepared.design));', 'addRecipeClasses(value, path, prepared.design));');
await write("src/v2-index-release.js", entry);

let test = await read("test/combinatorial-design.test.js");
test = test.replace(
  'assert.match(normalized, /page "\\/"[^\\n]*class="[^\"]*ab-recipe-d0421/);',
  'assert.match(normalized, /page "\\/"/);\n  assert.doesNotMatch(normalized, /(?:recipe|\\br)=d0421/);'
);
await write("test/combinatorial-design.test.js", test);

console.log("Moved recipe application behind canonical parsing and strict validation.");
