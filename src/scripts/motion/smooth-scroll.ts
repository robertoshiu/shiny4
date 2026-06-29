/**
 * smooth-scroll.ts — Lenis smooth scroll + RAF loop.
 *
 * API:
 *   initSmoothScroll()  → Lenis | null   (null under reduced-motion)
 *   getLenis()          → Lenis | null   (access the singleton after init)
 *   destroySmoothScroll()               (cleanup)
 *
 * Under reduced-motion: Lenis is never constructed; native scroll is untouched.
 * The RAF loop is self-contained here so other modules can subscribe via
 * `getLenis()?.on('scroll', cb)`.
 */

import Lenis from 'lenis';
import { prefersReducedMotion } from '../theme-motion';

let lenis: Lenis | null = null;
let rafId = 0;

export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;
  if (typeof window === 'undefined') return null;
  if (lenis) return lenis;

  lenis = new Lenis({
    // Phase-0 pacing: slower, more deliberate / "documented walkthrough" feel.
    // Before: duration 1.1, wheelMultiplier 0.9
    // After:  duration 1.6, wheelMultiplier 0.65
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.65,
    touchMultiplier: 1.8,
    // Prevent Lenis from hijacking hash-link jumps.
    anchors: true,
  });

  function raf(time: number) {
    lenis!.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  window.addEventListener('pagehide', destroySmoothScroll, { once: true });

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroySmoothScroll(): void {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}
