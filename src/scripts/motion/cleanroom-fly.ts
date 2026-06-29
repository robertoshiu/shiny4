/**
 * cleanroom-fly.ts
 * Canvas-2D true-perspective wireframe cleanroom fly-through.
 *
 * export initCleanroomFly(canvas, opts?) → { destroy(), setScroll(p) }
 *
 * Lifecycle mirrors hero-webgl.ts:
 *   prefersReducedMotion → no-op (caller must gate)
 *   DPR ≤ 2, IO pause offscreen, visibilitychange pause, resize.
 *
 * Scene: perspective wireframe 3D cleanroom bay with semantic layers.
 * Camera: scroll dolly + continuous forward drift + cursor yaw/pitch parallax.
 * Effects: depth fog, additive glow on accent edges (scan boost via 'lighter'),
 *          sweep scan plane that briefs crossing edges with sun→clay glow.
 */

import { prefersReducedMotion } from '../theme-motion';

export interface CleanroomFlyOptions {
  /** Overall glow intensity scale (<1 = dimmer, >1 = brighter). Default 1. */
  density?: number;
  /** Camera eye X offset in world units. Default 0 (centred on bay). */
  cameraX?: number;
  /** Camera eye Y height in world units. Default 2 (just above floor). */
  cameraY?: number;
  /** Additional world-Z offset added to the scrollProgress path. Default 0. */
  cameraZStart?: number;
  /** Focal-length multiplier: <1 = wider FOV, >1 = tighter. Default 1. */
  fovScale?: number;
  /** Continuous forward drift speed (world units/s). Default 2.5. */
  driftSpeed?: number;
  /** Scan-plane sweep speed (world units/s). Default 70. */
  scanSpeed?: number;
  /** Which accent layer receives a glow boost vs the other two. */
  accentEmphasis?: 'clay' | 'sun' | 'sage';
  /** World-Z range covered by scroll 0→1. Default 300. */
  scrollZDist?: number;
}
export interface CleanroomFlyHandle {
  destroy(): void;
  setScroll(progress: number): void;
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const C_BG        = '#14100D';
const C_INK_FAINT = '#6E6157';
const C_INK       = '#F2E9DE';
const C_CLAY      = '#E07A5F';
const C_SUN       = '#E9C46A';
const C_SAGE      = '#81A684';

// ── Types ─────────────────────────────────────────────────────────────────────
type V3 = readonly [number, number, number];
type Layer = 'ceiling' | 'floor' | 'shell' | 'tools' | 'wafers' | 'subfab' | 'dr';

interface SceneEdge {
  a: V3;
  b: V3;
  layer: Layer;
}

// ── Scene constants (world units) ─────────────────────────────────────────────
const BW  = 110;  // bay half-width     X: -BW..+BW
const TOP = 30;   // ceiling Y
const BOT = -32;  // raised-floor Y (sub-fab below)
const ZN  = 20;   // scene near Z
const ZF  = 560;  // scene far Z

// ── Scene builder ─────────────────────────────────────────────────────────────
function buildScene(): SceneEdge[] {
  const edges: SceneEdge[] = [];

  function e(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    layer: Layer,
  ): void {
    edges.push({ a: [ax, ay, az], b: [bx, by, bz], layer });
  }

  // ─── Ceiling grid ─────────────────────────────────────────────────────────
  const cXs = [-BW, -BW * 0.67, -BW * 0.33, 0, BW * 0.33, BW * 0.67, BW];
  const cZs = [30, 80, 130, 180, 230, 280, 330, 380, 430, 480, 530];
  for (const x of cXs) e(x, TOP, ZN, x, TOP, ZF, 'ceiling');
  for (const z of cZs) e(-BW, TOP, z, BW, TOP, z, 'ceiling');

  // ─── Floor grid ───────────────────────────────────────────────────────────
  for (const x of cXs) e(x, BOT, ZN, x, BOT, ZF, 'floor');
  for (const z of cZs) e(-BW, BOT, z, BW, BOT, z, 'floor');

  // ─── Shell: wall verticals + X-braces + overhead duct rails ───────────────
  const sZs = [30, 120, 210, 300, 390, 480];
  for (const z of sZs) {
    e(-BW, TOP, z, -BW, BOT, z, 'shell');
    e(BW,  TOP, z, BW,  BOT, z, 'shell');
  }
  for (let i = 0; i < sZs.length - 1; i++) {
    const z0 = sZs[i]!, z1 = sZs[i + 1]!;
    if (i % 2 === 0) { e(-BW, TOP, z0, -BW, BOT, z1, 'shell'); }
    else             { e(-BW, BOT, z0, -BW, TOP, z1, 'shell'); }
    if (i % 2 === 0) { e(BW, BOT, z0, BW, TOP, z1, 'shell'); }
    else             { e(BW, TOP, z0, BW, BOT, z1, 'shell'); }
  }
  for (const z of [60, 160, 260, 360, 460]) {
    e(-BW, TOP - 4, z, BW, TOP - 4, z, 'shell');
  }

  // ─── Tools: 6 process equipment boxes staggered left/right ───────────────
  const toolDefs = [
    { x: -60, z: 100, h: 50, w: 28, d: 22, type: 'litho'    },
    { x:  55, z: 160, h: 35, w: 28, d: 22, type: 'etch'     },
    { x: -60, z: 220, h: 42, w: 28, d: 22, type: 'cvd'      },
    { x:  55, z: 280, h: 27, w: 28, d: 22, type: 'efem'     },
    { x: -55, z: 340, h: 40, w: 28, d: 22, type: 'loadport' },
    { x:  55, z: 400, h: 46, w: 28, d: 22, type: 'foup'     },
  ] as const;

  for (const td of toolDefs) {
    const x0 = td.x - td.w / 2, x1 = td.x + td.w / 2;
    const y0 = BOT,             y1 = BOT + td.h;
    const z0 = td.z - td.d / 2, z1 = td.z + td.d / 2;
    const cx = td.x,             ty = y1;
    const cz = td.z;

    // 12-edge box
    e(x0,y0,z0, x1,y0,z0,'tools'); e(x1,y0,z0, x1,y0,z1,'tools');
    e(x1,y0,z1, x0,y0,z1,'tools'); e(x0,y0,z1, x0,y0,z0,'tools');
    e(x0,y1,z0, x1,y1,z0,'tools'); e(x1,y1,z0, x1,y1,z1,'tools');
    e(x1,y1,z1, x0,y1,z1,'tools'); e(x0,y1,z1, x0,y1,z0,'tools');
    e(x0,y0,z0, x0,y1,z0,'tools'); e(x1,y0,z0, x1,y1,z0,'tools');
    e(x1,y0,z1, x1,y1,z1,'tools'); e(x0,y0,z1, x0,y1,z1,'tools');

    // Type-specific detail edges
    if (td.type === 'litho') {
      e(cx, ty, cz, cx, ty + 16, cz, 'tools');       // mast
      e(cx - 8, ty + 8, cz, cx, ty + 15, cz, 'tools'); // left wing
      e(cx + 8, ty + 8, cz, cx, ty + 15, cz, 'tools'); // right wing
    } else if (td.type === 'etch') {
      e(cx - 9, ty, cz, cx - 5, ty + 9, cz, 'tools');
      e(cx - 5, ty + 9, cz, cx - 1, ty, cz, 'tools');
      e(cx + 2, ty, cz, cx + 6, ty + 9, cz, 'tools');
    } else if (td.type === 'cvd') {
      e(cx - 7, ty, cz, cx - 7, ty + 14, cz, 'tools');
      e(cx + 7, ty, cz, cx + 7, ty + 14, cz, 'tools');
      e(cx - 7, ty + 14, cz, cx + 7, ty + 14, cz, 'tools');
    } else if (td.type === 'efem') {
      e(cx, ty, cz, cx + 13, ty + 7, cz, 'tools');
      e(cx + 13, ty + 7, cz, cx + 13, ty + 15, cz, 'tools');
    } else if (td.type === 'loadport') {
      e(cx + 8, ty, cz, cx + 8, ty + 18, cz, 'tools');
      e(cx, ty + 10, cz, cx + 8, ty + 10, cz, 'tools');
    } else if (td.type === 'foup') {
      e(cx - 10, ty + 8,  cz, cx + 10, ty + 8,  cz, 'tools');
      e(cx - 10, ty + 16, cz, cx + 10, ty + 16, cz, 'tools');
      e(cx - 10, ty + 24, cz, cx + 10, ty + 24, cz, 'tools');
    }
  }

  // ─── Wafer flow: polyline threading all tools at Y = BOT+12 ──────────────
  const wY = BOT + 12;
  const wPts: V3[] = [
    [0,   wY, 30 ], [-60, wY, 100], [ 55, wY, 160],
    [-60, wY, 220], [ 55, wY, 280], [-55, wY, 340],
    [ 55, wY, 400], [  0, wY, 460],
  ];
  for (let i = 0; i < wPts.length - 1; i++) {
    const [ax, ay, az] = wPts[i]!;
    const [bx, by, bz] = wPts[i + 1]!;
    e(ax, ay, az, bx, by, bz, 'wafers');
  }

  // ─── Sub-fab: utility lines below raised floor ────────────────────────────
  e(-BW, BOT - 10, ZN, BW, BOT - 10, ZF, 'subfab');
  e(-BW, BOT - 16, ZN, BW, BOT - 16, ZF, 'subfab');
  e(-BW, BOT - 22, ZN, BW, BOT - 22, ZF, 'subfab');

  // ─── DR cage: far-right redundancy box ───────────────────────────────────
  const dx0 = 65, dx1 = BW - 5, dy1 = BOT + 55, dz0 = 390, dz1 = 480;
  e(dx0,BOT,dz0, dx1,BOT,dz0,'dr'); e(dx1,BOT,dz0, dx1,BOT,dz1,'dr');
  e(dx1,BOT,dz1, dx0,BOT,dz1,'dr'); e(dx0,BOT,dz1, dx0,BOT,dz0,'dr');
  e(dx0,dy1,dz0, dx1,dy1,dz0,'dr'); e(dx1,dy1,dz0, dx1,dy1,dz1,'dr');
  e(dx1,dy1,dz1, dx0,dy1,dz1,'dr'); e(dx0,dy1,dz1, dx0,dy1,dz0,'dr');
  e(dx0,BOT,dz0, dx0,dy1,dz0,'dr'); e(dx1,BOT,dz0, dx1,dy1,dz0,'dr');
  e(dx1,BOT,dz1, dx1,dy1,dz1,'dr'); e(dx0,BOT,dz1, dx0,dy1,dz1,'dr');

  return edges;
}

// ── Layer style config ────────────────────────────────────────────────────────
interface LayerStyle {
  color: string;
  baseAlpha: number;
  lw: number;     // CSS-pixel line width (multiplied by DPR at draw time)
  glow: boolean;
}
const LAYER_STYLE: Record<Layer, LayerStyle> = {
  ceiling: { color: C_INK_FAINT, baseAlpha: 0.55, lw: 0.8,  glow: false },
  floor:   { color: C_INK_FAINT, baseAlpha: 0.45, lw: 0.8,  glow: false },
  shell:   { color: C_INK_FAINT, baseAlpha: 0.60, lw: 0.9,  glow: false },
  tools:   { color: C_INK,       baseAlpha: 0.85, lw: 1.2,  glow: false },
  wafers:  { color: C_SUN,       baseAlpha: 0.90, lw: 1.8,  glow: true  },
  subfab:  { color: C_SAGE,      baseAlpha: 0.72, lw: 1.3,  glow: true  },
  dr:      { color: C_CLAY,      baseAlpha: 0.85, lw: 1.5,  glow: true  },
};

// ── Camera / rendering constants ──────────────────────────────────────────────
const NEAR_CLIP   = 5;      // min camera-space Z to accept
const FOG_START   = 55;     // camera-space Z where fog starts
const FOG_END     = 400;    // camera-space Z where fog is 100%
const SCROLL_ZDIST = 300;   // world Z covered by scroll 0→1
const DRIFT_SPEED  = 2.5;   // world units/s continuous drift
const SCAN_SPEED   = 70;    // world units/s scan plane sweep
const MAX_YAW      = 0.054; // ±~3.1° cursor yaw
const MAX_PITCH    = 0.035; // ±~2.0° cursor pitch
const CAM_Y        = 2;     // camera eye height (slightly above floor)

// ── Entry point ───────────────────────────────────────────────────────────────
export function initCleanroomFly(
  canvas: HTMLCanvasElement,
  opts: CleanroomFlyOptions = {},
): CleanroomFlyHandle {
  if (prefersReducedMotion()) return { destroy() {}, setScroll() {} };

  const ctxOrNull = canvas.getContext('2d', { alpha: false });
  if (!ctxOrNull) return { destroy() {}, setScroll() {} };
  const ctx: CanvasRenderingContext2D = ctxOrNull;

  type NavConn = { saveData?: boolean };
  const conn     = (navigator as unknown as { connection?: NavConn }).connection;
  const saveData = conn?.saveData ?? false;
  const glowScale = opts.density !== undefined ? Math.max(0.3, opts.density) : 1.0;

  // ── Per-variant camera + scene parameters ─────────────────────────────────
  const CAM_X_OPT    = opts.cameraX     ?? 0;
  const CAM_Y_OPT    = opts.cameraY     ?? CAM_Y;
  const CAM_Z_START  = opts.cameraZStart ?? 0;
  const FOV_SCALE    = opts.fovScale    ?? 1.0;
  const DRIFT_SPD    = opts.driftSpeed  ?? DRIFT_SPEED;
  const SCAN_SPD     = opts.scanSpeed   ?? SCAN_SPEED;
  const SCROLL_ZDIST_OPT = opts.scrollZDist ?? SCROLL_ZDIST;

  /** Per-layer glow boost based on accentEmphasis. */
  function accentBoost(layer: Layer): number {
    const em = opts.accentEmphasis;
    if (!em) return 1;
    const isAccent =
      (em === 'clay' && layer === 'dr')     ||
      (em === 'sun'  && layer === 'wafers') ||
      (em === 'sage' && layer === 'subfab');
    if (isAccent) return 1.85;
    if (layer === 'wafers' || layer === 'subfab' || layer === 'dr') return 0.65;
    return 1;
  }

  const SCENE = buildScene();

  // ── Viewport dims ──────────────────────────────────────────────────────────
  let cw = 0, ch = 0, csw = 0;  // device + CSS dimensions

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    csw = canvas.clientWidth  || window.innerWidth;
    const csh = canvas.clientHeight || window.innerHeight;
    const nw  = Math.floor(csw * dpr);
    const nh  = Math.floor(csh * dpr);
    if (nw !== cw || nh !== ch) {
      canvas.width  = nw;
      canvas.height = nh;
      cw = nw; ch = nh;
    }
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // ── Camera state ───────────────────────────────────────────────────────────
  const cam = { yaw: 0, pitch: 0 };
  const tgt = { yaw: 0, pitch: 0 };
  let scrollProgress = 0;
  let driftZ = 0;
  let scanZ  = ZN + 50;

  // ── Pointer tracking (rAF-throttled via cam lerp) ─────────────────────────
  function onPointer(e: PointerEvent): void {
    tgt.yaw   =  (e.clientX / window.innerWidth  - 0.5) * 2 * MAX_YAW;
    tgt.pitch = -(e.clientY / window.innerHeight - 0.5) * 2 * MAX_PITCH;
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  // ── rAF state ──────────────────────────────────────────────────────────────
  let running  = true;
  let raf      = 0;
  let last     = 0;
  const MIN_DT = saveData ? 1000 / 30 : 1000 / 60;

  // ── Render ──────────────────────────────────────────────────────────────────
  function frame(now: number): void {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < MIN_DT) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;

    // Smooth camera orientation toward pointer target
    cam.yaw   += (tgt.yaw   - cam.yaw)   * 0.05;
    cam.pitch += (tgt.pitch - cam.pitch) * 0.05;

    // Camera world-Z: scroll + slow forward drift
    driftZ += DRIFT_SPD * dt;
    const camZ = CAM_Z_START + scrollProgress * SCROLL_ZDIST_OPT + driftZ;

    // Scan plane: sweeps forward, resets when it outruns the visible scene
    scanZ += SCAN_SPD * dt;
    if (scanZ > camZ + FOG_END - 30) scanZ = camZ + ZN + 20;

    // Pre-compute per-frame trig + scale
    const dpr       = Math.min(window.devicePixelRatio || 1, 2);
    const focalDP   = csw * 0.364 * dpr * FOV_SCALE;  // focal length in device px; FOV_SCALE adjusts angle
    const ocx       = cw / 2;
    const ocy       = ch / 2;
    const cosYaw    = Math.cos(cam.yaw);
    const sinYaw    = Math.sin(cam.yaw);
    const cosPitch  = Math.cos(cam.pitch);
    const sinPitch  = Math.sin(cam.pitch);

    // Perspective projection (camera-space: +Z = forward)
    function project(p: V3): [number, number, number] | null {
      const dx = p[0] - CAM_X_OPT;
      const dy = p[1] - CAM_Y_OPT;
      const dz = p[2] - camZ;

      // Yaw rotation around Y
      const rx =  dx * cosYaw + dz * sinYaw;
      const ry =  dy;
      const rz = -dx * sinYaw + dz * cosYaw;

      // Pitch rotation around X
      const pyR = ry * cosPitch - rz * sinPitch;
      const pzR = ry * sinPitch + rz * cosPitch;

      if (pzR < NEAR_CLIP) return null;

      return [
        ocx + focalDP * rx   / pzR,
        ocy - focalDP * pyR  / pzR,
        pzR,
      ];
    }

    // Project all edges, build renderable list
    interface RE {
      ax: number; ay: number;
      bx: number; by: number;
      camDepth: number;   // for fog + painter's sort
      wMidZ:   number;    // for scan plane test
      layer: Layer;
    }
    const rEdges: RE[] = [];
    for (const edge of SCENE) {
      const pa = project(edge.a);
      const pb = project(edge.b);
      if (!pa || !pb) continue;
      rEdges.push({
        ax: pa[0], ay: pa[1],
        bx: pb[0], by: pb[1],
        camDepth: (pa[2] + pb[2]) * 0.5,
        wMidZ:   (edge.a[2] + edge.b[2]) * 0.5,
        layer: edge.layer,
      });
    }

    // Painter's sort: far → near
    rEdges.sort((a, b) => b.camDepth - a.camDepth);

    // Clear
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, cw, ch);

    // Reset composite/shadow before drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;

    for (const re of rEdges) {
      const s = LAYER_STYLE[re.layer];

      // Depth fog: bright near → invisible far
      const fogT  = Math.max(0, Math.min(1, (re.camDepth - FOG_START) / (FOG_END - FOG_START)));
      const alpha = s.baseAlpha * (1 - fogT * 0.93);
      if (alpha < 0.013) continue;

      // Scan plane boost: edges within ±28 world units of scan plane are brightened
      const scanDist  = Math.abs(re.wMidZ - scanZ);
      const scanBoost = scanDist < 28 ? (1 - scanDist / 28) * 0.85 : 0;

      const lw = s.lw * dpr;

      if (s.glow && !saveData) {
        const glowAlpha = Math.min(1, alpha * glowScale * accentBoost(re.layer));

        // Scan-intersect pass: additive 'lighter' composite for a hot flash
        if (scanBoost > 0.05) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.shadowBlur  = (10 + scanBoost * 16) * dpr;
          ctx.shadowColor = s.color;
          ctx.strokeStyle = s.color;
          ctx.lineWidth   = lw * (1 + scanBoost * 0.7);
          ctx.globalAlpha = Math.min(1, (glowAlpha + scanBoost * 0.55) * 0.65);
          ctx.beginPath();
          ctx.moveTo(re.ax, re.ay);
          ctx.lineTo(re.bx, re.by);
          ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        }

        // Always-on ambient glow (source-over)
        ctx.shadowBlur  = 7 * dpr * glowScale;
        ctx.shadowColor = s.color;
        ctx.strokeStyle = s.color;
        ctx.lineWidth   = lw;
        ctx.globalAlpha = Math.min(1, glowAlpha + scanBoost * 0.32);
        ctx.beginPath();
        ctx.moveTo(re.ax, re.ay);
        ctx.lineTo(re.bx, re.by);
        ctx.stroke();
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;

      } else {
        // Non-glow edge (ceiling / floor / shell / tools)
        ctx.strokeStyle = s.color;
        ctx.lineWidth   = lw;
        ctx.globalAlpha = Math.min(1, alpha + scanBoost * 0.22);
        ctx.beginPath();
        ctx.moveTo(re.ax, re.ay);
        ctx.lineTo(re.bx, re.by);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Ensure clean state for next frame
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    ctx.globalCompositeOperation = 'source-over';
  }

  raf = requestAnimationFrame(frame);

  // ── IO: pause when canvas element is offscreen ─────────────────────────────
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      }
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  // ── Tab visibility pause ────────────────────────────────────────────────────
  function onVis(): void {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      raf = requestAnimationFrame(frame);
    }
  }
  document.addEventListener('visibilitychange', onVis);

  // ── Handle ─────────────────────────────────────────────────────────────────
  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
    },
    setScroll(progress: number) {
      scrollProgress = Math.max(0, Math.min(1, progress));
    },
  };
}
