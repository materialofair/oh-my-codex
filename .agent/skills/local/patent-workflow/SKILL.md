---
name: patent-workflow
description: 三阶段专利撰写workflow（Research → Plan → Implement），借鉴AutoPatent架构，通过 Codex CLI 原生 spawn_agent 派发 explorer/reviewer child agent 协作，确保专利质量和授权率；也用于整理或优化已有 DOCX 专利交底书、保留图片和版式资源并生成新版 Word 文档
auto_invoke: true
tags: [patent, workflow, multi-agent, quality-gate, omc-agents]
version: 0.2.0
source: fork
updated_at: 2026-05-29T11:50:00+08:00
layer: domain
checksum: 917cd56131d6d9db6b2431ba2b2612053881fe48be843576d7199c4a99a80f1e
---

# Patent Workflow Skill - 专利三阶段撰写工作流

## 核心架构

**灵感来源**: AutoPatent多Agent框架 + InstructPatentGPT权利要求优化

**三阶段workflow**:
```
Research阶段 (Planner) → Plan阶段 (Planner) → Implement阶段 (Writer + Examiner)
     ↓                      ↓                         ↓
  专利检索            专利大纲生成              分段撰写 + 质量审查
  术语收集            PGTree结构               IRR检查 + 术语一致性
  发明分析(explorer)   权利要求审查(reviewer)    explorer+reviewer 并行复审
```

**质量门禁**:
- Gate 1: Research → Plan (检索完整性 ≥80%)
- Gate 2: Plan → Implement (大纲完整性 ≥85%)
- Gate 3: Implement → Delivery (质量综合评分 ≥90%)

**交付约束**:
- 最终交付物必须是 Word `.docx` 文件；聊天回复只给文件路径、简短摘要、质量评估和风险说明。
- 如果用户提供已有 `.docx` 交底书并要求优化，默认进入 DOCX 保真优化模式，先保留原文档容器资源，再修改正文。
- 不把完整专利正文作为最终交付直接贴在聊天里；如果当前环境无法生成 `.docx`，先说明阻塞并要求启用 Documents/Word 处理能力或提供可用 DOCX 生成工具。

---

## Native Subagent Protocol (Codex)

Codex CLI 支持原生 child agent。本 skill 在三个阶段都通过 `spawn_agent` 派发只读 subagent，主线 Codex 负责撰写与综合。最小编排：

```text
spawn_agent -> (send_input 可选) -> wait_agent -> close_agent
```

**派发到哪个 agent_type**（对应 `.codex/agents/*.toml` 已有定义）：

| 角色 | agent_type | TOML 默认 | 用于 |
|---|---|---|---|
| 发明架构分析 | `explorer` | medium effort, read-only | Phase 1.3 拆解发明结构、对比 prior-art |
| 权利要求对抗审查 | `reviewer` | high effort, read-only | Phase 2.3 / 3.3 多视角 claims 复审 |
| 文献核验（可选） | `docs-researcher` | medium effort, read-only | Phase 1.2 校验 prior-art 引用真实性 |

**Message framing**（Codex 把 `message` 视作 user-level 输入，按官方建议加 XML 标签）：

```text
Your task is to perform the following. Follow the instructions below exactly.

<agent-instructions>
[本 SKILL 中各 Step 给出的 prompt 内容]
</agent-instructions>

Execute this now. Output ONLY the structured response specified above.
```

**当 child agent 不可用时的 fallback**（参考 ultrapilot 约定）：在单条响应里用 `[EXPLORER]` / `[REVIEWER]` / `[SYNTHESIS]` 块顺序自演三个角色，仍按 prompt 模板输出。

**可选强化**：如需更强专利领域偏置，可在 `.codex/agents/` 新增 `patent-analyst.toml`（基于 explorer）和 `patent-claims-reviewer.toml`（基于 reviewer），把 `developer_instructions` 换成专利特定指令；本 skill 不要求，但能进一步降低发散。

---

## 适用场景

**自动触发条件**:
- 用户说："写专利"、"申请专利"、"专利workflow"
- 用户说："三阶段专利撰写"、"专利质量优化"
- 用户提到："专利检索"、"权利要求优化"、"专利授权率"
- 用户上传 `.docx` 专利交底书并要求："优化交底书"、"生成新版 Word"、"保留图片/附图/题注/格式"

**与现有cn-patent-application的区别**:
- `cn-patent-application`: 单阶段文档模板填充，适合快速生成交底书
- `patent-workflow`: 三阶段系统化workflow，适合高质量专利申请（目标：提高授权率）

---

## Word / DOCX 处理协议

本 skill 生成或优化专利材料时，默认以 `.docx` 作为最终交付格式。优先使用可用的 Documents skill、结构化 DOCX API、`python-docx`、OpenXML 解包编辑或等价工具；选择工具时以“保真”和“可校验”为第一目标。

### A. 新建专利申请 DOCX

适用于用户没有提供原始 Word 交底书，或明确要求生成全新专利申请文本。

1. 先完成 ResearchPack、ImplementationPlan 和 Gate 3 审查，再生成 `.docx`。
2. 文档至少包含：技术领域、背景技术、发明内容、附图说明、具体实施方式、权利要求书、摘要、质量评估报告。
3. 如有附图，先确认图片来源和图号，再插入 Word；不要只在正文写“见图1”却没有实际图片或附件路径。
4. 文件名建议使用 `[发明名称]-专利申请交付包.docx`，并在最终回复中提供绝对路径。

### B. 已上传 DOCX 保真优化模式

