import { icon } from "./icons.js";
import { bool, escapeAttribute, escapeHtml, joinClasses, safeUrl, slugify, text } from "./utils.js";

const REVEAL_BLOCKS = new Set(["section", "hero", "proof", "logos", "stats", "features", "split", "steps", "testimonials", "pricing", "comparison", "faq", "cta", "gallery", "timeline", "article", "app-shell", "kanban", "activity", "catalog"]);

export function cleanClass(value = "") {
  return String(value).split(/\s+/).filter((item) => /^[a-zA-Z_][\w-]*$/.test(item)).join(" ");
}

export function classes(node, base, ...extra) {
  const variant = node.attrs.variant ? `${base}--${slugify(node.attrs.variant)}` : "";
  return joinClasses(base, variant, extra, cleanClass(node.attrs.class));
}

export function commonAttributes(node) {
  const values = [];
  if (node.attrs.id && node.name !== "table" && node.name !== "catalog") values.push(`id="${escapeAttribute(node.attrs.id)}"`);
  if (node.attrs.reveal !== false && (node.attrs.reveal || REVEAL_BLOCKS.has(node.name))) values.push('data-reveal="true"');
  if (node.attrs["aria-label"]) values.push(`aria-label="${escapeAttribute(node.attrs["aria-label"])}"`);
  return values.length ? ` ${values.join(" ")}` : "";
}

export function renderAll(nodes, context) {
  return nodes.map((node) => context.render(node, context)).join("");
}

export function renderLead(node, context, excluded = []) {
  const allowed = new Set(["eyebrow", "title", "heading", "text", "badge", "button", "link"]);
  const content = node.children.filter((item) => allowed.has(item.name) && !excluded.includes(item));
  if (!content.length) return "";
  const actions = content.filter((item) => item.name === "button" || item.name === "link");
  const copy = content.filter((item) => !actions.includes(item));
  return `<div class="ab-lead">${renderAll(copy, context)}${actions.length ? `<div class="ab-actions">${renderAll(actions, context)}</div>` : ""}</div>`;
}

export function renderButton(node, context, options = {}) {
  const label = escapeHtml(text(node, node.attrs.label ?? "Continue"));
  const variant = node.attrs.variant ?? (node.attrs.tone === "primary" ? "solid" : "outline");
  const className = classes(node, "ab-button", `ab-button--${slugify(variant)}`);
  const iconName = node.attrs.icon;
  const disabled = bool(node.attrs.disabled);
  const state = String(node.attrs.state ?? (bool(node.attrs.loading) ? "loading" : "")).toLowerCase();
  if (node.attrs.href) {
    const href = safeUrl(node.attrs.href, context.base);
    const external = /^https?:\/\//.test(href);
    const content = `${iconName ? icon(iconName) : ""}<span>${label}</span>${!external && !["external", "arrow"].includes(iconName) ? icon("arrow") : ""}`;
    if (disabled) return `<span class="${className}" role="link" aria-disabled="true"${state ? ` data-state="${escapeAttribute(state)}"` : ""}>${content}</span>`;
    const target = node.attrs.target ?? (external ? "_blank" : "");
    return `<a class="${className}" href="${escapeAttribute(href)}"${state ? ` data-state="${escapeAttribute(state)}"` : ""}${target ? ` target="${escapeAttribute(target)}"` : ""}${target === "_blank" ? ' rel="noopener noreferrer"' : ""}>${content}${external && iconName !== "external" ? icon("external") : ""}</a>`;
  }
  const content = `${iconName ? icon(iconName) : ""}<span>${label}</span>`;
  const attributes = [
    node.attrs.action ? `data-action="${escapeAttribute(node.attrs.action)}"` : "",
    node.attrs.dialog ? `data-dialog-open="${escapeAttribute(node.attrs.dialog)}"` : "",
    disabled ? "disabled" : "",
    state ? `data-state="${escapeAttribute(state)}"` : "",
    state === "loading" || bool(node.attrs.loading) ? 'aria-busy="true"' : ""
  ].filter(Boolean).join(" ");
  const type = node.attrs.type ?? options.type ?? "button";
  return `<button class="${className}" type="${escapeAttribute(type)}"${attributes ? ` ${attributes}` : ""}>${content}</button>`;
}

export function renderLink(node, context) {
  const href = safeUrl(node.attrs.href ?? "#", context.base);
  const external = /^https?:\/\//.test(href);
  const current = bool(node.attrs.current) ? ' aria-current="page"' : "";
  const target = node.attrs.target ?? (external ? "_blank" : "");
  return `<a class="${classes(node, "ab-link", node.attrs.tone ? `ab-link--${slugify(node.attrs.tone)}` : "")}" href="${escapeAttribute(href)}"${current}${target ? ` target="${escapeAttribute(target)}"` : ""}${target === "_blank" ? ' rel="noopener noreferrer"' : ""}>${node.attrs.icon ? icon(node.attrs.icon) : ""}<span>${escapeHtml(text(node, href))}</span>${external && node.attrs.icon !== "external" ? icon("external") : ""}</a>`;
}
