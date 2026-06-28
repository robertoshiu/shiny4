# SHINYLOGIC 顯藝科技 — Website Redesign (shiny4)

- **Date:** 2026-06-28
- **Status:** Approved direction — ready for implementation planning
- **Topic:** Full redesign of the SHINYLOGIC marketing site, rebuilt from the shiny3 content as a trilingual, motion-rich Astro site.
- **Design process artifacts:** `docs/design-research/` (source corpus `shiny3-content.md`, `content-inventory.md`, brand board, the three concept mockups + HTML).

---

## 1. Summary

Rebuild the SHINYLOGIC 顯藝科技 website (a Taiwan/Hsinchu IT/OT+AI full-stack systems integrator for high-volume-manufacturing semiconductor wafer fabs; reference build "FAB300") as a brand-new, awwwards-grade site. The aesthetic is **Direction C "Warm-Dark Foundry"** and the experience concept is **C3 "Molten Editorial," elevated** — Orano-style cinematic editorial restraint, raised to meet a high-craft motion + WebGL mandate by grafting a molten-wafer hero and protocol-level depth from the other explored concepts.

Tagline: **把設備數據，鍛造成可決策的智能。** (Forge equipment data into decisions.)

Full 7-page rebuild · trilingual 繁/EN/简 with a toggle · Astro static output → GitHub Pages · high-craft cinematic motion (anime.js v4 + IntersectionObserver) + a WebGL hero with a static-poster fallback.

## 2. Goals

- Communicate, in under 5 seconds above the fold, what SHINYLOGIC delivers (one reference build: FAB300 — 6-layer architecture, 4 phases, 8 gates, contractual SLAs) and anchor credibility immediately.
- Win the **technical evaluator** with real protocol/spec-level depth, and the **economic buyer + procurement gatekeeper** with restraint, governance, and contractually-framed SLAs.
- Deliver the "酷炫"/cool brief through **high craft and cinematic motion**, not busy dashboards — premium, engineering-credible, never neon or gimmicky.
- Preserve every fact, number, and standard exactly, identically across all three languages.
- Drive the single conversion: **預約諮詢** (book a scope consultation).

## 3. Non-goals / out of scope

- No backend / CMS / server. Static only. The contact form POSTs client-side (e.g. Google Sheet endpoint) with full error/success states.
- No named client logos or case-study references (the company is in stealth on clients). No founder-bio-driven authority section.
- No e-commerce, login, or gated content.
- Not a pixel-copy of Orano or Anime.js — those are aesthetic references, not templates.

## 4. Success criteria

- All 7 pages built in 繁中, with EN and 简体 generated and switchable; every numeric/spec fact byte-identical across locales.
- Lighthouse: Performance ≥ 90 (mobile, mid-tier), Accessibility ≥ 95, Best-Practices ≥ 95. Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms — verified with the WebGL hero active.
- WCAG 2.2 AA verified (keyboard pass, screen-reader landmark sweep, documented contrast matrix). Full content legible and the site fully usable with JS disabled and under `prefers-reduced-motion`.
- Visual fidelity to the approved Direction C / C3-elevated mockups; a written `DESIGN.md` locks the tokens.
- Deploys to GitHub Pages from `astro build`.

## 5. Brand & visual system — Direction C "Warm-Dark Foundry"

A formal **`DESIGN.md`** will be authored at the repo root as the single source of truth (CLAUDE.md requires reading it before any visual decision). Tokens below are the seed. This **intentionally deviates** from the warm-organic palette embedded in `public/og-card.html` by darkening the base to a warm espresso — approved by the user.

**Color tokens**
- Base: `--bg #14100D` (warm espresso-black), `--bg-deep #0E0B08`, `--surface #211A14`, `--surface-raised #2A2018`.
- Ink: `--ink #F2E9DE` (cream, body), `--ink-muted #A9988A` (secondary/large only — **never** body or form labels), `--ink-faint #6E6157`.
- Accents (semantic — see below): `--clay #E07A5F`, `--clay-deep #B0492A`, `--sun #E9C46A`, `--sage #81A684`.
- Borders on dark: `rgba(242,233,222,0.10)` / strong `rgba(242,233,222,0.18)`.

