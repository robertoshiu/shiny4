# SHINYLOGIC shiny4 — Plan 1: Foundation, Design System & Home (繁中) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Astro static foundation, the Direction C "Warm-Dark Foundry" design system, the reusable component kit, the zod-validated 繁中 content collections, and the full HOME page — ending in a single-page site that builds clean and deploys to GitHub Pages.

**Architecture:** Astro `output:'static'` with i18n scaffolded (繁中 unprefixed at root; EN/简 reserved for later plans). FAB300 facts live once in zod-validated content collections and render through shared `.astro` components; motion + the WebGL molten-wafer hero ship as client islands that degrade to a static SSR poster and are fully suppressed under `prefers-reduced-motion`. Pure logic (i18n `t()`, reduced-motion gate, number formatting, schema validation) is unit-tested with vitest; layouts/components/hero/home/deploy are verified with `astro check` + `astro build` + the gstack browse binary + axe/Lighthouse.

**Tech Stack:** Astro (static), TypeScript, anime.js v4, WebGL (regl or raw GLSL), vitest (unit), gstack browse + Lighthouse/axe (verification), GitHub Actions → GitHub Pages.

---

## Plan roadmap

This is **Plan 1 of 4**. Plan 1 delivers the foundation, the formalized `DESIGN.md` + token system, the shared component kit, the 繁中 content collections (`layers`, `slas`, `compliance`, `phases`), the motion system, the WebGL hero with its static poster, and the complete HOME page in 繁中 — a deployable single-page site. **Plan 2** builds the remaining six 繁中 pages (About, Solutions, Technology, Methodology, Careers, Contact) and the heavier data components (`DeliveryMatrix` 10×4, `HardwareTable`, `SolutionBlock`, `RiskCard`, etc.). **Plan 3** adds the EN + 简体 locales: per-locale page generation via `getStaticPaths`, the translation map, the cookie/localStorage persistence + pre-paint root redirect, and `hreflang` wiring. **Plan 4** is accessibility + performance hardening: full keyboard/screen-reader sweep, contrast matrix, Lighthouse/axe in CI, Core Web Vitals tuning with the WebGL hero active, and Save-Data/low-power paths. Plans 2–4 are **out of scope here** — everything below is Plan 1, planned in full.

---

## File structure

Every file Plan 1 creates, with its single responsibility:

**Config / tooling**
- `package.json` — project manifest; scripts (`dev`/`build`/`preview`/`check`/`test`), Astro 5 + sitemap + animejs deps, vitest/jsdom/zod/typescript devDeps.
- `astro.config.mjs` — `output:'static'`, `site:'https://shinylogic.tech'`, `trailingSlash:'always'`, `base:'/'`, i18n (`defaultLocale:'zh-Hant'`, `locales:['zh-Hant','en','zh-Hans']`, `prefixDefaultLocale:false`), `@astrojs/sitemap`.
- `tsconfig.json` — extends Astro strict; `resolveJsonModule` for JSON imports.
- `vitest.config.ts` — jsdom environment; `tests/**/*.test.ts`.
- `.gitignore` — ignore `node_modules/`, `dist/`, `.astro/`.
- `.github/workflows/deploy.yml` — GitHub Actions: `withastro/action` build → `actions/deploy-pages`.
- `public/CNAME` — custom domain `shinylogic.tech`.

**Design system**
- `DESIGN.md` — repo-root single source of truth; formalizes Direction C tokens from spec §5 (colors, tri-accent semantics, type, motifs, motion, contrast rules).
- `src/styles/tokens.css` — CSS custom properties: color, ink, accent, border, motion duration + easing, layout tokens.
- `src/styles/fonts.css` — font-family CSS variable stacks (Fraunces, Noto Serif TC, Spline Sans Mono, Nunito Sans, Noto Sans TC).
- `src/styles/global.css` — reset, base typography, focus-visible gold ring, `.section`/`.reveal` scaffolding, reduced-motion CSS.

**i18n**
- `src/i18n/utils.ts` — `type Locale`; `t(key, locale)` with zh-Hant fallback then key passthrough.
- `src/i18n/zh-Hant.json` — nav / button / aria micro-copy.

**Content model**
- `src/content/schemas.ts` — standalone zod schemas (importable by both Astro config and vitest).
- `src/content/config.ts` — wires schemas into Astro collections via the glob loader.
- `src/content/layers/l1.json … l6.json` — L1–L6 architecture (繁中).
- `src/content/slas/*.json` — 6 universal KPIs with meaning-color accent.
- `src/content/compliance/*.json` — 5 compliance standards + definitions.
- `src/content/phases/p1.json … p4.json` — 4 delivery phases / gates / milestones.

**Scripts (client islands / pure logic)**
- `src/scripts/theme-motion.ts` — `prefersReducedMotion()`, `revealOnEnter(selector, opts)` (IO reveal; no timeline construction under reduced motion).
- `src/scripts/counter.ts` — `formatCount()` (pure, ≤/≥ preserving) + `countUp(el, opts)`.
- `src/scripts/hero-webgl.ts` — `initHero(canvas, opts) => { destroy() }`: WebGL ember dot-matrix + diffraction-ring wafer, 2D-canvas degrade, DPR≤2, fps throttle, IO/visibility pause.

**Layouts**
- `src/layouts/BaseLayout.astro` — `<html lang>`, head/meta/hreflang/fonts, inline pre-paint reduced-motion boot, SkipLink, Header, slot, Footer.
- `src/layouts/PageLayout.astro` — hero slot + `<main id="main-content">` scaffolding + per-page `heroVariant` prop.

**Components — global chrome**
- `src/components/SkipLink.astro` — skip-to-content, first focusable.
- `src/components/Header.astro` — brand lockup + Nav + LanguageToggle + clay CTA pill; scroll state + mobile drawer.
- `src/components/Nav.astro` — 5 primary nav links with gold-underline hover.
- `src/components/LanguageToggle.astro` — 繁 active + EN/简 real anchors.
- `src/components/Footer.astro` — 3-column footer + language selector + legal.
- `src/components/FooterTicker.astro` — tagline ticker, paused under reduced motion.

**Components — shared UI**
- `src/components/CTAButton.astro` — `{variant:'clay'|'ghost', href, label}`; dark ink on clay; gold focus ring.
- `src/components/SectionHeader.astro` — `{index, zh, en}` + giant numeral + gold underline; emits `<h2 id>`.
- `src/components/HudCoordinate.astro` — aria-hidden mono coordinate decoration.
- `src/components/SlaStrip.astro` — renders `slas` collection, meaning-colored; count-up on enter.
- `src/components/ComplianceBadges.astro` — renders `compliance` collection.
- `src/components/EngageCTA.astro` — closing ENGAGE CTA block.

**Components — hero**
- `src/components/hero/HeroPoster.astro` — static SVG dot-matrix + rings + HUD; SSR initial frame + fallback.
- `src/components/hero/HeroCanvas.astro` — mounts `<canvas>` + the `hero-webgl` island (idle-init, reduced-motion guarded).

**Page**
- `src/pages/index.astro` — HOME 繁中: the 9 sections from spec §7[1].

**Tests**
- `tests/i18n.test.ts` — `t()` + locale typing (TRUE TDD).
- `tests/motion-gate.test.ts` — reduced-motion gate in `theme-motion.ts` (TRUE TDD).
- `tests/counter.test.ts` — `formatCount` number formatting (TRUE TDD).
- `tests/content-schema.test.ts` — zod schema + seed-data validation (TRUE TDD).

---

## Task 1: Project scaffold, config & git

**Files:**
- Create: `E:\repo\shiny4\package.json`
- Create: `E:\repo\shiny4\astro.config.mjs`
- Create: `E:\repo\shiny4\tsconfig.json`
- Create: `E:\repo\shiny4\.gitignore`

- [ ] **Step 1: Write `package.json`.** Exact contents:
```json
{
  "name": "shiny4",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview --port 4321",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.6.0",
    "@astrojs/sitemap": "^3.2.1",
    "animejs": "^4.0.2"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.6.3",
    "zod": "^3.24.1",
    "vitest": "^2.1.8",
    "jsdom": "^25.0.1"
  }
}
```

