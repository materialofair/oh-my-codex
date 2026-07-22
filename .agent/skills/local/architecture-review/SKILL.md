---
name: architecture-review
description: Review software architecture using repository evidence, with focused design, change, and system modes. Use when evaluating an architecture proposal before implementation, verifying a completed feature or refactor for boundary and dependency regressions, or performing a milestone/periodic architecture health review. Focus on layering, dependency direction, module boundaries, cohesion, coupling, extensibility, information hiding, testability, change amplification, migration risk, and architecture drift. Trigger for architecture review requests such as 架构审查, 架构评审, 分层检查, 解耦分析, 扩展性审查, or 架构健康检查. Do not use for ordinary line-level code review or for creating a new architecture from scratch.
---

# Architecture Review

Perform a read-only, evidence-driven review of architecture decisions and their evolution cost. Judge whether responsibilities, dependencies, and change boundaries fit the system's actual requirements; do not reward pattern usage by itself.

## Operating Rules

- Review only. Do not edit code, design documents, or configuration unless the user separately asks for fixes.
- Retrieve project facts before applying architecture principles. Treat repository documentation, ADRs, tests, and configuration as the source of truth.
- Cite concrete files and line numbers for implementation findings. For proposal-only reviews, cite sections of the supplied design artifacts and label unverified assumptions.
- Require a realistic change, failure, scale, or replacement scenario before calling something an extensibility or coupling problem.
- Prefer the smallest correction that restores a boundary. Do not prescribe dependency injection, interfaces, repositories, services, events, or microservices without evidence that they reduce current change cost or risk.
- Separate architecture findings from correctness, security, performance, and style findings. Mention another category only when it changes an architecture decision.
- Preserve intentional tradeoffs. If a concern conflicts with an ADR or explicit constraint, report the tension instead of silently re-litigating the decision.
- Do not assign arbitrary architecture scores. Use evidence-backed findings and a clear review status.

## Select the Review Mode

Choose exactly one primary mode:

| Mode | Use when | Default scope | Main question |
|---|---|---|---|
| `design` | Reviewing a plan, RFC, ADR, or proposed architecture before implementation | Supplied design artifacts plus relevant existing boundaries | Will this design place responsibilities and dependencies correctly? |
| `change` | Reviewing a completed feature, refactor, branch, PR, or diff | Changed files plus directly affected callers, callees, tests, and contracts | Did this change introduce architecture regression or unplanned coupling? |
| `system` | Performing a periodic, milestone, or whole-codebase health review | The requested subsystem or repository, sampled by architecture significance | Where has architecture drift created the highest evolution risk? |

Infer the mode from the request and available artifacts. Prefer `change` when the user asks to review completed work, `design` when implementation has not started, and `system` only for explicit broad or periodic reviews. Ask a question only when different mode choices would materially change the scope.

State the selected mode and scope at the start of the review. A mode controls depth, not the quality bar.

## Review Workflow

### 1. Establish Intent and Constraints

Identify:

- the behavior or capability being introduced or assessed;
- explicit non-goals and constraints;
- relevant quality attributes such as maintainability, availability, latency, security, or deployability;
- the expected sources of future variation;
- the review baseline: current implementation, base branch, previous design, or documented target architecture.

If the baseline is missing, continue with what can be proven and mark the limitation. Do not invent requirements.

### 2. Retrieve Architecture Evidence

Read the narrowest useful set of artifacts:

1. applicable `AGENTS.md` and repository instructions;
2. `README.md`, architecture docs, ADRs, plans, and diagrams relevant to the scope;
3. package/build/deployment configuration that defines module or process boundaries;
4. public interfaces, entry points, composition roots, data access boundaries, and integration adapters;
5. tests that reveal intended boundaries and observable behavior.

For `change` mode, inspect the diff first, then expand only to affected neighbors. Useful commands include:

```bash
git status --short
git diff --stat
git diff -- <scoped paths>
rg --files <scoped paths>
rg -n "<symbol|import|route|event|table>" <relevant roots>
```

Use a user-supplied base branch or commit when provided. Do not assume an empty working-tree diff means there is no change to review.

For `system` mode, start from entry points and architecture-significant paths rather than reading every file. Use dependency tooling already present in the repository when useful, but verify important conclusions against source files.

### 3. Build the Current Architecture Model

Before judging the design, record a compact model of:

- components or modules and their responsibilities;
- public interfaces and ownership boundaries;
- compile-time and runtime dependency direction;
- important data, control, and side-effect flows;
- external systems and infrastructure dependencies;
- tests that protect each important boundary;
- intended extension or replacement points.