**Tri-accent semantic system (non-negotiable, applied globally):** color carries meaning, not decoration.
- **clay** = resilience / recovery / DR (≤4hr RTO, ≤15min RPO)
- **gold (sun)** = service level / performance (≥95% SLO, ≥90% yield)
- **sage** = coverage / archive (100% 歸檔)
Color is never the sole carrier of meaning — every coded element also has a text label/icon.

**Type**
- Display: **Fraunces** (serif soul; optical sizing; large 64–120px), Chinese display fallback **Noto Serif TC**.
- HUD / labels / metrics: **Spline Sans Mono**.
- Body: **Nunito Sans** + **Noto Sans TC**.

**Signature motifs:** ember dot-matrix (gold→clay, diagonal fade); mono HUD coordinate markers (`// X:0420 Y:1080 [REC]`) as *ambient decoration only*, never a masquerade of real-time data; thin gold underline (stroke-draw); concentric diffraction rings; giant faint section numerals 01–09. Mood: molten silicon, a foundry at night — dark cinematic cool lit by clay + gold.

## 6. Concept — C3 "Molten Editorial," elevated

**Governing aesthetic = C3:** oversized Fraunces editorial type, luxurious warm-dark negative space, restraint as a trust signal, the anti-overpromise trust line placed high, the oversized "By the Numbers" block, line-by-line headline reveals, gold-underline stroke-draw.

