import { readFile } from "node:fs/promises";
import {
  compile as compileGeneration2,
  normalizeBase,
  writeBuild
} from "./compiler-v2.js";

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function measure(files) {
  const result = [...files.values()].reduce((metrics, value) => {
    const text = String(value);
    metrics.bytes += Buffer.byteLength(text);
    metrics.characters += text.length;
    return metrics;
  }, { bytes: 0, characters: 0, estimatedTokens: 0 });
  result.estimatedTokens = Math.ceil(result.characters / 4);
  return result;
}

function same(left, right) {
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

function patchRecursive(value, source, output, depth = 0, seen = new Set()) {
  if (!isRecord(value) || seen.has(value) || depth > 7) return;
  seen.add(value);
  if (isRecord(value.source) && isRecord(value.output)) {
    patchMetricObject(value.source, source);
    patchMetricObject(value.output, output);
    const byteRatio = source.bytes ? Number((output.bytes / source.bytes).toFixed(2)) : 0;
    const tokenRatio = source.estimatedTokens ? Number((output.estimatedTokens / source.estimatedTokens).toFixed(2)) : 0;
    if (Object.hasOwn(value.output, "expansionRatio")) value.output.expansionRatio = byteRatio;
    if (Object.hasOwn(value.output, "ratio")) value.output.ratio = byteRatio;
    if (isRecord(value.expansion)) {
      if (Object.hasOwn(value.expansion, "bytes")) value.expansion.bytes = byteRatio;
      if (Object.hasOwn(value.expansion, "tokens")) value.expansion.tokens = tokenRatio;
      if (Object.hasOwn(value.expansion, "ratio")) value.expansion.ratio = byteRatio;
    }
  }
  const flat = {
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
  for (const [key, replacement] of Object.entries(flat)) {
    if (Object.hasOwn(value, key)) value[key] = replacement;
  }
  for (const child of Object.values(value)) patchRecursive(child, source, output, depth + 1, seen);
}

function reconcile(result, authoredSource) {
  const files = result.files;
  const manifest = result.manifest;
  const manifestName = [...files.keys()].find((name) => name.endsWith("manifest.json")) ?? "appblocks.manifest.json";
  const source = {
    bytes: Buffer.byteLength(authoredSource),
    characters: authoredSource.length,
    estimatedTokens: Math.ceil(authoredSource.length / 4)
  };
  let metrics = measure(files);
  for (let pass = 0; pass < 50; pass += 1) {
    patchRecursive(manifest, source, metrics);
    files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
    const next = measure(files);
    if (same(metrics, next)) return result;
    metrics = next;
  }
  patchRecursive(manifest, source, metrics);
  files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
  return result;
}

export async function compile(source, options = {}) {
  const authoredSource = String(source ?? "");
  const result = await compileGeneration2(authoredSource, options);
  if (!result.capabilities) return result;
  return reconcile(result, authoredSource);
}

export async function buildFile(filename, options = {}) {
  const source = await readFile(filename, "utf8");
  const result = await compile(source, { ...options, filename: options.filename ?? filename });
  const destination = options.outDir ?? options.outputDir;
  if (destination) await writeBuild(result, destination);
  return result;
}

export { normalizeBase, writeBuild };
