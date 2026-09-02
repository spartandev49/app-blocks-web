from pathlib import Path
import json
import os
import re

ROOT = Path(__file__).resolve().parents[1]

LAYOUT_MODULE = r'''/**
 * AppBlocks Layout Resilience Contract.
 *
 * Taste layouts are structural contracts, not universal utility classes.
 * Page-scale compositions must never collapse leaf content into implicit,
 * character-width grid tracks.
 */

const STRUCTURAL_LAYOUTS = new Set([
  "editorial-axis", "asymmetric-field", "asymmetric-split", "modular-bento",
  "technical-grid", "poster-stack", "sticky-narrative", "sticky-story",
  "artifact-stage", "split-studio", "catalogue-wall", "cinematic-sequence",
  "ledger", "spatial-map", "index-first", "feature-stack", "portfolio-field",
  "manifesto", "workbench", "long-document", "commerce-story",
  "component-playground", "full-bleed", "rail"
]);

const LEAF_BLOCKS = new Set([
  "title", "heading", "text", "paragraph", "eyebrow", "button", "link",
  "badge", "tag", "icon", "image", "video", "field", "input", "select",
  "textarea", "toggle", "range", "metric", "stat", "feature", "card",
  "panel", "callout", "quote", "code", "list-item", "table-cell"
]);

const COLLECTION_BLOCKS = new Set([
  "grid", "columns", "features", "cards", "stats", "metrics", "pricing",
  "testimonials", "gallery", "steps", "timeline", "comparison", "table",
  "board", "kanban", "list"
]);

const SECTION_BLOCKS = new Set([
  "section", "hero", "proof", "cta", "faq", "header", "footer", "main",
  "page", "app", "app-shell", "sidebar", "toolbar", "workspace", "docs-layout"
]);

const BLOCK_ALIASES = Object.freeze({
  st: "site", pg: "page", sec: "section", sc: "section", gr: "grid",
  cols: "columns", stk: "stack", hd: "header", hr: "hero", ft: "footer",
  ttl: "title", txt: "text", b: "button", btn: "button", crd: "card",
  pnl: "panel", fld: "field", frm: "form", img: "image", tbl: "table",
  met: "metric", stat: "stat", feat: "feature", nav: "navigation"
});

function canonicalBlockName(rawName) {
  const raw = String(rawName || "").toLowerCase();
  if (BLOCK_ALIASES[raw]) return BLOCK_ALIASES[raw];
  if (/^hr\d{3}$/.test(raw)) return "hero";
  if (/^hd\d{3}$/.test(raw)) return "header";
  if (/^ft\d{3}$/.test(raw)) return "footer";
  if (/^sc\d{3}$/.test(raw)) return "section";
  if (/^cr?d?\d{3}$/.test(raw)) return "card";
  if (/^b\d{3}$/.test(raw)) return "button";
  return raw;
}

export const BLOCK_LAYOUT_COMPATIBILITY = Object.freeze({
  leaf: Object.freeze(["quiet-column", "editorial-stack", "offset", "inline", "stack"]),
  collection: Object.freeze([...STRUCTURAL_LAYOUTS, "quiet-column", "editorial-stack", "offset", "stack"]),
  section: Object.freeze([...STRUCTURAL_LAYOUTS, "quiet-column", "editorial-stack", "offset", "stack"])
});

export function layoutsForBlock(blockName) {
  const block = canonicalBlockName(blockName);
  if (LEAF_BLOCKS.has(block)) return BLOCK_LAYOUT_COMPATIBILITY.leaf;
  if (COLLECTION_BLOCKS.has(block)) return BLOCK_LAYOUT_COMPATIBILITY.collection;
  if (SECTION_BLOCKS.has(block)) return BLOCK_LAYOUT_COMPATIBILITY.section;
  return BLOCK_LAYOUT_COMPATIBILITY.section;
}

export function isLayoutCompatible(blockName, layout) {
  const block = canonicalBlockName(blockName);
  const value = String(layout || "").trim().toLowerCase();
  if (!value || value === "auto" || value === "inherit") return true;
  if (LEAF_BLOCKS.has(block) && STRUCTURAL_LAYOUTS.has(value)) return false;
  return true;
}

function readLayoutToken(line) {
  const match = line.match(/(?:^|\s)tl=(?:"([^"]+)"|'([^']+)'|([^\s#]+))/);
  return match ? (match[1] || match[2] || match[3] || "") : "";
}

export function validateTasteLayoutSource(source) {
  const diagnostics = [];
  String(source || "").split(/\r?\n/).forEach((line, index) => {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith("#") || stripped.startsWith("//")) return;
    const name = stripped.match(/^([^\s]+)/)?.[1] || "";
    const layout = readLayoutToken(stripped);
    if (layout && !isLayoutCompatible(name, layout)) {
      diagnostics.push({
        line: index + 1,
        block: canonicalBlockName(name),
        layout,
        message: `Taste layout '${layout}' is not compatible with ${canonicalBlockName(name)}. Move it to a structural container or choose an intrinsic leaf layout.`
      });
    }
  });
  return diagnostics;
}

export function sanitizeTasteSourceLayouts(source) {
  return String(source || "").split(/\r?\n/).map((line) => {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith("#") || stripped.startsWith("//")) return line;
    const name = stripped.match(/^([^\s]+)/)?.[1] || "";
    const layout = readLayoutToken(stripped);
    if (!layout || isLayoutCompatible(name, layout)) return line;
    return line.replace(/\s+tl=(?:"[^"]+"|'[^']+'|[^\s#]+)/, "");
  }).join("\n");
}
'''

