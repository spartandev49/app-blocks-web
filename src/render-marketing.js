import { icon } from "./icons.js";
import { bool, child, children, escapeAttribute, escapeHtml, safeUrl, text } from "./utils.js";
import { classes, commonAttributes, renderAll, renderButton, renderLead } from "./render-helpers.js";

function renderHero(node, context) {
  const visual = node.children.find((item) => ["visual", "code-block", "image", "stats"].includes(item.name));
  const content = node.children.filter((item) => item !== visual);
  const actions = content.filter((item) => item.name === "button" || item.name === "link");
  const copy = content.filter((item) => !actions.includes(item));
  return `<section class="${classes(node, "ab-hero")}"${commonAttributes(node)}><div class="ab-hero__content">${renderAll(copy, context)}${actions.length ? `<div class="ab-actions">${renderAll(actions, context)}</div>` : ""}</div>${visual ? `<div class="ab-hero__visual">${context.render(visual, context)}</div>` : ""}</section>`;
}

function renderVisual(node, context) {
  const variant = String(node.attrs.variant ?? "compiler").toLowerCase();
  if (variant === "compiler") {
    const lines = node.children.filter((item) => item.name === "code").map((item) => escapeHtml(text(item)));
    const source = lines.length ? lines : ["site product theme=blueprint", "  hero split", "  features bento", "  dashboard dense"];
    return `<div class="ab-visual ab-visual--compiler" aria-label="${escapeAttribute(node.attrs.label ?? "AppBlocks compilation diagram")}"><div class="ab-source-card"><span class="ab-window-label">input.appblocks</span><pre>${source.map((line, index) => `<code><i>${String(index + 1).padStart(2, "0")}</i>${line}</code>`).join("\n")}</pre></div><div class="ab-compile-rail" aria-hidden="true"><span></span>${icon("arrow")}</div><div class="ab-output-card"><div class="ab-output-nav"></div><div class="ab-output-copy"></div><div class="ab-output-copy ab-output-copy--short"></div><div class="ab-output-actions"></div><div class="ab-output-grid"><i></i><i></i><i></i></div></div></div>`;
  }
  if (variant === "dashboard" || variant === "metrics") {
    return `<div class="ab-visual ab-visual--dashboard" role="img" aria-label="${escapeAttribute(node.attrs.label ?? "Application dashboard preview")}"><div class="ab-mini-sidebar"></div><div class="ab-mini-main"><span></span><div class="ab-mini-metrics"><i></i><i></i><i></i></div><div class="ab-mini-chart">${[44, 68, 51, 82, 64, 91, 73].map((value) => `<i style="--bar:${value}%"></i>`).join("")}</div></div></div>`;
  }
  return `<div class="ab-visual ab-visual--${escapeAttribute(variant)}">${renderAll(node.children, context)}</div>`;
}

function renderFeature(node, context) {
  const heading = child(node, "title") ?? child(node, "heading");
  const copy = node.children.filter((item) => item !== heading);
  const span = node.attrs.span ? `ab-span-${escapeAttribute(node.attrs.span)}` : "";
  const tone = node.attrs.tone ? `is-${escapeAttribute(node.attrs.tone)}` : "";
  return `<article class="${classes(node, "ab-feature", span, tone)}"${commonAttributes(node)}><div class="ab-feature__mark">${icon(node.attrs.icon ?? "spark")}</div>${heading ? context.render(heading, context) : ""}${renderAll(copy, context)}</article>`;
}

function renderFeatures(node, context) {
  const items = children(node, "feature");
  return `<section class="${classes(node, "ab-features")}"${commonAttributes(node)}>${renderLead(node, context, items)}<div class="ab-features__grid">${items.map((item) => renderFeature(item, context)).join("")}</div></section>`;
}

