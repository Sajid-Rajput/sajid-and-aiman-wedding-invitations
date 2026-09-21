/**
 * Scroll progress shared between DOM (GSAP ScrollTrigger writes) and the 3D scene (useFrame reads).
 * Mutable on purpose: pushing scroll through React state would re-render 60x/s.
 */
export const scrollState = {
  /** 0..1 across the whole page. */
  progress: 0,
  /** px/s from ScrollTrigger.getVelocity(). */
  velocity: 0,
  /** 0..1 progress of the hero section leaving the viewport. */
  hero: 0,
  /** 0..1 entrance of the 3D scene as the gate opens (tweened by GSAP). */
  intro: 0,
  /** Hero copy box in CSS px, measured by Hero on resize; the lattice sizes itself to frame it. */
  copy: { w: 0, h: 0, vh: 0, cy: 0 },
};
