"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { Float } from "@react-three/drei";
import { SceneCanvas } from "./SceneCanvas";
import { Studio } from "./Studio";
import { GoldStar } from "./GoldStar";
import { GoldDust } from "./GoldDust";
import { FloatingStars } from "./FloatingStars";
import { HeroRig } from "./HeroRig";
import type { DeviceTier } from "@/hooks/useDeviceTier";

export default function HeroScene({ tier }: { tier: DeviceTier }) {
  return (
    <SceneCanvas tier={tier}>
      {(quality) => (
        <>
          <fog attach="fog" args={["#0b2a1f", 9, 20]} />
          <Studio />
          <spotLight position={[4, 6, 6]} intensity={28} angle={0.5} penumbra={1} color="#fff1c9" />
          <pointLight position={[-4, -2, 4]} intensity={9} color="#ffb84d" />
          <HeroRig>
            <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.5}>
              <GoldStar plate={false} />
            </Float>
          </HeroRig>
          <FloatingStars count={quality === "high" ? 16 : 8} />
          <GoldDust count={quality === "high" ? 650 : 280} />
        </>
      )}
    </SceneCanvas>
  );
}
