# Flow Voices — design + tuning recipes

*Created 2026-05-21. Flow's default voices are too clean, too bright, too happy — they're tuned for assistants. The fix: in Edit Voice, pick a base voice for the TIMBRE, then use the **Voice Performance** field to direct the delivery (lower, slower, weathered, restrained, breath, no brightness). Paste the Sample Dialogue line to audition it in context, then Save New Voice.*

## DECISION (2026-05-21): final VO = ElevenLabs, end-to-end
The narrator is the backbone and never appears on screen — pure VO. **Final voice work is done in ElevenLabs** (Scott's established, controllable pipeline; same as the Transformer series), exported as clean audio and laid under the animatic in the edit. Flow's voices are **scratch/temp only** — fine for timing the animatic, replaced by ElevenLabs finals. This decouples VO from picture: iterate a line without touching the video; full control of pacing and texture.

Implications:
- **Frame the 5 dialogue beats (#5, #6, #10, #11, #13) so a mouth isn't square to camera** — over-shoulder, profile, looking-down, or the line over a reaction. This suits the quiet, looking-away register anyway, and removes any need for lip-sync. Omni then animates breath/body/small motion, not mouths. So ALL voices (narrator + dialogue) can go to ElevenLabs.
- ⚠️ **ElevenLabs quota is DEPLETED** — top it up before the final VO pass. (Build the animatic on Flow scratch voices meanwhile.)
- **Music is a separate decision** (Lyria in Flow, or Suno/Kie.ai) — needn't match the VO tool.

The Flow recipes below still apply as scratch tracks (and translate directly into ElevenLabs voice-design / Voice Performance prompts).

## The principle (fight "clean / happy")
In every Voice Performance, push toward: **low, unhurried, weathered, intimate, restrained.** Push away from: bright, upbeat, chipper, announced, slick, sentimental. The feeling lives UNDER the words — never let the voice perform the emotion on top of them.

## The film's register (the Transformer-novella voice)
Spare. Withholding. Short. Short. A longer line with breath in it. The single-line drop. Never explain the feeling — earn it. This governs the Narrator above all.

---

## 1 · NARRATOR — the backbone (priority)
Not a visual character — create it as a saved voice and apply to all narrator VO.
- **Name:** Narrator — Lunch Angels
- **Base voice:** Algenib (Male, gravelly, low pitch). *Alt: Charon (Male, informative, lower pitch) if you want less gravel; Alnilam (firm, mid-low) for a touch more spine.*
- **Voice Performance (paste):**
```
A quiet, weathered, lived-in voice — low and unhurried, with a little gravel and warmth worn into it. He is telling one person something true and a little sad, not announcing it to a room. Intimate and restrained: he withholds, never pushes the emotion, never sounds bright or upbeat. Long breaths and small pauses; he lets a line land and sit before the next. Plain, grounded, never slick, never sentimental. Think a tired, kind man at the end of a long day.
```
- **Sample Dialogue (paste):** `He walked back into the night, and we never learned his name.`
  *(Alt to test the harder register: "There are kids in our schools right now who aren't eating.")*

---

## 2 · THE MAN (the Lunch Angel)
- **Name:** The Man — Lunch Angel
- **Base voice:** Algieba (Male, easy-going, mid-low pitch). *Alt: Alnilam (firm, mid-low).*
- **Voice Performance (paste):**
```
Soft-spoken, gentle, a little tired — a humble man who has known hard times but isn't bitter. Mid-low and warm, unhurried, understated. Not performed, not theatrical; he almost says it to himself. A quiet dignity underneath. Never bright, never pitiful.
```
- **Sample Dialogue (paste):** `Let's get two, then. Somebody did this for me.`

---

## 3 · DOUG (the volunteer)
- **Name:** Doug — Volunteer
- **Base voice:** Algieba (Male, easy-going, mid-low) or Achird (Male, friendly, mid). *Tune older.*
- **Voice Performance (paste):**
```
A warm, kind older man, late 60s — easy and unhurried, a grandfatherly gentleness with a little age and gravel in it. Talks to everyone like an equal, leaning in, never looming, never salesy. A small smile in the voice, genuine. NOT bright or chipper — settled, real, and a touch slow.
```
- **Sample Dialogue (paste):** `This one feeds a kid for a week. Ten dollars buys a child their lunch.`

---

## 4 · CHILD — cold open (one line)
- **Name:** Child — Cold Open
- **Base voice:** the softest, youngest-sounding base available (scroll for a child voice; if none, a soft high voice directed small and young).
- **Voice Performance (paste):**
```
A small, quiet 8-year-old boy. Matter-of-fact, not sad, not performing — he's just stating something he doesn't fully understand. Soft, plain, a little flat. No drama, no cuteness, no upward chirp. Almost a whisper.
```
- **Sample Dialogue (paste):** `I didn't eat lunch today. My mom said I shouldn't.`
- **NOTE:** synthetic child voices often ring false. For this one line, strongly consider recording a real ~8-year-old — it's eight seconds and it's the open. A real kid here is worth more than anything synthetic.

---

## Where these get used
- **Narrator:** #2, #4, #14, #15, #16, #17, #18, #19(read), #20, #21, #22, #24 (most of the film).
- **The Man:** #6, #10, #13.
- **Doug:** #5, #11.
- **Child:** #1 only.
- The Boy, Mateo, the Giving Machines: no spoken lines.
