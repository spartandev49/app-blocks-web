import { readFile } from "node:fs/promises";
import {
  compile as compileV3,
  normalizeBase,
  writeBuild
} from "./compiler-v3.js";
import { AppBlocksError } from "./diagnostics.js";
import { normalizeTasteSource } from "./normalizer-v5.js";
import {
  ELEMENT_LOOK_COUNT,
  TASTE_ENGINE_VERSION,
  TASTE_MINIMUM_SCORE,
  TASTE_RECIPE_COUNT,
  auditTasteSource,
  tasteManifest
} from "./taste5.js";
import {
  MOTION5_ENGINE_VERSION,
  MOTION5_RECIPE_COUNT,
  motion5Manifest
} from "./motion5.js";
import {
  TASTE5_RUNTIME,
  buildTasteCss,
  tasteFontStylesheetUrl
} from "./taste5-assets.js";

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

function decorateHtml(html, profile, audit) {
  const attributes = [
    `data-ab-taste-engine="${TASTE_ENGINE_VERSION}"`,
    `data-ab-taste-recipes="${TASTE_RECIPE_COUNT}"`,
    `data-ab-element-looks="${ELEMENT_LOOK_COUNT}"`,
    `data-ab-taste-dna="${escapeAttribute(profile.dna.id)}"`,
    `data-ab-page-kind="${escapeAttribute(profile.pageKind)}"`,
    `data-ab-taste-genre="${escapeAttribute(profile.genre)}"`,
    `data-ab-taste-mode="${escapeAttribute(profile.mode)}"`,
    `data-ab-design-variance="${profile.variance}"`,
    `data-ab-motion-intensity="${profile.motionIntensity}"`,
    `data-ab-visual-density="${profile.visualDensity}"`,
    `data-ab-motion5-engine="${MOTION5_ENGINE_VERSION}"`,
    `data-ab-motion5-recipes="${MOTION5_RECIPE_COUNT}"`,
    `data-ab-taste-score="${audit.score}"`,
    `data-ab-taste-grade="${escapeAttribute(audit.grade)}"`
  ];
  const fontUrl = tasteFontStylesheetUrl(profile);
  let output = String(html).replace(/<html\b([^>]*)>/i, (_match, existing) => `<html${existing} ${attributes.join(" ")}>`);
  output = output.replace(
    "const t=localStorage.getItem('appblocks-theme');e.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'",
    "const m=e.dataset.abTasteMode;const t=localStorage.getItem('appblocks-theme');e.dataset.theme=m==='light'||m==='dark'?m:t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'"
  );
  const fontTags = `<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link rel="stylesheet" href="${escapeAttribute(fontUrl)}">`;
  output = output.replace(/(\s*<link rel="stylesheet" href="[^"]*appblocks\.css">)/i, `\n  ${fontTags}$1`);
  return output;
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
    const ratio = source.bytes ? Number((output.bytes / source.bytes).toFixed(2)) : 0;
    if (Object.hasOwn(value.output, "expansionRatio")) value.output.expansionRatio = ratio;
    if (Object.hasOwn(value.output, "ratio")) value.output.ratio = ratio;
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

function sameMetrics(left, right) {
  return left.bytes === right.bytes && left.characters === right.characters && left.estimatedTokens === right.estimatedTokens;
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
    patchRecursive(manifest, source, metrics);
    files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
    const next = outputMetrics(files);
    if (sameMetrics(metrics, next)) return;
    metrics = next;
  }
  patchRecursive(manifest, source, metrics);
  files.set(manifestName, `${JSON.stringify(manifest, null, 2)}\n`);
}

function tasteError(taste, authoredSource, options) {
  if (taste.diagnostics.length) {
    throw new AppBlocksError("Taste normalization failed.", taste.diagnostics);
  }
  if ((options.tasteStrict || options["taste-strict"]) && !taste.audit.passed) {
    const first = taste.audit.findings[0];
    const diagnostic = {
      message: `Taste audit scored ${taste.audit.score}/100; minimum is ${TASTE_MINIMUM_SCORE}.`,
      line: first?.line || 1,
      column: 1,
      hint: first?.message ?? "Run appblocks-v2 audit <file> --json and repair every finding.",
      severity: "error"
    };
    throw new AppBlocksError("Taste quality gate failed.", [diagnostic]);
  }
}

export async function compile(source, options = {}) {
  const authoredSource = String(source ?? "");
  const taste = normalizeTasteSource(authoredSource);
  if (!taste.used) {
    if (options.tasteStrict || options["taste-strict"]) {
      const audit = auditTasteSource(authoredSource);
      const diagnostic = {
        message: `Taste audit scored ${audit.score}/100; minimum is ${TASTE_MINIMUM_SCORE}.`,
        line: 1,
        column: 1,
        hint: audit.findings[0]?.message ?? "Choose a Taste DNA with ts=t0000000 through ts=t9999999.",
        severity: "error"
      };
      throw new AppBlocksError("Taste quality gate failed.", [diagnostic]);
    }
    return compileV3(authoredSource, options);
  }
  tasteError(taste, authoredSource, options);

  const base = await compileV3(taste.source, options);
  const files = new Map(base.files);
  const cssName = findFile(files, (name) => name.endsWith("appblocks.css"), "appblocks.css");
  const scriptName = findFile(files, (name) => name.endsWith("appblocks.js"), "appblocks.js");
  appendAsset(files, cssName, buildTasteCss(taste.profile));
  appendAsset(files, scriptName, TASTE5_RUNTIME);

  const tasteOutput = tasteManifest(taste.profile, taste.audit, taste.usage);
  const motionOutput = motion5Manifest(taste.profile, taste.motion);
  files.set("appblocks.taste.json", `${JSON.stringify(tasteOutput, null, 2)}\n`);
  files.set("appblocks.motion5.json", `${JSON.stringify(motionOutput, null, 2)}\n`);

  for (const [name, contents] of [...files.entries()]) {
    if (name.endsWith(".html")) files.set(name, decorateHtml(contents, taste.profile, taste.audit));
  }

  const manifest = structuredClone(base.manifest);
  manifest.taste = {
    engine: TASTE_ENGINE_VERSION,
    dna: taste.profile.dna.id,
    score: taste.audit.score,
    grade: taste.audit.grade,
    recipes: TASTE_RECIPE_COUNT,
    elementLooks: ELEMENT_LOOK_COUNT,
    motionEngine: MOTION5_ENGINE_VERSION,
    motionRecipes: MOTION5_RECIPE_COUNT
  };
  reconcileManifest(files, manifest, authoredSource);

  const capabilities = {
    ...(base.capabilities ?? {}),
    generation: base.capabilities?.generation ?? 2,
    tasteEngine: TASTE_ENGINE_VERSION,
    tasteRecipes: TASTE_RECIPE_COUNT,
    elementLooks: ELEMENT_LOOK_COUNT,
    tasteDNA: taste.profile.dna.id,
    tasteScore: taste.audit.score,
    tasteGrade: taste.audit.grade,
    motionEngine: MOTION5_ENGINE_VERSION,
    motionRecipes: MOTION5_RECIPE_COUNT,
    motionProfile: `taste-${taste.profile.motionIntensity}`,
    features: {
      ...(base.capabilities?.features ?? {}),
      taste: true,
      motion5: true
    }
  };

  return {
    ...base,
    files,
    manifest,
    normalizedSource: base.normalizedSource ?? taste.source,
    taste,
    motion5: motionOutput,
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
