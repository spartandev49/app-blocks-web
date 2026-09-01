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
  designManifest,
  normalizeCompactSource
} from "./combinatorial-engine.js";
import { ADVANCED_CSS, ADVANCED_RUNTIME, buildDesignCss } from "./combinatorial-assets.js";

function appendAsset(files, name, addition) {
  const current = files.get(name) ?? "";
  files.set(name, `${String(current).trimEnd()}\n\n${String(addition).trim()}\n`);
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function decorateHtml(html, design) {
  const attributes = [
    'data-ab-engine="2"',
    `data-ab-recipes="${DESIGN_AXES.recipes}"`,
    `data-ab-virtual-blocks="${VIRTUAL_BLOCK_COUNT}"`
  ];
  if (design.active) {
    for (const key of ["recipe", "palette", "font", "shape", "surface", "motion", "density", "shadow"]) {
      attributes.push(`data-ab-${key}="${escapeAttribute(design[key])}"`);
    }
  }
  return String(html).replace(/<html\b([^>]*)>/i, (_match, existing) => `<html${existing} ${attributes.join(" ")}>`);
}

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const estimateTokens = (text) => Math.ceil(String(text).length / 4);

function metricParents(manifest) {
  const parents = [];
  if (isRecord(manifest.source) && isRecord(manifest.output)) parents.push(manifest);
  for (const key of ["metrics", "statistics", "sizes"]) {
    const candidate = manifest[key];
    if (isRecord(candidate?.source) && isRecord(candidate?.output)) parents.push(candidate);
  }
  if (!parents.length) {
    manifest.source = isRecord(manifest.source) ? manifest.source : {};
    manifest.output = isRecord(manifest.output) ? manifest.output : {};
    parents.push(manifest);
  }
  return parents;
}

function patchMetricObject(target, values) {
  target.bytes = values.bytes;
  if (Object.hasOwn(target, "characters")) target.characters = values.characters;
  if (Object.hasOwn(target, "tokens")) target.tokens = values.estimatedTokens;
  if (Object.hasOwn(target, "estimated_tokens")) target.estimated_tokens = values.estimatedTokens;
  if (Object.hasOwn(target, "estimatedTokens") || (!Object.hasOwn(target, "tokens") && !Object.hasOwn(target, "estimated_tokens"))) {
    target.estimatedTokens = values.estimatedTokens;
  }
}

function patchMetrics(manifest, authoredSource, output) {
  const source = {
    bytes: Buffer.byteLength(authoredSource),
    characters: authoredSource.length,
    estimatedTokens: estimateTokens(authoredSource)
  };
  const ratio = source.bytes ? Number((output.bytes / source.bytes).toFixed(2)) : 0;
  for (const parent of metricParents(manifest)) {
    patchMetricObject(parent.source, source);
    patchMetricObject(parent.output, output);
    parent.output.expansionRatio = ratio;
    if (isRecord(parent.expansion)) {
      if (Object.hasOwn(parent.expansion, "bytes")) parent.expansion.bytes = ratio;
      if (Object.hasOwn(parent.expansion, "ratio")) parent.expansion.ratio = ratio;
      if (Object.hasOwn(parent.expansion, "tokens")) parent.expansion.tokens = source.estimatedTokens ? Number((output.estimatedTokens / source.estimatedTokens).toFixed(2)) : 0;
    }
  }
  if (Object.hasOwn(manifest, "expansionRatio")) manifest.expansionRatio = ratio;
}

function outputMetrics(files) {
  return [...files.values()].reduce((metrics, value) => {
    const text = String(value);
    metrics.bytes += Buffer.byteLength(text);
    metrics.characters += text.length;
    return metrics;
  }, { bytes: 0, characters: 0, estimatedTokens: 0 });
}

function reconcileManifest(files, manifest, authoredSource) {
  const manifestName = [...files.keys()].find((name) => name.endsWith(".manifest.json")) ?? "appblocks.manifest.json";
  let previous = null;
  for (let pass = 0; pass < 24; pass += 1) {
    patchMetrics(manifest, authoredSource, previous ?? { bytes: 0, characters: 0, estimatedTokens: 0 });
    files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
    const next = outputMetrics(files);
    next.estimatedTokens = Math.ceil(next.characters / 4);
    if (previous && next.bytes === previous.bytes && next.characters === previous.characters && next.estimatedTokens === previous.estimatedTokens) break;
    previous = next;
  }
  patchMetrics(manifest, authoredSource, previous ?? outputMetrics(files));
  files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
  const verification = outputMetrics(files);
  verification.estimatedTokens = Math.ceil(verification.characters / 4);
  const currentParent = metricParents(manifest)[0];
  if (currentParent.output.bytes !== verification.bytes || currentParent.output.estimatedTokens !== verification.estimatedTokens) {
    patchMetrics(manifest, authoredSource, verification);
    files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

export async function compile(source, options = {}) {
  const authoredSource = String(source ?? "");
  const normalized = normalizeCompactSource(authoredSource);
  const legacy = await compileLegacy(normalized.source, options);
  const files = new Map(legacy.files);
  const design = designManifest(normalized.design);

  appendAsset(files, "appblocks.css", `${ADVANCED_CSS}\n${buildDesignCss(normalized.design)}`);
  appendAsset(files, "appblocks.js", ADVANCED_RUNTIME);
  const catalogName = [...files.keys()].find((name) => name.endsWith(".catalog.json")) ?? "appblocks.catalog.json";
  files.set(catalogName, `${JSON.stringify(compactCatalog({ includeMacros: true }), null, 2)}\n`);
  files.set("appblocks.design.json", `${JSON.stringify({
    generation: 2,
    compactSyntax: true,
    design,
    axes: DESIGN_AXES,
    virtualBlocks: VIRTUAL_BLOCK_COUNT,
    semanticMacros: SEMANTIC_MACRO_COUNT
  }, null, 2)}\n`);

  for (const [name, contents] of [...files.entries()]) {
    if (name.endsWith(".html")) files.set(name, decorateHtml(contents, design));
  }

  const manifest = structuredClone(legacy.manifest);
  reconcileManifest(files, manifest, authoredSource);
  const capabilities = {
    generation: 2,
    compactSyntax: true,
    recipes: DESIGN_AXES.recipes,
    virtualBlocks: VIRTUAL_BLOCK_COUNT,
    semanticMacros: SEMANTIC_MACRO_COUNT
  };

  return {
    ...legacy,
    files,
    manifest,
    normalizedSource: normalized.source,
    design,
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
