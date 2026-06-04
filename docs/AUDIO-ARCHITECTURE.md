# Lunch Angels — Audio Architecture & Generation Record

*Created 2026-06-01 (working session). The full audio plan for the gala presentation,
plus every Kie.ai/Suno taskId, prompt, and keeper decision so nothing has to be re-derived.
All audio is archived in R2 (so no more dead Kie CDN links — that started this whole session).*

## The "branded" principle (read first)
The whole show should be scored from ONE warm palette — the Lunch Angels film score's own
sound (solo piano + sustained warm strings + a touch of celeste). That through-line IS the
brand. The first attempt used a generic brass film-studio fanfare; Scott (correctly) rejected
it as "a different movie's sound." Exception: the **pre-show countdown** is deliberately the
fun/playful bridge FROM the party, so it is lighter/brighter than the film — but it still
should not feel like a stock orchestral fanfare.

## Show flow (in order)
1. **INTRO — 90s countdown cue** → screen goes black, on-screen clock ("Please be seated,
   prepare for the show"), fun/anticipatory music that hushes near zero, then a **whoosh to
   black** into the film. **STATUS: keeper built (pending Scott's final ear-check).**
2. **~5s intro theme** — brief branded title cue from the film's palette, lands into the
   black-screen child's voice. **STATUS: NOT BUILT YET.**
3. **FILM SCORE** — under the film. **STATUS: keeper = `Lunch_Angels_Music_EXT2.mp3` (3:20)** — Scott's *original* score, edit-extended twice (no Suno taskId; original was never captured). Kara picks up ~2:30; +16s calm hold @2:44 holds the QR end-card. The fresh Suno takes are technically richer but didn't fit the cut.
4. **OUTRO — ~30s somber→excited** — reverse bloom under Kara's "thanks + enjoy the show" +
   logo reveal. Warm-strings-soaring, NOT brass. **STATUS: NOT BUILT YET** (only the rejected
   fanfare exists).

## Files (all in R2: `def-assets/lunch-angels/audio/` → https://assets.daviskids.org/lunch-angels/audio/<file>)

| File | Len | Role | Status |
|---|---|---|---|
| `_SOURCE_Lunch_Angels_Music_2-46.m4a` | 2:46 | the original score Scott had (his upload) | source |
| `Lunch_Angels_QR_Hold_30s.mp3` | 0:30 | **QR-scan hold** — played after the film under the QR card; built from EXT2's resolved passage, same key, soft resolve | keeper |
| `Lunch_Angels_Music_EXT2.mp3` | 3:20 | **FILM SCORE keeper (Scott's pick)** — his original score, splice-extended, +16s calm hold @2:44 for QR/Kara | **KEEPER** |
| `Lunch_Angels_Score_A.mp3` | 2:36 | fresh score, take A | option |
| `Lunch_Angels_Score_B.mp3` | 2:31 | fresh score, take B | option |
| `Lunch_Angels_Score_A_Extended.mp3` | 3:26 | fresh score, A extended (richer, but not chosen) | option |
| `Gala_Countdown_90s.mp3` | 1:30 | **INTRO keeper** — fun countdown + whoosh→black | keeper* |
| `DEF_Fanfare_A.mp3` | 0:21 | studio fanfare | REJECTED (wrong movie) |
| `DEF_Fanfare_B.mp3` | 0:30 | studio fanfare | REJECTED (wrong movie) |
| `Lunch_Angels_PreShow_Bed_90s.mp3` | 1:30 | first pre-show bed | REJECTED (too classical/somber) |
| `Lunch_Angels_PreShow_Bed_FULL.mp3` | 2:09 | full take of above | REJECTED |

*keeper = best so far, NOT yet confirmed by Scott on final review.

## Kie.ai / Suno generation log (all V5, customMode, instrumental, key rotates per use)

**Score (fresh):** taskId `1ba4aabd92319794871cbb7c51c09226`
- Take A audioId `0facea34-f555-43da-b018-cf6f62c83493` (156.5s) → chosen
- Take B audioId `6dfd500e-2e8a-482e-9fa1-187f8b2bb5b0` (151.0s)
- style/prompt: warm wintry christmas-adjacent (no carols/sleigh bells), solo piano + warm
  strings + subtle celeste, WARM→thin middle→soft swell→resolve, no vocals/drums, A24 score.

**Score extend (SUCCESS):** taskId `1106183e4e8efe87ca6e2a41fc263f1b`
- params: `audioId=0facea34-...`, `continueAt=117.5`, `defaultParamFlag=false`, model V5
- result keeper audioId `28429565-519e-4294-813b-b47ef5902639` (205.8s) = Score_A_Extended.mp3
- ⚠️ **LESSON:** extend with `defaultParamFlag=true` + instrumental FAILS with
  `GENERATE_AUDIO_FAILED` "empty/malformed lyrics" (credits refunded). Failed taskId
  `0525cb76a06e09a26e4da575263f11ad`. Fix = `defaultParamFlag=false` to inherit the original
  instrumental params. Endpoint `POST /api/v1/generate/extend` now TESTED & working this way.
- Note: extend partly re-voiced the body (not bit-identical to A before continueAt). If a
  future cut needs A preserved exactly, do an edit-side append of just the continuation tail.

**Fanfare (REJECTED):** taskId `c1aa13f606b704e294d89379771edec5` → 21s + 30s. Bright brass
studio-logo fanfare. Rejected: wrong tone, not branded to the film.

**Pre-show bed v1 (REJECTED):** taskId `933962802e9b6cf7793a582d55f45eff` → 129.3s + 141.3s.
Mellow film-palette bed. Rejected: too classical/somber for a *pre-show* moment.

**Countdown cue (KEEPER source):** taskId `6b54e4c003b0adb730f736dae9d9a9f5`
- cd0 (76.0s, used) + cd1 (74.8s).
- style/prompt: light/warm/playful pre-show "showtime" cue, pizzicato + light woodwinds +
  glockenspiel + subtle ticking-clock feel, builds fun anticipation then hushes; NOT somber,
  NOT classical-dramatic, no heavy brass, no modern beat; instrumental.
- **Post-processing (edit-side, no Suno):** beat-aligned loop of cd0 (~122 bpm, loop
  26.09→39.85s, 245ms crossfade) to 89.5s; then synthesized riser + whoosh + soft 55Hz impact
  on the tail with the music ducked under it; hard fade to silence at exactly 90.00s.

## Reproduce / extend later
- Re-fetch any take within Kie retention: `GET /api/v1/generate/record-info?taskId=<id>`.
- To extend a keeper natively: `/api/v1/generate/extend` with `defaultParamFlag=false`,
  `audioId=<track id above>`, `continueAt=<sec>`.
- Music recipe (full): `skippy-plans/plans/2026-05-10-capability-music-generation-kie-suno.md`.
