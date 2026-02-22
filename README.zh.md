简体中文 | [English](README.md)

# oh-my-codex

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**面向 Codex CLI 的原生 subagent 工作流。**

*少调 prompt，多交付。*

本项目参考 **oh‑my‑claudecode**，并结合 **oh‑my‑opencode**、**everything‑claude‑code** 的经验，
但完全**针对 Codex 架构重建**。

---

## 安装

**推荐（一键安装）**
```bash
./scripts/install-codex.sh --all
```

强制覆盖安装：
```bash
./scripts/install-codex-force.sh --all
```

增量安装（跳过已存在文件）：
```bash
./scripts/install-codex-incremental.sh --all
```

安装内容包括：
- **Skills** → `~/.codex/skills/`
- **角色 Prompt** → `~/.codex/prompts/`
- **Rules** → `~/.codex/rules/`
- **MCP 配置 + Plan 模式** → `~/.codex/config.toml`

**项目级安装**
```bash
./scripts/install-codex.sh --all --project
```

---

## 安装后你能获得什么

- **执行模式**：`autopilot`, `ralph`, `ultrawork`, `ultraqa`, `ultrapilot`, `swarm`, `pipeline`, `ecomode`
- **规划与质量**：`plan`, `review`, `analyze`, `tdd`, `code-review`, `security-review`, `build-fix`, `verify`, `eval`
- **角色 Prompt 目录**：`architect`, `planner`, `executor`（安装到 `.codex/prompts/`）
- **学习与上下文**：`continuous-learning`, `strategic-compact`, `iterative-retrieval`, `verification-loop`
- **原生 subagent 编排**：核心 skill 统一使用 `spawn_agent` + `send_input` + `wait` + `close_agent`
- **通知扩展**：`omcodex notify`（事件驱动通知扩展，不是拦截执行）
- **规则与守护**：编码 / 安全 / 测试 / 性能 / Git 工作流
- **Plan 模式已开启**（Codex 0.9+）

---

## Codex vs Claude Code（高层对比）

| 能力 | Claude Code（oh‑my‑claudecode） | Codex（oh‑my‑codex） |
|---|---|---|
| Skills 工作流 | ✅ | ✅（主方式） |
| 原生 subagent 执行 | ✅ | ✅ |
| Plan 模式 | ⚠️ 插件驱动 | ✅ 原生（0.9+ 配置开启） |
| MCP 支持 | ✅ | ✅（config.toml/CLI） |

---

## 典型使用场景

- **快速交付功能** → `autopilot: add OAuth login + tests`
- **持续完成模式** → `ralph: refactor auth until tests pass`
- **高并行思考** → `ultrawork: fix all lint + type errors`
- **质量闭环** → `ultraqa: run tests and fix until green`
- **纯规划** → `plan: design a scalable API for X`

---

## 规则模板（Rules）

可选规则模板，复制到 `.codex/rules/` 使用：
- `agents.md`, `coding-style.md`, `git-workflow.md`, `notify.md`
- `patterns.md`, `performance.md`, `security.md`, `testing.md`
- `dev.md`, `research.md`, `review.md`

一键安装 rules：
```bash
./scripts/install-codex.sh --rules
```

---

## Skill 治理

在发布或合并 skill 文档变更前，先运行治理门禁：

```bash
npm run governance:skills
```

这个命令会阻断以下高风险残留：
- 旧的 slash 命令写法（例如 `Run: /verify`）
- plugin 专用运行指令（例如 `cc --plugin-dir`）
- 旧式任务 API 示例（`Task(...)` 语法）

详细规则见 `docs/SKILL_GOVERNANCE.md`。

---


## 快速开始

```
autopilot: build a REST API for managing tasks
```

---

## 文档

- `docs/CODEX.md`
- `docs/ALIGNMENT.md`
- `docs/NOTIFY.md`

---

## 许可

MIT
