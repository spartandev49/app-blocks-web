const THEME_KEY = "appblocks-theme";

function announce(message, root = document) {
  const region = root.querySelector("[data-live-region]");
  if (!region) return;
  region.textContent = "";
  requestAnimationFrame(() => { region.textContent = message; });
}

function showToast(message, options = {}) {
  const root = options.root ?? document;
  const region = root.querySelector("[data-live-region]");
  if (!region) return;
  region.replaceChildren();
  const toast = document.createElement("div");
  toast.className = "ab-toast";
  toast.setAttribute("role", "status");
  const label = document.createElement("span");
  label.textContent = message;
  toast.append(label);
  if (options.actionLabel && options.onAction) {
    const action = document.createElement("button");
    action.type = "button";
    action.textContent = options.actionLabel;
    action.addEventListener("click", () => {
      options.onAction();
      toast.remove();
    }, { once: true });
    toast.append(action);
  }
  region.append(toast);
  if (!options.persist) setTimeout(() => toast.remove(), 5000);
}

function preferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme, root = document, persist = true) {
  root.documentElement.dataset.theme = theme;
  for (const button of root.querySelectorAll("[data-theme-toggle]")) {
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", theme === "dark" ? "Use light theme" : "Use dark theme");
  }
  if (persist) try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

function initTheme(root) {
  setTheme(preferredTheme(), root, false);
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    const next = root.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next, root);
    announce(`${next[0].toUpperCase()}${next.slice(1)} theme enabled`, root);
  });
}

function initNavigation(root) {
  const toggle = root.querySelector(".ab-nav-toggle");
  const panel = root.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;
  const close = (restore = false) => {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (restore) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    if (open) panel.querySelector("a, button")?.focus();
  });
  panel.addEventListener("click", (event) => { if (event.target.closest("a")) close(); });
  root.addEventListener("keydown", (event) => { if (event.key === "Escape" && panel.classList.contains("is-open")) close(true); });
  root.addEventListener("click", (event) => {
    if (panel.classList.contains("is-open") && !panel.contains(event.target) && !toggle.contains(event.target)) close();
  });
}

function initReveal(root) {
  const nodes = [...root.querySelectorAll('[data-reveal="true"]')];
  if (!nodes.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8%", threshold: .08 });
  nodes.forEach((node) => observer.observe(node));
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const area = document.createElement("textarea");
  area.value = value;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

function initCopy(root) {
  root.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const block = button.closest(".ab-code-block");
    const value = block?.querySelector("pre code")?.textContent ?? "";
    const label = button.querySelector("span");
    try {
      await copyText(value);
      if (label) label.textContent = "Copied";
      announce("Code copied to clipboard", root);
      setTimeout(() => { if (label) label.textContent = "Copy"; }, 1800);
    } catch {
      if (label) label.textContent = "Select manually";
      announce("Clipboard access failed. Select the visible code manually.", root);
    }
  });
}

function initDialogs(root) {
  const triggers = root.querySelectorAll("[data-dialog-open]");
  for (const trigger of triggers) {
    trigger.addEventListener("click", () => {
      const dialog = root.getElementById(trigger.dataset.dialogOpen);
      if (!(dialog instanceof HTMLDialogElement)) return;
      dialog.__appBlocksTrigger = trigger;
      dialog.showModal();
      requestAnimationFrame(() => dialog.querySelector("input, select, textarea, button:not([data-dialog-close])")?.focus());
    });
  }
  for (const dialog of root.querySelectorAll("dialog")) {
    dialog.addEventListener("click", (event) => {
      if (event.target.closest("[data-dialog-close]")) dialog.close("cancel");
    });
    dialog.addEventListener("close", () => dialog.__appBlocksTrigger?.focus());
  }
}

function activateTab(tab, tabs) {
  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(candidate.getAttribute("aria-controls"));
    if (panel) panel.hidden = !selected;
  }
  tab.focus();
}

function initTabs(root) {
  for (const group of root.querySelectorAll("[data-tabs]")) {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    for (const tab of tabs) {
      tab.addEventListener("click", () => activateTab(tab, tabs));
      tab.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(tab);
        const keys = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        activateTab(tabs[keys[event.key]], tabs);
      });
    }
  }
}

