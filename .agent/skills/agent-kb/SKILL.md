---
name: Agent-KB Intelligent Analysis
description: Query the Agent-KB knowledge base for expert technical advice, best practices, and implementation guidance with 83% context optimization.
---

# Agent-KB Intelligent Analysis Skill

## When to Use This Skill

Automatically invoke this Skill when:
- User asks "how to" technical questions
- User requests best practices or patterns
- User needs performance optimization advice
- User asks about architecture decisions
- User wants to know implementation approaches
- Keywords: "best practice", "how to", "optimization", "pattern", "architecture"

## What This Skill Does

**Agent-KB** is an intelligent reasoning system that:
1. **Searches** 300+ historical expert cases
2. **Analyzes** with local LLM to extract insights
3. **Summarizes** into 400-word actionable recommendations
4. **Optimizes** context by 83% vs raw cases

## Instructions

When this Skill is invoked:

### Step 1: Execute the Query

**IMPORTANT**: You MUST execute this Python command:

```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "user's technical question"
```

### Step 2: Present Results

Format the output as:

```markdown
## 🧠 Agent-KB Expert Analysis

**Query**: [User's Question]

### Core Recommendations
[Key actionable insights from analysis]

### Quantitative Metrics
[Performance data, benchmarks, specific numbers]

### Common Pitfalls
[Known issues from historical cases]

### Best Practices
[Validated approaches from successful implementations]

### Related Topics
[Relevant areas for deeper exploration]

---
**Source**: Agent-KB Knowledge Base (300+ expert cases)
**Analysis Method**: Local LLM intelligent summarization
```

### Step 3: Offer Follow-up

Ask if the user wants:
- More details on any recommendation
- Related topics exploration
- Implementation assistance
- Code examples

## Examples

### Example 1: Performance Question
**User**: "How to optimize React list rendering?"

**You execute**:
```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "React list rendering optimization"
```

**You present**: Structured analysis with useMemo/useCallback recommendations, virtual scrolling suggestions, and performance metrics.

### Example 2: Architecture Question
**User**: "Best practices for microservices communication?"

**You execute**:
```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "microservices communication patterns"
```

**You present**: Analysis of message queues, service mesh, API gateways with pros/cons.

## Performance Characteristics

- **Retrieval Speed**: 0.001s (cached queries), 8s (first query)
- **Context Savings**: 83% reduction (2500+ words → 400 words)
- **Knowledge Base**: 300+ expert cases
- **Cache Hit Rate**: ~100% for common questions

## Fallback Strategy

If `intelligent_summarizer.py` fails, use the optimized query:

```bash
python /Users/WangQiao/Agent-KB/claude_kb_query_optimized.py "query"
```

This provides raw cases without LLM analysis.

## Important Notes

- **Always execute** the Python command, don't just describe what it would do
- **Present structured output**, not raw Python output
- **Offer actionable advice**, not just information
- **Include metrics** when available from the analysis
- **Cite confidence** levels from the analysis results

## Knowledge Coverage

- Frontend: React, Vue, TypeScript, Performance
- Backend: Node.js, Python, Microservices, APIs
- Database: SQL, NoSQL, Query Optimization
- Architecture: System Design, Scalability, Patterns
- DevOps: CI/CD, Deployment, Monitoring
