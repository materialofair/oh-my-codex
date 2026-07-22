# Architecture Review Dimensions

Use this reference to examine architecture consistently without turning the review into pattern compliance. Apply questions that are relevant to the selected mode and scope.

## Contents

1. Layering and dependency direction
2. Responsibility, cohesion, and module boundaries
3. Coupling and change amplification
4. Extensibility and evolution paths
5. Abstraction depth and information hiding
6. Testability and substitutability
7. State, data, and side-effect ownership
8. Compatibility, migration, and operational boundaries

## 1. Layering and Dependency Direction

Determine the repository's actual layers or dependency policy before applying a conventional model.

Inspect:

- imports, calls, type exposure, callbacks, events, and shared schemas across boundaries;
- composition roots and dependency construction;
- whether domain decisions depend on UI, transport, persistence, or vendor details;
- whether lower-level modules invoke higher-level policies through an explicit port or an implicit back-reference;
- whether a nominal layer is routinely bypassed.

Ask:

- Does each dependency point toward the module that owns the relevant policy?
- Can infrastructure details change without editing core decisions?
- Are cross-layer shortcuts isolated and documented, or becoming the normal path?
- Does the runtime flow differ from compile-time dependencies in an intentional way?

Strong evidence includes a forbidden import, exposed infrastructure type, repeated boundary bypass, or cycle that forces coordinated changes. A directory name alone is not evidence of a layer violation.

## 2. Responsibility, Cohesion, and Module Boundaries

Review whether code that changes for the same reason is localized and code that changes for different reasons is separable.

Inspect:

- ownership of business rules, orchestration, persistence, presentation, and integration logic;
- public surface area versus hidden implementation;
- concepts implemented across unrelated folders or modules;
- modules that accumulate unrelated reasons to change;
- duplicated policies that should have one owner.

Ask:

- Can the module's responsibility be stated without using “and” repeatedly?
- Is the public interface expressed in domain-relevant terms?
- Does understanding or changing one concept require bouncing across many shallow modules?
- Would merging or splitting modules improve locality without creating a larger public contract?

Do not equate small files with good boundaries. A cluster of pass-through files may be one shallow module in practice; a large cohesive module can still have a clear boundary.

## 3. Coupling and Change Amplification

Coupling is costly when one reason for change propagates through independently owned or deployed units. Classify the coupling rather than merely counting dependencies.

Look for:

- **structural coupling** — imports, calls, inheritance, shared types;
- **data coupling** — multiple modules depending on the shape or meaning of shared data;
- **temporal coupling** — operations that must occur in a hidden order;
- **behavioral coupling** — callers depend on undocumented side effects or error semantics;
- **deployment coupling** — independently named components must release together;
- **test coupling** — tests reach through public boundaries into internal wiring;
- **knowledge coupling** — the same business rule is known in several places.

Ask:

- For the concrete change scenario, how many modules, contracts, tests, and deployments must change?
- Which coupling is inherent to the domain, and which is accidental implementation knowledge?
- Is the coordination explicit in one owner or distributed across callers?
- Would removing the coupling move complexity elsewhere rather than reduce it?

Prefer a short change-impact trace over generic claims such as “high coupling.”

## 4. Extensibility and Evolution Paths

Judge extensibility against plausible, stated variation. Extensibility is not the number of interfaces or plugins.

Inspect:

- switch/conditional families repeated across modules;
- extension registration and discovery mechanisms;
- compatibility rules for public APIs, events, schemas, and persisted data;
- whether callers must change when a known new variant is added;
- whether an extension can preserve invariants without privileged access to internals.

Ask:

- What specific variation is expected: behavior, provider, policy, workflow step, data shape, or deployment topology?
- Can that variation be introduced at one owned boundary?
- Which invariants must every extension preserve, and where are they enforced?
- Does the proposed extension point already have at least two real variants or a committed near-term requirement?
- Is the cost of the abstraction lower than the cost of editing the current implementation?

Flag both under-extension and speculative extension. A direct implementation is often correct when only one variant exists and the cost of later extraction is low.

## 5. Abstraction Depth and Information Hiding

An effective module hides substantial decisions behind a smaller, stable interface. An abstraction that forwards parameters or leaks implementation choices adds navigation without leverage.

Inspect:

- ratio of interface concepts to behavior hidden;
- infrastructure/vendor types escaping through public APIs;
- callers configuring internal sequencing or low-level options;
- pass-through wrappers with the same shape as their dependency;
- abstractions whose callers still need to understand every implementation.

Ask:

- What knowledge does this interface remove from callers?
- If the implementation changed, which callers would notice?
- Does deleting the abstraction eliminate complexity or redistribute it among callers?
- Are error modes, ordering constraints, and lifecycle rules part of the real interface but left implicit?

Do not demand the smallest possible interface if it would hide important semantics or force unsafe defaults.

## 6. Testability and Substitutability

Use tests as evidence of where the real architecture boundary lives.

Inspect:

- whether core behavior can be exercised through a stable public interface;
- whether tests construct large parts of the system to verify a small policy;
- mocks coupled to internal call sequences;
- high-fidelity local substitutes for infrastructure;
- contract tests at process, service, or third-party boundaries;
- whether alternate implementations preserve behavior, errors, and lifecycle semantics.

Ask:

- Can important policy be tested without real remote infrastructure?
- Are substitutes placed at a true ownership boundary?
- Would an in-memory or local implementation be more faithful than a mock?
- Do tests verify observable outcomes or internal wiring?
- Is a claimed abstraction actually substitutable in production and tests?

Do not introduce an interface solely to mock a stable, deterministic dependency. Prefer direct tests when the dependency is in-process and cheap.

## 7. State, Data, and Side-Effect Ownership

Architecture becomes fragile when ownership of state transitions and side effects is ambiguous.

Inspect:

- authoritative owners of mutable state and business invariants;
- transactions spanning modules or services;
- caches and replicas with unclear invalidation responsibility;
- events, retries, idempotency, and ordering assumptions;
- shared mutable state and implicit global context;
- validation duplicated at several boundaries with inconsistent semantics.

Ask:

- Which component is authoritative for each state transition?
- Where is atomicity required, and where is eventual consistency accepted?
- Who owns retry, deduplication, timeout, and compensation behavior?
- Can a partial failure leave modules with conflicting beliefs?
- Are events facts owned by the producer or commands that expose consumer behavior?

Treat distributed consistency, security, and data-loss risks as architecture findings when the boundary design creates them.

## 8. Compatibility, Migration, and Operational Boundaries

Architecture quality includes the ability to deploy, observe, migrate, and reverse a change safely.

Inspect when relevant:

- API, event, and schema compatibility;
- expand/migrate/contract sequencing;
- mixed-version behavior during rolling deployment;
- feature flags and rollback dependencies;
- independently deployable components that require lockstep releases;
- ownership of telemetry, failure isolation, and operational controls;
- scaling units and resource contention across boundaries.

Ask:

- Can old and new producers/consumers coexist during rollout?
- Is data migration reversible or at least resumable and observable?
- Does the component boundary match the desired deployment and scaling boundary?
- Can failures be attributed and contained at the boundary?
- What is the smallest safe rollback if the new path fails?

Apply this dimension selectively. Do not turn a local library review into a distributed-systems checklist.
