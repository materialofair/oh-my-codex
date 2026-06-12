# oh-my-codex

Skill pack and workflow orchestration for OpenAI Codex CLI.

## Guidance

1. Prefer retrieval-led reasoning over memory-led guessing.
2. Build project context first, then apply skills.
3. Keep context lean and implementation-focused.
4. Verify outcomes with concrete evidence before claiming completion.

## Skill Usage

- Skills are execution workflows; docs/config are source-of-truth knowledge.
- If the user names a skill (or `$skill`), use it.
- If a skill conflicts with repository docs, follow repository docs and note the conflict.

## Frontier Model Adapter

For GPT-5.4, GPT-5.5, and later frontier Codex models:

- Prefer repository evidence over model memory before using skills or changing files.
- Ask only when blocked by a decision that local context cannot answer.
- Keep changes small, reversible, and scoped to the requested outcome.
- Verify before claiming completion, and report concrete evidence.
- Treat model-version guidance as eval-driven; do not add per-version rules without repeated failures.

## AI Commenting

- Proactively use `ai-commenting` for non-trivial implementations and refactors.
- Add concise comments for intent, assumptions, risks, and verification expectations.
- Prioritize comments on complex logic, edge cases, cross-module coupling, and sensitive paths.
- Do not add low-value comments that restate obvious code behavior.

## Notify Compatibility

Codex does not expose Claude Code style pre/post tool interception lifecycle.
This project uses event-driven extensions built on top of Codex notifications (`notify`), not execution interception.
