---
name: autopilot
description: Use this skill to run end-to-end delivery from requirement to verified code with gated phases, state tracking, and retry limits.
version: 0.3.0
---

# Autopilot Skill

> Codex invocation: use `$autopilot ...` or `autopilot: ...`

Run full autonomous execution from idea to verified code while keeping checkpoints, evidence, and rollback-safe behavior.

## Capabilities

- Turn vague requests into a concrete implementation spec.
- Produce a minimal, reversible plan before code edits.
- Implement with parallel workers when tasks are independent.
- Run verification loops (build/lint/type/test/security checks).
- Emit machine-readable completion/blocking status for resume.

## Input Requirements

Provide as many fields as possible:

- `goal` (required): what must be built/fixed.
- `scope` (required): files/modules allowed to change.
- `constraints` (optional): stack, performance, security, deadlines.
- `done_definition` (required): objective pass criteria.
- `non_goals` (optional): explicitly out-of-scope items.

If `done_definition` is missing, infer a conservative default:

1. Relevant tests pass.
2. Build/type/lint pass.
3. No regression in changed areas.

## How to Use

```text
$autopilot Add OAuth login with refresh token rotation and tests
$autopilot Refactor router matching logic with no behavior change
$autopilot Build a CLI for daily habit tracking (TypeScript + SQLite)
```

## Operating Principles

1. Start simple: prefer one coordinated agent flow first; parallelize only independent tasks.
2. Use explicit gates: no phase advances without pass criteria.
3. Use small diffs: avoid broad refactors unless required by the goal.
4. Be eval-driven: convert requirements into executable checks early.
5. Keep evidence: every claim must map to commands/files.

## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Minimal orchestration pattern:

```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

Fallback: if delegation is unavailable, run the same phases in a single-thread execution loop.

## Phase State Machine

State file: `.omc/state/autopilot-state.json`

```json
{
  "status": "idle|running|blocked|complete",
  "phase": "intake|plan|implement|qa|review",
  "attempt": 1,
  "maxAttempts": 10,
  "lastError": "",
  "artifacts": {
    "spec": ".omc/autopilot/spec.md",
    "plan": ".omc/plans/autopilot-impl.md"
  },
  "updatedAt": "ISO-8601"
}
```

### Phase 0: Intake

Goal: produce a concrete spec from user intent.

Exit criteria:

- Must/Should/Could requirements are explicit.
- Constraints and assumptions are listed.
- Done definition is testable.

Output: `.omc/autopilot/spec.md`

### Phase 1: Plan

Goal: create minimal implementation plan with rollback-safe ordering.

Exit criteria:

- Numbered steps with file ownership.
- Risks + mitigations listed.
- Verification commands attached per step.

Output: `.omc/plans/autopilot-impl.md`

### Phase 2: Implement

Goal: apply planned changes with smallest correct diff.

Rules:

- Independent tasks may run in parallel (max 3 workers).
- Shared-file edits stay serialized.
- Any plan deviation must be logged.

Exit criteria:

- Planned steps done or explicitly deferred with reason.
- Changed files mapped to requirement IDs.

### Phase 3: QA

Goal: objective validation against done definition.

Recommended sequence:

```bash
omcodex test changed
npm run build
npm run lint
npm run test
```

If project uses different scripts, detect and use project-native equivalents.

Exit criteria:

- Required checks pass.
- Failures either fixed or escalated as blocker.

### Phase 4: Review

Goal: final quality/security/completeness pass.

Checks:

- Functional completeness
- Security-sensitive changes review
- Code quality and maintainability

Exit criteria:

- All required checks approved.
- Remaining risks documented.

## Retry, Stop, and Resume

- `maxAttempts`: 10 full-loop attempts.
- `maxQaCycles`: 5 QA fix cycles per run.
- Early stop if same failure repeats 3 times.
- On stop, emit blocking promise with exact blocker.

Promise tags:

- `[PROMISE:AUTOPILOT_COMPLETE]`
- `[PROMISE:AUTOPILOT_BLOCKED]`

Resume behavior:

- Reload `.omc/state/autopilot-state.json`.
- Continue from recorded `phase`.
- Do not re-run completed phases unless inputs changed.

## Required Output Contract

```text
[ANALYST]
- Problem summary
- Requirements (must/should/could)
- Constraints/assumptions

[ARCHITECT]
- System design
- Key components
- Data flow

[PLANNER]
- Step-by-step plan (numbered)
- Files to change
- Risks

[EXECUTOR]
- Applied changes
- Deviations from plan

[REVIEWER]
- Verification result
- Tests run / not run
- Remaining risks

[STATUS]
- phase: <intake|plan|implement|qa|review>
- result: <complete|blocked|in_progress>
- promise: <PROMISE tag>
```

## Cancellation

Cancel with `$cancel` or "stop/cancel/abort".

On cancellation:

- Persist current state file.
- Emit summary of completed phases and next action.

## Completion Cleanup

On successful completion, delete state files:

```bash
rm -f .omc/state/autopilot-state.json
rm -f .omc/state/ralph-state.json
rm -f .omc/state/ultrawork-state.json
rm -f .omc/state/ultraqa-state.json
```

Keep generated artifacts (`spec.md`, `plan.md`, reports) unless user asks to remove them.