RESILIENCE_CSS = r'''

/* APPBLOCKS LAYOUT RESILIENCE 5.1
   Structural safety rules are emitted last and protect every generated site. */
html[data-ab-taste-engine="5"] body {
  --ab-safe-gutter: clamp(1rem, 3vw, 3rem);
  --ab-safe-copy: 72ch;
}
html[data-ab-taste-engine="5"] body :where(*, *::before, *::after) { box-sizing: border-box; }
html[data-ab-taste-engine="5"] body :where(
  .ab-main, .ab-section, .ab-hero, .ab-proof, .ab-features, .ab-stats,
  .ab-metrics, .ab-pricing, .ab-testimonials, .ab-gallery, .ab-steps,
  .ab-grid, .ab-columns, .ab-stack, .ab-card, .ab-feature, .ab-panel,
  .ab-stat, .ab-metric, .ab-footer, .ab-header, .ab-app-shell, .ab-sidebar,
  .ab-workspace, .ab-table, .ab-table-wrap, [class*="ab-taste-layout"],
  [class*="ab-layout-"]
) { min-inline-size: 0; max-inline-size: 100%; }

/* Human language keeps word boundaries. Emergency character breaking belongs
   only to code and machine identifiers. */
html[data-ab-taste-engine="5"] body :where(
  h1, h2, h3, h4, h5, h6, .ab-title, .ab-heading, .ab-hero__title,
  .ab-card__title, .ab-feature__title, .ab-stat__value, .ab-metric__value
) {
  overflow-wrap: normal !important;
  word-break: normal !important;
  hyphens: auto;
  text-wrap: balance;
  max-inline-size: 100%;
}
html[data-ab-taste-engine="5"] body :where(p, li, dd, td, th, .ab-text, .ab-copy) {
  overflow-wrap: break-word;
  word-break: normal;
  text-wrap: pretty;
}
html[data-ab-taste-engine="5"] body :where(code, pre, kbd, samp, .ab-code, .ab-terminal, [data-ab-kind="code"]) {
  overflow-wrap: anywhere;
  word-break: break-word;
}
html[data-ab-taste-engine="5"] body :where(.ab-button, button, .ab-nav__link, .ab-header a, .ab-tabs__tab) {
  white-space: nowrap;
}

/* Page rhythm belongs to direct page children. Nested semantic sections remain
   intrinsic to their parent instead of inheriting viewport-scale padding. */
html[data-ab-taste-engine="5"] body .ab-main :where(
  .ab-section, .ab-proof, .ab-features, .ab-stats, .ab-metrics, .ab-pricing,
  .ab-testimonials, .ab-gallery, .ab-steps, .ab-faq, .ab-cta
) :where(
  .ab-section, .ab-proof, .ab-features, .ab-stats, .ab-metrics, .ab-pricing,
  .ab-testimonials, .ab-gallery, .ab-steps, .ab-faq, .ab-cta
) {
  inline-size: auto !important;
  max-inline-size: 100% !important;
  margin-inline: 0 !important;
  padding-inline: 0 !important;
}
html[data-ab-taste-engine="5"] body .ab-main > :where(
  .ab-section, .ab-proof, .ab-features, .ab-stats, .ab-metrics, .ab-pricing,
  .ab-testimonials, .ab-gallery, .ab-steps, .ab-faq, .ab-cta, .ab-hero
) {
  inline-size: min(100%, var(--ab-content-width, 90rem));
  margin-inline: auto;
  padding-inline: var(--ab-safe-gutter);
}

html[data-ab-taste-engine="5"] body :where(
  .ab-grid, .ab-columns, .ab-features__grid, .ab-cards__grid, .ab-stats__grid,
  .ab-metrics__grid, .ab-pricing__grid, .ab-testimonials__grid,
  .ab-gallery__grid, .ab-steps__grid, .ab-proof__grid, .ab-footer__grid,
  .ab-footer__inner, .ab-app-shell, .ab-workspace, [class*="technical-grid"],
  [class*="modular-bento"], [class*="catalogue-wall"], [class*="ledger"]
) > * { min-inline-size: 0; max-inline-size: 100%; }

/* Structural collections use intrinsic tracks, never fixed tracks that squeeze
   prose into character-width columns. */
html[data-ab-taste-engine="5"] body :where(
  .ab-grid, .ab-features__grid, .ab-cards__grid, .ab-pricing__grid,
  .ab-testimonials__grid, .ab-gallery__grid, .ab-steps__grid,
  [class*="technical-grid"], [class*="modular-bento"], [class*="catalogue-wall"]
) {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)) !important;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-rows: auto !important;
  align-items: stretch;
}

/* Page-scale structural tokens degrade safely if deterministic styling reaches
   a leaf. Explicit incompatible tl= values are also stripped before compile. */
html[data-ab-taste-engine="5"] body :where(
  .ab-card, .ab-feature, .ab-panel, .ab-stat, .ab-metric, .ab-field,
  .ab-button, .ab-title, .ab-text
):is(
  [class*="technical-grid"], [class*="artifact-stage"], [class*="ledger"],
  [class*="spatial-map"], [class*="poster-stack"], [class*="sticky-narrative"],
  [class*="sticky-story"], [class*="cinematic-sequence"],
  [class*="catalogue-wall"], [class*="component-playground"],
  [class*="commerce-story"], [class*="split-studio"]
) {
  display: block !important;
  grid-template-columns: none !important;
  grid-template-rows: none !important;
  grid-column: auto !important;
  grid-row: auto !important;
  inline-size: auto !important;
  block-size: auto !important;
  min-block-size: 0 !important;
  aspect-ratio: auto !important;
  position: relative;
  inset: auto;
}

/* Content controls card height. Look recipes cannot reserve empty viewports or
   push headings to the bottom of a card. */
html[data-ab-taste-engine="5"] body :where(.ab-card, .ab-feature, .ab-panel, .ab-stat, .ab-metric) {
  block-size: auto !important;
  min-block-size: 0 !important;
  max-block-size: none;
  aspect-ratio: auto !important;
  align-content: start;
  container-type: inline-size;
}
html[data-ab-taste-engine="5"] body :where(.ab-feature, .ab-card) > :where(.ab-icon, .ab-icon-wrap, svg):first-child {
  margin-block: 0 clamp(1rem, 3cqi, 1.75rem) !important;
}
html[data-ab-taste-engine="5"] body :where(.ab-feature, .ab-card) :where(h2, h3, h4, .ab-title, .ab-heading) {
  margin-block-start: 0 !important;
}

/* Count-aware statistics. Four values become a balanced 2x2 field rather than
   a three-plus-one row with a large dead zone. */
html[data-ab-taste-engine="5"] body :where(.ab-stats__grid, .ab-metrics__grid, [class*="stats-grid"], [class*="metrics-grid"]) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)) !important;
  grid-auto-rows: auto !important;
  align-items: stretch;
}
@supports selector(:has(*)) {
  html[data-ab-taste-engine="5"] body :where(.ab-stats__grid, .ab-metrics__grid, [class*="stats-grid"], [class*="metrics-grid"]):has(> :nth-child(4):last-child) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
html[data-ab-taste-engine="5"] body :where(.ab-stat__value, .ab-metric__value, .ab-stat > strong, .ab-metric > strong) {
  display: block;
  max-inline-size: 100%;
  white-space: nowrap !important;
  overflow-wrap: normal !important;
  word-break: normal !important;
  font-size: clamp(2rem, 12cqi, 5rem) !important;
  line-height: .9;
  letter-spacing: -.065em;
  font-variant-numeric: tabular-nums lining-nums;
}

/* Footer architecture wins over legacy shape/surface recipes. */
html[data-ab-taste-engine="5"] body .ab-footer {
  position: relative;
  overflow: clip;
  min-block-size: 0 !important;
  border-radius: clamp(1rem, 3vw, 3rem) !important;
}
html[data-ab-taste-engine="5"] body :where(.ab-footer__inner, .ab-footer__grid) {
  display: grid !important;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.9fr) !important;
  align-items: start !important;
  gap: clamp(1.5rem, 4vw, 5rem) !important;
  min-block-size: 0 !important;
}
html[data-ab-taste-engine="5"] body .ab-footer :where(.ab-brand, .ab-logo, .ab-footer__brand, h2, h3) {
  position: static !important;
  inline-size: auto !important;
  max-inline-size: 100%;
  margin: 0;
  font-size: clamp(2rem, 7vw, 6.5rem) !important;
  line-height: .88;
  overflow-wrap: normal !important;
  word-break: normal !important;
}
html[data-ab-taste-engine="5"] body .ab-footer :where(nav, .ab-footer__nav, .ab-footer__links, .ab-links) {
  position: static !important;
  min-inline-size: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: .75rem 1.5rem;
}

/* Application shells keep the work surface fluid. */
html[data-ab-taste-engine="5"] body :where(.ab-app-shell, .ab-dashboard, .ab-workspace, [class*="app-shell"]) {
  grid-template-columns: minmax(13rem, 18rem) minmax(0, 1fr) !important;
  min-inline-size: 0;
  max-inline-size: 100%;
}
html[data-ab-taste-engine="5"] body :where(.ab-sidebar, [class*="sidebar"]) {
  min-inline-size: 0;
  max-inline-size: 100%;
}
html[data-ab-taste-engine="5"] body :where(.ab-table-wrap, .ab-table-container, .ab-data-grid, [class*="table-wrap"]) {
  max-inline-size: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
}
html[data-ab-taste-engine="5"] body :where(.ab-table, table) {
  inline-size: 100%;
  min-inline-size: min(42rem, 100%);
  table-layout: auto;
}

@container (max-width: 28rem) {
  html[data-ab-taste-engine="5"] body :where(.ab-card, .ab-feature, .ab-panel, .ab-stat, .ab-metric) {
    padding: clamp(1rem, 6cqi, 1.5rem) !important;
  }
  html[data-ab-taste-engine="5"] body :where(.ab-card, .ab-feature, .ab-panel) :where(h2, h3, h4, .ab-title) {
    font-size: clamp(1.25rem, 9cqi, 2rem) !important;
  }
}

@media (max-width: 56rem) {
  html[data-ab-taste-engine="5"] body :where(
    .ab-proof, .ab-proof__grid, .ab-steps, .ab-steps__grid,
    [class*="technical-grid"], [class*="asymmetric"], [class*="artifact-stage"],
    [class*="ledger"], [class*="spatial-map"], [class*="poster-stack"],
    [class*="sticky-narrative"], [class*="sticky-story"],
    [class*="cinematic-sequence"], [class*="catalogue-wall"],
    [class*="split-studio"], [class*="component-playground"]
  ) {
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: auto !important;
    grid-auto-columns: minmax(0, 1fr) !important;
    grid-auto-flow: row !important;
    inline-size: 100% !important;
    max-inline-size: 100% !important;
  }
  html[data-ab-taste-engine="5"] body :where(
    .ab-proof, .ab-proof__grid, .ab-steps, .ab-steps__grid,
    [class*="technical-grid"], [class*="asymmetric"], [class*="artifact-stage"],
    [class*="ledger"], [class*="spatial-map"], [class*="poster-stack"],
    [class*="sticky-narrative"], [class*="sticky-story"],
    [class*="cinematic-sequence"], [class*="catalogue-wall"],
    [class*="split-studio"], [class*="component-playground"]
  ) > * {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
    inline-size: auto !important;
    min-inline-size: 0 !important;
    max-inline-size: 100% !important;
    margin-inline: 0 !important;
    position: relative !important;
    inset: auto !important;
  }
  html[data-ab-taste-engine="5"] body :where(.ab-app-shell, .ab-dashboard, .ab-workspace, [class*="app-shell"]) {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: auto !important;
    min-block-size: 0 !important;
  }
  html[data-ab-taste-engine="5"] body :where(.ab-sidebar, [class*="sidebar"]) {
    position: relative !important;
    inset: auto !important;
    inline-size: auto !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    overflow: visible !important;
    align-self: auto !important;
  }
  html[data-ab-taste-engine="5"] body :where(.ab-footer__inner, .ab-footer__grid) {
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: auto !important;
  }
  html[data-ab-taste-engine="5"] body .ab-footer :where(.ab-brand, .ab-logo, .ab-footer__brand, h2, h3) {
    font-size: clamp(2rem, 14vw, 4.5rem) !important;
  }
  html[data-ab-taste-engine="5"] body .ab-footer :where(nav, .ab-footer__nav, .ab-footer__links, .ab-links) {
    grid-template-columns: minmax(0, 1fr) !important;
  }
}

@media (max-width: 45rem) {
  html[data-ab-taste-engine="5"] body :where(.ab-stats__grid, .ab-metrics__grid, [class*="stats-grid"], [class*="metrics-grid"]) {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  html[data-ab-taste-engine="5"] body :where(.ab-stat__value, .ab-metric__value, .ab-stat > strong, .ab-metric > strong) {
    font-size: clamp(2rem, 18cqi, 4rem) !important;
  }
  html[data-ab-taste-engine="5"] body .ab-main > :where(
    .ab-section, .ab-proof, .ab-features, .ab-stats, .ab-metrics, .ab-pricing,
    .ab-testimonials, .ab-gallery, .ab-steps, .ab-faq, .ab-cta, .ab-hero
  ) { padding-inline: clamp(.875rem, 4vw, 1.25rem); }
}
'''

