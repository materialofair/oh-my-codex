---
name: analyze
description: Use this skill for root-cause oriented technical analysis with hypothesis testing, evidence capture, and actionable recommendations.
version: 0.3.0
---

# Analyze Skill

> Codex invocation: use `$analyze ...` or `analyze: ...`

Conduct deep analysis of code, architecture, bugs, performance bottlenecks, or security risks.

## Capabilities

- Root-cause analysis with explicit hypotheses.
- Dependency and execution-flow mapping.
- Pattern/anti-pattern identification.
- Risk assessment with prioritized recommendations.
- Evidence-backed conclusions with confidence levels.

## Input Requirements

- `target` (required): bug, subsystem, file set, or architecture concern.
- `question` (required): what decision/explanation is needed.
- `scope` (optional): explicit paths or modules.
- `constraints` (optional): timebox, risk level, performance/security priorities.

## How to Use

```text
$analyze why retries sometimes duplicate writes
$analyze performance bottlenecks in search endpoint
$analyze auth architecture and security gaps
```

## Workflow

1. **Gather Context**
- Read relevant files and runtime errors.
- Capture facts before proposing fixes.

2. **Form Hypotheses**
- Define 1-3 plausible root causes.
- List evidence needed to validate each one.

3. **Test and Eliminate**
- Validate hypotheses against code/log evidence.
- Reject hypotheses that conflict with observed facts.

4. **Synthesize**
- Provide root cause (or competing explanations).
- Document tradeoffs and practical next steps.

## Debugging Guardrails

- Root cause first, fix second.
- Compare broken path vs working path.
- If 3 hypotheses fail, re-scope the system boundary.

## Output Format

- **Summary**: concise answer to the main question.
- **Key Findings**: evidence-backed bullets.
- **Analysis**: reasoning chain and eliminated hypotheses.
- **Recommendations**: prioritized next actions.
- **Confidence**: HIGH/MEDIUM/LOW with uncertainty note.

Every key finding must include file paths and line numbers.

## Completion Tags

- `[PROMISE:ANALYZE_COMPLETE]`
- `[PROMISE:ANALYZE_BLOCKED]`

Use `BLOCKED` when required evidence cannot be accessed or reproduced.
