---
name: multi-model-research
description: 直接调用 Gemini/Codex CLI 进行多模型技术调研，绕过 MCP 避免超时。使用 OAuth 认证，零维护成本，完全控制输入输出。
auto_invoke: true
tags: [research, multi-model, direct-cli, no-timeout, gemini, codex]
version: 0.1.0
source: fork
checksum: e4316c36540ea0a514f10f3591653eb46dfc1e6f110b4cbb0b11f499abce33d1
updated_at: 2026-02-06T15:19:11+08:00
intent: research
layer: research
---


# Multi-Model Research Skill (Direct CLI - No MCP)

## 🎯 核心优势

- ✅ **无超时问题**: 绕过 PAL MCP，直接 Bash 调用 CLI
- ✅ **使用 OAuth**: Gemini 用账号登录，无需配置 API Key
- ✅ **零维护成本**: 不需要运行 MCP Server
- ✅ **易于调试**: 直接看 CLI 输出，复制命令就能测试
- ✅ **完全控制**: 自定义参数、格式、超时时间
- ✅ **真正的多模型**: Gemini (1M 上下文) + Codex (GPT-5) + Claude

## 📋 触发场景

**自动触发条件** (用户说以下关键词时):
- "多模型调研"
- "技术选型分析"
- "架构决策"
- "用 Gemini 和 Codex 分析"
- "多 AI 协作研究"
- "对比不同模型的观点"

**手动触发**:
```
使用 multi-model-research 分析 <你的问题>
```

## 🔄 Workflow

### Step 1: 准备和验证

**Your Task**:
1. 收集用户的完整问题
2. 整理成清晰的提示词
3. 确认需要分析的维度 (架构/代码/性能等)

**输出给用户**:
```
📊 启动多模型技术调研

**调研主题**: [用户问题]

**调研模型**:
- 🤖 Gemini (架构分析, 1M 上下文)
- 💻 Codex (代码评估, GPT-5)
- 🧠 Claude (综合决策)

**预计时间**: 2-3 分钟

开始调研...
```

### Step 2: Gemini 架构深度分析

**⚠️ 重要: 优先使用 `gemp` (长任务优化版)，`gemini` CLI 作为备用**

**执行命令** (两步):
```bash
# Step 1: 写入 prompt 到临时文件
cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
你是一位资深架构专家，拥有 20 年大型系统设计经验。

请深度分析以下技术方案：

【用户问题】
<INSERT_USER_QUESTION_HERE>

分析要求：
1. **架构设计合理性**
   - 评估整体架构选择
   - 分析组件职责划分
   - 检查依赖关系设计

2. **可扩展性和性能**
   - 横向扩展能力
   - 性能瓶颈预测
   - 资源利用效率

3. **技术风险评估**
   - 潜在技术债务
   - 维护成本预估
   - 迁移和升级难度

4. **优化建议**
   - 具体改进方向
   - 替代方案对比
   - 量化收益预期

输出格式：
- 使用 Markdown
- 给出具体理由和数据
- 标注优先级 (高/中/低)
- 给出关键决策点
PROMPT_EOF

# Step 2: 优先使用 gemp (长任务优化，20分钟超时，Vertex AI)
cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
```

**备用方案** (如果 gemp 失败):
```bash
# 使用标准 gemini CLI 作为备用
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP\|YOLO\|Load"
```

**gemp vs gemini CLI 对比**:
| 特性 | gemp | gemini CLI |
|------|------|-----------|
| 超时 | 20 分钟 | 约 2-3 分钟 |
| 启动速度 | 快 (直接 API) | 慢 (加载插件) |
| 输出格式 | 纯净 | 有启动日志 |
| 适用场景 | 长任务/复杂分析 | 简单查询 |

**Your Task**:
1. 执行 Gemini CLI 命令
2. 过滤掉启动日志和错误信息
3. 提取 Gemini 的实际分析内容
4. 整理成结构化格式

**展示给用户**:
```
✅ Gemini 分析完成

#### 🤖 Gemini 架构分析 (1M 上下文视角)

[Gemini 的完整分析内容]

---
继续 Codex 代码评估...
```

