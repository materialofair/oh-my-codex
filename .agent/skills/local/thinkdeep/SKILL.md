---
name: thinkdeep
description: 深度推理分析 - 使用 Codex 结构化推理、证据检索和可选只读 child agent 处理复杂问题。
auto_invoke: true
tags: [thinkdeep, reasoning, codex-native, analysis]
version: 0.2.0
source: fork
checksum: cc09198458e40858784ec0f9625ebd1449295af2143195153dffc0b262d82841
updated_at: 2026-05-29T11:50:00+08:00
layer: research
---

# ThinkDeep - Codex 原生深度推理

## 核心功能

用于复杂决策、战略分析、多假设推理和高不确定性问题。默认在当前 Codex 会话内完成推理，并结合本地证据、命令验证和可选 child agent；不调用外部模型 CLI。

## 触发场景

- "深度思考"
- "复杂推理"
- "thinkdeep"
- "系统性分析"
- "战略规划"

手动触发：

```text
使用 thinkdeep 分析：<复杂问题>
```

## Workflow

### Step 1: 判断是否需要深度推理

适用条件：

- 多步骤决策
- 多目标权衡
- 高不确定性
- 需要跨文件、跨系统、跨业务约束综合

不适用时，直接给简短结论或使用更具体的 skill。

### Step 2: 建立问题框架

输出：

1. 问题陈述
2. 关键约束
3. 成功标准
4. 已知事实
5. 未知项
6. 决策时间尺度

### Step 3: 收集证据

按问题类型读取本地或外部证据：

- 代码问题：`rg`、`rg --files`、相关测试和配置
- 产品/架构问题：README、docs、ADR、issue/PR 文档
- 版本敏感问题：使用官方文档或主源验证

### Step 4: 多假设分析

至少列出 2-4 个候选解释或方案：

```markdown
| Hypothesis / Option | Evidence For | Evidence Against | Verification | Confidence |
```

### Step 5: 可选只读代理

需要独立视角时：

```text
spawn_agent(agent_type="explorer", message="<explore evidence for/against options>")
spawn_agent(agent_type="reviewer", message="<challenge assumptions and risks>")
wait
close_agent
```

### Step 6: 综合结论

给出：

- 推荐结论
- 为什么不是其他方案
- 最小下一步
- 需要验证的关键假设
- 失败时的回滚/替代路径

## 输出格式

```markdown
## ThinkDeep Analysis

### Problem
[问题和成功标准]

### Known Facts
- [事实 + 来源]

### Options
| Option | Pros | Cons | Risk | Confidence |

### Recommendation
[推荐方案]

### Verification Plan
1. [step] -> verify: [check]

### Open Questions
[仍需用户或外部状态确认的问题]
```

## Fallback

如果没有足够证据，不要编造结论。明确列出缺口，并给出可执行的取证步骤。
