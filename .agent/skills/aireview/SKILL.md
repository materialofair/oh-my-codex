---
name: aireview
description: Professional multi-agent AI code review with confidence scoring
---

# aireview - Enhanced AI Code Review

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

> Codex invocation: use `aireview: ...` or `$aireview ...`

Professional code review combining multi-agent parallel analysis with direct CLI invocations.

## Positioning in Review Stack

`aireview` is the advanced review layer, not a replacement for `code-review`.

Recommended usage:
1. Start with `$code-review` for baseline findings and fast signal.
2. Escalate to `$aireview` when the diff is large, sensitive, or cross-cutting.
3. Use `$aireview --deep` for merge gates on high-risk changes.

## Language Configuration

**始终使用中文回复**: All AI review results will be presented in Chinese.

## Quick Usage

```bash
# Review changes (most common)
aireview --diff                           # Review unstaged changes
aireview --diff --staged                  # Review staged changes
aireview --diff HEAD~1..HEAD              # Review last commit

# Remote branch/PR review (NEW)
aireview origin/feature-branch            # Review remote branch
aireview origin/feature-branch --quick    # Quick review (small PR)
aireview origin/feature-branch --deep     # Deep review (large PR)

# GitHub/GitLab PR review (if in PR context)
aireview --pr [PR_NUMBER]                 # Review specific PR
aireview --pr --comment                   # Post review as PR comment

# Deep review (Multi-AI collaboration)
aireview --diff --deep                    # Gemini + Claude Code parallel analysis

# Standard file/directory review
aireview ./src/auth
aireview ./src/auth/service.ts --model codex
```

## Enhanced Architecture

### Multi-Agent Parallel Review


```
aireview --diff
    ↓
Step 1: Eligibility Check (Haiku Agent)
    - Check if review needed
    - Skip if: closed PR, draft, trivial change, already reviewed
    ↓
Step 2: Gather Context (Haiku Agent)
    - Find CLAUDE.md files (root + modified directories)
    - Get change summary
    ↓
Step 3: Parallel Review (5 Specialized Agents)
    ┌─────────────────────────────────────────────┐
    │ Agent #1 (INTJ): CLAUDE.md Compliance       │
    │ Agent #2 (ISTJ): Bug Detection (changes)    │
    │ Agent #3 (INTP): Git History Context        │
    │ Agent #4 (ENTP): Related PR Analysis        │
    │ Agent #5 (ISFJ): Code Comment Compliance    │
    └─────────────────────────────────────────────┘
    ↓
Step 4: Confidence Scoring (Parallel Haiku Agents)
    - Score each issue 0-100
    - Filter issues < 80 confidence
    ↓
Step 5: Generate Report (Main agent)
    - Format and present findings
    - Link to specific code lines
```

### Deep Mode: Multi-Model Sequential Analysis

```
aireview --diff --deep
    ↓
Layer 1: Parallel Multi-Agent Review (Step 1-3 above)
    ↓
Layer 2: Gemini Deep Analysis (via gemp)
    - Architecture review (INTJ persona)
    - Security analysis
    - Performance implications
    ↓
Layer 3: Claude Code Quality Audit
    - TypeScript/React best practices (ISTJ persona)
    - Code maintainability
    - Pattern adherence
    ↓
Layer 4: Synthesis & Scoring
    - Combine all findings
    - Final confidence scoring
    - Comprehensive report
```

## Implementation

When user invokes `aireview`, execute the following:

### Step 1: Parse Parameters & Eligibility Check

