# Architect Planner - Detailed Usage Guide

## Overview

Use this skill for architecture design, migration planning, and system-level tradeoff analysis. The workflow is Codex-native: it uses local repository evidence, current documentation, `ProjectMind`, and read-only child agents.

## Typical Flow

1. Clarify goals, constraints, and success metrics.
2. Inspect local docs, config, and architecture-relevant files.
3. Run `ProjectMind` when project structure matters:

```bash
python /Users/WangQiao/claude-enhanced-quality/project_mind.py $(pwd)
```

4. Use `spawn_agent(explorer)` for current-state architecture tracing.
5. Use `spawn_agent(reviewer)` for risk and migration review.
6. Synthesize a plan with `step -> verify: check`.

## Example Prompts

```text
使用 architect-planner 设计一个高可用任务队列架构
```

```text
使用 architect-planner 评审当前 monolith 拆分方案
```

```text
使用 architect-planner 规划从 REST 到事件驱动架构的迁移
```

## Expected Output

```markdown
## Architecture Plan

### Context
### Current State
### Recommendation
### Alternatives
### Target Architecture
### Migration Plan
### Risks
### Validation
```

## Notes

- Cite local files and docs for project-specific claims.
- Verify framework or cloud behavior against official documentation when version-sensitive.
- Keep the first plan reversible and staged.
