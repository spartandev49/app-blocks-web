import type { TasteProfile, TasteRole } from "./taste5.js";

export interface Motion5Selection {
  id: string;
  kind: "motion5-recipe" | "motion5-selection";
  index?: number;
  role?: TasteRole;
  dial?: number;
  enter: string;
  scroll: string;
  hover: string;
  press: string;
  loop: string;
  choreography: string;
  duration: string;
  easing: string;
  intensity: string;
  repeat: boolean;
}

export const MOTION5_ENGINE_VERSION: number;
export const MOTION5_RECIPE_COUNT: number;
export const MOTION5_DURATIONS: readonly string[];
export const MOTION5_EASINGS: readonly string[];
export const MOTION5_INTENSITIES: readonly string[];
export function resolveMotion5Recipe(value?: string | number): Motion5Selection | null;
export function resolveTasteMotion(profile: TasteProfile, blockName?: string, role?: TasteRole, explicit?: Record<string, unknown>): Motion5Selection;
export function motion5Classes(selection: Motion5Selection): string[];
export function motion5Manifest(profile: TasteProfile, usage?: Record<string, unknown>): Record<string, unknown>;
