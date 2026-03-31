---
name: consensus
description: 多模型共识决策 - 直接调用 Gemini/Codex CLI 获取不同视角，综合决策。支持会话延续，绕过 MCP 避免超时。
auto_invoke: true
tags: [consensus, multi-model, decision, direct-cli]
version: 0.1.0
source: fork
checksum: beb3360bd3f1c20aeee0223225d871ce34949e58c4a47a64befde0da1fcd7239
updated_at: 2026-02-06T15:19:11+08:00
---


# Consensus - 多模型共识决策 Skill

## 🎯 核心功能

通过直接调用 Gemini 和 Codex CLI，获取不同 AI 模型的观点，进行综合决策分析。

**替代**: PAL MCP consensus 工具

## 📋 触发场景

**自动触发**:
- "多模型共识"
- "技术决策需要多方意见"
- "consensus 分析"
- "三方协作决策"

**手动触发**:
```
使用 consensus 分析：<决策问题>
```

## 🔄 Workflow

### Step 1: 理解决策问题

收集用户的决策问题，确保问题清晰具体。

### Step 2: Gemini 观点 (架构视角)

**⚠️ 重要: 优先使用 `gemp` (长任务优化版)，`gemini` CLI 作为备用**

```bash
# Step 1: 写入 prompt 到临时文件
cat > /tmp/gemini_consensus_prompt.txt << 'PROMPT_EOF'
作为架构专家，对以下决策给出你的观点：

【决策问题】
<用户问题>

请从以下角度分析：
1. 架构影响
2. 长期可维护性
3. 技术风险
4. 团队能力要求

明确表态：支持 或 反对 或 有条件支持
PROMPT_EOF

# Step 2: 优先使用 gemp (20分钟超时，输出纯净)
cat /tmp/gemini_consensus_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
```

**备用方案** (如果 gemp 失败):
```bash
cat /tmp/gemini_consensus_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP\|YOLO\|Load"
```

### Step 3: Codex 观点 (代码视角)

```bash
codex exec --json --dangerously-bypass-approvals-and-sandbox \
  --enable web_search_request \
  -c 'mcp_servers={}' \
  "作为代码质量专家，对以下决策给出你的观点：

【决策问题】
<用户问题>

请从以下角度分析：
1. 实现复杂度
2. 代码质量影响
3. 测试难度
4. 性能影响

明确表态：支持 或 反对 或 有条件支持
" 2>&1 | grep '"type":"item.completed"' | tail -1 | python3 -c "
import sys, json
data = json.loads(sys.stdin.read())
print(data['item']['text'])
"
```

### Step 4: Claude 综合决策

基于两个模型的观点，Claude 进行综合分析：

1. **观点对比**
   - Gemini 立场
   - Codex 立场
   - 一致性分析

2. **关键分歧**
   - 分歧点识别
   - 分歧原因分析
   - 权衡建议

3. **最终建议**
   - 推荐决策
   - 决策依据
   - 风险缓解
   - 行动计划

## 📊 输出格式

```markdown
## 🎯 多模型共识决策报告

**决策问题**: [用户问题]

---

### 🤖 Gemini 观点 (架构视角)

**立场**: [支持/反对/有条件支持]

**核心论据**:
- [论据1]
- [论据2]
- [论据3]

**详细分析**:
[Gemini 的完整观点]

---

### 💻 Codex 观点 (代码视角)

**立场**: [支持/反对/有条件支持]

**核心论据**:
- [论据1]
- [论据2]
- [论据3]

**详细分析**:
[Codex 的完整观点]

---

### 🎯 Claude 综合决策

#### 观点对比

| 维度 | Gemini | Codex | 一致性 |
|------|--------|-------|--------|
| 立场 | [立场] | [立场] | ✅/⚠️ |
| 核心关注 | [关注点] | [关注点] | - |
| 主要风险 | [风险] | [风险] | - |

#### 共识点

✅ 两个模型都认可：
- [共识1]
- [共识2]

#### 分歧点

⚠️ **分歧1**: [描述]
- Gemini: [观点A]
- Codex: [观点B]
- 分析: [为什么有分歧，哪个更合理]

#### 最终建议

**决策**: [推荐 / 不推荐 / 有条件推荐]

**理由**:
1. [理由1]
2. [理由2]
3. [理由3]

**行动计划**:
- [ ] 步骤1
- [ ] 步骤2
- [ ] 步骤3

**风险缓解**:
- 风险1 → 缓解措施
- 风险2 → 缓解措施

---

**📅 决策时间**: [时间戳]
**🤖 模型**: Gemini (架构专家) + Codex (代码专家) + Claude (综合)
```

