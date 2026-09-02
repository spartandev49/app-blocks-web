import { icon } from "./icons.js";
import { bool, child, children, escapeAttribute, escapeHtml, list, safeUrl, slugify, text } from "./utils.js";
import { classes, commonAttributes, renderAll, renderButton, renderLink } from "./render-helpers.js";

function renderHeader(node, context) {
  const logo = node.attrs.logo ?? context.siteName;
  const links = node.children.filter((item) => item.name === "link");
  const nav = child(node, "nav");
  const actions = node.children.filter((item) => item.name === "button" || item.name === "badge");
  const navContent = renderAll(nav ? [...nav.children, ...links] : links, context);
  const themeToggle = bool(node.attrs["theme-toggle"], true)
    ? `<button class="ab-icon-button" type="button" data-theme-toggle aria-label="Change color theme" aria-pressed="false"><span data-theme-icon>${icon("moon")}</span></button>`
    : "";
  return `<header class="${classes(node, "ab-header", bool(node.attrs.sticky) ? "ab-header--sticky" : "")}"${commonAttributes(node)}>
    <a class="ab-brand" href="${escapeAttribute(safeUrl(node.attrs.href ?? "/", context.base))}">${icon("blocks")}<span>${escapeHtml(logo)}</span></a>
    <button class="ab-nav-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">${icon("menu")}<span class="ab-sr-only">Open navigation</span></button>
    <nav id="site-navigation" class="${nav ? classes(nav, "ab-nav") : "ab-nav"}" aria-label="${escapeAttribute(nav?.attrs.label ?? "Primary")}" data-nav-panel>${navContent}</nav>
    <div class="ab-header__actions">${themeToggle}${renderAll(actions, context)}</div>
  </header>`;
}

function renderFooter(node, context) {
  const navs = children(node, "nav");
  const loose = node.children.filter((item) => !navs.includes(item));
  return `<footer class="${classes(node, "ab-footer")}"${commonAttributes(node)}>
    <div class="ab-footer__brand"><span class="ab-brand">${icon("blocks")}<span>${escapeHtml(node.attrs.logo ?? context.siteName)}</span></span><p>${escapeHtml(node.attrs.note ?? "Built from compact, inspectable AppBlocks.")}</p></div>
    ${navs.map((nav) => `<nav aria-label="${escapeAttribute(nav.attrs.label ?? text(nav, "Footer"))}"><strong>${escapeHtml(nav.attrs.label ?? text(nav, "Explore"))}</strong>${renderAll(nav.children, context)}</nav>`).join("")}
    <div class="ab-footer__meta">${renderAll(loose, context)}<span>© ${new Date().getUTCFullYear()} ${escapeHtml(context.siteName)}</span></div>
  </footer>`;
}