- [ ] **Step 2: Write `astro.config.mjs`.** Exact contents:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain via public/CNAME → base stays '/'.
export default defineConfig({
  site: 'https://shinylogic.tech',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant', 'en', 'zh-Hans'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Write `tsconfig.json`.** Exact contents:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "resolveJsonModule": true,
    "strictNullChecks": true
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 4: Write `.gitignore`.** Exact contents:
```gitignore
node_modules/
dist/
.astro/
*.log
.DS_Store
```

- [ ] **Step 5: Install dependencies.** Run from `E:\repo\shiny4`:
```
npm install
```
Expected: npm resolves and writes `node_modules/` + `package-lock.json` with no `ERR!` lines; final line is the added-packages summary (e.g. `added 4XX packages in …`).

- [ ] **Step 6: Initialize git and make the first commit.** Run:
```
git init
git add -A
git commit -m "chore: scaffold Astro static project + config

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: `Initialized empty Git repository …` then a commit summary listing `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` (note: `node_modules/`, `package-lock.json` may be added too; `node_modules/` is gitignored so it is not tracked).

---

## Task 2: vitest setup + i18n `t()` helper (TRUE TDD)

**Files:**
- Create: `E:\repo\shiny4\vitest.config.ts`
- Create: `E:\repo\shiny4\src\i18n\zh-Hant.json`
- Create: `E:\repo\shiny4\src\i18n\utils.ts`
- Test: `E:\repo\shiny4\tests\i18n.test.ts`

- [ ] **Step 1: Write `vitest.config.ts`.** Exact contents:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    globals: false,
  },
});
```

- [ ] **Step 2: Write the failing test `tests/i18n.test.ts` first (TDD red).** Exact contents:
```ts
import { describe, it, expect } from 'vitest';
import { t, type Locale } from '../src/i18n/utils';

describe('t()', () => {
  it('returns the zh-Hant value for a known key', () => {
    expect(t('nav.about', 'zh-Hant')).toBe('關於');
  });

  it('falls back to zh-Hant when the locale dictionary lacks the key (en empty in Plan 1)', () => {
    expect(t('nav.about', 'en')).toBe('關於');
  });

  it('returns the key itself when no dictionary has it', () => {
    expect(t('does.not.exist', 'zh-Hant')).toBe('does.not.exist');
  });

  it('accepts only the three valid locales', () => {
    const l: Locale = 'zh-Hans';
    expect(t('cta.consult', l)).toBe('預約諮詢');
  });
});
```

- [ ] **Step 3: Run the test and SEE IT FAIL.** Run:
```
npm run test
```
Expected: vitest fails because `src/i18n/utils.ts` does not exist — output contains `Failed to load url ../src/i18n/utils` (or `Cannot find module`). This confirms red.

- [ ] **Step 4: Write `src/i18n/zh-Hant.json`.** Exact contents:
```json
{
  "nav.about": "關於",
  "nav.solutions": "解決方案",
  "nav.technology": "技術",
  "nav.methodology": "方法論",
  "nav.careers": "招募",
  "cta.consult": "預約諮詢",
  "cta.viewArchitecture": "查看系統架構",
  "aria.skipToContent": "跳至主要內容",
  "aria.openMenu": "開啟選單",
  "aria.closeMenu": "關閉選單",
  "aria.languageSelector": "語言選擇",
  "aria.primaryNav": "主導覽"
}
```

- [ ] **Step 5: Write `src/i18n/utils.ts` (TDD green).** Exact contents:
```ts
import zhHant from './zh-Hant.json';

export type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

type Dict = Record<string, string>;

// Plan 1 ships only the 繁中 dictionary. en / zh-Hans are populated in Plan 3;
// until then t() falls back to zh-Hant, then to the key itself.
const dictionaries: Record<Locale, Dict> = {
  'zh-Hant': zhHant as Dict,
  en: {},
  'zh-Hans': {},
};

export function t(key: string, locale: Locale): string {
  return dictionaries[locale]?.[key] ?? dictionaries['zh-Hant'][key] ?? key;
}
```

- [ ] **Step 6: Run the test and SEE IT PASS.** Run:
```
npm run test
```
Expected: `Test Files  1 passed (1)` and `Tests  4 passed (4)`.

- [ ] **Step 7: Commit.** Run:
```
git add -A
git commit -m "feat: vitest + i18n t() helper with zh-Hant dictionary

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `vitest.config.ts`, `src/i18n/utils.ts`, `src/i18n/zh-Hant.json`, `tests/i18n.test.ts`.

---

## Task 3: DESIGN.md + design tokens (tokens.css, fonts.css, global.css)

**Files:**
- Create: `E:\repo\shiny4\DESIGN.md`
- Create: `E:\repo\shiny4\src\styles\tokens.css`
- Create: `E:\repo\shiny4\src\styles\fonts.css`
- Create: `E:\repo\shiny4\src\styles\global.css`

- [ ] **Step 1: Write `DESIGN.md`.** Exact contents:
```markdown
# SHINYLOGIC shiny4 — DESIGN.md

Single source of truth for Direction C "Warm-Dark Foundry". Read this before any
visual or UI decision. Do not deviate without explicit user approval.

## Color tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#14100D` | Page base (warm espresso-black) |
| `--bg-deep` | `#0E0B08` | Deepest wells, hero edges |
| `--surface` | `#211A14` | Cards, scrolled header |
| `--surface-raised` | `#2A2018` | Raised cards, drawers |
| `--ink` | `#F2E9DE` | Body text (cream; AAA on espresso) |
| `--ink-muted` | `#A9988A` | Secondary / large text ONLY — never body or form labels |
| `--ink-faint` | `#6E6157` | HUD decoration, hairlines |
| `--clay` | `#E07A5F` | Accent — resilience / recovery / DR |
| `--clay-deep` | `#B0492A` | Clay hover/press |
| `--sun` | `#E9C46A` | Accent — service level / performance; focus ring |
| `--sage` | `#81A684` | Accent — coverage / archive |
| `--border` | `rgba(242,233,222,0.10)` | Hairline on dark |
| `--border-strong` | `rgba(242,233,222,0.18)` | Stronger hairline |

## Tri-accent semantic system (non-negotiable, global)
Color carries meaning, never decoration; every coded element ALSO has a text label.
- **clay** = resilience / recovery / DR (RTO ≤ 4hr, RPO ≤ 15min).
- **gold (sun)** = service level / performance (SLO ≥ 95%, yield ≥ 90%).
- **sage** = coverage / archive (100% 歸檔, full-stack coverage, gate governance).

## Contrast rules (WCAG 2.2 AA)
- Cream `#F2E9DE` on espresso passes AAA for body.
- `--ink-muted` is barred from body text and form labels.
- **Clay CTA uses DARK ink (`--bg`)** — cream-on-clay ≈ 2.3:1 fails. Never cream on clay.
- Focus-visible ring = `--sun` 2px, offset 3px, ≥ 3:1 on all surfaces.
- Risk/level encodings are always text + icon, never color-only.

## Type
- Display: **Fraunces** (optical sizing, 64–120px), Chinese display fallback **Noto Serif TC**.
- HUD / labels / metrics: **Spline Sans Mono**.
- Body: **Nunito Sans** + **Noto Sans TC**.
- Stacks: `--font-display`, `--font-serif-tc`, `--font-mono`, `--font-body` (see `src/styles/fonts.css`).

## Signature motifs
Ember dot-matrix (gold→clay, diagonal fade); mono HUD coordinate markers as ambient
decoration only (never real-time data); thin gold underline; concentric diffraction
rings; giant faint section numerals 01–09. Mood: molten silicon, a foundry at night.

## Motion tokens
| Token | Value |
|---|---|
| `--dur-instant` | `120ms` |
| `--dur-quick` | `240ms` |
| `--dur-base` | `420ms` |
| `--dur-slow` | `720ms` |
| `--dur-cinematic` | `1200ms` |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-emphasis` | `cubic-bezier(0.16, 1, 0.3, 1)` |

Reveal recipe: `translateY` 24–40px always paired with opacity 0→1; stagger base 40ms.
Every animation must do work (reveal structure, confirm a fact, aid navigation).
Under `prefers-reduced-motion`: timelines are NEVER constructed; content renders final;
the WebGL hero never initializes (static poster shows); tickers/loops are static.
```

- [ ] **Step 2: Write `src/styles/tokens.css`.** Exact contents:
```css
:root {
  /* Base */
  --bg: #14100d;
  --bg-deep: #0e0b08;
  --surface: #211a14;
  --surface-raised: #2a2018;

  /* Ink */
  --ink: #f2e9de;
  --ink-muted: #a9988a;
  --ink-faint: #6e6157;

  /* Accents (semantic) */
  --clay: #e07a5f;
  --clay-deep: #b0492a;
  --sun: #e9c46a;
  --sage: #81a684;

  /* Borders on dark */
  --border: rgba(242, 233, 222, 0.1);
  --border-strong: rgba(242, 233, 222, 0.18);

  /* Motion durations */
  --dur-instant: 120ms;
  --dur-quick: 240ms;
  --dur-base: 420ms;
  --dur-slow: 720ms;
  --dur-cinematic: 1200ms;

  /* Easings */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1);

  /* Layout */
  --maxw: 1200px;
  --gutter: clamp(1.25rem, 5vw, 5rem);
}
```

- [ ] **Step 3: Write `src/styles/fonts.css`.** Exact contents:
```css
/* Font family stacks. Actual font files load via the Google Fonts <link> in
   BaseLayout.astro (Plan 4 may self-host). */
:root {
  --font-display: 'Fraunces', 'Noto Serif TC', Georgia, serif;
  --font-serif-tc: 'Noto Serif TC', serif;
  --font-mono: 'Spline Sans Mono', ui-monospace, 'SFMono-Regular', monospace;
  --font-body: 'Nunito Sans', 'Noto Sans TC', system-ui, sans-serif;
}
```

- [ ] **Step 4: Write `src/styles/global.css`.** Exact contents:
```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

html.reduced-motion {
  scroll-behavior: auto;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  line-height: 1.08;
  font-weight: 600;
  margin: 0;
}

p {
  margin: 0 0 1rem;
}

a {
  color: inherit;
}

img,
svg,
canvas {
  display: block;
  max-width: 100%;
}

:focus-visible {
  outline: 2px solid var(--sun);
  outline-offset: 3px;
}

.section {
  max-width: var(--maxw);
  margin-inline: auto;
  padding: clamp(4rem, 10vw, 8rem) var(--gutter);
}

/* Progressive-enhancement reveal: visible by default (no-JS safe). JS sets the
   hidden initial state only when motion is allowed. */
.reveal {
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 5: Commit.** Run:
```
git add -A
git commit -m "feat: DESIGN.md + Direction C token system (tokens/fonts/global css)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `DESIGN.md`, `src/styles/tokens.css`, `src/styles/fonts.css`, `src/styles/global.css`.

---

## Task 4: Motion system — `theme-motion.ts` + `counter.ts` (TRUE TDD)

**Files:**
- Create: `E:\repo\shiny4\src\scripts\theme-motion.ts`
- Create: `E:\repo\shiny4\src\scripts\counter.ts`
- Test: `E:\repo\shiny4\tests\motion-gate.test.ts`
- Test: `E:\repo\shiny4\tests\counter.test.ts`

- [ ] **Step 1: Write the failing `tests/motion-gate.test.ts` first (TDD red).** Exact contents:
```ts
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
```

- [ ] **Step 2: Write the failing `tests/counter.test.ts` first (TDD red).** Exact contents:
```ts
import { describe, it, expect } from 'vitest';
import { formatCount } from '../src/scripts/counter';

describe('formatCount', () => {
  it('preserves the ≥ prefix and % suffix', () => {
    expect(formatCount(95, '≥', '%')).toBe('≥95%');
  });
  it('preserves the ≤ prefix and hr suffix', () => {
    expect(formatCount(4, '≤', 'hr')).toBe('≤4hr');
  });
  it('preserves the ≤ prefix and min suffix', () => {
    expect(formatCount(15, '≤', 'min')).toBe('≤15min');
  });
  it('handles an empty prefix', () => {
    expect(formatCount(100, '', '%')).toBe('100%');
  });
  it('rounds to an integer mid-animation', () => {
    expect(formatCount(89.6, '≥', '%')).toBe('≥90%');
  });
});
```

- [ ] **Step 3: Run the tests and SEE THEM FAIL (red).** Run:
```
npm run test
```
Expected: vitest reports failures loading `../src/scripts/theme-motion` and `../src/scripts/counter` (`Failed to load url` / `Cannot find module`). Confirms red.

- [ ] **Step 4: Write `src/scripts/theme-motion.ts` (green).** Exact contents:
```ts
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
```

- [ ] **Step 5: Write `src/scripts/counter.ts` (green).** Exact contents:
```ts
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
```

- [ ] **Step 6: Run the tests and SEE THEM PASS (green).** Run:
```
npm run test
```
Expected: `Test Files  3 passed (3)` and `Tests  13 passed (13)` (i18n 4 + motion-gate 4 + counter 5).

- [ ] **Step 7: Verify the anime.js v4 ease token at runtime later.** Note for the implementer: `revealOnEnter` uses anime.js v4 power-ease shorthand `ease: 'out(3)'`. The unit test stubs `IntersectionObserver` and never fires an entry, so `animate()` is not exercised here — it is verified visually in Task 9's browse screenshot (reveals must animate, no console error). If the browse `console --errors` step in Task 9 shows an anime ease error, switch to the named form `ease: 'outCubic'`.

- [ ] **Step 8: Commit.** Run:
```
git add -A
git commit -m "feat: motion gate (theme-motion) + count-up formatter (counter)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `src/scripts/theme-motion.ts`, `src/scripts/counter.ts`, `tests/motion-gate.test.ts`, `tests/counter.test.ts`.

---

## Task 5: Content collections — zod schemas + 繁中 seed data (TRUE TDD)

All facts below trace to `docs/design-research/content-inventory.md` and `shiny3-content.md`. Schemas live in a standalone module so both Astro and vitest reuse the exact same zod objects.

**Files:**
- Create: `E:\repo\shiny4\src\content\schemas.ts`
- Create: `E:\repo\shiny4\src\content\config.ts`
- Create: `E:\repo\shiny4\src\content\layers\l1.json` … `l6.json`
- Create: `E:\repo\shiny4\src\content\slas\dr-rto.json`, `dr-rpo.json`, `slo.json`, `yield.json`, `gate.json`, `archive.json`
- Create: `E:\repo\shiny4\src\content\compliance\dengbao.json`, `miping.json`, `iec62443.json`, `semi-e187.json`, `isa95.json`
- Create: `E:\repo\shiny4\src\content\phases\p1.json` … `p4.json`
- Test: `E:\repo\shiny4\tests\content-schema.test.ts`

- [ ] **Step 1: Write the failing `tests/content-schema.test.ts` first (TDD red).** Exact contents:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  layerSchema,
  slaSchema,
  complianceSchema,
  phaseSchema,
} from '../src/content/schemas';

function loadDir(dir: string): unknown[] {
  const base = join(process.cwd(), 'src', 'content', dir);
  return readdirSync(base)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(base, f), 'utf-8')));
}

describe('content schemas validate the 繁中 seed data', () => {
  it('validates all 6 layers', () => {
    const items = loadDir('layers');
    expect(items).toHaveLength(6);
    for (const item of items) expect(layerSchema.safeParse(item).success).toBe(true);
  });

  it('validates all 6 SLAs with a clay/gold/sage accent', () => {
    const items = loadDir('slas');
    expect(items).toHaveLength(6);
    for (const item of items) expect(slaSchema.safeParse(item).success).toBe(true);
  });

  it('validates all 5 compliance standards', () => {
    const items = loadDir('compliance');
    expect(items).toHaveLength(5);
    for (const item of items) expect(complianceSchema.safeParse(item).success).toBe(true);
  });

  it('validates all 4 phases', () => {
    const items = loadDir('phases');
    expect(items).toHaveLength(4);
    for (const item of items) expect(phaseSchema.safeParse(item).success).toBe(true);
  });

  it('rejects an SLA with an invalid accent', () => {
    const bad = {
      order: 1,
      code: 'X',
      label: 'x',
      value: 1,
      prefix: '',
      suffix: '',
      sub: 'x',
      accent: 'red',
    };
    expect(slaSchema.safeParse(bad).success).toBe(false);
  });
});
```

- [ ] **Step 2: Write `src/content/schemas.ts` (green for imports).** Exact contents:
```ts
import { z } from 'zod';

export const layerSchema = z.object({
  order: z.number().int().min(1).max(6),
  num: z.string(),
  zhName: z.string(),
  enLabel: z.string(),
  scope: z.string(),
  href: z.string(),
});

export const slaSchema = z.object({
  order: z.number().int(),
  code: z.string(),
  label: z.string(),
  value: z.number(),
  prefix: z.string(),
  suffix: z.string(),
  sub: z.string(),
  accent: z.enum(['clay', 'gold', 'sage']),
});

export const complianceSchema = z.object({
  order: z.number().int(),
  name: z.string(),
  fullName: z.string(),
  definition: z.string(),
  domain: z.string(),
});

export const phaseSchema = z.object({
  order: z.number().int().min(1).max(4),
  code: z.string(),
  zhName: z.string(),
  months: z.string(),
  gate: z.string(),
  milestone: z.string(),
  deliverables: z.array(z.string()),
});
```

- [ ] **Step 3: Run the test and SEE IT FAIL (red).** Run:
```
npm run test
```
Expected: the content-schema suite fails — `readdirSync` throws `ENOENT … src/content/layers` (or length assertions fail) because no seed JSON exists yet. Confirms red.

- [ ] **Step 4: Write the 6 layer files (`src/content/layers/`).** Exact contents:

`l1.json`:
```json
{ "order": 1, "num": "L1", "zhName": "輸入層", "enLabel": "INPUT LAYER", "scope": "8 大工藝機台 · SECS-GEM / GEM300 · OPC UA 廠務 · 傳感網絡", "href": "/solutions/" }
```
`l2.json`:
```json
{ "order": 2, "num": "L2", "zhName": "數據層", "enLabel": "DATA LAYER", "scope": "Historian 時序歸檔 · NVMe Lakehouse · EDA 高頻採集", "href": "/technology/" }
```
`l3.json`:
```json
{ "order": 3, "num": "L3", "zhName": "算力層", "enLabel": "COMPUTE LAYER", "scope": "GB300 NVL72 AI Fabric · HGX B300 推理 · 800Gb/s Fabric", "href": "/technology/" }
```
`l4.json`:
```json
{ "order": 4, "num": "L4", "zhName": "應用層", "enLabel": "APPLICATION LAYER", "scope": "Agentic RAG / LLM · Digital Twin（Omniverse）· 高量產 MES 平台（FAB300）", "href": "/solutions/" }
```
`l5.json`:
```json
{ "order": 5, "num": "L5", "zhName": "治理層", "enLabel": "GOVERNANCE LAYER", "scope": "CCC 中控台 · SOC 24×7 · OT 入侵偵測與資產可視化 · 合規底座", "href": "/solutions/" }
```
`l6.json`:
```json
{ "order": 6, "num": "L6", "zhName": "備援層", "enLabel": "RESILIENCE LAYER", "scope": "溫備援跨區域 · 異步複製 · SD-WAN 雙 ISP · RTO ≤ 4hr / RPO ≤ 15min", "href": "/technology/" }
```

- [ ] **Step 5: Write the 6 SLA files (`src/content/slas/`).** Accents follow the tri-accent system: clay = DR resilience, gold = service/performance, sage = coverage/governance. Exact contents:

`dr-rto.json`:
```json
{ "order": 1, "code": "DR.01", "label": "DR RTO", "value": 4, "prefix": "≤", "suffix": "hr", "sub": "關鍵系統 · 溫備援跨區域", "accent": "clay" }
```
`dr-rpo.json`:
```json
{ "order": 2, "code": "DR.02", "label": "DR RPO", "value": 15, "prefix": "≤", "suffix": "min", "sub": "異步複製 · 數據損失上限", "accent": "clay" }
```
`slo.json`:
```json
{ "order": 3, "code": "SLO.03", "label": "系統 SLO", "value": 95, "prefix": "≥", "suffix": "%", "sub": "全系統可用性 · SOC 24×7 監控", "accent": "gold" }
```
`yield.json`:
```json
{ "order": 4, "code": "YLD.04", "label": "良率目標", "value": 90, "prefix": "≥", "suffix": "%", "sub": "SPC/YMS 閉環 · APC R2R+FDC", "accent": "gold" }
```
`gate.json`:
```json
{ "order": 5, "code": "GOV.05", "label": "交付管控", "value": 8, "prefix": "", "suffix": " Gate", "sub": "四階段 · RACI 唯一 A · 三級升級", "accent": "sage" }
```
`archive.json`:
```json
{ "order": 6, "code": "KNW.06", "label": "模板歸檔", "value": 100, "prefix": "", "suffix": "%", "sub": "跨廠複製就緒 · 知識資產保全", "accent": "sage" }
```

- [ ] **Step 6: Write the 5 compliance files (`src/content/compliance/`).** Order follows the badge cluster. Exact contents:

`dengbao.json`:
```json
{ "order": 1, "name": "等保 2.0 三級", "fullName": "中國網路安全等級保護 2.0 三級", "definition": "適用於關鍵資訊基礎設施的安全要求。", "domain": "IT / 合規" }
```
`miping.json`:
```json
{ "order": 2, "name": "密評", "fullName": "商用密碼應用評估", "definition": "商用密碼算法（SM2/SM3/SM4）應用安全評估，適用於具有密碼合規要求的場景。", "domain": "合規" }
```
`iec62443.json`:
```json
{ "order": 3, "name": "IEC 62443", "fullName": "工業自動化與控制系統安全", "definition": "OT 域安全架構主要參考標準，定義分區（Zone）、管道（Conduit）與安全等級（SL）。", "domain": "OT" }
```
`semi-e187.json`:
```json
{ "order": 4, "name": "SEMI E187", "fullName": "半導體工廠網路安全規範", "definition": "SEMI 針對晶圓廠設備與網路的專項安全規範，覆蓋 SECS-GEM 通訊安全要求。", "domain": "OT / 設備" }
```
`isa95.json`:
```json
{ "order": 5, "name": "ISA-95", "fullName": "企業控制系統整合標準", "definition": "L3↔L4 整合架構依據，確保 MES 與 ERP/PLM 的資訊交換模型一致。", "domain": "IT / OT" }
```

- [ ] **Step 7: Write the 4 phase files (`src/content/phases/`).** Exact contents:

`p1.json`:
```json
{ "order": 1, "code": "P1", "zhName": "建廠期", "months": "M1–M6", "gate": "Gate 1–2", "milestone": "建廠里程碑", "deliverables": ["機房土建、供電、液冷基礎設施", "消防安防", "環境驗收"] }
```
`p2.json`:
```json
{ "order": 2, "code": "P2", "zhName": "裝機期", "months": "M7–M15", "gate": "Gate 3–5", "milestone": "主交付里程碑", "deliverables": ["GB300 NVL72 主交付、AI Fabric 部署", "高量產 MES 平台上線", "OT 安全就位"] }
```
`p3.json`:
```json
{ "order": 3, "code": "P3", "zhName": "試產期", "months": "M16–M21", "gate": "Gate 6–7", "milestone": "試產里程碑", "deliverables": ["高量產 MES / AI 聯調、良率爬坡", "DR 首輪演練"] }
```
`p4.json`:
```json
{ "order": 4, "code": "P4", "zhName": "量產期", "months": "M22+", "gate": "Gate 8", "milestone": "量產里程碑", "deliverables": ["全速量產；SLO ≥ 95% 持續監控", "DR 季度演練固化"] }
```

- [ ] **Step 8: Write `src/content/config.ts` (wires schemas into Astro collections).** Exact contents:
```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { layerSchema, slaSchema, complianceSchema, phaseSchema } from './schemas';

const layers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/layers' }),
  schema: layerSchema,
});

const slas = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/slas' }),
  schema: slaSchema,
});

const compliance = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/compliance' }),
  schema: complianceSchema,
});

const phases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/phases' }),
  schema: phaseSchema,
});

export const collections = { layers, slas, compliance, phases };
```

- [ ] **Step 9: Run the tests and SEE THEM PASS (green).** Run:
```
npm run test
```
Expected: `Test Files  4 passed (4)` and `Tests  18 passed (18)` (i18n 4 + motion-gate 4 + counter 5 + content-schema 5).

- [ ] **Step 10: Generate Astro content types and verify the collection wiring builds.** Run:
```
npx astro sync
```
Expected: `Generated …/.astro/` types with `Content config … types generated` and exit 0 (no zod errors against the seed JSON).

- [ ] **Step 11: Commit.** Run:
```
git add -A
git commit -m "feat: zod content schemas + 繁中 seed collections (layers/slas/compliance/phases)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `src/content/schemas.ts`, `src/content/config.ts`, the 21 seed JSON files, and `tests/content-schema.test.ts`.

---

## Task 6: Shared UI components (CTAButton, SectionHeader, HudCoordinate, SlaStrip, ComplianceBadges, EngageCTA)

Verification-driven. These primitives are built first because `Header`/`Footer` (Task 7) import `CTAButton`, and `HeroPoster` (Task 8) imports `HudCoordinate`.

**Files:**
- Create: `E:\repo\shiny4\src\components\CTAButton.astro`
- Create: `E:\repo\shiny4\src\components\SectionHeader.astro`
- Create: `E:\repo\shiny4\src\components\HudCoordinate.astro`
- Create: `E:\repo\shiny4\src\components\SlaStrip.astro`
- Create: `E:\repo\shiny4\src\components\ComplianceBadges.astro`
- Create: `E:\repo\shiny4\src\components\EngageCTA.astro`

- [ ] **Step 1: Write `src/components/CTAButton.astro`.** Clay uses dark ink (`--bg`) — cream-on-clay fails contrast. Exact contents:
```astro
---
interface Props {
  variant: 'clay' | 'ghost';
  href: string;
  label: string;
}
const { variant, href, label } = Astro.props;
---

<a class={`cta cta--${variant}`} href={href}>{label}</a>

<style>
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    padding: 0.75rem 1.5rem;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 0.95rem;
    border-radius: 2px;
    text-decoration: none;
    transition:
      transform var(--dur-quick) var(--ease-out),
      background-color var(--dur-quick) var(--ease-out),
      border-color var(--dur-quick) var(--ease-out),
      color var(--dur-quick) var(--ease-out);
  }
  /* Clay CTA: dark ink on clay (cream-on-clay ~2.3:1 fails AA). */
  .cta--clay {
    background: var(--clay);
    color: var(--bg);
    border: 1px solid var(--clay);
  }
  .cta--clay:hover {
    background: var(--clay-deep);
    border-color: var(--clay-deep);
    transform: translateY(-1px);
  }
  .cta--ghost {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--border-strong);
  }
  .cta--ghost:hover {
    border-color: var(--sun);
    color: var(--sun);
  }
  .cta:focus-visible {
    outline: 2px solid var(--sun);
    outline-offset: 3px;
  }
