# Consensus - Detailed Usage Guide

## Overview

Multi-model consensus decision-making using Gemini/Codex CLI for collaborative analysis, identifying agreements/disagreements, and confidence-weighted recommendations.

## When to Use

- Critical technical decisions
- Architecture pattern selection
- Technology stack choices requiring validation
- Design trade-off analysis
- Risk-sensitive decisions needing multiple perspectives

## Basic Usage

```
"Get consensus on Redis vs PostgreSQL for caching"
"Multi-model decision for microservices communication pattern"
"Consensus analysis of GraphQL vs REST"
```

## Workflow

### Step 1: Independent Analysis

Both Gemini and Codex analyze independently:
- **Gemini**: Architecture/system perspective
- **Codex**: Code/implementation perspective

### Step 2: Consensus Identification

Claude identifies where models agree:
```markdown
### ✅ Strong Consensus (Both models agree)

1. **Use Redis for caching** (Confidence: High)
   - Gemini: Superior performance for cache workload
   - Codex: Excellent client library ecosystem
   
2. **Implement connection pooling** (Confidence: Very High)
   - Gemini: Reduces connection overhead
   - Codex: Well-supported pattern in all languages
```

### Step 3: Disagreement Analysis

Claude analyzes where models differ:
```markdown
### ⚠️ Disagreements

| Aspect | Gemini View | Codex View | Analysis |
|--------|-------------|------------|----------|
| Persistence | Use PostgreSQL JSONB | Use Redis Modules | Gemini focuses on data integrity, Codex on performance |
| Complexity | Hybrid adds overhead | Worth it for flexibility | Different priority on simplicity vs features |
```

### Step 4: Weighted Recommendation

Claude synthesizes with confidence weighting:
```markdown
### 🎯 Final Recommendation

**Recommended Approach**: Redis for cache + PostgreSQL for persistence

**Confidence**: High (85%)

**Rationale**:
- Strong consensus on Redis caching superiority
- Gemini's persistence concerns valid for critical data
- Codex's performance focus appropriate for cache layer
- Hybrid approach addresses both perspectives

**Implementation**:
1. Redis for session data, API responses (Codex recommendation)
2. PostgreSQL for user data, transactions (Gemini recommendation)
3. Clear TTL policies to prevent stale data
```

## Output Format

```markdown
## 🤝 Multi-Model Consensus Analysis

**Decision Topic**: [Your question]

---

### 🤖 Gemini Analysis (Architecture Perspective)

**Recommendation**: [Gemini's choice]
**Confidence**: [High/Medium/Low]

**Rationale**:
- [Key point 1]
- [Key point 2]
- [Key point 3]

---

### 💻 Codex Analysis (Code Perspective)

**Recommendation**: [Codex's choice]
**Confidence**: [High/Medium/Low]

**Rationale**:
- [Key point 1]
- [Key point 2]
- [Key point 3]

---

### ✅ Consensus Points

Both models strongly agree on:
1. [Agreement 1]
2. [Agreement 2]
3. [Agreement 3]

---

### ⚠️ Divergence Points

| Dimension | Gemini | Codex | Claude Analysis |
|-----------|--------|-------|-----------------|
| [Aspect 1] | [View A] | [View B] | [Why different, which to trust] |
| [Aspect 2] | [View A] | [View B] | [Analysis] |

---

### 🎯 Confidence-Weighted Recommendation

**Final Decision**: [Synthesized recommendation]
**Overall Confidence**: [Percentage]

**Why this decision**:
- Leverages consensus strengths
- Addresses divergence concerns
- Balanced perspective

**Action Plan**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

## Real-World Examples

### Example 1: Database Selection

**Query**: "Consensus on MongoDB vs PostgreSQL for product catalog"

**Gemini**: PostgreSQL (relational integrity)
**Codex**: MongoDB (flexible schema)
**Consensus**: Hybrid (PostgreSQL core + MongoDB for flexible attributes)

### Example 2: Caching Strategy

**Query**: "Multi-model analysis of caching layers"

**Gemini**: Redis + CDN (infrastructure view)
**Codex**: Application-level caching + Redis (code view)
**Consensus**: Multi-layer strategy (both are right for different layers)

## Confidence Scoring

**Very High (90-100%)**:
- Both models strongly agree
- Clear technical justification
- Low risk decision

**High (75-89%)**:
- Models mostly agree
- Minor divergences explained
- Acceptable risk

**Medium (50-74%)**:
- Significant disagreement
- Contextual decision
- Requires careful consideration

**Low (<50%)**:
- Major divergence
- Unclear best choice
- Consider more analysis or prototyping

## Related Skills

- **thinkdeep**: Deep single-model analysis
- **multi-model-research**: Broader research vs focused decision
- **architect-planner**: Apply consensus to detailed planning
