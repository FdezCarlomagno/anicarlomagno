# Decision log

Append-only. Newest at the bottom. Template:

```
## DL-000 — Title (YYYY-MM-DD)
Status: proposed | accepted | superseded by DL-xxx
Context: why this came up
Decision: what we chose
Alternatives: what we rejected and why
Consequences: tokens/files affected, follow-ups
```

## DL-001 — Adopt Google DESIGN.md + Apple reference as the design-system base (2026-10-11)
Status: accepted
Context: Complete rework of design system and UX/UI; legacy plain CSS with no tokens, three font declarations, one local color set.
Decision: Use Google's DESIGN.md format as the token source of truth, seeded from an Apple-style DESIGN.md
(`.claude/skills/apple-design/references/apple.DESIGN.md`) as a quality/structure reference, adapted to the artist's brand.
Alternatives: Tailwind migration (rejected for now — larger change, not needed); copying an Apple look literally (rejected — wrong brand).
Consequences: Project `DESIGN.md` + `src/styles/tokens.css` to be created in Phase 1; open decisions: accent color, type pairing, radius, motion.

## Open decisions (Phase 1)
- [ ] Accent color (keep violet family vs. new neutral+one accent)
- [ ] Type pairing (Dancing Script for logo only? body: Inter vs. system stack)
- [ ] Radius and elevation scale
- [ ] Motion language and reduced-motion policy
- [ ] Home hero concept (slider vs. single featured work)
