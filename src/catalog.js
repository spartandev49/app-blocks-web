const manifest = (name, category, summary, options = {}) => ({
  name,
  category,
  summary,
  kind: options.kind ?? "block",
  variants: options.variants ?? [],
  attributes: options.attributes ?? [],
  children: options.children ?? [],
  examples: options.examples ?? []
});

export const CATALOG = [
  manifest("site", "document", "Root project declaration with global theme, metadata and shared chrome.", { kind: "structural", attributes: ["theme", "lang", "base", "origin", "accent", "motion"], children: ["meta", "header", "footer", "page"] }),
  manifest("meta", "document", "Global SEO and social metadata.", { kind: "structural", attributes: ["description", "author", "image", "robots", "theme-color"] }),
  manifest("page", "document", "A routable HTML document.", { kind: "structural", attributes: ["title", "description", "layout", "theme", "class"], children: ["*"] }),
  manifest("main", "layout", "Explicit main landmark.", { kind: "structural", attributes: ["class", "id"], children: ["*"] }),
  manifest("section", "layout", "General-purpose semantic content section.", { variants: ["plain", "paper", "ink", "accent", "ruled"], attributes: ["id", "variant", "label", "width", "align", "reveal", "class"], children: ["*"] }),
  manifest("grid", "layout", "Responsive grid for peer or weighted items.", { variants: ["auto", "two", "three", "four", "bento"], attributes: ["variant", "min", "gap", "class"], children: ["*"] }),
  manifest("stack", "layout", "Vertical rhythm container.", { attributes: ["gap", "align", "class"], children: ["*"] }),
  manifest("columns", "layout", "Responsive two-column composition.", { variants: ["equal", "wide-left", "wide-right", "sidebar"], attributes: ["variant", "gap", "align", "class"], children: ["*"] }),
  manifest("divider", "layout", "Semantic visual divider.", { variants: ["rule", "label", "measure"], attributes: ["variant", "label"] }),
  manifest("spacer", "layout", "Deliberate vertical spacing token.", { attributes: ["size"] }),

  manifest("header", "navigation", "Responsive site or application header.", { variants: ["bar", "split", "floating", "editorial"], attributes: ["variant", "logo", "href", "sticky", "theme-toggle", "class"], children: ["nav", "link", "button", "badge"] }),
  manifest("nav", "navigation", "Named navigation group.", { attributes: ["label", "class"], children: ["link", "button"] }),
  manifest("link", "navigation", "Semantic destination link.", { attributes: ["href", "icon", "tone", "target", "current", "class"] }),
  manifest("button", "navigation", "Button or CTA with complete interaction states.", { variants: ["solid", "outline", "ghost", "quiet", "icon"], attributes: ["href", "variant", "tone", "icon", "action", "target", "dialog", "type", "disabled", "loading", "state", "class"] }),
  manifest("breadcrumbs", "navigation", "Accessible breadcrumb trail.", { children: ["link", "text"] }),
  manifest("footer", "navigation", "Site footer with grouped navigation and legal content.", { variants: ["standard", "compact", "index"], attributes: ["variant", "logo", "note", "class"], children: ["nav", "link", "text", "badge"] }),

  manifest("eyebrow", "content", "Short contextual label above a heading.", { attributes: ["icon", "class"] }),
  manifest("title", "content", "Primary title within a block.", { attributes: ["level", "class"] }),
  manifest("heading", "content", "Section or item heading.", { attributes: ["level", "id", "class"] }),
  manifest("text", "content", "Plain prose with safe escaping.", { attributes: ["tone", "size", "class"] }),
  manifest("badge", "content", "Compact status or category label.", { variants: ["neutral", "accent", "success", "warning", "danger"], attributes: ["variant", "icon", "class"] }),
  manifest("tag", "content", "Machine-readable or categorical tag.", { attributes: ["tone", "class"] }),
  manifest("icon", "content", "Built-in dependency-free SVG icon.", { attributes: ["name", "label", "size"] }),
  manifest("image", "content", "Responsive image with explicit alternative text.", { attributes: ["src", "alt", "width", "height", "loading", "class"] }),
  manifest("code", "content", "Inline machine-readable code or source value.", { attributes: ["language", "class"] }),
  manifest("code-block", "content", "Copyable preformatted source block.", { variants: ["light", "dark", "blueprint"], attributes: ["language", "label", "copy", "variant", "class"], children: ["code", "text"] }),
  manifest("quote", "content", "Quotation with optional attribution.", { attributes: ["by", "role", "class"] }),
  manifest("list", "content", "Ordered or unordered prose list.", { attributes: ["ordered", "class"], children: ["item"] }),
  manifest("item", "content", "Repeated item within lists and generic groups.", { attributes: ["icon", "value", "href", "class"], children: ["title", "heading", "text", "button", "badge"] }),

  manifest("hero", "marketing", "First-viewport promise and primary action.", { variants: ["split", "editorial", "centered", "console", "manifesto"], attributes: ["id", "variant", "align", "visual", "reveal", "class"], children: ["eyebrow", "title", "text", "button", "badge", "code-block", "stats", "image", "visual"] }),
  manifest("visual", "marketing", "Code-native hero or section visual.", { variants: ["compiler", "dashboard", "orbit", "grid", "metrics"], attributes: ["variant", "label", "class"], children: ["metric", "code", "item"] }),
  manifest("proof", "marketing", "Grounded evidence or mechanism statement.", { variants: ["rail", "numbers", "comparison"], attributes: ["variant", "label", "class"], children: ["eyebrow", "title", "heading", "text", "button", "link", "stats", "stat", "item"] }),
  manifest("logos", "marketing", "Logo or technology mark row.", { attributes: ["label", "muted", "class"], children: ["logo"] }),
  manifest("logo", "marketing", "Text or image identity mark.", { attributes: ["src", "alt", "href", "class"] }),
  manifest("stats", "marketing", "Responsive metric group.", { variants: ["row", "rail", "cards"], attributes: ["variant", "class"], children: ["stat"] }),
  manifest("stat", "marketing", "Single labeled value.", { attributes: ["value", "label", "detail", "tone", "class"], children: ["text"] }),
  manifest("features", "marketing", "Capability group with non-uniform variants.", { variants: ["grid", "bento", "ledger", "index"], attributes: ["id", "variant", "label", "class"], children: ["eyebrow", "title", "text", "feature"] }),
  manifest("feature", "marketing", "One capability with icon, title and explanation.", { attributes: ["icon", "span", "tone", "class"], children: ["eyebrow", "title", "heading", "text", "button", "code-block", "badge"] }),
  manifest("split", "marketing", "Alternating narrative and evidence section.", { variants: ["media-left", "media-right", "source-result"], attributes: ["variant", "id", "class"], children: ["stack", "visual", "image", "code-block", "eyebrow", "title", "text", "button", "list"] }),
  manifest("steps", "marketing", "Ordered mechanism or onboarding sequence.", { variants: ["rail", "cards", "timeline"], attributes: ["id", "variant", "class"], children: ["eyebrow", "title", "text", "step"] }),
  manifest("step", "marketing", "One numbered mechanism or onboarding step.", { attributes: ["number", "icon", "class"], children: ["title", "heading", "text", "code"] }),
  manifest("testimonials", "marketing", "Supplied or explicitly placeholder testimonial group.", { variants: ["single", "grid", "carousel"], attributes: ["variant", "placeholder", "class"], children: ["testimonial"] }),
  manifest("testimonial", "marketing", "Quotation, name and role.", { attributes: ["name", "role", "company", "placeholder", "class"], children: ["quote", "text"] }),
  manifest("pricing", "marketing", "Accessible pricing comparison.", { variants: ["cards", "table", "ledger"], attributes: ["id", "variant", "currency", "class"], children: ["eyebrow", "title", "text", "tier"] }),
  manifest("tier", "marketing", "One price tier and included capabilities.", { attributes: ["name", "price", "period", "featured", "badge", "href", "class"], children: ["text", "list", "button"] }),
  manifest("comparison", "marketing", "Side-by-side capability comparison.", { attributes: ["id", "class"], children: ["title", "text", "table"] }),
  manifest("faq", "marketing", "Native accessible disclosure list.", { attributes: ["id", "class"], children: ["eyebrow", "title", "text", "question"] }),
  manifest("question", "marketing", "One accessible FAQ question and answer disclosure.", { attributes: ["open", "class"], children: ["text"] }),
  manifest("cta", "marketing", "Focused final action section.", { variants: ["band", "editorial", "ink"], attributes: ["variant", "id", "class"], children: ["eyebrow", "title", "text", "button"] }),
  manifest("newsletter", "marketing", "Email signup form surface.", { attributes: ["action", "method", "placeholder", "button", "class"] }),
  manifest("gallery", "marketing", "Responsive artifact gallery.", { variants: ["grid", "rail", "masonry"], attributes: ["variant", "class"], children: ["item", "image"] }),
  manifest("timeline", "marketing", "Chronological milestones.", { attributes: ["class"], children: ["event"] }),

  manifest("article", "reading", "Long-form reading surface with automatic measure.", { attributes: ["id", "class"], children: ["eyebrow", "title", "text", "heading", "prose", "code-block", "callout", "list", "table"] }),
  manifest("prose", "reading", "Readable prose grouping.", { attributes: ["class"], children: ["heading", "text", "list", "code-block", "callout", "quote"] }),
  manifest("callout", "reading", "Informational, warning or success annotation.", { variants: ["note", "tip", "warning", "danger"], attributes: ["variant", "title", "icon", "class"], children: ["text", "code"] }),

  manifest("app-shell", "application", "Responsive application chrome and content frame.", { attributes: ["name", "section", "class"], children: ["sidebar", "toolbar", "section", "grid", "columns", "stack", "panel", "metrics", "chart", "table", "form", "tabs", "kanban", "activity", "empty-state", "status", "dialog"] }),
  manifest("sidebar", "application", "Application side navigation.", { attributes: ["logo", "label", "class"], children: ["nav", "link", "button", "badge"] }),
  manifest("toolbar", "application", "Task-focused heading and nearby controls.", { attributes: ["class"], children: ["eyebrow", "title", "heading", "text", "button", "field", "badge"] }),
  manifest("metrics", "application", "Dense application metric strip.", { variants: ["grid", "rail"], attributes: ["variant", "class"], children: ["metric"] }),
  manifest("metric", "application", "Application metric with trend and progress.", { attributes: ["value", "label", "change", "tone", "progress", "class"] }),
  manifest("chart", "application", "Dependency-free accessible bar or line-style chart.", { variants: ["bars", "spark", "distribution"], attributes: ["variant", "label", "unit", "class"], children: ["bar", "item"] }),
  manifest("bar", "application", "One labeled numeric datum within a chart.", { attributes: ["label", "value", "max", "tone", "class"] }),
  manifest("table", "application", "Responsive, filterable and sortable data table.", { attributes: ["id", "label", "filter", "sortable", "empty", "class"], children: ["column", "row"] }),
  manifest("column", "application", "Table column contract.", { attributes: ["key", "label", "align", "sortable", "class"] }),
  manifest("row", "application", "One structured record within a data table.", { attributes: ["id", "status", "class"], children: ["cell"] }),
  manifest("cell", "application", "One keyed value within a structured table record.", { attributes: ["key", "tone", "class"], children: ["badge", "button", "link", "text"] }),
  manifest("form", "application", "Validated semantic form.", { attributes: ["id", "action", "method", "demo", "submit", "success", "target", "class"], children: ["field", "button", "text"] }),
  manifest("field", "application", "Labeled native form control.", { attributes: ["name", "label", "type", "placeholder", "value", "required", "autocomplete", "help", "options", "min", "max", "step", "pattern", "minlength", "maxlength", "multiple", "accept", "checked", "disabled", "readonly", "class"], children: ["option"] }),
  manifest("option", "application", "Select or choice option.", { attributes: ["value", "selected", "disabled"] }),
  manifest("tabs", "application", "Keyboard-operable tab interface.", { attributes: ["id", "label", "class"], children: ["tab"] }),
  manifest("tab", "application", "Tab and associated panel content.", { attributes: ["id", "selected", "label", "class"], children: ["*"] }),
  manifest("panel", "application", "General application panel.", { variants: ["plain", "bordered", "raised", "ink"], attributes: ["variant", "id", "class"], children: ["*"] }),
  manifest("dialog", "application", "Native modal dialog with focus return.", { attributes: ["id", "title", "size", "class"], children: ["title", "text", "form", "button"] }),
  manifest("kanban", "application", "Responsive workflow board.", { attributes: ["label", "class"], children: ["lane"] }),
  manifest("lane", "application", "Named workflow stage within a Kanban board.", { attributes: ["name", "count", "tone", "class"], children: ["card", "empty-state"] }),
  manifest("card", "application", "Application record card.", { attributes: ["id", "status", "class"], children: ["eyebrow", "title", "heading", "text", "badge", "tag", "button"] }),
  manifest("activity", "application", "Recent-event stream.", { attributes: ["label", "class"], children: ["event"] }),
  manifest("event", "application", "Timeline or activity record.", { attributes: ["time", "icon", "tone", "class"], children: ["title", "heading", "text", "badge"] }),
  manifest("empty-state", "application", "Actionable empty or no-results state.", { attributes: ["icon", "title", "text", "action", "class"], children: ["title", "text", "button"] }),
  manifest("status", "application", "Live status and feedback region.", { variants: ["info", "success", "warning", "error"], attributes: ["variant", "live", "class"] }),
  manifest("catalog", "application", "Searchable machine-manifest block catalog.", { attributes: ["id", "filter", "class"] })
];

export const CATALOG_MAP = new Map(CATALOG.map((item) => [item.name, item]));

export function getBlock(name) {
  return CATALOG_MAP.get(name);
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
