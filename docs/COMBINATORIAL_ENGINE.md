# Combinatorial engine

AppBlocks Web generation 2 adds a compact normalization layer in front of the existing parser, validator and renderer. An LLM can select complete design and component recipes with short identifiers; the compiler expands those identifiers into the established canonical contracts before strict validation.

The architecture deliberately does **not** create 20,000 copied source files. It exposes deterministic address spaces backed by small generators:

- `r0000`–`r9999`: 10,000 site design recipes.
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

That gives models 20,000 directly addressable choices while keeping the package, prompts and generated source compact.

## Minimal complete example

```ab
st "Northstar" r=r0421
  pg "/" title="Northstar"
    hr017
      ttl "Operate without the busywork" lvl=1
      txt "A complete responsive interface from a very small source file."
      b203 "Start now" h="/start"
```

This normalizes to the equivalent canonical source before validation:

```ab
site "Northstar"
  page "/" title="Northstar"
    hero variant="centered" reveal=true class="..."
      title "Operate without the busywork" level=1
      text "A complete responsive interface from a very small source file."
      button "Start now" href="/start" variant="quiet" class="..."
```

The exact generated classes encode shape, surface, motion, density and shadow choices. The existing renderer remains responsible for semantic HTML and accessibility.

## Design selection

A recipe can be selected on the `site` line with either the full or compact attribute:

```ab
site "Project" recipe=r7314
st "Project" r=r7314
```

A recipe resolves across these axes:

| Axis | Addressable choices | Compact override |
| --- | ---: | --- |
| Palette | 64 | `p=p12` |
| Font pairing | 320 | `f=f084` |
| Shape | 24 | `s=s07` |
| Surface | 12 | `sf=u03` |
| Motion | 16 | `mo=m11` |
| Density | 8 | `dn=d2` |
| Shadow | 8 | `sd=z4` |

Overrides can be combined with a recipe:

```ab
st "Project" r=r7314 p=p12 f=f084 s=s07 mo=m11
```

Custom colors and local font stacks are also supported:

```ab
site "Project" recipe=r7314 primary="#5b5cf0" background="#f7f8fc" foreground="#111827" font-display="Avenir, system-ui, sans-serif" font-body="Inter, system-ui, sans-serif"
```

Font stacks are local by default. This keeps builds deterministic and avoids silently adding third-party requests. A project can load licensed or hosted fonts separately and select them through `font-display`, `font-body` and `font-mono`.

## Compact aliases

Common block aliases include:

```text
st=site pg=page sec=section gr=grid stk=stack hd=header nav=nav
ln=link bt=button ttl=title txt=text img=image hero=hero
feats=features feat=feature price=pricing fq=faq qu=question
app=app-shell side=sidebar tool=toolbar met=metric tbl=table
frm=form fld=field pnl=panel dlg=dialog kb=kanban crd=card
```

Common attribute aliases include:

```text
v=variant h=href i=icon cl=class l=label t=tone rv=reveal
sp=span w=width a=align n=name val=value req=required
ph=placeholder sel=selected cur=current stk=sticky act=action
typ=type dis=disabled ld=loading lvl=level sz=size
```

Aliases only affect authored source. Diagnostics and the AST use canonical names.

## Semantic macro blocks

The engine also maps high-level names onto tested canonical contracts. Examples include:

- Frames: `frame`, `browser-frame`, `phone-frame`, `laptop-frame`, `window-frame`.
- Motion and media: `carousel`, `slide`, `masonry-grid`, `marquee`, `ticker`.
- Overlays: `drawer`, `sheet`, `modal`, `command-palette`, `popover`, `dropdown`.
- Controls: `search`, `range`, `file-drop`, `toggle`, `segmented`, `stepper`, `pagination`.
- Feedback: `toast`, `notification`, `alert-banner`, `skeleton`, `success-state`, `error-state`.
- Application patterns: `dashboard-shell`, `data-grid`, `calendar-grid`, `inbox`, `feed`, `chat-thread`, `kanban-board`.
- Commerce and marketing: `product-card`, `product-grid`, `cart-table`, `checkout-form`, `feature-grid`, `pricing-grid`, `social-proof`.

Use `appblocks catalog <name>` or the JavaScript `getBlock(name)` API to inspect an exact macro, virtual block or site recipe without loading the full catalog into model context.

## Generated behavior

The compiler appends a dependency-free runtime for:

- viewport reveal and stagger animation;
- reduced-motion-safe parallax;
- carousel previous and next controls;
- `Ctrl+K` / `Cmd+K` command-palette opening;
- file-drop visual feedback;
- one-shot counter animation.

Existing runtime behavior for navigation, tabs, dialogs, forms, sortable/filterable tables, copy controls, theme switching and demo-mode state remains unchanged.

## Model workflow

1. Choose one site recipe rather than spelling out every design token.
2. Use semantic macro names for intent and virtual IDs when a specific visual treatment is useful.
3. Add real content, labels, links and IDs; recipes do not invent business facts.
4. Run strict validation.
5. Inspect diagnostics and change the smallest relevant block.
6. Connect authentication, persistence, payments, email and other external operations through reviewed application adapters.

The compact layer reduces model output. It does not weaken validation, bypass accessibility contracts or pretend that static demonstrations are production backends.
