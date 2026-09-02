# Taste Engine 5

Taste Engine 5 adds deterministic art direction and a strict anti-slop quality gate to AppBlocks Web. It is designed for models that can describe product intent but should not spend hundreds of output tokens rebuilding ordinary frontend implementation.

## Address spaces

| System | Stable addresses |
| --- | ---: |
| Coordinated Taste DNAs | 10,000,000 |
| Element looks | 1,000,000 |
| Motion 5 recipes | 100,000 |
| Page macrostructures | 20 |
| Hero architectures | 20 |
| Navigation architectures | 12 |
| Footer architectures | 12 |
| Typography systems | 32 |
| Palette systems | 48 |
| Surface languages | 16 |

Addresses are resolved algorithmically. The package does not contain millions of copied templates.

## Basic use

```ab
st "Project" r=r7314 ts=t4839201 pk=saas gn=neo-industrial dv=8 mi=7 vd=4
  pg "/" title="Project"
    hr017 tl=artifact-first tr=focal te=cinematic tsc=depth tc=hero
      ttl "A specific product promise" lvl=1 tty=display
      txt "Concrete support copy."
      b203 "Inspect product" h="/product/" th=magnetic tp=ripple
      img src="/assets/product.webp" alt="Product interface" width=1400 height=1000
```

`ts` selects a coordinated design DNA. `dv`, `mi`, and `vd` override design variance, motion intensity, and visual density. Local Taste tokens change a block without abandoning the shared system.

## Visual roles

Roles make the output semantically differentiated:

```text
focal supporting quiet utility evidence navigation action artifact data narrative status
```

A CTA, evidence panel, photograph, navigation item, and data table should not share the same posture merely because all are rectangular components.

## Layout, type, and surface overrides

```ab
section tl=sticky-story tr=narrative
title tty=display tr=focal
panel tl=artifact-stage tsf=metal tr=evidence
image tl=full-bleed tsf=photographic tr=artifact
form tl=quiet-column tsf=paper tr=utility
table tl=dense-cockpit tr=data
```

All values are finite and allowlisted. Invalid values remain visible to strict validation.

## Motion orchestration

Taste Engine 5 resolves role-aware motion from the global motion-intensity dial. Explicit tokens override only the necessary axes:

```ab
button th=magnetic tp=ripple
section te=rise tsc=word-reveal tc=editorial
image te=image-reveal tsc=image-scale th=image-zoom
```

The generated runtime uses native view timelines when supported and an IntersectionObserver-driven active set with one animation-frame scheduler as fallback. It does not install one scroll handler per element and does not use a raw `scroll` event listener. Reduced-motion preferences disable entrance transforms, scroll transforms, loops, and pointer physics while keeping content visible.

## Strict quality gate

```bash
appblocks-v2 audit site.ab --strict --json
appblocks-v2 check site.ab --strict --taste-strict
```

The audit starts at 100 and deducts for common generated-interface failures, including missing art direction, centered high-variance heroes, long hero copy, equal three-column feature rows, fake product chrome, missing visual assets, repeated eyebrows, low structural variety, repeated marquees, generic copy, duplicate CTAs, and high claimed motion without authored motion intent.

The strict minimum is 88. A passing score is necessary, not sufficient; rendered inspection remains mandatory.

## Generated files

Taste builds add:

```text
appblocks.taste.json
appblocks.motion5.json
```

The Taste manifest records the selected DNA, dials, resolved structures, typography, palette, geometry, surfaces, usage, score, and findings. The Motion 5 manifest records the selected vocabulary, scheduler strategy, accessibility behavior, and actually used effects.

## Compatibility

Canonical Generation-1 source without compact, design, motion, or Taste tokens delegates directly to the original compiler. Existing Generation-2 and Motion-3 source continues to use its prior path. Taste Engine 5 activates only when a site or block uses a Taste token.

## Attribution

The engine is an independent implementation informed by Leonxlnx's MIT-licensed Taste Skill at revision `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`. See `THIRD_PARTY_NOTICES.md`.
