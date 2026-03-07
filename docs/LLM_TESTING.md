# Internal LLM Harness

This document describes the internal repository harness used to protect `oh-my-codex` itself.

If your goal is "Codex 刚写完代码，接着去智能补测试", start with [docs/AI_TESTING.md](/Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/docs/AI_TESTING.md).

## Scope

The internal harness covers four layers:

1. `skills`
   - runs skill governance
   - runs LLM governance checks
   - runs skill evaluation
   - can optionally replay trigger regression through `skill-tester`

2. `router`
   - validates `omcodex route` against JSON fixtures
   - protects skill recommendation behavior

3. `prompts`
   - validates `architect`, `planner`, and `executor` prompt contracts
   - checks frontmatter, required sections, keywords, and forbidden legacy terms

4. `workflow`
   - smoke-tests `route`, `team`, and `notify` in an isolated sandbox
   - verifies state transitions and notify plugin side effects

## CLI

```bash
omcodex test llm all
omcodex test llm skills --skill-path .codex/skills/skill-tester
omcodex test llm router --cases tests/llm/router-cases.json
omcodex test llm prompts --cases tests/llm/prompt-contract-cases.json
omcodex test llm workflow
```

## Reports

Reports are written to `.omcodex/reports/`:

- `llm-test-all-latest.json`
- `llm-test-all-latest.md`
- `llm-test-skills-latest.json`
- `llm-test-skills-latest.md`
- `llm-test-router-latest.json`
- `llm-test-router-latest.md`
- `llm-test-prompts-latest.json`
- `llm-test-prompts-latest.md`
- `llm-test-workflow-latest.json`
- `llm-test-workflow-latest.md`

## Why It Differs From oh-my-claudecode

`oh-my-codex` does not try to reproduce Claude-specific plugin or HUD lifecycle assumptions.

Instead, this harness protects the Codex-facing surfaces that actually control repo behavior:

- skills
- routing
- role prompts
- workflow smoke behavior

That keeps the harness aligned with the real runtime while the AI-native test generation flow remains centered in `docs/AI_TESTING.md`.
