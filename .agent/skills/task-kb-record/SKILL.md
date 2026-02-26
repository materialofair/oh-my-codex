---
name: Task KB Record
description: Record task execution results, metrics, lessons learned to Agent-KB. Builds organizational knowledge after completing significant tasks.
---

# Task KB Record - 任务后记录知识库

## When to Use This Skill

**Automatically invoke after**:
- Successfully completing a significant task
- Solving a complex problem
- Implementing a new feature or component
- Completing performance optimization
- Finishing code refactoring
- Resolving a difficult bug

**Trigger conditions**:
- Task marked as completed in TodoWrite
- Significant code changes committed
- Performance metrics measured
- User confirms task completion

## What This Skill Does

在任务**完成后**，将执行结果、指标和经验记录到Agent-KB：
1. **任务总结** - 问题描述、解决方案、实施步骤
2. **性能指标** - 实测数据、时间消耗、资源使用
3. **经验教训** - 成功经验、踩过的坑、避坑建议
4. **最佳实践** - 验证有效的方法和工具

## Instructions

### Environment Check (Run Once Per Environment)

```bash
# Project-local install
bash .codex/skills/task-kb-record/scripts/health-check.sh

# Global install
bash ~/.codex/skills/task-kb-record/scripts/health-check.sh
```

If using a non-default Agent-KB directory, set:

```bash
export AGENT_KB_HOME=/path/to/Agent-KB
```

### Step 1: 任务完成检测

当检测到以下信号时，主动提醒记录：

```yaml
自动触发条件:
  - TodoWrite中任务标记为completed
  - 用户说"完成了"、"搞定了"、"解决了"
  - Git提交包含"feat:", "fix:", "perf:"等标记
  - 性能测试完成并有明确指标
```

### Step 2: 收集任务信息

交互式收集以下信息：

```markdown
## 📝 任务记录收集

**我注意到你刚完成了一个任务，让我帮你记录到知识库以便未来参考。**

请提供以下信息（我会根据上下文预填充，你只需确认或修改）：

1️⃣ **任务描述** (必填)
   [自动提取: 从用户消息或TodoWrite中识别]

   例如: "实现React虚拟滚动列表组件，支持10000+条目流畅渲染"

2️⃣ **解决方案** (必填)
   [自动总结: 基于执行步骤]

   包括:
   - 使用的技术栈和工具
   - 核心实施步骤
   - 关键代码设计

3️⃣ **性能指标** (推荐)
   [自动提取: 从测试结果、性能数据]

   例如:
   - 开发时间: 实际耗时vs预期
   - 代码量: 修改行数/新增行数
   - 性能提升: 优化前后对比数据
   - 测试覆盖率: X%

4️⃣ **核心经验** (必填)
   [自动总结: 从执行过程中的关键决策]

   成功经验:
   - 什么方法特别有效？
   - 哪些决策是正确的？

   避坑指南:
   - 遇到了哪些问题？
   - 如何解决的？
   - 未来如何避免？

5️⃣ **相关技术** (自动提取)
   [标签: React, TypeScript, Performance等]
```

### Step 3: 智能预填充

Codex应基于任务上下文自动预填充大部分信息：

```python
# 自动提取策略
任务描述 → 从用户原始请求或TodoWrite任务名
解决方案 → 总结Codex执行的主要步骤和代码修改
性能指标 → 提取测试输出、benchmark结果、文件统计
核心经验 → 分析执行过程中的关键决策点
技术标签 → 识别使用的框架、库、工具
```

### Step 4: 写入知识库

使用快速存储模式写入Agent-KB：

```bash
python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/claude_kb_store.py \
  "任务描述" \
  "解决方案和实施步骤" \
  "核心经验和指标"
```

**存储格式**:
```json
{
  "question": "任务描述（作为未来查询的关键词）",
  "agent_planning": "解决方案的规划和实施步骤",
  "search_agent_planning": "如何查找类似问题的策略",
  "agent_experience": "核心经验、指标、避坑建议",
  "search_agent_experience": "相关技术和最佳实践参考"
}
```

### Step 5: 确认和反馈

记录完成后，提供反馈：

