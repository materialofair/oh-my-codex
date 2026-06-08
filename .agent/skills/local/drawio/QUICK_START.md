# Draw.io Skill 快速开始指南

## 🎯 只需3步，立即使用！

---

## ✅ Step 1: 安装浏览器扩展（必需）

### Chrome用户（推荐）

**直接下载链接**:
👉 https://chromewebstore.google.com/detail/drawio-mcp-extension/okdbbjbbccdhhfaefmcmekalmmdjjide

**安装步骤**:
1. 点击上面的链接
2. 点击 "Add to Chrome" 按钮
3. 在弹出窗口中点击 "Add extension"
4. 等待安装完成（几秒钟）

---

### Firefox用户

**直接下载链接**:
👉 https://addons.mozilla.org/en-US/firefox/addon/drawio-mcp-extension/

**安装步骤**:
1. 点击上面的链接
2. 点击 "Add to Firefox" 按钮
3. 在弹出窗口中点击 "Add"
4. 等待安装完成

---

## ✅ Step 2: 验证扩展连接

### 1. 打开Draw.io网页

```bash
# macOS
open https://app.diagrams.net

# 或手动打开浏览器访问
https://app.diagrams.net
```

### 2. 检查扩展状态

- 查看浏览器工具栏中的扩展图标
- **绿色信号** ✅ = 连接正常（可以使用）
- **红色信号** ❌ = 连接失败（需要排查）

**如果是红色**:
1. 刷新页面（F5 或 ⌘+R）
2. 检查扩展是否已启用
3. 重启浏览器

---

## ✅ Step 3: 测试MCP连接

### 验证 Codex 连接

```bash
# 在终端运行
codex mcp list

# 预期输出：
# drawio: npx -y drawio-mcp-server - ✓ Connected
```

**如果显示 ✗ Failed to connect**:
1. 确保Draw.io网页标签页已打开
2. 确保扩展显示绿色连接状态
3. 重启 Codex 会话

### 测试基本功能

在 Codex 中输入：

```
"在Draw.io中创建一个简单的矩形，文本为'测试成功'"
```

如果Draw.io中出现了矩形，说明一切正常！🎉

---

## 🚀 开始创建你的第一个架构图

### 示例1: 简单的三层架构

```
在Draw.io中创建一个三层架构图：

1. 顶层：前端层（React App）
2. 中层：API层（Node.js Server）
3. 底层：数据层（PostgreSQL）

要求：
- 使用蓝色系配色
- 垂直布局
- 添加箭头连线
```

### 示例2: 微服务架构

```
创建电商微服务架构图：

组件：
- API Gateway（顶部）
- 订单服务、商品服务、用户服务（中层，水平排列）
- 各自的数据库（底层）

样式：
- 专业的蓝色配色
- 统一的圆角矩形
- 清晰的连接线
```

---

## 📚 下一步学习

### 🔰 新手推荐

1. **阅读基础功能**: [SKILL.md](./SKILL.md#可用工具-9个)
2. **学习样式模板**: [EXAMPLES.md](./EXAMPLES.md#通用样式模板)
3. **参考实用案例**: [EXAMPLES.md](./EXAMPLES.md#案例1-微服务架构图)

### 🎓 进阶学习

1. **最佳实践**: [SKILL.md](./SKILL.md#最佳实践)
2. **高级案例**: [EXAMPLES.md](./EXAMPLES.md#高级案例)
3. **故障排查**: [SETUP_GUIDE.md](./SETUP_GUIDE.md#故障排查)

---

## 💡 常用提示词模板

### 架构图生成

```
"创建[系统名称]的架构图：
- 组件：[列举主要组件]
- 布局：[垂直/水平/混合]
- 配色：[蓝色系/AWS风格/自定义]
- 连接：[数据流/调用关系/双向通信]"
```

### 流程图生成

```
"绘制[业务流程]流程图：
- 开始：[起点]
- 步骤：[列举主要步骤]
- 判断：[条件分支]
- 结束：[终点]
使用传统流程图符号"
```

### ER图生成

```
"创建[系统名称]的数据库ER图：
- 实体：[列举实体及其属性]
- 关系：[一对一/一对多/多对多]
- 主键/外键标注
使用UML类图风格"
```

---

## 🎯 核心提示

### ✅ 使用时的最佳实践

1. **保持Draw.io标签页打开** - MCP需要与网页通信
2. **使用清晰的描述** - AI能更好地理解你的意图
3. **增量式构建** - 先创建核心组件，再逐步完善
4. **统一样式** - 选择一套配色方案并保持一致

### ⚠️ 常见注意事项

1. **扩展必须显示绿色** - 否则MCP无法工作
2. **坐标从50开始** - 避免图形被遮挡
3. **保存图表** - Draw.io不会自动保存，记得手动保存
4. **网页在前台** - 切换到其他标签页可能导致通信失败

---

## 🔧 快速故障排查

| 问题 | 解决方案 |
|------|---------|
| 扩展图标是红色 | 刷新页面，重启浏览器 |
| MCP显示Failed | 打开Draw.io网页，确保扩展绿色 |
| 工具无响应 | 确保Draw.io标签页在前台 |
| 图形位置不对 | 使用更大的坐标值（从100开始） |
| 样式没生效 | 检查样式字符串格式是否正确 |

详细排查 → [SETUP_GUIDE.md - 故障排查](./SETUP_GUIDE.md#故障排查)

---

## 📞 需要帮助？

### 文档资源

- **完整功能文档**: [SKILL.md](./SKILL.md)
- **安装详细指南**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **实用案例集**: [EXAMPLES.md](./EXAMPLES.md)
- **概述和导航**: [README.md](./README.md)

### 外部资源

- **GitHub仓库**: https://github.com/lgazo/drawio-mcp-server
- **Draw.io官网**: https://app.diagrams.net
- **提交Issue**: https://github.com/lgazo/drawio-mcp-server/issues

---

## 🌟 恭喜你！

你已经完成了Draw.io Skill的设置！

**立即开始**:
1. 打开 https://app.diagrams.net
2. 确保扩展显示绿色
3. 在 Codex 中输入你的第一个架构图需求

**享受AI驱动的图表创建体验！** 🎉

---

**💡 专业提示**: 将Draw.io标签页固定（右键 → Pin Tab），这样它会一直保持打开状态，方便随时使用MCP功能！
