"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { invite } from "@/content/invite";
import { MAP_LINKS } from "@/config/event";
import { Sep } from "@/components/ui/Sep";

/**
 * One thumb away on phones: date · time · venue and a route pill.
 * Appears once the hero has scrolled out; hides while the venue section or the closing actions are in view.
 */
export function EssentialsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const hero = document.querySelector(".hero");
      const venue = document.querySelector("#venue");
      const closing = document.querySelector("#closing");
      if (!hero) return;
      const state = { pastHero: false, inVenue: false, inClosing: false };
      const apply = () => {
        const show = state.pastHero && !state.inVenue && !state.inClosing;
        gsap.to(el, { yPercent: show ? 0 : 110, duration: 0.5, ease: "power3.out", overwrite: true });
        el.setAttribute("aria-hidden", show ? "false" : "true");
      };
      // GSAP owns the transform entirely (a stylesheet translateY would be read as a fixed px offset).
      gsap.set(el, { yPercent: 110, visibility: "visible" });
      ScrollTrigger.create({ trigger: hero, start: "bottom 65%", end: "max", onToggle: (st) => { state.pastHero = st.isActive; apply(); } });
      if (venue) ScrollTrigger.create({ trigger: venue, start: "top 85%", end: "bottom 15%", onToggle: (st) => { state.inVenue = st.isActive; apply(); } });
      if (closing) ScrollTrigger.create({ trigger: closing, start: "top 60%", end: "max", onToggle: (st) => { state.inClosing = st.isActive; apply(); } });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="essentials" aria-hidden="true">
      <p className="essentials-text" lang="ur">
        {invite.essentials.parts.map((part, i) => (
          <span key={part}>
            {i > 0 && <Sep />}
            {part}
          </span>
        ))}
      </p>
      <a className="btn-gold btn-primary" href={MAP_LINKS.googleDirections} target="_blank" rel="noopener noreferrer" lang="ur">
        {invite.essentials.route}
      </a>
    </div>
  );
}
