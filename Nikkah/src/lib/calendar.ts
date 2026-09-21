import { COUPLE, EVENT_END_ISO, EVENT_START_ISO, SITE, TIMEZONE, VENUE } from "@/config/event";
import { invite } from "@/content/invite";

/** Shared event fields used by every calendar target. Urdu + English so any calendar app shows something readable. */
export const CALENDAR_EVENT = {
  title: `Nikkah — ${COUPLE.groom.name} & ${COUPLE.bride.name} | تقریبِ نکاح`,
  description: [
    `${invite.title}: ${invite.groom.name} و ${invite.bride.name}`,
    `${invite.when.time} — ${invite.note.text}`,
    "",
    `Nikkah of ${COUPLE.groom.name} s/o ${COUPLE.groom.father} & ${COUPLE.bride.name} d/o ${COUPLE.bride.father}.`,
    "After Asr prayer. Please arrive before Asr; we will pray Asr at the masjid, then the nikkah begins.",
    "",
    `Map: ${VENUE.mapsUrl}`,
    `Invitation: ${SITE.url}`,
  ].join("\n"),
  location: `${VENUE.name}, ${VENUE.address}`,
  start: new Date(EVENT_START_ISO),
  end: new Date(EVENT_END_ISO),
} as const;

/** 20261016T103000Z — UTC basic format required by Google/ICS. */
function toUtcBasic(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function googleCalendarUrl(): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: CALENDAR_EVENT.title,
    dates: `${toUtcBasic(CALENDAR_EVENT.start)}/${toUtcBasic(CALENDAR_EVENT.end)}`,
    details: CALENDAR_EVENT.description,
    location: CALENDAR_EVENT.location,
    ctz: TIMEZONE,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function outlookCalendarUrl(kind: "live" | "office" = "live"): string {
  const host = kind === "live" ? "https://outlook.live.com" : "https://outlook.office.com";
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: CALENDAR_EVENT.title,
    startdt: CALENDAR_EVENT.start.toISOString(),
    enddt: CALENDAR_EVENT.end.toISOString(),
    body: CALENDAR_EVENT.description,
    location: CALENDAR_EVENT.location,
  });
  return `${host}/calendar/0/deeplink/compose?${p.toString()}`;
}

/** Yahoo ignores a trailing Z, so it gets Pakistan local stamps (UTC+05:00, no DST). */
function toPktBasic(d: Date): string {
  return new Date(d.getTime() + 5 * 3600 * 1000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "");
}

export function yahooCalendarUrl(): string {
  const p = new URLSearchParams({
    v: "60",
    title: CALENDAR_EVENT.title,
    st: toPktBasic(CALENDAR_EVENT.start),
    et: toPktBasic(CALENDAR_EVENT.end),
    desc: CALENDAR_EVENT.description,
    in_loc: CALENDAR_EVENT.location,
  });
  return `https://calendar.yahoo.com/?${p.toString()}`;
}

/** Escape per RFC 5545 §3.3.11 (TEXT). */
function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Fold lines at 75 octets (RFC 5545 §3.1). Works on UTF-8 byte length so Urdu text folds safely. */
function icsFold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + b > limit) {
      out.push(current);
      current = ch;
      bytes = b;
    } else {
      current += ch;
      bytes += b;
    }
  }
  out.push(current);
  return out.join("\r\n ");
}

/** Build a complete UTF-8 iCalendar document. Times are UTC so every client resolves them correctly. */
export function buildIcs(now: Date = new Date("2026-09-20T00:00:00Z")): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sajid & Aiman Nikkah//Invitation//UR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:nikkah-sajid-aiman-20261016@${new URL(SITE.url).hostname}`,
    `DTSTAMP:${toUtcBasic(now)}`,
    `DTSTART:${toUtcBasic(CALENDAR_EVENT.start)}`,
    `DTEND:${toUtcBasic(CALENDAR_EVENT.end)}`,
    `SUMMARY:${icsEscape(CALENDAR_EVENT.title)}`,
    `DESCRIPTION:${icsEscape(CALENDAR_EVENT.description)}`,
    `LOCATION:${icsEscape(CALENDAR_EVENT.location)}`,
    `GEO:${VENUE.lat};${VENUE.lng}`,
    `URL:${SITE.url}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape("Nikkah tomorrow — نکاح کل ہے")}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape("Nikkah in 2 hours — please leave for the masjid")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(icsFold).join("\r\n") + "\r\n";
}
