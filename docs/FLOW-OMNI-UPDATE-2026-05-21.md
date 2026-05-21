# Google Flow — I/O 2026 update & what it changes for Lunch Angels

*Captured 2026-05-21 (Scott + Skippy). Source: Google I/O 2026, May 19–20 2026.*
*Primary source: blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates/*

## The headline: Gemini Omni Flash

Google's framing: Omni Flash is "like Nano Banana, but for video" — a model that creates from any input, starting with video, combining Gemini's intelligence with the generative-media models. It is a leap in world understanding, multimodality, and **precise video editing**, and critically: **"Omni Flash improves character consistency, meaning identity and voice are preserved across every scene."** It lets you blend real-world inspiration with generated content and iterate conversationally. Available in Flow to Google AI subscribers globally.

### Why this matters to THIS film
1. Character + voice consistency across scenes is the exact thing our recognition thread (Boy↔Man) and our cel-on-watercolor compositing needed. The model now does the "don't drift" work.
2. Image-to-video on our locked stills: bring a finished still in as an ingredient, hold identity, direct motion by conversation instead of one-shot prompts.
3. Voice consistency: once the Narrator and Doug voices exist, Omni keeps them stable shot to shot.

## The other I/O 2026 Flow changes

- **Flow Agent** — a creative partner that plans/reasons through tasks under your control: brainstorm dialogue for a scene, make plot recommendations, create multiple variations at once, **batch edit so a tweak reflects across all assets**, and organize/rename the asset library. Free to ALL Flow users globally.
- **Flow Tools** — natural-language bespoke tools/workflows (image editor, resizer, custom shaders), no code, shareable + remixable. NOTE: the "Storyboard Studio" we've been using IS a community Flow Tool; the official Flow workflow now covers most of it natively.
- **Flow Music (Lyria 3 Pro)** — section-by-section song editing; "covers" (restyle a full track keeping melody/structure); **music-video creation via Omni**. This is our SCORE path now (ElevenLabs quota is depleted anyway).
- **Mobile apps** — Flow on Android (beta; iOS coming), Flow Music on iOS (Android coming). Web remains the full-feature platform.

## Underlying stack (for reference)
- Video model under Flow: **Veo 3.1**. Image: **Nano Banana / Nano Banana Pro** (Pro for paid) + Imagen.
- Earlier-2026 Flow changes already in play: dedicated Images tab, doodle prompting, combine multiple images + style references into one cohesive scene, `@` to reference library assets, image-to-video.

## The finish-plan change (see FLOW-PIPELINE.md → "MOTION & FINISH")
Old: stills → composite → Veo motion prompts (0/24).
New: finalize stills → Omni Flash for motion (identity/voice held, conversational) → Lyria 3 Pro for score → assemble → VO + SFX + end card.

## Open / to verify
- 1–2 shot Omni test: does it hold the cel-on-watercolor look in motion vs. the old composite path? Recommended before committing the whole film.
- ✅ Tier confirmed: Scott is on Google AI **Ultra** — covers Omni Flash, Nano Banana Pro, Lyria 3 Pro.
