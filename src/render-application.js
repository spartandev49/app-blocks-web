import { CATALOG } from "./catalog.js";
import { icon } from "./icons.js";
import { bool, child, children, escapeAttribute, escapeHtml, safeUrl, text } from "./utils.js";
import { classes, commonAttributes, renderAll } from "./render-helpers.js";
import { renderStat } from "./render-marketing.js";

function renderChart(node) {
  const bars = node.children.filter((item) => item.name === "bar" || item.name === "item");
  const max = Math.max(1, ...bars.map((bar) => Number(bar.attrs.max ?? bar.attrs.value ?? 0)));
  return `<figure class="${classes(node, "ab-chart")}"${commonAttributes(node)}><figcaption>${escapeHtml(node.attrs.label ?? "Chart")}</figcaption><div class="ab-chart__plot">${bars.map((bar) => {
    const value = Number(bar.attrs.value ?? 0);
    const height = Math.max(2, Math.min(100, (value / Number(bar.attrs.max ?? max)) * 100));
    return `<div class="${classes(bar, "ab-bar", bar.attrs.tone ? `is-${escapeAttribute(bar.attrs.tone)}` : "")}"><span style="--bar:${height}%" title="${escapeAttribute(`${bar.attrs.label ?? text(bar, "Value")}: ${value}${node.attrs.unit ?? ""}`)}"></span><small>${escapeHtml(bar.attrs.label ?? text(bar, ""))}</small></div>`;
  }).join("")}</div></figure>`;
}

function cellValue(cellNode, context) {
  if (!cellNode) return "";
  return cellNode.children.length ? renderAll(cellNode.children, context) : escapeHtml(text(cellNode));
}

function searchableText(node) {
  return [node.args.join(" "), ...node.children.map(searchableText)].filter(Boolean).join(" ");
}

function renderTable(node, context) {
  const id = node.attrs.id ?? `table-${node.loc.line}`;
  const columns = children(node, "column");
  const rows = children(node, "row");
  const filter = bool(node.attrs.filter);
  const sortable = bool(node.attrs.sortable);
  const emptyTitle = node.attrs.empty ?? "No records yet";
  const countLabel = `${rows.length} ${rows.length === 1 ? "record" : "records"}`;
  return `<section class="${classes(node, "ab-table-card")}"${commonAttributes(node)}><div class="ab-table-card__head"><div><span class="ab-eyebrow">${escapeHtml(node.attrs.label ?? "Records")}</span><strong data-filter-count>${countLabel}</strong></div>${filter ? `<label class="ab-filter">${icon("search")}<span class="ab-sr-only">Filter ${escapeHtml(node.attrs.label ?? "records")}</span><input type="search" placeholder="Filter records…" data-filter-input="${escapeAttribute(id)}" data-filter-noun="record"></label>` : ""}</div><div class="ab-table-scroll"><table id="${escapeAttribute(id)}"><caption class="ab-sr-only">${escapeHtml(node.attrs.label ?? "Records")}</caption><thead><tr>${columns.map((column, index) => {
    const label = column.attrs.label ?? column.attrs.key ?? text(column, "Column");
    const canSort = bool(column.attrs.sortable, sortable);
    return `<th scope="col" class="${classes(column, "ab-table-column", `is-${escapeAttribute(column.attrs.align ?? "left")}`)}" data-key="${escapeAttribute(column.attrs.key ?? index)}"${canSort ? ' aria-sort="none"' : ""}>${canSort ? `<button type="button" data-sort-table="${escapeAttribute(id)}" data-sort-index="${index}"><span>${escapeHtml(label)}</span>${icon("arrow")}</button>` : escapeHtml(label)}</th>`;
  }).join("")}</tr></thead><tbody>${rows.map((row) => {
    const cells = children(row, "cell");
    const search = cells.map(searchableText).join(" ").toLowerCase();
    return `<tr class="${classes(row, "ab-table-row", row.attrs.status ? `is-${escapeAttribute(row.attrs.status)}` : "")}"${commonAttributes(row)} data-filter-row data-filter-text="${escapeAttribute(search)}">${columns.map((column, index) => {
      const cellNode = cells.find((item) => item.attrs.key === column.attrs.key) ?? cells[index];
      const alignment = `is-${escapeAttribute(column.attrs.align ?? "left")}`;
      const className = cellNode ? classes(cellNode, "ab-table-cell", alignment, cellNode.attrs.tone ? `is-${escapeAttribute(cellNode.attrs.tone)}` : "") : `ab-table-cell ${alignment}`;
      return `<td class="${className}">${cellValue(cellNode, context)}</td>`;
    }).join("")}</tr>`;
  }).join("")}</tbody></table></div><div class="ab-no-results" data-filter-empty data-empty-title="${escapeAttribute(emptyTitle)}"${rows.length ? " hidden" : ""}><div>${icon("search")}<strong data-filter-empty-title>${escapeHtml(emptyTitle)}</strong><p data-filter-empty-copy>Add the first record to continue.</p>${filter ? `<button class="ab-button ab-button--outline" type="button" data-filter-reset="${escapeAttribute(id)}"${rows.length ? "" : " hidden"}>Clear filter</button>` : ""}</div></div></section>`;
}

