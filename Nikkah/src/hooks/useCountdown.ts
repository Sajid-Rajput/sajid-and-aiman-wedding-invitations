"use client";
import { startTransition, useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  /** false until the first client tick so the server HTML and the first client render match. */
  ready: boolean;
  passed: boolean;
};

function compute(target: number, now: number): Countdown {
  const total = Math.max(0, target - now);
  const s = Math.floor(total / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    total,
    ready: true,
    passed: total === 0,
  };
}

const INITIAL: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, ready: false, passed: false };

/** Ticks once per second, aligned to the wall clock, and pauses while the tab is hidden. */
export function useCountdown(targetIso: string): Countdown {
  const [state, setState] = useState<Countdown>(INITIAL);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    let timer: number | undefined;

    const tick = () => {
      // startTransition keeps an outer Suspense boundary from flashing its fallback during hydration.
      startTransition(() => setState(compute(target, Date.now())));
      const delay = 1000 - (Date.now() % 1000);
      timer = window.setTimeout(tick, delay);
    };
    const onVisibility = () => {
      window.clearTimeout(timer);
      if (document.visibilityState === "visible") tick();
    };

    tick();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetIso]);

  return state;
}
