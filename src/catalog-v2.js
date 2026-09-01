import { CATALOG as BASE_CATALOG } from "./catalog.js";
import { ADVANCED_CATALOG } from "./catalog-advanced.js";
export { ADVANCED_CATALOG } from "./catalog-advanced.js";
import { mergeDefinition } from "./catalog-extensions.js";
import {
  BLOCK_ALIASES,
  GLOBAL_STYLE_ATTRIBUTES,
  compactDesignCatalog,
  resolveVirtualBlock,
  virtualCatalogSummary
} from "./design-system.js";

export const CATALOG = [...BASE_CATALOG.map(mergeDefinition), ...ADVANCED_CATALOG];
export const CATALOG_MAP = new Map(CATALOG.map((item) => [item.name, item]));

export function getBlock(name) {
  const raw = String(name ?? "");
  const virtual = resolveVirtualBlock(raw);
  if (virtual) {
    const base = CATALOG_MAP.get(virtual.base);
    return {
      ...base,
      name: virtual.name,
      kind: "virtual-preset",
      expandsTo: virtual.base,
      preset: virtual.attrs,
      summary: `${base.summary} Virtual preset ${virtual.name} expands deterministically to ${virtual.base}.`
    };
  }
  return CATALOG_MAP.get(BLOCK_ALIASES[raw] ?? raw);
}

export function getCatalog(options = {}) {
  const category = options.category;
  return category ? CATALOG.filter((item) => item.category === category) : [...CATALOG];
}

export function compactCatalog() {
  return CATALOG.map(({ name, category, summary, kind, variants, attributes, children }) => ({
    name,
    category,
    summary,
    kind,
    ...(variants.length ? { variants } : {}),
    ...(attributes.length ? { attributes } : {}),
    ...(children.length ? { children } : {})
  }));
}

export function catalogBundle() {
  return {
    version: 2,
    blocks: compactCatalog(),
    globalStyleAttributes: GLOBAL_STYLE_ATTRIBUTES,
    design: compactDesignCatalog(),
    virtualPresets: virtualCatalogSummary()
  };
}
