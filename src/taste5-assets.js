const freeze = (value) => Object.freeze(value);

const GEOMETRY_TOKENS = freeze({
  sharp: { radius: "0", radiusSm: "0", radiusLg: "0", button: "0", border: "1px" },
  "micro-soft": { radius: ".35rem", radiusSm: ".2rem", radiusLg: ".55rem", button: ".3rem", border: "1px" },
  soft: { radius: ".75rem", radiusSm: ".45rem", radiusLg: "1.1rem", button: ".6rem", border: "1px" },
  rounded: { radius: "1.1rem", radiusSm: ".65rem", radiusLg: "1.6rem", button: ".8rem", border: "1px" },
  squircle: { radius: "1.35rem", radiusSm: ".7rem", radiusLg: "2rem", button: ".8rem", border: "1px" },
  "cut-corner": { radius: ".2rem 1rem .2rem 1rem", radiusSm: ".1rem .5rem", radiusLg: ".3rem 1.6rem", button: ".15rem .75rem", border: "1px" },
  notched: { radius: "0 1.1rem 0 1.1rem", radiusSm: "0 .5rem", radiusLg: "0 1.8rem", button: "0 .75rem", border: "1px" },
  ticket: { radius: ".25rem 1rem", radiusSm: ".2rem .55rem", radiusLg: ".35rem 1.5rem", button: ".2rem .7rem", border: "1px" },
  "capsule-controls": { radius: ".8rem", radiusSm: ".5rem", radiusLg: "1.2rem", button: "999px", border: "1px" },
  architectural: { radius: ".25rem", radiusSm: ".15rem", radiusLg: ".4rem", button: ".2rem", border: "1.5px" },
  organic: { radius: "38% 62% 58% 42% / 46% 35% 65% 54%", radiusSm: ".7rem", radiusLg: "2rem 4rem", button: "1rem", border: "1px" },
  "mixed-rule": { radius: ".7rem", radiusSm: ".25rem", radiusLg: "1.6rem .3rem", button: "999px", border: "1px" }
});

const FONT_WEIGHTS = freeze({
  "DM Serif Display": [400],
  "Cormorant Garamond": [400, 500, 600, 700],
  Newsreader: [400, 500, 600, 700],
  "Space Mono": [400, 700],
  "IBM Plex Mono": [400, 500, 600, 700],
  "IBM Plex Sans Condensed": [400, 500, 600, 700]
});

function fontFamilyUrl(family, weights) {
  return `family=${family.trim().replaceAll(" ", "+")}:wght@${weights.join(";")}`;
}

function supportedWeights(family, requested) {
  const supported = FONT_WEIGHTS[family];
  return supported ? requested.filter((weight) => supported.includes(weight)) : requested;
}

export function tasteFontStylesheetUrl(profile) {
  const entries = new Map();
  const add = (family, weights) => {
    const current = entries.get(family) ?? [];
    entries.set(family, [...new Set([...current, ...supportedWeights(family, weights)])].sort((left, right) => left - right));
  };
  add(profile.typography.display, [400, 500, 600, 700, 800]);
  add(profile.typography.body, [400, 500, 600, 700]);
  add(profile.typography.mono, [400, 500, 600, 700]);
  return `https://fonts.googleapis.com/css2?${[...entries.entries()].map(([family, weights]) => fontFamilyUrl(family, weights)).join("&")}&display=swap`;
}

