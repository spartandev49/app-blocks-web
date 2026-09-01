import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const roots = [
  ["bin", new URL("../bin/", import.meta.url)],
  ["src", new URL("../src/", import.meta.url)],
  ["scripts", new URL("../scripts/", import.meta.url)]
];

const files = [];
for (const [name, directory] of roots) {
  const entries = await readdir(directory);
  for (const entry of entries) {
    if (!/\.(?:js|mjs|cjs)$/.test(entry)) continue;
    files.push(`${name}/${entry}`);
  }
}
files.sort();

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`);
