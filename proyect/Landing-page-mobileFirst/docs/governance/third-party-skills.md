# Third-party skills: provenance and risk

Installed under `.claude/skills/` on 2026-10-11. Content was read before installing.

| Skill | Source | License | Modified? | Notes |
|---|---|---|---|---|
| `apple-design` (wrapper SKILL.md is ours) + `references/apple.DESIGN.md` | VoltAgent/awesome-design-md → `design-md/apple/DESIGN.md` | MIT (repo says design files are "as is", no claim to any site's visual identity) | Reference file unmodified | Google DESIGN.md format; Apple-inspired, not official Apple material |
| `design-md` (SKILL.md is ours) + `spec.md` | google-labs-code/design.md → `docs/spec.md` | Apache-2.0 | spec unmodified | Alpha spec; CLI is `@google/design.md` on npm (not installed locally; run via `npx`) |
| `frontend-design` | anthropics/skills → `skills/frontend-design` | See bundled `LICENSE.txt` (Apache-2.0) | No | Taste/craft guidance |
| `web-design-guidelines` | vercel-labs/agent-skills → `skills/web-design-guidelines` | Repo license not verified | No | **Fetches rules from raw.githubusercontent.com at runtime** — remote content, treat as advisory |
| `landing-ux-audit`, `design-system-rework` | Written for this repo | — | — | Project-specific |

Evaluated and **not** installed:
- `ihlamury/design-skills` → `skills/apple` ("apple-ui-skills"): auto-extracted tokens look unreliable (e.g. text-primary `#808080`, raised surface `#0858DC`).
- Google `stitch-skills` (`design-md`, `taste-design`, `enhance-prompt`, …): require the Stitch MCP server; revisit if the team adopts Stitch. `taste-design`'s asymmetric / perpetual-motion style conflicts with the Apple direction.

Note: the user's Claude setup may also provide `design:*` skills (accessibility-review, design-critique, ux-copy, design-system, design-handoff); they are referenced, not vendored.

Review policy: re-read any skill update before accepting it; skills never override `CLAUDE.md` or the approval rules in `README.md`.
