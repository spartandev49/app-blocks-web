import { readdir, readFile } from "node:fs/promises";
import { compile } from "../src/index.js";

const failures = [];
const directory = new URL("../examples/", import.meta.url);
const examples = (await readdir(directory)).filter((file) => /\.(?:appblocks|ab)$/.test(file)).sort();

function auditHtml(label, contents) {
  const ids = [...contents.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) failures.push(`${label} duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);
  const h1Count = (contents.match(/<h1\b/g) ?? []).length;
  if (h1Count !== 1) failures.push(`${label} expected one h1, found ${h1Count}`);
  const mainCount = (contents.match(/<main\b/g) ?? []).length;
  if (mainCount !== 1) failures.push(`${label} expected one main, found ${mainCount}`);
  const skipTarget = /class="ab-skip-link" href="#([^"]+)"/.exec(contents)?.[1];
  if (!skipTarget || !ids.includes(skipTarget)) failures.push(`${label} missing a valid skip-link target`);
  if (/\son[a-z]+\s*=/i.test(contents)) failures.push(`${label} contains an inline event handler`);
  if (/\s(?:href|src|action)="(?:javascript|vbscript|data):/i.test(contents)) failures.push(`${label} contains an executable URL scheme`);
  if (!contents.includes("appblocks.css") || !contents.includes("appblocks.js")) failures.push(`${label} missing runtime assets`);
}

function auditRuntime(label, contents) {
  if (/\beval\s*\(|new Function\s*\(/.test(contents)) failures.push(`${label} contains dynamic code evaluation`);
  if (/\.innerHTML\s*=|\.outerHTML\s*=|document\.write\s*\(/.test(contents)) failures.push(`${label} performs unsafe HTML insertion`);
}

function auditCss(label, contents) {
  if (/transition\s*:\s*all\b/i.test(contents)) failures.push(`${label} contains an unrestricted transition declaration`);
  if (!contents.includes("prefers-reduced-motion")) failures.push(`${label} lacks reduced-motion handling`);
  if (!contents.includes("focus-visible")) failures.push(`${label} lacks focus-visible treatment`);
}

for (const example of examples) {
  const source = await readFile(new URL(example, directory), "utf8");
  const result = await compile(source, { filename: example, strict: true });
  let htmlCount = 0;
  for (const [file, contents] of result.files) {
    const label = `${example}:${file}`;
    if (file.endsWith(".html")) {
      htmlCount += 1;
      auditHtml(label, contents);
    }
    if (file.endsWith(".js")) auditRuntime(label, contents);
    if (file.endsWith(".css")) auditCss(label, contents);
  }
  if (!htmlCount) failures.push(`${example} generated no HTML routes`);
  if (result.capabilities?.generation === 2) {
    if (!result.files.has("appblocks.design.json")) failures.push(`${example} missing generation-2 design manifest`);
    if (!result.files.has("appblocks.extended-catalog.json")) failures.push(`${example} missing extended catalog`);
    const html = [...result.files.entries()].find(([name]) => name.endsWith(".html"))?.[1] ?? "";
    if (!html.includes('data-ab-engine="2"')) failures.push(`${example} missing generation-2 HTML marker`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Static audit passed for ${examples.length} examples and all generated HTML, CSS and JavaScript assets.`);
}