LAYOUT_AUDIT = r'''#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = await mkdtemp(join(tmpdir(), "appblocks-layout-audit-"));
const build = spawnSync(process.execPath, [join(root, "bin/appblocks-v2.js"), "build", join(root, "examples/taste-showcase.ab"), "--out", out, "--strict", "--taste-strict"], { encoding: "utf8" });
if (build.status !== 0) { console.error(build.stdout, build.stderr); process.exit(build.status || 1); }
const names = [process.env.AB_BROWSER_BIN, "google-chrome-stable", "google-chrome", "chromium", "chromium-browser"].filter(Boolean);
let browser = "";
for (const name of names) {
  const found = spawnSync("sh", ["-lc", `command -v ${JSON.stringify(name)}`], { encoding: "utf8" });
  if (found.status === 0 && found.stdout.trim()) { browser = found.stdout.trim(); break; }
}
if (!browser) { console.log("Layout browser audit skipped: no Chromium-compatible browser found."); await rm(out, { recursive: true, force: true }); process.exit(0); }

const injection = String.raw`<script id="ab-layout-audit-source">(() => {
  const visible = el => { const s=getComputedStyle(el),r=el.getBoundingClientRect(); return s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity)!==0&&r.width>0&&r.height>0; };
  const rect = el => el.getBoundingClientRect();
  const lines = el => { const range=document.createRange(); range.selectNodeContents(el); return [...range.getClientRects()].filter(r=>r.width>1&&r.height>1).length; };
  const issues=[]; const width=innerWidth;
  if (document.documentElement.scrollWidth>width+2) issues.push({type:"page-overflow",scrollWidth:document.documentElement.scrollWidth,width});
  for (const el of document.querySelectorAll("h1,h2,h3,h4,.ab-title,.ab-heading,.ab-stat__value,.ab-metric__value")) {
    if (!visible(el)) continue; const t=(el.textContent||"").trim(),r=rect(el),n=lines(el);
    if (t.length>=10&&r.width<Math.min(150,width*.38)&&n>=Math.min(7,Math.ceil(t.length/3))) issues.push({type:"character-column",tag:el.tagName,className:el.className,text:t.slice(0,80),width:Math.round(r.width),lines:n});
    if (/^\d[\d,._-]+$/.test(t)&&n>1) issues.push({type:"wrapped-metric",text:t,width:Math.round(r.width),lines:n});
  }
  for (const el of document.querySelectorAll(".ab-feature,.ab-stat,.ab-metric")) {
    if (!visible(el)) continue; const r=rect(el),children=[...el.children].filter(visible); if (!children.length) continue;
    const top=Math.min(...children.map(c=>rect(c).top)),bottom=Math.max(...children.map(c=>rect(c).bottom)),occupied=Math.max(1,bottom-top);
    if (r.height>360&&r.height>occupied*2.35) issues.push({type:"dead-card-space",className:el.className,height:Math.round(r.height),occupied:Math.round(occupied)});
  }
  if (width<=900) for (const el of document.querySelectorAll(".ab-sidebar,[class*='sidebar']")) {
    if (!visible(el)) continue; const r=rect(el); if (r.height>innerHeight*1.35&&(el.textContent||"").trim().length<1000) issues.push({type:"mobile-sidebar-height",className:el.className,height:Math.round(r.height),viewport:innerHeight});
  }
  for (const footer of document.querySelectorAll(".ab-footer,footer")) {
    if (!visible(footer)) continue;
    const host=footer.querySelector(".ab-footer__inner,.ab-footer__grid")||footer;
    const groups=[...host.children].filter(visible);
    for(let i=0;i<groups.length;i++) for(let j=i+1;j<groups.length;j++) { const a=rect(groups[i]),b=rect(groups[j]); const x=Math.min(a.right,b.right)-Math.max(a.left,b.left),y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top); if(x>8&&y>8) issues.push({type:"footer-overlap",a:groups[i].className,b:groups[j].className,x:Math.round(x),y:Math.round(y)}); }
  }
  const pre=document.createElement("pre"); pre.id="ab-layout-audit"; pre.textContent=JSON.stringify({width,issues}); document.body.append(pre);
})();</script>`;
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);let file=join(out,normalize(pathname).replace(/^([/\\])+/ ,""));try{if((await stat(file)).isDirectory())file=join(file,"index.html");}catch{if(!extname(file))file=join(file,"index.html");}let body=await readFile(file);if(extname(file)===".html")body=Buffer.from(body.toString("utf8").replace("</body>",`${injection}</body>`));res.writeHead(200,{"content-type":types[extname(file)]||"application/octet-stream"});res.end(body);}catch(error){res.writeHead(404);res.end(String(error));}});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve)); const {port}=server.address();
const widths=[320,375,414,768,1024,1280,1440],routes=["/","/patterns/","/workspace/"],failures=[];
for(const width of widths)for(const route of routes){const result=spawnSync(browser,["--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars",`--window-size=${width},1000`,"--virtual-time-budget=1800","--dump-dom",`http://127.0.0.1:${port}${route}`],{encoding:"utf8",maxBuffer:20*1024*1024,timeout:30000});if(result.status!==0){failures.push({route,width,type:"browser-failure",detail:(result.stderr||result.stdout).slice(-1200)});continue;}const match=result.stdout.match(/<pre id="ab-layout-audit">([\s\S]*?)<\/pre>/);if(!match){failures.push({route,width,type:"missing-audit-result"});continue;}const decoded=match[1].replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');try{const payload=JSON.parse(decoded);for(const issue of payload.issues||[])failures.push({route,width,...issue});}catch{failures.push({route,width,type:"invalid-audit-json",detail:decoded.slice(0,500)});}}
server.close(); await rm(out,{recursive:true,force:true});
if(failures.length){console.error(JSON.stringify({ok:false,failures},null,2));process.exit(1);}console.log(`Layout browser audit passed: ${routes.length} routes x ${widths.length} viewport widths.`);
'''

