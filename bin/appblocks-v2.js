#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  TASTE_MINIMUM_SCORE,
  auditTasteSource,
  buildFile,
  compile,
  formatDiagnostics,
  getBlock,
  getCatalog,
  normalizeSource,
  normalizeTasteSource,
  resolveElementLook,
  resolveMotion,
  resolveMotion5Recipe,
  resolveMotionRecipe,
  resolveRecipe,
  resolveTasteDNA,
  resolveVirtualBlock
} from "../src/index.js";

function usage() {
  return `AppBlocks Web generation 2 + Motion 3 + Taste Engine 5

Usage:
  appblocks-v2 build <input.ab> [--out <directory>] [--base <path>] [--strict] [--taste-strict]
  appblocks-v2 check <input.ab> [--strict] [--taste-strict]
  appblocks-v2 audit <input.ab> [--strict] [--json]
  appblocks-v2 normalize <input.ab>
  appblocks-v2 catalog [name] [--extended] [--json]
  appblocks-v2 recipe <r0000-r9999>
  appblocks-v2 taste <t0000000-t9999999>
  appblocks-v2 look <e000000-e999999>
  appblocks-v2 virtual <block-id>
  appblocks-v2 motion <x000-x999|y00000-y99999|preset> [block]

Examples:
  appblocks-v2 build examples/taste-showcase.ab --out dist --strict --taste-strict
  appblocks-v2 audit examples/taste-showcase.ab --strict --json
  appblocks-v2 taste t4839201
  appblocks-v2 look e731024
  appblocks-v2 motion y73124
  appblocks-v2 motion cinematic hero
  appblocks-v2 catalog carousel --json
`;
}

function optionValue(args, name, fallback = undefined) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  return value && !value.startsWith("--") ? value : fallback;
}

function positional(args) {
  const values = [];
  const valuedOptions = new Set(["--out", "--base"]);
  for (let index = 0; index < args.length; index += 1) {
    if (args[index].startsWith("--")) {
      if (valuedOptions.has(args[index])) index += 1;
      continue;
    }
    values.push(args[index]);
  }
  return values;
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function printDiagnostics(diagnostics = []) {
  if (!diagnostics.length) return;
  process.stderr.write(`${formatDiagnostics(diagnostics)}\n`);
}

function compileOptions(args, input) {
  return {
    filename: resolve(input),
    strict: args.includes("--strict"),
    tasteStrict: args.includes("--taste-strict")
  };
}

async function build(args) {
  const [input] = positional(args);
  if (!input) throw new Error("build requires an input .ab file");
  const outDir = optionValue(args, "--out", "dist");
  const result = await buildFile(resolve(input), {
    outDir: resolve(outDir),
    base: optionValue(args, "--base"),
    strict: args.includes("--strict"),
    tasteStrict: args.includes("--taste-strict")
  });
  printDiagnostics(result.diagnostics);
  const score = result.taste?.audit?.score;
  process.stdout.write(`Built ${result.files.size} files in ${outDir}${Number.isFinite(score) ? `; Taste ${score}/100` : ""}\n`);
}

async function check(args) {
  const [input] = positional(args);
  if (!input) throw new Error("check requires an input .ab file");
  const source = await readFile(resolve(input), "utf8");
  const result = await compile(source, compileOptions(args, input));
  printDiagnostics(result.diagnostics);
  const score = result.taste?.audit?.score;
  process.stdout.write(result.diagnostics.length ? "Completed with diagnostics.\n" : `Valid.${Number.isFinite(score) ? ` Taste ${score}/100.` : ""}\n`);
}

async function audit(args) {
  const [input] = positional(args);
  if (!input) throw new Error("audit requires an input .ab file");
  const source = await readFile(resolve(input), "utf8");
  const normalized = normalizeTasteSource(source);
  const report = normalized.audit ?? auditTasteSource(source);
  if (args.includes("--json")) writeJson(report);
  else {
    process.stdout.write(`Taste ${report.score}/100 (${report.grade}); minimum ${report.minimum}.\n`);
    for (const finding of report.findings) {
      process.stdout.write(`- ${finding.code}${finding.line ? `:${finding.line}` : ""}: -${finding.points} ${finding.message}\n`);
    }
  }
  if (args.includes("--strict") && !report.passed) {
    throw new Error(`Taste audit failed at ${report.score}/100; minimum is ${TASTE_MINIMUM_SCORE}.`);
  }
}

async function normalize(args) {
  const [input] = positional(args);
  if (!input) throw new Error("normalize requires an input .ab file");
  const source = await readFile(resolve(input), "utf8");
  const result = normalizeSource(source);
  process.stdout.write(result.source.endsWith("\n") ? result.source : `${result.source}\n`);
}

function catalog(args) {
  const [name] = positional(args);
  const json = args.includes("--json");
  if (name) {
    const block = getBlock(name);
    if (!block) throw new Error(`Unknown block or recipe: ${name}`);
    if (json) writeJson(block);
    else process.stdout.write(`${block.name}\n${block.summary}\n`);
    return;
  }
  const blocks = getCatalog({ includeMacros: args.includes("--extended") });
  if (json) writeJson(blocks);
  else process.stdout.write(`${blocks.map((block) => block.name).join("\n")}\n`);
}

function recipe(args) {
  const [id] = positional(args);
  if (!id) throw new Error("recipe requires an ID such as r7314");
  const value = resolveRecipe(id);
  if (!value) throw new Error(`Unknown recipe: ${id}`);
  writeJson(value);
}

function taste(args) {
  const [id] = positional(args);
  if (!id) throw new Error("taste requires an ID such as t4839201");
  const value = resolveTasteDNA(id);
  if (!value) throw new Error(`Unknown Taste DNA: ${id}`);
  writeJson(value);
}

function look(args) {
  const [id] = positional(args);
  if (!id) throw new Error("look requires an ID such as e731024");
  const value = resolveElementLook(id);
  if (!value) throw new Error(`Unknown element look: ${id}`);
  writeJson(value);
}

function virtual(args) {
  const [id] = positional(args);
  if (!id) throw new Error("virtual requires an ID such as b203 or hr017");
  const value = resolveVirtualBlock(id);
  if (!value) throw new Error(`Unknown virtual block: ${id}`);
  writeJson(value);
}

function motion(args) {
  const [id, block = "section"] = positional(args);
  if (!id) throw new Error("motion requires an ID such as x731, y73124, or a preset such as cinematic");
  const value = resolveMotion5Recipe(id) ?? resolveMotionRecipe(id) ?? resolveMotion(id, block);
  if (!value) throw new Error(`Unknown motion recipe or preset: ${id}`);
  writeJson(value);
}

async function main(argv) {
  const [command, ...args] = argv;
  if (!command || ["help", "--help", "-h"].includes(command)) {
    process.stdout.write(usage());
    return;
  }
  if (command === "build") return build(args);
  if (command === "check") return check(args);
  if (command === "audit") return audit(args);
  if (command === "normalize") return normalize(args);
  if (command === "catalog") return catalog(args);
  if (command === "recipe") return recipe(args);
  if (command === "taste") return taste(args);
  if (command === "look") return look(args);
  if (command === "virtual") return virtual(args);
  if (command === "motion") return motion(args);
  throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

main(process.argv.slice(2)).catch((error) => {
  if (error?.diagnostics) printDiagnostics(error.diagnostics);
  process.stderr.write(`${error?.message ?? String(error)}\n`);
  process.exitCode = 1;
});
