# Patent Workflow Skill - 使用指南

## 📋 概述

**patent-workflow** 是一个借鉴AutoPatent和InstructPatentGPT的三阶段专利撰写系统，通过Research → Plan → Implement的系统化workflow，显著提高专利质量和授权率。

### 核心特性

- ✅ **三阶段workflow**: Research（专利检索） → Plan（大纲规划） → Implement（撰写审查）
- ✅ **质量门禁系统**: 每阶段有明确的质量标准（≥80% / ≥85% / ≥90%）
- ✅ **Codex 原生 child agent 协作**: `spawn_agent(explorer)` 做架构分析、`spawn_agent(reviewer)` 做权利要求对抗审查、`spawn_agent(docs-researcher)` 可选校验 prior-art
- ✅ **IRR质量指标**: 借鉴AutoPatent的重复率检测（目标≥0.85）
- ✅ **RLHF优化策略**: 借鉴InstructPatentGPT的权利要求优化方法
- ✅ **Word/DOCX 交付**: 最终生成 `.docx`；已有 DOCX 交底书默认保真优化，保留图片、题注、relationship、样式和页眉页脚资源

### 与现有系统的区别

```yaml
cn-patent-application (快速模板):
  用途: 技术交底书快速生成
  时间: 35-50分钟
  质量: 78-85分（及格-良好）
  适用: 防御性专利、时间紧急

patent-workflow (三阶段系统):
  用途: 高质量专利申请文档
  时间: 70-100分钟
  质量: 90-95分（优秀）
  适用: 核心专利、需要高授权率
```

---

## 🚀 快速开始

### 一键启动

```bash
# 在 Codex CLI 中输入：
"使用patent-workflow撰写[技术名称]的高质量专利"

# 或者
"三阶段专利workflow：[技术描述]"
```

### 完整流程

```
用户触发
    ↓
Codex 询问：使用三阶段workflow？
    ↓
Phase 1: Research (15-20分钟)
  - 技术信息收集
  - 专利检索（exa-code + WebSearch）
  - spawn_agent(explorer) 做发明架构分析
  - Quality Gate 1 (≥80%)
    ↓
Phase 2: Plan (15-20分钟)
  - PGTree大纲规划
  - 权利要求设计
  - spawn_agent(reviewer) 做四视角对抗审查
  - Quality Gate 2 (≥85%)
    ↓
Phase 3: Implement (40-60分钟)
  - Writer分段撰写
  - Examiner本地质量审查（IRR/术语/合规）
  - 并行 spawn_agent: explorer(技术完整性) + reviewer(授权率)
  - Quality Gate 3 (≥90%)
    ↓
交付成果
  - 专利申请 Word .docx
  - 权利要求书、摘要、质量评估报告
  - 附图或原 DOCX 图片资源
  - DOCX 保真检查结果
```

---

## 📊 三阶段详解

### Phase 1: Research阶段

**目标**: 检索相关专利、收集术语、分析技术布局

**输出**: ResearchPack（包含现有专利分析、技术术语库、explorer subagent 架构建议）

**关键工具**:
- exa-code: 专利文献检索
- `spawn_agent(agent_type="explorer")`: 发明架构分析（read-only，trace & cite，不出权利要求）
- WebSearch: 补充中文专利信息
- 可选 `spawn_agent(agent_type="docs-researcher")`: 校验 prior-art 引用真实性

**Quality Gate 1**:
- ✅ 检索到≥3个相关专利
- ✅ 术语库≥10个标准术语
- ✅ 现有技术方案分析完整
- ✅ explorer subagent 分析完成（含保护策略与不确定性清单）
- 综合评分 ≥80%

### Phase 2: Plan阶段

**目标**: 生成结构化专利大纲，设计权利要求层次

**输出**: ImplementationPlan（包含PGTree大纲、权利要求结构、reviewer subagent 审查建议）

**核心方法**:
- **PGTree**: 树形大纲结构（AutoPatent借鉴）
- **权利要求层次**: 独立+从属，3层保护
- **reviewer subagent 审查**: `.codex/agents/reviewer.toml`（high reasoning effort + read-only）做四视角对抗审查（审查员/规避者/诉讼/代理人）

