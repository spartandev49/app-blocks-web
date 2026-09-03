---
name: appblocks-web
description: Build, redesign, validate, and ship complete websites and web applications with AppBlocks Web. Use when an agent should minimize authored code while producing responsive, accessible, visually distinct interfaces with Taste Engine 5 and Motion Engine 5.
license: MIT
metadata:
  version: 1.0.0
  repository: spartandev49/app-blocks-web
---

# AppBlocks Web agent skill

Use this skill when the user asks to create, redesign, extend, audit, or repair a website or web application with AppBlocks Web.

## Outcome

Deliver working `.ab` source and compiled output, not a conceptual mockup. Use AppBlocks' semantic blocks, deterministic visual systems, interaction runtime, Taste quality gate, and Motion Engine rather than recreating ordinary HTML, CSS, and JavaScript by hand.

## 1. Inspect before authoring

Read these repository files before making material design decisions:

```text
LLMS-COMPACT.txt
LLMS-TASTE.txt
docs/TASTE_ENGINE.md
examples/taste-showcase.ab
```

For an existing project, also inspect its `.ab` source, generated manifest, assets, route structure, forms, and application states. Preserve working behavior unless the user explicitly requests a breaking redesign.

## 2. Choose the correct path

Use **Taste Engine 5** for new visual work and substantial redesigns. Use the canonical compiler path only when byte-for-byte Generation 1 compatibility is required.

Start a Taste-authored project with one coordinated site direction:

```ab
st "Project" r=r7314 ts=t4839201 pk=saas gn=neo-industrial dv=7 mi=6 vd=4
  pg "/" title="Project"
    hr017 tr=focal te=cinematic tsc=depth tc=hero
      ttl "A concrete product promise" lvl=1 tty=display
      txt "A concise explanation tied to the product's actual value."
      b203 "Start" h="/start" th=magnetic tp=ripple
```

- `ts`: Taste DNA, `t0000000` through `t9999999`.
- `dv`: design variance, 1 through 10.
- `mi`: motion intensity, 1 through 10.
- `vd`: visual density, 1 through 10.
- `pk`: page kind.
- `gn`: visual genre.

Do not reuse the same DNA and dial values by habit. Resolve them from the audience, route job, content, assets, trust requirements, and interaction density.

## 3. Plan routes and evidence

Classify each route as one of:

- `persuade`: landing pages, product pages, pricing, campaigns.
- `operate`: dashboards, workspaces, administration, commerce flows.
- `read`: documentation, articles, reports, reference material.
- `showcase`: portfolios, galleries, case studies, specimens.

Before writing blocks, assign every major section a distinct job. Across a long page, use several purposeful composition families rather than repeating one split layout or equal-card grid.

Use real evidence:

- supplied or generated images;
- real screenshots;
- real product data;
- actual interactive components;
- explicitly labelled demonstration data.

Never fabricate customers, testimonials, metrics, integrations, certifications, uptime, or product screenshots.

## 4. Use semantic blocks first

Select the largest existing block that matches the job. Prefer heroes, proof, galleries, pricing, comparison tables, forms, dialogs, application shells, metrics, charts, tables, tabs, boards, and feedback states over assemblies of generic cards.

Use exact recipe queries instead of loading the whole catalog into context:

```bash
appblocks-v2 taste t4839201
appblocks-v2 look e731024
appblocks-v2 motion y73124
appblocks-v2 virtual b203
appblocks-v2 catalog gallery --json
```

Compact aliases are encouraged when they remain readable. Use two spaces per nesting level and exactly one level-one title on each route.

## 5. Assign visual roles

Use local overrides only when the global Taste DNA needs a meaningful exception. Layout tokens are structural contracts, not decoration: never place page-scale grids such as `technical-grid`, `ledger`, `dense-cockpit`, or `horizontal-rail` on a leaf panel or card. Query or inspect `layoutsForBlock()` / `isLayoutCompatible()` before applying `tl`.


```ab
proof tl=artifact-stage tsf=metal tr=evidence
img src="/assets/result.webp" alt="Rendered product result" width=1400 height=1050 tr=artifact
cta tl=closing-band tsf=ink tr=action
```

- `tl`: layout or composition.
- `tsf`: surface or material.
- `tr`: semantic visual role.
- `tty`: typography voice.
- `lk`: exact element look.

Differentiate focal, evidence, artifact, action, navigation, utility, data, narrative, and status elements. Do not style every block as the same elevated rounded card.

## 6. Use purposeful motion

Motion must communicate hierarchy, sequence, feedback, or state:

```ab
hero te=cinematic tsc=depth tc=hero
section te=rise tsc=word-reveal tc=sequence
button "Create project" act=create th=magnetic tp=confirm
```

- `te`: entrance.
- `tsc`: scroll behavior.
- `th`: hover interaction.
- `tp`: press feedback.
- `ta`: ambient loop.
- `tc`: child choreography.
- `tdu`, `tez`, `tix`: duration, easing, intensity.

Use one coordinated motion direction plus a few justified overrides. Avoid perpetual animation on informational content, multiple marquees, strong pointer physics in dense application surfaces, and motion added only for spectacle. AppBlocks owns reduced-motion behavior.

## 7. Preserve functionality

For applications, include the complete interaction cycle where relevant:

- loading;
- empty;
- error;
- disabled;
- validation;
- success;
- focus and keyboard operation;
- dialogs and focus return;
- responsive navigation;
- real destination links or explicit local actions.

Do not imply that generated browser code supplies authentication, authorization, databases, payments, email, or server-side validation. Implement or clearly specify real backend adapters for those operations.

## 8. Run the mandatory gate

Never claim completion before all three commands pass:

```bash
appblocks-v2 audit site.ab --strict --json
appblocks-v2 check site.ab --strict --taste-strict
appblocks-v2 build site.ab --out public --strict --taste-strict
```

Then inspect the rendered result at:

```text
320, 375, 414, 768, 1024, 1280, and 1440 CSS pixels
```

Check keyboard navigation, both supported themes, reduced motion, all routes, every primary action, forms, dialogs, tables, loading/empty/error states, image loading, horizontal overflow, heading structure, and browser-console errors.

Run repository verification before committing library changes:

```bash
npm run verify
npm pack --dry-run --ignore-scripts
```

## 9. Repair generic output ruthlessly

A result is not finished when it merely compiles. Revise it when any of these remain:

- centered hero followed by three equal cards;
- repeated section architecture;
- weak or generic typography;
- one rounded-card treatment applied everywhere;
- decorative section numbering or excessive eyebrows;
- fake browser, phone, terminal, or dashboard chrome;
- generic AI-purple gradients without brand justification;
- excessive glass, pills, glows, or ambient loops;
- duplicated CTA intent under different labels;
- hero content that does not fit the initial desktop viewport;
- missing genuine visual evidence;
- static output despite `mi` above 4;
- operational UI made less usable for the sake of art direction.

The Taste audit is a floor, not a substitute for rendered judgment.

## 10. Delivery contract

Return or commit:

1. Complete `.ab` source.
2. Required local assets or explicit asset references.
3. Compiled output when deployment is requested.
4. A concise list of verified routes and interactions.
5. Honest backend boundaries and unresolved external dependencies.

Do not return raw design ceremony, invented test results, or claims that a deployment succeeded without repository or runtime evidence.