适用于用户提供 `.docx` 专利交底书并要求优化、改写、完善、补强权利要求或生成新版 Word。默认启用本模式，除非用户明确要求重新排版。

核心原则：
- 保留原 DOCX 容器资源，而不是从抽取出的纯文本重新生成空白文档。
- 纯文本抽取只能用于理解内容，不能作为最终生成 Word 的唯一来源。
- 优先修改原文档解包后的 `word/document.xml` 及确需修改的页眉、页脚、脚注、尾注或批注 XML。
- 不删除或重命名 `word/media/*`；不移除仍被正文引用的 `word/_rels/document.xml.rels` 图片关系；不破坏 `[Content_Types].xml` 中的图片类型声明。
- 尽量保留图片、附图题注、图号、编号、表格、样式、页眉页脚、脚注、批注和修订痕迹。

执行步骤：
1. 识别输入文档：记录原始 `.docx` 路径、输出路径、用户指定的优化目标和必须保留的资源。
2. 建立资源清单：统计 `word/media/*` 图片数量、文件名和可行时的哈希；统计图片 relationship 数量和 target；记录题注、图号和图片附近段落。
3. 执行保真编辑：只改需要优化的正文、权利要求、摘要、质量报告等文字；如需新增章节，把新内容插入原文档结构，不覆盖整份文档。
4. 重打包输出：基于修改后的原 DOCX 目录生成新版 `.docx`。
5. 交付前校验：比对优化前后图片数量、文件名、哈希和 relationship；发现图片丢失、关系断裂或题注错位时先修复，不交付缺图文档。

### C. 允许重排版的例外

只有满足以下任一条件，才允许创建全新 `.docx` 替代保真编辑：
- 用户明确要求“重新排版”“不要保留原版式”。
- 原 DOCX 损坏、无法解包、无法编辑或不是真正的 Word 文档。
- 原文档只是参考资料，用户明确要求生成全新的专利申请文本。

即便重排版，也要优先提取原图片并重新插入新版 Word；如果无法保留图片，必须在质量评估报告和最终回复中标注图片/版式风险。

---

## Phase 1: Research阶段 - 专利检索与技术分析

**角色**: Planner Agent
**目标**: 检索相关专利、收集术语、分析技术布局
**时间**: 15-20分钟

### Step 1.1: 技术信息收集（5分钟）

```yaml
向用户提问收集（Codex CLI 直接以问答方式获取）:
  发明概述:
    Q: "请简要描述你的发明（1-2句话）"
    示例: "一种基于联邦学习的用户建模方法，保护数据隐私"

  技术领域:
    Q: "涉及哪些技术领域？（用于检索相关专利）"
    示例: "联邦学习、隐私计算、机器学习、用户画像"

  核心创新点:
    Q: "与现有技术相比，你的核心创新是什么？"
    示例: "使用第三方鉴权节点进行ID对齐，避免数据外泄"

  Word文档输入:
    Q: "是否已有 DOCX 交底书需要优化？如果有，是否必须保留图片、题注、表格、页眉页脚、批注或修订痕迹？"
    默认: "已有 DOCX 时启用保真优化模式；无 DOCX 时生成全新专利申请 Word"
```

### Step 1.2: 专利检索（10分钟）

**检索策略**:

```yaml
工具链:
  1. exa-code检索 (优先):
     query: "[技术领域] patent prior art analysis"
     tokensNum: 5000
     目的: 获取高质量专利文献和技术术语

  2. WebSearch / WebFetch (备选):
     query: "[发明关键词] 专利 现有技术"
     目的: 补充中文专利信息（CNIPA、知网等）

  3. Context7检索 (可选):
     libraryID: 专利领域相关库
     topic: "patent drafting best practices"
     目的: 获取撰写标准和术语规范

检索内容:
  现有专利布局:
    - 相关专利数量和趋势
    - 主要专利权人
    - 技术演进路径

  技术术语库:
    - 标准技术术语
    - 权利要求常用表述
    - 避免的模糊词汇

  现有技术方案:
    - 主流解决方案（2-3个）
    - 技术缺陷和局限性
    - 技术发展方向
```

### Step 1.3: 派发 explorer subagent 做发明架构分析（5分钟）

`spawn_agent(agent_type="explorer", message=<下方框架>)`，主线 `wait_agent` 取回结果后 `close_agent`。

**Message 框架**（已套上 Codex 推荐的 XML 包装）：

```text
Your task is to perform the following. Follow the instructions below exactly.

<agent-instructions>
You are doing pre-drafting analysis for a patent application. Read-only.
Do not propose claim text. Cite sources by URL or by patent number.

Inputs:
  - Invention summary: [发明概述]
  - Technical domain: [技术领域]
  - Core innovation claim: [核心创新点]
  - Prior art shortlist (from Step 1.2): [代表性专利号 + URL 列表]
  - Terminology pool (from Step 1.2): [术语列表]

Deliver a markdown report with these sections:
  1. 架构层次拆解（模块 / 数据流 / 控制流）
  2. 核心创新点 vs 次要创新点（每条附 prior-art 对比证据）
  3. 与现有专利技术路线的差异面（表格：本发明 / 代表性 prior art / 差异）
  4. 专利保护策略建议:
     - 推荐独立权利要求宽度: 宽 / 中 / 窄（附理由）
     - 建议保留的可选技术特征（供从属权利要求使用）
  5. 不确定性 / 信息缺口（供 Quality Gate 1 判断是否需要补检）
</agent-instructions>

Execute this now. Output ONLY the structured markdown report.
```

