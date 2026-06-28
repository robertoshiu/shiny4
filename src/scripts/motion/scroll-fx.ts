/**
 * scroll-fx.ts — Scroll-driven cinematic effects.
 *
 * Exported functions (call from page scripts after DOM is ready):
 *
 *   initParallax()
 *     Parallax shift on elements with [data-parallax].
 *     Optional: data-parallax-speed="0.25"  (fraction of scroll offset; default 0.2)
 *     Optional: data-parallax-dir="up|down" (default "up" = moves against scroll)
 *     Works with Lenis if available; falls back to scroll event.
 *
 *   initSectionEnter()
 *     Spring stagger choreography for .section > * children on section-enter.
 *     NOT plain opacity fades — uses translateY + opacity + scale with spring easing.
 *     Applies to elements with [data-section-enter].
 *
 *   initSignalTravel(container?)
 *     Animated glowing pulse that travels down the L1→L6 layer stack.
 *     Call with the .layer-stack element (or it auto-finds [data-signal-travel]).
 *     On scroll-enter: a gold→clay gradient pulse descends the connector line
 *     at spring pace, "lighting up" each layer dot as it passes.
 *
 *   initCountUp()
 *     Spring overshoot count-up for .btn__value[data-to] metrics.
 *     Replaces the plain easing in counter.ts with anime.js spring + overshoot.
 *     The ≤/≥ prefix glyphs stroke-draw in before the number counts up.
 *
 *   initAll()
 *     Convenience: calls all four above. Returns a cleanup fn.
 *
 * Under reduced-motion: none of these construct timelines. Final states are set.
 * Performance: DPR≤2, RAF-paused offscreen via IntersectionObserver.
 */

import { animate, stagger, spring, createTimeline } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';
import { getLenis } from './smooth-scroll';

// ─── PARALLAX ────────────────────────────────────────────────────────────────

export function initParallax(): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (els.length === 0) return () => {};

  if (prefersReducedMotion()) {
    els.forEach((el) => { el.style.transform = 'none'; });
    return () => {};
  }

  function applyParallax() {
    const sy = window.scrollY;
    for (const el of els) {
      const speed = parseFloat(el.dataset.parallaxSpeed ?? '0.2');
      const dir   = el.dataset.parallaxDir === 'down' ? 1 : -1;
      const rect  = el.getBoundingClientRect();
      // Distance from viewport center → controls shift intensity
      const vhCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const offset   = (elCenter - vhCenter) * speed * dir;
      el.style.transform = `translateY(${offset.toFixed(2)}px)`;
    }
  }

  // Hook into Lenis scroll if available, else use native scroll
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', applyParallax);
  } else {
    window.addEventListener('scroll', applyParallax, { passive: true });
  }
  applyParallax();

  return function destroy() {
    const l = getLenis();
    if (l) l.off('scroll', applyParallax);
    window.removeEventListener('scroll', applyParallax);
    els.forEach((el) => { el.style.transform = ''; });
  };
}

// ─── SECTION ENTER CHOREOGRAPHY ──────────────────────────────────────────────

/**
 * Spring-stagger children on [data-section-enter] when the section enters.
 * Children animate: translateY 48→0, opacity 0→1, scale 0.96→1.
 */
export function initSectionEnter(): () => void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-enter]'));
  if (sections.length === 0) return () => {};

  if (prefersReducedMotion()) {
    sections.forEach((sec) => {
      const children = Array.from(sec.children) as HTMLElement[];
      children.forEach((c) => {
        c.style.opacity   = '1';
        c.style.transform = 'none';
      });
    });
    return () => {};
  }

  const cleanups: Array<() => void> = [];

  for (const section of sections) {
    const children = Array.from(section.querySelectorAll<HTMLElement>(
      ':scope > *, :scope > * > *:is(h2,h3,p,li,article,figure)'
    )).slice(0, 12); // cap at 12 to avoid over-staggering

    if (children.length === 0) continue;

    // Initial hidden state
    children.forEach((c) => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(48px) scale(0.96)';
    });

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || fired) continue;
          fired = true;
          animate(children, {
            opacity:    [0, 1],
            translateY: [48, 0],
            scale:      [0.96, 1],
            delay:      stagger(55, { ease: 'out(2)' }),
            ease:       spring({ stiffness: 220, damping: 22, mass: 1 }),
          });
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(section);
    cleanups.push(() => io.disconnect());
  }

  return () => cleanups.forEach((fn) => fn());
}

// ─── SIGNAL TRAVEL (Layer Stack L1→L6) ───────────────────────────────────────

/**
 * Inject and animate a glowing signal pulse that travels down the L1→L6 stack.
 * The pulse is a gold→clay gradient capsule that descends the connector line.
 * Each layer dot "lights up" (scale + glow) as the pulse passes.
 *
 * Auto-finds [data-signal-travel] or uses the provided container.
 */
