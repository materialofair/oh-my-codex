简体中文 | [English](README.md)

# oh-my-codex

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**面向 Codex CLI 的多代理工作流。**

*少调 prompt，多交付。*

本项目参考 **oh‑my‑claudecode**，并结合 **oh‑my‑opencode**、**everything‑claude‑code** 的经验，
但完全**针对 Codex 架构重建**。

---

## 安装

**推荐（一键安装）**
```bash
./scripts/install-codex.sh --all
```

安装内容包括：
- **Skills** → `~/.codex/skills/`
- **Rules** → `~/.codex/rules/`
- **Prompts** → `~/.codex/prompts/`
- **MCP 配置 + Plan 模式** → `~/.codex/config.toml`

**项目级安装**
```bash
./scripts/install-codex.sh --all --project
```

---

## 安装后你能获得什么

- **执行模式**：`autopilot`, `ralph`, `ultrawork`, `ultraqa`, `ultrapilot`, `swarm`, `pipeline`, `ecomode`
- **规划与质量**：`plan`, `review`, `analyze`, `tdd`, `code-review`, `security-review`, `build-fix`, `verify`, `eval`
- **学习与上下文**：`continuous-learning`, `strategic-compact`, `iterative-retrieval`, `verification-loop`
- **规则与守护**：编码 / 安全 / 测试 / 性能 / Git 工作流
- **Plan 模式已开启**（Codex 0.9+）
- **可选 /prompts 快捷指令**（deprecated 但可用）

---

## Codex vs Claude Code（高层对比）

| 能力 | Claude Code（oh‑my‑claudecode） | Codex（oh‑my‑codex） |
|---|---|---|
| Skills 工作流 | ✅ | ✅（主方式） |
| Plan 模式 | ⚠️ 插件驱动 | ✅ 原生（0.9+ 配置开启） |
| /prompts 快捷指令 | ❌ | ⚠️ deprecated 但可用 |
| MCP 支持 | ✅ | ✅（config.toml/CLI） |

说明：部分 Claude Code 能力因 Codex 架构差异暂不可用。若未来 Codex 原生支持，我们会第一时间跟进。

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
- `agents.md`, `coding-style.md`, `git-workflow.md`, `hooks.md`
- `patterns.md`, `performance.md`, `security.md`, `testing.md`
- `dev.md`, `research.md`, `review.md`

一键安装 rules：
```bash
./scripts/install-codex.sh --rules
```

---

## /prompts 快捷指令（Deprecated）

生成快捷指令：
```bash
./scripts/generate-codex-prompts.sh
```

---

## 快速开始

```
autopilot: build a REST API for managing tasks
```

---

## 文档

- `docs/CODEX.md`
- `docs/PROMPTS.md`
- `docs/ALIGNMENT.md`

---

## 许可

MIT
