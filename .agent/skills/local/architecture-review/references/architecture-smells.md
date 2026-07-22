# Architecture Smells and False Positives

Use this catalog only after repository evidence suggests a candidate problem. A smell is a prompt for causal analysis, not a finding by itself.

## Contents

1. Dependency and boundary smells
2. Change and ownership smells
3. Abstraction and extensibility smells
4. State and integration smells
5. Common false positives

## 1. Dependency and Boundary Smells

### Wrong-way dependency

A policy-owning module imports presentation, transport, persistence, framework, or vendor details that should be replaceable.

Require proof that the dependency forces policy changes, prevents substitution, or violates an explicit dependency rule. Framework entry points and composition roots legitimately know concrete implementations.

### Boundary bypass

Callers repeatedly reach into another module's internal files, tables, or state instead of using its owned contract.

Require at least one consequence: duplicated invariants, inconsistent authorization/validation, unsafe writes, or coordinated edits. A public read model intentionally shared across modules is not automatically a bypass.

### Circular dependency

Two modules require each other's implementation or initialization, obscuring ownership and forcing lockstep change.

Distinguish compile-time cycles, runtime collaboration, event feedback loops, and domain relationships. Mutual domain concepts are not necessarily implementation cycles.

### Shared-kernel gravity

A `shared`, `common`, or `utils` module becomes the default owner for unrelated policies, so many features depend on it and ownership disappears.

Require evidence of unrelated change reasons or broad change impact. A small stable primitive library with many consumers may be healthy.

## 2. Change and Ownership Smells

### Shotgun surgery

One business or integration change requires parallel edits across several modules, tests, or deployments.

Trace one realistic change end to end. Repetition caused by intentionally independent bounded contexts may be safer than sharing a fragile abstraction.

### Divergent change

One module changes for unrelated reasons such as pricing policy, email formatting, persistence schema, and deployment configuration.

Show distinct change axes and ownership pressure. A cohesive orchestration module may legitimately coordinate several collaborators without owning their policies.

### Scattered invariant

Several callers independently enforce parts of the same rule, leaving no authoritative owner.

Look for inconsistent branches, duplicated validation, or tests that encode different versions of the rule. Boundary-specific validation can be intentionally duplicated when semantics differ.

### Hidden temporal coupling

Correctness depends on callers invoking operations in an undocumented order or maintaining lifecycle state outside the owner.

Prove the invalid sequence is possible and consequential. A fluent builder or explicit state machine can expose ordering intentionally.

## 3. Abstraction and Extensibility Smells

### Leaky abstraction

Callers must understand implementation-specific types, error codes, configuration, ordering, or lifecycle behavior despite using an abstraction.

Identify what implementation change leaks and which callers must adapt. Some low-level libraries intentionally expose platform details as part of their contract.

### Shallow pass-through layer

A wrapper mirrors nearly every operation and parameter of another module without owning policy, defaults, compatibility, or observability.

Apply the deletion test: if deletion simplifies the system without distributing knowledge to callers, the wrapper may be unnecessary. Adapters at external boundaries can still be valuable even when mechanically thin.

### Speculative extension point

A plugin system, strategy hierarchy, generic event bus, or configuration DSL exists without concrete variants or committed variation requirements.

Compare abstraction cost with later extraction cost. Keep an extension point when it protects a high-cost public contract even before a second implementation exists.

### Conditional family spread

The same type/provider/mode conditional appears across several owners, so adding a variant requires synchronized edits.

Confirm the conditionals represent one variation axis. Similar syntax may encode different policies that should remain separate.

### Interface inflation

Interfaces expose operations required by implementations rather than by consumers, or are split so finely that callers assemble the implementation themselves.

Use consumer needs and substitution scenarios as evidence. Large cohesive protocols are not automatically violations.

## 4. State and Integration Smells

### Shared mutable state

Multiple modules mutate the same cache, singleton, session, or data structure without one authoritative owner.

Trace write paths and failure behavior. Immutable shared reference data is not the same smell.

### Distributed monolith

Separately deployed services require synchronous chains, shared schemas, coordinated releases, or cross-service transactions for ordinary changes.

Prove deployment or failure coupling. A modular monolith may be the smaller correction; more messaging is not automatically better.

### Contract leakage

Internal database entities, vendor payloads, transport DTOs, or generated clients become the stable contract between independently evolving modules.

Show that internal evolution breaks consumers. Sharing types within one tightly owned module can be appropriate.

### Orchestration leakage

Several callers reproduce retries, compensation, sequencing, or workflow transitions that should have one owner.

Distinguish reusable policy from caller-specific workflows before centralizing it.

## 5. Common False Positives

Reject or downgrade findings based on these assumptions:

- **“Every concrete dependency needs an interface.”** Add a seam only for a real substitution, ownership, or testing boundary.
- **“Every database access needs a repository.”** A repository is useful when it owns domain-oriented persistence semantics, not when it renames CRUD.
- **“Business logic must always live in a service class.”** Functions, domain objects, use cases, reducers, and handlers can all own policy coherently.
- **“More layers mean better separation.”** Layers add interfaces and navigation; each one must hide knowledge or enforce a boundary.
- **“Any cycle is fatal.”** Identify the cycle type and its change/failure consequence.
- **“Duplicate code must be shared.”** Duplication can preserve independence when consumers evolve for different reasons.
- **“A large module is a god object.”** Size is secondary to cohesion, interface quality, and reasons to change.
- **“A small module is well designed.”** Small pass-through modules can create shallow indirection and scattered knowledge.
- **“Events always decouple.”** Events can hide schemas, ordering, retries, and ownership while increasing operational coupling.
- **“Microservices improve scalability and team autonomy.”** Verify scaling and deployment boundaries; otherwise they can create a distributed monolith.
- **“Open/closed means no existing code may change.”** Optimize for known evolution paths, not unlimited hypothetical extension.
- **“Test mocks prove substitutability.”** A mock may reproduce the test author's assumptions instead of the real contract.

For every candidate smell, state which false positive was considered and why the finding still holds when that distinction matters.
