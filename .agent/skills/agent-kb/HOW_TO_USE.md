# Agent-KB - Detailed Usage Guide

## Overview

Agent-KB is an intelligent reasoning system that searches 300+ expert cases and uses local LLM to synthesize actionable recommendations. Optimizes context by 83% (2500+ words → 400 words).

---

## Basic Usage

### Environment Setup (Recommended First Step)

Run one-time health check before first use:

```bash
bash .codex/skills/agent-kb/scripts/health-check.sh
```

Optional custom location:

```bash
export AGENT_KB_HOME=/path/to/Agent-KB
```

### Trigger Automatically

Agent-KB auto-triggers when you ask:
- "How to..." technical questions
- "Best practices for..."
- "What's the recommended approach..."
- Performance optimization queries
- Architecture decision questions

**Examples**:
```
"How to optimize database queries in Node.js?"
"Best practices for error handling in microservices?"
"What's the recommended approach for state management in React?"
```

### Manual Invocation

If auto-trigger doesn't work:
```
Use agent-kb to answer: [your question]
```

---

## Usage Scenarios

### Scenario 1: Performance Optimization

**Use Case**: Need to improve application performance

**Example Query**:
```
"How to reduce React component re-renders?"
```

**What Happens**:
1. Claude executes: `python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/intelligent_summarizer.py "React component re-renders optimization"`
2. Searches 300+ cases for React performance patterns
3. LLM analyzes and synthesizes key insights
4. Returns structured recommendations:
   - Core techniques (useMemo, useCallback, React.memo)
   - Quantitative metrics (render count reduction %)
   - Common pitfalls (premature optimization)
   - Best practices (profiling first, measure impact)

**Expected Output Format**:
```markdown
## 🧠 Agent-KB Expert Analysis

**Query**: How to reduce React component re-renders?

### Core Recommendations
- Use React.memo for expensive components
- useMemo for heavy computations
- useCallback for functions passed as props
- Virtual scrolling for large lists

### Quantitative Metrics
- React.memo: 60-80% re-render reduction
- useMemo: 40-70% computation time savings
- Virtual scrolling: 95%+ performance gain for 1000+ items

### Common Pitfalls
- Over-memoization adds complexity
- Profiling skipped → random optimization
- Missing key dependencies in useMemo/useCallback

### Best Practices
1. Profile with React DevTools first
2. Measure before/after performance
3. Focus on components that re-render frequently
4. Keep memoization simple

### Related Topics
- React Profiler API
- Code splitting
- Lazy loading
```

---

### Scenario 2: Architecture Decisions

**Use Case**: Choosing between architectural patterns

**Example Query**:
```
"Should I use REST or GraphQL for my API?"
```

**What Happens**:
1. Executes: `python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/intelligent_summarizer.py "REST vs GraphQL API design"`
2. Retrieves historical cases comparing both approaches
3. Analyzes trade-offs, use cases, team considerations
4. Provides decision framework based on project constraints

**Output Includes**:
- **Trade-off Analysis**: REST simplicity vs GraphQL flexibility
- **Use Case Matching**: When to use each (data fetching patterns, client diversity)
- **Team Considerations**: Learning curve, tooling, debugging
- **Performance Metrics**: Request count reduction, payload size
- **Migration Path**: If starting with REST, when to switch

---

### Scenario 3: Best Practices Discovery

**Use Case**: Learning recommended approaches for new technology

**Example Query**:
```
"Best practices for TypeScript in large codebases"
```

**What Happens**:
1. Executes: `python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/intelligent_summarizer.py "TypeScript large codebase best practices"`
2. Aggregates lessons from 300+ enterprise TypeScript projects
3. Identifies common success patterns and anti-patterns
4. Returns validated practices with confidence levels

**Output Includes**:
- **Strict Mode Configuration**: Recommended tsconfig.json settings
- **Code Organization**: Monorepo vs multi-repo, module structure
- **Type Safety**: Avoiding `any`, generic patterns, type guards
- **Build Performance**: Incremental compilation, project references
- **Team Workflows**: Pre-commit hooks, CI/CD integration

---

## Advanced Usage

### Combining with Other Skills

