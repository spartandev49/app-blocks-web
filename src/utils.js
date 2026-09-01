const HTML_ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

export function escapeAttribute(value = "") {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

export function slugify(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

export function children(node, name) {
  return node.children.filter((child) => child.name === name);
}

export function child(node, name) {
  return node.children.find((item) => item.name === name);
}

export function text(node, fallback = "") {
  return node?.args?.[0] ?? node?.attrs?.text ?? fallback;
}

export function bool(value, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  return value === "true" || value === "yes" || value === "on" || value === 1;
}

export function list(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

export function safeUrl(value = "#", base = "/") {
  const url = String(value).trim();
  if (!url) return "#";
  if (/^(?:javascript|vbscript|data):/i.test(url)) return "#";
  if (url.startsWith("/") && base !== "/") {
    return `${base.replace(/\/$/, "")}${url}`;
  }
  return url;
}

export function joinClasses(...values) {
  const tokens = values.flat(Infinity).filter(Boolean).flatMap((value) => String(value).split(/\s+/).filter(Boolean));
  return [...new Set(tokens)].join(" ");
}

export function walk(node, visit) {
  visit(node);
  for (const item of node.children ?? []) walk(item, visit);
}

export function outputPathForRoute(route) {
  const clean = route.replace(/^\/+|\/+$/g, "");
  return clean ? `${clean}/index.html` : "index.html";
}

export function levenshtein(left, right) {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => [index]);
  for (let column = 1; column <= right.length; column += 1) rows[0][column] = column;
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      rows[row][column] = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1)
      );
    }
  }
  return rows[left.length][right.length];
}