**为什么选 `explorer` 而不是 `reviewer`**：
- `explorer.toml` 的 developer_instructions 是 "Stay in exploration mode. Trace the real execution path, cite, avoid proposing fixes" —— 恰好匹配 Research 阶段"只分析、不出权利要求"。
- `reviewer` 留给 Plan / Implement 阶段做对抗式 claims 评审，避免角色重叠。
- 若发明本质是某个仓库的代码改造，可追加一个 `spawn_agent(agent_type="explorer", ...)` 单独跑代码路径调研，不替换本次。

**Fallback（child agent 不可用时）**：主线 Codex 在单条响应中以 `[EXPLORER]` 块自演同样的 prompt，紧跟主线综合。

### Step 1.4: Research阶段输出

**ResearchPack格式**:

```markdown
# 📋 Patent ResearchPack: [发明名称]

## 技术概述
- 发明名称: [标准格式名称]
- 技术领域: [主领域、次领域]
- 核心创新: [1-2句话]
- 技术成熟度: [概念/原型/产品]

## 现有专利布局
### 相关专利统计
- 检索到相关专利: [数量]
- 主要专利权人: [公司/机构列表]
- 技术演进趋势: [分析]

### 代表性专利
1. [专利号] - [专利名称]
   - 技术方案: [简述]
   - 技术缺陷: [分析]
   - 与本发明的区别: [对比]
   来源: [URL]

2. [专利号] - [专利名称]
   ...

## 技术术语库
### 标准术语（从专利文献提取）
- [术语1]: [定义] (来源: [专利号])
- [术语2]: [定义]
...

### 权利要求常用表述
- [表述1]: [示例]
- [表述2]: [示例]
...

### 避免使用的模糊词汇
- ❌ "等"、"或类似"、"大约"
- ❌ "优化"、"改进"（需具体说明如何优化）
- ❌ 主观判断词汇（"优秀"、"高效"）

## Explorer Subagent 技术分析结果
[explorer subagent 输出的架构分析、prior-art 差异、保护策略建议]

## 保护策略建议
### 独立权利要求策略
- 建议范围: [宽/中/窄]
- 核心技术特征: [列表]
- 可选技术特征: [列表]

### 从属权利要求策略
- 优选实施例: [列表]
- 可替代方案: [列表]

## Quality Gate 1检查
- ✅ 检索到≥3个相关专利
- ✅ 技术术语库≥10个术语
- ✅ 现有技术方案分析完整
- ✅ Explorer subagent 分析完成（含保护策略与不确定性清单）
- 综合评分: [X/100] (≥80通过)

## Sources
1. [来源1 URL]
2. [来源2 URL]
...
```

**Quality Gate 1判断**:
- 检索完整性 ≥80分 → 进入Plan阶段
- <80分 → 补充检索或询问用户提供更多信息

---

## Phase 2: Plan阶段 - 专利大纲生成（PGTree模式）

**角色**: Planner Agent
**目标**: 生成结构化专利大纲，设计权利要求层次
**时间**: 15-20分钟

### Step 2.1: PGTree大纲规划（10分钟）

**PGTree (Planning Graph Tree) 结构**:

```yaml
专利文档树形结构:
  根节点: 发明名称

  第一层: 主要章节
    - 技术领域
    - 背景技术
    - 发明内容
    - 附图说明
    - 具体实施方式

  第二层: 章节细分
    发明内容:
      - 发明目的
      - 技术方案
      - 有益效果

    具体实施方式:
      - 实施例1（主要实施例）
      - 实施例2（变形方案）
      - 实施例3（其他应用场景）

  第三层: 段落规划
    技术方案:
      - 总体技术方案（3-5段）
      - 关键技术特征（2-3段）
      - 可选技术特征（1-2段）

大纲生成策略:
  1. 从ResearchPack提取核心创新点
  2. 参考相关专利的章节结构
  3. 使用标准专利术语
  4. 设计3个层次的权利要求
```

### Step 2.2: 权利要求层次设计（5分钟）

**借鉴InstructPatentGPT的策略**:

```yaml
独立权利要求:
  范围设计:
    - 宽权利要求: 保护核心思路（易被规避，但覆盖广）
    - 中权利要求: 保护关键技术特征（平衡）
    - 窄权利要求: 保护具体实施方式（授权率高）

  策略选择:
    高创新度 → 宽权利要求 + 多个从属权利要求
    中创新度 → 中权利要求 + 梯度保护
    低创新度 → 窄权利要求 + 详细实施例

从属权利要求:
  层次1: 进一步限定核心特征
  层次2: 具体实施参数和配置
  层次3: 优选方案和最佳模式

权利要求数量建议:
  独立权利要求: 1-3个（方法、系统、装置）
  从属权利要求: 8-15个（覆盖主要变形）
```

### Step 2.3: 派发 reviewer subagent 做权利要求对抗审查（5分钟）

`spawn_agent(agent_type="reviewer", message=<下方框架>)`，`wait_agent` 取回 → `close_agent`。

**为什么选 `reviewer`**：`.codex/agents/reviewer.toml` 默认 `model_reasoning_effort = "high"` + `sandbox_mode = "read-only"` + "Review like an owner, lead with concrete findings" —— 与权利要求需要承受审查员/规避者/诉讼三方压力测试的特性高度匹配。

**Message 框架**：

