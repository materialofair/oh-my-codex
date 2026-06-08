# Draw.io Diagramming Skill

**版本**: 1.0.0
**最后更新**: 2025-10-21
**作者**: SuperClaude System

---

## 📋 文档导航

| 文档 | 说明 | 适用场景 |
|------|------|---------|
| **[SKILL.md](./SKILL.md)** | 完整技能文档 | 了解所有功能和工具 |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | 浏览器扩展安装 | 首次安装和配置 |
| **[EXAMPLES.md](./EXAMPLES.md)** | 实用案例集 | 学习和参考实现 |
| **README.md** | 快速入门指南 | 你正在阅读 |

---

## 🚀 快速开始（3步）

### Step 1: 安装浏览器扩展

**必需步骤** - 没有扩展MCP无法工作！

#### Chrome
1. 打开 [Chrome Web Store](https://chrome.google.com/webstore)
2. 搜索 "Draw.io MCP Extension"
3. 点击 "Add to Chrome"

#### Firefox
1. 打开 [Firefox Add-ons](https://addons.mozilla.org)
2. 搜索 "Draw.io MCP Extension"
3. 点击 "Add to Firefox"

**验证**: 打开 https://app.diagrams.net，扩展图标应显示**绿色**

详细说明 → [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

### Step 2: 验证MCP连接

```bash
# 检查MCP服务器状态
codex mcp list

# 期望输出：
# drawio: npx -y drawio-mcp-server - ✓ Connected
```

**如果显示 ✗ Failed**:
- 确保Draw.io网页已打开
- 确保扩展显示绿色
- 重启 Codex 会话

---

### Step 3: 开始使用

在 Codex 中测试：

```
"在Draw.io中创建一个简单的架构图，包含API Gateway、2个服务和数据库"
```

如果工具正常响应，说明安装成功！🎉

---

## 🎯 核心功能

### 1️⃣ 程序化绘图

```yaml
自动创建图形:
  - 矩形、圆形、连线、图标
  - 设置位置、尺寸、颜色、文本
  - 批量创建复杂布局

适用场景:
  ✓ 系统架构图
  ✓ 流程图
  ✓ ER图
  ✓ UML图
```

### 2️⃣ 智能分析

```yaml
查询图表信息:
  - 获取所有图形和连线
  - 查询特定元素属性
  - 浏览形状库

适用场景:
  ✓ 图表审计
  ✓ 元素统计
  ✓ 样式分析
```

### 3️⃣ 动态修改

```yaml
修改现有图表:
  - 添加新元素
  - 删除指定元素
  - 更新样式和文本

适用场景:
  ✓ 图表更新
  ✓ 迭代优化
  ✓ 版本演进
```

---

## 💡 典型使用场景

### 场景1: 微服务架构文档

```
"为我的电商项目生成微服务架构图：
- API Gateway在顶部
- 订单、商品、用户服务在中层
- 各自的数据库在底层
- 使用专业的蓝色配色"
```

→ 参考 [EXAMPLES.md - 案例1](./EXAMPLES.md#案例1-微服务架构图)

### 场景2: AWS云架构设计

```
"创建AWS Serverless架构图：
- S3托管前端
- API Gateway + Lambda
- DynamoDB数据库
- 使用AWS官方图标和配色"
```

→ 参考 [EXAMPLES.md - 案例2](./EXAMPLES.md#案例2-aws云架构图)

### 场景3: 业务流程可视化

```
"绘制订单处理流程图：
开始 → 检查库存 → 判断 → 支付 → 发货 → 结束
包含判断节点和异常流程"
```

→ 参考 [EXAMPLES.md - 案例4](./EXAMPLES.md#案例4-业务流程图)

---

## 🛠️ 可用工具速查

| 工具名称 | 功能 | 示例 |
|---------|------|------|
| `add-rectangle` | 创建矩形 | "添加蓝色矩形，文本为API" |
| `add-edge` | 连接图形 | "连接API和数据库" |
| `add-cell-of-shape` | 添加特定形状 | "添加AWS Lambda图标" |
| `delete-cell-by-id` | 删除元素 | "删除ID为cell-1的图形" |
| `get-shape-categories` | 查看形状分类 | "列出所有可用形状类别" |
| `get-shapes-in-category` | 查看类别中的形状 | "显示AWS类别的所有图标" |
| `list-paged-model` | 查看所有元素 | "显示图表中的所有元素" |

完整工具列表 → [SKILL.md - 可用工具](./SKILL.md#可用工具-9个)

---

## 🎨 样式模板速查

### 现代蓝色系（推荐）

```javascript
// 主要组件
fillColor=#1976d2;strokeColor=#0d47a1;fontColor=#ffffff;rounded=1;

// 次要组件
fillColor=#42a5f5;strokeColor=#1976d2;fontColor=#ffffff;rounded=1;

// 强调元素
fillColor=#ff9800;strokeColor=#e65100;fontColor=#ffffff;rounded=1;
```

### AWS官方配色

```javascript
// Lambda: fillColor=#FF9900;strokeColor=#232F3E;fontColor=#FFFFFF;
// S3:     fillColor=#569A31;strokeColor=#232F3E;fontColor=#FFFFFF;
// RDS:    fillColor=#2E73B8;strokeColor=#232F3E;fontColor=#FFFFFF;
```

更多样式 → [EXAMPLES.md - 通用样式模板](./EXAMPLES.md#通用样式模板)

---

## 🔧 故障排查

### ❌ MCP连接失败

**症状**: `codex mcp list` 显示 `✗ Failed to connect`

**解决方案**:
1. 打开 https://app.diagrams.net
2. 检查扩展图标是否为绿色
3. 刷新页面（F5）
4. 重启 Codex 会话

详细排查 → [SETUP_GUIDE.md - 故障排查](./SETUP_GUIDE.md#故障排查)

---

### ❌ 工具无响应

**症状**: 调用工具后没有反应

**解决方案**:
1. 确保Draw.io标签页在前台
2. 检查坐标是否在可见范围（建议从50,50开始）
3. 验证命令格式是否正确

详细排查 → [SKILL.md - 故障排查](./SKILL.md#故障排查)

---

## 📚 学习路径

### 🔰 新手入门

1. 阅读 [SETUP_GUIDE.md](./SETUP_GUIDE.md) 完成安装
2. 尝试创建简单矩形：`"在Draw.io中创建一个矩形"`
3. 尝试连接两个图形
4. 学习基础样式设置

### 🎓 进阶学习

1. 阅读 [EXAMPLES.md](./EXAMPLES.md) 中的案例
2. 参考样式模板自定义配色
3. 尝试创建完整的架构图
4. 学习批量创建和布局规划

### 🚀 高级应用

1. 阅读 [SKILL.md](./SKILL.md) 的最佳实践部分
2. 集成到项目文档工作流
3. 自动化架构图生成
4. 版本控制和图表演进

---

## 🎯 最佳实践

### ✅ Do（推荐）

- ✓ 保持Draw.io标签页在前台
- ✓ 使用网格系统规划坐标（100的倍数）
- ✓ 统一配色方案（选择一套样式模板）
- ✓ 增量式构建（先核心，再扩展）
- ✓ 有意义的元素命名（api-gateway, not cell-1）

### ❌ Don't（避免）

- ✗ 一次性生成超大图表
- ✗ 随意放置坐标（难以维护）
- ✗ 混用多种配色风格
- ✗ 忘记保存Draw.io文件
- ✗ 在扩展未连接时调用工具

---

## 🌟 核心价值

| 价值点 | 说明 | 收益 |
|--------|------|------|
| **自动化** | AI生成架构图 | 节省80%绘图时间 |
| **一致性** | 统一样式和布局 | 提升文档专业性 |
| **可维护** | 代码化的图表 | 易于版本控制 |
| **智能化** | AI理解项目结构 | 自动优化布局 |
| **集成化** | 与代码库同步 | 文档实时更新 |

---

## 🔗 相关资源

- **Draw.io官网**: https://app.diagrams.net
- **MCP服务器GitHub**: https://github.com/lgazo/drawio-mcp-server
- **Draw.io文档**: https://www.drawio.com/doc/
- **Codex 使用指南**: `docs/CODEX.md`

---

## 📞 支持

遇到问题？

1. 查看 [SETUP_GUIDE.md - 故障排查](./SETUP_GUIDE.md#故障排查)
2. 查看 [SKILL.md - 故障排查](./SKILL.md#故障排查)
3. 检查GitHub Issues: https://github.com/lgazo/drawio-mcp-server/issues

---

## 📄 更新日志

### v1.0.0 (2025-10-21)
- ✨ 初始版本
- 📝 完整文档集（SKILL.md, SETUP_GUIDE.md, EXAMPLES.md）
- 🎯 5个实用案例
- 🎨 3套样式模板
- 🛠️ 9个核心工具

---

**💡 快速开始提示**: 现在就打开 https://app.diagrams.net 并安装扩展，开始你的第一个AI生成架构图！
