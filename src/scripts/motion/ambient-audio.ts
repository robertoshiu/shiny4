/**
 * ambient-audio.ts — Synthesized "foundry hum" ambient soundscape.
 *
 * Purely synthetic — no audio files required.
 * Audio graph:
 *   • Drone 1: 55Hz sine oscillator (power-hum fundamental)
 *   • Drone 2: 82.5Hz triangle oscillator (soft upper harmonic)
 *   • Noise shimmer: white-noise buffer → band-pass (220Hz, Q=1.4) → gain
 *   • LFO: 0.07Hz sine modulating masterGain for a slow breathing feel
 *   • Master gain rests at 0.06 (very low); LFO adds ±0.015
 *
 * Behavior:
 *  - OFF by default. User opts in via the toggle button (#ambient-audio-toggle).
 *  - AudioContext is created ONLY on first toggle-on (browser autoplay policy).
 *  - Preference saved/restored via localStorage ('pref_ambient_audio').
 *  - Idempotent: safe to call initAmbientAudio() on every astro:page-load.
 *    On re-calls, only the toggle button binding is refreshed.
 *  - Under prefers-reduced-motion: audio NEVER auto-starts. The user may still
 *    opt in via the toggle — that is their explicit choice, not auto-play.
 *  - Survives View Transitions: the AudioContext and audio graph are kept alive
 *    across navigations (module-level singletons).
 */

import { prefersReducedMotion } from '../theme-motion';

const PREF_KEY      = 'pref_ambient_audio';
const RESTING_GAIN  = 0.06;   // master gain when "on" (very quiet)
const FADE_S        = 0.6;    // 600 ms fade in / fade out

// Module-level singletons: survive Astro View Transition DOM swaps.
let audioCtx:   AudioContext | null = null;
let masterGain: GainNode     | null = null;
let isOn        = false;
let initialized = false;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Call once from astro:page-load (BaseLayout bootstrap).
 * First call: reads saved pref, binds toggle, schedules auto-start if pref='on'.
 * Subsequent calls: re-binds toggle button defensively (footer is transition:persist
 * so the node survives, but the flag guards against double-binding).
 */
export function initAmbientAudio(): void {
  if (initialized) {
    bindToggleButton(); // defensive re-bind
    return;
  }
  initialized = true;

  // Restore saved preference
  try {
    const saved = localStorage.getItem(PREF_KEY);
    if (saved === 'on') isOn = true;
  } catch (_) { /* storage may be unavailable */ }

  bindToggleButton();

  // If pref is "on", we need a user gesture to start (browser autoplay policy).
  // Register a one-time gesture listener to auto-resume after page load.
  // Honor prefers-reduced-motion: do not auto-arm a saved 'on' pref; the user
  // must explicitly toggle. (The toggle itself still works under reduced-motion.)
  if (isOn && !prefersReducedMotion()) {
    scheduleAutoStart();
  }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Register a one-time gesture handler to start audio (browser policy). */
function scheduleAutoStart(): void {
  const handler = () => {
    if (isOn) startAudio(); // guard: pref might have flipped before gesture fires
  };
  document.addEventListener('click',   handler, { once: true, passive: true });
  document.addEventListener('keydown', handler, { once: true });
}

/** Bind click handler to the toggle button (idempotent via data attribute). */
function bindToggleButton(): void {
  const btn = document.getElementById('ambient-audio-toggle') as HTMLButtonElement | null;
  if (!btn) return;
  // Use a data attribute as the "already bound" flag so it survives TS cast issues
  if (btn.dataset.audioBound) return;
  btn.dataset.audioBound = 'true';
  btn.addEventListener('click', onToggle);
  updateToggleUI(); // sync visual state to current isOn value
}

function onToggle(): void {
  isOn = !isOn;
  savePref();
  updateToggleUI();
  if (isOn) {
    startAudio();
  } else {
    stopAudio();
  }
}

function updateToggleUI(): void {
  const btn = document.getElementById('ambient-audio-toggle') as HTMLButtonElement | null;
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(isOn));
  btn.classList.toggle('is-on', isOn);
}

function savePref(): void {
  try {
    localStorage.setItem(PREF_KEY, isOn ? 'on' : 'off');
  } catch (_) { /* ignore storage errors */ }
}

/** Fade master gain up to RESTING_GAIN, creating AudioContext on first call. */
function startAudio(): void {
  if (!audioCtx) buildAudioGraph();
  const ctx = audioCtx;
  if (!ctx || !masterGain) return;

  // Resume if browser suspended (e.g., tab was backgrounded)
  if (ctx.state === 'suspended') void ctx.resume();

  const now = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(RESTING_GAIN, now + FADE_S);
}

/** Fade master gain down to silence. Does not destroy the AudioContext. */
function stopAudio(): void {
  const ctx = audioCtx;
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0, now + FADE_S);
}

/**
 * Build the synthesized audio graph.
 * Called once on the first toggle-on; the graph persists for the page session.
 */
function buildAudioGraph(): void {
  try {
    audioCtx = new AudioContext({ sampleRate: 44100 });
  } catch (_) {
    return; // AudioContext not available (e.g., some non-standard browsers)
  }
  const ctx = audioCtx;

  // Master gain — starts at 0; startAudio() ramps it to RESTING_GAIN
  masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  // ── Drone 1: 55 Hz sine (foundry power-hum fundamental) ──────────────────
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 55;
  const gain1 = ctx.createGain();
  gain1.gain.value = 0.55;
  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc1.start();

  // ── Drone 2: 82.5 Hz triangle (soft 3rd harmonic, lower amplitude) ───────
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = 82.5;
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.28;
  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start();

  // ── Noise shimmer: white noise buffer → band-pass filter ─────────────────
  // 2-second looped buffer to avoid repetition artifacts at short loops.
  const bufLen   = Math.round(ctx.sampleRate * 2);
  const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data     = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.18; // attenuated white noise
  }

  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  noiseSrc.loop   = true;

  // Band-pass centred at 220 Hz with moderate Q for a warm, airy shimmer
  const bpFilter = ctx.createBiquadFilter();
  bpFilter.type            = 'bandpass';
  bpFilter.frequency.value = 220;
  bpFilter.Q.value         = 1.4;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.1; // shimmer is subtle under the drones

  noiseSrc.connect(bpFilter);
  bpFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSrc.start();

  // ── LFO: 0.07 Hz sine → master gain modulation ("breathing") ─────────────
  // Final gain = scheduled_value + lfo_output → ranges RESTING_GAIN ± 0.015
  const lfo     = ctx.createOscillator();
  lfo.type            = 'sine';
  lfo.frequency.value = 0.07; // ~14-second breathing cycle

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.015; // ±0.015 modulation depth

  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain); // additive modulation on the AudioParam
  lfo.start();
}
