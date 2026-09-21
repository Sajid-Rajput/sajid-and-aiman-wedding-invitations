"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { invite } from "@/content/invite";
import { GirihPattern } from "@/components/ui/GirihPattern";
import { SEAL_DATA_URI } from "@/content/seal-data-uri";

/**
 * The sealed invitation. A tap breaks the gold seal and parts the two panels.
 * Dispatches "invite:open" on window so the hero can start its entrance.
 *
 * Deliberately not persisted: every load — including a refresh — starts sealed, so the
 * opening is the first thing a guest sees. (An earlier sessionStorage skip also broke
 * hydration, because the server snapshot said "not opened" on the first commit.)
 */
export function Gate() {
  const scope = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    document.documentElement.setAttribute("data-gate", "open");
    // A refresh restores the previous scroll offset, which would leave the page parked
    // mid-document behind the seal. The invitation always begins at the top.
    const restore = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {
      /* not supported: the scrollTo below still puts us back at the top */
    }
    window.scrollTo(0, 0);
    // Keep keyboard/screen-reader focus inside the dialog while the page behind it is covered.
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    return () => {
      document.documentElement.removeAttribute("data-gate");
      main?.removeAttribute("inert");
      try {
        history.scrollRestoration = restore;
      } catch {
        /* ignore */
      }
    };
  }, [closed]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const open = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (tlRef.current) return;
    const root = e.currentTarget.closest<HTMLElement>(".gate");
    const q = (sel: string) => root?.querySelectorAll(sel) ?? [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        document.documentElement.removeAttribute("data-gate");
        setClosed(true);
        // The 3D scene mounts here, so its shader compile never lands mid-animation.
        window.dispatchEvent(new CustomEvent("invite:opened"));
        // Layout is final now (fonts loaded, scroll unlocked): recompute every trigger position.
        ScrollTrigger.refresh();
      },
    });
    tlRef.current = tl;
    window.dispatchEvent(new CustomEvent("invite:open"));
    if (reduce) {
      tl.to(root, { autoAlpha: 0, duration: 0.5 });
      return;
    }
    tl.to(q(".gate-seal"), { scale: 1.12, rotate: 12, duration: 0.45, ease: "back.in(1.8)" })
      .to(q(".gate-seal"), { scale: 0.2, autoAlpha: 0, duration: 0.5, ease: "power3.in" }, "-=0.05")
      .to(q(".gate-text"), { autoAlpha: 0, y: -20, duration: 0.5 }, "<")
      .to(q(".gate-top"), { yPercent: -100, duration: 1.3 }, "-=0.15")
      .to(q(".gate-bottom"), { yPercent: 100, duration: 1.3 }, "<")
      .to(q(".gate-line"), { scaleX: 0, duration: 0.6 }, "<")
      .to(root, { autoAlpha: 0, duration: 0.3 }, "-=0.3");
  };

  if (closed) return null;

  return (
    <div ref={scope} className="gate" role="dialog" aria-modal="true" aria-label={invite.gate.line1}>
      <div className="gate-panel gate-top">
        <GirihPattern id="gate-girih-a" size={120} opacity={0.08} className="text-gold-500" />
      </div>
      <div className="gate-panel gate-bottom">
        <GirihPattern id="gate-girih-b" size={120} opacity={0.08} className="text-gold-500" />
      </div>
      <div className="gate-line" aria-hidden="true" />
      <div className="gate-center">
        <button type="button" className="gate-seal" onClick={open} aria-label={invite.gate.open} autoFocus>
          {/* A real <img> so the browser has a large, early LCP candidate while fonts are still loading.
              It is a 2 KB inline-style SVG, so next/image optimisation would add nothing. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SEAL_DATA_URI} alt="" width="200" height="200" className="gate-seal-img" fetchPriority="high" decoding="sync" />
        </button>
        <div className="gate-text">
          <p className="ur-title text-gold-300" lang="ur">
            {invite.gate.line1}
          </p>
        </div>
      </div>
    </div>
  );
}
