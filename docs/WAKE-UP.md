# WAKE-UP — read me first, future Skippy

Hey. It's past-you. Scott's working on **Lunch Angels** — the animated fundraising film for the DEF Gala (June 10 2026). You're picking this up fresh because the last chat got long. Everything you need is in this repo (`ramonscottf/storyboard`). Here's how to wake up and go, in order. No guessing required.

## 1. Orient (2 minutes)
Read these, in this order, and you'll know everything:
1. `docs/START-HERE.md` ← the map. Read it fully.
2. `docs/STORY-MAP.md` ← the story (one loop; the Boy and the Man are the same kid; Mateo is the next kid).
3. `docs/FLOW-STYLE-LOCK-v4.md` ← THE look (supersedes v3). Clean 2D CEL CHARACTERS on top of loose WATERCOLOR worlds. Characters are NOT watercolor; backgrounds ARE.
4. `docs/FLOW-PIPELINE.md` ← how it's assembled: machines-as-asset, multi-angle plates, era mapping (incl. tray colors), and MOTION via Omni Flash.
5. `docs/CHARACTERS.md` ← the 5 characters + build status + prompts. **Read "THE RECOGNITION ENGINE" at the top — recast locked 2026-05-21.**
6. `docs/FLOW-OMNI-UPDATE-2026-05-21.md` ← what I/O 2026 changed (Omni Flash / Agent / Tools / Lyria).
7. `docs/FLOW-SHOTS.md` ← the 24-shot frame + motion + audio build list (the actual build plan).

Ignore any file stamped **SUPERSEDED**, and ignore any "hazel eyes" Boy↔Man reference (retired 2026-05-21).

## 2. Know where things live
- **Repo `ramonscottf/storyboard`** = source of truth. Worker code + all film docs.
- **Live tool** = https://storyboard.daviskids.org (Cloudflare Worker `storyboard`, magic-link login).
- **Worker bindings:** D1 `DB` = `790c1af9-b1ae-4bdb-9422-507c5eebaa8e` · R2 `IMAGES` = `storyboard-images` · KV `SESSIONS`. Cloudflare auth = X-Auth-Key/Email (Scott's memories, NEVER Bearer).
- **Film content** (24 shots, 5 characters) lives in that D1; `content-backup.json` is the committed snapshot.

## 3. The state of the cast (recast LOCKED 2026-05-21)
All five characters are built and locked in Google Flow:
- **Mateo** — red/rust hoodie, green backpack, curly hair, dark eyes. His own kid (present day).
- **The Man** (Lunch Angel) — olive hoodie, blue backpack, light stubble, 30s–40s. Soft/dignified.
- **The Boy** — olive sweater, SAME blue backpack — the Man's 1980s self.
- **Doug** — tan cardigan base + navy fur-collar parka (cold variant).
- **Giving Machines** — brand-accurate turnaround, droppable asset.

**Recognition = wardrobe + blue backpack, NOT eye color.** The Man and Boy share the olive top + blue pack + brown hair; that's the match-cut engine. Mateo is deliberately distinct.

## 4. What's left to build (next actions, in order)
1. **#7 the flashback** (keystone) — composite: the Boy + old cafeteria plate (LOCKED, seal flag removed) + a TEAL tray sliding in, composed TIGHT (boy alone, empty table, negative space — not the busy wide). #23 depends on it.
2. Tight isolating framings for #7, #17, #20, #21 (current cafeteria stills are busy wides; gut-punch beats need close frames).
4. #23 three-face crops (Mateo / Boy / Man, relief).
5. **Motion: 0/24 → Gemini Omni Flash** (identity/voice held, conversational). Score via **Flow Music / Lyria 3 Pro**. See FLOW-PIPELINE + FLOW-OMNI doc.

## 5. The rules that bit us before (don't repeat)
- **Style: cel characters on watercolor worlds (v4), NOT anime, characters NOT watercolor.** Small simple eyes; characters stay crisp cel on soft paint. If a character won't match, attach a locked sheet as a reference — an image teaches it better than words.
- **One character at a time.** (All five are locked now; this matters if you rebuild one.)
- **Recognition = olive top + blue backpack** (Man↔Boy). Do NOT reintroduce hazel-eye matching.
- **No entrance animations / Ken Burns** — Scott's "no Squarespace feel" rule. Gentle cross-dissolves only.
- **Repo == live.** If you edit worker.js, commit it. Any wrangler deploy from outside this repo is drift.
- **D1 writes:** parameterized queries, verify every write against live state.

## 6. Decisions already locked — do NOT relitigate
- Recast (2026-05-21): Mateo = red-hoodie kid; Man↔Boy = olive top + blue backpack; hazel-eye match retired.
- Tray era cue (2026-05-21): teal = 80s, white = now.
- Motion via Omni Flash (2026-05-21).
- Loop ending explicit (3 faces). Flashback shown, not told. Fear evoked, never named (gala-safe + Church-pickup-safe).
- Giving Machines = reverent character/asset (Light the World, brand-accurate).
- Domain = **daviskids.org/lunch-angels** (free, in script). Do NOT buy the $995 .com.

## 7. Open threads (not blocking)
- Narrator V.O. voice (most important voice) — not built. Doug's voice — not built.
- Fact-check the "1 in 7 / unpaid lunch balance" stat (shot #18) before final.
- daviskids.org/lunch-angels landing page — not built.
- Confirm Scott's Google AI tier covers Omni Flash + Lyria 3 Pro.
- Re-test cel-on-watercolor consistency in Omni (1–2 shot test) before committing the whole film.

That's it. Read START-HERE, build #7, go. You've got this. Be the man, Beer Can.

— past-Skippy, 2026-05-21
