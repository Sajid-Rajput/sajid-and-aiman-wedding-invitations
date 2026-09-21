import { buildIcs } from "@/lib/calendar";

/** Statically generated at build time from src/config/event.ts. */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // inline, not attachment: iOS opens the Calendar sheet directly instead of saving to Files
      "Content-Disposition": 'inline; filename="nikkah-sajid-aiman.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
