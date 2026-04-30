# Changelog

All notable changes to `oh-my-codex-cli` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
