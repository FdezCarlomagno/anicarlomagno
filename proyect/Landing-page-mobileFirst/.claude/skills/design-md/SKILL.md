---
name: design-md
description: Create, edit, lint, diff and export the project's DESIGN.md (Google's format for describing a visual identity to coding agents). Use when defining or changing design tokens (colors, typography, spacing, rounded, components) or syncing them to CSS.
---

# DESIGN.md (Google Labs format)

Full spec: [spec.md](spec.md) — copied from google-labs-code/design.md (Apache-2.0, alpha).

## Format in one screen

- **YAML front matter** = normative tokens: `colors`, `typography`, `rounded`, `spacing`, `components`.
  References use `{path.to.token}` (e.g. `{colors.primary}`).
- **Markdown body** = rationale, `##` sections in this order (all optional):
  Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
- Unknown headings are preserved; duplicate headings are an error.
- Lint rules include: broken token references, WCAG AA contrast (4.5:1) on component
  text/background pairs, orphaned tokens, section order.

## Workflow

1. The project file is `DESIGN.md` at the root of this app (`Landing-page-mobileFirst/DESIGN.md`).
   If it does not exist, seed it from `../apple-design/references/apple.DESIGN.md`, rename
   `name:`/`description:`, then replace tokens with the brand decisions (see `docs/governance/`).
2. Edit tokens first, prose second. Every token used in CSS must exist in `DESIGN.md`.
3. Validate (needs network the first time; if the harness blocks `npx`, ask the user to run it):
   ```bash
   npx @google/design.md lint DESIGN.md
   npx @google/design.md diff DESIGN.md DESIGN.next.md
   npx @google/design.md export --format css-tailwind DESIGN.md
   npx @google/design.md spec --rules
   ```
   `diff` exits 1 on regressions; `export` also supports `json-tailwind` and `dtcg`.
   On Windows PowerShell, if that fails: `npx -p @google/design.md designmd <command>`.
4. Mirror tokens into `src/styles/tokens.css` as CSS custom properties (the app uses plain CSS, not
   Tailwind). Names: `--color-*`, `--font-*`, `--space-*`, `--radius-*`. Keep a 1:1 mapping.
5. Record every token-level decision in `docs/governance/decision-log.md`.

## Rules

- No raw hex/px in component CSS when a token exists. Add the token, don't bypass it.
- Do not "fix" lint contrast errors by weakening the check; change the colors.
- The spec is alpha: if CLI output disagrees with this file, re-read `spec.md`.