```text
Your task is to perform the following. Follow the instructions below exactly.

<agent-instructions>
You are reviewing a *draft* patent claims structure (claims not yet finalized).
Read-only. Do not rewrite claims wholesale. Produce concrete findings only.

Inputs:
  - ResearchPack (Phase 1 输出, 含 prior art + 术语库)
  - 草拟权利要求层次:
      独立权利要求: [列表]
      从属权利要求: [列表]
  - 选定的保护范围档位: 宽 / 中 / 窄

请用四视角对抗方式输出 findings (每条标注视角):
  [审查员视角]   哪些特征会被判"非显而易见性不足"或"权利要求过宽"
  [规避者视角]   哪些措辞最容易被竞争对手设计绕过（给反例）
  [诉讼律师视角] 哪些表述在维权时举证困难
  [代理人视角]   是否符合《专利审查指南》标准范式 / 术语规范

最终结构化输出:
  1. 高风险条款清单（按风险等级排序，每条附"哪个视角发现 / 为什么 / 建议改法"）
  2. 建议补充的限制性术语 / 功能性表述（给出具体替换文本）
  3. 推荐的层级再编排（如有）
  4. 术语一致性问题列表（对照 ResearchPack 术语库）
  5. 总判: 建议返工 Plan / 直接进入 Implement
</agent-instructions>

Execute this now. Output ONLY the five structured sections above.
```

**Fallback**：主线 Codex 在单条响应中用 `[REVIEWER]` 块自演四视角，输出同样 5 个 section。

### Step 2.4: Plan阶段输出

**ImplementationPlan格式**:

```markdown
# 📝 Patent ImplementationPlan: [发明名称]

## 专利大纲（PGTree结构）

### 1. 技术领域
段落1: 本发明涉及[一级领域]，特别涉及[二级领域]
关键术语: [术语列表]

### 2. 背景技术
段落1: 行业现状和技术发展
段落2: 现有技术方案1描述
段落3: 现有技术方案2描述
段落4: 现有技术缺陷总结
关键术语: [术语列表]

### 3. 发明内容

#### 3.1 发明目的
段落1: 本发明要解决的技术问题
关键术语: [术语列表]

#### 3.2 技术方案
段落1: 总体技术方案概述
段落2: 核心技术特征1
段落3: 核心技术特征2
段落4: 可选技术特征
段落5: 技术方案工作流程
关键术语: [术语列表]

#### 3.3 有益效果
段落1: 技术效果1（量化数据）
段落2: 技术效果2（对比优势）
段落3: 技术效果3（附加价值）
关键术语: [术语列表]

### 4. 附图说明
图1: [总体架构图]
图2: [流程图]
图3: [数据流图]

### 5. 具体实施方式

#### 实施例1（主要实施例）
段落1-3: 详细技术方案描述
段落4-5: 关键参数和配置
段落6: 技术效果验证
关键术语: [术语列表]

#### 实施例2（变形方案1）
段落1-2: 变形方案描述
段落3: 与实施例1的区别
关键术语: [术语列表]

#### 实施例3（变形方案2）
段落1-2: 变形方案描述
段落3: 应用场景扩展
关键术语: [术语列表]

---

## 权利要求书结构

### 独立权利要求1（方法）
一种[发明名称]，其特征在于，包括以下步骤：
S1: [步骤1描述，使用标准术语]
S2: [步骤2描述]
S3: [步骤3描述]
...

### 从属权利要求2-5（进一步限定）
2. 根据权利要求1所述的方法，其特征在于，所述[技术特征]包括...
3. 根据权利要求1所述的方法，其特征在于，所述[技术特征]进一步包括...
...

### 独立权利要求6（系统）
一种[发明名称]系统，其特征在于，包括：
模块1: 用于[功能描述]
模块2: 用于[功能描述]
...

### 从属权利要求7-10（系统细化）
...

---

## Reviewer Subagent 审查建议
[reviewer subagent 的四视角对抗审查结果与可执行修改建议]

---

## 实施清单

### 文件准备
- [ ] 创建专利申请书文档
- [ ] 准备附图（流程图、架构图）
- [ ] 准备实验数据（技术效果证明）

### 撰写顺序
1. 先写具体实施方式（最详细）
2. 再写发明内容（提炼核心）
3. 最后写背景技术（对比铺垫）
4. 权利要求书（基于说明书提炼）

### 术语一致性检查
- [ ] 全文使用统一术语（从术语库选择）
- [ ] 避免模糊词汇
- [ ] 技术特征描述完整

---

## Quality Gate 2检查
- ✅ 大纲完整（5个主要章节）
- ✅ 权利要求层次清晰（独立+从属）
- ✅ 段落规划详细（每段有关键术语）
- ✅ Reviewer subagent 审查建议已整合（高风险条款已处理）
- 综合评分: [X/100] (≥85通过)

---

## 回滚策略
如果Plan阶段发现问题：
- 技术方案不够详细 → 回到Research阶段补充检索
- 权利要求范围不合理 → 重新设计权利要求策略
- 术语不规范 → 补充术语库
```

**Quality Gate 2判断**:
- 大纲完整性 ≥85分 → 进入Implement阶段
- <85分 → 补充大纲或重新规划

---

## Phase 3: Implement阶段 - 分段撰写与质量审查

**角色**: Writer Agent + Examiner Agent
**目标**: 按大纲撰写专利文档，多层次质量审查
**时间**: 40-60分钟

### Step 3.1: Writer Agent分段撰写（30分钟）

**撰写策略**:

```yaml
顺序执行:
  1. 具体实施方式 (20分钟):
     - 实施例1（主要实施例，最详细）
     - 实施例2-3（变形方案）
     - 使用ResearchPack的技术术语
     - 参考ImplementationPlan的段落规划

  2. 发明内容 (5分钟):
     - 从实施方式中提炼核心技术方案
     - 量化技术效果（从用户提供的数据）

  3. 背景技术 (3分钟):
     - 使用ResearchPack的现有技术分析
     - 突出现有技术缺陷

  4. 权利要求书 (2分钟):
     - 基于ImplementationPlan的权利要求结构
     - 使用标准专利术语

每段撰写完成后:
  ✓ 检查术语一致性
  ✓ 确保技术方案可实施
  ✓ 避免模糊表述
```

