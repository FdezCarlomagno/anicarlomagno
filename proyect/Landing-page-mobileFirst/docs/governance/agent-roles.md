# Agent roles and handoffs

Definitions live in `.claude/agents/`. Any single agent may play several roles in a small task, but the **reviewer
must be a separate pass from the implementer**.

| Role | File | Owns | Never |
|---|---|---|---|
| Design lead | `design-lead.md` | Direction, `DESIGN.md`, tokens, decision log, component specs | Edit pages/business logic |
| UI implementer | `ui-implementer.md` | Components/pages in React + CSS from tokens | Invent tokens, change behavior |
| UX/a11y reviewer | `ux-a11y-reviewer.md` | Independent audit and verdict | Edit source |

## Flow per change

```
design-lead (spec + tokens) → ui-implementer (build, build+lint, look at it) → ux-a11y-reviewer (verdict) → user merges
```

- Blockers from the reviewer go back to the implementer; design questions go to the design lead; product/business
  questions go to the user.
- Each handoff message states: files touched, tokens added, what was verified (commands, routes, viewports), what wasn't.

## Needs explicit user approval

See rule 2 in [README.md](README.md). When unsure whether something changes behavior, ask.

## Parallel work

Safe to parallelize: audits of different routes, token authoring vs. an audit. Not safe: two agents editing the same
CSS file or `DESIGN.md`. Use separate branches/worktrees for parallel implementation.
