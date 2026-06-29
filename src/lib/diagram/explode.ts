/**
 * explode.ts — Explode axis unit vectors + delta helpers (build-time, no DOM).
 * All math is done at build time in Astro frontmatter. Runtime reads only the
 * pre-baked data-ex-dx / data-ex-dy attributes — no projection math in JS.
 */

import type { ExplodeAxis, Vec2 } from './types';

/** Screen-space unit vectors for each explode axis (dimetric HTW=65, HTH=32). */
export const AXIS_UNIT: Record<ExplodeAxis, Vec2> = {
  'iso-z': { x: 0,      y: -1    },  // vertical lift (lid/showerhead/chamber/wafer)
  'iso-x': { x: 0.897,  y: 0.441 },  // iso ground axis — positive = lower-right
  'iso-y': { x: -0.897, y: 0.441 },  // iso ground axis — positive = lower-left
};

/**
 * Compute screen-px explode delta for a given axis and signed offset.
 * Positive offset on iso-z = up.  Negative offset on iso-x = lower-left.
 */
export function explodeDelta(axis: ExplodeAxis, offset: number): Vec2 {
  const u = AXIS_UNIT[axis];
  return { x: u.x * offset, y: u.y * offset };
}

/** CSS transform string for the fully-exploded position (markup default). */
export function explodedTransform(dx: number, dy: number): string {
  return `translate(${dx.toFixed(1)},${dy.toFixed(1)})`;
}
