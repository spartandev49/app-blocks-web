---
name: appblocks-taste-engine
version: 1.0.0
description: Design and audit visually distinct AppBlocks Web sites with deterministic Taste DNA, role-aware components, purposeful motion, real assets, and strict anti-slop gates.
source: Leonxlnx/taste-skill@ccbc15639c97057cbfcf32ecebc38ef716e4bb37
license: MIT
---

# AppBlocks Taste Engine 5

Use this skill when creating, redesigning, or auditing a website or web application in AppBlocks Web.

## Outcome

Produce a complete `.ab` source file that is structurally specific to the brief, visually coherent, responsive, accessible, functional, and strictly valid. Never return generic component stacking decorated with a new color.

## 1. Read the brief

Determine the route job, audience, trust requirements, brand assets, visual references, and implementation constraints. Classify each route as persuade, operate, read, or showcase. Applications should remain task-first; marketing routes can carry more art direction.

## 2. Set the design controls

Choose one Taste DNA and set:

```ab
st "Project" ts=t4839201 dv=8 mi=7 vd=4
```

- `dv`: structural variance from 1 to 10.
- `mi`: motion intensity from 1 to 10.
- `vd`: information density from 1 to 10.

The values must follow from the brief. Do not always use 8/7/4.

## 3. Plan the page as a sequence

Before authoring, assign each major section a distinct job and layout family. A long page should contain at least four meaningful composition families. Avoid repeated split sections, equal card rows, and a card around every piece of content.

Select the largest semantic blocks available. AppBlocks already has heroes, evidence, features, pricing, galleries, tables, forms, dialogs, application shells, boards, and feedback states.

## 4. Use real visual evidence

Marketing and portfolio work normally needs real photography, supplied brand media, generated raster assets, real screenshots, or actual live components. Never fabricate browser chrome, phone shells, terminals, dashboards, social proof, or quantitative results merely to fill a layout.

## 5. Assign roles

Use `tr` to separate focal, evidence, artifact, action, navigation, utility, data, narrative, and status elements. Use `tl`, `tsf`, and `tty` only where the global DNA needs a justified local exception.

```ab
proof tl=artifact-stage tsf=metal tr=evidence
img src="/assets/result.webp" alt="Rendered product result" tr=artifact
cta tl=closing-band tsf=ink tr=action
```

## 6. Motivate motion

Every motion must explain hierarchy, sequence, feedback, or state. Prefer one coordinated site intensity plus a few explicit overrides.

```ab
hero te=cinematic tsc=depth tc=hero
button "Start" th=magnetic tp=ripple
section tsc=word-reveal
```

Do not use multiple marquees, perpetual loops on informational content, or strong pointer physics in operational data surfaces. Reduced-motion behavior is compiler-owned.

## 7. Apply hard quality rules

- One level-1 title per route.
- Hero essentials fit within 1280x800.
- Hero support copy stays concise.
- No generic centered hero plus three equal cards at high variance.
- No fake proof, customers, testimonials, or metrics.
- No fake product chrome.
- No repeated decorative section numbers.
- Eyebrows are limited to one per three major sections.
- One action label per intent.
- Clickable labels never wrap.
- One palette and one geometry logic per route.
- Cards only when containment is meaningful.
- Images have dimensions and specific alt text.
- Fields have persistent labels.
- Complete states remain visible and accessible.
- Applications keep utility and data motion restrained.

## 8. Verify and repair

Run all three commands and repair every failure:

```bash
appblocks-v2 audit site.ab --strict --json
appblocks-v2 check site.ab --strict --taste-strict
appblocks-v2 build site.ab --out public --strict --taste-strict
```

Then inspect at 320, 375, 414, 768, 1024, 1280, and 1440 CSS pixels; test keyboard navigation, dark and light themes, reduced motion, empty/loading/error states, dialogs, forms, and all primary actions.

## Source and adaptation

This repository-local skill adapts the design-read, variance/motion/density, anti-default, real-asset, responsive, and preflight disciplines from Leonxlnx's MIT-licensed Taste Skill, pinned to `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`. It translates those principles into AppBlocks' finite DSL and compiler-owned runtime. It does not copy Taste Blocks components.
