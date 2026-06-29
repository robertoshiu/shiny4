/**
 * hold-to-scan.ts — Hold-to-scan progressive disclosure for [data-hold-scan] badges.
 *
 * Interaction model (A11y-first):
 *   - click / Enter / Space on the native <button> toggles open/close instantly.
 *     This is the universal accessible path — keyboard, touch, and quick click all work
 *     without any hold gesture (WCAG 2.5.x: no timed interaction required).
 *   - Mouse press-and-hold ≥ HOLD_MS fills a gold SVG arc; on completion, opens the
 *     disclosure and suppresses the trailing click so it stays open.
 *   - Under prefers-reduced-motion: no arc, no pointer/rAF logic — click toggle only.
 *   - Escape while open collapses the badge and returns focus to the trigger.
 *
 * Module shape mirrors scan-field.ts / dot-field.ts:
 *   import { prefersReducedMotion } from '../theme-motion';
 *   Returns a single cleanup fn that removes ALL listeners and cancels any rAF.
 *   Idempotent: guarded with data-hold-bound; cleanup removes the guard so re-init works.
 */

import { prefersReducedMotion } from '../theme-motion';

const HOLD_MS = 600;
const CIRC    = 2 * Math.PI * 16; // ≈ 100.53 — circumference of SVG circle with r=16

type Unbind = () => void;

// ─── Per-badge binding ────────────────────────────────────────────────────────

function bindBadge(
  container: HTMLElement,
  reduced: boolean,
  allUnbinds: Unbind[],
): void {
  const trigger = container.querySelector<HTMLButtonElement>('[data-hold-trigger]');
  const detail  = container.querySelector<HTMLElement>('[data-hold-detail]');
  const arcSvg  = container.querySelector<SVGSVGElement>('[data-hold-arc]');
  const arcFill = arcSvg
    ? arcSvg.querySelector<SVGCircleElement>('.compliance__arc-fill')
    : null;

  if (!trigger || !detail) return;

  // ── Per-badge mutable state (closure) ────────────────────────────────────
  let isOpen        = false;
  let rafId: number | null = null;
  let holdStart: number | null = null;
  let suppressClick = false;
  const timers: number[] = [];

  // ── Open / close / toggle ─────────────────────────────────────────────────
  const open = (): void => {
    if (isOpen) return;
    isOpen = true;
    trigger.setAttribute('aria-expanded', 'true');
    container.classList.add('is-open');
  };

  const close = (): void => {
    if (!isOpen) return;
    isOpen = false;
    trigger.setAttribute('aria-expanded', 'false');
    container.classList.remove('is-open');
  };

  const toggle = (): void => { isOpen ? close() : open(); };

  // ── Arc helpers ───────────────────────────────────────────────────────────
  const setOffset = (v: number): void => {
    if (arcFill) arcFill.style.strokeDashoffset = String(v);
  };

  const easeBack = (): void => {
    if (!arcFill) return;
    arcFill.style.transition = 'stroke-dashoffset 300ms ease-out';
    setOffset(CIRC);
    const tid = window.setTimeout(() => {
      if (arcFill) arcFill.style.transition = '';
    }, 320);
    timers.push(tid);
  };

  const cancelHold = (): void => {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    holdStart = null;
    easeBack();
  };

  // ── rAF arc-fill loop ─────────────────────────────────────────────────────
  const tick = (now: number): void => {
    if (holdStart === null) return;
    const p = Math.min((now - holdStart) / HOLD_MS, 1);
    setOffset(CIRC * (1 - p));

    if (p < 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    // Hold completed: suppress the trailing click, open disclosure, ease arc back
    rafId      = null;
    holdStart  = null;
    suppressClick = true;
    open();
    const tid = window.setTimeout(() => easeBack(), 200);
    timers.push(tid);
  };

  // ── Universal click toggle (mouse / keyboard / touch) ─────────────────────
  const onClick = (): void => {
    if (suppressClick) { suppressClick = false; return; }
    toggle();
  };

  // ── Keyboard: Escape collapses ────────────────────────────────────────────
  // Attach to container so it fires when detail content gains focus too.
  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && isOpen) {
      close();
      trigger.focus();
    }
  };

  trigger.addEventListener('click', onClick);
  container.addEventListener('keydown', onKeyDown);

  allUnbinds.push(() => {
    trigger.removeEventListener('click', onClick);
    container.removeEventListener('keydown', onKeyDown);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    timers.forEach(clearTimeout);
  });

  // ── Mouse press-and-hold arc (additive enhancement; never required) ───────
  // Not bound under reduced-motion; click toggle is the whole interaction.
  if (!reduced && arcFill) {
    const onPointerDown = (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') return;
      if (rafId !== null) { cancelAnimationFrame(rafId); }
      holdStart = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const onPointerRelease = (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') return;
      // Arc loop still running → hold not complete → cancel + let click toggle normally
      if (rafId !== null) cancelHold();
      // If rafId is null, hold completed and suppressClick is already set
    };

    trigger.addEventListener('pointerdown',   onPointerDown);
    trigger.addEventListener('pointerup',     onPointerRelease);
    trigger.addEventListener('pointerleave',  onPointerRelease);
    trigger.addEventListener('pointercancel', onPointerRelease);

    allUnbinds.push(() => {
      trigger.removeEventListener('pointerdown',   onPointerDown);
      trigger.removeEventListener('pointerup',     onPointerRelease);
      trigger.removeEventListener('pointerleave',  onPointerRelease);
      trigger.removeEventListener('pointercancel', onPointerRelease);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    });
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Init hold-to-scan interaction on all [data-hold-scan] containers.
 * Returns a cleanup fn that removes all listeners and cancels any rAF.
 * Safe to call on every astro:page-load; guarded with data-hold-bound.
 */
export function initHoldToScan(): () => void {
  const containers = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hold-scan]'),
  );
  if (containers.length === 0) return () => {};

  const reduced    = prefersReducedMotion();
  const allUnbinds: Unbind[] = [];
  const bound: HTMLElement[] = [];

  for (const container of containers) {
    if (container.dataset.holdBound) continue;
    container.dataset.holdBound = '1';
    bound.push(container);
    bindBadge(container, reduced, allUnbinds);
  }

  return () => {
    // Remove guard so the next init() call (after astro:page-load) can rebind
    bound.forEach((el) => { delete el.dataset.holdBound; });
    allUnbinds.forEach((fn) => fn());
  };
}
