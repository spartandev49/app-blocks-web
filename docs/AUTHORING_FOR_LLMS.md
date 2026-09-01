# Authoring AppBlocks with an LLM

The model's job is to select and configure semantic contracts, not to reproduce frontend implementation.

## Minimal context bundle

Provide:

1. `LLMS.txt`;
2. the user's product brief and factual content;
3. manifests for only the relevant block families;
4. diagnostics from the previous validation attempt, if any.

Do not send the renderer source or full CSS to the model unless it is modifying the compiler itself.

## Recommended system instruction

```text
You author AppBlocks Web language version 1. Output one complete .appblocks file.
Prefer the largest semantic block that preserves the requested intent. Specify
product-specific structure, content, data and meaningful exceptions. Accept
compiler defaults for responsive behavior, accessibility states and motion.
Never emit raw HTML or JavaScript. Never invent customer proof, integrations or
backend results. Query unknown contracts, validate strictly and repair every
diagnostic before returning the final source.
```

## Generation workflow

### 1. Classify each route by job

- **Persuade:** landing, pricing and launch routes.
- **Operate:** dashboard, editor, settings and admin routes.
- **Read:** documentation, guide and article routes.
- **Showcase:** portfolio, gallery and artifact routes.

This prevents a model from applying the same centered marketing template to every surface.

### 2. Retrieve the highest-level contracts

For a SaaS request, retrieve `header`, `hero`, `features`, `pricing`, `faq`, `app-shell`, `metrics`, `table`, `form` and `dialog` before retrieving generic grids or cards.

### 3. Establish shared structure

Put global metadata, header and footer under `site`. Define every page and use `layout=app` for application shells that should omit public chrome.

### 4. Write content and exceptions

The model should provide concrete headings, labels, actions and table structures. It should not specify padding, breakpoint math or hover CSS because those are compiler-owned decisions.

### 5. Validate and repair

```bash
appblocks validate generated.appblocks --strict --json
```

Feed only diagnostics and the affected source region back to the model. Nearest-block hints are designed for automatic repair.

### 6. Build and inspect

```bash
appblocks build generated.appblocks --out public
appblocks dev generated.appblocks
```

A model or human must still inspect rendered desktop and mobile output. Schema validity does not prove visual quality or product truth.

## Token discipline

Good compression comes from semantic defaults, not unreadable abbreviations.

Prefer:

```appblocks
table id=transactions label="Transactions" filter=true sortable=true
  column key=date label="Date"
  column key=merchant label="Merchant"
  column key=amount label="Amount" align=right
```

over a model-generated table component, search state, row mapper, responsive wrapper, focus styles and empty-state handler.

Do not shorten `transactions` to an opaque symbol merely to save a handful of tokens. Reliability and repairability matter more than lexical compression.

## Failure patterns

### Rebuilding compound blocks from primitives

This loses token savings and usually creates inconsistent states. Query the catalog before composing from `grid`, `card`, `text` and `button`.

### Inventing attributes

Use `appblocks catalog <block> --json`. Strict validation treats unknown attributes as errors.

### Hiding custom code in content

There is no raw HTML or script block. If the requirement is irreducibly custom, mark it as an implementation boundary instead of smuggling code through a text value.

### Claiming real integrations

Version 1 local forms and table mutations are demonstrations. Label mock state and produce a backend handoff when a real service is required.

### Treating validation as completion

Validation proves language and selected contract invariants. It does not prove factual copy, business logic, browser performance or visual quality.

## Evaluation checklist

- Does every route have one clear job and one level-1 heading?
- Did the model use the largest suitable semantic blocks?
- Are actions concrete and destinations represented as links?
- Are proof and backend statements supplied or visibly marked as demonstrations?
- Does every field have a persistent label?
- Did strict validation return no diagnostics?
- Does the build manifest show the expected routes and a useful expansion ratio?
- Was the generated result inspected at representative mobile and desktop widths?
