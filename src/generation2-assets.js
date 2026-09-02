import { DENSITIES, MOTIONS, SHADOWS, SHAPES, SURFACES, resolveDesign } from "./generation2.js";

const RADIUS_VALUES = Object.freeze([
  "0", ".35rem", ".7rem", "999px", ".2rem .9rem", ".2rem 1rem .2rem 1rem", "0 1rem 0 1rem", "1.2rem",
  "2rem 2rem .6rem .6rem", "999px", ".2rem", ".4rem", "1.6rem .2rem", "38% 62% 58% 42% / 46% 35% 65% 54%",
  "1.2rem 3rem", ".8rem .8rem 0 0", ".5rem .5rem 1.4rem 1.4rem", "1.5rem 1.5rem .5rem .5rem", ".55rem", ".65rem",
  "1.2rem 1.2rem 1.2rem .2rem", ".2rem 1rem", ".25rem", ".65rem"
]);

const SHADOW_VALUES = Object.freeze([
  "none",
  "0 0 0 1px color-mix(in srgb, var(--ab-ink) 10%, transparent)",
  "0 .45rem 1.2rem rgb(15 23 42 / .10)",
  "0 .8rem 2rem rgb(15 23 42 / .16)",
  "0 1.2rem 3.2rem rgb(15 23 42 / .22)",
  ".7rem .7rem 0 color-mix(in srgb, var(--ab-accent) 22%, transparent)",
  "0 0 2rem color-mix(in srgb, var(--ab-accent) 34%, transparent)",
  ".35rem .35rem 0 var(--ab-ink)"
]);

const SURFACE_RULES = Object.freeze([
  "background:transparent",
  "background:var(--ab-paper)",
  "background:var(--ab-surface);border:1px solid var(--ab-line)",
  "background:color-mix(in srgb,var(--ab-surface) 76%,transparent);backdrop-filter:blur(16px);border:1px solid color-mix(in srgb,var(--ab-line) 72%,transparent)",
  "background:transparent;border:1px solid var(--ab-line-strong)",
  "background:var(--ab-paper-2);box-shadow:inset 0 0 0 1px var(--ab-line)",
  "background:linear-gradient(135deg,color-mix(in srgb,var(--ab-accent) 15%,var(--ab-surface)),var(--ab-surface))",
  "background:var(--ab-paper);background-image:radial-gradient(rgb(15 23 42 / .06) .6px,transparent .6px);background-size:6px 6px",
  "background:var(--ab-paper);background-image:linear-gradient(var(--ab-line) 1px,transparent 1px),linear-gradient(90deg,var(--ab-line) 1px,transparent 1px);background-size:24px 24px",
  "background:var(--ab-surface);box-shadow:0 0 2.5rem color-mix(in srgb,var(--ab-accent) 24%,transparent)",
  "background:var(--ab-ink);color:var(--ab-paper)",
  "background:color-mix(in srgb,var(--ab-paper) 82%,white);backdrop-filter:blur(22px);border:1px solid white"
]);

const MOTION_TRANSFORMS = Object.freeze([
  "none", "none", "translateY(22px)", "translateY(-22px)", "translateX(26px)", "translateX(-26px)", "scale(.94)", "scale(.98)",
  "perspective(700px) rotateX(8deg)", "rotate(-1.5deg) translateY(12px)", "translateY(30px) scale(.96)", "translateY(18px)",
  "translateY(var(--ab-parallax-y,18px))", "translateY(16px)", "scale(.98)", "translateY(24px)"
]);

