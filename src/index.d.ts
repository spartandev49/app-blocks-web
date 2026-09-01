export interface SourceLocation { line: number; column: number; indent: number }
export interface AppBlockNode {
  name: string;
  args: unknown[];
  attrs: Record<string, unknown>;
  children: AppBlockNode[];
  loc: SourceLocation;
}
export interface Diagnostic { message: string; line: number; column: number; hint: string; severity: "error" | "warning" }
export interface BuildManifest {
  format: "appblocks-web-build";
  version: 1;
  engine: string;
  project: string;
  base: string;
  pages: Array<{ route: string; file: string; title: string }>;
  files: string[];
  blocks: { total: number; counts: Record<string, number> };
  source: { bytes: number; estimatedTokens: number };
  output: { bytes: number; estimatedTokens: number; expansionRatio: number };
}
export interface CompileResult { ast: AppBlockNode; diagnostics: Diagnostic[]; files: Map<string, string>; manifest: BuildManifest }
export interface CompileOptions { filename?: string; base?: string; strict?: boolean }
export class AppBlocksError extends Error { diagnostics: Diagnostic[] }
export const VERSION: string;
export const CATALOG: readonly Record<string, unknown>[];
export function parse(source: string, options?: { filename?: string }): AppBlockNode;
export function validate(ast: AppBlockNode, options?: { strict?: boolean }): Diagnostic[];
export function assertValid(ast: AppBlockNode, options?: { strict?: boolean }): Diagnostic[];
export function compile(source: string, options?: CompileOptions): Promise<CompileResult>;
export function buildFile(filename: string, options?: CompileOptions & { outDir?: string }): Promise<CompileResult>;
export function writeBuild(result: CompileResult, outDir: string): Promise<{ outDir: string; files: string[] }>;
export function getBlock(name: string): Record<string, unknown> | undefined;
export function getCatalog(options?: { category?: string }): Record<string, unknown>[];
export function compactCatalog(): Record<string, unknown>[];