function renderStat(node, metric = false) {
  const value = node.attrs.value ?? node.args[0] ?? "—";
  const label = node.attrs.label ?? node.args[1] ?? "Metric";
  const change = node.attrs.change ?? node.attrs.detail;
  const progress = Math.max(0, Math.min(100, Number(node.attrs.progress ?? 0)));
  return `<div class="${classes(node, metric ? "ab-metric" : "ab-stat", node.attrs.tone ? `is-${escapeAttribute(node.attrs.tone)}` : "")}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${change ? `<small>${escapeHtml(change)}</small>` : ""}${progress ? `<span class="ab-progress" aria-label="${progress}%"><i style="--progress:${progress}%"></i></span>` : ""}</div>`;
}

function renderStats(node, context, metric = false) {
  const itemName = metric ? "metric" : "stat";
  return `<div class="${classes(node, metric ? "ab-metrics" : "ab-stats")}"${commonAttributes(node)}>${children(node, itemName).map((item) => renderStat(item, metric)).join("")}</div>`;
}

function renderSteps(node, context) {
  const items = children(node, "step");
  return `<section class="${classes(node, "ab-steps")}"${commonAttributes(node)}>${renderLead(node, context, items)}<ol class="ab-steps__list">${items.map((item, index) => {
    const number = item.attrs.number ?? String(index + 1).padStart(2, "0");
    return `<li><span class="ab-step__number">${item.attrs.icon ? icon(item.attrs.icon) : ""}<span>${escapeHtml(number)}</span></span><div>${renderAll(item.children, context)}</div></li>`;
  }).join("")}</ol></section>`;
}

function renderSplit(node, context) {
  const media = node.children.find((item) => ["visual", "image", "code-block", "gallery"].includes(item.name));
  const content = node.children.filter((item) => item !== media);
  return `<section class="${classes(node, "ab-split")}"${commonAttributes(node)}><div class="ab-split__content">${renderAll(content, context)}</div>${media ? `<div class="ab-split__media">${context.render(media, context)}</div>` : ""}</section>`;
}

function renderPricing(node, context) {
  const tiers = children(node, "tier");
  return `<section class="${classes(node, "ab-pricing")}"${commonAttributes(node)}>${renderLead(node, context, tiers)}<div class="ab-pricing__grid">${tiers.map((tier) => {
    const name = tier.attrs.name ?? tier.args[0] ?? "Plan";
    const rawPrice = tier.attrs.price ?? "Custom";
    const price = typeof rawPrice === "number" && node.attrs.currency ? `${node.attrs.currency}${rawPrice}` : rawPrice;
    const action = child(tier, "button");
    const fallbackAction = !action && tier.attrs.href ? `<a class="ab-button ab-button--outline" href="${escapeAttribute(safeUrl(tier.attrs.href, context.base))}"><span>Choose ${escapeHtml(name)}</span>${icon("arrow")}</a>` : "";
    return `<article class="${classes(tier, "ab-tier", bool(tier.attrs.featured) ? "ab-tier--featured" : "")}">${tier.attrs.badge ? `<span class="ab-badge ab-badge--accent">${escapeHtml(tier.attrs.badge)}</span>` : ""}<h3>${escapeHtml(name)}</h3><p class="ab-price"><strong>${escapeHtml(price)}</strong>${tier.attrs.period ? `<span>/${escapeHtml(tier.attrs.period)}</span>` : ""}</p>${renderAll(tier.children.filter((item) => item !== action), context)}${action ? renderButton(action, context) : fallbackAction}</article>`;
  }).join("")}</div></section>`;
}

function renderFaq(node, context) {
  const questions = children(node, "question");
  return `<section class="${classes(node, "ab-faq")}"${commonAttributes(node)}>${renderLead(node, context, questions)}<div class="ab-faq__items">${questions.map((item) => `<details${bool(item.attrs.open) ? " open" : ""}><summary>${escapeHtml(text(item, "Question"))}${icon("plus")}</summary><div>${renderAll(item.children, context)}</div></details>`).join("")}</div></section>`;
}

