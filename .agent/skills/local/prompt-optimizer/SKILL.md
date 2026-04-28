---
name: prompt-optimizer
description: >-
  Analyze raw prompts, identify intent and gaps, match oh-my-codex skills
  (138 installed skills across local/oh-my-codex/superpowers/ecc sources),
  and output a ready-to-paste optimized prompt for Codex.
  Advisory role only — never executes the task itself.
  TRIGGER when: user says "optimize prompt", "improve my prompt",
  "how to write a prompt for", "help me prompt", "rewrite this prompt",
  or explicitly asks to enhance prompt quality. Also triggers on Chinese
  equivalents: "优化prompt", "改进prompt", "怎么写prompt", "帮我优化这个指令".
  DO NOT TRIGGER when: user wants the task executed directly, or says
  "just do it" / "直接做". DO NOT TRIGGER when user says "优化代码",
  "优化性能", "optimize performance", "optimize this code" — those are
  refactoring/performance tasks, not prompt optimization.
origin: local
metadata:
  author: oh-my-codex
  version: "1.0.0"
  based-on: ecc/prompt-optimizer@1.0.0
---

# Prompt Optimizer (oh-my-codex Edition)

Analyze a draft prompt, critique it, match it to oh-my-codex installed skills,
and output a complete optimized prompt the user can paste and run in Codex.

## When to Use

- User says "optimize this prompt", "improve my prompt", "rewrite this prompt"
- User says "help me write a better prompt for..."
- User says "what's the best way to ask Codex to..."
- User says "优化prompt", "改进prompt", "怎么写prompt", "帮我优化这个指令"
- User pastes a draft prompt and asks for feedback or enhancement
- User says "I don't know how to prompt for this"
- User explicitly invokes the `prompt-optimize` skill by name

### Do Not Use When

- User wants the task done directly (just execute it)
- User says "优化代码", "优化性能", "optimize this code", "optimize performance"
- User says "just do it" or "直接做"

## How It Works

**Advisory only — do not execute the user's task.**

Do NOT write code, create files, run commands, or take any implementation
action. Your ONLY output is an analysis plus an optimized prompt.

Run this 6-phase pipeline sequentially. Present results using the Output Format below.

---

### Phase 0: Project Detection

Before analyzing the prompt, detect the current project context:

1. Check if `AGENTS.md` or `CLAUDE.md` exists in the working directory — read it for conventions
2. Detect tech stack from project files:
   - `package.json` → Node.js / TypeScript / React / Next.js
   - `go.mod` → Go
   - `pyproject.toml` / `requirements.txt` → Python
   - `Cargo.toml` → Rust
   - `build.gradle` / `pom.xml` → Java / Kotlin / Spring Boot
   - `Package.swift` → Swift / iOS
   - `Gemfile` → Ruby
   - `composer.json` → PHP
   - `*.csproj` / `*.sln` → .NET
   - `Makefile` / `CMakeLists.txt` → C / C++
3. Note detected tech stack for Phase 3 and Phase 4

If no project files found, flag "tech stack unknown" in Phase 4.

---

### Phase 1: Intent Detection

Classify the user's task into one or more categories:

| Category | Signal Words | Example |
|----------|-------------|---------|
| New Feature | build, create, add, implement, 创建, 实现, 添加 | "Build a login page" |
| Bug Fix | fix, broken, not working, error, 修复, 报错 | "Fix the auth flow" |
| Refactor | refactor, clean up, restructure, 重构, 整理 | "Refactor the API layer" |
| Research | how to, what is, explore, investigate, 怎么, 如何 | "How to add SSO" |
| Testing | test, coverage, verify, 测试, 覆盖率 | "Add tests for the cart" |
| Review | review, audit, check, 审查, 检查 | "Review my PR" |
| Documentation | document, update docs, 文档 | "Update the API docs" |
| Infrastructure | deploy, CI, docker, database, 部署, 数据库 | "Set up CI/CD pipeline" |
| Design | design, architecture, plan, 设计, 架构 | "Design the data model" |

---

### Phase 2: Scope Assessment

| Scope | Heuristic | Orchestration |
|-------|-----------|---------------|
| TRIVIAL | Single file, < 50 lines | Direct execution |
| LOW | Single component or module | Single skill |
| MEDIUM | Multiple components, same domain | Skill chain + `verify` |
| HIGH | Cross-domain, 5+ files | `plan` first, then phased execution |
| EPIC | Multi-session, multi-PR, architectural shift | `ralplan` for multi-session blueprint |

