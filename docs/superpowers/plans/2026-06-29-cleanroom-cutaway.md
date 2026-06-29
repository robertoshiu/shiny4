# CleanroomCutaway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-revealed semiconductor cleanroom cutaway SVG component to the Technology page, with anime.js scan animation, full i18n (zh-Hant/en/zh-Hans), WCAG 2.2 AA, and reduced-motion compliance.

**Architecture:** One `.astro` component (CleanroomCutaway) hosts the program-generated inline SVG, DOM-text HUD labels, and tri-accent legend; one `cleanroom-scan.ts` motion module (matching `scroll-fx.ts` lifecycle) drives the clip-path wipe + scan beam + `createDrawable` path reveals; i18n keys added to all three locale JSON files; mounted adjacent to `SecurityZoneDiagram` in `TechnologyContent.astro`.

**Tech Stack:** Astro 4, anime.js v4 (`animate`, `stagger`, `spring`, `createTimeline`, `createDrawable` — all confirmed present in `node_modules/animejs`), TypeScript, scoped CSS with DESIGN.md tokens, IntersectionObserver (one-shot), `prefersReducedMotion()` from `src/scripts/theme-motion.ts`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/CleanroomCutaway.astro` | CREATE | SVG component + scoped CSS + `<script>` init call |
| `src/scripts/motion/cleanroom-scan.ts` | CREATE | Motion module: clip-path wipe, beam, createDrawable paths |
| `src/i18n/zh-Hant.json` | MODIFY | Add `comp.c.crc.*` keys (7 strings) |
| `src/i18n/en.json` | MODIFY | Add `comp.c.crc.*` keys (7 strings) |
| `src/i18n/zh-hans.json` | MODIFY | Add `comp.c.crc.*` keys (7 strings) |
| `src/page-content/TechnologyContent.astro` | MODIFY | Import component + mount after SecurityZoneDiagram |

---

## Task 1: Add i18n keys to all three locale files

**Files:**
- Modify: `src/i18n/zh-Hant.json`
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/zh-hans.json`

The keys follow the established `comp.c.{abbr}.{key}` pattern (see `comp.c.szd.*` keys which are the last entries in each file, at line 542–546).

- [ ] **Step 1: Add keys to zh-Hant.json**

Open `src/i18n/zh-Hant.json`. The file ends with (lines 542–547):

```json
  "comp.c.szd.ariaLabel": "資訊安全 OT/IT 三域架構圖",
  "comp.c.szd.zonesAriaLabel": "三安全域",
  "comp.c.szd.complianceAriaLabel": "合規標準對應",
  "comp.c.szd.complianceNote": "所有架構層均對齊以下標準 · 合規文件於 8 道 Gate 逐階驗證",
  "comp.c.szd.components": "元件"
}
```

Replace the closing `}` with (keep the last `szd.components` line, add after it):

```json
  "comp.c.szd.components": "元件",

  "comp.c.crc.figcaption": "晶圓廠無塵室截面示意：天花板 FFU 層流、製程工具排列、晶圓吞吐路徑、次廠房設施與異地備援節點",
  "comp.c.crc.ariaLabel": "無塵室切面圖",
  "comp.c.crc.hudCoord": "X:0820 Y:FAB01",
  "comp.c.crc.hudLabel": "CLEANROOM CUTAWAY · ISO CLASS 4",
  "comp.c.crc.legend.clay": "韌性／備援",
  "comp.c.crc.legend.sun": "服務吞吐",
  "comp.c.crc.legend.sage": "廠務覆蓋"
}
```

- [ ] **Step 2: Add keys to en.json**

Same position in `src/i18n/en.json` (also ends at line ~546). Replace the `"comp.c.szd.components"` line's trailing comma and closing brace:

```json
  "comp.c.szd.components": "components",

  "comp.c.crc.figcaption": "Wafer fab cleanroom cutaway: ceiling FFU laminar airflow, process tool arrangement, wafer throughput path, sub-fab utilities, and DR nodes",
  "comp.c.crc.ariaLabel": "Cleanroom cutaway diagram",
  "comp.c.crc.hudCoord": "X:0820 Y:FAB01",
  "comp.c.crc.hudLabel": "CLEANROOM CUTAWAY · ISO CLASS 4",
  "comp.c.crc.legend.clay": "Resilience / DR",
  "comp.c.crc.legend.sun": "Service Throughput",
  "comp.c.crc.legend.sage": "Facility Coverage"
}
```

- [ ] **Step 3: Add keys to zh-hans.json**

Same position in `src/i18n/zh-hans.json`:

