/**
 * magnetic.ts — Magnetic button pull + gold underline stroke-draw on links.
 *
 * API:
 *   initMagnetic()  → () => void    wire up all [data-magnetic] elements
 *   bindMagnetic(el, opts?)         bind a single element
 *   initLinkUnderlines()            gold SVG underline stroke-draw on <a> hover
 *
 * Data attributes:
 *   data-magnetic                   — apply magnetic pull to this element
 *   data-magnetic-strength="0.4"   — optional: 0..1 pull strength (default 0.35)
 *
 * Behavior:
 *   • When pointer enters range (1.5× element bounding box), the element
 *     smoothly translates toward the pointer (up to ±maxDisp px).
 *   • On pointer leave, element spring-snaps back to origin with anime.js.
 *   • Under reduced-motion: magnetic is disabled; links still get underlines.
 *
 * Link underlines:
 *   • Nav <a> links and footer links get a thin gold SVG underline that
 *     stroke-draws in on :focus-visible / :hover via CSS clip-path animation.
 *   • Applied to elements matching [data-link-underline] or .nav-link.
 */

import { animate, spring } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';

export interface MagneticOptions {
  strength?: number;   // 0..1 translation multiplier (default 0.35)
  maxDisp?: number;    // max displacement in px (default 22)
}

/** Bind magnetic pull to a single element. Returns cleanup fn. */
export function bindMagnetic(el: HTMLElement, opts: MagneticOptions = {}): () => void {
  if (prefersReducedMotion()) return () => {};
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};

  const strength = opts.strength ?? 0.35;
  const maxDisp  = opts.maxDisp  ?? 22;

  let inRange = false;
  let tx = 0; let ty = 0;
  let cx = 0; let cy = 0;
  let rafId = 0;

  function getCenter() {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }

  function onMove(e: MouseEvent) {
    const { x, y, w, h } = getCenter();
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    const zone = Math.max(w, h) * 1.5;

    if (Math.abs(dx) < zone && Math.abs(dy) < zone) {
      if (!inRange) inRange = true;
      tx = Math.max(-maxDisp, Math.min(maxDisp, dx * strength));
      ty = Math.max(-maxDisp, Math.min(maxDisp, dy * strength));
    } else if (inRange) {
      inRange = false;
      // Spring snap back
      cancelAnimationFrame(rafId);
      animate(el, {
        translateX: 0,
        translateY: 0,
        ease: spring({ stiffness: 350, damping: 26, mass: 0.8 }),
      });
      tx = 0; ty = 0; cx = 0; cy = 0;
    }
  }

  function loop() {
    rafId = requestAnimationFrame(loop);
    if (!inRange) return;
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    el.style.transform = `translate(${cx}px, ${ty}px)`;
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  rafId = requestAnimationFrame(loop);

  return function destroy() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMove);
    el.style.transform = '';
  };
}

/** Wire up all [data-magnetic] elements in the document. */
export function initMagnetic(): () => void {
  const cleanups: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    cleanups.push(bindMagnetic(el));
  });
  return () => cleanups.forEach((fn) => fn());
}

/**
 * Gold SVG underline stroke-draw for links.
 * Injects a <span class="link-line"> inside each matching <a> and uses
 * CSS clip-path to draw/erase it on hover/focus. Call once on DOMContentLoaded.
 *
 * Targets: [data-link-underline] a, .nav-link, .footer-link (all <a> tags)
 */
export function initLinkUnderlines(): void {
  const SELECTORS = '.nav-link, [data-link-underline] a, .footer-link';
  document.querySelectorAll<HTMLAnchorElement>(SELECTORS).forEach((a) => {
    if (a.querySelector('.link-line')) return; // already applied
    a.style.position = 'relative';
    a.style.display = a.style.display || 'inline-block';

    const line = document.createElement('span');
    line.className = 'link-line';
    line.setAttribute('aria-hidden', 'true');
    line.style.cssText = [
      'position:absolute', 'bottom:-2px', 'left:0', 'width:100%', 'height:1px',
      'background:var(--sun)',
      // clip-path draws from left to right; CSS transition drives it
      'clip-path:inset(0 100% 0 0)',
      'transition:clip-path var(--dur-base) var(--ease-out)',
      'pointer-events:none',
    ].join(';');
    a.appendChild(line);

    function open() { line.style.clipPath = 'inset(0 0% 0 0)'; }
    function close() { line.style.clipPath = 'inset(0 100% 0 0)'; }

    a.addEventListener('mouseenter', open);
    a.addEventListener('focusin',    open);
    a.addEventListener('mouseleave', close);
    a.addEventListener('focusout',   close);
  });
}
