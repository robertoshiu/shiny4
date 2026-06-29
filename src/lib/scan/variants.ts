/**
 * scan/variants.ts — per-page ScanField variant configuration.
 *
 * One entry per page. 'technology' is the pilot canvas fly-through;
 * the other 6 pages reuse the same engine with distinct camera framings.
 */

/** Canvas fly-through engine options (mirrors CleanroomFlyOptions in cleanroom-fly.ts). */
export interface VariantFlyOpts {
  density?: number;
  cameraX?: number;
  cameraY?: number;
  cameraZStart?: number;
  fovScale?: number;
  driftSpeed?: number;
  scanSpeed?: number;
  accentEmphasis?: 'clay' | 'sun' | 'sage';
  scrollZDist?: number;
}

export interface ScanVariantConfig {
  id: string;
  /** Axis along which the scan beam sweeps */
  scanAxis: 'vertical' | 'horizontal';
  /** Which tri-accent token is most visually prominent */
  accentEmphasis: 'clay' | 'sun' | 'sage';
  /** Parallax multipliers and limits per depth plane */
  parallax: {
    /** Far plane (ceiling/FFU): fraction of cursor max */
    ceilingFactor: number;
    /** Mid plane (shell/floor): fraction of cursor max */
    shellFactor: number;
    /** Near plane (tools/accents): fraction of cursor max */
    toolsFactor: number;
    /** Max cursor-driven translate in px (desktop only) */
    cursorMaxPx: number;
    /** Scroll-driven translate in px per scroll-px (far plane) */
    scrollFarPxPerScrollPx: number;
  };
  /** Overall SVG field opacity (0–1) */
  fieldOpacity: number;
  /** Periodic scan-sweep interval in ms (0 = disabled) */
  sweepIntervalMs: number;
  /** Canvas engine config overrides (camera, density, accent, etc.) */
  flyOpts?: VariantFlyOpts;
}

export const SCAN_VARIANTS: Record<string, ScanVariantConfig> = {
  /** home — wide establishing fly-over of the whole bay, balanced accents, subdued behind ember hero */
  home: {
    id: 'home',
    scanAxis: 'vertical',
    accentEmphasis: 'sun',
    parallax: {
      ceilingFactor: 0.25,
      shellFactor:   0.5,
      toolsFactor:   0.75,
      cursorMaxPx:   28,
      scrollFarPxPerScrollPx: 0.05,
    },
    fieldOpacity: 0.50,
    sweepIntervalMs: 7000,
    flyOpts: {
      cameraY:    18,
      cameraX:    0,
      fovScale:   0.78,
      driftSpeed: 1.2,
      density:    0.64,
      scrollZDist: 200,
    },
  },

  /** about — sub-fab / facility shell angle, looking across from lower-left, sage+clay */
  about: {
    id: 'about',
    scanAxis: 'vertical',
    accentEmphasis: 'sage',
    parallax: {
      ceilingFactor: 0.3,
      shellFactor:   0.6,
      toolsFactor:   0.85,
      cursorMaxPx:   30,
      scrollFarPxPerScrollPx: 0.055,
    },
    fieldOpacity: 0.60,
    sweepIntervalMs: 6000,
    flyOpts: {
      cameraY:       -22,
      cameraX:       -45,
      fovScale:       0.88,
      driftSpeed:     1.6,
      density:        0.75,
      accentEmphasis: 'sage',
      scrollZDist:    260,
    },
  },

  /** solutions — process-tool line foregrounded, wafer-flow path leads, sun (throughput) */
  solutions: {
    id: 'solutions',
    scanAxis: 'vertical',
    accentEmphasis: 'sun',
    parallax: {
      ceilingFactor: 0.3,
      shellFactor:   0.6,
      toolsFactor:   0.88,
      cursorMaxPx:   32,
      scrollFarPxPerScrollPx: 0.06,
    },
    fieldOpacity: 0.65,
    sweepIntervalMs: 5000,
    flyOpts: {
      cameraY:        -10,
      cameraX:       -55,
      fovScale:       1.15,
      driftSpeed:     2.2,
      density:        0.90,
      accentEmphasis: 'sun',
      scanSpeed:      85,
      scrollZDist:    300,
    },
  },

  /** technology — bay cutaway reference view (existing pilot, unchanged framing) */
  technology: {
    id: 'technology',
    scanAxis: 'vertical',
    accentEmphasis: 'sun',
    parallax: {
      ceilingFactor: 0.3,
      shellFactor:   0.6,
      toolsFactor:   0.85,
      cursorMaxPx:   32,
      scrollFarPxPerScrollPx: 0.06,
    },
    fieldOpacity: 0.62,
    sweepIntervalMs: 5000,
    flyOpts: {
      cameraY:        2,
      cameraX:        0,
      fovScale:       1.0,
      driftSpeed:     2.5,
      density:        1.0,
      accentEmphasis: 'sun',
      scrollZDist:    300,
    },
  },

  /** methodology — gate/flow lines + process-ladder emphasis, deliberate pace, sage (governance) */
  methodology: {
    id: 'methodology',
    scanAxis: 'vertical',
    accentEmphasis: 'sage',
    parallax: {
      ceilingFactor: 0.28,
      shellFactor:   0.56,
      toolsFactor:   0.80,
      cursorMaxPx:   30,
      scrollFarPxPerScrollPx: 0.052,
    },
    fieldOpacity: 0.58,
    sweepIntervalMs: 6500,
    flyOpts: {
      cameraY:        -8,
      cameraX:        25,
      fovScale:       1.05,
      driftSpeed:     1.0,
      density:        0.82,
      accentEmphasis: 'sage',
      scanSpeed:      45,
      scrollZDist:    280,
    },
  },

  /** careers — lattice/grid matrix (ceiling emphasis), energetic drift, sun (growth) */
  careers: {
    id: 'careers',
    scanAxis: 'vertical',
    accentEmphasis: 'sun',
    parallax: {
      ceilingFactor: 0.35,
      shellFactor:   0.65,
      toolsFactor:   0.90,
      cursorMaxPx:   34,
      scrollFarPxPerScrollPx: 0.065,
    },
    fieldOpacity: 0.64,
    sweepIntervalMs: 4500,
    flyOpts: {
      cameraY:        22,
      cameraX:        20,
      fovScale:       0.82,
      driftSpeed:     3.5,
      density:        1.05,
      accentEmphasis: 'sun',
      scrollZDist:    340,
    },
  },

  /** contact — sparse routing / HUD-coordinate corner framing, sun/clay, minimal density */
  contact: {
    id: 'contact',
    scanAxis: 'vertical',
    accentEmphasis: 'sun',
    parallax: {
      ceilingFactor: 0.22,
      shellFactor:   0.45,
      toolsFactor:   0.70,
      cursorMaxPx:   24,
      scrollFarPxPerScrollPx: 0.04,
    },
    fieldOpacity: 0.50,
    sweepIntervalMs: 8000,
    flyOpts: {
      cameraY:        6,
      cameraX:        60,
      fovScale:       0.92,
      driftSpeed:     0.7,
      density:        0.52,
      accentEmphasis: 'sun',
      scrollZDist:    180,
    },
  },
};

/** Get a variant config, falling back to technology if unknown. */
export function getVariant(id: string): ScanVariantConfig {
  return SCAN_VARIANTS[id] ?? SCAN_VARIANTS['technology']!;
}