```json
  "comp.c.szd.components": "元件",

  "comp.c.crc.figcaption": "晶圆厂无尘室截面示意：天花板 FFU 层流、工艺设备排列、晶圆吞吐路径、次厂房设施与异地备援节点",
  "comp.c.crc.ariaLabel": "无尘室切面图",
  "comp.c.crc.hudCoord": "X:0820 Y:FAB01",
  "comp.c.crc.hudLabel": "CLEANROOM CUTAWAY · ISO CLASS 4",
  "comp.c.crc.legend.clay": "韧性／备援",
  "comp.c.crc.legend.sun": "服务吞吐",
  "comp.c.crc.legend.sage": "厂务覆盖"
}
```

- [ ] **Step 4: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/i18n/zh-Hant.json','utf8')); JSON.parse(require('fs').readFileSync('src/i18n/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/i18n/zh-hans.json','utf8')); console.log('all valid')"`

Expected: `all valid`

---

## Task 2: Create the motion module `cleanroom-scan.ts`

**Files:**
- Create: `src/scripts/motion/cleanroom-scan.ts`

This module matches the lifecycle pattern of `scroll-fx.ts` (named export, `prefersReducedMotion()` early return, `IntersectionObserver`, `pagehide` cleanup wired at call site).

anime.js v4 import form to match existing files: `import { animate, createTimeline, createDrawable } from 'animejs'`

Save-Data detection pattern from `dot-field.ts`: `(navigator as { connection?: { saveData?: boolean } }).connection?.saveData`

- [ ] **Step 1: Create the file with this exact content**

Create `src/scripts/motion/cleanroom-scan.ts`:

```typescript
/**
 * cleanroom-scan.ts — Scroll-triggered scan wipe for CleanroomCutaway.
 *
 * API:
 *   initCleanroomScan() → () => void   (returns cleanup fn)
 *
 * Behaviour:
 *   LAYER 1 (always, when motion OK):
 *     On IntersectionObserver enter (threshold 0.2, one-shot):
 *     - Sets clipPath start state in JS (not in markup — no-JS users see full diagram).
 *     - Animates clipPath 'inset(0 0 100% 0)' → 'inset(0 0 0% 0)' over 1200ms (--dur-cinematic).
 *     - Drives the scan-beam top position (progress%) and opacity mid-sweep.
 *   LAYER 2 (desktop + non-Save-Data):
 *     - createDrawable on [data-scan-layer="wafers"], [data-scan-layer="dr"],
 *       [data-scan-layer="subfab"] paths — staggered draw-in 240ms after wipe start.
 *     - Gated behind !saveData && matchMedia('(min-width: 48rem)').matches.
 *
 *   Under prefers-reduced-motion: returns no-op; markup shows final state.
 */

import { animate, createTimeline, createDrawable } from 'animejs';
import { prefersReducedMotion } from '../theme-motion';

// Save-Data detection (same idiom as dot-field.ts)
const saveData = !!(navigator as { connection?: { saveData?: boolean } }).connection?.saveData;

export function initCleanroomScan(): () => void {
  if (prefersReducedMotion()) return () => {};

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-fab]'));
  if (roots.length === 0) return () => {};

  const cleanups: Array<() => void> = [];
  const isDesktopNonSaveData =
    !saveData && matchMedia('(min-width: 48rem)').matches;

  for (const root of roots) {
    const inked = root.querySelector<HTMLElement>('.fab__inked');
    const beam  = root.querySelector<HTMLElement>('.fab__beam');
    if (!inked) continue;

    // Set hidden start state in JS — markup default is clip-path:none (final state)
    // so no-JS / SSR users always see the complete diagram.
    inked.style.clipPath = 'inset(0 0 100% 0)';

    // Gather accent-layer paths for Layer 2 draw-in
    const accentPaths: SVGPathElement[] = [];
    if (isDesktopNonSaveData) {
      root
        .querySelectorAll<SVGPathElement>(
          '[data-scan-layer="wafers"] path, [data-scan-layer="dr"] path, [data-scan-layer="subfab"] path',
        )
        .forEach((p) => accentPaths.push(p));
    }

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || fired) continue;
          fired = true;
          io.disconnect();

          // ── LAYER 1: clip-path wipe (top → bottom = laminar flow direction) ──
          // CSS clip-path 'inset(top right bottom left)':
          // start: inset(0 0 100% 0)  → full clip from bottom (nothing visible)
          // end:   inset(0 0 0% 0)    → no clip (full diagram visible)
          const tl = createTimeline({ defaults: { ease: 'cubicBezier(0.22, 1, 0.36, 1)' } });

          tl.add(inked, {
            clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
            duration: 1200,
            onUpdate(anim) {
              // Drive beam position — progress 0→1 maps to top 0%→100%
              if (!beam) return;
              const p = anim.progress;
              // Beam is visible from 5%–95% progress; peaks at 50%
              const opacity = p > 0.05 && p < 0.95
                ? Math.sin(Math.min(p / 0.95, 1) * Math.PI) * 0.85
                : 0;
              beam.style.top = `${p * 100}%`;
              beam.style.opacity = String(opacity);
            },
            onComplete() {
              if (beam) beam.style.opacity = '0';
            },
          });

          // ── LAYER 2: accent path draw-ins (desktop + non-Save-Data) ──
          if (isDesktopNonSaveData && accentPaths.length > 0) {
            // createDrawable wraps each SVG path for strokeDashoffset animation
            const drawables = accentPaths.map((p) => createDrawable(p, 0, 0));
            // Animate draw from 0 to 1 with stagger, starting 240ms after wipe
            tl.add(
              accentPaths,
              {
                draw: ['0 0', '0 1'],
                delay: (_el: Element, i: number) => i * 40,
                duration: 600,
                ease: 'cubicBezier(0.22, 1, 0.36, 1)',
              },
              240,
            );
            // Suppress unused-variable warning — drawables are created for side effect
            void drawables;
          }
        }
      },
      { threshold: 0.2 },
    );

    io.observe(root);
    cleanups.push(() => io.disconnect());
  }

  return () => cleanups.forEach((fn) => fn());
}
```