function generatedAxisCss() {
  const shapes = SHAPES.map((_, index) => `.ab-shape-${index}{--ab-local-radius:${RADIUS_VALUES[index]};border-radius:var(--ab-local-radius)!important}`).join("\n");
  const surfaces = SURFACES.map((_, index) => `.ab-surface-${index}{${SURFACE_RULES[index]}}`).join("\n");
  const densityScale = ["1.5", "1.25", "1", ".82", ".68", "1.12", ".76", "1.35"];
  const densities = DENSITIES.map((_, index) => `.ab-density-${index}{--ab-local-space:${densityScale[index]};gap:calc(var(--ab-local-space)*.75rem)}`).join("\n");
  const shadows = SHADOWS.map((_, index) => `.ab-shadow-${index}{box-shadow:${SHADOW_VALUES[index]}!important}`).join("\n");
  const motions = MOTIONS.map((_, index) => `.js .ab-motion-${index}{opacity:${index === 0 ? "1" : "0"};transform:${MOTION_TRANSFORMS[index]};transition:opacity var(--ab-slow,.7s) var(--ab-ease,ease),transform var(--ab-slow,.7s) var(--ab-ease,ease),filter var(--ab-slow,.7s) var(--ab-ease,ease);${index === 7 ? "filter:blur(9px)" : ""}}.js .ab-motion-${index}.is-ab-visible{opacity:1;transform:none;filter:none}`).join("\n");
  return `${shapes}\n${surfaces}\n${densities}\n${shadows}\n${motions}`;
}

