import { MAP_LINKS } from "@/config/event";
import { invite } from "@/content/invite";
import { QrCard } from "@/components/ui/QrCard";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";

/* Solid glyphs in currentColor, matching the calendar buttons' treatment. */

const IconRoute = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.2 20.6 20.9a.7.7 0 0 1-.95.9L12 17.9l-7.65 3.9a.7.7 0 0 1-.95-.9L12 2.2Z" />
  </svg>
);

const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.2c-3.9 0-7.1 3.2-7.1 7.1 0 5.3 7.1 12.5 7.1 12.5s7.1-7.2 7.1-12.5c0-3.9-3.2-7.1-7.1-7.1Zm0 9.7a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
  </svg>
);

const IconApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.54c-.02-2.69 2.2-3.98 2.3-4.05-1.25-1.83-3.2-2.08-3.89-2.1-1.65-.17-3.23.97-4.07.97-.84 0-2.13-.95-3.51-.93-1.8.03-3.47 1.05-4.4 2.67-1.87 3.25-.48 8.07 1.35 10.71.9 1.29 1.96 2.74 3.36 2.69 1.35-.06 1.86-.87 3.49-.87s2.09.87 3.51.84c1.45-.02 2.37-1.31 3.26-2.61 1.03-1.5 1.45-2.95 1.47-3.02-.03-.01-2.83-1.08-2.86-4.3Z" />
    <path d="M14.54 4.47c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.61-.69.8-1.29 2.07-1.13 3.29 1.2.1 2.42-.6 3.16-1.5Z" />
  </svg>
);

export function Venue() {
  return (
    <Reveal as="section" className="section" id="venue">
      <div className="container text-center">
        <h2 className="ur-display-2 text-gold-300" lang="ur" data-reveal>
          {invite.where.heading}
        </h2>
        <p className="ur-title text-ivory mt-6" lang="ur" data-reveal>
          {invite.where.name}
        </p>
        <p className="ur-body-lg text-ivory-muted" lang="ur" data-reveal>
          {invite.where.address}
        </p>
        <p className="lat-whisper text-gold-400 mt-1" dir="ltr" lang="en" data-reveal>
          {invite.where.latin}
        </p>

        <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]" data-reveal>
          <MapEmbed />
          <QrCard size={210} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3" data-reveal>
          <a className="btn-gold btn-primary" href={MAP_LINKS.googleDirections} target="_blank" rel="noopener noreferrer" lang="ur">
            <IconRoute />
            {invite.where.directions}
          </a>
          <a className="btn-gold" href={MAP_LINKS.google} target="_blank" rel="noopener noreferrer" lang="ur">
            <IconPin />
            {invite.where.openMap}
          </a>
          <a className="btn-gold" href={MAP_LINKS.apple} target="_blank" rel="noopener noreferrer" lang="ur">
            <IconApple />
            {invite.where.appleMaps}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
