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

## What is published now

`nasheed.webm` (Opus 72k) and `nasheed.m4a` (AAC 96k), both encoded from
`alex-morgan-islamic-nasheed-peaceful-reflection-573946.mp3`, supplied by the couple.

The encode starts the track at **0:03** (its first three seconds are dropped), adds a 1.2s
fade in and a 2.8s fade out so the loop seam is not audible, and normalises to -19 LUFS so it
sits behind the page. To re-cut it from a new source:

```sh
ffmpeg -ss 3 -i <source>.mp3 -map_metadata -1 -vn \
  -af "afade=t=in:st=0:d=1.2,afade=t=out:st=<dur-2.8>:d=2.8,loudnorm=I=-19:TP=-2:LRA=11" \
  -c:a libopus -b:a 72k -vbr on -application audio public/audio/nasheed.webm
ffmpeg -ss 3 -i <source>.mp3 -map_metadata -1 -vn \
  -af "afade=t=in:st=0:d=1.2,afade=t=out:st=<dur-2.8>:d=2.8,loudnorm=I=-19:TP=-2:LRA=11" \
  -c:a aac -b:a 96k -movflags +faststart public/audio/nasheed.m4a
```