function applyFilter(input, root) {
  const table = root.getElementById(input.dataset.filterInput);
  if (!table) return;
  const query = input.value.trim().toLowerCase();
  const rows = [...table.querySelectorAll("[data-filter-row]")];
  const fixtureEmpty = table.dataset.fixtureEmpty === "true";
  let visible = 0;
  for (const row of rows) {
    const match = !fixtureEmpty && (!query || (row.dataset.filterText ?? row.textContent.toLowerCase()).includes(query));
    row.hidden = !match;
    if (match) visible += 1;
  }
  const region = table.closest(".ab-table-card, .ab-catalog");
  const empty = region?.querySelector("[data-filter-empty]");
  const count = region?.querySelector("[data-filter-count]");
  const noun = input.dataset.filterNoun || "record";
  if (empty) {
    empty.hidden = visible > 0;
    const emptyTitle = empty.querySelector("[data-filter-empty-title]");
    const emptyCopy = empty.querySelector("[data-filter-empty-copy]");
    const reset = empty.querySelector("[data-filter-reset]");
    if (emptyTitle) emptyTitle.textContent = !fixtureEmpty && query ? `No matching ${noun}s` : (empty.dataset.emptyTitle || `No ${noun}s yet`);
    if (emptyCopy) emptyCopy.textContent = fixtureEmpty ? `Restore the seeded ${noun}s or add a new ${noun}.` : query ? "Change the query or clear the filter." : `Add the first ${noun} to continue.`;
    if (reset) reset.hidden = fixtureEmpty || !query;
  }
  if (count) count.textContent = `${visible} ${visible === 1 ? noun : `${noun}s`}`;
  announce(`${visible} matching ${visible === 1 ? noun : `${noun}s`}`, root);
}

function initFilters(root) {
  for (const input of root.querySelectorAll("[data-filter-input]")) {
    input.addEventListener("input", () => applyFilter(input, root));
  }
  root.addEventListener("click", (event) => {
    const reset = event.target.closest("[data-filter-reset]");
    if (!reset) return;
    const input = root.querySelector(`[data-filter-input="${CSS.escape(reset.dataset.filterReset)}"]`);
    if (!input) return;
    input.value = "";
    applyFilter(input, root);
    input.focus();
  });
}

function initSort(root) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sort-table]");
    if (!button) return;
    const table = root.getElementById(button.dataset.sortTable);
    const header = button.closest("th");
    const body = table?.tBodies[0];
    if (!table || !header || !body) return;
    const index = Number(button.dataset.sortIndex);
    const direction = header.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
    for (const candidate of table.querySelectorAll("th[aria-sort]")) candidate.setAttribute("aria-sort", candidate === header ? direction : "none");
    const rows = [...body.rows];
    rows.sort((left, right) => {
      const a = left.cells[index]?.textContent.trim() ?? "";
      const b = right.cells[index]?.textContent.trim() ?? "";
      return collator.compare(a, b) * (direction === "ascending" ? 1 : -1);
    });
    body.append(...rows);
    announce(`Sorted by ${button.textContent.trim()}, ${direction}`, root);
  });
}

function validateForm(form) {
  let firstInvalid = null;
  for (const field of form.querySelectorAll("input, textarea, select")) {
    const wrapper = field.closest(".ab-field");
    const error = wrapper?.querySelector("[data-field-error]");
    const valid = field.checkValidity();
    wrapper?.classList.toggle("is-invalid", !valid);
    field.setAttribute("aria-invalid", String(!valid));
    if (error) error.textContent = valid ? "" : (field.validity.valueMissing ? `${field.labels?.[0]?.textContent ?? "This field"} is required.` : field.validationMessage);
    if (!valid && !firstInvalid) firstInvalid = field;
  }
  firstInvalid?.focus();
  return !firstInvalid;
}

function rowFromForm(form, table) {
  const entries = [...new FormData(form)].map(([key, value]) => [key, String(value)]);
  const values = new Map(entries);
  const columns = [...table.querySelectorAll("thead th")];
  const row = document.createElement("tr");
  row.dataset.filterRow = "";
  const searchable = [];
  for (let index = 0; index < columns.length; index += 1) {
    const header = columns[index];
    const key = header.dataset.key;
    const value = values.get(key) ?? (key === "status" ? "Queued" : entries[index]?.[1] ?? "—");
    const cell = document.createElement("td");
    if (header.classList.contains("is-right")) cell.classList.add("is-right");
    if (header.classList.contains("is-center")) cell.classList.add("is-center");
    cell.textContent = value;
    searchable.push(value);
    row.append(cell);
  }
  row.dataset.filterText = searchable.join(" ").toLowerCase();
  return row;
}

