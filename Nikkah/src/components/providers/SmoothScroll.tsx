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
 * Holds the page still behind the sealed gate. `html { overflow: hidden }` is no longer enough on
 * a phone: with syncTouch Lenis consumes the touchmove itself and scrolls its own way.
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
 * Smooth scrolling on every device. Phones get Lenis' touch sync too, tuned to stay close to the
 * platform feel — a short lerp and near-native inertia, so it eases the scroll without fighting the
 * thumb. Lenis honours prefers-reduced-motion itself.
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

const TOUCH = {
  autoRaf: false,
  anchors: true,
  smoothWheel: true,
  syncTouch: true,
  // Short lerp + a slightly damped inertia: smoothed, but the page still stops where the thumb expects.
  syncTouchLerp: 0.09,
  touchInertiaExponent: 1.6,
  touchMultiplier: 1.1,
  prevent,
} as const;

const FINE_POINTER = {
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
  const fine = useSyncExternalStore(subscribeFine, getFine, getFineServer);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <>
      {/* Keyed so switching pointer type (a tablet gaining a mouse) rebuilds the instance cleanly. */}
      <ReactLenis key={fine ? "fine" : "touch"} root ref={lenisRef} options={fine ? FINE_POINTER : TOUCH} />
      <ScrollTriggerBridge />
      <GateScrollLock />
      {children}
    </>
  );
}