- [ ] **Step 2: Verify TypeScript compiles (quick check)**

Run: `npx tsc --noEmit --project tsconfig.json 2>&1 | head -20`

Expected: no errors referencing `cleanroom-scan.ts`

---

## Task 3: Create `CleanroomCutaway.astro`

**Files:**
- Create: `src/components/CleanroomCutaway.astro`

The component mirrors `SecurityZoneDiagram.astro` in structure: props, frontmatter, aria pattern, scoped CSS.

SVG geometry is program-generated in frontmatter:
- `ceilingTiles`: 10 cols × 4 rows of isometric rhombus tiles (FFU grid)
- `floorTiles`: 8 cols × 3 rows of isometric rhombus tiles (raised floor)
- `laminarArrows`: 5 x-positions for sage down-flow arrows
- `toolBoxes`: 6 isometric box configs for process tools

Isometric projection used:
- Half-tile width (`htw`) = 65px, half-tile height (`hth`) = 32px
- Tile top vertex at (ox + c*htw - r*htw, oy + c*hth + r*hth)
- Rhombus: top, right (+htw,+hth), bottom (+0,+hth*2), left (-htw,+hth)
- Box: top-face rhombus + left-face rect + right-face rect

- [ ] **Step 1: Create the file**

Create `src/components/CleanroomCutaway.astro` with the content below. (This is the full file — copy exactly.)