Keep the model proportional to the scope. Use a small Mermaid dependency or flow diagram only when it clarifies three or more relationships.

### 4. Evaluate the Architecture Dimensions

Read [review-dimensions.md](references/review-dimensions.md) and apply every relevant dimension:

1. layering and dependency direction;
2. responsibility, cohesion, and module boundaries;
3. coupling and change amplification;
4. extensibility and evolution paths;
5. abstraction depth and information hiding;
6. testability and substitutability;
7. state, data, and side-effect ownership;
8. compatibility, migration, and operational boundaries.

Use dimensions as questions, not as a compliance checklist. Mark dimensions that are not relevant instead of manufacturing findings.

When a suspected smell appears, read [architecture-smells.md](references/architecture-smells.md) to test the hypothesis and its common false positives.

### 5. Prove or Reject Candidate Findings

Keep a candidate only when it has all of the following:

1. **Evidence** — exact code, configuration, test, or design location;
2. **Boundary expectation** — the responsibility, dependency rule, or quality attribute at stake;
3. **Concrete scenario** — a realistic change, failure, replacement, or scale event;
4. **Impact** — affected modules, contracts, teams, deployments, or test surfaces;
5. **Recommendation** — the smallest viable direction, not a speculative redesign;
6. **Tradeoff** — cost, complexity, compatibility, or limitation introduced by the recommendation.

Drop findings based only on naming, personal preference, textbook purity, or hypothetical future requirements. Consolidate multiple symptoms with the same architectural cause into one finding.

### 6. Classify Findings and Status

Classify each retained finding:

- **BLOCKING** — The architecture cannot safely meet a stated requirement, violates a critical boundary, creates an unsafe/irreversible migration, or introduces a systemic failure path. Address before implementation or merge.
- **HIGH** — Evidence shows significant change amplification, boundary erosion, or coupling likely to make the current feature or near-term evolution unsafe. Usually address before merge.
- **MEDIUM** — A real but contained architecture debt exists. It may be deferred with an explicit owner, trigger, or follow-up.
- **LOW** — A supported improvement with limited impact. Never use LOW for style preferences.

Assign one overall status:

- **CLEAR** — No material evidence-backed architecture concern was found in the reviewed scope.
- **WATCH** — Non-blocking findings or documented drift require follow-up.
- **BLOCK** — At least one unresolved BLOCKING finding exists.
- **INCONCLUSIVE** — Required artifacts or evidence were unavailable, so a reliable verdict is not possible.

Absence of findings is not proof of whole-system quality; scope the status explicitly.

### 7. Produce the Mode-Specific Report

Read [report-format.md](references/report-format.md) and use its template for the selected mode.

Always include:

- mode, scope, baseline, and evidence inspected;
- a compact current-state or before/after architecture model;
- findings ordered by severity and impact;
- strengths that are directly supported by evidence;
- unknowns and unverified assumptions;
- overall status and the smallest next action.

For `design`, emphasize decisions, alternatives, dependency rules, and migration feasibility. For `change`, emphasize before/after relationships and architecture-plan conformance. For `system`, report only the highest-value hotspots and architecture drift; do not turn the result into an unbounded refactoring backlog.

## Mode Completion Criteria

### `design`

- Trace every major component to a responsibility and owner.
- Show dependency direction and important data/control flows.
- Test the design against stated variation, failure, and migration scenarios.
- Identify assumptions that implementation must verify.

### `change`

- Review all architecture-significant changed files.
- Trace new or changed public interfaces to their consumers.
- Compare intended and implemented boundaries.
- Check whether tests exercise the stable boundary rather than internal wiring alone.

### `system`

- Explain how review hotspots were selected.
- Inspect representative entry points, composition boundaries, and dependency hubs.
- Distinguish local debt from systemic drift.
- Limit recommendations to a prioritized, evidence-backed set.

## Skill Boundaries

- Use `architect-planner` when the user needs a new target architecture or a detailed migration plan created.
- Use `code-review` for general correctness, security, performance, and line-level maintainability review.
- Use `project-analyze` when the primary need is codebase mapping, dependency discovery, or impact analysis without an architecture verdict.
- Use this skill after those discovery workflows when an explicit architecture judgment is required.

## Stop Conditions

Stop when the scoped architecture is modeled, all retained findings meet the evidence contract, the status is justified, and the report states remaining uncertainty. Do not continue scanning merely to increase the number of findings.
