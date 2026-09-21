"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { invite } from "@/content/invite";
import { createAmbientTone, type AmbientTone } from "@/lib/ambient-tone";

/** Drop a file at either path to replace the generated tone. See public/audio/README.md. */
const TRACKS = ["/audio/nasheed.webm", "/audio/nasheed.m4a"] as const;
const STORAGE_KEY = "invite:muted";

const IconSound = ({ muted }: { muted: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" fill="currentColor" stroke="none" />
    {muted ? (
      <path d="m16.5 9.5 4 5m0-5-4 5" />
    ) : (
      <>
        <path d="M15.6 9.2a3.8 3.8 0 0 1 0 5.6" />
        <path d="M18.3 6.8a7.3 7.3 0 0 1 0 10.4" />
      </>
    )}
  </svg>
);

/**
 * Background sound for the opened invitation.
 *
 * Starts inside the seal tap — the gesture browsers require before audio may play — and fades in
 * behind the gate animation. A guest's mute choice is remembered for the session, and playback
 * stops whenever the tab is hidden so nothing sings on in a background tab.
 *
 * Prefers a real nasheed at /audio/; falls back to the generated tone when none is published.
 */
export function AmbientSound() {
  const [armed, setArmed] = useState(false);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const tone = useRef<AmbientTone | null>(null);
  const fade = useRef<number | undefined>(undefined);

  // --- element-based playback, used when a real track is published ---
  const fadeAudio = useCallback((el: HTMLAudioElement, to: number, ms: number) => {
    window.clearInterval(fade.current);
    const from = el.volume;
    const start = performance.now();
    fade.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      el.volume = from + (to - from) * t;
      if (t === 1) {
        window.clearInterval(fade.current);
        if (to === 0) el.pause();
      }
    }, 50);
  }, []);

  const play = useCallback(() => {
    if (audio.current) {
      audio.current.volume = 0;
      // The published track is mastered to -19 LUFS, so it needs most of the headroom to sit
      // audibly behind the page; the generated tone sets its own level instead.
      void audio.current.play().then(() => fadeAudio(audio.current!, 0.8, 3000)).catch(() => {});
      return;
    }
    if (!ctx.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx.current = new Ctor();
      tone.current = createAmbientTone(ctx.current);
    }
    void ctx.current.resume();
    tone.current?.start();
  }, [fadeAudio]);

  const pause = useCallback(() => {
    if (audio.current) fadeAudio(audio.current, 0, 700);
    else tone.current?.stop();
  }, [fadeAudio]);

  // Decide the source and start, both inside the tap that opens the seal.
  useEffect(() => {
    const onOpen = () => {
      setArmed(true);
      let wanted = false;
      try {
        wanted = sessionStorage.getItem(STORAGE_KEY) !== "1";
      } catch {
        wanted = true;
      }
      setMuted(!wanted);
      if (!wanted) return;

      // On a metered or 2G connection the generated tone costs nothing, so never pull the track.
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      if (conn?.saveData === true || /(^|-)2g$/.test(conn?.effectiveType ?? "")) {
        play();
        return;
      }

      // Probe for a published track. The element is created up front so that .play() below still
      // counts as gesture-initiated; if nothing is there we fall through to the generated tone.
      const el = new Audio();
      const source = TRACKS.find((t) => el.canPlayType(t.endsWith(".webm") ? "audio/webm" : "audio/mp4") !== "");
      if (!source) {
        play();
        return;
      }
      el.src = source;
      el.loop = true;
      el.preload = "auto";
      el.addEventListener(
        "canplay",
        () => {
          audio.current = el;
          play();
        },
        { once: true },
      );
      // 404 or an undecodable file: quietly use the tone instead.
      el.addEventListener("error", () => play(), { once: true });
      el.load();
    };

    window.addEventListener("invite:open", onOpen, { once: true });
    return () => window.removeEventListener("invite:open", onOpen);
  }, [play]);

  // Never keep singing in a tab the guest has left.
  useEffect(() => {
    if (!armed || muted) return;
    const onVis = () => (document.visibilityState === "visible" ? play() : pause());
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [armed, muted, play, pause]);

  useEffect(
    () => () => {
      window.clearInterval(fade.current);
      audio.current?.pause();
      tone.current?.dispose();
      void ctx.current?.close();
    },
    [],
  );

  if (!armed) return null;

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* private mode: the choice simply is not remembered */
    }
    if (next) pause();
    else play();
  };

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? invite.ui.musicOn : invite.ui.musicOff}
      title={muted ? invite.ui.musicOn : invite.ui.musicOff}
    >
      <IconSound muted={muted} />
      <span className="sound-toggle-label" lang="ur">
        {invite.ui.music}
      </span>
    </button>
  );
}
