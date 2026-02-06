# Brainstorming - Detailed Usage Guide

## Overview

Refine rough ideas into fully-formed designs through structured Socratic questioning, alternative exploration, and incremental validation.

## When to Use

**Before writing code or implementation plans**:
- Exploring solution space
- Validating assumptions
- Design decisions
- Problem decomposition
- Alternative generation

## Structured Questioning Framework

### Phase 1: Problem Understanding

**Questions**:
- What problem are we really solving?
- What are the constraints?
- What would success look like?
- What are we NOT trying to solve?

**Example**:
```
User: "Need to implement real-time sync"

Claude questions:
- What data needs syncing?
- How real-time (100ms, 1s, 10s)?
- How many clients?
- Offline support needed?
- Conflict resolution strategy?
```

### Phase 2: Alternative Exploration

**Generate 3-5 alternatives**:
1. Simple approach (MVP)
2. Standard approach (industry best practice)
3. Innovative approach (novel solution)
4. Hybrid approach (combining strengths)

**Example**:
```
Sync approaches:
1. Polling (simple, higher latency)
2. WebSocket (real-time, complex)
3. Server-Sent Events (one-way, simpler than WebSocket)
4. Hybrid (SSE for updates + REST for mutations)
```

### Phase 3: Incremental Validation

**Validate each alternative**:
- Pros/cons analysis
- Complexity assessment
- Cost/benefit evaluation
- Risk identification

**Example**:
```
WebSocket approach:
✅ Pros: True bi-directional, low latency
❌ Cons: Complex scaling, connection management
📊 Complexity: High (need sticky sessions, clustering)
💰 Cost/Benefit: High cost for read-heavy workloads
⚠️ Risks: Connection limits, debugging difficulty
```

### Phase 4: Decision Refinement

**Converge to recommended approach**:
- Eliminate clearly inferior options
- Combine strengths of remaining options
- Define decision criteria
- Make recommendation with confidence level

## Output Format

```markdown
## 💡 Brainstorming Session

**Topic**: [Your question/problem]

---

### Problem Understanding

**Core Problem**: Need real-time data sync for collaborative editor

**Constraints**:
- 100 concurrent users per document
- <200ms update latency
- Offline editing support required
- Conflict resolution needed

**Success Criteria**:
- All users see changes within 200ms
- No data loss on conflicts
- Works offline with sync on reconnect

---

### Alternative Solutions

#### Option 1: Simple Polling
**Approach**: Clients poll every 1 second for updates

**Pros**:
- Very simple implementation
- No special server infrastructure

**Cons**:
- High server load (100 requests/sec per document)
- 1-second latency (doesn't meet requirement)

**Verdict**: ❌ Doesn't meet latency requirement

---

#### Option 2: WebSocket + Operational Transform
**Approach**: WebSocket for real-time, OT for conflict resolution

**Pros**:
- Meets latency requirement
- Battle-tested OT libraries exist
- True real-time collaboration

**Cons**:
- Complex OT implementation
- Difficult debugging
- Server complexity (sticky sessions, clustering)

**Verdict**: ⚠️ Meets requirements but high complexity

---

#### Option 3: Server-Sent Events + CRDT
**Approach**: SSE for server-to-client updates, REST for client mutations, CRDT for conflicts

**Pros**:
- Simpler than WebSocket (one-way)
- CRDT eliminates conflict resolution complexity
- Offline support built-in with CRDT

**Cons**:
- CRDT library learning curve
- Larger payload size
- Not true bi-directional

**Verdict**: ✅ Good balance of simplicity and features

---

#### Option 4: Firebase/Supabase (Managed Service)
**Approach**: Use managed real-time database

**Pros**:
- Zero infrastructure complexity
- Built-in offline support
- Proven scalability

**Cons**:
- Vendor lock-in
- Cost at scale
- Limited customization

**Verdict**: ✅ Good for MVP, consider migration path

---

### Decision Matrix

| Criteria | Polling | WebSocket+OT | SSE+CRDT | Firebase | Weight |
|----------|---------|--------------|----------|----------|--------|
| Latency | ❌ | ✅ | ✅ | ✅ | High |
| Complexity | ✅ | ❌ | ⚠️ | ✅ | High |
| Offline Support | ❌ | ⚠️ | ✅ | ✅ | Medium |
| Scalability | ❌ | ⚠️ | ✅ | ✅ | Medium |
| Cost | ✅ | ✅ | ✅ | ❌ | Low |

---

### Recommended Approach

**Phase 1 (MVP)**: Firebase
- Fastest time to market
- Validate product hypothesis
- Defer infrastructure complexity

**Phase 2 (Growth)**: SSE + CRDT (YJS library)
- Migrate when Firebase costs exceed $X/month
- Own infrastructure and data
- Keep offline support and conflict resolution

**Confidence**: High (80%)

**Rationale**:
- Firebase reduces MVP risk
- SSE+CRDT provides clear migration path
- CRDT solves conflict resolution elegantly
- SSE simpler than WebSocket for primarily server-push workload

---

### Next Steps

1. **Prototype with Firebase** (1 week)
2. **Set migration triggers** (cost > $500/mo OR features limited)
3. **Research YJS library** (understand CRDT implementation)
4. **Design migration strategy** (gradual rollout, feature parity checklist)
```

## Question Patterns

### Assumption Challenging

```
"What if we DON'T need real-time?"
"What if offline support isn't actually required?"
"What if 100 users is actually 1000?"
```

### Constraint Relaxation

```
"What if we had unlimited budget?"
"What if we had 6 months instead of 6 weeks?"
"What if we could use any technology?"
```

### Simplification

```
"What's the absolute simplest version?"
"What if we only supported Chrome?"
"What if we limited to 10 users first?"
```

## Real-World Examples

### Example 1: State Management Decision

**Question**: "How to manage state in React app?"

**Brainstorming generates**:
- useState + Context (simple)
- Redux (battle-tested)
- Zustand (modern, minimal)
- React Query (server state)
- Jotai/Recoil (atomic)

**Converges to**: Zustand for client state + React Query for server state

### Example 2: Authentication Strategy

**Question**: "Auth approach for SaaS app?"

**Brainstorming generates**:
- JWT (stateless, simple)
- Session cookies (server state, revocable)
- OAuth only (delegated auth)
- Hybrid (JWT + refresh token)

**Converges to**: Hybrid with short-lived JWT + HTTP-only refresh cookies

## Tips for Effective Brainstorming

**DO** ✅:
- Explore 3-5 alternatives minimum
- Challenge assumptions explicitly
- Consider simple + complex options
- Define decision criteria upfront

**DON'T** ❌:
- Jump to first solution
- Ignore constraints
- Skip validation step
- Over-engineer from start

## Related Skills

- **thinkdeep**: Deep analysis of chosen option
- **consensus**: Multi-model validation
- **architect-planner**: Detailed planning after brainstorming
- **multi-model-research**: Research specific approaches
