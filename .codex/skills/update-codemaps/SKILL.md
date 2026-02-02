---
name: update-codemaps
description: Imported from everything-claude-code command update-codemaps
---

# Update Codemaps


## Pseudo Multi-Agent Protocol (Codex)

Codex does not support native subagents. Simulate role handoffs with explicit sections.

Required sections (in order):
```
[ANALYST] Summary + constraints
[ARCHITECT] Approach + components
[EXECUTOR] Actions + changes
[REVIEWER] Verification + risks
```

Analyze the codebase structure and update architecture documentation:

1. Scan all source files for imports, exports, and dependencies
2. Generate token-lean codemaps in the following format:
   - codemaps/architecture.md - Overall architecture
   - codemaps/backend.md - Backend structure  
   - codemaps/frontend.md - Frontend structure
   - codemaps/data.md - Data models and schemas

3. Calculate diff percentage from previous version
4. If changes > 30%, request user approval before updating
5. Add freshness timestamp to each codemap
6. Save reports to .reports/codemap-diff.txt

Use TypeScript/Node.js for analysis. Focus on high-level structure, not implementation details.