```astro
---
/**
 * CleanroomCutaway
 * Semiconductor cleanroom perspective/scan cutaway — skeleton placeholder.
 * SVG layers (each a <g data-scan-layer="...">):
 *   ceiling  — FFU tile grid + laminar-flow arrows (--ink-faint / --sage)
 *   shell    — bay/chase outline + raised-floor tile grid (--ink-faint)
 *   tools    — 6 isometric box placeholders for process equipment (--ink)
 *   wafers   — wafer-flow path (--sun, pathLength="1")
 *   subfab   — sub-fab utility lines (--sage)
 *   dr       — DR/redundancy element (--clay, pathLength="1")
 *
 * TODO: Replace placeholder box polygons with hand-drawn equipment art
 *       (litho/etch/CVD/EFEM/load-port/FOUP) once design is finalised.
 *
 * Projection: SVG authored in true isometric (htw=65, hth=32);
 * CSS perspective tilt (rotateX 6deg, rotateY −2deg) adds depth.
 *
 * Reduced-motion: clip-path is left at its default (none), beam is
 * display:none, no transitions — full final-state diagram shows.
 * JS sets the hidden start state only when motion is enabled.
 */
import { t, type Locale } from '../i18n/utils';

interface Props { locale?: Locale }
const { locale = 'zh-Hant' } = Astro.props;

// ── Isometric geometry helpers ──────────────────────────────────────────────
// Projection: half-tile-width (htw) and half-tile-height (hth).
// Tile top vertex at (ox + col*htw - row*htw, oy + col*hth + row*hth).
// Rhombus points: T, R (+htw,+hth), B (+0,+hth*2), L (-htw,+hth).
const HTW = 65; // half tile width  (px, screen space)
const HTH = 32; // half tile height (px, screen space)

function rhombus(ox: number, oy: number, col: number, row: number): string {
  const tx = ox + col * HTW - row * HTW;
  const ty = oy + col * HTH + row * HTH;
  return `${tx},${ty} ${tx + HTW},${ty + HTH} ${tx},${ty + HTH * 2} ${tx - HTW},${ty + HTH}`;
}

// Isometric box faces: top (rhombus), left (quad), right (quad).
// boxH = height of box sides in screen-space pixels.
function isoBox(ox: number, oy: number, col: number, row: number, boxH: number) {
  const tx = ox + col * HTW - row * HTW;
  const ty = oy + col * HTH + row * HTH;
  const top   = `${tx},${ty} ${tx+HTW},${ty+HTH} ${tx},${ty+HTH*2} ${tx-HTW},${ty+HTH}`;
  const left  = `${tx-HTW},${ty+HTH} ${tx},${ty+HTH*2} ${tx},${ty+HTH*2+boxH} ${tx-HTW},${ty+HTH+boxH}`;
  const right = `${tx},${ty+HTH*2} ${tx+HTW},${ty+HTH} ${tx+HTW},${ty+HTH+boxH} ${tx},${ty+HTH*2+boxH}`;
  return { top, left, right, cx: tx, cy: ty + HTH * 2 };
}

// ── Ceiling FFU grid ─────────────────────────────────────────────────────────
// 10 cols × 4 rows; origin (200, 60)
const CEIL_COLS = 10;
const CEIL_ROWS = 4;
const CEIL_OX   = 200;
const CEIL_OY   = 60;

const ceilingTiles = Array.from({ length: CEIL_ROWS }, (_, r) =>
  Array.from({ length: CEIL_COLS }, (_, c) => rhombus(CEIL_OX, CEIL_OY, c, r))
).flat();

// Sage laminar-flow down-arrows (5 positions)
const laminarX = [320, 500, 680, 860, 1040];
const LAMINAY  = 220; // top of arrow (below ceiling)

// ── Shell (bay outline + raised-floor tile grid) ─────────────────────────────
const BAY_X1 = 100; const BAY_Y1 = 180;
const BAY_X2 = 1340; const BAY_Y2 = 820;

// Floor tiles: 8 cols × 3 rows; origin (220, 680)
const FLOOR_COLS = 8;
const FLOOR_ROWS = 3;
const FLOOR_OX   = 220;
const FLOOR_OY   = 680;

const floorTiles = Array.from({ length: FLOOR_ROWS }, (_, r) =>
  Array.from({ length: FLOOR_COLS }, (_, c) => rhombus(FLOOR_OX, FLOOR_OY, c, r))
).flat();

// ── Process tool boxes ───────────────────────────────────────────────────────
// TODO: Replace these placeholder boxes with hand-drawn equipment art.
// Each tool: (col, row) in a virtual 6-wide × 1-deep grid centred at (480, 360).
// col spacing: 2 HTW apart; row = 0 for all (single row of tools).
const TOOL_OX  = 320;
const TOOL_OY  = 380;
const TOOL_BOXH = 120; // height of box sides in screen px

const toolDefs = [
  { col: 0, row: 0, label: 'LITHO',     en: 'Lithography' },
  { col: 2, row: 0, label: 'ETCH',      en: 'Etch' },
  { col: 4, row: 0, label: 'CVD',       en: 'CVD Dep.' },
  { col: 6, row: 0, label: 'EFEM',      en: 'EFEM' },
  { col: 8, row: 0, label: 'LOAD-PORT', en: 'Load Port' },
  { col: 0, row: 2, label: 'FOUP',      en: 'FOUP Station' },
];

const toolBoxes = toolDefs.map((t) => ({
  ...isoBox(TOOL_OX, TOOL_OY, t.col, t.row, TOOL_BOXH),
  label: t.label,
  en: t.en,
}));

// ── Wafer flow path (sun) ───────────────────────────────────────────────────
// Connects tool positions left → right across the mid-bay at raised-floor level.
const WAFER_Y = TOOL_OY + HTH * 2 + TOOL_BOXH + 20;
const waferPath = `M ${TOOL_OX} ${WAFER_Y} `
  + toolDefs.slice(0, 5).map((t) => {
      const tx = TOOL_OX + t.col * HTW;
      return `L ${tx} ${WAFER_Y}`;
    }).join(' ');

// ── Sub-fab utility lines (sage) ────────────────────────────────────────────
const SUBFAB_Y1 = 760; const SUBFAB_Y2 = 800; const SUBFAB_Y3 = 830;

// ── DR redundancy element (clay) ────────────────────────────────────────────
const DR_X1 = 1160; const DR_X2 = 1320;
const DR_Y1 = 350;  const DR_Y2 = 620;
---

{/* ── Outer wrapper ─────────────────────────────────────────────────── */}
<section class="fab" data-fab aria-labelledby="fab-caption">

  {/* ── HUD coordinate label (decorative, aria-hidden) ──────────────── */}
  <div class="fab__hud" aria-hidden="true">
    <span class="fab__hud-coord">{t('comp.c.crc.hudCoord', locale)}</span>
    <span class="fab__hud-label">{t('comp.c.crc.hudLabel', locale)}</span>
  </div>

  {/* ── Giant ghost section numeral (decorative) ─────────────────────── */}
  <span class="fab__numeral" aria-hidden="true">05</span>

  {/* ── The cutaway illustration ─────────────────────────────────────── */}
  <figure class="fab__figure">
    <figcaption id="fab-caption" class="fab__figcaption">
      {t('comp.c.crc.figcaption', locale)}
    </figcaption>

    {/*
      fab__inked — the wipe target.
      Default CSS: clip-path: none (full diagram visible for no-JS / SSR).
      JS sets: clip-path: inset(0 0 100% 0) as the hidden start state,
      then animates to inset(0 0 0% 0) on IntersectionObserver trigger.
    */}
    <div class="fab__stage">
      <svg
        class="fab__inked"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >

        {/* ── Layer: ceiling (FFU grid) ─────────────────────────── */}
        <g data-scan-layer="ceiling">
          {ceilingTiles.map((pts) => (
            <polygon points={pts} class="fab__ffu-tile" />
          ))}
          {/* Sage laminar-flow down-arrows */}
          {laminarX.map((x) => (
            <g class="fab__laminar">
              <line x1={x} y1={LAMINAY} x2={x} y2={LAMINAY + 60} />
              <polyline points={`${x - 8},${LAMINAY + 48} ${x},${LAMINAY + 62} ${x + 8},${LAMINAY + 48}`} />
            </g>
          ))}
        </g>

        {/* ── Layer: shell (bay outline + raised-floor tiles) ───── */}
        <g data-scan-layer="shell">
          {/* Bay/chase outline */}
          <rect
            x={BAY_X1} y={BAY_Y1}
            width={BAY_X2 - BAY_X1} height={BAY_Y2 - BAY_Y1}
            class="fab__bay"
          />
          {/* Raised-floor tile grid */}
          {floorTiles.map((pts) => (
            <polygon points={pts} class="fab__floor-tile" />
          ))}
        </g>

        {/* ── Layer: tools (process equipment placeholders) ─────── */}
        {/* TODO: replace placeholder boxes with hand-drawn equipment art */}
        <g data-scan-layer="tools">
          {toolBoxes.map((box) => (
            <g class="fab__tool">
              {/* Top face */}
              <polygon points={box.top}   class="fab__tool-top"   />
              {/* Left face */}
              <polygon points={box.left}  class="fab__tool-left"  />
              {/* Right face */}
              <polygon points={box.right} class="fab__tool-right" />
              {/* Label (decorative; real accessible label is in figcaption) */}
              <text
                x={box.cx}
                y={box.cy + TOOL_BOXH / 2}
                class="fab__tool-label"
                text-anchor="middle"
              >{box.label}</text>
            </g>
          ))}
        </g>

        {/* ── Layer: wafers (throughput semantic — sun) ────────── */}
        <g data-scan-layer="wafers">
          <path
            d={waferPath}
            pathLength="1"
            class="fab__wafer-path"
          />
        </g>

        {/* ── Layer: subfab (utility lines — sage) ─────────────── */}
        <g data-scan-layer="subfab">
          <path
            d={`M ${BAY_X1 + 40} ${SUBFAB_Y1} L ${BAY_X2 - 40} ${SUBFAB_Y1}`}
            pathLength="1"
            class="fab__subfab-line"
          />
          <path
            d={`M ${BAY_X1 + 40} ${SUBFAB_Y2} L ${BAY_X2 - 40} ${SUBFAB_Y2}`}
            pathLength="1"
            class="fab__subfab-line"
          />
          <path
            d={`M ${BAY_X1 + 40} ${SUBFAB_Y3} L ${BAY_X2 - 40} ${SUBFAB_Y3}`}
            pathLength="1"
            class="fab__subfab-line"
          />
        </g>

        {/* ── Layer: dr (resilience element — clay) ────────────── */}
        <g data-scan-layer="dr">
          <path
            d={`M ${DR_X1} ${DR_Y1} L ${DR_X2} ${DR_Y1} L ${DR_X2} ${DR_Y2} L ${DR_X1} ${DR_Y2} Z`}
            pathLength="1"
            class="fab__dr-rect"
          />
          {/* DR label tick line (decorative) */}
          <line x1={DR_X1 - 20} y1={(DR_Y1 + DR_Y2) / 2} x2={DR_X1} y2={(DR_Y1 + DR_Y2) / 2}
                class="fab__dr-tick" />
        </g>

      </svg>

      {/* ── Scan beam (JS-driven position, aria-hidden) ──────────── */}
      <div class="fab__beam" aria-hidden="true"></div>
    </div>
  </figure>

  {/* ── Tri-accent legend (real DOM text — color never sole encoding) ─ */}
  <dl class="fab__legend" aria-label="legend">
    <div class="fab__legend-item">
      <dt class="fab__legend-swatch fab__legend-swatch--clay" aria-hidden="true"></dt>
      <dd class="fab__legend-label fab__legend-label--clay">
        {t('comp.c.crc.legend.clay', locale)}
      </dd>
    </div>
    <div class="fab__legend-item">
      <dt class="fab__legend-swatch fab__legend-swatch--sun" aria-hidden="true"></dt>
      <dd class="fab__legend-label fab__legend-label--sun">
        {t('comp.c.crc.legend.sun', locale)}
      </dd>
    </div>
    <div class="fab__legend-item">
      <dt class="fab__legend-swatch fab__legend-swatch--sage" aria-hidden="true"></dt>
      <dd class="fab__legend-label fab__legend-label--sage">
        {t('comp.c.crc.legend.sage', locale)}
      </dd>
    </div>
  </dl>

</section>

{/* ── Motion init ─────────────────────────────────────────────────────── */}
<script>
  import { initCleanroomScan } from '../scripts/motion/cleanroom-scan';
  import { prefersReducedMotion } from '../scripts/theme-motion';

  function init(): void {
    if (prefersReducedMotion()) return;
    const cleanup = initCleanroomScan();
    window.addEventListener('pagehide', cleanup, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
</script>

<style>
  /* ── Outer section ──────────────────────────────────────────────────── */
  .fab {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-block: 2.5rem;
  }

  /* ── HUD coordinate strip (aria-hidden decoration) ─────────────────── */
  .fab__hud {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .fab__hud-coord {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    color: var(--ink-faint); /* decoration only — aria-hidden */
  }
  .fab__hud-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    color: var(--sun);
    text-transform: uppercase;
  }

  /* ── Giant ghost numeral (signature motif, decoration) ─────────────── */
  .fab__numeral {
    position: absolute;
    right: 0;
    top: -1.5rem;
    font-family: var(--font-display, serif);
    font-size: clamp(5rem, 12vw, 9rem);
    font-weight: 900;
    line-height: 1;
    color: var(--ink-faint); /* decoration only — aria-hidden */
    pointer-events: none;
    user-select: none;
    opacity: 0.12;
    z-index: 0;
  }

  /* ── Figure / stage ─────────────────────────────────────────────────── */
  .fab__figure {
    position: relative;
    margin: 0;
    border: 1px solid var(--border-strong);
    background: var(--bg-deep);
    overflow: hidden;
  }

  /* Screen-reader-only figcaption — visually hidden but reachable by AT */
  .fab__figcaption {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }

  /* ── Perspective stage — applies hybrid CSS projection ─────────────── */
  .fab__stage {
    position: relative;
    width: 100%;
    aspect-ratio: 1440 / 900;
    perspective: 1200px;
    perspective-origin: 50% 40%;
  }

  /* ── The inked SVG — wipe target ────────────────────────────────────── */
  .fab__inked {
    display: block;
    width: 100%;
    height: 100%;
    /*
     * Static tilt: far ceiling plane feels above eye level, tools closer.
     * On mobile (max-width: 48rem) the tilt is dropped (flat isometric).
     */
    transform: rotateX(6deg) rotateY(-2deg);
    transform-origin: 50% 40%;
    transform-style: preserve-3d;
    /*
     * Default clip-path: none — full diagram visible (no-JS / SSR / reduced-motion).
     * JS sets 'inset(0 0 100% 0)' as the hidden start state.
     */
    clip-path: none;
  }

  /* ── Scan beam (positioned by JS via top + opacity) ────────────────── */
  .fab__beam {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 3px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--sun) 30%,
      var(--clay) 70%,
      transparent 100%
    );
    mix-blend-mode: screen;
    opacity: 0;
    pointer-events: none;
  }

  /* ── SVG element styling ─────────────────────────────────────────────── */

  /* Ceiling FFU tile grid */
  .fab__ffu-tile {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 0.5;
    opacity: 0.5;
  }

  /* Sage laminar-flow arrows */
  .fab__laminar line,
  .fab__laminar polyline {
    fill: none;
    stroke: var(--sage);
    stroke-width: 1.5;
    opacity: 0.45;
  }

  /* Bay/chase outline */
  .fab__bay {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 1;
    opacity: 0.4;
  }

  /* Raised-floor tile grid */
  .fab__floor-tile {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 0.5;
    opacity: 0.35;
  }

  /* Tool box faces */
  .fab__tool-top {
    fill: color-mix(in srgb, var(--ink) 4%, transparent);
    stroke: var(--ink);
    stroke-width: 1;
  }
  .fab__tool-left {
    fill: color-mix(in srgb, var(--ink) 2%, transparent);
    stroke: var(--ink);
    stroke-width: 1;
    opacity: 0.7;
  }
  .fab__tool-right {
    fill: color-mix(in srgb, var(--ink) 6%, transparent);
    stroke: var(--ink);
    stroke-width: 1;
    opacity: 0.55;
  }
  .fab__tool-label {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: var(--ink-muted);
    letter-spacing: 0.08em;
    pointer-events: none;
  }

  /* Wafer flow path (sun = throughput) */
  .fab__wafer-path {
    fill: none;
    stroke: var(--sun);
    stroke-width: 2;
    opacity: 0.7;
    stroke-dasharray: 8 5;
  }

  /* Sub-fab utility lines (sage = coverage) */
  .fab__subfab-line {
    fill: none;
    stroke: var(--sage);
    stroke-width: 1;
    opacity: 0.5;
  }

  /* DR redundancy box (clay = resilience) */
  .fab__dr-rect {
    fill: color-mix(in srgb, var(--clay) 6%, transparent);
    stroke: var(--clay);
    stroke-width: 1.5;
    stroke-dasharray: 6 3;
    opacity: 0.7;
  }
  .fab__dr-tick {
    stroke: var(--clay);
    stroke-width: 1;
    opacity: 0.5;
  }

  /* ── Legend ──────────────────────────────────────────────────────────── */
  .fab__legend {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin: 0;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    background: var(--surface);
  }
  .fab__legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  /* dt = swatch, dd = label */
  .fab__legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
    margin: 0;
  }
  .fab__legend-swatch--clay { background: var(--clay); }
  .fab__legend-swatch--sun  { background: var(--sun);  }
  .fab__legend-swatch--sage { background: var(--sage); }

  .fab__legend-label {
    font-family: var(--font-mono);
    font-size: 0.70rem;
    letter-spacing: 0.06em;
    margin: 0;
  }
  /* Use --ink-muted (AA) for legend labels — never --ink-faint */
  .fab__legend-label--clay { color: var(--clay); }
  .fab__legend-label--sun  { color: var(--sun);  }
  .fab__legend-label--sage { color: var(--sage); }

  /* ── Responsive ──────────────────────────────────────────────────────── */
  @media (max-width: 48rem) {
    /* Drop CSS perspective on mobile — keep flat isometric appearance */
    .fab__stage {
      perspective: none;
    }
    .fab__inked {
      transform: none;
    }
    /* Hide detailed decorations on small screens */
    [data-detail] {
      display: none;
    }
  }

  /* ── Reduced-motion: full final state, no beam, no transitions ──────── */
  @media (prefers-reduced-motion: reduce) {
    .fab__inked {
      clip-path: none !important;
    }
    .fab__beam {
      display: none !important;
    }
    .fab__ffu-tile,
    .fab__laminar line,
    .fab__laminar polyline,
    .fab__wafer-path,
    .fab__subfab-line,
    .fab__dr-rect {
      transition: none;
    }
  }
</style>
```

