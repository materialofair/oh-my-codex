# Codex Testing Playbook

Target file: `src/router/skill-router.js`
Target kind: module
Complexity: high
Suggested test file: `src/router/skill-router.test.js`
Suggested layers: unit, regression
Preferred test command: npm test

## Workflow
1. Read the target file and any nearby tests.
2. Add or update the smallest useful test diff first.
3. Cover acceptance items before adding deeper regression cases.
4. Add regression checks for risk signals and branch-heavy logic.
5. Run the most relevant verification command available.

## Acceptance Checklist
- AC-001 | P0 | The target module `src/router/skill-router.js` loads without runtime errors.
- AC-002 | P0 | Primary behavior of `normalizeText` is verified against expected input/output.
- AC-003 | P0 | Primary behavior of `countHits` is verified against expected input/output.
- AC-004 | P0 | Primary behavior of `catalogSkills` is verified against expected input/output.
- AC-005 | P0 | Primary behavior of `routeTaskToSkills` is verified against expected input/output.

## Regression Checklist
- RG-001 | P0 | Existing public behavior remains unchanged for current callers.
- RG-002 | P0 | Conditional branches and fallback paths have regression assertions.
- RG-003 | P0 | Auth/token handling does not regress on invalid or missing credentials.

## Generated Artifacts
- Test plan: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__router__skill-router/test-plan.md
- Acceptance checklist: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__router__skill-router/acceptance-checklist.md
- Regression checklist: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/testing/src__router__skill-router/regression-checklist.md
