/**
 * cursor.ts — HUD custom cursor: gold ring/crosshair that morphs on interactives.
 *
 * API:
 *   initCursor() → () => void   (returns cleanup fn)
 *
 * Behavior:
 *  - Replaces the system cursor on non-touch devices (pointer: fine).
 *  - Resting state: small gold ring (18px) + thin crosshair tick marks.
 *  - Over [data-magnetic], <a>, <button>, <summary>: ring grows (32px) and a
 *    gold filled dot appears at center ("lock-on" tick).
 *  - Cursor lags behind pointer slightly (lerp 0.15) for cinematic feel.
 *  - Under reduced-motion: lerp snaps to 1 (instant follow), ring still shows.
 *  - On touch / coarse pointer: cursor element is hidden; system cursor restored.
 *
 * CSS classes on <body>:
 *  - `.cursor-ready`  — added when cursor initializes (hides OS cursor).
 *  - `.cursor-hover`  — added when over an interactive element.
 */

import { prefersReducedMotion } from '../theme-motion';

// Interactive selectors that trigger hover state
const INTERACTIVE = 'a, button, [role="button"], summary, [data-magnetic], label[for], input, select, textarea';

export function initCursor(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Only show on fine-pointer devices (mouse/trackpad), not touch.
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};

  // Guard against double-init within the same page load.
  // The BaseLayout teardown removes #hud-cursor before re-calling initCursor(),
  // so this check only blocks a second call without a preceding teardown (e.g.
  // if a per-page script also calls initCursor() after BaseLayout already did).
  if (document.getElementById('hud-cursor')) return () => {};

  const reduced = prefersReducedMotion();

  // Create cursor elements
  const root = document.createElement('div');
  root.id = 'hud-cursor';
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'z-index:9999',
    'pointer-events:none', 'will-change:transform',
  ].join(';');

  root.innerHTML = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer ring -->
      <circle class="c-ring" cx="20" cy="20" r="9" stroke="#E9C46A" stroke-width="1.25"/>
      <!-- Crosshair ticks (N/S/E/W) -->
      <line class="c-tick" x1="20" y1="6"  x2="20" y2="10" stroke="#E9C46A" stroke-width="1" opacity="0.6"/>
      <line class="c-tick" x1="20" y1="30" x2="20" y2="34" stroke="#E9C46A" stroke-width="1" opacity="0.6"/>
      <line class="c-tick" x1="6"  y1="20" x2="10" y2="20" stroke="#E9C46A" stroke-width="1" opacity="0.6"/>
      <line class="c-tick" x1="30" y1="20" x2="34" y2="20" stroke="#E9C46A" stroke-width="1" opacity="0.6"/>
      <!-- Center dot (visible on hover) -->
      <circle class="c-dot" cx="20" cy="20" r="2.5" fill="#E9C46A" opacity="0"/>
    </svg>
  `;

  document.body.appendChild(root);
  document.body.classList.add('cursor-ready');

  const ring = root.querySelector<SVGCircleElement>('.c-ring')!;
  const dot  = root.querySelector<SVGCircleElement>('.c-dot')!;
  const ticks = root.querySelectorAll<SVGLineElement>('.c-tick');

  let tx = 0; let ty = 0; // target (raw mouse)
  let cx = 0; let cy = 0; // current (lerped)
  let isHover = false;
  let rafId = 0;
  let alive = true;

  // Lerp factor — instant under reduced-motion
  const LERP = reduced ? 1 : 0.15;

  function setHover(on: boolean) {
    if (on === isHover) return;
    isHover = on;
    if (on) {
      document.body.classList.add('cursor-hover');
      ring.setAttribute('r', '15');
      ring.setAttribute('stroke-opacity', '0.9');
      dot.setAttribute('opacity', '0.85');
      ticks.forEach((t) => t.setAttribute('opacity', '0.2'));
    } else {
      document.body.classList.remove('cursor-hover');
      ring.setAttribute('r', '9');
      ring.setAttribute('stroke-opacity', '1');
      dot.setAttribute('opacity', '0');
      ticks.forEach((t) => t.setAttribute('opacity', '0.6'));
    }
  }

  function onMouseMove(e: MouseEvent) {
    tx = e.clientX;
    ty = e.clientY;
    const target = e.target as HTMLElement | null;
    setHover(!!target?.closest(INTERACTIVE));
  }

  function loop() {
    if (!alive) return;
    rafId = requestAnimationFrame(loop);
    cx += (tx - cx) * LERP;
    cy += (ty - cy) * LERP;
    // Translate so the SVG center (20,20) sits under the pointer
    root.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Hide cursor when leaving window
  function onLeave() { root.style.opacity = '0'; }
  function onEnter() { root.style.opacity = '1'; }
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  rafId = requestAnimationFrame(loop);

  return function destroy() {
    alive = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('mouseenter', onEnter);
    document.body.classList.remove('cursor-ready', 'cursor-hover');
    root.remove();
  };
}
