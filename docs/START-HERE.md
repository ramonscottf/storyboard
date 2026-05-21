> 👋 New here? Read **WAKE-UP.md** first — it's the 6-step getting-started. This file is the detailed map.

# START HERE — Lunch Angels (DEF Gala 2026 film)

*Handoff updated 2026-05-20 (evening). Single entry point. Read this first, then the live docs it points to. Ignore anything marked SUPERSEDED.*

## What this is
**Lunch Angels** (working title "The Giving Machine") — a ~3:00 animated fundraising film for the DEF Gala 2026 (June 10). About school-lunch debt and the kids who go hungry rather than be seen. Built in **Google Flow Storyboard Studio**.

## Where everything lives
- **Repo `ramonscottf/storyboard` (private)** = single source of truth. The Flow worker (storyboard.daviskids.org) source + all film docs.
- The film CONTENT (shots, characters) also lives in the storyboard D1 (`790c1af9-b1ae-4bdb-9422-507c5eebaa8e`), but for the Flow rebuild the **docs are canonical**.

## Read these LIVE docs (in order)
1. **STORY-MAP.md** — the story: one loop, three kids who are the same kid (Boy 1980s → Man now → Mateo today). Keystone = the seen flashback. Decisions locked.
2. **FLOW-SCRIPT.md** — paste-ready screenplay for Flow's Script tab. (abandoned the auto-Assets approach; characters are built standalone now — see FLOW-PIPELINE.md.)
3. **FLOW-STYLE-LOCK-v4.md** — THE style (supersedes v3). Two layers in contrast: clean 2D CEL CHARACTERS on top of loose WATERCOLOR worlds. Characters are NOT watercolor. Contains Block A (project watercolor style) and Block B (shared cel-character block to paste into every character).
4. **FLOW-PIPELINE.md** — how the film is assembled: machines-as-asset, multi-angle scene coverage, and the era mapping (Mateo→modern cafeteria, Boy→old). The machines-as-asset call is the key production decision.
5. **CHARACTERS.md** — the 5 characters' bible + build status + paste-ready triptych prompts. Hazel-eye match between The Man & The Boy is the engine of the film.

## SUPERSEDED — do NOT follow
- `FLOW-STYLE-LOCK-v2.md` (big anime eyes — wrong)
- `FLOW-STYLE-LOCK-v3.md` (grounded-cartoon direction — replaced by v4, which corrects the cel-on-watercolor two-layer)
- `STYLE-CANON.md` character look (cel/Ghibli — only its two-layer *principle* still holds)
- `FLOW-ASSETS.md` / `FLOW-WORKFLOW.md` — written for the OLD Flow project; useful background but the descriptions predate the v3 cartoon correction.

## Current state (2026-05-20 evening)
- **Style LOCKED and working** (v4): "Lunch Angels Storybook" custom style created in Flow Storyboard Studio. Cel characters on watercolor worlds.
- **Built & locked:** Mateo, Doug, the Giving Machines asset, a full multi-angle watercolor village set, both cafeterias (modern + old).
- **Close:** The Man (on-model but tipping toward pity — soften, lose patches).
- **NOT built — top priority:** The Boy, built FROM the Man's face (same hazel eyes). The recognition match-cut has no kid yet.
- Characters built in Flow's native **Characters** builder (Nano Banana 2), one at a time. NOT Storyboard Studio auto-extract.
- Storyboard Studio is a third-party Flow Tool, built on Google's models. Style dropdown = Custom ("Lunch Angels Storybook"), never a preset.
- The generated IMAGES live in the Flow project, NOT in this repo — export separately if version control of the art is wanted.

## Queued build: the Play Mode player
**PLAYER-SPEC.md** — full-screen iOS-style animatic player for the storyboard (play/pause/scrub, VO captions, auto-advance). This is the first worker code-edit + first prod deploy from the repo. Scott asked for it 2026-05-20; build it with full context. Either do this first or the character rebuild first — Scott's call.

## The immediate next action
Build **The Boy** off the Man's face (paste prompt in CHARACTERS.md) — same hazel eyes, younger. Then finalize the Man (dignity, no patches). Both cafeterias and the village are done; the machines are a droppable asset (FLOW-PIPELINE.md).

## Decisions already locked (don't relitigate)
- Loop ending explicit (3 faces). Flashback shown, not told. Fear evoked never named (gala-safe, Church-pickup-safe).
- Giving Machines = a reverent character/asset (Light the World, brand-accurate), not set dressing.
- Domain: use **daviskids.org/lunch-angels** (free, already in script). Do NOT buy the $995 lunchangels.com. Optional ~$12 lunchangels.net/.app redirect only if a standalone link is wanted.
- The Man's character-card sepia wash: left as-is; background plate sets his real color.

## Open threads (not blocking)
- Narrator V.O. voice (the most important voice) — not yet built.
- Doug's voice — build in Flow Edit Voice (warm older male; sample line ready in chat history).
- Fact-check the "1 in 7 / unpaid lunch balance" stat (shot #18) before final.
- daviskids.org/lunch-angels landing page — not built.
