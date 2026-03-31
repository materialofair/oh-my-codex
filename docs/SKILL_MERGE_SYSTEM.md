# Skill Merge and Governance System

## Overview

This system enables oh-my-codex to automatically merge skills from multiple sources (fork and upstream) with intelligent conflict resolution.

## Architecture

### Components

1. **Metadata Schema** (`schemas/skill-metadata.schema.json`)
   - Defines required fields for skill metadata
   - Enforces version, source, checksum, and timestamp tracking

2. **Migration Script** (`scripts/migrate-skill-metadata.js`)
   - Scans all skills and adds missing metadata
   - Calculates checksums and timestamps
   - Idempotent and safe to run multiple times

3. **Skill Merger** (`src/merge/skill-merger.js`)
   - Multi-source skill loading
   - Conflict detection (name and description similarity)
   - 4-tier resolution strategy
   - Merge report generation

4. **Setup Integration** (`src/cli/setup.js`)
   - Automatic merge during installation
   - Merge report generation
   - Fallback to direct copy on error

5. **CLI Commands** (`src/cli/skill.js`)
   - `omcodex skill list` - List all skills with sources
   - `omcodex skill prefer <name> <source>` - Set preference
   - `omcodex skill conflicts` - Show conflict report

6. **Catalog Enhancement** (`scripts/generate-catalog-docs.js`)
   - Includes source and version in catalog
   - Tracks skill provenance

## Conflict Detection

### Types of Conflicts

1. **Exact Name Conflict**
   - Two skills with identical names from different sources
   - Resolution: 4-tier strategy

2. **Similar Description Conflict**
   - Two skills with different names but similar descriptions (>80% similarity)
   - Uses Jaccard similarity on tokenized descriptions
   - Resolution: Warning only, both skills kept

### Resolution Strategy (4-Tier)

1. **User Preference** (Tier 1)
   - Check `.codex/merge-config.json` for explicit preferences
   - Winner: User-specified source

2. **SemVer** (Tier 2)
   - Compare semantic versions
   - Winner: Highest version

3. **Fork Priority** (Tier 3)
   - Prefer fork over upstream
   - Winner: Fork source

4. **Namespace** (Tier 4)
   - Keep both with prefixed names (if enabled)
   - Fallback: First source wins

## Usage

### Initial Setup

```bash
# Run migration to add metadata to all skills
node scripts/migrate-skill-metadata.js

# Setup with merge enabled (default)
omcodex setup --scope user

# View merge report
omcodex skill conflicts
```

### Managing Preferences

```bash
# Set preference for a specific skill
omcodex skill prefer autopilot fork

# List all skills with sources
omcodex skill list --verbose
```

### Configuration

Create `.codex/merge-config.json`:

```json
{
  "merge_strategy": "version-priority",
  "allow_namespacing": false,
  "auto_merge": true,
  "preferences": {
    "autopilot": "fork",
    "ralph": "upstream"
  }
}
```

## Merge Report Format

```json
{
  "timestamp": "2026-03-31T12:00:00.000Z",
  "summary": {
    "total_conflicts": 5,
    "exact_name_conflicts": 3,
    "similar_description_warnings": 2,
    "resolutions": {
      "user-preference": 1,
      "semver": 2,
      "fork-priority": 0,
      "namespace": 0,
      "default-first": 0,
      "warning": 2
    }
  },
  "conflicts": [
    {
      "skill": "autopilot",
      "type": "exact_name",
      "resolution": "user-preference",
      "winner": {
        "source": "fork",
        "version": "0.3.0"
      },
      "rejected": [
        {
          "source": "upstream",
          "version": "0.2.5"
        }
      ]
    },
    {
      "skill": "skill-a vs skill-b",
      "type": "similar_description",
      "resolution": "warning",
      "similarity": 0.85,
      "message": "Similar functionality detected (85.0% match)"
    }
  ]
}
```

## Testing

```bash
# Test merger functionality
node scripts/test-merger.js

# Test similarity detection
node scripts/test-similarity.js

# Test migration
node scripts/migrate-skill-metadata.js --dry-run --verbose
```

## Implementation Status

✅ Phase 1: Metadata Migration
- Schema created
- Migration script implemented
- All 87 skills migrated

✅ Phase 2: Merge Infrastructure
- Skill merger module complete
- Conflict detection (name + description)
- 4-tier resolution strategy
- Merge report generation

✅ Phase 3: Multi-Source Setup
- Setup.js integration
- Automatic merge during installation
- Report generation and saving

✅ Phase 4: CLI Commands
- skill list
- skill prefer
- skill conflicts

✅ Phase 5: Catalog Enhancement
- Source field added
- Version field added
- Schema validator updated

## Future Enhancements

1. **Upstream Source Integration**
   - Add actual upstream repository fetching
   - Periodic sync mechanism

2. **Interactive Conflict Resolution**
   - Prompt user for conflicts during setup
   - Visual diff for conflicting skills

3. **Skill Versioning**
   - Automatic version bumping
   - Changelog generation

4. **Dependency Resolution**
   - Track skill dependencies
   - Resolve dependency conflicts

5. **Rollback Support**
   - Keep previous versions
   - Easy rollback mechanism
