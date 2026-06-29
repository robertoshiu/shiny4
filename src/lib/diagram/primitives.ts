/**
 * primitives.ts — Build-time geometry helpers for inline-SVG engineering diagrams.
 * All functions are pure (no DOM). Reuses the same HTW=65, HTH=32 dimetric
 * projection as CleanroomCutaway.astro and ScanField.astro.
 */

import type { Vec2 } from './types';

export const HTW = 65; // half tile width (screen px)
export const HTH = 32; // half tile height (screen px)

/** Isometric rhombus points string (4 vertices: T, R, B, L). */
export function rhombus(ox: number, oy: number, col: number, row: number): string {
  const tx = ox + col * HTW - row * HTW;
  const ty = oy + col * HTH + row * HTH;
  return `${tx},${ty} ${tx + HTW},${ty + HTH} ${tx},${ty + HTH * 2} ${tx - HTW},${ty + HTH}`;
}

/** Isometric box faces (top rhombus + left quad + right quad). */
export function isoBox(ox: number, oy: number, col: number, row: number, boxH: number) {
  const tx = ox + col * HTW - row * HTW;
  const ty = oy + col * HTH + row * HTH;
  const top   = `${tx},${ty} ${tx+HTW},${ty+HTH} ${tx},${ty+HTH*2} ${tx-HTW},${ty+HTH}`;
  const left  = `${tx-HTW},${ty+HTH} ${tx},${ty+HTH*2} ${tx},${ty+HTH*2+boxH} ${tx-HTW},${ty+HTH+boxH}`;
  const right = `${tx},${ty+HTH*2} ${tx+HTW},${ty+HTH} ${tx+HTW},${ty+HTH+boxH} ${tx},${ty+HTH*2+boxH}`;
  return { top, left, right, cx: tx, cy: ty + HTH * 2 };
}

/** Flat disc / top face only (no vertical walls — for wafers, showerheads). */
export function isoDisc(sx: number, sy: number, rw: number, rh: number): string {
  // Ellipse encoded as SVG path (M arc A arc Z) for stroke-dasharray on draw-in.
  const rx = rw; const ry = rh;
  return `M ${sx - rx} ${sy} A ${rx} ${ry} 0 0 1 ${sx + rx} ${sy} A ${rx} ${ry} 0 0 1 ${sx - rx} ${sy} Z`;
}

/** BOM balloon: circle + leader root point. Returns raw values for SVG rendering. */
export function balloon(at: Vec2, r = 13): { cx: number; cy: number; r: number } {
  return { cx: at.x, cy: at.y, r };
}

/** Leader line path: dot at part + shoulder + balloon center.
 *  dot is at `from` (part anchor), terminates at `to` (balloon center).
 *  Has a short elbow shoulder. */
export function leader(from: Vec2, to: Vec2): { d: string; dotCx: number; dotCy: number } {
  // Simple elbow: go to x=to.x at from.y, then down/up to to.y
  const elbowX = to.x;
  const elbowY = from.y;
  const d = `M ${from.x} ${from.y} L ${elbowX} ${elbowY} L ${to.x} ${to.y}`;
  return { d, dotCx: from.x, dotCy: from.y };
}

/** Dimension line with witness lines. Returns path data strings + label position. */
export function dimension(
  a: Vec2, b: Vec2,
  opts: { offset?: number } = {}
): { line: string; witnessA: string; witnessB: string; labelAt: Vec2 } {
  const off = opts.offset ?? 24;
  // Horizontal dimension line offset below both points
  const maxY = Math.max(a.y, b.y) + off;
  const line = `M ${a.x} ${maxY} L ${b.x} ${maxY}`;
  const witnessA = `M ${a.x} ${a.y + 4} L ${a.x} ${maxY + 6}`;
  const witnessB = `M ${b.x} ${b.y + 4} L ${b.x} ${maxY + 6}`;
  const labelAt: Vec2 = { x: (a.x + b.x) / 2, y: maxY + 14 };
  return { line, witnessA, witnessB, labelAt };
}

/** Dash-dot phantom centerline path (marks assembled seat for exploded part). */
export function centerline(a: Vec2, b: Vec2): string {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

/** 45° hatch pattern markup (returns SVG <pattern> string). */
export function hatchPatternDef(id: string): string {
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink-faint)" stroke-width="1" opacity="0.5"/></pattern>`;
}

/** Sparse orthogonal grid lines for background. */
export function gridLines(
  cols: number,
  rows: number,
  box: [Vec2, Vec2],
  step = 96
): { x1: number; y1: number; x2: number; y2: number }[] {
  const [min, max] = box;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= cols; i++) {
    const x = min.x + i * step;
    if (x > max.x) break;
    lines.push({ x1: x, y1: min.y, x2: x, y2: max.y });
  }
  for (let j = 0; j <= rows; j++) {
    const y = min.y + j * step;
    if (y > max.y) break;
    lines.push({ x1: min.x, y1: y, x2: max.x, y2: y });
  }
  return lines;
}
