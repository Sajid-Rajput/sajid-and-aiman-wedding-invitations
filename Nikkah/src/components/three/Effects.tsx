"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/** Bloom + vignette + explicit ACES tone mapping. Mount only for quality "high". */
export function Effects({ mobile }: { mobile: boolean }) {
  return (
    <EffectComposer multisampling={mobile ? 0 : 4}>
      <Bloom mipmapBlur luminanceThreshold={0.75} luminanceSmoothing={0.2} intensity={mobile ? 0.7 : 0.95} radius={0.6} levels={mobile ? 5 : 7} />
      <Vignette eskil={false} offset={0.22} darkness={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
