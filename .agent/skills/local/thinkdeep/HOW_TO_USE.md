# ThinkDeep - Detailed Usage Guide

## Overview

ThinkDeep is for problems where a quick answer would be premature. It keeps reasoning evidence-led and explicit: known facts, assumptions, options, verification, and confidence.

## Workflow

1. Define the decision or question.
2. List known facts and unknowns.
3. Gather local or official evidence.
4. Compare options in a table.
5. Challenge assumptions with `reviewer` when risk is high.
6. Recommend the smallest useful next step.

## Example Prompts

```text
使用 thinkdeep 分析我们是否应该重写这个模块
```

```text
使用 thinkdeep 分析这个性能问题的可能根因
```

```text
使用 thinkdeep 比较三种发布策略
```

## Output Template

```markdown
## ThinkDeep Analysis

### Problem
### Known Facts
### Options
### Recommendation
### Verification Plan
### Open Questions
```

## Notes

- Mark speculation clearly.
- Do not invent missing facts.
- Prefer reversible recommendations when confidence is not high.
