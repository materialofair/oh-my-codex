# Project Analyze (ProjectMind)

Analyze project architecture, dependencies, and structure using the local ProjectMind knowledge graph for intelligent project understanding.

## Quick Install

```bash
# Source of truth in this repository:
.agent/skills/local/project-analyze/
```

## Usage

```
"Analyze project structure"
"Show dependency graph"
"Identify architectural issues"
"Find high-risk files"
"Assess refactor impact"
```

## Runtime

ProjectMind is executed from the local tool directory. Prefer `python3`, fall
back to `python`, and set `PROJECTMIND_HOME` if the tools are installed
somewhere other than `/Users/WangQiao/claude-enhanced-quality`.

## What It Does

- ✅ 40-second intelligent project understanding
- ✅ Architecture pattern detection
- ✅ Dependency analysis and visualization
- ✅ Impact analysis for changes
- ✅ Knowledge graph generation
- ✅ Local-only analysis; no external model CLI dependency

## Files

- `SKILL.md` - Complete analysis methodology
- `README.md` - This quick start guide
- `HOW_TO_USE.md` - Detailed analysis guide
- `references/` - Analysis patterns (Phase 2)
- `assets/` - Report templates (Phase 2)

## When to Use

- Understanding new codebases
- Onboarding new team members
- Before making large changes
- Identifying refactoring opportunities
- Architecture documentation
