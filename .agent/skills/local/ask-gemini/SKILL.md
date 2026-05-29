---
name: ask-gemini
description: Deprecated compatibility stub. Prefer Codex-native multi-agent research, consensus, thinkdeep, or architect-planner.
version: 0.2.0
source: fork
updated_at: 2026-05-29T11:55:00+08:00
checksum: 317a23c5b3dc53e1ac00dd346f290f156a358c5848ab6d835cba24493abe71ad
layer: utility
---

# Ask Gemini (Deprecated)

This compatibility skill no longer executes an external model CLI by default.

Use Codex-native alternatives instead:

- `$multi-model-research <question>` for source-backed research
- `$consensus <decision>` for multi-perspective decision making
- `$thinkdeep <question>` for structured reasoning
- `$architect-planner <system design>` for architecture planning

## Behavior

When invoked:

1. Explain that this compatibility command is deprecated.
2. Offer the closest Codex-native workflow.
3. If the user agrees, continue with the selected local skill.
4. Do not run external model commands or write external-advisor artifacts.

Task: {{ARGUMENTS}}
