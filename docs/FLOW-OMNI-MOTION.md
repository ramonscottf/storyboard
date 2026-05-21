# Lunch Angels — Flow Omni MOTION prompts (the animation companion)

*Created 2026-05-21. Companion to CHATGPT-PROMPTS.md (which makes the STILLS). This doc is for turning each locked still into MOTION in Google Flow Omni Flash.*

## HOW OMNI WORKS HERE (read first — saves regenerations)
- **This Omni build animates ONE image + a text description.** It does NOT do start-frame→end-frame interpolation in this mode.
- Therefore: **a motion prompt can only describe motion that stays inside ONE plate.** You CANNOT fly from the aerial down to Doug in one generation — those are two different images/cameras. Big camera journeys between two plates are a **TWO-SHOT EDIT**, not one gen.
- **Describe MOTION ONLY.** Same discipline as the stills: the image carries the look; the words carry the movement. Do NOT re-describe watercolor/characters/wardrobe.
- **Smallest move that feels alive wins.** Omni holds character + scene consistency beautifully when the camera is calm; it warps faces and melts crowds when you ask for big/fast moves. Gentle push-ins and drifts are the safe, cinematic default.
- **First gen: run it close to as-written, see Omni's defaults, THEN correct.** Don't over-tune blind.

## UNIVERSAL SAFETY ADD-ONS (append when needed)
- Crowd morphing → `background figures move only slightly, no large motions.`
- Hero hands/props drifting → `the boy's hands stay folded and still.` / `keep the tray steady.`
- Snow going blizzard → `light, slow snowfall.`
- General → `camera calm and steady; no fast moves.`

---

## SINGLE-IMAGE MOVES (one plate, one generation)

### #2 · Wide Establishing — the Village  (`Market_Aerial`)
```
Slow aerial drift over the snowy market, gently descending toward the square. People move below in soft, out-of-focus little motions. String lights twinkle, snow falls slow. Calm, no fast moves. Distant figures move only slightly.
```

### #3 · Doug at the Machines  (Doug plate)
```
Gentle push-in settling on Doug standing before the glowing machines. Crowd soft and out of focus behind him, snow drifting, warm lights flickering. Doug nearly still — a small breath, a slight settle. Camera calm.
```

### #4 · The Approach  (`The_MAN` from behind)
```
Slow follow behind the Man as he walks toward the glowing machines across the snow; gentle forward drift. Snow falling, breath-fog, lights swaying faintly. Steady, unhurried.
```

### #5 · Two-Shot at the Machine
```
Hold, near lock-off. Doug gestures slightly toward a card; the Man's eyes follow. Breath-fog between them, snow drifting, warm glow flickering. Tiny natural movements only — no big motion.
```

### #6 · The Recognition (hinge into #7)
```
Very slow push-in on the Man's face. His gaze lowers and goes inward — a small, quiet flicker of memory. Snow soft behind him, glow steady. Almost still; a held breath.
```

### #10 · The Bill
```
Hold steady. The Man's hand extends the folded twenty toward Doug; small, sincere. Snow drifting, glow warm. Keep the bill steady; minimal other motion.
```

### #11 · Doug's Reaction
```
Hold on Doug. A small apologetic look, a slight head-shake, a hand patting his pocket. Snow soft, glow warm. Gentle, rueful, calm camera.
```

### #12 · The Pause
```
Near-still. The Man looks down at the bill, then up toward the machine — the beat before deciding. Snow drifting. Very small movement, calm camera.
```

### #13 · Let's Get Two (title line)
```
Hold. The Man presses the folded bill forward to Doug; Doug receives it, meeting his eyes. Warm glow, snow. Quiet, small motion only.
```

### #7 · The Boy (flashback) — KEYSTONE  (`The_BOY` plate)
```
Almost completely still — a memory held. The faintest slow push-in. The teal tray slides gently into frame from the right, placed by no one we see; the boy looks up a touch. Warm sepia light, soft dust in the air. The boy's hands stay still. Camera barely moves.
```

### #16 · Mateo at the Table  (`Mateo` plate)
```
Slow, gentle push-in toward the boy at the table. Background children shift and eat with small idle movements, soft and out of focus. The boy is almost still — a small breath, a slight settle. Camera steady and calm; background figures move only slightly.
```

### #17 · The Empty Space (match-frame to #7)
```
The faintest slow push-in, matching #7's stillness. The full room moves softly behind him, out of focus; the boy is still, hands folded, eyes down, the empty tray-spot in front of him. Calm camera; background figures move only slightly.
```

### #18.5 · The Refusal (scared to take it) — NEW
```
A lunch tray is gently set on the table from the right by an unseen adult (only a hand and forearm enter frame). The boy startles slightly and lifts both hands in a small, polite refusal — leaning back a touch, eyes anxious. The hand withdraws. Background children eat, soft and unaware. Camera held still; small movements only. The hand and forearm are the only part of the giver ever seen.
```

### #20 · The Tray Arrives — core image
```
A white tray slides gently into frame from the edge and is set in front of the boy — only nothing/where-a-hand-would-be; the giver is NEVER shown. The boy begins to look up at it. Busy room soft behind. Calm camera; keep the tray steady; the giver stays out of frame entirely.
```

### #21 · Mateo Eats
```
Gentle hold with the faintest push-in. The boy takes small, careful bites; a little warmth returns. Full room soft and warm behind. Calm camera, small motion.
```

### #22 · The Wide Pull-Back
```
Slow pull-back / gentle rise from the boy to reveal the full room of kids eating. Soft, simplified background children with small idle motion. Calm, steady; background figures move only slightly.
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
