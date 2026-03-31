---
name: de-ai-writing
description: This skill should be used when the user asks to "给这篇文章去 AI 味", "把中文文章改得更像人写的", "降低这段文案的机器感", "润色成更自然的中文", "把这篇讲道稿改得像真人讲出来的", "保留经文和神学立场去掉机器感", "humanize this article", or "remove AI tone from this Chinese draft".
version: 0.1.0
argument-hint: <draft text, file path, or target paragraph>
source: fork
checksum: b00102f3901ab29ec56684c11c7a9d5c031ce2b2a6bc9d8653d307257f795498
updated_at: 2026-03-27T14:14:08.521Z
---


# De-AI Writing Skill

## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Execution preference:
1. Use native subagents first for independent workstreams (parallel when possible).
2. Merge results in main thread and run final verification.
3. Fallback only when delegation is blocked: use the `[ANALYST]`/`[ARCHITECT]`/`[EXECUTOR]`/`[REVIEWER]` structure in a single response.

Minimal orchestration pattern:
```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

> Codex invocation: use `$de-ai-writing ...` or `de-ai-writing: ...`

将草稿改到“保留信息和立场，但去掉模板腔、空话感、均匀句式和机器味”。默认优先处理中文文章，其次兼容中英混合内容。

## Purpose

将“去 AI 味”定义为一次**风格校正**，而不是“伪造真人痕迹”或“胡乱口语化”：

1. 保留事实、观点、逻辑和专业术语。
2. 删除空泛、可套用到任何主题的句子。
3. 把抽象评价改成具体观察、机制说明或明确判断。
4. 打破过分平均的句长、段落长度和连接词节奏。
5. 让文章更像“一个有判断的人在说话”，而不是“一个会生成完整结构的模板在说话”。

## When To Use

优先用于以下场景：

- 中文公众号、博客、专栏、视频口播稿、品牌内容、知识型长帖
- 计算机技术分享、产品复盘、架构说明、故障排查文章
- 基督教讲道稿、神学分享、灵修说明、牧养型长文
- 已有初稿，但读起来“太顺、太满、太像 AI”
- 想保留原意，只调整语言气质与表达密度
- 想从“概括正确”改成“表达自然、判断鲜明、细节可信”

## When Not To Use

以下场景不要默认开启强改写：

- 法务、合同、制度、公文、论文摘要等必须保持强正式文体的文本
- 用户明确要求“SEO 模板风格”“标准化 PR 口径”或“官方公告腔”
- 核心问题是事实不足、论证空心、资料缺失

遇到“事实薄弱”而不是“文风机械”时，优先配合 `content-research-writer` 先补证据，再回到本 skill 做风格校正。

## Working Modes

根据用户意图选择强度；未指定时默认 `standard`。

| Mode | Use Case | Rewrite Strength |
|------|----------|------------------|
| `light` | 只去掉明显 AI 腔，不改结构 | Low |
| `standard` | 调整段落、句式、连接方式和措辞 | Medium |
| `deep` | 重写开头、中段推进和结尾逻辑 | High |
| `voice-lock` | 强锁定作者现有语气，只修机器感 | Medium |

## Output Contract

默认输出以下三段；如果用户只说“直接改”，则只给改写结果：

1. `AI味诊断`
2. `改写版本`
3. `处理说明`

诊断只保留最强的 3-5 个问题，不做散点式挑刺。

## Core Workflow

### 1. Lock Constraints

先锁定不可动项：

- 必须保留的事实、数字、术语、引用
- 目标读者：大众、行业内、老板、客户、创作者
- 语气目标：冷静、锋利、克制、亲近、专业
- 可接受的口语度：书面、半口语、强口语

用户未说明时，采用默认假设：
- 读者：受过基础教育的中文互联网读者
- 语气：自然、克制、有判断
- 口语度：半口语，不堆俚语，不装松弛

### 2. Diagnose The Strongest AI Signals

先判断“AI 味”来自哪里，再动手改：

1. **开头模板化**：例如“在当今...背景下”“随着...不断发展”
2. **抽象名词堆叠**：例如“效率提升、价值赋能、体验优化、能力建设”
3. **过度平衡句**：连续出现“既...又...还...”或“不是...而是...”模板
4. **连接词过密**：例如“首先/其次/再次/最后/此外/总之”整齐排队
5. **句长过分均匀**：每句都差不多长，每段都差不多满
6. **判断过于安全**：什么都说了，但没有一个真正的观点承担风险
7. **结尾太完整**：总结得过满，像作业答案，不像真实写作者收束

详细信号与改写动作见 `references/chinese-patterns.md`。

### 3. Decide The Rewrite Strategy

按问题类型选动作，不做平均用力：

- 问题集中在套话：优先删模板句和空洞总结
- 问题集中在机械结构：优先打散段落和连接顺序
- 问题集中在“像客服稿”：优先补判断、减官话、换动词
- 问题集中在“像 AI 解释题”：优先把抽象概念落到场景、动作、后果

### 4. Rewrite By Paragraph Function

按段落职责分别处理：

- **开头**：尽快进入具体问题、冲突、判断，不绕大背景
- **中段**：每段只推进一个关键意思，避免“同义反复”
- **举例段**：能具体就具体；没有例子时，宁可收缩判断，不要捏造案例
- **结尾**：留一个判断、后果或余味，不必把全文再复述一遍

### 5. Apply Chinese-First Rewrite Rules

处理中文时，优先执行以下规则：

1. 把“抽象评价”改成“可感知的差异”
2. 把“名词中心句”改成“动作中心句”
3. 把“套装连接词”改成自然推进
4. 把“平均句长”改成有快有慢的节奏
5. 把“无风险正确”改成“有边界的判断”
6. 把“过度总结”改成“收束但不封死”

### 6. Run Final Safety Checks

交付前执行以下自检：

- 每一段是否至少说出一个不可随意替换的东西
- 任意一句删掉后，文章是否仍然完全不受影响
- 是否为了去 AI 味而误删事实、条件或术语
- 是否把专业稿强行改成了“轻飘口语”
- 是否新增了用户没有提供的例子、数据、经历

## Domain Safeguards

### A. 计算机技术分享

处理技术文章时，优先保护这些内容：

- 代码块、命令、配置项、环境变量、参数名
- API 名、库名、框架名、版本号、错误信息
- 故障链路、因果关系、性能数字、实验结论
- 原文中刻意保留的精确限定词，例如“仅在某版本下”“只适用于异步场景”

技术稿的改写重点：

- 去掉“背景铺垫型空话”，更快进入问题和解法
- 把抽象收益改成工程后果，例如延迟、复杂度、维护成本
- 保留术语，不要为了“更自然”把专业词洗平
- 允许专业克制，不强行写得像生活随笔

技术稿禁止动作：

- 改写代码含义
- 合并后丢掉步骤顺序
- 把报错、命令、配置键名改成近义词
- 把工程判断改成更大但不准确的结论

### B. 基督教讲道与神学分享

处理讲道稿和神学文章时，优先保护这些内容：

- 经文引用、章节号、关键措辞
- 原有神学立场、教义边界、释经逻辑
- 牧养语气中的庄重、安慰、劝勉、警戒
- 祷告、见证、劝勉段落中的敬虔感和节制

神学稿的改写重点：

- 去掉模板化引言和空泛套话，不稀释属灵重量
- 让讲道推进更像真实宣讲，而不是答题式分点
- 保留敬虔、谦卑和边界感，不改成“轻松鸡汤”
- 在不改变 doctrine 的前提下，让判断更有牧养温度

神学稿禁止动作：

- 改动经文原意或偷偷换成松散意译
- 把谨慎的神学表述改成更武断的结论
- 把讲道稿改成营销文案或泛心灵成长内容
- 因为追求“自然”而削弱敬畏、悔改、恩典、十字架等核心语义

## Chinese Rewrite Principles

### Prefer Concrete Verbs Over Abstract Nouns

少说：
- “实现增长”
- “赋能业务”
- “形成闭环”
- “提升体验”

多说：
- “把响应时间从 8 秒压到 2 秒”
- “让销售少来回确认两次”
- “把原来断开的流程接上”
- “让读者在第一屏就知道重点”

### Prefer Real Judgement Over Safe Summary

少写“这说明了某某的重要性”。

改写为：
- 直接下判断
- 说明为什么
- 指出代价、限制或适用边界

### Prefer Rhythm Over Uniformity

中文文章最容易暴露 AI 味的地方，不是某个词，而是**分布太匀**：

- 每句都完整
- 每段都饱满
- 每个转折都被说出来
- 每个结尾都像总结题

改写时主动保留一点松紧变化：

- 允许短句单独成段
- 允许某段只做一个锋利判断
- 允许个别句子故意不对称

## Anti-Patterns

避免以下动作：

- 为了“像人写的”而强行加入虚构经历、情绪、对话
- 把行业文章改成网络段子
- 只替换同义词，不改句法和推进方式
- 把原文所有连接词删光，导致逻辑断裂
- 把原文的克制风格误判成“AI 味”
- 把所有句子都改得很短，形成另一种模板感

## Composition Rules

与其他 skill 组合时按以下顺序：

1. 资料不足、论点发虚：先用 `content-research-writer`
2. 文章结构混乱：可先用 `plan` 梳理提纲
3. 长篇创作、人物口吻一致性要求高：配合 `writer-memory`
4. 完成改写后，只在用户要求下解释改动原因；默认不要上长篇写作课

## Deliverable Template

### Default

```markdown
## AI味诊断
- 问题 1
- 问题 2
- 问题 3

## 改写版本
[rewritten text]

## 处理说明
- 保留了什么
- 重点改了什么
- 还有哪些地方建议补事实/例子
```

### Direct Rewrite

```markdown
## 改写版本
[rewritten text]
```

## Trigger Examples

以下请求应触发本 skill：

- “给这篇文章去 AI 味，尤其是中文腔调别那么像模板。”
- “把这段公众号稿改得更像真人写的。”
- “不要改意思，只把机器感降下来。”
- “把这篇技术分享改得自然一点，但代码块、命令和术语都别动。”
- “把这篇讲道稿改得像真人讲出来的，保留经文和神学立场。”
- “帮我把这篇神学分享去掉机器感，但不要变成鸡汤文。”
- “帮我 humanize 一下这篇中文草稿。”
- “这篇文章太像 AI 写的了，重写但别油腻。”

## Additional Resources

需要具体短语清单、中文常见套话、替换方式和前后对照时，查看：

- `references/chinese-patterns.md`
- `references/domain-playbooks.md`
