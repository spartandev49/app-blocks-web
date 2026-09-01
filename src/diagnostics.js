export class AppBlocksError extends Error {
  constructor(message, diagnostics = []) {
    super(message);
    this.name = "AppBlocksError";
    this.diagnostics = diagnostics;
  }
}

export function diagnostic(message, line, column = 1, hint = "", severity = "error") {
  return { message, line, column, hint, severity };
}

export function formatDiagnostic(item, source = "") {
  const lines = source.split(/\r?\n/);
  const excerpt = lines[item.line - 1] ?? "";
  const pointer = excerpt ? `${" ".repeat(Math.max(0, item.column - 1))}^` : "";
  const hint = item.hint ? `\n  hint: ${item.hint}` : "";
  return `${item.severity}: ${item.line}:${item.column} ${item.message}` +
    (excerpt ? `\n  ${excerpt}\n  ${pointer}` : "") + hint;
}

export function formatDiagnostics(items, source = "") {
  return items.map((item) => formatDiagnostic(item, source)).join("\n\n");
}
