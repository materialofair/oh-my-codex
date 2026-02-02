English | [简体中文](README.zh.md)

# oh-my-codex

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Role‑simulated workflows for Codex CLI.**

*Less prompt‑tuning, more shipping.*

Inspired by **oh‑my‑claudecode**, rebuilt for **Codex architecture**, and informed by:
**oh‑my‑opencode**, **everything‑claude‑code**.

---

## Install

**Recommended (one command)**
```bash
./scripts/install-codex.sh --all
```

Force overwrite:
```bash
./scripts/install-codex-force.sh --all
```

Incremental (skip existing files):
```bash
./scripts/install-codex-incremental.sh --all
```

Installs:
- **Skills** → `~/.codex/skills/`
- **Rules** → `~/.codex/rules/`
- **Prompts** → `~/.codex/prompts/`
- **MCP config + Plan mode** → `~/.codex/config.toml`

**Project‑local**
```bash
./scripts/install-codex.sh --all --project
```

---

## What You Get

- **Execution modes**: `autopilot`, `ralph`, `ultrawork`, `ultraqa`, `ultrapilot`, `swarm`, `pipeline`, `ecomode`
- **Planning & QA**: `plan`, `review`, `analyze`, `tdd`, `code-review`, `security-review`, `build-fix`, `verify`, `eval`
- **Learning & context**: `continuous-learning`, `strategic-compact`, `iterative-retrieval`, `verification-loop`
- **Rules & guardrails**: coding, security, testing, performance, git workflow
- **Plan mode enabled** (Codex 0.9+)
- **Optional /prompts shortcuts** (deprecated but usable)

---

## Codex vs Claude Code (High‑Level)

| Capability | Claude Code (oh‑my‑claudecode) | Codex (oh‑my‑codex) |
|---|---|---|
| Skills‑based workflows | ✅ | ✅ (primary) |
| Plan Mode | ⚠️ plugin‑driven | ✅ native (0.9+ with config) |
| /prompts shortcuts | ❌ | ⚠️ deprecated but usable |
| MCP support | ✅ | ✅ (config.toml / CLI) |

Note: Some Claude Code features are not available in Codex due to architectural differences. If Codex adds native support later, we will adopt it.

---

## Typical Use Cases

- **Ship a feature fast** → `autopilot: add OAuth login + tests`
- **Relentless completion** → `ralph: refactor auth until tests pass`
- **High‑throughput thinking** → `ultrawork: fix all lint + type errors`
- **Quality loop** → `ultraqa: run tests and fix until green`
- **Planning only** → `plan: design a scalable API for X`

---

## Rules (Templates)

Rules are optional guardrails you can copy to `.codex/rules/`:
- `agents.md`, `coding-style.md`, `git-workflow.md`, `hooks.md`
- `patterns.md`, `performance.md`, `security.md`, `testing.md`
- `dev.md`, `research.md`, `review.md`

Install rules automatically:
```bash
./scripts/install-codex.sh --rules
```

---

## /prompts Shortcuts (Deprecated)

Generate shortcut commands like `/prompts:autopilot`:
```bash
./scripts/generate-codex-prompts.sh
```

---

## Quick Start

```
autopilot: build a REST API for managing tasks
```

---

## Docs

- `docs/CODEX.md`
- `docs/PROMPTS.md`
- `docs/ALIGNMENT.md`

---

## License

MIT
