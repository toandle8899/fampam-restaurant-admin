# Food Sticker Prompts — Source of Truth

All food stickers used as menu hover-cursors are generated with the master prompt below. Save each output PNG to `src/assets/food/{slug}.png` (transparent, 1024×1024). Imports are wired in `src/components/sections/Menu.tsx`.

---

## Master Prompt (paste into Gemini Nano Banana Pro)

```
A single [DISH NAME] illustrated as a die-cut sticker, drawn in the style
of Moebius (Jean Giraud) and 1970s French-Belgian ligne claire sci-fi comics.

ART STYLE — strict:
- Uniform, delicate black ink outlines of consistent weight (ligne claire).
  No variable line weight, no sketchy strokes.
- Shading done ONLY with hand-drawn stippling (dense clusters of black ink
  dots) and fine cross-hatching. Vintage offset-print halftone texture.
- Absolutely NO digital airbrushing, NO smooth gradients, NO glossy 3D
  render, NO drop shadows, NO glow, NO Memphis-style shapes.
- Flattened perspective, slightly surreal, serene, tactile — like it was
  printed on matte newsprint in 1978.

COLOR PALETTE — desaturated vintage, limited:
- Deep ocean blue #1D70B8, warm pale yellow #FDE073, vibrant pink #FF6B9E,
  muted lilac #A08496, forest herb green #2F5C3E.
- Use 2–3 of these as flat fills under the linework. Leave large areas of
  the off-white paper showing through. No pure black fills, no neon.

SUBJECT — render the dish as realistically recognizable as possible while
staying inside the style above:
- [SHORT DESCRIPTION OF THE DISH]
- Composed as a single hero object, centered, ~3/4 top-down angle.
- Garnishes and steam wisps drawn with the same stippled linework.

OUTPUT — sticker-ready:
- Transparent background (PNG, alpha channel).
- Subject fills ~85% of the square canvas, generous breathing room, no crop.
- 1024×1024, square.
- No text, no logos, no watermark, no border, no plate-edge cutoff.
```

---

## Dish slot table

