"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { Environment, Lightformer } from "@react-three/drei";

/** Procedural studio lighting for gold: no HDR download, rendered once into a 256px env map. */
export function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="ring" intensity={4} color="#ffd9a0" scale={4} position={[0, 4, -4]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.5} color="#fff4d6" scale={[10, 2]} position={[0, 5, -3]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2} color="#ffe2a8" scale={[6, 1]} position={[-5, 1, 2]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.5} color="#ffd48a" scale={[6, 1]} position={[5, -1, 2]} rotation-y={-Math.PI / 2} />
      <Lightformer form="rect" intensity={1.2} color="#8bb6ff" scale={[6, 3]} position={[4, -2, 4]} target={[0, 0, 0]} />
      {/* Front fill so faces that mirror the camera side still read as warm gold, not black. */}
      <Lightformer form="rect" intensity={1.8} color="#ffe9c4" scale={[8, 4]} position={[0, 1.5, 7]} target={[0, 0, 0]} />
      <Lightformer form="circle" intensity={2.5} color="#fff3d0" scale={2.5} position={[-3, 3, 6]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.6} color="#0a3d2e" scale={[10, 10]} position={[0, -5, 0]} rotation-x={Math.PI / 2} />
    </Environment>
  );
}
