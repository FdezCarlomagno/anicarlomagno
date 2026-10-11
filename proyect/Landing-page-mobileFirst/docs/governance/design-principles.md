# Design principles

Apple's restraint, an artist's warmth. When two principles conflict, the lower number wins.

1. **The artwork is the hero.** Paintings and printed products get the space, the best crop of the layout and the highest
   image quality. UI chrome recedes. Never overlay heavy text on, crop destructively, or recolor artwork.
2. **One next step per screen.** Every view makes the primary action obvious: consult on WhatsApp or finish a custom order.
   Secondary actions are visually quieter.
3. **Clarity before cleverness.** Show size, availability, what's included, how buying works and shipping where the decision
   is made. Remove steps that don't help Ani quote and produce.
4. **Mobile first.** Design at 360–390 px, then enhance. Thumb reach, 44 px targets, no hover-only affordances.
5. **Quiet system, one accent.** Neutral canvases, one interactive accent color, few type sizes and weights, 8 px grid,
   consistent radius. The accent means "interactive", never decoration.
6. **Warm, human voice.** es-AR, voseo, short sentences. Personality lives in the artwork, the copy and the logo script —
   not in gradients, shadows or stacked animations.
7. **Motion explains, never performs.** 150–300 ms, ease-out, transform/opacity only, off under `prefers-reduced-motion`.
   No scroll-jacking, no motion required to reveal content.
8. **Accessible by default.** WCAG 2.2 AA is a floor, not a polish pass.
9. **Fast is a feature.** Right-sized modern images, no layout shift, limited font weights.
10. **Maintainable by one person.** Tokens + a few shared components + content in data files. No CMS/backend.

## Anti-patterns (reject in review)

Decorative gradients/glows; multiple accent colors; shadows on every card; centered-everything hero with generic stats;
animated entrance on every element; icon-in-circle feature grids; all-caps eyebrow labels; "01/02/03" numbering on non-sequences;
placeholder lorem/stock imagery; disabled zoom; text baked into images.