| Slot | Dish | Short description |
|---|---|---|
| `neo-pho` | The 48-Hour Neo-Pho | deep bowl of clear amber broth, flat rice noodles, thinly sliced pink ribeye, star anise floating, sprig of Thai basil, curl of steam |
| `wagyu-carpaccio` | Wagyu Beef Carpaccio | overlapping rosy-pink seared A5 wagyu slices on a slate-grey plate, micro-cilantro, scattered toasted rice powder, droplets of basil oil |
| `summer-rolls` | Smoked Duck Summer Rolls | two translucent rice-paper rolls cut on the diagonal, visible duck confit, shiso leaf and pickled daikon inside, small dish of dark hoisin-tamarind sauce |
| `edamame` | Charcoal-Blistered Edamame | small heap of green edamame pods with charred black blisters, flecks of crispy fried shallot, coarse sea salt |
| `cha-ca` | Miso-Glazed Cha Ca | golden turmeric-glazed black cod fillet over a nest of pale green matcha vermicelli, dill fronds, scattered roasted peanuts |
| `pork-belly` | Lemongrass Sous-Vide Pork Belly | rectangular block of glossy pork belly with crisp lacquered top and striated layers, scallion-oil drizzle, pink pickled lotus root slices, crispy rice galette underneath |
| `claypot-prawns` | Claypot Caramel Prawns | small dark earthenware claypot with three head-on tiger prawns in glossy amber caramel sauce, cracked black pepper, sliced bird's-eye chili |
| `banh-mi` | Wagyu Banh Mi Slider | small crusty baguette split open, pink wagyu, pickled carrot and daikon julienne, cilantro, jalapeño slice |
| `lotus-chips` | Crispy Lotus Root Chips | shallow bowl of paper-thin lotus root chips with visible hole pattern, dusted with chili-salt, tiny dipping cup of nuoc cham |
| `saigon-smoke` | Saigon Smoke (cocktail) | coupe glass with smoky golden mezcal cocktail, charred pineapple wedge on rim, Thai basil leaf, faint stippled smoke wisp rising |
| `pho-old-fashioned` | The Pho Old Fashioned | rocks glass with large clear ice cube, amber bourbon, burnt orange peel twist, single toasted star anise resting on top |
| `egg-coffee` | Vietnamese Egg Coffee | small glass cup on saucer, dark espresso base with thick pale-yellow whipped egg-yolk foam crown, tiny spoon |
| `papaya-salad` | Green Papaya & Pomelo Salad | tangle of pale-green shredded papaya with pink pomelo segments, candied cashews, scattered red chili, lime wedge |
| `quail-eggs` | Crispy Quail Eggs | three golden panko-fried quail eggs cut in half showing soy-cured orange yolk, smear of smoked chili mayo, micro herbs |
| `bone-marrow` | Bone Marrow Bánh Tráng | halved roasted beef marrow bone with torched bubbling marrow, crisp round rice cracker, fresh herb salad bouquet, tiny dish of dark nuoc cham gel |
| `eggplant-nem` | Charred Eggplant Nem | dark blistered Asian eggplant split open showing creamy flesh, crushed peanuts, perilla leaves, shard of fried rice paper |
| `caramel-cod` | Caramel Black Cod Clay | small dark clay pot with glossy mahogany caramel-glazed black cod, ginger threads, scallion-oil sheen, single red chili |
| `bun-bo-hue` | Smoked Bún Bò Huế | wide bowl of deep red-orange lemongrass-chili broth, thick round white rice noodles, slices of beef shank, purple banana blossom curls, sawtooth herb |
| `com-tam-duck` | Duck Leg Cơm Tấm | mound of broken white rice topped with crisp-skinned confit duck leg, side of bright pickled mustard greens, small bowl of nuoc cham |
| `charcoal-bao` | Bamboo Charcoal Bao | two jet-black soft pillowy bao buns split open with glossy pulled short rib in dark hoisin reduction, pickled cucumber slices, sesame seeds |
| `curry-lobster` | Saigon Curry Lobster | shallow bowl of golden coconut-turmeric curry, single bright red lobster claw and split tail, kaffir lime leaves floating, cilantro |
| `lemongrass-gimlet` | Lemongrass Gimlet | coupe glass with pale green-gold gin cocktail, single lemongrass stalk swizzle, kaffir lime leaf garnish |
| `pandan-highball` | Pandan Highball | tall slim highball glass with pale jade pandan whisky soda, fizzing bubbles, long pandan leaf knot, single ice spear |
| `tamarind-margarita` | Tamarind Margarita | margarita coupe with cloudy amber tamarind tequila, dark chili-salt rim, dehydrated lime wheel, tamarind pod garnish |

---

## Hero illustration prompt (separate, not a sticker)

Saved to `src/assets/moebius-hero.jpg`, opaque JPG, 16:9. Atmosphere-first — evokes the restaurant interior rather than depicting food.

```
A serene, abstract Moebius / Jean Giraud ligne-claire scene evoking the
atmosphere of an evening Vietnamese restaurant — NO food, NO plates, NO
bowls, NO star anise, NO utensils.

Composition: an empty wooden bistro table in soft 3/4 view anchored to
the lower-left third, a single thin paper lantern hanging from above
casting a warm glow, suggestion of arched window mullions and distant
silhouetted patrons rendered as minimal stippled shapes in the
background. The right ~45% of the canvas is nearly empty warm off-white
paper for headline space.

Uniform delicate black ink outlines, shading ONLY through hand-drawn
stippling and fine cross-hatching, vintage 1970s French-Belgian comic
print look. Flat limited palette: warm pale yellow #FDE073 lantern
glow, deep ocean blue #1D70B8 cool shadows, muted lilac #A08496
mid-tones, off-white paper #F5EFD9 dominating.

NO gradients, NO 3D render, NO drop shadows, NO airbrushing, NO text,
NO logos, NO watermark.
```

### Negative-text guard for stickers

If a regenerated sticker contains stray text, labels, or watermarks, append
this block to the master prompt and regenerate:

```
Absolutely NO text, NO labels, NO letters, NO numbers, NO brand
markings, NO logo, NO watermark, NO border. Flatter, more stippling,
fewer colors, matte 1970s comic print look.
```

## How to use

1. Copy the master prompt.
2. Replace `[DISH NAME]` and `[SHORT DESCRIPTION]` with the matching row.
3. Generate with `google/gemini-3-pro-image-preview` (Nano Banana Pro).
4. Save as `src/assets/food/{slot}.png` and import in `Menu.tsx`.
5. If the result drifts (gets glossy, 3D, or too colorful), append: *"Re-do — flatter, more stippling, fewer colors, matte 1970s comic print look."*