```markdown
Parse command line arguments:
- MODE: "standard" | "deep" | "quick" | "pr" | "remote-branch"
- REVIEW_TARGET: File/directory path or remote branch name
- PR_NUMBER: Pull request number (if --pr)
- POST_COMMENT: true if --comment flag
- QUICK_MODE: true if --quick flag (fast review for small PRs)

If first argument starts with "origin/":
  MODE = "remote-branch"
  REMOTE_BRANCH = first argument (e.g., "origin/feature-cr")

  # Fetch latest remote changes
  Execute: git fetch origin

  # Get PR size and determine review mode
  Execute: git diff --stat origin/master...$REMOTE_BRANCH
  Parse output to get file count and line changes

  Auto-select mode if not specified:
    If files <= 3:
      MODE = "quick"    # Small PR, fast review
    Else if files <= 10:
      MODE = "standard" # Medium PR, standard review
    Else:
      MODE = "deep"     # Large PR, deep review

If MODE == "pr":
  Launch Haiku agent to check:
  1. Is PR closed?
  2. Is PR draft?
  3. Is change trivial (< 10 lines, auto-generated)?
  4. Already reviewed by Codex?

  If any is true → Exit with message
```

### Step 2: Gather Context

```markdown
If MODE == "remote-branch":
  # Get diff content for remote branch review
  Execute: git diff origin/master...$REMOTE_BRANCH > /tmp/pr_diff.txt
  Execute: git log origin/master..$REMOTE_BRANCH --oneline
  
  DIFF_CONTENT = read /tmp/pr_diff.txt
  COMMIT_LOG = git log output
  
  # For remote branch, use simplified context gathering
  Find CLAUDE.md in root (skip directory-specific CLAUDE.md)

Else:
  Launch Haiku agent to:
  1. Find CLAUDE.md files:
     - Root CLAUDE.md
     - CLAUDE.md in modified directories

  2. Get change summary:
     - Files modified
     - Lines changed
     - Overall purpose

Return: {claude_md_files: [], summary: "", diff_content: ""}
```

### Step 3: Launch Parallel Review Agents

```markdown
If MODE == "quick":
  # Quick mode: Skip parallel agents, use single fast Gemini review
  
  Execute quick review via gemp:
  
  cat > /tmp/quick_review_prompt.txt << 'PROMPT_EOF'
  你是代码审查专家，快速审查以下远程分支变更:
  
  **分支**: {REMOTE_BRANCH}
  **提交**: {COMMIT_LOG}
  
  ```diff
  {DIFF_CONTENT}
  ```
  
  只报告:
  1. ❌ 明显错误 (语法、逻辑)
  2. ❌ 安全漏洞 (注入、XSS、敏感信息)
  3. ❌ 破坏性变更 (API 变更、向后兼容)
  
  如果没有严重问题，直接说 "✅ 无明显问题，可以合并"
  
  如果有问题，格式:
  ## ❌ 阻止合并
  
  **问题**: [简短描述]
  **位置**: `file:line`
  **修复**: [一句话建议]
  
  ## ✅ 合并建议
  
  - [ ] 可以合并
  - [ ] 修复后合并
  - [ ] 不建议合并
  PROMPT_EOF
  
  cat /tmp/quick_review_prompt.txt | gemp 2>&1
  
  Skip to Step 6 (Generate Report)

Else:
  Launch 5 parallel agents (use `spawn_agent` in parallel; prefer lightweight agent profiles for speed):

Agent #1 - CLAUDE.md Compliance (INTJ Persona):
  Prompt: |
    你是 INTJ 架构师，专注于规范合规性审查。

    CLAUDE.md 规范文件：
    {claude_md_files}

    代码变更：
    {diff_content}

    任务：检查代码是否违反 CLAUDE.md 中的明确指令。
    只标记明确违反的情况，避免泛泛的代码质量问题。

    输出格式：
    - 问题描述
    - 违反的 CLAUDE.md 指令（引用原文）
    - 建议修复方案
    - 初步置信度 (0-100)

Agent #2 - Bug Detection (ISTJ Persona):
  Prompt: |
    你是 ISTJ 工程师，专注于 Bug 检测。

    代码变更：
    {diff_content}

    任务：浅层扫描变更部分的明显 bug。
    专注于大问题，忽略小细节和可能的误报。

    False Positive 规则（不要标记）：
    - 预存在的问题
    - linter/typechecker 会捕获的问题
    - 样式问题
    - 格式问题
    - 可能是有意的功能变更

    输出格式：
    - Bug 描述
    - 影响范围
    - 建议修复方案
    - 初步置信度 (0-100)

Agent #3 - Git History Analysis (INTP Persona):
  Prompt: |
    你是 INTP 性能极客，专注于历史上下文分析。

    使用 git blame 查看修改代码的历史。
    检查：
    - 之前的 commit 是否揭示了问题
    - 修改是否与历史模式一致
    - 是否引入了回归问题

    输出格式：
    - 历史上下文发现
    - 潜在回归问题
    - 初步置信度 (0-100)

Agent #4 - Related PR Analysis (ENTP Persona):
  Prompt: |
    你是 ENTP 创新者，专注于 PR 关联分析。

    查找之前修改相同文件的 PR。
    检查：
    - 之前 PR 的评论是否也适用于当前变更
    - 是否有重复的问题模式

    输出格式：
    - 相关 PR 发现
    - 适用的历史评论
    - 初步置信度 (0-100)

Agent #5 - Code Comment Compliance (ISFJ Persona):
  Prompt: |
    你是 ISFJ 维护者，专注于代码注释合规性。

    读取修改文件中的代码注释。
    检查：
    - 代码变更是否遵循注释中的指导
    - 是否违反了 TODO/FIXME 注释
    - 是否忽略了重要的警告注释

    输出格式：
    - 注释合规性问题
    - 违反的具体注释
    - 初步置信度 (0-100)
```

