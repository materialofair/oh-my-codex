---
name: review
description: Review a plan with Critic
version: 0.1.0
source: fork
checksum: 4e6df46179eceab92675226aeda77952bd3a5c4748501dd09c640c17710585ce
updated_at: 2026-02-11T09:29:16+08:00
---


# Review Skill

## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Execution preference:
1. Use native subagents first for independent workstreams (parallel when possible).
2. Merge results in main thread and run final verification.
3. Fallback only when delegation is blocked: use the `[ANALYST]`/`[ARCHITECT]`/`[EXECUTOR]`/`[REVIEWER]` structure in a single response.

Minimal orchestration pattern:
```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

> Codex invocation: use `$review ...` or `review: ...`


[PLAN REVIEW MODE ACTIVATED]

## Role

Critically evaluate plans using Critic. No plan passes without meeting rigorous standards.

## Review Criteria

| Criterion | Standard |
|-----------|----------|
| Clarity | 80%+ claims cite file/line |
| Testability | 90%+ criteria are concrete |
| Verification | All file refs exist |
| Specificity | No vague terms |

## Verdicts

**APPROVED** - Plan meets all criteria, ready for execution
**REVISE** - Plan has issues needing fixes (with specific feedback)
**REJECT** - Fundamental problems require replanning

## What Gets Checked

1. Are requirements clear and unambiguous?
2. Are acceptance criteria concrete and testable?
3. Do file references actually exist?
4. Are implementation steps specific?
5. Are risks identified with mitigations?
6. Are verification steps defined?