### Step 3: Codex 代码质量评估

**⚠️ 重要: Codex 必须使用临时文件方式调用 (避免 shell 转义问题)**

**执行命令** (两步):
```bash
# Step 1: 写入 prompt 到临时文件
cat > /tmp/codex_prompt.txt << 'PROMPT_EOF'
你是一位资深代码审查专家，专注于代码质量、安全和最佳实践。

请评估以下技术方案：

【用户问题】
<INSERT_USER_QUESTION_HERE>

评估要求：
1. **代码实现最佳实践**
   - 推荐的实现模式
   - 常用库和框架选择
   - 代码组织结构

2. **性能优化建议**
   - 性能关键路径
   - 优化技巧和示例
   - 性能测试建议

3. **安全风险防护**
   - 常见安全漏洞
   - 防护措施和代码示例
   - 安全最佳实践

4. **可维护性分析**
   - 代码可读性要求
   - 测试策略建议
   - 文档和注释规范

输出格式：
- 使用 Markdown
- 包含具体代码示例
- 标注常见陷阱
- 给出改进建议
PROMPT_EOF

# Step 2: 使用管道从 stdin 读取 prompt (使用 - 参数)
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox -o /tmp/codex_output.txt - 2>&1 && cat /tmp/codex_output.txt
```

**简化版 (单行)**:
```bash
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox - 2>&1 | head -500
```

**Your Task**:
1. 执行 Codex CLI 命令
2. 解析 JSONL 输出
3. 提取 Codex 的分析内容
4. 整理成结构化格式

**展示给用户**:
```
✅ Codex 分析完成

#### 💻 Codex 代码评估 (GPT-5 视角)

[Codex 的完整分析内容]

---
进行综合决策...
```

### Step 4: Claude 综合决策

**Your Task**:
1. 对比 Gemini 和 Codex 的观点
2. 识别共识点和分歧点
3. 分析各自的独特洞察
4. 综合给出最终建议

**分析维度**:

1. **共识点识别**
   - 两个模型都强调的观点
   - 高度一致的建议
   - 关键的技术决策

2. **分歧点分析**
   - Gemini 的架构视角 vs Codex 的代码视角
   - 不同的优先级排序
   - 互补的建议

3. **独特洞察**
   - Gemini 独有的架构见解 (得益于 1M 上下文)
   - Codex 独有的代码实践 (得益于 GPT-5 能力)

4. **最终决策**
   - 综合推荐方案
   - 决策依据和理由
   - 分步行动计划
   - 风险缓解措施

**展示给用户**:
```
✅ 综合分析完成

---

## 📊 多模型技术调研报告

**调研主题**: [用户问题]

---

### 🤖 Gemini 深度分析 (架构视角, 1M 上下文)

**核心观点**:
- [关键点1]
- [关键点2]
- [关键点3]

**详细分析**:
[Gemini 的完整内容]

**架构优势**: [...]
**潜在风险**: [...]
**优化建议**: [...]

---

### 💻 Codex 质量评估 (代码视角, GPT-5)

**核心观点**:
- [关键点1]
- [关键点2]
- [关键点3]

**详细分析**:
[Codex 的完整内容]

**最佳实践**: [...]
**常见陷阱**: [...]
**性能优化**: [...]

---

### 🎯 Claude 综合决策

#### ✅ 共识点

两个模型都强调：
- [共识1]
- [共识2]
- [共识3]

#### ⚠️ 分歧点

| 维度 | Gemini 观点 | Codex 观点 | 分析 |
|------|------------|-----------|------|
| [维度1] | [观点A] | [观点B] | [为什么有分歧，哪个更合理] |
| [维度2] | [观点A] | [观点B] | [分析] |

#### 💡 互补洞察

**Gemini 独特视角** (架构层面):
- [洞察1]
- [洞察2]

**Codex 独特视角** (代码层面):
- [洞察1]
- [洞察2]

#### 🚀 最终建议

**1. 推荐方案**:
[综合推荐的技术方案]

**2. 决策依据**:
- 理由1: [...]
- 理由2: [...]
- 理由3: [...]

**3. 行动步骤**:
- [ ] 步骤1: [具体行动]
- [ ] 步骤2: [具体行动]
- [ ] 步骤3: [具体行动]

**4. 风险缓解**:
- 风险1: [描述] → 缓解: [措施]
- 风险2: [描述] → 缓解: [措施]

**5. 关键决策点**:
- 决策点1: [需要确认的问题]
- 决策点2: [需要确认的问题]

---

**📅 调研时间**: [时间戳]  
**🤖 模型版本**: Gemini (OAuth 登录), Codex (GPT-5), Claude (Sonnet 4.5)  
**⏱️ 总耗时**: [X 分钟]

---

## 📌 下一步建议

1. **如需深入某个方向**: 告诉我你想深入哪个模型的观点
2. **如需具体代码示例**: 我可以基于建议生成实现代码
3. **如需技术验证**: 我可以帮你搭建 PoC 验证方案
```

