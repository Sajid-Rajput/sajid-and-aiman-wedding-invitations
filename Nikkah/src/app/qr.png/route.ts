import QRCode from "qrcode";
import { VENUE } from "@/config/event";

/** Downloadable PNG of the map QR, generated at build time. */
export const dynamic = "force-static";

export async function GET() {
  const buffer = await QRCode.toBuffer(VENUE.mapsUrl, {
    errorCorrectionLevel: "M",
    margin: 4,
    width: 1024,
    color: { dark: "#1a1206", light: "#f7f1e3" },
  });
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="masjid-e-quba-map-qr.png"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