```markdown
✅ **任务经验已记录到Agent-KB**

📊 记录概要:
- 任务类型: [功能实现/性能优化/架构设计/...]
- 技术栈: [React, TypeScript, ...]
- 性能指标: [具体数据]
- 知识库条目数: [N+1]

🔍 未来查询此经验:
```bash
python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/intelligent_summarizer.py "任务关键词"
```

💡 此经验将帮助未来相似任务:
- 节省调研时间
- 避免重复踩坑
- 提供性能基准参考
```

## Examples

### Example 1: 功能实现任务完成

**Context**:
- User: "完成了React虚拟滚动列表"
- Claude已实现功能并测试通过

**You prompt**:
```
🎉 恭喜完成任务！让我帮你记录到知识库。

我已经根据执行过程预填充了以下信息，请确认：

【任务描述】
实现React虚拟滚动列表组件，支持10000+条目流畅渲染

【解决方案】
1. 使用react-window库（对比react-virtualized后选择）
2. 实现FixedSizeList组件，每项高度50px
3. 添加滚动位置保持逻辑
4. 优化re-render性能（React.memo + useMemo）

【性能指标】
- 开发时间: 5小时（预期4-6小时）
- 代码量: 新增180行
- 渲染性能: 10000条目首次渲染68ms（目标<100ms）
- 滚动FPS: 稳定60fps
- 内存占用: 减少85%（vs非虚拟化）

【核心经验】
成功经验:
- react-window比react-virtualized更轻量，bundle减少12KB
- 使用useMemo缓存item渲染函数，避免不必要的re-render
- 动态高度使用VariableSizeList，需要提供estimatedItemSize

避坑:
- 初始scrollToItem不生效，需要延迟到componentDidMount
- 快速滚动时图片闪烁，添加loading placeholder解决
- TypeScript类型定义需要安装@types/react-window

【技术标签】
React, TypeScript, Performance, Virtual Scrolling, react-window

---
确认无误吗？我将写入Agent-KB。
```

**User confirms**, then:
```bash
python3 ${AGENT_KB_HOME:-$HOME/Agent-KB}/claude_kb_store.py \
  "实现React虚拟滚动列表，支持10000+条目流畅渲染" \
  "使用react-window库，实现FixedSizeList组件，优化re-render性能，实测10000条目渲染68ms，滚动60fps" \
  "react-window比react-virtualized轻量12KB，useMemo避免不必要re-render，scrollToItem需延迟到mount，快速滚动需loading placeholder"
```

### Example 2: 性能优化任务完成

**Context**:
- Task: "优化API响应从500ms到<100ms"
- Result: 成功优化到78ms

**You prompt**:
```
🚀 性能优化任务完成！让我记录关键指标和经验。

【任务描述】
优化Node.js API响应速度，从500ms降低到<100ms

【解决方案】
1. 分析瓶颈: 80%时间在数据库查询
2. 优化措施:
   - 添加复合索引（user_id, created_at）
   - 修复N+1查询问题，使用JOIN替代循环查询
   - 添加Redis缓存，TTL=5分钟
   - 异步处理非关键日志写入

【性能指标】
- 优化前: 500ms (P50), 1200ms (P95)
- 优化后: 78ms (P50), 150ms (P95)
- 提升: 84%加速
- 数据库查询: 8次 → 2次
- 缓存命中率: 92%（监控一周数据）

【核心经验】
成功经验:
- 先profile定位瓶颈，再优化（避免过早优化）
- 复合索引设计遵循最左前缀原则
- Redis缓存需设置合理TTL，避免内存膨胀

避坑:
- 缓存失效策略要考虑数据更新场景
- JOIN查询注意索引覆盖，避免回表
- 监控缓存命中率，低于80%需重新评估策略

确认记录？
```

### Example 3: 问题修复任务完成

**Context**:
- Bug: "用户登录后偶现token过期"
- Root cause: 时区处理错误

