"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/** Register ONCE at module scope (never inside effects: StrictMode would double-register). */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

/** Ignore the mobile URL-bar show/hide resize so pinned sections never jump. */
ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: "power3.out", duration: 0.9 });

/** Lenis needs lagSmoothing(0), so pause everything while the tab is hidden to avoid catch-up jumps. */
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
    document.documentElement.toggleAttribute("data-hidden", document.hidden);
  });
}

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as { __gsap: typeof gsap; __st: typeof ScrollTrigger }).__gsap = gsap;
  (window as unknown as { __gsap: typeof gsap; __st: typeof ScrollTrigger }).__st = ScrollTrigger;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