function initForms(root) {
  for (const form of root.querySelectorAll('[data-demo-form="true"]')) {
    form.addEventListener("input", (event) => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
      if (field.checkValidity()) {
        field.closest(".ab-field")?.classList.remove("is-invalid");
        field.setAttribute("aria-invalid", "false");
        const error = field.closest(".ab-field")?.querySelector("[data-field-error]");
        if (error) error.textContent = "";
      }
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateForm(form)) {
        announce("Correct the highlighted field and try again.", root);
        return;
      }
      const submit = form.querySelector('[type="submit"]');
      const status = form.querySelector("[data-form-status]");
      if (submit) { submit.disabled = true; submit.setAttribute("aria-busy", "true"); }
      if (status) status.textContent = "Creating build…";
      await new Promise((resolve) => setTimeout(resolve, 360));
      const table = form.dataset.targetTable ? root.getElementById(form.dataset.targetTable) : null;
      const row = table ? rowFromForm(form, table) : null;
      if (row) {
        table.querySelector("tbody")?.prepend(row);
        const region = table.closest(".ab-table-card");
        const filterInput = region?.querySelector("[data-filter-input]");
        if (filterInput) applyFilter(filterInput, root);
        else {
          const count = region?.querySelector("[data-filter-count]");
          const total = table.querySelectorAll("[data-filter-row]").length;
          if (count) count.textContent = `${total} ${total === 1 ? "record" : "records"}`;
        }
      }
      if (submit) { submit.disabled = false; submit.removeAttribute("aria-busy"); }
      const successMessage = form.dataset.successMessage || "Created successfully.";
      if (status) status.textContent = successMessage;
      form.closest("dialog")?.close("success");
      form.reset();
      showToast(successMessage, {
        root,
        actionLabel: row ? "Undo" : "Dismiss",
        onAction: () => {
          row?.remove();
          announce(row ? "Build creation undone" : "Notification dismissed", root);
        }
      });
    });
  }
}

function initActions(root) {
  root.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const [name, ...parts] = control.dataset.action.split(":");
    if (name === "toast") showToast(parts.join(":") || "Action completed", { root });
    if (name === "empty") {
      const table = root.getElementById(parts[0]);
      if (!table) return;
      const rows = [...table.querySelectorAll("[data-filter-row]")];
      const emptying = table.dataset.fixtureEmpty !== "true";
      table.dataset.fixtureEmpty = String(emptying);
      const region = table.closest(".ab-table-card");
      const filterInput = region?.querySelector("[data-filter-input]");
      if (filterInput) applyFilter(filterInput, root);
      else {
        rows.forEach((row) => { row.hidden = emptying; });
        const empty = region?.querySelector("[data-filter-empty]");
        if (empty) empty.hidden = !emptying;
        const count = region?.querySelector("[data-filter-count]");
        if (count) count.textContent = `${emptying ? 0 : rows.length} ${!emptying && rows.length === 1 ? "record" : "records"}`;
      }
      control.setAttribute("aria-pressed", String(emptying));
      announce(emptying ? "Empty-state fixture enabled" : "Seeded records restored", root);
    }
  });
}

function markCurrentLinks(root) {
  const path = location.pathname.replace(/index\.html$/, "");
  for (const link of root.querySelectorAll("a[href]")) {
    try {
      const url = new URL(link.href, location.href);
      if (!url.hash && url.origin === location.origin && url.pathname.replace(/index\.html$/, "") === path) link.setAttribute("aria-current", "page");
    } catch {}
  }
}

export function initAppBlocks(root = document) {
  initTheme(root);
  initNavigation(root);
  initReveal(root);
  initCopy(root);
  initDialogs(root);
  initTabs(root);
  initSort(root);
  initFilters(root);
  initForms(root);
  initActions(root);
  markCurrentLinks(root);
  return { announce: (message) => announce(message, root), showToast: (message, options) => showToast(message, { root, ...options }) };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initAppBlocks(document), { once: true });
  else initAppBlocks(document);
}
