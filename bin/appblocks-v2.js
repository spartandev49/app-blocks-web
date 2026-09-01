#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildFile,
  compile,
  formatDiagnostics,
  getBlock,
  getCatalog,
  normalizeSource,
  resolveMotion,
  resolveMotionRecipe,
  resolveRecipe,
  resolveVirtualBlock
} from "../src/index.js";

function usage() {
  return `AppBlocks Web generation 2 + motion engine 3

Usage:
  appblocks-v2 build <input.ab> [--out <directory>] [--base <path>] [--strict]
  appblocks-v2 check <input.ab> [--strict]
  appblocks-v2 normalize <input.ab>
  appblocks-v2 catalog [name] [--extended] [--json]
  appblocks-v2 recipe <r0000-r9999>
  appblocks-v2 virtual <block-id>
  appblocks-v2 motion <x000-x999|preset> [block]

Examples:
  appblocks-v2 build examples/motion-showcase.ab --out dist --strict
  appblocks-v2 build examples/motion-showcase.ab --out dist --base /product/ --strict
  appblocks-v2 motion x731
  appblocks-v2 motion cinematic hero
  appblocks-v2 catalog carousel --json
  appblocks-v2 recipe r7314
  appblocks-v2 virtual b203
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
  const formatted = formatDiagnostics(diagnostics);
  process.stderr.write(`${formatted}\n`);
}

async function build(args) {
  const [input] = positional(args);
  if (!input) throw new Error("build requires an input .ab file");
  const outDir = optionValue(args, "--out", "dist");
  const result = await buildFile(resolve(input), {
    outDir: resolve(outDir),
    base: optionValue(args, "--base"),
    strict: args.includes("--strict")
  });
  printDiagnostics(result.diagnostics);
  process.stdout.write(`Built ${result.files.size} files in ${outDir}\n`);
}

async function check(args) {
  const [input] = positional(args);
  if (!input) throw new Error("check requires an input .ab file");
  const source = await readFile(resolve(input), "utf8");
  const result = await compile(source, {
    filename: resolve(input),
    strict: args.includes("--strict")
  });
  printDiagnostics(result.diagnostics);
  process.stdout.write(result.diagnostics.length ? "Completed with diagnostics.\n" : "Valid.\n");
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

function virtual(args) {
  const [id] = positional(args);
  if (!id) throw new Error("virtual requires an ID such as b203 or hr017");
  const value = resolveVirtualBlock(id);
  if (!value) throw new Error(`Unknown virtual block: ${id}`);
  writeJson(value);
}

function motion(args) {
  const [id, block = "section"] = positional(args);
  if (!id) throw new Error("motion requires an ID such as x731 or a preset such as cinematic");
  const value = resolveMotionRecipe(id) ?? resolveMotion(id, block);
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
  if (command === "normalize") return normalize(args);
  if (command === "catalog") return catalog(args);
  if (command === "recipe") return recipe(args);
  if (command === "virtual") return virtual(args);
  if (command === "motion") return motion(args);
  throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

main(process.argv.slice(2)).catch((error) => {
  if (error?.diagnostics) printDiagnostics(error.diagnostics);
  process.stderr.write(`${error?.message ?? String(error)}\n`);
  process.exitCode = 1;
});
