# Model Adapters

## Purpose

Model adapters are small prompt overlays for model-family behavior. They tune how a capable model follows the existing oh-my-codex harness without replacing role prompts, skills, rules, or repository instructions.

Use adapters to correct recurring behavior drift, not to encode a whole working style from scratch.

## Current Default

The first default adapter is:

```text
openai-frontier-codex
```

It targets frontier OpenAI Codex models such as `gpt-5.4`, `gpt-5.5`, and future successors. Lower-version GPT compatibility is intentionally out of scope for the first version.

## Prompt Layers

oh-my-codex should be composed in this order:

1. Core project rules from `AGENTS.md` and `.codex/rules/**`.
2. Role prompt from `prompts/architect.md`, `prompts/planner.md`, or `prompts/executor.md`.
3. Model adapter from `prompts/adapters/openai-frontier-codex.md`.
4. Optional persona prompt, if a future workflow needs tone-only tuning.

Keep the adapter short. If an instruction belongs to all models, put it in project rules or the role prompt instead.

## Automatic Activation

Codex does not automatically inject arbitrary files from `~/.codex/prompts/` when a skill runs. The installed adapter file is a reusable prompt asset.

For automatic behavior, oh-my-codex keeps a short frontier-model adapter summary in `templates/AGENTS.global.md`. During user-scope setup, that template is installed as:

```text
~/.codex/AGENTS.md
```

That makes the short adapter rules part of the normal Codex instruction load path for future sessions. The full adapter file remains available at:

```text
~/.codex/prompts/adapters/openai-frontier-codex.md
```

Existing users who already have `~/.codex/AGENTS.md` should rerun setup. The installer appends the `Frontier Model Adapter` section when it is missing and leaves existing copies alone.

## Version Strategy

Do not create a prompt file for every model version. Use the shared `openai-frontier-codex` adapter until tests show a real reason to split.

Create a version delta only when all are true:

1. A failure is reproducible in at least two prompt-contract or workflow cases.
2. The shared adapter cannot fix the issue without hurting the current main model.
3. The delta is small enough to audit quickly.
4. The delta has its own test case.

Future deltas should live under:

```text
prompts/adapters/deltas/
```

## When To Add A Delta

Good reasons:

- A new frontier model repeatedly skips verification despite the shared adapter.
- A new frontier model over-asks clarification questions for tasks the repo can answer.
- A new frontier model ignores role boundaries between planner, architect, and executor.
- A new frontier model changes final-answer style enough to break user expectations.

Bad reasons:

- A single anecdotal bad run.
- Curiosity about prompt tuning without a failing eval.
- Copying another product's system prompt.
- Pre-optimizing for model versions the user does not use.

## Installation

The existing installer copies everything under `prompts/`, so adapter files are installed with the normal prompt set:

```bash
./scripts/install-codex.sh
```

For project-local installation:

```bash
./scripts/install-codex.sh --project
```

## Testing

Adapter contracts are tested through the LLM prompt test suite:

```bash
node bin/omcodex.js test llm prompts
```

To use a custom adapter fixture:

```bash
node bin/omcodex.js test llm prompts --adapter-cases tests/llm/model-adapter-cases.json
```

The default adapter test checks frontmatter, required sections, important behavior terms, and forbidden legacy or external-runtime wording.
