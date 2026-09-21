# Background sound

The invitation plays a generated ambience (a Hijaz drone with slow bell tones, built in
`src/lib/ambient-tone.ts`) until a real recording is published here.

To use your own nasheed instead, drop it in this folder as:

- `nasheed.webm` — Opus, what most browsers will pick
- `nasheed.m4a` — AAC, the fallback Safari/iOS needs

Nothing else needs changing: `AmbientSound` prefers a published file and falls back to the
tone when neither is present. Keep it short and loopable — it repeats for as long as the
page is open — and quiet enough to sit behind the page.

Choose the recording yourself: only you can judge what suits the families, and only you
can clear the rights to distribute it. A voice-only nasheed (optionally with duff) is the
usual choice for a nikkah, since many guests would not expect instrumental music at one.
