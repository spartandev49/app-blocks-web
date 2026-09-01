# AppBlocks Web Motion Engine 3

Motion Engine 3 adds an allowlisted motion language to AppBlocks Web. Models select coordinated behavior with compact tokens; the compiler expands those tokens into ordinary CSS and a small dependency-free browser runtime.

The design goal is not to animate everything. It is to make hierarchy, feedback and spatial relationships clear without requiring a model to repeatedly author keyframes, observers, pointer handlers or reduced-motion fallbacks.

## Smallest useful form

Set one motion profile at the site root:

```ab
st "Product" r=r7314 fx=polished
  pg "/" title="Product"
    hr017
      ttl "A complete animated interface" lvl=1
      txt "Role-aware motion is supplied by the compiler."
      b203 "Start" h="/start"
```

The profile supplies block-aware defaults. Heroes receive staged entrances, sections reveal with restrained scroll behavior, collections stagger their children, buttons get hover and press feedback, and data-heavy surfaces use faster, quieter transitions.

## Global profiles

| Profile | Intended use |
| --- | --- |
| `off` | Fully static output |
| `quiet` | Minimal opacity and feedback changes |
| `polished` | General product and SaaS interfaces |
| `dynamic` | Energetic launches and interactive products |
| `cinematic` | Strong hero sequencing and scroll depth |
| `playful` | Informal products and expressive campaigns |
| `editorial` | Reading, publishing and narrative pages |
| `application` | Fast, restrained operational interfaces |
| `commerce` | Product grids, cards and conversion surfaces |
| `dramatic` | High-intensity demos and controlled showcases |

A profile is a coordinated baseline, not a forced style. Individual blocks can override any motion axis.

## Exact motion recipes

There are 1,000 deterministic recipes from `x000` through `x999`:

```ab
cd203 fx=x731
```

Each recipe selects:

- Entrance effect
- Scroll effect
- Hover effect
- Press effect
- Optional ambient loop
- Child choreography
- Easing
- Duration
- Delay
- Stagger interval
- Transform origin
- Intensity
- Repeat behavior

Resolve a recipe without loading the full catalog:

```bash
appblocks-v2 motion x731
```

The same ID always resolves to the same tuple.

## Explicit motion axes

```ab
sc247 sx=parallax-y en=clip-up cx=cascade du=slow ix=strong
b203 "Start" h="/start" hx=magnetic px=ripple
hr017 fx="hero sx:depth hx:spotlight"
```

| Alias | Full meaning | Examples |
| --- | --- | --- |
| `fx` | Preset, profile or exact recipe | `polished`, `hero`, `x731` |
| `en` | Entrance | `rise`, `clip-up`, `spring` |
| `sx` | Scroll-linked effect | `parallax-y`, `depth`, `scale` |
| `hx` | Hover interaction | `lift`, `magnetic`, `shine` |
| `px` | Press feedback | `compress`, `ripple`, `bounce` |
| `lx` | Ambient loop | `float`, `breathe`, `shimmer` |
| `cx` | Child choreography | `cascade`, `grid`, `wave` |
| `ez` | Easing | `smooth`, `spring`, `expo` |
| `du` | Duration | `fast`, `normal`, `cinematic` |
| `dl` | Delay token | `0` through `8` |
| `sg` | Stagger token | `0` through `8` |
| `og` | Transform origin | `center`, `bottom-left` |
| `ix` | Intensity | `subtle`, `normal`, `strong`, `extreme` |
| `rp` | Repeat when re-entering viewport | `true`, `false` |

Packed `fx` values are useful when a model wants one preset plus a small override:

```ab
hr017 fx="hero sx:depth"
cd203 fx="card hx:spotlight"
b203 "Launch" h="/launch" fx="button hx:magnetic px:ripple"
```

## Entrance effects

```text
none fade rise fall slide-left slide-right scale-up scale-down blur
flip-x flip-y rotate clip-up clip-left clip-right wipe-up pop spring
zoom bounce
```

Entrance effects are driven by `IntersectionObserver`. Unless `rp=true` is selected, an element is unobserved after its first successful entrance.

## Scroll-linked effects

```text
none reveal parallax-y parallax-x scale rotate fade blur tilt skew
clip depth progress pin
```

Motion Engine 3 uses one scheduled `requestAnimationFrame` pass for active scroll elements. Values are bounded by the selected intensity. Elements far outside the active viewport band are skipped.

