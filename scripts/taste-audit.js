import { readFile } from "node:fs/promises";
import { compile, formatDiagnostics } from "../src/index.js";

const filename = new URL("../examples/taste-showcase.ab", import.meta.url);
const source = await readFile(filename, "utf8");

try {
  const result = await compile(source, {
    filename: "examples/taste-showcase.ab",
    strict: true,
    tasteStrict: true
  });
  const audit = result.taste?.audit;
  if (!audit?.passed) throw new Error("Taste showcase did not produce a passing audit.");
  if (audit.score < 92) throw new Error(`Taste showcase scored ${audit.score}; release minimum is 92.`);
  if (!result.files.has("appblocks.taste.json") || !result.files.has("appblocks.motion5.json")) {
    throw new Error("Taste build artifacts are incomplete.");
  }
  const runtime = result.files.get("appblocks.js") ?? "";
  if (/addEventListener\(\s*["']scroll["']/.test(runtime)) throw new Error("Taste runtime contains a raw scroll listener.");
  console.log(`Taste release audit passed at ${audit.score}/100 (${audit.grade}).`);
} catch (error) {
  if (error?.diagnostics?.length) console.error(formatDiagnostics(error.diagnostics, source));
  throw error;
}
