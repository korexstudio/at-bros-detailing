# Wash-sequence stage images — GPT Image prompt kit

Four photoreal stills for the home page's scroll-scrubbed wash sequence.
Generate them, drop them into `public/stages/`, redeploy — the layers pick
them up automatically (no code changes). They are placeholders like
everything else: the launch gate still requires the owner's real photos
before production.

## Consistency rules (read first)

1. **Generate all four in one session/thread** so the model can reference
   its own prior images. After the first image comes out right, start each
   later prompt with: *"Same car, same garage, same camera position and
   lens as the previous image."*
2. Keep the **base description block identical, word for word**, in all
   four prompts. Only the STAGE paragraph changes.
3. Aspect ratio **3:2 landscape**, largest size available (the layer crops
   to fill the viewport; keep the car centered with breathing room).
4. If a stage drifts (different car/wheels/angle), regenerate that stage
   only, again referencing "the previous image".

## Base block (identical in every prompt)

> A black executive sedan, side profile facing right, photographed in a
> dark professional detailing studio. Low-key cinematic lighting, single
> large softbox above, dark charcoal floor with subtle reflection,
> near-black background with gentle vignette. Camera at door-handle
> height, 85mm lens, f/4, entire car in frame with space around it.
> Moody, premium automotive advertising photography. No people, no text,
> no logos, no watermarks.

## The four prompts

### 1 → save as `public/stages/wash.jpg`

Base block, then:

> STAGE: The car is dirty from real-world driving — a dull film of road
> grime over the paint, dust and dried water spots on the lower panels
> and wheels, no shine. The dirt is realistic and even, not mud-caked.

### 2 → save as `public/stages/decontaminate.jpg`

Base block, then:

> STAGE: The same car mid-wash, covered in thick white foam. Dense snow
> foam blankets the hood, roof, and upper body panels, with foam running
> down the doors in streaks. The foam is bright white against the dark
> scene.

### 3 → save as `public/stages/protect.jpg`

Base block, then:

> STAGE: The same car freshly washed and ceramic-sealed. Deep glossy
> black paint with mirror-like reflections, thousands of small water
> beads standing on the hood and roof, one elegant specular highlight
> running along the shoulder line.

### 4 → save as `public/stages/interior.jpg`

Base block, then:

> STAGE: The same car with the front door open, interior lit by warm
> amber ambient light. Pristine black leather seats with visible
> stitching, spotless dashboard and carpets, the warm cabin glow
> spilling onto the dark floor. Exterior stays dark and glossy.

## Dropping them in

1. Save the four files with the exact names above (`.jpg`, `.png`, or
   `.webp` all work) into `public/stages/`.
2. `git add public/stages && git commit && git push` — the deploy picks
   them up; each wash-sequence layer swaps its illustration for the image.
3. Delete any stage file to fall back to the illustrated surface for that
   stage.

---

# Site-wide image slots (hero, problem, about)

Same drop-in mechanic, three more spots. Atmosphere images may be
generated; the Gallery and Before/After strip stay REAL-photos-only —
they are proof surfaces, and proof is never generated.

Use the same base block as the stages for the first two (same car, same
studio, generate in the same thread).

### Hero → save as `public/hero/hero.jpg`

Base block, then:

> COMPOSITION: The sealed, glossy car positioned in the right two-thirds
> of the frame, front three-quarter view, nose angled toward camera.
> The left third is near-black negative space for a headline. Extra
> moody: deeper shadows, one specular highlight along the body,
> subtle reflection on the dark floor. Landscape 16:9.

(The site darkens the lower half with a gradient and applies a slow
Ken Burns drift automatically — keep the car's roofline in the upper
half of the frame.)

### Problem section → save as `public/sections/problem.jpg`

Base block, then:

> STAGE: Close crop of the dirty car's rear quarter panel and wheel —
> road grime film, dried spray streaks, dull paint with visible swirl
> marks under a harsh raking light. Gritty but composed. Landscape 3:2.

### About page → save as `public/sections/about.jpg`

Different subject — no car needed, and deliberately NO PEOPLE'S FACES
(we never fabricate the founders):

> Macro still life in a dark detailing studio: gloved hands working
> thick white foam over black paint with a wash mitt, microfiber towels
> and detailing bottles softly out of focus behind. Warm practical
> lighting, shallow depth of field, premium editorial feel. No faces,
> no logos, no text. Landscape 3:2.

## Dropping them in

Create the folders if needed, then commit and push as usual:

```
public/hero/hero.jpg
public/sections/problem.jpg
public/sections/about.jpg
```

Keep files under ~300KB each (export WebP or let the maintainer convert).
Delete a file to revert that slot to its labeled placeholder.
