# AppBlocks Web

AppBlocks Web is an LLM-native language and zero-dependency compiler for complete websites and web applications. A model writes compact, validated semantic source; AppBlocks expands it into responsive HTML, CSS and JavaScript with accessibility, interaction states, visual design and motion already implemented.

Version 0.3 adds Motion Engine 3: 1,000 deterministic motion recipes, ten coordinated profiles, continuous scroll choreography and a full button/card microinteraction vocabulary.

```ab
st "Northstar" r=r7314 fx=cinematic
  pg "/" title="Northstar"
    hr017 fx="hero sx:depth"
      ttl "Build the interface. Skip the boilerplate." lvl=1
      txt "Design, responsive behavior and motion expand from compact source."
      b203 "Start now" h="/start" hx=magnetic px=ripple
```

The compact source normalizes into canonical AppBlocks, passes the same strict validator, and compiles to ordinary browser files. The generated site runs without AppBlocks, a frontend framework or an animation dependency.

## Live proof

- [Motion Engine 3 website and application showcase](https://spartandev49.github.io/app-blocks-web/)
- [Canonical documentation showcase](https://spartandev49.github.io/app-blocks-web/docs/)

The public site is built from [`examples/motion-showcase.ab`](examples/motion-showcase.ab). It demonstrates staged hero entrances, scroll-linked depth and parallax, staggered grids, magnetic and tilt interactions, spotlights, shine treatments, ripple presses, application transitions, dialogs, tables, forms, tabs, a command palette and a Kanban workflow.

## Design address space

AppBlocks generates coordinated choices algorithmically instead of storing thousands of copied components:

| System | Choices |
| --- | ---: |
| Coordinated site recipes | 10,000 |
| Virtual component recipes | 10,000 |
| Motion recipes | 1,000 |
| Motion profiles | 10 |
| Palettes | 64 |
| Font pairings | 320 |
| Shapes | 24 |
| Surfaces and materials | 12 |
| Base motion systems | 16 |
| Density systems | 8 |
| Shadow systems | 8 |

The ten virtual component families provide 1,000 exact IDs each for buttons, headers, footers, heroes, frames, cards, sections, forms, tables and navigation. `b203` is a deterministic button treatment, `hr017` is a deterministic hero treatment and `x731` is a deterministic motion recipe.

## Motion Engine 3

Set one global profile:

```ab
st "Product" r=r7314 fx=polished
```

Profiles:

```text
off quiet polished dynamic cinematic playful editorial application commerce dramatic
```

The profile supplies role-aware defaults. Heroes receive staged entrances, sections reveal with restrained scroll behavior, collections choreograph their children, interactive controls get hover and press feedback, and application data surfaces stay fast and quiet.

Use an exact motion recipe:

```ab
cd203 fx=x731
```

Or compose only the needed axes:

```ab
sc247 sx=parallax-y en=clip-up cx=cascade du=slow ix=strong
b203 "Start" h="/start" hx=magnetic px=ripple
hr017 fx="hero sx:depth hx:spotlight"
```

Compact motion aliases:

| Alias | Meaning |
| --- | --- |
| `fx` | Profile, preset or `x000`–`x999` recipe |
| `en` | Entrance effect |
| `sx` | Scroll-linked effect |
| `hx` | Hover interaction |
| `px` | Press feedback |
| `lx` | Ambient loop |
| `cx` | Child choreography |
| `ez` | Easing |
| `du` | Duration |
| `dl` | Delay token |
| `sg` | Stagger token |
| `og` | Transform origin |
| `ix` | Intensity |
| `rp` | Repeat on viewport re-entry |

### Entrance effects

```text
fade rise fall slide-left slide-right scale-up scale-down blur flip-x
flip-y rotate clip-up clip-left clip-right wipe-up pop spring zoom bounce
```

### Scroll effects

```text
reveal parallax-y parallax-x scale rotate fade blur tilt skew clip depth
progress pin
```

Scroll-linked elements share one `requestAnimationFrame` scheduler. Translation, scale, blur, rotation and perspective are bounded by the selected intensity.

### Hover and press effects

```text
hover: lift glow shine fill underline arrow magnetic tilt spotlight
       border-draw icon-slide jelly bounce pulse soften

press: compress push depress ripple bounce rubber pulse
```

Magnetic and tilt effects are enabled only for devices with hover and a fine pointer. Ripple nodes are created safely with browser DOM APIs and remove themselves after animation.

### Ambient loops and choreography

```text
loop: float breathe pulse bob sway wiggle shimmer gradient spin glow dash
choreography: children cascade grid stack hero wave radial list
```

All loop and choreography behavior is disabled automatically under `prefers-reduced-motion: reduce`.

Read [`docs/MOTION.md`](docs/MOTION.md) for the complete reference.

## What the compiler supplies

- Responsive headers, footers, heroes, grids, sections and frames
- Buttons with complete visual, hover, focus, active, loading and disabled states
- Features, pricing, comparisons, FAQs, testimonials and calls to action
- Dashboards, metrics, charts, tables, forms, tabs, dialogs and Kanban boards
- Browser, phone, laptop, glass, gradient, grid, glow and ink surfaces
- Carousels, drawers, sheets, command palettes, file drops and animated counters
- Entrance effects, child choreography and continuous scroll transforms
- Magnetic, tilt, spotlight, shine, fill, border and ripple microinteractions
- Keyboard navigation, visible focus, semantic landmarks and safe escaping
- Source-located diagnostics and strict contract validation
- Exact generated-byte accounting and transparent token estimates

AppBlocks compresses repeatable frontend implementation. Authentication, persistence, authorization, payments, email and other external operations still require real backend adapters.

## Quick start

```bash
git clone https://github.com/spartandev49/app-blocks-web.git
cd app-blocks-web
npm test
node bin/appblocks-v2.js build examples/motion-showcase.ab --out dist --strict
node bin/appblocks.js dev examples/motion-showcase.ab
```

Open `http://127.0.0.1:4173` after starting the development server.

Installed command paths:

```bash
appblocks build product.appblocks --out public --strict
appblocks-v2 build product.ab --out public --strict
appblocks-v2 build product.ab --out public --base /product/ --strict
appblocks-v2 normalize product.ab
appblocks-v2 recipe r7314
appblocks-v2 virtual b203
appblocks-v2 motion x731
appblocks-v2 motion cinematic hero
appblocks-v2 catalog carousel --json
```

Node.js 20 or newer is required. The compiler and generated browser output have no production runtime dependencies.

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

Read [`LLMS-COMPACT.txt`](LLMS-COMPACT.txt) for the smallest model-facing contract and [`docs/GENERATION_2.md`](docs/GENERATION_2.md) for the design-engine reference.

## Generation-1 compatibility

Canonical Generation-1 source without compact or motion tokens takes the original compiler path unchanged. Existing canonical builds retain their original files, diagnostics, catalog artifact and manifest shape.

Generation 2 activates when source uses an alias, design recipe, semantic macro or virtual block ID. Motion Engine 3 activates when source uses a motion token or a virtual block that resolves to deterministic motion.

The default `CATALOG`, `getCatalog()` and `compactCatalog()` remain the canonical catalog. Use `getCatalog({ includeMacros: true })` for the extended semantic catalog. Exact design, component and motion IDs resolve on demand, so a model never needs thousands of definitions in context.

## JavaScript API

```js
import {
  compile,
  normalizeSource,
  resolveMotionRecipe,
  resolveRecipe,
  resolveVirtualBlock
} from "app-blocks-web";

const source = `st "Northstar" r=r7314 fx=cinematic
  pg "/" title="Northstar"
    hr017 fx="hero sx:depth"
      ttl "Ship a complete animated interface" lvl=1
      b203 "Start" h="/start" hx=magnetic px=ripple
`;

const normalized = normalizeSource(source);
const result = await compile(source, { filename: "product.ab", strict: true });

console.log(resolveRecipe("r7314"));
console.log(resolveVirtualBlock("hr017"));
console.log(resolveMotionRecipe("x731"));
console.log(result.capabilities.motionProfile);
```

Motion helpers are also exported from the dedicated entry point:

```js
import {
  MOTION_PROFILES,
  normalizeMotionSource,
  resolveMotion
} from "app-blocks-web/motion";
```

A motion-enabled build adds:

```text
public/
├── index.html
├── <route>/index.html
├── appblocks.css
├── appblocks.js
├── appblocks.catalog.json
├── appblocks.extended-catalog.json
├── appblocks.design.json
├── appblocks.motion.json
└── appblocks.manifest.json
```

## Verification

```bash
npm run verify
```

The release gate checks JavaScript syntax, the complete legacy, Generation-2 and Motion-3 test suites, every bundled example, generated landmarks and heading structure, duplicate IDs, skip links, executable URLs, inline handlers, dynamic code evaluation, unsafe DOM insertion, reduced-motion behavior, focus treatment, benchmarks and package contents across Node.js 20, 22 and 24 in GitHub Actions.

## Documentation

- [Motion Engine 3](docs/MOTION.md)
- [Generation 2 design engine](docs/GENERATION_2.md)
- [Generation 2 CLI](docs/GENERATION_2_CLI.md)
- [Language reference](docs/LANGUAGE.md)
- [Block-system guide](docs/BLOCKS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [LLM authoring guide](docs/AUTHORING_FOR_LLMS.md)
- [Backend handoff](BACKEND_HANDOFF.md)
- [Security policy](SECURITY.md)

## Security model

AppBlocks does not provide a raw-HTML or arbitrary-JavaScript block. User content is escaped, executable URL schemes are rejected, and generated behavior comes from allowlisted runtime modules. Motion tokens cannot contain arbitrary CSS or JavaScript. Unknown motion values remain visible to strict validation.

This reduces common model-generated vulnerabilities; it does not replace backend authorization, server-side validation, Content Security Policy or security review.

## Repository policy

The public repository is maintained by `spartandev49`. Public visibility and the MIT license permit reading, use and forks; they do not grant write access to this repository.

## License

[MIT](LICENSE)
