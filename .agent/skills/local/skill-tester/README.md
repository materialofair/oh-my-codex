# Skill Tester

TDD tool for testing Codex skills functionality.

## Quick Install

```bash
cp -r skill-tester ~/.codex/skills/
```

## Usage

```
"Test financial-analyzer skill"
"Run full test suite on code-review"
"Write tests for my new skill before implementing it"
```

## What It Does

- ✅ Functional testing (correct outputs)
- ✅ Trigger testing (skill activates when it should)
- ✅ Edge case testing (handles unusual inputs)
- ✅ Performance testing (execution time)
- ✅ TDD workflow (write tests first)

## Quick Example

```
User: "Test if financial-analyzer calculates P/E correctly"

Codex:
Test: P/E Calculation
Input: price=100, eps=6.45
Expected: 15.5
Result: ✅ 15.504 (PASS)
```

## Files

- `SKILL.md` - Testing methodology and patterns
- `README.md` - This file
- `scripts/run-skill-tests.js` - Deterministic route/content tests plus optional read-only behavior replay

## Automated Regression

```bash
node .agent/skills/local/skill-tester/scripts/run-skill-tests.js \
  --skill-path .agent/skills/local/architecture-review \
  --mode static
```

Skills can bundle cases at `evals/evals.json`. Static mode never invokes an
external model; pass `--runner codex --mode runner` explicitly when behavior
replay is required.

## TDD Integration

Works with TDD Guard to enforce test-first development for skills.