### Step 3.2: Examiner Agent质量审查（10分钟）

**三层审查机制**:

#### Layer 1: IRR重复率检查（AutoPatent借鉴）

```python
# IRR (Inverse Repetition Rate) - 句子重复率检测
def calculate_irr(document):
    """
    检测专利文档中的句子重复
    IRR = 1 - (重复句子数 / 总句子数)

    目标: IRR ≥ 0.85 (重复率 ≤ 15%)
    """
    sentences = extract_sentences(document)
    unique_sentences = set(sentences)

    irr = len(unique_sentences) / len(sentences)

    if irr < 0.85:
        report_repetitive_sections()

    return irr

# Examiner 执行逻辑 (本地 Python 工具, 无 LLM 依赖):
# 1. 读取撰写的专利文档
# 2. 计算IRR指标
# 3. 如果IRR < 0.85，标记重复段落
# 4. 建议改写重复内容
```

#### Layer 2: 术语一致性验证

```yaml
检查内容:
  术语使用:
    ✓ 全文使用统一术语（不得混用同义词）
    ✓ 技术术语与ResearchPack的术语库一致
    ✓ 权利要求书与说明书术语一致

  避免问题:
    ❌ 同一概念使用不同术语
    ❌ 模糊词汇（"等"、"约"、"大致"）
    ❌ 主观判断（"优秀"、"高效"、"先进"）

自动检查:
  1. 提取全文技术术语
  2. 对比ResearchPack术语库
  3. 标记不一致或非标准术语
  4. 建议修正
```

#### Layer 3: 法律合规性检查

```yaml
检查清单:
  新颖性:
    ✓ 技术方案与现有专利有明显区别
    ✓ 创新点清晰可辨

  创造性:
    ✓ 技术方案非显而易见
    ✓ 技术效果有显著提升

  实用性:
    ✓ 技术方案可实施
    ✓ 本领域技术人员能够实现
    ✓ 关键步骤和参数完整

  完整性:
    ✓ 所有章节齐全
    ✓ 权利要求书与说明书对应
    ✓ 附图引用正确
```

### Step 3.3: 并行派发两个 subagent 复审已撰写文档（10分钟）

**编排模式**：在同一条响应中发两次 `spawn_agent`（一个 `explorer`、一个 `reviewer`），各自带独立 message，主线 `wait_agent` 收集两份报告后做综合修订，最后 `close_agent`。

**派发 1 — explorer subagent（技术完整性审计）**:

```text
Your task is to perform the following. Follow the instructions below exactly.

<agent-instructions>
Audit the *written* patent draft for technical completeness. Read-only.

Input: 完整专利文档（说明书 + 权利要求 + 附图说明）
检查项:
  1. 实施例覆盖度: 是否覆盖了 Plan 阶段约定的全部变形方案
  2. 可实施性: 关键步骤 / 参数是否齐全，本领域技术人员能否复现
  3. 技术效果可验证性: 是否有量化指标 / 对比数据
  4. 与 ResearchPack 中 prior art 的差异是否在"背景技术"与"发明内容"显式体现
  5. 附图编号 / 数据流与文字描述的一致性

输出: 缺漏清单（每条标 P0/P1/P2 优先级 + 具体补写建议 + 应插入的章节位置）
</agent-instructions>

Execute this now. Output ONLY the gap list.
```

**派发 2 — reviewer subagent（权利要求授权率复审）**:

```text
Your task is to perform the following. Follow the instructions below exactly.

<agent-instructions>
Adversarial review of *written* claims for authorization-rate optimization. Read-only.

Input: 权利要求书全文 + ResearchPack 中已授权 prior art 的 claim 范式样本
四视角复审:
  [审查员]   新颖性 / 创造性 / 实用性 三性挑战 (逐条标注)
  [规避者]   给出可绕过的反例 (counter-examples)
  [诉讼律师] 哪些表述维权时举证困难
  [代理人]   是否符合最新《专利审查指南》范式

输出:
  - 必改条款列表
  - 每条给出 diff 形式的建议改稿文本
  - 预估授权率影响 (相对当前稿)
</agent-instructions>

Execute this now. Output ONLY the structured diff list.
```

**主线综合修订**（两个 `wait_agent` 都返回后）:
1. 收齐两份 markdown 报告
2. 冲突仲裁：explorer "要补" vs reviewer "要删" 冲突时，按 **"先满足三性，再满足完整性"** 排序
3. 主线 Codex 落盘修订专利文档
4. 进入 Quality Gate 3 打分
5. 评分 <90 时可选再跑一次 `santa-method`（两个独立 reviewer 必须同 pass 才放行）

**Fallback（child agent 不可用）**：主线 Codex 在单条响应中依次输出 `[EXPLORER]`、`[REVIEWER]`、`[SYNTHESIS]` 三块，再落盘修订。

### Step 3.4: Implement阶段输出

**最终专利申请文档**:

