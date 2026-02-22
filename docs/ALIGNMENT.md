# Alignment Status: oh-my-codex vs oh-my-claudecode

This document tracks what is aligned, what is partially aligned, and what cannot be aligned due to Codex architecture limits.

## ✅ Aligned (Implemented)

- **Skills system**: All workflows are in `.codex/skills/` and ready for Codex.
- **Native multi-agent orchestration**: Core skills use `spawn_agent`/`send_input`/`wait` patterns.
- **MCP configuration**: `omx setup` writes Codex MCP config blocks (`omx_state`, `omx_memory`, `omx_trace`).
- **Docs & entrypoints**: `README.md`, `docs/CODEX.md`, `AGENTS.md` are Codex-first.
- **Event-driven notify extension**: `omx notify` provides additive plugin-style extensions.

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
