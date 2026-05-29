---
name: conductor
description: Use when the user explicitly asks for Conductor, wants track/spec/plan/review artifacts on disk, or needs long-lived project context management. Prefer start-dev for small or one-off tasks. If Conductor is not configured in the project, start with setup.
version: 0.1.0
source: fork
checksum: adf8bf4bc4f26b82d39d35ce6699ecd65504ead8143a243de1e0c59cc3b03620
updated_at: 2026-05-29T11:50:00+08:00
intent: execution
layer: orchestration
---


# Conductor

Conductor is a Context-Driven Development (CDD) workflow for managing durable project context on disk. The working loop is:

```text
Refresh -> Spec -> Plan -> Implement -> Review -> Reconcile
```

This skill is the Codex-native adaptation of the upstream Conductor repository. Keep the workflow compatible with upstream concepts, but translate execution into Codex conventions instead of copying upstream-only behavior literally.

## When To Use

Use **Conductor** when the user wants:
- persistent artifacts under `conductor/`
- a track with `spec.md` and `plan.md`
- a governed multi-step implementation flow
- a lightweight preflight summary before important work
- review/cleanup/archive operations tied to the track lifecycle

Use **start-dev** instead when the task is small, one-off, or does not need new artifacts on disk.

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

## Upstream Alignment (Conductor)

When adapting or extending this skill, inspect the upstream repository as a protocol bundle, not just the README. The highest-value upstream files are:
- upstream project instruction files
- upstream extension metadata
- `policies/conductor.toml`
- `commands/conductor/*.toml`
- `templates/workflow.md`

Preserve these upstream ideas when they improve Codex behavior:
- `conductor/` is the default plan directory
- commands are protocol files; read the TOML `prompt` field before executing
- review is a first-class command, not an afterthought
- file resolution should work from semantic names, not only hard-coded paths
- implementation and verification should prefer isolated review contexts when possible

The compatibility boundary for this skill is defined in:
- `docs/CONDUCTOR_V2_COMPATIBILITY_CONTRACT.md`

## Universal File Resolution Protocol (Codex Adaptation)

Before using Conductor files, resolve them in this order:

1. If the project contains upstream metadata such as project instruction files, extension metadata, or `policies/conductor.toml`, read those first and honor their plan-directory declarations.
2. Otherwise, default to the fixed `conductor/` directory.
3. Resolve semantic aliases as follows:
   - Tracks Registry -> `conductor/tracks.md`
   - Product Definition -> `conductor/product.md`
   - Product Guidelines -> `conductor/product-guidelines.md`
   - Tech Stack -> `conductor/tech-stack.md`
   - Workflow -> `conductor/workflow.md`
   - Track Folder -> `conductor/tracks/<track_id>/`
   - Archive -> `conductor/archive/`
   - Temp Workspace -> `conductor/tmp/`
   - Code Styleguides -> `conductor/code_styleguides/`

If the user asks for a custom artifact path, state that Conductor defaults to `conductor/` and either:
- proceed with the default directory, or
- pause for a deliberate protocol refactor

## Core Concepts

- **Track**: A unit of work (feature or bug fix) with its own spec and plan
- **Spec**: Detailed requirements document (`spec.md`)
- **Plan**: Phased task list with checkboxes (`plan.md`)
- **Workflow**: Rules for task lifecycle, TDD, commits, and quality gates

## Directory Structure

When initialized, Conductor creates this structure in the project:

```
conductor/
├── product.md              # Product vision and goals
├── product-guidelines.md   # UX/brand guidelines
├── tech-stack.md           # Technology choices
├── workflow.md             # Development workflow rules
├── tracks.md               # Master list of all tracks
├── code_styleguides/       # Language-specific style guides
├── tracks/                 # Active tracks
│   └── <track_id>/
│       ├── metadata.json
│       ├── spec.md
│       └── plan.md
└── archive/                # Completed tracks
```

## Available Commands

| Command | Purpose |
|---------|---------|
| **Setup** | Initialize Conductor in a project (new or existing) |
| **Refresh** | Refresh the facts layer from code, config, and git state |
| **New Track** | Create a new feature/bug track with spec and plan |
| **Implement** | Execute tasks from a track's plan following TDD workflow |
| **Review** | Review a track or current changes against spec, plan, workflow, and code guidelines |
| **Status** | Show progress overview of all tracks |
| **Revert** | Git-aware rollback of tracks, phases, or tasks |

## Protocol References

The detailed protocols are in TOML format. Read the `prompt` field from each file:

| Action | Protocol File |
|--------|---------------|
| Setup project | `commands/conductor/setup.toml` |
| Refresh facts | `commands/conductor/refresh.toml` |
| Create new track | `commands/conductor/newTrack.toml` |
| Implement tasks | `commands/conductor/implement.toml` |
| Review implementation | `commands/conductor/review.toml` |
| Check status | `commands/conductor/status.toml` |
| Revert changes | `commands/conductor/revert.toml` |

**How to read**: Each `.toml` file has a `prompt` field containing the full protocol instructions.

## Task Status Markers

- `[ ]` - Pending
- `[~]` - In Progress
- `[x]` - Completed

## Key Workflow Principles

1. **The Plan is Source of Truth**: All work tracked in `plan.md`
2. **Test-Driven Development**: Write tests before implementing
3. **High Code Coverage**: Target >80% coverage
4. **Commit After Each Task**: With git notes for traceability
5. **Phase Checkpoints**: Manual verification at phase completion

## When to Use Each Protocol

- **"set up conductor" or "initialize project"** -> Read `commands/conductor/setup.toml`
- **"refresh", "sync current context", "update conductor facts"** -> Read `commands/conductor/refresh.toml`
- **"new feature", "new track", "plan a feature"** -> Read `commands/conductor/newTrack.toml`
- **"implement", "start working", "next task"** -> Read `commands/conductor/implement.toml`
- **"review", "audit", "check this track"** -> Read `commands/conductor/review.toml`
- **"status", "progress", "where are we"** -> Read `commands/conductor/status.toml`
- **"revert", "undo", "rollback"** -> Read `commands/conductor/revert.toml`
- **If the user does not mention Conductor and the task is small** -> Use `start-dev` instead

## Assets

- **Code Styleguides**: `templates/code_styleguides/` (general, go, python, javascript, typescript, html-css)
- **Workflow Template**: `templates/workflow.md`

## Critical Rules

1. **Validate every tool call** - If any fails, halt and report to user
2. **Check setup first** - Resolve and verify the required Conductor files before any operation
3. **Codex-first interaction** - Prefer reasonable assumptions; ask one concise blocking question only when necessary
4. **Plain-language UX** - Do not suggest slash commands. Tell the user what to ask for directly in natural language
5. **Codex-native delegation** - Replace upstream-only flows such as `ask_user` or isolated CLI shells with Codex chat, native subagents, and local commands
