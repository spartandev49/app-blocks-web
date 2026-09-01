export const V2_RUNTIME_JS = String.raw`
;(() => {
  "use strict";
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || root.dataset.motion === "off";
  const qa = (selector, scope = doc) => [...scope.querySelectorAll(selector)];
  const firstFocusable = (scope) => scope.querySelector('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
  const actionValue = (element) => element?.dataset?.action || element?.getAttribute?.("data-ab-action") || element?.getAttribute?.("data-action") || "";
  const optionFromClass = (element, name) => {
    const prefix = `abx-opt-${name}-`;
    const match = [...element.classList].find((token) => token.startsWith(prefix));
    return match ? match.slice(prefix.length) : "";
  };

  function toast(message, timeout = 3600) {
    let region = doc.querySelector(".abx-toast-region");
    if (!region) {
      region = doc.createElement("div");
      region.className = "abx-toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      body.append(region);
    }
    const item = doc.createElement("div");
    item.className = "abx-toast";
    const text = doc.createElement("span");
    text.textContent = message;
    const close = doc.createElement("button");
    close.type = "button";
    close.textContent = "Dismiss";
    close.setAttribute("aria-label", "Dismiss notification");
    close.addEventListener("click", () => item.remove());
    item.append(text, close);
    region.append(item);
    window.setTimeout(() => item.remove(), timeout);
  }

  function initMotion() {
    const items = qa('[class*="abx-motion-"]');
    items.forEach((item, index) => item.style.setProperty("--abx-delay", `${Math.min(420, (index % 8) * 55)}ms`));
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-abx-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-abx-visible");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -7%", threshold: .08 });
    items.forEach((item) => observer.observe(item));
    requestAnimationFrame(() => qa('[class*="abx-motion-"]').filter((item) => item.getBoundingClientRect().top < innerHeight).forEach((item) => item.classList.add("is-abx-visible")));
  }

  function initCarousels() {
    qa(".abx-carousel").forEach((carousel, carouselIndex) => {
      const candidates = qa(".abx-slide", carousel);
      const slides = candidates.length ? candidates : qa(":scope > .ab-panel,:scope > .ab-card,:scope > div > .ab-panel,:scope > div > .ab-card", carousel);
      if (slides.length < 2) return;
      let index = Math.max(0, slides.findIndex((slide) => slide.hasAttribute("data-selected") || slide.classList.contains("is-selected")));
      let timer = 0;
      const id = carousel.id || `abx-carousel-${carouselIndex + 1}`;
      carousel.id = id;
      carousel.setAttribute("role", "region");
      carousel.setAttribute("aria-roledescription", "carousel");
      if (!carousel.getAttribute("aria-label")) carousel.setAttribute("aria-label", "Content carousel");
      slides.forEach((slide, slideIndex) => {
        slide.dataset.abxSlide = String(slideIndex + 1);
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
      });
      const controls = doc.createElement("div");
      controls.className = "abx-carousel__controls";
      const previous = doc.createElement("button");
      previous.type = "button";
      previous.textContent = "←";
      previous.setAttribute("aria-label", "Previous slide");
      const status = doc.createElement("span");
      status.className = "abx-carousel__status";
      status.setAttribute("aria-live", "polite");
      const next = doc.createElement("button");
      next.type = "button";
      next.textContent = "→";
      next.setAttribute("aria-label", "Next slide");
      controls.append(previous, status, next);
      carousel.append(controls);
      const show = (nextIndex, announce = true) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          const active = slideIndex === index;
          slide.hidden = !active;
          slide.setAttribute("aria-hidden", String(!active));
          slide.classList.toggle("is-selected", active);
          qa("a,button,input,select,textarea,[tabindex]", slide).forEach((control) => {
            if (!active) {
              if (!control.hasAttribute("data-abx-tabindex")) control.setAttribute("data-abx-tabindex", control.getAttribute("tabindex") ?? "");
              control.setAttribute("tabindex", "-1");
            } else if (control.hasAttribute("data-abx-tabindex")) {
              const old = control.getAttribute("data-abx-tabindex");
              if (old) control.setAttribute("tabindex", old); else control.removeAttribute("tabindex");
              control.removeAttribute("data-abx-tabindex");
            }
          });
        });
        status.textContent = `${index + 1} / ${slides.length}`;
        if (announce) carousel.dispatchEvent(new CustomEvent("appblocks:slide", { detail: { index, total: slides.length } }));
      };
      const stop = () => { if (timer) window.clearInterval(timer); timer = 0; };
      const autoplayOption = optionFromClass(carousel, "autoplay");
      const interval = /^\d+$/.test(autoplayOption) ? Math.max(1800, Number(autoplayOption)) : autoplayOption === "false" ? 0 : 5000;
      const start = () => { if (!reduced && interval && !timer) timer = window.setInterval(() => show(index + 1, false), interval); };
      previous.addEventListener("click", () => { show(index - 1); stop(); start(); });
      next.addEventListener("click", () => { show(index + 1); stop(); start(); });
      carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); previous.click(); }
        if (event.key === "ArrowRight") { event.preventDefault(); next.click(); }
      });
      carousel.addEventListener("pointerenter", stop);
      carousel.addEventListener("pointerleave", start);
      carousel.addEventListener("focusin", stop);
      carousel.addEventListener("focusout", start);
      doc.addEventListener("visibilitychange", () => doc.hidden ? stop() : start());
      show(index, false);
      start();
    });
  }

  function createBackdrop(className, label, close) {
    const backdrop = doc.createElement("button");
    backdrop.type = "button";
    backdrop.className = className;
    backdrop.setAttribute("aria-label", label);
    backdrop.addEventListener("click", close);
    body.append(backdrop);
    return backdrop;
  }

  function initDrawers() {
    const drawers = new Map(qa(".abx-drawer").map((drawer, index) => {
      drawer.id ||= `abx-drawer-${index + 1}`;
      drawer.setAttribute("role", "dialog");
      drawer.setAttribute("aria-modal", "true");
      drawer.setAttribute("aria-hidden", "true");
      return [drawer.id, drawer];
    }));
    let active = null;
    let backdrop = null;
    let returnFocus = null;
    const close = () => {
      if (!active) return;
      active.classList.remove("is-abx-open");
      active.setAttribute("aria-hidden", "true");
      backdrop?.remove();
      backdrop = null;
      const focusTarget = returnFocus;
      active = null;
      returnFocus = null;
      body.style.removeProperty("overflow");
      focusTarget?.focus?.();
    };
    const open = (drawer, trigger) => {
      if (!drawer) return;
      close();
      active = drawer;
      returnFocus = trigger || doc.activeElement;
      drawer.classList.add("is-abx-open");
      drawer.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
      backdrop = createBackdrop("abx-drawer-backdrop", "Close drawer", close);
      requestAnimationFrame(() => firstFocusable(drawer)?.focus());
    };
    qa("button,[role='button'],a").forEach((trigger) => {
      const action = actionValue(trigger);
      const target = trigger.getAttribute("aria-controls") || trigger.dataset.drawer || action.match(/^(?:open-)?drawer[:=-](.+)$/)?.[1];
      if (!target || !drawers.has(target)) return;
      trigger.setAttribute("aria-controls", target);
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        open(drawers.get(target), trigger);
        trigger.setAttribute("aria-expanded", "true");
      });
    });
    qa(".abx-drawer button").forEach((button) => {
      if (/^(?:close|dismiss)(?:-drawer)?$/.test(actionValue(button))) button.addEventListener("click", close);
    });
    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && active) close();
      if (event.key !== "Tab" || !active) return;
      const focusable = qa('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', active);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initDisclosureMenus() {
    qa(".abx-dropdown,.abx-popover").forEach((container) => {
      const trigger = container.querySelector("button,[role='button']");
      if (!trigger) return;
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = container.classList.toggle("is-abx-open");
        trigger.setAttribute("aria-expanded", String(open));
      });
      container.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        container.classList.remove("is-abx-open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      });
    });
    doc.addEventListener("click", (event) => qa(".abx-dropdown.is-abx-open,.abx-popover.is-abx-open").forEach((container) => {
      if (container.contains(event.target)) return;
      container.classList.remove("is-abx-open");
      container.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
    }));
  }

  function initCommandPalette() {
    const palette = doc.querySelector(".abx-command-palette");
    if (!palette) return;
    palette.setAttribute("role", "dialog");
    palette.setAttribute("aria-modal", "true");
    palette.setAttribute("aria-hidden", "true");
    let backdrop = null;
    let returnFocus = null;
    const search = palette.querySelector('input[type="search"],input');
    const searchable = qa("a,button,[data-command]", palette);
    const close = () => {
      palette.classList.remove("is-abx-open");
      palette.setAttribute("aria-hidden", "true");
      backdrop?.remove();
      backdrop = null;
      returnFocus?.focus?.();
      returnFocus = null;
    };
    const open = (trigger = doc.activeElement) => {
      returnFocus = trigger;
      palette.classList.add("is-abx-open");
      palette.setAttribute("aria-hidden", "false");
      backdrop = createBackdrop("abx-command-backdrop", "Close command palette", close);
      requestAnimationFrame(() => (search || firstFocusable(palette))?.focus());
    };
    doc.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); palette.classList.contains("is-abx-open") ? close() : open(); }
      else if (event.key === "Escape" && palette.classList.contains("is-abx-open")) close();
    });
    qa("button,[role='button'],a").forEach((trigger) => {
      if (!/^(?:open-)?command(?:-palette)?$/.test(actionValue(trigger))) return;
      trigger.addEventListener("click", (event) => { event.preventDefault(); open(trigger); });
    });
    search?.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      searchable.forEach((item) => { item.hidden = Boolean(query) && !item.textContent.toLowerCase().includes(query); });
    });
  }

  function initCounters() {
    qa(".abx-counter,.abx-metric-card,.abx-stat-card").forEach((container) => {
      const target = container.querySelector("[data-value],.ab-stat__value,.ab-metric__value,strong") || container;
      const raw = target.dataset.value || target.textContent;
      const match = raw?.match?.(/-?[\d,.]+/);
      if (!match) return;
      const value = Number(match[0].replace(/,/g, ""));
      if (!Number.isFinite(value) || reduced) return;
      const prefix = raw.slice(0, raw.indexOf(match[0]));
      const suffix = raw.slice(raw.indexOf(match[0]) + match[0].length);
      const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;
      target.dataset.abxNumber = String(value);
      let started = false;
      const run = () => {
        if (started) return;
        started = true;
        const start = performance.now();
        const duration = 900;
        const frame = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          target.textContent = `${prefix}${(value * eased).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      };
      if (!("IntersectionObserver" in window)) run();
      else {
        const observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          run();
        }, { threshold: .35 });
        observer.observe(container);
      }
    });
  }

  function initFields() {
    qa(".abx-range input[type='range'],.abx-rating input[type='range']").forEach((input) => {
      const output = doc.createElement("output");
      output.htmlFor = input.id || "";
      output.textContent = input.value;
      output.setAttribute("aria-live", "polite");
      input.insertAdjacentElement("afterend", output);
      input.addEventListener("input", () => { output.value = input.value; output.textContent = input.value; });
    });
    qa(".abx-file-drop").forEach((zone) => {
      const input = zone.matches("input[type='file']") ? zone : zone.querySelector("input[type='file']");
      if (!input) return;
      ["dragenter", "dragover"].forEach((name) => zone.addEventListener(name, (event) => { event.preventDefault(); zone.classList.add("is-abx-dragging"); }));
      ["dragleave", "drop"].forEach((name) => zone.addEventListener(name, (event) => { event.preventDefault(); zone.classList.remove("is-abx-dragging"); }));
      zone.addEventListener("drop", (event) => {
        if (!event.dataTransfer?.files?.length) return;
        try { input.files = event.dataTransfer.files; } catch { /* Browsers may protect assignment; native selection remains available. */ }
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      input.addEventListener("change", () => {
        if (input.files?.length) toast(`${input.files.length} file${input.files.length === 1 ? "" : "s"} selected`);
      });
    });
  }

  function initScrollEffects() {
    const progress = qa(".abx-scroll-progress");
    const parallax = qa(".abx-motion-9");
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const max = Math.max(1, doc.documentElement.scrollHeight - innerHeight);
      const percent = Math.max(0, Math.min(100, scrollY / max * 100));
      progress.forEach((item) => item.style.setProperty("--abx-scroll", `${percent}%`));
      if (!reduced) parallax.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const offset = Math.max(-28, Math.min(28, (rect.top + rect.height / 2 - innerHeight / 2) * -.035));
        item.style.setProperty("--abx-parallax", `${offset}px`);
      });
    };
    const request = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request, { passive: true });
    update();
  }

  function initPointerEffects() {
    if (reduced || !window.matchMedia?.("(pointer:fine)")?.matches) return;
    qa(".abx-motion-11").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        element.style.transform = `translate(${x * 7}px,${y * 6}px)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });
    qa(".ab-button[class*='abx-button']").forEach((button) => button.addEventListener("pointerdown", (event) => {
      const ripple = doc.createElement("span");
      const rect = button.getBoundingClientRect();
      ripple.className = "abx-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.append(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    }));
  }

  function initActions() {
    qa("button,[role='button'],a").forEach((control) => {
      const action = actionValue(control);
      const message = action.match(/^toast[:=-](.+)$/)?.[1];
      if (message) control.addEventListener("click", (event) => { event.preventDefault(); toast(message.replace(/-/g, " ")); });
    });
  }

  function initGlobalRecipeMotion() {
    const motion = getComputedStyle(body).getPropertyValue("--ab-recipe-motion").trim();
    if (motion) body.classList.add(`ab-motion-${motion}`);
  }

  function init() {
    initGlobalRecipeMotion();
    initMotion();
    initCarousels();
    initDrawers();
    initDisclosureMenus();
    initCommandPalette();
    initCounters();
    initFields();
    initScrollEffects();
    initPointerEffects();
    initActions();
    root.dataset.appblocksDesign = "2";
    doc.dispatchEvent(new CustomEvent("appblocks:design-ready"));
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
`;
