# Agent-KB Intelligent Analysis

Query 300+ expert technical cases with intelligent LLM summarization. Get actionable recommendations with 83% context optimization.

## Quick Install

```bash
# Project-local:
.codex/skills/agent-kb/

# Global:
~/.codex/skills/agent-kb/
```

## One-Click Health Check

```bash
# Project-local
bash .codex/skills/agent-kb/scripts/health-check.sh

# Global
bash ~/.codex/skills/agent-kb/scripts/health-check.sh
```

If Agent-KB is not in the default location, set:

```bash
export AGENT_KB_HOME=/path/to/Agent-KB
```

## Usage

```
"How to optimize React list rendering?"
"Best practices for microservices communication?"
"What's the recommended approach for API rate limiting?"
```

## What It Does

- ✅ Searches 300+ historical expert cases
- ✅ Analyzes with local LLM (83% context reduction)
- ✅ Returns 400-word actionable summaries
- ✅ ~100% cache hit rate for common questions

## Files

- `SKILL.md` - Complete skill methodology
- `README.md` - This quick start guide
- `HOW_TO_USE.md` - Detailed usage examples
- `scripts/health-check.sh` - Environment and dependency validation

## Performance

- **Speed**: 0.001s (cached), 8s (first query)
- **Coverage**: Frontend, Backend, Database, Architecture, DevOps
- **Knowledge Base**: ${AGENT_KB_HOME:-$HOME/Agent-KB}/ (300+ cases)

## When to Use

- Technical "how to" questions
- Best practices inquiries
- Performance optimization advice
- Architecture decisions
- Implementation guidance
