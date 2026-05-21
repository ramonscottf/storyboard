# FLOW SHOTS — frame + motion + audio build list (2026-05-21)

*This is the bridge from "pile of locked art" to "a 3:00 film." It pairs the locked SHOTLIST.md with the new Flow video mechanic (post Google I/O 2026). Motion prompts were 0/24; this drafts all 24.*

## How video is made in Flow now (post I/O 2026 — verified 2026-05-21)

The May 19 2026 update changed the answer, and it's in our favor:

- **Gemini Omni Flash** — "Nano Banana, but for video." Animates from inputs and, critically, **preserves character identity AND voice across every scene.** Available to all Google AI subscribers globally. This kills our single biggest risk: characters drifting shot to shot.
- **Images are ingredients + frames for video.** You hand Veo/Omni a **start frame** (and optionally an **end frame**) and it animates between them. Our entire pre-build strategy — locked characters, watercolor plates, the machine asset, composited key frames — is *exactly* the input the new Flow wants. Nothing we built is wasted.
- **Flow Agent** — a workhorse, not a director. Great for batch-applying edits, generating variations, organizing/renaming assets into collections. (This is the "Gemini" that felt unhelpful as a creative partner — because taste comes from us / the locked docs; the Agent is for grunt work.)
- **Flow Tools** — vibe-coded custom tools (Storyboard Studio is one of these).
- Since Feb 2026: in-shot **camera moves** (pans/zooms) and **object removal** are built in.

**Our method, therefore:** (1) compose each shot's start frame from locked assets, (2) load the relevant locked characters as **ingredients** so Omni holds identity, (3) animate with a restrained motion/camera prompt, (4) layer VO + music. Build frames first (our strength), then animate.

## Global motion principle (Scott's rule, applied)

Motivated, restrained camera; in-world motion; **no gimmick reveals** — no curtain/letter-rise/halo/ken-burns. Heroes stay still; the world breathes (snow, breath-fog, glow, soft crowd drift). Emotional beats get tight isolating frames, not busy wides.

## Character wardrobe = the recognition engine (locked 2026-05-21)