</style>
```

- [ ] **Step 2: Write `src/components/HudCoordinate.astro`.** Decorative, aria-hidden. Exact contents:
```astro
---
interface Props {
  text: string;
}
const { text } = Astro.props;
---

<span class="hud-coordinate" aria-hidden="true">{text}</span>

<style>
  .hud-coordinate {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: var(--ink-faint);
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 3: Write `src/components/SectionHeader.astro`.** Emits the `<h2 id="heading-${index}">` that the parent `<section aria-labelledby>` references; giant faint numeral + EN label are decorative. Exact contents:
```astro
---
interface Props {
  index: string;
  zh: string;
  en: string;
}
const { index, zh, en } = Astro.props;
---

<header class="section-header">
  <span class="section-header__numeral" aria-hidden="true">{index}</span>
  <p class="section-header__en" aria-hidden="true">{en}</p>
  <h2 id={`heading-${index}`} class="section-header__zh">{zh}</h2>
  <span class="section-header__underline" aria-hidden="true"></span>
</header>

<style>
  .section-header {
    position: relative;
    margin-bottom: clamp(2rem, 5vw, 3.5rem);
  }
  .section-header__numeral {
    position: absolute;
    top: -1.5rem;
    right: 0;
    font-family: var(--font-display);
    font-size: clamp(4rem, 12vw, 9rem);
    line-height: 1;
    color: var(--ink);
    opacity: 0.05;
    pointer-events: none;
    user-select: none;
  }
  .section-header__en {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    color: var(--sun);
    margin: 0 0 0.5rem;
  }
  .section-header__zh {
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 600;
  }
  .section-header__underline {
    display: block;
    width: 56px;
    height: 2px;
    margin-top: 1rem;
    background: var(--sun);
  }
</style>
```

- [ ] **Step 4: Write `src/components/SlaStrip.astro`.** Renders the `slas` collection, meaning-colored; count-up on enter (degrades to the SSR value with no JS and to the final value under reduced motion). Exact contents:
```astro
---
import { getCollection } from 'astro:content';
const slas = (await getCollection('slas')).sort((a, b) => a.data.order - b.data.order);
---

<div class="sla-strip">
  {
    slas.map((s) => (
      <div class={`sla sla--${s.data.accent}`}>
        <span
          class="sla__value"
          data-to={s.data.value}
          data-prefix={s.data.prefix}
          data-suffix={s.data.suffix}
        >
          {s.data.prefix}
          {s.data.value}
          {s.data.suffix}
        </span>
        <span class="sla__label">{s.data.label}</span>
        <span class="sla__sub">{s.data.sub}</span>
      </div>
    ))
  }
</div>

<script>
  import { countUp } from '../scripts/counter';
  const values = document.querySelectorAll<HTMLElement>('.sla__value[data-to]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        countUp(el, {
          to: Number(el.dataset.to),
          prefix: el.dataset.prefix || '',
          suffix: el.dataset.suffix || '',
        });
        io.unobserve(el);
      }
    },
    { threshold: 0.4 },
  );
  values.forEach((v) => io.observe(v));
</script>

<style>
  .sla-strip {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }
  @media (min-width: 768px) {
    .sla-strip {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .sla {
    background: var(--surface);
    padding: clamp(1.5rem, 4vw, 2.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .sla__value {
    font-family: var(--font-mono);
    font-size: clamp(1.8rem, 5vw, 2.6rem);
    font-weight: 500;
    line-height: 1;
  }
  .sla--clay .sla__value {
    color: var(--clay);
  }
  .sla--gold .sla__value {
    color: var(--sun);
  }
  .sla--sage .sla__value {
    color: var(--sage);
  }
  .sla__label {
    font-weight: 700;
    color: var(--ink);
  }
  .sla__sub {
    font-size: 0.85rem;
    color: var(--ink-muted);
  }
</style>
```

- [ ] **Step 5: Write `src/components/ComplianceBadges.astro`.** Renders the `compliance` collection. Exact contents:
```astro
---
import { getCollection } from 'astro:content';
const items = (await getCollection('compliance')).sort((a, b) => a.data.order - b.data.order);
---

<ul class="compliance">
  {
    items.map((c) => (
      <li class="compliance__badge">
        <span class="compliance__name">{c.data.name}</span>
        <span class="compliance__full">{c.data.fullName}</span>
      </li>
    ))
  }
</ul>

<style>
  .compliance {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .compliance__badge {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.75rem 1.1rem;
    border: 1px solid var(--border-strong);
    border-radius: 2px;
    background: var(--surface);
  }
  .compliance__name {
    font-weight: 700;
    color: var(--ink);
  }
  .compliance__full {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--ink-muted);
  }
</style>
```

- [ ] **Step 6: Write `src/components/EngageCTA.astro`.** Closing CTA; copy traces to About §07 ENGAGE. Exact contents:
```astro
---
import CTAButton from './CTAButton.astro';
import { t } from '../i18n/utils';
import type { Locale } from '../i18n/utils';
interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
---

<section class="engage" aria-labelledby="engage-heading">
  <p class="engage__en" aria-hidden="true">ENGAGE</p>
  <h2 id="engage-heading" class="engage__title">為您的晶圓廠，交付 IT/OT+AI 全棧</h2>
  <p class="engage__body">
    您的晶圓廠專注製程卓越；我們直接承擔 IT/OT+AI 全棧的建置、整合與維運責任，以明確 SLA
    保障交付，並交還 100% 歸檔的跨廠範本，讓知識資產永遠在您手中。
  </p>
  <div class="engage__actions">
    <CTAButton variant="clay" href="/contact/" label={t('cta.consult', locale)} />
    <a class="engage__mail" href="mailto:hello@shinylogic.tech">hello@shinylogic.tech</a>
  </div>
</section>

<style>
  .engage {
    max-width: var(--maxw);
    margin-inline: auto;
    padding: clamp(4rem, 12vw, 9rem) var(--gutter);
    text-align: center;
  }
  .engage__en {
    font-family: var(--font-mono);
    letter-spacing: 0.2em;
    color: var(--sun);
    margin: 0 0 1rem;
  }
  .engage__title {
    font-size: clamp(2rem, 6vw, 3.5rem);
    margin-bottom: 1.5rem;
  }
  .engage__body {
    max-width: 56ch;
    margin: 0 auto 2.5rem;
    color: var(--ink);
  }
  .engage__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
  }
  .engage__mail {
    font-family: var(--font-mono);
    color: var(--ink-muted);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>
```

- [ ] **Step 7: Typecheck the new components.** Run:
```
npx astro check
```
Expected: `0 errors` (warnings/hints are acceptable). This confirms the `getCollection` calls, `CTAButton` props, and `t()` usage typecheck against the schemas and the i18n helper.

- [ ] **Step 8: Commit.** Run:
```
git add -A
git commit -m "feat: shared UI components (CTAButton, SectionHeader, HudCoordinate, SlaStrip, ComplianceBadges, EngageCTA)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists the six component files under `src/components/`.

---

## Task 7: Global chrome + BaseLayout (SkipLink, Nav, LanguageToggle, FooterTicker, Footer, Header, BaseLayout)

Verification-driven. Built bottom-up so `Header` can import `Nav`, `LanguageToggle`, and `CTAButton` (Task 6). Internal nav links target the real final paths (`/about/`, `/solutions/`, …, `/contact/`) and the EN/简 toggle targets `/en/` and `/zh-hans/`; those routes 404 until Plans 2/3. The HOME page itself is fully complete and `mailto:hello@shinylogic.tech` (footer + ENGAGE) is a working conversion today.

**Files:**
- Create: `E:\repo\shiny4\src\components\SkipLink.astro`
- Create: `E:\repo\shiny4\src\components\Nav.astro`
- Create: `E:\repo\shiny4\src\components\LanguageToggle.astro`
- Create: `E:\repo\shiny4\src\components\FooterTicker.astro`
- Create: `E:\repo\shiny4\src\components\Footer.astro`
- Create: `E:\repo\shiny4\src\components\Header.astro`
- Create: `E:\repo\shiny4\src\layouts\BaseLayout.astro`

- [ ] **Step 1: Write `src/components/SkipLink.astro`.** First focusable; targets `#main-content` (rendered by PageLayout in Task 8). Exact contents:
```astro
---
import { t } from '../i18n/utils';
import type { Locale } from '../i18n/utils';
interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
---

<a class="skip-link" href="#main-content">{t('aria.skipToContent', locale)}</a>

<style>
  .skip-link {
    position: absolute;
    left: 1rem;
    top: -3.5rem;
    z-index: 100;
    background: var(--surface-raised);
    color: var(--ink);
    padding: 0.6rem 1rem;
    border-radius: 2px;
    text-decoration: none;
    transition: top var(--dur-quick) var(--ease-out);
  }
  .skip-link:focus {
    top: 1rem;
    outline: 2px solid var(--sun);
    outline-offset: 2px;
  }
</style>
```

- [ ] **Step 2: Write `src/components/Nav.astro`.** Five primary nav links with gold-underline hover. Exact contents:
```astro
---
import { t } from '../i18n/utils';
import type { Locale } from '../i18n/utils';
interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const items = [
  { key: 'nav.about', href: '/about/' },
  { key: 'nav.solutions', href: '/solutions/' },
  { key: 'nav.technology', href: '/technology/' },
  { key: 'nav.methodology', href: '/methodology/' },
  { key: 'nav.careers', href: '/careers/' },
];
---

<nav class="nav" aria-label={t('aria.primaryNav', locale)}>
  <ul class="nav__list">
    {
      items.map((it) => (
        <li>
          <a class="nav__link" href={it.href}>
            {t(it.key, locale)}
          </a>
        </li>
      ))
    }
  </ul>
</nav>

<style>
  .nav__list {
    display: flex;
    gap: clamp(1rem, 2.5vw, 2rem);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav__link {
    position: relative;
    text-decoration: none;
    color: var(--ink);
    font-size: 0.95rem;
    padding-block: 0.25rem;
  }
  .nav__link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 1px;
    background: var(--sun);
    transition: width var(--dur-quick) var(--ease-out);
  }
  .nav__link:hover::after,
  .nav__link:focus-visible::after {
    width: 100%;
  }
  @media (max-width: 767px) {
    .nav__list {
      flex-direction: column;
      gap: 1.5rem;
      font-size: 1.25rem;
    }
  }
</style>
```

- [ ] **Step 3: Write `src/components/LanguageToggle.astro`.** 繁 active (`aria-current`); EN/简 are real anchors. Exact contents:
```astro
---
import type { Locale } from '../i18n/utils';
interface Props {
  locale: Locale;
  path?: string;
}
const { locale, path = '/' } = Astro.props;
// 繁中 is unprefixed at root; localized variants live under /en and /zh-hans (Plan 3).
const segs = [
  { code: 'zh-Hant', label: '繁', href: path },
  { code: 'en', label: 'EN', href: `/en${path}` },
  { code: 'zh-Hans', label: '简', href: `/zh-hans${path}` },
] as const;
---

<div class="lang-toggle" role="group" aria-label="語言選擇">
  {
    segs.map((s) =>
      s.code === locale ? (
        <span class="lang-toggle__seg is-active" aria-current="true">
          {s.label}
        </span>
      ) : (
        <a class="lang-toggle__seg" href={s.href} hreflang={s.code} lang={s.code}>
          {s.label}
        </a>
      ),
    )
  }
</div>

<style>
  .lang-toggle {
    display: inline-flex;
    border: 1px solid var(--border-strong);
    border-radius: 2px;
    overflow: hidden;
  }
  .lang-toggle__seg {
    min-width: 44px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem 0.7rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    text-decoration: none;
    color: var(--ink-muted);
  }
  .lang-toggle__seg.is-active {
    background: var(--surface-raised);
    color: var(--sun);
  }
  .lang-toggle__seg:not(.is-active):hover {
    color: var(--ink);
  }
  .lang-toggle__seg:focus-visible {
    outline: 2px solid var(--sun);
    outline-offset: -2px;
  }
</style>
```

- [ ] **Step 4: Write `src/components/FooterTicker.astro`.** Tagline ticker; paused under reduced motion (class + media query). Exact contents:
```astro
---
const text = 'FAB300 REFERENCE BUILD · IT/OT+AI 全棧整合 · 直接交付晶圓廠 · 100% 歸檔';
---

<div class="ticker" aria-hidden="true">
  <div class="ticker__track">
    <span>{text}</span>
    <span>{text}</span>
  </div>
</div>

<style>
  .ticker {
    overflow: hidden;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 0.6rem 0;
  }
  .ticker__track {
    display: inline-flex;
    white-space: nowrap;
    animation: ticker 40s linear infinite;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-muted);
  }
  .ticker__track span {
    padding-right: 3rem;
  }
  @keyframes ticker {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  :global(html.reduced-motion) .ticker__track {
    animation: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .ticker__track {
      animation: none;
    }
  }
</style>
```

- [ ] **Step 5: Write `src/components/Footer.astro`.** Three columns + language selector + legal; column titles are `<p>` (not headings) to keep the heading outline clean. Exact contents:
```astro
---
import FooterTicker from './FooterTicker.astro';
import LanguageToggle from './LanguageToggle.astro';
import type { Locale } from '../i18n/utils';
interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
---

<footer class="site-footer">
  <FooterTicker />
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <p class="site-footer__name">SHINYLOGIC 顯藝科技</p>
      <p class="site-footer__tagline">
        We build the intelligence layer of the modern wafer fab. 把設備數據，鍛造成可決策的智能。
      </p>
    </div>
    <nav class="site-footer__col" aria-label="公司">
      <p class="site-footer__h">公司</p>
      <a href="/about/">關於</a>
      <a href="/careers/">招募</a>
    </nav>
    <nav class="site-footer__col" aria-label="能力">
      <p class="site-footer__h">能力</p>
      <a href="/solutions/">解決方案</a>
      <a href="/technology/">技術</a>
      <a href="/methodology/">方法論</a>
    </nav>
    <div class="site-footer__col">
      <p class="site-footer__h">聯絡</p>
      <a href="mailto:hello@shinylogic.tech">hello@shinylogic.tech</a>
      <div class="site-footer__lang">
        <p class="site-footer__h">語言 / LANGUAGE</p>
        <LanguageToggle locale={locale} path="/" />
      </div>
    </div>
  </div>
  <div class="site-footer__legal">
    <span>交付範疇依合約確認</span>
    <span>© 2026 顯藝科技 ShinyLogic. All rights reserved.</span>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--bg-deep);
    border-top: 1px solid var(--border);
  }
  .site-footer__inner {
    max-width: var(--maxw);
    margin-inline: auto;
    padding: clamp(3rem, 7vw, 5rem) var(--gutter);
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .site-footer__inner {
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
    }
  }
  .site-footer__name {
    font-family: var(--font-display);
    font-size: 1.3rem;
    margin: 0 0 0.75rem;
  }
  .site-footer__tagline {
    color: var(--ink-muted);
    max-width: 36ch;
  }
  .site-footer__col {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .site-footer__col a {
    color: var(--ink-muted);
    text-decoration: none;
  }
  .site-footer__col a:hover {
    color: var(--ink);
  }
  .site-footer__h {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    color: var(--ink-faint);
    text-transform: uppercase;
    margin: 0 0 0.3rem;
  }
  .site-footer__lang {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .site-footer__legal {
    max-width: var(--maxw);
    margin-inline: auto;
    padding: 1.5rem var(--gutter);
    border-top: 1px solid var(--border);
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--ink-faint);
  }
</style>
```

- [ ] **Step 6: Write `src/components/Header.astro`.** Brand lockup + Nav + LanguageToggle + clay CTA pill; transparent over hero, gains surface on scroll, hide-on-down/reveal-on-up; mobile drawer with Esc/overlay-close + `aria-expanded`. Exact contents:
```astro
---
import Nav from './Nav.astro';
import LanguageToggle from './LanguageToggle.astro';
import CTAButton from './CTAButton.astro';
import { t } from '../i18n/utils';
import type { Locale } from '../i18n/utils';
interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
---

<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="/" aria-label="SHINYLOGIC 顯藝科技 首頁">
      <span class="brand__name">SHINYLOGIC</span>
      <span class="brand__zh">顯藝科技</span>
      <span class="brand__sub" aria-hidden="true">INTELLIGENT WAFER FAB SYSTEMS</span>
    </a>
    <div class="site-header__desktop">
      <Nav locale={locale} />
      <LanguageToggle locale={locale} path="/" />
      <CTAButton variant="clay" href="/contact/" label={t('cta.consult', locale)} />
    </div>
    <button
      class="site-header__burger"
      data-burger
      aria-expanded="false"
      aria-controls="mobile-drawer"
      aria-label={t('aria.openMenu', locale)}
    >
      <span></span><span></span><span></span>
    </button>
  </div>

  <div class="drawer" id="mobile-drawer" data-drawer hidden>
    <Nav locale={locale} />
    <div class="drawer__footer">
      <LanguageToggle locale={locale} path="/" />
      <CTAButton variant="clay" href="/contact/" label={t('cta.consult', locale)} />
    </div>
  </div>
</header>

<script>
  const header = document.querySelector('[data-header]') as HTMLElement;
  const burger = document.querySelector('[data-burger]') as HTMLButtonElement;
  const drawer = document.querySelector('[data-drawer]') as HTMLElement;

  // Scroll state: surface past hero + hide-on-down / reveal-on-up.
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 80);
    if (y > lastY && y > 200) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile drawer.
  function setOpen(open: boolean) {
    burger.setAttribute('aria-expanded', String(open));
    if (open) {
      drawer.hidden = false;
      document.body.style.overflow = 'hidden';
    } else {
      drawer.hidden = true;
      document.body.style.overflow = '';
    }
  }
  burger.addEventListener('click', () =>
    setOpen(burger.getAttribute('aria-expanded') !== 'true'),
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  drawer.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
</script>

<style>
  .site-header {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 50;
    transition:
      transform var(--dur-base) var(--ease-out),
      background-color var(--dur-base) var(--ease-out),
      border-color var(--dur-base) var(--ease-out);
    border-bottom: 1px solid transparent;
  }
  .site-header.is-scrolled {
    background: color-mix(in srgb, var(--surface) 88%, transparent);
    backdrop-filter: blur(10px);
    border-bottom-color: var(--border-strong);
  }
  .site-header.is-hidden {
    transform: translateY(-100%);
  }
  .site-header__inner {
    max-width: var(--maxw);
    margin-inline: auto;
    padding: 1rem var(--gutter);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .brand {
    display: grid;
    text-decoration: none;
    line-height: 1.05;
  }
  .brand__name {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.15rem;
    letter-spacing: 0.02em;
    color: var(--ink);
  }
  .brand__zh {
    font-family: var(--font-serif-tc);
    font-size: 0.95rem;
    color: var(--ink);
  }
  .brand__sub {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    color: var(--ink-faint);
    margin-top: 0.2rem;
  }
  .site-header__desktop {
    display: none;
    align-items: center;
    gap: clamp(1rem, 2.5vw, 2rem);
  }
  .site-header__burger {
    display: inline-flex;
    flex-direction: column;
    gap: 5px;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--border-strong);
    border-radius: 2px;
    cursor: pointer;
  }
  .site-header__burger span {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--ink);
  }
  .drawer {
    background: var(--bg-deep);
    border-top: 1px solid var(--border);
    padding: 2rem var(--gutter) 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .drawer__footer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
  @media (min-width: 768px) {
    .site-header__desktop {
      display: flex;
    }
    .site-header__burger,
    .drawer {
      display: none;
    }
  }
</style>
```

- [ ] **Step 7: Write `src/layouts/BaseLayout.astro`.** `<html lang>`, head/meta/hreflang/fonts, inline pre-paint reduced-motion boot, SkipLink + Header + slot + Footer. Exact contents:
```astro
---
import '../styles/tokens.css';
import '../styles/fonts.css';
import '../styles/global.css';
import SkipLink from '../components/SkipLink.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import type { Locale } from '../i18n/utils';

interface Props {
  title: string;
  description: string;
  locale?: Locale;
}
const { title, description, locale = 'zh-Hant' } = Astro.props;
const htmlLang = locale === 'zh-Hans' ? 'zh-Hans' : locale === 'en' ? 'en' : 'zh-Hant';
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const ogImage = new URL('/og-image.png', Astro.site).href;
---

<!doctype html>
<html lang={htmlLang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <link rel="alternate" hreflang="zh-Hant" href={new URL('/', Astro.site).href} />
    <link rel="alternate" hreflang="en" href={new URL('/en/', Astro.site).href} />
    <link rel="alternate" hreflang="zh-Hans" href={new URL('/zh-hans/', Astro.site).href} />
    <link rel="alternate" hreflang="x-default" href={new URL('/', Astro.site).href} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Noto+Serif+TC:wght@500;700;900&family=Noto+Sans+TC:wght@400;500;700&family=Nunito+Sans:wght@400;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <script is:inline>
      try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          document.documentElement.classList.add('reduced-motion');
        }
      } catch (e) {}
    </script>
  </head>
  <body>
    <SkipLink locale={locale} />
    <Header locale={locale} />
    <slot />
    <Footer locale={locale} />
  </body>
</html>
```

- [ ] **Step 8: Typecheck the chrome + layout.** Run:
```
npx astro check
```
Expected: `0 errors`. Confirms `Header`/`Footer`/`BaseLayout` prop types, the `Astro.site` URL usage, and all imports resolve.

- [ ] **Step 9: Commit.** Run:
```
git add -A
git commit -m "feat: global chrome (SkipLink/Nav/LanguageToggle/Header/Footer/Ticker) + BaseLayout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists the six chrome components and `src/layouts/BaseLayout.astro`.

---

## Task 8: WebGL molten-wafer hero + PageLayout (hero-webgl, HeroPoster, HeroCanvas, PageLayout)

Verification-driven. The static SVG poster is the SSR/initial frame (zero CLS, never a blank hero). The WebGL canvas fades in only when motion is allowed and a context is available; otherwise the poster stays. Under `prefers-reduced-motion`, `initHero` returns a no-op and never touches WebGL.

**Files:**
- Create: `E:\repo\shiny4\src\scripts\hero-webgl.ts`
- Create: `E:\repo\shiny4\src\components\hero\HeroPoster.astro`
- Create: `E:\repo\shiny4\src\components\hero\HeroCanvas.astro`
- Create: `E:\repo\shiny4\src\layouts\PageLayout.astro`

- [ ] **Step 1: Write `src/scripts/hero-webgl.ts`.** Raw WebGL1 fullscreen-quad procedural shader (ember dot-matrix + diffraction rings), 2D-canvas degrade, DPR≤2, ~45fps throttle, IO + visibility pause, Save-Data density drop. Exact contents:
```ts
// Molten-wafer hero: ember dot-matrix + concentric diffraction rings over espresso.
// Primary renderer: WebGL1 fullscreen-quad procedural shader. Degrades to 2D canvas
// when WebGL is unavailable. Honors DPR<=2, throttles to ~45fps, pauses offscreen /
// when the tab is hidden. Under reduced motion it never initializes (poster shows).

import { prefersReducedMotion } from './theme-motion';

export interface HeroOptions {
  density?: number; // 0..1 ember density (Save-Data drops this)
}

interface HeroHandle {
  destroy(): void;
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_density;

const vec3 ESPRESSO = vec3(0.078, 0.063, 0.051);
const vec3 GOLD = vec3(0.914, 0.765, 0.416);
const vec3 CLAY = vec3(0.878, 0.478, 0.373);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  p += u_mouse * 0.04;

  float r = length(p);

  // Concentric diffraction rings, masked to a soft wafer disc.
  float disc = smoothstep(0.62, 0.58, r);
  float rings = 0.5 + 0.5 * sin(r * 46.0 - u_time * 1.2);
  rings = pow(rings, 3.0) * disc;

  // Ember dot-matrix with diagonal fade and per-cell flicker.
  float gridN = 42.0;
  vec2 g = uv * gridN;
  vec2 cell = floor(g);
  vec2 f = fract(g) - 0.5;
  float dotMask = smoothstep(0.16, 0.10, length(f));
  float flicker = 0.6 + 0.4 * sin(u_time * 2.0 + hash(cell) * 6.2831);
  float diagFade = clamp(1.0 - (uv.x + uv.y) * 0.5, 0.0, 1.0);
  float ember = dotMask * flicker * diagFade * 0.5 * u_density;

  float ramp = clamp(r * 1.6, 0.0, 1.0);
  vec3 accent = mix(GOLD, CLAY, ramp);

  float intensity = clamp(rings * 0.8 + ember, 0.0, 1.0);
  vec3 color = ESPRESSO + accent * intensity;

  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
  }
  return sh;
}

