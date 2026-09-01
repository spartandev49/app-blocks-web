import { CATALOG, CATALOG_MAP } from "./catalog.js";
import { AppBlocksError, diagnostic } from "./diagnostics.js";
import { ICON_NAMES } from "./icons.js";
import { bool, levenshtein, walk } from "./utils.js";

const GLOBAL_ATTRIBUTES = new Set(["id", "class", "reveal", "aria-label"]);
const URL_SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const SAFE_URL_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const STYLE_NAMES = new Set(["blueprint", "editorial", "signal"]);

function suggestion(name) {
  const matches = CATALOG
    .map((item) => ({ name: item.name, distance: levenshtein(name, item.name) }))
    .sort((left, right) => left.distance - right.distance);
  return matches[0]?.distance <= Math.max(2, Math.floor(name.length / 3)) ? matches[0].name : "";
}

function validatePageIds(site, diagnostics) {
  if (!site) return;
  const reported = new Set();
  const sharedHeader = site.children.find((node) => node.name === "header");
  const sharedFooter = site.children.find((node) => node.name === "footer");
  for (const page of site.children.filter((node) => node.name === "page")) {
    const ids = new Map();
    const isolated = page.attrs.layout === "app" || page.attrs.layout === "isolated";
    const localHeader = page.children.find((node) => node.name === "header");
    const localFooter = page.children.find((node) => node.name === "footer");
    const roots = [
      ...(!isolated && !localHeader && sharedHeader ? [sharedHeader] : []),
      ...(!isolated && !localFooter && sharedFooter ? [sharedFooter] : []),
      ...page.children
    ];
    for (const root of roots) {
      walk(root, (node) => {
        const id = node.attrs.id;
        if (!id || !/^[A-Za-z][A-Za-z0-9_:\-.]*$/.test(String(id))) return;
        if (!ids.has(id)) {
          ids.set(id, node.loc.line);
          return;
        }
        const key = `${node.loc.line}:${ids.get(id)}:${id}`;
        if (reported.has(key)) return;
        reported.add(key);
        diagnostics.push(diagnostic(`Duplicate id '${id}'`, node.loc.line, node.loc.column, `First declared on line ${ids.get(id)} in the same rendered page.`));
      });
    }
  }
}

function validOrigin(value) {
  try {
    const url = new URL(String(value));
    return (url.protocol === "http:" || url.protocol === "https:")
      && url.username === ""
      && url.password === ""
      && url.pathname === "/"
      && url.search === ""
      && url.hash === "";
  } catch {
    return false;
  }
}

function validateStructure(site, diagnostics) {
  if (!site) return;
  const atMostOne = (node, name) => {
    const matches = node.children.filter((childNode) => childNode.name === name);
    if (matches.length > 1) diagnostics.push(diagnostic(`'${node.name}' may contain only one '${name}' block`, matches[1].loc.line, matches[1].loc.column, `Remove or merge the extra '${name}' block.`));
  };
  for (const name of ["meta", "header", "footer"]) atMostOne(site, name);
  for (const page of site.children.filter((node) => node.name === "page")) {
    for (const name of ["header", "main", "footer"]) atMostOne(page, name);
    let h1Count = 0;
    walk(page, (node) => {
      if (node.name === "title" && Number(node.attrs.level ?? 2) === 1) h1Count += 1;
    });
    if (h1Count !== 1) diagnostics.push(diagnostic(
      `Page '${page.args[0] ?? ""}' requires exactly one level-1 title; found ${h1Count}`,
      page.loc.line,
      page.loc.column,
      'Add one: title "Page promise" level=1.'
    ));
  }
  walk(site, (node) => {
    if (node.name === "header") atMostOne(node, "nav");
    if (node.name === "tabs") {
      const selected = node.children.filter((childNode) => childNode.name === "tab" && bool(childNode.attrs.selected));
      if (selected.length > 1) diagnostics.push(diagnostic("Tabs may declare only one selected tab", selected[1].loc.line, selected[1].loc.column, "Remove selected=true from the extra tab."));
    }
  });
}

