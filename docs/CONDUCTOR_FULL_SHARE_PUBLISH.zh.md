# 从 Spec Kit、BMAD 到 Conductor

## 为什么我最后更认同 Context-Driven Development（上下文驱动开发）

过去一段时间，AI 编程的方法论已经明显进入了下一阶段。

最早大家讨论的是：要不要先写 `spec`（规格），要不要先 `plan`（规划），要不要避免直接 `vibe coding`（凭感觉一路写代码）。但当这些共识慢慢建立之后，真正拉开差距的问题变成了：

不是“你有没有文档”，  
而是“你的文档到底是一次性输入，还是长期工程资产”。

这也是我为什么会从 `Spec Kit`、`BMAD`，最后越来越认同 `Conductor`，尤其是我在 `oh-my-codex` 里改造后的 `Conductor`。

我现在更倾向这样理解三者：

- `Spec Kit` 解决的是：一个功能如何从 `spec`（规格）走到 `plan`（计划）、`tasks`（任务）再到实现。
- `BMAD` 解决的是：一个项目如何通过 PM、Architect、Developer、QA 等 `roles`（角色）进入完整的 `AI-driven agile workflow`（AI 驱动敏捷流程）。
- `Conductor` 解决的是：一个项目的长期上下文，如何脱离聊天窗口，沉淀成仓库里的 `durable context`（持久上下文）。

如果只用一句话总结：

> `Spec Kit` 更像功能开发流水线，`BMAD` 更像角色化研发流程，`Conductor` 更像项目上下文操作系统。

这三个方向都成立，但它们解决的问题层级不一样。

---

## 一张表先讲清楚：Spec Kit、BMAD、Conductor 到底差在哪

| 维度 | Spec Kit | BMAD | Conductor |
|---|---|---|---|
| 核心定位 | `Spec-Driven Development`（规格驱动开发） | `AI-driven Agile Framework`（AI 驱动敏捷框架） | `Context-Driven Development`（上下文驱动开发） |
| 中心对象 | 单个 `feature`（功能） | 项目流程与角色协作 | 项目长期上下文 |
| 核心产物 | `spec / plan / tasks` | `PRD / Architecture / Epic / Story / Context` | `track / spec / plan / workflow / facts` |
| 最强能力 | 把需求讲清楚再实现 | 把 AI 放进完整研发流程 | 让上下文跨会话、跨成员、跨 agent 可恢复 |
| 更适合 | 绿地项目、边界清晰功能 | 中大型项目、角色清晰团队 | 棕地项目、动态需求、多人多 agent 协作 |
| 可能变重的地方 | 过于 `feature-centered`（功能中心化） | 文档链路和角色链路较长 | 如果不做分层，会重新变成流程负担 |

所以问题不是谁“更高级”，而是谁更适合你正在面对的问题。

如果你的问题主要是“需求没讲清楚”，那 `Spec Kit` 很好。  
如果你的问题主要是“团队要有完整角色化流程”，那 `BMAD` 很强。  
但如果你的问题是“需求持续变化、代码持续演进、上下文持续漂移”，那我更倾向 `Conductor`。

---

## 为什么我最后更认同 Conductor

因为我在真实项目里碰到的痛点，并不是“没有 spec”，而是：

- 代码和文档同时在变
- 多个人和多个 agent 在并行推进
- 需求在实现过程中继续变化
- 文档很快开始落后于现实
- 一旦要求所有文档都同步更新，维护成本会迅速爆炸

这就是很多团队后面会遇到的典型问题：

不是没有文档，  
而是文档开始变成负担。

我后来越来越认同 `Gemini Conductor`，就是因为它一开始解决的就不是“怎么再写一份更好的 spec”，而是：

> 怎么把项目里真正长期有效的上下文，从易失的聊天窗口里拿出来，变成仓库里的稳定工件。

这个定位和 `Spec Kit`、`BMAD` 是明显不同的。

- `Spec Kit` 的中心是功能规格链
- `BMAD` 的中心是角色化流程链
- `Conductor` 的中心是长期上下文系统

这也是为什么我会说，`Conductor` 更像 `context operating system`（上下文操作系统），而不是一个更重的 spec 模板。

---

## 为什么它更适合动态需求

动态需求真正的问题，从来不是“需求会变”。

需求会变本来就是正常的。真正的问题是：文档结构和变化结构不匹配。

很多传统文档流默认一件事：

