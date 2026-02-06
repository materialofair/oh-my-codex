# Architect Planner - Detailed Usage Guide

## Overview

Architecture planning expert using Gemini CLI with 1M context window for large-scale system design, comprehensive architectural analysis, and strategic planning.

## When to Use

- Planning new systems from scratch
- Major architecture refactoring
- Scalability planning (10x-100x growth)
- Complex system integration
- Technology stack decisions

## Key Advantage: 1M Context Window

Gemini's 1M token context allows:
- Complete codebase analysis
- Large documentation processing
- Comprehensive architectural patterns
- Cross-module dependency analysis

## Basic Usage

```
"Plan microservices architecture for e-commerce platform"
"Design scalable real-time notification system for 1M users"
"Architecture strategy for data pipeline processing 10TB/day"
```

## Output Format

```markdown
## 🏗️ Architecture Plan

### System Overview

**Requirements**:
- Support 1M concurrent users
- Real-time notifications (<100ms latency)
- 99.99% availability
- Global distribution

**Proposed Architecture**: Event-Driven Microservices

---

### High-Level Design

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Clients   │ ───> │  API Gateway │ ───> │  Services   │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            v                      v
                     ┌──────────────┐      ┌─────────────┐
                     │    Cache     │      │   Message   │
                     │   (Redis)    │      │    Queue    │
                     └──────────────┘      └─────────────┘
```

---

### Component Design

#### 1. API Gateway
- **Technology**: Kong / AWS API Gateway
- **Responsibilities**: Routing, rate limiting, auth
- **Scaling**: Horizontal (5-10 instances)

#### 2. Notification Service
- **Technology**: Node.js + Socket.IO / AWS SNS
- **Architecture**: Fan-out pattern
- **Scaling**: Auto-scaling based on connections

#### 3. Message Queue
- **Technology**: Kafka / RabbitMQ
- **Purpose**: Decouple services, handle bursts
- **Partitioning**: By user_id hash

#### 4. Database
- **Primary**: PostgreSQL (user data, transactions)
- **Cache**: Redis (sessions, real-time state)
- **Search**: Elasticsearch (notification history)

---

### Scalability Strategy

**Phase 1: MVP (10k users)**:
- Monolithic deployment
- Single PostgreSQL instance
- Redis cache layer

**Phase 2: Growth (100k users)**:
- Microservices decomposition
- PostgreSQL read replicas
- CDN for static assets

**Phase 3: Scale (1M+ users)**:
- Kubernetes orchestration
- PostgreSQL sharding
- Multi-region deployment
- Message queue clustering

---

### Technology Stack Justification

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Language | Node.js | Real-time I/O, WebSocket support |
| Framework | Express + Socket.IO | Proven real-time capabilities |
| Database | PostgreSQL | ACID guarantees, JSON support |
| Cache | Redis | Low latency, pub/sub for real-time |
| Queue | Kafka | High throughput, replay capability |
| Orchestration | Kubernetes | Container management, auto-scaling |

---

### Risk Assessment

**High Risk**:
1. **Message delivery guarantees** → Use at-least-once delivery + idempotency
2. **Database bottleneck** → Plan sharding early, monitor query performance

**Medium Risk**:
3. **WebSocket connection limits** → Use connection pooling, sticky sessions
4. **Kafka operational complexity** → Invest in monitoring, runbooks

**Low Risk**:
5. **CDN costs** → Optimize asset sizes, use compression

---

### Implementation Roadmap

**Month 1-2: Foundation**:
- Set up PostgreSQL + Redis
- Basic API gateway
- Core notification service

**Month 3-4: Scalability**:
- Implement message queue
- Add read replicas
- WebSocket clustering

**Month 5-6: Production**:
- Monitoring and alerting
- Load testing (simulate 1M users)
- Multi-region setup

---

### Success Metrics

- **Performance**: p99 latency < 100ms
- **Availability**: 99.99% uptime
- **Scalability**: Linear scaling to 1M users
- **Cost**: $0.05 per user per month
```

## Advanced Features

### Large Codebase Analysis

```
"Analyze my monolith (200k LOC) and plan microservices decomposition"
```

Gemini 1M context can:
- Read entire codebase
- Identify module boundaries
- Suggest service split strategy

### Pattern Matching

```
"Find similar architecture patterns in my existing systems"
```

Leverages 1M context to cross-reference patterns.

### Comprehensive Documentation

```
"Generate architecture documentation for existing system"
```

Analyzes code + generates docs.

## Real-World Scenarios

### Scenario 1: E-Commerce Platform

**Requirements**: 100k products, 1M users, real-time inventory

**Architecture**:
- Product catalog: PostgreSQL + Elasticsearch
- Inventory: Redis (real-time) + PostgreSQL (source of truth)
- Orders: Event-sourced microservice
- Recommendations: Separate service with ML model

### Scenario 2: Data Pipeline

**Requirements**: 10TB/day ingestion, real-time + batch processing

**Architecture**:
- Ingestion: Kafka (streaming) + S3 (batch)
- Processing: Spark for batch, Flink for real-time
- Storage: Data lake (S3) + warehouse (Snowflake)
- Query: Presto for ad-hoc, Superset for dashboards

## CLI Usage

```bash
cat > /tmp/architect_prompt.txt << 'PROMPT_EOF'
You are a senior system architect with 20+ years experience.

Design architecture for: [Your requirements]

Include:
1. High-level component diagram
2. Technology stack with justification
3. Scalability strategy (10x, 100x growth)
4. Risk assessment
5. Implementation roadmap
6. Success metrics
PROMPT_EOF

cat /tmp/architect_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP"
```

## Related Skills

- **multi-model-research**: Validate architecture with multiple models
- **thinkdeep**: Deep reasoning on architecture trade-offs
- **brainstorming**: Explore architectural alternatives