---

### Phase 3: oh-my-codex Skill Matching

Map intent + scope + tech stack to **installed oh-my-codex skills**.

#### By Intent Type

| Intent | Primary Skills | Supporting Skills |
|--------|---------------|------------------|
| New Feature | `plan`, `tdd`, `code-review`, `verify` | `brainstorming`, `architect-planner`, `verification-loop` |
| Bug Fix | `tdd`, `build-fix`, `verify` | `systematic-debugging`, `debug-analysis`, `trace` |
| Refactor | `refactor-clean`, `code-review`, `verify` | `verification-loop`, `coding-standards` |
| Research | `research`, `deepsearch`, `iterative-retrieval` | `plan`, `multi-model-research` |
| Testing | `tdd`, `e2e`, `test-coverage` | `tdd-workflow`, `tdd-generator`, `test-gen`, `bdd-generator` |
| Review | `code-review`, `security-review`, `aireview` | `requesting-code-review`, `receiving-code-review` |
| Documentation | `update-docs`, `update-codemaps` | `writer-memory` |
| Infrastructure | `plan`, `verify`, `mcp-setup` | `mcp-server-patterns`, `backend-patterns` |
| Design (MEDIUM-HIGH) | `plan`, `brainstorming`, `architect-planner` | `planning-methodology`, `planning-with-files` |
| Design (EPIC) | `ralplan`, `ultrawork` | `ralph`, `team` |

#### By Tech Stack

| Tech Stack | Skills to Add | Notes |
|------------|--------------|-------|
| TypeScript / React | `frontend-patterns`, `frontend-design`, `coding-standards` | Add `nextjs-turbopack` for Next.js projects |
| Node.js / Next.js | `backend-patterns`, `frontend-patterns`, `nextjs-turbopack` | Full-stack pattern coverage |
| Go | `backend-patterns`, `coding-standards` | |
| Python | `backend-patterns`, `coding-standards` | |
| Swift / iOS | `backend-patterns`, `coding-standards` | iOS architecture patterns |
| Rust / C++ | `coding-standards` | Low-level safety focus |
| Any frontend | `frontend-ui-ux`, `ui-ux-pro-max` | Add for UI-heavy tasks |
| API design | `api-design`, `backend-patterns` | REST/GraphQL endpoint work |
| Database | `backend-patterns` | Schema + migration focus |
| Any stack | `coding-standards` | Universal baseline |

#### By Scope Escalation

| Scope | Orchestration Skills |
|-------|---------------------|
| MEDIUM | `plan` → implement → `verify` |
| HIGH | `plan` → phased implement → `code-review` → `verify` |
| EPIC | `ralplan` → `ultrawork` (or `ralph`) → `verify` gates between phases |
| Multi-session | `project-session-manager` to save/resume context |

---

### Phase 4: Missing Context Detection

Scan the prompt for missing critical information:

- [ ] **Tech stack** — Detected in Phase 0, or must user specify?
- [ ] **Target scope** — Files, directories, or modules mentioned?
- [ ] **Acceptance criteria** — How to know the task is done?
- [ ] **Error handling** — Edge cases and failure modes addressed?
- [ ] **Security requirements** — Auth, input validation, secrets?
- [ ] **Testing expectations** — Unit, integration, E2E?
- [ ] **Performance constraints** — Load, latency, resource limits?
- [ ] **UI/UX requirements** — Design specs, responsive, a11y? (if frontend)
- [ ] **Database changes** — Schema, migrations, indexes? (if data layer)
- [ ] **Existing patterns** — Reference files or conventions to follow?
- [ ] **Scope boundaries** — What NOT to do?

**If 3+ critical items are missing**, ask up to 3 clarification questions before
generating the optimized prompt. Incorporate answers into the output.

---

### Phase 5: Workflow & Model Recommendation

Lifecycle position:

```
Research → Plan → Implement (TDD) → Review → Verify → Commit
```

For MEDIUM+ tasks, always start with `plan` skill.
For EPIC tasks, use `ralplan` skill (multi-session blueprint).

**Model recommendation:**

