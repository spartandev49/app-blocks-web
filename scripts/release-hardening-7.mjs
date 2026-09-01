import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";

const root = new URL("../", import.meta.url);
const file = (path) => new URL(path, root);
const exists = (path) => access(file(path), constants.F_OK).then(() => true, () => false);

for (const path of ["src/v2-index-release.js", "src/index.js"]) {
  if (!(await exists(path))) continue;
  const before = await readFile(file(path), "utf8");
  let after = before;
  if (!after.includes('result.files.delete("appblocks.design.json")')) {
    after = after.replace(
      '  updateCatalogDocument(result);\n  stabilizeManifest(result, originalSource, prepared.design);',
      '  updateCatalogDocument(result);\n  result.files.delete("appblocks.design.json");\n  stabilizeManifest(result, originalSource, prepared.design);'
    );
  }
  if (after !== before) await writeFile(file(path), after);
}

console.log("Enforced the legacy generated file set while retaining design data in the manifest and API.");