export const ADVANCED_CSS = `
/* AppBlocks Web generation 2 */
${generatedAxisCss()}
.js .ab-motion-11>*{opacity:0;transform:translateY(12px);transition:opacity var(--ab-slow,.7s) var(--ab-ease,ease),transform var(--ab-slow,.7s) var(--ab-ease,ease);transition-delay:calc(var(--ab-stagger,0)*55ms)}
.js .ab-motion-11.is-ab-visible>*{opacity:1;transform:none}
.js .ab-motion-12.is-ab-visible{transform:translateY(var(--ab-parallax-y,0))}
.ab-vf-button{position:relative;isolation:isolate;min-height:2.75rem;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
.ab-vf-button:hover{transform:translateY(-2px)}
.ab-vf-button:active{transform:translateY(0) scale(.98)}
.ab-vf-header,.ab-vf-footer,.ab-vf-hero,.ab-vf-frame,.ab-vf-card,.ab-vf-section{padding:calc(var(--ab-local-space,1)*1rem)}
.ab-vf-header{border-bottom:1px solid var(--ab-line);backdrop-filter:blur(16px)}
.ab-vf-footer{border-top:1px solid var(--ab-line)}
.ab-vf-card,.ab-x-hover-card{transition:transform .24s ease,box-shadow .24s ease}
.ab-vf-card:hover,.ab-x-hover-card:hover{transform:translateY(-4px)}
.ab-x-frame,.ab-x-browser-frame,.ab-x-phone-frame,.ab-x-laptop-frame,.ab-x-window-frame{position:relative;overflow:hidden}
.ab-x-browser-frame,.ab-x-window-frame{padding-top:2.7rem!important}
.ab-x-browser-frame::before,.ab-x-window-frame::before{content:"";position:absolute;inset:.85rem auto auto 1rem;width:2.5rem;height:.65rem;background:radial-gradient(circle at .35rem 50%,#ff605c .27rem,transparent .29rem),radial-gradient(circle at 1.25rem 50%,#ffbd44 .27rem,transparent .29rem),radial-gradient(circle at 2.15rem 50%,#00ca4e .27rem,transparent .29rem)}
.ab-x-phone-frame{max-width:25rem;margin-inline:auto;border:.65rem solid var(--ab-ink)!important;border-radius:2.2rem!important}
.ab-x-phone-frame::before{content:"";display:block;width:32%;height:.35rem;margin:-.15rem auto .8rem;border-radius:999px;background:var(--ab-ink)}
.ab-x-laptop-frame{border:.45rem solid var(--ab-ink)!important;border-bottom-width:1.1rem!important}
.ab-x-glass-card{background:color-mix(in srgb,var(--ab-surface) 72%,transparent)!important;backdrop-filter:blur(18px);border:1px solid color-mix(in srgb,white 50%,var(--ab-line))!important}
.ab-x-gradient-card{background:linear-gradient(145deg,color-mix(in srgb,var(--ab-accent) 20%,var(--ab-surface)),color-mix(in srgb,var(--ab-accent-2) 13%,var(--ab-surface)))!important}
.ab-x-carousel{display:flex!important;grid-auto-flow:column;grid-auto-columns:minmax(min(82vw,22rem),1fr);gap:1rem;overflow-x:auto!important;scroll-snap-type:x mandatory;scrollbar-width:thin;overscroll-behavior-inline:contain}
.ab-x-carousel>*{flex:0 0 min(82vw,22rem);scroll-snap-align:start}
.ab-carousel-controls{display:flex;justify-content:flex-end;gap:.5rem;margin:.65rem 0 1rem}
.ab-carousel-controls button{display:inline-grid;place-items:center;min-width:2.75rem;min-height:2.75rem;border:1px solid var(--ab-line);border-radius:999px;background:var(--ab-surface);color:var(--ab-ink);font:inherit;cursor:pointer}
.ab-x-marquee,.ab-x-ticker{overflow:hidden;white-space:nowrap}
.ab-x-marquee>*,.ab-x-ticker>*{animation:ab-x-marquee 24s linear infinite}
@keyframes ab-x-marquee{to{transform:translateX(-35%)}}
.ab-x-drawer[open]{width:min(30rem,92vw);height:100dvh;max-height:none;margin:0 0 0 auto;border-radius:0!important}
.ab-x-sheet[open]{width:min(48rem,100%);margin:auto auto 0;max-height:82dvh;border-radius:1.3rem 1.3rem 0 0!important}
.ab-x-command-palette[open]{width:min(44rem,calc(100% - 1rem));margin:10vh auto auto}
.ab-x-popover{max-width:24rem}
.ab-x-button-group,.ab-x-split-button,.ab-x-pagination{display:flex!important;flex-flow:row wrap;align-items:center;gap:.5rem}
.ab-x-fab{position:fixed!important;z-index:80;right:clamp(1rem,3vw,2rem);bottom:clamp(1rem,3vw,2rem);border-radius:999px!important;box-shadow:var(--ab-shadow-lg)!important}
.ab-x-avatar{aspect-ratio:1;object-fit:cover;border-radius:50%!important}
.ab-x-avatar-stack{display:flex!important;align-items:center}
.ab-x-avatar-stack>*+*{margin-left:-.7rem}
.ab-x-chip,.ab-x-pill,.ab-x-status-badge{border-radius:999px!important}
.ab-x-progress-ring{border-radius:50%!important;aspect-ratio:1;display:grid;place-content:center;background:conic-gradient(var(--ab-accent) calc(var(--ab-progress,50)*1%),var(--ab-line) 0)}
.ab-x-skeleton{min-height:5rem;color:transparent!important;background:linear-gradient(100deg,var(--ab-paper-2) 20%,var(--ab-surface) 40%,var(--ab-paper-2) 60%);background-size:220% 100%;animation:ab-x-skeleton 1.35s ease-in-out infinite}
@keyframes ab-x-skeleton{to{background-position-x:-220%}}
.ab-x-file-drop{outline:2px dashed var(--ab-line-strong);outline-offset:.35rem;transition:background .2s ease,outline-color .2s ease}
.ab-x-file-drop.is-dragover{background:var(--ab-accent-soft);outline-color:var(--ab-accent)}
.ab-x-toggle input[type=checkbox]{appearance:none;width:2.8rem;height:1.55rem;border:1px solid var(--ab-line-strong);border-radius:999px;background:var(--ab-paper-2);cursor:pointer;transition:.2s ease}
.ab-x-toggle input[type=checkbox]::before{content:"";display:block;width:1.15rem;height:1.15rem;margin:.14rem;border-radius:50%;background:var(--ab-muted);transition:.2s ease}
.ab-x-toggle input[type=checkbox]:checked{background:var(--ab-accent)}
.ab-x-toggle input[type=checkbox]:checked::before{transform:translateX(1.22rem);background:white}
.ab-x-announcement-bar,.ab-x-cookie-banner,.ab-x-alert-banner{width:100%;border-radius:0!important}
.ab-x-media-object{align-items:center}
.ab-parallax{will-change:transform}
@media (max-width:760px){.ab-x-drawer[open],.ab-x-sheet[open]{width:100%;max-width:none}.ab-x-carousel>*{flex-basis:88vw}.ab-x-fab{right:1rem;bottom:1rem}}
@media (prefers-reduced-motion:reduce){.js [class*="ab-motion-"]{opacity:1!important;transform:none!important;filter:none!important}.js .ab-motion-11>*{opacity:1!important;transform:none!important;transition:none!important}.ab-x-marquee>*,.ab-x-ticker>*,.ab-x-skeleton{animation:none!important}.ab-parallax{transform:none!important}}
`;