- [ ] **Step 2: Quick visual sanity check (dry run)**

Verify the Astro file has valid syntax by checking for balanced braces in the frontmatter. The frontmatter (between `---` delimiters) contains pure TypeScript/JavaScript and should have no JSX.

The template section contains only `.astro`-valid syntax (JSX-like, with `{/* comments */}`). Verify there are no unmatched `{` or `}` characters.

---

## Task 4: Mount CleanroomCutaway in TechnologyContent.astro

**Files:**
- Modify: `src/page-content/TechnologyContent.astro`

The `SecurityZoneDiagram` import is already at line 6. We need to:
1. Add `CleanroomCutaway` import alongside it (line 6 area)
2. Add the component after `<SecurityZoneDiagram locale={locale} />` in the `#security` section (line 265)

- [ ] **Step 1: Add import**

In `src/page-content/TechnologyContent.astro`, find:

```astro
import SecurityZoneDiagram from '../components/SecurityZoneDiagram.astro';
```

Replace with:

```astro
import SecurityZoneDiagram from '../components/SecurityZoneDiagram.astro';
import CleanroomCutaway from '../components/CleanroomCutaway.astro';
```

- [ ] **Step 2: Mount adjacent to SecurityZoneDiagram**

In `src/page-content/TechnologyContent.astro`, find the `#security` section content:

