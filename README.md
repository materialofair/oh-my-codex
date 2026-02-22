English | [简体中文](README.zh.md)

# oh-my-codex

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Codex skill pack with runtime setup tooling.**

*Less prompt‑tuning, more shipping.*

Inspired by **oh‑my‑claudecode**, rebuilt for **Codex architecture**, and informed by:
**oh‑my‑opencode**, **everything‑claude‑code**.

---

## Install

**Recommended (runtime setup)**
```bash
npm run setup:omx
```

**Compatibility scripts**
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
- **Native subagent orchestration**: `spawn_agent` + `send_input` + `wait` + `close_agent` patterns across core skills
- **Setup runtime**: `omx setup` scope-aware installer and `omx doctor` health checks
- **Team state runtime**: `omx team start/status/advance/cancel` for staged execution state
- **Local MCP runtime surfaces**: `omx_state`, `omx_memory`, `omx_trace` servers wired by setup
- **Rules & guardrails**: coding, security, testing, performance, git workflow
- **Plan mode enabled** (Codex 0.9+)

---

## Notify Positioning

Codex does not provide Claude Code style interception lifecycle support (for example pre/post tool interception).

In this project, extensions are event-driven and built on top of Codex notifications (`notify`), not execution interception.

Use the notify extension workflow:

```bash
omx notify init
omx notify status
omx notify validate
OMX_NOTIFY_PLUGINS=1 omx notify test
```

---

## Codex vs Claude Code (High‑Level)

| Capability | Claude Code (oh‑my‑claudecode) | Codex (oh‑my‑codex) |
|---|---|---|
| Skills‑based workflows | ✅ | ✅ (primary) |
| Native subagent execution | ✅ | ✅ |
| Plan Mode | ⚠️ plugin‑driven | ✅ native (0.9+ with config) |
| MCP support | ✅ | ✅ (config.toml / CLI) |

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
- `agents.md`, `coding-style.md`, `git-workflow.md`, `notify.md`
- `patterns.md`, `performance.md`, `security.md`, `testing.md`
- `dev.md`, `research.md`, `review.md`

Install rules automatically:
```bash
./scripts/install-codex.sh --rules
```

---

## Skill Governance

Run the governance gate before shipping skill changes:

```bash
npm run governance:skills
```

This command enforces the skill documentation baseline by blocking:
- Legacy slash command patterns (for example `Run: /verify`)
- Plugin-only runtime instructions (for example `cc --plugin-dir`)
- Legacy task API syntax (`Task(...)`-style examples)

See `docs/SKILL_GOVERNANCE.md` for policy, blockers, and debt tracking.

---


## Quick Start

```
autopilot: build a REST API for managing tasks
```

---

## Docs

- `docs/CODEX.md`
- `docs/ALIGNMENT.md`
- `docs/NOTIFY.md`

---

## License

MIT
