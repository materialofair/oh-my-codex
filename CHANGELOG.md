# Changelog

All notable changes to `oh-my-codex-cli` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-08-22

### Changed
- Removed the `superpowers` upstream skill source and replaced it with
  `grill-me` (from mattpocock/skills): 2 skills — relentless plan/design
  interview (`grill-me` + `grilling`). Updated sync script, source registry,
  harness metadata, catalogs, and docs.

## [1.4.0] - 2026-07-22

### Added
- Added the `architecture-review` skill for evidence-based reviews of layering,
  dependency direction, coupling, extensibility, and architectural drift.
- Added deterministic skill regression and catalog metadata tests, including a
  reusable runner for static skill eval fixtures.

### Changed
- Extended skill routing and intent metadata so architecture review requests
  select the new workflow without leaking into unrelated review prompts.

### Fixed
- Corrected `expectedAnySkills` evaluation to accept any matching skill.
- Preserved declared layer and intent metadata when regenerating catalogs.

### Security
- Refreshed vulnerable transitive dependencies to their patched compatible
  versions where upstream constraints permit.

## [1.3.1] - 2026-07-08

### Fixed
- Updated generated Codex config handling for current CLI schema by keeping
  `features.multi_agent` and removing legacy `child_agents_md` and
  `collaboration_modes` flags.
- Refreshed Codex CLI documentation and local skill orchestration examples to
  use the current `wait_agent` subagent primitive and native `/plan` behavior.
- Clarified Codex plugin/hook positioning: native Codex hooks exist, while
  oh-my-codex still defaults to notify-driven extensions.

## [1.3.0] - 2026-07-06

### Changed
- Refreshed vendored upstream skills from oh-my-codex, superpowers, ECC, and
  Impeccable.
- Updated the generated skill catalogs and README source counts to reflect the
  current merged runtime set.
- Aligned the curated ECC Codex selection with the upstream `.agents/skills`
  subset, including newly selected ECC skills and removed entries that are no
  longer present in that Codex-facing upstream surface.

## [1.2.0] - 2026-06-12

### Added
- Added an `openai-frontier-codex` model adapter prompt for GPT-5.4, GPT-5.5,
  and future frontier Codex models.
- Added adapter contract coverage to the internal prompt harness.
- Added installer support that appends a short frontier-model adapter section
  to `~/.codex/AGENTS.md` when it is missing, so the guidance loads
  automatically in future Codex sessions.

### Changed
- Documented the model adapter layering strategy and clarified that files under
  `~/.codex/prompts/` are reusable prompt assets, while automatic behavior is
  provided by AGENTS guidance.

## [1.1.11] - 2026-06-08

### Fixed
- Repaired Codex skill runtime instructions that still assumed a bare `python`
  command, using `python3`/`python` interpreter detection for ProjectMind,
  CodeDNA, and patent helper scripts.
- Migrated remaining user-facing skill-management and Draw.io docs from legacy
  Claude Code paths/commands to Codex-native paths such as `~/.codex/skills`
  and `codex mcp list`.
- Marked legacy Claude hook examples as historical context so Codex users are
  not instructed to configure unsupported hook automation.

## [1.1.9] - 2026-05-29

### Changed
- Reworked Gemini-dependent local skills to use Codex-native workflows, local analysis, and child-agent review patterns by default.
- Added durable local overrides for `ask-gemini` and `frontend-ui-ux` so upstream sync cannot reintroduce Gemini runtime paths.
- Improved `patent-workflow` Word/DOCX handling: final delivery is a `.docx`, existing DOCX disclosure documents default to fidelity-preserving edits, and image/media relationships must be checked before delivery.

### Fixed
- Made `project-analyze` local-only and removed the external model CLI dependency from its user-facing docs.
- Added missing patent workflow metadata so skill governance treats the updated local skill as complete.

## [1.1.8] - 2026-05-26

### Changed
- **Updated README with accurate numbers**: Corrected skill/agent/MCP counts to reflect actual deployment state
  - 130+ merged skills (previously listed as 190+)
  - 3 Codex agents (previously listed as 35+)
  - 11 managed MCP server entries (previously listed as 25+)
  - 60 local skills (up from 59)
  - 30 selected ECC skills from 35 vendored

### Added
- **Internal tech sharing documentation** with comprehensive guides and diagrams:
  - `docs/internal-tech-share-loomy.md` — Loomy integration architecture
  - `docs/internal-tech-share-oh-my-codex.md` — oh-my-codex skill workbench
  - `docs/assets/` — Supporting visual diagrams for architecture and workflows

### Notes
- This release focuses on documentation accuracy, ensuring project documentation reflects actual deployed capabilities rather than aspirational numbers.

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