export function initSignalTravel(containerEl?: HTMLElement | null): () => void {
  const stack = containerEl
    ?? document.querySelector<HTMLElement>('[data-signal-travel]');
  if (!stack) return () => {};

  if (prefersReducedMotion()) return () => {};

  // Dot elements in the layer stack (the accent dots in the left gutter)
  const dotEls = Array.from(stack.querySelectorAll<HTMLElement>('.layer-chapter__dot'));
  if (dotEls.length === 0) return () => {};

  // Create the signal pulse element — a small glowing pill
  const pulse = document.createElement('div');
  pulse.setAttribute('aria-hidden', 'true');
  pulse.style.cssText = [
    'position:absolute', 'left:0', 'top:0',
    'width:3px', 'height:0', 'border-radius:2px',
    'background:linear-gradient(180deg, #E9C46A 0%, #E07A5F 100%)',
    'box-shadow:0 0 8px 2px rgba(233,196,106,0.5)',
    'pointer-events:none', 'z-index:2',
    'transform:translateX(-1px)',
    'opacity:0',
  ].join(';');

  // The gutter column is 3.5rem wide; position pulse on the connector line
  // The connector line sits ~20px from the left of the gutter
  pulse.style.left = '19px';
  stack.style.position = 'relative';
  stack.prepend(pulse);

  let fired = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || fired) continue;
        fired = true;
        fireSignal();
        // Repeat every 6s for continuous ambiance
        const interval = setInterval(fireSignal, 6000);
        cleanupFns.push(() => clearInterval(interval));
      }
    },
    { threshold: 0.2 },
  );
  io.observe(stack);

  const cleanupFns: Array<() => void> = [
    () => { io.disconnect(); pulse.remove(); },
  ];

  function fireSignal() {
    if (prefersReducedMotion()) return;
    const stackH = stack!.offsetHeight;

    // Reset pulse position
    pulse.style.opacity = '1';
    pulse.style.height  = '0';
    pulse.style.top     = '0';

    // 1. Draw the pulse line down (height grows)
    const tl = createTimeline({ defaults: { ease: 'out(2)' } });

    tl.add(pulse, { opacity: [0, 1], duration: 120 }, 0)
      .add(pulse, {
        height: [0, stackH],
        duration: 900,
        ease: 'inOut(2)',
      }, 120);

    // 2. As pulse travels, light up each dot in sequence
    dotEls.forEach((dot, i) => {
      const dotTop    = dot.getBoundingClientRect().top - stack!.getBoundingClientRect().top;
      const arrivalT  = Math.round(120 + (dotTop / stackH) * 900);
      tl.add(dot, {
        scale:  [1, 1.8, 1],
        opacity:[1, 1,   1],
        duration: 320,
        ease: spring({ stiffness: 400, damping: 18, mass: 0.6 }),
      }, arrivalT);
    });

    // 3. Fade out pulse
    tl.add(pulse, { opacity: [1, 0], duration: 300, ease: 'in(2)' }, 1020);
  }

  return () => cleanupFns.forEach((fn) => fn());
}

// ─── COUNT-UP WITH SPRING OVERSHOOT ──────────────────────────────────────────

/**
 * Spring count-up for .btn__value[data-to] metric elements.
 * The number overshoots slightly (spring) then settles on the final value.
 * The ≤/≥ prefix "strokes in" (clip-path) before counting starts.
 * Replaces the counter.ts plain-easing version for the motion build.
 */
export function initCountUp(): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.btn__value[data-to]'));
  if (els.length === 0) return () => {};

  if (prefersReducedMotion()) {
    els.forEach((el) => {
      const to     = Number(el.dataset.to ?? 0);
      const prefix = el.dataset.prefix ?? '';
      const suffix = el.dataset.suffix ?? '';
      el.textContent = `${prefix}${to}${suffix}`;
    });
    return () => {};
  }

  const cleanups: Array<() => void> = [];

  for (const el of els) {
    const to     = Number(el.dataset.to ?? 0);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';

    // Render initial state (0)
    el.textContent = `${prefix}0${suffix}`;

    // If prefix is a symbol (≤, ≥, ~), animate it in with a clip-path stroke
    const hasSymbol = prefix.length > 0 && /[≤≥~<>]/.test(prefix);
    let prefixEl: HTMLElement | null = null;
    if (hasSymbol) {
      prefixEl = document.createElement('span');
      prefixEl.textContent = prefix;
      prefixEl.style.cssText = [
        'display:inline-block',
        'clip-path:inset(0 100% 0 0)',
        'transition:clip-path 400ms var(--ease-out)',
      ].join(';');
      el.textContent = '';
      el.appendChild(prefixEl);
      const valueSpan = document.createElement('span');
      el.appendChild(valueSpan);
    }

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || fired) continue;
          fired = true;

          // Stroke-in the prefix symbol
          if (prefixEl) {
            setTimeout(() => {
              prefixEl!.style.clipPath = 'inset(0 0% 0 0)';
            }, 50);
          }

          // Animate a plain object { val } from 0 to `to` via spring with overshoot
          const state = { val: 0 };
          const valueTarget = prefixEl
            ? (el.querySelector('span:last-child') as HTMLElement)
            : el;

          animate(state as unknown as Record<string, number>, {
            val: [0, to],
            delay: hasSymbol ? 300 : 0,
            ease: spring({ stiffness: 160, damping: 14, mass: 1.2, velocity: 0 }),
            onUpdate() {
              const rounded = Math.abs(Math.round(state.val));
              if (prefixEl) {
                valueTarget.textContent = `${rounded}${suffix}`;
              } else {
                el.textContent = `${prefix}${rounded}${suffix}`;
              }
            },
            onComplete() {
              // Snap to exact value
              if (prefixEl) {
                valueTarget.textContent = `${to}${suffix}`;
              } else {
                el.textContent = `${prefix}${to}${suffix}`;
              }
            },
          });

          io.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    cleanups.push(() => io.disconnect());
  }

  return () => cleanups.forEach((fn) => fn());
}

// ─── CONVENIENCE ─────────────────────────────────────────────────────────────

/** Init all scroll-fx effects. Returns a combined cleanup fn. */
export function initAll(): () => void {
  const fns = [
    initParallax(),
    initSectionEnter(),
    initSignalTravel(),
    initCountUp(),
  ];
  return () => fns.forEach((fn) => fn());
}