| Scope | Model | Rationale |
|-------|-------|-----------|
| TRIVIAL-LOW | Sonnet 4.6 | Fast, cost-efficient |
| MEDIUM | Sonnet 4.6 | Best coding model for standard work |
| HIGH | Sonnet 4.6 (impl) + Opus 4.7 (planning) | Opus for architecture decisions |
| EPIC | Opus 4.7 (blueprint) + Sonnet 4.6 (execution) | Deep reasoning for multi-session planning |

**Multi-prompt splitting (for HIGH/EPIC scope):**

- Prompt 1: Research + Plan (`research`/`deepsearch` skill, then `plan` skill)
- Prompt 2–N: Implement one phase per prompt (each ends with `verify` skill)
- Final Prompt: Integration test + `code-review` across all phases
- Use `project-session-manager` skill to preserve context between sessions

---

## Output Format

Present analysis in this exact structure. **Respond in the same language as the user's input.**

### Section 1: Prompt Diagnosis

**Strengths:** What the original prompt does well.

**Issues:**

| Issue | Impact | Suggested Fix |
|-------|--------|---------------|
| (problem) | (consequence) | (how to fix) |

**Needs Clarification:** Numbered list of questions (omit if Phase 0 auto-detected the answer).

---

### Section 2: Recommended oh-my-codex Skills

| Type | Skill | Purpose |
|------|-------|---------|
| Planning | `plan` | Architecture before coding |
| Testing | `tdd` | Test-driven implementation |
| Review | `code-review` | Post-implementation review |
| Verification | `verify` | Confirm correctness |
| Model | Sonnet 4.6 | Recommended for this scope |

Only list skills that are actually useful for this task. Do not pad the table.

---

### Section 3: Optimized Prompt — Full Version

Present the complete optimized prompt inside a single fenced code block.
Must be self-contained and ready to copy-paste into Codex. Include:
- Clear task description with context
- Tech stack (detected or specified)
- Skill invocations at the right workflow stages (write as: "Use the `plan` skill to...")
- Acceptance criteria
- Verification steps
- Scope boundaries (what NOT to do)

**Do NOT use slash-command syntax** — Codex activates skills via conversation, not
slash commands. Write skill references as natural language:
"Use the `plan` skill", "Run `tdd` skill", "Apply `verify` skill".

---

### Section 4: Optimized Prompt — Quick Version

Compact version for experienced users:

| Intent | Quick Pattern |
|--------|--------------|
| New Feature | `` `plan` → `tdd` → implement → `code-review` → `verify` `` |
| Bug Fix | `` `tdd` — write failing test for [bug]. Fix to green. `verify`. `` |
| Refactor | `` `refactor-clean` [scope]. `code-review`. `verify`. `` |
| Research | `` `deepsearch`/`research` for [topic]. `plan` based on findings. `` |
| Testing | `` `tdd` [module]. `e2e` for critical flows. `test-coverage`. `` |
| Review | `` `code-review`. Then `security-review`. `` |
| Docs | `` `update-docs`. `update-codemaps`. `` |
| EPIC | `` `ralplan` for "[objective]". Execute phases with `verify` gates. `` |

---

### Section 5: Enhancement Rationale

| Enhancement | Reason |
|-------------|--------|
| (what was added) | (why it matters) |

---

### Footer

> Not what you need? Tell me what to adjust, or make a normal task request
> if you want execution instead of prompt optimization.

---

## Examples

### Example 1: Vague Chinese Prompt (Project Detected)

**User input:**
```
帮我写一个用户登录页面
```

**Phase 0 detects:** `package.json` with Next.js 15, TypeScript, Tailwind CSS

**Optimized Prompt (Full):**
```
使用项目现有技术栈（Next.js 15 + TypeScript + Tailwind CSS）实现用户登录页面。

技术要求：
- 沿用项目现有组件结构和路由约定
- 表单验证使用项目现有方案（Zod/Yup/其他，先搜索确认）
- 认证方式沿用现有方案（如无则默认 JWT）
- 包含：邮箱/密码表单、验证、错误提示、加载状态、响应式布局

工作流：
1. 使用 `plan` skill 规划组件结构和认证流程，参考现有页面模式
2. 使用 `tdd` skill 先写失败测试（表单单元测试 + 认证集成测试）
3. 实现登录页面和认证逻辑
4. 使用 `code-review` skill 审查实现
5. 使用 `verify` skill 确认所有测试通过且页面正常渲染

安全要求：密码不明文传输、防暴力破解、XSS 防护、CSRF token

验收标准：
- 所有测试通过，覆盖率 80%+
- 移动端和桌面端正常渲染
- 登录成功跳转 dashboard，失败显示错误

不要做：不实现注册页面、不实现忘记密码、不修改现有路由结构
```

