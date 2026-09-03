export type PageKind =
  | "saas" | "consumer" | "agency" | "portfolio" | "editorial" | "event"
  | "documentation" | "commerce" | "application" | "public-service" | "media" | "community";

export type TasteMode = "light" | "dark" | "auto";
export type TasteRole = "auto" | "focal" | "supporting" | "quiet" | "utility" | "evidence" | "navigation" | "action" | "artifact" | "data" | "narrative" | "status";


export const BLOCK_LAYOUT_COMPATIBILITY: Readonly<Record<string, readonly string[]>>;
export function layoutsForBlock(blockName: string): readonly string[];
export function isLayoutCompatible(blockName: string, layout?: string | null): boolean;

export interface TasteNamedAxis {
  id: string;
  index: number;
  name: string;
}

export interface TasteTypographySystem extends TasteNamedAxis {
  display: string;
  body: string;
  mono: string;
  serif: boolean;
}

export interface TastePaletteMode {
  background: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  accent: string;
  accentInk: string;
  line: string;
}

export interface TastePalette extends TasteNamedAxis {
  hue: number;
  saturation: number;
  light: TastePaletteMode;
  dark: TastePaletteMode;
}

export interface TasteDNA {
  id: string;
  index: number;
  kind: "taste-dna";
  coreSignature: string;
  pageKind: PageKind;
  genre: string;
  macrostructure: TasteNamedAxis;
  hero: TasteNamedAxis;
  navigation: TasteNamedAxis;
  footer: TasteNamedAxis;
  typography: TasteTypographySystem;
  palette: TastePalette;
  geometry: TasteNamedAxis;
  surface: TasteNamedAxis;
  rhythm: TasteNamedAxis;
  assetTreatment: TasteNamedAxis;
  mode: TasteMode;
  variance: number;
  motionIntensity: number;
  visualDensity: number;
}

export interface ElementLook {
  id: string;
  index: number;
  kind: "element-look";
  shape: { index: number; name: string };
  border: { index: number; name: string };
  shadow: { index: number; name: string };
  surface: { index: number; name: string };
  density: { index: number; name: string };
  tone: { index: number; name: string };
}

export interface TasteSelection {
  active?: boolean;
  taste?: string | number;
  dna?: string | number;
  recipe?: string | number;
  pageKind?: PageKind;
  kind?: PageKind;
  genre?: string;
  mode?: TasteMode;
  variance?: number;
  motionIntensity?: number;
  visualDensity?: number;
}

export interface TasteProfile {
  active: boolean;
  dna: TasteDNA;
  pageKind: PageKind;
  genre: string;
  mode: TasteMode;
  variance: number;
  motionIntensity: number;
  visualDensity: number;
  macrostructure: TasteNamedAxis;
  hero: TasteNamedAxis;
  navigation: TasteNamedAxis;
  footer: TasteNamedAxis;
  typography: TasteTypographySystem;
  palette: TastePalette;
  geometry: TasteNamedAxis;
  surface: TasteNamedAxis;
  rhythm: TasteNamedAxis;
  assetTreatment: TasteNamedAxis;
}

export interface TasteAuditFinding {
  code: string;
  points: number;
  message: string;
  line: number;
}

export interface TasteAudit {
  engine: number;
  score: number;
  grade: string;
  passed: boolean;
  minimum: number;
  findings: readonly TasteAuditFinding[];
  metrics: Readonly<Record<string, number>>;
  profile: Readonly<Record<string, string | number>>;
}

export interface TasteUsage {
  blocks: number;
  looks: number;
  layouts: readonly string[];
  surfaces: readonly string[];
  roles: readonly string[];
  typeVoices: readonly string[];
}

export interface TasteNormalizeResult {
  source: string;
  used: boolean;
  profile: TasteProfile | null;
  audit: TasteAudit | null;
  diagnostics: readonly import("./index.js").Diagnostic[];
  usage: TasteUsage;
  motion: Readonly<Record<string, unknown>>;
  features: Readonly<{ taste: boolean; motion5: boolean }>;
}

export interface TasteManifest {
  engine: number;
  recipes: number;
  elementLooks: number;
  axes: Readonly<Record<string, number>>;
  dna: string;
  pageKind: string;
  genre: string;
  mode: TasteMode;
  dials: Readonly<Record<string, number>>;
  structure: Readonly<Record<string, string>>;
  visual: Readonly<Record<string, string>>;
  usage: TasteUsage;
  audit: TasteAudit;
}

export const TASTE_ENGINE_VERSION: number;
export const TASTE_RECIPE_COUNT: number;
export const ELEMENT_LOOK_COUNT: number;
export const TASTE_MINIMUM_SCORE: number;
export const PAGE_KINDS: readonly PageKind[];
export const TASTE_GENRES: readonly string[];
export const MACROSTRUCTURES: readonly string[];
export const HERO_ARCHITECTURES: readonly string[];
export const NAV_ARCHITECTURES: readonly string[];
export const FOOTER_ARCHITECTURES: readonly string[];
export const GEOMETRIES: readonly string[];
export const SURFACE_LANGUAGES: readonly string[];
export const SECTION_RHYTHMS: readonly string[];
export const ASSET_TREATMENTS: readonly string[];
export const BLOCK_LAYOUTS: readonly string[];
export const TYPE_VOICES: readonly string[];
export const TASTE_ROLES: readonly TasteRole[];
export const ENTER_MOTIONS: readonly string[];
export const SCROLL_MOTIONS: readonly string[];
export const HOVER_MOTIONS: readonly string[];
export const PRESS_MOTIONS: readonly string[];
export const LOOP_MOTIONS: readonly string[];
export const CHOREOGRAPHIES: readonly string[];
export const TYPOGRAPHY_SYSTEMS: readonly TasteTypographySystem[];
export const TASTE_PALETTES: readonly TastePalette[];
export const TASTE_AXES: Readonly<Record<string, number>>;

export function resolveTasteDNA(value?: string | number): TasteDNA | null;
export function resolveElementLook(value?: string | number): ElementLook | null;
export function resolveTasteProfile(selection?: TasteSelection): TasteProfile;
export function defaultTasteForBlock(profile: TasteProfile, blockName?: string, line?: number, explicit?: Record<string, unknown>): Readonly<Record<string, unknown>>;
export function auditTasteSource(source: string, profile?: TasteSelection | TasteProfile): TasteAudit;
export function tasteManifest(profile: TasteProfile, audit: TasteAudit, usage?: Partial<TasteUsage>): TasteManifest;
