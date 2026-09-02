export * from "./index.js";
export * from "./taste5.js";
export * from "./motion5.js";

import type { CompileOptions, CompileResult, DesignManifest, Generation2Features } from "./index.js";
import type { MotionNormalizeResult } from "./motion3.js";
import type { TasteAudit, TasteProfile } from "./taste5.js";

export interface TasteNormalizeResult {
  source: string;
  used: boolean;
  profile: TasteProfile | null;
  audit: TasteAudit | null;
  diagnostics: readonly Record<string, unknown>[];
  usage: Readonly<Record<string, unknown>>;
  motion: Readonly<Record<string, unknown>>;
  features: Readonly<{ taste: boolean; motion5: boolean }>;
}

export interface NormalizeSourceResult {
  source: string;
  used: boolean;
  compactUsed: boolean;
  motionUsed: boolean;
  tasteUsed: boolean;
  design: Readonly<Record<string, unknown>>;
  motion: MotionNormalizeResult;
  taste: TasteNormalizeResult | null;
  features: Generation2Features & Record<string, boolean>;
}

export interface TasteCapabilities {
  generation: number;
  compactSyntax?: boolean;
  recipes?: number;
  virtualBlocks?: number;
  semanticMacros?: number;
  tasteEngine: 5;
  tasteRecipes: number;
  elementLooks: number;
  tasteDNA: string;
  tasteScore: number;
  tasteGrade: string;
  motionEngine: 5;
  motionRecipes: number;
  motionProfile: string;
  features: Record<string, boolean>;
}

export interface TasteCompileResult extends Omit<CompileResult, "capabilities"> {
  normalizedSource?: string;
  design?: DesignManifest;
  taste?: TasteNormalizeResult;
  motion5?: Record<string, unknown>;
  capabilities?: TasteCapabilities;
}

export function normalizeTasteSource(source: string): TasteNormalizeResult;
export function normalizeSource(source: string): NormalizeSourceResult;
export function compile(source: string, options?: CompileOptions & { tasteStrict?: boolean }): Promise<TasteCompileResult>;
export function buildFile(filename: string, options?: CompileOptions & { tasteStrict?: boolean; outDir?: string; outputDir?: string }): Promise<TasteCompileResult>;
