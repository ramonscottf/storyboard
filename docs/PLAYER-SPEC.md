# Lunch Angels — "Play Mode" Player (spec for next chat to build)

*Specced 2026-05-20. Build in the FRESH synced chat — it's the first worker code-edit + first prod `wrangler deploy` from this repo, so it deserves a full-context session + verify loop.*

## What Scott wants
Turn the storyboard from a grid into a **playable animatic** — a full-screen, iOS/Apple-style media player that runs the shots like a film. Gorgeous full-bleed stills, VO captions, play/pause/scrub, auto-advance like a playlist. For showing the film to Sherry / the board / the Church.

## It's low-risk: consumes existing data only
- `/api/state` already returns all shots in order with `winner_image_key`, `vo_quote`, `vo_who`, `time_code`, `title`.
- Images already served at `/img/{key}`.
- NO schema change, NO data risk. Pure additive front-end + one new route.

## Build
- New **▶ Play** button on `/board` → opens full-screen player (can be a `/play` route OR an in-page overlay; overlay is simpler + avoids a reload).
- Full-bleed winning still per shot, black letterbox background, `object-fit: contain` so nothing crops.
- **Transitions:** gentle cross-dissolve between shots. NO Ken Burns / zoom / curtain reveals (Scott's "no Squarespace animations" rule — heroes stay still).
- **VO captions:** `vo_quote` fades in lower-third, clean type, with `vo_who` as a small label. `ON SCREEN` cues render as centered title cards.
- **Transport (auto-hide when idle, Apple-style):** play/pause, prev/next shot, scrubber showing whole-film progress with shot ticks, elapsed/total time, fullscreen, exit (X / Esc).
- **Auto-advance:** each shot holds for a duration derived from its `time_code` (parse start→next start); fallback ~5s. Cross-dissolve to next. Loops or stops at end (stop, with a "Replay" button).
- **Keyboard:** space=play/pause, ←/→=prev/next shot, Esc=exit, F=fullscreen.
- **Pending shots:** if no `winner_image_key`, show a tasteful "Shot N — pending" card (dark, shot title + VO) rather than skipping, so the animatic still reads end-to-end.
- **Aesthetic:** match Apple TV/Photos player — minimal, black, translucent frosted control bar, large hit targets, smooth fades. Mobile-friendly (tap toggles chrome).

## Deploy (first time from repo!)
- Edit `worker.js`, test locally if possible, then `wrangler deploy`.
- MAIL_TOKEN secret is already set on the worker, so deploy is behavior-identical except the player addition.
- Verify: load /board, click Play, run through, check VO + scrub + exit. Then confirm sign-in email still works (token path).
- Commit worker.js change to repo (keep repo == live).

## Nice-to-haves (only if time)
- Audio: if a Narrator VO track gets generated later, sync it per shot.
- "Share" → a read-only play link for the board/Sherry.
- Per-shot caption timing tied to motion later.
