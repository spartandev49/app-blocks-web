import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const sources = (await readdir(new URL("../src/", import.meta.url)))
  .filter((file) => file.endsWith(".js"))
  .map((file) => `src/${file}`)
  .sort();
const files = ["bin/appblocks.js", ...sources, "scripts/benchmark.js", "scripts/static-audit.js"];

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`);
