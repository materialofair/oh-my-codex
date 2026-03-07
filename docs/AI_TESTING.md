# Codex AI Testing System

This repository now has two testing layers.

## 1. Smart Testing for User Code

Use these commands after Codex has written or changed code:

```bash
omcodex test detect-stack
omcodex test changed
omcodex test analyze src/router/skill-router.js
omcodex test gen src/router/skill-router.js
```

They help Codex act like a test engineer:

- detect the project stack
- find recently changed code files
- analyze a target file
- generate acceptance and regression artifacts
- create a testing playbook Codex can follow while writing tests

Generated artifacts live under `.omcodex/testing/<target>/`.

## 2. In-Session Skill

Use the new skill:

```text
$test-gen path/to/file
```

This is the primary path for:

- “Codex 刚写完代码，给它补测试”
- “生成验收和回归测试”
- “对改动文件做智能测试”
- “对这次改动自动补测”

## Auto Trigger Pattern

The recommended post-implementation command is:

```bash
omcodex test changed
```

It inspects the current git working tree, finds changed non-test code files, and generates a testing pack for each one.

Use `omcodex test gen <file>` when you want to force a specific target.

## 3. Internal Repo Harness

For `oh-my-codex` itself:

```bash
omcodex test llm all
```

That internal harness validates:

- skill docs
- router behavior
- role prompt contracts
- workflow smoke tests

## Design Choice

This workflow intentionally does **not** depend on external prompt-eval tooling.

The goal is not prompt evaluation. The goal is to let Codex use its own reasoning ability to produce stronger tests after code changes, similar in spirit to the original `oh-my-claudecode` testing system but adapted to Codex runtime realities.
