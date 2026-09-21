import { invite } from "@/content/invite";
import { GirihPattern } from "@/components/ui/GirihPattern";
import { BISMILLAH_PATH, BISMILLAH_VIEWBOX } from "@/content/bismillah-path";

/**
 * Static 1200×630 card used to render the WhatsApp/OG preview image (scripts/og.mjs screenshots it).
 * Satori cannot shape Urdu correctly, so the image is produced by a real browser instead.
 */
export default function OgCard() {
  return (
    <div
      className="relative overflow-hidden text-center"
      style={{ width: 1200, height: 630, background: "radial-gradient(120% 90% at 50% 0%, #103a2c 0%, #071b14 50%, #04110c 100%)" }}
    >
      <GirihPattern size={130} opacity={0.09} className="text-gold-500" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(45% 45% at 50% 45%, rgba(201,162,74,0.16), transparent 70%)" }} />
      {/* Gold khatam frame */}
      <svg className="absolute inset-0" viewBox="0 0 1200 630" aria-hidden="true">
        <defs>
          <linearGradient id="og-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7a5e24" />
            <stop offset="0.5" stopColor="#ebd9a3" />
            <stop offset="1" stopColor="#a5823a" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#og-gold)" strokeWidth="2.2" opacity="0.9">
          <rect x="360" y="75" width="480" height="480" transform="rotate(45 600 315)" />
          <rect x="360" y="75" width="480" height="480" />
          <circle cx="600" cy="315" r="300" strokeWidth="1.4" opacity="0.8" />
        </g>
        <rect x="18" y="18" width="1164" height="594" fill="none" stroke="url(#og-gold)" strokeWidth="1.5" opacity="0.7" />
        <rect x="28" y="28" width="1144" height="574" fill="none" stroke="url(#og-gold)" strokeWidth="0.8" opacity="0.5" />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-center" style={{ paddingTop: 12 }}>
        <svg viewBox={BISMILLAH_VIEWBOX} style={{ width: 300, height: "auto" }} aria-hidden="true">
          <path d={BISMILLAH_PATH} fill="#ebd9a3" />
        </svg>
        <p className="lat-label" style={{ color: "#c9a24a", marginTop: 6 }}>{invite.titleLatin}</p>
        <p className="foil-text" lang="ur" style={{ fontFamily: "var(--font-ur)", fontSize: 78, lineHeight: 1.6, fontWeight: 600, marginTop: -6 }}>
          {invite.title}
        </p>
        <p lang="ur" style={{ fontFamily: "var(--font-ur)", fontSize: 44, lineHeight: 1.5, color: "#f3eada", marginTop: -4 }}>
          {invite.groom.name} <span style={{ color: "#c9a24a" }}>و</span> {invite.bride.name}
        </p>
        <p className="lat-whisper" style={{ color: "#d9be6e", fontSize: 24, marginTop: 4 }} dir="ltr">
          {invite.coupleLatin}
        </p>
        <p lang="ur" style={{ fontFamily: "var(--font-ur)", fontSize: 26, lineHeight: 1.9, color: "#ebd9a3", marginTop: 6 }}>
          {invite.when.day}، {invite.when.gregorian}
          <span style={{ fontFamily: "var(--font-latin)", color: "#a5823a", padding: "0 0.5em", fontSize: "0.8em" }}>·</span>
          {invite.when.time}
        </p>
        <p lang="ur" style={{ fontFamily: "var(--font-ur)", fontSize: 22, lineHeight: 1.8, color: "#c9bda4" }}>
          {invite.where.name}، {invite.where.address}
        </p>
      </div>
    </div>
  );
}
