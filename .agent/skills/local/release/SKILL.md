---
name: release
description: Automated release workflow for oh-my-codex
version: 0.1.0
source: fork
checksum: 8b585b8a8c1d8f4b15988b4b960ca28c488fa185cacb89f7543e89555ba6aa5a
updated_at: 2026-02-11T09:29:16+08:00
layer: meta
---


# Release Skill


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

> Codex invocation: use `$release ...` or `release: ...`

Automate the release process for oh-my-codex.

## Usage

```
$release <version>
```

Example: `$release 0.2.0` or `$release patch` or `$release minor`

## Release Checklist

Execute these steps in order:

### 1. Version Bump
Update version in all locations:
- `package.json`
- `README.md`
- `AGENTS.md`
- `docs/CODEX.md`
- `CHANGELOG.md`

### 2. Run Tests (optional)
```bash
npm run test:run
```

### 3. Commit Version Bump
```bash
git add -A
git commit -m "chore: bump version to <version>"
```

### 4. Create & Push Tag
```bash
git tag v<version>
git push origin main
git push origin v<version>
```

### 5. Create GitHub Release
```bash
gh release create v<version> --title "v<version> - <title>" --notes "<release notes>"
```

## Version Files Reference

| File | Field/Line |
|------|------------|
| `package.json` | `"version": "X.Y.Z"` |
| `README.md` | Title/metadata |
| `AGENTS.md` | Version line |
| `docs/CODEX.md` | Version mention (if any) |
| `CHANGELOG.md` | New entry |

## Semantic Versioning

- **patch** (X.Y.Z+1): Bug fixes, minor improvements
- **minor** (X.Y+1.0): New features, backward compatible
- **major** (X+1.0.0): Breaking changes