> 所有文档都应该时刻最新、处处一致、完整反映当前现实。

这在现实工程里几乎是不可能长期成立的。尤其在 `brownfield`（棕地项目）和多人并行环境里，一旦这么要求，文档就会迅速变成团队负担。

`Conductor` 更现实的地方在于，它并不要求“所有文档都实时追着代码跑”，而是把文档拆成不同层级：

- 稳定的项目级意图
- 当前工作单元的意图
- 当前代码和 git 状态反映出来的事实

这意味着需求变化时，不需要回头重写一整套文档系统，只需要影响真正属于那一层的内容。

这也是我认为 `Conductor` 比很多传统 spec 流更可持续的地方：

> 它不是要冻结变化，而是要给变化一个不会把系统拖垮的承载结构。

---

## 一个真实项目让我确认了这件事：Loomy

我在 `Loomy` 里的实践，基本让我把这个判断坐实了。

`Loomy` 不是一个简单聊天框，而是一个 Electron + React + Vite 的桌面 AI 应用，背后有：

- 本地 runtime（运行时）
- Skills（技能系统）
- MCP（模型上下文协议工具）
- 远程通道
- Memory（记忆系统）
- Provider（模型供应商）配置
- 打包和桌面分发

到了这个复杂度以后，项目的难点就不再是“某个功能有没有 spec”，而是：

- 运行时和宿主环境冲突
- 多配置源冲突
- 提示词和 memory 互相打架
- 多人并行开发导致上下文漂移
- 文档很难全量同步

这时候如果继续沿着“大而全文档流”推进，文档只会越来越重。

我最后在 `Loomy` 里采用的方式，是先建立项目级稳定上下文：

- `product.md`
- `tech-stack.md`
- `workflow.md`

然后重要需求不再升级成庞大的 PRD 树，而是进入 `track`（工作轨道 / 工作单元）：

- 每个重要工作有独立目录
- 每个工作单元有自己的 `spec.md`
- 每个工作单元有自己的 `plan.md`

比如侧边栏活动位升级那条需求，它最后不是以“一段聊天历史”存在，而是以一条独立 track 存在。这样需求变化时，影响的是当前工作单元，而不会反向拖垮整个项目级文档系统。

这让我越来越确认：

> 真正高价值的不是“更多文档”，而是“按变化边界分层的文档”。

---

## 但我真正认同的，不是原样 Gemini Conductor，而是改造后的 Conductor

这也是最关键的一点。

我自己做的，不是把 `Gemini Conductor` 原样搬到 Codex，而是先做了一个判断：

如果 `Conductor` 继续被当成“唯一执行工作流”，它迟早也会重新变成负担。

而是把它重新定义成：

> `durable context layer`（持久上下文层）

这句话非常重要。

它意味着：

- `Conductor` 负责管理长期上下文
- 负责维护 `track / spec / plan`
- 负责恢复当前焦点工作
- 负责审查和对齐
- 但它不再试图包办所有编码动作

换句话说：

`Conductor` 不再是“唯一 workflow（工作流）”，  
而是“长期上下文基础设施”。

这一步几乎就是它能不能在动态需求里真正落地的分水岭。

---

## 当前的Conductor 是怎么工作的

当前版本的主循环是：

```text
Refresh -> Spec -> Plan -> Implement -> Review -> Reconcile
```

可以翻成：

- `Refresh`（刷新）：从代码、配置、git 状态提取项目事实
- `Spec`（规格）：明确当前工作单元的需求边界
- `Plan`（计划）：把规格拆成阶段和任务
- `Implement`（实现）：按计划推进代码实现
- `Review`（审查）：对照 spec、plan、workflow 和代码规范审查
- `Reconcile`（对齐）：当意图和事实不一致时做显式对齐

它默认把工件放在 `conductor/` 下，核心结构包括：

- `product.md`
- `product-guidelines.md`
- `tech-stack.md`
- `workflow.md`
- `tracks.md`
- `tracks/<track_id>/spec.md`
- `tracks/<track_id>/plan.md`

这里最重要的抽象是 `track`（工作轨道 / 工作单元）。

重要工作不是记在聊天里，而是先变成一个 track。  
一旦变成 track，它就拥有自己的规格、计划、状态和生命周期。

这就让“当前工作是什么、做到哪一步了、下一步干什么”这些信息不再依赖聊天历史，而依赖磁盘工件。

---

## 当前版本最关键的升级：意图层和事实层分离

