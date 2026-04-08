# Draw.io 实用案例和代码示例

## 🎯 快速案例索引

- [案例1: 微服务架构图](#案例1-微服务架构图)
- [案例2: AWS云架构图](#案例2-aws云架构图)
- [案例3: 数据流图](#案例3-数据流图)
- [案例4: 业务流程图](#案例4-业务流程图)
- [案例5: 数据库ER图](#案例5-数据库er图)

---

## 案例1: 微服务架构图

### 场景描述
为电商系统生成微服务架构图，包含API网关、多个服务和数据库

### 提示词示例

```
帮我在Draw.io中创建一个电商系统的微服务架构图：

1. 顶层：API Gateway
2. 中层：订单服务、商品服务、用户服务（水平排列）
3. 底层：各自对应的数据库
4. 使用蓝色系配色
5. 添加箭头连线表示调用关系
```

### 预期输出结构

```yaml
布局:
  API Gateway: (300, 50)
    ↓ ↓ ↓
  订单服务(100,200) | 商品服务(300,200) | 用户服务(500,200)
    ↓                  ↓                  ↓
  订单DB(100,350)  | 商品DB(300,350)  | 用户DB(500,350)

样式:
  - 服务: 蓝色矩形 (#1ba1e2)
  - 数据库: 绿色圆角矩形 (#43A047)
  - 连线: 实线箭头
```

---

## 案例2: AWS云架构图

### 场景描述
使用AWS图标生成Serverless架构图

### 提示词示例

```
使用Draw.io AWS图标库创建Serverless架构：

1. 前端：S3静态网站托管
2. API层：API Gateway
3. 计算层：3个Lambda函数
4. 数据层：DynamoDB数据库
5. 使用AWS官方配色
6. 添加数据流向箭头
```

### AWS样式参考

```javascript
// Lambda函数
fillColor=#FF9900;strokeColor=#232F3E;fontColor=#FFFFFF;rounded=1;

// S3
fillColor=#569A31;strokeColor=#232F3E;fontColor=#FFFFFF;rounded=1;

// DynamoDB
fillColor=#2E73B8;strokeColor=#232F3E;fontColor=#FFFFFF;rounded=1;

// API Gateway
fillColor=#FF4F8B;strokeColor=#232F3E;fontColor=#FFFFFF;rounded=1;
```

---

## 案例3: 数据流图

### 场景描述
展示用户注册流程的数据流

### 提示词示例

```
创建用户注册流程的数据流图：

流程:
1. 用户输入 → 前端表单
2. 前端表单 → 后端API
3. 后端API → 数据库（保存用户）
4. 后端API → 邮件服务（发送验证邮件）
5. 邮件服务 → 用户邮箱

要求:
- 主流程用实线箭头
- 异步操作（邮件）用虚线箭头
- 使用不同颜色区分组件类型
```

### 连线样式参考

```javascript
// 实线箭头（主流程）
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;endArrow=classic;

// 虚线箭头（异步操作）
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;dashed=1;dashPattern=5 5;strokeWidth=2;endArrow=classic;

// 双向箭头
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;startArrow=classic;endArrow=classic;
```

---

## 案例4: 业务流程图

### 场景描述
订单处理业务流程可视化

### 提示词示例

```
绘制订单处理流程图：

开始 → 提交订单 → 库存检查
  ↓
  库存足够？
  - 是 → 创建订单 → 发起支付 → 支付成功？
    - 是 → 扣减库存 → 发货 → 结束
    - 否 → 取消订单 → 结束
  - 否 → 显示缺货 → 结束

使用传统流程图符号：
- 圆角矩形：开始/结束
- 矩形：处理步骤
- 菱形：判断节点
```

### 流程图图形

```yaml
开始/结束:
  图形: 圆角矩形
  样式: fillColor=#e1f5fe;strokeColor=#01579b;rounded=1;

处理步骤:
  图形: 矩形
  样式: fillColor=#fff9c4;strokeColor=#f57f17;

判断节点:
  图形: 菱形
  样式: fillColor=#ffccbc;strokeColor=#bf360c;shape=rhombus;
```

---

## 案例5: 数据库ER图

### 场景描述
博客系统的实体关系图

### 提示词示例

```
创建博客系统的ER图：

实体:
1. 用户(Users)
   - id (PK)
   - username
   - email

2. 文章(Posts)
   - id (PK)
   - user_id (FK)
   - title
   - content
   - created_at

3. 评论(Comments)
   - id (PK)
   - post_id (FK)
   - user_id (FK)
   - content
   - created_at

关系:
- 用户 1:N 文章
- 文章 1:N 评论
- 用户 1:N 评论

使用UML类图样式
```

### ER图样式

```javascript
// 实体表
fillColor=#fff4e6;strokeColor=#e65100;fontColor=#000000;align=left;verticalAlign=top;

// 主键
fontStyle=1;fontColor=#d32f2f;

// 外键
fontStyle=2;fontColor=#1976d2;

// 关系线
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;endArrow=ERmany;startArrow=ERone;
```

---

## 🎨 通用样式模板

### 配色方案

#### 1. 现代蓝色系
```javascript
primary:   fillColor=#1976d2;strokeColor=#0d47a1;fontColor=#ffffff;
secondary: fillColor=#42a5f5;strokeColor=#1976d2;fontColor=#ffffff;
accent:    fillColor=#ff9800;strokeColor=#e65100;fontColor=#ffffff;
```

#### 2. 专业灰色系
```javascript
dark:   fillColor=#37474f;strokeColor=#263238;fontColor=#ffffff;
medium: fillColor=#78909c;strokeColor=#546e7a;fontColor=#ffffff;
light:  fillColor=#cfd8dc;strokeColor=#90a4ae;fontColor=#000000;
```

#### 3. 清新绿色系
```javascript
primary:   fillColor=#4caf50;strokeColor=#2e7d32;fontColor=#ffffff;
secondary: fillColor=#81c784;strokeColor=#4caf50;fontColor=#ffffff;
accent:    fillColor=#ffc107;strokeColor=#f57c00;fontColor=#000000;
```

---

## 💡 最佳实践技巧

### 1. 坐标规划技巧

```yaml
网格系统:
  - 使用100的倍数作为基准坐标
  - 水平间距: 200px (标准), 150px (紧凑)
  - 垂直间距: 150px (标准), 100px (紧凑)

示例:
  第一行: y=50   → (100,50), (300,50), (500,50)
  第二行: y=200  → (100,200), (300,200), (500,200)
  第三行: y=350  → (100,350), (300,350), (500,350)
```

### 2. 图形尺寸标准

```yaml
图标/小组件:
  - 尺寸: 60x60
  - 适用: 图标、小节点

标准组件:
  - 尺寸: 120x60 或 150x80
  - 适用: 服务、API、模块

大容器:
  - 尺寸: 200x120 或 250x150
  - 适用: 系统、子系统、大模块

文本标签:
  - 尺寸: 100x30
  - 适用: 注释、说明文字
```

### 3. 分层布局策略

```yaml
垂直分层（推荐用于架构图）:
  顶层 (y=50-150):   前端、客户端
  中层 (y=200-300):  API、服务层
  底层 (y=350-450):  数据库、存储

水平分层（推荐用于流程图）:
  左侧 (x=50-200):   输入、开始
  中部 (x=250-550):  处理、转换
  右侧 (x=600-750):  输出、结束
```

### 4. 连线最佳实践

```yaml
箭头类型:
  - 实线箭头: 主要数据流、直接调用
  - 虚线箭头: 异步操作、间接依赖
  - 双向箭头: 双向通信、同步操作
  - 无箭头: 关联关系、非方向性

连线样式:
  - 正交连线 (orthogonalEdgeStyle): 专业、规整
  - 直线连线 (straight): 简洁、直接
  - 曲线连线 (curved): 优雅、艺术
```

---

## 🔥 高级案例

### Kubernetes架构图

```yaml
提示词:
  "创建Kubernetes集群架构图：
  - Master节点（API Server, Scheduler, Controller）
  - 3个Worker节点
  - 每个Worker节点有2个Pod
  - Etcd数据库
  - 使用Kubernetes官方图标和配色"

关键点:
  - 使用K8s形状库
  - 分层布局（Master → Workers → Storage）
  - 使用不同颜色区分组件类型
```

### CI/CD流程图

```yaml
提示词:
  "绘制GitLab CI/CD流程：
  1. 代码提交 → GitLab
  2. 触发Pipeline → Build → Test → Deploy
  3. 部署环境：Dev, Staging, Production
  4. 每个环节显示通过/失败状态"

关键点:
  - 水平时间线布局
  - 使用不同颜色表示环节状态
  - 添加条件分支（测试失败则停止）
```

---

## 📚 形状库参考

### 常用形状分类

```yaml
基础形状:
  - Rectangle (矩形)
  - Rounded Rectangle (圆角矩形)
  - Circle (圆形)
  - Ellipse (椭圆)
  - Diamond (菱形)

流程图:
  - Process (处理)
  - Decision (判断)
  - Start/End (开始/结束)
  - Data (数据)
  - Database (数据库)

云服务商:
  - AWS: Lambda, S3, RDS, EC2, API Gateway
  - Azure: Functions, Blob Storage, SQL Database
  - GCP: Cloud Functions, Cloud Storage, Cloud SQL

容器化:
  - Docker: Container, Image, Volume
  - Kubernetes: Pod, Service, Deployment, ConfigMap
```

---

**💡 提示**: 保存这些案例作为模板，需要时快速复用！
