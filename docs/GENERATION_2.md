# AppBlocks Web generation 2

Generation 2 adds an optional compact layer in front of the existing parser, validator and renderer. It is built for model-written sites and applications: a model chooses short deterministic identifiers, while the compiler expands them into the established canonical block contracts before strict validation.

Canonical generation-1 source still takes the original compiler path unchanged. The larger layer activates only when source uses an alias, design recipe, semantic macro or virtual block ID.

## Addressable design space

The implementation generates choices rather than storing thousands of copied files:

- `r0000`–`r9999`: 10,000 coordinated site recipes.
- `b000`–`b999`: 1,000 button recipes.
- `h000`–`h999`: 1,000 header recipes.
- `ft000`–`ft999`: 1,000 footer recipes.
- `hr000`–`hr999`: 1,000 hero recipes.
- `fr000`–`fr999`: 1,000 frame recipes.
- `cd000`–`cd999`: 1,000 card recipes.
- `sc000`–`sc999`: 1,000 section recipes.
- `fm000`–`fm999`: 1,000 form recipes.
- `tb000`–`tb999`: 1,000 table recipes.
- `nv000`–`nv999`: 1,000 navigation recipes.

That is 20,000 directly addressable choices backed by a small deterministic engine. Each virtual block expands into a canonical block plus compatible variants, behavior flags and classes for shape, surface, motion, density and shadow.

## Small complete source

```ab
st "Northstar" r=r0421
  pg "/" title="Northstar"
    hr017
      ttl "Operate without the busywork" lvl=1
      txt "A complete responsive interface from a small source file."
      b203 "Start now" h="/start"
```

The model writes the compact form. Before validation, the compiler expands it to canonical source equivalent to:

```ab
site "Northstar"
  page "/" title="Northstar"
    hero variant="..." class="ab-vf-hero ab-v-hr017 ..."
      title "Operate without the busywork" level=1
      text "A complete responsive interface from a small source file."
      button "Start now" href="/start" variant="..." class="ab-vf-button ab-v-b203 ..."
```

Variant selection is derived from the canonical block manifest, so generated IDs do not bypass the validator.

## Site recipe axes

A site recipe coordinates:

| Axis | Choices | Compact override |
| --- | ---: | --- |
| Palette | 64 | `p=p12` |
| Font pairing | 320 | `f=f084` |
| Shape | 24 | `s=s07` |
| Surface | 12 | `sf=u03` |
| Motion | 16 | `mo=m11` |
| Density | 8 | `dn=d2` |
| Shadow | 8 | `sd=z4` |

Use one recipe alone:

```ab
st "Project" r=r7314
```

Or override selected axes without spelling out an entire theme:

```ab
st "Project" r=r7314 p=p12 f=f084 s=s07 sf=u03 mo=m11
```

Custom colors and local font stacks are also accepted on the `site` line:

```ab
site "Project" recipe=r7314 primary="#5b5cf0" background="#f7f8fc" foreground="#111827" font-display="Avenir, system-ui, sans-serif" font-body="Inter, system-ui, sans-serif"
```

The default pairings use local and system stacks. The compiler does not silently add third-party font requests. Projects can load licensed or self-hosted font files separately and select those families through `font-display`, `font-body` and `font-mono`.

## Compact aliases

Common block aliases:

```text
st=site pg=page sec=section gr=grid stk=stack hd=header nav=nav
ln=link bt=button ttl=title txt=text img=image pf=proof lgs=logos
sts=stats feats=features feat=feature price=pricing fq=faq qu=question
call=cta app=app-shell side=sidebar tool=toolbar met=metric tbl=table
frm=form fld=field pnl=panel dlg=dialog kb=kanban crd=card
```

Common attribute aliases:

```text
v=variant h=href i=icon cl=class l=label t=tone rv=reveal
sp=span w=width a=align n=name val=value req=required
ph=placeholder sel=selected cur=current stk=sticky act=action
typ=type dis=disabled ld=loading lvl=level sz=size
```

Attribute aliases are normalized independently on every line. They work in otherwise canonical source as well as fully compact source.

## Semantic macros

Generation 2 includes an opt-in semantic catalog backed by existing canonical contracts. Representative names include:

- Frames and surfaces: `frame`, `browser-frame`, `phone-frame`, `laptop-frame`, `glass-card`, `gradient-card`.
- Motion and media: `carousel`, `masonry-grid`, `marquee`, `ticker`.
- Overlays: `drawer`, `sheet`, `modal`, `command-palette`, `popover`, `dropdown`.
- Controls: `search`, `range`, `file-drop`, `toggle`, `segmented`, `stepper`, `pagination`.
- Feedback: `toast`, `notification`, `alert-banner`, `skeleton`, `success-state`, `error-state`.
- Applications: `dashboard-shell`, `data-grid`, `calendar-grid`, `inbox`, `feed`, `chat-thread`, `kanban-board`.
- Commerce and marketing: `product-card`, `product-grid`, `cart-table`, `checkout-form`, `feature-grid`, `pricing-grid`, `social-proof`.

`getBlock(name)` resolves legacy blocks, semantic macros, exact virtual block IDs and exact recipe IDs on demand. `getCatalog()` retains the legacy default. Use `getCatalog({ includeMacros: true })` for the expanded semantic catalog.

The compiler preserves the original catalog artifact and emits the expanded model-facing catalog separately as `appblocks.extended-catalog.json`.

## Generated behavior

Generation-2 builds append dependency-free behavior for:

- viewport reveal;
- child staggering;
- reduced-motion-safe scroll parallax;
- carousel previous and next controls;
- `Ctrl+K` or `Cmd+K` command-palette activation;
- file-drop feedback;
- one-shot counter animation.

Existing navigation, tabs, dialogs, forms, sortable/filterable tables, copy controls, theme switching and demo-state behavior remain in the original runtime.

## Build artifacts

A generation-2 build adds:

- `appblocks.design.json`: selected recipe, axes, feature flags and address-space counts.
- `appblocks.extended-catalog.json`: compact legacy plus semantic catalog data for model tooling.

Generated HTML receives `data-ab-engine="2"` and the selected recipe metadata. Source/output metrics are reconciled after the additional files are generated, including the manifest's own serialized size.

## Model workflow

1. Select one site recipe.
2. Use canonical block names for ordinary structure.
3. Use short aliases where they materially reduce output.
4. Use virtual IDs for visually specific buttons, headers, heroes, frames, cards and application surfaces.
5. Supply real labels, links, content and identifiers.
6. Run strict validation and fix the smallest reported contract violation.
7. Connect authentication, persistence, payments, email and other external operations through reviewed application adapters.

Generation 2 compresses interface expression. It does not weaken validation or pretend that a static demonstration is a production backend.
