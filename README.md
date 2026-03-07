English | [简体中文](README.zh.md)

# oh-my-codex

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Codex skill pack with runtime setup tooling.**

*Less prompt‑tuning, more shipping.*

Inspired by **oh‑my‑claudecode**, rebuilt for **Codex architecture**, and informed by:
**oh‑my‑opencode**, **everything‑claude‑code**.

---

## Install

**From npm (global)**
```bash
npm install -g oh-my-codex-cli
omcodex setup
```

**From npm (one-off)**
```bash
npx oh-my-codex-cli setup
```

**Recommended (runtime setup)**
```bash
npm run setup:omcodex
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
- **Role prompts** → `~/.codex/prompts/`
- **Rules** → `~/.codex/rules/`
- **MCP config + Plan mode** → `~/.codex/config.toml`

**Project‑local**
```bash
./scripts/install-codex.sh --all --project
```

## AGENTS.md Templates (Global + Project)

`omcodex setup` (user scope) now installs global guidance automatically:

- `templates/AGENTS.global.md` -> `~/.codex/AGENTS.md`

Use templates for manual override or project setup:

- Global template: `templates/AGENTS.global.md` -> `~/.codex/AGENTS.md`
- Project template: `templates/AGENTS.project.md` -> `<repo>/AGENTS.md`

Example:

```bash
cp templates/AGENTS.global.md ~/.codex/AGENTS.md
cp templates/AGENTS.project.md ./AGENTS.md
```

Optional discovery compatibility in `~/.codex/config.toml`:

```toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
```

---

## What You Get

- **Execution modes**: `autopilot`, `ralph`, `ultrawork`, `ultraqa`, `ultrapilot`, `swarm`, `pipeline`, `ecomode`
- **Planning & QA**: `plan`, `review`, `analyze`, `tdd`, `code-review`, `security-review`, `build-fix`, `verify`, `eval`
- **AI-native annotations**: `ai-commenting` builds machine-parseable context tags (`risk`, `deps`, `intent`, `test`) for safer model edits
- **Role prompt catalog**: `architect`, `planner`, `executor` (installed under `.codex/prompts/`)
- **Learning & context**: `continuous-learning`, `strategic-compact`, `iterative-retrieval`, `verification-loop`
- **Native subagent orchestration**: `spawn_agent` + `send_input` + `wait` + `close_agent` patterns across core skills
- **Setup runtime**: `omcodex setup` scope-aware installer and `omcodex doctor` health checks
- **Team state runtime**: `omcodex team start/status/advance/cancel` for staged execution state
- **Auto skill routing**: `omcodex route "<task>"` recommends the best-fit skills with confidence
- **Event-driven team auto-advance**: `omcodex team start "<task>" --auto` advances phases from notify events
- **Local MCP runtime surfaces**: `omcodex_state`, `omcodex_memory`, `omcodex_trace` servers wired by setup
- **Rules & guardrails**: coding, security, testing, performance, git workflow
- **Plan mode enabled** (Codex 0.9+)

---

## Notify Positioning

Codex does not provide Claude Code style interception lifecycle support (for example pre/post tool interception).

In this project, extensions are event-driven and built on top of Codex notifications (`notify`), not execution interception.

Use the notify extension workflow:

```bash
omcodex notify init
omcodex notify status
omcodex notify validate
OMX_NOTIFY_PLUGINS=1 omcodex notify test
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
npm run governance:skills:llm
npm run eval:skills
```

This command enforces the skill documentation baseline by blocking:
- Legacy slash command patterns (for example `Run: /verify`)
- Plugin-only runtime instructions (for example `cc --plugin-dir`)
- Legacy task API syntax (`Task(...)`-style examples)

See `docs/SKILL_GOVERNANCE.md` for policy, blockers, and debt tracking.

---

## Codex AI Testing

`oh-my-codex` now ships a Codex-native testing workflow for code that Codex just wrote:

```bash
omcodex test detect-stack
omcodex test changed
omcodex test analyze src/router/skill-router.js
omcodex test gen src/router/skill-router.js
```

This is the primary path when you want Codex to:

- inspect the repo stack
- auto-discover changed code files
- analyze a changed file
- generate a test plan
- generate acceptance and regression checklists
- produce a testing playbook before writing or updating tests

Generated artifacts are written under `.omcodex/testing/<target>/`.

For `oh-my-codex` itself, the internal harness is still available:

```bash
omcodex test llm all
omcodex test llm skills --skill-path .codex/skills/skill-tester
omcodex test llm router --cases tests/llm/router-cases.json
omcodex test llm prompts --cases tests/llm/prompt-contract-cases.json
omcodex test llm workflow
```

This is intentionally different from `oh-my-claudecode`: the center of gravity here is not external prompt evals, but letting Codex act like a test engineer after implementation. See `docs/AI_TESTING.md` and `docs/LLM_TESTING.md`.

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
