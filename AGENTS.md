<!-- Generated: 2026-01-31 | Updated: 2026-01-31 -->

# oh-my-codex

Skill pack and workflow orchestration for **OpenAI Codex CLI**.

**Version:** 0.1.0
**Purpose:** Make Codex behave like a multi-agent conductor using structured skills

## Purpose

oh-my-codex enhances Codex with:
- **Execution modes** (autopilot, ultrawork, ralph, ultrapilot, swarm, pipeline, ecomode)
- **Quality workflows** (plan, review, ultraqa, security-review, tdd)
- **Reusable skills** for research, diagnosis, and development flows

## Key Files

| File | Description |
|------|-------------|
| `README.md` | Entry point documentation |
| `docs/CODEX.md` | Codex-specific install and usage guide |
| `.agent/skills/` | All Codex skill definitions |
| `scripts/install-codex.sh` | Global skill installer |

## For AI Agents

### Skill Invocation

Codex auto-loads skills from:
- `~/.codex/skills/<skill>/SKILL.md`
- `<repo>/.codex/skills/<skill>/SKILL.md`

When the user mentions a skill name or uses `$skill`, you should follow that skill.

### Source-of-Truth Workflow (Mandatory)

For this repository, **`oh-my-codex` is the single source of truth** for skills and docs.

Required order:
1. Edit and validate files in this repo first (for example `.agent/skills/**/SKILL.md`).
2. Commit/push repository changes.
3. Install/sync to runtime using installer scripts (for example `scripts/install-codex.sh` / `scripts/install-codex-force.sh`).

Do **not** use `~/.codex/skills` as the primary editing location.
Direct edits under `~/.codex/skills` are temporary at most, and must be immediately backported to repo before considering work complete.

### Compatibility Notes

Codex does **not** support Claude Code plugins, hooks, or HUD. Any mention of:
- Claude Code plugin commands
- `.claude/` plugin cache paths
- Claude Code-specific CLI commands

…should be treated as **legacy** references from the original oh-my-claudecode.

### Testing

No mandatory tests. If you change scripts, run a quick shell check.
