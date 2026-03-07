---
name: test-gen
description: Use this skill after Codex has written or changed code and you want it to intelligently generate tests, acceptance coverage, and regression checks for the affected files.
---

# Test Generation Workflow

Codex-native testing workflow for post-implementation validation.

## When to Use

Use this skill when the user asks to:

- "给这段代码补测试"
- "写测试用例"
- "生成验收和回归测试"
- "智能测试这段代码"
- "test this file"
- "generate tests for the changed code"

## Goal

After code is written, Codex should:

1. Detect the project test stack
2. Detect changed implementation files when possible
3. Analyze the target file and risk signals
4. Build acceptance and regression checklists
5. Generate or update the most relevant tests
6. Run targeted verification commands
7. Report residual gaps honestly

## Workflow

### Phase 1: Detect Context

```bash
omcodex test detect-stack
omcodex test changed
omcodex test analyze path/to/file
```

Use `omcodex test changed` first when the goal is “cover the files I just changed”.

Focus on:

- target kind
- complexity
- existing test stack
- risk signals
- nearby tests

### Phase 2: Generate Testing Pack

```bash
omcodex test gen path/to/file
```

This writes:

- test plan
- acceptance checklist
- regression checklist
- Codex testing playbook

### Phase 3: Write or Update Tests

Use the generated pack to decide the right layer:

- pure logic -> unit tests
- UI behavior -> component/integration tests
- async + IO -> integration tests
- risk-heavy paths -> regression cases

Prefer updating existing tests when a pattern already exists.

### Phase 4: Verify

Run the smallest useful verification command first, then broaden if needed.

If stronger QA orchestration is needed, combine with:

- `$tdd-workflow`
- `$acceptance-regression-driver`
- `$ultraqa`
- `$verify`

## Rules

- Do not stop at happy-path coverage.
- Always add regression assertions when risk signals exist.
- Avoid implementation-detail-only tests.
- If no safe automated test can be added, emit a concrete manual regression checklist.

## Output

Always report:

1. Target files analyzed
2. Generated or updated test files
3. Acceptance items covered
4. Regression items covered
5. Commands executed
6. Remaining gaps

## Example

```text
$test-gen src/router/skill-router.js
test-gen: add smart tests for src/team/orchestrator.js and src/team/state-store.js
```
