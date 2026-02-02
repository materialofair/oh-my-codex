# Alignment Status: oh-my-codex vs oh-my-claudecode

This document tracks what is aligned, what is partially aligned, and what cannot be aligned due to Codex architecture limits.

## ✅ Aligned (Implemented)

- **Skills system**: All workflows are in `.codex/skills/` and ready for Codex.
- **Pseudo multi-agent orchestration**: Every skill enforces role handoffs with `[ANALYST]/[ARCHITECT]/[EXECUTOR]/[REVIEWER]` sections.
- **MCP configuration**: Script generates Codex MCP config and includes `omc-tools` to match oh-my-claudecode.
- **Custom prompts**: `/prompts:<name>` shortcuts generation script added (deprecated but supported).
- **Docs & entrypoints**: `README.md`, `docs/CODEX.md`, `AGENTS.md` are Codex-first.

## ⚠️ Partially Aligned (Codex-Compatible Workarounds)

- **Multi-agent execution engine**: Simulated via structured role prompts inside skills (no native subagents).
- **Slash command UX**: Replaced by `$skill` or `skill:` invocation. Optional `/prompts:<name>` shortcuts.
- **MCP management**: Scripted config generation; no plugin auto-wiring.

## ❌ Not Alignable (Codex Architectural Limits)

- **Claude Code plugin system** (`/plugin`, plugin cache, plugin lifecycle)
- **Hooks lifecycle** (PreToolUse/PostToolUse/SessionStart/Stop)
- **HUD statusline** (Claude Code-specific terminal integration)
- **Native subagent spawning** (`Task(subagent_type=...)`)

## Legacy/Claude-Only Areas

These remain in the repo for reference but are not used by Codex:
- `src/` (hook engine, HUD, installer, Claude analytics)
- `hooks/` (Claude hooks)
- `commands/` (Claude slash commands)
- `docs/CLAUDE.md` and other Claude-oriented docs

## Recommended Usage (Codex)

- Use **skills**: `$autopilot`, `$ralph`, `$ultraqa`, or `autopilot:`
- Optional: generate `/prompts` shortcuts with `scripts/generate-codex-prompts.sh`
- Enable MCP with `scripts/generate-codex-mcp-config.sh`
