import QRCode from "qrcode";

/**
 * Render a QR code as an SVG string on the server.
 * Dark modules on a light background scan most reliably, so the "ivory card" look is deliberate.
 */
export async function qrSvg(
  text: string,
  { dark = "#1a1207", light = "#f7f1e3", margin = 2, size = 320 }: { dark?: string; light?: string; margin?: number; size?: number } = {},
): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin,
    width: size,
    color: { dark, light },
  });
}

/** PNG data URL for the download button. */
export async function qrPngDataUrl(text: string, size = 1024): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#1a1207", light: "#f7f1e3" },
  });
}