```astro
    <SecurityZoneDiagram locale={locale} />
  </section>
```

Replace with:

```astro
    <SecurityZoneDiagram locale={locale} />
    <CleanroomCutaway locale={locale} />
  </section>
```

---

## Task 5: Run `astro check` and fix any errors

**Files:** Depends on what errors arise

- [ ] **Step 1: Run astro check**

```bash
npx astro check 2>&1
```

Expected: 0 errors. Common errors to watch for:
- TypeScript type errors in `cleanroom-scan.ts` (especially around `createDrawable` API)
- Missing i18n key if copy-paste introduced a typo
- Missing import in `CleanroomCutaway.astro`

- [ ] **Step 2: Fix any errors introduced by this PR**

If `astro check` reports errors:
- For TypeScript errors in `cleanroom-scan.ts`: the `createDrawable` call signature is `createDrawable(element, startDraw, endDraw)` where start/end are 0–1. The `draw` property is animated as `['0 0', '0 1']` (start offset, end offset).
- If `draw` property isn't the right API, replace the Layer 2 animation with `strokeDashoffset` / `strokeDasharray` animation on the raw paths:
  ```typescript
  animate(accentPaths, {
    strokeDashoffset: [1, 0],
    delay: (_el: Element, i: number) => i * 40,
    duration: 600,
    ease: 'cubicBezier(0.22, 1, 0.36, 1)',
  }, 240);
  ```
  And set `stroke-dasharray: 1; stroke-dashoffset: 1` on `.fab__wafer-path`, `.fab__subfab-line`, `.fab__dr-rect` in the component CSS.