**Agent-KB + multi-model-research**:
```
1. Use agent-kb to get historical expert insights
2. Use multi-model-research for current architectural analysis
3. Synthesize historical lessons + fresh perspectives
```

**Agent-KB + code-review**:
```
1. Use code-review to identify issues
2. Use agent-kb to find best practices for fixing them
3. Apply validated patterns from historical cases
```

### Fallback Strategy

If `intelligent_summarizer.py` times out or fails:

**Automatic Fallback**:
```bash
python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/claude_kb_query_optimized.py "query"
```

This provides:
- Raw cases without LLM analysis (faster)
- Full historical context (more verbose)
- No 400-word limit (comprehensive)

**When to Use Fallback Manually**:
- Need complete case details
- Want to see original expert responses
- LLM summary seems incomplete

---

## Input/Output Format

### Input Format

**Natural Language Questions**:
- "How to..." questions
- "Best practices for..."
- "What's the recommended..."
- "Should I use X or Y..."
- Performance/architecture queries

**Keywords to Include** (improves retrieval):
- Technology names (React, Node.js, PostgreSQL)
- Problem domain (performance, security, scalability)
- Constraints (large scale, microservices, real-time)

### Output Format

**Structured Analysis**:
```markdown
## 🧠 Agent-KB Expert Analysis

**Query**: [Your question]

### Core Recommendations
[3-5 key actionable insights]

### Quantitative Metrics
[Performance numbers, benchmarks, impact percentages]

### Common Pitfalls
[Known failure modes from historical cases]

### Best Practices
[Validated approaches with confidence levels]

### Related Topics
[Areas for deeper exploration]

---
**Source**: Agent-KB (300+ cases)
**Analysis Method**: Local LLM intelligent summarization
```

---

## Performance Characteristics

### Speed

| Scenario | Response Time | Cache Hit |
|----------|--------------|-----------|
| First query (cold) | 8 seconds | No |
| Repeated query | 0.001s | Yes (~100%) |
| Similar query | 1-2 seconds | Partial |

### Context Optimization

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Raw cases | 2500+ words | 400 words | 83% |
| Token count | ~3000 | ~500 | 83% |
| Reading time | 10 minutes | 2 minutes | 80% |

### Knowledge Coverage

**Covered Domains**:
- Frontend (40%): React, Vue, TypeScript, Performance
- Backend (30%): Node.js, Python, APIs, Microservices
- Database (15%): SQL, NoSQL, Query Optimization
- Architecture (10%): System Design, Scalability, Patterns
- DevOps (5%): CI/CD, Deployment, Monitoring

---

## Troubleshooting

### Issue 1: Skill Doesn't Auto-Trigger

**Symptoms**: Asking technical question but agent-kb doesn't activate

**Solutions**:
1. Include trigger keywords: "how to", "best practices", "optimization"
2. Manually invoke: `Use agent-kb to answer: [question]`
3. Check SKILL.md for description updates

### Issue 2: Python Script Fails

**Symptoms**: `intelligent_summarizer.py` returns error

**Solutions**:
1. **Fallback to optimized query**:
   ```bash
   python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/claude_kb_query_optimized.py "query"
   ```
2. **Check script exists**:
   ```bash
   ls ${AGENT_KB_HOME:-$HOME/Agent-KB}/intelligent_summarizer.py
   ```
3. **Verify Python environment**:
   ```bash
   python3 --version  # Should be 3.8+
   ```

### Issue 3: Results Too Generic

**Symptoms**: Analysis doesn't address specific question

**Solutions**:
1. **Add more context to query**:
   - ❌ "How to optimize code?"
   - ✅ "How to optimize React list rendering with 10,000+ items?"
2. **Include constraints**:
   - Technology stack (React, Node.js, PostgreSQL)
   - Scale (1M+ users, 100+ microservices)
   - Requirements (real-time, low latency)

### Issue 4: Cache Not Working

**Symptoms**: Same query takes 8s every time

**Solutions**:
1. Check cache file: `${AGENT_KB_HOME:-$HOME/Agent-KB}/.cache/`
2. Verify query exact match (case-sensitive)
3. Clear cache if corrupted: `rm -rf ${AGENT_KB_HOME:-$HOME/Agent-KB}/.cache/`

