import { readdir, readFile } from "node:fs/promises";
import { compile } from "../src/index.js";

const failures = [];
const directory = new URL("../examples/", import.meta.url);
const examples = (await readdir(directory)).filter((file) => file.endsWith(".appblocks")).sort();

for (const example of examples) {
  const source = await readFile(new URL(example, directory), "utf8");
  const result = await compile(source, { filename: example, strict: true });
  for (const [file, contents] of result.files) {
    if (!file.endsWith(".html")) continue;
    const label = `${example}:${file}`;
    const ids = [...contents.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length) failures.push(`${label} duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);
    const h1Count = (contents.match(/<h1\b/g) ?? []).length;
    if (h1Count !== 1) failures.push(`${label} expected one h1, found ${h1Count}`);
    const mainCount = (contents.match(/<main\b/g) ?? []).length;
    if (mainCount !== 1) failures.push(`${label} expected one main, found ${mainCount}`);
    const skipTarget = /class="ab-skip-link" href="#([^"]+)"/.exec(contents)?.[1];
    if (!skipTarget || !ids.includes(skipTarget)) failures.push(`${label} missing a valid skip-link target`);
    if (/\son[a-z]+\s*=/i.test(contents)) failures.push(`${label} contains inline event handler`);
    if (/\s(?:href|src|action)="(?:javascript|vbscript):/i.test(contents)) failures.push(`${label} contains executable URL scheme`);
    if (!contents.includes("appblocks.css") || !contents.includes("appblocks.js")) failures.push(`${label} missing runtime assets`);
  }
}

const css = await readFile(new URL("../src/appblocks.css", import.meta.url), "utf8");
const runtime = await readFile(new URL("../src/runtime.js", import.meta.url), "utf8");
const transitionAll = new RegExp("transition\\s*:\\s*" + "all", "i");
if (transitionAll.test(css)) failures.push("CSS contains an unrestricted transition declaration");
if (!css.includes("prefers-reduced-motion")) failures.push("CSS lacks reduced-motion handling");
if (!css.includes("focus-visible")) failures.push("CSS lacks focus-visible treatment");
if (/\beval\s*\(|new Function\s*\(/.test(runtime)) failures.push("Runtime contains dynamic code evaluation");
if (/\.innerHTML\s*=/.test(runtime)) failures.push("Runtime assigns innerHTML");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Static audit passed for ${examples.length} examples, ${examples.length + 5} core accessibility/security invariants, and all generated routes.`);
}
