---
name: research
description: Use this skill for multi-stage, evidence-based research with parallel investigation, source ranking, verification, and synthesis.
argument-hint: <research goal>
version: 0.3.0
source: fork
checksum: 40502175b1337bd8c4d30d0a3d8acc4097bdbaa442314ce8b76aa478f8a11ffb
updated_at: 2026-03-12T18:57:03+08:00
intent: research
layer: research
---


# Research Skill

> Codex invocation: use `$research ...` or `research: ...`

Orchestrate parallel scientist agents for comprehensive, citation-backed research.

## Capabilities

- Decompose broad questions into independent research stages.
- Run parallel investigations with bounded concurrency.
- Rank and filter sources by authority and recency.
- Cross-validate findings and resolve contradictions.
- Generate reproducible report artifacts with evidence trails.

## Input Requirements

- `goal` (required): research question or decision to support.
- `scope` (required): domain/system/time window.
- `deliverable` (required): summary, comparison, recommendation, or deep report.
- `constraints` (optional): budget, risk tolerance, compliance context.
- `deadline` (optional): timebox and required depth.

## How to Use

```text
$research Compare OAuth token rotation strategies for Node backends
$research AUTO: Analyze auth failure patterns in this codebase
$research status
$research resume
$research list
$research report <session-id>
```

## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait_agent`, and clean up with `close_agent`.

Minimal orchestration pattern:

```text
spawn_agent -> send_input (optional) -> wait_agent -> close_agent
```

Fallback: if delegation is unavailable, execute stages sequentially in one thread.

## Research Operating Rules

1. Retrieval over memory: prefer repository facts and authoritative external sources.
2. Primary sources first: official docs, standards, papers, vendor references.
3. Date awareness: for unstable topics, verify publication/update dates.
4. Evidence minimum: each finding must include at least one source and one artifact.
5. Contradiction handling: unresolved conflicts must be surfaced, not hidden.

## Source Quality Rubric

Priority order:

1. Official documentation/specifications
2. Peer-reviewed papers / standards bodies
3. Maintainer-authored technical references
4. High-quality practitioner analysis (only when primary sources are insufficient)

For each citation, capture:

- URL
- source type
- publication/update date
- relevance note

## Workflow

### Stage 1: Decomposition

Break goal into 3-7 independent stages:

```markdown
## Research Decomposition

Goal: <original goal>

### Stage N: <name>
- Focus: <what this stage investigates>
- Scope: <files/systems/sources>
- Expected output: <artifact>
- Tier: LOW | MEDIUM | HIGH
```

### Stage 2: Parallel Execution

Run independent stages in parallel (max 5 concurrent scientists).

Tier guidance:

- `LOW`: enumeration/counting/simple extraction
- `MEDIUM`: pattern analysis/comparison/synthesis
- `HIGH`: tradeoff reasoning/architecture/security implications

If stages > 5, execute in batches.

### Stage 3: Verification

Cross-check for:

1. Contradictions between stage findings
2. Missing dependencies or blind spots
3. Weak evidence or outdated sources
4. Overstated confidence

Verification output must be one of:

- `[VERIFIED]`
- `[CONFLICTS:<list>]`

### Stage 4: Synthesis

Produce final report with:

- executive summary
- key findings with confidence
- options/tradeoffs
- recommendations
- limitations and open questions

## AUTO Mode

AUTO runs decomposition -> execution -> verification -> synthesis continuously.

Loop control:

- `maxIterations`: 10 (default)
- stop on completion promise or blocking promise
- persist state after each stage transition

Promise tags:

- `[PROMISE:RESEARCH_COMPLETE]`
- `[PROMISE:RESEARCH_BLOCKED]`

## Session State

Directory:

```text
.omc/research/{session-id}/
  state.json
  stages/stage-*.md
  findings/raw/
  findings/verified/
  report.md
```

`state.json` minimum contract:

```json
{
  "id": "research-<timestamp>-<id>",
  "goal": "",
  "status": "pending|in_progress|complete|blocked|cancelled",
  "mode": "standard|auto",
  "iteration": 1,
  "maxIterations": 10,
  "stages": [],
  "verification": {
    "status": "pending|passed|failed",
    "conflicts": []
  },
  "updatedAt": "ISO-8601"
}
```

## Structured Evidence Tags

Use structured tags in stage outputs:

```text
[FINDING:<id>] <title>
<analysis>
[/FINDING]

[EVIDENCE:<finding-id>]
- Source: <url>
- File: <path or n/a>
- Date: <YYYY-MM-DD>
- Note: <why this evidence supports finding>
[/EVIDENCE]

[CONFIDENCE:HIGH|MEDIUM|LOW]
<confidence rationale>
```

Quality gates:

- every `[FINDING]` must include `[EVIDENCE]`
- every finding must include `[CONFIDENCE]`
- unsupported claims must be downgraded or removed

## Report Template

```markdown
# Research Report: <goal>

## Executive Summary
<2-3 paragraphs>

## Methodology
- decomposition strategy
- source selection criteria
- verification approach

## Findings
### Finding 1: <title>
Confidence: <HIGH|MEDIUM|LOW>
Evidence: <linked citations>

## Conflicts and Resolutions
<resolved/unresolved contradictions>

## Recommendations
1. <action>
2. <action>

## Limitations
- <gap>
- <gap>
```

## Session Commands

- `$research status`: show current session state.
- `$research resume [session-id]`: continue interrupted research.
- `$research list`: list saved sessions.
- `$research report <session-id>`: regenerate report from saved stage files.
- `$research cancel`: stop and persist current state.

## Cancellation and Resume

Cancellation keeps `.omc/research/{session-id}/` intact.

Resume loads `state.json` and continues pending stages only.

## Failure Handling

Stop and emit `[PROMISE:RESEARCH_BLOCKED]` when:

- required data is inaccessible
- source quality is below minimum and cannot be improved
- contradictions cannot be resolved within iteration budget

Always include blocker details and recommended next action.
