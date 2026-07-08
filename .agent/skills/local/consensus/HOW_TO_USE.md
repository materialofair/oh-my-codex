# Consensus - Detailed Usage Guide

## Overview

Use Consensus when a decision benefits from independent perspectives. The workflow uses Codex child agents rather than external model CLIs.

## Workflow

1. Define the decision, options, constraints, and success criteria.
2. Dispatch the minimum needed read-only perspectives:

```text
spawn_agent(agent_type="explorer", message="<architecture/context task>")
spawn_agent(agent_type="reviewer", message="<risk review task>")
spawn_agent(agent_type="docs-researcher", message="<docs verification task>")
```

3. Collect with `wait_agent` and clean up with `close_agent`.
4. Synthesize agreements, disagreements, assumptions, and final recommendation.

## Example Prompts

```text
使用 consensus 分析我们应该选 Redis 还是 Postgres 做队列
```

```text
使用 consensus 分析是否应该迁移到事件驱动架构
```

## Output Template

```markdown
## Consensus Decision

### Decision
### Perspectives
### Agreements
### Disagreements
### Recommendation
### Verification Plan
### When To Revisit
```

## Notes

- Multiple perspectives are not automatically correct; evidence wins.
- Keep disagreement visible when it depends on uncertain assumptions.