function renderTabs(node, context) {
  const id = node.attrs.id ?? `tabs-${node.loc.line}`;
  const tabs = children(node, "tab");
  const authoredSelection = tabs.findIndex((tab) => bool(tab.attrs.selected));
  const selectedIndex = authoredSelection >= 0 ? authoredSelection : 0;
  return `<section class="${classes(node, "ab-tabs")}" data-tabs id="${escapeAttribute(id)}"><div role="tablist" aria-label="${escapeAttribute(node.attrs.label ?? "Sections")}">${tabs.map((tab, index) => {
    const tabId = tab.attrs.id ?? `tab-${index + 1}`;
    const selected = index === selectedIndex;
    return `<button type="button" role="tab" id="${escapeAttribute(id)}-${escapeAttribute(tabId)}-tab" aria-controls="${escapeAttribute(id)}-${escapeAttribute(tabId)}-panel" aria-selected="${selected}" tabindex="${selected ? 0 : -1}">${escapeHtml(tab.attrs.label ?? text(tab, `Tab ${index + 1}`))}</button>`;
  }).join("")}</div>${tabs.map((tab, index) => {
    const tabId = tab.attrs.id ?? `tab-${index + 1}`;
    const selected = index === selectedIndex;
    return `<div role="tabpanel" id="${escapeAttribute(id)}-${escapeAttribute(tabId)}-panel" aria-labelledby="${escapeAttribute(id)}-${escapeAttribute(tabId)}-tab"${selected ? "" : " hidden"}>${renderAll(tab.children, context)}</div>`;
  }).join("")}</section>`;
}

function renderDialog(node, context) {
  const id = node.attrs.id ?? `dialog-${node.loc.line}`;
  const titleNode = child(node, "title") ?? child(node, "heading");
  const titleId = `${id}-title`;
  return `<dialog id="${escapeAttribute(id)}" class="${classes(node, "ab-dialog", node.attrs.size ? `ab-dialog--${escapeAttribute(node.attrs.size)}` : "")}" aria-labelledby="${escapeAttribute(titleId)}"><div class="ab-dialog__head"><h2 id="${escapeAttribute(titleId)}">${escapeHtml(node.attrs.title ?? text(titleNode, "Dialog"))}</h2><button class="ab-icon-button" type="button" data-dialog-close aria-label="Close dialog">${icon("x")}</button></div><div class="ab-dialog__body">${renderAll(node.children.filter((item) => item !== titleNode), context)}</div></dialog>`;
}

function renderCatalog(node) {
  const id = node.attrs.id ?? "block-catalog";
  const rows = CATALOG.filter((item) => item.kind !== "structural");
  const filter = bool(node.attrs.filter, true);
  return `<section class="${classes(node, "ab-catalog")}"${commonAttributes(node)}><div class="ab-catalog__toolbar">${filter ? `<label class="ab-filter">${icon("search")}<span class="ab-sr-only">Filter block catalog</span><input type="search" placeholder="Filter ${rows.length} blocks…" data-filter-input="${escapeAttribute(id)}" data-filter-noun="block"></label>` : ""}<strong data-filter-count>${rows.length} blocks</strong></div><div class="ab-table-scroll"><table id="${escapeAttribute(id)}"><caption class="ab-sr-only">AppBlocks block catalog</caption><thead><tr><th scope="col">Block</th><th scope="col">Family</th><th scope="col">Purpose</th><th scope="col">Variants</th></tr></thead><tbody>${rows.map((item) => `<tr data-filter-row data-filter-text="${escapeAttribute(`${item.name} ${item.category} ${item.summary} ${item.variants.join(" ")}`.toLowerCase())}"><td><code>${escapeHtml(item.name)}</code></td><td><span class="ab-tag">${escapeHtml(item.category)}</span></td><td>${escapeHtml(item.summary)}</td><td>${item.variants.length ? item.variants.map((variant) => `<code>${escapeHtml(variant)}</code>`).join(" ") : "—"}</td></tr>`).join("")}</tbody></table></div>${filter ? `<div class="ab-no-results" data-filter-empty hidden><div>${icon("search")}<strong data-filter-empty-title>No matching blocks</strong><p data-filter-empty-copy>Try marketing, application, layout or content.</p><button class="ab-button ab-button--outline" type="button" data-filter-reset="${escapeAttribute(id)}">Reset catalog</button></div></div>` : ""}</section>`;
}