function renderField(node) {
  const name = node.attrs.name ?? slugify(node.attrs.label ?? `field-${node.loc.line}`);
  const id = `${name}-${node.loc.line}`;
  const type = node.attrs.type ?? "text";
  const required = bool(node.attrs.required);
  const nativeAttributes = [
    ["autocomplete", node.attrs.autocomplete], ["min", node.attrs.min], ["max", node.attrs.max],
    ["step", node.attrs.step], ["pattern", node.attrs.pattern], ["minlength", node.attrs.minlength],
    ["maxlength", node.attrs.maxlength], ["accept", node.attrs.accept]
  ].filter(([, value]) => value !== undefined).map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`).join("");
  const flags = [
    required ? " required" : "", bool(node.attrs.multiple) ? " multiple" : "",
    bool(node.attrs.disabled) ? " disabled" : "", bool(node.attrs.readonly) ? " readonly" : ""
  ].join("");
  const base = `id="${escapeAttribute(id)}" name="${escapeAttribute(name)}"${flags}${nativeAttributes}`;
  let control;
  if (type === "textarea") {
    control = `<textarea ${base}${node.attrs.placeholder ? ` placeholder="${escapeAttribute(node.attrs.placeholder)}"` : ""}>${escapeHtml(node.attrs.value ?? "")}</textarea>`;
  } else if (type === "select" || node.children.some((item) => item.name === "option")) {
    const options = children(node, "option");
    const values = options.length ? options : list(node.attrs.options).map((value) => ({ args: [value], attrs: { value }, children: [] }));
    control = `<select ${base}>${values.map((option) => `<option value="${escapeAttribute(option.attrs.value ?? text(option))}"${bool(option.attrs.selected) ? " selected" : ""}${bool(option.attrs.disabled) ? " disabled" : ""}>${escapeHtml(text(option))}</option>`).join("")}</select>`;
  } else if (type === "checkbox") {
    control = `<input ${base} type="checkbox" value="${escapeAttribute(node.attrs.value ?? "true")}"${bool(node.attrs.checked) ? " checked" : ""}>`;
  } else {
    control = `<input ${base} type="${escapeAttribute(type)}"${node.attrs.placeholder ? ` placeholder="${escapeAttribute(node.attrs.placeholder)}"` : ""}${node.attrs.value !== undefined ? ` value="${escapeAttribute(node.attrs.value)}"` : ""}>`;
  }
  return `<div class="${classes(node, "ab-field", type === "checkbox" ? "ab-field--check" : "")}"><label for="${escapeAttribute(id)}">${escapeHtml(node.attrs.label ?? name)}</label>${control}<span class="ab-field__message"><small data-field-help>${escapeHtml(node.attrs.help ?? "")}</small><span class="ab-field__error" data-field-error aria-live="polite"></span></span></div>`;
}

function renderForm(node, context) {
  const fields = children(node, "field");
  const explicitButton = child(node, "button");
  const id = node.attrs.id ?? `form-${node.loc.line}`;
  const demo = bool(node.attrs.demo);
  return `<form id="${escapeAttribute(id)}" class="${classes(node, "ab-form")}" action="${escapeAttribute(safeUrl(node.attrs.action ?? "#", context.base))}" method="${escapeAttribute(node.attrs.method ?? "post")}"${demo ? ' data-demo-form="true" novalidate' : ""}${node.attrs.success ? ` data-success-message="${escapeAttribute(node.attrs.success)}"` : ""}${node.attrs.target ? ` data-target-table="${escapeAttribute(node.attrs.target)}"` : ""}>
    ${fields.map(renderField).join("")}${renderAll(node.children.filter((item) => !fields.includes(item) && item !== explicitButton), context)}
    ${explicitButton ? renderButton(explicitButton, context, { type: "submit" }) : `<button class="ab-button ab-button--solid" type="submit"><span>${escapeHtml(node.attrs.submit ?? "Submit")}</span>${icon("arrow")}</button>`}
    <div class="ab-form__status" aria-live="polite" data-form-status></div>
  </form>`;
}

export function renderContent(node, context) {
  switch (node.name) {
    case "header": return renderHeader(node, context);
    case "footer": return renderFooter(node, context);
    case "nav": return `<div class="${classes(node, "ab-nav-group")}">${renderAll(node.children, context)}</div>`;
    case "link": return renderLink(node, context);
    case "button": return renderButton(node, context);
    case "breadcrumbs": return `<nav class="${classes(node, "ab-breadcrumbs")}" aria-label="Breadcrumb">${renderAll(node.children, context)}</nav>`;
    case "eyebrow": return `<span class="${classes(node, "ab-eyebrow")}">${node.attrs.icon ? icon(node.attrs.icon) : ""}${escapeHtml(text(node))}</span>`;
    case "title": {
      const level = Math.max(1, Math.min(6, Number(node.attrs.level ?? 2)));
      return `<h${level} class="${classes(node, "ab-title")}">${escapeHtml(text(node))}</h${level}>`;
    }
    case "heading": {
      const level = Math.max(2, Math.min(6, Number(node.attrs.level ?? 3)));
      return `<h${level} class="${classes(node, "ab-heading")}"${node.attrs.id ? ` id="${escapeAttribute(node.attrs.id)}"` : ""}>${escapeHtml(text(node))}</h${level}>`;
    }
    case "text": return `<p class="${classes(node, "ab-text", node.attrs.tone ? `is-${slugify(node.attrs.tone)}` : "", node.attrs.size ? `is-${slugify(node.attrs.size)}` : "")}">${escapeHtml(text(node))}</p>`;
    case "badge": return `<span class="${classes(node, "ab-badge", `ab-badge--${slugify(node.attrs.variant ?? "neutral")}`)}">${node.attrs.icon ? icon(node.attrs.icon) : ""}${escapeHtml(text(node))}</span>`;
    case "tag": return `<span class="${classes(node, "ab-tag", node.attrs.tone ? `is-${slugify(node.attrs.tone)}` : "")}">${escapeHtml(text(node))}</span>`;
    case "icon": return icon(node.attrs.name ?? text(node, "spark"), node.attrs.label ?? "", node.attrs.size ?? "");
    case "image": return `<img class="${classes(node, "ab-image")}" src="${escapeAttribute(safeUrl(node.attrs.src ?? "", context.base))}" alt="${escapeAttribute(node.attrs.alt ?? "")}"${node.attrs.width ? ` width="${escapeAttribute(node.attrs.width)}"` : ""}${node.attrs.height ? ` height="${escapeAttribute(node.attrs.height)}"` : ""} loading="${escapeAttribute(node.attrs.loading ?? "lazy")}">`;
    case "code": return `<code class="${classes(node, "ab-code")}">${escapeHtml(text(node))}</code>`;
    case "code-block": {
      const contentNode = child(node, "code") ?? child(node, "text");
      const content = text(contentNode, text(node));
      return `<div class="${classes(node, "ab-code-block", `ab-code-block--${slugify(node.attrs.variant ?? "dark")}`)}"><div class="ab-code-block__head"><span>${escapeHtml(node.attrs.label ?? node.attrs.language ?? "appblocks")}</span>${bool(node.attrs.copy, true) ? `<button type="button" data-copy aria-label="Copy code">${icon("copy")}<span>Copy</span></button>` : ""}</div><pre><code>${escapeHtml(content)}</code></pre></div>`;
    }
    case "quote": return `<blockquote class="${classes(node, "ab-quote")}"><p>${escapeHtml(text(node))}</p>${node.attrs.by ? `<cite>${escapeHtml(node.attrs.by)}${node.attrs.role ? `<span>${escapeHtml(node.attrs.role)}</span>` : ""}</cite>` : ""}</blockquote>`;
    case "list": {
      const tag = bool(node.attrs.ordered) ? "ol" : "ul";
      return `<${tag} class="${classes(node, "ab-list")}">${children(node, "item").map((item) => `<li>${item.attrs.icon ? icon(item.attrs.icon) : icon("check")}${item.children.length ? renderAll(item.children, context) : escapeHtml(text(item))}</li>`).join("")}</${tag}>`;
    }
    case "item": {
      const content = renderAll(node.children, context) || escapeHtml(text(node, node.attrs.value ?? ""));
      return node.attrs.href ? `<a class="${classes(node, "ab-item")}" href="${escapeAttribute(safeUrl(node.attrs.href, context.base))}">${content}</a>` : `<div class="${classes(node, "ab-item")}">${content}</div>`;
    }
    case "form": return renderForm(node, context);
    case "field": return renderField(node);
    case "option": return "";
    default: return null;
  }
}
