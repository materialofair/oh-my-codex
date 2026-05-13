# Changelog

All notable changes to `oh-my-codex-cli` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.7] - 2026-05-13

### Added
- Added a lightweight skill index cache for prompt optimization and skill
  routing. The cache stores frontmatter metadata, routing tokens, and freshness
  hashes without storing full skill bodies.
- Added `npm run catalog:skill-index` and `npm run test:skill-index`.

### Changed
- Skill routing now prefers a fresh `.omcodex/cache/skill-index.json` and falls
  back to the previous full scan behavior when the cache is missing or stale.
- `prompt-optimizer` now recommends metadata-first skill routing and lazy-loads
  full skill bodies only for shortlisted candidates.

## [1.1.6] - 2026-04-30

### Fixed
- Setup no longer produces a duplicate `[mcp_servers.context7]` (or any other
  upstream-managed MCP server) when the user already has the same section
  defined elsewhere in `~/.codex/config.toml`. Previously this caused Codex to
  fail at startup with `failed to read configuration layers: ... duplicate key`.
  `mergeUpstreamSectionBlock` now filters out section names that already exist
  in the surrounding config before injecting the upstream-managed block.

## [1.1.5] - 2026-04-30

- Initial tracked release in this changelog.
