/** Shared types for the inline-SVG engineering-diagram system. */

export type Accent = 'clay' | 'sun' | 'sage';
export type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export interface Vec2 { x: number; y: number }

/** Screen-space explode axis direction unit vectors (dimetric, HTW=65 HTH=32). */
export type ExplodeAxis = 'iso-z' | 'iso-x' | 'iso-y';

export interface LegendItem { accent: Accent; labelKey: string }

export interface BomItem {
  n: number;
  labelKey: string;
  accent?: Accent;
}

export interface DiagramPart {
  id: string;
  bom: number;
  labelKey: string;
  /** Screen-space x of the part center in assembled state (no transform). */
  cx: number;
  /** Screen-space y of the part bottom-of-rhombus in assembled state. */
  cy: number;
  /** Box height in screen pixels (for isoBox calls). */
  boxH: number;
  /** Assembled SVG origin for isoBox(sx, sy, 0, 0, boxH). */
  sx: number;
  sy: number;
  /** Explode screen-space delta (px) from assembled to fully exploded. */
  exDx: number;
  exDy: number;
  accent?: Accent;
  specKey?: string;
  /** Part kind for special rendering. */
  kind: 'prism' | 'disc' | 'dome' | 'pod' | 'section';
}

export interface FlowPathSpec { d: string; accent: Accent }

export interface DiagramSpec {
  id: string;
  viewBox: string;
  dominantAccent: Accent;
  parts: DiagramPart[];
  flow?: FlowPathSpec;
}
