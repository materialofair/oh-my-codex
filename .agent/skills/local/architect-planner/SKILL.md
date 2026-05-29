---
name: architect-planner
description: 架构规划专家 - 使用 Codex 本地上下文、仓库证据和只读 child agent 进行大型系统架构设计与规划。
auto_invoke: true
tags: [architecture, planning, codex-native, system-design]
version: 0.2.0
source: fork
checksum: 8d45cc8e68cd1f71940dc4393ebdc3e3a1672cfea5c6fc9de7723d2244532555
updated_at: 2026-05-29T11:50:00+08:00
layer: research
---

# Architect Planner - Codex 原生架构规划

## 核心功能

面向复杂系统设计、架构评审和迁移规划。默认使用 Codex 当前会话、仓库检索、项目文档和只读 child agent；不调用外部模型 CLI。

## 触发场景

- "架构设计"
- "系统规划"
- "架构评审"
- "技术架构方案"
- "planner"

手动触发：

```text
使用 architect-planner 设计：<架构需求>
```

## Workflow

### Step 1: 收集输入

明确以下信息：

- 业务目标和成功标准
- 非功能需求：性能、可用性、数据规模、安全、合规
- 约束：团队、时间、预算、技术栈、迁移窗口
- 当前系统事实：入口、模块边界、依赖、部署方式

优先读取本地证据：

```bash
rg --files
rg -n "architecture|deploy|service|database|queue|auth|cache" README.md docs . 2>/dev/null
```

### Step 2: 项目事实扫描

如在代码仓内，先用本地 ProjectMind 或直接检索建立事实基础：

```bash
python /Users/WangQiao/claude-enhanced-quality/project_mind.py $(pwd)
```

补充读取：

- `README.md`
- `docs/`
- package/build/deploy 配置
- 关键入口文件和模块边界

### Step 3: 派发架构探索代理

复杂场景使用 `explorer` 做只读架构调研：

```text
spawn_agent(agent_type="explorer", message="<architecture exploration prompt>")
wait
close_agent
```

Prompt 框架：

```text
Your task is architecture exploration. Read-only.

<agent-instructions>
Inputs:
- Goal: <架构目标>
- Constraints: <约束>
- Known files/docs: <本地证据>

Trace the current architecture and produce:
1. Current system map
2. Critical dependencies and coupling points
3. Architecture risks
4. Candidate target architectures
5. Migration constraints and unknowns

Cite concrete files and configuration paths.
</agent-instructions>
```

### Step 4: 设计方案

至少给出：

- 推荐架构
- 备选方案和取舍
- 模块边界与数据流
- 技术选型理由
- 迁移步骤
- 风险与回滚策略
- 验证计划

### Step 5: 复核

高风险架构变更派发 `reviewer`：

```text
spawn_agent(agent_type="reviewer", message="<review architecture plan for risks>")
```

要求 reviewer 从正确性、安全、运维、迁移风险和测试缺口角度给 findings。

## 输出格式

```markdown
## Architecture Plan

### Context
[事实、约束、目标]

### Current State
[基于本地证据的现状]

### Recommendation
[推荐方案]

### Alternatives
| Option | Pros | Cons | When to choose |

### Target Architecture
[组件、边界、数据流]

### Migration Plan
1. [step] -> verify: [check]

### Risks
[风险和缓解]

### Validation
[命令、测试、指标]
```

## Fallback

如果 child agent 不可用，在当前回复中用 `[EXPLORER]` / `[REVIEWER]` 块自演分析，但必须引用本地文件和命令结果。