- **Mateo = RED hoodie, GREEN backpack, dark eyes** — present day, modern cafeteria. Visually his own person.
- **The Boy = GREEN crewneck, BLUE backpack, hazel eyes** — 1980s flashback, old cafeteria.
- **The Man = GREEN hoodie, the SAME BLUE backpack, hazel eyes** — Ogden night. He carries the backpack he had as the Boy.
- The green + the blue backpack are the match-cut device: when we cut Man→Boy (#6→#7) and in the loop (#23), the color + pack land the recognition in a single frame, before the face registers.

## The 24-shot build

Frame key: **LOCKED** = winner exists · **REFRESH** = exists but predates final Man/v4 style, rebuild · **COMPOSITE** = assemble from listed assets · **CARD** = text/edit · **COMP** = edit-room assembly (no gen).

**1 · Cold Open · 0:00–0:08 · COMPOSITE** (Mateo's folded hands, modern caf, or open on black)
- Motion: hold on black ~2s, slow fade up to Mateo's still folded hands on an empty table; faint breath. Almost no camera.
- Audio: *Child V.O.:* "I didn't eat lunch today. My mom said I shouldn't."

**2 · Wide Establishing — The Village · 0:08–0:16 · LOCKED** (village wide plate)
- Motion: very slow dolly-in toward the glowing machines; falling snow; soft crowd drift; string-lights shimmer faintly; breath-fog.
- Audio: *Narrator:* "A few years ago, on a cold night in Ogden, a man walked up to the Giving Machines."

**3 · Doug at the Machines · 0:16–0:22 · COMPOSITE** (Doug parka + machine asset dropped into a village plate)
- Motion: Doug adjusts his gloves, breath-fog; machine glow pulses softly; gentle push.
- Audio: —

**4 · The Approach · 0:22–0:30 · REFRESH** (final Man: green hoodie, blue backpack, dignified — three-quarter back, walking in)
- Motion: Man walks slowly toward the machines from mid-ground; camera eases in behind him; snow, breath-fog.
- Audio: *Narrator:* "He didn't look like he had much. But he had walked a long way to get there."

**5 · Two-Shot at the Machine · 0:30–0:38 · REFRESH** (Man + Doug, two-shot at machine)
- Motion: Doug turns to the Man, gestures to a card on the machine; Man follows the gesture. Omni lip-sync on Doug.
- Audio: *Doug:* "This one feeds a kid for a week. Ten dollars buys a child their school lunch."

**6 · The Recognition · 0:38–0:46 · REFRESH** (tight on the Man's face — hazel eyes)
- Motion: his gaze lowers; a flicker of memory crosses; very slow push to the eyes; hold. (Cut hinge → #7.)
- Audio: *Man (quiet):* "Somebody did that for me once."

**7 · The Boy — Flashback (1980s) · 0:43–0:46 · COMPOSITE — KEYSTONE** (Boy green/hazel + old cafeteria + tray asset)
- Frame: start = Boy alone at the table, empty space, tray entering frame edge; end = tray placed, Boy looking up. Let Omni interpolate the slide. Warm sepia.
- Motion: tray slides in from off-frame; Boy looks up; hold one beat on his hazel eyes (match the Man's). ~3s.
- Audio: — (silence/ambient — let the eyes land).

**8 · He Walks Away · 0:46–0:52 · LOCKED**
- Motion: Man turns and walks from the machines into the crowd; camera holds; snow.
- Audio: —

**9 · Boots in the Snow · 0:52–0:58 · LOCKED**
- Motion: low angle, boots stepping through slush, light reflecting in the wet; slow.
- Audio: —

**10 · The Bill · 0:58–1:04 · COMPOSITE** (Man's hand offering the folded $20 asset toward Doug)
- Frame: start = hand entering with folded bill; end = bill extended at Doug. Overlay the real $20 detail isn't needed — keep it folded/loose.
- Motion: hand extends the folded bill into frame; Omni lip-sync on the Man.
- Audio: *Man:* "I want to buy the lunches. Will you take cash?"

**11 · Doug's Reaction · 1:04–1:10 · REFRESH** (Doug, apologetic)
- Motion: Doug pats his coat pockets, small apologetic head-shake; speaks.
- Audio: *Doug:* "I'm sorry — I don't have change for a twenty."

**12 · The Pause · 1:10–1:16 · REFRESH** (Man, the beat of decision)
- Motion: Man looks at the bill, then up at the machine; the smallest breath; hold.
- Audio: —

**13 · Let's Get Two · 1:16–1:24 · REFRESH** (Man, resolved, a trace of warmth)
- Motion: the faintest nod; he presses the bill forward; speaks the title line.
- Audio: *Man:* "Let's get two, then. Somebody did this for me."

**14 · Walking Into the Light · 1:24–1:32 · LOCKED**
- Motion: Man walks away into the warm village lights, back to camera; lights bloom gently (soft, not gimmicky); snow.
- Audio: *Narrator:* "He walked back into the night, and we never learned his name."

**15 · Transition — From Then to Now · 1:32–1:38 · COMP** (edit-room cross-dissolve)
- Motion: dissolve village warm light → modern-caf warm light, AND the Boy's full tray → Mateo's empty space. No gen.
- Audio: *Narrator:* "His story is the reason we tell this one."

**16 · Mateo at the Table · 1:38–1:48 · REFRESH** (Mateo red final + modern caf)
- Motion: settle on Mateo at the table, hands folding; soft room behind; slow push.
- Audio: *Narrator:* "This is Mateo. He's eight. He's in a Davis County classroom right now."

**17 · The Empty Space · 1:48–1:56 · COMPOSITE** (Mateo red, intimate, the empty space emphasized — tight, isolating)
- Motion: very slow push from the empty space to Mateo's still hands; minimal.
- Audio: *Narrator:* "Mateo's family is behind. Not by much. By enough. // And they have decided — the way frightened people decide things — that it is safer for him to be hungry than to be seen. // So he folds his hands. He waits out the lunch hour. He's good at it."

**18 · The Other Kids · 1:56–2:02 · COMPOSITE** (Mateo among many, modern caf — keep him findable)
- Motion: slow widen revealing other quiet kids; subtle.
- Audio: *Narrator:* "He's not the only one. In Davis County, one in seven kids carries an unpaid lunch balance." ⚠️ FACT-CHECK the figure before final.

**19 · The Numbers · 2:02–2:12 · CARD**
- Frame: clean text over soft caf bg or the tray — "$10 a week · $40 a month · $360 a year."
- Motion: text settles simply (gentle, no gimmick).
- Audio: *Narrator:* "Ten dollars buys a week. Forty, a month. Three hundred sixty dollars buys a child a year of lunches they would not otherwise eat."

**20 · The Tray Arrives · 2:12–2:20 · COMPOSITE — core image** (Mateo red + tray asset; the giving hand ALWAYS off-frame)
- Frame: start = empty space before Mateo; end = tray placed, Mateo looking up. Hand never enters — the hand is the audience.
- Motion: tray slides in from off-frame; Mateo looks up; carefully concealed relief.
- Audio: *Narrator:* "Somebody slides a tray in front of him. He doesn't see who. He never will. // That's the point."

**21 · Mateo Eats · 2:20–2:28 · REFRESH** (Mateo red)
- Motion: Mateo eats — small, careful; warmth returns to the frame.
- Audio: *Narrator:* "No one called his parents. No one said his name. He just got to eat."

**22 · The Wide Pull-Back · 2:28–2:38 · COMPOSITE** (wide modern caf, Mateo one of many)
- Motion: slow pull-back revealing a room full of kids we never met.
- Audio: *Narrator:* "There are kids in our schools right now who aren't eating. Not because food isn't there. Because shame is."

**23 · The Loop — Three Faces · 2:38–2:46 · COMP — NEW** (Mateo eating → the Boy eating → the Man's face)
- Motion: three slow dissolves between the faces; the green + blue backpack tie Boy↔Man; hold last on the Man.
- Audio: — (music swell).

**24 · Be the Someone · 2:46–3:00 · CARD**
- Frame: "Be the someone." + **daviskids.org/lunch-angels** (overlay the clean wordmark in post).
- Motion: still, simple.
- Audio: *Narrator:* "Be the someone. daviskids.org/lunch-angels." + music resolves.

## What still needs to be GENERATED to get video going

1. **Frames** (all composites of assets we already have): #1, #3, #7 (keystone), #10, #17, #18, #20 (core), #22; cards #19, #24; comps #15, #23.
2. **Refresh the Man's Act-1 frames** to the final Man (green + blue backpack, dignified) and v4 style: #4, #5, #6, #11, #12, #13, #16, #21. Several "locked" stills predate the final character.
3. **Audio — none built yet.** Narrator V.O. (the #1 missing piece, ~12 shots), Doug's voice (#5, #11), the child cold-open line (#1), a music bed, ambient/SFX. Omni preserves a voice once defined; narrator/Doug voices still need to be made (Flow voice, or external — note: our ElevenLabs quota is depleted).

## Recommended first test shot (vertical slice)

**Shot #2 (village establishing).** Lowest risk — no character lip-sync — and it proves the watercolor look survives motion. Animate the locked village wide with: *"Slow cinematic dolly-in toward the glowing red machines at left; gentle falling snow; soft drift of the background crowd; string-lights shimmer faintly; breath-fog; hold the loose watercolor look, no style change."* If that holds, graduate to a character shot (#7 the keystone is the real test of Omni identity consistency).