export function validate(ast, options = {}) {
  const diagnostics = [];
  const routes = new Map();
  const sites = ast.children.filter((node) => node.name === "site");

  if (sites.length !== 1) {
    diagnostics.push(diagnostic(
      sites.length === 0 ? "A document requires one site declaration" : "A document may contain only one site declaration",
      sites[1]?.loc.line ?? 1,
      sites[1]?.loc.column ?? 1,
      'Start with: site "Project name" theme=blueprint'
    ));
  }
  const site = sites[0];
  if (site && !site.args[0]) {
    diagnostics.push(diagnostic("The site declaration requires a project name", site.loc.line, site.loc.column, 'Example: site "My product"'));
  }
  for (const topLevel of ast.children) {
    if (topLevel.name !== "site") diagnostics.push(diagnostic(`'${topLevel.name}' must be nested inside site`, topLevel.loc.line, topLevel.loc.column));
  }

  walk(ast, (node) => {
    if (node.name === "document") return;
    const definition = CATALOG_MAP.get(node.name);
    if (!definition) {
      const close = suggestion(node.name);
      diagnostics.push(diagnostic(
        `Unknown block '${node.name}'`,
        node.loc.line,
        node.loc.column,
        close ? `Did you mean '${close}'?` : "Run 'appblocks catalog' to list available blocks."
      ));
      return;
    }
    for (const attribute of Object.keys(node.attrs)) {
      if (!definition.attributes.includes(attribute) && !GLOBAL_ATTRIBUTES.has(attribute)) {
        diagnostics.push(diagnostic(
          `Unknown '${node.name}' attribute '${attribute}'`,
          node.loc.line,
          node.loc.column,
          `Supported attributes: ${[...GLOBAL_ATTRIBUTES, ...definition.attributes].sort().join(", ") || "none"}.`,
          options.strict ? "error" : "warning"
        ));
      }
    }
    if (!definition.children.includes("*")) {
      for (const childNode of node.children) {
        if (CATALOG_MAP.has(childNode.name) && !definition.children.includes(childNode.name)) {
          diagnostics.push(diagnostic(
            `'${childNode.name}' is not allowed inside '${node.name}'`,
            childNode.loc.line,
            childNode.loc.column,
            definition.children.length ? `Allowed children: ${definition.children.join(", ")}.` : `'${node.name}' does not accept child blocks.`
          ));
        }
      }
    }
    if (node.attrs.variant && definition.variants.length && !definition.variants.includes(String(node.attrs.variant))) {
      diagnostics.push(diagnostic(
        `Unknown '${node.name}' variant '${node.attrs.variant}'`,
        node.loc.line,
        node.loc.column,
        `Supported variants: ${definition.variants.join(", ")}.`,
        options.strict ? "error" : "warning"
      ));
    }
    const iconName = node.name === "icon" ? (node.attrs.name ?? node.args[0]) : node.attrs.icon;
    if (iconName && !ICON_NAMES.includes(String(iconName))) {
      diagnostics.push(diagnostic(
        `Unknown icon '${iconName}'`,
        node.loc.line,
        node.loc.column,
        `Supported icons: ${ICON_NAMES.join(", ")}.`,
        options.strict ? "error" : "warning"
      ));
    }
    const urlKeys = ["href", "src", ...(["form", "newsletter"].includes(node.name) ? ["action"] : [])];
    for (const key of urlKeys) {
      const value = node.attrs[key];
      const scheme = typeof value === "string" ? URL_SCHEME.exec(value.trim())?.[1]?.toLowerCase() : "";
      if (scheme && !SAFE_URL_SCHEMES.has(scheme)) {
        diagnostics.push(diagnostic(`Unsafe ${key} URL scheme`, node.loc.line, node.loc.column, "Use an http(s), mailto, tel, hash or project-relative URL."));
      }
    }
    const id = node.attrs.id;
    if (id) {
      if (!/^[A-Za-z][A-Za-z0-9_:\-.]*$/.test(String(id))) {
        diagnostics.push(diagnostic(`Invalid id '${id}'`, node.loc.line, node.loc.column, "IDs must start with a letter."));
      }
    }
    if (node.name === "page") {
      const route = node.args[0];
      if (typeof route !== "string" || !route.startsWith("/")) {
        diagnostics.push(diagnostic("Page route must begin with /", node.loc.line, node.loc.column, 'Example: page "/pricing/" title="Pricing"'));
      } else if (routes.has(route)) {
        diagnostics.push(diagnostic(`Duplicate page route '${route}'`, node.loc.line, node.loc.column, `First declared on line ${routes.get(route)}.`));
      } else routes.set(route, node.loc.line);
    }
    if (node.name === "image" && !node.attrs.alt && node.attrs.alt !== "") {
      diagnostics.push(diagnostic("Image requires alt text", node.loc.line, node.loc.column, 'Use alt="" for a decorative image.'));
    }
    if (node.name === "logo" && node.attrs.src && !String(node.attrs.alt ?? "").trim()) {
      diagnostics.push(diagnostic("Image logo requires alt text", node.loc.line, node.loc.column, 'Add alt="Organization name".'));
    }
    if (node.name === "field" && !node.attrs.label) {
      diagnostics.push(diagnostic("Field requires a persistent label", node.loc.line, node.loc.column, 'Add label="Visible label".'));
    }
    if (node.name === "site" && node.attrs.origin && !validOrigin(node.attrs.origin)) {
      diagnostics.push(diagnostic("Site origin must be an absolute HTTP(S) URL", node.loc.line, node.loc.column, 'Example: origin="https://example.com".'));
    }
    if (node.name === "site" && node.attrs.accent && !/^#[0-9a-f]{6}$/i.test(String(node.attrs.accent))) {
      diagnostics.push(diagnostic("Site accent must be a six-digit hex color", node.loc.line, node.loc.column, 'Example: accent="#154de7".'));
    }
    if (node.name === "site" && node.attrs.motion !== undefined && typeof node.attrs.motion !== "boolean") {
      diagnostics.push(diagnostic("Site motion must be true or false", node.loc.line, node.loc.column, "Use motion=false to disable authored motion."));
    }
    if ((node.name === "site" || node.name === "page") && node.attrs.theme && !STYLE_NAMES.has(String(node.attrs.theme))) {
      diagnostics.push(diagnostic(
        `Unknown theme '${node.attrs.theme}'`,
        node.loc.line,
        node.loc.column,
        `Supported themes: ${[...STYLE_NAMES].join(", ")}.`,
        options.strict ? "error" : "warning"
      ));
    }
  });

  validatePageIds(site, diagnostics);
  validateStructure(site, diagnostics);

  if (site && !site.children.some((node) => node.name === "page")) {
    diagnostics.push(diagnostic("Site requires at least one page", site.loc.line, site.loc.column));
  }
  return diagnostics;
}

export function assertValid(ast, options = {}) {
  const diagnostics = validate(ast, options);
  const errors = diagnostics.filter((item) => item.severity === "error");
  if (errors.length) throw new AppBlocksError("AppBlocks validation failed", diagnostics);
  return diagnostics;
}