### Step 4: Confidence Scoring & Filtering

```markdown
For each issue from Step 3, launch a Haiku agent:

Prompt: |
  你是专业的代码审查评分员。

  问题描述：{issue}
  代码变更：{diff_content}
  CLAUDE.md 文件：{claude_md_files}

  评分标准 (0-100)：
  - 0: 完全不确定，明显的误报
  - 25: 有点怀疑，可能是误报，未明确在 CLAUDE.md 中提到
  - 50: 中等确信，已验证是真实问题，但不是很重要
  - 75: 高度确信，双重检查过，会影响功能，或 CLAUDE.md 明确提到
  - 100: 绝对确定，确认是真实问题，经常发生

  False Positive 规则（降低分数）：
  - 预存在的问题
  - 看起来像 bug 但实际不是
  - 吹毛求疵的小问题
  - linter/typechecker 会捕获的问题
  - 缺少测试覆盖率（除非 CLAUDE.md 要求）
  - CLAUDE.md 提到但代码中明确忽略的问题
  - 可能是有意的功能变更
  - 真实问题，但在用户未修改的行上

  输出：最终置信度分数 (0-100)

Filter: 只保留置信度 >= 80 的问题
```

### Step 5: Deep Mode (Optional)

```markdown
If MODE == "deep":

  Layer 2 - Gemini Architecture Analysis:
    Use Skill tool with 'code-review' skill (standard mode)
    Or direct CLI:

    cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
    你是 INTJ 架构师，进行深度架构分析。

    已发现的高置信度问题：
    {filtered_issues}

    代码变更：
    {diff_content}

    任务：
    1. 验证已发现的架构问题
    2. 识别额外的架构级别问题
    3. 评估安全性影响
    4. 分析性能影响

    输出：
    - 架构问题列表
    - 安全性评估
    - 性能影响
    - 总体架构评分 (1-10)
    PROMPT_EOF

    cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1

  Layer 3 - Claude Code Quality Audit:
    cat > /tmp/claude_prompt.txt << 'PROMPT_EOF'
    你是 ISTJ 工程师，进行代码质量审计。

    已发现的高置信度问题：
    {filtered_issues}

    Gemini 的架构发现：
    {gemini_findings}

    代码变更：
    {diff_content}

    任务：
    1. 验证代码质量问题
    2. 检查 TypeScript/React 最佳实践
    3. 评估可维护性
    4. 识别模式违规

    输出：
    - 代码质量问题列表
    - 最佳实践违规
    - 可维护性评估
    - 总体质量评分 (1-10)
    PROMPT_EOF

    cat /tmp/claude_prompt.txt | claude -p --output-format text --dangerously-skip-permissions 2>&1

  Layer 4 - Synthesis:
    Combine findings from all layers
    Recalculate confidence scores
    Generate comprehensive report
```

