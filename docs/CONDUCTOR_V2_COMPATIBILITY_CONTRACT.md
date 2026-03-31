# Conductor v2 Compatibility Contract

## Purpose

This document defines what `oh-my-codex` Conductor v2 must preserve from upstream Gemini Conductor, and where it is allowed to diverge for Codex- and Claude-native use.

The goal is to avoid two failure modes:

1. A "lightweight helper" that is no longer Context-Driven Development.
2. A rigid Gemini-specific workflow port that fights the host runtime.

Conductor v2 is therefore defined as a **Codex-native CDD fork** with explicit compatibility boundaries.

## Source References

When interpreting compatibility, use these upstream artifacts as the reference set:

- `README.md`
- `GEMINI.md`
- `gemini-extension.json`
- `policies/conductor.toml`
- `commands/conductor/*.toml`
- `templates/workflow.md`

Repository-local files remain the source of truth for this implementation.

## Compatibility Model

Conductor v2 uses three compatibility tiers.

### Tier 1: Must Preserve

These are CDD invariants. If they are removed, Conductor v2 is no longer compatible in spirit or practice.

1. Durable project context lives on disk under a dedicated plan directory.
2. Important work is represented as a **track**.
3. Important tracks have a `spec.md` and `plan.md`.
4. A project-level registry defines track ordering and active work.
5. `status`, `review`, and `revert` operate on Conductor artifacts, not only chat memory.
6. Conductor remains the system of record for:
   - current focus track
   - task and phase progress
   - accepted requirements for important work
   - workflow constraints that matter across sessions

### Tier 2: Should Preserve

These should remain unless there is a strong Codex-native reason to change them.

1. Default plan directory is `conductor/`.
2. Commands are protocol files, not ad hoc prose.
3. Review is a first-class command.
4. File resolution supports semantic lookup instead of only hard-coded paths.
5. Brownfield projects are supported.
6. Track lifecycle supports active, completed, and archived states.

### Tier 3: May Diverge

These may be redesigned to fit Codex and Claude Code better.

1. Exact interactive setup flow.
2. Exact prompt wording and command choreography.
3. How implementation work is executed after preflight.
4. How verification is isolated.
5. How dynamic project facts are refreshed and summarized.
6. Whether the implementation step is handled by Conductor itself or delegated to other skills/native agent flows.

## Core Identity of Conductor v2

Conductor v2 is not the universal execution workflow for every task.

Conductor v2 is:

- the durable context layer for important work
- the track/spec/plan system for long-lived efforts
- the coordination layer that prepares and reconciles context

Conductor v2 is not:

- the only implementation workflow
- a replacement for native repo search, indexing, or code understanding
- the canonical source of low-level implementation truth

Code, tests, config, and git history remain the primary truth for runtime behavior.

## Architectural Split

Conductor v2 separates context into two layers.

### A. Intent Layer

Human-authored, relatively stable, reviewed deliberately.

Files:

- `conductor/product.md`
- `conductor/product-guidelines.md`
- `conductor/tech-stack.md`
- `conductor/workflow.md`
- `conductor/tracks.md`
- `conductor/tracks/<track_id>/spec.md`
- `conductor/tracks/<track_id>/plan.md`

### B. Facts Layer

Machine-maintained, refreshed from code and git, allowed to change often.

Files:

- `conductor/current.md`
- `conductor/_meta/freshness.json`
- `conductor/_meta/drift.md`
- optional: `conductor/tracks/<track_id>/state.md`

The facts layer may summarize or flag drift, but it must not silently rewrite the intent layer.

## Command Contract

Conductor v2 must preserve these command families:

1. `setup`
2. `new track`
3. `implement`
4. `review`
5. `status`
6. `revert`

Conductor v2 may add these command families:

1. `refresh`
2. `preflight`
3. `reconcile`

### Required Behavior by Command

#### `setup`

Must:

