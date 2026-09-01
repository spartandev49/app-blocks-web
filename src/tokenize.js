import { AppBlocksError, diagnostic } from "./diagnostics.js";

function decodeQuoted(raw, line, column) {
  const quote = raw[0];
  if (raw.at(-1) !== quote) {
    throw new AppBlocksError("Unterminated quoted value", [
      diagnostic("Unterminated quoted value", line, column, "Close the string with the matching quote.")
    ]);
  }
  let result = "";
  for (let index = 1; index < raw.length - 1; index += 1) {
    const char = raw[index];
    if (char !== "\\") {
      result += char;
      continue;
    }
    index += 1;
    const escaped = raw[index];
    const escapes = { n: "\n", r: "\r", t: "\t", "\\": "\\", '"': '"', "'": "'" };
    result += escapes[escaped] ?? escaped;
  }
  return result;
}

export function stripComment(input) {
  let quote = "";
  let escaped = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\" && quote) {
      escaped = true;
      continue;
    }
    if ((char === '"' || char === "'") && (!quote || quote === char)) {
      quote = quote ? "" : char;
      continue;
    }
    if (char === "#" && !quote && (index === 0 || /\s/.test(input[index - 1]))) {
      return input.slice(0, index).trimEnd();
    }
  }
  return input;
}

export function tokenizeLine(input, line = 1) {
  const tokens = [];
  let start = -1;
  let quote = "";
  let escaped = false;
  let depth = 0;

  const push = (end) => {
    if (start < 0) return;
    tokens.push({ raw: input.slice(start, end), column: start + 1 });
    start = -1;
  };

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (start < 0 && !/\s/.test(char)) start = index;
    if (start < 0) continue;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\" && quote) {
      escaped = true;
      continue;
    }
    if ((char === '"' || char === "'") && (!quote || quote === char)) {
      quote = quote ? "" : char;
      continue;
    }
    if (quote) continue;
    if (char === "[" || char === "{") depth += 1;
    if (char === "]" || char === "}") depth -= 1;
    if (depth < 0) {
      throw new AppBlocksError("Unexpected closing bracket", [
        diagnostic("Unexpected closing bracket", line, index + 1)
      ]);
    }
    if (/\s/.test(char) && depth === 0) push(index);
  }
  if (quote) {
    throw new AppBlocksError("Unterminated quoted value", [
      diagnostic("Unterminated quoted value", line, Math.max(1, start + 1), "Close the string with the matching quote.")
    ]);
  }
  if (depth !== 0) {
    throw new AppBlocksError("Unterminated collection value", [
      diagnostic("Unterminated collection value", line, Math.max(1, start + 1), "Close the collection with ] or }.")
    ]);
  }
  push(input.length);
  return tokens;
}

function splitCollection(raw) {
  const values = [];
  let start = 0;
  let quote = "";
  let escaped = false;
  let depth = 0;
  for (let index = 0; index <= raw.length; index += 1) {
    const char = raw[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\" && quote) {
      escaped = true;
      continue;
    }
    if ((char === '"' || char === "'") && (!quote || quote === char)) quote = quote ? "" : char;
    if (quote) continue;
    if (char === "[" || char === "{") depth += 1;
    if (char === "]" || char === "}") depth -= 1;
    if ((char === "," && depth === 0) || index === raw.length) {
      const value = raw.slice(start, index).trim();
      if (value) values.push(value);
      start = index + 1;
    }
  }
  return values;
}

export function parseValue(raw, line = 1, column = 1) {
  const value = raw.trim();
  if (!value) return "";
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return decodeQuoted(value, line, column);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return Number(value);
  if (value.startsWith("[") && value.endsWith("]")) {
    return splitCollection(value.slice(1, -1)).map((item) => parseValue(item, line, column));
  }
  if (value.startsWith("{") && value.endsWith("}")) {
    const result = {};
    for (const entry of splitCollection(value.slice(1, -1))) {
      const separator = entry.indexOf(":");
      if (separator < 1) {
        throw new AppBlocksError("Invalid object entry", [
          diagnostic(`Invalid object entry '${entry}'`, line, column, "Use {key:value, other:value}.")
        ]);
      }
      const key = entry.slice(0, separator).trim().replace(/^['"]|['"]$/g, "");
      result[key] = parseValue(entry.slice(separator + 1), line, column + separator + 1);
    }
    return result;
  }
  return value;
}
