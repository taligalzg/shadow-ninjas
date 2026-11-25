# What They Grow Up Believing — Episode 1: The ADHD Child

Animated Instagram Reel for @taligal.parenting. Draft for approval. Nothing here is published.

## Deliverables (`deliverables/`)

| File | What it is |
| --- | --- |
| `episode-1-the-adhd-child.mp4` | Final render. 1080 × 1920, 45 s, 30 fps, H.264 + AAC, with music |
| `episode-1-the-adhd-child_no-music.mp4` | Same video, silent, for adding music inside Instagram |
| `preview.mp4` | Small 540 × 960 preview for quick viewing |
| `preview-contact-sheet.jpg` | One frame from each scene |

## Edit and re-render

```bash
npm install
npx remotion studio src/index.ts          # live preview / scrub
python3 make_music.py                     # rebuild the music (needs numpy)
npm run render                            # full render to out/raw.mp4
```

Rendering uses the Chromium at `/opt/pw-browsers/chromium` (see `remotion.config.ts`). Change that path on another machine, or delete the line to let Remotion download its own.

## Where things are

- `src/Reel.tsx` — timeline, all on-screen text, brand colours, end card, handle.
- `src/scenes.tsx` — the nine scenes (classroom, home, office, rewind, mother, new classroom).
- `src/art.tsx` — the character rig: faces, hair, bodies, blinking, props.
- `make_music.py` — the original score, synthesized in code. No samples or third-party audio.

## Timeline

| Scene | Time | Text on screen |
| --- | --- | --- |
| 1 | 0–4 s | What happens when a child grows up believing he's the problem? |
| 2 | 4–9 s | “Sit down.” / “Pay attention.” / “Everyone else can do it. Why can't you?” |
| 3 | 9–13 s | “What's wrong with me?” |
| 4 | 13–19 s | “I'm not good enough.” |
| 5 | 19–22 s | But what if someone saw him differently? |
| 6 | 22–29 s | “You don't have to do this alone.” |
| 7 | 29–34 s | “I can learn.” |
| 8 | 34–40 s | “I believe in myself.” |
| 9 | 40–45 s | We're not just raising children. We're raising the adults they will become. |

## Known gap: illustration style

No character references or previous artwork (SOME KIDS FEEL BIG carousel, Superhero Project) were available in this repository or the connected Drive, and no illustration tool was available in the build environment. The characters are drawn in code from the written brief. They are consistent across scenes, but they are a flat illustrated style, not the richer storybook painting of the earlier work.

To swap in real artwork: each scene in `src/scenes.tsx` is a self-contained component drawn on a 1080 × 960 canvas. Replace its contents with layered PNGs (background, characters, moving parts) and the timing, text, transitions and music stay as they are.