---

### Example 2: English Prompt (Go Project)

**User input:**
```
Add a REST API endpoint for user profile updates with validation
```

**Phase 0 detects:** `go.mod` with Go 1.22, Chi router

**Optimized Prompt (Full):**
```
Add a REST API endpoint for user profile updates (PATCH /api/users/:id).

Tech stack: Go 1.22 + Chi router (detected from project)

Requirements:
- PATCH /api/users/:id — partial update (name, email, avatar_url, bio)
- Input validation for all fields
- Auth: require valid token, users can only update own profile
- Return 200 with updated user on success; 400 for validation errors; 401/403 for auth

Workflow:
1. Use `plan` skill to design endpoint structure, middleware chain, and validation logic
2. Use `tdd` skill — write table-driven tests for success, validation failure, auth failure, not-found
3. Implement following existing handler patterns in the codebase
4. Use `code-review` skill + `security-review` skill
5. Use `verify` skill — run full test suite, confirm no regressions

Do not: modify existing endpoints, change database schema, add new dependencies without
first using `deepsearch` skill to check existing ones.
```

---

### Example 3: EPIC Scope

**User input:**
```
Migrate our monolith to microservices
```

**Optimized Prompt (Full):**
```
Use the `ralplan` skill to create a multi-session blueprint for:
"Migrate monolith to microservices architecture"

Before executing, the blueprint must answer:
1. Which domain boundaries exist in the current monolith?
2. Which service to extract first (lowest coupling)?
3. Communication pattern: REST, gRPC, or event-driven?
4. Database strategy: shared DB initially or database-per-service?
5. Deployment target: Kubernetes, Docker Compose, or serverless?

Blueprint phases:
- Phase 1: Identify service boundaries, create domain map
- Phase 2: Set up infrastructure (API gateway, CI/CD per service)
- Phase 3: Extract first service (strangler fig pattern)
- Phase 4: Verify with integration tests, extract next service
- Phase N: Decommission monolith

Each phase = 1 PR with `verify` skill gate.
Use `project-session-manager` skill between phases to preserve context.
Use `using-git-worktrees` skill for parallel service extraction.

Recommended: Opus 4.7 for blueprint planning, Sonnet 4.6 for phase execution.
```

---

## Installed Skills Reference

Key skills available in this oh-my-codex installation (138 total):

**Planning & Architecture:** `plan`, `brainstorming`, `architect-planner`, `planning-methodology`, `planning-with-files`, `ralplan`, `ultrawork`, `ralph`

**Implementation:** `tdd`, `tdd-workflow`, `build-fix`, `refactor-clean`, `coding-standards`, `backend-patterns`, `frontend-patterns`, `frontend-design`, `api-design`

**Testing:** `tdd-generator`, `test-gen`, `test-coverage`, `e2e`, `e2e-testing`, `bdd-generator`, `verify`, `verification-loop`

**Review & Quality:** `code-review`, `security-review`, `aireview`, `quality-check`, `quality-validation`, `requesting-code-review`, `receiving-code-review`

**Research:** `research`, `deepsearch`, `iterative-retrieval`, `multi-model-research`, `documentation-lookup`

**Documentation:** `update-docs`, `update-codemaps`, `writer-memory`

**Debugging:** `systematic-debugging`, `debug-analysis`, `trace`, `log-analyzer`

**Orchestration:** `team`, `swarm`, `conductor`, `pipeline`, `autopilot`, `ultraqa`

**Session Management:** `project-session-manager`, `checkpoint`, `strategic-compact`

**Frontend:** `frontend-ui-ux`, `ui-ux-pro-max`, `frontend-slides`, `web-clone`, `nextjs-turbopack`

**Infrastructure:** `mcp-setup`, `mcp-server-patterns`, `start-dev`, `release`, `git-master`

**Skill Tools:** `skill-create`, `skill-development`, `skill-tester`, `skill-quality-analyzer`
