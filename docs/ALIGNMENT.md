# Alignment Status: oh-my-codex vs oh-my-claudecode

This document tracks what is aligned, what is partially aligned, and what cannot be aligned due to Codex architecture limits.

## ✅ Aligned (Implemented)

- **Skills system**: Repository skill sources live in `.agent/skills/` and are installed into Codex runtime skill directories.
- **Native multi-agent orchestration**: Core skills use `spawn_agent`/`send_input`/`wait_agent` patterns.
- **MCP configuration**: `omcodex setup` writes Codex MCP config blocks (`omcodex_state`, `omcodex_memory`, `omcodex_trace`).
- **Docs & entrypoints**: `README.md`, `docs/CODEX.md`, `AGENTS.md` are Codex-first.
- **Event-driven notify extension**: `omcodex notify` provides additive plugin-style extensions.
- **Role prompt install path**: `omcodex setup` installs prompt catalog into `.codex/prompts`.

## ⚠️ Partially Aligned (Codex-Compatible Workarounds)

- **Slash command UX**: Replaced by `$skill` or `skill:` invocation.
- **MCP management UX**: Scripted config generation + Codex CLI MCP commands.

## ❌ Not Alignable (Codex Architectural Limits)

- **Claude Code plugin system** (`/plugin`, plugin cache, plugin lifecycle)
- **Execution interception lifecycle** (PreToolUse/PostToolUse style interception)
- **HUD statusline** (Claude Code-specific terminal integration)
- **Native subagent spawning** (`Task(subagent_type=...)`)

## ✅ Clarification

- Codex supports event notifications via `notify`.
- This can be extended with notify plugins, but it remains event-driven and cannot intercept tool execution.

## Legacy/Claude-Only Areas

These remain in the repo for reference but are not used by Codex:
- `commands/` (Claude slash commands)
- `docs/CLAUDE.md` and other Claude-oriented docs

## Recommended Usage (Codex)

- Use **skills**: `$autopilot`, `$ralph`, `$ultraqa`, or `autopilot:`
- Enable MCP with `scripts/generate-codex-mcp-config.sh`
