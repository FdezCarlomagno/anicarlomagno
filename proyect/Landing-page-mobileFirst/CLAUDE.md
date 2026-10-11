# CLAUDE.md — anicarlomagno landing (design-system rework)

Personal site + WhatsApp-driven shop of an Argentine artist. React 18 + Vite, plain CSS, Spanish (es-AR).
We are doing a **complete design-system rework and UX/UI improvement**. Read first, in this order:

1. `docs/product-overview.md` — what the product is, flows that must not break.
1b. `docs/redesign-plan.md` — the incremental phase plan (0–11); work on ONE phase at a time.
2. `docs/governance/README.md` — rules, roles, definition of done, decision log.
3. `DESIGN.md` (when it exists) — the single source of truth for visual tokens.

## Commands (run from this folder)

```bash
npm run dev       # Vite dev server
npm run build     # production build — must pass
npm run lint      # ESLint, --max-warnings 0 — must pass for files you touch
```

No test suite. Verify UI in the browser (390 px and 1280 px) and report what you actually checked.

## Hard rules

- **Do not change behavior in visual work**: prices (`src/components/config/*.js`), WhatsApp message
  templates and phone number, EmailJS wiring, routes in `src/LandingPage.jsx`.
- Style only through design tokens (`DESIGN.md` → `src/styles/tokens.css`). No new raw hex/px/font names in components.
- Mobile-first: write base CSS for ~360 px, enhance with `min-width` queries.
- Accessibility is not optional: WCAG 2.2 AA, 44 px targets, visible focus, real `button`/`a`,
  `prefers-reduced-motion`. Never disable zoom.
- Never alter, crop destructively, recolor or overlay artwork images. Add images only with `alt` and dimensions.
- Copy: es-AR with voseo, warm and direct. Use the `design:ux-copy` skill for new microcopy.
- No new dependencies, trackers or fonts without asking. No secrets in the repo (EmailJS key handling: ask before touching).
- Small, reviewable changes: one route or component family per PR. Delete the legacy CSS you replace.
- UI work isn't done until you have looked at it rendered. If you can't, say so.

## Skills (`.claude/skills/`)

| Skill | Use for |
|---|---|
| `apple-design` | Apple-style system in Google DESIGN.md format; quality bar for layout/type/color |
| `design-md` | Author/lint/export the project `DESIGN.md` tokens |
| `design-system-rework` | The phased plan; consult to know what's next |
| `landing-ux-audit` | Prioritized UX/a11y/perf/conversion audit of a route or component |
| `frontend-design` | Anthropic's craft guidance (typography, composition, anti-template) |
| `web-design-guidelines` | Vercel Web Interface Guidelines review (fetches rules from GitHub at runtime) |

Also available from the user's Claude setup when enabled: `design:design-critique`, `design:accessibility-review`,
`design:ux-copy`, `design:design-system`, `design:design-handoff`.
Precedence when guidance conflicts: **DESIGN.md > apple-design > frontend-design > taste**.

## Agents (`.claude/agents/`)

`design-lead` (decisions, tokens, direction) · `ui-implementer` (build components/pages from tokens) ·
`ux-a11y-reviewer` (independent read-only review before merge). See `docs/governance/agent-roles.md`.

## Where things are

- Routes/layout: `src/LandingPage.jsx` · Home: `src/Home.jsx` · pages: `src/pages/` · components: `src/components/`
- Content data: `src/objects/*.jsx` · prices: `src/components/config/` · images: `src/components/imgs/`, `src/pages/pagesStyles/paintingsImgs/`
- Legacy styles to retire: `src/LandingPage.css`, `src/pages/pagesStyles/*.css`, `src/components/contact/styles/*.css`
- Design artifacts: `design/` (baseline screenshots, audits) · governance: `docs/governance/`

## When you finish a task

State what changed, how you verified it (commands and routes/viewports actually checked), what you did
not verify, and append any design decision to `docs/governance/decision-log.md`.
