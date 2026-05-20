# Lunch Angels — Style Canon

*Locked 2026-05-19. The one rule that governs every generated still.*

## The look, named

**Cel animation over painted backgrounds** — the traditional hand-drawn animation
method (the Studio-Ghibli convention). Two layers, deliberately different, composited:

- **Layer 1 — Background:** loose impressionist **watercolor + gouache**. Soft,
  atmospheric, low-detail. Objects (windows, tables, buildings, crowds) are
  *suggested* with washes and color — no crisp outlines, no fine detail. Background
  figures are dark soft silhouettes, no faces. A painting set behind the actors.
- **Layer 2 — Main characters:** clean **cel animation** drawn *on top* — confident
  ink linework, flat color fills, simple soft shading, expressive-but-simple
  features. Target reference: **CHAR STYLE — The Man Close-Up.**

## The rule that makes it work — figure–ground separation

> **The character always carries more line definition and sharper edges than the
> background. The background is always looser and less-detailed than the character
> on it. If character and background read at the same level of detail, it's wrong —
> loosen the background.**

This is the difference between the two reference tiles:
- **The Man Close-Up** = correct. Crisp cel character pops off soft painted bokeh.
- **Boy in Cafeteria** = character is right, but the background (windows, boards,
  tables) is rendered at character-level detail, so figure and ground fuse. Fix the
  *background*, not the boy.

## Reference tiles (already split this way in the tool)

- BG STYLE — Village Establishing · Giving Machines · Wet Street Bokeh
- CHAR STYLE — Doug + Man Two-Shot · **The Man Close-Up** (char target) · Boy in Cafeteria

## Applied

The two-layer rule is appended to the `chatgpt_prompt` of all 19 illustrated shots
(skipped: #1 audio, and the typography/edit comps #15/#19/#23/#24).

## Open

- **Regenerate the "Boy in Cafeteria" style ref** with a looser background so the
  reference itself models the rule (right now it teaches the failure mode).
- Update the on-board "How to use these in Flow" text to state the figure–ground
  rule (requires a worker deploy — the first deploy from this repo).
