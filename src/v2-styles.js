export const V2_STATIC_CSS = String.raw`
/* AppBlocks Web 0.2 combinatorial design layer */
:where(body[class*="ab-recipe-"]) {
  background:
    radial-gradient(circle at 10% -10%, color-mix(in srgb, var(--ab-accent) 13%, transparent), transparent 34rem),
    radial-gradient(circle at 92% 12%, color-mix(in srgb, var(--ab-accent-2) 10%, transparent), transparent 30rem),
    var(--ab-bg);
  color: var(--ab-ink);
  font-family: var(--ab-body, ui-sans-serif, system-ui, sans-serif);
}
:where(body[class*="ab-recipe-"]) :is(h1,h2,h3,h4,.ab-title,.ab-heading) {
  font-family: var(--ab-display, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: var(--ab-display-track, -.035em);
  text-wrap: balance;
}
:where(body[class*="ab-recipe-"]) :is(.ab-panel,.ab-card,.ab-feature,.ab-tier,.ab-metric,.ab-stat,.ab-dialog,.ab-callout) {
  border-radius: var(--ab-radius, .45rem);
}
:where(body[class*="ab-recipe-"]) :is(.ab-panel,.ab-card,.ab-feature,.ab-tier,.ab-dialog) {
  box-shadow: var(--ab-shadow-md, 0 12px 30px rgba(15,23,42,.1));
}
:where(body[class*="ab-recipe-"]) .ab-button {
  border-radius: min(var(--ab-radius, .45rem), 1.1rem);
}

/* System directions */
.ab-system-signal { --ab-display-track: -.055em; }
.ab-system-signal :is(.ab-eyebrow,.ab-badge,.ab-tag) { text-transform: uppercase; letter-spacing: .13em; }
.ab-system-editorial { --ab-display-track: -.025em; }
.ab-system-editorial :is(.ab-section,.ab-hero) { border-block-start: 1px solid var(--ab-line); }
.ab-system-blueprint { background-image: linear-gradient(color-mix(in srgb,var(--ab-line) 35%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--ab-line) 35%,transparent) 1px,transparent 1px); background-size: 24px 24px; }
.ab-system-aurora { background-image: radial-gradient(circle at 18% 2%,color-mix(in srgb,var(--ab-accent) 22%,transparent),transparent 30rem),radial-gradient(circle at 83% 8%,color-mix(in srgb,var(--ab-accent-2) 20%,transparent),transparent 32rem); }
.ab-system-brutalist { --ab-radius: 0; --ab-shadow-md: 6px 6px 0 var(--ab-ink); }
.ab-system-brutalist :is(.ab-button,.ab-panel,.ab-card,.ab-feature) { border-width: 2px; }
.ab-system-glass :is(.ab-panel,.ab-card,.ab-header,.ab-dialog) { background: color-mix(in srgb,var(--ab-surface) 72%,transparent); backdrop-filter: blur(18px) saturate(1.25); }
.ab-system-paper :is(.ab-panel,.ab-card,.ab-feature,.ab-tier) { background-image: linear-gradient(115deg,color-mix(in srgb,var(--ab-ink) 2%,transparent),transparent 40%); }
.ab-system-terminal { --ab-display: var(--ab-mono); --ab-body: var(--ab-mono); }
.ab-system-terminal :is(.ab-panel,.ab-card,.ab-feature) { border-style: dashed; }
.ab-system-luxury { --ab-display-track: -.015em; }
.ab-system-luxury :is(.ab-section,.ab-hero) { padding-block: calc(var(--ab-space-8,6rem) * 1.18); }
.ab-system-playful { --ab-radius: 1.25rem; }
.ab-system-playful :is(.ab-card,.ab-feature):nth-child(2n) { transform: rotate(.35deg); }
.ab-system-industrial { --ab-radius: .15rem; }
.ab-system-industrial :is(.ab-eyebrow,.ab-badge,.ab-tag) { font-family: var(--ab-mono); text-transform: uppercase; letter-spacing: .1em; }
.ab-system-organic { --ab-radius: 1.4rem .4rem 1.7rem .65rem; }
.ab-system-minimal :is(.ab-panel,.ab-card,.ab-feature,.ab-tier) { box-shadow: none; }
.ab-system-maximal :is(.ab-title,h1) { font-size: clamp(3.5rem,11vw,9rem); line-height: .86; }
.ab-system-dashboard { --ab-density: .82; }
.ab-system-dashboard :is(.ab-panel,.ab-card,.ab-table-card) { box-shadow: 0 1px 2px rgba(0,0,0,.06); }
.ab-system-spatial :is(.ab-panel,.ab-card,.ab-feature) { transform-style: preserve-3d; perspective: 900px; }
.ab-system-retro { --ab-radius: .2rem; }
.ab-system-retro :is(.ab-button,.ab-card,.ab-panel) { box-shadow: 4px 4px 0 color-mix(in srgb,var(--ab-accent) 45%,var(--ab-ink)); }
.ab-system-cinematic :is(.ab-hero,.ab-section) { min-height: min(92svh,62rem); align-content: center; }

/* Combinatorial axis classes shared by all virtual families */
[class*="abx-style-"] { --abx-border: 1px solid var(--ab-line); --abx-lift: 0; }
.abx-style-0 { --abx-fill: var(--ab-surface); --abx-border: 1px solid var(--ab-line); }
.abx-style-1 { --abx-fill: var(--ab-paper-2); --abx-border: 1px solid transparent; }
.abx-style-2 { --abx-fill: var(--ab-accent-soft); --abx-border: 1px solid color-mix(in srgb,var(--ab-accent) 30%,var(--ab-line)); }
.abx-style-3 { --abx-fill: var(--ab-ink); --abx-text: var(--ab-paper); --abx-border: 1px solid var(--ab-ink); }
.abx-style-4 { --abx-fill: transparent; --abx-border: 1px dashed var(--ab-line-strong); }
.abx-style-5 { --abx-fill: linear-gradient(135deg,color-mix(in srgb,var(--ab-accent) 16%,var(--ab-surface)),var(--ab-surface)); --abx-border: 1px solid color-mix(in srgb,var(--ab-accent) 28%,var(--ab-line)); }
.abx-style-6 { --abx-fill: color-mix(in srgb,var(--ab-surface) 76%,transparent); --abx-border: 1px solid color-mix(in srgb,var(--ab-paper) 40%,var(--ab-line)); backdrop-filter: blur(16px); }
.abx-style-7 { --abx-fill: var(--ab-surface); --abx-border: 2px solid var(--ab-ink); }
.abx-style-8 { --abx-fill: repeating-linear-gradient(-45deg,var(--ab-paper),var(--ab-paper) 8px,var(--ab-paper-2) 8px,var(--ab-paper-2) 9px); --abx-border: 1px solid var(--ab-line); }
.abx-style-9 { --abx-fill: linear-gradient(135deg,var(--ab-accent),var(--ab-accent-2)); --abx-text: white; --abx-border: 0; }
.abx-style-10 { --abx-fill: var(--ab-paper); --abx-border: 1px solid var(--ab-line); --abx-lift: -3px; }
.abx-style-11 { --abx-fill: transparent; --abx-border: 0; }

.abx-shape-0 { --abx-radius: 0; }
.abx-shape-1 { --abx-radius: .35rem; }
.abx-shape-2 { --abx-radius: .75rem; }
.abx-shape-3 { --abx-radius: 1.35rem; }
.abx-shape-4 { --abx-radius: 999px; }
.abx-shape-5 { --abx-radius: .2rem 1.4rem .2rem 1.4rem; }
.abx-shape-6 { --abx-radius: 1.4rem .2rem 1.4rem .2rem; }
.abx-shape-7 { --abx-radius: 2.4rem 2.4rem .45rem .45rem; }
.abx-shape-8 { --abx-radius: 38% 62% 56% 44% / 46% 38% 62% 54%; }
.abx-shape-9 { --abx-radius: .3rem 1.7rem .7rem 1.15rem; }

.abx-depth-0 { --abx-shadow: none; }
.abx-depth-1 { --abx-shadow: 0 1px 2px rgba(15,23,42,.08); }
.abx-depth-2 { --abx-shadow: 0 8px 24px rgba(15,23,42,.08); }
.abx-depth-3 { --abx-shadow: 0 16px 42px rgba(15,23,42,.12); }
.abx-depth-4 { --abx-shadow: 0 25px 75px rgba(15,23,42,.16); }
.abx-depth-5 { --abx-shadow: 5px 5px 0 color-mix(in srgb,var(--ab-ink) 25%,transparent); }
.abx-depth-6 { --abx-shadow: 0 0 0 1px color-mix(in srgb,var(--ab-accent) 30%,transparent),0 20px 70px color-mix(in srgb,var(--ab-accent) 22%,transparent); }
.abx-depth-7 { --abx-shadow: 0 1px 2px rgba(0,0,0,.08),0 12px 28px rgba(0,0,0,.12),0 34px 90px rgba(0,0,0,.1); }

.abx-density-0 { --abx-pad: .65rem; --abx-gap: .45rem; }
.abx-density-1 { --abx-pad: .85rem; --abx-gap: .6rem; }
.abx-density-2 { --abx-pad: 1rem; --abx-gap: .75rem; }
.abx-density-3 { --abx-pad: 1.25rem; --abx-gap: .9rem; }
.abx-density-4 { --abx-pad: 1.5rem; --abx-gap: 1rem; }
.abx-density-5 { --abx-pad: 1.8rem; --abx-gap: 1.2rem; }
.abx-density-6 { --abx-pad: 2.2rem; --abx-gap: 1.5rem; }
.abx-density-7 { --abx-pad: 2.8rem; --abx-gap: 1.8rem; }

/* Virtual headers */
.ab-header[class*="abx-header"] {
  background: var(--abx-fill,var(--ab-surface));
  color: var(--abx-text,var(--ab-ink));
  border: var(--abx-border,1px solid var(--ab-line));
  border-radius: var(--abx-radius,var(--ab-radius));
  box-shadow: var(--abx-shadow,var(--ab-shadow-md));
  padding: max(.6rem,var(--abx-pad,.9rem));
}
.ab-header.abx-layout-1 { grid-template-columns: 1fr auto 1fr; }
.ab-header.abx-layout-1 .ab-brand { justify-self: center; }
.ab-header.abx-layout-2 { border-inline: 0; border-radius: 0; width: 100%; }
.ab-header.abx-layout-3 { margin-top: 1rem; }
.ab-header.abx-layout-4 { backdrop-filter: blur(20px) saturate(1.25); background: color-mix(in srgb,var(--ab-surface) 78%,transparent); }
.ab-header.abx-layout-5 { box-shadow: none; border-width: 0 0 1px; border-radius: 0; }
.ab-header.abx-layout-6 { border: 2px solid var(--ab-ink); }
.ab-header.abx-layout-7 .ab-nav { font-family: var(--ab-mono); text-transform: uppercase; letter-spacing: .08em; font-size: .78rem; }
.ab-header.abx-layout-8 { max-width: 72rem; }
.ab-header.abx-layout-9 { transform: translateY(.5rem); }

/* Virtual buttons */
.ab-button[class*="abx-button"] {
  position: relative;
  isolation: isolate;
  min-height: 44px;
  gap: .55rem;
  overflow: hidden;
  padding: max(.58rem,var(--abx-pad,.75rem)) max(.9rem,calc(var(--abx-pad,1rem) * 1.45));
  border: var(--abx-border,1px solid var(--ab-line));
  border-radius: var(--abx-radius,var(--ab-radius));
  background: var(--abx-fill,var(--ab-accent));
  color: var(--abx-text,var(--ab-ink));
  box-shadow: var(--abx-shadow,none);
  transform: translateY(var(--abx-lift,0));
  transition: transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s ease,filter .22s ease,background .22s ease;
}
.ab-button[class*="abx-button"]::after { content:""; position:absolute; inset:0; z-index:-1; background:linear-gradient(110deg,transparent 18%,rgba(255,255,255,.32),transparent 58%); transform:translateX(-130%); transition:transform .55s ease; }
.ab-button[class*="abx-button"]:hover { transform: translateY(calc(var(--abx-lift,0) - 2px)); filter: saturate(1.08); }
.ab-button[class*="abx-button"]:hover::after { transform:translateX(130%); }
.ab-button[class*="abx-button"]:active { transform:translateY(1px) scale(.985); }
.ab-button.abx-layout-1 { width:100%; justify-content:center; }
.ab-button.abx-layout-2 { aspect-ratio:1; width:44px; padding:0; justify-content:center; }
.ab-button.abx-layout-3 { text-transform:uppercase; letter-spacing:.1em; font:700 .72rem/1 var(--ab-mono); }
.ab-button.abx-layout-4 { border-inline-width:0; border-radius:0; }
.ab-button.abx-layout-5 { transform:rotate(-1deg); }
.ab-button.abx-layout-6 { transform:rotate(1deg); }
.ab-button.abx-layout-7 { box-shadow:inset 0 -3px 0 rgba(0,0,0,.18),var(--abx-shadow,none); }
.ab-button.abx-layout-8 { background:transparent; border-color:transparent; text-decoration:underline; text-underline-offset:.35em; }
.ab-button.abx-layout-9 { border-radius:999px; }

/* Frames, panels, cards and sections */
:is(.ab-panel,.ab-card,.ab-feature,.ab-section)[class*="abx-"] {
  border: var(--abx-border,1px solid var(--ab-line));
  border-radius: var(--abx-radius,var(--ab-radius));
  background: var(--abx-fill,var(--ab-surface));
  color: var(--abx-text,var(--ab-ink));
  box-shadow: var(--abx-shadow,var(--ab-shadow-md));
}
:is(.ab-panel,.ab-card,.ab-feature)[class*="abx-"] { padding:var(--abx-pad,1rem); gap:var(--abx-gap,.75rem); }
:is(.ab-panel,.ab-card,.ab-feature)[class*="abx-"]:hover { transform:translateY(var(--abx-lift,0)); }
.abx-frame { position:relative; isolation:isolate; overflow:clip; }
.abx-frame::before { content:""; position:absolute; inset:.45rem; z-index:-1; border:1px solid color-mix(in srgb,var(--ab-line) 72%,transparent); border-radius:calc(var(--abx-radius,var(--ab-radius)) * .72); pointer-events:none; }
.abx-browser-frame { padding-top:3.2rem !important; overflow:clip; }
.abx-browser-frame::after { content:"●  ●  ●"; position:absolute; inset:0 0 auto; height:2.35rem; display:flex; align-items:center; padding-inline:1rem; color:var(--ab-muted); letter-spacing:.35em; border-bottom:1px solid var(--ab-line); background:var(--ab-paper-2); }
.abx-device-frame { max-width:26rem; margin-inline:auto; border-width:.55rem !important; border-color:var(--ab-ink) !important; border-radius:2.5rem !important; }
.abx-window-frame { padding-top:2.7rem !important; }
.abx-window-frame::after { content:"APPBLOCKS / WINDOW"; position:absolute; inset:0 0 auto; height:2rem; display:flex; align-items:center; padding-inline:.8rem; border-bottom:1px solid var(--ab-line); background:var(--ab-paper-2); color:var(--ab-muted); font:600 .65rem/1 var(--ab-mono); letter-spacing:.08em; }
.abx-glass-panel { background:color-mix(in srgb,var(--ab-surface) 68%,transparent) !important; backdrop-filter:blur(20px) saturate(1.3); }
.abx-floating-panel { transform:translateY(-.5rem); box-shadow:0 30px 100px rgba(15,23,42,.2) !important; }
.abx-sticky-note { transform:rotate(-.65deg); background:color-mix(in srgb,#ffe97d 74%,var(--ab-paper)) !important; color:#29200a !important; box-shadow:5px 7px 18px rgba(78,57,0,.16) !important; }
.abx-media-card,.abx-profile-card,.abx-product-card { overflow:clip; }
.abx-comparison-card { border-left:4px solid var(--ab-accent) !important; }

/* Decorative shapes are isolated so complex layout containers never get clipped. */
:is(.abx-shape,.abx-blob,.abx-backdrop) { min-height:10rem; overflow:clip; }
.abx-shape { border-radius:var(--abx-radius,var(--ab-radius)); background:linear-gradient(135deg,var(--ab-accent-soft),color-mix(in srgb,var(--ab-accent) 22%,var(--ab-paper))); }
.abx-blob { border:0 !important; border-radius:42% 58% 63% 37% / 45% 35% 65% 55% !important; background:linear-gradient(135deg,var(--ab-accent),var(--ab-accent-2)) !important; animation:abx-morph 12s ease-in-out infinite alternate; }
.abx-backdrop { position:absolute; inset:0; z-index:-1; pointer-events:none; opacity:.55; background:radial-gradient(circle at 20% 20%,var(--ab-accent-soft),transparent 35%),radial-gradient(circle at 80% 40%,color-mix(in srgb,var(--ab-accent-2) 28%,transparent),transparent 38%); filter:blur(10px); }
@keyframes abx-morph { 50% { border-radius:63% 37% 42% 58% / 35% 58% 42% 65%; transform:rotate(5deg) scale(1.03); } }

/* Hero and marketing composition families */
.ab-hero[class*="abx-hero"] { position:relative; overflow:clip; border-radius:var(--abx-radius,var(--ab-radius)); background:var(--abx-fill,transparent); box-shadow:var(--abx-shadow,none); }
.ab-hero.abx-layout-1 { grid-template-columns:minmax(0,.8fr) minmax(24rem,1.2fr); }
.ab-hero.abx-layout-2 { grid-template-columns:1fr; text-align:center; }
.ab-hero.abx-layout-2 .ab-hero__content { margin-inline:auto; align-items:center; }
.ab-hero.abx-layout-3 { min-height:min(90svh,60rem); align-items:end; }
.ab-hero.abx-layout-4 { border:1px solid var(--ab-line); padding-inline:clamp(1rem,5vw,5rem); }
.ab-hero.abx-layout-5::before { content:""; position:absolute; width:28rem; aspect-ratio:1; right:-8rem; top:-10rem; border:1px solid var(--ab-line); border-radius:50%; box-shadow:0 0 0 3rem color-mix(in srgb,var(--ab-accent) 5%,transparent),0 0 0 7rem color-mix(in srgb,var(--ab-accent) 4%,transparent); }
.ab-hero.abx-layout-6 { background-image:linear-gradient(var(--ab-line) 1px,transparent 1px),linear-gradient(90deg,var(--ab-line) 1px,transparent 1px); background-size:36px 36px; }
.ab-hero.abx-layout-7 .ab-title { font-family:var(--ab-mono); }
.ab-hero.abx-layout-8 { transform:rotate(-.25deg); }
.ab-hero.abx-layout-9 { min-height:min(96svh,70rem); }
.abx-hero-canvas { isolation:isolate; }
.abx-hero-canvas::after { content:""; position:absolute; inset:10% -5% auto auto; z-index:-1; width:clamp(16rem,38vw,38rem); aspect-ratio:1; border-radius:50%; background:conic-gradient(from 45deg,var(--ab-accent),var(--ab-accent-soft),var(--ab-accent-2),var(--ab-accent)); filter:blur(32px); opacity:.42; animation:abx-spin 18s linear infinite; }
@keyframes abx-spin { to { transform:rotate(1turn); } }
.abx-feature-wall .ab-feature:nth-child(3n+1) { grid-column:span 7; }
.abx-feature-wall .ab-feature:nth-child(3n+2) { grid-column:span 5; }
.abx-feature-wall .ab-feature:nth-child(3n) { grid-column:span 12; }
.abx-logo-cloud { overflow:hidden; mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent); }
.abx-social-proof { border-block:1px solid var(--ab-line); }

/* Carousel, marquee and ticker */
.abx-carousel { position:relative; overflow:clip; }
.abx-carousel [data-abx-slide] { transition:opacity .45s ease,transform .45s cubic-bezier(.2,.8,.2,1); }
.abx-carousel [data-abx-slide][hidden] { display:block !important; position:absolute; inset:0; opacity:0; transform:translateX(4%); pointer-events:none; visibility:hidden; }
.abx-carousel__controls { display:flex; align-items:center; justify-content:flex-end; gap:.5rem; margin-top:1rem; }
.abx-carousel__controls button { display:inline-grid; place-items:center; min-width:44px; min-height:44px; border:1px solid var(--ab-line); border-radius:var(--ab-radius); background:var(--ab-surface); color:var(--ab-ink); }
.abx-carousel__status { min-width:4rem; text-align:center; color:var(--ab-muted); font:.75rem/1 var(--ab-mono); }
.abx-marquee,.abx-ticker { overflow:hidden; white-space:nowrap; mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent); }
.abx-marquee > *,.abx-ticker > * { width:max-content; animation:abx-marquee var(--abx-marquee-speed,28s) linear infinite; }
.abx-opt-speed-fast > * { --abx-marquee-speed:14s; }
.abx-opt-speed-slow > * { --abx-marquee-speed:48s; }
.abx-opt-direction-reverse > * { animation-direction:reverse; }
@keyframes abx-marquee { to { transform:translateX(-50%); } }

/* Drawers, dropdowns, popovers and command palette */
.abx-drawer { position:fixed !important; z-index:180; inset:0 0 0 auto; width:min(34rem,92vw); height:100dvh; margin:0; overflow:auto; border-radius:0 !important; transform:translateX(105%); transition:transform .34s cubic-bezier(.2,.8,.2,1); visibility:hidden; }
.abx-drawer.is-abx-open { transform:none; visibility:visible; }
.abx-drawer-backdrop { position:fixed; z-index:170; inset:0; border:0; background:rgba(0,0,0,.48); backdrop-filter:blur(2px); }
.abx-dropdown,.abx-popover,.abx-context-menu { position:relative; }
.abx-dropdown > :last-child,.abx-popover > :last-child,.abx-context-menu > :last-child { position:absolute; z-index:90; top:calc(100% + .5rem); right:0; min-width:min(20rem,90vw); padding:.65rem; border:1px solid var(--ab-line); border-radius:var(--ab-radius); background:var(--ab-surface); box-shadow:0 20px 60px rgba(15,23,42,.18); }
.abx-dropdown:not(.is-abx-open) > :last-child,.abx-popover:not(.is-abx-open) > :last-child,.abx-context-menu:not(.is-abx-open) > :last-child { display:none; }
.abx-command-palette { position:fixed !important; z-index:220; top:12vh; left:50%; width:min(46rem,calc(100% - 1.5rem)); max-height:72vh; overflow:auto; transform:translate(-50%,-12px); opacity:0; visibility:hidden; transition:opacity .2s ease,transform .2s ease; }
.abx-command-palette.is-abx-open { opacity:1; transform:translate(-50%,0); visibility:visible; }
.abx-command-palette::before { content:"Search commands · Esc to close"; display:block; margin-bottom:.8rem; color:var(--ab-muted); font:.72rem/1.4 var(--ab-mono); }
.abx-command-backdrop { position:fixed; z-index:210; inset:0; background:rgba(0,0,0,.5); backdrop-filter:blur(5px); }
.abx-tooltip { position:relative; cursor:help; }
.abx-tooltip::after { content:attr(data-abx-tooltip); position:absolute; z-index:100; left:50%; bottom:calc(100% + .55rem); width:max-content; max-width:18rem; padding:.45rem .65rem; border-radius:.35rem; background:var(--ab-ink); color:var(--ab-paper); font:.72rem/1.35 var(--ab-body); transform:translate(-50%,.25rem); opacity:0; pointer-events:none; transition:opacity .16s ease,transform .16s ease; }
.abx-tooltip:hover::after,.abx-tooltip:focus-visible::after { opacity:1; transform:translate(-50%,0); }

/* Dock, mega menu and pagination */
.abx-nav-dock { position:fixed; z-index:120; left:50%; bottom:1rem; transform:translateX(-50%); display:flex; gap:.35rem; width:max-content; max-width:calc(100% - 1rem); padding:.45rem; overflow:auto; border:1px solid var(--ab-line); border-radius:999px; background:color-mix(in srgb,var(--ab-surface) 82%,transparent); box-shadow:0 18px 60px rgba(15,23,42,.18); backdrop-filter:blur(18px); }
.abx-pagination { display:flex; justify-content:center; gap:.35rem; }
.abx-pagination :is(a,button) { min-width:44px; min-height:44px; display:grid; place-items:center; border:1px solid var(--ab-line); border-radius:var(--ab-radius); }
.abx-mega-menu { display:grid; grid-template-columns:repeat(auto-fit,minmax(12rem,1fr)); gap:1rem; width:min(70rem,calc(100vw - 2rem)); }

/* Application controls */
.abx-segmented [role="tablist"] { width:max-content; max-width:100%; padding:.25rem; border:1px solid var(--ab-line); border-radius:999px; background:var(--ab-paper-2); overflow:auto; }
.abx-segmented [role="tab"] { border-radius:999px; }
.abx-counter [data-abx-number] { font-variant-numeric:tabular-nums; }
.abx-gauge { position:relative; overflow:hidden; }
.abx-gauge::after { content:""; display:block; width:8rem; max-width:100%; aspect-ratio:2/1; margin-top:.75rem; border-radius:8rem 8rem 0 0; background:conic-gradient(from 270deg at 50% 100%,var(--ab-accent) calc(var(--ab-progress,50) * .5%),var(--ab-paper-2) 0 50%,transparent 0); }
.abx-range input[type="range"] { width:100%; accent-color:var(--ab-accent); }
.abx-file-drop { padding:1.5rem; border:2px dashed var(--ab-line-strong); border-radius:var(--ab-radius); background:var(--ab-paper-2); transition:border-color .2s ease,background .2s ease; }
.abx-file-drop.is-abx-dragging { border-color:var(--ab-accent); background:var(--ab-accent-soft); }
.abx-switch input[type="checkbox"] { appearance:none; width:3.2rem; height:1.8rem; padding:.2rem; border:1px solid var(--ab-line-strong); border-radius:999px; background:var(--ab-paper-2); transition:background .2s ease; }
.abx-switch input[type="checkbox"]::before { content:""; display:block; width:1.3rem; aspect-ratio:1; border-radius:50%; background:var(--ab-muted); transition:transform .2s ease,background .2s ease; }
.abx-switch input[type="checkbox"]:checked { background:var(--ab-accent-soft); }
.abx-switch input[type="checkbox"]:checked::before { transform:translateX(1.35rem); background:var(--ab-accent); }
.abx-rating input[type="range"] { accent-color:#d99a00; }
.abx-skeleton { min-height:8rem; color:transparent !important; background:linear-gradient(100deg,var(--ab-paper-2) 30%,color-mix(in srgb,var(--ab-paper) 80%,var(--ab-accent-soft)) 48%,var(--ab-paper-2) 66%); background-size:240% 100%; animation:abx-skeleton 1.4s linear infinite; }
@keyframes abx-skeleton { to { background-position-x:-240%; } }
.abx-avatar { display:inline-grid; place-items:center; width:2.35rem; height:2.35rem; padding:0; overflow:hidden; border-radius:50% !important; background:var(--ab-accent-soft); color:var(--ab-accent-2); font-weight:800; }
.abx-avatars { display:flex !important; flex-direction:row !important; gap:0 !important; }
.abx-avatars > * + * { margin-left:-.55rem; }
.abx-data-grid { --ab-table-row-min:46px; }
.abx-calendar td { aspect-ratio:1; min-width:3rem; vertical-align:top; }
.abx-chat { max-height:38rem; overflow:auto; }
.abx-message { max-width:min(36rem,86%); padding:.75rem 1rem; border-radius:1rem 1rem 1rem .2rem; background:var(--ab-paper-2); }
.abx-message:nth-child(2n) { margin-left:auto; border-radius:1rem 1rem .2rem 1rem; background:var(--ab-accent-soft); }
.abx-tree { --ab-tree-depth:0; }
.abx-tree .abx-tree-item { padding-left:calc(1rem + var(--ab-tree-depth) * 1rem); border-left:1px solid var(--ab-line); }
.abx-split-pane { resize:horizontal; overflow:auto; }
.abx-filter-bar,.abx-action-bar { position:sticky; z-index:20; top:.5rem; padding:.7rem; border:1px solid var(--ab-line); border-radius:var(--ab-radius); background:color-mix(in srgb,var(--ab-surface) 88%,transparent); backdrop-filter:blur(14px); }
.abx-auth-shell { max-width:72rem; margin-inline:auto; min-height:min(85svh,56rem); }

/* Visuals */
.abx-orbit,.abx-particles,.abx-constellation { position:relative; min-height:24rem; overflow:hidden; isolation:isolate; }
.abx-orbit::before,.abx-orbit::after { content:""; position:absolute; left:50%; top:50%; width:58%; aspect-ratio:1; border:1px solid var(--ab-line); border-radius:50%; transform:translate(-50%,-50%); animation:abx-spin 18s linear infinite; }
.abx-orbit::after { width:32%; animation-direction:reverse; animation-duration:11s; box-shadow:0 0 0 5rem color-mix(in srgb,var(--ab-accent) 5%,transparent); }
.abx-particles { background-image:radial-gradient(circle,var(--ab-accent) 1px,transparent 1.5px),radial-gradient(circle,var(--ab-accent-2) 1px,transparent 1.5px); background-position:0 0,17px 21px; background-size:34px 34px; animation:abx-particles 20s linear infinite; }
@keyframes abx-particles { to { background-position:68px 34px,85px 55px; } }
.abx-constellation { background-image:radial-gradient(circle at 20% 22%,var(--ab-accent) 0 2px,transparent 3px),radial-gradient(circle at 71% 34%,var(--ab-accent-2) 0 2px,transparent 3px),radial-gradient(circle at 43% 76%,var(--ab-accent) 0 2px,transparent 3px),linear-gradient(28deg,transparent 49.7%,color-mix(in srgb,var(--ab-line) 65%,transparent) 50%,transparent 50.3%); }
.abx-terminal-window pre { color:#c9f7d5; background:#07130b; }
.abx-code-window { box-shadow:0 22px 70px rgba(15,23,42,.18); }

/* Scroll progress */
.abx-scroll-progress { position:fixed; z-index:260; inset:0 0 auto; width:var(--abx-scroll,0%); height:3px; margin:0; border:0; background:linear-gradient(90deg,var(--ab-accent),var(--ab-accent-2)); transform-origin:left; }

/* Entry and interaction motion. The runtime applies is-abx-visible after it loads. */
.js :is(.abx-motion-1,.abx-motion-2,.abx-motion-3,.abx-motion-4,.abx-motion-5,.abx-motion-6,.abx-motion-7,.abx-motion-8,.abx-motion-9):not(.is-abx-visible) { opacity:0; }
.js .abx-motion-1:not(.is-abx-visible) { transform:translateY(16px); }
.js .abx-motion-2:not(.is-abx-visible) { transform:translateX(-20px); }
.js .abx-motion-3:not(.is-abx-visible) { transform:translateX(20px); }
.js .abx-motion-4:not(.is-abx-visible) { transform:scale(.94); }
.js .abx-motion-5:not(.is-abx-visible) { filter:blur(10px); transform:translateY(10px); }
.js .abx-motion-6:not(.is-abx-visible) { transform:perspective(800px) rotateX(12deg); transform-origin:top; }
.js .abx-motion-7:not(.is-abx-visible) { transform:scale(.82) rotate(-1deg); }
.js .abx-motion-8:not(.is-abx-visible) { transform:translateY(24px); }
.js .abx-motion-9:not(.is-abx-visible) { transform:translate3d(0,var(--abx-parallax,18px),0); }
.js :is(.abx-motion-1,.abx-motion-2,.abx-motion-3,.abx-motion-4,.abx-motion-5,.abx-motion-6,.abx-motion-7,.abx-motion-8,.abx-motion-9) { transition:opacity .65s cubic-bezier(.2,.8,.2,1),transform .65s cubic-bezier(.2,.8,.2,1),filter .65s ease; transition-delay:var(--abx-delay,0ms); }
.abx-motion-10 { animation:abx-float 5s ease-in-out infinite; }
.abx-motion-11 { transition:transform .15s ease-out; }
@keyframes abx-float { 50% { transform:translateY(-8px); } }

.abx-ripple { position:absolute; width:1rem; aspect-ratio:1; border-radius:50%; background:currentColor; opacity:.18; pointer-events:none; transform:translate(-50%,-50%) scale(0); animation:abx-ripple .6s ease-out; }
@keyframes abx-ripple { to { opacity:0; transform:translate(-50%,-50%) scale(16); } }
.abx-toast-region { position:fixed; z-index:300; right:1rem; bottom:1rem; display:grid; gap:.5rem; width:min(24rem,calc(100% - 2rem)); }
.abx-toast { display:flex; align-items:flex-start; gap:.65rem; padding:.85rem 1rem; border:1px solid var(--ab-line-strong); border-radius:var(--ab-radius); background:var(--ab-ink); color:var(--ab-paper); box-shadow:0 20px 60px rgba(0,0,0,.24); animation:abx-toast-in .28s ease-out; }
@keyframes abx-toast-in { from { opacity:0; transform:translateY(12px) scale(.97); } }

@media (max-width: 980px) {
  .ab-header.abx-layout-1 { grid-template-columns:auto auto 1fr; }
  .abx-feature-wall .ab-feature { grid-column:span 6 !important; }
  .abx-mega-menu { width:calc(100vw - 1rem); }
}
@media (max-width: 760px) {
  .ab-hero[class*="abx-hero"] { grid-template-columns:1fr; min-height:auto; }
  .abx-feature-wall .ab-feature { grid-column:1 / -1 !important; }
  .abx-drawer { width:100%; }
  .abx-nav-dock { left:.5rem; right:.5rem; transform:none; width:auto; justify-content:flex-start; }
  .abx-browser-frame { padding-top:2.9rem !important; }
  .abx-device-frame { max-width:100%; }
  .abx-split-pane { resize:none; }
}
@media (max-width: 520px) {
  .ab-button[class*="abx-button"]:not(.abx-layout-2) { width:100%; justify-content:center; }
  .abx-command-palette { top:.75rem; max-height:calc(100dvh - 1.5rem); }
  .abx-carousel__controls { justify-content:space-between; }
}
@media (prefers-reduced-motion: reduce) {
  .abx-blob,.abx-hero-canvas::after,.abx-marquee > *,.abx-ticker > *,.abx-motion-10,.abx-particles,.abx-orbit::before,.abx-orbit::after { animation:none !important; }
  .js [class*="abx-motion-"]:not(.is-abx-visible) { opacity:1 !important; transform:none !important; filter:none !important; }
}
html[data-motion="off"] .abx-blob,html[data-motion="off"] .abx-hero-canvas::after,html[data-motion="off"] .abx-marquee > *,html[data-motion="off"] .abx-ticker > * { animation:none !important; }
html[data-motion="off"] .js [class*="abx-motion-"]:not(.is-abx-visible) { opacity:1 !important; transform:none !important; filter:none !important; }
@media (forced-colors: active) {
  [class*="abx-"] { backdrop-filter:none !important; }
  .abx-scroll-progress,.abx-switch input::before { forced-color-adjust:none; }
}
@media print {
  .abx-nav-dock,.abx-scroll-progress,.abx-carousel__controls,.abx-drawer-backdrop,.abx-command-backdrop { display:none !important; }
  .abx-drawer,.abx-command-palette { position:static !important; transform:none !important; visibility:visible !important; opacity:1 !important; }
}
`;
