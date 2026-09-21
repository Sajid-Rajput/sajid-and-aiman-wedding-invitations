"use client";
"use no memo"; // imperative three.js loops mutate memoised objects; React Compiler memoisation is not wanted here
// Side-effect import: must run before the first <Canvas> builds its root store. See the file for why.
import "@/lib/three-console";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import type { DeviceTier } from "@/hooks/useDeviceTier";
import { Effects } from "./Effects";

/** Stops rendering while the tab is hidden or the hero has scrolled away. */
function VisibilityPause() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let tabVisible = document.visibilityState === "visible";
    let inView = true;
    const apply = () => setFrameloop(tabVisible && inView ? "always" : "never");
    const onVis = () => {
      tabVisible = document.visibilityState === "visible";
      apply();
    };
    // The canvas itself is position:fixed and therefore always intersecting — watch the hero section,
    // which is the only thing the scene decorates.
    const target = document.querySelector(".hero") ?? gl.domElement;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        apply();
      },
      { threshold: 0 },
    );
    io.observe(target);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      setFrameloop("always");
    };
  }, [gl, setFrameloop]);
  return null;
}

export type Quality = "low" | "high";

/**
 * One persistent Canvas for the whole page (iOS leaks WebGL contexts on remount).
 * Tiering: dpr and post-processing adapt from the device tier and live FPS.
 */
export function SceneCanvas({ tier, children }: { tier: DeviceTier; children: (quality: Quality) => ReactNode }) {
  const mobile = tier !== "high";
  // Client-only component (loaded with ssr:false), so window exists on first render.
  const [dpr, setDpr] = useState(() => Math.min(tier === "high" ? 2 : 1.5, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1));
  // Phones start cheap and are promoted by PerformanceMonitor only if the frame budget allows it.
  const [quality, setQuality] = useState<Quality>(tier === "high" ? "high" : "low");
  // iOS sometimes loses the WebGL context when Safari is backgrounded and never restores it; remount once.
  const [epoch, setEpoch] = useState(0);

  return (
    <Canvas
      key={epoch}
      dpr={dpr}
      frameloop="always"
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 0, 8] }}
      // antialias cannot change after the context exists: decide from the tier, not the live quality
      gl={{ antialias: tier !== "low", alpha: true, powerPreference: mobile ? "default" : "high-performance", stencil: false }}
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        const el = gl.domElement;
        let restoreTimer: number | undefined;
        el.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          restoreTimer = window.setTimeout(() => setEpoch((n) => n + 1), 1500);
        });
        el.addEventListener("webglcontextrestored", () => window.clearTimeout(restoreTimer));
      }}
      fallback={null}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor
        bounds={(refreshRate) => (refreshRate > 90 ? [50, 90] : [38, 60])}
        flipflops={3}
        onIncline={() => {
          setDpr(Math.min(mobile ? 1.5 : 2, window.devicePixelRatio || 1));
          if (tier !== "low") setQuality("high");
        }}
        onDecline={() => setDpr(1)}
        onFallback={() => {
          setDpr(1);
          setQuality("low");
        }}
      />
      <VisibilityPause />
      <Suspense fallback={null}>
        {children(quality)}
        <Preload all />
      </Suspense>
      {quality === "high" && <Effects mobile={mobile} />}
    </Canvas>
  );
}
