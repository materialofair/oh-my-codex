<!-- Generated: 2026-01-31 | Updated: 2026-02-25 -->

# oh-my-codex

Skill pack and workflow orchestration for **OpenAI Codex CLI**.

**Version:** 1.1.11
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
| `.agent/skills/local/` | Source-of-truth local Codex skill definitions |
| `.agent/skills/upstream/` | Upstream skills (oh-my-codex, superpowers, ecc) |
| `.agent/skills/upstream/<name>/.omc-source/manifest.json` | Per-source provenance + selection link |
| `.agent/curation/<source>-*.json` | Curated allowlists for distribution-style upstream sources |
| `scripts/install-codex.sh` | Global skill installer |

## For AI Agents

### High-Priority Rules (Do First)

1. Prefer retrieval-led reasoning over memory-led guessing.
2. Build project context first, then apply skills/tools.
3. Keep context lean: load only files needed for the current task.
4. Verify with concrete evidence before claiming completion.

### Retrieval-Led Reasoning (Mandatory)

For framework/runtime/library-specific work:
- Read the relevant repo docs/scripts first (`README.md`, `docs/`, `scripts/`, changed files).
- Treat docs as source of truth when conflict exists with model memory.
- Avoid speculative edits when version-specific behavior is unclear.

Execution order:
1. Inspect task + affected files.
2. Retrieve exact docs/config relevant to that task.
3. Implement the minimal correct change.
4. Validate with commands/checks.
5. Report result with evidence.

### Skill Invocation

Use skills as action workflows, not as the only knowledge source.

Trigger rules:
- If user explicitly mentions a skill (or `$skill`), use it.
- If task clearly maps to a skill's purpose, use the minimal matching skill set.
- If a skill conflicts with repo source-of-truth docs, follow repo docs and state the conflict briefly.

### AI Commenting Policy

When implementing or refactoring non-trivial code, proactively use `ai-commenting` to add key intent comments.

Apply `ai-commenting` when changes include:
- Complex logic or non-obvious tradeoffs
- Critical edge-case handling
- Cross-module dependencies or workflow coupling
- Security/performance sensitive paths

Commenting rules:
- Focus on intent, assumptions, risks, and verification expectations.
- Keep comments concise and high-signal.
- Avoid obvious comments that merely restate the code.

### Source-of-Truth Workflow (Mandatory)

For this repository, **`oh-my-codex` is the single source of truth** for skills and docs.

Required order:
1. Edit and validate files in this repo first (for example `.agent/skills/local/**/SKILL.md`).
2. Commit/push repository changes.
3. Install/sync to runtime using installer scripts (for example `scripts/install-codex.sh` / `scripts/install-codex-force.sh`).

Do **not** use `~/.codex/skills` as the primary editing location.
Direct edits under `~/.codex/skills` are temporary at most, and must be immediately backported to repo before considering work complete.

Repository convention:
- `.agent/skills/` is the authoring source.
- `~/.codex/skills/` and `<repo>/.codex/skills/` are runtime/install targets.
- Do not add or maintain a second source copy under `.codex/skills/` in this repository unless a script explicitly requires it.

### Compatibility Notes

Codex does **not** support Claude Code plugins, interception lifecycle APIs, or HUD. Any mention of:
- Claude Code plugin commands
- `.claude/` plugin cache paths
- Claude Code-specific CLI commands

...should be treated as **legacy** references from the original oh-my-claudecode.

### Testing

No mandatory tests. If you change scripts, run a quick shell check.
