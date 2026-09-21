import { Gate } from "@/components/intro/Gate";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { Hero } from "@/components/sections/Hero";
import { Verse } from "@/components/sections/Verse";
import { Invitation } from "@/components/sections/Invitation";
import { Details } from "@/components/sections/Details";
import { Venue } from "@/components/sections/Venue";
import { Note } from "@/components/sections/Note";
import { Closing } from "@/components/sections/Closing";
import { GirihPattern } from "@/components/ui/GirihPattern";
import { EssentialsBar } from "@/components/ui/EssentialsBar";
import { AmbientSound } from "@/components/ui/AmbientSound";
import { Sep } from "@/components/ui/Sep";
import { invite } from "@/content/invite";

const IconWhatsapp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.15-1.35A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.3c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.27-4.44c0-4.58 3.73-8.3 8.31-8.3 2.22 0 4.3.87 5.87 2.44a8.24 8.24 0 0 1 2.43 5.87c0 4.58-3.73 8.29-8.25 8.29Zm4.55-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.12-.16.25-.64.81-.78.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);

export default function Page() {
  return (
    <>
      <Gate />
      <HeroCanvas />
      <main className="relative">
        <Hero gated />
        <div className="page-bg">
          <GirihPattern size={150} opacity={0.05} className="text-gold-500" />
          <div id="details">
            <Verse />
            <Invitation />
            <Details />
          </div>
          <Venue />
          <Note />
          <Closing />
          <footer className="section pt-0 text-center">
            <div className="hairline mx-auto mb-6 w-40" />
            <p className="ur-caption" lang="ur">
              {invite.ui.madeWith}
              <Sep />
              {invite.coupleShort}
            </p>
            <p className="footer-lat mt-2" dir="ltr" lang="en">
              {invite.ui.footerLatin}
            </p>
            {/* Kept deliberately quiet and set apart: it is a maker's note, not part of the invitation. */}
            <div className="footer-promo" data-nosnippet>
              <span lang="ur">{invite.ui.contactPrompt}</span>
              <a className="footer-promo-link" href={`tel:${invite.ui.contactTel}`} dir="ltr" lang="en">
                {invite.ui.contactNumber}
              </a>
              <a
                className="footer-promo-link"
                href={`https://wa.me/${invite.ui.contactWaNumber}?text=${encodeURIComponent(invite.ui.contactWaText)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={invite.ui.contactWhatsapp}
              >
                <IconWhatsapp />
              </a>
            </div>
          </footer>
        </div>
      </main>
      <EssentialsBar />
      <AmbientSound />
    </>
  );
}
