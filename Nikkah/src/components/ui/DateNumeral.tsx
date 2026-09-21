"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { invite } from "@/content/invite";

/** The day as an editorial numeral: foil 16 wiping up from its baseline, month and year beside it.
 *  Latin digits on purpose — see the .date-num note in globals.css. */
export function DateNumeral() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 82%", once: true } });
      tl.fromTo(".date-num", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(-0.1em 0 -0.15em 0)", duration: reduce ? 0.3 : 1.3, ease: "expo.out" })
        .fromTo(".date-num", { backgroundPositionX: "120%" }, { backgroundPositionX: "-120%", duration: reduce ? 0.01 : 2.4, ease: "power1.inOut" }, "-=0.8")
        .fromTo(".date-rest > *", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.12 }, "-=2.2");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="date-row" dir="rtl">
      <span className="date-num foil-text" lang="en" dir="ltr" aria-hidden="true">
        {invite.when.dayNum}
      </span>
      <span className="date-rest">
        <span className="ur-display-2 text-ivory" lang="ur">
          {invite.when.monthYear}
        </span>
        <span className="ur-title text-gold-300" lang="ur">
          {invite.when.day}
        </span>
      </span>
      <span className="sr-only" lang="ur">
        {invite.when.day}، {invite.when.gregorian}
      </span>
    </div>
  );
}
