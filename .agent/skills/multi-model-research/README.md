# Multi-Model Research Skill - 使用指南

## 🎯 这是什么？

一个**直接调用 Gemini/Codex CLI** 的 Skill，**完全绕过 PAL MCP**，解决超时问题。

## ✅ 优势对比

| 问题 | PAL MCP 方案 | Direct CLI Skill |
|------|-------------|-----------------|
| 超时问题 | ❌ 经常超时 | ✅ 不会超时 |
| 调试难度 | ❌ MCP 黑盒 | ✅ 直接看输出 |
| 维护成本 | ❌ 需要 MCP Server | ✅ 零维护 |
| OAuth 支持 | ❌ 需要配置 | ✅ 原生支持 |

## 🚀 快速开始

### 方式 1: 自动触发 (推荐)

只需要说包含这些关键词的话：

```
多模型调研 React vs Vue 性能对比
```

```
技术选型分析：应该用 MongoDB 还是 PostgreSQL？
```

```
架构决策：如何设计支持 10 万并发的系统？
```

### 方式 2: 手动触发

```
使用 multi-model-research 分析：<你的问题>
```

## 📊 它会做什么？

1. **Gemini 架构分析** (1M 上下文视角)
   - 架构设计合理性
   - 可扩展性和性能
   - 技术风险评估
   - 优化建议

2. **Codex 代码评估** (GPT-5 视角)
   - 代码最佳实践
   - 性能优化建议
   - 安全风险防护
   - 可维护性分析

3. **Claude 综合决策**
   - 对比两个模型的观点
   - 识别共识和分歧
   - 综合给出最终建议
   - 分步行动计划

## 🎓 使用示例

### 示例 1: 技术选型

**输入**:
```
多模型调研：前端框架选 React、Vue 还是 Svelte？
团队熟悉 React，但听说 Svelte 性能更好。
```

**输出**:
- Gemini: 分析三个框架的生态、长期维护、可扩展性
- Codex: 对比开发效率、性能测试、代码示例
- Claude: 根据你的团队情况推荐最合适的

### 示例 2: 架构设计

**输入**:
```
技术选型分析：实时聊天系统用 WebSocket 还是 SSE？
需要支持 10 万并发用户。
```

**输出**:
- Gemini: 架构层面对比可扩展性、资源消耗、集群部署
- Codex: 代码层面给出实现示例、性能测试
- Claude: 综合推荐方案 + 实施步骤

### 示例 3: 性能优化

**输入**:
```
多模型调研：React 应用首屏加载 5 秒，如何优化到 1 秒？
```

**输出**:
- Gemini: SSR、代码分割、CDN、缓存策略
- Codex: 懒加载、Tree Shaking、压缩技巧
- Claude: 分步优化计划 (优先级 + 预期收益)

## ⚠️ 故障排除

### Gemini CLI 调用失败

**错误信息**: "Failed to load API key" 或 OAuth 过期

**解决方法**:
```bash
# 在终端重新登录
gemini
```

### Codex CLI 调用失败

**错误信息**: "Command not found" 或 API 限流

**解决方法**:
```bash
# 检查 Codex 是否安装
which codex

# 如果未安装，安装 Codex CLI
npm install -g @openai/codex-cli
```

### 降级策略

如果某个 CLI 失败，Skill 会**自动降级**：
- Gemini 失败 → Codex + Claude 双模型
- Codex 失败 → Gemini + Claude 双模型
- 都失败 → Claude 单模型深度分析

## 🔧 高级用法

### 带文件分析

```
使用 multi-model-research 分析 src/api/auth.ts 的安全问题
```

### 深入某个维度

```
深入 Gemini 关于可扩展性的分析
```

### 对比两个方案

```
多模型调研对比：
方案 A: 微服务架构
方案 B: 单体架构
```

## 📈 性能数据

**典型调研时间**:
- Gemini 分析: 30-60 秒
- Codex 分析: 20-40 秒
- Claude 综合: 10-20 秒
- **总计**: 1-2 分钟

**vs PAL MCP**:
- PAL MCP: 经常超时 (>2 分钟限制)
- Direct CLI: 从未超时 (可设 5+ 分钟)

## 🆚 什么时候用 PAL MCP？

**用 Direct CLI Skill** (本 skill) 的场景:
- ✅ 一次性深度调研
- ✅ 技术选型决策
- ✅ 架构设计分析
- ✅ 对超时敏感的任务

**用 PAL MCP** 的场景:
- ✅ 多轮交互式对话 (需要上下文传递)
- ✅ 需要 continuation_id 的场景
- ✅ 企业级特性 (统一日志、限流)

## 📝 技术细节

### 为什么绕过 MCP？

```
旧方案 (超时):
  Claude Code → PAL MCP Tool → Gemini/Codex CLI
                ↑ 这里有 2 分钟超时限制

新方案 (无超时):
  Claude Code → Skill → Bash → Gemini/Codex CLI
                        ↑ 可以设置 5+ 分钟超时
```

### CLI 输出处理

**Gemini** (优先使用 gemp):
```bash
# 优先方案: gemp (20分钟超时，输出纯净)
cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
你的问题内容
PROMPT_EOF
cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1

# 备用方案: gemini CLI
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP\|YOLO\|Load"
```

**Codex**:
```bash
# 使用临时文件方式调用
cat > /tmp/codex_prompt.txt << 'PROMPT_EOF'
你的问题内容
PROMPT_EOF
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox - 2>&1
```

## 🎉 总结

这个 Skill 让你可以：
- ✅ **真正的多模型协作** (Gemini + Codex + Claude)
- ✅ **无超时问题** (绕过 MCP 限制)
- ✅ **零维护成本** (不需要 MCP Server)
- ✅ **完全透明** (直接看 CLI 输出)

**立即尝试**:
```
多模型调研：技术选型问题
```

---

**文档版本**: v1.0  
**创建时间**: 2025-12-19  
**Skill 位置**: `/Users/WangQiao/.claude/skills/multi-model-research/skill.md`
