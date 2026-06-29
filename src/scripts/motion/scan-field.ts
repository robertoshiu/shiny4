/**
 * scan-field.ts — Full-bleed ScanField animation driver.
 *
 * Implements six Tier-1 axes:
 *   Axis 1: full-bleed environment — CSS handles positioning (no JS needed)
 *   Axis 2: scroll-scrub          — plane offsets driven by window.scrollY
 *   Axis 3: depth parallax +
 *            cursor micro-parallax — translateX/Y per plane via rAF
 *   Axis 4: continuous ambient life — wafer dash-march (loop), FFU flicker (loop),
 *                                     periodic scan sweep (~every 6 s)
 *   Axis 5: density + depth-fog    — SVG geometry in ScanField.astro; fog in CSS
 *   Axis 6: chromatic energy       — chroma layer opacity driven by cursor speed
 *
 * Degradation:
 *   prefers-reduced-motion → returns no-op immediately; no timelines, no loops
 *   Save-Data              → no loops; planes still apply CSS transform from rAF
 *   mobile < 48rem         → no cursor parallax, lighter animation
 *   offscreen / tab-hidden → rAF pauses (visible flag)
 *
 * API: initScanField() → () => void (returns cleanup fn)
 */

import { animate, stagger } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';

// Save-Data detection (same idiom as dot-field.ts)
const saveData = !!(navigator as { connection?: { saveData?: boolean } }).connection?.saveData;

