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
  if (/addEventListener\(\s*["']scroll["']/.test(contents)) failures.push(`${label} contains a raw scroll event listener`);
  if (contents.includes("AppBlocks Web motion engine 3") && !contents.includes("requestAnimationFrame")) failures.push(`${label} lacks the shared motion scheduler`);
  if (contents.includes("abTasteEngine") && !contents.includes("IntersectionObserver")) failures.push(`${label} lacks Taste observer scheduling`);
}

function auditCss(label, contents) {
  if (/transition\s*:\s*all\b/i.test(contents)) failures.push(`${label} contains an unrestricted transition declaration`);
  if (!contents.includes("prefers-reduced-motion")) failures.push(`${label} lacks reduced-motion handling`);
  if (!contents.includes("focus-visible")) failures.push(`${label} lacks focus-visible treatment`);
  if (contents.includes("AppBlocks Web motion engine 3") && !contents.includes("ab-m3-ripple")) failures.push(`${label} lacks motion microinteraction styles`);
  if (contents.includes("AppBlocks Web Taste Engine 5") && !contents.includes("--t5-accent-ink")) failures.push(`${label} lacks a semantic accent foreground`);
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

  if (result.capabilities?.tasteEngine === 5) {
    if (!result.files.has("appblocks.taste.json")) failures.push(`${example} missing Taste manifest`);
    if (!result.files.has("appblocks.motion5.json")) failures.push(`${example} missing Motion 5 manifest`);
    const taste = JSON.parse(result.files.get("appblocks.taste.json") ?? "{}");
    const motion5 = JSON.parse(result.files.get("appblocks.motion5.json") ?? "{}");
    if (taste.engine !== 5 || taste.recipes !== 10_000_000 || taste.elementLooks !== 1_000_000) failures.push(`${example} has invalid Taste manifest metadata`);
    if (!taste.audit?.passed || taste.audit?.score < 88) failures.push(`${example} fails the Taste quality floor`);
    if (motion5.engine !== 5 || motion5.recipes !== 100_000 || motion5.rawScrollListeners !== false) failures.push(`${example} has invalid Motion 5 metadata`);
    const html = [...result.files.entries()].find(([name]) => name.endsWith(".html"))?.[1] ?? "";
    const css = result.files.get("appblocks.css") ?? "";
    const runtime = result.files.get("appblocks.js") ?? "";
    if (!html.includes('data-ab-taste-engine="5"')) failures.push(`${example} missing Taste HTML marker`);
    if (!css.includes("AppBlocks Web Taste Engine 5")) failures.push(`${example} missing Taste CSS`);
    if (!runtime.includes("abTasteEngine")) failures.push(`${example} missing Taste runtime`);
  }
  if (result.capabilities?.motionEngine === 3) {
    if (!result.files.has("appblocks.motion.json")) failures.push(`${example} missing motion manifest`);
    const motion = JSON.parse(result.files.get("appblocks.motion.json") ?? "{}");
    if (motion.engine !== 3 || motion.recipeCount !== 1_000) failures.push(`${example} has invalid motion manifest metadata`);
    const html = [...result.files.entries()].find(([name]) => name.endsWith(".html"))?.[1] ?? "";
    if (!html.includes('data-ab-motion-engine="3"')) failures.push(`${example} missing motion HTML marker`);
    const css = [...result.files.entries()].find(([name]) => name.endsWith("appblocks.css"))?.[1] ?? "";
    const runtime = [...result.files.entries()].find(([name]) => name.endsWith("appblocks.js"))?.[1] ?? "";
    if (!css.includes("AppBlocks Web motion engine 3")) failures.push(`${example} missing motion CSS`);
    if (!runtime.includes("data-ab-motion-engine") && !runtime.includes("ab-m3")) failures.push(`${example} missing motion runtime`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Static audit passed for ${examples.length} examples and all generated HTML, CSS and JavaScript assets.`);
}