function renderTestimonials(node, context) {
  const items = children(node, "testimonial");
  return `<section class="${classes(node, "ab-testimonials")}"${commonAttributes(node)}>${renderLead(node, context, items)}<div class="ab-testimonials__grid">${items.map((item) => `<figure class="ab-testimonial">${renderAll(item.children, context)}<figcaption><strong>${escapeHtml(item.attrs.name ?? "Attributed person")}</strong><span>${escapeHtml([item.attrs.role, item.attrs.company].filter(Boolean).join(", "))}</span>${bool(item.attrs.placeholder) || bool(node.attrs.placeholder) ? '<em>Placeholder</em>' : ""}</figcaption></figure>`).join("")}</div></section>`;
}

function generic(node, context, tag = "section") {
  return `<${tag} class="${classes(node, `ab-${node.name}`)}"${commonAttributes(node)}>${renderAll(node.children, context)}</${tag}>`;
}

export function renderMarketing(node, context) {
  switch (node.name) {
    case "hero": return renderHero(node, context);
    case "visual": return renderVisual(node, context);
    case "features": return renderFeatures(node, context);
    case "feature": return renderFeature(node, context);
    case "stats": return renderStats(node, context);
    case "stat": return renderStat(node);
    case "steps": return renderSteps(node, context);
    case "step": return generic(node, context, "article");
    case "split": return renderSplit(node, context);
    case "pricing": return renderPricing(node, context);
    case "tier": return generic(node, context, "article");
    case "faq": return renderFaq(node, context);
    case "question": return generic(node, context, "details");
    case "testimonials": return renderTestimonials(node, context);
    case "testimonial": return generic(node, context, "figure");
    case "proof": {
      const leadNames = new Set(["eyebrow", "title", "heading", "text", "button", "link"]);
      return `<section class="${classes(node, "ab-proof")}"${commonAttributes(node)}>${renderLead(node, context)}<div>${renderAll(node.children.filter((item) => !leadNames.has(item.name)), context)}</div></section>`;
    }
    case "logos": return `<section class="${classes(node, "ab-logos", bool(node.attrs.muted) ? "is-muted" : "")}" aria-label="${escapeAttribute(node.attrs.label ?? "Technologies")}">${node.attrs.label ? `<span>${escapeHtml(node.attrs.label)}</span>` : ""}<div>${renderAll(node.children, context)}</div></section>`;
    case "logo": {
      const content = node.attrs.src ? `<img class="ab-logo__image" src="${escapeAttribute(safeUrl(node.attrs.src, context.base))}" alt="${escapeAttribute(node.attrs.alt ?? text(node))}">` : `<span>${escapeHtml(text(node))}</span>`;
      return node.attrs.href ? `<a class="${classes(node, "ab-logo")}" href="${escapeAttribute(safeUrl(node.attrs.href, context.base))}">${content}</a>` : `<span class="${classes(node, "ab-logo")}">${content}</span>`;
    }
    case "cta": return `<section class="${classes(node, "ab-cta")}"${commonAttributes(node)}>${renderLead(node, context)}</section>`;
    case "comparison":
    case "gallery":
    case "timeline": return generic(node, context);
    case "newsletter": return `<form class="${classes(node, "ab-newsletter")}" action="${escapeAttribute(safeUrl(node.attrs.action ?? "#", context.base))}" method="${escapeAttribute(node.attrs.method ?? "post")}"><label><span class="ab-sr-only">Email address</span><input type="email" name="email" autocomplete="email" required placeholder="${escapeAttribute(node.attrs.placeholder ?? "you@example.com")}"></label><button class="ab-button ab-button--solid" type="submit"><span>${escapeHtml(node.attrs.button ?? "Subscribe")}</span>${icon("arrow")}</button></form>`;
    default: return null;
  }
}

export { renderStat, renderStats };
