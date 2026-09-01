import { ATTRIBUTE_ALIASES, BLOCK_ALIASES, resolveVirtualBlock } from "./design-system.js";

const NORMALIZED = new WeakSet();

function normalizeAttributes(attrs = {}) {
  const result = {};
  for (const [rawKey, value] of Object.entries(attrs)) {
    const key = ATTRIBUTE_ALIASES[rawKey] ?? rawKey;
    if (!Object.hasOwn(result, key)) result[key] = value;
  }
  return result;
}

function normalizeNode(node) {
  if (!node || node.name === "document") {
    for (const child of node?.children ?? []) normalizeNode(child);
    return;
  }

  const authoredName = node.name;
  const virtual = resolveVirtualBlock(authoredName);
  const canonicalName = virtual?.base ?? BLOCK_ALIASES[authoredName] ?? authoredName;
  const authoredAttrs = normalizeAttributes(node.attrs);

  node.name = canonicalName;
  node.attrs = virtual ? { ...virtual.attrs, ...authoredAttrs } : authoredAttrs;
  if (virtual) {
    node.preset = virtual.name;
    node.virtual = { family: virtual.family, index: virtual.index };
  } else if (canonicalName !== authoredName) {
    node.alias = authoredName;
  }

  for (const child of node.children ?? []) normalizeNode(child);
}

export function normalizeAst(ast) {
  if (!ast || NORMALIZED.has(ast)) return ast;
  normalizeNode(ast);
  NORMALIZED.add(ast);
  return ast;
}
