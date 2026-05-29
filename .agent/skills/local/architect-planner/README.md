# Architect Planner

Codex-native architecture planning for large systems, migrations, and technical design reviews.

## Usage

```text
使用 architect-planner 设计：<架构需求>
```

## What It Does

- Collects business and non-functional requirements
- Reads local project docs, config, and code paths
- Uses `ProjectMind` and targeted `rg` searches for evidence
- Optionally delegates read-only exploration to `spawn_agent(explorer)`
- Optionally delegates risk review to `spawn_agent(reviewer)`
- Produces a migration-aware architecture plan with verification checks

## Output

- Current-state map
- Recommended target architecture
- Alternatives and tradeoffs
- Migration steps
- Risks and validation plan

## Files

- `SKILL.md` - Full workflow
- `HOW_TO_USE.md` - Usage examples
