---
name: omc-setup
description: Setup and configure oh-my-codex (the ONLY command you need to learn)
---

# OMC Setup


## Pseudo Multi-Agent Protocol (Codex)

Codex does not support native subagents. Simulate role handoffs with explicit sections.

Required sections (in order):
```
[ANALYST] Summary + constraints
[ARCHITECT] Approach + components
[EXECUTOR] Actions + changes
[REVIEWER] Verification + risks
```

> Codex invocation: use `$omc-setup ...` or `omc-setup: ...`



This is the **only command you need to learn**. After running this, everything else is automatic.

## Usage Modes

This skill handles three scenarios:

1. **Initial Setup (no flags)**: Interactive installation wizard
2. **Local Configuration (`--local`)**: Configure project-specific settings (.codex/CLAUDE.md)
3. **Global Configuration (`--global`)**: Configure global settings (~/.codex/CLAUDE.md)

## Mode Detection

Check for flags in the user's invocation:
- If `--local` flag present → Skip to Local Configuration (Step 2A)
- If `--global` flag present → Skip to Global Configuration (Step 2B)
- If no flags → Run Initial Setup wizard (Step 1)

## Step 1: Initial Setup Wizard (Default Behavior)

Prompt the user in plain text with numbered choices:

**Question:** "Where should I configure oh-my-codex?"

**Options:**
1. **Local (this project)** - Creates `.codex/CLAUDE.md` in current project directory. Best for project-specific configurations.
2. **Global (all projects)** - Creates `~/.codex/CLAUDE.md` for all Codex sessions. Best for consistent behavior everywhere.
3. **Full Reinstall** - Re-run the full installer script (skills, rules, prompts, mcp)

## Step 2A: Local Configuration (--local flag or user chose LOCAL)

Use the helper script to install project-local configuration:

```bash
# Run installer in project mode
./scripts/install-codex.sh --project --rules
```

**What this does:**
- Copies `templates/CLAUDE.md` or downloads fresh from GitHub
- Installs local rules to `.codex/rules/`
- Helper script handles backup automatically

### Confirm Local Configuration Success

**OMC Project Configuration Complete**
- CLAUDE.md: Installed to ./.codex/CLAUDE.md
- Scope: **PROJECT** - applies only to this project
- Skills: Available via `.codex/skills` (if copied) or global fallback
- Rules: Project-specific rules in `.codex/rules`

## Step 2B: Global Configuration (--global flag or user chose GLOBAL)

Use the helper script to install global configuration:

```bash
# Run installer in global mode (default)
./scripts/install-codex.sh --rules
```

**What this does:**
- Copies `templates/CLAUDE.md` or downloads fresh from GitHub to `~/.codex/CLAUDE.md`
- Installs global rules to `~/.codex/rules/`
- Helper script handles backup automatically

### Confirm Global Configuration Success

**OMC Global Configuration Complete**
- CLAUDE.md: Installed to ~/.codex/CLAUDE.md
- Scope: **GLOBAL** - applies to all Codex sessions
- Skills: Available globally in `~/.codex/skills`
- Rules: Global rules in `~/.codex/rules`

## Step 3: Full Reinstall (Optional)

If user chose "Full Reinstall", run the comprehensive installer:

```bash
./scripts/install-codex.sh --all
```

This installs:
- Skills
- Rules
- Prompts (deprecated but included)
- MCP Config
- Plan Mode check

## Step 4: MCP Configuration

Ask user: "Would you like to configure MCP servers for enhanced capabilities? (Context7, Exa search, GitHub, etc.)"

If yes, invoke the mcp-setup skill:
```
$mcp-setup
```

If no, skip to next step.

## Step 5: Show Welcome Message

```
OMC Setup Complete!

You don't need to learn any commands. I now have intelligent behaviors that activate automatically via the Codex CLI.

WHAT HAPPENS AUTOMATICALLY:
- Complex tasks -> I parallelize and delegate to specialists
- "plan this" -> I start a planning interview
- "don't stop until done" -> I persist until verified complete
- "stop" or "cancel" -> I intelligently stop current operation

MAGIC KEYWORDS (optional power-user shortcuts):
Just include these words naturally in your request:

| Keyword | Effect | Example |
|---------|--------|---------|
| ralph | Persistence mode | "ralph: fix the auth bug" |
| ralplan | Iterative planning | "ralplan this feature" |
| ulw | Max parallelism | "ulw refactor the API" |
| eco | Token-efficient mode | "eco refactor the API" |
| plan | Planning interview | "plan the new endpoints" |

MCP SERVERS:
Run $mcp-setup to add tools like web search, GitHub, etc.

CLI ANALYTICS:
Check 'codex cost' for usage info.

That's it! Just use Codex CLI normally.
```

## Step 6: Ask About Starring Repository

 First, check if `gh` CLI is available and authenticated:

```bash
gh auth status &>/dev/null
```

### If gh is available and authenticated:

Prompt the user in plain text with numbered choices:

**Question:** "If you're enjoying oh-my-codex, would you like to support the project by starring it on GitHub?"

**Options:**
1. **Yes, star it!** - Star the repository
2. **No thanks** - Skip without further prompts

If user chooses "Yes, star it!":

```bash
gh api -X PUT /user/starred/Yeachan-Heo/oh-my-codex 2>/dev/null && echo "Thanks for starring! ⭐" || true
```

### If gh is NOT available or not authenticated:

```bash
echo ""
echo "If you enjoy oh-my-codex, consider starring the repo:"
echo "  https://github.com/Yeachan-Heo/oh-my-codex"
echo ""
```

## Help Text

When user runs `$omc-setup --help` or just `--help`, display:

```
OMC Setup - Configure oh-my-codex for Codex CLI

USAGE:
  $omc-setup           Run initial setup wizard
  $omc-setup --local   Configure local project (.codex/CLAUDE.md)
  $omc-setup --global  Configure global settings (~/.codex/CLAUDE.md)
  $omc-setup --help    Show this help

MODES:
  Initial Setup (no flags)
    - Interactive wizard for first-time setup
    - Configures CLAUDE.md (local or global)
    - Offers MCP server configuration

  Local Configuration (--local)
    - Installs CLAUDE.md to ./.codex/
    - Project-specific settings

  Global Configuration (--global)
    - Installs CLAUDE.md to ~/.codex/
    - Global settings for all Codex sessions

For more info: https://github.com/Yeachan-Heo/oh-my-codex
```
