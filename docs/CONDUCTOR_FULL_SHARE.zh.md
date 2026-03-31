# 从 Spec Kit、BMAD 到 Conductor

## 为什么我最后更认同 Context-Driven Development（上下文驱动开发）

> 这是一篇完整分享稿。  
> 目标不是只介绍某个工具，而是讲清楚三个问题：
>
> 1. `Spec Kit`、`BMAD`、`Conductor` 分别在解决什么问题  
> 2. 为什么我最后更认同 `Context-Driven Development`（上下文驱动开发，简称 `CDD`）  
> 3. 当前我在 `oh-my-codex` 中改造后的 `Conductor`，是如何工作、如何使用、以及它和 `Gemini Conductor` 的区别是什么

---

## 一、先说结论

过去一段时间，AI 编程方法论的重点已经从“要不要先写文档”变成了“文档到底是一次性输入，还是长期工程资产”。

如果用一句话概括三者差异：

- `Spec Kit`：更像 `Spec-Driven Development`（规格驱动开发）工具箱，核心是把一个功能需求拆成 `spec`（规格）、`plan`（计划）、`tasks`（任务）再交给 AI 执行。
- `BMAD`：更像 `AI-driven agile workflow`（AI 驱动的敏捷研发工作流），核心是把产品、架构、开发、测试等角色和文档链路一起组织起来。
- `Conductor`：更像 `Context-Driven Development`（上下文驱动开发），核心不是“多写文档”，而是“把真正重要的上下文放到仓库里，变成可持续维护、可恢复、可校验的系统”。

也就是说：

- `Spec Kit` 的中心是 `feature pipeline`（功能开发流水线）
- `BMAD` 的中心是 `role-based workflow`（基于角色的流程）
- `Conductor` 的中心是 `durable context`（可持久化上下文）

我最后更认同 `Conductor`，不是因为它“文档更多”，而是因为它对文档更克制，更适合 `brownfield`（棕地项目，已有历史代码和运行现实的项目）和 `dynamic requirements`（动态需求，需求会持续变化的场景）。

---

## 二、为什么今天重新谈这些方法论很重要

现在大部分 AI 编程工具其实都已经接受了一个共识：复杂任务不应该直接编码，而应该先理解上下文、先规划、先澄清需求。

这意味着，真正拉开差距的已经不是“要不要 plan（规划）”，而是：

- 这些 `plan`（规划）和 `spec`（规格）是不是只在当前会话里有效
- 它们是不是会随着聊天结束而失效
- 它们能不能被下一个人、下一个 agent（智能体）、下一个会话继续读取
- 当需求变化时，这些文档会不会反过来变成负担

这也是我后来越来越不满足于只谈 `spec-first`（先规格后编码）的原因。

因为很多团队的问题，不是没有规格，而是：

- 规格只是一次性输入
- 代码一改，文档就旧
- 需求一变，整套文档都得跟着改
- 最后大家都知道文档不准，但又不敢删

所以真正的问题不是“有没有文档”，而是“文档结构是不是和变化结构匹配”。

---

## 三、Spec Kit 是什么，它强在哪里

`Spec Kit` 的核心是 `Spec-Driven Development`（规格驱动开发）。

它强调的主线非常清楚：

1. 不要直接写代码
2. 先写 `spec`（规格说明）
3. 再写 `plan`（实施计划）
4. 再拆成 `tasks`（任务）
5. 最后再 `implement`（实现）

它的价值在于，它把“模糊需求”转成了“结构化输入”。

### 它强的地方

- 适合单个 `feature`（功能）从模糊走向清晰
- 适合 `greenfield`（绿地项目，从零开始的新项目）
- 适合避免一上来就 `vibe coding`（凭感觉一路写代码）
- 适合要求 AI 严格围绕规格执行

### 它的天然边界

`Spec Kit` 本质上更偏 `feature-centered`（以功能为中心）。

它特别擅长回答的问题是：

> “这个功能怎么从规格走到实现？”

但它不天然擅长回答另一个问题：

> “当项目级上下文、技术现实、团队约束、当前焦点和代码现状同时变化时，怎么维持长期一致性？”

所以如果项目问题主要发生在“某个功能范围内”，`Spec Kit` 很强。  
但如果项目问题更多发生在“上下文漂移”和“长期协作”层面，它就不是最核心的武器。

