/**
 * text-reveal.ts — Split-text spring stagger reveal on scroll-enter.
 *
 * API:
 *   reveal(el, opts?)          → () => void   observe and reveal one element
 *   revealAll(selector, opts?) → () => void   observe all matching elements
 *
 * Options (TextRevealOptions):
 *   mode?       'words' | 'chars' | 'lines'   split unit (default 'words')
 *   threshold?  number                          IO threshold (default 0.25)
 *   staggerMs?  number                          delay between units in ms (default 35)
 *   once?       boolean                         unobserve after first trigger (default true)
 *
 * Behavior:
 *   • Splits the element's text into words (or chars/lines) using a manual split.
 *   • Each word/char is wrapped in a <span style="display:inline-block;overflow:hidden">
 *     with an inner <span> that slides up from below into view.
 *   • Spring easing gives an organic bounce (stiffness 280, damping 24, mass 0.9).
 *   • Under reduced-motion: content is NOT split; opacity is forced to 1. No IO.
 *
 * Data attributes (applied to heading elements):
 *   data-reveal="words"    — split + reveal words
 *   data-reveal="chars"    — split + reveal chars
 *
 * Example:
 *   import { revealAll } from './motion/text-reveal';
 *   revealAll('[data-reveal]');
 */

import { animate, stagger, spring } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';

export interface TextRevealOptions {
  mode?: 'words' | 'chars' | 'lines';
  threshold?: number;
  staggerMs?: number;
  once?: boolean;
}

// Simple manual splitter that preserves accessible text via aria-label.
function splitIntoSpans(el: HTMLElement, mode: 'words' | 'chars'): HTMLElement[] {
  const text = el.textContent || '';
  // Store original as aria-label so screen readers get the full string
  el.setAttribute('aria-label', text);
  el.setAttribute('aria-live', 'off');

  const units = mode === 'chars' ? [...text] : text.split(/(\s+)/);
  el.innerHTML = '';

  const spans: HTMLElement[] = [];

  for (const unit of units) {
    if (!unit) continue;
    if (mode === 'words' && /^\s+$/.test(unit)) {
      // Whitespace — inject a plain text node
      el.appendChild(document.createTextNode(unit));
      continue;
    }

    // Outer clip wrapper
    const outer = document.createElement('span');
    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';

    // Inner animated element
    const inner = document.createElement('span');
    inner.style.cssText = 'display:inline-block;will-change:transform,opacity;';
    inner.setAttribute('aria-hidden', 'true');
    inner.textContent = unit;

    outer.appendChild(inner);
    el.appendChild(outer);
    spans.push(inner);
  }

  return spans;
}

/** Observe `el` and spring-reveal its split text when it enters the viewport. */
export function reveal(el: HTMLElement, opts: TextRevealOptions = {}): () => void {
  if (prefersReducedMotion()) {
    el.style.opacity = '1';
    el.style.transform = 'none';
    return () => {};
  }

  const rawMode   = (el.dataset.reveal as TextRevealOptions['mode']) || opts.mode || 'words';
  const threshold = opts.threshold ?? 0.25;
  const delay     = opts.staggerMs ?? 35;
  const once      = opts.once ?? true;

  // 'lines' degrades to 'words' since we do a manual word-level split
  const splitMode: 'words' | 'chars' = rawMode === 'chars' ? 'chars' : 'words';
  const spans = splitIntoSpans(el, splitMode);
  if (spans.length === 0) return () => {};

  // Set initial hidden state for all inner spans
  for (const s of spans) {
    s.style.opacity   = '0';
    s.style.transform = 'translateY(110%)';
  }

  let triggered = false;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (triggered && once) continue;
        triggered = true;

        animate(spans, {
          opacity:    [0, 1],
          translateY: ['110%', '0%'],
          delay:      stagger(delay),
          ease:       spring({ stiffness: 280, damping: 24, mass: 0.9 }),
        });

        if (once) io.unobserve(el);
      }
    },
    { threshold },
  );

  io.observe(el);

  return function destroy() {
    io.disconnect();
  };
}

/** Observe all elements matching `selector` and reveal them. */
export function revealAll(selector: string, opts: TextRevealOptions = {}): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (els.length === 0) return () => {};
  const cleanups = els.map((el) => reveal(el, opts));
  return () => cleanups.forEach((fn) => fn());
}
