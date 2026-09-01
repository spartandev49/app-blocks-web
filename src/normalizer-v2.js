import { ATTRIBUTE_ALIASES, normalizeCompactSource as normalizeBlocks } from "./generation2.js";

function splitComment(value) {
  let quote = "";
  let escaped = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (escaped) { escaped = false; continue; }
    if (character === "\\" && quote) { escaped = true; continue; }
    if (quote) { if (character === quote) quote = ""; continue; }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (character === "#" && (index === 0 || /\s/.test(value[index - 1]))) {
      return { code: value.slice(0, index).trimEnd(), comment: value.slice(index) };
    }
  }
  return { code: value, comment: "" };
}

function tokenize(value) {
  const tokens = [];
  let token = "";
  let quote = "";
  let escaped = false;
  let depth = 0;
  for (const character of value.trim()) {
    if (escaped) { token += character; escaped = false; continue; }
    if (character === "\\" && quote) { token += character; escaped = true; continue; }
    if (quote) { token += character; if (character === quote) quote = ""; continue; }
    if (character === '"' || character === "'") { quote = character; token += character; continue; }
    if (["[", "{", "("].includes(character)) depth += 1;
    if (["]", "}", ")"].includes(character)) depth = Math.max(0, depth - 1);
    if (/\s/.test(character) && depth === 0) {
      if (token) tokens.push(token);
      token = "";
    } else token += character;
  }
  if (token) tokens.push(token);
  return tokens;
}

function normalizeAttributeLine(line) {
  if (!line.trim()) return { line, used: false };
  const indentation = line.match(/^\s*/)?.[0] ?? "";
  const { code, comment } = splitComment(line.slice(indentation.length));
  if (!code.trim()) return { line, used: false };
  const tokens = tokenize(code);
  if (tokens.length < 2) return { line, used: false };
  let used = false;
  const output = tokens.map((token, index) => {
    if (index === 0) return token;
    const equals = token.indexOf("=");
    if (equals <= 0) return token;
    const key = token.slice(0, equals);
    const alias = ATTRIBUTE_ALIASES[key];
    if (!alias || alias === key) return token;
    used = true;
    return `${alias}${token.slice(equals)}`;
  });
  if (!used) return { line, used: false };
  return {
    line: `${indentation}${output.join(" ")}${comment ? ` ${comment}` : ""}`,
    used: true
  };
}

export function normalizeCompactSource(source) {
  const input = String(source ?? "");
  let attributeAliases = false;
  const preprocessed = input.split(/\r?\n/).map((line) => {
    const result = normalizeAttributeLine(line);
    attributeAliases ||= result.used;
    return result.line;
  }).join("\n");
  const normalized = normalizeBlocks(preprocessed);
  return Object.freeze({
    ...normalized,
    source: normalized.source,
    used: normalized.used || attributeAliases,
    features: Object.freeze({
      ...normalized.features,
      aliases: normalized.features.aliases || attributeAliases
    })
  });
}
