import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { compile } from "../src/index.js";

test("self-hosted showcase compiles four complete routes", async () => {
  const source = await readFile(new URL("../examples/showcase.appblocks", import.meta.url), "utf8");
  const result = await compile(source, { filename: "showcase.appblocks", strict: true });
  assert.deepEqual(result.manifest.pages.map((page) => page.route), ["/", "/catalog/", "/guide/", "/dashboard/"]);
  for (const file of ["index.html", "catalog/index.html", "guide/index.html", "dashboard/index.html", "appblocks.css", "appblocks.js", "appblocks.catalog.json", "appblocks.manifest.json"]) {
    assert(result.files.has(file), `missing ${file}`);
  }
  assert(result.manifest.output.expansionRatio >= 10, `expected at least 10× expansion, got ${result.manifest.output.expansionRatio}`);
  const actualBytes = [...result.files.values()].reduce((total, value) => total + Buffer.byteLength(value), 0);
  const actualCharacters = [...result.files.values()].reduce((total, value) => total + value.length, 0);
  assert.equal(result.manifest.output.bytes, actualBytes);
  assert.equal(result.manifest.output.estimatedTokens, Math.ceil(actualCharacters / 4));
});

test("shared chrome is inherited by normal pages and omitted from app pages", async () => {
  const source = `site "Atlas"\n  header logo=Atlas\n    link "Home" href=/\n  footer logo=Atlas\n  page "/"\n    hero\n      title "Home" level=1\n  page "/app/" layout=app\n    app-shell\n      toolbar\n        title "App" level=1\n`;
  const result = await compile(source, { strict: true });
  assert.match(result.files.get("index.html"), /class="ab-header/);
  assert.match(result.files.get("index.html"), /class="ab-footer/);
  assert.doesNotMatch(result.files.get("app/index.html"), /class="ab-header/);
  assert.doesNotMatch(result.files.get("app/index.html"), /class="ab-footer/);
});

test("generated pages expose semantic landmarks and runtime assets", async () => {
  const source = `site "Atlas"\n  page "/" title="Atlas"\n    hero\n      title "Atlas" level=1\n      button "Open" href=/app\n`;
  const result = await compile(source);
  const html = result.files.get("index.html");
  assert.match(html, /<!doctype html>/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /href="\/appblocks\.css"/);
  assert.match(html, /src="\/appblocks\.js"/);
  assert.match(html, /href="\/app"/);
});

test("base path prefixes project-relative links and assets", async () => {
  const source = `site "Atlas" base=/atlas/\n  page "/"\n    hero\n      title "Atlas" level=1\n      button "Guide" href=/guide/\n`;
  const result = await compile(source);
  const html = result.files.get("index.html");
  assert.match(html, /href="\/atlas\/guide\/"/);
  assert.match(html, /href="\/atlas\/appblocks\.css"/);
});

test("canonical URLs are absolute when an origin is configured and absent otherwise", async () => {
  const configured = await compile(`site "Atlas" base=/atlas/ origin=https://example.com\n  page "/guide/" title="Guide"\n    title "Guide" level=1\n`);
  const configuredHtml = configured.files.get("guide/index.html");
  assert.match(configuredHtml, /rel="canonical" href="https:\/\/example\.com\/atlas\/guide\/"/);
  assert.match(configuredHtml, /property="og:url" content="https:\/\/example\.com\/atlas\/guide\/"/);

  const local = await compile(`site "Atlas"\n  page "/"\n    title "Atlas" level=1\n`);
  assert.doesNotMatch(local.files.get("index.html"), /rel="canonical"/);
});

test("sortable tables emit accessible controls and keyed form contracts", async () => {
  const result = await compile(`site "Atlas"\n  page "/app/" layout=app\n    toolbar\n      title "Builds" level=1\n    table id=builds label=Builds filter=true sortable=true empty="No builds found"\n      column key=name label=Name\n      column key=status label=Status align=center\n      row\n        cell key=name "Alpha"\n        cell key=status "Ready"\n`);
  const html = result.files.get("app/index.html");
  assert.match(html, /aria-sort="none"/);
  assert.match(html, /data-sort-table="builds"/);
  assert.match(html, /data-key="status"/);
  assert.match(html, /data-filter-noun="record"/);
  assert.match(html, /No builds found/);
  assert.match(result.files.get("appblocks.js"), /function initSort/);
});

test("custom main IDs remain valid skip-link targets", async () => {
  const result = await compile(`site "Atlas"\n  page "/"\n    main id=content\n      title "Atlas" level=1\n`);
  const html = result.files.get("index.html");
  assert.match(html, /class="ab-skip-link" href="#content"/);
  assert.match(html, /<main id="content"/);
});

test("forms preserve native validation outside demos and make authored form buttons submit", async () => {
  const result = await compile(`site "Atlas"\n  page "/"\n    title "Forms" level=1\n    form id=live action=/save method=post\n      field name=email label=Email type=email required=true maxlength=120\n      button "Save" variant=solid\n    form id=fixture demo=true success="Record created"\n      field name=name label=Name required=true\n`);
  const html = result.files.get("index.html");
  assert.match(html, /<form id="live"[^>]*action="\/save"[^>]*>/);
  assert.doesNotMatch(html.match(/<form id="live"[^>]*>/)?.[0] ?? "", /novalidate/);
  const email = html.match(/<input[^>]*name="email"[^>]*>/)?.[0] ?? "";
  assert.match(email, /type="email"/);
  assert.match(email, /\srequired(?:\s|>)/);
  assert.match(email, /maxlength="120"/);
  assert.match(html, /type="submit"[^>]*><span>Save<\/span>/);
  assert.match(html, /id="fixture"[^>]*data-demo-form="true" novalidate[^>]*data-success-message="Record created"/);
});

test("deployment metadata, motion, accent and layout tokens compile safely", async () => {
  const result = await compile(`site "Atlas" base=/atlas/ origin=https://example.com accent="#2457d6" motion=false\n  meta description="Atlas docs" author="Atlas Team" robots="index,follow" image=/social.png\n  page "/" title="Atlas" class=docs-page\n    section width=readable align=center\n      title "Atlas" level=1\n      grid min=18rem gap=sm\n        text "One"\n`);
  const html = result.files.get("index.html");
  assert.match(html, /data-motion="off"/);
  assert.match(html, /--ab-accent:#2457d6/);
  assert.match(html, /<meta name="author" content="Atlas Team">/);
  assert.match(html, /<meta name="robots" content="index,follow">/);
  assert.match(html, /property="og:image" content="https:\/\/example\.com\/atlas\/social\.png"/);
  assert.match(html, /<body data-route="\/" class="docs-page">/);
  assert.match(html, /ab-section[^"\n]*is-align-center[^"\n]*is-width-readable/);
  assert.match(html, /ab-grid[^"\n]*ab-gap-sm[^>]*--ab-grid-min:18rem/);
});

test("every bundled example compiles under strict validation", async () => {
  const directory = new URL("../examples/", import.meta.url);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".appblocks"));
  assert(files.length >= 4);
  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    const result = await compile(source, { filename: file, strict: true });
    assert(result.manifest.pages.length >= 1, `${file} did not generate a page`);
  }
});