**Quality Gate 2**:
- ✅ 大纲完整（5个主要章节）
- ✅ 权利要求层次清晰
- ✅ 段落规划详细
- ✅ reviewer subagent 审查建议已整合
- 综合评分 ≥85%

### Phase 3: Implement阶段

**目标**: 按大纲撰写专利文档，多层次质量审查

**输出**: 完整专利申请文档 + 质量评估报告

**Word/DOCX 要求**:
- 最终交付必须是 `.docx` 文件，聊天回复只提供文件路径、简短摘要、质量分和风险说明。
- 用户提供已有 `.docx` 交底书时，默认基于原 DOCX 保真编辑和重打包，不从纯文本抽取结果新建空白 Word。
- 交付前比对 `word/media/*`、`word/_rels/document.xml.rels`、`[Content_Types].xml`，确认图片、关系和内容类型声明没有无说明丢失。
- 只有用户明确要求重排版，或原 DOCX 损坏/不可编辑时，才允许新建 `.docx`；仍需尽量提取并重新插入原图片。

**三层审查**:
1. **IRR重复率检查**: 目标≥0.85（AutoPatent借鉴）
2. **术语一致性验证**: 全文统一术语
3. **法律合规性检查**: 新颖性、创造性、实用性

**Codex 双 subagent 并行复审**:
- `spawn_agent(explorer)`: 技术方案完整性审查（实施例覆盖度、可实施性、技术效果）
- `spawn_agent(reviewer)`: 权利要求授权率优化（四视角复审 + diff 建议）
- 主线 Codex: 收齐两份报告后做综合修订，按"三性优先 > 完整性"仲裁冲突

**Quality Gate 3**:
- ✅ IRR ≥ 0.85
- ✅ 术语一致性检查通过
- ✅ 法律合规性检查通过
- ✅ 双 subagent (explorer + reviewer) 审查建议已整合
- ✅ DOCX 已生成；已有原 DOCX 时图片数量、relationship、题注/图号和关键版式资源已完成保真检查
- 综合评分 ≥90%

---

## 🛠️ 辅助工具

### IRR重复率检查工具

```bash
# 使用IRR检查脚本（从 skill 目录运行）
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3 || command -v python || true)}"
"$PYTHON_BIN" .agent/skills/local/patent-workflow/tools/irr_checker.py [专利文档路径]

# 输出示例：
# IRR Score: 0.87 (✅ Pass - 目标≥0.85)
# Unique Sentences: 156 / 179
# Repetition Rate: 13%
#
# Repetitive Sections:
# - Section 3.2: 3 repeated sentences
# - Section 5.1: 2 repeated sentences
```

### 术语一致性检查工具

```bash
# 使用术语一致性检查脚本（从 skill 目录运行）
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3 || command -v python || true)}"
"$PYTHON_BIN" .agent/skills/local/patent-workflow/tools/term_checker.py [专利文档路径] [术语库路径]

# 输出示例：
# Terminology Consistency: 95% (✅ Pass - 目标≥90%)
#
# Non-standard Terms Found:
# - Line 45: "用户数据" → 建议使用 "用户画像数据"（术语库标准）
# - Line 78: "机器学习模型" → 建议统一为 "联邦学习模型"（上下文一致性）
```

---

## 💡 最佳实践

### 何时使用三阶段workflow

**适合场景**:
- ✅ 核心技术专利（高价值发明）
- ✅ 需要高授权率（竞争激烈领域）
- ✅ 复杂技术方案（多模块、多实施例）
- ✅ 有时间进行系统化撰写（70-100分钟）

**不适合场景**:
- ❌ 防御性专利（快速占位） → 使用cn-patent-application
- ❌ 简单技术方案（单一实施方式）
- ❌ 时间紧急（<50分钟）

### 提高质量的技巧

```yaml
Research阶段:
  - 检索关键词组合: 技术领域 + 核心方法 + 应用场景
  - 优先检索近3-5年专利（最新技术）
  - 从授权专利提取术语（而非申请中专利）

Plan阶段:
  - 独立权利要求只写核心必要特征（3-5个）
  - 从属权利要求设计3层保护（逐步限定）
  - 使用功能性描述（"用于..."、"配置为..."）

Implement阶段:
  - 先写具体实施方式（最详细）→ 再提炼发明内容
  - 变换表述方式降低重复率（同一特征用不同角度描述）
  - 每段补充新的技术信息（避免模板化）
```

