---
name: update-docs
description: Imported from everything-codex command update-docs
---

# Update Documentation


## Pseudo Multi-Agent Protocol (Codex)

Codex does not support native subagents. Simulate role handoffs with explicit sections.

Required sections (in order):
```
[ANALYST] Summary + constraints
[ARCHITECT] Approach + components
[EXECUTOR] Actions + changes
[REVIEWER] Verification + risks
```

Sync documentation from source-of-truth:

1. Read package.json scripts section
   - Generate scripts reference table
   - Include descriptions from comments

2. Read .env.example
   - Extract all environment variables
   - Document purpose and format

3. Generate docs/CONTRIB.md with:
   - Development workflow
   - Available scripts
   - Environment setup
   - Testing procedures

4. Generate docs/RUNBOOK.md with:
   - Deployment procedures
   - Monitoring and alerts
   - Common issues and fixes
   - Rollback procedures

5. Identify obsolete documentation:
   - Find docs not modified in 90+ days
   - List for manual review

6. Show diff summary

Single source of truth: package.json and .env.example

