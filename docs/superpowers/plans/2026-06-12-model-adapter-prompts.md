# Model Adapter Prompts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight OpenAI frontier Codex model adapter prompt layer with contract tests and documentation.

**Architecture:** Keep existing role prompts unchanged. Add one shared adapter prompt under `prompts/adapters/`, validate it through the existing prompt contract machinery, and document when to create future version-specific deltas.

**Tech Stack:** Markdown prompt files, Node.js CommonJS test runner, JSON fixture-based prompt contract tests.

---

## File Structure

- Create `prompts/adapters/openai-frontier-codex.md`: shared adapter for `gpt-5.4`, `gpt-5.5`, and future frontier Codex models.
- Create `tests/llm/model-adapter-cases.json`: adapter contract fixture.
- Modify `src/testing/prompts.js`: allow the prompt suite to run multiple case files.
- Modify `src/testing/index.js`: include adapter cases in the all-suite prompt run.
- Modify `src/cli/test.js`: expose `--adapter-cases` for `omcodex test llm prompts` and `omcodex test llm all`.
- Create `docs/MODEL_ADAPTERS.md`: user-facing documentation for the adapter strategy.
- Modify `docs/LLM_TESTING.md`: mention model adapter contracts as part of the prompt layer.

## Task 1: Add Adapter Prompt And Docs

**Files:**
- Create: `prompts/adapters/openai-frontier-codex.md`
- Create: `docs/MODEL_ADAPTERS.md`

- [ ] **Step 1: Add the adapter prompt**

Create `prompts/adapters/openai-frontier-codex.md` with frontmatter and these sections:

```markdown
---
description: "OpenAI frontier Codex model adapter"
model-family: "openai-frontier-codex"
---

## Purpose
## Model Biases To Correct
## Tool Usage Policy
## Retrieval Policy
## Clarification Policy
## Persistence And Stop Conditions
## Verification Policy
## Output Policy
## Known Failure Modes
## Final Checklist
```

The body must include the exact concepts `frontier`, `repository evidence`, `verification`, `ask only when blocked`, `small reversible changes`, and `future model drift`.

- [ ] **Step 2: Add user-facing documentation**

Create `docs/MODEL_ADAPTERS.md` explaining:

```markdown
# Model Adapters

## Purpose
## Current Default
## Prompt Layers
## Version Strategy
## When To Add A Delta
## Installation
## Testing
```

Include `openai-frontier-codex` as the only default adapter and explain that per-version files are created only after eval evidence.

- [ ] **Step 3: Inspect the files**

Run:

```bash
sed -n '1,220p' prompts/adapters/openai-frontier-codex.md
sed -n '1,220p' docs/MODEL_ADAPTERS.md
```

Expected: both files exist, contain no placeholders, and match the approved design.

## Task 2: Add Adapter Contract Cases

**Files:**
- Create: `tests/llm/model-adapter-cases.json`
- Modify: `src/testing/prompts.js`
- Modify: `src/testing/index.js`
- Modify: `src/cli/test.js`

- [ ] **Step 1: Add the adapter fixture**

Create `tests/llm/model-adapter-cases.json`:

```json
[
  {
    "id": "openai-frontier-codex-adapter",
    "promptFile": "prompts/adapters/openai-frontier-codex.md",
    "requiredFrontmatter": ["description", "model-family"],
    "requiredSections": [
      "## Purpose",
      "## Model Biases To Correct",
      "## Tool Usage Policy",
      "## Retrieval Policy",
      "## Clarification Policy",
      "## Persistence And Stop Conditions",
      "## Verification Policy",
      "## Output Policy",
      "## Known Failure Modes",
      "## Final Checklist"
    ],
    "requiredKeywords": [
      "frontier",
      "repository evidence",
      "verification",
      "ask only when blocked",
      "small reversible changes",
      "future model drift"
    ],
    "forbiddenKeywords": [
      "Claude Code",
      "Gemini",
      "plugin-dir",
      "HUD",
      "leaked prompt"
    ]
  }
]
```

- [ ] **Step 2: Extend the prompt suite case loader**

Modify `src/testing/prompts.js` so `runPromptsSuite()` accepts `extraCasesPaths` and evaluates the default prompt cases plus extra case files. Keep the existing result shape.

Implementation details:

```js
const casesPaths = [
  casesPath,
  ...(Array.isArray(options.extraCasesPaths) ? options.extraCasesPaths : []),
].filter(Boolean);

const cases = casesPaths.flatMap((file) => readJsonFile(file, []));
```

Set `casesPath` in the summary to a single path for legacy behavior and add `casesPaths` for the combined list.

- [ ] **Step 3: Wire adapter cases into all-suite**

Modify `src/testing/index.js` so `runAllSuites()` passes:

```js
extraCasesPaths: [
  options.modelAdapterCasesPath || path.join(root, 'tests', 'llm', 'model-adapter-cases.json'),
]
```

to `runPromptsSuite()`.

- [ ] **Step 4: Add CLI flag**

Modify `src/cli/test.js` so:

- help text includes `--adapter-cases <file>`
- parsed options include `modelAdapterCasesPath`
- `llm prompts` passes `extraCasesPaths`
- `llm all` forwards the option through `runAllSuites(options)`

- [ ] **Step 5: Run prompt suite**

Run:

```bash
node bin/omcodex.js test llm prompts
```

Expected: prompt suite passes and reports 4 cases: 3 role prompts plus 1 adapter prompt.

## Task 3: Update Harness Documentation And Verify

**Files:**
- Modify: `docs/LLM_TESTING.md`

- [ ] **Step 1: Document adapter testing**

Update `docs/LLM_TESTING.md` prompt layer section to say it validates role prompts and model adapter prompts.

Add CLI example:

```bash
omcodex test llm prompts --adapter-cases tests/llm/model-adapter-cases.json
```

- [ ] **Step 2: Run targeted checks**

Run:

```bash
node bin/omcodex.js test llm prompts
npm run test:llm:prompts
node bin/omcodex.js test llm all --router-cases tests/llm/router-cases.json
```

Expected:

- prompt suite passes
- npm prompt script passes
- all-suite passes or reports only pre-existing unrelated failures

- [ ] **Step 3: Inspect final diff**

Run:

```bash
git diff --stat
git diff --check
git status --short
```

Expected:

- no whitespace errors
- changed files are limited to adapter prompt, docs, fixture, and prompt test wiring

