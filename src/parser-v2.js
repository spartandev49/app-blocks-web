import { normalizeCompactSource } from "./combinatorial-engine.js";
import { parse as parseLegacy } from "./parser.js";

export function parse(source, options) {
  return parseLegacy(normalizeCompactSource(source).source, options);
}