LAYOUT_TEST = r'''import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { isLayoutCompatible, layoutsForBlock, sanitizeTasteSourceLayouts, validateTasteLayoutSource } from "../src/layout-resilience.js";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
test("page-scale Taste layouts cannot be assigned to leaf components", () => {
  assert.equal(isLayoutCompatible("panel", "technical-grid"), false);
  assert.equal(isLayoutCompatible("feature", "artifact-stage"), false);
  assert.equal(isLayoutCompatible("card", "ledger"), false);
  assert.equal(isLayoutCompatible("grid", "technical-grid"), true);
  assert.equal(isLayoutCompatible("section", "artifact-stage"), true);
  assert.ok(layoutsForBlock("panel").includes("quiet-column"));
});
test("incompatible explicit layouts are diagnosed and removed before compilation", () => {
  const source=`st "Test" ts=t0000001\n  pg "/" title="Test"\n    pnl tl=technical-grid\n      ttl "Readable" lvl=1`;
  const diagnostics=validateTasteLayoutSource(source); assert.equal(diagnostics.length,1); assert.equal(diagnostics[0].block,"panel");
  const sanitized=sanitizeTasteSourceLayouts(source); assert.doesNotMatch(sanitized,/pnl tl=technical-grid/); assert.match(sanitized,/pnl\n/);
});
test("Taste CSS ships framework-level wrapping, grid, footer, metric and app-shell guards", async()=>{
  const source=await readFile(join(root,"src/taste5-assets.js"),"utf8");
  assert.match(source,/APPBLOCKS LAYOUT RESILIENCE 5\.1/); assert.match(source,/overflow-wrap: normal !important/); assert.match(source,/grid-column: 1 \/ -1 !important/); assert.match(source,/white-space: nowrap !important/); assert.match(source,/:has\(> :nth-child\(4\):last-child\)/); assert.match(source,/\.ab-sidebar, \[class\*="sidebar"\]/); assert.match(source,/\.ab-footer__inner, \.ab-footer__grid/); assert.match(source,/overflow-x: auto/);
});
'''

