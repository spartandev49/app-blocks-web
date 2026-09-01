# AppBlocks Web

AppBlocks Web is an LLM-native language and zero-dependency compiler for complete websites and web applications. A model writes compact, validated semantic source; AppBlocks expands it into responsive HTML, CSS and JavaScript with accessibility, interaction states and design behavior already implemented.

Version 0.2 adds a deterministic combinatorial design engine. It gives large models a much smaller output target and gives smaller models enough tested structure to produce credible sites without repeatedly inventing frontend plumbing.

```ab
st "Northstar" r=r7314
  pg "/" title="Northstar"
    hr017
      eye "Operations platform"
      ttl "Operate without the busywork" lvl=1
      txt "A complete responsive interface from a compact source file."
      b203 "Start now" h="/start"
```

The compact source above normalizes into canonical AppBlocks, passes the same strict validator, and compiles to ordinary browser files. The generated site runs without AppBlocks and without a frontend framework.

## Live proof

- [Generation 2 website and application showcase](https://spartandev49.github.io/app-blocks-web/)
- [Canonical documentation showcase](https://spartandev49.github.io/app-blocks-web/docs/)

The public Generation 2 site is built from [`examples/generation2-showcase.ab`](examples/generation2-showcase.ab). It includes coordinated typography and color, generated shape and material treatments, reveal/stagger/parallax motion, a controlled carousel, a multi-view application workspace, sortable and filterable records, validated forms, dialogs, a command palette and a Kanban workflow.

## Addressable design system

AppBlocks generates choices algorithmically instead of storing thousands of copied components:

| System | Choices |
| --- | ---: |
| Coordinated site recipes | 10,000 |
| Virtual component recipes | 10,000 |
| Palettes | 64 |
| Font pairings | 320 |
| Shapes | 24 |
| Surfaces and materials | 12 |
| Motion systems | 16 |
| Density systems | 8 |
| Shadow systems | 8 |

The 10 virtual families provide 1,000 exact IDs each for buttons, headers, footers, heroes, frames, cards, sections, forms, tables and navigation. For example, `b203` is a deterministic button treatment and `hr017` is a deterministic hero treatment.

Font recipes use local and system stacks by default, so compiled sites do not silently contact a third-party font provider. Licensed or self-hosted families can be selected with `font-display`, `font-body` and `font-mono`.

## What the compiler supplies

- Responsive headers, footers, heroes, grids, sections and frames
- Buttons with complete states and deterministic visual recipes
- Features, pricing, comparisons, FAQs, testimonials and calls to action
- Dashboards, metrics, charts, tables, forms, tabs, dialogs and Kanban boards
- Browser, phone, laptop, glass, gradient and raised surface patterns
- Carousels, drawers, sheets, command palettes, file drops and animated counters
- Reveal, stagger and parallax motion with reduced-motion handling
- Keyboard navigation, visible focus, semantic landmarks and safe escaping
- Source-located diagnostics and strict contract validation
- Exact generated-byte accounting and transparent token estimates

AppBlocks compresses repeatable frontend implementation. Authentication, persistence, authorization, payments, email and other external operations still require real backend adapters.

## Quick start

```bash
git clone https://github.com/spartandev49/app-blocks-web.git
cd app-blocks-web
npm test
node bin/appblocks-v2.js build examples/generation2-showcase.ab --out dist --strict
node bin/appblocks.js dev examples/generation2-showcase.ab
```

Open `http://127.0.0.1:4173` after starting the development server.

When installed as a package, both command paths are available:

```bash
appblocks build product.appblocks --out public --strict
appblocks-v2 build product.ab --out public --strict
appblocks-v2 build product.ab --out public --base /product/ --strict
appblocks-v2 normalize product.ab
appblocks-v2 recipe r7314
appblocks-v2 virtual b203
appblocks-v2 catalog carousel --json
```

Node.js 20 or newer is required. The compiler and generated browser output have no runtime dependencies.

## Compact authoring

Common block aliases:

```text
st=site pg=page sec=section gr=grid stk=stack hd=header nav=nav
ln=link bt=button ttl=title txt=text img=image feats=features feat=feature
price=pricing fq=faq call=cta app=app-shell side=sidebar tool=toolbar
met=metric tbl=table frm=form fld=field pnl=panel dlg=dialog crd=card
```

Common attribute aliases:

```text
v=variant h=href i=icon cl=class l=label t=tone rv=reveal
w=width a=align n=name val=value req=required ph=placeholder
sel=selected cur=current stk=sticky act=action typ=type lvl=level sz=size
```

Semantic macros include `browser-frame`, `phone-frame`, `glass-card`, `carousel`, `drawer`, `command-palette`, `file-drop`, `data-grid`, `dashboard-shell`, `kanban-board`, `product-grid`, `checkout-form`, `feature-grid`, `pricing-grid`, `hero-split`, `terminal-window` and many more.

Read [`LLMS-COMPACT.txt`](LLMS-COMPACT.txt) for the smallest model-facing contract and [`docs/GENERATION_2.md`](docs/GENERATION_2.md) for the complete design-engine reference.

## Generation-1 compatibility

Canonical generation-1 source takes the original compiler path unchanged. Generation 2 activates only when source uses an alias, recipe, semantic macro or virtual block ID. Existing canonical builds retain their original files, diagnostics, catalog artifact and manifest shape.

The default `CATALOG`, `getCatalog()` and `compactCatalog()` remain the canonical catalog. Use `getCatalog({ includeMacros: true })` for the extended semantic catalog. Exact recipe and virtual IDs resolve on demand, so a model does not need thousands of definitions in context.

## JavaScript API

```js
import {
  compile,
  normalizeCompactSource,
  resolveRecipe,
  resolveVirtualBlock
} from "app-blocks-web";

const source = `st "Northstar" r=r7314
  pg "/" title="Northstar"
    hr017
      ttl "Ship a complete interface" lvl=1
`;

const normalized = normalizeCompactSource(source);
const result = await compile(source, { filename: "product.ab", strict: true });

console.log(resolveRecipe("r7314"));
console.log(resolveVirtualBlock("hr017"));
console.log(result.manifest.output.expansionRatio);
```

A Generation 2 build adds:

```text
public/
├── index.html
├── <route>/index.html
├── appblocks.css
├── appblocks.js
├── appblocks.catalog.json
├── appblocks.extended-catalog.json
├── appblocks.design.json
└── appblocks.manifest.json
```

## Verification

```bash
npm run verify
```

The release gate checks all JavaScript syntax, the complete legacy and Generation 2 test suites, every bundled example, generated landmarks and heading structure, duplicate IDs, skip links, executable URLs, inline handlers, dynamic code evaluation, unsafe DOM insertion, reduced-motion behavior, focus treatment, benchmarks and package contents across Node.js 20, 22 and 24 in GitHub Actions.

## Documentation

- [Generation 2 design engine](docs/GENERATION_2.md)
- [Generation 2 CLI](docs/GENERATION_2_CLI.md)
- [Language reference](docs/LANGUAGE.md)
- [Block-system guide](docs/BLOCKS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [LLM authoring guide](docs/AUTHORING_FOR_LLMS.md)
- [Backend handoff](BACKEND_HANDOFF.md)
- [Security policy](SECURITY.md)

## Security model

AppBlocks does not provide a raw-HTML or arbitrary-JavaScript block. User content is escaped, executable URL schemes are rejected and generated behavior comes from an allowlisted runtime. This reduces common model-generated vulnerabilities; it does not replace backend authorization, server-side validation, Content Security Policy or security review.

## Repository policy

The public repository is maintained by `spartandev49`. Public visibility and the MIT license permit reading, use and forks; they do not grant write access to this repository.

## License

[MIT](LICENSE)
