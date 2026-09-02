# AppBlocks Web

AppBlocks Web is an LLM-native language and zero-dependency compiler for complete websites and web applications. A model writes compact, validated semantic source; AppBlocks expands it into responsive HTML, CSS and JavaScript with accessibility, interaction states, visual design and motion already implemented.

Version 0.4 adds **Taste Engine 5**: deterministic art direction, ten million coordinated visual DNAs, one million element looks, 100,000 Motion 5 recipes, role-aware styling for every canonical block, and a strict anti-slop quality gate informed by Leonxlnx's MIT-licensed Taste Skill.

```ab
st "Northstar" r=r7314 ts=t4839201 pk=saas gn=neo-industrial dv=8 mi=7 vd=4
  pg "/" title="Northstar"
    hr017 tl=artifact-first tr=focal te=cinematic tsc=depth tc=hero
      ttl "Build software that looks deliberately made." lvl=1 tty=display
      txt "Compact source expands into a responsive, art-directed interface."
      b203 "Inspect product" h="/product/" th=magnetic tp=ripple
      img src="/assets/product.webp" alt="Northstar product interface" width=1400 height=1000
```

The source normalizes into canonical AppBlocks, passes the same strict validator, and compiles to ordinary browser files. Generated sites run without AppBlocks, a frontend framework, or an animation dependency.

## Live proof