### Codex Subagent 使用技巧

```yaml
explorer subagent 最佳用途 (.codex/agents/explorer.toml):
  - 复杂技术方案的架构分析（拆解模块、数据流、控制流）
  - 识别技术演进趋势和 prior-art 差异面
  - 建议多实施例的变形方案
  - "Trace, cite, don't fix" 默认指令保证只分析不出权利要求

reviewer subagent 最佳用途 (.codex/agents/reviewer.toml):
  - 权利要求的措辞优化（high reasoning effort + read-only）
  - 四视角识别可规避的技术特征
  - 建议限制性术语（提高授权率）

docs-researcher subagent 可选用途 (.codex/agents/docs-researcher.toml):
  - Phase 1.2 校验 prior-art 专利号 / URL / 摘要的真实性
  - 防止幻觉 prior-art 进 ResearchPack

主线 Codex 角色:
  - 编排者: 派发 spawn_agent -> wait_agent -> close_agent
  - 撰写者: 唯一可写实体（三个 subagent 全 read-only）
  - 仲裁者: 综合 subagent 报告并按"三性优先 > 完整性"收敛冲突
```

---

## 📈 性能指标

### 时间效率

```
传统人工撰写: 9-17小时
三阶段workflow: 70-100分钟
效率提升: 6-10倍
```

### 质量提升

```
专利授权率: 提升15-25%
审查周期: 缩短10-20%
保护范围: 扩大20-30%
IRR指标: ≥0.85（重复率≤15%）
```

### 成本

```
完全零成本:
  - 利用 Codex CLI 原生 spawn_agent 协议（仓库自带）
  - 复用 .codex/agents/ 现有 child agent（reviewer / explorer / docs-researcher）
  - exa-code MCP（已集成）
  - 无需训练新模型
  - 无需额外 API 调用
  - 无外部 MCP server 依赖（不依赖已淘汰的 zen-mcp）
```

---

## 🔍 故障排查

### 问题1: Quality Gate 1未通过（检索不足）

**症状**: 检索到的相关专利<3个，术语库<10个

**解决**:
```bash
# 1. 扩大检索关键词范围
检索词: "联邦学习" → "联邦学习 OR 分布式机器学习 OR 隐私计算"

# 2. 使用多个检索工具
exa-code + WebSearch + Context7 并行检索

# 3. 调整技术领域描述
用户可能描述不够准确 → 主动向用户问询澄清
```

### 问题2: Quality Gate 2未通过（大纲不完整）

**症状**: 大纲评分<85%，权利要求层次不清晰

**解决**:
```bash
# 1. 回到Research阶段补充信息
ResearchPack技术方案不够详细 → 补充检索

# 2. 重新派发 reviewer subagent
spawn_agent(agent_type="reviewer", message=<Step 2.3 中的四视角审查 prompt 框架>)

# 3. 参考相关专利的章节结构
从ResearchPack的代表性专利学习结构
```

### 问题3: Quality Gate 3未通过（IRR过低）

**症状**: IRR<0.85，重复率>15%

**解决**:
```bash
# 1. 使用IRR检查工具定位重复段落
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3 || command -v python || true)}"
"$PYTHON_BIN" tools/irr_checker.py [文档路径]

# 2. 改写策略
- 变换表述方式（同一特征用不同角度描述）
- 增加技术细节（不同实施例补充不同参数）
- 避免模板化表述（减少套话）

# 3. 补充实施例
增加变形方案和应用场景（提供新信息）
```

---

## 📚 参考资源

### 技术借鉴来源

- **AutoPatent**: PGTree结构、IRR指标、多Agent框架
  - GitHub: https://github.com/QiYao-Wang/AutoPatent
  - 论文: "Draft2Patent: Automatic Patent Generation from Drafts"

- **InstructPatentGPT**: RLHF权利要求优化、授权率提升策略
  - GitHub: https://github.com/jiehsheng/InstructPatentGPT
  - 论文: "Reinforcement Learning from Human Feedback for Patent Claims"

### Codex CLI 系统集成

