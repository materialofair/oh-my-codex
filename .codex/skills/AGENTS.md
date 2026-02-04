<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-31 | Updated: 2026-02-01 -->

# skills

Codex skill definitions for oh-my-codex workflows.

## Purpose

Skills are reusable workflows invoked via natural language or explicit skill tags:
- `autopilot: ...`
- `use autopilot to ...`
- `$autopilot ...`

## Key Skills (Highlights)

### Execution Modes
- `autopilot` — Full autonomous execution
- `ultrawork` — Max parallel work decomposition
- `ralph` — Persistence + verification
- `ultrapilot` — Parallel autopilot with file ownership
- `swarm` — Multi-task coordination
- `pipeline` — Sequential stage execution
- `ecomode` — Token-efficient workflow
- `ultraqa` — QA cycling until success

### Planning + Review
- `plan`, `ralplan`, `review`, `analyze`, `orchestrate`, `conductor`

### Quality + Safety
- `code-review`, `security-review`, `tdd`, `build-fix`, `verify`, `eval`, `test-coverage`

### Learning + Context
- `continuous-learning`, `continuous-learning-v2`, `strategic-compact`, `iterative-retrieval`, `verification-loop`, `learn`

### Patterns
- `coding-standards`, `backend-patterns`, `frontend-patterns`, `tdd-workflow`

### Utilities
- `learner`, `note`, `cancel`, `help`, `checkpoint`, `update-codemaps`, `update-docs`, `skill-create`, `setup-pm`

## Compatibility Notes

Some skills were imported from **everything-codex** and adapted for Codex. All skills enforce the **Pseudo Multi‑Agent Protocol** to simulate role handoffs.