```markdown
# 📄 Patent Application: [发明名称]

## 文档信息
- 发明名称: [标准格式]
- 申请类型: 发明专利
- 申请人: [企业/机构]
- 发明人: [姓名列表]
- 文档版本: V1.0
- 生成日期: [日期]

---

## 技术领域
[按ImplementationPlan撰写，使用标准术语]

---

## 背景技术
[现有技术分析，引用ResearchPack]

---

## 发明内容

### 发明目的
[要解决的技术问题]

### 技术方案
[总体方案 + 核心特征 + 可选特征]

### 有益效果
[量化技术效果，对比数据]

---

## 附图说明
图1: [说明]
图2: [说明]
...

---

## 具体实施方式

### 实施例1
[详细技术方案，可实施]

### 实施例2
[变形方案1]

### 实施例3
[变形方案2]

---

## 权利要求书

1. 一种[发明名称]，其特征在于...
   [独立权利要求]

2. 根据权利要求1所述的...
   [从属权利要求]

...

---

## Quality Gate 3评估报告

### IRR重复率检查
- IRR分数: [X.XX] (目标≥0.85)
- 重复段落: [如有]
- 改进建议: [如需要]

### 术语一致性验证
- 术语库使用率: [X%]
- 发现的不一致术语: [列表]
- 修正建议: [具体建议]

### 法律合规性检查
- 新颖性: ✅ 通过
- 创造性: ✅ 通过
- 实用性: ✅ 通过
- 完整性: ✅ 通过

### Codex Subagent 审查建议
#### Explorer subagent 技术完整性审查:
[explorer 的技术方案完整性 + 实施例覆盖度建议（P0/P1/P2 清单）]

#### Reviewer subagent 权利要求审查:
[reviewer 的四视角复审 + 授权率优化建议（diff 形式）]

### 综合质量评分
- IRR检查: [分数]/25
- 术语一致性: [分数]/25
- 法律合规性: [分数]/25
- 双 Subagent 审查: [分数]/25
- **总分**: [X]/100 (≥90通过)

---

## 后续优化建议
[基于质量评估的具体改进建议]

---

## 交付文件
1. 专利申请 Word 文档: [绝对文件路径]/[发明名称]-专利申请交付包.docx
2. 附图或原始图片资源: [文件路径，如单独导出]
3. 质量评估报告: [文件路径或 Word 文档内章节]
4. DOCX 保真结果: [新建文档 / 已基于原交底书保留图片与资源 / 存在需人工确认的图片或版式风险]
```

**Quality Gate 3判断**:
- 综合质量评分 ≥90分 → 交付成果
- <90分 → 根据建议优化后重新审查
- 输入为已有 DOCX 时，原图片文件数、图片 relationship 和仍被引用的题注/图号不得无说明地减少或断裂
- 无法自动校验 DOCX 资源时，必须在质量评估报告列出验证限制和人工复核点

---

## 🤖 完整 Workflow 执行总览

### 完整Workflow执行

```yaml
Step 0: Trigger Detection
  检测到触发词 → 自动加载patent-workflow skill

  询问用户:
    Q: "你希望使用三阶段系统化workflow撰写高质量专利吗？"
       "这个流程需要40-60分钟，但能显著提高专利授权率。"
       选项: [是，使用三阶段workflow] / [否，使用快速模板（cn-patent-application）]

---

Phase 1: Research (15-20分钟)
  ├─ Step 1.1: 收集技术信息 (主动向用户问询)
  ├─ Step 1.2: 专利检索 (exa-code + WebSearch；可选 docs-researcher 校验)
  ├─ Step 1.3: spawn_agent(explorer) 做发明架构分析
  ├─ Step 1.4: 生成ResearchPack
  └─ Quality Gate 1: 检索完整性 ≥80% → Pass

---

Phase 2: Plan (15-20分钟)
  ├─ Step 2.1: PGTree大纲规划
  ├─ Step 2.2: 权利要求层次设计
  ├─ Step 2.3: spawn_agent(reviewer) 做四视角对抗审查
  ├─ Step 2.4: 生成ImplementationPlan
  └─ Quality Gate 2: 大纲完整性 ≥85% → Pass

---

Phase 3: Implement (40-60分钟)
  ├─ Step 3.1: Writer 分段撰写
  │   ├─ 具体实施方式 (20分钟)
  │   ├─ 发明内容 (5分钟)
  │   ├─ 背景技术 (3分钟)
  │   └─ 权利要求书 (2分钟)
  │
  ├─ Step 3.2: Examiner 本地质量审查 (Python 工具)
  │   ├─ IRR 重复率检查
  │   ├─ 术语一致性验证
  │   └─ 法律合规性人工 checklist
  │
  ├─ Step 3.3: 并行 spawn_agent 双复审
  │   ├─ explorer: 技术完整性审查
  │   ├─ reviewer: 权利要求四视角复审
  │   └─ 主线综合修订 (可选 santa-method 对抗收敛)
  │
  ├─ Step 3.4: 生成最终 Word .docx
  │   ├─ 无原始 DOCX: 新建专利申请交付包
  │   └─ 有原始 DOCX: 保真编辑、重打包、校验 media/rels/content types
  └─ Quality Gate 3: 综合质量 ≥90% → Deliver

---

Step Final: Delivery
  ✅ 专利申请 Word .docx
  ✅ 权利要求书、摘要、质量评估报告（写入 Word 或作为同包文件）
  ✅ 附图（如需要；已有 DOCX 时保留原图片和关系）
  ✅ DOCX 保真检查结果
  ✅ 后续优化建议
```

---

## 📊 性能指标与预期效果

### 时间效率

```yaml
传统人工撰写:
  专利检索: 2-4小时
  大纲规划: 1-2小时
  文档撰写: 4-8小时
  质量审查: 2-3小时
  总计: 9-17小时

三阶段workflow:
  Research阶段: 15-20分钟
  Plan阶段: 15-20分钟
  Implement阶段: 40-60分钟
  总计: 70-100分钟

效率提升: 6-10倍
```