- [Taste Engine 5 website and application showcase](https://spartandev49.github.io/app-blocks-web/)
- [Motion Engine 3 showcase](https://spartandev49.github.io/app-blocks-web/motion/)
- [Generation 2 showcase](https://spartandev49.github.io/app-blocks-web/v2/)
- [Canonical documentation showcase](https://spartandev49.github.io/app-blocks-web/docs/)

The public Taste site is built from [`examples/taste-showcase.ab`](examples/taste-showcase.ab). It contains a three-route product site, visual specimen, and functional application workspace. It demonstrates art-directed typography, real image assets, differentiated surfaces, responsive structures, forms, tables, tabs, dialogs, application state, and role-aware motion.

## Why Taste Engine exists

Large models can produce a lot of frontend code, but they repeatedly converge on the same statistical defaults: a centered hero, three equal cards, generic glass panels, purple-blue gradients, repeated eyebrows, fake screenshots, and motion added without purpose. Smaller models often do worse because they lack enough output budget to implement a coherent design system and all required states.

Taste Engine moves those repeatable decisions into the compiler. The model selects a stable visual DNA, three design dials, and a few meaningful exceptions. The compiler supplies coordinated typography, palette, geometry, surfaces, section rhythm, component posture, responsive behavior, interaction states, and motion.

## Address spaces

AppBlocks resolves choices algorithmically instead of storing millions of copied templates:

| System | Stable addresses |
| --- | ---: |
| Coordinated Taste DNAs | 10,000,000 |
| Element looks | 1,000,000 |
| Motion 5 recipes | 100,000 |
| Generation 2 site recipes | 10,000 |
| Generation 2 virtual components | 10,000 |
| Motion 3 recipes | 1,000 |
| Taste page macrostructures | 20 |
| Taste hero architectures | 20 |
| Taste navigation architectures | 12 |
| Taste footer architectures | 12 |
| Taste typography systems | 32 |
| Taste palettes | 48 |
| Taste surface languages | 16 |

`t4839201` is one coordinated Taste DNA. `e042731` is one deterministic element look. `y73142` is one Motion 5 recipe. These IDs are compact model-facing addresses, not filenames or duplicated component implementations.

## Taste controls

A site normally needs one DNA and three dials:

```ab
st "Product" ts=t4839201 pk=saas gn=neo-industrial dv=8 mi=7 vd=4
```

| Token | Meaning |
| --- | --- |
| `ts` | Taste DNA, `t0000000` through `t9999999` |
| `pk` | Page kind such as `saas`, `commerce`, `portfolio`, or `application` |
| `gn` | Visual genre such as `neo-industrial`, `editorial`, `quiet-luxury`, or `technical` |
| `dv` | Design variance, 1 through 10 |
| `mi` | Motion intensity, 1 through 10 |
| `vd` | Visual density, 1 through 10 |

Local tokens create deliberate exceptions without abandoning the shared system:

```ab
sec tl=sticky-story tr=narrative
pnl tl=artifact-stage tsf=blueprint tr=evidence
crd tl=offset tsf=canvas tr=artifact
ttl "The argument" tty=display tr=focal
b203 "Open workspace" h="/workspace/" th=magnetic tp=ripple
```

Common local Taste tokens:

| Token | Meaning |
| --- | --- |
| `tl` | Block layout architecture |
| `tty` | Typography voice |
| `tsf` | Surface language |
| `tr` | Semantic visual role |
| `el` | Exact element-look address |
| `te` | Entrance motion |
| `tsc` | Scroll-linked motion |
| `th` | Hover behavior |
| `tp` | Press feedback |
| `tch` | Child choreography |

All values are finite and allowlisted. Unknown values remain visible and fail strict validation rather than becoming arbitrary CSS or JavaScript.

## Role-aware components

Taste Engine applies visual direction across the complete canonical catalog, including navigation, marketing, reading, commerce, form, data, and application blocks. Components are assigned roles such as:

```text
focal supporting quiet utility evidence navigation action artifact data narrative status
```

A CTA, evidence panel, photograph, table, and navigation item therefore receive different posture and motion even when they share the same global DNA.

## Motion Engine 5

Taste builds use role-aware Motion Engine 5. The global `mi` dial scales the amount and amplitude of motion; explicit tokens override only the axes that matter.

```ab
sec te=rise tsc=word-reveal tch=editorial
img te=image-reveal tsc=image-scale th=image-zoom
b203 "Continue" h="/next/" th=magnetic tp=ripple
```

Motion 5 includes bounded entrance, scroll, hover, press, loop, and choreography vocabularies. Continuous effects share one animation-frame scheduler. Entrance eligibility uses `IntersectionObserver`; native view timelines are used where supported. Reduced-motion preferences disable entrance transforms, scroll transforms, loops, and pointer physics while keeping content visible.

The generated Taste runtime does not use raw authored scripts, dynamic code evaluation, unsafe HTML insertion, or one scroll listener per element.

## Strict anti-slop gate

```bash
appblocks-v2 audit site.ab --strict
appblocks-v2 check site.ab --strict --taste-strict
appblocks-v2 build site.ab --out public --strict --taste-strict
```

The audit starts at 100 and reports source-located deductions for common failures, including:

- Missing art direction or weak structural variety
- Generic centered high-variance heroes
- Equal three-column feature rows
- Repeated eyebrows and repeated section architectures
- Fake browser, terminal, phone, or product chrome
- Missing real visual assets
- Excessive marquees, pills, glass, or decorative metadata
- Generic copy and repeated CTA intent
- Long hero content that cannot fit the initial viewport
- High claimed motion without meaningful motion intent

The strict minimum is 88. A passing score is necessary but does not replace rendered desktop, mobile, light-mode, dark-mode, keyboard, and reduced-motion inspection.

Taste builds emit:

```text
appblocks.taste.json
appblocks.motion5.json
```

The manifests record the resolved DNA, dials, structures, typography, palette, geometry, surfaces, actually used effects, scheduler strategy, accessibility behavior, score, and findings.

## Generation 2 and Motion Engine 3

The earlier compact design and motion systems remain available for compatibility.

```ab
st "Product" r=r7314 fx=cinematic
  pg "/" title="Product"
    hr017 fx="hero sx:depth"
      ttl "Build the interface. Skip the boilerplate." lvl=1
      b203 "Start now" h="/start" hx=magnetic px=ripple
```

Generation 2 provides 10,000 coordinated site recipes and 10,000 virtual component IDs across buttons, headers, footers, heroes, frames, cards, sections, forms, tables, and navigation. Motion Engine 3 provides 1,000 deterministic recipes and the original compact motion vocabulary.

## Quick start

```bash
git clone https://github.com/spartandev49/app-blocks-web.git
cd app-blocks-web
npm test
node bin/appblocks-v2.js build examples/taste-showcase.ab --out dist --strict --taste-strict
node bin/appblocks.js dev examples/taste-showcase.ab
```

Open `http://127.0.0.1:4173` after starting the development server. Node.js 20 or newer is required. The compiler and generated browser output have no production runtime dependencies.

Installed command paths:

```bash
appblocks build product.appblocks --out public --strict
appblocks-v2 build product.ab --out public --strict --taste-strict
appblocks-v2 check product.ab --strict --taste-strict
appblocks-v2 audit product.ab --strict
appblocks-v2 normalize product.ab
appblocks-v2 taste t4839201
appblocks-v2 look e042731
appblocks-v2 motion5 y73142
appblocks-v2 recipe r7314
appblocks-v2 virtual b203
appblocks-v2 motion x731
appblocks-v2 catalog carousel --json
```

## Compact authoring

Common block aliases:

```text
st=site pg=page sec=section gr=grid stk=stack hd=header nav=nav
ln=link bt=button ttl=title txt=text img=image feats=features feat=feature
price=pricing fq=faq call=cta app=app-shell side=sidebar tool=toolbar
met=metric tbl=table frm=form fld=field pnl=panel dlg=dialog crd=card
```

Read [`LLMS-TASTE.txt`](LLMS-TASTE.txt) for the Taste-specific model contract, [`LLMS-COMPACT.txt`](LLMS-COMPACT.txt) for the compact syntax, and [`docs/AUTHORING_FOR_LLMS.md`](docs/AUTHORING_FOR_LLMS.md) for the generation workflow.

## Compatibility

Canonical Generation-1 source without compact, design, motion, or Taste tokens takes the original compiler path unchanged. Existing Generation-2 and Motion-3 source continues to use its previous path. Taste Engine 5 activates only when the site or a block uses a Taste token.

Authentication, persistence, authorization, payments, email, and other external operations still require real backend adapters. AppBlocks does not simulate production integrations.

## JavaScript API

```js
import {
  compile,
  normalizeSource,
  resolveElementLook,
  resolveMotion5Recipe,
  resolveTasteDNA
} from "app-blocks-web";

const dna = resolveTasteDNA("t4839201");
const look = resolveElementLook("e042731");
const motion = resolveMotion5Recipe("y73142");

const source = `st "Northstar" ts=t4839201 pk=saas gn=neo-industrial dv=8 mi=7 vd=4
  pg "/" title="Northstar"
    hr017 tr=focal te=cinematic
      ttl "Build software that looks deliberately made." lvl=1 tty=display
      b203 "Inspect product" h="/product/" th=magnetic tp=ripple
      img src="/assets/product.webp" alt="Northstar interface" width=1400 height=1000
`;

const normalized = normalizeSource(source);
const result = await compile(source, { filename: "product.ab", strict: true, tasteStrict: true });

console.log(dna.id, look.id, motion.id);
console.log(result.capabilities.tasteEngine);
```

Dedicated entry points are also available:

```js
import { resolveTasteDNA, auditTasteSource } from "app-blocks-web/taste";
import { resolveMotion5Recipe } from "app-blocks-web/motion5";
```

## Verification

```bash
npm run verify
npm pack --dry-run
```

The release gate runs syntax checks, 72 unit and integration tests, every bundled example, strict Generation-1/2/3/Taste builds, generated-output security and accessibility audits, the Taste quality gate, deterministic address checks, reduced-motion checks, benchmarks, and package inspection across Node.js 20, 22, and 24 in GitHub Actions.

## Documentation

- [Taste Engine 5](docs/TASTE.md)
- [Taste Engine architecture](docs/TASTE_ENGINE.md)
- [Motion Engine 3](docs/MOTION.md)
- [Generation 2 design engine](docs/GENERATION_2.md)
- [Language reference](docs/LANGUAGE.md)
- [Block-system guide](docs/BLOCKS.md)
- [LLM authoring guide](docs/AUTHORING_FOR_LLMS.md)
- [Backend handoff](BACKEND_HANDOFF.md)
- [Security policy](SECURITY.md)

## Attribution

Taste Engine 5 is an independent implementation informed by Leonxlnx's MIT-licensed Taste Skill at pinned revision `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`. AppBlocks does not copy Taste Blocks' React component registry. Exact attribution and license terms are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## Security model

AppBlocks does not provide a raw-HTML or arbitrary-JavaScript block. User content is escaped, executable URL schemes are rejected, and generated behavior comes from allowlisted runtime modules. Design and motion tokens cannot contain arbitrary CSS or JavaScript. Unknown values remain visible to strict validation.

This reduces common model-generated vulnerabilities; it does not replace backend authorization, server-side validation, Content Security Policy, dependency review, or security testing.

## Repository policy

The public repository is maintained by `spartandev49`. Public visibility and the MIT license permit reading, use, and forks; they do not grant write access to this repository.

## License

[MIT](LICENSE)
