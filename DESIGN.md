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
