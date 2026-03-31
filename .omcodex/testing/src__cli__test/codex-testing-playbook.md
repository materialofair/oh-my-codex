# Codex Testing Playbook

Target file: `src/cli/test.js`
Target kind: module
Complexity: high
Suggested test file: `src/cli/test.test.js`
Suggested layers: unit, regression
Preferred test command: npm test

## Workflow
1. Read the target file and any nearby tests.
2. Add or update the smallest useful test diff first.
3. Cover acceptance items before adding deeper regression cases.
4. Add regression checks for risk signals and branch-heavy logic.
5. Run the most relevant verification command available.

## Acceptance Checklist
- AC-001 | P0 | The target module `src/cli/test.js` loads without runtime errors.
- AC-002 | P0 | Primary behavior of `getFlagValue` is verified against expected input/output.
- AC-003 | P0 | Primary behavior of `parseNumber` is verified against expected input/output.
- AC-004 | P0 | Primary behavior of `test` is verified against expected input/output.
- AC-005 | P1 | Async success and failure paths are covered.

## Regression Checklist
- RG-001 | P0 | Existing public behavior remains unchanged for current callers.
- RG-002 | P0 | Conditional branches and fallback paths have regression assertions.

## Generated Artifacts
- Test plan: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__cli__test/test-plan.md
- Acceptance checklist: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__cli__test/acceptance-checklist.md
- Regression checklist: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__cli__test/regression-checklist.md
