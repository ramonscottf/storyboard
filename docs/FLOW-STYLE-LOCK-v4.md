# FLOW STYLE LOCK — v4 (THE style, locked 2026-05-20)

*Supersedes v2 and v3. This is the current truth, proven in production: characters, the Giving Machine asset, both cafeterias, and a full multi-angle village set were all generated against this. Read this before generating anything.*

## The one-sentence rule

**Two layers, two mediums, in deliberate contrast: clean traditional 2D cel-animation CHARACTERS sitting ON TOP of loose hand-painted WATERCOLOR worlds.** The characters are crisp and simple; the world is soft and painterly. The gap between them is the look, not a bug. Reference feel: a tender modern animated short / "A Shower of Heavenly Blessings."

This corrects the mistake we kept making this session: rendering characters *in* watercolor. Characters are NOT watercolor. Only backgrounds are.

## How it's set up in Flow

- Storyboard Studio (the community Flow Tool) → Style dropdown → **Create custom style** named **"Lunch Angels Storybook."** There is no "Storybook" preset; Custom is required. (Presets offered: 3D-Animation, Charcoal, Claymation, Concept-Sketch, Realistic — all wrong.)
- Characters are built one at a time in Flow's native **Characters** builder (URL .../characters), NOT via Storyboard Studio's auto-extract. Model: **Nano Banana 2** (holds 5 characters / 14 objects consistent). Each character is a reusable asset.
- Note: Storyboard Studio is a third-party Flow Tool ("created by another person"), built on Google's models (Gemini parse, Nano Banana render, Veo/Omni Flash motion). Its quirks are the tool author's, not Google's.

## BLOCK A — the project Style (paste into the "Lunch Angels Storybook" custom style)

This governs every BACKGROUND. It is scene-agnostic on purpose — no snow/Christmas/night baked in, so it works for the cafeterias and end card too. Per-scene content lives in each location's own description.

```
Traditional hand-painted watercolor on textured cold-press paper. Visible paper tooth and grain throughout. Transparent, layered washes that let lighter layers and the paper glow through; soft wet-into-wet bleeds, feathered edges, gentle blooms and backruns, occasional dry-brush texture, granulating pigment in the shadows. Forms are defined by tonal washes and a faint, loose graphite under-drawing — minimal soft linework, never bold outlines. Edges range from crisp on the focal subject to dissolving-soft at the periphery and into the distance. NEVER flat digital color, cel-shading, vector outlines, 3D render, or photo-realism.

Palette logic: a predominantly cool, muted, slightly desaturated base of earthy and slate tones. Warmth is rare and concentrated — it appears ONLY at genuine light sources and whatever they touch, glowing against the cool surroundings. Whites are always tinted (cream, pale blue, warm grey), never pure white. Shadows are colored — blue and violet — never black. Soft, low contrast across a wide value range.

Light logic: soft, diffuse, atmospheric. Light pools and falls off gently, reflects warmly on wet or polished surfaces, and a faint haze softens everything in the distance.

Finish: a tender storybook-illustration finish — readable, gently simplified shapes, more suggestion than rendering, slightly imperfect and hand-touched, never slick. The midground subject is the most resolved; foreground and far background stay looser.

Background people: soft, simplified, semi-silhouette figures whose posture and gesture carry the read; faces minimal or omitted; muted clothing with at most a single small accent color; painted as washes that go darker and cooler near the viewer, paler with distance. They are atmosphere and life, never competing with the focal subject — but the world should feel ALIVE and busy (vendors, shoppers, families, kids), not empty.

Mood: warm, nostalgic, reverent, quietly magical — the tenderness of a classic illustrated plate.
```

## BLOCK B — the shared CHARACTER style (paste at the END of every character prompt)

This is the OTHER layer — the crisp cel character. Because we prompt each character standalone, this block goes into every one so they match without a reference. The load-bearing lines are "very few lines / no texture" and "show hardship only through tired kindness."

```
Render as a soft, gentle, traditional 2D cel-animation cartoon in a warm children's-book style: rounded simple forms, soft thin linework, flat warm color with soft simple shading, minimal surface detail, soft cheeks. EYES small and SIMPLE — a small round iris and pupil, gentle and warm, at most a tiny soft highlight; never big anime eyes, never realistic eyes. Tender, kind, dignified. NOT detailed, NOT gritty, NOT semi-realistic, NOT heavily outlined, NOT graphic-novel, NOT anime, NOT 3D, NOT photoreal, NOT watercolor. The character is the crisp, clearly-drawn cel layer meant to sit ON TOP of a soft watercolor world — cleaner and more defined than any painted background (contrast in forms), but the character himself stays soft and simple, very few lines, no texture. Soft pale neutral background for the model sheet.
```

## The triptych model-sheet template (Flow Characters builder gives you this)

Keep the template, fill the bracket with the character's body/outfit + Block B:

```
Full-body triptych, three distinct views: front facing, 3/4 side view, and back view. High resolution, flat studio lighting, consistent anatomical proportions across all views, solid white background. [DESCRIBE BODY AND OUTFIT]
```

Warning: that template's "high resolution / consistent anatomical proportions" wording nudges toward realism — Block B's softness must dominate it, so paste Block B in full.

## Hard-won lessons this session

- **Adults drift gritty.** "Weathered, worn, scuffed, lean, hard year, beard" all pull the model to detailed semi-realism / graphic-novel. The fix: describe hardship ONLY through soft tired kindness, render the beard as a flat soft shape (not stranded/textured), and lead with "very few lines, no texture, match the soft children's-book hand."
- **Nose convention must match across the cast.** Decision: minimal noses everywhere — a faint soft suggestion, NOT a drawn nose with a bridge. (Mateo is the standard; adults match him.)
- **Reference images beat text** for matching an adult to the established child hand. If a character won't converge on text alone, attach the locked Mateo sheet as a reference in the Characters builder.
- **8-panel scene grids drift/shrink.** For multi-angle background coverage, do 4 angles per generation and run twice.
- **Compositing:** crisp characters dropped onto very loose watercolor can read pasted-on. A hair of softening on the character + a soft light-wrap/contact-shadow marries them.

## Watercolor calibration

Of the early village tests, the LOOSER watercolor (soft, paper-textured, breathing room) is correct — it sits under the cel characters without competing. Avoid the richer/busier, more-saturated watercolor; it fights the simple characters. The cafeterias currently render a touch tighter than the village plates — nudge them looser to match the village hand.
