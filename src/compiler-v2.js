import { readFile } from "node:fs/promises";
import {
  compile as compileLegacy,
  normalizeBase,
  writeBuild
} from "./compiler.js";
import {
  DESIGN_AXES,
  SEMANTIC_MACRO_COUNT,
  VIRTUAL_BLOCK_COUNT,
  compactCatalog,
  designManifest
} from "./generation2.js";
import { normalizeSource } from "./normalizer-v3.js";
import { ADVANCED_CSS, ADVANCED_RUNTIME, buildDesignCss } from "./generation2-assets.js";
import {
  MOTION3_CSS,
  MOTION3_RUNTIME,
  MOTION_ENGINE_VERSION,
  MOTION_RECIPE_COUNT,
  buildMotionProfileCss,
  motionManifest
} from "./motion3.js";

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const estimateTokens = (text) => Math.ceil(String(text).length / 4);

function findFile(files, matcher, fallback) {
  return [...files.keys()].find(matcher) ?? fallback;
}

function appendAsset(files, name, addition) {
  const current = files.get(name) ?? "";
  files.set(name, `${String(current).trimEnd()}\n\n${String(addition).trim()}\n`);
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function decorateHtml(html, design, features, motion) {
  const enabledFeatures = Object.entries(features).filter(([, enabled]) => enabled).map(([name]) => name).join(",");
  const attributes = [
    'data-ab-engine="2"',
    `data-ab-recipes="${DESIGN_AXES.recipes}"`,
    `data-ab-virtual-blocks="${VIRTUAL_BLOCK_COUNT}"`,
    `data-ab-features="${escapeAttribute(enabledFeatures)}"`
  ];
  if (design.active) {
    for (const key of ["recipe", "palette", "font", "shape", "surface", "motion", "density", "shadow"]) {
      attributes.push(`data-ab-${key}="${escapeAttribute(design[key])}"`);
    }
  }
  if (motion?.used) {
    attributes.push(
      `data-ab-motion-engine="${MOTION_ENGINE_VERSION}"`,
      `data-ab-motion-recipes="${MOTION_RECIPE_COUNT}"`,
      `data-ab-motion-profile="${escapeAttribute(motion.profile)}"`
    );
  }
  return String(html).replace(/<html\b([^>]*)>/i, (_match, existing) => `<html${existing} ${attributes.join(" ")}>`);
}

function outputMetrics(files) {
  const metrics = [...files.values()].reduce((result, value) => {
    const text = String(value);
    result.bytes += Buffer.byteLength(text);
    result.characters += text.length;
    return result;
  }, { bytes: 0, characters: 0, estimatedTokens: 0 });
  metrics.estimatedTokens = estimateTokens(metrics.characters);
  return metrics;
}

function sameMetrics(left, right) {
  return left.bytes === right.bytes
    && left.characters === right.characters
    && left.estimatedTokens === right.estimatedTokens;
}

function patchMetricObject(target, metrics) {
  if (!isRecord(target)) return;
  if (Object.hasOwn(target, "bytes")) target.bytes = metrics.bytes;
  if (Object.hasOwn(target, "characters")) target.characters = metrics.characters;
  if (Object.hasOwn(target, "chars")) target.chars = metrics.characters;
  if (Object.hasOwn(target, "tokens")) target.tokens = metrics.estimatedTokens;
  if (Object.hasOwn(target, "estimated_tokens")) target.estimated_tokens = metrics.estimatedTokens;
  if (Object.hasOwn(target, "estimatedTokens")) target.estimatedTokens = metrics.estimatedTokens;
}

function collectMetricPairs(root) {
  const pairs = [];
  const seen = new Set();
  const visit = (value, depth) => {
    if (!isRecord(value) || seen.has(value) || depth > 6) return;
    seen.add(value);
    if (isRecord(value.source) && isRecord(value.output)) pairs.push(value);
    for (const child of Object.values(value)) visit(child, depth + 1);
  };
  visit(root, 0);
  return pairs;
}

function patchFlatMetrics(value, source, output, depth = 0, seen = new Set()) {
  if (!isRecord(value) || seen.has(value) || depth > 6) return;
  seen.add(value);
  const setters = {
    sourceBytes: source.bytes,
    inputBytes: source.bytes,
    authoredBytes: source.bytes,
    outputBytes: output.bytes,
    generatedBytes: output.bytes,
    sourceCharacters: source.characters,
    inputCharacters: source.characters,
    outputCharacters: output.characters,
    generatedCharacters: output.characters,
    sourceTokens: source.estimatedTokens,
    inputTokens: source.estimatedTokens,
    outputTokens: output.estimatedTokens,
    generatedTokens: output.estimatedTokens
  };
  for (const [key, replacement] of Object.entries(setters)) {
    if (Object.hasOwn(value, key)) value[key] = replacement;
  }
  for (const child of Object.values(value)) patchFlatMetrics(child, source, output, depth + 1, seen);
}

function patchManifestMetrics(manifest, source, output) {
  const byteRatio = source.bytes ? Number((output.bytes / source.bytes).toFixed(2)) : 0;
  const tokenRatio = source.estimatedTokens ? Number((output.estimatedTokens / source.estimatedTokens).toFixed(2)) : 0;
  for (const pair of collectMetricPairs(manifest)) {
    patchMetricObject(pair.source, source);
    patchMetricObject(pair.output, output);
    if (Object.hasOwn(pair.output, "expansionRatio")) pair.output.expansionRatio = byteRatio;
    if (Object.hasOwn(pair.output, "ratio")) pair.output.ratio = byteRatio;
    if (isRecord(pair.expansion)) {
      if (Object.hasOwn(pair.expansion, "bytes")) pair.expansion.bytes = byteRatio;
      if (Object.hasOwn(pair.expansion, "tokens")) pair.expansion.tokens = tokenRatio;
      if (Object.hasOwn(pair.expansion, "ratio")) pair.expansion.ratio = byteRatio;
    }
  }
  patchFlatMetrics(manifest, source, output);
  if (Object.hasOwn(manifest, "expansionRatio")) manifest.expansionRatio = byteRatio;
}

function reconcileManifest(files, manifest, authoredSource) {
  const manifestName = findFile(files, (name) => name.endsWith("manifest.json"), "appblocks.manifest.json");
  const source = {
    bytes: Buffer.byteLength(authoredSource),
    characters: authoredSource.length,
    estimatedTokens: estimateTokens(authoredSource)
  };
  let metrics = outputMetrics(files);
  for (let pass = 0; pass < 50; pass += 1) {
    patchManifestMetrics(manifest, source, metrics);
    files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
    const next = outputMetrics(files);
    if (sameMetrics(metrics, next)) return;
    metrics = next;
  }
  patchManifestMetrics(manifest, source, metrics);
  files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
}

export async function compile(source, options = {}) {
  const authoredSource = String(source ?? "");
  const normalized = normalizeSource(authoredSource);

  // Canonical generation-1 sources without compact or motion tokens retain
  // their exact legacy compilation path and output.
  if (!normalized.used) return compileLegacy(authoredSource, options);

  const legacy = await compileLegacy(normalized.source, options);
  const files = new Map(legacy.files);
  const design = designManifest(normalized.design, normalized.features);
  const motion = normalized.motion;
  const cssName = findFile(files, (name) => name.endsWith("appblocks.css"), "appblocks.css");
  const scriptName = findFile(files, (name) => name.endsWith("appblocks.js"), "appblocks.js");

  if (normalized.compactUsed) {
    appendAsset(files, cssName, `${ADVANCED_CSS}\n${buildDesignCss(normalized.design)}`);
    appendAsset(files, scriptName, ADVANCED_RUNTIME);
  }
  if (motion.used) {
    appendAsset(files, cssName, `${MOTION3_CSS}\n${buildMotionProfileCss(motion)}`);
    appendAsset(files, scriptName, MOTION3_RUNTIME);
    files.set("appblocks.motion.json", `${JSON.stringify(motionManifest(motion), null, 2)}\n`);
  }

  files.set("appblocks.extended-catalog.json", `${JSON.stringify(compactCatalog({ includeMacros: true }), null, 2)}\n`);
  files.set("appblocks.design.json", `${JSON.stringify({
    generation: 2,
    compactSyntax: normalized.compactUsed,
    design,
    axes: DESIGN_AXES,
    virtualBlocks: VIRTUAL_BLOCK_COUNT,
    semanticMacros: SEMANTIC_MACRO_COUNT,
    motionEngine: motion.used ? {
      version: MOTION_ENGINE_VERSION,
      recipes: MOTION_RECIPE_COUNT,
      profile: motion.profile
    } : null
  }, null, 2)}\n`);

  for (const [name, contents] of [...files.entries()]) {
    if (name.endsWith(".html")) files.set(name, decorateHtml(contents, design, normalized.features, motion));
  }

  const manifest = structuredClone(legacy.manifest);
  reconcileManifest(files, manifest, authoredSource);
  const capabilities = {
    generation: 2,
    compactSyntax: normalized.compactUsed,
    recipes: DESIGN_AXES.recipes,
    virtualBlocks: VIRTUAL_BLOCK_COUNT,
    semanticMacros: SEMANTIC_MACRO_COUNT,
    motionEngine: motion.used ? MOTION_ENGINE_VERSION : 0,
    motionRecipes: motion.used ? MOTION_RECIPE_COUNT : 0,
    motionProfile: motion.used ? motion.profile : null,
    features: { ...normalized.features }
  };

  return {
    ...legacy,
    files,
    manifest,
    normalizedSource: normalized.source,
    design,
    motion,
    capabilities
  };
}

export async function buildFile(filename, options = {}) {
  const source = await readFile(filename, "utf8");
  const result = await compile(source, { ...options, filename: options.filename ?? filename });
  const destination = options.outDir ?? options.outputDir;
  if (destination) await writeBuild(result, destination);
  return result;
}

export { normalizeBase, writeBuild };
