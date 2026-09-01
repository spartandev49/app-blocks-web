# Block-system guide

AppBlocks is hierarchical. A model should use the highest semantic level that preserves the requested intent.

```text
token → element → section → page → application system
```

A `button` is available, but a model should not manually rebuild a `pricing` section from buttons, text and grids when the pricing contract already owns plan hierarchy, emphasis and action placement.

## Families

| Family | Job | Representative blocks |
| --- | --- | --- |
| Document | Project and route structure | `site`, `meta`, `page`, `main` |
| Layout | True structural exceptions | `section`, `grid`, `stack`, `columns`, `divider` |
| Navigation | Movement and application chrome | `header`, `nav`, `link`, `button`, `breadcrumbs`, `footer` |
| Content | Portable content atoms | `title`, `heading`, `text`, `badge`, `image`, `code-block`, `list` |
| Marketing | Persuasion and decision surfaces | `hero`, `features`, `proof`, `pricing`, `faq`, `cta` |
| Reading | Documentation and long-form comprehension | `article`, `prose`, `callout` |
| Application | Repeated operational work | `app-shell`, `metrics`, `chart`, `table`, `form`, `tabs`, `dialog`, `kanban` |

Run `appblocks catalog --json` for the full current catalog.

## Choosing the right level

### Prefer compound blocks

```appblocks
pricing variant=ledger
  title "Choose the operating level"
  tier name=Starter price="$0"
  tier name=Team price="$18" featured=true
```

Avoid manually composing an unrelated grid, cards, headings and actions unless the requested pricing structure cannot be represented by `pricing`.

### Use layout blocks for exceptions

```appblocks
section variant=ruled
  columns variant=wide-left
    article
      title "Research notes"
    activity label="Recent evidence"
```

Layout blocks are not a substitute for domain meaning. They exist so the language can express compositions that have not yet earned a compound contract.

## Interaction ownership

Blocks own relevant control states:

- `button`: default, hover, focus-visible, active, disabled and loading;
- `form`: labels, required validation, preserved values and progress status;
- `tabs`: arrow, Home and End keyboard navigation with associated panels;
- `dialog`: native modal behavior, Escape, close controls and focus return;
- `table`: headings, alignment, constrained overflow, filtering and no-results recovery;
- `header`: desktop navigation, mobile disclosure and Escape recovery;
- all animated surfaces: a reduced-motion path.

## Style packs

`site theme=<name>` chooses a coherent token system, not a superficial color swap.

| Pack | Character | Useful for |
| --- | --- | --- |
| `blueprint` | Warm drafting paper, cobalt actions, technical precision | Developer tools, finance, systems products |
| `signal` | Controlled green, softer geometry, operational clarity | SaaS workspaces and service products |
| `editorial` | Warm paper, red accent, sharp typographic rhythm | Portfolios, studios, publishing and narrative sites |
| dark theme | Deep navy surfaces using the same semantic roles | User-controlled low-light presentation |

A theme controls paper, surface, ink, accent, borders, geometry, elevation, typography roles and motion.

## Machine retrieval

Do not put the full catalog into every prompt. Retrieve a family or named block:

```bash
appblocks catalog hero --json
appblocks catalog table --json
appblocks catalog application --json
```

Each build also emits `appblocks.catalog.json`, allowing an agent to inspect the exact contracts used by the installed compiler version.