**You prompt**:
```
🐛 Bug修复完成！这个问题很典型，值得记录。

【任务描述】
修复用户登录后偶现token过期问题，原因是时区处理错误

【解决方案】
1. 根因分析: 服务器UTC时间与前端本地时间比较导致
2. 修复方法:
   - 统一使用UTC时间戳存储和比较
   - JWT payload使用标准exp字段（UTC秒级时间戳）
   - 前端Date.now()返回UTC毫秒，除以1000对齐

【性能指标】
- 问题复现率: 20% → 0%（监控一周）
- 修复范围: 3个文件，15行代码
- 调试时间: 6小时（定位问题4小时，修复2小时）

【核心经验】
成功经验:
- 时间处理统一使用UTC，避免时区混乱
- JWT库自动处理exp验证，无需手动比较
- 添加单元测试覆盖时区边界条件

避坑:
- JavaScript Date对象默认本地时区，需要getTime()转UTC
- 服务端和客户端时间对齐，使用timestamp而非Date对象
- 跨时区场景必须有自动化测试覆盖

确认记录？
```

## Automation Features

### 智能提醒时机

```yaml
高优先级提醒（必须记录）:
  - 任务耗时 > 2小时
  - 性能提升 > 30%
  - 解决了复杂bug（调试 > 1小时）
  - 实现了新架构设计
  - 代码修改 > 200行

中优先级提醒（建议记录）:
  - 任务耗时 1-2小时
  - 使用了新技术栈
  - 有明确的指标对比

低优先级提醒（可选记录）:
  - 简单功能实现（<1小时）
  - 常规代码修改
```

### 自动数据提取

Codex应从以下来源自动提取信息：

```yaml
任务描述:
  - TodoWrite任务名称
  - 用户原始请求
  - Git commit message

解决方案:
  - Codex执行的代码修改
  - 使用的工具和命令
  - 关键决策点

性能指标:
  - 测试输出结果
  - Git diff统计
  - 时间戳计算（任务开始到完成）
  - 性能测试数据

技术标签:
  - 文件扩展名识别（.tsx → React+TS）
  - Import语句分析
  - package.json依赖
```

## Integration with Task Workflow

**完整工作流程**:

```yaml
阶段1 - 任务开始:
  1. 用户提出任务
  2. [自动] task-kb-lookup查询相似案例
  3. 展示参考样例和建议
  4. 用户确认执行计划

阶段2 - 任务执行:
  5. Codex执行任务
  6. [可选] 中途遇到问题查询agent-kb
  7. 完成功能实现和测试

阶段3 - 任务完成:
  8. [自动] task-kb-record提醒记录
  9. 智能预填充任务信息
  10. 用户确认后写入KB
  11. 知识库自动更新，未来任务受益
```

## Performance Notes

- **记录速度**: 1-2秒（包括备份）
- **存储格式**: JSON，支持语义搜索
- **自动备份**: 每次写入自动备份旧数据
- **缓存刷新**: 写入后清除缓存，确保最新数据可查询

## Best Practices

### 记录粒度

```yaml
✅ 值得记录:
  - 解决了具体问题的经验
  - 有明确性能数据的优化
  - 踩过坑并找到解决方案
  - 尝试了多种方案的对比

❌ 不必记录:
  - 纯文档查询（没有实际执行）
  - 简单的copy-paste修改
  - 无新增价值的常规操作
```

### 经验提炼

```yaml
好的经验记录:
  ✅ "使用react-window而非react-virtualized，bundle减少12KB，性能提升15%"
  ✅ "复合索引(user_id, created_at)将查询从500ms优化到78ms"
  ✅ "JWT时区问题：统一使用UTC时间戳，避免前后端时间对齐错误"

差的经验记录:
  ❌ "优化了性能"（没有具体数据）
  ❌ "修复了bug"（没有根因和解决方案）
  ❌ "使用了XXX库"（没有选择理由）
```

## Important Notes

- **主动提醒**: 任务完成时主动提醒记录，不等用户要求
- **智能预填**: 尽可能自动提取信息，减少用户负担
- **灵活确认**: 允许用户修改预填内容
- **即时反馈**: 写入成功后立即反馈，说明价值

## Fallback Strategy

如果用户拒绝记录或信息不完整：
1. 至少记录任务描述和技术标签（最小化记录）
2. 标记为"待补充"，提醒下次遇到相似任务时完善
3. 保存到临时文件，稍后可以恢复

---

**💡 核心价值**: 让每次任务都成为未来的参考案例，组织知识持续积累，团队能力螺旋上升！
