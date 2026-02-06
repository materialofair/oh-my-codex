# ThinkDeep - Detailed Usage Guide

## Overview

Extended reasoning using Gemini CLI's native thinking capability for complex problem analysis, multi-hypothesis exploration, and evidence-based conclusions.

## When to Use

- Complex architectural decisions
- Multi-faceted problem solving
- Trade-off analysis requiring deep thought
- Strategic planning
- Risk assessment

## Basic Usage

```
"Think deeply about microservices vs monolith for our use case"
"Extended reasoning on database sharding strategy"
"Analyze trade-offs of event sourcing pattern"
```

## Extended Thinking Mode

Gemini's native thinking capability provides:
- **Multi-hypothesis exploration**: Consider multiple approaches
- **Evidence evaluation**: Weigh pros/cons systematically
- **Confidence scoring**: Rate certainty of conclusions
- **Alternative generation**: Explore different perspectives

## Output Format

```markdown
## 🧠 Deep Reasoning Analysis

**Topic**: [Your question]

### Hypothesis Exploration

**Hypothesis 1**: Microservices architecture
- Pros: Independent scaling, tech diversity
- Cons: Operational complexity, distributed debugging
- Confidence: Medium (60%)

**Hypothesis 2**: Modular monolith
- Pros: Simpler operations, easier debugging
- Cons: Scaling limitations, tighter coupling
- Confidence: High (80%)

**Hypothesis 3**: Hybrid approach
- Pros: Gradual migration path
- Cons: Temporary complexity increase
- Confidence: Medium-High (70%)

### Evidence Analysis

**Supporting modular monolith**:
1. Team size (10 developers) suits monolith
2. Traffic (100k users) within monolith capacity
3. Deployment simplicity reduces ops overhead

**Against microservices**:
1. Operational overhead high for small team
2. Distributed tracing complexity
3. Service orchestration learning curve

### Trade-off Analysis

| Factor | Monolith | Microservices | Winner |
|--------|----------|---------------|--------|
| Ops complexity | Simple | Complex | Monolith |
| Scaling flexibility | Limited | High | Microservices |
| Development speed | Fast | Slower | Monolith |
| Tech diversity | Limited | High | Microservices |

### Final Recommendation

**Choose Modular Monolith** (Confidence: 85%)

**Rationale**:
- Team size and traffic don't justify microservices complexity
- Can achieve modular benefits without distributed overhead
- Clear migration path to microservices if needed later

**Decision triggers for microservices**:
- Team grows beyond 30 developers
- Traffic exceeds 1M daily active users
- Need independent deployment of modules

**Action plan**:
1. Design clear module boundaries now
2. Use dependency injection for loose coupling
3. Separate databases per module
4. Monitor when triggers are approached
```

## Advanced Usage

### Confidence-Based Decisions

```
"Think deeply - what's the confidence level for using Kafka vs RabbitMQ?"
```

Provides explicit confidence scores for each option.

### Multi-Dimensional Analysis

```
"Deeply analyze database choice across performance, cost, team expertise, and scalability"
```

Systematic evaluation across specified dimensions.

### Risk Assessment

```
"Extended reasoning on risks of migrating from MySQL to Cassandra"
```

Identifies and quantifies potential risks.

## Real-World Scenarios

### Scenario 1: Technology Migration Decision

**Question**: "Think deeply about migrating from REST to GraphQL"

**Analysis includes**:
- Current REST pain points
- GraphQL benefits and costs
- Migration complexity
- Team readiness
- Rollback strategy

### Scenario 2: Architecture Pattern Selection

**Question**: "Deep analysis of CQRS pattern for our e-commerce system"

**Analysis includes**:
- CQRS fit for use case
- Implementation complexity
- Eventual consistency implications
- Alternative patterns comparison

## CLI Usage

```bash
cat > /tmp/thinkdeep_prompt.txt << 'PROMPT_EOF'
Think deeply about the following decision:

[Your complex question]

Consider:
- Multiple perspectives
- Evidence for/against each option
- Trade-offs and risks
- Confidence levels
- Decision criteria
PROMPT_EOF

cat /tmp/thinkdeep_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP\|YOLO\|Load"
```

## Tips for Better Results

**Be specific about**:
- Context and constraints
- Decision criteria
- What dimensions to analyze
- Acceptable trade-offs

**Example**:
```
❌ "Should I use Redis?"
✅ "Think deeply: Redis vs Memcached for session storage with 100k concurrent users, 10GB RAM budget, high availability requirement"
```

## Related Skills

- **consensus**: Multi-model validation of deep reasoning
- **architect-planner**: Architecture planning with deep analysis
- **brainstorming**: Explore alternatives before deep thinking
