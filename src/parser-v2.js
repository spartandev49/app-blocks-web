import { parse as parseLegacy } from "./parser.js";
import { normalizeCompactSource } from "./normalizer-v2.js";

export function parse(source, options) {
  const authoredSource = String(source ?? "");
  const normalized = normalizeCompactSource(authoredSource);
  return parseLegacy(normalized.used ? normalized.source : authoredSource, options);
}
