# FLOW PIPELINE — production workflow (locked 2026-05-20)

*How the film is actually assembled. This supersedes the older FLOW-WORKFLOW.md / FLOW-ASSETS.md approach. The core insight here — treat the Giving Machines as a character, drop them in — is the key production decision of the project.*

## The big idea: separate layers, composite

Don't render everything in one pass. Build three reusable layers, then composite:

1. **WATERCOLOR WORLD PLATES** — the location, machine-free, from multiple angles. (Block A style.)
2. **CEL CHARACTERS** — built once each as reusable Nano Banana 2 characters. (Block B style.)
3. **THE GIVING MACHINES AS AN ASSET** — a brand-accurate turnaround, treated exactly like a character, dropped into plates where the script needs them.

This solves three problems at once:
- **Brand safety:** the machines are built once and reused, so the Light the World wordmark / "100% to charity" / Church attribution stay accurate. We never re-roll the logo and risk angering the Church.
- **Reusable backgrounds:** clean plates work for many shots.
- **Placement control:** we decide where the machines sit per shot (the ~10–15% corner anchor), instead of begging the model to place them.

Proven this session: the machine turnaround + composites (machines dropped into the watercolor village with characters on top) work.

## The machines asset

- A single Light the World Giving Machine as a front / 3-4 / back turnaround on white, brand-accurate: white header "Light the World — Giving Machine," card grid (photos, not snacks), red side panel with "100% of your donation goes to the charity cause of your choice," touchscreen + card reader, "The Church of Jesus Christ of Latter-day Saints," "LightTheWorld.org," snowflake motifs, silver corner trim, black base.
- AI models garble logos/small text — for any CLOSE shot where lettering is readable, overlay the real wordmark in post. The turnaround is the base; post locks the brand.
- In-world they're a row of THREE, the ~10–15% corner anchor of a shot, never the main subject. The village/people are the star.

## Multi-angle scene coverage (for ChatGPT / GPT-5.5 image, or Flow)

To get one location from many angles, request a contact sheet of the SAME location, camera moving around it, machine-free (machines dropped in later). Define the location concretely so all panels match; lock Block A style; keep the square ALIVE (vendors, booths, families, kids — not empty). **Do 4 angles per generation, run twice — 8-in-one drifts and shrinks.** The full prompt lives in chat history / skippy-plans; angles used: wide-from-entrance, reverse-wide, high/aerial, low, side-lane, tree-from-opposite, three-quarter, tight-corner. The aerial, gate, and carousel-POV angles all came out strong.

## ERA MAPPING — do not mix this up

Two cafeterias = two eras = two different children. This is story logic, not style:

| Cafeteria | Era | Whose scene | Tray | Look |
|---|---|---|---|---|
| Modern (bright, airy, "Nourish · Learn · Thrive") | Present day | **Mateo** | **white / cream** | bright, hopeful, cool-clean daylight |
| Old (warm golden, institutional) | 1980s flashback | **The Boy** (the Man's younger self) | **teal** | warm sepia memory tone |

Mateo is present-day → modern cafeteria. The Boy is the 1980s flashback → old cafeteria. Never put Mateo in the old room.

**Recognition (changed 2026-05-21):** the Boy↔Man match is carried by WARDROBE + the BLUE BACKPACK (olive top, same pack, same hair) — NOT eye color. Hazel-eye matching is retired. See CHARACTERS.md. Mateo is deliberately distinct: red/rust hoodie, green backpack, curly hair, dark eyes.

**TRAY COLOR = era cue (locked 2026-05-21):** the **teal** tray reads 1980s (a real Davis County tray of that era — grounds the flashback); the **white/cream** tray reads present day. The tray is the object that "slides in from off-frame" in both the #7 flashback (teal, to the Boy) and #20 (white, to Mateo) — the visual rhyme of the same mercy, two eras.

## Open production notes (2026-05-20)

- **Old cafeteria:** drop the presidential-seal flag (reads federal-building, not a 1980s school); a plain US or state flag is enough. Strip decor back for the lonely-boy beat — let him breathe.
- **Modern cafeteria:** wall text is heavy and AI-garbled; fine for establishing wides, not for close-ups.
- **Framing:** the gut-punch beats (lonely boy, tray sliding in) need tight isolating framings, not these busy establishing wides.
- **Doug wardrobe:** two versions exist (tan cardigan; navy fur-collar parka). Pick the cardigan as base, the parka as his outdoor layer for the cold night-market scene.

## MOTION & FINISH — via Gemini Omni Flash (added 2026-05-21, post I/O 2026)

*Full I/O 2026 findings + sources: `docs/FLOW-OMNI-UPDATE-2026-05-21.md`. Summary of the production change below.*

The old plan was: generate stills → composite → write Veo motion prompts (0/24). **As of Google I/O 2026 (May 19), the motion phase moves to Gemini Omni Flash** — Google's new "Nano Banana, but for video" model, now in Flow for Google AI subscribers.

Why it fits this film specifically:
- **Character + voice consistency across scenes** is Omni Flash's headline capability — exactly the Boy↔Man recognition thread and the cel-on-watercolor "don't drift" problem we kept fighting.
- **Conversational, iterative editing** instead of one-shot motion prompts — direct each shot, hold identity.
- **Image-to-video on our locked stills**: bring a finished still in as an ingredient, reference assets with `@`, blend the machines + character + plate into a moving shot.

New finish order:
1. Finalize the locked/needed STILLS (see SHOTLIST.md gaps — #7 flashback, old-caf reshoot sans seal-flag, tight isolating framings, #23 three-face crops).
2. Bring stills into Omni Flash as ingredients; direct motion conversationally, identity/voice held.
3. Score in **Flow Music (Lyria 3 Pro)** — section-by-section under the VO. (Replaces the depleted ElevenLabs path for the music bed.)
4. Assemble; VO (Narrator first, then Doug); SFX; end card.

Also live and useful:
- **Flow Agent** (free to all) — batch-edit across assets (e.g., soften the Man everywhere, apply a fix to every plate), brainstorm, organize/rename the library.
- **Flow Tools** — the "Storyboard Studio" we've been using is a community Flow Tool; the official Flow workflow now covers most of it natively, with Omni on top.

Open call: re-test whether Omni holds the cel-on-watercolor look in motion better than the old composite path before committing the whole film to it (1–2 shot test). Recommended but not yet done.