export function initHero(canvas: HTMLCanvasElement, opts: HeroOptions = {}): HeroHandle {
  if (prefersReducedMotion()) {
    return { destroy() {} };
  }

  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  const density = opts.density ?? (conn && conn.saveData ? 0.4 : 1.0);

  const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
  if (!gl) {
    return init2DFallback(canvas, density);
  }

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return init2DFallback(canvas, density);
  }
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uDensity = gl.getUniformLocation(program, 'u_density');
  gl.uniform1f(uDensity, density);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  function onMove(e: MouseEvent) {
    mouse.tx = e.clientX / window.innerWidth - 0.5;
    mouse.ty = e.clientY / window.innerHeight - 0.5;
  }
  window.addEventListener('mousemove', onMove);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  let raf = 0;
  let running = true;
  const start = performance.now();
  let last = 0;
  const minInterval = 1000 / 45;

  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < minInterval) return;
    last = now;
    resize();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.uniform1f(uTime, (now - start) / 1000);
    gl!.uniform2f(uMouse, mouse.x, mouse.y);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
  }
  raf = requestAnimationFrame(frame);

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      }
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  function onVisibility() {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      raf = requestAnimationFrame(frame);
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      const ext = gl!.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    },
  };
}

function init2DFallback(canvas: HTMLCanvasElement, density: number): HeroHandle {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };

  let raf = 0;
  let running = true;
  const start = performance.now();
  let last = 0;
  const minInterval = 1000 / 30;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  function draw(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(draw);
    if (now - last < minInterval) return;
    last = now;
    const t = (now - start) / 1000;
    const w = canvas.width;
    const h = canvas.height;
    ctx!.fillStyle = '#14100d';
    ctx!.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) * 0.46;
    for (let i = 1; i <= 14; i++) {
      const rr = (i / 14) * maxR;
      const a = 0.04 + 0.04 * (0.5 + 0.5 * Math.sin(rr * 0.05 - t * 1.2));
      ctx!.beginPath();
      ctx!.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(233,196,106,${a})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    const step = Math.max(18, Math.floor(w / 42));
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const diag = 1 - (x / w + y / h) * 0.5;
        const flick = 0.6 + 0.4 * Math.sin(t * 2 + (x * 0.7 + y * 0.3));
        const a = Math.max(0, diag * flick * 0.5 * density);
        if (a <= 0.02) continue;
        const ramp = Math.min(1, (Math.hypot(x - cx, y - cy) / maxR) * 1.6);
        const col = ramp < 0.5 ? '233,196,106' : '224,122,95';
        ctx!.fillStyle = `rgba(${col},${a})`;
        ctx!.fillRect(x, y, 2, 2);
      }
    }
  }
  raf = requestAnimationFrame(draw);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    },
  };
}
```

- [ ] **Step 2: Write `src/components/hero/HeroPoster.astro`.** Static SVG dot-matrix + rings + HUD; the SSR initial frame. aria-hidden. Exact contents:
```astro
---
import HudCoordinate from '../HudCoordinate.astro';
---

