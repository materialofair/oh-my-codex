---
name: drawio
description: Professional diagramming and architecture visualization using Draw.io MCP server. Create, modify, and manage system diagrams, flowcharts, and technical documentation visuals programmatically.
---

# Draw.io Diagramming Skill

**核心功能**: 通过MCP协议程序化控制Draw.io，实现架构图、流程图、系统设计图的自动生成和管理

---

## 禁止使用 Emoji 图标

**核心原则**: 生成的图表必须保持专业、简洁，避免 AI 生成痕迹

### 规则

1. **文本内容禁止 emoji**: 所有形状的 `text` 参数中不得包含任何 emoji 字符
2. **标题禁止 emoji**: 图表标题、区域标题、组件名称均不使用 emoji
3. **注释禁止 emoji**: 连线标签、说明文字不使用 emoji

### 正确示例

```yaml
# 正确 - 纯文本
text: "API Gateway"
text: "订单服务"
text: "用户认证 | 权限管理"
text: "数据库<br>MySQL"

# 错误 - 包含 emoji
text: "🔐 API Gateway"
text: "📦 订单服务"
text: "🛡️ 用户认证"
```

### 替代方案

- 使用文字符号: `|` `·` `-` `>` 代替装饰性 emoji
- 使用层级缩进: `<br>` 换行分隔功能点
- 使用颜色区分: 通过 fillColor 区分组件类型，而非 emoji

---

## 禁止嵌套文本框

**这是最重要的规则，必须严格遵守！**

### 错误模式（绝对禁止）

创建空的形状，然后在上面叠加独立的文本框：

```xml
<!-- 错误：空矩形 + 独立文本框 -->
<mxCell id="data-format" value="" style="rounded=1;..." />
<mxCell id="df-title" value="开放表格式" style="text;..." />
<mxCell id="df-content" value="详细内容..." style="text;..." />
```

### 正确模式（必须使用）

文本直接设置在形状的 `value` 属性或 `text` 参数中：

```xml
<!-- 正确：文本直接在 value 属性 -->
<mxCell id="data-format" value="开放表格式&lt;br&gt;详细内容..." style="rounded=1;..." />
```

### 实际操作规则

1. **调用 `add-rectangle` 时**：必须设置 `text` 参数，不要创建空矩形
2. **调用 `add-cell-of-shape` 时**：必须设置 `text` 参数
3. **多行文本**：使用 `<br>` 标签，不要创建多个文本框
4. **绝不单独创建 `style="text;..."` 的文本框来标注形状**

### 正确示例

```yaml
# 单行文本
add-rectangle:
  x: 100, y: 100
  width: 200, height: 80
  text: "API Gateway"
  style: "rounded=1;fillColor=#667eea;fontColor=#ffffff;"

# 多行文本 - 使用 <br> 标签
add-rectangle:
  x: 100, y: 200
  width: 200, height: 100
  text: "数据服务<br>- 数据存储<br>- 数据查询<br>- 数据分析"
  style: "rounded=1;fillColor=#4caf50;fontColor=#ffffff;"
```

---

## 适用场景

- **系统架构设计**: 生成微服务架构、云架构、网络拓扑图
- **流程图设计**: 业务流程、数据流、工作流可视化
- **技术文档**: 为代码库自动生成架构图、组件关系图
- **图表编辑**: 程序化添加、修改、删除图表元素

---

## 快速开始

### 1. 安装浏览器扩展（必需）

