"use client";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Keeps ScrollTrigger in the same frame as Lenis (avoids the one-frame lag on scrubbed animations). */
function ScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/**
 * Smooth wheel scrolling on fine-pointer devices only. Phones keep the native compositor scroll,
 * which is what WhatsApp guests expect and what performs best. Lenis honours prefers-reduced-motion itself.
 */
const FINE = "(hover: hover) and (pointer: fine)";
const subscribeFine = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getFine = () => window.matchMedia(FINE).matches;
const getFineServer = () => false;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const enabled = useSyncExternalStore(subscribeFine, getFine, getFineServer);

  useEffect(() => {
    if (!enabled) return;
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [enabled]);

  return (
    <>
      {enabled && (
        <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, duration: 1.2, smoothWheel: true, syncTouch: false, anchors: true }} />
      )}
      {enabled && <ScrollTriggerBridge />}
      {children}
    </>
  );
}