(ROOT / "src/layout-resilience.js").write_text(LAYOUT_MODULE)

# Re-export the public safety contract.
taste_path = ROOT / "src/taste5.js"
taste = taste_path.read_text()
export_line = 'export { BLOCK_LAYOUT_COMPATIBILITY, layoutsForBlock, isLayoutCompatible, validateTasteLayoutSource, sanitizeTasteSourceLayouts } from "./layout-resilience.js";'
if export_line not in taste:
    taste_path.write_text(taste.rstrip() + "\n\n" + export_line + "\n")

# Sanitize source before v5 normalization/compilation. The insertion is adaptive
# so the patch remains stable if local function names differ.
compiler_path = ROOT / "src/compiler-v5.js"
compiler = compiler_path.read_text()
if "sanitizeTasteSourceLayouts" not in compiler:
    imports = list(re.finditer(r"^import[^;]+;\s*$", compiler, re.M))
    if imports:
        pos = imports[-1].end()
        compiler = compiler[:pos] + '\nimport { sanitizeTasteSourceLayouts } from "./layout-resilience.js";' + compiler[pos:]
    else:
        compiler = 'import { sanitizeTasteSourceLayouts } from "./layout-resilience.js";\n' + compiler
integrated = "sanitizeTasteSourceLayouts(source)" in compiler or "sanitizeTasteSourceLayouts(input)" in compiler
if not integrated:
    normalizer_names = []
    for match in re.finditer(r'import\s*\{([^}]+)\}\s*from\s*["\']\.\/normalizer-v5\.js["\']', compiler, re.S):
        for item in match.group(1).split(','):
            local = item.strip().split(' as ')[-1].strip()
            if local: normalizer_names.append(local)
    for name in normalizer_names:
        for pattern, replacement in [
            (rf'\b{re.escape(name)}\(\s*source\s*,', f'{name}(sanitizeTasteSourceLayouts(source),'),
            (rf'\b{re.escape(name)}\(\s*source\s*\)', f'{name}(sanitizeTasteSourceLayouts(source))'),
            (rf'\b{re.escape(name)}\(\s*input\s*,', f'{name}(sanitizeTasteSourceLayouts(input),'),
            (rf'\b{re.escape(name)}\(\s*input\s*\)', f'{name}(sanitizeTasteSourceLayouts(input))')
        ]:
            compiler, count = re.subn(pattern, replacement, compiler, count=1)
            if count: integrated = True; break
        if integrated: break