## 🔧 错误处理和降级策略

### Gemini 调用失败

**检测** (优先 gemp，备用 gemini CLI):
```bash
# 优先使用 gemp
if ! echo "test" | node ~/.gemini/long_task_runner.js 2>&1 | grep -qv "error\|Error"; then
    echo "gemp 失败，尝试 gemini CLI 备用..."
    # 备用：gemini CLI
    if ! echo "test" | gemini --yolo 2>&1 | grep -qv "error\|Error"; then
        echo "Gemini 调用完全失败"
    fi
fi
```

**降级策略**:
1. gemp 失败 → 自动尝试 `gemini --yolo` 备用
2. 都失败 → 提示用户: "⚠️ Gemini 调用失败，降级为 Codex + Claude 双模型分析"
3. 在报告中说明原因

**常见原因**:
- OAuth 登录过期 → 提示: "请在终端运行 `gemini login` 重新登录"
- 网络问题 → 提示: "请检查网络连接"
- Project ID 问题 → 提示: "请运行 `gcloud config set project YOUR_PROJECT_ID`"

### Codex CLI 失败

**检测**:
```bash
if codex exec --json "test" 2>&1 | grep -q "error\|Error\|Command not found"; then
    echo "Codex CLI 失败"
fi
```

**降级策略**:
1. 提示用户: "⚠️ Codex CLI 调用失败，降级为 Gemini + Claude 双模型分析"
2. 只执行 Gemini 和 Claude 分析
3. 在报告中说明原因

**常见原因**:
- Codex 未安装 → 提示: "请安装 Codex CLI: npm install -g @openai/codex-cli"
- API 限流 → 提示: "Codex API 限流，请稍后重试"

### 两个 CLI 都失败

**降级策略**:
1. 提示用户: "⚠️ 外部模型调用失败，使用 Claude 单模型深度分析"
2. Claude 自己进行全面分析 (架构 + 代码)
3. 在报告中标注: "本次分析基于 Claude Sonnet 4.5 单模型"

### 超时处理

**Bash 层超时控制**:
```bash
# macOS 使用 gtimeout (需要 brew install coreutils)
gtimeout 300 gemini -p "..." --yolo 2>&1

# 或者使用 Python timeout
python3 -c "
import subprocess
import sys
try:
    result = subprocess.run(
        ['gemini', '-p', '...', '--yolo'],
        capture_output=True,
        text=True,
        timeout=300  # 5 分钟
    )
    print(result.stdout)
except subprocess.TimeoutExpired:
    print('TIMEOUT', file=sys.stderr)
    sys.exit(1)
"
```

**超时降级**:
- Gemini 超时 → 降级为 Codex + Claude
- Codex 超时 → 降级为 Gemini + Claude
- 都超时 → Claude 单模型分析

## 📊 性能对比