## 🔄 上下文延续

### Gemini 会话延续

**使用 gemp 进行多轮共识**:

```bash
# 第一次调用
cat > /tmp/gemini_consensus1.txt << 'PROMPT_EOF'
分析技术方案A
PROMPT_EOF
cat /tmp/gemini_consensus1.txt | node ~/.gemini/long_task_runner.js 2>&1

# 后续调用 - 深入分析
cat > /tmp/gemini_consensus2.txt << 'PROMPT_EOF'
深入分析第3点
PROMPT_EOF
cat /tmp/gemini_consensus2.txt | node ~/.gemini/long_task_runner.js 2>&1
```

**备用方案** (gemini CLI 多轮):
```bash
gemini -p "分析技术方案A" --yolo
gemini -p "深入分析第3点" --resume latest --yolo
```

### Codex 会话延续

```bash
# Codex 也支持 resume
codex resume --last
```

**注意**: 每个决策问题建议开启新会话，避免上下文混淆。

## 🎓 使用示例

### 示例 1: 技术选型决策

**输入**:
```
consensus 分析：我们应该用 GraphQL 还是 REST API？
```

**流程**:
1. Gemini: 从架构角度分析 GraphQL vs REST
2. Codex: 从代码复杂度、测试难度分析
3. Claude: 综合两个观点，给出推荐

### 示例 2: 架构设计决策

**输入**:
```
多模型共识：单体架构重构为微服务是否合理？
团队规模20人，当前单体应用20万行代码。
```

**流程**:
1. Gemini: 分析微服务化的架构收益和复杂度
2. Codex: 分析代码拆分难度、测试成本
3. Claude: 考虑团队规模，给出分阶段建议

### 示例 3: 性能优化决策

**输入**:
```
consensus：是否应该引入 Redis 缓存层？
当前 QPS 5000，数据库 CPU 占用 60%。
```

**流程**:
1. Gemini: 分析缓存层的架构影响
2. Codex: 分析缓存实现复杂度
3. Claude: 给出量化的收益预期和实施建议

## ⚠️ 错误处理

### CLI 调用失败

**Gemini 失败**:
- 降级为 Codex + Claude 双模型决策

**Codex 失败**:
- 降级为 Gemini + Claude 双模型决策

**都失败**:
- Claude 单模型深度分析

### 超时处理

使用 Python timeout 控制：

```bash
python3 -c "
import subprocess, sys
try:
    result = subprocess.run(
        ['gemini', '-p', '...', '--yolo'],
        capture_output=True,
        text=True,
        timeout=180  # 3 分钟
    )
    print(result.stdout)
except subprocess.TimeoutExpired:
    print('TIMEOUT', file=sys.stderr)
    sys.exit(1)
"
```

## 🆚 vs PAL MCP Consensus

| 特性 | PAL MCP | Direct CLI Skill |
|------|---------|-----------------|
| 超时问题 | ❌ 容易超时 | ✅ 不会超时 |
| 上下文延续 | ✅ continuation_id | ✅ --resume |
| 调试难度 | ❌ MCP 黑盒 | ✅ 直接看输出 |
| 维护成本 | ❌ 需要 MCP Server | ✅ 零维护 |
| 模型选择 | ✅ 灵活配置 | ✅ 直接指定 |

---

**创建时间**: 2025-12-19
**版本**: v1.0
**替代**: PAL MCP consensus 工具
