"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { invite } from "@/content/invite";

/**
 * Ar-Rum 30:21 written by an RTL ink wipe (clip-path, descender-safe), then the Urdu translation.
 * The verse is never split or scrambled: it is revealed whole, in reading direction.
 */
export function Verse() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce);
        const tl = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 75%", once: true } });
        tl.fromTo(".verse-eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 })
          .fromTo(
            ".verse-ar",
            { clipPath: "inset(-0.3em 0 -0.6em 100%)", opacity: 1 },
            { clipPath: "inset(-0.3em 0 -0.6em 0%)", duration: reduce ? 0.4 : 2.6, ease: "power2.inOut" },
            "-=0.3",
          )
          .to(".verse-ar", { backgroundPositionX: "-120%", duration: reduce ? 0.01 : 3.2, ease: "power1.inOut" }, "<")
          .fromTo(".verse-ur", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, "-=1.2")
          .fromTo(".verse-ref", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.5");
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="section verse">
      <div className="container narrow text-center">
        <p className="verse-eyebrow eyebrow" lang="ur">{invite.eyebrows.verse}</p>
        <div className="verse-wrap">
          <p className="verse-ar ar-verse text-gold-200" lang="ar">
            {invite.verse.arabic}
          </p>
        </div>
        <p className="verse-ur ur-body-lg text-ivory mt-6" lang="ur">
          {invite.verse.urdu}
        </p>
        <p className="verse-ref ur-caption mt-2" lang="ur">
          {invite.verse.ref}
        </p>
      </div>
    </section>
  );
}
