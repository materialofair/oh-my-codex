English | [简体中文](README.zh.md)

# oh-my-codex

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Enterprise-grade Codex skill ecosystem with multi-source upstream management.**

*Less prompt‑tuning, more shipping.*

A curated collection of **190+ skills**, **35+ agents**, and **25+ MCP servers** from multiple upstream sources, with intelligent merging, conflict resolution, and governance tooling.

**Upstream Sources:**
- 🏠 **Local** (59 skills) — Custom skills for your workflow
- 🔧 **oh-my-codex** (36 skills) — Core execution modes and workflows  
- ⚡ **superpowers** (14 skills) — Advanced patterns and utilities
- 🌍 **everything-claude-code** (36 skills) — Multi-language rules, MCP configs, specialized agents

Inspired by **oh‑my‑claudecode**, rebuilt for **Codex architecture**, with manifest-driven upstream source management.

---

## Install

**Quick Start (Recommended)**
```bash
npm install -g oh-my-codex-cli
omcodex setup                    # Full installation: all sources + agents + MCP
```

**Custom Installation Options**
```bash
omcodex setup --scope user       # User-wide installation (default)
omcodex setup --scope project    # Project-local installation
omcodex setup --no-agents        # Skip global AGENTS.md template
omcodex setup --no-upstream-codex # Skip ECC agents and MCP servers
omcodex setup --force            # Force overwrite existing files
```

**Development Setup**
```bash
npm run setup:omcodex            # Runtime setup from source
```

**Legacy Compatibility Scripts**
```bash
./scripts/install-codex.sh --all
./scripts/install-codex-force.sh --all
./scripts/install-codex-incremental.sh --all
```

**What Gets Installed:**
- **190+ Skills** → `~/.codex/skills/` (merged from 4 sources with conflict resolution)
- **35+ Agents** → `~/.codex/agents/` (explorer, reviewer, docs-researcher, etc.)
- **25+ MCP Servers** → `~/.codex/config.toml` (GitHub, Context7, Exa, Memory, etc.)
- **Role Prompts** → `~/.codex/prompts/` (architect, planner, executor)
- **Rules & Guardrails** → `~/.codex/rules/` (coding, security, testing)
- **Global Guidance** → `~/.codex/AGENTS.md` (with upstream supplements)

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

### 🚀 **Execution Modes**
- **High-velocity**: `autopilot`, `ralph`, `ultrawork`, `ultraqa`, `ultrapilot`
- **Team coordination**: `swarm`, `pipeline`, `team`, `conductor`
- **Specialized**: `ecomode`, `debugging`, `verification-loop`, `continuous-learning`

### 📊 **Planning & QA**
- **Core workflows**: `plan`, `review`, `analyze`, `tdd`, `code-review`, `security-review`
- **Quality gates**: `build-fix`, `verify`, `eval`, `test-coverage`, `performance-review`
- **AI-native annotations**: `ai-commenting` builds machine-parseable context tags (`risk`, `deps`, `intent`, `test`)

### 🎯 **Multi-Source Skill Ecosystem** 
- **190+ Skills** from 4 curated upstream sources with intelligent conflict resolution
- **Local-first**: Your custom skills always win conflicts
- **Manifest-driven**: Upstream sources declare capabilities via `.omc-source/manifest.json`
- **Selection-based**: Curate which upstream artifacts to install via `.agent/curation/*.json`

### 🤖 **Agent & MCP Integration**
- **35+ Specialized Agents**: explorer, reviewer, docs-researcher, architect, planner, executor
- **25+ MCP Servers**: GitHub, Context7, Exa, Memory, Playwright, Sequential Thinking
- **Native subagent orchestration**: `spawn_agent` + `send_input` + `wait` + `close_agent` patterns
- **Role prompt catalog**: Installed under `.codex/prompts/` with upstream supplements

### 🔧 **Enterprise Tooling**
- **Setup runtime**: `omcodex setup` with scope-aware installation and health checks
- **Team state management**: `omcodex team start/status/advance/cancel` for staged execution
- **Auto skill routing**: `omcodex route "<task>"` recommends best-fit skills with confidence
- **Governance tooling**: Multi-upstream overlap analysis, skill quality scoring, conflict resolution
- **Sync management**: Upstream source refresh with local-edit protection

