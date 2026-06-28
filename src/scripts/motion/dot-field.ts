/**
 * dot-field.ts — cursor-reactive ember dot-matrix canvas.
 *
 * API:
 *   mount(container, opts?) → () => void   (returns cleanup fn)
 *
 * Usage:
 *   Add `data-dot-field` to a section/div. The canvas is inserted as a
 *   position:absolute layer behind the section content (container must have
 *   position:relative or the module sets it).
 *
 *   import { mount } from './motion/dot-field';
 *   mount(document.querySelector('[data-dot-field]')!);
 *
 * Options (DotFieldOptions):
 *   cols?          number   columns in dot grid (default 28)
 *   rows?          number   rows in dot grid (default 18)
 *   dotRadius?     number   base dot radius in px (default 2.5)
 *   interactRadius? number  pointer influence radius in px (default 140)
 *
 * Under reduced-motion: returns a no-op immediately; canvas is never inserted.
 * Performance: DPR capped at 2; canvas redrawn at ~60fps; IO-paused offscreen.
 */

import { animate, spring } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';

export interface DotFieldOptions {
  cols?: number;
  rows?: number;
  dotRadius?: number;
  interactRadius?: number;
}

// Warm Foundry palette
const BASE_R = 0xe9; const BASE_G = 0xc4; const BASE_B = 0x6a; // #E9C46A gold
const HOT_R  = 0xe0; const HOT_G  = 0x7a; const HOT_B  = 0x5f; // #E07A5F clay

interface DotState {
  /** Base grid X (canvas px) */
  bx: number;
  /** Base grid Y (canvas px) */
  by: number;
  /** Animated scale 0→1 (driven by anime.js during ignite) */
  scale: number;
  /** Animated opacity 0→1 (driven by anime.js during ignite) */
  opacity: number;
  /** Per-dot target opacity (varies by row for diagonal fade) */
  targetOpacity: number;
}

export function mount(container: HTMLElement, opts: DotFieldOptions = {}): () => void {
  if (prefersReducedMotion()) return () => {};
  if (!container) return () => {};

  const COLS   = opts.cols ?? 28;
  const ROWS   = opts.rows ?? 18;
  const DRAD   = opts.dotRadius ?? 2.5;
  const IRAD   = opts.interactRadius ?? 140;

  // Inject canvas
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  // z-index:-1 places the canvas at stacking step 2 (negative z-index) within
  // whatever stacking context it lives in, so it is always BELOW non-positioned
  // section content (steps 3–5) and below content painted at z-index:0+ (step 6+).
  // pointer-events:none ensures the canvas never blocks clicks/hovers.
  canvas.style.cssText = [
    'position:absolute', 'inset:0', 'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:-1', 'display:block',
  ].join(';');

  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  container.prepend(canvas);

  const ctx = canvas.getContext('2d', { alpha: true })!;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = container.clientWidth;
    const H = container.clientHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.scale(dpr, dpr);
    rebuildGrid(W, H);
  }

  // State array: one JS object per dot, animated by anime.js (scale/opacity).
  let dots: DotState[] = [];

  function rebuildGrid(W: number, H: number) {
    const newDots: DotState[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const bx = ((c + 0.5) / COLS) * W;
        const by = ((r + 0.5) / ROWS) * H;
        // Diagonal fade: dense bottom-left, sparse top-right
        const ux = c / COLS;
        const uy = 1 - r / ROWS;
        const diagFade = Math.max(0, 1 - ux * 0.45 - uy * 0.28);
        const targetOpacity = 0.25 + diagFade * 0.5;
        newDots.push({ bx, by, scale: 0, opacity: 0, targetOpacity });
      }
    }
    dots = newDots;
  }

  // Ignite: animate each dot from scale/opacity 0 with a radial spring stagger.
  let ignited = false;

  function ignite() {
    if (ignited || prefersReducedMotion()) return;
    ignited = true;
    const cxGrid = COLS / 2;
    const cyGrid = ROWS / 2;

    dots.forEach((dot, i) => {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const dist = Math.hypot(c - cxGrid, r - cyGrid);
      // Radial delay: 0ms at center → ~300ms at corners
      const delay = dist * 20;
      // Slight opacity variation for organic look
      const finalOpacity = dot.targetOpacity * (0.75 + Math.random() * 0.25);

      animate(dot as unknown as Record<string, number>, {
        scale:   [0, 0.55 + Math.random() * 0.45],
        opacity: [0, finalOpacity],
        delay,
        ease: spring({ stiffness: 300, damping: 22, mass: 0.7 }),
      });
    });
  }

  // Mouse state (container-relative)
  let mx = -99999;
  let my = -99999;

  function onMouseMove(e: MouseEvent) {
    const rect = container.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // RAF draw loop — runs regardless of ignite so interactive updates are smooth
  let alive  = true;
  let running = false;
  let rafId  = 0;

  function draw() {
    if (!alive || !running) return;
    rafId = requestAnimationFrame(draw);
    const W = container.clientWidth;
    const H = container.clientHeight;
    // Clear the full canvas in device-pixel coordinates, bypassing any scale
    // transform, so every pixel is wiped each frame (no ghost accumulation).
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for (const dot of dots) {
      if (dot.opacity < 0.005 || dot.scale < 0.01) continue;

      const dx = mx - dot.bx;
      const dy = my - dot.by;
      const dist = Math.hypot(dx, dy);

      let dispX = 0;
      let dispY = 0;
      let sizeBoost = 0;
      let opacBoost = 0;
      let hotT = 0;

      if (dist < IRAD && dist > 0) {
        const t = 1 - dist / IRAD;
        hotT = t;
        // Displace dots toward cursor
        const unitX = dx / dist;
        const unitY = dy / dist;
        dispX = unitX * t * 16;
        dispY = unitY * t * 16;
        sizeBoost = t * 1.6;
        opacBoost = t * 0.4;
      }

      const finalScale   = dot.scale * (1 + sizeBoost);
      const finalOpacity = Math.min(1, dot.opacity + opacBoost);
      const radius       = DRAD * finalScale;

      if (radius < 0.3) continue;

      // Interpolate gold → clay by proximity
      const rr = Math.round(BASE_R + (HOT_R - BASE_R) * hotT);
      const gg = Math.round(BASE_G + (HOT_G - BASE_G) * hotT);
      const bb = Math.round(BASE_B + (HOT_B - BASE_B) * hotT);

      ctx.beginPath();
      ctx.arc(dot.bx + dispX, dot.by + dispY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rr},${gg},${bb},${finalOpacity})`;
      ctx.fill();
    }
  }

  // Resize observer
  const ro = new ResizeObserver(() => {
    ctx.resetTransform();
    resize();
  });
  ro.observe(container);
  resize();

  // IntersectionObserver: start/stop RAF + trigger ignite
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!running) {
            running = true;
            rafId = requestAnimationFrame(draw);
          }
          ignite();
        } else {
          running = false;
          cancelAnimationFrame(rafId);
        }
      }
    },
    { threshold: 0.1 },
  );
  io.observe(container);

  return function destroy() {
    alive = false;
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    ro.disconnect();
    io.disconnect();
    canvas.remove();
  };
}