| 指标 | PAL MCP 方案 | Direct CLI Skill |
|------|-------------|-----------------|
| **超时概率** | ❌ 高 (MCP 层 2 分钟限制) | ✅ 低 (Bash 可设 5+ 分钟) |
| **响应速度** | 🐢 慢 (3 层封装) | 🚀 快 (直接调用) |
| **调试难度** | 😰 难 (MCP 黑盒) | 😊 易 (直接看输出) |
| **OAuth 支持** | ❌ 需要配置 | ✅ 原生支持 |
| **维护成本** | ⚠️ 需要 MCP Server | ✅ 零维护 (只是 markdown) |
| **灵活性** | ⚠️ 受限 MCP 接口 | ✅ 完全自由控制 |
| **上下文传递** | ✅ 自动 (continuation_id) | ❌ 需要手动 |
| **多轮对话** | ✅ 原生支持 | ❌ 需要自己实现 |

**总结**: Direct CLI Skill 适合**一次性深度调研**，PAL MCP 适合**多轮交互式对话**。

## 🎓 使用示例

### 示例 1: 技术选型

**用户输入**:
```
使用 multi-model-research 分析：
我们的项目需要选择前端框架，在 React、Vue、Svelte 之间犹豫。
考虑因素：团队熟悉度 (React 高)、性能要求 (实时数据更新)、学习成本。
```

**执行流程**:
1. Gemini: 从架构角度分析三个框架的生态、扩展性、长期维护
2. Codex: 从代码角度对比开发效率、性能优化、常见问题
3. Claude: 综合团队因素给出推荐 (可能推荐 React + 性能优化)

### 示例 2: 架构设计

**用户输入**:
```
使用 multi-model-research 分析：
设计一个支持 10 万并发的实时聊天系统，考虑使用 WebSocket 还是 Server-Sent Events？
```

**执行流程**:
1. Gemini: 架构层面对比两种方案的可扩展性、资源消耗、集群部署
2. Codex: 代码层面给出具体实现示例、性能测试、常见陷阱
3. Claude: 根据 10 万并发需求给出最终建议 (可能推荐 WebSocket + Redis Pub/Sub)

### 示例 3: 性能优化

**用户输入**:
```
使用 multi-model-research 分析：
我们的 React 应用首屏加载慢 (5 秒)，如何优化到 1 秒以内？
```

**执行流程**:
1. Gemini: 从架构角度分析 (SSR、代码分割、CDN、缓存策略)
2. Codex: 从代码角度给出具体优化技巧 (懒加载、Tree Shaking、压缩)
3. Claude: 综合给出分步优化计划 (优先级排序、预期收益)

## 💡 高级用法

### 带文件内容分析

**用户可以提供文件路径**:
```
使用 multi-model-research 分析 src/components/Dashboard.tsx 的性能问题
```

**Your Task**:
1. 先用 Read 工具读取文件内容
2. 将文件内容嵌入到 Gemini 和 Codex 的提示词中
3. 执行分析

### 对比两个方案

**用户提供两个方案**:
```
使用 multi-model-research 对比：
方案 A: 使用 MongoDB + Redis
方案 B: 使用 PostgreSQL + Redis
```

**Your Task**:
1. 让 Gemini 和 Codex 分别分析两个方案
2. 对比优劣势
3. Claude 给出推荐

### 增量调研

**如果用户对某个模型的观点有疑问**:
```
深入 Gemini 关于可扩展性的分析
```

**Your Task**:
1. 只调用 Gemini
2. 针对性深入分析特定维度
3. 给出更详细的建议

## 📝 Notes

1. **Gemini 启动日志**: 会有 "Failed to load API key" 等警告，这是正常的 (它会自动降级到 OAuth)
2. **Codex JSONL 格式**: 需要解析多行 JSON，每行一个事件
3. **超时设置**: 建议 Gemini 5 分钟，Codex 3 分钟 (Gemini 思考更久)
4. **输出过滤**: 过滤掉启动日志，只保留实际内容

## 🔗 相关资源

- Gemini CLI 文档: https://github.com/google/generative-ai-cli
- Codex CLI 文档: https://github.com/openai/codex-cli (内部工具)
- 对比 PAL MCP: `/Users/WangQiao/.claude/rules/ai-collaboration/zen-mcp.md`

---

**创建时间**: 2025-12-19  
**版本**: v1.0 完整版  
**作者**: Claude + User 协作设计
