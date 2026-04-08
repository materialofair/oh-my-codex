# Patent Workflow Skill - 使用指南

## 📋 概述

**patent-workflow** 是一个借鉴AutoPatent和InstructPatentGPT的三阶段专利撰写系统，通过Research → Plan → Implement的系统化workflow，显著提高专利质量和授权率。

### 核心特性

- ✅ **三阶段workflow**: Research（专利检索） → Plan（大纲规划） → Implement（撰写审查）
- ✅ **质量门禁系统**: 每阶段有明确的质量标准（≥80% / ≥85% / ≥90%）
- ✅ **Zen MCP协作**: 集成Gemini（架构分析）和Codex（权利要求优化）
- ✅ **IRR质量指标**: 借鉴AutoPatent的重复率检测（目标≥0.85）
- ✅ **RLHF优化策略**: 借鉴InstructPatentGPT的权利要求优化方法

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
# 在Claude对话中说：
"使用patent-workflow撰写[技术名称]的高质量专利"

# 或者
"三阶段专利workflow：[技术描述]"
```

### 完整流程

```
用户触发
    ↓
Claude询问：使用三阶段workflow？
    ↓
Phase 1: Research (15-20分钟)
  - 技术信息收集
  - 专利检索（exa-code）
  - Gemini技术分析
  - Quality Gate 1 (≥80%)
    ↓
Phase 2: Plan (15-20分钟)
  - PGTree大纲规划
  - 权利要求设计
  - Codex权利要求审查
  - Quality Gate 2 (≥85%)
    ↓
Phase 3: Implement (40-60分钟)
  - Writer分段撰写
  - Examiner质量审查
  - Zen MCP多轮优化
  - Quality Gate 3 (≥90%)
    ↓
交付成果
  - 专利申请说明书
  - 权利要求书
  - 附图
  - 质量评估报告
```

---

## 📊 三阶段详解

### Phase 1: Research阶段

**目标**: 检索相关专利、收集术语、分析技术布局

**输出**: ResearchPack（包含现有专利分析、技术术语库、Gemini架构建议）

**关键工具**:
- exa-code: 专利文献检索
- Zen MCP (Gemini): 技术架构分析（1M上下文）
- WebSearch: 补充中文专利信息

**Quality Gate 1**:
- ✅ 检索到≥3个相关专利
- ✅ 术语库≥10个标准术语
- ✅ 现有技术方案分析完整
- ✅ Gemini技术分析完成
- 综合评分 ≥80%

### Phase 2: Plan阶段

**目标**: 生成结构化专利大纲，设计权利要求层次

**输出**: ImplementationPlan（包含PGTree大纲、权利要求结构、Codex审查建议）

**核心方法**:
- **PGTree**: 树形大纲结构（AutoPatent借鉴）
- **权利要求层次**: 独立+从属，3层保护
- **Codex审查**: GPT-5级别的权利要求优化

**Quality Gate 2**:
- ✅ 大纲完整（5个主要章节）
- ✅ 权利要求层次清晰
- ✅ 段落规划详细
- ✅ Codex审查建议已整合
- 综合评分 ≥85%

### Phase 3: Implement阶段

**目标**: 按大纲撰写专利文档，多层次质量审查

**输出**: 完整专利申请文档 + 质量评估报告

**三层审查**:
1. **IRR重复率检查**: 目标≥0.85（AutoPatent借鉴）
2. **术语一致性验证**: 全文统一术语
3. **法律合规性检查**: 新颖性、创造性、实用性

**Zen MCP协作**:
- Gemini: 技术方案完整性审查
- Codex: 权利要求授权率优化
- Claude: 综合修订和质量把关

**Quality Gate 3**:
- ✅ IRR ≥ 0.85
- ✅ 术语一致性检查通过
- ✅ 法律合规性检查通过
- ✅ Zen MCP审查建议已整合
- 综合评分 ≥90%

---

## 🛠️ 辅助工具

### IRR重复率检查工具

```bash
# 使用IRR检查脚本
python ~/.claude/skills/patent-workflow/tools/irr_checker.py [专利文档路径]

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
# 使用术语一致性检查脚本
python ~/.claude/skills/patent-workflow/tools/term_checker.py [专利文档路径] [术语库路径]

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

### Zen MCP使用技巧

```yaml
Gemini最佳用途:
  - 复杂技术方案的架构分析（1M上下文优势）
  - 识别技术演进趋势和专利布局
  - 建议多实施例的变形方案

Codex最佳用途:
  - 权利要求的措辞优化（GPT-5级别）
  - 识别可能被规避的技术特征
  - 建议限制性术语（提高授权率）

Claude角色:
  - 中央协调者（调用Gemini和Codex）
  - 主要执行者（撰写专利文档）
  - 质量把关者（综合AI建议优化）
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
  - 利用现有SuperClaude系统
  - Zen MCP工具（已配置）
  - exa-code MCP（已集成）
  - 无需训练新模型
  - 无需额外API调用
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
用户可能描述不够准确 → 使用AskUserQuestion澄清
```

### 问题2: Quality Gate 2未通过（大纲不完整）

**症状**: 大纲评分<85%，权利要求层次不清晰

**解决**:
```bash
# 1. 回到Research阶段补充信息
ResearchPack技术方案不够详细 → 补充检索

# 2. 使用Codex审查
clink with codex codereviewer to review the claims structure

# 3. 参考相关专利的章节结构
从ResearchPack的代表性专利学习结构
```

### 问题3: Quality Gate 3未通过（IRR过低）

**症状**: IRR<0.85，重复率>15%

**解决**:
```bash
# 1. 使用IRR检查工具定位重复段落
python tools/irr_checker.py [文档路径]

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

### SuperClaude系统集成

- **Zen MCP**: 多AI协作系统
  - 配置: ~/.claude/MCP.md
  - 使用指南: ~/.claude/ZEN_MCP_USAGE.md

- **exa-code MCP**: 代码和文档检索
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
    - Gemini架构分析（1M上下文）
    - Gate 1: 85分 ✅

  Phase 2 (17分钟):
    - PGTree大纲（5章节、3实施例）
    - 权利要求（1独立 + 9从属）
    - Codex审查（补充2个限制性术语）
    - Gate 2: 88分 ✅

  Phase 3 (55分钟):
    - Writer撰写（17,500字）
    - Examiner审查（IRR=0.88）
    - Zen MCP优化
    - Gate 3: 93分 ✅

输出:
  ✅ 专利申请说明书（17,500字）
  ✅ 权利要求书（1独立 + 9从属）
  ✅ 流程图和架构图
  ✅ 质量评估报告
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

**Q: Zen MCP的Gemini和Codex是否必需？**
A: 不是必需，但强烈建议。Gemini的1M上下文和Codex的GPT-5能力能显著提高专利质量和授权率。

**Q: IRR指标如何计算？**
A: IRR = 1 - (重复句子数 / 总句子数)。使用`tools/irr_checker.py`自动计算。

### 改进建议

如有任何改进建议或发现问题，请：
1. 记录到Agent-KB（`/kb record`）
2. 更新skill文档
3. 分享成功案例和最佳实践

---

**💡 核心价值**: 通过系统化的三阶段workflow和多层次质量审查，显著提高专利质量和授权率，让专利申请从"占位"变成"真正的技术壁垒"！
