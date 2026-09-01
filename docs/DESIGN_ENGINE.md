# AppBlocks Web combinatorial design engine

AppBlocks Web 0.2 adds a compact, deterministic design and component layer on top of the original semantic compiler. The goal is breadth without forcing a model to emit, retrieve or reason over thousands of duplicated implementations.

## Capability surface

The engine exposes:

| Registry | Count | Compact selector |
| --- | ---: | --- |
| Complete design recipes | 10,000 | `r=d0000` through `r=d9999` |
| Virtual semantic blocks | 20,000 | 20 families with 1,000 IDs each |
| Curated palettes | 32 | recipe-selected or `pal=<name>` |
| Font pairings | 30 | recipe-selected or `ff=<name>` |
| Visual systems | 18 | recipe-selected or `sy=<name>` |
| Shape systems | 10 | recipe-selected or `sh=<name>` |
| Surface systems | 8 | recipe-selected or `sf=<name>` |
| Motion systems | 12 | recipe-selected |
| Density systems | 8 | recipe-selected or `den=<name>` |
| Shadow systems | 8 | recipe-selected or `dep=<name>` |

A recipe is not a copied stylesheet. It is a stable coordinate across these design axes. The compiler resolves only the recipes used by a project and emits their CSS variables. This keeps the model vocabulary small and the generated package deterministic.

```appblocks
st "Northstar" r=d6421
  pg "/" title="Northstar"
    h731
      ti "Small source. Serious interface." level=1
      tx "Responsive layout, type, color, shape and motion come from one recipe."
      b286 "Open workspace" hr=/app/
```

The source above uses aliases, but full names remain valid. Existing 0.1 AppBlocks projects compile without conversion.

## How recipes work

Every `dNNNN` value resolves to one unique palette/font/system coordinate plus shape, surface, motion, density, shadow, component-style and layout axes. Resolution is algorithmic and versioned. The repository does not contain 10,000 near-identical CSS files.

Use a recipe at the site level:

```appblocks
site "Product" recipe=d0421
```

Or use the compact attribute:

```appblocks
st "Product" r=d0421
```

A recipe coordinates the whole project. A project may still set meaningful exceptions on individual blocks.

## Compact block aliases

Common structural and content aliases reduce repeated model output:

| Compact | Canonical | Compact | Canonical |
| --- | --- | --- | --- |
| `st` | `site` | `pg` | `page` |
| `hd` | `header` | `ft` | `footer` |
| `h` | `hero` | `sc` | `section` |
| `ti` | `title` | `tx` | `text` |
| `b` / `bt` | `button` | `l` | `link` |
| `gr` | `grid` | `pn` | `panel` |
| `fs` / `f` | `features` / `feature` | `ss` / `s` | `stats` / `stat` |
| `ap` | `app-shell` | `tl` | `toolbar` |
| `tb` | `table` | `fm` / `fd` | `form` / `field` |

Common attribute aliases include `r=recipe`, `v=variant`, `c=class`, `hr=href`, `ico=icon`, `a=align`, `g=gap`, `w=width`, `rv=reveal`, `req=required`, `sel=selected`, `cur=current`, `act=action` and `dlg=dialog`.

Aliases normalize before the original parser and strict validator run. Diagnostics retain the original line structure.

## Virtual block families

Virtual IDs combine a canonical semantic block with deterministic style, shape, depth, motion, density and layout axes. Each family contains IDs `000` through `999`.

| Family | Canonical output | Example |
| --- | --- | --- |
| `hNNN` | hero | `h731` |
| `bNNN` | button | `b286 "Start" hr=/start` |
| `hdNNN` | header | `hd107 logo=Northstar` |
| `ftNNN` | footer | `ft214 logo=Northstar` |
| `frNNN` | frame/panel | `fr088` |
| `sNNN` | section | `s402` |
| `cNNN` | card | `c515` |
| `gNNN` | grid | `g120` |
| `fNNN` | feature | `f091 ico=layers` |
| `pNNN` | panel | `p653` |
| `nvNNN` | navigation | `nv014` |
| `fmNNN` | form | `fm208` |
| `tbNNN` | table | `tb920` |
| `dgNNN` | dialog | `dg311` |
| `ctNNN` | call to action | `ct355` |
| `prNNN` | pricing group | `pr606` |
| `tsNNN` | testimonials | `ts411` |
| `chNNN` | chart | `ch722` |
| `mtNNN` | metric | `mt241` |
| `shNNN` | application shell | `sh391` |

A virtual ID never changes the semantic role of the output. `b286` is still a real link or button with accessible focus and disabled states; the ID selects its implementation recipe.

## Advanced semantic blocks

The compiler also recognizes higher-level interaction and presentation names, normalizes them to safe canonical markup and attaches allowlisted runtime behavior. Important groups include:

- Frames: `frame`, `browser-frame`, `device-frame`, `window-frame`, `glass-panel`, `floating-panel`
- Navigation: `drawer`, `dropdown`, `popover`, `command-palette`, `context-menu`, `nav-dock`, `mega-menu`, `pagination`
- Motion and media: `carousel`, `slide`, `marquee`, `ticker`, `spotlight`, `orbit`, `particles`, `constellation`
- Controls: `range`, `file-drop`, `switch`, `rating`, `segmented`, `counter`, `gauge`, `progress`
- Application patterns: `data-grid`, `calendar`, `chat`, `message`, `tree`, `wizard`, `split-pane`, `notification-center`
- Marketing patterns: `logo-cloud`, `social-proof`, `feature-wall`, `hero-canvas`, `product-card`, `comparison-card`

Generated behavior does not use `eval`, `new Function`, inline event handlers or user-authored JavaScript. It covers keyboard operation, Escape handling, focus return, focus containment, live status, paused carousel autoplay, drag-and-drop affordances, count-up animation, scroll progress, reveal, parallax, magnetic buttons and reduced-motion fallbacks.

## Model retrieval strategy

Do not put the entire expanded catalog into every prompt. Give a model `LLMS-COMPACT.txt`, then retrieve only one of:

```bash
appblocks catalog hero --json
appblocks catalog application --json
appblocks catalog carousel --json
```

The model should normally choose:

1. One site recipe.
2. The largest semantic blocks matching the requested product.
3. Virtual IDs for visual differentiation.
4. Explicit content, routes, data contracts and meaningful exceptions.

The compiler should continue to own responsive breakpoints, focus states, native semantics, safe escaping and routine interaction behavior.

## JavaScript API

```js
import {
  DESIGN_COUNTS,
  listRecipes,
  normalizeSource,
  resolveRecipe
} from "app-blocks-web";

console.log(DESIGN_COUNTS.recipes); // 10000
console.log(resolveRecipe("d6421"));
console.log(listRecipes({ start: 6400, limit: 25 }));
console.log(normalizeSource('st "Demo" r=d6421'));
```

Recipe listing is paged and capped. `resolveRecipe` is the intended zero-overhead lookup path.

## Verification contract

The repository verifies that:

- all 10,000 recipes have unique signatures;
- every palette, font and visual-system axis is exercised;
- compact aliases normalize to canonical source;
- virtual and advanced blocks pass strict validation after normalization;
- existing 0.1 examples still compile;
- generated manifests report exact byte size after the design layer is added;
- the generated runtime parses without dynamic-code evaluation;
- generated output retains landmarks, skip links, focus treatment and reduced-motion handling.

The complete compact example is [`examples/combinatorial.appblocks`](../examples/combinatorial.appblocks).