export const ADVANCED_RUNTIME = String.raw`
;(() => {
  const onReady = (callback) => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", callback, { once: true }) : callback();
  onReady(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
    const animated = [...document.querySelectorAll('[class*="ab-motion-"]')];
    animated.forEach((element) => {
      if (element.classList.contains("ab-motion-11")) {
        [...element.children].forEach((child, index) => child.style.setProperty("--ab-stagger", String(index)));
      }
    });
    if (reduced || !("IntersectionObserver" in window)) animated.forEach((element) => element.classList.add("is-ab-visible"));
    else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-ab-visible");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
      animated.forEach((element) => observer.observe(element));
    }

    const parallax = reduced ? [] : [...document.querySelectorAll(".ab-parallax")];
    const activeParallax = new Set();
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      if (document.hidden || reduced) return;
      activeParallax.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const offset = Math.max(-28, Math.min(28, (window.innerHeight / 2 - bounds.top) * 0.035));
        element.style.setProperty("--ab-parallax-y", offset + "px");
      });
      if (activeParallax.size) frame = window.requestAnimationFrame(updateParallax);
    };
    const startParallax = () => { if (!frame && activeParallax.size && !document.hidden) frame = window.requestAnimationFrame(updateParallax); };
    if (parallax.length) {
      if ("IntersectionObserver" in window) {
        const parallaxObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => entry.isIntersecting ? activeParallax.add(entry.target) : activeParallax.delete(entry.target));
          startParallax();
        }, { rootMargin: "35% 0px 35%", threshold: 0 });
        parallax.forEach((element) => parallaxObserver.observe(element));
      } else parallax.forEach((element) => activeParallax.add(element));
      window.addEventListener("resize", startParallax, { passive: true });
      document.addEventListener("visibilitychange", startParallax);
      startParallax();
    }

    document.querySelectorAll(".ab-x-carousel:not([data-ab-carousel-ready])").forEach((carousel, carouselIndex) => {
      carousel.dataset.abCarouselReady = "true";
      carousel.setAttribute("role", "region");
      if (!carousel.getAttribute("aria-label")) carousel.setAttribute("aria-label", "Carousel " + (carouselIndex + 1));
      const controls = document.createElement("div");
      controls.className = "ab-carousel-controls";
      const makeButton = (label, direction, glyph) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", label);
        button.textContent = glyph;
        button.addEventListener("click", () => carousel.scrollBy({ left: carousel.clientWidth * 0.82 * direction, behavior: reduced ? "auto" : "smooth" }));
        return button;
      };
      controls.append(makeButton("Previous items", -1, "←"), makeButton("Next items", 1, "→"));
      carousel.insertAdjacentElement("afterend", controls);
    });

    document.addEventListener("keydown", (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      const palette = document.querySelector("dialog.ab-x-command-palette");
      if (!palette) return;
      event.preventDefault();
      if (!palette.open) palette.showModal();
      palette.querySelector('input[type="search"],input,button')?.focus();
    });

    document.querySelectorAll(".ab-x-file-drop").forEach((field) => {
      ["dragenter", "dragover"].forEach((type) => field.addEventListener(type, (event) => {
        event.preventDefault();
        field.classList.add("is-dragover");
      }));
      ["dragleave", "drop"].forEach((type) => field.addEventListener(type, () => field.classList.remove("is-dragover")));
    });

    const counters = [...document.querySelectorAll(".ab-x-counter")];
    const animateCounter = (element) => {
      if (reduced || element.dataset.abCounted) return;
      const valueNode = element.querySelector("[data-value],strong,b") ?? element;
      const match = valueNode.textContent.match(/-?\d+(?:[.,]\d+)?/);
      if (!match) return;
      const target = Number(match[0].replace(",", "."));
      if (!Number.isFinite(target)) return;
      element.dataset.abCounted = "true";
      const prefix = valueNode.textContent.slice(0, match.index);
      const suffix = valueNode.textContent.slice((match.index ?? 0) + match[0].length);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 700);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased * 10) / 10;
        valueNode.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!reduced && "IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }), { threshold: 0.35 });
      counters.forEach((counter) => counterObserver.observe(counter));
    }
  });
})();
`;