### 🛡️ **Rules & Guardrails**
- **Multi-language support**: TypeScript, Python, Go, Swift, PHP, Java, Kotlin, Perl, C++
- **Domain-specific**: coding, security, testing, performance, git workflow, patterns
- **Plan mode enabled** (Codex 0.9+) with MCP runtime integration

---

## Multi-Source Upstream Management

oh-my-codex implements a **manifest-driven upstream source management system** inspired by [claudecode-omc](https://github.com/materialofair/claudecode-omc), enabling curated integration of multiple skill ecosystems.

### 🏗️ **Architecture**

```
.agent/
├── skills/
│   ├── local/                    # 59 skills — local customizations (always win conflicts)
│   └── upstream/
│       ├── oh-my-codex/          # 36 skills — core execution modes  
│       ├── superpowers/          # 14 skills — advanced patterns
│       └── ecc/                  # 36 skills — everything-claude-code
│           ├── .omc-source/
│           │   └── manifest.json # source metadata + asset declarations
│           └── <skill-dirs>/     # flattened SKILL.md + agents/openai.yaml
├── curation/
│   └── ecc-codex-selection.json  # curated allowlist for ECC artifacts
└── sources.json                  # (planned) multi-source registry
```

### 🌍 **everything-claude-code (ECC) Integration**

[everything‑claude‑code](https://github.com/affaan-m/everything-claude-code) provides first‑class Codex support with 34+ skills, 3 specialized agents, and 6 MCP servers. oh‑my‑codex integrates the Codex‑native subset through intelligent manifest-driven merging.

**What `omcodex setup` does for ECC:**

1. **Skill Integration**: Loads 36 ECC skills, filters by `ecc-codex-selection.json`, resolves conflicts via quality scoring (local wins)
2. **Agent Registration**: Copies selected `.codex/agents/*.toml` → `~/.codex/agents/` and extracts `[agents.<name>]` sections from ECC's config.toml
3. **MCP Server Integration**: Injects 6 MCP servers (GitHub, Context7, Exa, Memory, Playwright, Sequential Thinking) as managed blocks in `~/.codex/config.toml`
4. **Documentation Supplements**: Appends ECC's `.codex/AGENTS.md` to global `~/.codex/AGENTS.md` via managed markers
5. **Idempotent Operations**: All managed blocks prevent duplication across re-runs

### 🔄 **Source Management Commands**

```bash
# Refresh ECC from upstream
./scripts/sync-ecc.sh              # Git sparse-checkout refresh with local-edit protection
./scripts/sync-ecc.sh --force      # Override local-edit protection

# Customize installation
omcodex setup --no-upstream-codex  # Skip ECC agents and MCP servers
omcodex setup --no-agents          # Skip global AGENTS.md template

# Governance and analysis  
npm run governance:skills:overlap:multi  # Multi-upstream conflict analysis
```

### ✏️ **Curation Workflow**

Edit `.agent/curation/ecc-codex-selection.json` to control which ECC artifacts install:

```json
{
  "skills": ["eval-harness", "frontend-design", "security-review"],
  "agents": ["explorer", "reviewer"],
  "mcpServers": ["github", "context7", "exa"]
}
```

Then `omcodex setup --force` to apply changes.

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

## Architecture & Technical Design

### 🏛️ **Multi-Source Merge Pipeline**

oh-my-codex implements a sophisticated **source-of-truth** architecture:

1. **Source Discovery**: Manifest-driven upstream source detection via `.omc-source/manifest.json`
2. **Selection-Based Curation**: Install only selected artifacts via `.agent/curation/*.json`
3. **Quality-Scored Conflict Resolution**: Local skills > oh-my-codex > superpowers > ecc
4. **Idempotent TOML Merging**: Managed blocks prevent duplication in `~/.codex/config.toml`
5. **Local-Edit Protection**: Sync scripts detect modifications and refuse to overwrite

### 🔄 **Installation Phases**

| Phase | Description | Configurable |
|-------|-------------|--------------|
| 1-3 | Core skills, prompts, rules installation | `--scope`, `--force` |
| 4 | Global AGENTS.md template + upstream supplements | `--no-agents` |
| 5 | Skills from all upstream sources with conflict resolution | Always runs |
| 6 | Upstream Codex assets (agents, MCP, config merging) | `--no-upstream-codex` |
| 7 | Health checks and validation | Always runs |

### 📊 **Codex vs Claude Code (Feature Parity)**

| Capability | Claude Code | Codex (oh‑my‑codex) |
|---|---|---|
| Skills‑based workflows | ✅ | ✅ (primary, 190+ skills) |
| Multi-source upstream management | ✅ | ✅ (manifest-driven) |
| Native subagent execution | ✅ | ✅ (spawn_agent patterns) |
| Plan Mode | ⚠️ plugin‑driven | ✅ native (0.9+ with config) |
| MCP support | ✅ | ✅ (config.toml / CLI, 25+ servers) |
| Agent orchestration | ✅ | ✅ (35+ specialized agents) |
| Hooks & interception | ✅ | ❌ (notify-driven extensions only) |

---

## Typical Use Cases

### 🚀 **High-Velocity Development**
- **Ship a feature fast** → `autopilot: add OAuth login + tests`
- **Relentless completion** → `ralph: refactor auth until tests pass`
- **High‑throughput thinking** → `ultrawork: fix all lint + type errors`
- **Quality assurance** → `ultraqa: run tests and fix until green`

### 🎯 **Specialized Workflows**
- **Architecture planning** → `plan: design a scalable API for X`
- **Security auditing** → `security-review: analyze authentication flow`
- **Frontend development** → `frontend-design: build responsive dashboard`
- **Multi-language** → `backend-patterns: optimize Python API performance`
- **Documentation** → `docs-researcher: generate API documentation`

### 🤖 **Agent-Driven Tasks**
- **Code exploration** → `explorer: analyze codebase dependencies`
- **Quality review** → `reviewer: evaluate merge request quality`
- **Research assistance** → `docs-researcher: find best practices for X`

### 🔧 **Enterprise Integration**
- **GitHub workflows** → Skills + GitHub MCP for PR automation
- **Context-aware search** → Context7 MCP for documentation lookup
- **Memory persistence** → Memory MCP for long-running project context
- **Multi-project coordination** → Team state management across repositories

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

oh-my-codex implements comprehensive governance tooling for multi-source skill ecosystems:

### 📋 **Quality Gates**
```bash
npm run governance:skills              # Documentation baseline enforcement
npm run governance:skills:llm          # LLM-assisted quality analysis  
npm run governance:skills:overlap:multi # Multi-upstream conflict analysis
npm run eval:skills                    # Skill evaluation suite
```

### 🔍 **Conflict Detection & Resolution**
```bash
# Analyze overlaps across all 4 upstream sources
npm run governance:skills:overlap:multi

# Example output:
# ecc x local: 7 conflicts (backend-patterns, security-review, tdd-workflow...)
# ecc x oh-my-codex: 1 conflict (verification-loop)  
# Resolution: local > oh-my-codex > superpowers > ecc (by quality score)
```

### 🚫 **Quality Enforcement**
The governance gate blocks skill changes that contain:
- Legacy slash command patterns (`Run: /verify`)  
- Plugin-only runtime instructions (`cc --plugin-dir`)
- Legacy task API syntax (`Task(...)`-style examples)
- Cross-platform compatibility issues
- Missing or malformed agent definitions

### 📊 **Reporting**
- **JSON reports**: `.omcodex/reports/overlap-analysis.json`
- **Markdown summaries**: `.omcodex/reports/overlap-summary.md` 
- **Quality scoring**: Automated conflict resolution via skill quality metrics
- **Source tracking**: Full provenance from manifest to installed artifact

See `docs/SKILL_GOVERNANCE.md` for policy details, blockers, and technical debt tracking.

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
omcodex test llm skills --skill-path .agent/skills/skill-tester
omcodex test llm router --cases tests/llm/router-cases.json
omcodex test llm prompts --cases tests/llm/prompt-contract-cases.json
omcodex test llm workflow
```

This is intentionally different from `oh-my-claudecode`: the center of gravity here is not external prompt evals, but letting Codex act like a test engineer after implementation. See `docs/AI_TESTING.md` and `docs/LLM_TESTING.md`.

---


## Quick Start

### ⚡ **5-Minute Setup**
```bash
# 1. Install globally
npm install -g oh-my-codex-cli

# 2. Setup everything (190+ skills, 35+ agents, 25+ MCP servers)
omcodex setup

# 3. Start building
autopilot: build a REST API for managing tasks
```

### 🎯 **Common Workflows**
```bash
# High-velocity feature development
autopilot: add user authentication with JWT tokens

# Quality-driven development
tdd: implement user registration with comprehensive tests

# Architecture planning
plan: design a microservices architecture for e-commerce

# Security review
security-review: analyze authentication and authorization flows

# Frontend development  
frontend-design: build a responsive dashboard with React

# Code exploration
explorer: analyze this codebase and explain the main components
```

### 🔧 **Advanced Usage**
```bash
# Custom source selection
omcodex setup --no-upstream-codex  # Skip ECC integration
omcodex setup --scope project      # Project-local installation

# Source management
./scripts/sync-ecc.sh              # Refresh from upstream
npm run governance:skills:overlap:multi # Analyze conflicts

# Agent orchestration
team: coordinate multiple agents to implement feature X
```

---

## Recent Improvements

### 🆕 **Version 0.2.8+ Features**
- **everything-claude-code Integration**: 36 additional skills with multi-language rules and MCP servers
- **Manifest-Driven Sources**: Upstream source management via `.omc-source/manifest.json` declarations
- **Selection-Based Curation**: Install only desired artifacts via `.agent/curation/*.json` allowlists
- **Enhanced Conflict Resolution**: Quality-scored merging with local-first priority
- **Improved TOML Handling**: Robust section extraction for `[agents.*]` and `[[mcp.servers]]` blocks
- **Local-Edit Protection**: Sync scripts detect modifications and prevent silent overwrites
- **Multi-Upstream Governance**: Comprehensive overlap analysis across all skill sources
- **Idempotent Operations**: Managed blocks prevent duplication in configuration files

### 🔧 **Technical Debt Resolved**
- **P0**: ECC agent registration now properly wires `[agents.*]` sections in config.toml
- **P1**: Separate `--no-upstream-codex` flag for granular installation control
- **P2**: Root-anchored manifest paths eliminate relative path confusion
- **P3**: Enhanced TOML parser supports array tables and comment-tolerant headers

## Documentation

### 📚 **Core Docs**
- `docs/CODEX.md` — Codex-specific architecture and patterns
- `docs/ALIGNMENT.md` — AI alignment and safety considerations  
- `docs/NOTIFY.md` — Event-driven extension system
- `docs/SKILL_GOVERNANCE.md` — Quality gates and governance policies

### 📊 **Technical References**
- `docs/AI_TESTING.md` — Codex-native testing workflows
- `docs/LLM_TESTING.md` — Internal LLM evaluation harness
- `.omcodex/reports/` — Runtime governance and analysis reports

---

## Contributing

### 🤝 **Skill Development**
1. Create skills in `.agent/skills/local/`
2. Run `npm run governance:skills` to validate
3. Test with `omcodex route` for skill routing verification

### 🌍 **Upstream Source Management**  
1. Add manifest to `.agent/skills/upstream/<source>/.omc-source/`
2. Create selection file in `.agent/curation/<source>-selection.json`
3. Update `src/merge/skill-merger.js` if new asset types needed

### 🔍 **Issue Reporting**
- Use governance tooling to identify conflicts before reporting
- Include `.omcodex/merge-report.json` for skill-related issues
- Run `omcodex doctor` for health check diagnostics

---

## License

MIT

---

**Made with ❤️ for the Codex community**  
*Less prompt-tuning, more shipping.* 🚀
