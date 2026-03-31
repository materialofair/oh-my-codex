---
name: tdd-workflow
description: Use this skill for test-first implementation of new features, bug fixes, and refactors with RED-GREEN-REFACTOR discipline and explicit verification gates.
version: 0.3.0
source: fork
checksum: 6bbe1e3304afa4d77a91260f7fd161c6364431379c6b4d16bdbc9fb4a0312ba2
updated_at: 2026-03-12T18:57:03+08:00
---


# TDD Workflow Skill

> Codex invocation: use `$tdd-workflow ...` or `tdd-workflow: ...`

Enforce test-first development with explicit phase gates and reproducible verification evidence.

## Capabilities

- Translate requirements into testable behaviors before implementation.
- Enforce RED -> GREEN -> REFACTOR sequence.
- Generate unit/integration/e2e test plans by risk.
- Prevent implementation-first drift with phase gate checks.
- Output machine-readable status for pause/resume workflows.

## Input Requirements

- `goal` (required): feature, bug fix, or refactor target.
- `scope` (required): files/modules allowed to change.
- `risk_level` (optional): low | medium | high.
- `test_layers` (optional): unit | integration | e2e.
- `done_definition` (required): objective completion criteria.

## How to Use

```text
$tdd-workflow Add refresh-token rotation for OAuth login
$tdd-workflow Fix race condition in cache invalidation path
$tdd-workflow Refactor order pricing module without behavior change
```

## Routing Boundary

Use this skill when implementation has not started and you need strict test-first execution.

- Use `$tdd-workflow` for pre-implementation TDD flow.
- Use `$test-gen` for post-implementation backfill/regression tests.
- Use `$verification-loop` for repeated fix-verify cycles after failures.

## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Minimal orchestration pattern:

```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

Fallback: if delegation is unavailable, execute the same phases sequentially in a single thread.

## Workflow Phases

State file: `.omc/state/tdd-workflow-state.json`

### Phase 0: Scope and Behaviors

- Convert goal into behavior statements (Given/When/Then).
- Identify edge cases and failure modes.
- Map each behavior to a test layer.

Exit criteria:

- Behavior list complete.
- Test layer mapping complete.

### Phase 1: RED

- Write tests for target behaviors before production code edits.
- Run targeted tests and confirm expected failures.

Exit criteria:

- New tests fail for expected reason.
- Failure output captured.

### Phase 2: GREEN

- Implement minimal code to satisfy failing tests.
- Re-run targeted tests until green.

Exit criteria:

- Targeted tests pass.
- No unrelated behavior changed.

### Phase 3: REFACTOR

- Improve readability/structure while preserving behavior.
- Keep tests green after each small refactor step.

Exit criteria:

- All targeted tests remain green.
- Diff remains scoped to declared files.

### Phase 4: VERIFY

Run broader quality gates:

```bash
omcodex test changed
npm run build
npm run lint
npm run test
```

Use project-native equivalents when scripts differ.

Exit criteria:

- Required checks pass.
- Residual risks documented.

## Coverage and Risk Policy

- Do not enforce blanket 80% if repository threshold differs.
- For `high` risk paths, require regression assertions and negative-path tests.
- For refactors, require no behavior drift and strong snapshot/contract checks.

## Output Contract

```text
[TDD-WORKFLOW]
- goal
- scope
- risk_level

[RED]
- tests added
- expected failures observed

[GREEN]
- implementation summary
- targeted tests passed

[REFACTOR]
- cleanup summary
- behavior preservation evidence

[VERIFY]
- commands executed
- pass/fail summary
- remaining risks

[STATUS]
- phase: <scope|red|green|refactor|verify>
- result: <complete|blocked|in_progress>
- promise: <PROMISE tag>
```

## Completion and Blocking Tags

- `[PROMISE:TDD_WORKFLOW_COMPLETE]`
- `[PROMISE:TDD_WORKFLOW_BLOCKED]`

Block when:

- tests cannot be executed in current environment
- failures are nondeterministic and cannot be stabilized
- required scope or acceptance criteria are missing

## Cancellation and Resume

- Cancel with `$cancel` or `stop/cancel`.
- Persist state file and latest phase summary.
- Resume from last incomplete phase only.
