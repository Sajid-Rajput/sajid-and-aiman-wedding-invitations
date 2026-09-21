"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp3, dampE } from "maath/easing";
import type { Group } from "three";
import { scrollState } from "@/lib/scroll-state";

/** Must match the Canvas camera position in SceneCanvas. */
const CAMERA_Z = 8;
/** Widest point of the lattice at scale 1: the squares' corners (half-width 1.35, rotated 45°). */
const LATTICE_OUTER = 1.35 * Math.SQRT2;

/**
 * Drives the hero object from scroll (recedes and turns as the hero leaves)
 * and the camera from the pointer (gentle parallax). Reads mutable scroll state, never React state.
 */
export function HeroRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = scrollState.hero;
    const e = scrollState.intro; // 0 while the gate is sealed, eases to 1 as the panels part
    // The lattice must FRAME the copy, never cross it: size the ring from the measured copy box
    // (converted to world units) and keep it inside a sane range of the viewport.
    const { w, h, vh, cy } = scrollState.copy;
    const unitsPerPx = vh > 0 ? viewport.height / vh : 0;
    // The straight tube squares sit 1.35 units from the centre at scale 1, so they are what can cross
    // the words: keep that distance beyond the copy's half-extent, with clearance for the slow float
    // tilt, and compensate for the perspective shrink caused by pushing the group back in z.
    const portrait = viewport.width < viewport.height;
    const depth = portrait ? -1.2 : 0;
    const perspective = (CAMERA_Z - depth) / CAMERA_Z;
    // Portrait is a different problem from landscape. The copy is a tall, narrow column, and a ring
    // wide enough to girdle its full HEIGHT is far wider than the phone is across — the guest then
    // sees a few enormous tubes crossing the screen instead of a lattice. So frame the column's
    // width there, and cap against the narrow axis, which is what actually constrains the view.
    const extentPx = portrait ? w : Math.max(w, h);
    const halfExtent = unitsPerPx > 0 ? (extentPx / 2) * unitsPerPx * 1.28 * perspective : 0;
    // The lattice's widest point is the tilted squares' corners at 1.35 * sqrt(2), not the 1.75 torus
    // radius — and sitting at `depth` it shrinks by CAMERA_Z/(CAMERA_Z - depth). Size the portrait cap
    // from both so the whole figure lands inside 88% of the half-width, margin included.
    const maxBase = portrait
      ? (viewport.width * 0.5 * 0.88) / (LATTICE_OUTER / perspective)
      : (Math.max(viewport.width, viewport.height) * 1.25) / 1.75;
    const minBase = Math.min((Math.min(viewport.width, viewport.height) * 0.42) / 1.75, maxBase);
    const base = Math.min(Math.max(halfExtent / 1.35, minBase), maxBase);
    if (group.current) {
      // Centre the lattice on the copy, not on the viewport: the hero's padding is asymmetric, so a
      // viewport-centred ring would drop its lower edge straight through the date line.
      const centreY = unitsPerPx > 0 ? -cy * unitsPerPx : 0;
      damp3(group.current.position, [0, centreY - p * 1.4, depth - p * 7 - (1 - e) * 3], 0.45, dt);
      dampE(group.current.rotation, [p * 0.5, p * Math.PI * 0.55 - (1 - e) * 0.6, 0], 0.45, dt);
      const s = base * (1 - p * 0.35) * (0.72 + 0.28 * e);
      damp3(group.current.scale, [s, s, s], 0.45, dt);
    }
    damp3(state.camera.position, [state.pointer.x * 0.35, state.pointer.y * 0.22, CAMERA_Z], 0.6, dt);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}
