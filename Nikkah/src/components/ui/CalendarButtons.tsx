import { googleCalendarUrl, outlookCalendarUrl, yahooCalendarUrl } from "@/lib/calendar";
import { invite } from "@/content/invite";

/* Brand marks as monochrome glyphs: they inherit the button's gold (or the dark
   ink of the primary button) via currentColor, so nothing clashes with the palette. */

const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.19-1.79 4.13-1.15 1.15-2.93 2.4-6.05 2.4-4.83 0-8.6-3.89-8.6-8.72s3.77-8.72 8.6-8.72c2.6 0 4.51 1.03 5.91 2.35l2.31-2.31C18.75 1.44 16.13 0 12.48 0 5.87 0 .31 5.39.31 12s5.56 12 12.17 12c3.57 0 6.27-1.17 8.37-3.36 2.16-2.16 2.84-5.21 2.84-7.67 0-.76-.05-1.47-.17-2.05h-11.04Z" />
  </svg>
);

const IconApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.54c-.02-2.69 2.2-3.98 2.3-4.05-1.25-1.83-3.2-2.08-3.89-2.1-1.65-.17-3.23.97-4.07.97-.84 0-2.13-.95-3.51-.93-1.8.03-3.47 1.05-4.4 2.67-1.87 3.25-.48 8.07 1.35 10.71.9 1.29 1.96 2.74 3.36 2.69 1.35-.06 1.86-.87 3.49-.87s2.09.87 3.51.84c1.45-.02 2.37-1.31 3.26-2.61 1.03-1.5 1.45-2.95 1.47-3.02-.03-.01-2.83-1.08-2.86-4.3Z" />
    <path d="M14.54 4.47c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.61-.69.8-1.29 2.07-1.13 3.29 1.2.1 2.42-.6 3.16-1.5Z" />
  </svg>
);

const IconOutlook = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <path d="M13.5 5.5H20a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-6.5" />
    <path d="M13.8 8.4 17.7 11l3.8-2.6" />
    <path d="M13 3.2v17.6L3 19V5l10-1.8Z" strokeLinejoin="round" />
    <ellipse cx="8" cy="12" rx="2.6" ry="3.5" />
  </svg>
);

const IconYahoo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2.4 6.2h3.9l2.6 5.9 2.6-5.9h3.8L8.6 20.4H4.9l2-4.4L2.4 6.2Z" />
    <path d="M17.6 6.2h2.4l-.6 6.6h-1.2l-.6-6.6Z" />
    <circle cx="18.8" cy="15.2" r="1.4" />
  </svg>
);

/** Zero-JS calendar targets: plain links + the statically generated .ics route. */
export function CalendarButtons({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className ?? ""}`}>
      <a className="btn-gold btn-primary" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" lang="ur">
        <IconGoogle />
        {invite.calendar.google}
      </a>
      {/* No download attribute: iOS then opens the Calendar "Add event" sheet instead of saving a file. */}
      <a className="btn-gold" href="/calendar.ics" lang="ur">
        <IconApple />
        {invite.calendar.apple}
      </a>
      <a className="btn-gold" href={outlookCalendarUrl()} target="_blank" rel="noopener noreferrer" lang="ur">
        <IconOutlook />
        {invite.calendar.outlook}
      </a>
      <a className="btn-gold" href={yahooCalendarUrl()} target="_blank" rel="noopener noreferrer" lang="ur">
        <IconYahoo />
        {invite.calendar.yahoo}
      </a>
    </div>
  );
}
