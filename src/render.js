import { icon } from "./icons.js";
import { renderApplication } from "./render-application.js";
import { renderContent } from "./render-content.js";
import { classes, cleanClass, commonAttributes, renderAll } from "./render-helpers.js";
import { renderMarketing } from "./render-marketing.js";
import { child, escapeAttribute, escapeHtml, safeUrl, slugify, text } from "./utils.js";

function generic(node, context, tag = "div") {
  return `<${tag} class="${classes(node, `ab-${node.name}`)}"${commonAttributes(node)}>${renderAll(node.children, context)}</${tag}>`;
}

function renderContainer(node, context, tag = "div") {
  const extra = [
    node.attrs.gap ? `ab-gap-${slugify(node.attrs.gap)}` : "",
    node.attrs.align ? `is-align-${slugify(node.attrs.align)}` : "",
    node.attrs.width ? `is-width-${slugify(node.attrs.width)}` : ""
  ];
  const min = String(node.attrs.min ?? "");
  const style = /^\d+(?:\.\d+)?(?:px|rem|em|ch)$/.test(min) ? ` style="--ab-grid-min:${escapeAttribute(min)}"` : "";
  return `<${tag} class="${classes(node, `ab-${node.name}`, extra)}"${commonAttributes(node)}${style}>${renderAll(node.children, context)}</${tag}>`;
}

function renderLayout(node, context) {
  switch (node.name) {
    case "main": return `<main id="${escapeAttribute(node.attrs.id ?? "main-content")}" class="${classes(node, "ab-main")}">${renderAll(node.children, context)}</main>`;
    case "section": return renderContainer(node, context, "section");
    case "grid":
    case "stack":
    case "columns": return renderContainer(node, context);
    case "divider": return `<div class="${classes(node, "ab-divider")}" role="separator">${node.attrs.label ? `<span>${escapeHtml(node.attrs.label)}</span>` : ""}</div>`;
    case "spacer": return `<div class="ab-spacer ab-spacer--${escapeAttribute(node.attrs.size ?? "md")}" aria-hidden="true"></div>`;
    default: return null;
  }
}

function renderReading(node, context) {
  switch (node.name) {
    case "article": return `<article class="${classes(node, "ab-article")}"${commonAttributes(node)}>${renderAll(node.children, context)}</article>`;
    case "prose": return generic(node, context);
    case "callout": return `<aside class="${classes(node, "ab-callout", `ab-callout--${slugify(node.attrs.variant ?? "note")}`)}">${icon(node.attrs.icon ?? (node.attrs.variant === "warning" ? "bolt" : "spark"))}<div>${node.attrs.title ? `<strong>${escapeHtml(node.attrs.title)}</strong>` : ""}${renderAll(node.children, context)}</div></aside>`;
    default: return null;
  }
}

export function renderNode(node, context) {
  const local = context.render ? context : { ...context, render: renderNode };
  return renderContent(node, local)
    ?? renderMarketing(node, local)
    ?? renderApplication(node, local)
    ?? renderLayout(node, local)
    ?? renderReading(node, local)
    ?? "";
}

export function renderPage(page, context) {
  const local = { ...context, render: renderNode };
  const isolated = page.attrs.layout === "app" || page.attrs.layout === "isolated";
  const header = child(page, "header") ?? (isolated ? null : context.sharedHeader);
  const footer = child(page, "footer") ?? (isolated ? null : context.sharedFooter);
  const explicitMain = child(page, "main");
  const content = page.children.filter((node) => node !== header && node !== footer && node !== explicitMain);
  const title = page.attrs.title ?? context.siteName;
  const description = page.attrs.description ?? context.meta.description ?? "Built with AppBlocks Web.";
  const theme = page.attrs.theme ?? context.theme;
  const route = page.args[0] ?? "/";
  const origin = String(context.origin ?? "").replace(/\/+$/, "");
  const canonical = origin ? `${origin}${safeUrl(route, context.base)}` : "";
  const mainId = explicitMain?.attrs.id ?? "main-content";
  const socialImagePath = context.meta.image ? safeUrl(context.meta.image, context.base) : "";
  const socialImage = socialImagePath && origin && socialImagePath.startsWith("/") ? `${origin}${socialImagePath}` : socialImagePath;
  const accent = /^#[0-9a-f]{6}$/i.test(String(context.accent)) ? String(context.accent) : "";
  const accentStyle = accent ? ` style="--ab-accent:${accent};--ab-accent-2:color-mix(in srgb,${accent} 78%,black);--ab-accent-soft:color-mix(in srgb,${accent} 16%,transparent);--ab-focus:${accent}"` : "";
  const bodyClass = cleanClass(page.attrs.class);
  return `<!doctype html>
<html lang="${escapeAttribute(context.lang)}" data-theme="light" data-style="${escapeAttribute(theme)}"${context.motion ? "" : ' data-motion="off"'} class="no-js"${accentStyle}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeAttribute(description)}">
  <meta name="generator" content="AppBlocks Web ${escapeAttribute(context.version)}">
  <meta name="theme-color" content="${escapeAttribute(context.meta["theme-color"] ?? "#f5f2ea")}">
  ${context.meta.author ? `<meta name="author" content="${escapeAttribute(context.meta.author)}">` : ""}
  ${context.meta.robots ? `<meta name="robots" content="${escapeAttribute(context.meta.robots)}">` : ""}
  <meta property="og:title" content="${escapeAttribute(title)}">
  <meta property="og:description" content="${escapeAttribute(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeAttribute(context.siteName)}">
  ${socialImage ? `<meta property="og:image" content="${escapeAttribute(socialImage)}">` : ""}
  ${canonical ? `<meta property="og:url" content="${escapeAttribute(canonical)}">
  <link rel="canonical" href="${escapeAttribute(canonical)}">` : ""}
  <link rel="stylesheet" href="${escapeAttribute(`${context.base}appblocks.css`)}">
  <title>${escapeHtml(title)}</title>
  <script>(()=>{const e=document.documentElement;e.classList.remove('no-js');e.classList.add('js');try{const t=localStorage.getItem('appblocks-theme');e.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch{}})()</script>
</head>
<body data-route="${escapeAttribute(route)}"${bodyClass ? ` class="${escapeAttribute(bodyClass)}"` : ""}>
  <a class="ab-skip-link" href="#${escapeAttribute(mainId)}">Skip to content</a>
  ${header ? renderNode(header, local) : ""}
  ${explicitMain ? renderNode(explicitMain, local) : `<main id="main-content" class="ab-main">${renderAll(content, local)}</main>`}
  ${footer ? renderNode(footer, local) : ""}
  <div class="ab-live-region" aria-live="polite" aria-atomic="true" data-live-region></div>
  <script type="module" src="${escapeAttribute(`${context.base}appblocks.js`)}"></script>
</body>
</html>`;
}