function number(value) {
  return Number(value).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function surfaceRules() {
  return `
.ab-t5-surface-flat{--t5-local-bg:transparent;--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink)}
.ab-t5-surface-paper{--t5-local-bg:var(--t5-surface);--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink)}
.ab-t5-surface-matte{--t5-local-bg:var(--t5-surface-2);--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink)}
.ab-t5-surface-ink{--t5-local-bg:var(--t5-ink);--t5-local-ink:var(--t5-bg);background:var(--t5-local-bg);color:var(--t5-local-ink);--t5-local-muted:color-mix(in srgb,var(--t5-bg) 76%,transparent)}
.ab-t5-surface-canvas{--t5-local-bg:var(--t5-surface);--t5-local-ink:var(--t5-ink);background-color:var(--t5-local-bg);background-image:linear-gradient(90deg,var(--t5-line-soft) 1px,transparent 1px),linear-gradient(var(--t5-line-soft) 1px,transparent 1px);background-size:2.25rem 2.25rem;color:var(--t5-local-ink)}
.ab-t5-surface-blueprint{--t5-local-bg:color-mix(in srgb,var(--t5-accent) 22%,var(--t5-bg));--t5-local-ink:var(--t5-ink);background-color:var(--t5-local-bg);background-image:linear-gradient(90deg,color-mix(in srgb,var(--t5-accent) 18%,transparent) 1px,transparent 1px),linear-gradient(color-mix(in srgb,var(--t5-accent) 18%,transparent) 1px,transparent 1px);background-size:1.5rem 1.5rem;color:var(--t5-local-ink)}
.ab-t5-surface-metal{--t5-local-bg:linear-gradient(135deg,color-mix(in srgb,var(--t5-surface) 92%,var(--t5-ink)),var(--t5-surface),color-mix(in srgb,var(--t5-surface) 84%,var(--t5-accent)));--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--t5-bg) 70%,transparent)}
.ab-t5-surface-chrome{--t5-local-bg:linear-gradient(115deg,var(--t5-surface-2),var(--t5-surface),color-mix(in srgb,var(--t5-accent) 14%,var(--t5-surface)),var(--t5-surface-2));--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--t5-bg) 80%,transparent),inset 0 -1px 0 var(--t5-line)}
.ab-t5-surface-mesh{--t5-local-bg:var(--t5-surface);--t5-local-ink:var(--t5-ink);background:radial-gradient(circle at 15% 20%,color-mix(in srgb,var(--t5-accent) 24%,transparent),transparent 38%),radial-gradient(circle at 82% 70%,color-mix(in srgb,var(--t5-accent) 14%,transparent),transparent 42%),var(--t5-local-bg);color:var(--t5-local-ink)}
.ab-t5-surface-noise{--t5-local-bg:var(--t5-surface);--t5-local-ink:var(--t5-ink);background-color:var(--t5-local-bg);background-image:radial-gradient(color-mix(in srgb,var(--t5-ink) 12%,transparent) .55px,transparent .7px);background-size:5px 5px;color:var(--t5-local-ink)}
.ab-t5-surface-frost{--t5-local-bg:color-mix(in srgb,var(--t5-surface) 82%,transparent);--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink);backdrop-filter:blur(18px) saturate(1.15);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--t5-bg) 68%,transparent)}
.ab-t5-surface-foil{--t5-local-bg:linear-gradient(120deg,color-mix(in srgb,var(--t5-accent) 18%,var(--t5-surface)),var(--t5-surface) 38%,color-mix(in srgb,var(--t5-accent) 30%,var(--t5-surface)) 58%,var(--t5-surface));--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);background-size:220% 220%;color:var(--t5-local-ink)}
.ab-t5-surface-terminal{--t5-local-bg:color-mix(in srgb,var(--t5-ink) 94%,var(--t5-accent));--t5-local-ink:var(--t5-bg);--t5-local-muted:color-mix(in srgb,var(--t5-bg) 74%,transparent);background:var(--t5-local-bg);color:var(--t5-local-ink);font-family:var(--t5-font-mono)}
.ab-t5-surface-linework{--t5-local-bg:transparent;--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink);border-block:var(--t5-border-width) solid var(--t5-line)}
.ab-t5-surface-photographic{--t5-local-bg:var(--t5-ink);--t5-local-ink:var(--t5-bg);--t5-local-muted:color-mix(in srgb,var(--t5-bg) 76%,transparent);background:var(--t5-local-bg);color:var(--t5-local-ink);overflow:hidden}
.ab-t5-surface-tonal{--t5-local-bg:color-mix(in srgb,var(--t5-accent) 9%,var(--t5-surface));--t5-local-ink:var(--t5-ink);background:var(--t5-local-bg);color:var(--t5-local-ink)}
`;
}

function lookRules() {
  return `
.ab-t5-shape-0{border-radius:0!important}.ab-t5-shape-1{border-radius:.25rem!important}.ab-t5-shape-2{border-radius:.65rem!important}.ab-t5-shape-3{border-radius:1.1rem!important}.ab-t5-shape-4{border-radius:1.35rem!important}.ab-t5-shape-5{border-radius:.15rem .9rem!important}.ab-t5-shape-6{border-radius:0 1rem 0 1rem!important}.ab-t5-shape-7{border-radius:.25rem 1rem!important}.ab-t5-shape-8{border-radius:2rem 2rem .5rem .5rem!important}.ab-t5-shape-9{border-radius:999px!important}.ab-t5-shape-10{border-radius:38% 62% 58% 42% / 46% 35% 65% 54%!important}.ab-t5-shape-11{border-radius:.35rem!important}
.ab-t5-border-0{border-color:transparent!important}.ab-t5-border-1{border:1px solid var(--t5-line-soft)!important}.ab-t5-border-2{border:var(--t5-border-width) solid var(--t5-line)!important}.ab-t5-border-3{border:3px double var(--t5-line)!important}.ab-t5-border-4{border:var(--t5-border-width) solid color-mix(in srgb,var(--t5-accent) 64%,var(--t5-line))!important}.ab-t5-border-5{box-shadow:inset 0 0 0 1px var(--t5-line)!important}.ab-t5-border-6{border:var(--t5-border-width) solid var(--t5-line)!important;outline:1px solid var(--t5-line-soft);outline-offset:.3rem}.ab-t5-border-7{border:1px solid transparent!important;background:linear-gradient(var(--t5-surface),var(--t5-surface)) padding-box,linear-gradient(110deg,var(--t5-accent),transparent 50%,var(--t5-line)) border-box!important}
.ab-t5-shadow-0{box-shadow:none!important}.ab-t5-shadow-1{box-shadow:0 0 0 1px var(--t5-line-soft)!important}.ab-t5-shadow-2{box-shadow:0 .45rem 1.2rem var(--t5-shadow-color)!important}.ab-t5-shadow-3{box-shadow:0 .85rem 2.1rem color-mix(in srgb,var(--t5-shadow-color) 88%,transparent)!important}.ab-t5-shadow-4{box-shadow:0 1.5rem 4rem color-mix(in srgb,var(--t5-shadow-color) 82%,transparent)!important}.ab-t5-shadow-5{box-shadow:.65rem .65rem 0 color-mix(in srgb,var(--t5-accent) 24%,transparent)!important}.ab-t5-shadow-6{box-shadow:0 1rem 3rem color-mix(in srgb,var(--t5-accent) 16%,transparent)!important}.ab-t5-shadow-7{box-shadow:.35rem .35rem 0 var(--t5-ink)!important}.ab-t5-shadow-8{box-shadow:inset 0 0 0 1px var(--t5-line),inset 0 .5rem 1.4rem color-mix(in srgb,var(--t5-ink) 5%,transparent)!important}.ab-t5-shadow-9{box-shadow:0 .25rem 0 var(--t5-line)!important}.ab-t5-shadow-10{box-shadow:0 2rem 5rem color-mix(in srgb,var(--t5-accent) 13%,transparent)!important}.ab-t5-shadow-11{box-shadow:.2rem .2rem 0 var(--t5-line-strong)!important}
.ab-t5-density-0{--t5-local-pad:1.8rem;--t5-local-gap:1.4rem}.ab-t5-density-1{--t5-local-pad:1.5rem;--t5-local-gap:1.2rem}.ab-t5-density-2{--t5-local-pad:1.25rem;--t5-local-gap:1rem}.ab-t5-density-3{--t5-local-pad:1rem;--t5-local-gap:.8rem}.ab-t5-density-4{--t5-local-pad:.8rem;--t5-local-gap:.65rem}.ab-t5-density-5{--t5-local-pad:1.4rem;--t5-local-gap:.9rem}.ab-t5-density-6{--t5-local-pad:.9rem;--t5-local-gap:.75rem}.ab-t5-density-7{--t5-local-pad:.7rem;--t5-local-gap:.5rem}.ab-t5-density-8{--t5-local-pad:2rem;--t5-local-gap:1.5rem}.ab-t5-density-9{--t5-local-pad:.55rem;--t5-local-gap:.4rem}
.ab-t5-tone-0{--t5-tone:var(--t5-ink)}.ab-t5-tone-1{--t5-tone:var(--t5-accent)}.ab-t5-tone-2{--t5-tone:var(--t5-muted)}.ab-t5-tone-3{--t5-tone:var(--t5-ink)}.ab-t5-tone-4{--t5-tone:var(--t5-bg)}.ab-t5-tone-5{--t5-tone:color-mix(in srgb,var(--t5-accent) 72%,#8b5e3c)}.ab-t5-tone-6{--t5-tone:color-mix(in srgb,var(--t5-accent) 72%,#0c7184)}.ab-t5-tone-7{--t5-tone:var(--t5-accent)}.ab-t5-tone-8{--t5-tone:var(--t5-muted)}.ab-t5-tone-9{--t5-tone:var(--t5-accent)}
`;
}

function layoutRules() {
  return `
.ab-t5-layout-asymmetric-split,.ab-t5-layout-split-studio,.ab-t5-layout-media-left,.ab-t5-layout-media-right{display:grid!important;grid-template-columns:minmax(0,1.05fr) minmax(17rem,.95fr);align-items:center;gap:clamp(2rem,6vw,6rem)}
.ab-t5-layout-media-right>:first-child,.ab-t5-layout-asymmetric-split>:first-child{order:0}.ab-t5-layout-media-right>:last-child{order:1}.ab-t5-layout-media-left>:first-child{order:1}.ab-t5-layout-media-left>:last-child{order:0}
.ab-t5-layout-editorial-stack,.ab-t5-layout-quiet-column{display:grid!important;grid-template-columns:minmax(0,46rem);justify-content:start;gap:var(--t5-section-gap)}
.ab-t5-layout-artifact-stage{display:grid!important;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);align-items:start;gap:clamp(2rem,7vw,7rem)}
.ab-t5-layout-artifact-stage>:last-child{min-height:min(70dvh,46rem)}
.ab-t5-layout-sticky-story{display:grid!important;grid-template-columns:minmax(15rem,.55fr) minmax(0,1.45fr);align-items:start;gap:clamp(2rem,7vw,7rem)}
.ab-t5-layout-sticky-story>:first-child{position:sticky;top:calc(var(--t5-nav-height) + 2rem)}
.ab-t5-layout-modular-bento,.ab-t5-layout-technical-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-flow:dense;gap:clamp(.8rem,1.7vw,1.5rem)}
.ab-t5-layout-modular-bento>*:nth-child(6n+1){grid-column:span 7;grid-row:span 2}.ab-t5-layout-modular-bento>*:nth-child(6n+2){grid-column:span 5}.ab-t5-layout-modular-bento>*:nth-child(6n+3){grid-column:span 5}.ab-t5-layout-modular-bento>*:nth-child(6n+4){grid-column:span 4}.ab-t5-layout-modular-bento>*:nth-child(6n+5){grid-column:span 4}.ab-t5-layout-modular-bento>*:nth-child(6n){grid-column:span 4}
.ab-t5-layout-technical-grid>*{grid-column:span 4}.ab-t5-layout-technical-grid>*:nth-child(5n+1){grid-column:span 8}.ab-t5-layout-technical-grid>*:nth-child(5n+4){grid-column:span 5}.ab-t5-layout-technical-grid>*:nth-child(5n){grid-column:span 7}
.ab-t5-layout-horizontal-rail,.ab-t5-layout-comparison-rail,.ab-t5-layout-gallery-wall{display:flex!important;gap:clamp(1rem,2vw,1.75rem);overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-inline:contain;padding-block:.5rem 1rem;scrollbar-width:thin}
.ab-t5-layout-horizontal-rail>*,.ab-t5-layout-comparison-rail>*,.ab-t5-layout-gallery-wall>*{flex:0 0 min(78vw,28rem);scroll-snap-align:start}
.ab-t5-layout-layered-collage{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-rows:minmax(5rem,auto);gap:0;isolation:isolate}.ab-t5-layout-layered-collage>*:nth-child(4n+1){grid-column:1/8;grid-row:1/4;z-index:1}.ab-t5-layout-layered-collage>*:nth-child(4n+2){grid-column:7/-1;grid-row:2/5;z-index:2}.ab-t5-layout-layered-collage>*:nth-child(4n+3){grid-column:2/6;z-index:3}.ab-t5-layout-layered-collage>*:nth-child(4n){grid-column:8/-1;z-index:3}
.ab-t5-layout-ledger,.ab-t5-layout-index-list{display:grid!important;grid-template-columns:minmax(8rem,.32fr) minmax(0,1.68fr);gap:0}.ab-t5-layout-ledger>*,.ab-t5-layout-index-list>*{grid-column:2;border-block-start:1px solid var(--t5-line);padding-block:1.25rem}.ab-t5-layout-ledger>*:nth-child(odd),.ab-t5-layout-index-list>*:nth-child(odd){grid-column:1;padding-inline-end:1rem;font-family:var(--t5-font-mono)}
.ab-t5-layout-full-bleed,.ab-t5-layout-cinematic{width:100vw!important;max-width:none!important;margin-inline:calc(50% - 50vw)!important;padding-inline:max(var(--t5-gutter),calc((100vw - var(--t5-max-width))/2));position:relative}
.ab-t5-layout-offset{margin-inline-start:clamp(0rem,calc(var(--t5-variance-offset)*1vw),8rem);max-width:min(100%,72rem)}
.ab-t5-layout-masonry{columns:3 18rem;column-gap:1.25rem}.ab-t5-layout-masonry>*{break-inside:avoid;margin-block-end:1.25rem}
.ab-t5-layout-dense-cockpit,.ab-t5-layout-workbench,.ab-t5-layout-workspace-canvas{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr));gap:1px;background:var(--t5-line);border:1px solid var(--t5-line)}
.ab-t5-layout-dense-cockpit>*,.ab-t5-layout-workbench>*,.ab-t5-layout-workspace-canvas>*{grid-column:span 4;background:var(--t5-bg)}
.ab-t5-layout-counterflow{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(2rem,8vw,8rem)}.ab-t5-layout-counterflow>*:nth-child(even){translate:0 clamp(2rem,8vw,7rem)}
.ab-t5-layout-closing-band{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:2rem}
`;
}


function architectureRules() {
  return `
/* Complete navigation architecture vocabulary */
.ab-t5-nav-minimal-split{grid-template-columns:auto minmax(0,1fr) auto;border-block-end:1px solid var(--t5-line-soft)}.ab-t5-nav-minimal-split .ab-nav{justify-content:flex-start;margin-inline-start:clamp(1rem,5vw,5rem)}
.ab-t5-nav-compact-bar{min-height:3.45rem!important;padding-block:.35rem!important}.ab-t5-nav-compact-bar .ab-nav .ab-link{font-size:.82rem;padding-block:.35rem}
.ab-t5-nav-utility-led{grid-template-columns:auto auto minmax(0,1fr)}.ab-t5-nav-utility-led .ab-nav{order:3;justify-content:flex-end}.ab-t5-nav-utility-led .ab-header__actions{order:2}
.ab-t5-nav-wordmark-led .ab-brand{font-size:clamp(1.1rem,2vw,1.65rem)}.ab-t5-nav-wordmark-led .ab-nav{justify-content:flex-end}
.ab-t5-nav-section-tabs{border-block-end:1px solid var(--t5-line)}.ab-t5-nav-section-tabs .ab-nav .ab-link{border-block-end:2px solid transparent}.ab-t5-nav-section-tabs .ab-nav .ab-link[aria-current="page"]{border-color:var(--t5-accent)}
.ab-t5-nav-quiet-nav{background:transparent!important;backdrop-filter:none!important}.ab-t5-nav-quiet-nav .ab-nav{justify-content:flex-end}.ab-t5-nav-quiet-nav .ab-header__actions{border-inline-start:1px solid var(--t5-line);padding-inline-start:.75rem}

/* Complete hero architecture vocabulary */
.ab-t5-hero-asymmetric-split{grid-template-columns:minmax(0,1.25fr) minmax(16rem,.75fr)}
.ab-t5-hero-media-mask{width:100vw;max-width:none;margin-inline:calc(50% - 50vw);padding-inline:max(var(--t5-gutter),calc((100vw - var(--t5-max-width))/2));color:var(--t5-bg);overflow:hidden;background:var(--t5-ink)}.ab-t5-hero-media-mask .ab-hero__content{max-width:min(62rem,72vw)}.ab-t5-hero-media-mask .ab-hero__visual{position:absolute;inset:0;z-index:-1}.ab-t5-hero-media-mask .ab-hero__visual::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,color-mix(in srgb,var(--t5-ink) 92%,transparent) 0 38%,color-mix(in srgb,var(--t5-ink) 45%,transparent) 70%,transparent)}.ab-t5-hero-media-mask .ab-image{width:100%;height:100%;border-radius:0;filter:saturate(.8) contrast(1.05)}.ab-t5-hero-media-mask .ab-text{color:color-mix(in srgb,var(--t5-bg) 78%,transparent)}
.ab-t5-hero-kinetic-type{grid-template-columns:minmax(0,1fr);align-content:center;overflow:hidden}.ab-t5-hero-kinetic-type h1{max-width:18ch;font-size:clamp(3.4rem,8.4vw,7.4rem)}.ab-t5-hero-kinetic-type .ab-hero__visual{position:absolute;inset:auto 0 4%;opacity:.2;z-index:-1}
.ab-t5-hero-curtain-reveal .ab-hero__visual{clip-path:inset(0 0 0 12%)}.ab-t5-hero-curtain-reveal .ab-hero__content{translate:clamp(0rem,3vw,3rem) 0}
.ab-t5-hero-offset-window{grid-template-columns:minmax(0,.9fr) minmax(18rem,1.1fr)}.ab-t5-hero-offset-window .ab-hero__visual{translate:clamp(1rem,5vw,5rem) clamp(1rem,5vh,4rem);padding:.65rem;border:1px solid var(--t5-line);background:var(--t5-surface);box-shadow:.75rem .75rem 0 color-mix(in srgb,var(--t5-accent) 18%,transparent)}
.ab-t5-hero-split-index{grid-template-columns:minmax(8rem,.25fr) minmax(0,1.1fr) minmax(16rem,.65fr)}.ab-t5-hero-split-index::before{content:"";inline-size:clamp(3rem,8vw,8rem);block-size:1px;background:var(--t5-accent);align-self:start;margin-block-start:1rem}.ab-t5-hero-split-index .ab-hero__content{grid-column:2}.ab-t5-hero-split-index .ab-hero__visual{grid-column:3}
.ab-t5-hero-architectural-frame{padding:clamp(1.5rem,4vw,4rem);border:1px solid var(--t5-line);margin-block:clamp(1rem,3vw,3rem);min-height:calc(100dvh - var(--t5-nav-height) - 2rem)}.ab-t5-hero-architectural-frame::after{content:"";position:absolute;inset:1rem;border:1px solid var(--t5-line-soft);pointer-events:none}
.ab-t5-hero-modular-intro{grid-template-columns:repeat(12,minmax(0,1fr));align-items:end}.ab-t5-hero-modular-intro .ab-hero__content{grid-column:1/span 7}.ab-t5-hero-modular-intro .ab-hero__visual{grid-column:8/-1;align-self:stretch}
.ab-t5-hero-scroll-cue-free{align-content:center}.ab-t5-hero-scroll-cue-free::after{display:none!important}
.ab-t5-hero-content-first{grid-template-columns:minmax(0,1fr);align-content:start}.ab-t5-hero-content-first .ab-hero__content{max-width:72rem}.ab-t5-hero-content-first .ab-hero__visual{margin-block-start:clamp(2rem,5vw,5rem)}.ab-t5-hero-content-first .ab-hero__visual>.ab-image{height:min(54dvh,36rem)}

/* Complete footer architecture vocabulary */
.ab-t5-footer-index-footer{grid-template-columns:minmax(12rem,.6fr) minmax(0,1.4fr)}.ab-t5-footer-index-footer nav{grid-template-columns:auto repeat(3,minmax(0,1fr));align-items:start;border-block-start:1px solid var(--t5-line);padding-block-start:.8rem}
.ab-t5-footer-split-signoff{grid-template-columns:minmax(0,1.35fr) minmax(18rem,.65fr)}.ab-t5-footer-split-signoff .ab-footer__meta{justify-content:flex-end}
.ab-t5-footer-contact-led{grid-template-columns:minmax(0,1fr)}.ab-t5-footer-contact-led .ab-footer__brand .ab-brand{font-size:clamp(2.4rem,7vw,7rem)}.ab-t5-footer-contact-led nav{display:flex;flex-wrap:wrap;gap:1rem 2rem}
.ab-t5-footer-newsletter-close{grid-template-columns:minmax(0,1.2fr) minmax(18rem,.8fr)}.ab-t5-footer-newsletter-close .ab-footer__brand p{max-width:50ch}
.ab-t5-footer-utility-footer{grid-template-columns:auto minmax(0,1fr) auto;align-items:center;padding-block:1.25rem;margin-block-start:4rem}.ab-t5-footer-utility-footer nav{display:flex;flex-wrap:wrap;justify-content:center}.ab-t5-footer-utility-footer .ab-footer__meta{grid-column:auto;border:0;padding:0}
.ab-t5-footer-brand-canvas{grid-template-columns:minmax(0,1fr);min-height:min(62dvh,38rem);align-content:space-between;padding:clamp(2rem,7vw,7rem);background:var(--t5-accent);color:var(--t5-accent-ink);border:0}.ab-t5-footer-brand-canvas .ab-brand{font-size:clamp(3rem,10vw,10rem);color:inherit}.ab-t5-footer-brand-canvas :where(p,a,.ab-link){color:inherit}
`;
}

function extendedCompositionRules() {
  return `
/* Local aliases for every macrostructure, rhythm and asset treatment */
.ab-t5-layout-auto{min-width:0}
.ab-t5-layout-editorial-axis,.ab-t5-layout-long-document{display:grid!important;grid-template-columns:minmax(0,50rem);justify-content:start;gap:var(--t5-section-gap)}
.ab-t5-layout-asymmetric-field{display:grid!important;grid-template-columns:minmax(0,1.35fr) minmax(14rem,.65fr);gap:clamp(2rem,7vw,7rem);align-items:start}
.ab-t5-layout-poster-stack,.ab-t5-layout-manifesto{display:grid!important;grid-template-columns:minmax(0,1fr);gap:clamp(2rem,5vw,5rem)}.ab-t5-layout-poster-stack :where(h1,h2),.ab-t5-layout-manifesto :where(h1,h2){font-size:clamp(3.4rem,8vw,7.5rem);max-width:16ch}
.ab-t5-layout-sticky-narrative{display:grid!important;grid-template-columns:minmax(14rem,.45fr) minmax(0,1.55fr);gap:clamp(2rem,7vw,7rem);align-items:start}.ab-t5-layout-sticky-narrative>:first-child{position:sticky;top:calc(var(--t5-nav-height) + 1.5rem)}
.ab-t5-layout-catalogue-wall,.ab-t5-layout-portfolio-field{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr));gap:1rem}.ab-t5-layout-catalogue-wall>*:nth-child(odd),.ab-t5-layout-portfolio-field>*:nth-child(odd){grid-column:span 7}.ab-t5-layout-catalogue-wall>*:nth-child(even),.ab-t5-layout-portfolio-field>*:nth-child(even){grid-column:span 5}
.ab-t5-layout-cinematic-sequence{width:100vw!important;max-width:none!important;margin-inline:calc(50% - 50vw)!important;padding:clamp(5rem,12vw,12rem) max(var(--t5-gutter),calc((100vw - var(--t5-max-width))/2));min-height:82dvh}
.ab-t5-layout-spatial-map{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-rows:minmax(6rem,auto);gap:1px;background:var(--t5-line);border:1px solid var(--t5-line)}.ab-t5-layout-spatial-map>*{grid-column:span 4;background:var(--t5-bg)}
.ab-t5-layout-index-first{display:grid!important;grid-template-columns:minmax(7rem,.25fr) minmax(0,1.75fr);gap:1rem}.ab-t5-layout-index-first>*{grid-column:2}.ab-t5-layout-index-first>*:nth-child(odd){grid-column:1}
.ab-t5-layout-feature-stack,.ab-t5-layout-stacked{display:grid!important;grid-template-columns:minmax(0,1fr);gap:clamp(1rem,3vw,2.5rem)}
.ab-t5-layout-commerce-story{display:grid!important;grid-template-columns:minmax(0,.8fr) minmax(18rem,1.2fr);gap:clamp(2rem,6vw,6rem);align-items:center}
.ab-t5-layout-component-playground{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1rem;align-items:start}
.ab-t5-layout-gallery-air{display:grid!important;gap:clamp(2rem,7vw,7rem)}.ab-t5-layout-measured{max-width:72rem}.ab-t5-layout-compressed{gap:.65rem!important;padding-block:1.5rem!important}.ab-t5-layout-chaptered{border-block-start:1px solid var(--t5-line);padding-block-start:clamp(3rem,8vw,8rem)!important}.ab-t5-layout-alternating>*:nth-child(even){margin-inline-start:clamp(0rem,9vw,8rem)}.ab-t5-layout-overlap>*+*{margin-block-start:clamp(-3rem,-6vw,-1rem);position:relative}.ab-t5-layout-rail{display:flex!important;overflow-x:auto;gap:1rem;scroll-snap-type:x mandatory}.ab-t5-layout-rail>*{flex:0 0 min(82vw,30rem);scroll-snap-align:start}.ab-t5-layout-offset{margin-inline-start:clamp(0rem,calc(var(--t5-variance-offset)*1vw),8rem)}.ab-t5-layout-full-bleed,.ab-t5-layout-edge-to-edge{width:100vw!important;max-width:none!important;margin-inline:calc(50% - 50vw)!important}.ab-t5-layout-ledger{border-block:1px solid var(--t5-line)}.ab-t5-layout-editorial{max-width:64rem}
.ab-t5-layout-contained{max-width:68rem!important;margin-inline:auto!important}.ab-t5-layout-masked{clip-path:inset(0 round var(--t5-radius-lg));overflow:hidden}.ab-t5-layout-monochrome :where(img,.ab-image){filter:grayscale(1) contrast(1.08)}.ab-t5-layout-duotone :where(img,.ab-image){filter:grayscale(1) sepia(.22) saturate(1.45) hue-rotate(calc(var(--t5-accent-hue,0)*1deg))}.ab-t5-layout-soft-contrast :where(img,.ab-image){filter:contrast(.92) saturate(.82)}.ab-t5-layout-hard-crop :where(img,.ab-image){aspect-ratio:4/3;object-fit:cover}.ab-t5-layout-editorial-crop :where(img,.ab-image){aspect-ratio:3/4;object-fit:cover}.ab-t5-layout-grain{position:relative}.ab-t5-layout-grain::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.12;background-image:radial-gradient(currentColor .5px,transparent .65px);background-size:4px 4px;mix-blend-mode:multiply}.ab-t5-layout-clean{box-shadow:none!important;background-image:none!important}

/* Page-level structure and rhythm selected by Taste DNA */
.ab-t5-macro-editorial-axis .ab-main>section:nth-child(even){width:min(calc(100% - 2*var(--t5-gutter)),66rem);margin-inline:auto max(var(--t5-gutter),8vw)}
.ab-t5-macro-asymmetric-field .ab-main>section:nth-child(3n+2){translate:clamp(0rem,4vw,4rem) 0}.ab-t5-macro-asymmetric-field .ab-main>section:nth-child(3n){translate:clamp(-3rem,-3vw,0rem) 0}
.ab-t5-macro-modular-bento .ab-main>section:nth-child(odd){border-block-start:1px solid var(--t5-line)}
.ab-t5-macro-poster-stack .ab-main>section :where(h1,h2){font-size:clamp(3rem,7.4vw,7rem)}
.ab-t5-macro-sticky-narrative .ab-main>section>.ab-lead{position:sticky;top:calc(var(--t5-nav-height) + 1.5rem);z-index:2}
.ab-t5-macro-technical-grid{background-image:linear-gradient(90deg,var(--t5-line-soft) 1px,transparent 1px),linear-gradient(var(--t5-line-soft) 1px,transparent 1px);background-size:clamp(2rem,5vw,5rem) clamp(2rem,5vw,5rem)}
.ab-t5-macro-artifact-stage .ab-main .ab-image{min-height:18rem}.ab-t5-macro-split-studio .ab-main>section:nth-child(even){max-width:70rem;margin-inline:auto var(--t5-gutter)}
.ab-t5-macro-catalogue-wall .ab-main>section{border-block-start:1px solid var(--t5-line)}.ab-t5-macro-cinematic-sequence .ab-main>section{padding-block:clamp(5rem,12vw,12rem)}
.ab-t5-macro-ledger .ab-main>section{border-block-start:1px solid var(--t5-line)}.ab-t5-macro-spatial-map .ab-main{background-image:radial-gradient(var(--t5-line-soft) .75px,transparent .75px);background-size:1.5rem 1.5rem}
.ab-t5-macro-index-first .ab-main>section{border-inline-start:clamp(2px,.25vw,4px) solid var(--t5-line);padding-inline-start:clamp(1rem,3vw,3rem)}
.ab-t5-macro-feature-stack .ab-features__grid{grid-template-columns:minmax(0,1fr)}.ab-t5-macro-portfolio-field .ab-gallery{gap:clamp(1rem,3vw,3rem)}.ab-t5-macro-manifesto .ab-main>section :where(h1,h2){max-width:16ch}
.ab-t5-macro-workbench{--t5-section-pad:2.5rem}.ab-t5-macro-long-document .ab-article{max-width:72rem}.ab-t5-macro-commerce-story .ab-pricing__grid{align-items:end}.ab-t5-macro-component-playground .ab-main>section{border-block-start:1px solid var(--t5-line)}
.ab-t5-rhythm-gallery-air{--t5-section-pad:clamp(5rem,10vw,10rem)}.ab-t5-rhythm-measured{--t5-section-pad:clamp(3.5rem,7vw,6rem)}.ab-t5-rhythm-compressed{--t5-section-pad:2.25rem}.ab-t5-rhythm-chaptered .ab-main>section{min-height:min(78dvh,52rem);display:grid;align-content:center}.ab-t5-rhythm-alternating .ab-main>section:nth-child(even){margin-inline:auto max(var(--t5-gutter),8vw)}.ab-t5-rhythm-overlap .ab-main>section+section{margin-block-start:clamp(-2.5rem,-4vw,-1rem)}.ab-t5-rhythm-rail .ab-main{overflow-x:clip}.ab-t5-rhythm-stacked .ab-main>section{position:relative}.ab-t5-rhythm-offset .ab-main>section:nth-child(3n+2){translate:clamp(0rem,3vw,3rem) 0}.ab-t5-rhythm-full-bleed .ab-main>section:nth-child(3n){width:100vw;max-width:none;margin-inline:calc(50% - 50vw);padding-inline:max(var(--t5-gutter),calc((100vw - var(--t5-max-width))/2))}.ab-t5-rhythm-ledger .ab-main>section{border-block-start:1px solid var(--t5-line)}.ab-t5-rhythm-editorial .ab-main>section>.ab-lead{max-width:58rem}

/* Page-level real-asset treatments */
.ab-t5-asset-contained .ab-image{max-width:68rem;margin-inline:auto}.ab-t5-asset-masked .ab-image{clip-path:inset(0 round var(--t5-radius-lg))}.ab-t5-asset-monochrome .ab-image{filter:grayscale(1) contrast(1.08)}.ab-t5-asset-duotone .ab-image{filter:grayscale(1) sepia(.22) saturate(1.35)}.ab-t5-asset-soft-contrast .ab-image{filter:contrast(.92) saturate(.84)}.ab-t5-asset-hard-crop .ab-image{aspect-ratio:4/3;object-fit:cover}.ab-t5-asset-editorial-crop .ab-image{aspect-ratio:3/4;object-fit:cover}.ab-t5-asset-edge-to-edge .ab-hero__visual{width:100vw;margin-inline:calc(50% - 50vw)}.ab-t5-asset-grain .ab-image{filter:contrast(1.04) saturate(.9)}.ab-t5-asset-clean .ab-image{filter:none;box-shadow:none}
`;
}

function motionRules() {
  return `
@property --t5-border-angle{syntax:"<angle>";inherits:false;initial-value:0deg}
.ab-t5-motion{--t5-enter-x:0px;--t5-enter-y:0px;--t5-enter-scale:1;--t5-enter-rotate:0deg;--t5-enter-blur:0px;--t5-scroll-progress:.5;--t5-scroll-y:0px;--t5-scroll-x:0px;--t5-scroll-scale:1;--t5-scroll-rotate:0deg;--t5-magnetic-x:0px;--t5-magnetic-y:0px;--t5-tilt-x:0deg;--t5-tilt-y:0deg;--t5-duration:560ms;--t5-delay:0ms;--t5-ease:cubic-bezier(.22,1,.36,1);transform-origin:center;translate:var(--t5-scroll-x) var(--t5-scroll-y);scale:var(--t5-scroll-scale);rotate:var(--t5-scroll-rotate)}
.js .ab-t5-motion[class*="ab-t5-enter-"]{opacity:0;transform:translate3d(calc(var(--t5-enter-x) + var(--t5-magnetic-x)),calc(var(--t5-enter-y) + var(--t5-magnetic-y)),0) rotateX(var(--t5-tilt-x)) rotateY(var(--t5-tilt-y)) rotate(var(--t5-enter-rotate)) scale(var(--t5-enter-scale));filter:blur(var(--t5-enter-blur));clip-path:var(--t5-enter-clip,inset(0));transition:opacity var(--t5-duration) var(--t5-ease) var(--t5-delay),transform var(--t5-duration) var(--t5-ease) var(--t5-delay),filter var(--t5-duration) var(--t5-ease) var(--t5-delay),clip-path var(--t5-duration) var(--t5-ease) var(--t5-delay)}
.js .ab-t5-motion.is-t5-visible{opacity:1;--t5-enter-x:0px;--t5-enter-y:0px;--t5-enter-scale:1;--t5-enter-rotate:0deg;--t5-enter-blur:0px;--t5-enter-clip:inset(0);filter:none}
.ab-t5-enter-none{opacity:1!important}.ab-t5-enter-fade{opacity:0}.ab-t5-enter-rise{--t5-enter-y:1.75rem}.ab-t5-enter-fall{--t5-enter-y:-1.5rem}.ab-t5-enter-slide-left{--t5-enter-x:2rem}.ab-t5-enter-slide-right{--t5-enter-x:-2rem}.ab-t5-enter-scale{--t5-enter-scale:.94}.ab-t5-enter-blur{--t5-enter-blur:12px}.ab-t5-enter-clip-up,.ab-t5-enter-unmask,.ab-t5-enter-image-reveal{--t5-enter-clip:inset(100% 0 0)}.ab-t5-enter-clip-left{--t5-enter-clip:inset(0 100% 0 0)}.ab-t5-enter-clip-right{--t5-enter-clip:inset(0 0 0 100%)}.ab-t5-enter-wipe{--t5-enter-clip:inset(0 100% 0 0)}.ab-t5-enter-fold{--t5-enter-y:1rem;--t5-enter-scale:.96;--t5-tilt-x:8deg}.ab-t5-enter-spring,.ab-t5-enter-soft-pop{--t5-enter-y:1rem;--t5-enter-scale:.9}.ab-t5-enter-settle{--t5-enter-y:-1rem;--t5-enter-scale:1.03}.ab-t5-enter-focus-in{--t5-enter-blur:18px;--t5-enter-scale:1.02}.ab-t5-enter-type-rise{--t5-enter-y:.85em;--t5-enter-clip:inset(0 0 100%)}.ab-t5-enter-stagger-rise{--t5-enter-y:1.4rem}.ab-t5-enter-drift{--t5-enter-x:1.25rem;--t5-enter-y:1rem}.ab-t5-enter-snap{--t5-enter-scale:.97}.ab-t5-enter-cinematic{--t5-enter-y:2.5rem;--t5-enter-scale:.96;--t5-enter-blur:9px;--t5-enter-clip:inset(8% 0 12%)}
.ab-t5-duration-instant{--t5-duration:1ms}.ab-t5-duration-quick{--t5-duration:180ms}.ab-t5-duration-fast{--t5-duration:320ms}.ab-t5-duration-normal{--t5-duration:560ms}.ab-t5-duration-slow{--t5-duration:820ms}.ab-t5-duration-cinematic{--t5-duration:1120ms}
.ab-t5-easing-standard{--t5-ease:cubic-bezier(.2,.7,.2,1)}.ab-t5-easing-smooth{--t5-ease:cubic-bezier(.22,1,.36,1)}.ab-t5-easing-snappy{--t5-ease:cubic-bezier(.2,.9,.3,1)}.ab-t5-easing-spring{--t5-ease:cubic-bezier(.16,1,.3,1)}.ab-t5-easing-expo{--t5-ease:cubic-bezier(.16,1,.3,1)}.ab-t5-easing-emphasized{--t5-ease:cubic-bezier(.2,0,0,1)}
.ab-t5-intensity-subtle{--t5-motion-amp:.55}.ab-t5-intensity-normal{--t5-motion-amp:1}.ab-t5-intensity-strong{--t5-motion-amp:1.35}.ab-t5-intensity-extreme{--t5-motion-amp:1.7}
.ab-t5-scroll-parallax-y{--t5-scroll-y:calc((var(--t5-scroll-progress) - .5)*-4rem*var(--t5-motion-amp,1))}.ab-t5-scroll-parallax-x{--t5-scroll-x:calc((var(--t5-scroll-progress) - .5)*5rem*var(--t5-motion-amp,1))}.ab-t5-scroll-scale,.ab-t5-scroll-image-scale{--t5-scroll-scale:calc(.92 + var(--t5-scroll-progress)*.12)}.ab-t5-scroll-fade{opacity:calc(.28 + var(--t5-scroll-progress)*.9)}.ab-t5-scroll-blur{filter:blur(calc((1 - var(--t5-scroll-progress))*8px))}.ab-t5-scroll-tilt{--t5-scroll-rotate:calc((var(--t5-scroll-progress) - .5)*3deg)}.ab-t5-scroll-depth{--t5-scroll-y:calc((var(--t5-scroll-progress) - .5)*-3rem);--t5-scroll-scale:calc(.95 + var(--t5-scroll-progress)*.08)}.ab-t5-scroll-clip{clip-path:inset(calc((1 - var(--t5-scroll-progress))*15%) 0 0)}.ab-t5-scroll-focus-shift{filter:blur(calc((1 - var(--t5-scroll-progress))*5px));opacity:calc(.62 + var(--t5-scroll-progress)*.38)}
.ab-t5-scroll-sticky-stack>*{position:sticky;top:calc(var(--t5-nav-height) + 1rem);min-height:min(78dvh,46rem);transform-origin:top center}.ab-t5-scroll-sticky-stack>*+*{margin-top:clamp(4rem,12vh,9rem)}
.ab-t5-scroll-horizontal-pan{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:1rem}.ab-t5-scroll-horizontal-pan>*{flex:0 0 min(84vw,42rem);scroll-snap-align:center}
.ab-t5-scroll-progress{background-image:linear-gradient(90deg,var(--t5-accent) calc(var(--t5-scroll-progress)*100%),transparent 0);background-size:100% 2px;background-repeat:no-repeat;background-position:left bottom}
.ab-t5-scroll-reveal{opacity:calc(.45 + var(--t5-scroll-progress)*.55)}
.ab-t5-scroll-word-reveal{clip-path:inset(0 calc((1 - var(--t5-scroll-progress))*100%) 0 0);opacity:calc(.55 + var(--t5-scroll-progress)*.45)}
.ab-t5-scroll-counterflow>*:nth-child(odd){translate:0 calc((.5 - var(--t5-scroll-progress))*2.5rem)}.ab-t5-scroll-counterflow>*:nth-child(even){translate:0 calc((var(--t5-scroll-progress) - .5)*2.5rem)}
.ab-t5-scroll-section-wipe{clip-path:inset(calc((1 - var(--t5-scroll-progress))*14%) 0 0)}
@supports (animation-timeline:view()){
  .ab-t5-scroll-parallax-y{animation:t5-native-parallax-y linear both;animation-timeline:view();animation-range:entry -10% exit 110%}
  .ab-t5-scroll-parallax-x{animation:t5-native-parallax-x linear both;animation-timeline:view();animation-range:entry -10% exit 110%}
  .ab-t5-scroll-scale,.ab-t5-scroll-image-scale{animation:t5-native-scale linear both;animation-timeline:view();animation-range:entry 0% exit 100%}
  .ab-t5-scroll-fade{animation:t5-native-fade linear both;animation-timeline:view();animation-range:entry 0% cover 45%}
  .ab-t5-scroll-clip,.ab-t5-scroll-section-wipe{animation:t5-native-clip linear both;animation-timeline:view();animation-range:entry 0% cover 45%}
}
@keyframes t5-native-parallax-y{from{translate:0 3rem}to{translate:0 -3rem}}@keyframes t5-native-parallax-x{from{translate:-2.5rem 0}to{translate:2.5rem 0}}@keyframes t5-native-scale{from{scale:.92}50%{scale:1}to{scale:.96}}@keyframes t5-native-fade{from{opacity:.25}to{opacity:1}}@keyframes t5-native-clip{from{clip-path:inset(18% 0 0)}to{clip-path:inset(0)}}
@media (hover:hover) and (pointer:fine){
  .ab-t5-hover-lift:hover,.ab-t5-hover-soft-lift:hover{transform:translateY(calc(-.25rem*var(--t5-motion-amp,1)))}.ab-t5-hover-soft-lift:hover{transform:translateY(-.12rem)}
  .ab-t5-hover-shine{overflow:hidden;position:relative}.ab-t5-hover-shine::after{content:"";position:absolute;inset:-80% auto -80% -35%;width:24%;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--t5-bg) 64%,transparent),transparent);transform:skewX(-18deg) translateX(-260%);transition:transform .75s var(--t5-ease);pointer-events:none}.ab-t5-hover-shine:hover::after{transform:skewX(-18deg) translateX(720%)}
  .ab-t5-hover-fill{background-image:linear-gradient(var(--t5-accent),var(--t5-accent));background-repeat:no-repeat;background-size:0 100%;transition:background-size .35s var(--t5-ease),color .2s ease}.ab-t5-hover-fill:hover{background-size:100% 100%;color:var(--t5-accent-ink)}
  .ab-t5-hover-underline{background-image:linear-gradient(currentColor,currentColor);background-size:0 1px;background-position:left 100%;background-repeat:no-repeat;transition:background-size .28s var(--t5-ease)}.ab-t5-hover-underline:hover{background-size:100% 1px}
  .ab-t5-hover-arrow .ab-icon:last-child{transition:transform .25s var(--t5-ease)}.ab-t5-hover-arrow:hover .ab-icon:last-child,.ab-t5-hover-icon-shift:hover .ab-icon{transform:translateX(.24rem)}
  .ab-t5-hover-magnetic,.ab-t5-hover-tilt{transform:translate3d(var(--t5-magnetic-x),var(--t5-magnetic-y),0) rotateX(var(--t5-tilt-x)) rotateY(var(--t5-tilt-y));transition:transform .18s var(--t5-ease)}
  .ab-t5-hover-spotlight{--t5-spot-x:50%;--t5-spot-y:50%;background-image:radial-gradient(circle at var(--t5-spot-x) var(--t5-spot-y),color-mix(in srgb,var(--t5-accent) 18%,transparent),transparent 38%)}
  .ab-t5-hover-border-trace{background:linear-gradient(var(--t5-surface),var(--t5-surface)) padding-box,conic-gradient(from var(--t5-border-angle,0deg),transparent,var(--t5-accent),transparent 34%) border-box;border:1px solid transparent;transition:--t5-border-angle .6s linear}.ab-t5-hover-border-trace:hover{--t5-border-angle:360deg}
  .ab-t5-hover-image-zoom img,.ab-t5-hover-image-zoom.ab-image{transition:transform .75s var(--t5-ease),filter .75s var(--t5-ease)}.ab-t5-hover-image-zoom:hover img,.ab-t5-hover-image-zoom.ab-image:hover{transform:scale(1.045);filter:saturate(1.06) contrast(1.03)}
  .ab-t5-hover-focus:hover{border-color:var(--t5-accent)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--t5-accent) 14%,transparent)!important}.ab-t5-hover-chroma:hover{filter:saturate(1.15) contrast(1.03)}.ab-t5-hover-quiet:hover{color:var(--t5-accent)}.ab-t5-hover-elastic:hover{transform:scale(1.025)}
  .ab-t5-hover-reveal-copy :where(p,.ab-text){max-height:2.9em;overflow:hidden;transition:max-height .45s var(--t5-ease),opacity .3s ease;opacity:.72}.ab-t5-hover-reveal-copy:hover :where(p,.ab-text){max-height:12em;opacity:1}
  .ab-t5-hover-swap-text>span{transition:translate .25s var(--t5-ease),opacity .25s ease}.ab-t5-hover-swap-text:hover>span{translate:0 -.08rem}.ab-t5-hover-pressable:hover{transform:translateY(-1px);box-shadow:0 .45rem 0 color-mix(in srgb,var(--t5-line) 75%,transparent)}
}
.ab-t5-press-ripple{position:relative;overflow:hidden}.ab-t5-press-compress:active,.ab-t5-hover-pressable:active{transform:translateY(1px) scale(.98)}.ab-t5-press-push:active{translate:0 2px}.ab-t5-press-depress:active{box-shadow:inset 0 .18rem .45rem color-mix(in srgb,var(--t5-ink) 18%,transparent)!important;transform:translateY(1px)}.ab-t5-press-bounce:active{transform:scale(.96)}.ab-t5-press-rubber:active{transform:scaleX(1.025) scaleY(.965)}.ab-t5-press-pulse:active{filter:brightness(.94)}.ab-t5-press-snap:active{transform:translateY(1px)}.ab-t5-press-confirm:active{background:var(--t5-accent);color:var(--t5-accent-ink)}
.ab-t5-ripple{position:absolute;z-index:4;width:.8rem;height:.8rem;border-radius:50%;background:currentColor;opacity:.2;pointer-events:none;transform:translate(-50%,-50%) scale(0);animation:t5-ripple .65s ease-out forwards}@keyframes t5-ripple{to{opacity:0;transform:translate(-50%,-50%) scale(18)}}
.ab-t5-loop-float{animation:t5-float 5.5s ease-in-out infinite}.ab-t5-loop-breathe{animation:t5-breathe 4.5s ease-in-out infinite}.ab-t5-loop-pulse{animation:t5-pulse 2.8s ease-in-out infinite}.ab-t5-loop-bob{animation:t5-bob 3.4s ease-in-out infinite}.ab-t5-loop-sway{animation:t5-sway 5s ease-in-out infinite}.ab-t5-loop-shimmer{background-size:220% 100%;animation:t5-shimmer 3s ease-in-out infinite}.ab-t5-loop-gradient{background-size:220% 220%;animation:t5-gradient 8s ease-in-out infinite}.ab-t5-loop-spin{animation:t5-spin 12s linear infinite}.ab-t5-loop-drift{animation:t5-drift 8s ease-in-out infinite}.ab-t5-loop-orbit{animation:t5-orbit 10s linear infinite}.ab-t5-loop-glow{animation:t5-inner-glow 4.2s ease-in-out infinite}.ab-t5-loop-dash{background-image:linear-gradient(90deg,var(--t5-accent) 0 45%,transparent 45% 55%,var(--t5-accent) 55% 100%);background-size:200% 1px;background-repeat:no-repeat;background-position:left bottom;animation:t5-dash 5s linear infinite}.ab-t5-loop-marquee{overflow:hidden;white-space:nowrap}.ab-t5-loop-marquee>*{display:inline-flex;animation:t5-marquee 22s linear infinite}.ab-t5-loop-scan{position:relative;overflow:hidden}.ab-t5-loop-scan::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent,color-mix(in srgb,var(--t5-accent) 12%,transparent),transparent);translate:0 -100%;animation:t5-scan 4s linear infinite;pointer-events:none}
@keyframes t5-float{50%{transform:translateY(-.55rem)}}@keyframes t5-breathe{50%{scale:1.018}}@keyframes t5-pulse{50%{opacity:.72}}@keyframes t5-bob{50%{translate:0 -.3rem}}@keyframes t5-sway{50%{rotate:1.2deg}}@keyframes t5-shimmer{50%{background-position:100% 0}}@keyframes t5-gradient{50%{background-position:100% 50%}}@keyframes t5-spin{to{rotate:360deg}}@keyframes t5-drift{50%{translate:.6rem -.25rem}}@keyframes t5-orbit{to{rotate:360deg}}@keyframes t5-scan{to{translate:0 100%}}@keyframes t5-inner-glow{50%{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--t5-accent) 55%,transparent),inset 0 0 2.5rem color-mix(in srgb,var(--t5-accent) 10%,transparent)}}@keyframes t5-dash{to{background-position:200% 100%}}@keyframes t5-marquee{to{translate:-50% 0}}
.ab-t5-choreo-children>*:nth-child(2),.ab-t5-choreo-cascade>*:nth-child(2),.ab-t5-choreo-grid>*:nth-child(2),.ab-t5-choreo-list>*:nth-child(2){--t5-delay:70ms}.ab-t5-choreo-children>*:nth-child(3),.ab-t5-choreo-cascade>*:nth-child(3),.ab-t5-choreo-grid>*:nth-child(3),.ab-t5-choreo-list>*:nth-child(3){--t5-delay:140ms}.ab-t5-choreo-children>*:nth-child(4),.ab-t5-choreo-cascade>*:nth-child(4),.ab-t5-choreo-grid>*:nth-child(4),.ab-t5-choreo-list>*:nth-child(4){--t5-delay:210ms}.ab-t5-choreo-children>*:nth-child(5),.ab-t5-choreo-cascade>*:nth-child(5),.ab-t5-choreo-grid>*:nth-child(5),.ab-t5-choreo-list>*:nth-child(5){--t5-delay:280ms}.ab-t5-choreo-children>*:nth-child(n+6),.ab-t5-choreo-cascade>*:nth-child(n+6),.ab-t5-choreo-grid>*:nth-child(n+6),.ab-t5-choreo-list>*:nth-child(n+6){--t5-delay:350ms}
.ab-t5-choreo-wave>*:nth-child(odd){--t5-enter-y:1.5rem}.ab-t5-choreo-wave>*:nth-child(even){--t5-enter-y:-1rem}.ab-t5-choreo-radial>*{transform-origin:center}.ab-t5-choreo-counterflow>*:nth-child(even){--t5-enter-x:-1.5rem}.ab-t5-choreo-counterflow>*:nth-child(odd){--t5-enter-x:1.5rem}
.ab-t5-choreo-stack>*{--t5-enter-y:calc(var(--t5-sequence,1)*.35rem)}.ab-t5-choreo-hero>*:nth-child(1){--t5-delay:0ms}.ab-t5-choreo-hero>*:nth-child(2){--t5-delay:110ms}.ab-t5-choreo-hero>*:nth-child(3){--t5-delay:220ms}.ab-t5-choreo-hero>*:nth-child(n+4){--t5-delay:330ms}.ab-t5-choreo-editorial>*:nth-child(odd){--t5-enter-x:-1rem}.ab-t5-choreo-editorial>*:nth-child(even){--t5-enter-x:1rem}.ab-t5-choreo-sequence>*:nth-child(2){--t5-delay:90ms}.ab-t5-choreo-sequence>*:nth-child(3){--t5-delay:180ms}.ab-t5-choreo-sequence>*:nth-child(4){--t5-delay:270ms}.ab-t5-choreo-sequence>*:nth-child(n+5){--t5-delay:360ms}
`;
}

function resilienceRules() {
  return `
/* AppBlocks 0.4.1 intrinsic layout and typography safety */
html[data-ab-taste-engine="5"] :where(
  .ab-t5,.ab-t5>*,.ab-main>*,.ab-section>*,.ab-hero>*,.ab-proof>*,.ab-grid>*,.ab-columns>*,
  .ab-panel>*,.ab-card>*,.ab-feature>*,.ab-stat>*,.ab-metric>*,.ab-tier>*,.ab-footer>*,
  .ab-steps__list>li,.ab-steps__list>li>*,.ab-app-shell>*,.ab-app-main>*,.ab-tabpanel>*
){min-inline-size:0;max-inline-size:100%}
html[data-ab-taste-engine="5"] :where(h1,h2,h3,h4,h5,h6,.ab-title,.ab-heading,.ab-brand){
  overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important;max-inline-size:100%;text-wrap:balance
}
html[data-ab-taste-engine="5"] :where(p,li,small,.ab-text){overflow-wrap:break-word;word-break:normal}
html[data-ab-taste-engine="5"] :where(pre,code,.ab-code-block,.ab-code){overflow-wrap:anywhere;word-break:break-word}

/* Viewport section spacing belongs only to direct page children. Nested semantic blocks stay intrinsic. */
html[data-ab-taste-engine="5"] .ab-main :where(
  .ab-section,.ab-features,.ab-steps,.ab-split,.ab-pricing,.ab-testimonials,.ab-faq,.ab-proof,
  .ab-cta,.ab-gallery,.ab-article,.ab-logos,.ab-stats,.ab-metrics
){width:auto!important;max-inline-size:100%;margin-inline:0!important;padding-block:0!important}
html[data-ab-taste-engine="5"] .ab-main>:where(
  .ab-section,.ab-features,.ab-steps,.ab-split,.ab-pricing,.ab-testimonials,.ab-faq,.ab-proof,
  .ab-cta,.ab-gallery,.ab-article,.ab-logos,.ab-stats,.ab-metrics
){width:min(calc(100% - 2*var(--t5-gutter)),var(--t5-max-width))!important;margin-inline:auto!important;padding-block:var(--t5-section-pad)!important}

html[data-ab-taste-engine="5"] :where(
  .ab-main,.ab-app-main,.ab-section,.ab-panel,.ab-card,.ab-feature,.ab-tier,.ab-dialog__body,
  .ab-tabpanel,.ab-proof,.ab-stats,.ab-metrics,.ab-features__grid,.ab-steps__list,.ab-footer,
  .ab-grid,.ab-columns,[class*="ab-t5-layout-"]
){container-type:inline-size;min-inline-size:0;max-inline-size:100%}

/* Semantic section wrappers do not become arbitrary twelve-column or horizontal flex canvases. */
html[data-ab-taste-engine="5"] :where(.ab-section,.ab-features,.ab-steps,.ab-pricing,.ab-testimonials)[class*="ab-t5-layout-"]{
  display:block!important;grid-template-columns:none!important;grid-template-rows:none!important;columns:auto!important
}

/* Intrinsic structural tracks: never create a zero-width content column. */
html[data-ab-taste-engine="5"] :where(.ab-grid--two,.ab-grid--three,.ab-grid--four){
  grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))!important;grid-auto-rows:auto!important
}
html[data-ab-taste-engine="5"] .ab-grid{align-items:start!important}
html[data-ab-taste-engine="5"] .ab-grid>:where(.ab-panel,.ab-card,.ab-tier){align-self:start!important}
html[data-ab-taste-engine="5"] :where(.ab-columns,.ab-columns--wide-left,.ab-columns--wide-right){
  grid-template-columns:repeat(auto-fit,minmax(min(100%,23rem),1fr))!important;align-items:start
}
html[data-ab-taste-engine="5"] .ab-columns--sidebar{
  grid-template-columns:minmax(min(100%,14rem),.32fr) minmax(min(100%,24rem),1fr)!important;align-items:start
}
html[data-ab-taste-engine="5"] :where(
  .ab-grid,.ab-columns,.ab-panel
):is(.ab-t5-layout-artifact-stage,.ab-t5-layout-technical-grid,.ab-t5-layout-modular-bento,
     .ab-t5-layout-dense-cockpit,.ab-t5-layout-workbench,.ab-t5-layout-workspace-canvas,
     .ab-t5-layout-layered-collage,.ab-t5-layout-split-studio,.ab-t5-layout-horizontal-rail,
     .ab-t5-layout-gallery-wall,.ab-t5-layout-comparison-rail,.ab-t5-layout-masonry){
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))!important;
  grid-auto-flow:row!important;grid-auto-rows:auto!important;align-items:start;overflow:visible!important
}
html[data-ab-taste-engine="5"] :where(
  .ab-grid,.ab-columns,.ab-panel
):is(.ab-t5-layout-artifact-stage,.ab-t5-layout-technical-grid,.ab-t5-layout-modular-bento,
     .ab-t5-layout-dense-cockpit,.ab-t5-layout-workbench,.ab-t5-layout-workspace-canvas,
     .ab-t5-layout-layered-collage,.ab-t5-layout-split-studio,.ab-t5-layout-horizontal-rail,
     .ab-t5-layout-gallery-wall,.ab-t5-layout-comparison-rail,.ab-t5-layout-masonry)>*{
  grid-column:auto!important;grid-row:auto!important;translate:none;rotate:none;min-inline-size:0;max-inline-size:100%
}
html[data-ab-taste-engine="5"] :where(.ab-grid,.ab-columns,.ab-panel):is(.ab-t5-layout-ledger,.ab-t5-layout-index-list){
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))!important;grid-auto-rows:auto!important
}
html[data-ab-taste-engine="5"] :where(.ab-grid,.ab-columns,.ab-panel):is(.ab-t5-layout-ledger,.ab-t5-layout-index-list)>*{
  grid-column:auto!important;grid-row:auto!important;min-inline-size:0;padding-inline:0!important
}
html[data-ab-taste-engine="5"] .ab-panel.ab-t5-layout-artifact-stage>:last-child{min-block-size:0!important}

/* Collection layouts are applied to their collection grids, not to lead copy. */
html[data-ab-taste-engine="5"] .ab-features__grid{
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))!important;
  grid-auto-flow:row!important;grid-auto-rows:auto!important;align-items:start
}
html[data-ab-taste-engine="5"] :where(.ab-pricing__grid,.ab-testimonials__grid){
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))!important;grid-auto-rows:auto!important
}
html[data-ab-taste-engine="5"] :where(.ab-feature,.ab-card,.ab-panel,.ab-tier,.ab-stat,.ab-metric){
  min-block-size:0!important;block-size:auto!important;aspect-ratio:auto!important;align-content:start
}
html[data-ab-taste-engine="5"] .ab-feature{display:flex!important;flex-direction:column;justify-content:flex-start}
html[data-ab-taste-engine="5"] .ab-feature__mark{margin:0 0 1rem!important;flex:none}
html[data-ab-taste-engine="5"] .ab-feature :where(h2,h3,.ab-title,.ab-heading){margin-block-start:0!important}
html[data-ab-taste-engine="5"] .ab-features__grid>*{grid-column:auto!important;grid-row:auto!important}
html[data-ab-taste-engine="5"] .ab-features__grid>.ab-span-wide{grid-column:span 2!important}
html[data-ab-taste-engine="5"] .ab-features__grid>.ab-span-full{grid-column:1/-1!important}
html[data-ab-taste-engine="5"] .ab-features__grid:has(>:nth-child(5):last-child)>:nth-child(5){grid-column:span 2!important}

/* Proof and statistics keep readable tracks and intact values. */
html[data-ab-taste-engine="5"] .ab-proof{
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr))!important;
  grid-auto-rows:auto!important;align-items:start;gap:clamp(2rem,5vw,5rem)
}
html[data-ab-taste-engine="5"] .ab-proof>*{grid-column:auto!important;grid-row:auto!important;min-inline-size:0}
html[data-ab-taste-engine="5"] :where(.ab-stats,.ab-metrics){
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))!important;
  grid-auto-flow:row!important;grid-auto-rows:auto!important;align-items:stretch
}
html[data-ab-taste-engine="5"] :where(.ab-stats,.ab-metrics):has(>:nth-child(4):last-child){
  grid-template-columns:repeat(2,minmax(0,1fr))!important
}
html[data-ab-taste-engine="5"] :where(.ab-stat,.ab-metric){overflow:hidden;container-type:inline-size}
html[data-ab-taste-engine="5"] :where(.ab-stat>strong,.ab-metric>strong){
  display:block;inline-size:100%;max-inline-size:100%;white-space:nowrap!important;overflow-wrap:normal!important;
  word-break:normal!important;font-variant-numeric:tabular-nums;font-size:clamp(1.55rem,10cqi,3.35rem)!important;
  letter-spacing:-.055em;line-height:.95
}
html[data-ab-taste-engine="5"] :where(.ab-stat>small,.ab-metric>small){display:block;max-inline-size:32ch}

/* Steps use a readable intrinsic card width and a non-zero copy track. */
html[data-ab-taste-engine="5"] .ab-steps__list{
  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))!important;
  grid-auto-flow:row!important;grid-auto-rows:auto!important;inline-size:100%!important
}
html[data-ab-taste-engine="5"] .ab-steps__list>li{
  display:grid!important;grid-template-columns:minmax(2.75rem,max-content) minmax(0,1fr)!important;
  grid-auto-rows:auto!important;min-block-size:0!important;padding:clamp(1.1rem,2.4vw,2rem)!important;
  align-items:start;align-content:start
}
html[data-ab-taste-engine="5"] .ab-steps__list>li>*{grid-column:auto!important;grid-row:auto!important;min-inline-size:0}
html[data-ab-taste-engine="5"] .ab-step__number{align-self:start;white-space:nowrap}

/* Controls remain controls even when authored inside a rail. */
html[data-ab-taste-engine="5"] :where(.ab-button,.ab-icon-button){
  inline-size:auto!important;min-inline-size:0;max-inline-size:100%;block-size:auto!important;min-block-size:2.75rem!important;
  aspect-ratio:auto!important;padding:.72rem 1rem!important;align-self:start;justify-content:center;white-space:nowrap
}
html[data-ab-taste-engine="5"] .ab-grid.ab-t5-layout-horizontal-rail>:where(.ab-button,.ab-icon-button){
  flex:none!important;inline-size:auto!important;min-block-size:2.75rem!important
}
html[data-ab-taste-engine="5"] .ab-actions{min-inline-size:0;flex-wrap:wrap}

/* Footer structure overrides decorative look recipes and preserves independent tracks. */
html[data-ab-taste-engine="5"] .ab-footer{
  display:grid!important;grid-template-columns:minmax(0,2fr) repeat(2,minmax(10rem,1fr))!important;
  align-items:start!important;gap:clamp(2rem,4vw,4rem)!important;border-radius:0!important;
  overflow:visible!important;container-type:inline-size
}
html[data-ab-taste-engine="5"] .ab-footer[class*="ab-t5-shape-"]{border-radius:0!important}
html[data-ab-taste-engine="5"] .ab-footer>*{position:static!important;inset:auto!important;grid-column:auto!important;grid-row:auto!important;min-inline-size:0}
html[data-ab-taste-engine="5"] .ab-footer__brand .ab-brand{
  display:block!important;inline-size:100%!important;max-inline-size:100%;font-size:clamp(2rem,7cqi,5.25rem)!important;
  line-height:.9!important;letter-spacing:-.065em!important;overflow-wrap:normal!important;word-break:normal!important;
  white-space:normal!important
}
html[data-ab-taste-engine="5"] .ab-footer__brand .ab-brand span{
  display:block!important;inline-size:100%!important;max-inline-size:100%;white-space:normal!important;overflow-wrap:normal!important
}
html[data-ab-taste-engine="5"] .ab-footer__brand p{max-inline-size:34ch}
html[data-ab-taste-engine="5"] .ab-footer nav{min-inline-size:0;position:static!important}
html[data-ab-taste-engine="5"] .ab-footer__meta{
  grid-column:1/-1!important;grid-row:auto!important;position:static!important;display:flex;flex-wrap:wrap
}
html[data-ab-taste-engine="5"] .ab-t5-footer-closing-statement{
  grid-template-columns:minmax(0,2fr) repeat(2,minmax(10rem,1fr))!important
}

/* Application shells, panels, tabs and tables stay inside the available inline size. */
html[data-ab-taste-engine="5"] .ab-app-shell{
  grid-template-columns:minmax(13rem,18rem) minmax(0,1fr)!important;max-inline-size:100%;overflow:clip
}
html[data-ab-taste-engine="5"] :where(.ab-sidebar,.ab-app-main,.ab-toolbar,.ab-toolbar__actions,.ab-tabs,.ab-tabpanel,.ab-table-card){
  min-inline-size:0;max-inline-size:100%
}
html[data-ab-taste-engine="5"] .ab-table-card{overflow-x:auto!important;overscroll-behavior-inline:contain;-webkit-overflow-scrolling:touch}
html[data-ab-taste-engine="5"] .ab-table-card table{inline-size:100%;min-inline-size:42rem}
html[data-ab-taste-engine="5"] .ab-activity li{grid-template-columns:1.5rem minmax(0,1fr)!important}
html[data-ab-taste-engine="5"] .ab-activity li>*{min-inline-size:0}

@media (max-width:64rem){
  html[data-ab-taste-engine="5"] .ab-app-shell{grid-template-columns:minmax(4.75rem,5rem) minmax(0,1fr)!important}
}
@media (max-width:48rem){
  html[data-ab-taste-engine="5"] :where(.ab-columns,.ab-columns--wide-left,.ab-columns--wide-right,.ab-columns--sidebar,.ab-proof){
    grid-template-columns:minmax(0,1fr)!important
  }
  html[data-ab-taste-engine="5"] :where(.ab-grid,.ab-columns,.ab-panel)[class*="ab-t5-layout-"]>*{
    grid-column:1!important;grid-row:auto!important;translate:none!important;rotate:none!important
  }
  html[data-ab-taste-engine="5"] .ab-features__grid{grid-template-columns:minmax(0,1fr)!important}
  html[data-ab-taste-engine="5"] .ab-features__grid>.ab-span-wide{grid-column:1!important}
  html[data-ab-taste-engine="5"] :where(.ab-stats,.ab-metrics),
  html[data-ab-taste-engine="5"] :where(.ab-stats,.ab-metrics):has(>:nth-child(4):last-child){
    grid-template-columns:minmax(0,1fr)!important
  }
  html[data-ab-taste-engine="5"] .ab-steps__list{grid-template-columns:minmax(0,1fr)!important}
  html[data-ab-taste-engine="5"] .ab-footer,
  html[data-ab-taste-engine="5"] .ab-t5-footer-closing-statement{
    grid-template-columns:minmax(0,1fr)!important;inline-size:calc(100% - 2rem)!important;gap:1.5rem!important
  }
  html[data-ab-taste-engine="5"] .ab-footer>*{grid-column:1!important}
  html[data-ab-taste-engine="5"] .ab-footer__meta{flex-direction:column!important;align-items:flex-start}
  html[data-ab-taste-engine="5"] .ab-app-shell{display:block!important;overflow:visible!important}
  html[data-ab-taste-engine="5"] .ab-sidebar{
    position:relative!important;inset:auto!important;inline-size:100%!important;block-size:auto!important;
    min-block-size:0!important;max-block-size:none!important;display:grid!important;
    grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;overflow:visible!important;
    border-inline-end:0!important;border-block-end:1px solid var(--t5-line)!important
  }
  html[data-ab-taste-engine="5"] .ab-sidebar nav{
    grid-column:1/-1;display:flex!important;flex-wrap:wrap!important;gap:.35rem!important;margin:0!important;overflow-x:auto!important
  }
  html[data-ab-taste-engine="5"] .ab-sidebar .ab-brand span,
  html[data-ab-taste-engine="5"] .ab-sidebar .ab-link span{display:inline!important}
  html[data-ab-taste-engine="5"] .ab-sidebar__foot{display:none!important}
  html[data-ab-taste-engine="5"] .ab-app-main{padding:1rem!important}
  html[data-ab-taste-engine="5"] .ab-toolbar{display:flex!important;flex-direction:column!important;align-items:stretch!important}
  html[data-ab-taste-engine="5"] .ab-toolbar__actions{inline-size:100%!important;display:flex;flex-wrap:wrap;overflow:visible!important}
  html[data-ab-taste-engine="5"] .ab-table-card table{min-inline-size:36rem}
}
@media (max-width:25.875rem){
  html[data-ab-taste-engine="5"] .ab-steps__list>li{grid-template-columns:2.4rem minmax(0,1fr)!important;padding:1rem!important}
  html[data-ab-taste-engine="5"] .ab-sidebar nav{flex-wrap:nowrap!important}
  html[data-ab-taste-engine="5"] .ab-sidebar .ab-link{flex:0 0 auto}
  html[data-ab-taste-engine="5"] .ab-footer__brand .ab-brand{font-size:clamp(2rem,14cqi,3.75rem)!important}
}
`;
}

export function buildTasteCss(profile) {
  const palette = profile.palette;
  const geometry = GEOMETRY_TOKENS[profile.geometry.name] ?? GEOMETRY_TOKENS.soft;
  const density = profile.visualDensity;
  const variance = profile.variance;
  const motion = profile.motionIntensity;
  const sectionGap = 4.8 + (11 - density) * .42;
  const sectionPad = 3.6 + (11 - density) * .3;
  const varianceOffset = Math.max(0, variance - 4);
  const imageFilter = profile.assetTreatment.name === "monochrome" ? "grayscale(.88) contrast(1.08)" : profile.assetTreatment.name === "duotone" ? "grayscale(1) sepia(.18) saturate(1.2)" : profile.assetTreatment.name === "soft-contrast" ? "contrast(.94) saturate(.86)" : "none";
  return `
/* AppBlocks Web Taste Engine 5 */
html[data-ab-taste-engine="5"]{
  --t5-accent-hue:${palette.hue};--t5-bg:${palette.light.background};--t5-surface:${palette.light.surface};--t5-surface-2:${palette.light.surface2};--t5-ink:${palette.light.ink};--t5-muted:${palette.light.muted};--t5-accent:${palette.light.accent};--t5-accent-ink:${palette.light.accentInk};--t5-line:${palette.light.line};
  --t5-line-soft:color-mix(in srgb,var(--t5-line) 52%,transparent);--t5-line-strong:color-mix(in srgb,var(--t5-ink) 42%,var(--t5-line));--t5-focus:color-mix(in srgb,var(--t5-accent) 82%,var(--t5-ink));--t5-shadow-color:color-mix(in srgb,var(--t5-ink) 14%,transparent);
  --t5-font-display:"${profile.typography.display}",ui-sans-serif,system-ui,sans-serif;--t5-font-body:"${profile.typography.body}",ui-sans-serif,system-ui,sans-serif;--t5-font-mono:"${profile.typography.mono}",ui-monospace,monospace;
  --t5-radius:${geometry.radius};--t5-radius-sm:${geometry.radiusSm};--t5-radius-lg:${geometry.radiusLg};--t5-button-radius:${geometry.button};--t5-border-width:${geometry.border};--t5-gutter:clamp(1rem,4vw,4rem);--t5-max-width:88rem;--t5-nav-height:4.25rem;--t5-section-gap:${number(sectionGap)}rem;--t5-section-pad:${number(sectionPad)}rem;--t5-variance-offset:${varianceOffset};--t5-density:${density};--t5-motion:${motion};--t5-ease:cubic-bezier(.22,1,.36,1);--t5-fast:180ms;--t5-normal:360ms;--t5-slow:720ms;
  color-scheme:light dark;scroll-behavior:smooth;overflow-x:clip;background:var(--t5-bg);color:var(--t5-ink)
}
html[data-ab-taste-engine="5"][data-theme="dark"]{--t5-bg:${palette.dark.background};--t5-surface:${palette.dark.surface};--t5-surface-2:${palette.dark.surface2};--t5-ink:${palette.dark.ink};--t5-muted:${palette.dark.muted};--t5-accent:${palette.dark.accent};--t5-accent-ink:${palette.dark.accentInk};--t5-line:${palette.dark.line};--t5-shadow-color:color-mix(in srgb,var(--t5-ink) 32%,transparent)}
html[data-ab-taste-engine="5"] body{overflow-x:clip;background:var(--t5-bg);color:var(--t5-ink);font-family:var(--t5-font-body);font-size:clamp(.98rem,.95rem + .12vw,1.075rem);line-height:1.62;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
html[data-ab-taste-engine="5"] *{box-sizing:border-box}html[data-ab-taste-engine="5"] ::selection{background:var(--t5-accent);color:var(--t5-accent-ink)}html[data-ab-taste-engine="5"] :where(img,svg,video,canvas){max-width:100%}
html[data-ab-taste-engine="5"] :where(a,button,input,select,textarea,summary,[role="tab"]):focus-visible{outline:3px solid var(--t5-focus)!important;outline-offset:3px!important;box-shadow:none!important}
html[data-ab-taste-engine="5"] .ab-skip-link{z-index:1000;background:var(--t5-ink);color:var(--t5-bg);border-radius:0 0 var(--t5-radius-sm) 0}
html[data-ab-taste-engine="5"] .ab-main{width:100%;max-width:none;padding:0}
html[data-ab-taste-engine="5"] .ab-t5-page{min-height:100dvh;background:var(--t5-bg);color:var(--t5-ink)}
html[data-ab-taste-engine="5"] :where(.ab-section,.ab-features,.ab-steps,.ab-split,.ab-pricing,.ab-testimonials,.ab-faq,.ab-proof,.ab-cta,.ab-gallery,.ab-article,.ab-logos,.ab-stats){width:min(calc(100% - 2*var(--t5-gutter)),var(--t5-max-width));margin-inline:auto;padding-block:var(--t5-section-pad)}
html[data-ab-taste-engine="5"] :where(.ab-section,.ab-features,.ab-steps,.ab-split,.ab-pricing,.ab-testimonials,.ab-faq,.ab-proof,.ab-cta,.ab-gallery,.ab-article)+:where(.ab-section,.ab-features,.ab-steps,.ab-split,.ab-pricing,.ab-testimonials,.ab-faq,.ab-proof,.ab-cta,.ab-gallery,.ab-article){margin-block-start:clamp(1rem,3vw,3rem)}
html[data-ab-taste-engine="5"] :where(h1,h2,h3,h4,.ab-title,.ab-heading){font-family:var(--t5-font-display);font-style:normal;letter-spacing:-.035em;line-height:1.04;text-wrap:balance;overflow-wrap:anywhere;min-width:0;margin:0;color:inherit}
html[data-ab-taste-engine="5"] h1,html[data-ab-taste-engine="5"] .ab-hero .ab-title{font-size:clamp(2.9rem,5.35vw,4.85rem);font-weight:700;max-width:16ch}
html[data-ab-taste-engine="5"] h2,html[data-ab-taste-engine="5"] .ab-lead>.ab-title{font-size:clamp(2.2rem,4.2vw,4.5rem);font-weight:650;max-width:18ch}
html[data-ab-taste-engine="5"] h3{font-size:clamp(1.35rem,2vw,2rem);font-weight:650}
html[data-ab-taste-engine="5"] :where(p,.ab-text){max-width:65ch;text-wrap:pretty;color:var(--t5-local-muted,var(--t5-muted));margin-block:.8rem 0}
html[data-ab-taste-engine="5"] .ab-t5-type-display{font-family:var(--t5-font-display);font-weight:700;letter-spacing:-.045em;line-height:1.01}.ab-t5-type-editorial{font-family:var(--t5-font-display);font-weight:500;letter-spacing:-.025em}.ab-t5-type-condensed{font-family:var(--t5-font-display);font-stretch:condensed;letter-spacing:-.04em}.ab-t5-type-mono,.ab-t5-type-data{font-family:var(--t5-font-mono);font-variant-numeric:tabular-nums}.ab-t5-type-whisper{font-size:.78em;letter-spacing:.03em}.ab-t5-type-shout{text-transform:uppercase;font-weight:800;line-height:1.02}.ab-t5-type-outline{color:transparent!important;-webkit-text-stroke:1px var(--t5-ink);text-shadow:none}.ab-t5-type-lede{font-size:clamp(1.2rem,1.5vw,1.55rem);line-height:1.45}.ab-t5-type-numeral{font-family:var(--t5-font-mono);font-variant-numeric:tabular-nums}.ab-t5-type-numeral:where(.ab-stat,.ab-metric)>strong{font-size:clamp(2rem,4vw,4.25rem);line-height:.95}.ab-t5-type-numeral:not(.ab-stat):not(.ab-metric){font-size:clamp(2.4rem,5vw,5rem);line-height:.95}.ab-t5-type-label,.ab-t5-type-caption{font-family:var(--t5-font-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}.ab-t5-type-quote{font-family:var(--t5-font-display)}.ab-t5-type-quote>p{font-size:clamp(1.35rem,2.4vw,2.35rem);line-height:1.25}
html[data-ab-taste-engine="5"] .ab-eyebrow{display:inline-flex;align-items:center;gap:.5rem;color:var(--t5-muted);font-family:var(--t5-font-mono);font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;background:none;border:0;padding:0}
html[data-ab-taste-engine="5"] .ab-lead{display:flex;flex-direction:column;align-items:flex-start;gap:.65rem;margin-block-end:clamp(2rem,5vw,4.5rem)}
html[data-ab-taste-engine="5"] .ab-lead .ab-actions{margin-block-start:1rem}
html[data-ab-taste-engine="5"] .ab-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem}

html[data-ab-taste-engine="5"] .ab-header{min-height:var(--t5-nav-height);width:min(calc(100% - 2*var(--t5-gutter)),var(--t5-max-width));margin:0 auto;padding:.65rem 0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:1rem;border:0;background:color-mix(in srgb,var(--t5-bg) 88%,transparent);backdrop-filter:blur(16px) saturate(1.05);transition:min-height var(--t5-normal) var(--t5-ease),padding var(--t5-normal) var(--t5-ease),background var(--t5-normal) ease;z-index:300}
html[data-ab-taste-engine="5"] .ab-header--sticky{position:sticky;top:0}.ab-header.is-t5-compact{min-height:3.5rem;padding-block:.35rem;background:color-mix(in srgb,var(--t5-bg) 94%,transparent)}
html[data-ab-taste-engine="5"] .ab-brand{display:inline-flex;align-items:center;gap:.7rem;color:var(--t5-ink);font-family:var(--t5-font-display);font-weight:700;letter-spacing:-.025em;text-decoration:none;white-space:nowrap}.ab-brand>.ab-icon{width:1.15rem;height:1.15rem;color:var(--t5-accent)}
html[data-ab-taste-engine="5"] .ab-nav{display:flex;justify-content:center;align-items:center;gap:clamp(.5rem,1.4vw,1.3rem);min-width:0}.ab-nav .ab-link{display:inline-flex;align-items:center;min-height:2.75rem;padding:.55rem .35rem;color:var(--t5-muted);font-size:.92rem;font-weight:550;text-decoration:none;white-space:nowrap}.ab-nav .ab-link[aria-current="page"],.ab-nav .ab-link:hover{color:var(--t5-ink)}
html[data-ab-taste-engine="5"] .ab-header__actions{display:flex;align-items:center;justify-content:flex-end;gap:.55rem}.ab-nav-toggle{min-width:2.75rem;min-height:2.75rem}
html[data-ab-taste-engine="5"] .ab-t5-nav-floating-rail{margin-block-start:.75rem;padding:.55rem .75rem;border:1px solid var(--t5-line);border-radius:999px;box-shadow:0 .5rem 2rem var(--t5-shadow-color)}
html[data-ab-taste-engine="5"] .ab-t5-nav-editorial-index{grid-template-columns:minmax(12rem,.7fr) minmax(0,1.3fr) auto;border-block-end:1px solid var(--t5-line)}
html[data-ab-taste-engine="5"] .ab-t5-nav-edge-dock{width:calc(100% - 1.5rem);padding-inline:1rem;border:1px solid var(--t5-line);border-radius:var(--t5-radius)}
html[data-ab-taste-engine="5"] .ab-t5-nav-command-nav .ab-nav{justify-content:flex-end}.ab-t5-nav-asymmetric-nav .ab-nav{justify-content:flex-start;margin-inline-start:clamp(1rem,8vw,8rem)}.ab-t5-nav-stacked-masthead{grid-template-columns:1fr auto}.ab-t5-nav-stacked-masthead .ab-nav{grid-column:1/-1;justify-content:flex-start;border-block-start:1px solid var(--t5-line);padding-block-start:.45rem}

html[data-ab-taste-engine="5"] .ab-hero{width:min(calc(100% - 2*var(--t5-gutter)),var(--t5-max-width));min-height:calc(100dvh - var(--t5-nav-height));margin-inline:auto;padding-block:clamp(2.5rem,5.5vh,4.5rem) clamp(3.5rem,7vh,5.5rem);display:grid;grid-template-columns:minmax(0,1.05fr) minmax(18rem,.95fr);align-items:center;gap:clamp(2rem,6vw,7rem);position:relative;isolation:isolate}
html[data-ab-taste-engine="5"] .ab-hero__content{display:flex;flex-direction:column;align-items:flex-start;gap:1rem;min-width:0;z-index:2}.ab-hero__content>.ab-text{font-size:clamp(1.05rem,1.4vw,1.35rem);line-height:1.5;max-width:52ch}.ab-hero__content>.ab-actions{margin-top:.8rem}
html[data-ab-taste-engine="5"] .ab-hero__visual{min-width:0;position:relative;z-index:1}.ab-hero__visual>.ab-image,.ab-hero__visual .ab-image{width:100%;height:min(62dvh,40rem);object-fit:cover;border-radius:var(--t5-radius-lg);filter:${imageFilter};box-shadow:0 2rem 5rem var(--t5-shadow-color)}
html[data-ab-taste-engine="5"] .ab-t5-hero-editorial-manifesto,html[data-ab-taste-engine="5"] .ab-t5-hero-typographic-stage,html[data-ab-taste-engine="5"] .ab-t5-hero-quiet-statement{grid-template-columns:minmax(0,1fr)}.ab-t5-hero-editorial-manifesto .ab-hero__content,.ab-t5-hero-typographic-stage .ab-hero__content{max-width:78rem}.ab-t5-hero-editorial-manifesto h1,.ab-t5-hero-typographic-stage h1{max-width:17ch;font-size:clamp(3.3rem,8vw,7.2rem)}
html[data-ab-taste-engine="5"] .ab-t5-hero-artifact-first{grid-template-columns:minmax(18rem,1fr) minmax(0,1fr)}.ab-t5-hero-artifact-first .ab-hero__visual{order:-1}
html[data-ab-taste-engine="5"] .ab-t5-hero-layered-collage .ab-hero__visual{translate:clamp(-1rem,-3vw,-3rem) clamp(2rem,8vh,6rem);rotate:1deg}.ab-t5-hero-layered-collage .ab-hero__content{z-index:3}
html[data-ab-taste-engine="5"] .ab-t5-hero-cinematic-image{width:100vw;max-width:none;margin-inline:calc(50% - 50vw);padding-inline:max(var(--t5-gutter),calc((100vw - var(--t5-max-width))/2));color:var(--t5-bg);background:var(--t5-ink)}.ab-t5-hero-cinematic-image .ab-text{color:color-mix(in srgb,var(--t5-bg) 75%,transparent)}
html[data-ab-taste-engine="5"] .ab-t5-hero-wide-ledger{grid-template-columns:minmax(0,1.35fr) minmax(16rem,.65fr);border-block:1px solid var(--t5-line)}.ab-t5-hero-wide-ledger h1{max-width:16ch}
html[data-ab-taste-engine="5"] .ab-t5-hero-side-caption{grid-template-columns:minmax(7rem,.25fr) minmax(0,1.75fr)}.ab-t5-hero-side-caption .ab-hero__content{grid-column:2}.ab-t5-hero-side-caption .ab-hero__visual{grid-column:1/-1}
html[data-ab-taste-engine="5"] .ab-t5-hero-scroll-pinned{position:sticky;top:0;min-height:100dvh}.ab-t5-hero-product-theatre .ab-hero__visual{perspective:1200px}.ab-t5-hero-product-theatre .ab-image{transform:rotateY(-5deg) rotateX(2deg)}

${surfaceRules()}
${lookRules()}
${layoutRules()}
${architectureRules()}
${extendedCompositionRules()}

html[data-ab-taste-engine="5"] .ab-t5[class*="ab-t5-density-"]:not(.ab-link):not(.ab-button):not(.ab-title):not(.ab-heading):not(.ab-text):not(.ab-eyebrow):not(.ab-image):not(.ab-icon){padding:var(--t5-local-pad);gap:var(--t5-local-gap)}
html[data-ab-taste-engine="5"] :where(.ab-card,.ab-feature,.ab-tier,.ab-panel,.ab-testimonial,.ab-metric,.ab-stat,.ab-lane){position:relative;min-width:0;border-radius:var(--t5-radius);transition:transform var(--t5-normal) var(--t5-ease),box-shadow var(--t5-normal) ease,border-color var(--t5-fast) ease;background:var(--t5-local-bg,var(--t5-surface));color:var(--t5-local-ink,var(--t5-ink))}
html[data-ab-taste-engine="5"] .ab-t5-role-focal{position:relative;z-index:2}
html[data-ab-taste-engine="5"] .ab-t5-role-evidence:where(.ab-proof,.ab-quote,.ab-testimonial,.ab-panel,.ab-callout){border-inline-start:clamp(2px,.35vw,5px) solid var(--t5-accent);padding-inline-start:max(var(--t5-local-pad,1rem),1rem)}
html[data-ab-taste-engine="5"] .ab-t5-role-quiet{color:var(--t5-muted);box-shadow:none!important}
html[data-ab-taste-engine="5"] .ab-t5-role-utility:where(.ab-panel,.ab-dialog,.ab-empty-state){background:var(--t5-surface);border:1px solid var(--t5-line)}
html[data-ab-taste-engine="5"] .ab-t5-role-action{isolation:isolate}
html[data-ab-taste-engine="5"] .ab-t5-role-artifact:where(.ab-image,.ab-visual,.ab-gallery,.ab-card){overflow:hidden}
html[data-ab-taste-engine="5"] .ab-t5-role-data{font-variant-numeric:tabular-nums}
html[data-ab-taste-engine="5"] .ab-t5-role-narrative:where(.ab-text,.ab-prose){max-width:75ch}
html[data-ab-taste-engine="5"] .ab-image{display:block;width:100%;height:auto;object-fit:cover;border-radius:var(--t5-radius);filter:${imageFilter};background:var(--t5-surface-2)}
html[data-ab-taste-engine="5"] .ab-list{display:grid;gap:.65rem;padding:0;margin:1.25rem 0;list-style:none}.ab-list li{display:grid;grid-template-columns:1.1rem minmax(0,1fr);gap:.7rem;align-items:start;color:var(--t5-muted)}.ab-list .ab-icon{margin-top:.25rem;color:var(--t5-accent)}
html[data-ab-taste-engine="5"] .ab-quote{margin:0;padding:clamp(1.5rem,4vw,3rem);border:0;border-inline-start:4px solid var(--t5-accent);background:var(--t5-surface)}.ab-quote p{font-family:var(--t5-font-display);font-size:clamp(1.3rem,2.5vw,2.4rem);line-height:1.25;color:var(--t5-ink);max-width:32ch}.ab-quote cite{display:block;margin-top:1.25rem;color:var(--t5-muted);font-style:normal}
html[data-ab-taste-engine="5"] .ab-badge,html[data-ab-taste-engine="5"] .ab-tag{display:inline-flex;align-items:center;gap:.35rem;width:max-content;max-width:100%;padding:.35rem .55rem;border-radius:var(--t5-radius-sm);border:1px solid var(--t5-line);background:var(--t5-surface-2);color:var(--t5-ink);font-family:var(--t5-font-mono);font-size:.72rem;line-height:1.2;white-space:nowrap}
html[data-ab-taste-engine="5"] .ab-badge--accent{background:var(--t5-accent);color:var(--t5-accent-ink);border-color:transparent}
html[data-ab-taste-engine="5"] .ab-divider{width:min(calc(100% - 2*var(--t5-gutter)),var(--t5-max-width));margin-inline:auto;border-color:var(--t5-line)}

html[data-ab-taste-engine="5"] .ab-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.65rem;min-height:2.9rem;min-width:2.9rem;padding:.72rem 1.05rem;border:var(--t5-border-width) solid transparent;border-radius:var(--t5-button-radius);font-family:var(--t5-font-body);font-size:.92rem;font-weight:650;line-height:1;text-decoration:none;white-space:nowrap;cursor:pointer;overflow:hidden;isolation:isolate;transition:background-color var(--t5-fast) ease,color var(--t5-fast) ease,border-color var(--t5-fast) ease,box-shadow var(--t5-fast) ease,transform var(--t5-fast) var(--t5-ease)}
html[data-ab-taste-engine="5"] .ab-button--solid{background:var(--t5-accent);color:var(--t5-accent-ink);border-color:var(--t5-accent);box-shadow:0 .35rem 1rem color-mix(in srgb,var(--t5-accent) 20%,transparent)}
html[data-ab-taste-engine="5"] .ab-button--outline{background:transparent;color:var(--t5-ink);border-color:var(--t5-line-strong)}.ab-button--ghost,.ab-button--quiet{background:transparent;color:var(--t5-ink);border-color:transparent}.ab-button--icon,.ab-icon-button{aspect-ratio:1;padding:.65rem}
@media (hover:hover){html[data-ab-taste-engine="5"] .ab-button--solid:hover{background:color-mix(in srgb,var(--t5-accent) 88%,var(--t5-ink));border-color:color-mix(in srgb,var(--t5-accent) 88%,var(--t5-ink))}.ab-button--outline:hover{background:var(--t5-ink);color:var(--t5-bg);border-color:var(--t5-ink)}.ab-button--ghost:hover,.ab-button--quiet:hover{background:var(--t5-surface-2)}}
html[data-ab-taste-engine="5"] .ab-button:active{transform:translateY(1px) scale(.985)}.ab-button:disabled,.ab-button[aria-disabled="true"]{opacity:.55;cursor:not-allowed;pointer-events:none}.ab-button[aria-busy="true"]{cursor:progress}.ab-button[aria-busy="true"]>span{opacity:.7}.ab-button[aria-busy="true"]::before{content:"";width:.85rem;height:.85rem;border:2px solid currentColor;border-inline-end-color:transparent;border-radius:50%;animation:t5-spin .8s linear infinite}.ab-button[data-state="success"]{background:color-mix(in srgb,var(--t5-accent) 72%,#187a4a);color:var(--t5-accent-ink)}.ab-button[data-state="error"]{background:color-mix(in srgb,var(--t5-accent) 35%,#a92b2b);color:var(--t5-accent-ink)}
html[data-ab-taste-engine="5"] .ab-link{display:inline-flex;align-items:center;gap:.35rem;color:inherit;text-decoration-thickness:1px;text-underline-offset:.2em;white-space:nowrap}.ab-link .ab-icon{width:1em;height:1em}

html[data-ab-taste-engine="5"] .ab-features__grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-flow:dense;gap:1rem}.ab-feature{grid-column:span 4;min-height:14rem;padding:clamp(1.2rem,2.4vw,2rem)}.ab-feature:nth-child(5n+1){grid-column:span 7;min-height:21rem}.ab-feature:nth-child(5n+2){grid-column:span 5}.ab-feature:nth-child(5n+4){grid-column:span 5}.ab-feature:nth-child(5n){grid-column:span 7}.ab-feature__mark{display:grid;place-items:center;width:2.6rem;height:2.6rem;border:1px solid var(--t5-line);border-radius:var(--t5-radius-sm);color:var(--t5-accent);margin-bottom:auto}.ab-feature h3,.ab-feature .ab-title{margin-top:clamp(2rem,5vw,5rem)}
html[data-ab-taste-engine="5"] .ab-stats,html[data-ab-taste-engine="5"] .ab-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:1px;background:var(--t5-line);border:1px solid var(--t5-line)}.ab-stat,.ab-metric{padding:1.25rem;background:var(--t5-bg)}.ab-stat>strong,.ab-metric>strong{display:block;font-family:var(--t5-font-mono);font-size:clamp(1.8rem,3vw,3.2rem);letter-spacing:-.04em;line-height:1;margin:.65rem 0}.ab-stat>span:first-child,.ab-metric>span:first-child{color:var(--t5-muted);font-size:.78rem}
html[data-ab-taste-engine="5"] .ab-pricing__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr));gap:1rem;align-items:stretch}.ab-tier{display:flex;flex-direction:column;padding:clamp(1.25rem,2.6vw,2rem);border:1px solid var(--t5-line);background:var(--t5-surface)}.ab-tier--featured{border-color:var(--t5-accent);box-shadow:0 1.5rem 4rem color-mix(in srgb,var(--t5-accent) 13%,transparent)}.ab-tier>.ab-button{margin-top:auto}.ab-price{display:flex;align-items:baseline;gap:.3rem;color:var(--t5-ink)}.ab-price strong{font-family:var(--t5-font-display);font-size:clamp(2.2rem,4vw,4.5rem);letter-spacing:-.05em}
html[data-ab-taste-engine="5"] .ab-steps__list{list-style:none;padding:0;display:grid;gap:0;border-block-start:1px solid var(--t5-line)}.ab-steps__list>li{display:grid;grid-template-columns:minmax(5rem,.25fr) minmax(0,1.75fr);gap:1rem;padding-block:clamp(1.5rem,3vw,2.5rem);border-block-end:1px solid var(--t5-line)}.ab-step__number{font-family:var(--t5-font-mono);font-size:.82rem;color:var(--t5-accent)}
html[data-ab-taste-engine="5"] .ab-testimonials__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,21rem),1fr));gap:1rem}.ab-testimonial{padding:clamp(1.25rem,2.5vw,2rem);background:var(--t5-surface);border-block-start:3px solid var(--t5-accent)}
html[data-ab-taste-engine="5"] .ab-faq__items{display:grid;grid-template-columns:minmax(0,1fr);border-block-start:1px solid var(--t5-line)}.ab-faq details{border-block-end:1px solid var(--t5-line);padding:0}.ab-faq summary{min-height:4rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;font-family:var(--t5-font-display);font-size:clamp(1.1rem,1.6vw,1.35rem);font-weight:600;cursor:pointer;list-style:none}.ab-faq details>div{padding-block:0 1.5rem;max-width:65ch}
html[data-ab-taste-engine="5"] .ab-cta{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:2rem;padding:clamp(2rem,6vw,5rem);background:var(--t5-ink);color:var(--t5-bg);border-radius:var(--t5-radius-lg)}.ab-cta .ab-text{color:color-mix(in srgb,var(--t5-bg) 72%,transparent)}.ab-cta .ab-button--solid{background:var(--t5-bg);color:var(--t5-ink);border-color:var(--t5-bg)}
html[data-ab-taste-engine="5"] .ab-gallery{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:1rem}.ab-gallery>*{grid-column:span 4}.ab-gallery>*:nth-child(5n+1){grid-column:span 7}.ab-gallery>*:nth-child(5n+2){grid-column:span 5}.ab-gallery .ab-image{height:100%;min-height:18rem}
html[data-ab-taste-engine="5"] .ab-logos>div{display:flex;flex-wrap:wrap;gap:clamp(1.4rem,4vw,4rem);align-items:center}.ab-logo{min-height:2.5rem;display:grid;place-items:center;color:var(--t5-muted);filter:grayscale(1);opacity:.72}

html[data-ab-taste-engine="5"] .ab-form{display:grid;gap:1rem;padding:clamp(1.25rem,3vw,2rem);background:var(--t5-surface);border:1px solid var(--t5-line);border-radius:var(--t5-radius)}.ab-field{display:grid;grid-template-columns:minmax(0,1fr);gap:.4rem;min-width:0}.ab-field>label{font-size:.82rem;font-weight:650;color:var(--t5-ink)}.ab-field :where(input,textarea,select){width:100%;min-height:2.9rem;padding:.72rem .85rem;border:1px solid var(--t5-line);outline:2px solid transparent;outline-offset:1px;border-radius:var(--t5-radius-sm);background:var(--t5-bg);color:var(--t5-ink);font:inherit;transition:background-color var(--t5-fast) ease,border-color var(--t5-fast) ease;box-sizing:border-box}.ab-field textarea{min-height:7rem;resize:vertical}.ab-field :where(input,textarea)::placeholder{color:color-mix(in srgb,var(--t5-muted) 82%,transparent);opacity:1}.ab-field :where(input,textarea,select):hover{background:var(--t5-surface-2)}.ab-field :where(input,textarea,select):focus-visible{outline:2px solid var(--t5-focus)!important;outline-offset:1px!important;border-width:1px!important}.ab-field :where(input,textarea,select):disabled{opacity:.55;cursor:not-allowed}.ab-field__message{display:grid;min-height:1lh}.ab-field__message>*{grid-area:1/1}.ab-field__message>small,.ab-field__error{display:block;min-height:1lh;font-size:.76rem;color:var(--t5-muted)}.ab-field.is-invalid [data-field-help]{visibility:hidden}.ab-field__error:not(:empty){color:#a62f2f}.ab-field:has([aria-invalid="true"]) :where(input,textarea,select){border-color:#a62f2f}.ab-field--check{grid-template-columns:auto minmax(0,1fr);align-items:center}.ab-field--check input{width:1.15rem;height:1.15rem;min-height:0;padding:0;accent-color:var(--t5-accent)}
html[data-ab-taste-engine="5"] .ab-newsletter{display:flex;gap:.65rem;max-width:36rem}.ab-newsletter label{flex:1}.ab-newsletter input{width:100%;min-height:2.9rem;border:1px solid var(--t5-line);border-radius:var(--t5-radius-sm);background:var(--t5-bg);color:var(--t5-ink);padding:.7rem .85rem}

html[data-ab-taste-engine="5"] .ab-app-shell{min-height:100dvh;display:grid;grid-template-columns:minmax(13rem,18rem) minmax(0,1fr);background:var(--t5-bg);color:var(--t5-ink)}.ab-sidebar{position:sticky;top:0;height:100dvh;padding:1rem;display:flex;flex-direction:column;border-inline-end:1px solid var(--t5-line);background:var(--t5-surface)}.ab-sidebar nav{display:grid;gap:.25rem;margin-block:2rem auto}.ab-sidebar .ab-link{min-height:2.7rem;padding:.65rem .75rem;border-radius:var(--t5-radius-sm);color:var(--t5-muted)}.ab-sidebar .ab-link:hover,.ab-sidebar .ab-link[aria-current="page"]{background:var(--t5-surface-2);color:var(--t5-ink)}.ab-sidebar__foot{margin-top:auto;padding-block-start:1rem;border-block-start:1px solid var(--t5-line);font-size:.75rem;color:var(--t5-muted)}.ab-app-main{min-width:0;padding:clamp(1rem,3vw,2.5rem)}.ab-toolbar{display:flex;justify-content:space-between;gap:1rem;align-items:flex-end;padding-block:0 1.5rem;border-block-end:1px solid var(--t5-line);margin-block-end:1.5rem}.ab-toolbar__actions{display:flex;align-items:center;gap:.65rem}.ab-panel{padding:clamp(1rem,2vw,1.5rem);border:1px solid var(--t5-line);background:var(--t5-surface)}
html[data-ab-taste-engine="5"] .ab-table-card{border:1px solid var(--t5-line);background:var(--t5-surface);border-radius:var(--t5-radius);overflow:hidden}.ab-table-card__head{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem;border-block-end:1px solid var(--t5-line)}.ab-table-scroll{overflow:auto}.ab-table-card table{width:100%;border-collapse:collapse;font-size:.88rem}.ab-table-card th,.ab-table-card td{padding:.8rem 1rem;text-align:start;border-block-end:1px solid var(--t5-line-soft);white-space:nowrap}.ab-table-card th{position:sticky;top:0;background:var(--t5-surface-2);font-family:var(--t5-font-mono);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--t5-muted)}.ab-table-card tbody tr:hover{background:color-mix(in srgb,var(--t5-accent) 5%,transparent)}.ab-table-column button{display:flex;align-items:center;gap:.3rem;color:inherit;background:none;border:0;font:inherit;cursor:pointer}
html[data-ab-taste-engine="5"] .ab-chart{padding:1rem;border:1px solid var(--t5-line);background:var(--t5-surface);border-radius:var(--t5-radius)}.ab-chart__plot{display:flex;align-items:end;gap:.55rem;min-height:13rem;border-block-end:1px solid var(--t5-line)}.ab-bar{flex:1;display:grid;align-content:end;gap:.4rem;height:100%}.ab-bar>span{display:block;min-height:2px;height:var(--bar);background:var(--t5-accent);border-radius:var(--t5-radius-sm) var(--t5-radius-sm) 0 0}.ab-bar small{font-family:var(--t5-font-mono);font-size:.65rem;color:var(--t5-muted)}
html[data-ab-taste-engine="5"] .ab-tabs>[role="tablist"]{display:flex;gap:.25rem;overflow-x:auto;border-block-end:1px solid var(--t5-line)}.ab-tabs [role="tab"]{min-height:2.9rem;padding:.65rem .9rem;border:0;border-block-end:2px solid transparent;background:none;color:var(--t5-muted);font:inherit;font-weight:600;white-space:nowrap;cursor:pointer}.ab-tabs [role="tab"][aria-selected="true"]{color:var(--t5-ink);border-color:var(--t5-accent)}.ab-tabs [role="tabpanel"]{padding-block:1.25rem}
html[data-ab-taste-engine="5"] .ab-dialog{position:fixed;inset:0;margin:auto;width:min(42rem,calc(100% - 2rem));height:fit-content;max-height:min(84dvh,48rem);padding:0;border:1px solid var(--t5-line);border-radius:var(--t5-radius-lg);background:var(--t5-surface);color:var(--t5-ink);box-shadow:0 2rem 6rem color-mix(in srgb,var(--t5-ink) 28%,transparent)}.ab-dialog::backdrop{background:color-mix(in srgb,var(--t5-ink) 58%,transparent);backdrop-filter:blur(8px)}.ab-dialog__head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.25rem;border-block-end:1px solid var(--t5-line)}.ab-dialog__body{padding:1.25rem;overflow:auto}.ab-icon-button{display:grid;place-items:center;min-width:2.75rem;min-height:2.75rem;border:1px solid var(--t5-line);border-radius:var(--t5-button-radius);background:var(--t5-bg);color:var(--t5-ink);cursor:pointer}
html[data-ab-taste-engine="5"] .ab-kanban{display:flex;gap:1rem;overflow-x:auto;align-items:flex-start;scroll-snap-type:x proximity}.ab-lane{flex:0 0 min(84vw,20rem);scroll-snap-align:start;padding:.8rem;background:var(--t5-surface-2);border-radius:var(--t5-radius)}.ab-lane>header{display:flex;justify-content:space-between;align-items:center;padding:.4rem .4rem .8rem}.ab-lane>div{display:grid;gap:.65rem}.ab-lane .ab-card{padding:1rem;background:var(--t5-surface);border:1px solid var(--t5-line)}
html[data-ab-taste-engine="5"] .ab-activity ol{list-style:none;padding:0;margin:0;display:grid}.ab-activity li{display:grid;grid-template-columns:1.5rem minmax(0,1fr);gap:.8rem;padding-block:.85rem;border-block-end:1px solid var(--t5-line-soft)}.ab-activity time{display:block;font-family:var(--t5-font-mono);font-size:.7rem;color:var(--t5-muted)}
html[data-ab-taste-engine="5"] .ab-empty-state{display:grid;place-items:center;text-align:center;min-height:14rem;padding:2rem;border:1px dashed var(--t5-line);border-radius:var(--t5-radius);background:var(--t5-surface)}.ab-empty-state>.ab-icon{width:2rem;height:2rem;color:var(--t5-accent)}

html[data-ab-taste-engine="5"] .ab-footer{width:min(calc(100% - 2*var(--t5-gutter)),var(--t5-max-width));margin:clamp(4rem,10vw,9rem) auto 0;padding-block:clamp(2rem,5vw,4rem);display:grid;grid-template-columns:minmax(15rem,1.2fr) repeat(2,minmax(10rem,.5fr));gap:clamp(2rem,5vw,5rem);border-block-start:1px solid var(--t5-line);background:transparent;color:var(--t5-ink)}.ab-footer__brand p{max-width:30ch}.ab-footer nav{display:grid;align-content:start;gap:.55rem}.ab-footer nav strong{font-family:var(--t5-font-mono);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}.ab-footer__meta{grid-column:1/-1;display:flex;justify-content:space-between;gap:1rem;padding-block-start:1rem;border-block-start:1px solid var(--t5-line-soft);color:var(--t5-muted);font-size:.78rem}.ab-t5-footer-closing-statement{grid-template-columns:minmax(0,1fr)}.ab-t5-footer-closing-statement .ab-footer__brand .ab-brand{font-size:clamp(2rem,6vw,6rem)}.ab-t5-footer-compact-legal,.ab-t5-footer-minimal-rule,.ab-t5-footer-quiet-colophon{grid-template-columns:1fr auto;align-items:end}.ab-t5-footer-action-band{padding:clamp(2rem,6vw,5rem);background:var(--t5-ink);color:var(--t5-bg);border-radius:var(--t5-radius-lg)}.ab-t5-footer-editorial-colophon{grid-template-columns:minmax(0,1.5fr) minmax(14rem,.5fr)}

${motionRules()}

@media (max-width:64rem){
  html[data-ab-taste-engine="5"] .ab-header{grid-template-columns:minmax(0,1fr) auto auto;justify-content:stretch}
  html[data-ab-taste-engine="5"] .ab-header>.ab-brand{grid-column:1;min-width:0}
  html[data-ab-taste-engine="5"] .ab-header>.ab-nav-toggle{display:grid;grid-column:3;grid-row:1}
  html[data-ab-taste-engine="5"] .ab-header>.ab-header__actions{grid-column:2;grid-row:1}
  html[data-ab-taste-engine="5"] .ab-header>.ab-nav{grid-column:1/-1;display:none;justify-content:flex-start;flex-wrap:wrap;margin-inline:0;padding-block:.75rem;border-block-start:1px solid var(--t5-line)}
  html[data-ab-taste-engine="5"] .ab-header>.ab-nav[data-open="true"],html[data-ab-taste-engine="5"] .ab-header>.ab-nav.is-open{display:flex}
  html[data-ab-taste-engine="5"] .ab-hero{grid-template-columns:minmax(0,1fr) minmax(15rem,.82fr);gap:2rem}.ab-hero h1{font-size:clamp(2.8rem,7vw,4.8rem)}
  html[data-ab-taste-engine="5"] .ab-feature{grid-column:span 6}.ab-feature:nth-child(n){grid-column:span 6}.ab-gallery>*:nth-child(n){grid-column:span 6}
  html[data-ab-taste-engine="5"] .ab-app-shell{grid-template-columns:5rem minmax(0,1fr)}.ab-sidebar .ab-brand span,.ab-sidebar .ab-link span,.ab-sidebar__foot{display:none}.ab-sidebar .ab-link{justify-content:center}
}
@media (max-width:48rem){
  html[data-ab-taste-engine="5"]{--t5-gutter:1rem;--t5-section-pad:3.75rem;--t5-nav-height:3.8rem}
  html[data-ab-taste-engine="5"] .ab-header{width:calc(100% - 2rem);margin-block-start:0;border-radius:0;padding-inline:0}
  html[data-ab-taste-engine="5"] .ab-header>.ab-header__actions>.ab-button{display:none}
  html[data-ab-taste-engine="5"] .ab-header>.ab-brand span{display:inline}
  html[data-ab-taste-engine="5"] .ab-hero,html[data-ab-taste-engine="5"] [class*="ab-t5-layout-"]{grid-template-columns:minmax(0,1fr)!important;columns:1!important;gap:1.5rem;margin-inline:0;translate:none!important}.ab-t5-macro-asymmetric-field .ab-main>section,.ab-t5-macro-split-studio .ab-main>section,.ab-t5-rhythm-offset .ab-main>section,.ab-t5-rhythm-alternating .ab-main>section{translate:none!important;margin-inline:auto!important}.ab-t5-macro-sticky-narrative .ab-main>section>.ab-lead{position:static}
  html[data-ab-taste-engine="5"] .ab-hero{width:calc(100% - 2rem);min-height:auto;padding-block:3.75rem 5.5rem}.ab-hero h1,.ab-t5-hero-editorial-manifesto h1,.ab-t5-hero-typographic-stage h1{font-size:clamp(2.65rem,13vw,4.5rem);max-width:14ch}.ab-hero__visual{order:0!important}.ab-t5-hero-media-mask .ab-hero__visual{position:absolute;inset:0;order:initial!important}.ab-t5-hero-media-mask .ab-hero__content{max-width:100%}.ab-t5-hero-modular-intro .ab-hero__content,.ab-t5-hero-modular-intro .ab-hero__visual,.ab-t5-hero-split-index .ab-hero__content,.ab-t5-hero-split-index .ab-hero__visual{grid-column:1!important}.ab-hero__visual>.ab-image,.ab-hero__visual .ab-image{height:min(62dvh,32rem)}
  html[data-ab-taste-engine="5"] .ab-t5-layout-full-bleed,html[data-ab-taste-engine="5"] .ab-t5-layout-cinematic{width:100vw!important;margin-inline:calc(50% - 50vw)!important;padding-inline:1rem}
  html[data-ab-taste-engine="5"] .ab-t5-layout-sticky-story>:first-child{position:static}.ab-t5-layout-layered-collage>*:nth-child(n),.ab-t5-layout-modular-bento>*:nth-child(n),.ab-t5-layout-technical-grid>*:nth-child(n),.ab-features__grid>*:nth-child(n),.ab-gallery>*:nth-child(n){grid-column:1/-1!important;grid-row:auto!important;translate:none!important;rotate:none!important}.ab-t5-layout-counterflow>*:nth-child(n){translate:none}
  html[data-ab-taste-engine="5"] .ab-actions{align-items:stretch}.ab-actions .ab-button{width:100%}.ab-button{justify-content:center;max-width:100%}
  html[data-ab-taste-engine="5"] .ab-cta{grid-template-columns:1fr;align-items:start;padding:1.5rem}.ab-cta .ab-actions{width:100%}
  html[data-ab-taste-engine="5"] .ab-steps__list>li{grid-template-columns:3rem minmax(0,1fr)}
  html[data-ab-taste-engine="5"] .ab-app-shell{display:block}.ab-sidebar{position:sticky;top:0;z-index:250;width:100%;height:auto;min-height:3.5rem;display:flex;flex-direction:row;align-items:center;overflow-x:auto;border-inline-end:0;border-block-end:1px solid var(--t5-line)}.ab-sidebar nav{display:flex;margin:0 0 0 auto}.ab-sidebar__foot{display:none}.ab-app-main{padding:1rem}.ab-toolbar{align-items:flex-start;flex-direction:column}.ab-toolbar__actions{width:100%;overflow-x:auto}
  html[data-ab-taste-engine="5"] .ab-table-card__head{align-items:stretch;flex-direction:column}.ab-filter input{width:100%}
  html[data-ab-taste-engine="5"] .ab-footer,html[data-ab-taste-engine="5"] [class*="ab-t5-footer-"]{grid-template-columns:1fr!important;width:calc(100% - 2rem);gap:1.75rem}.ab-footer__meta{flex-direction:column}
}
@media (max-width:25.875rem){html[data-ab-taste-engine="5"] .ab-hero h1{font-size:clamp(2.35rem,12vw,3.35rem)}html[data-ab-taste-engine="5"] :where(.ab-section,.ab-features,.ab-steps,.ab-split,.ab-pricing,.ab-testimonials,.ab-faq,.ab-proof,.ab-cta,.ab-gallery,.ab-article,.ab-logos,.ab-stats){width:calc(100% - 2rem)}.ab-newsletter{flex-direction:column}.ab-dialog{width:calc(100% - 1rem)}}
@media (prefers-reduced-motion:reduce){html[data-ab-taste-engine="5"]{scroll-behavior:auto}.js .ab-t5-motion,.js .ab-t5-motion[class*="ab-t5-enter-"]{opacity:1!important;transform:none!important;translate:none!important;scale:1!important;rotate:0deg!important;filter:none!important;clip-path:none!important;transition:none!important;animation:none!important}.ab-t5-loop-float,.ab-t5-loop-breathe,.ab-t5-loop-pulse,.ab-t5-loop-bob,.ab-t5-loop-sway,.ab-t5-loop-shimmer,.ab-t5-loop-gradient,.ab-t5-loop-spin,.ab-t5-loop-glow,.ab-t5-loop-dash,.ab-t5-loop-marquee>*,.ab-t5-loop-drift,.ab-t5-loop-orbit,.ab-t5-loop-scan::after{animation:none!important}.ab-t5-hover-magnetic,.ab-t5-hover-tilt{transform:none!important}}
@media (forced-colors:active){html[data-ab-taste-engine="5"] :where(.ab-button,.ab-card,.ab-panel,.ab-tier,.ab-field input,.ab-field textarea,.ab-field select){border:1px solid CanvasText!important}.ab-button--solid{background:ButtonFace!important;color:ButtonText!important}}
@media print{html[data-ab-taste-engine="5"] .ab-header,html[data-ab-taste-engine="5"] .ab-footer,html[data-ab-taste-engine="5"] .ab-button{display:none!important}.ab-t5-motion{opacity:1!important;transform:none!important;translate:none!important;filter:none!important}.ab-section,.ab-article{break-inside:avoid}}

${resilienceRules()}
`;
}

export const TASTE5_RUNTIME = String.raw`
;(() => {
  const ready = (callback) => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", callback, { once: true })
    : callback();
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  ready(() => {
    const root = document.documentElement;
    if (root.dataset.abTasteEngine !== "5") return;
    document.querySelectorAll(".ab-t5[class*='ab-motion-']").forEach((element) => element.classList.add("is-ab-visible"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = () => media.matches || root.dataset.motion === "off";
    const authoredMode = root.dataset.abTasteMode;
    if ((authoredMode === "light" || authoredMode === "dark") && !localStorage.getItem("appblocks-theme")) {
      root.dataset.theme = authoredMode;
    }

    const animated = [...document.querySelectorAll(".ab-t5-motion")];
    if (reduced() || !("IntersectionObserver" in window)) {
      animated.forEach((element) => element.classList.add("is-t5-visible"));
    } else {
      const entranceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-t5-visible");
          if (!entry.target.classList.contains("ab-t5-repeat")) entranceObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
      animated.forEach((element) => entranceObserver.observe(element));
    }

    const scrollSelector = [
      ".ab-t5-scroll-parallax-y", ".ab-t5-scroll-parallax-x", ".ab-t5-scroll-scale",
      ".ab-t5-scroll-image-scale", ".ab-t5-scroll-fade", ".ab-t5-scroll-blur",
      ".ab-t5-scroll-tilt", ".ab-t5-scroll-depth", ".ab-t5-scroll-clip",
      ".ab-t5-scroll-progress", ".ab-t5-scroll-reveal", ".ab-t5-scroll-word-reveal",
      ".ab-t5-scroll-counterflow", ".ab-t5-scroll-section-wipe", ".ab-t5-scroll-focus-shift"
    ].join(",");
    const scrollElements = [...document.querySelectorAll(scrollSelector)];
    const nativeTimeline = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    const nativeHandled = new Set(["ab-t5-scroll-parallax-y", "ab-t5-scroll-parallax-x", "ab-t5-scroll-scale", "ab-t5-scroll-image-scale", "ab-t5-scroll-fade", "ab-t5-scroll-clip", "ab-t5-scroll-section-wipe"]);
    const fallbackElements = scrollElements.filter((element) => !nativeTimeline || ![...element.classList].some((name) => nativeHandled.has(name)));
    const active = new Set();
    let frame = 0;
    const tick = () => {
      frame = 0;
      if (document.hidden || reduced()) return;
      const viewport = Math.max(1, window.innerHeight);
      active.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const progress = clamp((viewport - rect.top) / (viewport + Math.max(1, rect.height)));
        element.style.setProperty("--t5-scroll-progress", progress.toFixed(4));
      });
      if (active.size) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && active.size && !reduced() && !document.hidden) frame = requestAnimationFrame(tick);
    };
    if (fallbackElements.length && "IntersectionObserver" in window) {
      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        });
        start();
      }, { rootMargin: "35% 0px 35%", threshold: 0 });
      fallbackElements.forEach((element) => scrollObserver.observe(element));
    }
    document.addEventListener("visibilitychange", start);
    media.addEventListener?.("change", () => {
      if (reduced()) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        animated.forEach((element) => element.classList.add("is-t5-visible"));
      } else start();
    });

    const pointerTargets = [...document.querySelectorAll(".ab-t5-hover-magnetic,.ab-t5-hover-tilt,.ab-t5-hover-spotlight")];
    const resetPointer = (element) => {
      element.style.setProperty("--t5-magnetic-x", "0px");
      element.style.setProperty("--t5-magnetic-y", "0px");
      element.style.setProperty("--t5-tilt-x", "0deg");
      element.style.setProperty("--t5-tilt-y", "0deg");
    };
    const bindPointer = (element) => {
      element.addEventListener("pointermove", (event) => {
        if (!finePointer.matches || reduced()) return;
        const rect = element.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / Math.max(1, rect.width));
        const y = clamp((event.clientY - rect.top) / Math.max(1, rect.height));
        if (element.classList.contains("ab-t5-hover-magnetic")) {
          element.style.setProperty("--t5-magnetic-x", ((x - .5) * 10).toFixed(2) + "px");
          element.style.setProperty("--t5-magnetic-y", ((y - .5) * 8).toFixed(2) + "px");
        }
        if (element.classList.contains("ab-t5-hover-tilt")) {
          element.style.setProperty("--t5-tilt-x", ((.5 - y) * 5).toFixed(2) + "deg");
          element.style.setProperty("--t5-tilt-y", ((x - .5) * 6).toFixed(2) + "deg");
        }
        if (element.classList.contains("ab-t5-hover-spotlight")) {
          element.style.setProperty("--t5-spot-x", (x * 100).toFixed(1) + "%");
          element.style.setProperty("--t5-spot-y", (y * 100).toFixed(1) + "%");
        }
      });
      element.addEventListener("pointerleave", () => resetPointer(element));
    };
    pointerTargets.forEach(bindPointer);

    document.querySelectorAll(".ab-t5-press-ripple,.ab-button").forEach((element) => {
      element.addEventListener("pointerdown", (event) => {
        if (reduced() || element.matches(":disabled,[aria-disabled='true']")) return;
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ab-t5-ripple";
        ripple.style.left = (event.clientX - rect.left) + "px";
        ripple.style.top = (event.clientY - rect.top) + "px";
        ripple.setAttribute("aria-hidden", "true");
        element.append(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      });
    });

    const header = document.querySelector(".ab-header--sticky");
    if (header && "IntersectionObserver" in window) {
      const sentinel = document.createElement("span");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText = "position:absolute;inline-size:1px;block-size:1px;inset:0 auto auto 0;pointer-events:none";
      document.body.prepend(sentinel);
      const headerObserver = new IntersectionObserver(([entry]) => header.classList.toggle("is-t5-compact", !entry.isIntersecting), { threshold: 0 });
      headerObserver.observe(sentinel);
    }
  });
})();
`;