if not integrated:
    for param in ("source", "input"):
        match = re.search(rf'(export\s+(?:async\s+)?function\s+\w+\s*\(\s*{param}\b[^)]*\)\s*\{{)', compiler)
        if match:
            insertion = match.group(1) + f'\n  {param} = sanitizeTasteSourceLayouts({param});'
            compiler = compiler[:match.start()] + insertion + compiler[match.end():]
            integrated = True
            break
if not integrated:
    raise RuntimeError("Could not integrate the layout source sanitizer into compiler-v5.js")
compiler_path.write_text(compiler)

# Append resilience CSS inside the CSS template literal with the strongest
# matching score, preferring the one that identifies Taste Engine 5.
assets_path = ROOT / "src/taste5-assets.js"
assets = assets_path.read_text()
if "APPBLOCKS LAYOUT RESILIENCE 5.1" not in assets:
    candidates = []
    for match in re.finditer(r'(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*`', assets):
        start = match.end(); index = start; escaped = False
        while index < len(assets):
            char = assets[index]
            if char == '`' and not escaped: break
            if char == '\\' and not escaped: escaped = True
            else: escaped = False
            index += 1
        if index < len(assets):
            segment = assets[start:index]
            score = len(segment) + (1_000_000 if "data-ab-taste-engine" in segment else 0) + (100_000 if "{" in segment and ":" in segment else 0)
            candidates.append((score, index))
    if not candidates: raise RuntimeError("No CSS template literal found in taste5-assets.js")
    end = max(candidates)[1]
    assets_path.write_text(assets[:end] + RESILIENCE_CSS + assets[end:])

