import { invite } from "@/content/invite";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "@/components/ui/Countdown";
import { CalendarButtons } from "@/components/ui/CalendarButtons";
import { DateNumeral } from "@/components/ui/DateNumeral";

/** Sixteen-ray shamsa (sunburst medallion) that turns once every two minutes behind the reels. */
function Shamsa() {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg className="shamsa" viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="78" strokeDasharray="2 3" />
        <circle cx="100" cy="100" r="58" />
        {rays.map((a) => (
          <g key={a} transform={`rotate(${a} 100 100)`}>
            <path d="M100 4 L104 22 L100 30 L96 22 Z" fill="currentColor" stroke="none" opacity="0.9" />
            <line x1="100" y1="32" x2="100" y2="42" />
          </g>
        ))}
        <rect x="70" y="70" width="60" height="60" transform="rotate(45 100 100)" />
        <rect x="70" y="70" width="60" height="60" />
      </g>
    </svg>
  );
}

export function Details() {
  return (
    <Reveal as="section" className="section">
      <div className="container narrow text-center">
        <h2 className="ur-display-2 text-gold-300" lang="ur" data-reveal>
          {invite.when.heading}
        </h2>

        <div className="card mihrab mt-10" data-reveal>
          <DateNumeral />
          <p className="ur-body text-ivory-muted mt-2" lang="ur">
            {invite.when.hijri} <span className="ur-caption">{invite.when.hijriNote}</span>
          </p>
          <div className="hairline mx-auto my-5 w-40" />
          <p className="ur-display-2 foil-text" lang="ur">
            {invite.when.time}
          </p>
          <p className="lat-whisper text-gold-400 mt-2" dir="ltr" lang="en">
            {invite.when.latin}
          </p>
        </div>

        <div className="mt-14" data-reveal>
          <h3 id="countdown-heading" className="ur-title text-ivory" lang="ur">
            {invite.countdown.heading}
          </h3>
          <div className="countdown-stage mt-2">
            <Shamsa />
            <Countdown />
          </div>
        </div>

        <div className="mt-12" data-reveal>
          <h3 className="ur-title text-ivory" lang="ur">
            {invite.calendar.heading}
          </h3>
          <CalendarButtons className="mt-4" />
          <p className="ur-caption mt-3" lang="ur">
            {invite.calendar.hint}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
