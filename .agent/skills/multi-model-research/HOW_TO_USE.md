# Multi-Model Research - Detailed Usage Guide

## Overview

Multi-model research skill directly calls Gemini/Codex CLIs for collaborative technical analysis, bypassing MCP to avoid timeouts. Uses OAuth authentication with zero maintenance cost and full control over input/output.

**Key Advantages**:
- ✅ No timeout issues (bypasses PAL MCP 2-minute limit)
- ✅ Uses OAuth (no API key configuration needed)
- ✅ Zero maintenance (no MCP server required)
- ✅ Easy debugging (direct CLI output, testable commands)
- ✅ Full control (custom parameters, formats, timeouts)
- ✅ True multi-model: Gemini (1M context) + Codex (GPT-5) + Claude

---

## Auto-Trigger Conditions

This skill auto-invokes when user says:
- "多模型调研" (multi-model research)
- "技术选型分析" (technology selection analysis)
- "架构决策" (architecture decision)
- "用 Gemini 和 Codex 分析" (analyze with Gemini and Codex)
- "多 AI 协作研究" (multi-AI collaborative research)
- "对比不同模型的观点" (compare different model perspectives)

**Manual Trigger**:
```
使用 multi-model-research 分析 <your question>
```

---

## Usage Scenarios

### Scenario 1: Technology Selection Decision

**Use Case**: Choosing between competing technologies or approaches

**Example Query**:
```
"Should I use Redis or Memcached for session storage in a high-traffic web application?"
```

**What Happens**:

1. **Gemini Analysis** (Architecture Perspective, 1M context):
   - Evaluates overall architecture fit
   - Analyzes scalability implications
   - Assesses deployment complexity
   - Predicts performance at scale

2. **Codex Analysis** (Code Perspective, GPT-5):
   - Reviews implementation best practices
   - Compares client library quality
   - Identifies common code patterns
   - Suggests optimization techniques

3. **Claude Synthesis**:
   - Identifies consensus (e.g., both recommend Redis for persistence needs)
   - Analyzes disagreements (e.g., Gemini focuses on ops, Codex on code)
   - Provides final recommendation with decision rationale

**Expected Output**:
```markdown
## 📊 Multi-Model Technical Research Report

### 🤖 Gemini Architecture Analysis (1M Context Perspective)

**Core Insights**:
- Redis better for session data persistence
- Built-in replication and clustering
- Richer data structures enable session metadata

**Architecture Advantages**: [...]
**Potential Risks**: [...]
**Optimization Suggestions**: [...]

---

### 💻 Codex Code Quality Assessment (GPT-5 Perspective)

**Core Insights**:
- Node.js Redis clients more mature
- Connection pooling patterns well-established
- Error handling better documented

**Best Practices**: [...]
**Common Pitfalls**: [...]
**Performance Optimization**: [...]

---

### 🎯 Claude Comprehensive Decision

#### ✅ Consensus
Both models agree:
- Redis for persistent session storage
- Memcached for pure caching
- Redis has better client library support

#### ⚠️ Differences
| Dimension | Gemini View | Codex View | Analysis |
|-----------|-------------|------------|----------|
| Complexity | Higher operational overhead | More code boilerplate | Redis requires more ops knowledge |
| Performance | Comparable for read-heavy | Redis faster for complex data | Depends on use case |

#### 💡 Complementary Insights
- Gemini: Redis Sentinel for HA, cluster for horizontal scale
- Codex: ioredis library with TypeScript support, connection retry patterns

#### 🎯 Final Recommendation
**Choose Redis if**:
- Need session persistence
- Require complex data types
- Plan to scale horizontally

**Choose Memcached if**:
- Pure ephemeral caching
- Minimal operational complexity
- Simple key-value only

**Action Plan**:
1. Start with Redis Standalone for development
2. Implement ioredis with connection pooling
3. Plan Redis Cluster migration path
4. Monitor memory usage and eviction policies
```

---

### Scenario 2: Architecture Pattern Evaluation

**Use Case**: Evaluating architectural patterns for complex systems

**Example Query**:
```
"Should I use microservices or monolith for a SaaS application with 10 developers and 100k users?"
```