---

## 四、BMAD 是什么，它强在哪里

`BMAD` 更像一个 `AI-native agile framework`（AI 原生敏捷框架）。

它不是只关心一个功能怎么做，而是在组织整套研发流程。它通常会引入：

- `PRD`（Product Requirements Document，产品需求文档）
- `Architecture`（架构设计）
- `Epic / Story`（史诗 / 用户故事）
- `Project Context`（项目上下文）
- 不同 `agent roles`（智能体角色），例如 PM、Architect、Developer、QA

### 它强的地方

- 适合中大型项目
- 适合多人协作
- 适合角色清晰、阶段明确的团队
- 适合把 AI 放进一套完整的研发组织结构中

### 它的天然边界

`BMAD` 的长处是 `workflow completeness`（流程完整性），但这也意味着它更重。

一旦项目进入高频变化状态，你很容易遇到一个现实问题：

- 很多变化只够形成一个工作单元
- 但还不值得重走一整套 `PRD -> Architecture -> Epic -> Story` 链路

这时候，完整性本身就可能变成维护成本。

---

## 五、Gemini Conductor 的原始定位，为什么和前两者不一样

这是最重要的一点。

Google 在介绍 `Gemini Conductor` 时，用的不是 `Spec-Driven Development`（规格驱动开发），而是 `Context-Driven Development`（上下文驱动开发）。

这个命名不是措辞差异，而是方法论差异。

### Gemini Conductor 的核心定位

它要解决的不是：

> “怎么多写一份更完整的 spec？”

而是：

> “怎么把项目里长期有效、跨会话有效、跨成员有效的上下文，从聊天窗口里拿出来，放进仓库里？”

也就是说，Gemini Conductor 的第一性原理是 `durable context`（持久上下文），不是 `spec generation`（规格生成）本身。

### 它关心的核心对象

Gemini Conductor 关注的是：

- 项目目标是什么
- 当前技术栈是什么
- 团队 workflow（工作流）是什么
- 当前 focus（焦点）工作是什么
- 已接受的要求是什么
- 正在执行的 plan（计划）是什么
- 下一次会话如何从磁盘恢复这些上下文

这和 `Spec Kit`、`BMAD` 的差异非常明显：

- `Spec Kit` 更强调“功能规格链”
- `BMAD` 更强调“角色化研发流程”
- `Conductor` 更强调“长期上下文系统”

---

## 六、为什么我最后更认同 Conductor

因为我在真实项目里遇到的问题，不是“没有 spec”，而是“spec 很快就不再是最关键的问题”。

在 `brownfield`（棕地项目）和 `dynamic requirements`（动态需求）里，更痛的事情通常是：

- 代码和文档同时在变
- 多个人或多个 agent 并行修改
- 需求在实现过程中继续变化
- 现实代码和原始计划开始分叉
- 如果你强行要求所有文档时刻同步，维护成本会暴涨

这时候，文档很容易从 `asset`（资产）变成 `tax`（税负）。

### Conductor 的关键价值

Conductor 的价值不在于“文档更全”，而在于它重新定义了文档的职责：

- 不是所有文档都要追着变化跑
- 不是所有变化都要升级成大而全的产品文档
- 不是所有实现都必须严格服从静态文档
- 而是要把真正值得长期保存的上下文，结构化地沉淀下来

所以我更认同 `Context-Driven Development`，不是因为它更“重”，而是因为它更“分层”。

---

## 七、为什么 Conductor 比传统文档流更不容易成为负担

### 1. 它不是要求“所有文档都实时同步”

传统文档流最容易出问题的地方，是默认：

> 文档必须永远最新、永远全面、永远和代码完全一致

这在动态需求里几乎不成立。

Conductor 更现实，它实际上是在说：

- 有些内容是稳定意图，适合慢更新
- 有些内容是当前事实，适合快刷新
- 两者不一致时，不要假装没发生，而要显式记录差异

这会让维护成本下降很多。

### 2. 它按“变化边界”分层，而不是按“理想流程”铺满

Conductor 更像这样组织文档：

- 项目级文档存稳定规则
- 工作单元级文档存当前任务意图
- 当前代码事实放到独立 facts（事实）层

