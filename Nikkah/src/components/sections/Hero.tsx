"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { invite } from "@/content/invite";
import { scrollState } from "@/lib/scroll-state";
import { NastaliqWords } from "@/components/ui/NastaliqWords";
import { Sep } from "@/components/ui/Sep";
import { BISMILLAH_PATH, BISMILLAH_STROKES, BISMILLAH_VIEWBOX } from "@/content/bismillah-path";

/**
 * Hero copy lives in the DOM (LCP-friendly, crawlable) above the fixed 3D canvas.
 * The entrance plays when the gate opens (invite:open) or immediately if there is no gate.
 */
export function Hero({ gated }: { gated: boolean }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (st) => {
          scrollState.hero = st.progress;
        },
      });

      // Nastaliq fonts change line heights when they land; recompute trigger positions afterwards.
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        measure();
      });

      // The 3D lattice frames this box, so it has to know how tall the copy actually is.
      const copy = el.querySelector<HTMLElement>(".hero-copy");
      const measure = () => {
        if (!copy) return;
        const r = copy.getBoundingClientRect();
        // cy: how far the copy's centre sits below the viewport centre, so the lattice can centre on it.
        scrollState.copy = { w: r.width, h: r.height, vh: window.innerHeight, cy: r.top + r.height / 2 - window.innerHeight / 2 };
      };
      measure();
      const ro = new ResizeObserver(measure);
      if (copy) ro.observe(copy);

      // Let the 3D backdrop recede behind the content sections (dust stays faintly visible).
      const canvas = document.querySelector(".hero-canvas");
      if (canvas) {
        gsap.to(canvas, { opacity: 0.12, ease: "none", scrollTrigger: { trigger: el, start: "35% top", end: "bottom top", scrub: true } });
      }

      // Parallax the copy away as the hero scrolls out (transform only).
      if (!reduce) {
        gsap.to(".hero-copy", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true } });
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      // 3D entrance runs alongside the gate panels parting (read by HeroRig each frame).
      tl.to(scrollState, { intro: 1, duration: reduce ? 0.3 : 1.9, ease: "power2.out" }, 0);
      // Ink beat: a gold thread traces each glyph outline right-to-left while the fill floods behind it.
      tl.set(".hero-bismillah", { opacity: 1 })
        .from(".bismillah-ink", { drawSVG: "0%", duration: reduce ? 0.01 : 0.9, stagger: reduce ? 0 : 0.06, ease: "power1.inOut" }, 0)
        .fromTo(".bismillah-fill", { clipPath: "inset(-0.2em 0 -0.4em 100%)" }, { clipPath: "inset(-0.2em 0 -0.4em 0%)", duration: reduce ? 0.4 : 2.1, ease: "power2.inOut" }, reduce ? 0 : 0.35)
        .to(".bismillah-ink", { opacity: 0, duration: 0.8, ease: "sine.inOut" }, reduce ? 0.2 : 2.0)
        // The glow filter is applied only once the ink stops animating, so nothing re-rasterises per frame.
        .add(() => document.querySelector(".hero-bismillah")?.classList.add("is-lit"), reduce ? 0.3 : 2.6)
        .fromTo(".hero-glow", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.6 }, "-=1.2")
        .add(() => window.dispatchEvent(new CustomEvent("hero:words")), "-=0.7")
        .fromTo(".hero-flourish", { opacity: 0, scaleX: 0.15 }, { opacity: 1, scaleX: 1, duration: 1.1, stagger: 0.09, ease: "power2.out" }, "-=0.35")
        .fromTo(".hero-amp", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.6)" }, "+=0.5")
        .fromTo(".hero-latin", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, "+=0.3")
        .fromTo(".hero-date", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
        .fromTo(".hero-cue", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.5");

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };
      if (gated) {
        window.addEventListener("invite:open", play, { once: true });
        // Safety net for a gate that never reports — but only while the gate is actually gone,
        // otherwise a guest who simply has not tapped yet would have the entrance play behind it.
        let fallback = 0;
        const arm = () => {
          fallback = window.setTimeout(() => {
            if (document.documentElement.dataset.gate === "open") arm();
            else play();
          }, 9000);
        };
        arm();
        return () => {
          ro.disconnect();
          window.removeEventListener("invite:open", play);
          window.clearTimeout(fallback);
        };
      }
      play();
    },
    { scope, dependencies: [gated] },
  );

  return (
    <section ref={scope} className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-bismillah" role="img" aria-label={invite.bismillah}>
          {/* Inline so it can be gold-tinted and clip-path animated. */}
          <BismillahSvg />
        </div>
        <NastaliqWords as="h1" text={invite.title} className="hero-title ur-display-1 foil-text foil-shimmer" trigger={false} event="hero:words" delay={0} />
        <div className="hero-names">
          <div className="hero-name-row">
            <span className="hero-flourish" aria-hidden="true" />
            <NastaliqWords as="h2" text={invite.groom.name} className="hero-name ur-display-2 text-ivory" trigger={false} event="hero:words" delay={0.55} />
            <span className="hero-flourish" aria-hidden="true" />
          </div>
          <NastaliqWords as="p" text={invite.groom.parent} className="hero-parent ur-caption" trigger={false} event="hero:words" delay={0.8} />
          <p className="hero-amp" aria-hidden="true">
            <span className="wa-ornament" lang="ur">
              و
            </span>
          </p>
          <div className="hero-name-row">
            <span className="hero-flourish" aria-hidden="true" />
            <NastaliqWords as="h2" text={invite.bride.name} className="hero-name ur-display-2 text-ivory" trigger={false} event="hero:words" delay={1.0} />
            <span className="hero-flourish" aria-hidden="true" />
          </div>
          <NastaliqWords as="p" text={invite.bride.parent} className="hero-parent ur-caption" trigger={false} event="hero:words" delay={1.25} />
        </div>
        <p className="hero-latin lat-whisper text-gold-400" dir="ltr" lang="en">
          {invite.coupleLatin}
        </p>
        <p className="hero-date ur-title text-gold-300" lang="ur">
          {invite.when.day}، {invite.when.gregorian}
          <Sep />
          {invite.when.time}
        </p>
      </div>
      <a className="hero-cue" href="#details" lang="ur">
        <span className="ur-caption">{invite.ui.scroll}</span>
        <span className="hero-cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}

function BismillahSvg() {
  return (
    <svg viewBox={BISMILLAH_VIEWBOX} className="hero-bismillah-svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bismillah-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8c6d1f" />
          <stop offset="0.35" stopColor="#d4af37" />
          <stop offset="0.55" stopColor="#fff1c2" />
          <stop offset="0.75" stopColor="#d4af37" />
          <stop offset="1" stopColor="#8c6d1f" />
        </linearGradient>
      </defs>
      <g className="bismillah-fill">
        <path d={BISMILLAH_PATH} fill="url(#bismillah-gold)" />
      </g>
      <g className="bismillah-ink" fill="none" stroke="#ffe9b0" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        {BISMILLAH_STROKES.map((d, i) => (
          <path key={i} className="bismillah-ink" d={d} />
        ))}
      </g>
    </svg>
  );
}
