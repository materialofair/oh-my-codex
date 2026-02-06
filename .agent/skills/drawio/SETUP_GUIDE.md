# Draw.io MCP 浏览器扩展安装指南

## 🎯 为什么需要浏览器扩展？

Draw.io MCP服务器通过浏览器扩展与Draw.io网页版通信：
- MCP服务器 ← → 浏览器扩展 ← → Draw.io网页

**没有扩展 = MCP无法工作**

---

## 📥 安装步骤

### Chrome用户

1. **打开Chrome Web Store**:
   ```
   https://chrome.google.com/webstore
   ```

2. **搜索扩展**:
   - 搜索: "Draw.io MCP Extension" 或 "drawio mcp"
   - 或直接访问扩展页面（如果有直接链接）

3. **安装扩展**:
   - 点击 "Add to Chrome" 按钮
   - 在弹出窗口中点击 "Add extension"
   - 等待安装完成

4. **验证安装**:
   - 打开 https://app.diagrams.net
   - 查看浏览器工具栏中的扩展图标
   - **绿色信号** = 连接正常 ✅
   - **红色信号** = 连接失败 ❌

---

### Firefox用户

1. **打开Firefox Add-ons**:
   ```
   https://addons.mozilla.org
   ```

2. **搜索扩展**:
   - 搜索: "Draw.io MCP Extension"

3. **安装扩展**:
   - 点击 "Add to Firefox" 按钮
   - 在弹出窗口中点击 "Add"
   - 等待安装完成

4. **验证安装**:
   - 打开 https://app.diagrams.net
   - 查看工具栏中的扩展图标
   - 确认显示绿色连接状态

---

### Safari用户

**注意**: Draw.io MCP扩展可能暂不支持Safari，推荐使用Chrome或Firefox

---

## ✅ 验证MCP连接

### 1. 检查浏览器扩展状态

```bash
# 1. 打开Draw.io网页
open https://app.diagrams.net

# 2. 查看扩展图标
# - 绿色 = 正常
# - 红色 = 异常
```

**如果显示红色**:
- 刷新Draw.io页面（⌘ + R 或 Ctrl + R）
- 重启浏览器
- 检查扩展是否已启用

### 2. 检查Claude Code MCP状态

```bash
# 查看所有MCP服务器状态
claude mcp list

# 期望输出：
# drawio: npx -y drawio-mcp-server - ✓ Connected
```

**如果显示 ✗ Failed to connect**:
- 确保Draw.io网页标签页已打开
- 确保扩展显示绿色状态
- 重启Claude Code会话
- 检查网络连接

### 3. 测试MCP工具

在Claude Code中测试基础工具：

```
"列出Draw.io中所有可用的形状分类"
"在Draw.io中创建一个简单的矩形"
```

如果工具正常响应，说明MCP连接成功！

---

## 🔧 故障排查

### 问题1: 找不到扩展

**可能原因**:
- 扩展名称可能不同
- 扩展可能在不同的商店

**解决方案**:
1. 尝试不同的搜索关键词:
   - "drawio mcp"
   - "draw.io model context protocol"
   - "diagrams.net mcp"

2. 检查GitHub仓库是否有直接下载链接:
   ```
   https://github.com/lgazo/drawio-mcp-server
   ```

3. 查看README中的安装说明

### 问题2: 扩展显示红色

**可能原因**:
- MCP服务器未启动
- Draw.io页面未完全加载
- 扩展与页面通信失败

**解决方案**:
1. 刷新Draw.io页面（F5或⌘+R）
2. 重启Claude Code会话
3. 检查浏览器控制台错误:
   - 右键点击页面 → "检查"
   - 切换到 "Console" 标签
   - 查找错误信息

### 问题3: MCP工具无响应

**可能原因**:
- Draw.io标签页在后台
- 扩展权限不足
- MCP命令格式错误

**解决方案**:
1. 将Draw.io标签页切换到前台
2. 检查扩展权限设置:
   - Chrome: 更多工具 → 扩展程序 → Draw.io MCP → 详细信息
   - 确保已授予所需权限

3. 验证命令格式:
   ```
   ✅ 正确: "在(100, 100)位置添加一个矩形"
   ❌ 错误: "add rectangle 100 100"
   ```

---

## 🚀 高级配置

### 自定义扩展设置

某些扩展可能支持配置选项：

1. **访问扩展设置**:
   - Chrome: chrome://extensions → Draw.io MCP → 选项
   - Firefox: about:addons → Draw.io MCP → 首选项

2. **常见配置项**:
   - MCP服务器端口
   - 连接超时时间
   - 日志级别

### 开发者模式（调试）

如果需要调试扩展行为：

1. **启用开发者模式**:
   - Chrome: chrome://extensions → 开发者模式（右上角开关）

2. **查看扩展日志**:
   - 点击 "背景页" 或 "检查视图"
   - 查看Console输出

---

## 📚 相关链接

- **Draw.io MCP GitHub**: https://github.com/lgazo/drawio-mcp-server
- **Draw.io官网**: https://app.diagrams.net
- **Chrome扩展开发文档**: https://developer.chrome.com/docs/extensions/
- **Firefox扩展文档**: https://extensionworkshop.com/

---

## 💡 最佳实践

### 1. 保持Draw.io标签页打开

```yaml
工作流程:
  - 新建Chrome/Firefox窗口
  - 打开 https://app.diagrams.net
  - 固定标签页（右键 → Pin Tab）
  - 在Claude Code中开始使用draw.io工具

优势:
  ✅ MCP连接稳定
  ✅ 实时查看图表变化
  ✅ 便于调试和验证
```

### 2. 使用专用浏览器配置文件

```yaml
场景: 避免扩展冲突

操作:
  - 创建新的Chrome配置文件
  - 只安装必要的扩展（Draw.io MCP）
  - 用于所有MCP相关工作

优势:
  ✅ 减少扩展冲突
  ✅ 提升性能
  ✅ 更清晰的工作环境
```

### 3. 定期更新扩展

```yaml
保持扩展最新:
  - Chrome: 自动更新（默认）
  - Firefox: 自动更新（默认）

手动检查更新:
  - Chrome: chrome://extensions → 更新
  - Firefox: about:addons → 齿轮图标 → 检查更新
```

---

**🎉 安装完成后，你就可以在Claude Code中使用draw.io工具了！**
