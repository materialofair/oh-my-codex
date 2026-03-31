---
name: build-fix
description: Fix build and TypeScript errors with minimal changes
version: 0.1.0
source: fork
checksum: 1a33bb9e13bbe05df657e37849f7aee8450df533c6566a767ebd0184d33c5a9a
updated_at: 2026-03-12T18:57:03+08:00
---


# Build Fix Skill


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

> Codex invocation: use `$build-fix ...` or `build-fix: ...`


Fix build and TypeScript errors quickly with minimal code changes. Get the build green without refactoring.

## When to Use

This skill activates when:
- User says "fix the build", "build is broken"
- TypeScript compilation fails
- `npm run build` or `tsc` reports errors
- User requests "minimal fixes" for errors

## What It Does

Delegates to the `build-fixer` agent (Sonnet model) to:

1. **Collect Errors**
   - Run `npx tsc --noEmit` to get all TypeScript errors
   - Or run `npm run build` to get build failures
   - Categorize errors by type and severity

2. **Fix Strategically**
   - Add type annotations where missing
   - Add null checks where needed
   - Fix import/export statements
   - Resolve module resolution issues
   - Fix linter errors blocking build

3. **Minimal Diff Strategy**
   - NO refactoring of unrelated code
   - NO architectural changes
   - NO performance optimizations
   - ONLY what's needed to make build pass

4. **Verify**
   - Run `npx tsc --noEmit` after each fix
   - Ensure no new errors introduced
   - Stop when build passes

## Agent Delegation

```
[BUILD-FIXER | sonnet]
BUILD FIX TASK

Fix all build and TypeScript errors with minimal changes.

Requirements:
- Run tsc/build to collect errors
- Fix errors one at a time
- Verify each fix doesn't introduce new errors
- NO refactoring, NO architectural changes
- Stop when build passes

Output: Build error resolution report with:
- List of errors fixed
- Lines changed per fix
- Final build status"
```

## Stop Conditions

The build-fixer agent stops when:
- `npx tsc --noEmit` exits with code 0
- `npm run build` completes successfully
- No new errors introduced

## Output Format

```
BUILD FIX REPORT
================

Errors Fixed: 12
Files Modified: 8
Lines Changed: 47

Fixes Applied:
1. src/utils/validation.ts:15 - Added return type annotation
2. src/components/Header.tsx:42 - Added null check for props.user
3. src/api/client.ts:89 - Fixed import path for axios
...

Final Build Status: ✓ PASSING
Verification: npx tsc --noEmit (exit code 0)
```

## Best Practices

- **One fix at a time** - Easier to verify and debug
- **Minimal changes** - Don't refactor while fixing
- **Document why** - Comment non-obvious fixes
- **Test after** - Ensure tests still pass

## Use with Other Skills

Combine with other skills for comprehensive fixing:

**With Ultrawork:**
```
$ultrawork fix all build errors
```
Spawns multiple build-fixer agents in parallel for different files.

**With Ralph:**
```
$ralph fix the build
```
Keeps trying until build passes, even if it takes multiple iterations.

**With Pipeline:**
```
$pipeline debug "build is failing"
```
Uses: explore → architect → build-fixer workflow.

