---
name: multi-model-research
description: 多代理技术调研 - 使用 Codex 主线与只读 child agent 并行收集架构、实现、文档和风险视角。
auto_invoke: true
tags: [research, multi-agent, codex-native, no-timeout]
version: 0.2.0
source: fork
checksum: 73425cb43114bcd9aa8c4b8e527638ed77aa0385ca025a7a52a5cbeb7754fc83
updated_at: 2026-05-29T11:50:00+08:00
intent: research
layer: research
---

# Multi-Agent Research Skill (Codex Native)

## 核心优势

- 使用 Codex 原生 child agent 协议
- 不依赖外部模型 CLI 或 MCP 桥接
- 可并行收集架构、代码、文档、风险视角
- 主线 Codex 负责证据整合和最终建议
- 支持本地仓库证据与官方文档验证

## 触发场景

- "多代理调研"
- "技术选型分析"
- "架构决策"
- "多 AI 协作研究"
- "对比不同视角"
- "给我一个有证据的调研结论"

手动触发：

```text
使用 multi-model-research 分析 <你的问题>
```

## Workflow

### Step 1: 明确调研范围

确认：

- 调研主题
- 候选方案
- 评估维度：架构、实现、性能、安全、成本、迁移、运维
- 是否需要联网查官方文档
- 是否需要读取本地仓库

### Step 2: 并行派发只读代理

根据问题选择最小代理集：

```text
spawn_agent(agent_type="explorer", message="<architecture and repo evidence task>")
spawn_agent(agent_type="reviewer", message="<risk and correctness task>")
spawn_agent(agent_type="docs-researcher", message="<official docs verification task>")
wait
close_agent
```

常用分工：

| Agent | 关注点 | 输出 |
|---|---|---|
| explorer | 架构、代码路径、依赖关系 | 事实地图、方案适配性 |
| reviewer | 风险、安全、测试缺口、回归风险 | findings、阻塞项 |
| docs-researcher | 官方文档、版本行为、API 真实性 | 引用来源、版本约束 |

### Step 3: 主线整合

Codex 主线必须：

- 去重观点
- 区分事实、推断和建议
- 标注来源
- 给出推荐方案和备选方案
- 给出验证计划

### Step 4: 输出 ResearchPack

```markdown
## ResearchPack

### Topic
[调研主题]

### Sources
- [本地文件 / 官方文档 / 命令]

### Findings
| Dimension | Finding | Evidence | Confidence |

### Options
| Option | Pros | Cons | Risks | Fit |

### Recommendation
[推荐方案 + 理由]

### Validation Plan
1. [step] -> verify: [check]

### Open Questions
[仍需确认的问题]
```

## Fallback

如果 child agent 不可用，主线 Codex 在同一回复中使用 `[EXPLORER]`、`[REVIEWER]`、`[DOCS]`、`[SYNTHESIS]` 四段完成同等分析。

## Guardrails

- 对库、框架、云服务和 API 行为必须查官方文档或本地版本配置。
- 不把无来源的模型观点当事实。
- 不为了"多视角"增加无关代理；保持最小充分并行。