**What Happens**:

1. **Gemini**: Analyzes from system design perspective
   - Team size vs architecture complexity
   - Deployment and operational overhead
   - Scalability ceiling considerations
   - Technology risk assessment

2. **Codex**: Analyzes from code organization perspective
   - Module boundaries and dependencies
   - Testing and CI/CD complexity
   - Code sharing and reuse patterns
   - Development velocity impact

3. **Claude**: Synthesizes team/scale/context-specific recommendation

**Key Output Sections**:
- **Consensus**: Both likely recommend modular monolith for this scale
- **Gemini Focus**: Operational complexity, deployment flexibility
- **Codex Focus**: Code structure, testing strategies
- **Decision Framework**: When to migrate to microservices (team size, traffic, complexity)

---

### Scenario 3: Performance Optimization Strategy

**Use Case**: Optimizing existing system performance

**Example Query**:
```
"How to reduce API response time from 2 seconds to 200ms in Node.js Express application?"
```

**What Happens**:

1. **Gemini**: System-level optimization
   - Database query optimization
   - Caching strategy (Redis, CDN)
   - Load balancing and scaling
   - Infrastructure recommendations

2. **Codex**: Code-level optimization
   - Express middleware optimization
   - Async/await patterns
   - Memory leak detection
   - Profiling tool recommendations

3. **Claude**: Prioritized action plan combining both perspectives

**Output Structure**:
- **Quick Wins** (Codex + Gemini consensus): Add Redis caching, optimize DB queries
- **Medium-term** (Gemini): Scale horizontally, add read replicas
- **Long-term** (Codex): Refactor hot paths, implement async processing
- **Measurement**: Profiling tools, APM setup, metrics to track

---

### Scenario 4: Security Risk Assessment

**Use Case**: Evaluating security implications of technical decisions

**Example Query**:
```
"What are the security risks of using JWT for authentication in a React + Node.js app?"
```

**What Happens**:

1. **Gemini**: Infrastructure and architecture security
   - Token storage best practices
   - HTTPS requirements
   - API gateway considerations
   - Deployment security

2. **Codex**: Implementation-level security
   - JWT library vulnerabilities
   - XSS prevention in React
   - CSRF protection patterns
   - Secure coding practices

3. **Claude**: Comprehensive security checklist + mitigation strategies

---

## CLI Usage Details

### Gemini CLI Commands

**Priority 1: gemp (Long-Task Optimized)**

```bash
# Step 1: Write prompt to temporary file
cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
You are a senior architecture expert with 20 years of large-scale system design experience.

Please deeply analyze the following technical approach:

【User Question】
<INSERT_QUESTION_HERE>

Analysis Requirements:
1. **Architecture Design Rationality**
2. **Scalability and Performance**
3. **Technical Risk Assessment**
4. **Optimization Recommendations**
PROMPT_EOF

# Step 2: Use gemp (20-minute timeout, Vertex AI)
cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
```

**Priority 2: gemini CLI (Fallback)**

```bash
# Use standard gemini CLI as fallback
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP\|YOLO\|Load"
```

**Comparison**:
| Feature | gemp | gemini CLI |
|---------|------|------------|
| Timeout | 20 minutes | ~2-3 minutes |
| Startup Speed | Fast (direct API) | Slow (loads plugins) |
| Output Format | Clean | Has startup logs |
| Use Case | Long tasks / complex analysis | Simple queries |

---

### Codex CLI Commands

**⚠️ Important: Always use temporary file method (avoid shell escaping issues)**

```bash
# Step 1: Write prompt to temporary file
cat > /tmp/codex_prompt.txt << 'PROMPT_EOF'
You are a senior code review expert focused on code quality, security, and best practices.

Please evaluate the following technical approach:

【User Question】
<INSERT_QUESTION_HERE>

Evaluation Requirements:
1. **Code Implementation Best Practices**
2. **Performance Optimization Recommendations**
3. **Security Risk Protection**
4. **Maintainability Analysis**
PROMPT_EOF

# Step 2: Read from stdin using pipe (use - parameter)
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox - 2>&1 | head -500
```

**With Output File** (for longer responses):
```bash
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox -o /tmp/codex_output.txt - 2>&1 && cat /tmp/codex_output.txt
```

