import { animate } from 'animejs';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface RevealOptions {
  threshold?: number;
}

// Reveal elements on scroll-enter. Under reduced motion, elements are forced to
// their final state and NO IntersectionObserver / anime timeline is constructed.
export function revealOnEnter(selector: string, opts: RevealOptions = {}): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (els.length === 0) return;

  if (prefersReducedMotion()) {
    for (const el of els) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
    return;
  }

  for (const el of els) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        animate(target, {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 420,
          ease: 'out(3)',
        });
        io.unobserve(target);
      }
    },
    { threshold: opts.threshold ?? 0.15 },
  );

  for (const el of els) io.observe(el);
}
