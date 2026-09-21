/**
 * Single source of truth for every fact about the Nikkah.
 * Change a value here and the whole site (countdown, calendar links,
 * .ics file, OG image, QR code, copy) updates together.
 */

export const TIMEZONE = "Asia/Karachi"; // UTC+05:00, Pakistan has no DST

/** Asr adhan (Hanafi, Karachi method) in Lahore on 16 Oct 2026 is 15:51 PKT; the nikkah follows the prayer. */
export const NIKKAH_ISO = "2026-10-16T15:51:00+05:00";
export const NIKKAH_DATE = new Date(NIKKAH_ISO);

/** Calendar event window: guests arrive before Asr, ceremony after; ends comfortably before Maghrib (17:30). */
export const EVENT_START_ISO = "2026-10-16T15:30:00+05:00";
export const EVENT_END_ISO = "2026-10-16T18:00:00+05:00";

export const HIJRI = {
  day: 5,
  monthUrdu: "جمادی الاوّل",
  monthEn: "Jumada al-Ula",
  year: 1448,
} as const;

export const COUPLE = {
  groom: { name: "Sajid Rajput", nameUrdu: "ساجد راجپوت", father: "Shahid Rajput", fatherUrdu: "شاہد راجپوت" },
  bride: { name: "Aiman Khan", nameUrdu: "ایمن خان", father: "Naeem Khan", fatherUrdu: "نعیم خان" },
} as const;

export const VENUE = {
  name: "Masjid-e-Quba",
  nameUrdu: "مسجدِ قبا",
  address: "Nasir Park, Tauheed Road, Lahore",
  addressUrdu: "ناصر پارک، توحید روڈ، لاہور",
  mapsUrl: "https://maps.app.goo.gl/zdASF1ejAdjwXm81A",
  /** The short link resolves to a dropped pin at these coordinates (verified 2026-09-20). */
  lat: 31.581038,
  lng: 74.293154,
} as const;

export const MAP_LINKS = {
  google: VENUE.mapsUrl,
  googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${VENUE.lat}%2C${VENUE.lng}&travelmode=driving`,
  apple: `https://maps.apple.com/place?coordinate=${VENUE.lat},${VENUE.lng}&name=${encodeURIComponent(VENUE.name)}`,
  /** Key-less embed; only mount on user request because it pulls ~1 MB of Maps JS. */
  embed: `https://maps.google.com/maps?q=${VENUE.lat},${VENUE.lng}&z=17&hl=ur&output=embed`,
} as const;

export const SITE = {
  /** Resolved and inlined by next.config.ts (NEXT_PUBLIC_SITE_URL, else the Vercel production/branch URL). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sajid-aiman-nikkah.vercel.app").replace(/\/$/, ""),
  titleUrdu: "تقریبِ نکاح — ساجد و ایمن",
  titleEn: "Nikkah of Sajid & Aiman",
  descriptionUrdu:
    "بروز جمعہ، ۱۶ اکتوبر ۲۰۲۶ء، بعد نمازِ عصر، مسجدِ قبا، ناصر پارک، توحید روڈ، لاہور",
  descriptionEn:
    "Friday, 16 October 2026, after Asr prayer, Masjid-e-Quba, Nasir Park, Tauheed Road, Lahore",
} as const;
