---
name: consensus
description: 多视角共识决策 - 使用 Codex 主线与只读 child agent 获取架构、实现和风险视角并综合决策。
auto_invoke: true
tags: [consensus, decision, codex-native, multi-agent]
version: 0.2.0
source: fork
checksum: 8f5a3a75601e12c985ba02ce5a487e6b8afa846cd47eb1e2667cdec962bc3e5a
updated_at: 2026-05-29T11:50:00+08:00
layer: research
---

# Consensus - Codex 原生多视角共识

## 核心功能

针对技术选型、架构决策、方案取舍和高风险变更，使用 Codex 主线协调多个只读 child agent 形成共识。不调用外部模型 CLI。

## 触发场景

- "多方意见"
- "技术决策需要共识"
- "consensus 分析"
- "三方协作决策"
- "帮我比较这些方案"

手动触发：

```text
使用 consensus 分析：<决策问题>
```

## Workflow

### Step 1: 明确决策问题

收集：

- 决策问题
- 候选方案
- 约束条件
- 成功标准
- 不可接受风险
- 决策截止时间

### Step 2: 派发独立视角

推荐三个视角：

```text
spawn_agent(agent_type="explorer", message="<architecture/context perspective>")
spawn_agent(agent_type="reviewer", message="<risk/correctness perspective>")
spawn_agent(agent_type="docs-researcher", message="<docs/facts verification perspective>")
wait_agent
close_agent
```

如 agent 不可用，在当前回复内用 `[ARCHITECTURE]`、`[REVIEW]`、`[FACTS]` 三块自演。

### Step 3: 各视角输出要求

每个视角必须输出：

- 明确立场：支持 / 反对 / 有条件支持
- 关键理由
- 最大风险
- 需要验证的假设
- 推荐的最小下一步

### Step 4: 主线综合

Codex 主线对比观点：

- 一致点
- 分歧点
- 分歧是否由事实差异、价值权重或风险偏好造成
- 最终建议
- 置信度
- 验证计划

## 输出格式

```markdown
## Consensus Decision

### Decision
[决策问题]

### Perspectives
| Perspective | Position | Key Reasons | Risks | Confidence |

### Agreements
- [共同结论]

### Disagreements
- [分歧 + 原因]

### Recommendation
[最终建议]

### Verification Plan
1. [step] -> verify: [check]

### When To Revisit
[触发重新决策的条件]
```

## Guardrails

- 不把"多个角色都同意"当作证据；必须列出事实来源。
- 对不可验证假设标记低置信度。
- 对高风险决策给阶段性试点或回滚方案。