Do NOT touch errors in pre-existing files unrelated to this PR.

---

## Task 6: Run `npm run build` and verify success

- [ ] **Step 1: Run build**

```bash
npm run build 2>&1
```

Expected: Build completes with `Complete!` or similar success message. No TypeScript or Vite errors.

- [ ] **Step 2: Check output**

```bash
ls dist/
```

Expected: `index.html`, `en/`, `zh-hans/` directories present (the three locale builds).

- [ ] **Step 3: Report result**

Paste the last 10 lines of build output in your report back, including any warnings.

---

## Self-Review Checklist

Spec requirement → task coverage:

| Requirement | Covered in |
|---|---|
| `CleanroomCutaway.astro` with 6 SVG layers | Task 3 |
| Program-generated FFU ceiling grid (`.map()`) | Task 3 (`ceilingTiles`) |
| Program-generated raised-floor tiles | Task 3 (`floorTiles`) |
| 6 isometric tool placeholder boxes | Task 3 (`toolBoxes`) |
| Wafer flow path, `pathLength="1"`, `--sun` | Task 3 |
| Sub-fab lines, `--sage` | Task 3 |
| DR element, `--clay`, `pathLength="1"` | Task 3 |
| Laminar-flow sage arrows | Task 3 |
| CSS hybrid perspective (rotateX/Y) | Task 3 (`.fab__inked`) |
| Mobile: drop perspective, hide `[data-detail]` | Task 3 (`@media max-width 48rem`) |
| Reduced-motion CSS: clip-path none, beam hidden | Task 3 (`prefers-reduced-motion`) |
| `aria-hidden` SVG + figcaption for AT | Task 3 |
| HUD coordinate labels (real DOM text) | Task 3 (`.fab__hud`) |
| Ghost section numeral | Task 3 (`.fab__numeral`) |
| Tri-accent legend (real DOM text) | Task 3 (`.fab__legend`) |
| `locale?: Locale` prop, default `zh-Hant` | Task 3 |
| `initCleanroomScan()` motion module | Task 2 |
| `prefersReducedMotion()` early return | Task 2 |
| IntersectionObserver one-shot, threshold 0.2 | Task 2 |
| JS sets clip-path hidden start (not markup) | Task 2 |
| Scan beam driven in `onUpdate` | Task 2 |
| `createDrawable` on accent layers | Task 2 |
| Layer 2 gated on `!saveData && desktop` | Task 2 |
| `pagehide` cleanup wired at call site | Task 3 (script block) |
| anime.js import matches existing form | Task 2 (`from 'animejs'`) |
| i18n keys all 3 locales, `comp.c.crc.*` | Task 1 |
| Mounted in `TechnologyContent.astro` | Task 4 |
| `astro check` clean | Task 5 |
| `npm run build` succeeds | Task 6 |

No placeholders ("TBD") found in the plan. All code is complete.

Type consistency: `isoBox()` returns `{ top, left, right, cx, cy }` — all five properties used in Task 3 template (`box.top`, `box.left`, `box.right`, `box.cx`, `box.cy`). `rhombus()` returns a `string` — used directly as `pts` in `points={pts}`. `initCleanroomScan()` returns `() => void` — assigned to `cleanup` and called on `pagehide`.
