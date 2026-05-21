# WAKE-UP — read me first, future Skippy

Hey. It's past-you. Scott's working on **Lunch Angels** — the animated fundraising film for the DEF Gala (June 10 2026). You're picking this up fresh because the last chat got long. Everything you need is in this repo (`ramonscottf/storyboard`). Here's how to wake up and go, in order. No guessing required.

## 1. Orient (2 minutes)
Read these, in this order, and you'll know everything:
1. `docs/START-HERE.md` ← the map. Read it fully.
2. `docs/STORY-MAP.md` ← the story (one loop, three kids who are the same kid).
3. `docs/FLOW-STYLE-LOCK-v4.md` ← THE look (supersedes v3). Clean 2D CEL CHARACTERS on top of loose WATERCOLOR worlds — two layers, contrast in forms. Characters are NOT watercolor; backgrounds ARE.
4. `docs/FLOW-PIPELINE.md` ← how it's assembled: machines-as-asset, multi-angle plates, era mapping.
5. `docs/CHARACTERS.md` ← the 5 characters + build status + paste-ready prompts.

Ignore any file stamped **SUPERSEDED** at the top (FLOW-STYLE-LOCK-v2, FLOW-STYLE-LOCK-v3, the STYLE-CANON character look). They're kept for history only.

## 2. Know where things live
- **Repo `ramonscottf/storyboard`** = source of truth (this repo). Worker code + all film docs.
- **Live tool** = https://storyboard.daviskids.org (Cloudflare Worker named `storyboard`, magic-link login).
- **Worker bindings:** D1 `DB` = `790c1af9-b1ae-4bdb-9422-507c5eebaa8e` · R2 `IMAGES` = `storyboard-images` · KV `SESSIONS`. Cloudflare auth = X-Auth-Key/Email (in Scott's memories, NEVER Bearer).
- **The film content** (24 shots, 5 characters) lives in that D1. `content-backup.json` is the committed snapshot.

## 3. The two builds waiting (Scott picks which first)
**A) Finish the cast in Google Flow.** LOCKED already: Mateo, Doug, the Giving Machines asset, the watercolor village (multi-angle), both cafeterias. NEXT: build **The Boy** off the Man's face (same hazel eyes) — paste prompt in CHARACTERS.md — then soften **The Man** (he tips toward pity; lose the patches). Style/style-blocks live in FLOW-STYLE-LOCK-v4.md; pipeline in FLOW-PIPELINE.md. Built in Flow's native Characters builder, Nano Banana 2, one at a time.

**B) Play Mode player** — `docs/PLAYER-SPEC.md`. Full-screen iOS-style animatic player on the storyboard (play/pause/scrub, VO captions, auto-advance). ⚠️ This is the FIRST time editing `worker.js` + the FIRST `wrangler deploy` from this repo. Do it carefully with a verify loop. MAIL_TOKEN secret is already set, so deploy is behavior-identical except the new player.

Ask Scott which he wants first (tappable options). Don't start both.

## 4. The rules that bit us last time (don't repeat)
- **Style: cel characters on watercolor worlds (v4), NOT anime, characters NOT watercolor.** We drifted to big anime eyes AND to watercolor-ing the characters. Smaller simple eyes; characters stay crisp cel on top of soft paint. If a character won't match, attach the locked Mateo sheet as a reference — an image teaches it better than words.
- **One character at a time.** Lock it, eyeball the eyes, THEN move on. Don't batch — that's how the styles diverged.
- **The Man & Boy share hazel eyes** — that recognition is the engine of the film. Generate the Man first, match the Boy to him.
- **No entrance animations / Ken Burns** on the player — Scott's "no Squarespace feel" rule. Gentle cross-dissolves only.
- **Repo == live.** If you edit worker.js, commit it. Any wrangler deploy from outside this repo is drift.
- **D1 writes:** use parameterized queries, verify every write against live state after.

## 5. Decisions already locked — do NOT relitigate
- Loop ending explicit (3 faces). Flashback shown not told. Fear evoked, never named (gala-safe + Church-pickup-safe).
- Giving Machines = reverent character/asset (Light the World, brand-accurate).
- Domain = **daviskids.org/lunch-angels** (free, in script). Do NOT buy the $995 .com.
- The Man's card sepia wash: left as-is; the background plate sets his real color.

## 6. Open threads (not blocking, pick up when relevant)
- Narrator V.O. voice (most important voice) — not built. Doug's voice — half-specced in old chat.
- Fact-check the "1 in 7 / unpaid lunch balance" stat (shot #18) before final.
- daviskids.org/lunch-angels landing page — not built.

That's it. Read START-HERE, ask Scott which build, go. You've got this. Be the man, Beer Can.
```
— past-Skippy, 2026-05-20
```
