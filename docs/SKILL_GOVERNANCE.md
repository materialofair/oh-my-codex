# Skill Governance

This document defines the governance baseline for skills in this repository.

## Objectives

1. Keep skill instructions executable in current Codex CLI behavior.
2. Prevent legacy command drift from Claude-era syntax.
3. Track technical debt explicitly when migration cannot be completed in one pass.

## Governance Layers

1. Admission: Require valid `SKILL.md` frontmatter (`name`, `description`) and clear trigger semantics.
2. Execution safety: Block instructions that imply unavailable runtime features.
3. Quality gates: Enforce pre-merge checks through repository scripts.
4. Change control: Track exceptions in a reviewed allowlist.
5. Continuous cleanup: Burn down allowlisted debt skill-by-skill.

## Automated Checks

Run:

```bash
npm run governance:skills
npm run governance:skills:llm
npm run eval:skills
```

The checker currently enforces:

- Blockers:
  - Legacy slash invocation (`Run: /verify`)
  - Plugin-specific runtime command (`cc --plugin-dir`)
  - Legacy task API syntax (`Task(...)` with agent/task parameters)
- Controlled debt:
  - `Task(subagent_type=...)` references are allowed only when explicitly listed in `.governance/skill-lint.allowlist`
  - Slash command references are allowed only for files explicitly listed in `.governance/skill-lint.allowlist`

## LLM Governance Gate

`npm run governance:skills:llm` runs a second-pass governance audit:

- `--mode=auto` (default): uses OpenAI audit when `OPENAI_API_KEY` is set, otherwise uses heuristic fallback
- Flags high-severity blockers for non-Codex runtime instructions and execution ambiguity
- Writes report to `.omcodex/reports/skill-llm-governance-latest.json`
- Supports controlled debt via `.governance/skill-llm.allowlist` (`<rule_id>:<skill_name>`)

## Skill Eval Harness

`npm run eval:skills` scores each skill document for execution quality:

- Frontmatter completeness
- Invocation clarity
- Workflow structure
- Codex compatibility checks

Reports are written to:

- `.omcodex/reports/skill-eval-latest.json`
- `.omcodex/reports/skill-eval-latest.md`

## Debt Policy

- New debt is blocked by default.
- Existing debt is recorded in `.governance/skill-lint.allowlist`.
- Removing debt entries must happen in the same change that migrates the corresponding skill.

## Migration Priority

1. Remove runtime-invalid instructions (blockers).
2. Replace pseudo-subagent API usage with Codex-compatible role protocols.
3. Remove stale plugin-only wording when equivalent Codex-native guidance exists.