export function initScanField(): () => void {
  // Axis gate: no motion at all under reduced-motion
  if (prefersReducedMotion()) return () => {};

  const root = document.querySelector<HTMLElement>('[data-scan-field]');
  if (!root) return () => {};

  const isDesktop = matchMedia('(min-width: 48rem)').matches;

  // Gather depth-plane SVG groups
  const planeCeiling = root.querySelector<SVGGElement>('[data-sf-plane="ceiling"]');
  const planeShell   = root.querySelector<SVGGElement>('[data-sf-plane="shell"]');
  const planeTools   = root.querySelector<SVGGElement>('[data-sf-plane="tools"]');
  const planeAccents = root.querySelector<SVGGElement>('[data-sf-plane="accents"]');

  const chromaClay = root.querySelector<SVGGElement>('.sf__chroma--clay');
  const chromaSage = root.querySelector<SVGGElement>('.sf__chroma--sage');
  const beam       = root.querySelector<HTMLElement>('.sf__beam');

  const cleanups: Array<() => void> = [];

  // ── Axis 3: Cursor micro-parallax state ─────────────────────────────────────
  let cursorNX = 0;   // normalized [-0.5, 0.5]
  let cursorNY = 0;
  let lastNX   = 0;
  let lastNY   = 0;
  let cursorSpeed = 0; // for Axis 6

  const MAX_PX     = isDesktop ? 32 : 0;
  const C_CEILING  = 0.3;
  const C_SHELL    = 0.6;
  const C_TOOLS    = 0.85;
  const C_ACCENTS  = 1.0;

  // Scroll parallax — deeper camera pan for pronounced parallax read
  const SCROLL_FAR = 0.06;
  const SCROLL_MID = 0.028;

  // ── rAF loop ─────────────────────────────────────────────────────────────────
  let visible  = true;
  let tabHidden = false;
  let rafId    = 0;
  let sweeping = false;

  function applyPlane(el: SVGGElement | null, cx: number, scrollDelta: number) {
    if (!el) return;
    const tx = cursorNX * MAX_PX * cx;
    const ty = cursorNY * MAX_PX * cx + scrollDelta;
    el.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`;
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    if (!visible || tabHidden) return;

    const sy = window.scrollY;

    // Axis 2 + 3: plane parallax (scroll + cursor)
    applyPlane(planeCeiling, C_CEILING, -sy * SCROLL_FAR);
    applyPlane(planeShell,   C_SHELL,   -sy * SCROLL_MID);
    applyPlane(planeTools,   C_TOOLS,   0);
    applyPlane(planeAccents, C_ACCENTS, 0);

    // Axis 6: chromatic opacity — higher floor + cursor-speed boost
    if (!saveData) {
      const chromaBase = 0.35;
      const chromaMax  = 0.78;
      const chromaAlpha = Math.min(chromaBase + cursorSpeed * chromaMax, chromaMax);
      if (chromaClay) chromaClay.style.opacity = chromaAlpha.toFixed(3);
      if (chromaSage) chromaSage.style.opacity = chromaAlpha.toFixed(3);
    }

    // Decay cursor speed each tick (~60fps → 0.97 decay)
    cursorSpeed *= 0.97;
  }

  rafId = requestAnimationFrame(tick);

  // ── Cursor tracking (Axis 3 + 6, desktop only) ───────────────────────────────
  if (isDesktop) {
    function onPointerMove(e: PointerEvent) {
      const nx = e.clientX / window.innerWidth  - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      const dx = nx - lastNX;
      const dy = ny - lastNY;
      cursorSpeed = Math.min(Math.hypot(dx, dy) * 15, 1);
      lastNX = cursorNX;
      lastNY = cursorNY;
      cursorNX = nx;
      cursorNY = ny;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));
  }

  // ── Visibility pause (Axis 4 requirement) ────────────────────────────────────
  function onVisibilityChange() { tabHidden = document.hidden; }
  document.addEventListener('visibilitychange', onVisibilityChange);
  cleanups.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));

  const io = new IntersectionObserver(
    (entries) => { visible = entries[0]?.isIntersecting ?? true; },
    { threshold: 0 },
  );
  io.observe(root);
  cleanups.push(() => io.disconnect());

  // ── Axis 4: Ambient loops ────────────────────────────────────────────────────
  if (!saveData) {
    // Wafer dash march — stroke-dashoffset loop (dasharray=8 5, pattern=13)
    const waferPath = root.querySelector<SVGPathElement>('[data-scan-layer="wafers"] path');
    if (waferPath) {
      const waferAnim = animate(waferPath, {
        strokeDashoffset: [0, -26],
        duration: 2600,
        ease: 'linear',
        loop: true,
      });
      cleanups.push(() => waferAnim.pause());
    }

    // FFU tile flicker — sample every 5th tile, gentle opacity pulse
    if (isDesktop) {
      const ffuTiles = Array.from(
        root.querySelectorAll<SVGElement>('.sf__ffu-tile'),
      ).filter((_, i) => i % 5 === 0).slice(0, 8);

      if (ffuTiles.length > 0) {
        const ffuAnim = animate(ffuTiles, {
          opacity: [0.3, 0.6, 0.3],
          duration: 3200,
          delay: stagger(500),
          ease: 'inOut(2)',
          loop: true,
        });
        cleanups.push(() => ffuAnim.pause());
      }

      // Periodic scan sweep — beam travels from top to bottom, then hides
      function runScanSweep() {
        if (!beam || sweeping) return;
        sweeping = true;
        beam.style.opacity = '0';
        beam.style.top     = '0%';

        const sweepAnim = animate(beam, {
          top:     ['0%', '100%'],
          opacity: [0, 0.95, 0.95, 0],
          duration: 1800,
          ease: 'linear',
          onComplete() {
            sweeping = false;
            if (beam) beam.style.opacity = '0';
          },
        });
        cleanups.push(() => sweepAnim.pause());
      }

      // Initial sweep after short page-load settle
      const initTimer = setTimeout(runScanSweep, 1200);

      // Repeating sweep every 5 s (perpetual loop)
      const sweepTimer = setInterval(runScanSweep, 5000);

      cleanups.push(() => {
        clearTimeout(initTimer);
        clearInterval(sweepTimer);
      });
    }
  }

  return () => {
    cancelAnimationFrame(rafId);
    cleanups.forEach((fn) => fn());
  };
}
