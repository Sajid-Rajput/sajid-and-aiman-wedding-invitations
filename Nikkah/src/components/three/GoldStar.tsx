"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A gold 8-pointed Islamic star (Rub el Hizb) built as a wire lattice of thin tubes,
 * plus a filled inner octagram plate. Fully procedural: no models, no textures.
 */
function starPoints(outer: number, inner: number, points = 8): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  return pts;
}

function squareEdges(size: number, rotation: number): [THREE.Vector3, THREE.Vector3][] {
  const c = [
    new THREE.Vector3(-size, -size, 0),
    new THREE.Vector3(size, -size, 0),
    new THREE.Vector3(size, size, 0),
    new THREE.Vector3(-size, size, 0),
  ].map((v) => v.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotation));
  return [
    [c[0], c[1]],
    [c[1], c[2]],
    [c[2], c[3]],
    [c[3], c[0]],
  ];
}

export function GoldStar({ scale = 1, plate = true }: { scale?: number; plate?: boolean }) {
  const group = useRef<THREE.Group>(null);

  const { tubes, plateGeo, ring } = useMemo(() => {
    // Two overlapping squares (rotated 45°) form the classic Rub el Hizb outline.
    const edges = [...squareEdges(1.35, 0), ...squareEdges(1.35, Math.PI / 4)];
    const tubeGeos = edges.map(([a, b]) => new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 1, 0.028, 12, false));

    const shape = new THREE.Shape(starPoints(0.95, 0.42));
    const hole = new THREE.Path(starPoints(0.62, 0.27).reverse());
    shape.holes.push(hole);
    const plateGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
    plateGeo.center();

    const ringGeo = new THREE.TorusGeometry(1.75, 0.02, 12, 128);
    return { tubes: tubeGeos, plateGeo, ring: ringGeo };
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.22;
    group.current.rotation.x = Math.cos(t * 0.2) * 0.08;
    group.current.rotation.z = t * 0.04;
  });

  const gold = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#ffd166", metalness: 1, roughness: 0.18, clearcoat: 0.8, clearcoatRoughness: 0.2, envMapIntensity: 2.2 }),
    [],
  );
  const goldDeep = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#e0aa3e", metalness: 1, roughness: 0.28, clearcoat: 0.5, envMapIntensity: 2.0 }),
    [],
  );

  return (
    <group ref={group} scale={scale}>
      {tubes.map((g, i) => (
        <mesh key={i} geometry={g} material={gold} />
      ))}
      {plate && <mesh geometry={plateGeo} material={goldDeep} />}
      <mesh geometry={ring} material={gold} rotation={[0, 0, 0]} />
    </group>
  );
}
