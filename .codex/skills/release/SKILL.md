---
name: release
description: Automated release workflow for oh-my-codex
---

# Release Skill


## Pseudo Multi-Agent Protocol (Codex)

Codex does not support native subagents. Simulate role handoffs with explicit sections.

Required sections (in order):
```
[ANALYST] Summary + constraints
[ARCHITECT] Approach + components
[EXECUTOR] Actions + changes
[REVIEWER] Verification + risks
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
