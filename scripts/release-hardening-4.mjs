import { readdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const read = (path) => readFile(file(path), "utf8");
const write = (path, value) => writeFile(file(path), value.endsWith("\n") ? value : `${value}\n`);

let compactTest = await read("test/combinatorial-design.test.js");
compactTest = compactTest.replace(
  /^\s*assert\.match\(normalized, \/page .*ab-recipe-d0421.*\);\s*$/m,
  '  assert.match(normalized, /page "\\/"/);\n  assert.doesNotMatch(normalized, /(?:recipe|\\br)=d0421/);'
);
await write("test/combinatorial-design.test.js", compactTest);

async function patchSchemas(directory) {
  for (const entry of await readdir(file(directory), { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) await patchSchemas(`${path}/`);
    else if (entry.isFile() && entry.name.endsWith(".json")) {
      const before = await read(path);
      const after = before
        .replaceAll("0.1.0", "0.2.0")
        .replaceAll("0\\\\.1\\\\.0", "0\\\\.2\\\\.0")
        .replaceAll("0\\.1\\.0", "0\\.2\\.0");
      if (after !== before) await write(path, after);
    }
  }
}
await patchSchemas("schemas/");

console.log("Normalized v2 schema versions and compact normalization assertions.");