### 质量保障

```yaml
质量维度:
  技术方案完整性: AutoPatent的PGTree确保结构完整
  权利要求优化: InstructPatentGPT的RLHF策略提高授权率
  术语一致性: 全流程术语库管理
  重复率控制: IRR指标≥0.85

预期效果:
  专利授权率: 提升15-25%（基于InstructPatentGPT论文数据）
  审查周期: 缩短10-20%（文档质量高，减少补正）
  保护范围: 扩大20-30%（多实施例设计）
```

### Codex Subagent 协作价值

```yaml
explorer subagent 贡献 (.codex/agents/explorer.toml):
  - Research 阶段: 发明架构拆解 + prior-art 差异分析 + 保护策略建议
  - Implement 阶段: 文档技术完整性审查（实施例覆盖度、可实施性、技术效果）
  - sandbox_mode = "read-only"，保证分析独立性，不污染主线撰写
  - "Trace, cite, don't propose fixes" 默认指令与"先分析再起草"语义一致

reviewer subagent 贡献 (.codex/agents/reviewer.toml):
  - Plan 阶段: 四视角对抗审查权利要求结构（审查员 / 规避者 / 诉讼 / 代理人）
  - Implement 阶段: 权利要求成稿的授权率优化与可规避点排查（diff 形式建议）
  - model_reasoning_effort = "high"，对应"严苛 reviewer"角色
  - sandbox_mode = "read-only"，绝对不直接改稿

docs-researcher subagent (可选, .codex/agents/docs-researcher.toml):
  - Phase 1.2 校验 prior-art 引用真实性（链接 / 专利号 / 摘要）
  - 防止幻觉 prior-art 进入 ResearchPack
  - "Verify against primary documentation, do not invent" 默认指令直接复用

主线 Codex 角色:
  - 编排者: 在三个阶段的关键节点 spawn_agent -> wait_agent -> close_agent
  - 撰写者: 唯一可写实体（三个 subagent 全 read-only）
  - 仲裁者: explorer "要补" 与 reviewer "要删" 冲突时按"三性优先 > 完整性"收敛
  - 可选 escalation: 评分仍 <90 时调用 santa-method skill 走双独立 reviewer 对抗收敛

为什么放弃 legacy MCP 路线:
  - 原方案强依赖单一外部 MCP server（已淘汰），故障即整条 workflow 阻塞
  - 改用 Codex 原生 child agent (spawn_agent) ，是 codex CLI 一等公民协议，
    跟 ultrapilot / research / subagent-driven-development 等 skill 互通
  - 必要时仍可由用户显式要求外部顾问模型参与，但不作为默认依赖
```

---

## 🚨 重要注意事项

### 何时使用三阶段workflow vs 快速模板

```yaml
使用三阶段workflow (patent-workflow):
  ✅ 核心技术专利（高价值发明）
  ✅ 需要高授权率（竞争激烈领域）
  ✅ 复杂技术方案（多模块、多实施例）
  ✅ 有时间进行系统化撰写（70-100分钟）

使用快速模板 (cn-patent-application):
  ✅ 防御性专利（快速占位）
  ✅ 简单技术方案（单一实施方式）
  ✅ 时间紧急（需要35-50分钟完成）
  ✅ 技术交底书阶段（后续由代理人完善）
```

### 质量门禁强制执行

```yaml
重要原则:
  ⚠️ 质量门禁不通过，禁止进入下一阶段
  ⚠️ 发现问题，立即回滚到上一阶段修正
  ⚠️ 不能为了速度牺牲质量

门禁标准:
  Gate 1: 研究完整性 ≥80%
    - 检索到≥3个相关专利
    - 术语库≥10个标准术语
    - explorer subagent 技术分析完成

  Gate 2: 大纲完整性 ≥85%
    - 5个主要章节齐全
    - 权利要求层次清晰（独立+从属）
    - reviewer subagent 四视角审查通过

  Gate 3: 综合质量 ≥90%
    - IRR ≥ 0.85
    - 术语一致性检查通过
    - 法律合规性检查通过
    - 双 subagent (explorer + reviewer) 审查建议已整合
```

---

## 💡 最佳实践与技巧

### 专利检索技巧

```yaml
检索策略:
  关键词组合:
    - 技术领域 + 核心方法 + 应用场景
    - 示例: "federated learning + privacy preserving + user modeling"

  时间范围:
    - 优先检索近3-5年专利（最新技术）
    - 补充检索早期专利（基础技术）

  专利分类号:
    - 使用IPC分类号精准检索
    - 示例: G06N 20/00 (机器学习)

术语提取:
  - 从授权专利提取（而非申请中专利）
  - 关注权利要求书的措辞
  - 建立项目专属术语库
```

### 权利要求撰写技巧

```yaml
独立权利要求:
  开头格式:
    "一种[技术方案类型]，其特征在于，包括..."

  技术特征描述:
    ✅ 使用"包括"而非"由...组成"（保护范围更广）
    ✅ 避免绝对词汇（"完全"、"必须"）
    ✅ 使用功能性描述（"用于..."、"配置为..."）

  保护范围控制:
    - 宽权利要求: 只写核心必要特征（3-5个）
    - 窄权利要求: 增加限制性特征（6-10个）

从属权利要求:
  层次设计:
    第1层: 引用独立权利要求，补充1个特征
    第2层: 引用第1层从属权利要求，再补充1个
    第3层: 详细参数和优选值

  避免问题:
    ❌ 从属权利要求引用链过长（≤3层）
    ❌ 从属权利要求过于简单（无实质限定）
```

