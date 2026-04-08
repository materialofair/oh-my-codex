---
name: eval
description: Imported from everything-codex command eval
version: 0.1.0
source: fork
checksum: 4b972e52eccdbc959cea78561d453cf1758817985b7b783b043c396417693052
updated_at: 2026-02-11T09:29:16+08:00
layer: quality
---


# Eval Command


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

Manage eval-driven development workflow.

## Usage

`$eval [define|check|report|list] [feature-name]`

## Define Evals

`$eval define feature-name`

Create a new eval definition:

1. Create `.codex/evals/feature-name.md` with template:

```markdown
## EVAL: feature-name
Created: $(date)

### Capability Evals
- [ ] [Description of capability 1]
- [ ] [Description of capability 2]

### Regression Evals
- [ ] [Existing behavior 1 still works]
- [ ] [Existing behavior 2 still works]

### Success Criteria
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

2. Prompt user to fill in specific criteria

## Check Evals

`$eval check feature-name`

Run evals for a feature:

1. Read eval definition from `.codex/evals/feature-name.md`
2. For each capability eval:
   - Attempt to verify criterion
   - Record PASS/FAIL
   - Log attempt in `.codex/evals/feature-name.log`
3. For each regression eval:
   - Run relevant tests
   - Compare against baseline
   - Record PASS/FAIL
4. Report current status:

```
EVAL CHECK: feature-name
========================
Capability: X/Y passing
Regression: X/Y passing
Status: IN PROGRESS / READY
```

## Report Evals

`$eval report feature-name`

Generate comprehensive eval report:

```
EVAL REPORT: feature-name
=========================
Generated: $(date)

CAPABILITY EVALS
----------------
[eval-1]: PASS (pass@1)
[eval-2]: PASS (pass@2) - required retry
[eval-3]: FAIL - see notes

REGRESSION EVALS
----------------
[test-1]: PASS
[test-2]: PASS
[test-3]: PASS

METRICS
-------
Capability pass@1: 67%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
[Any issues, edge cases, or observations]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## List Evals

`$eval list`

Show all eval definitions:

```
EVAL DEFINITIONS
================
feature-auth      [3/5 passing] IN PROGRESS
feature-search    [5/5 passing] READY
feature-export    [0/4 passing] NOT STARTED
```

## Arguments

$ARGUMENTS:
- `define <name>` - Create new eval definition
- `check <name>` - Run and check evals
- `report <name>` - Generate full report
- `list` - Show all evals
- `clean` - Remove old eval logs (keeps last 10 runs)