---

## Tips & Best Practices

### Query Formulation

**Good Queries** ✅:
- "How to reduce API response time from 2s to 200ms in Node.js Express?"
- "Best practices for managing state in React app with 50+ components?"
- "Should I use MongoDB or PostgreSQL for e-commerce product catalog with 1M+ SKUs?"

**Poor Queries** ❌:
- "Make code faster" (too vague)
- "Fix bug" (no context)
- "Help me" (not specific)

### Maximizing Value

1. **Start Broad, Then Narrow**:
   ```
   First: "Best practices for microservices"
   Then: "How to handle distributed transactions in microservices?"
   ```

2. **Combine Insights**:
   - Query related topics
   - Build comprehensive understanding
   - Cross-reference recommendations

3. **Validate with Follow-up**:
   - Ask for code examples
   - Request implementation assistance
   - Explore related topics

### Integration Workflows

**Research → Plan → Implement**:
```
1. agent-kb: Get historical best practices
2. multi-model-research: Get current analysis
3. brainstorming: Design approach
4. Implement with validated patterns
```

**Debug → Learn → Prevent**:
```
1. Encounter bug or performance issue
2. agent-kb: Find similar cases and solutions
3. code-review: Apply lessons to current code
4. Document pattern to prevent recurrence
```

---

## Real-World Examples

### Example 1: Database Query Optimization

**Query**: "How to optimize slow PostgreSQL queries in production?"

**Agent-KB Returns**:
- **Core Recommendations**: Add indexes, use EXPLAIN ANALYZE, connection pooling
- **Metrics**: 10-100x speedup with proper indexes, 40% reduction with connection pooling
- **Pitfalls**: Over-indexing slows writes, missing vacuum causes bloat
- **Best Practices**: Monitor query performance, use read replicas, cache frequent queries

**Follow-up Actions**:
- Apply EXPLAIN ANALYZE to specific slow queries
- Implement recommended indexes
- Set up query performance monitoring

---

### Example 2: React Performance Debugging

**Query**: "React app slows down after 30 minutes of use - how to diagnose?"

**Agent-KB Returns**:
- **Core Recommendations**: Check for memory leaks, profile with Chrome DevTools, inspect event listeners
- **Metrics**: Memory leaks cause 2-10x slowdown over time, event listener accumulation common cause
- **Pitfalls**: Forgetting to cleanup useEffect, closures capturing old state
- **Best Practices**: Use React DevTools Profiler, cleanup in useEffect return, avoid inline functions in JSX

**Follow-up Actions**:
- Profile app with Chrome DevTools Performance
- Check for useEffect cleanup issues
- Identify components with high re-render count

---

### Example 3: Microservices Communication Pattern

**Query**: "Should I use message queue or HTTP for microservices communication?"

**Agent-KB Returns**:
- **Trade-off Analysis**: HTTP for synchronous, message queue for async/decoupled
- **Use Cases**: HTTP for user-facing APIs, queue for background processing
- **Metrics**: HTTP adds coupling, queue adds eventual consistency complexity
- **Best Practices**: Hybrid approach, HTTP for queries, queue for commands

**Follow-up Actions**:
- Map services to synchronous vs asynchronous needs
- Choose appropriate pattern per service pair
- Design retry and error handling strategy

---

## Skill Metadata

- **Version**: 2.0 (Intelligent Analysis with LLM)
- **Last Updated**: 2025-12-30
- **Knowledge Base**: ${AGENT_KB_HOME:-$HOME/Agent-KB}/ (300+ cases)
- **Python Scripts**:
  - ${AGENT_KB_HOME:-$HOME/Agent-KB}/intelligent_summarizer.py (primary)
  - ${AGENT_KB_HOME:-$HOME/Agent-KB}/claude_kb_query_optimized.py (fallback)
- **Cache**: ${AGENT_KB_HOME:-$HOME/Agent-KB}/.cache/

## Related Skills

- **multi-model-research**: Combine historical insights with fresh analysis
- **code-review**: Apply best practices to code review findings
- **quality-check**: Use patterns from agent-kb in quality assessments
- **brainstorming**: Leverage historical lessons in design phase
