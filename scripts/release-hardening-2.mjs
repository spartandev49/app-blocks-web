import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFile(file(path), "utf8");
const write = (path, value) => writeFile(file(path), value.endsWith("\n") ? value : `${value}\n`);

let preprocess = await read("src/v2-preprocess.js");
preprocess = preprocess.replace(/\n\s*if \(family\.variants\.length && !attrs\.has\("variant"\)\) attrs\.set\("variant", family\.variants\[family\.number % family\.variants\.length\]\);/, "");
await write("src/v2-preprocess.js", preprocess);

let entry = await read("src/v2-index-release.js");
if (!entry.includes('export * from "./index-legacy.js";')) {
  entry = entry.replace('import { V2_RUNTIME_JS } from "./v2-runtime.js";\n', 'import { V2_RUNTIME_JS } from "./v2-runtime.js";\n\nexport * from "./index-legacy.js";\n');
}
entry = entry.replace(
  'export function getCatalog(options = {}) {\n  return options.category ? CATALOG.filter((item) => item.category === options.category) : Array.from(CATALOG);\n}\n\nexport function compactCatalog() {\n  return CATALOG.map(compactItem);\n}',
  'export function getCatalog(options = {}) {\n  const category = typeof options === "string" ? options : options.category;\n  return category ? CATALOG.filter((item) => item.category === category) : Array.from(CATALOG);\n}\n\nexport function compactCatalog(options = {}) {\n  return getCatalog(options).map(compactItem);\n}'
);
entry = entry.replace(/\n\s*result\.files\.set\("appblocks\.design\.json", `\$\{JSON\.stringify\(\{[\s\S]*?\}, null, 2\)\}\\n`\);/, "");
await write("src/v2-index-release.js", entry);

console.log("Applied legacy export and generated-file compatibility hardening.");