### IRR优化技巧

```yaml
降低重复率策略:
  1. 变换表述方式:
     - 同一技术特征用不同角度描述
     - 示例1: "数据加密传输"
     - 示例2: "采用加密算法对数据进行加密后传输"

  2. 增加技术细节:
     - 不同实施例补充不同参数
     - 不同场景描述不同应用

  3. 避免模板化表述:
     - 减少"包括但不限于"等套话
     - 每段有新的技术信息

目标IRR值:
  优秀: IRR ≥ 0.90 (重复率 ≤ 10%)
  良好: IRR ≥ 0.85 (重复率 ≤ 15%)
  及格: IRR ≥ 0.80 (重复率 ≤ 20%)
  不合格: IRR < 0.80
```

---

## 📚 参考资源

### AutoPatent项目
- GitHub: https://github.com/QiYao-Wang/AutoPatent
- 核心借鉴: PGTree结构、IRR指标、多Agent框架

### InstructPatentGPT项目
- GitHub: https://github.com/jiehsheng/InstructPatentGPT
- 核心借鉴: RLHF权利要求优化、授权率提升策略

### Codex CLI 系统集成
- Research阶段: 使用 exa-code、WebSearch；`spawn_agent(explorer)` 做架构分析；可选 `spawn_agent(docs-researcher)` 校验 prior-art
- Plan阶段: PGTree 大纲方法论 + `spawn_agent(reviewer)` 做四视角对抗审查
- Implement阶段: Writer 撰写 + Examiner（Python 工具做 IRR/术语/合规）+ 并行 `spawn_agent(explorer)` / `spawn_agent(reviewer)` 双复审
- 可选 escalation: 评分顽固 <90 时调用 santa-method skill 走双独立 reviewer 对抗收敛

### 专利法律法规
- 《中华人民共和国专利法》（2020年修订）
- 《专利审查指南》（2024年版）

---

## 🎯 使用示例

### 示例1: 联邦学习专利（完整三阶段）

```bash
用户: "我想申请一个高质量专利，关于企业间联邦学习的方法，需要高授权率"

Codex:
  ✅ 加载patent-workflow skill
  ✅ 询问使用三阶段workflow（用户同意）

  Phase 1 - Research (18分钟):
    - 收集技术信息（联邦学习、隐私计算）
    - exa-code检索到12个相关专利
    - spawn_agent(explorer) 分析技术架构 + 给出保护策略
    - 生成ResearchPack（术语库15个）
    - Gate 1: 85分通过 ✅

  Phase 2 - Plan (17分钟):
    - PGTree大纲规划（5章节、3实施例）
    - 权利要求设计（1独立 + 9从属）
    - spawn_agent(reviewer) 四视角审查（建议补充2个限制性术语）
    - 生成ImplementationPlan
    - Gate 2: 88分通过 ✅

  Phase 3 - Implement (55分钟):
    - Writer撰写（3个实施例、详细技术方案）
    - Examiner审查（IRR=0.88、术语一致性98%）
    - 并行 spawn_agent: explorer(技术完整性) + reviewer(授权率)
    - 主线综合修订
    - Gate 3: 93分通过 ✅

  交付:
    ✅ 专利申请说明书（17,500字）
    ✅ 权利要求书（1独立 + 9从属）
    ✅ 流程图和架构图
    ✅ 质量评估报告
    ✅ 授权率预估: +20%

总耗时: 90分钟（vs 传统12小时）
```

### 示例2: 快速防御性专利（使用快速模板）

```bash
用户: "我需要快速申请一个防御性专利，占位用，30分钟内完成"

Codex:
  ✅ 检测到"快速"和"防御性"关键词
  ✅ 建议使用cn-patent-application skill（快速模板）

  执行:
    - 使用cn-patent-application skill
    - 35分钟完成技术交底书
    - 质量评分: 78分（及格）

  说明:
    "已使用快速模板完成，适合防御性占位。
     如果后续需要提高授权率，可以使用patent-workflow进行深度优化。"
```

---

## 🚀 快速启动

### 一键启动三阶段workflow

```bash
用户: "使用patent-workflow撰写[技术名称]的高质量专利"

Codex:
  立即启动三阶段workflow
  → Research → Plan → Implement
  → 70-100分钟后交付高质量专利文档
```

### 与现有系统的协同

```yaml
与Agent-KB集成:
  - 记录专利撰写经验
  - 查询专利领域最佳实践
  - 学习成功的权利要求策略

与Git Memory集成:
  - 记录专利版本演进
  - 追踪技术方案变更
  - 协作修订历史

与quality-check集成:
  - CodeDNA维度扩展到专利质量
  - 6维度评分（新颖性、创造性、实用性、完整性、术语规范、IRR）
```

---

**💡 核心价值**:
- ✅ **借鉴AutoPatent**: PGTree结构 + IRR质量指标 + 多Agent框架
- ✅ **借鉴InstructPatentGPT**: 权利要求优化 + 授权率提升策略
- ✅ **集成Codex原生 child agent**: explorer（架构/技术完整性）+ reviewer（权利要求对抗审查）+ docs-researcher（prior-art 校验，可选）+ 三阶段质量门禁
- ✅ **完全零成本**: 使用 Codex CLI 内置 spawn_agent 协议 + 仓库自带的 `.codex/agents/*.toml`，无需训练新模型，无外部 MCP 依赖
- ✅ **显著提升**: 授权率+15-25%，效率提升6-10倍
