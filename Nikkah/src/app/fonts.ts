import { Amiri_Quran, Reem_Kufi, Cormorant_Garamond, Cinzel } from "next/font/google";
import localFont from "next/font/local";

/**
 * All families are OFL and self-hosted by next/font at build time (no runtime Google request).
 * Total ≈ 390 KB WOFF2; only the Nastaliq face is preloaded because it is the LCP text.
 */
/**
 * Noto Nastaliq Urdu (OFL), variable 400–700, subset at build time to the characters this site renders
 * (scripts/subset-fonts.mjs runs as `prebuild`). Preloaded: it is the LCP typeface.
 */
export const nastaliq = localFont({
  src: "./fonts/NotoNastaliqUrdu-subset.woff2",
  weight: "400 700",
  display: "swap",
  preload: true,
  variable: "--font-nastaliq",
  adjustFontFallback: false,
  // iOS/macOS ship Noto Nastaliq Urdu, so iPhones render true Nastaliq before the web font lands.
  fallback: ["Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "serif"],
});

export const amiriQuran = Amiri_Quran({
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
  variable: "--font-quran",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Amiri", "Scheherazade New", "serif"],
});

export const kufi = Reem_Kufi({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-reem",
  preload: false,
  adjustFontFallback: false,
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
  preload: false,
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
  preload: false,
});

export const fontVariables = [nastaliq.variable, amiriQuran.variable, kufi.variable, cormorant.variable, cinzel.variable].join(" ");