<div class="hero-poster" aria-hidden="true">
  <svg
    class="hero-poster__svg"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    role="presentation"
  >
    <defs>
      <radialGradient id="emberGrad" cx="50%" cy="46%" r="60%">
        <stop offset="0%" stop-color="#E9C46A" stop-opacity="0.22"></stop>
        <stop offset="55%" stop-color="#E07A5F" stop-opacity="0.10"></stop>
        <stop offset="100%" stop-color="#14100D" stop-opacity="0"></stop>
      </radialGradient>
      <pattern id="dotMatrix" width="34" height="34" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.4" fill="#E9C46A" fill-opacity="0.16"></circle>
      </pattern>
    </defs>
    <rect width="1440" height="900" fill="#14100D"></rect>
    <rect width="1440" height="900" fill="url(#dotMatrix)"></rect>
    <circle cx="720" cy="414" r="300" fill="url(#emberGrad)"></circle>
    <g fill="none" stroke="#E9C46A" stroke-opacity="0.12">
      <circle cx="720" cy="414" r="120"></circle>
      <circle cx="720" cy="414" r="180"></circle>
      <circle cx="720" cy="414" r="240"></circle>
      <circle cx="720" cy="414" r="300"></circle>
    </g>
  </svg>
  <span class="hero-poster__hud">
    <HudCoordinate text="X:0420 Y:1080 [REC]" />
  </span>
