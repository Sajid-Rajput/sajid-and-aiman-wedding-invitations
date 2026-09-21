"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { goldSoft } from "./materials";
import { seeded } from "@/lib/random";

/** Small gold 8-point stars drifting in depth. One instanced draw call. */
function rubElHizbShape(R = 1) {
  const inner = Math.sqrt(2 - Math.SQRT2);
  const s = new THREE.Shape();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? R : R * inner;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export function FloatingStars({ count = 14 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(rubElHizbShape(0.16), { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 4 });
    g.center();
    return g;
  }, []);
  const seeds = useMemo(() => {
    const rnd = seeded(1448);
    return Array.from({ length: count }, (_, i) => ({
      x: (rnd() - 0.5) * 10,
      y: (rnd() - 0.5) * 6.5,
      z: -1 - rnd() * 4,
      s: 0.35 + rnd() * 0.75,
      rot: rnd() * Math.PI,
      speed: 0.15 + rnd() * 0.25,
      phase: i * 0.7,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    seeds.forEach((p, i) => {
      dummy.position.set(p.x + Math.sin(t * 0.2 + p.phase) * 0.3, p.y + Math.sin(t * p.speed + p.phase) * 0.35, p.z);
      dummy.rotation.set(Math.sin(t * 0.3 + p.phase) * 0.4, t * 0.15 + p.phase, p.rot + t * 0.05);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, goldSoft, count]} frustumCulled={false} />;
}