这样一个需求变化时，不需要回头改所有文档，只需要影响对应层。

### 3. 它承认 `drift`（漂移）是正常的，但不允许 `silent drift`（静默漂移）

动态需求里最危险的不是“文档过时”，而是“大家假装文档没过时”。

Conductor 更成熟的地方在于，它承认：

- 代码可能跑得比文档快
- 文档可能阶段性滞后
- 需求可能在实现中重新收敛

但这种偏差必须被记录、被看见、被后续 `reconcile`（对齐 / 协调）。

这比强制“文档永远正确”现实得多。

---

## 八、当前我在 oh-my-codex 里改造后的 Conductor 是什么

我在 `oh-my-codex` 里做的，不是把 Gemini Conductor 原样移植，而是做了一个 `Codex-native adaptation`（Codex 原生适配）。

这个版本的核心判断是：

> Conductor 不应该是唯一执行工作流，而应该是 `durable context layer`（持久上下文层）。

### 当前版本的工作主循环

当前 `Conductor` 技能定义里的主循环是：

```text
Refresh -> Spec -> Plan -> Implement -> Review -> Reconcile
```

中文理解如下：

- `Refresh`：刷新事实层，从代码、配置、git 状态提取当前项目事实
- `Spec`：明确当前 track（工作轨道 / 工作单元）的规格
- `Plan`：把规格拆成可执行阶段和任务
- `Implement`：按计划推进实现
- `Review`：对照 spec、plan、workflow 和代码做审查
- `Reconcile`：当意图和事实出现偏差时，对齐更新

这个循环的重点不是“所有事情都要严格顺序执行”，而是“长期上下文和现实代码之间要持续可对齐”。

---

## 九、当前 Conductor 的核心工作机制

### 1. 它首先是一个磁盘上的上下文系统

当前版本默认把所有持久工件放在 `conductor/` 目录下。

核心目录结构如下：

```text
conductor/
├── product.md
├── product-guidelines.md
├── tech-stack.md
├── workflow.md
├── tracks.md
├── code_styleguides/
├── tracks/
│   └── <track_id>/
│       ├── metadata.json
│       ├── spec.md
│       └── plan.md
└── archive/
```

这些文件分别承担不同职责：

- `product.md`：产品定位、目标、边界
- `product-guidelines.md`：产品 / 体验约束
- `tech-stack.md`：技术栈和工程约束
- `workflow.md`：任务生命周期、测试、质量门禁、提交规则
- `tracks.md`：所有工作单元总表
- `spec.md`：某个 track 的需求规格
- `plan.md`：某个 track 的分阶段任务计划

这说明它不是“prompt 模板”，而是“仓库内上下文系统”。

### 2. 它把工作单元抽象成 `track`（工作轨道 / 工作单元）

在当前 Conductor 里，重要工作不是直接记在聊天里，而是先变成一个 `track`。

`track` 的作用是：

- 把重要工作从即时会话中抽离出来
- 给这项工作一个独立目录
- 让它拥有自己的 `spec.md` 和 `plan.md`
- 允许后续 review、revert、archive（归档）等生命周期操作

这比“今天聊一个需求，明天再翻历史消息”稳定得多。

### 3. 它通过 `tracks.md` 建立项目级优先级和焦点

`tracks.md` 不是简单列表，而是一个 `registry`（注册表 / 总表）。

当前版本明确规定：

- 保留 track 的书写顺序
- 优先选择第一个 `[~]` 的 track 作为当前 focus（焦点）
- 如果没有 `[~]`，则选择第一个 `[ ]` 的 track
- `[x]` 代表已完成

状态标记含义：

- `[ ]`：Pending（待处理）
- `[~]`：In Progress（进行中）
- `[x]`：Completed（已完成）

这保证了多会话和多人协作时，当前工作焦点是可恢复的，不依赖聊天记忆。

### 4. 它现在采用 `intent layer`（意图层）和 `facts layer`（事实层）分离

这是当前版本最重要的机制升级。

#### 意图层

由人工主导、相对稳定、不应被静默改写的内容：

- `product.md`
- `product-guidelines.md`
- `tech-stack.md`
- `workflow.md`
- `tracks.md`
- `spec.md`
- `plan.md`

#### 事实层

由机器根据代码和 git 状态刷新、允许高频变化的内容：