**Grafts that elevate it (fix C3's under-motion + thin-system weaknesses):**
1. **WebGL molten-wafer hero** (from concept C2's wafer disc): a concentric diffraction-ring wafer fused with an ember particle field (gold→clay over espresso). This is how C3 delivers the high-motion + WebGL mandate — high *craft*, not high *busyness*. It is also the most ownable "molten silicon" expression in the set.
2. **Protocol-level depth as editorial chapters** (from concept C1): the L1→L6 architecture with honest **ACTIVE / BRIDGE / LEGACY** protocol badges (SECS-GEM, GEM300, OPC UA, …), rendered calm and editorial with a *minimal* scroll-progress indicator — not C1's dense left rail. Gives the technical evaluator depth without abandoning restraint.
3. **Honest capability matrix** (from C2): the 6-panel capability grid (mapped to the 6 layers) — but with **real values only** from the content inventory, recolored by the tri-accent system. No sparkline filler.

**Killed on sight (from C2):** all fabricated live telemetry (YIELD 98.6%, UPTIME 99.994%, GPU UTIL, lot counts, sync-lag), persistent top/bottom data tickers, blinking REC-as-real-data. HUD coordinate strings survive only as visibly-ambient decoration.

**Density governor:** restraint scales *up* with content gravity — maximum stillness and negative space on SLA, gate, risk, and compliance sections where procurement lives; more delight permitted in exploratory Technology sections.

## 7. Information architecture (7 pages)

Flat IA — 7 top-level pages, no nested routes; within-page navigation is anchor scroll-spy. Universal blocks (6-KPI SLA strip, 5-standard compliance cluster, ENGAGE CTA, footer) are shared partials reused across pages. Section facts trace to `docs/design-research/content-inventory.md`.

**[1] HOME `/`** (synthesized from cross-cutting facts only — the homepage was absent from the source corpus; no claims invented):
H0 WebGL molten-wafer hero (tagline + positioning one-liner + 4 meaning-colored proof chips ≤4hr·六層架構·≥95%·100% + 預約諮詢 / 查看系統架構→) → 01 positioning + anti-overpromise trust line (SI not equipment vendor; baseline = the fab's own in-house team) → 02 six-layer architecture as editorial chapters (L1→L6, each deep-links to Solutions/Technology) → 03 universal SLA strip (良率≥90%·SLO≥95%·RTO≤4hr·RPO≤15min·8 Gate·100%歸檔, meaning-colored) → 04 FAB300 4-phase/8-gate teaser (建廠→裝機→試產→量產, M1–M22+) → 05 "By the Numbers" oversized tri-accent metrics → 06 compliance seal cluster + NVIDIA Blackwell/GB300 ecosystem signal → 07 build-vs-buy (talent scarcity / schedule risk / no lock-in) → 08 ENGAGE CTA (hello@shinylogic.tech) → footer.

**[2] ABOUT 關於:** Hero → 01 使命與定位 → 02 我們交付什麼 (L1–L6 + compliance) → 03 治理與責任 (RACI唯一A / 8 Gate / 風險三級 / DR季度演練) → 04 交付節奏 (4-phase) → 05 為何信任我們 → 06 關鍵數字 → 07 ENGAGE → footer.

**[3] SOLUTIONS 解決方案:** Hero (4 stats) → SOL.02 六層架構→六解決框架 → SOL.03 六大解決方案 (6 expandable blocks: 問題→交付範圍→關鍵規格 + 佔比 gauge) → SOL.04 成果與承諾 (6-KPI SLA grid + compliance + governance) → SOL.05 為何委外而非自建 → ENGAGE → footer.

**[4] TECHNOLOGY 技術** (deepest page, sticky in-hero L1–L6 layer-nav): Hero → 01 Blackwell Ultra 算力底座 (hardware table + liquid-cooling note) → 02 高速網絡 Fabric (Quantum-X800 / Spectrum-X SN5600 / + any further devices per content inventory) → 03 高量產 MES FAB300 (7-module map + EAP scope) → 04 數據與 AI 平台 (Historian / Lakehouse EDA / Digital Twin / Agentic RAG) → 05 資訊安全 OT/IT (3-zone diagram + compliance) → 06 韌性與異地備援 (DR architecture table) → 07 合規基準 (5-standard matrix) → CTA → footer.

**[5] METHODOLOGY 方法論** (`case-studies.html`): Hero → FIG.02 六層×階段交付矩陣 (10-row × 4-phase matrix — the largest grid on the site) → FIG.03 四階段交付 (P1–P4 timeline + gates) → FIG.04 成果與承諾 (5-KPI SLA cards + compliance) → FIG.05 風險與合規 (6 risk cards R.01–R.06, 風險→對策) → FIG.06 跨廠複製藍圖 (3-step + 5-item checklist + honest disclaimer) → ENGAGE → footer.

**[6] CAREERS 招募:** Hero (3 stats) → 01 前沿技術真實場景 (4 cards) → 02 IT智能部八大職能 (T1–T8) → 03 四階段組建 (P1–P4) → 04 拿授權拿責任 (3 principles + norms + compliance) → 05 代表性職缺 (JD-001–006) → APPLY (email-direct) → footer.

**[7] CONTACT 預約諮詢** (primary conversion page): Hero (coords N24°08′ E120°41′) → ENGAGE.00 四步交付流程 (諮詢評估→範圍評估→建置合約→交付+100%歸檔) → FORM.01 諮詢表單 (5 fields + honeypot + error/success) → DIRECT.02 直接聯絡 (email / 2-day response / 繁·EN·简 / Hsinchu) → INFO.03 諮詢類型說明 (5 types) → CTA → footer.

## 8. Global chrome

**Header** (identical all pages): left brand lockup (SHINYLOGIC 顯藝科技 Fraunces wordmark + `INTELLIGENT WAFER FAB SYSTEMS` mono sub-label); 5 primary nav items (關於 / 解決方案 / 技術 / 方法論 / 招募) with animated thin-gold-underline hover; a 3-segment 繁/EN/简 toggle; a distinct **clay 預約諮詢 pill** (persists on every page/fold). Starts transparent over the dark hero; on scroll past hero gains `--surface` + 1px gold hairline + blur; hide-on-scroll-down / reveal-on-scroll-up. Mobile (<768px): hamburger → full-height espresso drawer, staggered nav reveal, toggle + CTA pinned at bottom, focus-trapped, Esc/overlay close, sticky bottom CTA bar.

**Footer** (identical all pages): 3 columns — 公司 (關於/招募) · 能力 (解決方案/技術/方法論) · 聯絡 (hello@shinylogic.tech); language selector; legal (交付範疇依合約確認 · © 2026 顯藝科技); a tagline ticker (paused under reduced-motion).

## 9. Trilingual / i18n model

繁中 (zh-Hant) is the **source of truth and SEO canonical, unprefixed at root**; EN under `/en/`, 简体 (zh-Hans) under `/zh-hans/`. Astro i18n `prefixDefaultLocale: false`, `trailingSlash: 'always'`.

- **Toggle** swaps only the locale prefix while preserving page path + hash (e.g. `/en/methodology/#FIG-05` → `/zh-hans/methodology/#FIG-05`), via a build-injected per-page translation map; segments are real `<a>` anchors (work with JS off, crawlable).
- **Persistence:** cookie (`pref_lang`, 1yr, SameSite=Lax) + localStorage; a pre-paint inline head script redirects **only from the unprefixed root** to the stored locale (never fights a deep link; honors `?lang`; never loops); first visit may consult `navigator.language`, defaulting to 繁.
- **SEO/A11y:** `<link rel="alternate" hreflang>` for all three + `x-default`→繁; correct `<html lang>` per locale.
- **Fact fidelity:** numbers/specs/standards (RTO≤4hr, IEC 62443, GB300 NVL72) are **locale-invariant tokens** stored once; only surrounding prose translates — every fact preserved identically across all three languages.

## 10. Component library & content model

**Content collections** (`src/content/`, zod-validated) model the FAB300 facts once, rendered everywhere: `layers` (L1–L6), `solutions` (6), `phases` (P1–P4), `deliveryMatrix` (10×4), `slas` (6 KPIs), `compliance` (5 standards + definitions), `risks` (R.01–R.06), `teams` (T1–T8), `roles` (JD-001–006), `inquiryTypes` (5), `processSteps` (4), `techComponents`. Locale-invariant numeric/spec fields live once; translatable label/prose fields are per-locale. UI micro-copy in `src/i18n/{zh-Hant,en,zh-Hans}.json` with a `t(key, locale)` helper.

**Components** (`src/components/`):
- Global: `Header`, `Nav`, `LanguageToggle`, `Footer`, `FooterTicker`, `SkipLink`, `HudCoordinate`, `SectionHeader` (number + 中文 + EN + gold underline), `CTAButton`, `ComplianceBadges`, `SlaStrip` (universal 6-KPI block), `EngageCTA`.
- Hero: `HeroCanvas` (+ `hero-webgl.ts` island) + `HeroPoster` (static fallback).
- Data-driven: `LayerStack`, `SolutionBlock`, `PhaseTimeline`, `DeliveryMatrix` (10×4), `RiskCard`, `TeamFunctionCard`, `JobCard`, `InquiryTypeCard`, `ProcessSteps`, `StatBlock`, `SecurityZoneDiagram`, `HardwareTable`, `ComplianceMatrix`.
- Islands (TS): `theme-motion.ts` (reduced-motion + IO reveal util + anime timelines), `counter.ts`, `lang-persist.ts`, `contact-form.ts`.

**The same vetted partials render identically across all 7 pages** for ≥95% consistency — including the dense ones, so editorial restraint never starves structure. `DeliveryMatrix` (10×4) and `HardwareTable` are built and pressure-tested early as the highest fragmentation risk.

## 11. Hero & motion system

**Engine:** anime.js v4 (ESM, tree-shaken) as the single animation engine + native IntersectionObserver scroll-triggers (no GSAP). Optional Lenis smooth-scroll, perf-gated and off under reduced-motion (pure enhancement).

**Motion tokens** (single source, CSS custom props + JS constants): durations `--dur-instant 120ms … --dur-cinematic 1200ms`; easings `--ease-out (.22,1,.36,1)`, `--ease-inout (.65,0,.35,1)`, `--ease-emphasis (.16,1,.3,1)`, anime `spring(1,80,12)` for dot-matrix/snap; stagger base 40ms / grid 60ms; reveal translateY 24–40px always paired with opacity 0→1.

**Scroll→reveal recipes:** giant numerals parallax slower (~0.3×); section headers fade+rise; layer/grid/card sets IO stagger-reveal; HUD strings mono character-reveal; stat numbers count-up on enter (≤/≥ prefixes preserved); gold underline width 0→100%; hero diffraction rings slow ambient loop. **Principle: every animation must do work** — reveal structure, confirm a fact, or aid navigation; nothing moves to decorate.

**WebGL hero:** full-bleed canvas — ember dot-matrix particle field (gold→clay over espresso) + concentric diffraction-ring wafer disc + slow mouse/scroll parallax (WebGL via regl/raw GLSL; degrade to 2D canvas if context fails). Lifecycle: lazy-init after first paint (`requestIdleCallback`), IO-pause offscreen, DPR ≤ 2, throttle 30–60fps, destroy on route change, honor Save-Data/low-power by dropping particle count.

**Graceful static fallback** (3 triggers — no WebGL, reduced-motion, Save-Data/low-end): a pre-baked static poster (espresso gradient + SVG dot-matrix + still rings + HUD overlay) that is **also the SSR/initial frame** — zero CLS, never a blank hero, content never gated behind canvas.

## 12. Accessibility (WCAG 2.2 AA)

- Semantic landmarks; one `<h1>`/page (hero headline); strict h2/h3 nesting; `<section aria-labelledby>`; skip-to-content first focusable.
- **Contrast:** cream `#F2E9DE` on espresso passes AAA for body; `--ink-muted` barred from body/labels; **clay CTA uses dark ink** (cream-on-clay ≈ 2.3:1 fails); focus-visible ring = gold 2px, ≥3:1 on all surfaces; risk levels (三級) always text+icon, never color-only; enforce a minimum size on small mono labels (not just ratio).
- **Keyboard/focus:** full operability; logical order; drawer + expandable blocks focus-trapped + Esc + focus-restore; scroll-spy never steals focus; canvas hero `aria-hidden` + tabindex-excluded.
- **Decorative vs meaningful:** WebGL/dot-matrix/rings/numerals/HUD `aria-hidden`; stat values exposed to AT even when count-up suppressed.
- **Reduced motion:** `prefers-reduced-motion` honored in CSS *and* JS; timelines are **never constructed** (not just paused); content is in the DOM and visible by default (reveals are progressive enhancement); WebGL never initializes (poster renders); tickers/loops static.
- **Forms:** `<label for>`, `aria-required`, honeypot `aria-hidden` off-screen, errors via `aria-describedby` + `role=alert`, success in `aria-live=polite`, native `<select>` for inquiry types.
- **i18n a11y:** correct `<html lang>` per locale; lang toggle labeled in-language; target sizes ≥44px.

## 13. Tech architecture & deployment

- **Astro** `output: 'static'`. `astro.config.mjs`: `site: 'https://shinylogic.tech'`, `base: '/'` (custom domain via `public/CNAME`; if project-scoped Pages instead, `base: '/<repo>/'` and route internal links through `import.meta.env.BASE_URL` — **resolve at planning**). i18n as §9. Integrations: `@astrojs/sitemap` (+ optional partytown). anime.js + hero WebGL ship as islands (`client:visible`/`client:idle`), not in the global bundle.
- **Routes:** directory-per-locale, generated. `src/pages/*.astro` (繁, unprefixed) + `/en/` + `/zh-hans/` via `getStaticPaths` over shared page components; `404.astro` at root. ~21 static routes (7 pages × 3 locales).
- **Layouts:** `BaseLayout` (`<html lang>`, head/meta/hreflang/fonts, inline pre-paint lang-redirect + reduced-motion boot, static hero poster as critical CSS, Header, slot, Footer) → `PageLayout` (section-numeral scaffolding, HUD slots, per-page hero variant).
- **Build→deploy:** GitHub Actions (`withastro/action`) → `astro build` → `dist/` → Pages. All i18n persistence + form submission client-side (no server).
- **Existing assets:** reuse `public/` (favicon.svg, logo.png/webp, poster.jpg/webp, og-image.png, init.mp4/webm) where they fit Direction C.

## 14. Content strategy

- **Open rewrite** of all copy for cinematic impact, with a hard rule: every fact, number, spec, and standard is preserved and traces to `content-inventory.md`. The trilingual fact-invariance model (§9) enforces this structurally.
- **Translations:** EN + 简体 generated from 繁中 in the same technical-marketing register, reviewed before ship.
- **Feature high:** the anti-overpromise trust line — "每一條 SLO 承諾的背後，都是一套工業級韌性的架構—而非一份期望管理的文件" + "真實演練驗證，而非假設推算" — placed in the opening folds (procurement's #1 objection killer).
- **Authority anchor (opening folds):** compliance seal cluster (等保2.0三級 · 密評 · IEC 62443 · SEMI E187 · ISA-95) as authoritative badges + the NVIDIA Blackwell / GB300 NVL72 ecosystem signal, phrased strictly factually ("built on NVIDIA GB300 NVL72"), never implying a partnership. No named clients.
- **Headline line-breaks** hand-tuned per language so the giant Fraunces tagline never strands an orphan line across 繁/EN/简.

## 15. Risks & open questions

1. **Two visual languages on dense pages** — the editorial format must hold on Methodology's 10×4 matrix and Technology's hardware tables without fragmenting. Mitigation: build `DeliveryMatrix`/`HardwareTable` early, pressure-test.
2. **WebGL performance/CLS on GitHub Pages** — the fused disc+beam hero is heavy; must hit LCP/CLS/INP budgets (DPR cap, fps throttle, IO pause, poster SSR frame).
3. **Long-scroll a11y** — ship a true all-content static reveal under reduced-motion; keep any progress indicator keyboard-operable and reflow-safe at 320px/400%.
4. **Trilingual fragility** — design mono micro-labels and the headline to the longest-language budget; verify the trust copy lands with equal gravitas in Noto Serif TC (Fraunces is Latin-only).
5. **No urgency lever yet** — the honest GB300 ~12-month lead-time is a legitimate "secure your compute slot" hook; decide at content pass whether to use it.
6. **Deploy target** — confirm custom domain `shinylogic.tech` vs project-scoped Pages base path before build.
7. **Git** — the repo is not yet a git repository; initialize before committing the spec / setting up CI.

## 16. Implementation phasing (hint for planning)

1. Scaffold Astro + i18n + `DESIGN.md` + tokens + base layouts/chrome (Header/Nav/Footer/LanguageToggle).
2. Content collections + zod schemas + 繁中 content authored from the inventory; the universal partials (SlaStrip, ComplianceBadges, SectionHeader, EngageCTA).
3. Motion system + WebGL hero + static poster + reduced-motion plumbing.
4. Home page end-to-end (vertical slice) → review.
5. Remaining 6 pages via the component kit; build the dense components (DeliveryMatrix, HardwareTable) early.
6. EN + 简体 generation + translation map + persistence.
7. A11y + performance hardening; Lighthouse/axe in CI; deploy to Pages.