`depth` combines bounded translation, scale, blur and perspective rotation. `progress` exposes a local progress line. `pin` uses native sticky positioning rather than a scroll-jacking runtime.

## Hover effects

```text
none lift glow shine fill underline arrow magnetic tilt spotlight
border-draw icon-slide jelly bounce pulse soften
```

Magnetic, tilt and spotlight interactions are pointer-position aware. Magnetic and tilt behavior is disabled automatically when the device does not expose both hover and a fine pointer.

## Press effects

```text
none compress push depress ripple bounce rubber pulse
```

The ripple implementation creates a temporary, `aria-hidden` span with `document.createElement`. It does not insert HTML strings or evaluate authored code. The node removes itself after animation completion, with a timeout fallback.

## Ambient loops

```text
none float breathe pulse bob sway wiggle shimmer gradient spin glow dash
```

Loops are deliberately separate from entrance, hover and press. They pause while hovered and are completely disabled by the reduced-motion path. Use them sparingly for status indicators, decorative visuals or intentionally ambient surfaces.

## Child choreography

```text
none children cascade grid stack hero wave radial list
```

The runtime assigns deterministic child order variables. Wave and radial patterns are calculated from document order without changing DOM order, semantics or keyboard navigation.

## Timing and intensity

Easing:

```text
standard smooth snappy spring expo back linear elastic
```

Duration:

```text
instant quick fast normal slow cinematic
```

Intensity:

```text
subtle normal strong extreme
```

Delay and stagger use compact integer tokens from `0` through `8`. These map to bounded millisecond values in the generated stylesheet.

## Automatic motion for virtual blocks

Generation-2 virtual IDs receive deterministic motion without additional model output:

```ab
hr017
b203 "Start" h="/start"
cd728
```

The family changes how the recipe is interpreted. A virtual button receives hover and press behavior but no entrance by default. A virtual hero receives entrance, scroll and child choreography. Cards receive entrance and hover treatment. Tables and forms receive restrained list or cascade behavior.

Explicit motion tokens always override the automatic family treatment.

## Generated artifacts

A motion-enabled build adds:

```text
appblocks.motion.json
```

The artifact records:

- Motion engine version
- Available recipe count
- Selected global profile
- Resolved root timing
- Used recipes and presets
- Used entrance, scroll, hover, press, loop and choreography effects
- The finite motion catalog

Generated HTML is also marked with:

```html
<html data-ab-motion-engine="3"
      data-ab-motion-recipes="1000"
      data-ab-motion-profile="cinematic">
```

## Accessibility

The generated stylesheet contains a complete `prefers-reduced-motion: reduce` path. It:

- Makes entrance content immediately visible
- Removes transforms, filters, clipping and transition delays
- Stops ambient loops
- Removes child choreography
- Prevents pointer-following transforms

The runtime also treats the site-level `motion=off` setting and the `off` motion profile as reduced-motion states.

Motion does not change DOM order, focus order, labels, landmarks or native control semantics.

## Security boundary

Motion tokens cannot contain arbitrary CSS or JavaScript. Unknown values remain visible to the established AppBlocks validator and fail strict compilation.

The generated runtime does not use:

- `eval`
- `new Function`
- `innerHTML` or `outerHTML` assignment
- `document.write`
- Inline event-handler attributes

The motion engine cannot provide authentication, persistence, authorization or server-side validation. Those remain backend responsibilities.

## Performance model

- Entrance behavior uses one `IntersectionObserver`.
- Scroll effects share one `requestAnimationFrame` scheduler.
- Offscreen elements outside the active viewport band are skipped.
- Pointer behavior is attached only to elements that request magnetic, tilt or spotlight effects.
- No production runtime dependency is added.
- Reduced-motion mode avoids the animation work entirely.

## CLI

```bash
appblocks-v2 motion x731
appblocks-v2 motion cinematic hero
appblocks-v2 normalize product.ab
appblocks-v2 check product.ab --strict
appblocks-v2 build product.ab --out public --strict
```

## Authoring discipline

1. Select one global profile.
2. Use role-aware defaults unless a block needs different behavior.
3. Add continuous scroll motion only where it explains depth or progression.
4. Give interactive controls clear press feedback.
5. Avoid ambient loops on reading and data-entry surfaces.
6. Verify the result with reduced motion enabled.
7. Run strict compilation before deployment.
