---
name: aireview
description: Professional Codex-native multi-agent code review with confidence scoring
version: 0.2.0
source: fork
checksum: 68532b697123ed831fda4f0e70cd4b5f28ff091bc22eb082b0afa9c95f0a6f67
updated_at: 2026-05-29T11:50:00+08:00
intent: code-review
layer: quality
---

# aireview - Codex Native Code Review

## Positioning

`aireview` is the advanced review layer. Use normal `code-review` for fast baseline findings, then escalate to `aireview` when the diff is large, sensitive, cross-cutting, security-relevant, or release-blocking.

All review output should be in Chinese unless the user asks otherwise.

## Native Subagent Protocol

Codex supports read-only child agents. Delegate with `spawn_agent`, collect with `wait`, and clean up with `close_agent`.

```text
spawn_agent -> wait -> close_agent
```

No external model CLI is required. Deep mode is implemented with Codex child agents.

## Quick Usage

```bash
aireview --diff
aireview --diff --staged
aireview HEAD~1..HEAD
aireview origin/feature-branch
aireview origin/feature-branch --quick
aireview origin/feature-branch --deep
aireview --pr 123
```

## Review Modes

### Quick

Use for small diffs. Main Codex performs a focused review:

- obvious correctness bugs
- security issues
- breaking API or compatibility changes
- missing critical tests

### Standard

Use for ordinary PRs. Dispatch read-only perspectives:

| Perspective | Agent | Focus |
|---|---|---|
| Context explorer | `explorer` | Changed files, local conventions, execution path |
| Owner reviewer | `reviewer` | Correctness, security, regressions, missing tests |
| Docs verifier | `docs-researcher` | API/version claims and external behavior when needed |

### Deep

Use for large or high-risk changes. Run multiple focused review passes:

1. `explorer`: trace architecture and integration impact
2. `reviewer`: lead with concrete bugs and risks
3. `docs-researcher`: verify version-sensitive claims
4. Main Codex: deduplicate, score confidence, and produce final findings

## Workflow

### Step 1: Gather Context

Run:

```bash
git status --short
git diff --stat
git diff
git diff --staged
```

For branch reviews:

```bash
git fetch --all --prune
git diff --stat main...<branch>
git diff main...<branch>
```

Read applicable repo instructions and changed files before judging.

### Step 2: Dispatch Review Agents

Example prompts:

```text
spawn_agent(agent_type="explorer", message="
Read-only. Trace the changed execution paths and cite files/symbols.
Focus on architecture impact, coupling, and hidden integration points.
")
```

```text
spawn_agent(agent_type="reviewer", message="
Read-only. Review like an owner.
Lead with correctness, security, regressions, and missing tests.
Return only concrete findings with file/line references when possible.
")
```

```text
spawn_agent(agent_type="docs-researcher", message="
Read-only. Verify any framework/API/version-sensitive claims against primary docs
or local package/config versions. Cite sources.
")
```

### Step 3: Score Findings

For each finding:

- Severity: P0/P1/P2/P3
- Confidence: 0-100
- Evidence: file/line, command, test, or doc source
- Fix direction: concise and actionable

Filter out findings below 80 confidence unless the risk is severe and clearly labeled uncertain.

### Step 4: Final Report

Lead with findings:

```markdown
## Findings

1. [P1] Title
   - File: `path:line`
   - Evidence: ...
   - Impact: ...
   - Fix: ...
   - Confidence: 90

## Open Questions

## Test Gaps

## Summary
```

## Guardrails

- Findings first; summary later.
- No style-only comments unless they hide a real bug.
- Do not rewrite code during review unless the user explicitly asks for fixes.
- Do not rely on agent agreement as evidence; cite files, commands, or primary docs.

## Fallback

If child agents are unavailable, produce the same review in one response using:

```markdown
[EXPLORER]
[REVIEWER]
[DOCS]
[SYNTHESIS]
```