- initialize the Conductor directory structure
- create the minimum durable context files
- support brownfield bootstrap

May diverge by:

- using shorter setup flows
- preferring import/bootstrap over long questionnaires
- generating an initial facts layer

#### `new track`

Must:

- create a unique track directory
- write `spec.md`
- write `plan.md`
- register the track in `tracks.md`

May diverge by:

- using fewer questions
- deriving more context from code and git
- creating a thinner spec for low-ambiguity work

#### `implement`

Must:

- resolve the focus track
- load its `spec.md`, `plan.md`, and workflow constraints
- update track/task state as work progresses

May diverge by:

- delegating actual implementation to other skills
- using native subagents
- using Codex/Claude-native execution patterns instead of upstream Gemini execution style

`implement` must not assume Conductor is the only valid coding workflow.

#### `review`

Must:

- review code against Conductor artifacts
- use `spec.md`, `plan.md`, and workflow constraints as review inputs

May diverge by:

- using native review formats
- combining diff review with drift detection

#### `status`

Must:

- report project progress from Conductor artifacts
- identify the focus track using deterministic rules

Should also:

- report freshness of the facts layer
- surface drift warnings

#### `revert`

Must:

- use track-aware rollback semantics
- preserve safety and git-awareness

### New Command Expectations

#### `refresh`

Must:

- scan code, config, and git history
- update the facts layer
- never rewrite intent documents without explicit user approval

#### `preflight`

Must:

- prepare the minimum context an AI needs before important work
- identify the recommended read set
- prefer native repo understanding before broad document loading

#### `reconcile`

Must:

- compare intent documents with current codebase facts
- propose changes explicitly
- default to non-destructive drift reporting

## Allowed Runtime Philosophy Shift

Upstream Gemini Conductor is optimized for Gemini CLI extension flows.

Conductor v2 is allowed to shift to this runtime philosophy:

1. Native repo understanding first.
2. Conductor context second.
3. Any suitable implementation skill or native agent flow third.
4. Conductor reconciliation after meaningful changes.

This is an allowed divergence as long as Tier 1 invariants remain intact.

## Read Order Contract

Before important Conductor-guided work, the recommended read order is:

1. `conductor/current.md` if present
2. `conductor/workflow.md`
3. active track `spec.md`
4. active track `plan.md`
5. only then any broader product documents if needed

This read order is an intentional optimization. It does not weaken CDD compatibility.

## Drift Policy

Drift is expected. Silent drift is not.

Conductor v2 must treat drift as a first-class concept:

- code may move faster than docs
- facts layer may expose mismatches
- intent layer changes require explicit review

Examples of valid drift detection:

- `tech-stack.md` no longer matches dependencies
- `tracks.md` status does not match active track files
- `plan.md` indicates pending work but code or tests suggest completion
- large code changes landed without any matching track updates

## Non-Goals

Conductor v2 does not aim to:

1. replace git history
2. replace source code as ground truth
3. force every task through Conductor
4. maintain perfect real-time documentation for every small change
5. duplicate native IDE or agent indexing systems

## Acceptance Checklist

Any future Conductor redesign should be checked against this list.

A redesign is compatible only if all answers remain "yes":

1. Do important tasks still have durable track/spec/plan artifacts?
2. Can a new AI session recover active work from disk without prior chat history?
3. Do `status`, `review`, and `revert` still depend on Conductor artifacts?
4. Is there still a deterministic focus track and work ordering model?
5. Are intent documents protected from silent machine rewrites?
6. Can implementation use native Codex/Claude workflows without breaking track integrity?
7. Does the system expose drift instead of pretending documents are always current?

## Versioning Rule

If a future redesign breaks any Tier 1 invariant, it must not ship as "Conductor v2".

It must either:

- be labeled a new major mode, or
- be published as a different skill/workflow entirely

This rule prevents gradual drift from erasing the meaning of Conductor while still allowing practical Codex-native evolution.
