# Lunch Angels — LOCKED Character Style (Flow rebuild v2)

*2026-05-19. The fix for eye-drift and style-drift. EVERY character uses the IDENTICAL style block below, verbatim. Generate on Nano Banana Pro. Style dropdown: Storybook.*

## Why we're rebuilding
First pass drifted: Mateo had black-dot eyes, Doug had dot+catchlight, the Man went near-lifelike. Three different idioms in one film = broken. This time the eyes and rendering are pinned and shared.

## THE LOCKED STYLE BLOCK (paste into EVERY character's Visual Description, after their unique features)

> RENDER STYLE (identical for every character in this film): 2D hand-drawn animation, leaning ANIMATED not lifelike — think Studio Ghibli / modern storybook. Clean confident ink linework, flat color fills with soft cel-shading, crisp edges. NOT photorealistic, NOT 3D, NOT semi-realistic. EYES — THE MOST IMPORTANT RULE: large, expressive ANIMATED eyes drawn in the Ghibli tradition — a clearly defined colored iris (brown/hazel as specified), a round dark pupil, and ONE small white catchlight. NEVER tiny black dots. NEVER photorealistic human eyes. Same eye treatment on every single character. Simple soft eyebrows. Gentle facial features, slightly stylized, warm. Real-proportioned bodies (not chibi, not exaggerated), but faces are drawn animated and soft. Soft cheek blush. Hair as clean shaped masses, not individual strands. Plain neutral cream paper background for the model sheet.

## Per-character: ONLY the unique line changes
Keep the locked block identical. Swap only the description sentence + clothing.

| Character | Unique visual line | Eye color (locked) |
|---|---|---|
| **Mateo** | 8yo boy, soft round face, short brown hair, quiet careful expression. Present-day, brighter tone. | warm BROWN |
| **The Man** | mid-40s, lean, weathered-but-gentle face, short dark beard flecked grey, tired kind eyes. | warm HAZEL |
| **The Boy** | 8yo boy, 1980s, short brown hair, hopeful. Identical eye shape/color to The Man. | warm HAZEL (match the Man) |
| **Doug** | late 60s, white short beard, soft smile lines, warm grandfatherly face. | warm BROWN |

## The hazel link (the engine)
The Boy and The Man MUST share the exact eye color and shape — that recognition IS the film. When generating the Boy, if Flow allows a character reference, point it at the Man's eyes. Generate the Man FIRST, lock him, then build the Boy to match.

## Build order (slow + locked)
1. Mateo (he's the emotional center; lock the eye treatment on him first as the template)
2. The Man (lock the hazel)
3. The Boy (match the Man's hazel exactly)
4. Doug
5. Giving Machines (object — separate spec)
Generate → eyeball against this spec → if eyes drift, regenerate with "larger animated Ghibli-style eyes with a colored iris and one catchlight, never black dots" → only then move to the next character.
