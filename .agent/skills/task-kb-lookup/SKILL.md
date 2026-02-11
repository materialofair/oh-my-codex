---
name: Task KB Lookup
description: Query Agent-KB for reference examples and proven approaches before executing development tasks. Learn from past experiences.
---

# Task KB Lookup - 任务前查询知识库

## When to Use This Skill

**Automatically invoke before**:
- Implementing new features or components
- Refactoring existing code
- Performance optimization tasks
- Architecture design decisions
- Debugging complex issues
- Code quality improvements

**Trigger keywords**:
- "实现"、"开发"、"构建"、"创建"
- "重构"、"优化"、"改进"
- "设计"、"架构"、"方案"
- "修复"、"解决"、"调试"

## What This Skill Does

在执行任务**前**，从Agent-KB中检索相似的历史案例，提供：
1. **成功经验** - 过往任务的有效解决方案
2. **避坑指南** - 已知问题和失败教训
3. **性能指标** - 预期的时间、资源消耗
4. **最佳实践** - 经过验证的实施策略

## Instructions

### Step 1: 识别任务类型

当检测到开发任务时，先分析任务类型：

```yaml
任务类型分类:
  - 功能实现: "实现XX功能"
  - 性能优化: "优化XX性能"
  - 架构设计: "设计XX架构"
  - 代码重构: "重构XX模块"
  - 问题修复: "修复XX问题"
```

### Step 2: 查询相似案例

执行Agent-KB查询，获取参考样例：

```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "任务描述关键词"
```

**查询策略**:
- 提取任务的核心关键词（技术栈、问题域、优化目标）
- 查询相似场景的历史经验
- 优先检索最近3个月的案例

### Step 3: 展示参考样例

格式化输出查询结果：

```markdown
## 📚 相似任务参考案例

**当前任务**: [用户的任务描述]

### 🎯 历史成功案例

[从KB检索到的相似案例]

**解决方案**:
- [关键实施步骤]
- [使用的技术和工具]
- [实测效果和指标]

### ⚠️ 已知风险点

[历史案例中遇到的问题]

**规避策略**:
- [如何避免相同错误]
- [边界条件检查]
- [性能陷阱预警]

### 📊 预期指标

根据历史案例，预期：
- 开发时间: [X小时/天]
- 代码行数: [约X行]
- 性能提升: [+X%]
- 测试覆盖率: [X%]

### 💡 建议执行路径

基于历史经验，推荐：
1. [第一步: ...]
2. [第二步: ...]
3. [第三步: ...]

---
**参考来源**: Agent-KB历史案例库
**信心等级**: [高/中/低] - 基于案例相似度
```

### Step 4: 确认执行计划

询问用户：
- "是否采用建议的执行路径？"
- "需要我详细解释某个步骤吗？"
- "是否需要查看更多相关案例？"

## Examples

### Example 1: 功能实现任务

**User**: "实现一个React虚拟滚动列表组件"

**You execute**:
```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "React虚拟滚动 列表优化 大数据渲染"
```

**You present**:
- 历史案例中成功的虚拟滚动实现
- 使用react-window vs react-virtualized的经验对比
- 预期开发时间: 4-6小时
- 关键性能指标: 10000+条目渲染<100ms
- 避坑点: 动态高度处理、滚动位置保持

### Example 2: 性能优化任务

**User**: "优化Node.js API响应速度，目前500ms"

**You execute**:
```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "Node.js API性能优化 响应时间 数据库查询"
```

**You present**:
- 历史案例: 类似API优化从500ms → 80ms的经验
- 常见瓶颈: 数据库N+1查询、缺少索引、同步IO
- 优化策略优先级: 1) 数据库查询优化 2) 缓存 3) 代码优化
- 预期效果: 响应时间减少60-80%

### Example 3: 架构设计任务

**User**: "设计一个多租户SaaS系统的数据隔离方案"

**You execute**:
```bash
python /Users/WangQiao/Agent-KB/intelligent_summarizer.py "多租户 数据隔离 SaaS架构"
```

**You present**:
- 历史案例: 3种多租户隔离方案对比
  - 共享库共享表 + tenant_id (简单，成本低)
  - 共享库独立表 (中等复杂度)
  - 独立数据库 (最安全，成本高)
- 选择策略: 基于租户数量、数据安全等级、成本预算
- 避坑点: 索引设计、查询性能、数据迁移复杂度

## Integration with Task Execution

**工作流程**:
```yaml
1. 用户提出任务
   ↓
2. [自动] 触发 task-kb-lookup skill
   ↓
3. 展示相似案例和建议方案
   ↓
4. 用户确认/调整执行计划
   ↓
5. Codex执行任务
   ↓
6. [自动] 触发 task-kb-record skill (记录结果)
```

## Performance Notes

- **查询速度**: 0.001s (缓存命中), 8s (首次查询)
- **案例相似度**: 基于语义搜索，准确率>85%
- **建议采纳率**: 历史数据显示，使用KB参考的任务成功率提升40%
- **时间节省**: 平均节省30-50%的调研和试错时间

## Fallback Strategy

如果没有找到相似案例：
1. 降级为通用最佳实践查询
2. 查询相关技术栈的通用经验
3. 提醒用户这是新场景，任务完成后需要详细记录经验

## Important Notes

- **主动查询**: 检测到任务时自动触发，不等用户要求
- **透明度**: 明确告知是基于历史案例的建议
- **灵活性**: 允许用户选择不同于建议的方案
- **记录意识**: 提醒用户任务完成后记录到KB（触发task-kb-record）

## Integration with Other Skills

- **agent-kb**: 查询通用技术经验
- **task-kb-lookup**: 查询相似任务案例（本skill）
- **task-kb-record**: 记录任务执行结果（配对skill）
- **quality-check**: 任务完成后的质量验证

---

**💡 核心价值**: 让每个任务都站在过往经验的肩膀上，减少重复踩坑，提升执行效率！
