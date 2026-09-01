export * from "./index.js";
export * from "./motion3.js";

import type { CompileOptions, CompileResult, DesignManifest, Generation2Features } from "./index.js";
import type { MotionNormalizeResult } from "./motion3.js";

export interface NormalizeSourceResult {
  source: string;
  used: boolean;
  compactUsed: boolean;
  motionUsed: boolean;
  design: Readonly<Record<string, unknown>>;
  motion: MotionNormalizeResult;
  features: Generation2Features & Record<string, boolean>;
}

export interface MotionCapabilities {
  generation: 2;
  compactSyntax: boolean;
  recipes: number;
  virtualBlocks: number;
  semanticMacros: number;
  motionEngine: number;
  motionRecipes: number;
  motionProfile: string | null;
  features: Record<string, boolean>;
}

export interface MotionCompileResult extends Omit<CompileResult, "capabilities"> {
  normalizedSource?: string;
  design?: DesignManifest;
  motion?: MotionNormalizeResult;
  capabilities?: MotionCapabilities;
}

export function normalizeSource(source: string): NormalizeSourceResult;
export function compile(source: string, options?: CompileOptions): Promise<MotionCompileResult>;
export function buildFile(filename: string, options?: CompileOptions & { outDir?: string; outputDir?: string }): Promise<MotionCompileResult>;