这是我认为Gemini conduct 改造后版本最重要的设计。

当前版本把上下文拆成两层：

### `intent layer`（意图层）

这些内容由人确认、相对稳定，不应该被机器静默改写：

- `product.md`
- `product-guidelines.md`
- `tech-stack.md`
- `workflow.md`
- `tracks.md`
- `spec.md`
- `plan.md`

### `facts layer`（事实层）

这些内容由机器根据代码、配置和 git 状态刷新，可以高频变化：

- `conductor/current.md`
- `conductor/_meta/freshness.json`
- `conductor/_meta/drift.md`

这个分层直接解决了动态需求下“文档为什么会变重”的根本矛盾。

因为问题从原来的：

> “为什么所有文档都跟不上代码？”

变成了：

> “哪些是稳定意图，哪些是当前事实，它们之间有没有 `drift`（漂移）？”

这一步看起来只是文件变多了三份，但方法论完全不一样了。

---

## 为什么这会大幅缓解文档负担

因为它承认了一件以前大家不愿意正面承认的事：

> `drift`（漂移）是正常的，`silent drift`（静默漂移）才是危险的。

当前 Conductor 并不要求：

- 所有文档时刻和代码一致
- 所有变化立刻回写所有意图文档
- 所有实现严格服从静态文档

它要求的是：

- 代码是 runtime truth（运行时真相）
- 文档是 durable intent（持久意图）
- 当前事实由 facts layer 负责暴露
- 一旦意图和事实分叉，必须被显式记录
- 需要时再 `reconcile`（对齐），而不是偷偷改写

这就把文档从“必须实时镜像现实”的重负中解放出来了。

所以我现在更愿意把 Conductor 看成一种 `context governance`（上下文治理）方法，而不是一种更重的文档流。

---

## 当前版本和 Gemini Conductor 的相同点

虽然这是改造版，但它保留了 Gemini Conductor 最重要的几条主线：

- 依然默认使用 `conductor/` 目录
- 依然把重要工作抽象成 `track`
- 依然要求重要工作有 `spec.md` 和 `plan.md`
- 依然把 `review` 当成一等命令
- 依然强调长期上下文落盘，而不是只依赖聊天历史

也就是说，它保留了 Conductor 的“精神内核”。

---

## 当前版本和 Gemini Conductor 的关键区别

真正的差别主要在四点。

### 1. 身份定位不同

原始 Gemini Conductor 更接近一个完整的 `spec-driven execution flow`（规格驱动执行流）。

当前版本则更明确：

> Conductor 是 `durable context layer`，不是唯一执行工作流。

### 2. 执行哲学不同

当前版本明确采用：

1. `native repo understanding first`（先理解真实代码库）
2. `Conductor context second`（再读取 Conductor 上下文）
3. `native skills / subagents third`（再调用原生技能和子智能体）
4. `reconcile after meaningful changes`（有显著变化后再对齐）

这能避免文档和代码抢 `source of truth`（真相来源）。

### 3. 新增了 facts layer（事实层）

这一步是当前版本最重要的增强。  
它让系统不再执着于“文档永远完美同步”，而是允许现实先跑、事实后刷、意图再对齐。

### 4. `drift` 成为正式机制

原来很多团队在变化中最容易崩的地方，就是文档已经旧了，但没人愿意承认。  
现在当前版本直接把它做成了正式工件：

- `current.md`
- `freshness.json`
- `drift.md`

这让偏差从“隐患”变成“可管理对象”。

---

## 所以我最后更认同的到底是什么

不是 Conductor 作为“更重的 spec 流程”。  
也不是 Conductor 作为“所有任务必须经过的一套大流程”。

我真正认同的是：

> `Conductor` 作为 `durable context layer`（持久上下文层）的用法。

因为它解决的是一个更现实的问题：

不是“怎么让 AI 多写几份文档”，  
而是“怎么让真正有价值的上下文，持续留在仓库里，并且不会因为需求变化而反噬团队”。

所以如果让我再用一句话收束：

`Spec Kit` 强在功能规格链，  
`BMAD` 强在角色化流程，  
而 `Conductor`，尤其是改造后的 `Conductor`，强在长期上下文治理。

这也是为什么在 `brownfield`（棕地项目）、`dynamic requirements`（动态需求）、多人多 agent 协作的环境里，我最后更认同 `Context-Driven Development`（上下文驱动开发）。

---