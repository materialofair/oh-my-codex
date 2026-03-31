---
name: deepsearch
description: Use this skill for exhaustive codebase search with query expansion, dependency tracing, and evidence-backed synthesis.
version: 0.3.0
source: fork
checksum: f92b002d1f2e4fecfd905ea57d3a5b1eb6cdaf328e0dc83d12cb9a21972c04e4
updated_at: 2026-03-12T18:57:03+08:00
---


# Deep Search Skill

> Codex invocation: use `$deepsearch ...` or `deepsearch: ...`

Perform thorough codebase search for a concept, bug surface, API usage, or architectural pattern.

## Capabilities

- Exact and fuzzy term search across large repositories.
- Query expansion with aliases/synonyms.
- Import/export and call-path tracing.
- Grouping results by implementation vs consumers.
- Structured findings with file+line evidence.

## Input Requirements

- `query` (required): concept/pattern/question.
- `scope` (optional): directory/module/file globs.
- `depth` (optional): shallow | standard | exhaustive.
- `exclude` (optional): vendor/build/generated directories.

## How to Use

```text
$deepsearch auth token refresh flow
$deepsearch where retry logic is implemented
$deepsearch usage of feature flag "enableFastPath" in src/
```

## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Minimal orchestration pattern:

```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

Fallback: run sequentially if delegation is unavailable.

## Search Workflow

### 1) Broad Pass

- Search exact term.
- Search token variants and synonyms.
- Search common symbol forms (camelCase/snake_case/kebab-case).

Recommended commands:

```bash
rg -n --hidden --glob '!node_modules' --glob '!.git' "<query>" .
rg -n "<alt_term_1>|<alt_term_2>" src tests
```

### 2) Structural Pass

- Find definitions first, then call sites.
- Track imports/exports and transitive consumers.

Recommended commands:

```bash
rg -n "export (function|class|const)|module\.exports" src
rg -n "import .*<symbol>|require\(.*<symbol>" src tests
```

### 3) Deep Dive

- Read matched files.
- Capture neighboring context and intent.
- Identify entrypoints, side effects, and edge cases.

### 4) Synthesis

Return grouped evidence and confidence.

## Output Contract

- **Primary Locations**: core implementation files (with lines).
- **Related Files**: dependencies, wrappers, consumers.
- **Usage Patterns**: consistent/anti patterns in usage.
- **Key Insights**: design conventions and gotchas.
- **Confidence**: HIGH/MEDIUM/LOW with rationale.

Include file paths and line numbers for every key claim.

## Completion and Blocking Tags

- `[PROMISE:DEEPSEARCH_COMPLETE]`
- `[PROMISE:DEEPSEARCH_BLOCKED]`

Blocked reasons include:

- query too vague
- scope too broad for available budget
- missing repository access

## Quality Rules

- Prefer `rg` for speed and coverage.
- Avoid searching generated/build directories unless explicitly requested.
- Do not claim call flow without reading implementation and consumers.
- If evidence is weak, lower confidence instead of guessing.
