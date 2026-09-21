/**
 * A generated ambience for the invitation: a warm drone with slow bell tones drifting over it.
 *
 * This is the fallback used until a real nasheed is dropped into public/audio/ (see the README
 * there). It is deliberately sparse and quiet — atmosphere behind the page, never a performance.
 *
 * The pitches come from Hijaz on D (D, E♭, F♯, G, A, B♭), the maqam most associated with the
 * region's devotional music, so the colour sits with the rest of the design rather than sounding
 * like a western pad.
 */

const HIJAZ_D = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 587.33];

export type AmbientTone = {
  /** Fade up to the target level. */
  start: (fade?: number) => void;
  /** Fade down to silence; the graph keeps running until dispose(). */
  stop: (fade?: number) => void;
  dispose: () => void;
};

export function createAmbientTone(ctx: AudioContext, level = 0.09): AmbientTone {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // A short feedback delay stands in for reverb: no impulse response to download.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.38;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.34;
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(master);

  // ---- drone: a root and its fifth, detuned just enough to breathe ----
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 620;
  droneFilter.Q.value = 0.6;
  droneFilter.connect(master);

  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.32;
  droneGain.connect(droneFilter);

  const drones = [146.83, 220.0, 147.6].map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 2 ? "sine" : "triangle";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = i === 2 ? 0.18 : 0.3;
    osc.connect(g).connect(droneGain);
    osc.start();
    return osc;
  });

  // Slow swell so the drone never sits perfectly still.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.055;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.12;
  lfo.connect(lfoDepth).connect(droneGain.gain);
  lfo.start();

  // ---- bells: one struck note every few seconds, decaying long ----
  let timer: number | undefined;
  let lastIndex = -1;

  const strike = () => {
    const now = ctx.currentTime;
    // Avoid repeating the same pitch twice running.
    let i = Math.floor(Math.random() * HIJAZ_D.length);
    if (i === lastIndex) i = (i + 1) % HIJAZ_D.length;
    lastIndex = i;
    const freq = HIJAZ_D[i];

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    // A quiet octave above gives the strike its glint.
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = freq * 2;

    const g = ctx.createGain();
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.22;

    const peak = 0.16 + Math.random() * 0.06;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

    osc.connect(g);
    shimmer.connect(shimmerGain).connect(g);
    g.connect(master);
    g.connect(delay);

    osc.start(now);
    shimmer.start(now);
    osc.stop(now + 4.4);
    shimmer.stop(now + 4.4);
    osc.onended = () => {
      g.disconnect();
      shimmerGain.disconnect();
    };

    timer = window.setTimeout(strike, 3800 + Math.random() * 4200);
  };

  let running = false;

  return {
    start(fade = 3) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(level, now + fade);
      if (!running) {
        running = true;
        timer = window.setTimeout(strike, 1200);
      }
    },
    stop(fade = 1.2) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + fade);
    },
    dispose() {
      running = false;
      window.clearTimeout(timer);
      try {
        drones.forEach((o) => o.stop());
        lfo.stop();
      } catch {
        /* already stopped */
      }
      master.disconnect();
    },
  };
}
