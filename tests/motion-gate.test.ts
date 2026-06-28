import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prefersReducedMotion, revealOnEnter } from '../src/scripts/theme-motion';

function setReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('prefersReducedMotion', () => {
  it('is true when the media query matches', () => {
    setReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
  });
  it('is false when it does not match', () => {
    setReducedMotion(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('revealOnEnter reduced-motion gate', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="r" style="opacity:0"></div>';
  });

  it('renders final state and does NOT construct an IntersectionObserver under reduced motion', () => {
    setReducedMotion(true);
    const ioSpy = vi.fn();
    // @ts-expect-error test stub
    global.IntersectionObserver = class {
      constructor() {
        ioSpy();
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    revealOnEnter('.r');
    const el = document.querySelector('.r') as HTMLElement;
    expect(el.style.opacity).toBe('1');
    expect(el.style.transform).toBe('none');
    expect(ioSpy).not.toHaveBeenCalled();
  });

  it('constructs an IntersectionObserver when motion is allowed', () => {
    setReducedMotion(false);
    const ioSpy = vi.fn();
    // @ts-expect-error test stub
    global.IntersectionObserver = class {
      constructor() {
        ioSpy();
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    revealOnEnter('.r');
    expect(ioSpy).toHaveBeenCalledTimes(1);
  });
});
