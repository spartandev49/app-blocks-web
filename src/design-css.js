import { FONT_PRESETS, PALETTES } from "./design-data.js";
import { STATIC_DESIGN_CSS } from "./design-css-static.js";

const freeze = (value) => Object.freeze(value);

function hexToRgb(value) {
  const raw = value.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(raw.slice(offset, offset + 2), 16));
}

function rgbToHex(values) {
  return `#${values.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

function mix(left, right, amount) {
  const a = hexToRgb(left);
  const b = hexToRgb(right);
  return rgbToHex(a.map((value, index) => value * (1 - amount) + b[index] * amount));
}

function lineColor(paletteValue) {
  return mix(paletteValue.paper, paletteValue.ink, 0.18);
}

function paletteRule(name, values) {
  const line = lineColor(values);
  return `html[data-palette="${name}"],.ab-palette-${name}{--ab-paper:${values.paper};--ab-paper-2:${mix(values.paper, values.ink, .06)};--ab-surface:${values.surface};--ab-surface-2:${mix(values.surface, values.ink, .08)};--ab-ink:${values.ink};--ab-ink-2:${mix(values.ink, values.paper, .2)};--ab-muted:${values.muted};--ab-line:${line};--ab-line-strong:${mix(values.paper, values.ink, .34)};--ab-accent:${values.accent};--ab-accent-2:${values.accent2};--ab-accent-soft:${mix(values.paper, values.accent, .17)};--ab-grid:${mix(values.paper, values.accent, .12)}55}`;
}

function darkPaletteRule(name, values) {
  const paper = mix("#05070b", values.accent, .08);
  const surface = mix("#0e131c", values.accent, .13);
  const ink = mix("#ffffff", values.accent, .04);
  const muted = mix("#9ca6b6", values.accent, .1);
  return `html[data-theme="dark"][data-palette="${name}"]{--ab-paper:${paper};--ab-paper-2:${mix(paper, "#ffffff", .05)};--ab-surface:${surface};--ab-surface-2:${mix(surface, "#ffffff", .07)};--ab-ink:${ink};--ab-ink-2:${mix(ink, paper, .18)};--ab-muted:${muted};--ab-line:${mix(surface, ink, .18)};--ab-line-strong:${mix(surface, ink, .32)};--ab-accent:${mix(values.accent, "#ffffff", .24)};--ab-accent-2:${mix(values.accent2, "#ffffff", .34)};--ab-accent-soft:${mix(paper, values.accent, .3)};--ab-grid:${mix(paper, values.accent, .18)}66}`;
}

function fontRule(name, values) {
  return `html[data-font="${name}"],.ab-font-${name}{--ab-font:${values.body}}html[data-display-font="${name}"],.ab-display-font-${name}{--ab-display:${values.display}}html[data-mono-font="${name}"],.ab-mono-font-${name}{--ab-mono:${values.mono}}.ab-font-${name}{--ab-display:${values.display};--ab-mono:${values.mono}}`;
}

const SHAPE_RULES = freeze({
  square: "--ab-radius-xs:0;--ab-radius-sm:0;--ab-radius-md:0;--ab-radius-lg:0;--ab-clip:none",
  subtle: "--ab-radius-xs:2px;--ab-radius-sm:4px;--ab-radius-md:8px;--ab-radius-lg:14px;--ab-clip:none",
  rounded: "--ab-radius-xs:5px;--ab-radius-sm:10px;--ab-radius-md:16px;--ab-radius-lg:26px;--ab-clip:none",
  soft: "--ab-radius-xs:8px;--ab-radius-sm:14px;--ab-radius-md:22px;--ab-radius-lg:36px;--ab-clip:none",
  pill: "--ab-radius-xs:999px;--ab-radius-sm:999px;--ab-radius-md:999px;--ab-radius-lg:999px;--ab-clip:none",
  organic: "--ab-radius-xs:8px 14px 9px 16px;--ab-radius-sm:16px 28px 18px 30px;--ab-radius-md:28px 54px 34px 62px;--ab-radius-lg:58px 92px 64px 110px;--ab-clip:none",
  cut: "--ab-radius-xs:0;--ab-radius-sm:0;--ab-radius-md:0;--ab-radius-lg:0;--ab-clip:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)",
  ticket: "--ab-radius-xs:4px;--ab-radius-sm:8px;--ab-radius-md:12px;--ab-radius-lg:18px;--ab-clip:polygon(0 10px,10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px))",
  arch: "--ab-radius-xs:999px 999px 6px 6px;--ab-radius-sm:999px 999px 10px 10px;--ab-radius-md:999px 999px 16px 16px;--ab-radius-lg:999px 999px 24px 24px;--ab-clip:none",
  blob: "--ab-radius-xs:55% 45% 48% 52%/52% 48% 55% 45%;--ab-radius-sm:55% 45% 48% 52%/52% 48% 55% 45%;--ab-radius-md:58% 42% 46% 54%/44% 56% 48% 52%;--ab-radius-lg:58% 42% 46% 54%/44% 56% 48% 52%;--ab-clip:none",
  diamond: "--ab-radius-xs:0;--ab-radius-sm:0;--ab-radius-md:0;--ab-radius-lg:0;--ab-clip:polygon(50% 0,100% 50%,50% 100%,0 50%)",
  notched: "--ab-radius-xs:0;--ab-radius-sm:0;--ab-radius-md:0;--ab-radius-lg:0;--ab-clip:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
  scoop: "--ab-radius-xs:10px 2px;--ab-radius-sm:18px 4px;--ab-radius-md:32px 8px;--ab-radius-lg:64px 12px;--ab-clip:none",
  slant: "--ab-radius-xs:0;--ab-radius-sm:0;--ab-radius-md:0;--ab-radius-lg:0;--ab-clip:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%)",
  brutal: "--ab-radius-xs:0;--ab-radius-sm:0;--ab-radius-md:0;--ab-radius-lg:0;--ab-clip:none",
  window: "--ab-radius-xs:4px;--ab-radius-sm:8px;--ab-radius-md:12px;--ab-radius-lg:18px;--ab-clip:none"
});

const DENSITY_RULES = freeze({ air: "1.35", comfortable: "1.15", standard: "1", compact: ".82", dense: ".68", micro: ".54" });
const SHADOW_RULES = freeze({
  none: "none", hairline: "0 1px 0 rgba(10,20,35,.08)", soft: "0 10px 30px rgba(10,20,35,.10)",
  medium: "0 18px 48px rgba(10,20,35,.15)", deep: "0 32px 90px rgba(10,20,35,.22)",
  float: "0 22px 48px rgba(10,20,35,.18),0 3px 10px rgba(10,20,35,.10)", hard: "8px 8px 0 var(--ab-ink)",
  glow: "0 0 0 1px color-mix(in srgb,var(--ab-accent) 35%,transparent),0 0 34px var(--ab-accent-soft)"
});

function safeFontName(value) {
  const name = String(value ?? "").trim();
  return /^[\p{L}\p{N} _-]{1,64}$/u.test(name) ? name : "";
}

function safeFontUrl(value) {
  const url = String(value ?? "").trim();
  if (!url || /["'()\\\s]/.test(url)) return "";
  return /^(?:https?:\/\/|\/|\.\.?\/)[^\s]+$/i.test(url) ? url : "";
}

function customFontRules(attrs = {}) {
  const bodyName = safeFontName(attrs["font-name"]);
  const bodyUrl = safeFontUrl(attrs["font-src"]);
  const displayName = safeFontName(attrs["display-name"]);
  const displayUrl = safeFontUrl(attrs["display-src"]);
  const rules = [];
  if (bodyName && bodyUrl) rules.push(`@font-face{font-family:"${bodyName}";src:url("${bodyUrl}") format("woff2");font-display:swap;font-style:normal;font-weight:100 900}`);
  if (displayName && displayUrl) rules.push(`@font-face{font-family:"${displayName}";src:url("${displayUrl}") format("woff2");font-display:swap;font-style:normal;font-weight:100 900}`);
  if (bodyName) rules.push(`html[data-font]{--ab-font:"${bodyName}",ui-sans-serif,system-ui,sans-serif}`);
  if (displayName) rules.push(`html[data-display-font]{--ab-display:"${displayName}",var(--ab-font)}`);
  return rules.join("");
}

export function designCss(options = {}) {
  const paletteRules = Object.entries(PALETTES).flatMap(([name, values]) => [paletteRule(name, values), darkPaletteRule(name, values)]).join("");
  const fontRules = Object.entries(FONT_PRESETS).map(([name, values]) => fontRule(name, values)).join("");
  const shapeRules = Object.entries(SHAPE_RULES).map(([name, declarations]) => `html[data-shape="${name}"],.ab-shape-${name}{${declarations}}`).join("");
  const densityRules = Object.entries(DENSITY_RULES).map(([name, value]) => `html[data-density="${name}"],.ab-density-${name}{--ab-density:${value}}`).join("");
  const shadowRules = Object.entries(SHADOW_RULES).map(([name, value]) => `html[data-shadow="${name}"],.ab-shadow-${name}{--ab-component-shadow:${value}}`).join("");
  const delayRules = Array.from({ length: 41 }, (_, index) => `.ab-delay-${index * 50}{--ab-delay:${index * 50}ms}`).join("");
  const durationRules = Array.from({ length: 30 }, (_, index) => `.ab-duration-${(index + 1) * 100}{--ab-duration:${(index + 1) * 100}ms}`).join("");
  return `@layer design{:root{--ab-display:var(--ab-font);--ab-density:1;--ab-component-shadow:var(--ab-shadow-sm);--ab-delay:0ms;--ab-duration:620ms;--ab-spring:cubic-bezier(.16,1,.3,1);--ab-enter-transform:translateY(22px);--ab-enter-filter:none}${paletteRules}${fontRules}${customFontRules(options)}${shapeRules}${densityRules}${shadowRules}${delayRules}${durationRules}${STATIC_DESIGN_CSS}
}`;
}