</div>

<style>
  .hero-poster {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: var(--bg);
  }
  .hero-poster__svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .hero-poster__hud {
    position: absolute;
    left: clamp(1rem, 4vw, 4rem);
    bottom: clamp(1rem, 4vw, 3rem);
  }
</style>
```

- [ ] **Step 3: Write `src/components/hero/HeroCanvas.astro`.** Mounts the canvas and the `hero-webgl` island; idle-init, reduced-motion guarded; canvas fades in over the poster when active. Exact contents:
```astro
---
---

<canvas id="hero-canvas" class="hero-canvas" aria-hidden="true"></canvas>

<script>
  import { initHero } from '../../scripts/hero-webgl';
  import { prefersReducedMotion } from '../../scripts/theme-motion';

  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  if (canvas && !prefersReducedMotion()) {
    const start = () => {
      const handle = initHero(canvas);
      canvas.classList.add('is-active');
      window.addEventListener('pagehide', () => handle.destroy(), { once: true });
    };
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, o?: object) => void })
        .requestIdleCallback(start, { timeout: 2000 });
    } else {
      setTimeout(start, 200);
    }
  }
</script>

<style>
  .hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0;
    transition: opacity var(--dur-slow) var(--ease-out);
    z-index: 1;
  }
  .hero-canvas.is-active {
    opacity: 1;
  }
</style>
```

- [ ] **Step 4: Write `src/layouts/PageLayout.astro`.** Wraps BaseLayout; hero slot + `<main id="main-content">`; per-page `heroVariant`. Exact contents:
```astro
---
import BaseLayout from './BaseLayout.astro';
import type { Locale } from '../i18n/utils';

interface Props {
  title: string;
  description: string;
  locale?: Locale;
  heroVariant?: string;
}
const { title, description, locale = 'zh-Hant', heroVariant = 'default' } = Astro.props;
---

<BaseLayout title={title} description={description} locale={locale}>
  <div class={`page-hero page-hero--${heroVariant}`}>
    <slot name="hero" />
  </div>
  <main id="main-content">
    <slot />
  </main>
</BaseLayout>

