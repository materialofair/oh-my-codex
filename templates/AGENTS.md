# oh-my-codex

Skill pack and workflow orchestration for OpenAI Codex CLI.

## Guidance

- Prefer skills for reusable workflows (`$skill` or explicit skill name in prompt).
- Use Codex native multi-agent tools when a task benefits from delegation.
- Verify outcomes with concrete evidence before claiming completion.
- Keep instructions concise and implementation-focused.

## Notify Compatibility

Codex does not expose Claude Code style pre/post tool interception lifecycle.
This project uses event-driven extensions built on top of Codex notifications (`notify`), not execution interception.
