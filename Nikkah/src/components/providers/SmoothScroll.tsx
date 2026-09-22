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
 * Holds Lenis still behind the sealed gate, and puts it back at the top when the gate opens, so its
 * internal position can never disagree with the page the guest is shown.
 * useLenis (not the ref) because the instance is only created in ReactLenis' own effect.
 */
function GateScrollLock() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (document.documentElement.getAttribute("data-gate") === "open") lenis.stop();
    const start = () => {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    };
    window.addEventListener("invite:opened", start);
    return () => window.removeEventListener("invite:opened", start);
  }, [lenis]);
  return null;
}

/**
 * Smooth wheel scrolling on fine-pointer devices only. Phones keep the native compositor scroll,
 * which is what WhatsApp guests expect and what performs best. Lenis honours prefers-reduced-motion itself.
 *
 * Touch sync was tried on 2026-09-22 and reverted the same day: even at a short lerp it does not
 * feel good under a thumb. Do not re-enable it without testing on a real phone first.
 */
const FINE = "(hover: hover) and (pointer: fine)";
const subscribeFine = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getFine = () => window.matchMedia(FINE).matches;
const getFineServer = () => false;

/** Native scroll is left alone inside anything that scrolls on its own (the map iframe, long lists). */
const prevent = (node: HTMLElement) => node.tagName === "IFRAME" || node.hasAttribute("data-lenis-prevent");

const OPTIONS = {
  autoRaf: false,
  anchors: true,
  smoothWheel: true,
  syncTouch: false,
  lerp: 0.1,
  duration: 1.2,
  prevent,
} as const;

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
      {enabled && <ReactLenis root ref={lenisRef} options={OPTIONS} />}
      {enabled && <ScrollTriggerBridge />}
      {enabled && <GateScrollLock />}
      {children}
    </>
  );
}
