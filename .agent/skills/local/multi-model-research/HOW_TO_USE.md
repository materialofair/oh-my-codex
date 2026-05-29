# Multi-Agent Research - Detailed Usage Guide

## Overview

This skill performs technical research with Codex-native child agents. It is useful for architecture choices, library adoption, security tradeoffs, migration planning, and implementation strategy.

## Workflow

1. Clarify the research topic and options.
2. Decide which perspectives are needed:
   - `explorer` for architecture and local code evidence
   - `reviewer` for risk and correctness
   - `docs-researcher` for official documentation and release behavior
3. Dispatch only the minimum useful agents.
4. Collect results and synthesize a ResearchPack.
5. Provide validation commands or proof-of-concept steps.

## Example Prompts

```text
使用 multi-model-research 分析 Next.js 迁移到新版本的风险
```

```text
使用 multi-model-research 比较 Redis Stream、SQS 和 Postgres 队列表
```

```text
使用 multi-model-research 调研这个仓库的插件加载架构
```

## Output Template

```markdown
## ResearchPack

### Topic
### Sources
### Findings
### Options
### Recommendation
### Validation Plan
### Open Questions
```

## Troubleshooting

- If child agents are unavailable, use `[EXPLORER]`, `[REVIEWER]`, `[DOCS]`, and `[SYNTHESIS]` blocks in the current response.
- If official documentation is required and network is unavailable, state the unverified assumption and use local version/config evidence.
- If local tests cannot run, report the exact command and failure reason.
