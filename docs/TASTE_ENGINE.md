# Taste Engine 5

Taste Engine 5 is AppBlocks Web's deterministic art-direction and visual-quality layer. A model selects a stable visual DNA, three design dials, and a small number of semantic exceptions. The compiler expands those choices across every supported block while preserving strict validation, accessibility, responsive behavior, and the existing Generation 1/2 paths.

## Address spaces

| System | Addresses | Purpose |
| --- | ---: | --- |
| Taste DNA | 10,000,000 | Coordinates page structure, hero, navigation, footer, type, palette, geometry, surfaces, rhythm, and asset treatment |
| Element looks | 1,000,000 | Coordinates shape, border, shadow, surface, density, and tone |
| Motion 5 | 100,000 | Unique entrance, scroll, hover, press, and repeat core tuples with additional choreography axes |
| Existing site recipes | 10,000 | Generation 2 design defaults |
| Existing virtual components | 10,000 | Deterministic buttons, headers, footers, heroes, frames, cards, sections, forms, tables, and navigation |

Taste IDs are algorithmic. The package does not ship millions of copied files.

## Minimal source

```ab
st "Project" r=r7314 ts=t4839201 pk=saas gn=neo-industrial dv=8 mi=7 vd=4
  pg "/" title="Project" tl=asymmetric-field
    hr017 tl=artifact-first tsf=photographic tr=focal te=cinematic tsc=depth tc=hero
      ttl "A concrete product promise" lvl=1 tty=display
      txt "A concise explanation that keeps the action in the first viewport."
      b203 "Start" h="/start" th=magnetic tp=ripple
      img src="/assets/product.webp" alt="Specific product view" width=1400 height=1050
```

## Three dials

`dv` controls structural variance, `mi` controls motion intensity, and `vd` controls visual density. They affect resolved layout, section rhythm, component posture, motion amplitude, duration, and role defaults. They are not descriptive metadata.

## Visual tokens

| Token | Meaning |
| --- | --- |
| `ts` | Taste DNA (`t0000000` through `t9999999`) |
| `pk` | Page kind |
| `gn` | Visual genre |
| `dv` | Design variance, 1-10 |
| `mi` | Motion intensity, 1-10 |
| `vd` | Visual density, 1-10 |
| `md` | Theme mode: light, dark, auto |
| `tl` | Local layout/composition |
| `tsf` | Local surface/material |
| `tr` | Semantic visual role |
| `tty` | Typography voice |
| `lk` | Exact element look (`e000000` through `e999999`) |

All values are finite and allowlisted. Unknown values produce source-located diagnostics.

## Motion 5

Motion 5 supplies 100,000 deterministic IDs (`y00000` through `y99999`) and role-aware automatic behavior. Each ID has a unique core tuple across entrance, scroll, hover, press, and repeat axes.

The generated runtime uses native CSS view timelines where the selected effect supports them. Other continuous effects use one animation-frame scheduler over an IntersectionObserver-maintained active set. The runtime does not install a raw scroll event listener. Pointer physics only bind on fine-pointer devices. Every motion path collapses to static under `prefers-reduced-motion: reduce`.

## Complete block coverage

Taste normalization resolves a role, layout, surface, type voice, element look, and motion selection for every canonical block that supports classes. This includes marketing, editorial, commerce, documentation, forms, tables, dialogs, application shells, charts, boards, navigation, media, and feedback states.

Data and utility roles receive quieter, faster behavior than focal marketing content. This is important because Leonxlnx's original Taste Skill focuses on landing pages and portfolios; AppBlocks extends its design discipline to functional applications without applying cinematic marketing behavior to operational controls.

## Quality audit

```bash
appblocks-v2 audit site.ab --strict --json
```

The audit detects recurrent generated-design failures, including missing direction, high-variance centered heroes, equal three-card feature rows, fake interface chrome, insufficient real assets, repeated eyebrows, low structural variety, repeated marquees, generic startup language, duplicated CTA labels, overlong hero copy, and motion that is claimed but not shown.

The strict minimum is 88. A Taste build below the threshold fails when `--taste-strict` is enabled.

```bash
appblocks-v2 check site.ab --strict --taste-strict
appblocks-v2 build site.ab --out public --strict --taste-strict
```

A Taste build emits:

```text
appblocks.taste.json
appblocks.motion5.json
```

The first records the selected DNA, axes, dials, usage, score, and findings. The second records the scheduler, accessibility safeguards, vocabulary, and effects used by the project.

## Compatibility

Source without Taste tokens delegates directly to the Version 3 compiler. Existing canonical Generation 1 output and existing Generation 2/Motion 3 behavior remain unchanged except for the removal of raw scroll-listener scheduling in favor of active-set animation-frame scheduling.

## Source attribution

The design guidance is adapted from `Leonxlnx/taste-skill`, commit `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`, under the MIT License. AppBlocks' DSL integration, deterministic address spaces, audits, CSS, and runtime are independent implementations. No Taste Blocks React component source is redistributed.
