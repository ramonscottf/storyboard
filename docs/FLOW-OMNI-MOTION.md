# Lunch Angels — MOTION prompts (the animation companion)

*Created 2026-05-21, engine corrected 2026-05-22. Companion to CHATGPT-PROMPTS.md (which makes the STILLS). Turns each locked still into MOTION in Google Flow. ENGINE = Veo 3.1 Start/End frames (NOT Omni — see below). Filename kept as FLOW-OMNI-MOTION.md for link stability; content is Veo-first.*

## THE ENGINE: VEO 3.1 START/END FRAMES — NOT OMNI (locked 2026-05-22)

**Use Veo 3.1 with Start frame + End frame. Omni is abandoned for this film.**

The full journey (4 corrections in one day — documented so nobody repeats it):
1. Attached still into the prompt box → Omni treated it as loose reference, repainted from scratch (Coca-Cola machines, generic markets).
2. Animated FROM the saved image → world held better but the character morphed across the clip.
3. Stacked the character sheets as references → Omni fused them into its own house style = PHOTOREAL. The flat 2D watercolor was "promoted" to 3D realism.
4. **Switched to Veo 3.1 with Start/End frames → HELD PERFECTLY.** Watercolor style, characters, world all preserved.

WHY VEO WORKS AND OMNI DOESN'T: Omni reinterprets one image guided by text, and its video model defaults to photorealism — so it overrides a flat illustrated source. Veo with start+end frames INTERPOLATES between two real frames you supply. Both ends are pinned to your actual locked stills, so it physically cannot drift to realism or swap the character — the style is locked at both ends. The motion is generated *between* your art, not *over* it.

### How to run a shot in Veo
1. In the create panel choose **Video → Veo 3.1 (Quality)**.
2. Set **Start frame = your locked still** for the beginning of the beat.
3. Set **End frame = the still for the end of the beat** (a second still showing where the motion lands — e.g. tray placed, head turned, man one step closer).
4. Keep clips SHORT (4s is the floor option and plenty). Prompt is a light nudge of the in-between motion only; the two frames do the heavy lifting.
5. **Turn off audio** (settings → "return silent videos") — the "audio generation failed" error is just Veo trying to add sound; we don't want Veo audio, the mix is ElevenLabs in the edit.

### You now need END-FRAME stills for motion beats
This changes the still list: shots with real movement want a **start still AND an end still**. Most are cheap to make — re-generate the same frame with the change (tray now on the table; man one step closer; head turned; hands lowered). The match-cut #7↔#17 and the aerial→Doug establisher, which I previously called "edit-only two-shots," can now be REAL Veo interpolations if you give Veo the two end frames. (Aerial is still risky as a start frame — test it; if it over-renders, keep it static.)

### Single-frame fallback
If a beat truly has no movement (a held face), Veo can take just a start frame, or you add a gentle push-in in the EDITOR (Ken Burns) on the static still — that path keeps 100% style lock too.