### Step 6: Generate Report

```markdown
Format based on mode:

If filtered_issues.length == 0:
  Output: |
    ## AI 审查报告
    **模式**: {MODE}
    **模型**: {models_used}

    未发现问题。已检查：
    - Bugs
    - CLAUDE.md 合规性
    - 历史上下文
    - 相关 PR
    - 代码注释合规性

    🤖 Generated with Codex

Else:
  Output: |
    ## AI 审查报告
    **模式**: {MODE}
    **模型**: {models_used}
    **文件**: {files_count}个文件变更，+{lines_added}/-{lines_removed}行

    发现 {issues_count} 个高置信度问题：

    {for each issue}
    ### {severity} - {issue.title}

    **置信度**: {issue.confidence}/100
    **来源**: {issue.agent} ({issue.persona})
    **文件**: `{issue.file}:{issue.line}`

    {issue.description}

    **修复建议**:
    {issue.fix_suggestion}

    **代码链接**: {github_link_with_full_sha}

    {end for}

    ---

    ## 总结
    - **总体评分**: {overall_score}/10
    - **严重问题**: {critical_count}个 (立即修复)
    - **高优先级问题**: {high_count}个 (本周修复)
    - **中等问题**: {medium_count}个 (本月修复)

    {if deep_mode}
    ### 深度分析
    **Gemini 架构评分**: {gemini_score}/10
    {gemini_highlights}

    **Claude Code 质量评分**: {claude_score}/10
    {claude_highlights}
    {end if}

    🤖 Generated with Codex

    {if pr_mode}
    <sub>- 如果这个审查有帮助，请回复 👍。否则，回复 👎。</sub>
    {end if}

If --comment flag && pr_mode:
  Use gh pr comment to post the report
```

## MBTI Persona Mapping

| Agent Role | MBTI Persona | Focus Area |
|-----------|--------------|------------|
| CLAUDE.md Compliance | INTJ 架构师 | 规范遵守、系统设计 |
| Bug Detection | ISTJ 工程师 | 细节、逻辑错误 |
| Git History | INTP 性能极客 | 模式、历史上下文 |
| Related PR | ENTP 创新者 | 关联性、创新视角 |
| Code Comments | ISFJ 维护者 | 注释、文档一致性 |

## Confidence Score Rubric

| Score | Meaning | Example |
|-------|---------|---------|
| 0 | 完全不确定 | 明显误报、预存在问题 |
| 25 | 有点怀疑 | 可能是问题，但未验证 |
| 50 | 中等确信 | 真实问题，但不重要 |
| 75 | 高度确信 | 影响功能，CLAUDE.md 明确提到 |
| 100 | 绝对确定 | 确认的真实问题，经常发生 |

**过滤阈值**: 80+ (只展示高度确信的问题)

## False Positive Rules

**不要标记以下情况** (降低置信度分数):

1. **预存在的问题** - 在变更前就存在
2. **工具可捕获** - linter、typechecker、compiler 会发现
3. **样式问题** - 格式、命名（除非 CLAUDE.md 明确要求）
4. **吹毛求疵** - 资深工程师不会提的小问题
5. **有意变更** - 功能变更可能是有意的
6. **未修改行** - 问题在用户未修改的代码行
7. **明确忽略** - CLAUDE.md 提到但代码中明确忽略（lint ignore）
8. **缺少测试** - 除非 CLAUDE.md 明确要求测试覆盖率

## Core Advantages

### Core Features
- ✅ 多 agent 并行审查 (5 agents)
- ✅ 置信度评分系统 (0-100)
- ✅ False positive 过滤 (阈值 80)
- ✅ CLAUDE.md 合规性检查
- ✅ GitHub PR 集成

### From Original aireview
- ✅ 直接 CLI 调用 (无超时)
- ✅ gemp 优先 (20分钟超时)
- ✅ MBTI 人格系统
- ✅ Deep mode (多模型协作)
- ✅ 中文输出

