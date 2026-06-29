/**
 * theme-motion.ts — Core motion utilities + page-load BOOT timeline.
 *
 * Exported API:
 *
 *   prefersReducedMotion() → boolean
 *     True if the user has prefers-reduced-motion: reduce set.
 *     Safe to call on SSR (returns false when window is undefined).
 *
 *   revealOnEnter(selector, opts?)
 *     Legacy simple reveal (translateY + opacity) for .reveal elements.
 *     Under reduced-motion: forces final state with no IO/timeline.
 *
 *   bootMotion()
 *     The cinematic page-load boot sequence (~1.4s total):
 *       0ms   — HUD corner brackets draw in (clip-path)
 *       120ms — Hero canvas/poster fades up
 *       200ms — Dot-matrix ignites (handled by dot-field.ts via IO)
 *       350ms — Hero headline words stagger in (spring)
 *       700ms — Hero chips + actions cascade in
 *       900ms — Nav links fade in
 *     Under reduced-motion: skips timeline; renders all final states immediately.
 *     Safe to call on pages that lack a hero — targets are checked before use.
 */

import { animate, stagger, spring, createTimeline } from 'animejs';

// Track boot invocations so that persisted elements (Header) are not
// re-hidden and re-animated on every View Transition navigation.
let _bootCount = 0;

// Guard: prevent double-execution within the same astro:page-load dispatch.
// Both BaseLayout and per-page scripts call bootMotion(); the flag ensures
// only the first call per event dispatch actually runs the timeline.
// Reset via queueMicrotask so the next page-load can boot cleanly.
let _booting = false;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Legacy reveal (keep for backward compat with existing .reveal usage) ────

export interface RevealOptions {
  threshold?: number;
}

export function revealOnEnter(selector: string, opts: RevealOptions = {}): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (els.length === 0) return;

  if (prefersReducedMotion()) {
    for (const el of els) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
    return;
  }

  for (const el of els) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        animate(target, {
          opacity:    [0, 1],
          translateY: [24, 0],
          ease:       spring({ stiffness: 260, damping: 22, mass: 0.9 }),
        });
        io.unobserve(target);
      }
    },
    { threshold: opts.threshold ?? 0.15 },
  );

  for (const el of els) io.observe(el);
}

// ─── HUD corner brackets ─────────────────────────────────────────────────────

/** Inject four SVG corner-bracket decorations into the page. */
function injectHudBrackets(): HTMLElement | null {
  if (document.getElementById('hud-brackets')) return null;

  const container = document.createElement('div');
  container.id = 'hud-brackets';
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = [
    'position:fixed', 'inset:0', 'pointer-events:none',
    'z-index:100', 'overflow:hidden',
  ].join(';');

  const SIZE = 28;
  const S    = 1.5; // stroke width
  const C    = '#E9C46A'; // gold

  // Four corners: [left%, top%, rotationDeg]
  const corners: Array<[string, string, number]> = [
    ['1.5%', '1.5%', 0],
    ['98.5%', '1.5%', 90],
    ['98.5%', '98.5%', 180],
    ['1.5%', '98.5%', 270],
  ];

  corners.forEach(([left, top, rot]) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width',  String(SIZE));
    svg.setAttribute('height', String(SIZE));
    svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);
    svg.style.cssText = [
      `position:absolute`, `left:${left}`, `top:${top}`,
      `transform:translate(-50%,-50%) rotate(${rot}deg)`,
      `clip-path:inset(0 100% 0 0)`,
    ].join(';');

    // L-bracket: horizontal + vertical lines from top-left corner
    const H = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    H.setAttribute('x1', '1'); H.setAttribute('y1', '1');
    H.setAttribute('x2', String(SIZE - 2)); H.setAttribute('y2', '1');
    H.setAttribute('stroke', C); H.setAttribute('stroke-width', String(S));

    const V = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    V.setAttribute('x1', '1'); V.setAttribute('y1', '1');
    V.setAttribute('x2', '1'); V.setAttribute('y2', String(SIZE - 2));
    V.setAttribute('stroke', C); V.setAttribute('stroke-width', String(S));

    svg.appendChild(H);
    svg.appendChild(V);
    container.appendChild(svg);
  });

  document.body.prepend(container);
  return container;
}

// ─── BOOT TIMELINE ───────────────────────────────────────────────────────────

/**
 * Cinematic boot sequence. Called on every astro:page-load (initial + VT navs).
 * Under reduced-motion: renders all targets to their final state immediately.
 * On the first call: full boot including nav fade-in.
 * On subsequent calls: nav is persisted (transition:persist) so skip hiding it.
 */
