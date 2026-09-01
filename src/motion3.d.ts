export type MotionProfile = "off" | "quiet" | "polished" | "dynamic" | "cinematic" | "playful" | "editorial" | "application" | "commerce" | "dramatic";
export type EnterEffect = "none" | "fade" | "rise" | "fall" | "slide-left" | "slide-right" | "scale-up" | "scale-down" | "blur" | "flip-x" | "flip-y" | "rotate" | "clip-up" | "clip-left" | "clip-right" | "wipe-up" | "pop" | "spring" | "zoom" | "bounce";
export type ScrollEffect = "none" | "reveal" | "parallax-y" | "parallax-x" | "scale" | "rotate" | "fade" | "blur" | "tilt" | "skew" | "clip" | "depth" | "progress" | "pin";
export type HoverEffect = "none" | "lift" | "glow" | "shine" | "fill" | "underline" | "arrow" | "magnetic" | "tilt" | "spotlight" | "border-draw" | "icon-slide" | "jelly" | "bounce" | "pulse" | "soften";
export type PressEffect = "none" | "compress" | "push" | "depress" | "ripple" | "bounce" | "rubber" | "pulse";
export type LoopEffect = "none" | "float" | "breathe" | "pulse" | "bob" | "sway" | "wiggle" | "shimmer" | "gradient" | "spin" | "glow" | "dash";
export type Choreography = "none" | "children" | "cascade" | "grid" | "stack" | "hero" | "wave" | "radial" | "list";
export type MotionEasing = "standard" | "smooth" | "snappy" | "spring" | "expo" | "back" | "linear" | "elastic";
export type MotionDuration = "instant" | "quick" | "fast" | "normal" | "slow" | "cinematic";
export type MotionOrigin = "center" | "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-right" | "bottom-left";
export type MotionIntensity = "subtle" | "normal" | "strong" | "extreme";

export interface MotionSelection {
  id: string;
  index?: number;
  kind: "preset" | "recipe" | "virtual-auto" | "profile-auto";
  enter: EnterEffect;
  scroll: ScrollEffect;
  hover: HoverEffect;
  press: PressEffect;
  loop: LoopEffect;
  choreography: Choreography;
  ease: MotionEasing;
  duration: MotionDuration;
  delay: string;
  stagger: string;
  origin: MotionOrigin;
  intensity: MotionIntensity;
  repeat: boolean;
}

export interface MotionUsage {
  recipes: readonly string[];
  presets: readonly string[];
  enter: readonly string[];
  scroll: readonly string[];
  hover: readonly string[];
  press: readonly string[];
  loop: readonly string[];
  choreography: readonly string[];
}

export interface MotionFeatures {
  motion: boolean;
  profile: boolean;
  profileAuto: boolean;
  explicit: boolean;
  virtualAuto: boolean;
  scrollLinked: boolean;
  microinteractions: boolean;
  ambient: boolean;
  choreography: boolean;
}

export interface MotionNormalizeResult {
  source: string;
  used: boolean;
  profile: MotionProfile | "custom";
  root: MotionSelection;
  features: MotionFeatures;
  usage: MotionUsage;
  invalid: readonly Readonly<{ line: number; key: string; value: string }>[];
}

export interface MotionManifest {
  engine: number;
  recipeCount: number;
  profile: string;
  root: MotionSelection | null;
  features: Record<string, boolean>;
  usage: MotionUsage;
  catalog: Record<string, readonly string[]>;
}

export const MOTION_ENGINE_VERSION: number;
export const MOTION_RECIPE_COUNT: number;
export const MOTION_PROFILES: readonly MotionProfile[];
export const ENTER_EFFECTS: readonly EnterEffect[];
export const SCROLL_EFFECTS: readonly ScrollEffect[];
export const HOVER_EFFECTS: readonly HoverEffect[];
export const PRESS_EFFECTS: readonly PressEffect[];
export const LOOP_EFFECTS: readonly LoopEffect[];
export const CHOREOGRAPHIES: readonly Choreography[];
export const MOTION_EASINGS: readonly MotionEasing[];
export const MOTION_DURATIONS: readonly MotionDuration[];
export const MOTION_DELAYS: readonly string[];
export const MOTION_STAGGERS: readonly string[];
export const MOTION_ORIGINS: readonly MotionOrigin[];
export const MOTION_INTENSITIES: readonly MotionIntensity[];
export const MOTION_PRESETS: Readonly<Record<string, MotionSelection>>;
export const MOTION3_CSS: string;
export const MOTION3_RUNTIME: string;

export function resolveMotionRecipe(id?: string): MotionSelection | null;
export function resolveMotion(value?: string, blockName?: string): MotionSelection | null;
export function normalizeMotionSource(source: string): MotionNormalizeResult;
export function motionManifest(normalized?: Partial<MotionNormalizeResult>): MotionManifest;
export function buildMotionProfileCss(normalized?: Partial<MotionNormalizeResult>): string;
