# Site image slots (hero, problem, about) — GPT Image prompt kit

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
