"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/random";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSpread;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * aSpeed + uSpread * 0.5, uSpread) - uSpread * 0.5;
    p.x += sin(uTime * 0.35 + aPhase) * 0.18;
    p.z += cos(uTime * 0.28 + aPhase) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * 1.7 + aPhase * 3.0);
    vAlpha = twinkle * smoothstep(-uSpread * 0.5, -uSpread * 0.3, p.y) * smoothstep(uSpread * 0.5, uSpread * 0.3, p.y);
    gl_PointSize = aSize * uPixelRatio * (70.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.05, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.25;
    float a = (core + glow) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/** Soft golden motes drifting upward. One draw call, no textures, attenuates with depth. */
export function GoldDust({ count = 900, spread = 10 }: { count?: number; spread?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const rnd = seeded(2026);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() - 0.5) * spread * 1.4;
      positions[i * 3 + 1] = (rnd() - 0.5) * spread;
      positions[i * 3 + 2] = (rnd() - 0.5) * spread * 0.8 - 1.5;
      const r = rnd();
      sizes[i] = r < 0.9 ? 0.35 + rnd() * 0.6 : 1.1 + rnd() * 1.2;
      speeds[i] = 0.06 + rnd() * 0.16;
      phases[i] = rnd() * Math.PI * 2;
    }
    return { positions, sizes, speeds, phases };
  }, [count, spread]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSpread: { value: spread },
      uColor: { value: new THREE.Color("#ffd98a") },
    }),
    [spread],
  );

  useFrame(({ clock, gl }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