---

## Workflow Steps

### Step 1: Preparation and Validation

**Claude's Task**:
1. Collect user's complete question
2. Organize into clear prompt
3. Confirm analysis dimensions (architecture/code/performance)

**Output to User**:
```
📊 Starting Multi-Model Technical Research

**Research Topic**: [User Question]

**Research Models**:
- 🤖 Gemini (Architecture Analysis, 1M Context)
- 💻 Codex (Code Assessment, GPT-5)
- 🧠 Claude (Comprehensive Decision)

**Estimated Time**: 2-3 minutes

Starting research...
```

---

### Step 2: Gemini Architecture Deep Analysis

**Claude's Task**:
1. Execute Gemini CLI command (prioritize gemp)
2. Filter out startup logs and error messages
3. Extract Gemini's actual analysis content
4. Organize into structured format

**Show to User**:
```
✅ Gemini Analysis Complete

#### 🤖 Gemini Architecture Analysis (1M Context Perspective)

[Gemini's Complete Analysis Content]

---
Continuing with Codex code assessment...
```

---

### Step 3: Codex Code Quality Assessment

**Claude's Task**:
1. Execute Codex CLI command
2. Parse JSONL output
3. Extract Codex's analysis content
4. Organize into structured format

**Show to User**:
```
✅ Codex Analysis Complete

#### 💻 Codex Code Assessment (GPT-5 Perspective)

[Codex's Complete Analysis Content]

---
Performing comprehensive decision...
```

---

### Step 4: Claude Comprehensive Decision

**Claude's Task**:
1. Compare Gemini and Codex perspectives
2. Identify consensus points and disagreements
3. Analyze unique insights from each
4. Provide final recommendation

**Analysis Dimensions**:

1. **Consensus Identification**
   - Points both models emphasize
   - Highly consistent recommendations
   - Critical technical decisions

2. **Disagreement Analysis**
   - Gemini's architecture view vs Codex's code view
   - Different priority rankings
   - Complementary suggestions

3. **Unique Insights**
   - Gemini-exclusive architecture insights (1M context advantage)
   - Codex-exclusive code practices (GPT-5 capability)

4. **Final Decision**
   - Comprehensive recommended approach
   - Decision basis and rationale
   - Step-by-step action plan
   - Risk mitigation measures

---

## Advanced Usage

### Combining with Other Skills

**Multi-Model Research + Agent-KB**:
```
1. multi-model-research: Get fresh perspectives from Gemini/Codex
2. agent-kb: Cross-reference with historical expert cases
3. Synthesize: New analysis + validated historical patterns
```

**Multi-Model Research + Brainstorming**:
```
1. brainstorming: Generate multiple solution approaches
2. multi-model-research: Evaluate each approach with Gemini/Codex
3. Select best approach based on multi-model consensus
```

**Multi-Model Research + Code-Review**:
```
1. code-review: Analyze existing codebase
2. multi-model-research: Get improvement recommendations
3. Implement changes with validated patterns
```

---

## Troubleshooting

### Issue 1: Gemini CLI Timeout

**Symptoms**: Gemini command hangs or times out

**Solutions**:
1. **Use gemp instead**:
   ```bash
   cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
   ```
2. **Shorten prompt** (reduce context if too long)
3. **Check OAuth token**:
   ```bash
   gemini --version  # Should show authenticated
   ```

---

### Issue 2: Codex Returns JSONL Format

**Symptoms**: Codex output is JSONL with event types

**Solutions**:
1. **Parse events correctly**:
   - Look for `type: "text"` events
   - Extract `data` field content
   - Combine chunks for full response

2. **Use head to limit output**:
   ```bash
   cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox - 2>&1 | head -500
   ```

---

### Issue 3: CLI Commands Not Found

**Symptoms**: `gemini: command not found` or `codex: command not found`

**Solutions**:
1. **Check installations**:
   ```bash
   which gemini  # Should show path
   which codex   # Should show path
   ```

2. **Verify PATH**:
   ```bash
   echo $PATH | grep -o '[^:]*gemini[^:]*'
   echo $PATH | grep -o '[^:]*codex[^:]*'
   ```

