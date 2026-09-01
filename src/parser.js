import { AppBlocksError, diagnostic } from "./diagnostics.js";
import { parseValue, stripComment, tokenizeLine } from "./tokenize.js";

const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

function parseNode(content, line, indent) {
  const tokens = tokenizeLine(content, line);
  if (tokens.length === 0) return null;
  const name = tokens[0].raw;
  if (!NAME_PATTERN.test(name)) {
    throw new AppBlocksError("Invalid block name", [
      diagnostic(`Invalid block name '${name}'`, line, indent + tokens[0].column, "Use lowercase letters, numbers and hyphens.")
    ]);
  }
  const node = {
    name,
    args: [],
    attrs: {},
    children: [],
    loc: { line, column: indent + 1, indent }
  };
  for (const token of tokens.slice(1)) {
    const assignment = /^([a-z][a-z0-9-]*)=(.*)$/s.exec(token.raw);
    if (assignment) {
      const key = assignment[1];
      const separator = key.length;
      if (Object.hasOwn(node.attrs, key)) {
        throw new AppBlocksError("Duplicate attribute", [
          diagnostic(`Duplicate attribute '${key}'`, line, indent + token.column, "Remove one value.")
        ]);
      }
      node.attrs[key] = parseValue(assignment[2], line, indent + token.column + separator + 1);
    } else {
      node.args.push(parseValue(token.raw, line, indent + token.column));
    }
  }
  return node;
}

export function parse(source, options = {}) {
  const filename = options.filename ?? "<input>";
  const root = {
    name: "document",
    args: [],
    attrs: {},
    children: [],
    loc: { line: 0, column: 0, indent: -2 },
    filename
  };
  const stack = [root];
  const diagnostics = [];
  const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const raw = lines[index];
    if (/^\s*$/.test(raw)) continue;
    if (raw.includes("\t")) {
      diagnostics.push(diagnostic("Tabs are not allowed for indentation", lineNumber, raw.indexOf("\t") + 1, "Use two spaces per nesting level."));
      continue;
    }
    const indent = raw.match(/^ */)[0].length;
    if (indent % 2 !== 0) {
      diagnostics.push(diagnostic("Indentation must use multiples of two spaces", lineNumber, 1));
      continue;
    }
    const content = stripComment(raw.slice(indent)).trimEnd();
    if (!content) continue;
    let node;
    try {
      node = parseNode(content, lineNumber, indent);
    } catch (error) {
      if (error instanceof AppBlocksError) diagnostics.push(...error.diagnostics);
      else throw error;
      continue;
    }
    while (stack.length > 1 && stack.at(-1).loc.indent >= indent) stack.pop();
    const parent = stack.at(-1);
    if (indent !== parent.loc.indent + 2) {
      diagnostics.push(diagnostic(
        `Unexpected indentation for '${node.name}'`,
        lineNumber,
        1,
        `Expected ${parent.loc.indent + 2} spaces under '${parent.name}'.`
      ));
      continue;
    }
    parent.children.push(node);
    stack.push(node);
  }

  if (diagnostics.some((item) => item.severity === "error")) {
    throw new AppBlocksError(`Could not parse ${filename}`, diagnostics);
  }
  return root;
}
