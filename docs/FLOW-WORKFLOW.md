# Lunch Angels — Flow Production Workflow

*Researched 2026-05-19 (Google I/O 2026 day). The pipeline for consistent stills → video.*

## The principle (this is traditional animation, named)

Lock your **characters** and your **backgrounds** as reusable reference art *first*,
then compose every shot from them. In hand-drawn animation these are **character
model sheets** (a character drawn from front / 3-4 / side / back) and **background
layouts/plates** (a location painted, then re-framed for each shot's angle). Flow's
**Ingredients** feature is the digital version of exactly this — you feed it locked
reference images and it keeps them consistent across generations.

So: **draw the person once, lock it, reuse it.** Your instinct is correct.

## What Flow gives us (current as of I/O 2026)

- **Ingredients** — drop in reference images (character, prop, background) so they stay consistent shot to shot. *This is the spine of the whole approach.*
- **Images tab** (Imagen / Nano Banana / Nano Banana Pro) — generate AND edit stills: change pose, **adjust camera angle**, change outfit, blend two images. This is how we get *multiple angles of the same locked character/background without re-rolling identity.*
- **Frames to Video** — give a start frame (and optional end frame); Flow animates from it. Our shot stills become start frames.
- **Camera motion presets / angle reshoot** — re-shoot a clip with a different camera move instead of starting over.
- **Gemini Omni Flash** (new today) — improved character consistency for video specifically.

Our storyboard tool already has the matching fields: `character_refs`, `start_frame_key`, `end_frame_key`, `candidate_keys`, `winner_video_key`. It was built for this.

## The build order for THIS film

Only **3 environments** and **4 characters** carry the whole film:

**Step 1 — Character model sheets (4).** For each of Doug, The Man, The Boy (1980s), Mateo: generate ONE approved render in our cel style, then use the Images tab's *adjust camera angle / change pose* to spin front, 3-4, side, back from that same render. Lock the set = the character Ingredient.

**Step 2 — Background plates (3 locations × a few angles).**
- Ogden Christmas Village (night, snow) — wide establishing + reverse + a tighter "two-shot" angle
- Modern Davis County cafeteria (day) — wide + table-level + reverse
- 1980s cafeteria (warm memory) — the flashback angle
Generate the establishing painting, then *adjust camera angle* for the other angles of the **same** painted location. Lock = scene Ingredient. (Apply the two-layer canon: plates stay loose/painterly.)

**Step 3 — Compose each shot.** Per shot, drop in: the right **background plate** + the **character ref(s)** + the **style refs**, paste the shot prompt, generate the still. Pick the winner.

**Step 4 — Motion.** Use the winning still as the **Frames to Video** start frame, add the shot's `flow_motion_prompt` + a camera preset. Pick the winning clip.

## Why keep the planning with Skippy (not "switch to Gemini")

The generation *button* lives in Flow (that's where Veo / Imagen / Nano Banana run) — there's no avoiding that, and that's fine. But the **system** — the story map, the canon, the shot list, the per-shot prompts, the Ingredient organization, the motion prompts — stays here, in the repo. You don't move your brain to Gemini; you just run the renders there and drop winners back into the board. Skippy stays the director's chair.

## Possible tool upgrade (optional)

The `characters` table holds one image each, and there's no "location/plate" concept. To make the board hold model-sheet angles + background plates as first-class Ingredients, we'd add: per-character angle slots, and a small `plates` (location × angle) structure. Worth it if we want the board to be the single Ingredient library.