3. **Reinstall if needed**:
   ```bash
   # Gemini: See gemini CLI documentation
   # Codex: npm install -g @anthropic/claude-code-cli
   ```

---

## Tips & Best Practices

### Query Formulation

**Good Queries** ✅:
- "Should I use GraphQL or REST for mobile app backend with 50+ endpoints?"
- "How to architect real-time notification system for 1M+ concurrent users?"
- "What's the best database choice for time-series data with 1TB+ daily ingestion?"

**Poor Queries** ❌:
- "Which is better?" (no context)
- "Help me decide" (unclear what to decide)
- "Optimize my code" (no code provided)

---

### Maximizing Multi-Model Value

1. **Leverage Model Strengths**:
   - Gemini: Large-scale architecture, complex system design (1M context)
   - Codex: Code implementation, library choices, coding patterns (GPT-5)
   - Claude: Synthesis, decision-making, context-specific recommendations

2. **Ask Multi-Dimensional Questions**:
   - Include architecture, code, performance, security dimensions
   - Request trade-off analysis
   - Ask for specific metrics and benchmarks

3. **Iterate with Follow-up**:
   ```
   Initial: "Microservices vs monolith for our SaaS?"
   Follow-up: "How would service mesh impact operational complexity in microservices?"
   Deep-dive: "Show code examples of service-to-service auth in microservices"
   ```

---

## Real-World Examples

### Example 1: Database Selection for E-Commerce

**Query**: "PostgreSQL vs MongoDB for e-commerce product catalog with 1M+ SKUs, complex filtering, and inventory management"

**Gemini Analysis**:
- Strong relational model for inventory tracking
- ACID transactions critical for stock management
- PostgreSQL JSONB for flexible product attributes
- Horizontal scaling with partitioning

**Codex Analysis**:
- TypeORM/Sequelize ecosystem for PostgreSQL
- Mongoose patterns for MongoDB
- Complex join queries easier in PostgreSQL
- Full-text search considerations

**Claude Decision**:
- **Recommend PostgreSQL** for transactional integrity
- Use JSONB for flexible product attributes
- Implement read replicas for search/filtering
- Consider Elasticsearch for advanced search

---

### Example 2: Real-Time Feature Implementation

**Query**: "WebSocket vs Server-Sent Events for real-time dashboard with 5k concurrent users"

**Gemini Analysis**:
- SSE simpler deployment (HTTP/2)
- WebSocket bi-directional but complex scaling
- Load balancer sticky session requirements
- Horizontal scaling considerations

**Codex Analysis**:
- Socket.IO library for WebSocket
- EventSource API for SSE
- Reconnection logic patterns
- Browser compatibility

**Claude Decision**:
- **Recommend SSE** for one-way updates (dashboard)
- Simpler infrastructure, easier scaling
- Fallback to polling for old browsers
- Use WebSocket only if bi-directional needed

---

## Performance Characteristics

### Execution Time

| Phase | Typical Duration | Notes |
|-------|------------------|-------|
| Gemini Analysis | 15-30 seconds | Longer with gemp for complex queries |
| Codex Analysis | 10-20 seconds | Faster for focused code questions |
| Claude Synthesis | 5-10 seconds | Analysis and formatting |
| **Total** | **30-60 seconds** | 2-3 minutes for very complex topics |

### Cost Considerations

- **Gemini**: Free with OAuth (Google account)
- **Codex**: Included with Claude Code license
- **Claude**: Current session (no additional cost)

---

## Skill Metadata

- **Version**: 2.0 (Direct CLI, No MCP)
- **Last Updated**: 2025-12-30
- **CLI Dependencies**:
  - Gemini CLI (OAuth authenticated)
  - Codex CLI (Claude Code CLI)
  - node ~/.gemini/long_task_runner.js (gemp wrapper)
- **Auto-Invoke**: Yes (see trigger conditions)

## Related Skills

- **agent-kb**: Combine with historical expert insights
- **brainstorming**: Use for solution exploration before analysis
- **code-review**: Apply recommendations to code review
- **quality-check**: Validate architectural decisions
- **architect-planner**: Deep-dive into architecture planning
