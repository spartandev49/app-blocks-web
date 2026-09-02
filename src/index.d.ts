export interface SourceLocation {
  line: number;
  column: number;
  indent: number;
}

export interface AppBlockNode {
  name: string;
  args: unknown[];
  attrs: Record<string, unknown>;
  children: AppBlockNode[];
  loc: SourceLocation;
  filename?: string;
}

export interface Diagnostic {
  message: string;
  line: number;
  column: number;
  hint: string;
  severity: "error" | "warning";
}

export interface BlockManifest {
  name: string;
  category: string;
  summary: string;
  kind: "block" | "structural";
  variants: readonly string[];
  attributes: readonly string[];
  children: readonly string[];
  examples?: readonly string[];
}

export interface BuildManifest {
  format: "appblocks-web-build";
  version: 1;
  engine: string;
  project: string;
  base: string;
  pages: Array<{ route: string; file: string; title: string }>;
  files: string[];
  blocks: { total: number; counts: Record<string, number> };
  source: { bytes: number; estimatedTokens: number; characters?: number };
  output: { bytes: number; estimatedTokens: number; characters?: number; expansionRatio: number };
  [key: string]: unknown;
}

export interface PaletteDefinition {
  id: string;
  index: number;
  name: string;
  hue: number;
  secondaryHue: number;
  saturation: number;
}

export interface FontPairDefinition {
  id: string;
  index: number;
  name: string;
  display: string;
  body: string;
  mono: string;
}

export interface NamedDesignAxis {
  id: string;
  index: number;
  name: string;
}

export interface DesignRecipe {
  id: string;
  index: number;
  palette: PaletteDefinition;
  font: FontPairDefinition;
  shape: NamedDesignAxis;
  surface: NamedDesignAxis;
  motion: NamedDesignAxis;
  density: NamedDesignAxis;
  shadow: NamedDesignAxis;
}

export interface Generation2Features {
  aliases: boolean;
  macros: boolean;
  virtual: boolean;
  design: boolean;
  [key: string]: boolean;
}

export interface DesignSelection {
  active?: boolean;
  recipe?: string | number;
  palette?: string | number;
  font?: string | number;
  shape?: string | number;
  surface?: string | number;
  motion?: string | number;
  density?: string | number;
  shadow?: string | number;
  primary?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  fontDisplay?: string;
  fontBody?: string;
  fontMono?: string;
}

export interface ResolvedDesign {
  active: boolean;
  recipe: DesignRecipe;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
}

export interface DesignManifest {
  active: boolean;
  recipes: number;
  virtualBlocks: number;
  semanticMacros: number;
  features: Record<string, boolean>;
  recipe?: string;
  palette?: string;
  font?: string;
  shape?: string;
  surface?: string;
  motion?: string;
  density?: string;
  shadow?: string;
}

export interface VirtualBlockResolution {
  id: string;
  prefix: string;
  number: number;
  family: { family: string; target: string; category: string };
  target: string;
  category: string;
  attrs: Readonly<Record<string, unknown>>;
  classes: readonly string[];
  classSupported: boolean;
  style: Readonly<{ shape: number; surface: number; motion: number; density: number; shadow: number }>;
}

export interface Generation2Capabilities {
  generation: 2;
  compactSyntax: true;
  recipes: number;
  virtualBlocks: number;
  semanticMacros: number;
  features: Record<string, boolean>;
}

export interface NormalizeResult {
  source: string;
  used: boolean;
  design: Readonly<Record<string, unknown>>;
  features: Generation2Features;
}

export interface CompileResult {
  ast: AppBlockNode;
  diagnostics: Diagnostic[];
  files: Map<string, string>;
  manifest: BuildManifest;
  normalizedSource?: string;
  design?: DesignManifest;
  capabilities?: Generation2Capabilities;
}

export interface CompileOptions {
  filename?: string;
  base?: string;
  strict?: boolean;
  tasteStrict?: boolean;
}

export class AppBlocksError extends Error {
  diagnostics: Diagnostic[];
}

export const VERSION: string;
export const CATALOG: readonly BlockManifest[];
export const EXTENDED_CATALOG: readonly BlockManifest[];
export const SEMANTIC_CATALOG: readonly BlockManifest[];
export const RECIPE_COUNT: number;
export const VIRTUAL_BLOCK_COUNT: number;
export const VIRTUAL_BLOCKS_PER_FAMILY: number;
export const SEMANTIC_MACRO_COUNT: number;
export const DESIGN_AXES: Readonly<{
  recipes: number;
  palettes: number;
  fontPairings: number;
  shapes: number;
  surfaces: number;
  motions: number;
  densities: number;
  shadows: number;
}>;
export const SHAPES: readonly string[];
export const SURFACES: readonly string[];
export const MOTIONS: readonly string[];
export const DENSITIES: readonly string[];
export const SHADOWS: readonly string[];
export const BLOCK_ALIASES: Readonly<Record<string, string>>;
export const ATTRIBUTE_ALIASES: Readonly<Record<string, string>>;
export const MACROS: Readonly<Record<string, unknown>>;
export const ADVANCED_CSS: string;
export const ADVANCED_RUNTIME: string;

export function parse(source: string, options?: { filename?: string }): AppBlockNode;
export function validate(ast: AppBlockNode, options?: { strict?: boolean }): Diagnostic[];
export function assertValid(ast: AppBlockNode, options?: { strict?: boolean }): Diagnostic[];
export function compile(source: string, options?: CompileOptions): Promise<CompileResult>;
export function buildFile(filename: string, options?: CompileOptions & { outDir?: string; outputDir?: string }): Promise<CompileResult>;
export function writeBuild(result: CompileResult, outDir: string): Promise<{ outDir: string; files: string[] }>;
export function normalizeBase(value?: string): string;
export function normalizeCompactSource(source: string): NormalizeResult;
export function getBlock(name: string): BlockManifest | undefined;
export function getCatalog(options?: { category?: string; includeMacros?: boolean; extended?: boolean }): BlockManifest[];
export function compactCatalog(options?: { category?: string; includeMacros?: boolean; extended?: boolean }): Record<string, unknown>[];
export function resolvePalette(value?: string | number): PaletteDefinition;
export function resolveFontPair(value?: string | number): FontPairDefinition;
export function resolveRecipe(id?: string): DesignRecipe | null;
export function resolveVirtualBlock(name: string): VirtualBlockResolution | null;
export function resolveDesign(selection?: DesignSelection): ResolvedDesign;
export function designManifest(selection?: DesignSelection, features?: Record<string, boolean>): DesignManifest;
export function buildDesignCss(selection?: DesignSelection): string;
export function renderNode(node: AppBlockNode, context: Record<string, unknown>): string;
export function renderPage(page: AppBlockNode, context: Record<string, unknown>): string;
export function formatDiagnostic(item: Diagnostic, source?: string): string;
export function formatDiagnostics(items: Diagnostic[], source?: string): string;
