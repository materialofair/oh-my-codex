---
name: setup-pm
description: Imported from everything-codex command setup-pm
version: 0.1.0
source: fork
checksum: 4fe6d5dc78ca286e9766448c5b48e5f23b67eb6770e4703ab44987791425d2e7
updated_at: 2026-02-11T09:29:16+08:00
layer: utility
---


---
description: Configure your preferred package manager (npm/pnpm/yarn/bun)
disable-model-invocation: true
---

# Package Manager Setup


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

Configure your preferred package manager for this project or globally.

## Usage

If `scripts/setup-package-manager.js` exists in the repo, use it. Otherwise, configure manually via the files below.

```bash
# Detect current package manager
node scripts/setup-package-manager.js --detect

# Set global preference
node scripts/setup-package-manager.js --global pnpm

# Set project preference
node scripts/setup-package-manager.js --project bun

# List available package managers
node scripts/setup-package-manager.js --list
```

## Detection Priority

When determining which package manager to use, the following order is checked:

1. **Environment variable**: `CODEX_PACKAGE_MANAGER`
2. **Project config**: `.codex/package-manager.json`
3. **package.json**: `packageManager` field
4. **Lock file**: Presence of package-lock.json, yarn.lock, pnpm-lock.yaml, or bun.lockb
5. **Global config**: `~/.codex/package-manager.json`
6. **Fallback**: First available package manager (pnpm > bun > yarn > npm)

## Configuration Files

### Global Configuration
```json
// ~/.codex/package-manager.json
{
  "packageManager": "pnpm"
}
```

### Project Configuration
```json
// .codex/package-manager.json
{
  "packageManager": "bun"
}
```

### package.json
```json
{
  "packageManager": "pnpm@8.6.0"
}
```

## Environment Variable

Set `CODEX_PACKAGE_MANAGER` to override all other detection methods:

```bash
# Windows (PowerShell)
$env:CODEX_PACKAGE_MANAGER = "pnpm"

# macOS/Linux
export CODEX_PACKAGE_MANAGER=pnpm
```

## Run the Detection

To see current package manager detection results, run:

```bash
node scripts/setup-package-manager.js --detect
```
