# دعوتِ نکاح — Sajid & Aiman

Nikkah invitation website: Arabic/Islamic theme, Urdu Nastaliq calligraphy, 3D gold geometry, cinematic animation. Built with Next.js 16 (App Router, React Compiler, Turbopack), React Three Fiber, GSAP, Lenis and Tailwind v4. Designed for guests opening the link from WhatsApp on phones.

## Event facts (single source of truth)

Everything about the event lives in `src/config/event.ts` (dates, times, venue, map link, coordinates, site URL) and `src/content/invite.ts` (every Urdu/Arabic string). Change them there; countdown, calendar links, the `.ics` file, QR code, share text and copy all update together.

- Friday 16 October 2026 · 5 Jumada al-Ula 1448 AH · after Asr (Asr adhan in Lahore that day is about 15:51 PKT, verified via the Aladhan API, Hanafi/Karachi method)
- Masjid-e-Quba, Nasir Park, Tauheed Road, Lahore · https://maps.app.goo.gl/zdASF1ejAdjwXm81A (pin at 31.581038, 74.293154)
- Countdown target: `NIKKAH_ISO` (Asr). Calendar event window: 15:30–18:00 PKT.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm build && pnpm start
```

Useful QA scripts (need Google Chrome installed; `CHROME_PATH` overrides the binary):

```bash
node scripts/screenshot.mjs "http://localhost:3000/?tier=low" out.png --mobile --click=.gate-seal --clickwait=8000
node scripts/og.mjs             # regenerates src/app/opengraph-image.jpg + twitter-image.jpg from the /og route
```

`?tier=high|medium|low|none` forces the WebGL quality tier for testing. In headless Chrome use `low` or `none`; software WebGL at the top tier stalls the animation clock.

## Deploy on Vercel

1. Import the GitHub repo in Vercel.
2. Settings → Build and Deployment → **Root Directory** = `Nikkah` (this cannot be set from `vercel.json`).
3. Environment variable `NEXT_PUBLIC_SITE_URL` = the production URL (e.g. `https://sajid-aiman-nikkah.vercel.app`) for Production and Preview. It makes OG/share links absolute so WhatsApp shows the preview card.
4. Deploy. Framework preset is auto-detected; no other configuration is needed.

For more event sites in this repo later, use Vercel's "Ignored Build Step" with `git diff HEAD^ HEAD --quiet -- .` so each project only rebuilds when its folder changes. Do not add a `package.json` or lockfile at the repo root.

WhatsApp caches link previews for days. If you change the preview image, share the link with a query string (`?v=2`) to force a fresh preview.

Keep **Deployment Protection off for Production** (Vercel → Settings → Deployment Protection). Password- or login-protected deployments block WhatsApp's link crawler, so guests would see no preview card. Preview deployments can stay protected.

## Structure

```
src/app/            layout (RTL, fonts, metadata), page, /og card, calendar.ics route, OG/Twitter images
src/config/         event.ts — dates, venue, links
src/content/        invite.ts — all Urdu/Arabic copy; bismillah-path.ts — CC0 calligraphy outline
src/components/
  intro/Gate        sealed-invitation overlay (tap to open, remembered per session)
  three/            R3F scene: SceneCanvas (tiering, visibility pause, context-loss recovery), GoldStar, GoldDust, FloatingStars, Studio lighting, Effects
  sections/         Hero, Verse (Ar-Rum 30:21), Invitation (formal wording), Details (foil day numeral, countdown in a shamsa medallion, calendar), Venue (map, QR + /qr.png download), Note (Asr-amber band + arrival timeline), Closing (dua, couplet, share)
  ui/               Countdown, DateNumeral, EssentialsBar (sticky phone bar), QrCard, CalendarButtons, ShareButtons, MapEmbed, Reveal, NastaliqWords, GirihPattern, GrainOverlay
src/hooks/          useDeviceTier (WebGL capability gate), useCountdown (hydration-safe)
src/lib/            gsap registry, calendar/ICS builders, QR generator, Urdu digits, scroll state
public/calligraphy/ Bismillah SVGs (CC0, see CREDITS.md)
```

## Performance and robustness

- Urdu copy and the sealed gate are server-rendered HTML; the three.js chunk is prefetched during idle time but only mounted when the guest opens the invitation, and only on capable devices.
- Device tiers: no WebGL, software renderers, reduced-motion or save-data → CSS-only hero; weak phones → no post-processing, fewer particles, DPR 1; others → bloom, DPR up to 1.5 (2 on desktop). A live FPS monitor steps quality down if frames drop.
- One persistent canvas, paused when hidden or off-screen, remounted if the WebGL context is lost and not restored.
- Nastaliq rules: word-level reveals only (never per character), line-height ≥ 2, descender-safe masks, no letter-spacing. The middle dot is absent from the Nastaliq face and reads as the Urdu zero inside Urdu text, so separators go through the `Sep` component (Latin face) and never inside a translated string.
- Reveals animate opacity only, never visibility, so content below the fold stays in the accessibility tree and tab order.
- Lenis smooth scroll runs only on fine-pointer devices; phones keep native scrolling.
- The `.ics` route is served inline (not as an attachment) so iOS opens the Calendar sheet directly.
- Fonts are self-hosted by `next/font` (Noto Nastaliq Urdu, Amiri Quran, Aref Ruqaa, Reem Kufi, Cormorant Garamond, Cinzel), all OFL. The Nastaliq face is subset at build time (`prebuild` → `scripts/subset-fonts.mjs`) to the characters found in `src/`, so it stays complete whenever copy changes and rebuilds.
