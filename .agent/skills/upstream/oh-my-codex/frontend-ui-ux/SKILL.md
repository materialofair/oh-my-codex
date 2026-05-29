---
name: frontend-ui-ux
description: Designer-developer for UI/UX work
---

# Frontend UI/UX Command

Routes frontend design work to Codex-native design and implementation workflows.

## Usage

```
/frontend-ui-ux <design task>
```

## Routing

### Preferred: Codex Frontend Workflow
Use the repository's existing frontend stack, design system, and local docs first.
For substantial UI work, use the `frontend-design` or `frontend-patterns` skill when applicable.

### Optional Read-Only Review
For independent critique, dispatch a read-only reviewer/explorer child agent:

```
spawn_agent(agent_type="explorer", message="Read-only UI/UX exploration: {{ARGUMENTS}}")
spawn_agent(agent_type="reviewer", message="Read-only UI/UX risk review: {{ARGUMENTS}}")
```

## Capabilities
- Component design and implementation
- Responsive layouts
- Design system consistency
- Accessibility compliance

Task: {{ARGUMENTS}}