### Enhanced Features
- ✅ Git history 上下文分析
- ✅ 相关 PR 分析
- ✅ 代码注释合规性检查
- ✅ 分层分析 (multi-agent → Gemini → Claude Code → synthesis)
- ✅ 详���的置信度评分标准

## CLI Implementation Templates

### Gemini CLI (优先 gemp)
```bash
cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
{persona} 你的审查任务...
PROMPT_EOF
cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
```

### Gemini CLI (备用)
```bash
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP|YOLO|Load"
```

### Claude Code CLI
```bash
cat > /tmp/claude_prompt.txt << 'PROMPT_EOF'
{persona} 你的审查任务...
PROMPT_EOF
cat /tmp/claude_prompt.txt | claude -p --output-format text --dangerously-skip-permissions 2>&1
```

## Requirements

- Gemini CLI (gemp/long_task_runner.js) configured
- Claude Code CLI configured
- GitHub CLI (`gh`) for PR mode
- CLAUDE.md files (optional but recommended)

## Usage Examples

### Example 1: Standard Review
```bash
$ aireview --diff

🔍 正在执行多 agent 并行审查...

✅ Step 1: 资格检查通过
✅ Step 2: 找到 2 个 CLAUDE.md 文件
✅ Step 3: 启动 5 个并行审查 agents
✅ Step 4: 置信度评分完成，过滤后保留 3 个问题

## AI 审查报告
...
```

### Example 2: Remote Branch Quick Review (NEW)
```bash
$ aireview origin/feature-cr

🔍 正在获取远程分支信息...
✅ 已获取远程更新
📊 变更统计: 1 file, +1/-1 lines
🎯 自动选择: quick mode (小型 PR)

🔍 正在执行快速审查...

## ⚡ 快速审查报告

**PR**: `feature-cr` → `master`
**提交**: 2338116 - "docs(BDD_FOR_ELECTRON): 更新测试案例说明"
**变更**: 1 file, +1/-1 lines

---

### ❌ 阻止合并

**问题: 非专业用语**
- 文件: `BDD_FOR_ELECTRON.md:2`
- 问题: "这是给王大爷的测试案例" 不符合技术文档规范
- 修复: 移除此行或改为专业描述

**建议修复**:
```markdown
# Electron 项目的 BDD 完整实施方案

> 本文档提供 Electron 桌面应用的 BDD 完整实施指南
```

---

### ✅ 合并建议

- [ ] 可以合并
- [x] **修复后合并** (移除非专业用语)
- [ ] 不建议合并

---

**审查模型**: Gemini (gemp)
**审查时间**: 2025-12-29 14:00
**耗时**: < 30 秒

🤖 Generated with Codex
```

### Example 3: Remote Branch Deep Review
```bash
$ aireview origin/feature-payment --deep

🔍 正在获取远程分支信息...
✅ 已获取远程更新
📊 变更统计: 15 files, +450/-120 lines
🎯 自动选择: deep mode (大型 PR)

🔍 正在执行深度多模型审查...

✅ Layer 1: 多 agent 并行审查 (5 agents)
✅ Layer 2: Gemini 架构分析 (INTJ)
✅ Layer 3: Claude Code 质量审计 (ISTJ)
✅ Layer 4: 综合分析

## 深度 AI 审查报告
...
```

### Example 4: Deep Review (Original)
```bash
$ aireview --diff --deep

🔍 正在执行深度多模型审查...

✅ Layer 1: 多 agent 并行审查 (5 agents)
✅ Layer 2: Gemini 架构分析 (INTJ)
✅ Layer 3: Claude Code 质量审计 (ISTJ)
✅ Layer 4: 综合分析

## 深度 AI 审查报告
...
```

### Example 5: PR Review with Comment
```bash
$ aireview --pr 123 --comment

🔍 正在审查 PR #123...

✅ 审查完成，发布评论到 PR
```

---

**核心创新**:
1. Combined with official multi-agent architecture
2. 保留原有的 CLI 直接调用优势
3. 引入置信度评分和 false positive 过滤
4. 增强的 MBTI 人格专业化
5. 分层深度分析 (multi-agent → Gemini → Codex)
