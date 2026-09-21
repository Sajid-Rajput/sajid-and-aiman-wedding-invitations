/** Extended Arabic-Indic digits used for Urdu (۰۱۲۳۴۵۶۷۸۹). */
const URDU_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/** Convert every ASCII digit in a string or number to Urdu digits. Deterministic, no Intl dependency. */
export function toUrduDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => URDU_DIGITS[Number(d)]);
}

/** Zero-pad then convert, e.g. pad2(7) => "۰۷". */
export function urduPad2(n: number): string {
  return toUrduDigits(String(Math.max(0, Math.floor(n))).padStart(2, "0"));
}

/** Urdu month names for Gregorian dates as used on Pakistani invitation cards. */
export const URDU_MONTHS = [
  "جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون",
  "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر",
] as const;

export const URDU_WEEKDAYS = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"] as const;
