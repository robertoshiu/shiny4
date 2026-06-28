import { prefersReducedMotion } from './theme-motion';

// Pure formatter: rounds to an integer and re-applies the ≤/≥ prefix + unit suffix.
export function formatCount(n: number, prefix = '', suffix = ''): string {
  return `${prefix}${Math.round(n)}${suffix}`;
}

export interface CountUpOptions {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

// Animates 0 → `to`, preserving prefix/suffix. Under reduced motion, jumps to the
// final value immediately (value always exposed to assistive tech).
export function countUp(el: HTMLElement, opts: CountUpOptions): void {
  const { to, duration = 1200, prefix = '', suffix = '' } = opts;

  if (prefersReducedMotion()) {
    el.textContent = formatCount(to, prefix, suffix);
    return;
  }

  const start = performance.now();
  function frame(now: number) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatCount(to * eased, prefix, suffix);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