(ROOT / "scripts/layout-audit.js").write_text(LAYOUT_AUDIT)
os.chmod(ROOT / "scripts/layout-audit.js", 0o755)
(ROOT / "test/layout-resilience.test.js").write_text(LAYOUT_TEST)

pkg_path = ROOT / "package.json"
pkg = json.loads(pkg_path.read_text())
pkg["version"] = "0.4.1"
pkg.setdefault("scripts", {})["audit:layout"] = "node ./scripts/layout-audit.js"
verify = pkg["scripts"].get("verify", "")
if "audit:layout" not in verify:
    pkg["scripts"]["verify"] = (verify + " && npm run audit:layout").strip(" &")
pkg_path.write_text(json.dumps(pkg, indent=2) + "\n")

changelog_path = ROOT / "CHANGELOG.md"
changelog = changelog_path.read_text() if changelog_path.exists() else "# Changelog\n"
entry = '''\n## 0.4.1 - Layout Resilience\n\n- Treat Taste layouts as component contracts instead of universal utility classes.\n- Prevent page-scale compositions from being applied to leaf cards, panels, metrics, and typography.\n- Restore normal word-boundary wrapping for headings and reserve character breaking for code and machine identifiers.\n- Add intrinsic, count-aware metric grids and non-wrapping numeric typography.\n- Remove fixed empty card height behavior and reset explicit grid placement when responsive layouts collapse.\n- Harden nested section sizing, proof splits, footers, application shells, sidebars, and table overflow.\n- Add a Chromium geometry audit covering public routes at 320, 375, 414, 768, 1024, 1280, and 1440 CSS pixels.\n'''
if "## 0.4.1 - Layout Resilience" not in changelog:
    marker = re.search(r"\n##\s", changelog)
    changelog = changelog[:marker.start()] + entry + changelog[marker.start():] if marker else changelog.rstrip() + "\n" + entry
    changelog_path.write_text(changelog)