export function bootMotion(): void {
  // Prevent double-execution when both BaseLayout and a per-page script call
  // bootMotion() in the same astro:page-load event dispatch.
  if (_booting) return;
  _booting = true;
  queueMicrotask(() => { _booting = false; });

  const isFirstBoot = _bootCount === 0;
  _bootCount++;

  // ── Reduced-motion: skip timeline, force final states ──
  if (prefersReducedMotion()) {
    // Ensure everything is visible
    const hero    = document.querySelector<HTMLElement>('.hero__content');
    const heroTitle = document.querySelector<HTMLElement>('.hero__title');
    const nav     = document.querySelector<HTMLElement>('.site-header');
    const canvas  = document.getElementById('hero-canvas');
    if (hero)    { hero.style.opacity = '1'; hero.style.transform = 'none'; }
    if (heroTitle) { heroTitle.style.opacity = '1'; heroTitle.style.transform = 'none'; }
    if (nav)     { nav.style.opacity = '1'; }
    if (canvas)  { (canvas as HTMLElement).style.opacity = '1'; }
    return;
  }

  // ── Inject HUD brackets ──
  const brackets = injectHudBrackets();
  const bracketSvgs = brackets
    ? Array.from(brackets.querySelectorAll<SVGElement>('svg'))
    : [];

  // ── Gather hero targets (only present on pages with a hero) ──
  const heroContent = document.querySelector<HTMLElement>('.hero__content');
  const heroTitle   = document.querySelector<HTMLElement>('.hero__title');
  const heroEyebrow = document.querySelector<HTMLElement>('.hero__eyebrow');
  const heroLead    = document.querySelector<HTMLElement>('.hero__lead');
  const heroChips   = document.querySelectorAll<HTMLElement>('.hero__chips .chip');
  const heroActions = document.querySelectorAll<HTMLElement>('.hero__actions > *');
  const nav         = document.querySelector<HTMLElement>('.site-header');
  const heroCanvas  = document.getElementById('hero-canvas') as HTMLElement | null;

  // Set initial states
  if (bracketSvgs.length) {
    bracketSvgs.forEach((s) => { s.style.clipPath = 'inset(0 100% 0 0)'; });
  }
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
  }
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(32px)';
  }
  if (heroEyebrow) { heroEyebrow.style.opacity = '0'; }
  if (heroLead)    { heroLead.style.opacity = '0';    }
  heroChips.forEach((c) => { c.style.opacity = '0'; c.style.transform = 'translateY(16px)'; });
  heroActions.forEach((a) => { a.style.opacity = '0'; a.style.transform = 'translateY(12px)'; });
  // Only hide nav on first boot; it is transition:persist'd on subsequent navs.
  if (nav && isFirstBoot) { nav.style.opacity = '0'; }

  // ── Build timeline ──
  const tl = createTimeline({ defaults: { ease: 'out(3)' } });

  // 0ms — HUD brackets draw in (clip-path left→right reveal)
  if (bracketSvgs.length) {
    tl.add(bracketSvgs, {
      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
      delay:    stagger(60),
      duration: 380,
      ease:     'out(3)',
    }, 0);
  }

  // 80ms — Nav fades in (first boot only; persisted on subsequent navs)
  if (nav && isFirstBoot) {
    tl.add(nav, { opacity: [0, 1], duration: 400 }, 80);
  }

  // 200ms — Hero canvas fades up (the WebGL/2D ember field)
  if (heroCanvas) {
    tl.add(heroCanvas, {
      opacity:  [0, 1],
      duration: 600,
      ease:     'out(2)',
    }, 200);
  }

  // 350ms — Hero eyebrow label
  if (heroEyebrow) {
    tl.add(heroEyebrow, {
      opacity:    [0, 1],
      translateY: [12, 0],
      duration:   400,
    }, 350);
  }

  // 440ms — Hero title lines cascade (spring stagger per word)
  if (heroTitle) {
    tl.add(heroTitle, {
      opacity:    [0, 1],
      translateY: [32, 0],
      duration:   520,
      ease:       spring({ stiffness: 260, damping: 22, mass: 0.9 }),
    }, 440);
  }

  // 620ms — Hero lead paragraph
  if (heroLead) {
    tl.add(heroLead, {
      opacity:  [0, 1],
      duration: 380,
    }, 620);
  }

  // 700ms — Metric chips stagger
  if (heroChips.length) {
    tl.add(heroChips, {
      opacity:    [0, 1],
      translateY: [16, 0],
      delay:      stagger(60),
      duration:   320,
      ease:       spring({ stiffness: 320, damping: 24 }),
    }, 700);
  }

  // 850ms — CTA actions
  if (heroActions.length) {
    tl.add(heroActions, {
      opacity:    [0, 1],
      translateY: [12, 0],
      delay:      stagger(80),
      duration:   320,
    }, 850);
  }
}