- `conductor/current.md`
- `conductor/_meta/freshness.json`
- `conductor/_meta/drift.md`

这个设计直接解决了动态需求下“文档负担”的核心问题：

- 不是要求所有文档时刻同步
- 而是要求意图和事实的差异可见

### 5. 它把 `drift`（漂移）当成一等概念

当前版本明确承认：

- `tech-stack.md` 可能和依赖不一致
- `plan.md` 可能已经落后于代码
- `tracks.md` 状态可能和实际实现进度不一致
- 大改动可能发生在还没更新文档之前

Conductor 不要求这些差异“不存在”，而是要求它们被记录到：

- `current.md`
- `freshness.json`
- `drift.md`

这就是为什么它比传统文档流更适合动态需求。

---

## 十、当前 Conductor 的使用方式

### 1. 什么时候该用 Conductor

当前技能定义里很明确：

适合使用 Conductor 的情况：

- 需要在磁盘上保留 `track/spec/plan/review` 工件
- 需要长期上下文管理
- 需要跨会话恢复当前工作
- 需要多阶段、可治理的实现流
- 需要 review / archive / revert 这些生命周期操作

不适合使用 Conductor 的情况：

- 小任务
- 一次性修改
- 不值得新建磁盘工件的工作

也就是说，Conductor 不是默认 workflow（工作流），而是重要工作的 workflow。

### 2. 当前命令面

当前版本已经明确支持这些核心动作：

| 命令 | 中文说明 | 作用 |
|---|---|---|
| `Setup` | 初始化 | 在项目里建立 `conductor/` 目录和基础文档 |
| `Refresh` | 刷新事实层 | 从代码、配置、git 刷新当前项目事实 |
| `New Track` | 创建新工作单元 | 为新功能或修复创建 `track/spec/plan` |
| `Implement` | 执行计划 | 按 track 的计划推进实现 |
| `Review` | 审查实现 | 对照 spec、plan、workflow、代码规范审查 |
| `Status` | 查看状态 | 查看所有 track 的当前进度和焦点 |
| `Revert` | 回滚 | 按 track / phase / task 做 git-aware 回退 |

### 3. 一个典型使用流程

#### 第一步：初始化

适用场景：

- 仓库还没有 `conductor/`
- 想把项目长期上下文正式落盘

产物通常包括：

- `product.md`
- `product-guidelines.md`
- `tech-stack.md`
- `workflow.md`
- `tracks.md`
- `code_styleguides/`

#### 第二步：创建 track

当出现一个重要任务时，不是直接开始写代码，而是创建一个新 `track`。

这个过程会生成：

- `metadata.json`
- `spec.md`
- `plan.md`
- 并把它登记进 `tracks.md`

#### 第三步：开始实现

实现阶段不是“自由发挥”，而是：

1. 根据 `tracks.md` 选择当前焦点 track
2. 读取 `spec.md`
3. 读取 `plan.md`
4. 读取 `workflow.md`
5. 如果有 `current.md`，优先读取 facts（事实）
6. 然后再进入真实实现

#### 第四步：Review

当前版本里的 `review` 已经被提升成一等命令，而不是可有可无的收尾动作。

它会对照：

- `spec.md`
- `plan.md`
- `workflow.md`
- `product-guidelines.md`
- `tech-stack.md`
- `code_styleguides/`
- 当前 diff（代码差异）

也就是说，review 的对象不只是代码，而是“代码是否符合当前上下文系统”。

#### 第五步：Refresh / Reconcile

当项目现实和文档意图出现偏差时，不是立刻静默改写意图层，而是：

1. 先 `refresh` 事实层
2. 暴露 `drift`（漂移）
3. 再决定是否 `reconcile`（对齐）

这一步是当前版本最关键的动态需求缓冲器。

---

## 十一、当前 Conductor 的默认读取顺序

当前版本不是“所有文档一起读”，而是有意做了 `read order`（读取顺序）优化。

推荐顺序是：

1. `conductor/current.md`  
   当前项目事实摘要，如果存在，优先看
2. `conductor/workflow.md`  
   当前任务生命周期和质量门禁
3. 当前 active track（活跃工作单元）的 `spec.md`
4. 当前 active track 的 `plan.md`
5. 只有必要时才看 `product.md`、`tech-stack.md`