## CRITICAL: THE STYLE-HOLD LINE (append to EVERY motion prompt)
Omni re-interprets the whole frame to animate it. With no style instruction it drifts to its own default — room geometry shifts, wall text re-renders, the look warms up and goes generic (observed 2026-05-21 across a row of #16 gens). This is the INVERSE of the stills rule: stills carry their look in the attached image, but a motion prompt must EXPLICITLY tell Omni to hold the look while it moves. Always end the prompt with:

> **Preserve the original image's hand-painted watercolor storybook style, colors, characters, and layout exactly — animate only the described motion; do not restyle, re-render, or change the look.**

(Shorthand used below: each prompt ends with `[STYLE-HOLD]` — expand it to the full sentence above when you paste. It's the single most important line for consistency.)

## UNIVERSAL SAFETY ADD-ONS (append when needed)
- Crowd morphing → `background figures move only slightly, no large motions.`
- Hero hands/props drifting → `the boy's hands stay folded and still.` / `keep the tray steady.`
- Snow going blizzard → `light, slow snowfall.`
- General → `camera calm and steady; no fast moves.`

---

## SINGLE-IMAGE MOVES (one plate, one generation)

### #2 · Wide Establishing — the Village  (`Market_Aerial`)
```
Slow aerial drift over the snowy market, gently descending toward the square. People move below in soft, out-of-focus little motions. String lights twinkle, snow falls slow. Calm, no fast moves. Distant figures move only slightly. [STYLE-HOLD]
```

### #3 · Doug at the Machines  (Doug plate)
```
Gentle push-in settling on Doug standing before the glowing machines. Crowd soft and out of focus behind him, snow drifting, warm lights flickering. Doug nearly still — a small breath, a slight settle. Camera calm. [STYLE-HOLD]
```

### #4 · The Approach  (`The_MAN` from behind)
```
Slow follow behind the Man as he walks toward the glowing machines across the snow; gentle forward drift. Snow falling, breath-fog, lights swaying faintly. Steady, unhurried. [STYLE-HOLD]
```

### #5 · Two-Shot at the Machine
```
Hold, near lock-off. Doug gestures slightly toward a card; the Man's eyes follow. Breath-fog between them, snow drifting, warm glow flickering. Tiny natural movements only — no big motion. [STYLE-HOLD]
```

### #6 · The Recognition (hinge into #7)
```
Very slow push-in on the Man's face. His gaze lowers and goes inward — a small, quiet flicker of memory. Snow soft behind him, glow steady. Almost still; a held breath. [STYLE-HOLD]
```

### #10 · The Bill
```
Hold steady. The Man's hand extends the folded twenty toward Doug; small, sincere. Snow drifting, glow warm. Keep the bill steady; minimal other motion. [STYLE-HOLD]
```

### #11 · Doug's Reaction
```
Hold on Doug. A small apologetic look, a slight head-shake, a hand patting his pocket. Snow soft, glow warm. Gentle, rueful, calm camera. [STYLE-HOLD]
```

### #12 · The Pause
```
Near-still. The Man looks down at the bill, then up toward the machine — the beat before deciding. Snow drifting. Very small movement, calm camera. [STYLE-HOLD]
```

### #13 · Let's Get Two (title line)
```
Hold. The Man presses the folded bill forward to Doug; Doug receives it, meeting his eyes. Warm glow, snow. Quiet, small motion only. [STYLE-HOLD]
```

### #7 · The Boy (flashback) — KEYSTONE  (`The_BOY` plate)
```
Almost completely still — a memory held. The faintest slow push-in. The teal tray slides gently into frame from the right, placed by no one we see; the boy looks up a touch. Warm sepia light, soft dust in the air. The boy's hands stay still. Camera barely moves. [STYLE-HOLD]
```

### #16 · Mateo at the Table  (`Mateo` plate)
```
Slow, gentle push-in toward the boy at the table. Background children shift and eat with small idle movements, soft and out of focus. The boy is almost still — a small breath, a slight settle. Camera steady and calm; background figures move only slightly. [STYLE-HOLD]
```

### #17 · The Empty Space (match-frame to #7)
```
The faintest slow push-in, matching #7's stillness. The full room moves softly behind him, out of focus; the boy is still, hands folded, eyes down, the empty tray-spot in front of him. Calm camera; background figures move only slightly. [STYLE-HOLD]
```

### #18.5 · The Refusal (scared to take it) — NEW
```
A lunch tray is gently set on the table from the right by an unseen adult (only a hand and forearm enter frame). The boy startles slightly and lifts both hands in a small, polite refusal — leaning back a touch, eyes anxious. The hand withdraws. Background children eat, soft and unaware. Camera held still; small movements only. The hand and forearm are the only part of the giver ever seen. [STYLE-HOLD]
```

### #20 · The Tray Arrives — core image
```
A white tray slides gently into frame from the edge and is set in front of the boy — only nothing/where-a-hand-would-be; the giver is NEVER shown. The boy begins to look up at it. Busy room soft behind. Calm camera; keep the tray steady; the giver stays out of frame entirely. [STYLE-HOLD]
```

### #21 · Mateo Eats
```
Gentle hold with the faintest push-in. The boy takes small, careful bites; a little warmth returns. Full room soft and warm behind. Calm camera, small motion. [STYLE-HOLD]
```

### #22 · The Wide Pull-Back
```
Slow pull-back / gentle rise from the boy to reveal the full room of kids eating. Soft, simplified background children with small idle motion. Calm, steady; background figures move only slightly. [STYLE-HOLD]
```

---

## TWO-SHOT EDITS (cut/dissolve between TWO separately-animated plates — NOT one gen)

### The Establisher Arc — aerial → Doug  (Scott's "fly down to Doug" idea)
You can't do this in one Omni gen. Build it as two clips and cut them together:
1. Animate `Market_Aerial` with the **#2** descending-drift prompt above.
2. Animate the **Doug plate** with the **#3** push-in prompt above.
3. In the edit: cut (or soft dissolve) from the descending aerial to the push-in on Doug. Reads as one continuous "fly down to our guy" move.

### The Match-Cut — #7 ↔ #17 (the same-school engine)
Two plates, same camera by design. Animate #7 (boy, sepia) and #17 (Mateo, present) each with their near-still push-in above, then hard-cut or quick dissolve between them in the edit so the room "ages" around an unchanged hungry kid. Never one gen.

### The Transition — #15 (then→now)
`80s_School` dissolving into `Modern_School` under a held camera — an edit/comp, not an Omni move.
