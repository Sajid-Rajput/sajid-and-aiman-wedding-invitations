"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

/**
 * Word-by-word rise for Urdu. NEVER split Nastaliq into characters: the cascading ligatures break.
 * Splits only after fonts are ready, then reverts to the original text node once the reveal ends.
 */
export function NastaliqWords({
  text,
  as = "h1",
  className,
  lang = "ur",
  delay = 0,
  stagger = 0.07,
  trigger = true,
  event,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  lang?: "ur" | "ar";
  delay?: number;
  stagger?: number;
  /** false = play immediately on mount instead of on scroll. */
  trigger?: boolean;
  /** Name of a window event that starts the reveal (used by the hero, which waits for the gate). */
  event?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let split: SplitText | undefined;
      let cancelled = false;
      // Latch: the event can fire before document.fonts.ready resolves (slow network), and a listener
      // attached afterwards would never hear it, leaving the words hidden forever.
      let fired = false;
      let start: (() => void) | undefined;
      const onEvent = () => {
        fired = true;
        start?.();
      };
      if (event) window.addEventListener(event, onEvent, { once: true });

      document.fonts.ready.then(() => {
        if (cancelled) return;
        split = SplitText.create(el, {
          type: "words",
          tag: "span",
          wordsClass: "ur-word",
          aria: "none",
          onSplit(self) {
            const tween = gsap.from(self.words, {
              yPercent: reduce ? 0 : 60,
              autoAlpha: 0,
              duration: reduce ? 0.4 : 1.1,
              ease: "power3.out",
              delay,
              stagger: { each: stagger, from: "start" },
              paused: Boolean(event),
              scrollTrigger: trigger && !event ? { trigger: el, start: "top 88%", once: true } : undefined,
              onComplete: () => self.revert(),
            });
            // The words are already hidden by the from() tween (immediate render), so the parent can show.
            gsap.set(el, { visibility: "visible" });
            if (event) {
              start = () => tween.play();
              if (fired) start();
            }
            return tween;
          },
        });
      });

      return () => {
        cancelled = true;
        if (event) window.removeEventListener(event, onEvent);
        split?.revert();
      };
    },
    { scope: ref },
  );

  // Hidden until the split runs so no un-animated flash appears before fonts are ready.
  const Tag = as as "p";
  return (
    <Tag ref={ref as React.RefObject<HTMLParagraphElement>} dir="rtl" lang={lang} className={className} style={event || !trigger ? { visibility: "hidden" } : undefined}>
      {text}
    </Tag>
  );
}