**Chrome用户**:
1. 访问 [Chrome Web Store](https://chrome.google.com/webstore)
2. 搜索 "Draw.io MCP Extension"
3. 点击 "Add to Chrome"

**Firefox用户**:
1. 访问 [Firefox Add-ons](https://addons.mozilla.org)
2. 搜索 "Draw.io MCP Extension"
3. 点击 "Add to Firefox"

**验证安装**:
- 打开 https://app.diagrams.net
- 扩展图标应显示**绿色信号**（表示连接正常）
- 如果显示红色，刷新页面或重启浏览器

### 2. 验证MCP连接

```bash
# 检查MCP服务器状态
claude mcp list

# 预期输出：
# drawio: npx -y drawio-mcp-server - ✓ Connected
```

**如果显示 ✗ Failed to connect**:
- 确保浏览器扩展已安装
- 打开 Draw.io 网页版（https://app.diagrams.net）
- 确保扩展显示绿色连接状态
- 重启Claude Code会话

---

## 可用工具 (9个)

### 检查工具 (5个)

#### 1. `get-selected-cell`
获取当前选中单元格的属性信息

**使用示例**:
```
"查看我选中的这个矩形的属性"
"获取当前选中图形的样式信息"
```

#### 2. `get-shape-categories`
检索Draw.io所有可用的形状类别

**使用示例**:
```
"列出所有可用的形状分类"
"我想看看有哪些AWS图标可以用"
```

#### 3. `get-shapes-in-category`
按类别查询特定形状列表

**参数**: `category` - 形状类别名称

**使用示例**:
```
"显示AWS类别下的所有形状"
"列出流程图分类的所有图形"
```

#### 4. `get-shape-by-name`
按名称查找特定形状的详细信息

**参数**: `shapeName` - 形状的精确名称

**使用示例**:
```
"查找名为'Database'的形状"
"获取AWS S3图标的信息"
```

#### 5. `list-paged-model`
分页查看图表中的所有单元格和连线

**参数**:
- `page` - 页码（默认: 0）
- `pageSize` - 每页数量（默认: 10）

**使用示例**:
```
"显示当前图表的所有元素"
"列出图表中的所有连接线"
```

---

### 修改工具 (4个)

#### 1. `add-rectangle`
创建矩形图形

**参数**:
- `x`, `y` - 位置坐标
- `width`, `height` - 尺寸
- `text` - 显示文本 **[必须设置，禁止创建空矩形]**
- `style` - 样式定制（可选）

**[重要规则]**:
- **必须**在创建矩形时直接设置 `text` 参数
- **禁止**先创建空矩形再添加文本框
- 多行文本使用 `<br>` 标签：`"标题<br>详细内容"`

**使用示例**:
```
"在(100, 100)位置添加一个200x80的矩形，文本为'API Gateway'"
"创建一个蓝色矩形，显示'Database'文字"
```

**多行文本示例**:
```
text = "服务名称<br>功能1<br>功能2<br>功能3"
```

**样式参数**:
```javascript
style = "fillColor=#1ba1e2;strokeColor=#006EAF;fontColor=#ffffff;rounded=1;"
```

#### 2. `add-edge`
连接两个图形单元格

**参数**:
- `sourceId` - 起点单元格ID
- `targetId` - 终点单元格ID
- `edgeStyle` - 连线样式（可选）

**使用示例**:
```
"连接单元格A和单元格B"
"在API和Database之间添加箭头连线"
```

**样式参数**:
```javascript
edgeStyle = "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;"
```

#### 3. `delete-cell-by-id`
删除指定ID的单元格

**参数**: `cellId` - 要删除的单元格ID

**使用示例**:
```
"删除ID为'cell-123'的图形"
"移除这个矩形"
```

#### 4. `add-cell-of-shape`
从形状库添加特定类型的图形

**参数**:
- `shapeName` - 形状名称
- `x`, `y` - 位置
- `text` - 显示文本 **[强烈建议设置，避免创建无标签图形]**

**[重要规则]**:
- **必须**在创建形状时直接设置 `text` 参数
- **禁止**先创建空形状再叠加文本框

**使用示例**:
```
"添加一个AWS Lambda图标在(200, 150)位置，文本为'处理函数'"
"在中心位置放置一个数据库图标，标注'用户数据'"
```

---

## 最佳实践

### 0. 文本设置原则（最重要）

```yaml
核心规则:
  [正确]: 创建形状时直接设置 text 参数
  [错误]: 先创建空形状，再叠加独立文本框

多行文本处理:
  [正确]: text = "标题<br>内容1<br>内容2"
  [错误]: 创建多个 text 类型的 mxCell 覆盖在形状上

复杂布局处理:
  [正确]: 一个形状包含所有相关文本（用<br>分隔）
  [错误]: 一个空形状 + 多个独立文本框

唯一例外:
  - 连线上的标签（edgeLabel）可以作为独立元素
  - 这是 Draw.io 的标准做法
```

### 1. 架构图生成工作流

```yaml
Step 1 - 规划布局:
  - 确定图表类型（架构图、流程图、时序图）
  - 设计图形位置和层次关系

Step 2 - 创建主要组件:
  - 使用add-rectangle或add-cell-of-shape添加核心组件
  - [重要] 必须在创建时设置 text 参数，包含所有需要显示的文本
  - 多行内容使用 <br> 标签分隔

Step 3 - 建立连接:
  - 使用add-edge连接相关组件
  - 设置箭头方向表示数据流向

Step 4 - 样式美化:
  - 统一配色方案（使用fillColor、strokeColor）
  - 添加圆角（rounded=1）提升视觉效果
  - 使用不同颜色区分组件类型
```

### 2. 增量式图表构建

```yaml
不要一次性生成完整图表，而是:
  1. 先创建核心组件（1-3个）
  2. 验证位置和样式
  3. 逐步添加次要组件
  4. 最后添加连接线和注释

优势:
  - 更容易调试和修改
  - 用户可以实时查看进度
  - 减少错误和返工
```

### 3. 坐标和布局建议

```yaml
位置规划:
  - 起始点: (50, 50)
  - 组件间距: 水平150-200px，垂直100-150px
  - 层次结构: 从上到下或从左到右

尺寸标准:
  - 小图标: 60x60
  - 标准矩形: 120x60
  - 大容器: 200x100
```

---

## 现代化设计系统（必须遵循）

### 设计原则

```yaml
核心理念:
  - 简洁现代: 避免过度装饰，突出信息层次
  - 视觉一致: 统一配色、字体、间距
  - 层次分明: 通过颜色、大小、阴影区分层级
  - 专业美观: 使用柔和渐变、适当阴影、圆角设计
```

### 现代配色方案（强制使用）

```yaml
主色调系统（选择一个作为主题色）:

蓝紫渐变（科技感，推荐）:
  - 主色: #667eea (紫蓝)
  - 辅色: #764ba2 (深紫)
  - 浅色背景: #f5f7fa
  - 文字: #2d3436 (深灰)

清新蓝（企业风）:
  - 主色: #0984e3 (蓝)
  - 辅色: #74b9ff (浅蓝)
  - 浅色背景: #f8f9fa
  - 文字: #2d3436

翠绿色（数据/环保）:
  - 主色: #00b894 (翠绿)
  - 辅色: #55efc4 (浅绿)
  - 浅色背景: #f0fff4
  - 文字: #2d3436

功能色（固定）:
  - 成功/数据库: #00b894 / #55efc4
  - 警告/队列: #fdcb6e / #ffeaa7
  - 错误/重要: #d63031 / #ff7675
  - 信息/服务: #0984e3 / #74b9ff
  - 中性/基础: #636e72 / #b2bec3
```

### 视觉规范（强制）

```yaml
圆角（必须使用）:
  - 标准圆角: rounded=1 (8px效果)
  - 大圆角容器: rounded=1;arcSize=12;
  - 圆形图标: ellipse=1;

阴影（提升层次感）:
  - 主要组件: shadow=1;
  - 容器/区域: shadow=0; (不加阴影)
  - 悬浮效果: shadow=1;shadowColor=#00000020;

边框:
  - 主要组件: strokeWidth=2;
  - 容器边框: strokeWidth=3;
  - 无边框卡片: strokeColor=none;

字体大小:
  - 主标题: fontSize=24; fontStyle=1; (加粗)
  - 区域标题: fontSize=20; fontStyle=1;
  - 组件标题: fontSize=16; fontStyle=1;
  - 描述文字: fontSize=12; fontStyle=0;
  - 小标签: fontSize=11;
```

### 布局网格系统（强制）

```yaml
画布设置:
  - 推荐尺寸: 1400x900 或 1600x1000
  - 边距: 左右各 50px，上下各 50px
  - 网格对齐: 所有元素坐标为 10 的倍数

组件尺寸标准:
  - 小卡片: 160x80
  - 标准卡片: 200x100
  - 大卡片: 280x120
  - 容器区域: 根据内容，最小 300x200
  - 图标: 48x48 或 60x60

间距规范:
  - 同级组件水平间距: 40px
  - 同级组件垂直间距: 30px
  - 容器内边距: 20px
  - 容器间距: 50px
  - 层级间距: 80-100px

对齐原则:
  - 同一行组件: y 坐标相同
  - 同一列组件: x 坐标相同
  - 居中对齐: 计算中心点
```

### 层次结构模板

```yaml
三层架构（从上到下）:
  Layer 1 - 入口层 (y=50-150):
    - 用户、客户端、API Gateway
    - 颜色: 主题色

  Layer 2 - 服务层 (y=200-400):
    - 微服务、业务逻辑
    - 颜色: 功能色（蓝、绿、橙等区分）

  Layer 3 - 数据层 (y=450-600):
    - 数据库、缓存、消息队列
    - 颜色: 统一绿色系

底部基础设施条 (y=700-800):
  - K8s、云服务、监控
  - 颜色: 深灰 #37474f
  - 文字: 白色
```

---

## 现代样式模板库

### 玻璃态/毛玻璃风格（推荐）

```javascript
// 主容器 - 玻璃态背景
"rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#667eea;strokeWidth=3;shadow=1;opacity=95;"

// 标题栏 - 渐变效果
"rounded=1;whiteSpace=wrap;html=1;fillColor=#667eea;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=20;fontStyle=1;"

// 功能卡片 - 浅色填充
"rounded=1;whiteSpace=wrap;html=1;fillColor=#e8eaf6;strokeColor=#667eea;strokeWidth=2;shadow=1;fontSize=14;"

// 信息卡片 - 柔和阴影
"rounded=1;whiteSpace=wrap;html=1;fillColor=#f8f9fa;strokeColor=none;shadow=1;fontSize=12;"
```

### 现代渐变风格

```javascript
// 紫蓝渐变标题
"rounded=1;whiteSpace=wrap;html=1;fillColor=#667eea;gradientColor=#764ba2;gradientDirection=east;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=24;fontStyle=1;"

// 蓝绿渐变卡片
"rounded=1;whiteSpace=wrap;html=1;fillColor=#0984e3;gradientColor=#00b894;gradientDirection=south;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=16;fontStyle=1;"

// 橙红渐变强调
"rounded=1;whiteSpace=wrap;html=1;fillColor=#fdcb6e;gradientColor=#e17055;gradientDirection=east;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=16;fontStyle=1;"
```

### 企业专业风格

```javascript
// 服务节点 - 蓝色
"rounded=1;whiteSpace=wrap;html=1;fillColor=#0984e3;strokeColor=#0652DD;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

// 数据库 - 绿色
"rounded=1;whiteSpace=wrap;html=1;fillColor=#00b894;strokeColor=#009432;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

// 消息队列 - 橙色
"rounded=1;whiteSpace=wrap;html=1;fillColor=#fdcb6e;strokeColor=#f39c12;strokeWidth=2;shadow=1;fontColor=#2d3436;fontSize=14;fontStyle=1;"

// 缓存 - 紫色
"rounded=1;whiteSpace=wrap;html=1;fillColor=#a29bfe;strokeColor=#6c5ce7;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

// 外部服务 - 灰色
"rounded=1;whiteSpace=wrap;html=1;fillColor=#636e72;strokeColor=#2d3436;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"
```

### 区域容器样式

```javascript
// 主区域容器 - 白底彩边
"rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#667eea;strokeWidth=3;shadow=1;verticalAlign=top;fontSize=20;fontStyle=1;fontColor=#667eea;"

// 次级区域 - 浅色填充
"rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f7fa;strokeColor=#b2bec3;strokeWidth=2;dashed=1;dashPattern=5 5;verticalAlign=top;fontSize=16;fontStyle=1;fontColor=#636e72;"

// 底部基础设施条
"rounded=1;whiteSpace=wrap;html=1;fillColor=#37474f;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=16;fontStyle=1;"
```

### 现代连线样式

```javascript
// 主数据流 - 粗实线渐变色
"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#667eea;endArrow=blockThin;endFill=1;"

// 次级调用 - 细实线
"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#0984e3;endArrow=classic;endFill=1;"

// 异步消息 - 虚线
"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#fdcb6e;dashed=1;dashPattern=8 4;endArrow=classic;endFill=1;"

// 双向通信 - 双箭头
"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#00b894;startArrow=classic;endArrow=classic;startFill=1;endFill=1;"

// 弯曲连线 - 曲线
"edgeStyle=orthogonalEdgeStyle;curved=1;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#667eea;endArrow=classic;endFill=1;"
```

### 标签和徽章

```javascript
// 圆角徽章 - 强调
"rounded=1;whiteSpace=wrap;html=1;fillColor=#667eea;strokeColor=none;arcSize=50;fontColor=#ffffff;fontSize=11;fontStyle=1;"

// 状态标签 - 成功
"rounded=1;whiteSpace=wrap;html=1;fillColor=#00b894;strokeColor=none;arcSize=50;fontColor=#ffffff;fontSize=10;"

// 状态标签 - 警告
"rounded=1;whiteSpace=wrap;html=1;fillColor=#fdcb6e;strokeColor=none;arcSize=50;fontColor=#2d3436;fontSize=10;"

// 数字徽章
"ellipse;whiteSpace=wrap;html=1;fillColor=#d63031;strokeColor=none;fontColor=#ffffff;fontSize=12;fontStyle=1;"
```

---

## 完整样式速查表

### 快速复制模板

```yaml
# 标题区域（必须有）
title_bar: "rounded=1;fillColor=#667eea;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=24;fontStyle=1;"

# 主容器
container: "rounded=1;fillColor=#ffffff;strokeColor=#667eea;strokeWidth=3;shadow=1;"

# 功能卡片（按颜色区分）
card_blue: "rounded=1;fillColor=#e8eaf6;strokeColor=#667eea;strokeWidth=2;shadow=1;fontSize=14;fontStyle=1;fontColor=#667eea;"
card_green: "rounded=1;fillColor=#e8f5e9;strokeColor=#00b894;strokeWidth=2;shadow=1;fontSize=14;fontStyle=1;fontColor=#00b894;"
card_orange: "rounded=1;fillColor=#fff4e6;strokeColor=#fdcb6e;strokeWidth=2;shadow=1;fontSize=14;fontStyle=1;fontColor=#e17055;"
card_purple: "rounded=1;fillColor=#f3e5f5;strokeColor=#a29bfe;strokeWidth=2;shadow=1;fontSize=14;fontStyle=1;fontColor=#6c5ce7;"

# 服务节点（实心填充）
service_blue: "rounded=1;fillColor=#0984e3;strokeColor=#0652DD;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"
service_green: "rounded=1;fillColor=#00b894;strokeColor=#009432;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"
service_orange: "rounded=1;fillColor=#fdcb6e;strokeColor=#f39c12;strokeWidth=2;shadow=1;fontColor=#2d3436;fontSize=14;fontStyle=1;"
service_purple: "rounded=1;fillColor=#a29bfe;strokeColor=#6c5ce7;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

# 底部条
footer_bar: "rounded=1;fillColor=#37474f;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=14;"

# 连线
edge_main: "edgeStyle=orthogonalEdgeStyle;rounded=1;strokeWidth=3;strokeColor=#667eea;endArrow=blockThin;endFill=1;"
edge_normal: "edgeStyle=orthogonalEdgeStyle;rounded=1;strokeWidth=2;strokeColor=#0984e3;endArrow=classic;endFill=1;"
edge_dashed: "edgeStyle=orthogonalEdgeStyle;rounded=1;strokeWidth=2;strokeColor=#b2bec3;dashed=1;endArrow=classic;endFill=1;"
```

---

## 故障排查

### 问题1: MCP连接失败

**症状**: `claude mcp list` 显示 `✗ Failed to connect`

**解决方案**:
1. 确保已安装浏览器扩展
2. 打开 https://app.diagrams.net
3. 检查扩展图标是否为绿色
4. 重启Claude Code会话
5. 刷新Draw.io网页

### 问题2: 无法添加图形

**症状**: 调用工具后没有图形出现

**解决方案**:
1. 确认Draw.io网页标签页处于激活状态
2. 检查坐标是否在可见范围内（建议从50, 50开始）
3. 验证形状名称是否正确（使用get-shape-by-name查询）
4. 检查浏览器控制台是否有错误信息

### 问题3: 图形位置不对

**症状**: 图形重叠或位置混乱

**解决方案**:
1. 使用`list-paged-model`查看所有元素的当前位置
2. 规划坐标系统（建立网格布局）
3. 使用更大的间距（推荐200px以上）
4. 先在纸上或脑海中规划布局再实现

---

## 实用案例

### 案例1: 现代化微服务架构图（完整示例）

```yaml
场景: 为电商系统生成专业美观的微服务架构图

=== Step 1: 创建画布背景和标题 ===

# 浅灰背景（覆盖整个画布）
add-rectangle:
  x: 0, y: 0, width: 1400, height: 900
  text: ""
  style: "rounded=0;fillColor=#f5f7fa;strokeColor=none;"

# 渐变标题栏
add-rectangle:
  x: 400, y: 30, width: 600, height: 70
  text: "电商系统微服务架构"
  style: "rounded=1;fillColor=#667eea;gradientColor=#764ba2;gradientDirection=east;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=28;fontStyle=1;"

=== Step 2: 创建主要区域容器 ===

# 服务层容器
add-rectangle:
  x: 50, y: 130, width: 650, height: 350
  text: "服务层"
  style: "rounded=1;fillColor=#ffffff;strokeColor=#667eea;strokeWidth=3;shadow=1;verticalAlign=top;align=left;spacingLeft=20;fontSize=18;fontStyle=1;fontColor=#667eea;"

# AI能力层容器
add-rectangle:
  x: 720, y: 130, width: 630, height: 350
  text: "AI 能力层"
  style: "rounded=1;fillColor=#ffffff;strokeColor=#00b894;strokeWidth=3;shadow=1;verticalAlign=top;align=left;spacingLeft=20;fontSize=18;fontStyle=1;fontColor=#00b894;"

=== Step 3: 创建服务节点（带文本，禁止空节点） ===

# API Gateway - 入口服务
add-rectangle:
  x: 100, y: 180, width: 200, height: 80
  text: "API Gateway<br>路由 | 认证 | 限流"
  style: "rounded=1;fillColor=#667eea;strokeColor=#5a67d8;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

# 订单服务
add-rectangle:
  x: 100, y: 290, width: 180, height: 90
  text: "订单服务<br>创建订单<br>订单查询"
  style: "rounded=1;fillColor=#0984e3;strokeColor=#0652DD;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

# 商品服务
add-rectangle:
  x: 300, y: 290, width: 180, height: 90
  text: "商品服务<br>商品管理<br>库存管理"
  style: "rounded=1;fillColor=#00b894;strokeColor=#009432;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

# 用户服务
add-rectangle:
  x: 500, y: 290, width: 180, height: 90
  text: "用户服务<br>用户认证<br>用户信息"
  style: "rounded=1;fillColor=#a29bfe;strokeColor=#6c5ce7;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

=== Step 4: AI能力层节点 ===

# RAG引擎
add-rectangle:
  x: 770, y: 180, width: 180, height: 100
  text: "RAG 引擎<br>文档解析<br>向量检索"
  style: "rounded=1;fillColor=#e8eaf6;strokeColor=#667eea;strokeWidth=2;shadow=1;fontSize=14;fontStyle=1;fontColor=#667eea;"

# 推理服务
add-rectangle:
  x: 970, y: 180, width: 180, height: 100
  text: "推理服务<br>模型网关<br>负载均衡"
  style: "rounded=1;fillColor=#e8f5e9;strokeColor=#00b894;strokeWidth=2;shadow=1;fontSize=14;fontStyle=1;fontColor=#00b894;"

=== Step 5: 数据层 ===

# 数据库组
add-rectangle:
  x: 100, y: 520, width: 180, height: 80
  text: "订单 DB<br>MySQL"
  style: "rounded=1;fillColor=#00b894;strokeColor=#009432;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

add-rectangle:
  x: 300, y: 520, width: 180, height: 80
  text: "商品 DB<br>MongoDB"
  style: "rounded=1;fillColor=#00b894;strokeColor=#009432;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

add-rectangle:
  x: 500, y: 520, width: 180, height: 80
  text: "用户 DB<br>PostgreSQL"
  style: "rounded=1;fillColor=#00b894;strokeColor=#009432;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

# 向量数据库
add-rectangle:
  x: 770, y: 520, width: 180, height: 80
  text: "向量库<br>Milvus"
  style: "rounded=1;fillColor=#a29bfe;strokeColor=#6c5ce7;strokeWidth=2;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

# 缓存
add-rectangle:
  x: 970, y: 520, width: 180, height: 80
  text: "缓存<br>Redis"
  style: "rounded=1;fillColor=#fdcb6e;strokeColor=#f39c12;strokeWidth=2;shadow=1;fontColor=#2d3436;fontSize=14;fontStyle=1;"

=== Step 6: 底部基础设施条 ===

add-rectangle:
  x: 50, y: 650, width: 1300, height: 60
  text: "基础设施层: Kubernetes | 对象存储 (S3) | 监控告警 (Prometheus) | 日志系统 (ELK)"
  style: "rounded=1;fillColor=#37474f;strokeColor=none;shadow=1;fontColor=#ffffff;fontSize=14;fontStyle=1;"

=== Step 7: 添加连线 ===

# 使用现代连线样式
edge_style_main: "edgeStyle=orthogonalEdgeStyle;rounded=1;strokeWidth=3;strokeColor=#667eea;endArrow=blockThin;endFill=1;"
edge_style_normal: "edgeStyle=orthogonalEdgeStyle;rounded=1;strokeWidth=2;strokeColor=#0984e3;endArrow=classic;endFill=1;"

[核心规则]:
  1. 每个 add-rectangle 必须直接包含 text 参数
  2. 禁止创建空形状后叠加文本框
  3. 多行内容使用 <br> 分隔
  4. 统一使用现代配色方案
  5. 所有组件添加 shadow=1 和 rounded=1
```

### 案例2: 生成数据流图

```yaml
场景: 展示用户注册流程

步骤:
  1. 起点: 用户 (50, 100)
  2. 前端表单 (250, 100)
  3. 后端API (450, 100)
  4. 数据库 (650, 100)
  5. 邮件服务 (450, 250)
  6. 用实线箭头连接主流程
  7. 用虚线箭头连接异步操作（邮件发送）
```

---

## 进阶技巧

### 1. 批量创建图形

使用循环或列表批量生成图形，适合创建重复结构：

```yaml
场景: 创建Kubernetes集群图

思路:
  - 定义Pod模板样式
  - 使用循环创建多个Pod（位置自动计算）
  - 批量添加连接线
```

### 2. 图层管理

```yaml
分层策略:
  Layer 1 - 基础设施层: 网络、存储、计算资源
  Layer 2 - 服务层: 微服务、API、中间件
  Layer 3 - 应用层: 前端、后端、移动端
  Layer 4 - 数据层: 数据库、缓存、消息队列

实现: 使用Y坐标区分层次
  - 基础设施: y=400-500
  - 服务层: y=250-350
  - 应用层: y=100-200
  - 数据层: y=500-600
```

### 3. 智能命名

```yaml
为单元格ID使用有意义的命名:
  [错误]: cell-1, cell-2, cell-3
  [正确]: api-gateway, order-service, user-db

优势:
  - 更容易查找和引用
  - 代码可读性更高
  - 便于后续修改
```

---

## 设计质量检查清单（生成图表前必检）

### 结构规范检查

```yaml
□ 文本设置:
  - [ ] 所有形状的 text 参数都已设置（禁止空形状）
  - [ ] 多行文本使用 <br> 标签分隔
  - [ ] 没有创建独立的 text 类型文本框覆盖形状

□ 层次结构:
  - [ ] 有明确的标题区域
  - [ ] 使用容器区分不同功能模块
  - [ ] 层级从上到下或从左到右清晰排列
  - [ ] 底部有基础设施条（如需要）
```

### 视觉规范检查

```yaml
□ 配色:
  - [ ] 使用统一的主题色（推荐紫蓝 #667eea）
  - [ ] 功能色区分不同类型组件（蓝、绿、橙、紫）
  - [ ] 文字颜色与背景形成足够对比
  - [ ] 深色背景用白色文字，浅色背景用深色文字

□ 样式:
  - [ ] 所有组件都有圆角（rounded=1）
  - [ ] 主要组件添加阴影（shadow=1）
  - [ ] 边框宽度统一（strokeWidth=2 或 3）
  - [ ] 字体大小层次分明（标题大、内容小）

□ 布局:
  - [ ] 坐标为 10 的倍数（网格对齐）
  - [ ] 同级组件间距一致（40px 水平，30px 垂直）
  - [ ] 同一行组件 y 坐标相同
  - [ ] 同一列组件 x 坐标相同
```

### 专业度检查

```yaml
□ 完整性:
  - [ ] 有渐变标题栏
  - [ ] 有区域容器划分
  - [ ] 有连线表示关系
  - [ ] 有底部基础设施说明（如适用）

□ 美观性:
  - [ ] 整体配色和谐
  - [ ] 没有元素重叠
  - [ ] 间距均匀美观
  - [ ] 文字居中或对齐
```

### 快速自检口诀

```
一看文本在不在形状里，二看圆角阴影加没加
三看配色统不统一，四看间距齐不齐
五看标题够不够大，六看层次分不分明
```

---

## 文本溢出防止规则（极其重要）

### 核心原则：文本必须适配容器

**这是生成美观图表的关键规则，必须严格遵守！**

### 文本宽度计算公式

```yaml
最大安全字符数 = (容器宽度 - 左右边距) / 平均字符宽度

中文字符宽度估算（按字号）:
  - fontSize=7:  约 7px/字
  - fontSize=8:  约 8px/字
  - fontSize=9:  约 9px/字
  - fontSize=10: 约 10px/字
  - fontSize=11: 约 11px/字
  - fontSize=12: 约 12px/字
  - fontSize=14: 约 14px/字
  - fontSize=16: 约 16px/字

英文字符宽度估算（约为中文的 0.5-0.6 倍）:
  - fontSize=8:  约 4-5px/字
  - fontSize=10: 约 5-6px/字
  - fontSize=12: 约 6-7px/字

边距预留:
  - 最小左右边距: 10px (共 20px)
  - 推荐左右边距: 15px (共 30px)
```

### 容器尺寸与文本长度对照表

```yaml
小容器 (60-80px 宽):
  - 推荐字号: 7-8px
  - 最大中文字数: 5-7字/行
  - 示例: "数据库", "缓存", "API"

标准容器 (80-120px 宽):
  - 推荐字号: 8-10px
  - 最大中文字数: 6-10字/行
  - 示例: "用户服务", "订单处理"

中等容器 (120-160px 宽):
  - 推荐字号: 10-12px
  - 最大中文字数: 8-12字/行
  - 示例: "API Gateway", "消息队列服务"

大容器 (160-200px 宽):
  - 推荐字号: 12-14px
  - 最大���文字数: 10-14字/行
  - 示例: "电商系统架构", "用户认证服务"

超大容器 (200px+ 宽):
  - 推荐字号: 14-16px
  - 最大中文字数: 12-16字/行
  - 示例: "企业级微服务架构图"
```

### 文本溢出解决策略

#### 策略1: 简化文本标签

```yaml
# 错误 - 文本太长导致溢出
text: "@editverse/editor-core"
text: "useEditorProtocol Hook"
text: "captureSelection 方法"

# 正确 - 简化为核心词汇
text: "editor-core"
text: "Editor Hook"
text: "选区捕获"
```

#### 策略2: 使用符号代替文字

```yaml
# 流程步骤使用圆圈数字
text: "①②③" 代替 "1. xxx 2. xxx 3. xxx"

# 分隔使用简洁符号
text: "A | B | C" 代�� "A 功能 / B 功能 / C 功能"

# 层级使用箭头
text: "A → B → C" 代替 "A 调用 B 调用 C"
```

#### 策略3: 详细内容外置

```yaml
核心模块内只放简短标识，详细说明放到注释区:

# 主流程框
text: "① 捕获"      # 简短标识
text: "② 推送"
text: "③ 接收"

# 右侧注释区（详细说明）
text: "① captureSelection()<br>② pushChatContext()<br>③ receiveChatResponse()"
```

#### 策略4: 智能换行分布

```yaml
# 错误 - 单行过长
text: "用户服务 | 订单服务 | 商品服务 | 支付服务"

# 正确 - 多行分布
text: "用户服务 | 订单服务<br>商品服务 | 支付服务"

# 或者使用列表格式
text: "核心服务<br>- 用户<br>- 订单<br>- 商品"
```

### 字号与容器匹配规则（强制）

```yaml
自动字号选择规则:

宽度 < 70px:
  - 使用 fontSize=7 或 8
  - 文本限制 4-5 字
  - 只放核心标识

宽度 70-100px:
  - 使用 fontSize=8 或 9
  - 文本限制 6-8 字
  - 可放简短描述

宽度 100-150px:
  - 使用 fontSize=9 或 10
  - 文本限制 8-12 字
  - 可放标准标签

宽度 150-200px:
  - 使用 fontSize=10 或 11
  - 文本限制 12-16 字
  - 可放详细标签

宽度 > 200px:
  - 使用 fontSize=12-14
  - 文本可相对自由
  - 注意保持美观
```

### 流程图专用规则

```yaml
流程图中的方法名处理:

# 错误做法 - 把完整方法名放在流程框内
框内文本: "1. captureSelection()\n2. pushChatContext()\n3. handleResponse()"

# 正确做法 - 使用编号 + 外部注释
框内文本: "①②③"
注释区文本: "① captureSelection()<br>② pushChatContext()<br>③ handleResponse()"

优势:
  - 流程框保持简洁
  - 详细信息不丢失
  - 视觉更加整洁
```

### 包关系图专用规则

```yaml
包关系图中的包名处理:

# 错误做法 - 使用完整包名
text: "@editverse/editor-core"
text: "@editverse/app-shared"

# 正确做法 - 使用简短名称
text: "editor-core"
text: "app-shared"

目录/文件列表处理:

# 错误做法 - 完整路径
text: "hooks/useEditorProtocol.ts<br>hooks/useChatProtocol.ts"

# 正确做法 - 只显示文件名
text: "useEditorProtocol.ts<br>useChatProtocol.ts"
```

### 注释框文本规则

```yaml
长说明文本处理:

# 错误做法 - 单行长文本
text: "Protocol Store 是核心状态管理，基于 Zustand 实现跨包状态共享"

# 正确做法 - 合理换行
text: "Protocol Store<br>核心状态管理<br>基于 Zustand<br>跨包状态共享"

换行原则:
  - 每行不超过 10-12 个中文字符
  - 在语义断点换行（短语、概念之间）
  - 保持每行长度相近
```

### 文本溢出检查清单

```yaml
□ 创建每个形状前:
  - [ ] 计算容器宽度能容纳多少字符
  - [ ] 检查文本长度是否超出
  - [ ] 必要时简化文本或增大容器

□ 文本内容检查:
  - [ ] 包名是否已简化（去掉 @scope/）
  - [ ] 方法名是否用编号代替
  - [ ] 路径是否只保留文件名
  - [ ] 长说明是否已换行

□ 字号匹配检查:
  - [ ] 小容器使用小字号 (7-9px)
  - [ ] 标准容器使用中等字号 (9-11px)
  - [ ] 大容器使用正常字号 (11-14px)

□ 最终视觉检查:
  - [ ] 文本是否完全在框内
  - [ ] 左右是否有适当边距
  - [ ] 多行文本间距是否合理
```

### 快速参考：常见场景处理

```yaml
场景1 - 模块名太长:
  原: "@editverse/editor-core"
  改: "editor-core"

场景2 - Hook名称太长:
  原: "useEditorProtocol"
  改: "Editor Hook" 或放到注释区

场景3 - 方法调用序列:
  原: "1. captureSelection() 2. pushContext()"
  改: "①②" + 外部注释

场景4 - 文件列表:
  原: "src/hooks/useProtocol.ts"
  改: "useProtocol.ts"

场景5 - 功能描述太长:
  原: "基于 Zustand 的跨包状态管理方案"
  改: "Zustand 状态管理<br>支持跨包共享"
```

---

## 相关资源

- **Draw.io官网**: https://app.diagrams.net
- **MCP服务器GitHub**: https://github.com/lgazo/drawio-mcp-server
- **Draw.io形状库**: https://www.drawio.com/blog/shape-libraries
- **Draw.io快捷键**: https://www.drawio.com/shortcuts

---

## 核心价值

- **自动化**: 程序化生成架构图，节省手动绘制时间
- **一致性**: 统一样式和布局，提升文档专业性
- **可维护**: 代码化的图表更容易版本控制和修改
- **智能化**: AI理解项目结构，自动设计合理布局
- **集成化**: 与代码库同步，确保文档实时更新

---

**最佳实践**: 将Draw.io图表生成集成到项目文档工作流中，每次架构变更时自动更新图表，保持文档与代码同步！
