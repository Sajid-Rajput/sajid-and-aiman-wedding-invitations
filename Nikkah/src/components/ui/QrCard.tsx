import { qrSvg } from "@/lib/qr";
import { VENUE } from "@/config/event";
import { invite } from "@/content/invite";

/**
 * Server-rendered QR of the Google Maps link. Dark modules on ivory scan reliably;
 * the gold ornament stays on the frame, never on the modules or the quiet zone.
 */
export async function QrCard({ size = 220 }: { size?: number }) {
  const svg = await qrSvg(VENUE.mapsUrl, { size, margin: 3 });
  return (
    <figure className="qr-card" style={{ width: size + 32 }}>
      <div className="qr-frame">
        <div className="qr-inner" role="img" aria-label={invite.where.qrCaption} dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <figcaption className="ur-caption mt-3 text-center" lang="ur">
        {invite.where.qrCaption}
        <br />
        <a href="/qr.png" download="masjid-e-quba-map-qr.png" className="text-gold-400 underline-offset-4 hover:underline">
          {invite.where.qrDownload}
        </a>
      </figcaption>
    </figure>
  );
}
