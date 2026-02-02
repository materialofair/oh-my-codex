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
cp -R .codex/skills /path/to/your/repo/.codex/
```

Codex will automatically load skills from both locations.

Note: The installer prefers `.agent/skills` when present, and falls back to `.codex/skills`.

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

## Custom Prompts (Deprecated)

Codex supports **Custom Prompts** via `/prompts:<name>` for shortcut-style commands. This feature is **deprecated** by OpenAI but still works.

Generate a ready-made prompt set:
```bash
./scripts/generate-codex-prompts.sh
```

This creates files in `~/.codex/prompts/` so you can run:
```
/prompts:autopilot TASK="build a todo app"
/prompts:ralph TASK="refactor auth"
```

> Note: Custom Prompts may be removed in the future. Skills (`$skill`) are the recommended long-term approach.

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
- Claude Code hooks and HUD statusline
- Claude Code-specific CLI commands
- Claude Code plugin cache locations

These sections are kept in the skills for historical context but are marked as **Codex-incompatible**.

## Skills Directory

Global:
```
~/.codex/skills/<skill-name>/SKILL.md
```

Repo:
```
<repo>/.codex/skills/<skill-name>/SKILL.md
```

## Alignment Status

See `docs/ALIGNMENT.md` for a full checklist of what matches oh-my-claudecode and what cannot be aligned in Codex.

## Troubleshooting

If a skill doesn’t seem to activate:
1. Confirm `~/.codex/skills/<skill>/SKILL.md` exists.
2. Try explicit invocation: `$skill-name ...`
3. Make sure your Codex session is running in a repo with `.codex/skills` (if using repo-local install).
