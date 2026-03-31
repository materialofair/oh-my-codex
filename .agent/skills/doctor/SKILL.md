---
name: doctor
description: Diagnose and fix oh-my-codex installation issues
version: 0.1.0
source: fork
checksum: 8f16a47082b0a35dd6c409590c192873c2e9a0b6a9b71a4d0f82a5f13c556522
updated_at: 2026-02-11T09:29:16+08:00
---


# Doctor Skill


## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Execution preference:
1. Use native subagents first for independent workstreams (parallel when possible).
2. Merge results in main thread and run final verification.
3. Fallback only when delegation is blocked: use the `[ANALYST]`/`[ARCHITECT]`/`[EXECUTOR]`/`[REVIEWER]` structure in a single response.

Minimal orchestration pattern:
```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

> Codex invocation: use `$doctor ...` or `doctor: ...`

## Task: Run Installation Diagnostics

You are the OMC Doctor - diagnose and fix installation issues for Codex CLI.

### Step 1: Check Codex CLI

```bash
# Check if codex is available
if command -v codex &> /dev/null; then
  echo "Codex CLI: Installed ($(which codex))"
else
  echo "Codex CLI: CRITICAL - Not found in PATH"
fi
```

### Step 2: Check Configuration Directory

```bash
# Check global config dir
if [ -d "$HOME/.codex" ]; then
  echo "Global config: OK (~/.codex)"
else
  echo "Global config: CRITICAL - ~/.codex missing"
fi

# Check config.toml
if [ -f "$HOME/.codex/config.toml" ]; then
  echo "Config file: OK (~/.codex/config.toml)"
  # Check for plan mode
  grep -q "collaboration_modes = true" "$HOME/.codex/config.toml" && echo "Plan Mode: Enabled" || echo "Plan Mode: Disabled (Native collaboration_modes=false)"
else
  echo "Config file: WARN - ~/.codex/config.toml missing"
fi
```

### Step 3: Check Skills Installation

```bash
# Check global skills
SKILLS_COUNT=$(find ~/.codex/skills -name "SKILL.md" 2>/dev/null | wc -l)
if [ "$SKILLS_COUNT" -gt 0 ]; then
  echo "Global Skills: OK ($SKILLS_COUNT skills installed)"
else
  echo "Global Skills: WARN - No skills found in ~/.codex/skills"
fi

# Check for specific key skills
[ -f ~/.codex/skills/omc-setup/SKILL.md ] && echo "  - omc-setup: OK" || echo "  - omc-setup: MISSING"
[ -f ~/.codex/skills/aireview/SKILL.md ] && echo "  - aireview: OK" || echo "  - aireview: MISSING"
```

### Step 4: Check CLAUDE.md (Project Config)

```bash
# Check if CLAUDE.md exists globally
if [ -f ~/.codex/CLAUDE.md ]; then
  echo "Global CLAUDE.md: OK"
  grep -q "oh-my-codex" ~/.codex/CLAUDE.md && echo "  - OMC Header: Found" || echo "  - OMC Header: Missing"
else
  echo "Global CLAUDE.md: WARN - Missing"
fi
```

### Step 5: Check Legacy Artifacts

```bash
# Check for legacy plugin cache from older setups (usually safe to remove)
if [ -d ~/.codex/plugins ]; then
  echo "Legacy plugin cache found at ~/.codex/plugins (optional cleanup)"
fi
```

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
| Codex CLI | OK/CRITICAL | ... |
| Config Dir | OK/CRITICAL | ... |
| Plan Mode | INFO | ... |
| Global Skills | OK/WARN | ... |
| CLAUDE.md | OK/WARN | ... |

### Issues Found
1. [Issue description]

### Recommended Fixes
[List fixes based on issues]
```

---

## Auto-Fix (if user confirms)

If issues found, ask user: "Would you like me to fix these issues automatically?"

If yes, apply fixes:

### Fix: Missing Skills
Recommend running the installer script:
```bash
echo "Run: ./scripts/install-codex.sh --all"
```

### Fix: Legacy Plugin Cache
```bash
rm -rf ~/.codex/plugins
echo "Legacy plugin cache removed (from older setups)."
```

### Fix: Missing CLAUDE.md
Download fresh global CLAUDE.md:
```bash
curl -fsSL "https://raw.githubusercontent.com/Yeachan-Heo/oh-my-codex/main/docs/CLAUDE.md" -o ~/.codex/CLAUDE.md
echo "Downloaded default CLAUDE.md"
```

---

## Post-Fix

After applying fixes, inform user:
> Fixes applied. Run `$doctor` again to verify.
