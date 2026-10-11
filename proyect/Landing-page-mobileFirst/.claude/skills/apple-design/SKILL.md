---
name: apple-design
description: Apple-style design system in Google's DESIGN.md format (tokens + rationale). Use when designing or restyling any UI in this repo — typography, color, spacing, elevation, components, responsive behavior — or when asked to make it feel "Apple", premium, gallery-like or minimal.
---

# Apple design (DESIGN.md format)

`references/apple.DESIGN.md` is a full Apple-inspired design system written in the
[Google DESIGN.md format](../design-md/spec.md): YAML front matter with normative tokens
(`colors`, `typography`, `rounded`, `spacing`, `components`) plus prose rationale.
Upstream: VoltAgent/awesome-design-md (MIT), `design-md/apple/DESIGN.md`. Unmodified copy.

## How to use it in this repo

This site is the portfolio/shop of an **artist** (see `docs/product-overview.md`). Apple's system
is a *quality bar and structural reference*, not a costume. Photography-first, chrome that recedes,
generous whitespace and one interactive color fit an art shop very well. Copying Apple's
look literally (SF Pro, Action Blue, product-tile cadence) does not.

1. Read `references/apple.DESIGN.md` sections **Overview, Typography, Layout, Components,
   Do's and Don'ts, Responsive Behavior** before touching styles.
2. Never hard-code values from it into components. Tokens live in the project's own
   `DESIGN.md` (create/maintain it with the `design-md` skill) and are exported to CSS variables.
3. Adopt these Apple principles by default:
   - Artwork is the hero; UI chrome is quiet (no decorative gradients, no heavy shadows on chrome).
   - One interactive accent color; everything else neutral. Accent is never decorative.
   - Alternating light/neutral canvases to separate sections instead of borders and boxes.
   - Tight display type, relaxed body, few weights (300/400/600).
   - 8px spacing grid; large vertical rhythm between sections.
   - Pill CTAs, 44px minimum touch targets, visible focus rings.
   - Motion is short, purposeful, and respects `prefers-reduced-motion`.
4. Adapt, don't copy: the brand (name in "Dancing Script", violet accent today, painterly
   imagery) decides the palette and personality. Pick the accent and font pairing deliberately and
   record it in `docs/governance/decision-log.md`.
5. SF Pro is proprietary: use `system-ui, -apple-system` first and a web-font fallback
   (see "Note on Font Substitutes" in the reference). Check the brand font decision before adding one.

## Precedence

`DESIGN.md` (project) > this skill > `frontend-design` (craft/taste guidance) > personal taste.
If `frontend-design` ("be distinctive, take risks") conflicts with Apple restraint, restraint wins for
chrome and layout; distinctiveness goes into the artwork presentation, copy and one signature moment.
