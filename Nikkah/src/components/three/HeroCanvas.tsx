"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { SceneBoundary } from "./SceneBoundary";

/** ssr:false is only legal inside a Client Component; the whole three.js graph lives in this lazy chunk. */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

export function HeroCanvas() {
  const tier = useDeviceTier();
  const [ready, setReady] = useState(false);

  // Fetch the three.js chunk during idle time (Safari lacks requestIdleCallback) — but never for guests
  // who will not see it — and mount only once the gate animation is over, so the shader compile never
  // competes with the opening or the first paint. The gate is shown on every load, so "invite:opened"
  // is always the signal; there is no skip-the-gate path to special-case.
  useEffect(() => {
    if (tier === "none") return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    let timer: number | undefined;
    const warm = () => {
      void import("./HeroScene");
    };
    if (w.requestIdleCallback) w.requestIdleCallback(warm, { timeout: 2500 });
    else timer = window.setTimeout(warm, 800);

    const go = () => setReady(true);
    window.addEventListener("invite:opened", go, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("invite:opened", go);
    };
  }, [tier]);

  return (
    <div className="hero-canvas" aria-hidden="true">
      <div className="hero-canvas-fallback" />
      {ready && tier !== "none" && (
        <SceneBoundary>
          <HeroScene tier={tier} />
        </SceneBoundary>
      )}
    </div>
  );
}
