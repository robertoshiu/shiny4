/**
 * diagram.ts — Scroll-scrub motion for DiagramField inline-SVG exploded assemblies.
 *
 * API:
 *   initDiagramExplode() → () => void   (returns cleanup fn)
 *
 * Behaviour:
 *   LAYER A — draw-in (desktop + non-Save-Data), one-shot IntersectionObserver:
 *     createDrawable on [data-flow], [data-leader], [data-centerline] paths.
 *     Stagger draw ['0 0','0 1'] + beam sweep.
 *
 *   LAYER B — scroll-scrub explode (all non-reduced, incl. mobile):
 *     Lenis + window-scroll fallback.
 *     Parts lerp translate(0,0) → translate(exDx·p, exDy·p) as scroll progresses.
 *
 *   Under prefers-reduced-motion: returns no-op; markup shows final exploded state.
 *   Under Save-Data / no-JS: same — final state shown, no JS transforms.
 */

import { createTimeline, createDrawable, stagger } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';
import { getLenis } from './smooth-scroll';

const saveData = !!(navigator as { connection?: { saveData?: boolean } }).connection?.saveData;

export function initDiagramExplode(): () => void {
  if (prefersReducedMotion()) return () => {};

  const root = document.querySelector<HTMLElement>('[data-diagram-id]');
  if (!root) return () => {};

  const isDesktopNonSaveData = !saveData && matchMedia('(min-width: 48rem)').matches;

  const parts = Array.from(root.querySelectorAll<HTMLElement>('[data-part]'));
  if (parts.length === 0) return () => {};

  // ── Set assembled start state in JS (markup default = exploded/final) ──────
  // This mirrors cleanroom-scan.ts: inked.style.clipPath = 'inset(...)' set in JS.
  // No-JS/SSR users always see the fully-exploded final state.
  parts.forEach((p) => {
    p.style.transform = 'translate(0,0)';
  });

  // ── LAYER B: Scroll-scrub explode ─────────────────────────────────────────
  const figure = root.querySelector<HTMLElement>('.dg__figure');
  const beam   = root.querySelector<HTMLElement>('.dg__beam');

  function updateScroll(): void {
    if (!figure) return;
    const r = figure.getBoundingClientRect();
    const h = figure.clientHeight || innerHeight;
    // p=0 when figure enters viewport top, p=1 when figure leaves viewport bottom
    const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + h)));

    for (const part of parts) {
      const dx = +(part.dataset.exDx ?? 0);
      const dy = +(part.dataset.exDy ?? 0);
      part.style.transform = `translate(${(dx * p).toFixed(2)}px,${(dy * p).toFixed(2)}px)`;
    }
  }

  addEventListener('scroll', updateScroll, { passive: true });
  const lenis = getLenis();
  if (lenis) lenis.on('scroll', updateScroll);
  updateScroll();

  // ── LAYER A: draw-in (desktop + non-Save-Data only) ───────────────────────
  let io: IntersectionObserver | null = null;
  if (isDesktopNonSaveData) {
    const drawPaths = Array.from(
      root.querySelectorAll<SVGPathElement>('[data-flow], [data-leader], [data-centerline]')
    );

    if (drawPaths.length > 0) {
      let fired = false;
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || fired) continue;
            fired = true;
            io?.disconnect();

            drawPaths.forEach((p) => createDrawable(p, 0, 0));

            const tl = createTimeline({ defaults: { ease: 'cubicBezier(0.22, 1, 0.36, 1)' } });
            tl.add(
              drawPaths,
              {
                draw: ['0 0', '0 1'],
                delay: stagger(40),
                duration: 720,  // --dur-slow token (DESIGN.md)
                onUpdate(anim: { progress: number }) {
                  if (!beam) return;
                  const prog = anim.progress;
                  const opacity =
                    prog > 0.05 && prog < 0.95
                      ? Math.sin(Math.min(prog / 0.95, 1) * Math.PI) * 0.75
                      : 0;
                  beam.style.opacity = String(opacity);
                },
                onComplete() {
                  if (beam) beam.style.opacity = '0';
                },
              },
              0
            );
          }
        },
        { threshold: 0.2 }
      );
      io.observe(root);
    }
  }

  return () => {
    removeEventListener('scroll', updateScroll);
    getLenis()?.off('scroll', updateScroll);
    io?.disconnect();
  };
}