这说明当前版本已经不把“所有意图文档都大规模加载”当成默认动作，而是优先最小必要上下文。

这也是减少文档负担的一部分。

---

## 十二、当前版本和 Gemini Conductor 的相同点

虽然当前版本是 `Codex-native adaptation`（Codex 原生改造版），但它保留了 Gemini Conductor 最核心的几个不变量。

### 1. 依然保留 `conductor/` 作为默认计划目录

这一点没有变。

### 2. 依然保留 `track/spec/plan` 作为重要工作的基础工件

重要工作仍然需要：

- `track`
- `spec.md`
- `plan.md`

### 3. 依然保留 `tracks.md` 作为项目级工作总表

焦点、顺序、状态恢复，依然依赖 `tracks.md`。

### 4. 依然把 `review` 当成一等命令

这也是 Gemini Conductor 非常重要的精神之一，当前版本保留了。

### 5. 依然强调长期上下文落盘，而不是只依赖聊天历史

也就是说，Conductor 的“灵魂”还在：

- 长期上下文在磁盘
- 当前工作可恢复
- 重要任务有独立工件

---

## 十三、当前版本和 Gemini Conductor 的关键区别

这部分最重要，因为它解释了为什么我认为“当前改造后的版本更适合动态需求”。

### 区别 1：身份定位变了

Gemini Conductor 更接近一个完整的 `spec-driven execution workflow`（规格驱动执行工作流）。

当前版本则明确把 Conductor 收窄成：

> `durable context layer`（持久上下文层）

含义是：

- Conductor 负责管理上下文和状态
- 但不强制垄断所有实现动作

### 区别 2：执行哲学变了

Gemini Conductor 更偏：

- 先进入 Conductor protocol（协议）
- 再由 Conductor 主导后续动作

当前版本则明确采用：

1. `native repo understanding first`（先理解真实代码库）
2. `Conductor context second`（再读取 Conductor 上下文）
3. `native skills / subagents third`（再进入原生技能或子智能体执行）
4. `reconcile after meaningful changes`（有显著变化后再对齐）

这个变化很关键，因为它防止文档和代码抢 `source of truth`（真相来源）。

### 区别 3：新增了 `facts layer`（事实层）

Gemini Conductor 更强调长期上下文，但当前版本把这一点显式分层成：

- `intent layer`（意图层）
- `facts layer`（事实层）

这使得当前版本对动态需求更友好。

### 区别 4：把 `drift`（漂移）提升成正式概念

当前版本不再假设“文档永远和代码一致”，而是允许：

- 文档暂时落后
- 代码先推进
- 后续再对齐

但差异必须通过：

- `current.md`
- `freshness.json`
- `drift.md`

被显式暴露出来。

这一步几乎就是“文档不会变负担”的关键所在。

### 区别 5：交互方式更 `Codex-native`（Codex 原生）

当前版本已经明确替换掉很多 Gemini-only（Gemini 专属）行为：

- 不依赖 Gemini 扩展式交互
- 不依赖 Gemini 特有 `ask_user` 方式
- 更偏自然语言、Codex 本地命令和原生 subagents（子智能体）

### 区别 6：review 和 refresh 的边界更清晰

当前版本里：

- `review`：负责对照 spec / plan / workflow / diff 审查实现
- `refresh`：负责刷新事实层，但不静默改写意图层

这种职责划分更清楚，更适合长期运行。

---

## 十四、为什么这些区别能缓解动态需求下的文档负担

这一点可以直接总结成四句话。

### 1. 文档不再承担“实时镜像代码”的职责

传统做法里，文档一旦不能实时跟上代码，就开始失效。

当前 Conductor 通过 `facts layer`（事实层）把“当前现实”独立出去，文档不再被迫实时追代码。

### 2. 意图和事实不再混在一起

以前最常见的问题是：

- 产品意图
- 技术现实
- 当前实现状态
- 临时修补历史

全混在一个文档体系里。

当前版本把它们拆开后，变化成本自然下降。

### 3. `drift` 被显式管理，而不是被掩盖

一旦项目允许“先改代码、后对齐”，文档就不需要为了保持表面一致而被频繁重写。

### 4. 实现仍然服从代码现实

当前版本最成熟的一点是：

