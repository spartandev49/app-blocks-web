const unique = (...groups) => [...new Set(groups.flat().filter(Boolean))];

export const EXTENSIONS = {
  site: { attributes: ["recipe", "palette", "font", "display-font", "mono-font", "shape", "surface", "motion-style", "density", "shadow", "paper", "surface-color", "ink", "ink-2", "accent-2", "font-src", "font-name", "display-src", "display-name"] },
  page: { attributes: ["recipe", "palette", "font", "display-font", "shape", "surface", "motion-style", "density", "shadow"] },
  section: { variants: ["glass", "gradient", "mesh", "split", "contained", "bleed", "dark", "light"] },
  grid: { variants: ["masonry", "dashboard", "editorial", "rail", "dense"] },
  columns: { variants: ["golden", "thirds", "asymmetric", "content-rail"] },
  header: { variants: ["minimal", "centered", "stacked", "mega", "transparent", "glass", "command", "sidebar", "pill", "rail"], children: ["announcement", "mega-menu", "command-bar", "subnav"] },
  nav: { variants: ["pills", "underline", "rail", "centered", "segmented"] },
  link: { variants: ["plain", "muted", "accent", "pill", "button"] },
  button: { variants: ["soft", "gradient", "glass", "elevated", "brutal", "link", "pill", "square", "shimmer", "glow", "danger", "success"] },
  footer: { variants: ["columns", "mega", "centered", "split", "newsletter", "floating", "brutal"] },
  badge: { variants: ["info", "outline", "soft", "glow", "pill"] },
  image: { attributes: ["fit", "position", "aspect"] },
  hero: { variants: ["immersive", "asymmetric", "layered", "poster", "product", "app", "video", "gradient", "brutal", "minimal"], children: ["frame", "carousel", "marquee", "counter", "spotlight"] },
  visual: { variants: ["terminal", "browser", "phone", "cards", "network", "wave", "globe", "timeline"] },
  proof: { variants: ["wall", "ticker", "cards", "ledger", "spotlight"] },
  logos: { variants: ["grid", "marquee", "cloud", "wall"] },
  stats: { variants: ["ticker", "bento", "minimal", "dashboard"] },
  features: { variants: ["spotlight", "alternating", "cards", "list", "editorial", "dashboard"] },
  feature: { variants: ["plain", "card", "spotlight", "media", "interactive"] },
  split: { variants: ["sticky", "overlap", "diagonal", "full-bleed"] },
  steps: { variants: ["process", "stack", "numbered", "progress"] },
  testimonials: { variants: ["wall", "marquee", "spotlight", "stack"] },
  pricing: { variants: ["toggle", "comparison", "compact", "enterprise"] },
  cta: { variants: ["split", "floating", "gradient", "minimal", "poster"] },
  gallery: { variants: ["carousel", "filmstrip", "stack", "spotlight", "bento"] },
  article: { variants: ["editorial", "docs", "wide", "paper"] },
  "app-shell": { variants: ["sidebar", "topbar", "split", "canvas", "dense", "floating", "rail", "command"], children: ["drawer", "dropdown", "command", "notification", "data-list", "calendar", "segmented", "dock"] },
  sidebar: { variants: ["rail", "floating", "compact", "dark", "glass"] },
  toolbar: { variants: ["floating", "sticky", "command", "minimal"], children: ["command-bar", "dropdown", "toggle", "segmented", "tooltip"] },
  metrics: { variants: ["bento", "compact", "ticker", "cards"] },
  chart: { variants: ["line", "area", "donut", "radar", "heatmap", "gauge"] },
  table: { variants: ["plain", "striped", "cards", "compact", "ledger", "glass", "bordered", "floating"] },
  form: { variants: ["plain", "stacked", "inline", "cards", "glass", "split", "compact", "floating"] },
  field: { variants: ["default", "floating", "inline", "quiet", "filled"] },
  tabs: { variants: ["underline", "pills", "segmented", "vertical", "rail"] },
  panel: { variants: ["glass", "gradient", "floating", "brutal", "sunken", "interactive"] },
  dialog: { variants: ["sheet", "drawer", "command", "glass", "fullscreen"] },
  kanban: { variants: ["compact", "swimlane", "cards", "dense"] },
  card: { variants: ["plain", "bordered", "raised", "glass", "gradient", "brutal", "interactive", "media"], children: ["*"] },
  activity: { variants: ["timeline", "compact", "cards", "feed"] }
};

export const mergeDefinition = (item) => {
  const extension = EXTENSIONS[item.name];
  if (!extension) return item;
  const children = extension.children?.includes("*") || item.children.includes("*")
    ? ["*"]
    : unique(item.children, extension.children);
  const variants = unique(item.variants, extension.variants);
  return {
    ...item,
    variants,
    attributes: unique(item.attributes, extension.attributes, variants.length ? ["variant"] : []),
    children
  };
};
