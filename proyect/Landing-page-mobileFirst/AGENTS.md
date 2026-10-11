# AGENTS.md

Instructions for any coding agent (Codex, Cursor, Copilot, Gemini, etc.) working in this folder.

**The canonical instructions are in [`CLAUDE.md`](CLAUDE.md) — read it fully; it applies to all agents.**
Then read `docs/product-overview.md` and `docs/governance/README.md`.

Agent-neutral skill sources live in `.claude/skills/*/SKILL.md`; open and follow them directly if your tool
does not load them automatically (`apple-design`, `design-md`, `design-system-rework`, `landing-ux-audit`,
`frontend-design`, `web-design-guidelines`).

Non-negotiables: don't change prices / WhatsApp templates / EmailJS / routes in visual work; tokens only;
mobile-first; WCAG 2.2 AA; never alter artwork; run `npm run build` and `npm run lint`; report what you verified.
