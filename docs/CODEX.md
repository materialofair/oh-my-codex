# oh-my-codex for Codex CLI

This repo adapts the oh-my-claudecode workflows to **OpenAI Codex CLI** by packaging them as **Codex skills**.

## Install

### Option A: Global (recommended)
```bash
./scripts/install-codex.sh
```

Force overwrite:
```bash
./scripts/install-codex-force.sh
```

Incremental (skip existing files):
```bash
./scripts/install-codex-incremental.sh
```

### Option B: Repo-local
```bash
cp -R .agent/skills /path/to/your/repo/.codex/
```

Codex will automatically load skills from both locations.

Note: The installer prefers `.agent/skills` when present, and falls back to `.codex/skills`.
In this repository, `.agent/skills` is the maintained source directory. `.codex/skills` is a runtime destination, not a second source tree.

## Enable Codex Plan Mode (0.9+)

Codex supports native plan mode when you enable collaboration modes in `config.toml`:
```
[features]
collaboration_modes = true
```

Use our script to set it automatically:
```bash
./scripts/generate-codex-mcp-config.sh --enable-collab
```

## MCP Setup (Codex)

Codex loads MCP servers from `~/.codex/config.toml` or a repo-local config.

Generate a starter config with common servers:
```bash
./scripts/generate-codex-mcp-config.sh
```

To write a repo-local config:
```bash
./scripts/generate-codex-mcp-config.sh --project
```

You can also manage MCP servers via the Codex CLI (recommended):
```bash
codex mcp add
codex mcp list
```

## Supported vs Unsupported Features

### Supported
- Execution modes: autopilot, ultrawork, ralph, ultrapilot, swarm, pipeline, ecomode
- Planning, review, QA, research, and code-quality workflows
- Skill learning and local skill management

### Not Supported (Codex limitations)
- Claude Code marketplace plugin install
- Claude Code-style execution interception lifecycle (pre/post tool interception)
- Claude Code-specific CLI commands
- Claude Code plugin cache locations

Codex does support event notifications via `notify`. In this project, all extensibility is event-driven notify dispatch, not execution interception.

## Notify Extension Workflow

```bash
omcodex notify init
omcodex notify status
omcodex notify validate
OMX_NOTIFY_PLUGINS=1 omcodex notify test
```

Plugins are discovered from:

- `.omcodex/notify/*.mjs` (primary)
- `.omcodex/notify-plugins/*.mjs` (legacy compatibility)

## Skills Directory

Global:
```
~/.codex/skills/<skill-name>/SKILL.md
```

Repo:
```
<repo>/.agent/skills/<skill-name>/SKILL.md
```

## Prompts Directory

Global:
```
~/.codex/prompts/<prompt-name>.md
```

Repo:
```
<repo>/.codex/prompts/<prompt-name>.md
```

## Alignment Status

See `docs/ALIGNMENT.md` for a full checklist of what matches oh-my-claudecode and what cannot be aligned in Codex.

## Troubleshooting

If a skill doesn’t seem to activate:
1. Confirm `~/.codex/skills/<skill>/SKILL.md` exists.
2. Try explicit invocation: `$skill-name ...`
3. Make sure your Codex session is running in a repo where repo-local skills have been copied into `.codex/skills` from `.agent/skills` (if using repo-local install).

## New Productivity Commands

- Route task to best-fit skills:
  - `omcodex route "fix auth lint + tests"`
- Start team state with auto phase advancement:
  - `omcodex team start "ship oauth login" --auto`
- Run Codex-native smart testing after code changes:
  - `omcodex test detect-stack`
  - `omcodex test changed`
  - `omcodex test analyze src/router/skill-router.js`
  - `omcodex test gen src/router/skill-router.js`
- Resolve an installed skill directory for script-backed skills:
  - `omcodex skill path impeccable`
- Run the internal repository harness:
  - `omcodex test llm all`
  - `omcodex test llm router --cases tests/llm/router-cases.json`
  - `omcodex test llm prompts --cases tests/llm/prompt-contract-cases.json`
  - `omcodex test llm workflow`

## LLM Testing

The Codex adaptation does not clone the Claude-side testing runtime directly.

Instead, it does two things:

- it helps Codex generate stronger tests for newly written code
- `SKILL.md` governance and quality
- skill routing regression fixtures
- role prompt contracts
- workflow surfaces like `team` and `notify`

Detailed usage and design notes live in `docs/AI_TESTING.md` and `docs/LLM_TESTING.md`.