export function buildDesignCss(selection = {}) {
  const design = resolveDesign(selection);
  if (!design.active) return "";
  const { recipe } = design;
  const hue = recipe.palette.hue;
  const secondaryHue = recipe.palette.secondaryHue;
  const saturation = recipe.palette.saturation;
  const primary = design.primary || `hsl(${hue} ${saturation}% 46%)`;
  const secondary = design.secondary || `hsl(${secondaryHue} ${Math.max(45, saturation - 8)}% 48%)`;
  const background = design.background || `hsl(${hue} 22% 97%)`;
  const foreground = design.foreground || `hsl(${hue} 28% 12%)`;
  const radius = RADIUS_VALUES[recipe.shape.index];
  const shadow = SHADOW_VALUES[recipe.shadow.index];
  const densityScale = [1.16, 1.08, 1, .92, .84, 1.05, .88, 1.12][recipe.density.index];
  return `
html[data-ab-engine="2"]{
  --ab-accent:${primary};--ab-accent-2:${secondary};--ab-accent-soft:color-mix(in srgb,${primary} 14%,transparent);
  --ab-paper:${background};--ab-paper-2:color-mix(in srgb,${background} 92%,${foreground});--ab-surface:color-mix(in srgb,${background} 96%,white);
  --ab-ink:${foreground};--ab-muted:color-mix(in srgb,${foreground} 62%,${background});--ab-line:color-mix(in srgb,${foreground} 14%,transparent);--ab-line-strong:color-mix(in srgb,${foreground} 28%,transparent);
  --ab-font-display:${design.fontDisplay};--ab-font-body:${design.fontBody};--ab-display:${design.fontDisplay};--ab-sans:${design.fontBody};--ab-mono:${design.fontMono};
  --ab-radius:${radius};--ab-shadow-sm:${shadow};--ab-shadow-md:${shadow};--ab-shadow-lg:${shadow};--ab-density-scale:${densityScale};
}
html[data-ab-engine="2"] body{font-family:var(--ab-font-body);background:var(--ab-paper);color:var(--ab-ink)}
html[data-ab-engine="2"] :where(h1,h2,h3,.ab-title,.ab-heading){font-family:var(--ab-font-display)}
html[data-ab-engine="2"][data-theme="dark"]{--ab-paper:hsl(${hue} 22% 8%);--ab-paper-2:hsl(${hue} 20% 11%);--ab-surface:hsl(${hue} 18% 14%);--ab-ink:hsl(${hue} 18% 94%);--ab-muted:hsl(${hue} 12% 68%);--ab-line:rgb(255 255 255 / .13);--ab-line-strong:rgb(255 255 255 / .25)}
`;
}
