/**
 * cleanroom-scan.ts — Scroll-triggered scan wipe for CleanroomCutaway.
 *
 * API:
 *   initCleanroomScan() → () => void   (returns cleanup fn)
 *
 * Behaviour:
 *   LAYER 1 (always, when motion OK):
 *     On IntersectionObserver enter (threshold 0.2, one-shot):
 *     - Sets clipPath start state in JS (not in markup — no-JS users see full diagram).
 *     - Animates clipPath 'inset(0 0 100% 0)' → 'inset(0 0 0% 0)' over 1200ms (--dur-cinematic).
 *     - Drives the scan-beam top position (progress%) and opacity mid-sweep.
 *   LAYER 2 (desktop + non-Save-Data):
 *     - createDrawable on [data-scan-layer="wafers"], [data-scan-layer="dr"],
 *       [data-scan-layer="subfab"] paths — staggered draw-in 240ms after wipe start.
 *     - Gated behind !saveData && matchMedia('(min-width: 48rem)').matches.
 *
 *   Under prefers-reduced-motion: returns no-op; markup shows final state.
 */

import { createTimeline, createDrawable, stagger } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';

// Save-Data detection (same idiom as dot-field.ts)
const saveData = !!(navigator as { connection?: { saveData?: boolean } }).connection?.saveData;

export function initCleanroomScan(): () => void {
  if (prefersReducedMotion()) return () => {};

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-fab]'));
  if (roots.length === 0) return () => {};

  const cleanups: Array<() => void> = [];
  const isDesktopNonSaveData =
    !saveData && matchMedia('(min-width: 48rem)').matches;

  for (const root of roots) {
    const inked = root.querySelector<HTMLElement>('.fab__inked');
    const beam  = root.querySelector<HTMLElement>('.fab__beam');
    if (!inked) continue;

    // Set hidden start state in JS — markup default is clip-path:none (final state)
    // so no-JS / SSR users always see the complete diagram.
    inked.style.clipPath = 'inset(0 0 100% 0)';

    // Gather accent-layer paths for Layer 2 draw-in
    const accentPaths: SVGPathElement[] = [];
    if (isDesktopNonSaveData) {
      root
        .querySelectorAll<SVGPathElement>(
          '[data-scan-layer="wafers"] path, [data-scan-layer="dr"] path, [data-scan-layer="subfab"] path',
        )
        .forEach((p) => accentPaths.push(p));
    }

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || fired) continue;
          fired = true;
          io.disconnect();

          // ── LAYER 1: clip-path wipe (top → bottom = laminar flow direction) ──
          // CSS clip-path 'inset(top right bottom left)':
          // start: inset(0 0 100% 0)  → full clip from bottom (nothing visible)
          // end:   inset(0 0 0% 0)    → no clip (full diagram visible)
          const tl = createTimeline({ defaults: { ease: 'cubicBezier(0.22, 1, 0.36, 1)' } });

          tl.add(inked, {
            clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
            duration: 1200,
            onUpdate(anim: { progress: number }) {
              // Drive beam position — progress 0→1 maps to top 0%→100%
              if (!beam) return;
              const p = anim.progress;
              // Beam is visible from 5%–95% progress; peaks at 50%
              const opacity = p > 0.05 && p < 0.95
                ? Math.sin(Math.min(p / 0.95, 1) * Math.PI) * 0.85
                : 0;
              beam.style.top = `${p * 100}%`;
              beam.style.opacity = String(opacity);
            },
            onComplete() {
              if (beam) beam.style.opacity = '0';
            },
          });

          // ── LAYER 2: accent path draw-ins (desktop + non-Save-Data) ──
          if (isDesktopNonSaveData && accentPaths.length > 0) {
            // createDrawable wraps each SVG path for draw animation.
            // Must be called before animating so the path gets dasharray set up.
            accentPaths.forEach((p) => createDrawable(p, 0, 0));
            // Animate draw from start 0 end 0 → start 0 end 1, staggered,
            // starting 240ms after the wipe begins.
            tl.add(
              accentPaths,
              {
                draw: ['0 0', '0 1'],
                delay: stagger(40),
                duration: 600,
                ease: 'cubicBezier(0.22, 1, 0.36, 1)',
              },
              240,
            );
          }
        }
      },
      { threshold: 0.2 },
    );

    io.observe(root);
    cleanups.push(() => io.disconnect());
  }

  return () => cleanups.forEach((fn) => fn());
}
