# AppBlocks Web language reference

This document defines source syntax and document semantics for language version 1.

## 1. Source format

An AppBlocks file is UTF-8 text, conventionally named `*.appblocks`.

- Newlines may be LF or CRLF.
- A UTF-8 byte-order mark is ignored.
- Indentation is exactly two spaces per nesting level.
- Tabs and odd indentation are errors.
- Blank lines are ignored.
- A `#` begins a comment when it occurs outside quotes and is preceded by whitespace or begins the line.

```appblocks
# This line is a comment.
site "A # remains content" theme=blueprint # This part is a comment.
```

## 2. Line grammar

```text
line       := indent name (space argument)* (space attribute)* comment?
indent     := ("  ")*
name       := lower (lower | digit | "-")*
argument   := value
attribute  := name "=" value
comment    := whitespace "#" text
```

The parser creates one node per line:

```json
{
  "name": "button",
  "args": ["Start building"],
  "attrs": { "href": "/start", "variant": "solid" },
  "children": [],
  "loc": { "line": 8, "column": 5, "indent": 4 }
}
```

## 3. Values

### Strings

Bare values end at whitespace:

```appblocks
site Atlas theme=signal
```

Use single or double quotes for spaces, `#`, `=` or punctuation that should remain unambiguous:

```appblocks
title "Know where every dollar goes"
text 'The value is key=value # retained.'
```

Quoted strings support `\n`, `\r`, `\t`, escaped quotes and escaped backslashes.

### Numbers, booleans and null

```appblocks
metric value=42 progress=72.5
header sticky=true theme-toggle=false
item value=null
```

### Arrays

```appblocks
field label="Role" type=select options=[Owner,Editor,"Read only"]
```

Arrays may contain nested values and quoted commas.

### Objects

```appblocks
section data={mode:compact,limit:20,enabled:true}
```

Objects are parsed into the canonical AST. Individual contracts currently accept objects only where documented by their manifest.

## 4. Document structure

A valid document contains exactly one `site` and at least one `page`:

```appblocks
site "Project" theme=blueprint lang=en base=/
  meta description="Project description"
  header logo=Project
  footer logo=Project
  page "/" title="Home"
    hero
      title "Home" level=1
```

`header` and `footer` nodes directly under `site` become shared chrome. A page may replace either with a page-local declaration. `layout=app` and `layout=isolated` suppress shared chrome.

## 5. Routes and base paths

Every page's first positional argument is its route and must begin with `/`.

```appblocks
page "/" title="Home"
page "/pricing/" title="Pricing"
page "/app/settings/" title="Settings" layout=app
```

Routes compile to:

```text
/                 → index.html
/pricing/         → pricing/index.html
/app/settings/    → app/settings/index.html
```

`base` prefixes root-relative assets and internal links for subpath hosting:

```appblocks
site "Project" base=/project/
```

The CLI `--base` option overrides the source value.

Set `origin` to an absolute site origin to emit absolute canonical and Open Graph URLs. `accent` accepts a six-digit hex color, and `motion=false` disables authored motion:

```appblocks
site "Project" base=/project/ origin=https://example.com accent="#154de7" motion=false
```

## 6. Blocks, variants and children

A block contract defines:

- its stable name;
- family and purpose;
- supported attributes;
- allowed or expected child blocks;
- named visual or structural variants.

Inspect one contract:

```bash
node bin/appblocks.js catalog hero --json
```

Search by family or purpose:

```bash
node bin/appblocks.js catalog application --json
```

The catalog is the source of truth. A model should query it rather than inventing attributes.

## 7. Semantic conventions

- `title` with `level=1` is the page heading. Use exactly one per page.
- `heading` defaults to level 3 and accepts levels 2–6.
- `link` always represents navigation.
- `button` represents an action unless it has `href`, in which case it compiles to a CTA link.
- `field` requires a visible `label`.
- `image` requires `alt`; use `alt=""` for a decorative image.
- `dialog` uses the native dialog element, labels itself and returns focus to its trigger.
- `table` declares columns separately from row cells so alignment and narrow-screen behavior remain deterministic.

## 8. Strict validation

Unknown blocks, invalid child shapes, unsafe URLs, missing labels, invalid IDs, duplicate routes and missing page headings are errors. Unknown attributes, variants, icons and themes are warnings by default and errors under `--strict`.

```bash
node bin/appblocks.js validate site.appblocks --strict
```

Diagnostics include line, column, source excerpt and a recovery hint:

```text
error: 8:5 Unknown block 'featre'
  hint: Did you mean 'feature'?
```

## 9. Security semantics

Authored text is escaped before HTML rendering. AppBlocks rejects `javascript:`, `vbscript:` and `data:` schemes in URL-bearing attributes. Version 1 has no raw-HTML or arbitrary-script node.

The compiler does not validate remote services, backend policies or conventional code added after compilation.

## 10. Determinism

Given the same compiler version, source and options, AppBlocks produces the same semantic output. Timestamps are not included in build manifests. The footer year is derived at compilation time and is therefore the only time-sensitive generated text in the default renderer.

## 11. Compatibility

Language additions should be backward compatible within a major version. Removing a block, changing an existing attribute's meaning or changing canonical AST shape requires a major release.