> Conductor 管上下文，不抢代码作为最终真相的地位。

这会让文档更稳定，也让实现更务实。

---

## 十五、一个真实案例：为什么这套机制在动态需求里更稳

以 `Loomy` 里的实践为例，我并不是先写一个庞大的 PRD，然后要求后续所有变化都围绕它同步。

相反，我先建立项目级稳定上下文：

- `product.md`
- `tech-stack.md`
- `workflow.md`

然后重要需求进入 `track`，例如：

- “将侧边栏‘分享有礼’升级为统一轮播活动位”

这个需求最终有：

- 自己的 `spec.md`
- 自己的 `plan.md`
- 自己的 phase（阶段）
- 自己的任务状态和手工验证节点

这样变化就被限制在当前工作单元范围内，而不会污染整个项目级文档系统。

这就是我为什么说：

Conductor 不是“把文档写更多”，  
而是“让变化只影响该影响的那一层文档”。

---

## 十六、如果只让我用一句话区分三者

可以这样理解：

- `Spec Kit`：把单个功能做成结构化规格链
- `BMAD`：把 AI 放进完整的敏捷角色化流程
- `Conductor`：把项目长期上下文做成仓库里的可持续系统

而我最后更认同 `Conductor`，尤其是当前改造后的版本，是因为它最符合 `dynamic requirements`（动态需求）下的真实工程约束。

它不是追求：

- 所有文档都最全
- 所有流程都最完整
- 所有实现都最标准化

它追求的是：

- 上下文长期有效
- 焦点工作可恢复
- 意图和事实可分层
- 漂移可以被看见
- 文档不会因为变化过快而反噬团队

---

## 十七、我的最终判断

如果你现在面对的是：

- 单个功能开发，边界清晰

那么 `Spec Kit` 很合适。

如果你面对的是：

- 多角色协作、完整研发流程治理

那么 `BMAD` 很合适。

如果你面对的是：

- `brownfield`（棕地项目）
- 需求持续变化
- 多人 / 多 agent 并行
- 上下文容易漂移
- 但你又不想被大而全的文档体系拖垮

那么我更推荐 `Conductor`。

更准确地说，我更认同的是：

> **Conductor 作为 `durable context layer`（持久上下文层）的用法**  
> 而不是 Conductor 作为“唯一执行工作流”的用法。

这也是我最后更认同 `Context-Driven Development`（上下文驱动开发）的根本原因。

---

## 十八、附录：当前 Conductor 的实操建议

### 什么时候应该新建 track

建议新建 `track` 的情况：

- 需求需要跨多步实现
- 需要 `spec.md` 和 `plan.md`
- 需要 review / archive / revert 生命周期
- 需要跨会话恢复

不建议新建 `track` 的情况：

- 只改一个小 bug
- 一次性命令式调整
- 不值得新增磁盘工件

### 当前版本最推荐的使用节奏

```text
1. Setup（初始化）
2. New Track（创建工作单元）
3. Implement（按计划推进）
4. Review（审查实现）
5. Refresh（刷新事实）
6. Reconcile（必要时对齐）
```

### 当前版本最重要的心法

不是让文档永远完美，  
而是让上下文永远可恢复。

不是不允许漂移，  
而是不允许静默漂移。

不是让文档替代代码，  
而是让文档和代码之间保持可对齐关系。

---

## 参考材料

### 外部资料

- Google Developers Blog: `Conductor: Introducing context-driven development for Gemini CLI`
- GitHub `Spec Kit`
- BMAD Method 官方文档
- OpenAI Codex 官方文档：`Plan first for difficult tasks`
- OpenAI Codex 官方文档：`AGENTS.md`

### 当前仓库中的关键依据

- `docs/CONDUCTOR_V2_COMPATIBILITY_CONTRACT.md`
- `.agent/skills/conductor/SKILL.md`
- `.agent/skills/conductor/commands/conductor/setup.toml`
- `.agent/skills/conductor/commands/conductor/newTrack.toml`
- `.agent/skills/conductor/commands/conductor/implement.toml`
- `.agent/skills/conductor/commands/conductor/review.toml`
- `.agent/skills/conductor/commands/conductor/refresh.toml`
- `.agent/skills/conductor/commands/conductor/status.toml`

