---
name: ai-commenting
description: AI-native code annotation protocol that encodes intent, risk, dependencies, constraints, and test expectations in machine-parseable comments.
argument-hint: <goal or target files>
---

# AI Commenting Skill


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

Create and maintain AI-native annotations so models can understand project intent quickly and safely, not just code syntax.

## Why This Skill Exists

Traditional comments are optimized for human reading, but LLM coding agents need dense, structured context to avoid unsafe edits and repeated discovery work.

This skill defines a compact annotation protocol that turns files into a machine-readable context layer for:
- Faster onboarding into unfamiliar modules
- Risk-aware edit strategy
- Better test planning
- Lower regression rate in high-coupling code

## Research-Backed Principles

Use these principles when writing AI annotations:
- Explain `why` and constraints, not obvious `what`.
- Keep instructions explicit: goal, constraints, and acceptance checks.
- Standardize structure for easy parsing and retrieval.
- Keep annotations close to code and update them with code changes.
- Prefer short, high-signal metadata over long prose.

## Annotation Format

Canonical format (single line):

```text
/*@ai:key=value|key=value|key=value*/
```

Rules:
- Use ASCII keys and values.
- Separate fields with `|`.
- No spaces around `=`.
- Use concise tokens (`AuthService`, `integration`, `p95<200ms`).
- Keep one annotation to one scope (file or block).

## Field Schema

Core fields (recommended at file level):
- `risk=1-5`: change risk (5 is highest)
- `core=<domain>`: core responsibility (`UserCRUD`, `BillingLedger`)
- `deps=<A,B,C>`: critical dependencies
- `intent=<why>`: non-obvious business intent
- `test=<unit|integration|e2e|contract>`: minimum test gate

Extended fields (use when needed):
- `chain=<A->B->C>`: business or data flow chain
- `async=<low|medium|complex>`: async/concurrency complexity
- `api=<internal|external>`: API boundary type
- `auth=<none|required|strict>`: authorization level
- `invariant=<must_hold>`: critical invariant
- `sidefx=<db,cache,queue,event>`: side effects
- `perf=<budget>`: performance constraint (`p95<200ms`)
- `security=<pii|payment|secret|none>`: security sensitivity
- `owner=<team_or_module>`: ownership hint
- `rollback=<strategy>`: safe fallback strategy
- `ticket=<id>`: change traceability

Optional maintenance fields:
- `lines=<N|500+>`: file size hint
- `updated=<YYYY-MM-DD>`: annotation freshness

## Risk Rubric (Required if `risk` present)

- `risk=1`: isolated logic, low coupling, fast rollback
- `risk=2`: local impact, clear tests, low side effects
- `risk=3`: moderate coupling or external contract dependency
- `risk=4`: cross-module critical path, data/auth impact
- `risk=5`: security/payment/core-state changes, high blast radius

Escalate risk by +1 when any condition applies:
- touches auth/session/payment/PII/secrets
- changes distributed state consistency
- modifies external API contract
- lacks reproducible integration tests

## LLM Context Checklist (Project Coding)

For high-value modules, ensure annotations expose these context dimensions:
- Business goal and intent (`intent`, `core`)
- Hard constraints and invariants (`invariant`, `perf`, `security`)
- Dependency and flow graph (`deps`, `chain`, `sidefx`)
- Interface contract and auth boundary (`api`, `auth`)
- Validation strategy (`test`)
- Operational safety (`risk`, `rollback`, `owner`)

If the model can read these fields, it can plan edits with less guesswork.

## Placement Strategy

Use a two-layer strategy:

1) File header annotation (always for critical modules)
- Place near imports or module declaration.
- Include at least: `risk`, `core`, `deps`, `intent`, `test`.

2) Critical block annotation (selective)
- Place above risky functions/flows.
- Include only fields needed for that block (`invariant`, `auth`, `sidefx`, `perf`).

Do not annotate every function. Keep density high-signal.

## Your Draft, Upgraded

Example from your draft (fully valid):

```typescript
/*@ai:risk=4|deps=UserModel,AuthService,Database|lines=500+|core=UserCRUD*/
/*@ai:chain=Auth->User->Permission->Audit|async=complex|test=integration*/
class UserManager {
  // ...
}
```

Recommended enriched version:

```typescript
/*@ai:risk=5|core=UserCRUD|intent=protect_user_consistency|deps=UserModel,AuthService,AuditService*/
/*@ai:chain=Auth->User->Permission->Audit|auth=strict|sidefx=db,event|test=integration|rollback=feature_flag*/
class UserManager {
  /*@ai:risk=4|invariant=user_id_unique|security=pii|perf=p95<200ms*/
  async deleteUser(userId: string) {
    // ...
  }
}
```

## Execution Workflow

When asked to annotate a module:

1. Discover scope
- Identify files and high-risk boundaries.
- Gather dependency and contract points.

2. Assign risk and context fields
- Start with file-level core fields.
- Add block-level fields only for risky paths.

3. Validate syntax and quality
- Ensure parseable `/*@ai:...*/` format.
- Remove duplicate or contradictory tags.

4. Tie to tests and safety
- Ensure `test` and `rollback` are present for `risk>=4`.

5. Output concise report
- Files touched
- Risk distribution
- Missing test/safety gaps

## Quality Gates

Minimum acceptance:
- All `risk>=4` files have file-level `@ai` annotations.
- Each `risk>=4` block includes `test` or inherits explicit file-level `test`.
- `security!=none` implies `auth!=none` and a rollback strategy.
- No stale tags older than 90 days without verification (`updated=` recommended).

Density guidance:
- Prefer 1 annotation per 60-120 LOC.
- Avoid repetitive tags on low-risk utility code.

## Anti-Patterns

Avoid:
- Restating code mechanics as metadata.
- Conflicting tags in one scope (`auth=none` and `security=pii`).
- Unbounded text blobs in `intent`.
- Tag sprawl without test or rollback fields.

## Parsing Helpers

Use these regex patterns when extracting annotations:

```javascript
const aiTagPattern = /\/\*@ai:([^*]+)\*\//g;
const fieldPattern = /(\w+)=([^|*]+)/g;
```

Normalize output to key-value JSON for downstream retrieval and risk maps.

## Deliverable Template

When this skill completes, return:
- `Result summary`: what annotation protocol was applied
- `Files changed`: absolute file paths
- `Validation evidence`: parser/lint/check commands and outcomes
- `Risks / next actions`: unresolved safety/test gaps

## References

- OpenAI prompt engineering best practices: clear instruction, context, constraints, and evaluation criteria
- Anthropic prompt engineering: explicit structure and measurable output constraints
- GitHub Copilot custom instructions: repository-specific standards and conventions improve coding quality
- Google style guides: comments should prioritize intent and maintainability
