# Model Adapter Prompts Design

Date: 2026-06-12
Status: Draft for user review

## Context

oh-my-codex already has a layered harness:

- Role prompts in `prompts/architect.md`, `prompts/planner.md`, and `prompts/executor.md`.
- Skill and harness governance in `docs/LLM_TESTING.md`, `src/testing/prompts.js`, and `tests/llm/prompt-contract-cases.json`.
- Runtime installation paths for prompts, skills, rules, agents, and MCP configuration.

The user primarily uses frontier OpenAI coding models such as `gpt-5.4`, `gpt-5.5`, and future successors. Lower-version model compatibility is not a priority.

The design should therefore avoid per-version prompt sprawl. The goal is a small adapter layer that stabilizes behavior across current and future frontier Codex-style models.

## Goals

1. Add a model adapter prompt layer without rewriting existing role prompts.
2. Optimize for `gpt-5.4`, `gpt-5.5`, and future frontier Codex models.
3. Keep model-specific instructions short, auditable, and eval-protected.
4. Preserve the existing source-of-truth workflow: repository files first, installer sync second.
5. Avoid copying leaked or third-party system prompts verbatim. Use them only as structural research signals.

## Non-Goals

- No adapters for old GPT-4-era models in the first version.
- No Claude, Gemini, Qwen, DeepSeek, or Cursor adapters in the first version.
- No large replacement of `AGENTS.md`, skill docs, or role prompts.
- No hidden prompt magic that cannot be tested by the existing LLM harness.
- No runtime dependency on the external prompt-leaks repository.

## Recommended Architecture

Use a four-layer prompt model:

1. **Core rules**
   - Source: `AGENTS.md`, `.codex/rules/**`, and global Codex instructions.
   - Purpose: stable project and safety invariants.

2. **Role prompt**
   - Source: `prompts/architect.md`, `prompts/planner.md`, `prompts/executor.md`.
   - Purpose: role-specific behavior.

3. **Model adapter**
   - Source: `prompts/adapters/openai-frontier-codex.md`.
   - Purpose: frontier OpenAI model calibration.

4. **Optional persona**
   - Source: future `prompts/personas/*.md`, if needed.
   - Purpose: tone and interaction style only.

First implementation should add only the model adapter layer.

## Files To Add

```text
prompts/adapters/openai-frontier-codex.md
tests/llm/model-adapter-cases.json
docs/MODEL_ADAPTERS.md
```

Optional implementation files if the test runner needs a dedicated suite:

```text
src/testing/model-adapters.js
```

## Adapter Content Contract

`prompts/adapters/openai-frontier-codex.md` should contain these sections:

```text
---
description: "OpenAI frontier Codex model adapter"
model-family: "openai-frontier-codex"
---

## Purpose
## Model Biases To Correct
## Tool Usage Policy
## Retrieval Policy
## Clarification Policy
## Persistence And Stop Conditions
## Verification Policy
## Output Policy
## Known Failure Modes
## Final Checklist
```

The adapter should be concise. It should not restate the full executor, planner, or architect prompt. It should only tune behavior that tends to drift between frontier model versions.

## Adapter Behavior

The first adapter should encode these behavior constraints:

- Prefer repository evidence over model memory.
- Keep going on implementation tasks until the requested outcome is genuinely handled.
- Ask only when a decision is blocked and cannot be inferred from repo context.
- Use skills as on-demand workflows, not as permanent context bloat.
- Keep edits small and reversible.
- Verify before claiming completion.
- Report changed files and validation evidence.
- Treat future frontier models as capable but not perfectly stable; rely on evals to catch drift.

## Version Strategy

Use one default adapter:

```text
openai-frontier-codex
```

Do not create `gpt-5.4`, `gpt-5.5`, or `gpt-5.6` files unless evals prove a version-specific drift that cannot be handled by the shared adapter.

If a future model has a recurring failure mode, add a delta file only when all are true:

1. The failure is reproducible in at least two prompt-contract or workflow cases.
2. The shared adapter cannot fix it without harming the current main model.
3. The delta is under 80 lines and has its own test case.

Example future layout only if needed:

```text
prompts/adapters/openai-frontier-codex.md
prompts/adapters/deltas/gpt-5.6-codex.md
```

## Testing Design

Add model adapter contract tests parallel to the existing prompt contract tests.

The first `tests/llm/model-adapter-cases.json` should validate:

- Required frontmatter exists.
- Required sections exist.
- The adapter includes key concepts:
  - `frontier`
  - `repository evidence`
  - `verification`
  - `ask only when blocked`
  - `small reversible changes`
  - `future model drift`
- Forbidden terms are absent:
  - `Claude Code`
  - `Gemini`
  - `plugin-dir`
  - `HUD`
  - `leaked prompt`

The test runner may either:

- extend `src/testing/prompts.js` to accept adapter cases, or
- add `src/testing/model-adapters.js` if keeping suites separate is cleaner.

The preferred first step is to extend the existing prompt test machinery with minimal duplication.

## Installation Design

Installer behavior should remain simple:

- `scripts/install-codex.sh` already installs everything under `prompts/`.
- Adding `prompts/adapters/openai-frontier-codex.md` should automatically copy it to the selected Codex prompt destination.
- No new installer flag is needed in the first version.

Documentation should tell users to compose the adapter with the role prompt when they customize Codex or copy prompts manually.

## Risks

1. **Prompt bloat**
   - Mitigation: adapter stays short and does not restate role prompts.

2. **False precision**
   - Mitigation: one frontier adapter by default; version deltas require eval evidence.

3. **Leaked prompt dependency**
   - Mitigation: do not copy external prompt text. Document only the local adapter contract.

4. **Untested behavior**
   - Mitigation: add adapter contract tests and include them in the LLM harness documentation.

## Acceptance Criteria

Implementation is complete when:

1. `prompts/adapters/openai-frontier-codex.md` exists and follows the adapter content contract.
2. `docs/MODEL_ADAPTERS.md` explains the adapter model and version strategy.
3. `tests/llm/model-adapter-cases.json` validates the adapter contract.
4. The LLM prompt test suite or a new adapter test suite passes.
5. `docs/LLM_TESTING.md` references the adapter test surface.
6. No generated runtime target under `~/.codex/skills` is edited directly.

## Implementation Plan Preview

The implementation should be small:

1. Add the frontier adapter prompt.
2. Add documentation.
3. Add adapter contract tests.
4. Wire tests into the existing LLM harness with minimal code changes.
5. Run targeted verification.