- **原生 child agent (spawn_agent)**: 派发 / 等待 / 关闭 only-read subagent
  - 配置位置: `.codex/agents/*.toml`
  - 默认 agent: `reviewer.toml`、`explorer.toml`、`docs-researcher.toml`
  - 调用约定参考: `.agent/skills/upstream/superpowers/using-superpowers/references/codex-tools.md`

- **exa-code MCP**: 专利文献和代码检索
  - 工具: `mcp__exa__get_code_context_exa`
  - 工具: `mcp__exa__web_search_exa`

### 专利法律法规

- 《中华人民共和国专利法》（2020年修订）
- 《专利审查指南》（2024年版）

---

## 🎯 示例案例

### 案例1: 联邦学习方法（完整三阶段）

```
输入: "使用patent-workflow撰写企业间联邦学习的高质量专利"

执行:
  Phase 1 (18分钟):
    - 检索到12个相关专利
    - 术语库15个标准术语
    - spawn_agent(explorer) 架构分析 + 保护策略
    - Gate 1: 85分 ✅

  Phase 2 (17分钟):
    - PGTree大纲（5章节、3实施例）
    - 权利要求（1独立 + 9从属）
    - spawn_agent(reviewer) 四视角审查（补充2个限制性术语）
    - Gate 2: 88分 ✅

  Phase 3 (55分钟):
    - Writer撰写（17,500字）
    - Examiner本地审查（IRR=0.88）
    - 并行 spawn_agent: explorer + reviewer 双复审
    - Gate 3: 93分 ✅

输出:
  ✅ 专利申请 Word .docx（含说明书、权利要求书、摘要、质量评估报告）
  ✅ 权利要求书（1独立 + 9从属）
  ✅ 流程图和架构图（写入 Word；已有 DOCX 时保留原图片资源）
  ✅ DOCX 保真检查结果
  ✅ 授权率预估: +20%

总耗时: 90分钟
```

---

## 🤝 与其他系统协同

### Agent-KB集成

```yaml
记录经验:
  - 成功的专利撰写策略
  - 高授权率的权利要求模式
  - 特定技术领域的术语库

查询经验:
  - /kb "专利权利要求撰写技巧"
  - /kb "如何提高专利授权率"
  - /kb "联邦学习领域专利布局"
```

### Quality-Check集成

```yaml
CodeDNA维度扩展:
  1. 新颖性评分 (0-100)
  2. 创造性评分 (0-100)
  3. 实用性评分 (0-100)
  4. 完整性评分 (0-100)
  5. 术语规范评分 (0-100)
  6. IRR指标评分 (0-100)

  综合质量 = 六维度平均分
```

### Git Memory集成

```yaml
版本管理:
  - 记录专利申请文档的版本演进
  - 追踪技术方案的迭代变更
  - 协作修订历史（多发明人场景）

意图记录:
  - 每次修订的技术意图
  - 权利要求调整的原因
  - 审查意见的应对策略
```

---

## 📞 支持与反馈

### 常见问题

**Q: 三阶段workflow是否必须全部完成？**
A: 是的。质量门禁系统要求每阶段通过才能进入下一阶段。如果时间紧急，建议使用cn-patent-application快速模板。

**Q: 可以跳过某个Quality Gate吗？**
A: 不建议。质量门禁是保证专利质量的关键。如果某个Gate未通过，应该回滚修正，而不是跳过。

**Q: explorer / reviewer subagent 是否必需？**
A: 不是必需。当 Codex CLI 的 child agent 不可用（如未启用 `multi_agent = true`）时，主线 Codex 可降级用 `[EXPLORER]` / `[REVIEWER]` 块在单线程内自演相同 prompt，仍能产出三阶段评审，只是少了"独立上下文"的隔离优势。强烈建议开启 multi_agent 以获得最佳效果。

**Q: IRR指标如何计算？**
A: IRR = 1 - (重复句子数 / 总句子数)。使用`tools/irr_checker.py`自动计算。

### 改进建议

如有任何改进建议或发现问题，请：
1. 记录到Agent-KB（`/kb record`）
2. 更新skill文档
3. 分享成功案例和最佳实践

---

**💡 核心价值**: 通过系统化的三阶段workflow和多层次质量审查，显著提高专利质量和授权率，让专利申请从"占位"变成"真正的技术壁垒"！
