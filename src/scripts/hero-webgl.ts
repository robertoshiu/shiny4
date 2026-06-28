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
uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_density;

const vec3 ESPRESSO = vec3(0.078, 0.063, 0.051);
const vec3 GOLD     = vec3(0.914, 0.765, 0.416);
const vec3 CLAY     = vec3(0.878, 0.478, 0.373);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p  = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  p   += u_mouse * 0.04;
  float r = length(p);

  // ── Diffraction rings ─────────────────────────────────────────────────────
  // Non-uniform spacing: quadratic subtraction compresses angular frequency at
  // large r, giving inner rings denser packing and outer rings sparser — the
  // character of silicon-wafer interference patterns.
  float rr    = r * 46.0 - r * r * 28.0;
  float rings = 0.5 + 0.5 * sin(rr - u_time * 1.1);
  rings       = pow(rings, 2.8);

  // Disc mask with ring-depth glow falloff:
  // Suppress the dead center (< r≈0.10) and attenuate toward the rim.
  // This peaks brightness at the mid-annulus, giving rings a sense of depth.
  float disc      = smoothstep(0.63, 0.56, r);
  float ringDepth = smoothstep(0.0, 0.10, r)
                  * smoothstep(0.62, 0.28, r);
  rings = rings * disc * (0.35 + 0.65 * ringDepth);

  // ── Ember dot-matrix ──────────────────────────────────────────────────────
  float gridN   = 42.0;
  vec2  g       = uv * gridN;
  vec2  cell    = floor(g);
  vec2  f       = fract(g) - 0.5;
  float dotMask = smoothstep(0.17, 0.09, length(f));
  float flicker = 0.55 + 0.45 * sin(u_time * 1.9 + hash(cell) * 6.2831);
  // Diagonal fade: dense bottom-left (foundry floor), sparse top-right.
  float diagFade = clamp(1.0 - (uv.x * 0.55 + uv.y * 0.45), 0.0, 1.0);
  // Sparse inside the wafer center where rings dominate; bloom out from r≈0.28.
  float emberRim = smoothstep(0.0, 0.28, r);
  float ember    = dotMask * flicker * diagFade * emberRim * 0.60 * u_density;

  // ── Color & central-bloom taming ──────────────────────────────────────────
  // Gold → Clay gradient based on radius.
  float ramp  = clamp(r * 1.8, 0.0, 1.0);
  vec3 accent = mix(GOLD, CLAY, ramp);

  // Near center, replace accent with a low-saturation warm umber so the core
  // reads "foundry ember" rather than piercing LED gold. Transition completes
  // at r ≈ 0.20; outer rings and dot field keep full accent chroma.
  float coreBlend = smoothstep(0.0, 0.20, r);
  vec3  mudAmber  = ESPRESSO + vec3(0.17, 0.08, 0.03);
  vec3  baseColor = mix(mudAmber, accent, coreBlend);

  float intensity = clamp(rings * 0.66 + ember, 0.0, 1.0);
  vec3  color     = ESPRESSO + baseColor * intensity;

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

  // Non-uniform ring radii (fractions of maxR): inner tighter, outer sparser.
  const RING_FRACS   = [0.14, 0.24, 0.35, 0.47, 0.60, 0.74, 0.88];
  // Ring depth opacity: dim at extremes, peaks at mid-annulus (index 3-4).
  const RING_OPACITY = [0.03, 0.06, 0.09, 0.10, 0.08, 0.05, 0.03];

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

    // Diffraction rings: non-uniform spacing, depth-based glow falloff.
    for (let i = 0; i < RING_FRACS.length; i++) {
      const rr   = RING_FRACS[i] * maxR;
      // Gentle pulse: ±30 % of base depth opacity.
      const a    = RING_OPACITY[i] * (0.70 + 0.30 * Math.sin(rr * 0.02 - t * 1.1));
      ctx!.beginPath();
      ctx!.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(233,196,106,${a})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    // Ember dot-matrix: diagonal fade + ember-rim (sparse near center).
    const step = Math.max(18, Math.floor(w / 42));
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        // Diagonal fade: dense bottom-left (uv.y=0 → y=h), sparse top-right.
        const ux   = x / w;
        const uy   = 1 - y / h; // flip: 0 at top in canvas
        const diag = Math.max(0, 1 - (ux * 0.55 + uy * 0.45));
        const flick = 0.55 + 0.45 * Math.sin(t * 1.9 + (x * 0.7 + y * 0.3));
        // Keep field sparse inside wafer center.
        const dist     = Math.hypot(x - cx, y - cy);
        const emberRim = Math.min(1, Math.max(0, dist / (maxR * 0.28)));
        const a = Math.max(0, diag * flick * 0.55 * density * emberRim);
        if (a <= 0.02) continue;
        const ramp = Math.min(1, (dist / maxR) * 1.8);
        const col  = ramp < 0.5 ? '233,196,106' : '224,122,95';
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