<style>
  .page-hero {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .page-hero--home {
    min-height: 100svh;
    display: flex;
    align-items: center;
  }
</style>
```

- [ ] **Step 5: Typecheck the hero + layout.** Run:
```
npx astro check
```
Expected: `0 errors`. Confirms `hero-webgl.ts` (WebGL types, `HeroOptions`/`HeroHandle`), `HeroPoster`/`HeroCanvas`, and `PageLayout` typecheck.

- [ ] **Step 6: Commit.** Run:
```
git add -A
git commit -m "feat: WebGL molten-wafer hero (poster + canvas island) + PageLayout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `src/scripts/hero-webgl.ts`, `src/components/hero/HeroPoster.astro`, `src/components/hero/HeroCanvas.astro`, `src/layouts/PageLayout.astro`.

---

## Task 9: HOME page assembly (`index.astro`) — the 9 sections of spec §7[1]

Verification-driven. HOME was absent from the source corpus, so every line is synthesized from cross-cutting facts only (no invented claims). Copy traces to: About hero/§01 positioning + §06 Key Figures, the anti-overpromise trust line (spec §14), Solutions SOL.05 build-vs-buy, the L1–L6/SLA/phase/compliance collections, and the NVIDIA ecosystem facts (Technology §01). Exactly one `<h1>` (the hero tagline); sections use `<h2>` (via SectionHeader) and `<h3>` for layer/phase/card subheads.

**Files:**
- Create: `E:\repo\shiny4\src\pages\index.astro`

- [ ] **Step 1: Write `src/pages/index.astro`.** Exact contents:
```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import HeroPoster from '../components/hero/HeroPoster.astro';
import HeroCanvas from '../components/hero/HeroCanvas.astro';
import SectionHeader from '../components/SectionHeader.astro';
import CTAButton from '../components/CTAButton.astro';
import SlaStrip from '../components/SlaStrip.astro';
import ComplianceBadges from '../components/ComplianceBadges.astro';
import EngageCTA from '../components/EngageCTA.astro';
import { getCollection } from 'astro:content';
import { t } from '../i18n/utils';

const locale = 'zh-Hant' as const;
const layers = (await getCollection('layers')).sort((a, b) => a.data.order - b.data.order);
const phases = (await getCollection('phases')).sort((a, b) => a.data.order - b.data.order);

const chips = [
  { label: '≤4hr', accent: 'clay' },
  { label: '六層架構', accent: 'sage' },
  { label: '≥95%', accent: 'gold' },
  { label: '100%', accent: 'sage' },
];
---

<PageLayout
  title="顯藝科技 SHINYLOGIC — 把設備數據，鍛造成可決策的智能"
  description="顯藝科技為高量產晶圓廠直接交付 IT/OT+AI 全棧：六層架構、明確 SLA、100% 歸檔跨廠範本。FAB300 參考建置，以 NVIDIA GB300 NVL72 為算力底座。"
  heroVariant="home"
>
  <Fragment slot="hero">
    <HeroPoster />
    <HeroCanvas />
    <div class="hero__content">
      <p class="hero__eyebrow" aria-hidden="true">WHO WE ARE // SYSTEMS INTEGRATOR</p>
      <h1 class="hero__title">
        <span class="hero__line">把設備數據，</span>
        <span class="hero__line">鍛造成可決策的智能。</span>
      </h1>
      <p class="hero__lead">
        顯藝科技為晶圓廠直接交付 IT/OT+AI 全棧技術棧 — 從 L1 設備訊號到 L6 備援層，以明確 SLA
        承擔建置、整合與維運全程責任，並交還 100% 歸檔的跨廠範本。
      </p>
      <ul class="hero__chips">
        {chips.map((c) => <li class={`chip chip--${c.accent}`}>{c.label}</li>)}
      </ul>
      <div class="hero__actions">
        <CTAButton variant="clay" href="/contact/" label={t('cta.consult', locale)} />
        <a class="hero__secondary" href="#architecture">{t('cta.viewArchitecture', locale)} →</a>
      </div>
    </div>
  </Fragment>

  <!-- 01 Positioning + anti-overpromise trust line -->
  <section class="section" id="positioning" aria-labelledby="heading-01">
    <SectionHeader index="01" zh="使命與定位" en="MISSION & POSITIONING" />
    <div class="prose reveal">
      <p>
        顯藝科技的定位不是設備供應商，而是晶圓廠的 IT/OT+AI 全棧系統整合商 —
        直接為晶圓廠承擔從架構設計、軟硬體選型、現場實施到持續運維的全程責任，以明確 SLA
        保障交付品質。競爭基準不是其他整合商，而是晶圓廠的自建團隊選項。
      </p>
      <p class="trust-line">
        每一條 SLO 承諾的背後，都是一套工業級韌性的架構 — 而非一份期望管理的文件。真實演練驗證，而非假設推算。
      </p>
    </div>
  </section>

  <!-- 02 Six-layer architecture as editorial chapters -->
  <section class="section" id="architecture" aria-labelledby="heading-02">
    <SectionHeader index="02" zh="六層架構" en="WHAT WE DELIVER" />
    <ol class="layers">
      {
        layers.map((l) => (
          <li class="layer reveal">
            <span class="layer__num" aria-hidden="true">
              {l.data.num}
            </span>
            <div class="layer__body">
              <h3 class="layer__name">
                {l.data.zhName} <span class="layer__en">{l.data.enLabel}</span>
              </h3>
              <p class="layer__scope">{l.data.scope}</p>
            </div>
          </li>
        ))
      }
    </ol>
  </section>

  <!-- 03 Universal SLA strip -->
  <section class="section" id="sla" aria-labelledby="heading-03">
    <SectionHeader index="03" zh="成果與承諾" en="OUTCOMES & SLA" />
    <SlaStrip />
  </section>

  <!-- 04 FAB300 4-phase / 8-gate teaser -->
  <section class="section" id="phases" aria-labelledby="heading-04">
    <SectionHeader index="04" zh="交付節奏" en="DELIVERY RHYTHM" />
    <ol class="phases">
      {
        phases.map((p) => (
          <li class="phase reveal">
            <span class="phase__code" aria-hidden="true">
              {p.data.code}
            </span>
            <h3 class="phase__name">{p.data.zhName}</h3>
            <p class="phase__meta">
              {p.data.months} · {p.data.gate}
            </p>
            <p class="phase__milestone">{p.data.milestone}</p>
          </li>
        ))
      }
    </ol>
  </section>

  <!-- 05 By the Numbers -->
  <section class="section" id="numbers" aria-labelledby="heading-05">
    <SectionHeader index="05" zh="關鍵數字" en="BY THE NUMBERS" />
    <div class="numbers">
      <div class="number reveal">
        <span class="number__v number__v--gold">GB300</span>
        <span class="number__l">AI Fabric 算力底座 · GB300 NVL72 + HGX B300 推理節點</span>
      </div>
      <div class="number reveal">
        <span class="number__v">四階段</span>
        <span class="number__l">建廠 → 裝機 → 試產 → 量產</span>
      </div>
      <div class="number reveal">
        <span class="number__v number__v--clay">≤ 4hr</span>
        <span class="number__l">DR RTO · RPO ≤ 15min · 溫備援跨區域</span>
      </div>
      <div class="number reveal">
        <span class="number__v number__v--sage">100%</span>
        <span class="number__l">跨廠範本歸檔 · 可在每座新廠重複套用</span>
      </div>
    </div>
  </section>

  <!-- 06 Compliance cluster + NVIDIA Blackwell / GB300 ecosystem signal -->
  <section class="section" id="compliance" aria-labelledby="heading-06">
    <SectionHeader index="06" zh="合規與生態底座" en="COMPLIANCE & ECOSYSTEM" />
    <ComplianceBadges />
    <p class="ecosystem reveal">
      建置以 NVIDIA GB300 NVL72 為算力底座：3 × GB300 NVL72（液冷）· 4 × HGX B300 推理 ·
      Quantum-X800 800Gb/s XDR · Spectrum-X SN5600 · NVMe 數據湖。
    </p>
  </section>

  <!-- 07 Build vs Buy -->
  <section class="section" id="build-vs-buy" aria-labelledby="heading-07">
    <SectionHeader index="07" zh="為何委外，而非自建" en="BUILD VS BUY" />
    <div class="bvb">
      <article class="bvb__card reveal">
        <h3>人才根本招不到</h3>
        <p class="bvb__en" aria-hidden="true">TALENT SCARCITY</p>
        <p>
          懂 SECS-GEM 設備接入、又能整合 GB300 NVL72 液冷 AI Fabric、再對齊 IEC 62443
          合規底座的複合型工程師，全球供給嚴重不足。
        </p>
      </article>
      <article class="bvb__card reveal">
        <h3>進度風險壓縮試產窗口</h3>
        <p class="bvb__en" aria-hidden="true">SCHEDULE RISK</p>
        <p>
          自建團隊的學習曲線與人員流動直接轉化為進度延誤；每滑移一個月，都壓縮試產爬坡窗口、拉高良率達成風險。
        </p>
      </article>
      <article class="bvb__card reveal">
        <h3>沒有鎖定 — 模板 100% 歸您</h3>
        <p class="bvb__en" aria-hidden="true">NO LOCK-IN</p>
        <p>
          每次建置完成後，跨廠複製就緒的整合模板 100% 歸檔移交給您；您掌握知識資產，可在下一座晶圓廠直接複用。
        </p>
      </article>
    </div>
  </section>

  <!-- 08 ENGAGE -->
  <EngageCTA locale={locale} />
</PageLayout>

<script>
  import { revealOnEnter } from '../scripts/theme-motion';
  revealOnEnter('.reveal');
</script>

<style>
  .hero__content {
    position: relative;
    z-index: 2;
    max-width: var(--maxw);
    margin-inline: auto;
    padding: clamp(7rem, 14vh, 11rem) var(--gutter) clamp(3rem, 8vh, 6rem);
    width: 100%;
  }
  .hero__eyebrow {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.2em;
    color: var(--sun);
    margin: 0 0 1.25rem;
  }
  .hero__title {
    font-size: clamp(2.8rem, 9vw, 7rem);
    font-weight: 900;
    margin: 0 0 1.5rem;
  }
  .hero__line {
    display: block;
  }
  .hero__lead {
    max-width: 52ch;
    font-size: clamp(1.05rem, 2vw, 1.3rem);
    color: var(--ink);
    margin-bottom: 2rem;
  }
  .hero__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    list-style: none;
    margin: 0 0 2.5rem;
    padding: 0;
  }
  .chip {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    padding: 0.4rem 0.9rem;
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    color: var(--ink);
  }
  .chip--clay {
    border-color: var(--clay);
    color: var(--clay);
  }
  .chip--gold {
    border-color: var(--sun);
    color: var(--sun);
  }
  .chip--sage {
    border-color: var(--sage);
    color: var(--sage);
  }
  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
  }
  .hero__secondary {
    font-family: var(--font-mono);
    color: var(--ink);
    text-decoration: none;
    border-bottom: 1px solid var(--sun);
    padding-bottom: 0.2rem;
  }

  .prose {
    max-width: 62ch;
    font-size: 1.1rem;
  }
  .trust-line {
    margin-top: 1.5rem;
    font-family: var(--font-serif-tc);
    font-size: clamp(1.2rem, 2.5vw, 1.6rem);
    color: var(--sun);
    line-height: 1.5;
  }

  .layers {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }
  .layer {
    background: var(--surface);
    display: flex;
    gap: 1.5rem;
    padding: clamp(1.25rem, 3vw, 2rem);
    align-items: baseline;
  }
  .layer__num {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--sun);
    min-width: 2.5rem;
  }
  .layer__name {
    font-size: 1.35rem;
    margin: 0 0 0.4rem;
  }
  .layer__en {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: var(--ink-faint);
  }
  .layer__scope {
    color: var(--ink-muted);
    margin: 0;
  }

  .phases {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .phases {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .phase {
    border-top: 2px solid var(--clay);
    padding-top: 1.25rem;
  }
  .phase__code {
    font-family: var(--font-mono);
    color: var(--sun);
  }
  .phase__name {
    font-size: 1.4rem;
    margin: 0.5rem 0 0.3rem;
  }
  .phase__meta {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-faint);
    margin: 0 0 0.6rem;
  }
  .phase__milestone {
    color: var(--ink-muted);
    margin: 0;
  }

  .numbers {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .numbers {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .number__v {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900;
    line-height: 1;
    margin-bottom: 0.75rem;
  }
  .number__v--gold {
    color: var(--sun);
  }
  .number__v--clay {
    color: var(--clay);
  }
  .number__v--sage {
    color: var(--sage);
  }
  .number__l {
    color: var(--ink-muted);
    font-size: 0.95rem;
  }

  .ecosystem {
    margin-top: 2rem;
    max-width: 62ch;
    color: var(--ink-muted);
    font-family: var(--font-mono);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .bvb {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    .bvb {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .bvb__card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: clamp(1.5rem, 3vw, 2.25rem);
  }
  .bvb__card h3 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
  }
  .bvb__en {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    color: var(--sun);
    margin: 0 0 1rem;
  }
  .bvb__card p:last-child {
    color: var(--ink-muted);
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Typecheck the page.** Run:
```
npx astro check
```
Expected: `0 errors`. Confirms the `getCollection` usage, component props, and `Fragment slot="hero"` typecheck.

- [ ] **Step 3: Build the site.** Run:
```
npm run build
```
Expected: `[build] 1 page(s) built in …`, a `[@astrojs/sitemap] … sitemap-index.xml` line, and `[build] Complete!`. `dist/index.html` exists. No errors.

- [ ] **Step 4: Start the preview server in the background.** Run (Bash tool, background):
```
npm run preview
```
Expected: `astro  …  preview server` listening at `http://localhost:4321/`. Leave it running for the next steps.

- [ ] **Step 5: Resolve the browse binary and screenshot the HOME at desktop 1440.** Run (Bash tool):
```
B="/c/Users/quito/.claude/skills/gstack/browse/dist/browse"
"$B" goto http://localhost:4321/
"$B" viewport 1440x900
"$B" screenshot "C:/Users/quito/AppData/Local/Temp/claude/E--repo-shiny4/30a241d0-5876-4486-a9ba-35dc3317d0ac/scratchpad/home-desktop.png"
```
Expected: `goto` prints the final URL `http://localhost:4321/`; `screenshot` prints the saved PNG path. Then Read that PNG. **Expected to see:** espresso-black page; giant Fraunces tagline “把設備數據，鍛造成可決策的智能。” as one `<h1>` over the molten-wafer hero (warm gold→clay dot-matrix + concentric rings); the 4 proof chips (≤4hr clay, 六層架構 sage, ≥95% gold, 100% sage); a clay “預約諮詢” pill (dark ink, not cream) and the “查看系統架構 →” link; the fixed header with brand lockup + 5 nav links + 繁/EN/简 toggle.

- [ ] **Step 6: Screenshot the HOME at mobile 375.** Run (Bash tool):
```
B="/c/Users/quito/.claude/skills/gstack/browse/dist/browse"
"$B" viewport 375x812
"$B" goto http://localhost:4321/
"$B" screenshot "C:/Users/quito/AppData/Local/Temp/claude/E--repo-shiny4/30a241d0-5876-4486-a9ba-35dc3317d0ac/scratchpad/home-mobile.png"
```
Expected: PNG path printed; Read it. **Expected to see:** single-column layout; the hamburger button visible (desktop nav hidden); tagline wraps without an orphan line; chips wrap to 2 rows; no horizontal overflow.

- [ ] **Step 7: Check for runtime errors and key elements.** Run (Bash tool):
```
B="/c/Users/quito/.claude/skills/gstack/browse/dist/browse"
"$B" goto http://localhost:4321/
"$B" console --errors
"$B" is visible "h1"
"$B" is visible "#sla .sla__value"
"$B" js "document.querySelectorAll('h1').length"
```
Expected: `console --errors` prints no errors (empty / “no error messages”). If it shows an anime.js ease error, apply Task 4 Step 7’s fallback (`ease: 'outCubic'`) and rebuild. `is visible "h1"` → `true`; `is visible "#sla .sla__value"` → `true`; the `js` count → `1` (exactly one `<h1>`).

- [ ] **Step 8: Run axe accessibility checks against the built page.** Run (Bash tool, with preview still serving):
```
npx @axe-core/cli http://localhost:4321/ --exit
```
Expected: `0 violations` for serious/critical rules. The known-good signals: one `<h1>`, landmark `header`/`main`/`footer`, `aria-labelledby` on each section, skip link present, clay CTA dark-ink contrast passes. If any serious/critical violation appears, fix it (most likely a contrast or landmark issue) and re-run before committing.

- [ ] **Step 9: Run Lighthouse for performance + a11y thresholds.** Run (Bash tool, preview still serving):
```
npx lighthouse http://localhost:4321/ --quiet --only-categories=performance,accessibility --chrome-flags="--headless" --output=json --output-path="C:/Users/quito/AppData/Local/Temp/claude/E--repo-shiny4/30a241d0-5876-4486-a9ba-35dc3317d0ac/scratchpad/lh-home.json"
```
Expected: a JSON report written. Read it and confirm `categories.performance.score >= 0.90`, `categories.accessibility.score >= 0.95`, `audits['largest-contentful-paint'].numericValue < 2500` (LCP < 2.5s — the SSR poster is the LCP element), and `audits['cumulative-layout-shift'].numericValue < 0.1` (CLS < 0.1, poster reserves the hero box). If Performance < 90, the most likely cause is the Google Fonts render path — defer font hardening to Plan 4 but note the score here. (If `lighthouse` cannot find Chrome on this machine, record that and rely on the axe + browse evidence; full Lighthouse-in-CI lands in Plan 4.)

- [ ] **Step 10: Stop the preview server.** Stop the background `npm run preview` process (Ctrl-C / kill the background job).

- [ ] **Step 11: Commit.** Run:
```
git add -A
git commit -m "feat: HOME page (繁中) — 9 sections, WebGL hero, SLA/compliance/phase collections

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `src/pages/index.astro`.

---

## Task 10: Deploy to GitHub Pages (CNAME, Actions workflow) + final verification

Verification-driven. Confirms the full suite is green, the built HTML carries every fact (JS-off legible, no placeholders), and the CI workflow + custom domain are wired.

**Files:**
- Create: `E:\repo\shiny4\public\CNAME`
- Create: `E:\repo\shiny4\.github\workflows\deploy.yml`

- [ ] **Step 1: Write `public/CNAME`.** Exact contents (single line, no trailing blank line beyond newline):
```
shinylogic.tech
```

- [ ] **Step 2: Write `.github/workflows/deploy.yml`.** Exact contents:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build Astro site
        uses: withastro/action@v3
        with:
          node-version: 20

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Run the full unit suite.** Run:
```
npm run test
```
Expected: `Test Files  4 passed (4)` and `Tests  18 passed (18)`.

- [ ] **Step 4: Typecheck and build clean.** Run:
```
npx astro check
npm run build
```
Expected: `astro check` → `0 errors`; `npm run build` → `1 page(s) built`, sitemap line, `Complete!`. `dist/CNAME` is present (Astro copies `public/` verbatim) and `dist/index.html` exists.

- [ ] **Step 5: Verify the built HTML carries every fact (JS-off legibility, no placeholders).** Run (Bash tool) — each Grep should print matches in `dist/index.html`:
```
grep -o "把設備數據，鍛造成可決策的智能。" dist/index.html
grep -o "≤4hr" dist/index.html
grep -o "≥95%" dist/index.html
grep -o "≥90%" dist/index.html
grep -o "≤15min" dist/index.html
grep -o "100%" dist/index.html
grep -o "等保 2.0 三級" dist/index.html
grep -o "密評" dist/index.html
grep -o "IEC 62443" dist/index.html
grep -o "SEMI E187" dist/index.html
grep -o "ISA-95" dist/index.html
grep -o "GB300 NVL72" dist/index.html
grep -o "HGX B300" dist/index.html
grep -o "Quantum-X800" dist/index.html
grep -o "Spectrum-X SN5600" dist/index.html
grep -o "M22+" dist/index.html
```
Expected: every command prints its literal string (all SLA numbers, all 5 compliance standards, the NVIDIA ecosystem devices, and the M22+ phase fact are present in the static HTML — so the page is fully legible with JS disabled). **Then confirm zero placeholders:** the following must print NOTHING (exit 1):
```
grep -nE "TBD|TODO|lorem|Lorem|PLACEHOLDER|〔" dist/index.html || echo "NO_PLACEHOLDERS"
```
Expected: prints `NO_PLACEHOLDERS` (note: the shiny3 founder placeholders using 〔…〕 were intentionally dropped from HOME, so none remain).

- [ ] **Step 6: Verify the reduced-motion / static-poster path is intact in the markup.** Run (Bash tool):
```
grep -o "reduced-motion" dist/index.html
grep -o "hero-poster" dist/index.html
grep -o "hero-canvas" dist/index.html
```
Expected: `reduced-motion` (the inline pre-paint boot script), `hero-poster` (the SSR static frame), and `hero-canvas` all appear — confirming the poster renders server-side (zero CLS) and the canvas is an enhancement that the reduced-motion guard can skip.

- [ ] **Step 7: Commit.** Run:
```
git add -A
git commit -m "ci: GitHub Pages deploy workflow + CNAME (shinylogic.tech)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected: commit summary lists `public/CNAME` and `.github/workflows/deploy.yml`.

- [ ] **Step 8: Deploy.** Prerequisites the implementer must confirm with the user first: a GitHub remote exists and repo **Settings → Pages → Build and deployment → Source = GitHub Actions** is selected, and the `shinylogic.tech` DNS points at GitHub Pages. Then push the default branch:
```
git branch -M main
git remote -v        # confirm a remote named origin exists; if not, the user must add it
git push -u origin main
```
Expected: the push triggers the `Deploy to GitHub Pages` workflow; in the repo Actions tab the `build` then `deploy` jobs succeed and the `deploy` job surfaces the `page_url`. Verify the live site loads at `https://shinylogic.tech/` with the hero, the SLA strip, and the footer. (Per repo policy, perform the push only when the user has asked to deploy.)

---

## Self-check — spec coverage map (foundation + home slice)

Every spec item that belongs to the Plan 1 slice maps to a task above:

- **§5 Brand/visual system** → Task 3 (`DESIGN.md`, `tokens.css` colors/ink/accents/borders/motion durations + easings, `fonts.css` five families). Tri-accent semantics applied in Task 6 (`SlaStrip`) + Task 9 (chips, numbers, phases). Clay-dark-ink contrast in Task 6 (`CTAButton`).
- **§7[1] HOME (9 sections H0 + 01–08)** → Task 9 (`index.astro`): H0 WebGL hero with tagline + one-liner + 4 meaning-colored chips + 2 CTAs; 01 positioning + anti-overpromise trust line; 02 six-layer chapters; 03 universal SLA strip; 04 4-phase/8-gate teaser; 05 By-the-Numbers; 06 compliance cluster + NVIDIA GB300 ecosystem signal; 07 build-vs-buy; 08 ENGAGE → footer.
- **§8 Global chrome** → Task 7 (Header brand lockup + 5 nav + 繁/EN/简 toggle + clay pill + scroll/hide + mobile drawer; Footer 3-column + language selector + legal; FooterTicker paused under reduced motion).
- **§10 Content model** → Task 5 (`layers`/`slas`/`compliance`/`phases` zod-validated collections; locale-invariant numeric fields; `t(key,locale)` micro-copy in Task 2).
- **§11 Hero & motion system** → Task 4 (motion tokens consumed; reveal recipe; reduced-motion gate that never constructs timelines) + Task 8 (WebGL ember dot-matrix + diffraction-ring hero; lazy idle-init; IO/visibility pause; DPR≤2; ~45fps throttle; 2D degrade; Save-Data density drop; static SSR poster as the initial frame).
- **§12 Accessibility** → one `<h1>` (Task 9); skip link first (Task 7); `aria-labelledby` sections (Task 9); clay CTA dark ink (Task 6); focus-visible gold ring (Task 3); canvas/HUD/numerals `aria-hidden` (Tasks 6/8/9); reduced motion suppresses timeline construction + renders the poster (Tasks 4/8); verified by axe in Task 9.
- **§13 Tech architecture & deployment** → Task 1 (`output:'static'`, `site`, `trailingSlash:'always'`, i18n `prefixDefaultLocale:false`, sitemap) + Task 10 (GitHub Actions `withastro/action` → Pages, `public/CNAME` resolving the §15.6 deploy-target open question to the custom domain).

**Symbol consistency check (verbatim across tasks):** `Locale`, `t(key, locale)`, `prefersReducedMotion()`, `revealOnEnter(selector, opts)`, `countUp(el, opts)`, `formatCount(n, prefix, suffix)`, `initHero(canvas, opts) => { destroy() }`, collections `{ layers, slas, compliance, phases }`, `CTAButton` props `{ variant, href, label }`, `SectionHeader` props `{ index, zh, en }` — all defined once and consumed under the same names everywhere.

**No placeholders:** every code step is complete and runnable; every fact (RTO ≤4hr, RPO ≤15min, SLO ≥95%, 良率 ≥90%, 8 Gate, 100% 歸檔, 等保2.0三級 / 密評 / IEC 62443 / SEMI E187 / ISA-95, GB300 NVL72×3 / HGX B300×4 / Quantum-X800 / Spectrum-X SN5600 / NVMe 數據湖, M1–M22+ phases) traces to `content-inventory.md` / `shiny3-content.md`. Task 10 Step 5 enforces this against the built HTML.
