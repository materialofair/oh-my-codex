# Codex Testing Playbook

Target file: `src/cli/index.js`
Target kind: module
Complexity: high
Suggested test file: `src/cli/index.test.js`
Suggested layers: unit, regression
Preferred test command: npm test

## Workflow
1. Read the target file and any nearby tests.
2. Add or update the smallest useful test diff first.
3. Cover acceptance items before adding deeper regression cases.
4. Add regression checks for risk signals and branch-heavy logic.
5. Run the most relevant verification command available.

## Acceptance Checklist
- AC-001 | P0 | The target module `src/cli/index.js` loads without runtime errors.
- AC-002 | P0 | Primary behavior of `parseScope` is verified against expected input/output.
- AC-003 | P0 | Primary behavior of `main` is verified against expected input/output.
- AC-004 | P1 | Async success and failure paths are covered.

## Regression Checklist
- RG-001 | P0 | Existing public behavior remains unchanged for current callers.
- RG-002 | P0 | Conditional branches and fallback paths have regression assertions.

## Generated Artifacts
- Test plan: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__cli__index/test-plan.md
- Acceptance checklist: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__cli__index/acceptance-checklist.md
- Regression checklist: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__cli__index/regression-checklist.md