function generic(node, context, tag = "section") {
  return `<${tag} class="${classes(node, `ab-${node.name}`)}"${commonAttributes(node)}>${renderAll(node.children, context)}</${tag}>`;
}

export function renderApplication(node, context) {
  switch (node.name) {
    case "app-shell": {
      const sidebar = child(node, "sidebar");
      return `<section class="${classes(node, "ab-app-shell")}"${commonAttributes(node)} aria-label="${escapeAttribute(node.attrs.name ?? node.attrs.section ?? "Application")}">${sidebar ? context.render(sidebar, context) : ""}<div class="ab-app-main">${renderAll(node.children.filter((item) => item !== sidebar), context)}</div></section>`;
    }
    case "sidebar": return `<aside class="${classes(node, "ab-sidebar")}"><a class="ab-brand" href="${escapeAttribute(safeUrl("/", context.base))}">${icon("blocks")}<span>${escapeHtml(node.attrs.logo ?? context.siteName)}</span></a><nav aria-label="${escapeAttribute(node.attrs.label ?? "Application")}">${renderAll(node.children, context)}</nav><div class="ab-sidebar__foot"><span class="ab-status-dot"></span>Compiler online</div></aside>`;
    case "toolbar": {
      const actions = node.children.filter((item) => item.name === "button" || item.name === "field" || item.name === "badge");
      return `<header class="${classes(node, "ab-toolbar")}"><div>${renderAll(node.children.filter((item) => !actions.includes(item)), context)}</div><div class="ab-toolbar__actions">${renderAll(actions, context)}</div></header>`;
    }
    case "metrics": return `<div class="${classes(node, "ab-metrics")}"${commonAttributes(node)}>${children(node, "metric").map((item) => renderStat(item, true)).join("")}</div>`;
    case "metric": return renderStat(node, true);
    case "chart": return renderChart(node);
    case "bar":
    case "column":
    case "row": return "";
    case "table": return renderTable(node, context);
    case "cell": return cellValue(node, context);
    case "tabs": return renderTabs(node, context);
    case "tab": return generic(node, context, "div");
    case "panel": return generic(node, context);
    case "dialog": return renderDialog(node, context);
    case "kanban": {
      const lanes = children(node, "lane");
      return `<section class="${classes(node, "ab-kanban")}" aria-label="${escapeAttribute(node.attrs.label ?? "Board")}">${lanes.map((lane) => `<section class="${classes(lane, "ab-lane", lane.attrs.tone ? `is-${escapeAttribute(lane.attrs.tone)}` : "")}"><header><strong>${escapeHtml(lane.attrs.name ?? text(lane, "Lane"))}</strong><span>${escapeHtml(lane.attrs.count ?? children(lane, "card").length)}</span></header><div>${renderAll(lane.children.filter((item) => item.name !== "text"), context)}</div></section>`).join("")}</section>`;
    }
    case "lane": return generic(node, context);
    case "card": return `<article class="${classes(node, "ab-card", node.attrs.status ? `is-${escapeAttribute(node.attrs.status)}` : "")}"${commonAttributes(node)}>${renderAll(node.children, context)}</article>`;
    case "activity": return `<section class="${classes(node, "ab-activity")}"${commonAttributes(node)}>${node.attrs.label ? `<h2>${escapeHtml(node.attrs.label)}</h2>` : ""}<ol>${children(node, "event").map((item) => `<li>${icon(item.attrs.icon ?? "bolt")}<div>${renderAll(item.children, context)}${item.attrs.time ? `<time>${escapeHtml(item.attrs.time)}</time>` : ""}</div></li>`).join("")}</ol></section>`;
    case "event": return generic(node, context, "article");
    case "empty-state": return `<div class="${classes(node, "ab-empty-state")}">${icon(node.attrs.icon ?? "layers")}<div>${renderAll(node.children, context) || `<h3>${escapeHtml(node.attrs.title ?? "Nothing here yet")}</h3><p>${escapeHtml(node.attrs.text ?? "Create the first item to get started.")}</p>`}</div></div>`;
    case "status": return `<div class="${classes(node, "ab-status", `ab-status--${escapeAttribute(node.attrs.variant ?? "info")}`)}" role="status" aria-live="${escapeAttribute(node.attrs.live ?? "polite")}">${renderAll(node.children, context) || escapeHtml(text(node))}</div>`;
    case "catalog": return renderCatalog(node);
    default: return null;
  }
}