skill_path = ROOT / ".agents/skills/appblocks-web/SKILL.md"
if skill_path.exists():
    skill = skill_path.read_text()
    addition = '''\n## Layout resilience gate\n\nTreat layout tokens as component contracts. Never place page-scale layouts such as `technical-grid`, `artifact-stage`, `ledger`, `spatial-map`, or `sticky-narrative` on leaf cards, panels, metrics, fields, or text. Verify that headings retain normal word boundaries, metric values stay intact, nested grids never create character-width columns, cards do not reserve unexplained empty height, footer groups do not overlap, mobile sidebars return to intrinsic height, and tables scroll inside their own container. Run `npm run audit:layout` before delivery when Chromium is available.\n'''
    if "## Layout resilience gate" not in skill:
        skill_path.write_text(skill.rstrip() + "\n" + addition)

dts_path = ROOT / "src/taste5.d.ts"
if dts_path.exists():
    dts = dts_path.read_text()
    declaration = '''\nexport declare const BLOCK_LAYOUT_COMPATIBILITY: Readonly<Record<string, readonly string[]>>;\nexport declare function layoutsForBlock(blockName: string): readonly string[];\nexport declare function isLayoutCompatible(blockName: string, layout: string): boolean;\nexport declare function validateTasteLayoutSource(source: string): Array<{ line: number; block: string; layout: string; message: string }>;\nexport declare function sanitizeTasteSourceLayouts(source: string): string;\n'''
    if "isLayoutCompatible" not in dts:
        dts_path.write_text(dts.rstrip() + "\n" + declaration)

print("AppBlocks Layout Resilience 0.4.1 source changes staged.")
