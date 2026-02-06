# Agent-KB Query Optimization Guide

## Query Formulation Best Practices

### Include Specific Context

**Good queries** ✅:
```
"How to optimize PostgreSQL queries with 10M+ rows and complex joins?"
"React performance optimization for list with 10,000+ items and frequent updates"
"Microservices communication pattern for 50+ services with event sourcing"
```

**Poor queries** ❌:
```
"Optimize database"
"React performance"
"Microservices pattern"
```

### Use Domain-Specific Keywords

**Technology stack**:
- Languages: JavaScript, TypeScript, Python, Go, Rust
- Frameworks: React, Vue, Express, Django, Spring Boot
- Databases: PostgreSQL, MongoDB, Redis, Cassandra
- Infrastructure: Kubernetes, Docker, AWS, GCP

**Problem domain**:
- Performance, scalability, security
- Real-time, batch processing, stream processing
- Microservices, monolith, serverless

**Constraints**:
- User scale (100k, 1M, 10M users)
- Data volume (1GB, 100GB, 10TB)
- Latency requirements (<100ms, <1s)
- Team size (5, 20, 100 developers)

## Query Patterns

### Pattern 1: "How to" Questions

```
"How to [action] [technology] for [use case] with [constraints]?"
```

**Examples**:
- "How to scale Redis cluster for 1M concurrent connections with <10ms latency?"
- "How to implement GraphQL subscriptions in Node.js for real-time dashboard with 50k clients?"

### Pattern 2: Comparison Questions

```
"[Technology A] vs [Technology B] for [use case] - pros/cons?"
```

**Examples**:
- "PostgreSQL vs MongoDB for product catalog with complex filtering - trade-offs?"
- "REST vs GraphQL for mobile app with 50+ API endpoints?"

### Pattern 3: Best Practice Questions

```
"Best practices for [technology/pattern] in [context]?"
```

**Examples**:
- "Best practices for error handling in microservices with async communication?"
- "Code organization best practices for React app with 100+ components?"

## Cache Behavior

### When Queries Are Cached

- **Exact match**: Same query text (case-sensitive)
- **Cache duration**: Indefinite (until manual clear)
- **Cache location**: `~/Agent-KB/.cache/`
- **Cache hit**: ~0.001s response time

### When to Clear Cache

```bash
rm -rf ~/Agent-KB/.cache/
```

**Clear when**:
- Query should reflect updated knowledge base
- Corrupted cache entries
- Testing new query formulations

## Iteration Strategies

### Start Broad, Then Narrow

```
Query 1: "Microservices communication patterns"
↓ (get overview)
Query 2: "Synchronous vs asynchronous communication in microservices"
↓ (pick approach)
Query 3: "Message queue selection for microservices - Kafka vs RabbitMQ"
↓ (get specific)
Query 4: "Kafka configuration for microservices with 1M messages/day"
```

### Follow-Up Questions

After initial analysis:
- "Can you provide code examples for [recommendation]?"
- "What are common pitfalls with [approach]?"
- "How to migrate from [current] to [recommended]?"

## Query Refinement

### If Results Are Too Generic

**Add**:
- Specific technologies
- Scale/constraints
- Business context
- Team considerations

**Example**:
```
Generic: "API rate limiting"
↓
Refined: "API rate limiting for public API with 1M requests/day using Express.js and Redis"
```

### If Results Are Off-Topic

**Refine by**:
- Using different keywords
- Adding exclusions (e.g., "not focusing on X")
- Specifying scope (e.g., "backend only, not frontend")

## Advanced Query Techniques

### Multi-Dimensional Queries

Ask for analysis across multiple dimensions:
```
"Analyze Redis vs Memcached across:
- Performance (throughput, latency)
- Operational complexity
- Feature set (data structures, persistence)
- Cost (infrastructure, developer time)
- Team expertise required"
```

### Constraint-Based Queries

Explicitly state constraints:
```
"How to implement real-time notifications with:
- Budget: $500/month for 100k users
- Team: 5 developers, backend focus
- Stack: Node.js, PostgreSQL, AWS
- Timeline: 3 weeks to MVP"
```

### Trade-Off Analysis Queries

Request explicit trade-off analysis:
```
"Trade-offs between:
- Microservices vs modular monolith
Given:
- Team size: 15 developers
- Traffic: 500k DAU
- Complexity: 8 bounded contexts
- Deployment frequency: Daily"
```

## Troubleshooting

### Problem: Results Don't Match Question

**Cause**: Keyword mismatch with knowledge base

**Solution**: Try synonyms
```
"REST API" → "HTTP API", "Web service API"
"caching" → "cache strategy", "memoization"
"microservices" → "service-oriented architecture", "distributed systems"
```

### Problem: Results Too Shallow

**Cause**: Query too broad

**Solution**: Add specificity
```
"Performance optimization"
↓
"React component re-render optimization for large lists (1000+ items)"
```

### Problem: Multiple Topics Mixed

**Cause**: Query covers too much

**Solution**: Split into separate queries
```
"Authentication and caching strategy"
↓
Query 1: "JWT vs session-based authentication for React + Node.js SaaS"
Query 2: "Redis caching strategy for authenticated API responses"
```

## Query Success Metrics

**Good result indicators**:
- Specific, actionable recommendations
- Quantitative metrics (e.g., "40% reduction in render time")
- Code examples or patterns
- Clear decision criteria
- Common pitfalls identified

**Poor result indicators**:
- Generic advice ("consider best practices")
- No metrics or benchmarks
- No code examples
- Vague recommendations
- Missing context
