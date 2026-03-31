# Fork Workflow Guide

This guide explains how to maintain your fork of oh-my-codex while easily merging upstream updates.

## Overview

The oh-my-codex fork workflow allows you to:

1. Customize skills, prompts, and configuration locally
2. Merge upstream updates with intelligent conflict resolution
3. Protect certain files from being overwritten
4. Keep the simple installation experience

## Quick Start

### 1. Configure Upstream Remote

```bash
cd /path/to/your/fork
git remote add upstream https://github.com/Yeachan-Heo/oh-my-codex.git
git fetch upstream
```

### 2. Check Source Status

```bash
omcodex source status
```

### 3. Sync with Upstream

```bash
omcodex source sync
```

This will:
- Fetch latest changes from upstream
- Show available updates
- Provide merge instructions

### 4. Merge Updates

```bash
git merge upstream/main
```

The `.gitattributes` file will automatically handle merge conflicts using the configured strategies.

## Skill Overlap Governance (Fork vs Upstream)

Fork 与 upstream 的同名 skills 需要单独治理，避免 upstream 未治理内容覆盖本地已治理版本。

```bash
# 1) 同步 upstream skill 快照到 .upstream/skills
npm run source:skills:sync -- --skip-fetch

# 2) 生成重合治理报告（同名重合 + 风险分级 + 合并建议）
npm run governance:skills:overlap

# 3) 跑双源治理（fork + upstream）
npm run governance:skills:sources -- --skip-fetch --llm-mode heuristic
```

说明：
- 默认合并会对重合 skills 做质量评分并自动择优（fork / upstream）。
- 完整治理说明见 `docs/UPSTREAM_OVERLAP_GOVERNANCE_PROJECT.md`。

## Merge Strategies

### Files That Always Keep Local Version (merge=ours)

These files will NEVER be overwritten by upstream:

- `.governance/**` - Custom governance rules
- `.omcodex/**`, `.omc/**`, `.claude/**`, `.claude_memory/**` - Local runtime state
- `package.json`, `package-lock.json` - Local version tracking
- `*.tgz` - Build artifacts
- `README.md`, `README.zh.md` - Local documentation
- `AGENTS.md`, `templates/AGENTS.md` - Local agent configuration

### Files That Merge from Upstream

These files will accept upstream updates:

- `bin/**`, `src/**`, `scripts/**` - Core CLI and runtime
- `.agent/skills/**` - Skills (conflicts need review)
- `prompts/**` - Prompts (conflicts need review)
- `templates/rules/**`, `templates/code_styleguides/**` - Templates
- `docs/**` - Documentation

## CLI Commands

### List Available Sources

```bash
omcodex source list
```

Shows fork and upstream sources with their URLs.

### Show Active Source

```bash
omcodex source active
```

### Set Active Source

```bash
omcodex source set fork
omcodex source set upstream
```

### Sync with Upstream

```bash
omcodex source sync
```

Fetches upstream and shows available updates.

### Show Status

```bash
omcodex source status
```

Shows:
- Active source
- Local changes
- Upstream status
- Last sync time
- Recent sync history

## Workflow Examples

### Example 1: Regular Sync

```bash
# Check for updates
omcodex source sync

# Review changes
git log HEAD..upstream/main

# Merge updates
git merge upstream/main

# Push to your fork
git push origin main
```

### Example 2: Cherry-Pick Specific Commits

```bash
# Sync to see available commits
omcodex source sync

# Cherry-pick specific commit
git cherry-pick <commit-hash>

# Push to your fork
git push origin main
```

### Example 3: Resolve Conflicts

```bash
# Merge upstream
git merge upstream/main

# If conflicts occur in protected files, they'll use local version
# If conflicts occur in other files, resolve manually
git status
git diff

# After resolving
git add .
git commit
git push origin main
```

## Best Practices

1. **Sync regularly** - Run `omcodex source sync` weekly to stay up to date
2. **Review changes** - Always review upstream changes before merging
3. **Test after merge** - Run `omcodex doctor` after merging to verify installation
4. **Commit local changes first** - Commit your local changes before syncing
5. **Use branches** - Create feature branches for major customizations

## Troubleshooting

### Upstream not configured

```bash
git remote add upstream https://github.com/Yeachan-Heo/oh-my-codex.git
git fetch upstream
```

### Merge conflicts

Protected files (`.governance/**`, etc.) will automatically use local version. For other files, resolve manually:

```bash
git status
git diff
# Edit conflicted files
git add .
git commit
```

### Reset to upstream

If you want to completely reset to upstream (WARNING: loses local changes):

```bash
git fetch upstream
git reset --hard upstream/main
git push origin main --force
```

## Configuration

The fork workflow is configured in `.gitattributes`. You can customize merge strategies by editing this file.

### Add a file to "keep local" list

Edit `.gitattributes` and add:

```gitattributes
path/to/file merge=ours
```

### Remove a file from "keep local" list

Edit `.gitattributes` and remove or comment out the line.

## Source Management

The `omcodex source` command manages a configuration file at `~/.omcodex/sources.json` that tracks:

- Active source (fork or upstream)
- Last sync timestamp
- Sync history (last 50 syncs)

This helps you track when you last synced and whether syncs succeeded.

## See Also

- [Git Attributes Documentation](https://git-scm.com/docs/gitattributes)
- [Git Merge Strategies](https://git-scm.com/docs/merge-strategies)
- [oh-my-codex README](../README.md)
