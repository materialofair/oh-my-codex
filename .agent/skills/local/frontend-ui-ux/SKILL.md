---
name: frontend-ui-ux
description: Designer-developer workflow for UI/UX work using Codex-native frontend design, local project conventions, and optional read-only review agents.
version: 0.2.0
source: fork
updated_at: 2026-05-29T11:55:00+08:00
checksum: 1b8a5192f9ca7642c2bec02c6b9f087af6b790edaa7b2b4373e3d9380fa4e4d1
intent: frontend
layer: implementation
---

# Frontend UI/UX

Use this skill for frontend UI/UX design, component polish, responsive layout, accessibility, and implementation guidance.

## Routing

1. Read the existing frontend stack, design system, routes, and component conventions.
2. Use `frontend-design` for visual design-heavy tasks.
3. Use `frontend-patterns` for framework and implementation pattern work.
4. For independent critique, optionally dispatch read-only child agents:

```text
spawn_agent(agent_type="explorer", message="Read-only UI/UX exploration: {{ARGUMENTS}}")
spawn_agent(agent_type="reviewer", message="Read-only UI/UX risk review: {{ARGUMENTS}}")
```

## Capabilities

- Component design and implementation
- Responsive layouts
- Design system consistency
- Accessibility checks
- Interaction and state review

Task: {{ARGUMENTS}}
