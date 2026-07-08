---
name: debug-analysis
description: 深度调试分析 - 使用 Codex 本地证据检索、命令验证和只读 child agent 进行系统性根因诊断。
auto_invoke: true
tags: [debug, analysis, troubleshooting, codex-native]
version: 0.2.0
source: fork
checksum: 9f7edc9f189455069a8701e56b2c24f9b642d4308f9536aed2430fd95d37635a
updated_at: 2026-05-29T11:50:00+08:00
intent: debugging
layer: research
---

# Debug Analysis - Codex 原生深度调试

## 核心功能

使用当前 Codex 会话、仓库检索、可复现命令和只读 child agent 完成根因分析。不调用外部模型 CLI、不依赖长上下文外部包装器。

## 触发场景

- "调试问题"
- "系统性错误分析"
- "debug 这个问题"
- "根因分析"
- "为什么出现这个错误"

手动触发：

```text
使用 debug-analysis 分析：<问题描述>
```

## Workflow

### Step 1: 收集问题证据

收集并确认：

- 错误信息和完整日志片段
- 复现步骤和环境信息
- 最近改动、相关配置、入口命令
- 已尝试的修复和现象变化

优先使用本地证据：

```bash
rg -n "<error-keyword>|<symbol>|<route>" .
rg --files | rg "<suspected-area>"
git diff --stat
git log --oneline -5
```

### Step 2: 建立假设矩阵

输出 3-5 个根因假设，每个假设包含：

- 触发条件
- 支撑证据
- 反证方式
- 最小验证命令
- 若成立的修复方向

### Step 3: 派发只读诊断代理

当问题跨模块、影响面不清或需要独立视角时，派发只读 child agent：

```text
spawn_agent(agent_type="explorer", message="<trace prompt>")
wait_agent
close_agent
```

推荐 prompt 框架：

```text
Your task is to trace a bug from evidence. Read-only.

<agent-instructions>
Inputs:
- Symptom: <错误现象>
- Logs: <关键日志>
- Suspected files: <文件列表>
- Reproduction command: <命令>

Trace the real execution path. Cite exact files, symbols, and lines where possible.
Return:
1. Most likely root cause
2. Evidence chain
3. Minimal verification command
4. Risky assumptions
5. Files likely needing changes
</agent-instructions>
```

如果需要严苛复核，可再派发：

```text
spawn_agent(agent_type="reviewer", message="<review the diagnosis>")
```

### Step 4: 本地验证

按问题类型选择最小验证：

- 构建问题：运行项目已有 build/typecheck 命令
- 测试失败：先复现单测，再跑相关测试集
- 运行时错误：运行最小复现脚本或服务入口
- 配置问题：打印有效配置，避免猜测

### Step 5: 输出诊断报告

```markdown
## Debug Analysis

### Symptom
[用户可见问题]

### Evidence
- [file:line or command output summary]

### Root Cause
[最可能根因，带证据链]

### Verification
- Command: `<command>`
- Result: [pass/fail/key output]

### Fix Direction
1. [最小修复路径]
2. [需要补测的地方]

### Remaining Risk
[未验证假设或外部依赖]
```

## Fallback

如果 child agent 不可用，在当前回复中用 `[EXPLORER]`、`[REVIEWER]`、`[SYNTHESIS]` 三段自演同样流程，但仍必须基于本地文件、日志和命令验证。
