"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Wrap any section. Children with [data-reveal] rise and fade once when 85% down the viewport.
 * Transform/opacity only. Reduced motion gets a short fade with no movement.
 */
export function Reveal({ children, className, id, as: Tag = "div" }: { children: ReactNode; className?: string; id?: string; as?: "div" | "section" }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const reduce = Boolean(ctx.conditions?.reduce);
          const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
          items.forEach((el) => {
            gsap.fromTo(
              el,
              // opacity (never visibility): a hidden element would drop out of the a11y tree and tab order
              reduce ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.985 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: reduce ? 0.35 : 1.15,
                ease: "expo.out",
                delay: Number(el.dataset.revealDelay ?? 0),
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
          });
        },
      );
      return () => mm.revert();
    },
    { scope },
  );

  const Comp = Tag as "div";
  return (
    <Comp ref={scope} className={className} id={id}>
      {children}
    </Comp>
  );
}
