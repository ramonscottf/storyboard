> 👋 New here? Read **WAKE-UP.md** first — it's the 6-step getting-started. This file is the detailed map.

# START HERE — Lunch Angels (DEF Gala 2026 film)

*Handoff updated 2026-05-21. Single entry point. Read this first, then the live docs it points to. Ignore anything marked SUPERSEDED.*

## What this is
**Lunch Angels** (working title "The Giving Machine") — a ~3:00 animated fundraising film for the DEF Gala 2026 (June 10). About school-lunch debt and the kids who go hungry rather than be seen. Built in **Google Flow**.

## Where everything lives
- **Repo `ramonscottf/storyboard` (private)** = single source of truth. The Flow worker (storyboard.daviskids.org) source + all film docs.
- The film CONTENT (24 shots, 5 characters) also lives in the storyboard D1 (`790c1af9-b1ae-4bdb-9422-507c5eebaa8e`); for the Flow build the **docs are canonical**.

## Read these LIVE docs (in order)
1. **STORY-MAP.md** — the story: one loop, three kids — but two of them are the same kid (Boy 1980s → Man now), and Mateo is the next kid. Keystone = the seen flashback. Decisions locked.
2. **FLOW-SCRIPT.md** — paste-ready screenplay.
3. **FLOW-STYLE-LOCK-v4.md** — THE style (supersedes v3). Clean 2D CEL CHARACTERS on top of loose WATERCOLOR worlds. Characters are NOT watercolor. Block A (world watercolor) + Block B (shared cel-character block).
4. **FLOW-PIPELINE.md** — how the film is assembled: machines-as-asset, multi-angle plates, era mapping (incl. tray-color era cue), and the **MOTION & FINISH via Omni Flash** section.
5. **CHARACTERS.md** — the 5 characters' bible + build status + paste-ready prompts. **Recast locked 2026-05-21** — read "THE RECOGNITION ENGINE" at the top.
6. **FLOW-OMNI-UPDATE-2026-05-21.md** — what Google I/O 2026 changed for us (Omni Flash, Agent, Tools, Lyria), with sources.
7. **FLOW-SHOTS.md** — the per-shot frame + motion + audio build list, all 24 drafted against the Omni mechanic. The bridge from locked art to a 3:00 film; this is the actual build plan.

## SUPERSEDED — do NOT follow
- `FLOW-STYLE-LOCK-v2.md` (big anime eyes — wrong)
- `FLOW-STYLE-LOCK-v3.md` (replaced by v4)
- `STYLE-CANON.md` character look (only its two-layer *principle* still holds)
- `FLOW-ASSETS.md` / `FLOW-WORKFLOW.md` — written for the OLD Flow project; background only
- Any mention of "hazel eyes" as the Boy↔Man link — RETIRED 2026-05-21 (recognition is now wardrobe + blue backpack)

## Current state (2026-05-21)
- **Style LOCKED** (v4): "Lunch Angels Storybook" custom style. Cel characters on watercolor worlds.
- **Recast LOCKED:** Mateo = the red/rust-hoodie, green-pack, curly kid (his own kid, dark eyes). The Man (olive hoodie, blue backpack, light stubble) and the Boy (olive sweater, same blue backpack) are the same person — recognition carried by **wardrobe + the blue backpack, NOT eye color.**
- **Built & locked characters:** Mateo, The Man, The Boy, Doug (cardigan + parka variant), the Giving Machines asset.
- **Backgrounds LOCKED:** full multi-angle watercolor village set; modern cafeteria (Mateo, present); old cafeteria (Boy, 1980s) — reshot 2026-05-21 with the presidential-seal flag removed (US flag only). Both are establishing wides — the intimate beats (#7, #17, #20) need tight crops composed against them.
- **Tray era cue locked:** teal = 1980s flashback, white/cream = present day.
- **Motion: 0/24** — now routed through **Gemini Omni Flash** (see FLOW-PIPELINE.md + FLOW-OMNI doc). Score via Flow Music / Lyria 3 Pro.

## The immediate next actions (in order)
1. Build **#7 the flashback** (the keystone) — composite from assets in hand: the Boy (sheet) + old cafeteria plate (locked) + a TEAL tray sliding in, composed TIGHT (boy alone, long empty table, lots of negative space — not the busy establishing wide). #23 depends on it.
2. Generate the **tight isolating framings** for #7, #17, #20, #21 (current cafeteria stills are busy establishing wides; the gut-punch beats need close, quiet frames).
4. #23 three-face crops (Mateo / Boy / Man, relief).
5. Then → Omni Flash for motion, Lyria for score.

## Decisions already locked (don't relitigate)
- **Recast (2026-05-21):** Mateo = red-hoodie kid; Man↔Boy linked by olive top + blue backpack; hazel-eye match retired.
- **Tray era cue (2026-05-21):** teal = 80s, white = now.
- **Motion via Omni Flash (2026-05-21).**
- Loop ending explicit (3 faces). Flashback shown, not told. Fear evoked, never named (gala-safe, Church-pickup-safe).
- Giving Machines = a reverent character/asset (Light the World, brand-accurate), not set dressing.
- Domain: **daviskids.org/lunch-angels** (free, in script). Do NOT buy the $995 lunchangels.com.

## Open threads (not blocking)
- Narrator V.O. voice (the most important voice) — not built. Doug's voice — not built (build in Flow / Lyria pipeline).
- Fact-check the "1 in 7 / unpaid lunch balance" stat (shot #18) before final.
- daviskids.org/lunch-angels landing page — not built.
- Confirm Scott's Google AI tier covers Omni Flash + Lyria 3 Pro.
- Re-test cel-on-watercolor consistency in Omni (1–2 shot test) before committing the whole film.
