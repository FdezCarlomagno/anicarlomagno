---
name: design-system-rework
description: Step-by-step playbook to migrate this app from its legacy ad-hoc CSS to a token-based design system (DESIGN.md → CSS variables → shared components → page-by-page rollout). Use when planning or executing the redesign, or when asked "what's next" in the rework.
---

# Design-system rework playbook

> The detailed incremental plan is `docs/redesign-plan.md` (phases 0–11); it supersedes the phase order below. Work one phase per PR.

Goal: replace per-page CSS (`src/LandingPage.css`, `src/pages/pagesStyles/*.css`,
`src/components/contact/styles/*.css`) with one tokenized system and a small set of shared
components, improving UX/UI without changing product behavior.

## Phase 0 — Baseline (no code changes)
1. Read `docs/product-overview.md`, `CLAUDE.md`, `docs/governance/`.
2. Run `landing-ux-audit` on `/`, `/agendas`, `/agenda-personalizada`, `/obras-en-stock`,
   `/obra-personalizada`, `/mi-libro`, `/laminas`, `/sobre-mi`, `/contacto`. Save in `design/audits/YYYY-MM-DD-baseline.md`.
3. Screenshot each route at 390 and 1280 px into `design/baseline/`.
4. Run `npm run build` and `npm run lint`; record existing failures so they aren't blamed on the rework.

## Phase 1 — Foundations
1. Decide and log: accent color, type pairing (brand script for the logo only?), radius, motion. Use `apple-design`.
2. Author `DESIGN.md` (`design-md` skill) and lint it.
3. Create `src/styles/tokens.css` (+ `reset.css`, `base.css`) imported once from `src/index.css`.
4. Legacy conflicts to resolve: three font declarations (`* { font-family: Raleway }`, `:root` Inter,
   Dancing Script), `--primary-color: blueviolet` scoped to agendas only, hard-coded `aliceblue`,
   duplicated button styles, `nav` declaring `z-index` twice.

## Phase 2 — Shared components (`src/ui/`)
Button, LinkButton, ArtworkCard, Section (alternating canvas), PageHeader, FormField, Toast,
FloatingActions, Nav/Footer. Each: tokens only, all states (hover/focus/active/disabled/loading),
keyboard + touch, usable without framer-motion.

## Phase 3 — Page-by-page rollout (one PR each, in this order)
1. Shell: NavBar, FooterNavbar, WhatsappIcon, ScrollToTopButton, Envio.
2. Home (`/`): slider/hero → Quién soy → agendas strip → obras → CTA.
3. Catalog: `/obras-en-stock`, `/laminas`, `/mi-libro`, `/agendas`.
4. Conversion flows: `/agenda-personalizada` (AgendaForm), `/obra-personalizada`, `/contacto`.
5. `/sobre-mi`.
After each page: delete the CSS it no longer uses and run the Definition of Done
(`docs/governance/definition-of-done.md`).

## Phase 4 — Hardening
Image pipeline (WebP/AVIF, sizes), per-route SEO, a11y pass, Lighthouse mobile ≥ 90 on all four
categories, dead-CSS removal.

## Guardrails
- Behavior-preserving: pricing logic, WhatsApp message templates, EmailJS config do not change in a visual PR.
- Small PRs, one route or one component family each. Update `docs/governance/decision-log.md`.
