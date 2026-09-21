"use client";
import { useMemo } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { toUrduDigits } from "@/lib/urdu";
import { NIKKAH_ISO } from "@/config/event";
import { invite } from "@/content/invite";

/** Latin digits, like the day numeral: the Urdu ۶ is drawn with the ٦ stroke and reads as a 7. */
const REEL = Array.from({ length: 10 }, (_, i) => String(i));

/** One digit column: a 10-glyph track slid by translateY. Transform-only. */
function Reel({ value }: { value: number }) {
  return (
    <span className="reel" aria-hidden="true">
      <span className="reel-track" style={{ transform: `translate3d(0, ${-value * 10}%, 0)` }}>
        {REEL.map((d) => (
          <span key={d} className="reel-digit">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function Unit({ value, label, width = 2 }: { value: number; label: string; width?: number }) {
  const digits = String(value).padStart(width, "0").split("").map(Number);
  return (
    <div className="unit">
      {/* LTR so the most-significant reel sits on the left, like a printed number inside RTL text */}
      <div className="reels" dir="ltr">
        {digits.map((d, i) => (
          <Reel key={i} value={d} />
        ))}
      </div>
      <span className="unit-label" lang="ur">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ className }: { className?: string }) {
  const t = useCountdown(NIKKAH_ISO);
  const live = useMemo(
    () => (t.ready ? `${toUrduDigits(t.days)} دن، ${toUrduDigits(t.hours)} گھنٹے، ${toUrduDigits(t.minutes)} منٹ باقی` : ""),
    [t.ready, t.days, t.hours, t.minutes],
  );

  if (t.ready && t.passed) {
    return (
      <p className={`ur-display-2 foil-text ${className ?? ""}`} lang="ur">
        {invite.countdown.zero}
      </p>
    );
  }

  return (
    <div className={`countdown ${className ?? ""}`} role="timer" aria-labelledby="countdown-heading" data-ready={t.ready}>
      {/* read on demand, never announced: a per-minute live region is unusable with a screen reader */}
      <p className="sr-only">{live}</p>
      <div className="units" dir="rtl" aria-hidden="true">
        <Unit value={t.days} label={invite.countdown.units.days} width={t.days >= 100 ? 3 : 2} />
        <Unit value={t.hours} label={invite.countdown.units.hours} />
        <Unit value={t.minutes} label={invite.countdown.units.minutes} />
        <Unit value={t.seconds} label={invite.countdown.units.seconds} />
      </div>
    </div>
  );
}
