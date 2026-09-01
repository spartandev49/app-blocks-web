import { parse as parseLegacy } from "./parser.js";
import { normalizeSource } from "./normalizer-v3.js";

export function parse(source, options) {
  const authoredSource = String(source ?? "");
  const normalized = normalizeSource(authoredSource);
  return parseLegacy(normalized.used ? normalized.source : authoredSource, options);
}
