---
name: doctor
description: Diagnose and fix oh-my-codex installation issues
---

# Doctor Skill


## Pseudo Multi-Agent Protocol (Codex)

Codex does not support native subagents. Simulate role handoffs with explicit sections.

Required sections (in order):
```
[ANALYST] Summary + constraints
[ARCHITECT] Approach + components
[EXECUTOR] Actions + changes
[REVIEWER] Verification + risks
```

> Codex invocation: use `$doctor ...` or `doctor: ...`

> Codex limitation: This workflow references Claude Code plugin features. Treat steps as documentation only.



## Task: Run Installation Diagnostics

You are the OMC Doctor - diagnose and fix installation issues.

### Step 1: Check Plugin Version

```bash
# Get installed version
INSTALLED=$(ls ~/.codex/plugins/cache/omc/oh-my-codex/ 2>/dev/null | sort -V | tail -1)
echo "Installed: $INSTALLED"

# Get latest from npm
LATEST=$(npm view oh-my-claude-sisyphus version 2>/dev/null)
echo "Latest: $LATEST"
```

**Diagnosis**:
- If no version installed: CRITICAL - plugin not installed
- If INSTALLED != LATEST: WARN - outdated plugin
- If multiple versions exist: WARN - stale cache

### Step 2: Check for Legacy Hooks in settings.json

Read `~/.codex/settings.json` and check if there's a `"hooks"` key with entries like:
- `bash $HOME/.codex/hooks/keyword-detector.sh`
- `bash $HOME/.codex/hooks/persistent-mode.sh`
- `bash $HOME/.codex/hooks/session-start.sh`

**Diagnosis**:
- If found: CRITICAL - legacy hooks causing duplicates

### Step 3: Check for Legacy Bash Hook Scripts

```bash
ls -la ~/.codex/hooks/*.sh 2>/dev/null
```

**Diagnosis**:
- If `keyword-detector.sh`, `persistent-mode.sh`, `session-start.sh`, or `stop-continuation.sh` exist: WARN - legacy scripts (can cause confusion)

### Step 4: Check CLAUDE.md

```bash
# Check if CLAUDE.md exists
ls -la ~/.codex/CLAUDE.md 2>/dev/null

# Check for OMC marker
grep -q "oh-my-codex Multi-Agent System" ~/.codex/CLAUDE.md 2>/dev/null && echo "Has OMC config" || echo "Missing OMC config"
```

**Diagnosis**:
- If missing: CRITICAL - CLAUDE.md not configured
- If missing OMC marker: WARN - outdated CLAUDE.md

### Step 5: Check for Stale Plugin Cache

```bash
# Count versions in cache
ls ~/.codex/plugins/cache/omc/oh-my-codex/ 2>/dev/null | wc -l
```

**Diagnosis**:
- If > 1 version: WARN - multiple cached versions (cleanup recommended)

### Step 6: Check for Legacy Curl-Installed Content

Check for legacy agents, commands, and skills installed via curl (before plugin system):

```bash
# Check for legacy agents directory
ls -la ~/.codex/agents/ 2>/dev/null

# Check for legacy commands directory
ls -la ~/.codex/commands/ 2>/dev/null

# Check for legacy skills directory
ls -la ~/.codex/skills/ 2>/dev/null
```

**Diagnosis**:
- If `~/.codex/agents/` exists with oh-my-codex-related files: WARN - legacy agents (now provided by plugin)
- If `~/.codex/commands/` exists with oh-my-codex-related files: WARN - legacy commands (now provided by plugin)
- If `~/.codex/skills/` exists with oh-my-codex-related files: WARN - legacy skills (now provided by plugin)

Look for files like:
- `architect.md`, `researcher.md`, `explore.md`, `executor.md`, etc. in agents/
- `ultrawork.md`, `deepsearch.md`, etc. in commands/
- Any oh-my-codex-related `.md` files in skills/

---

## Report Format

After running all checks, output a report:

```
## OMC Doctor Report

### Summary
[HEALTHY / ISSUES FOUND]

### Checks

| Check | Status | Details |
|-------|--------|---------|
| Plugin Version | OK/WARN/CRITICAL | ... |
| Legacy Hooks (settings.json) | OK/CRITICAL | ... |
| Legacy Scripts (~/.codex/hooks/) | OK/WARN | ... |
| CLAUDE.md | OK/WARN/CRITICAL | ... |
| Plugin Cache | OK/WARN | ... |
| Legacy Agents (~/.codex/agents/) | OK/WARN | ... |
| Legacy Commands (~/.codex/commands/) | OK/WARN | ... |
| Legacy Skills (~/.codex/skills/) | OK/WARN | ... |

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommended Fixes
[List fixes based on issues]
```

---

## Auto-Fix (if user confirms)

If issues found, ask user: "Would you like me to fix these issues automatically?"

If yes, apply fixes:

### Fix: Legacy Hooks in settings.json
Remove the `"hooks"` section from `~/.codex/settings.json` (keep other settings intact)

### Fix: Legacy Bash Scripts
```bash
rm -f ~/.codex/hooks/keyword-detector.sh
rm -f ~/.codex/hooks/persistent-mode.sh
rm -f ~/.codex/hooks/session-start.sh
rm -f ~/.codex/hooks/stop-continuation.sh
```

### Fix: Outdated Plugin
```bash
rm -rf ~/.codex/plugins/cache/oh-my-codex
echo "Plugin cache cleared. Restart Claude Code to fetch latest version."
```

### Fix: Stale Cache (multiple versions)
```bash
# Keep only latest version
cd ~/.codex/plugins/cache/omc/oh-my-codex/
ls | sort -V | head -n -1 | xargs rm -rf
```

### Fix: Missing/Outdated CLAUDE.md
Fetch latest from GitHub and write to `~/.codex/CLAUDE.md`:
```
WebFetch(url: "https://raw.githubusercontent.com/Yeachan-Heo/oh-my-codex/main/docs/CLAUDE.md", prompt: "Return the complete raw markdown content exactly as-is")
```

### Fix: Legacy Curl-Installed Content

Remove legacy agents, commands, and skills directories (now provided by plugin):

```bash
# Backup first (optional - ask user)
# mv ~/.codex/agents ~/.codex/agents.bak
# mv ~/.codex/commands ~/.codex/commands.bak
# mv ~/.codex/skills ~/.codex/skills.bak

# Or remove directly
rm -rf ~/.codex/agents
rm -rf ~/.codex/commands
rm -rf ~/.codex/skills
```

**Note**: Only remove if these contain oh-my-codex-related files. If user has custom agents/commands/skills, warn them and ask before removing.

---

## Post-Fix

After applying fixes, inform user:
> Fixes applied. **Restart Claude Code** for changes to take effect.
