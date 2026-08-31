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
