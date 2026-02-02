---
name: start-dev
description: Intelligent adaptive workflow with automatic pattern library loading, codebase exploration, and multi-approach planning for Codex CLI.
---

# start-dev - Codex CLI Adaptive Workflow

## Purpose
Use this skill for feature work that benefits from structured discovery, pattern-guided planning, and safe implementation.

## Constraints (Codex CLI)
- Codex CLI has no subagents. Simulate roles via required sections.
- Do not use Codex plugins, hooks, or HUD features.
- Prefer local codebase and repo docs. Use web only if the user explicitly requests it or critical info is missing.

## Required Sections (in order)
```
[ANALYST] Summary + constraints
[ARCHITECT] Approach + components
[EXECUTOR] Actions + changes
[REVIEWER] Verification + risks
```

## Invocation
```
start-dev <feature description>
start-dev --no-explore <feature>
start-dev --force-explore <feature>
start-dev --frontend <feature>
start-dev --backend <feature>
```

## Task Type Detection
Auto-detect task type unless overridden.

Frontend keywords:
- UI, 界面, 组件, 页面, 表单, 前端
- React, Vue, Angular, 样式, CSS
- 用户交互, 动画, 响应式, 布局
- Component, Hook, State, Props

Backend keywords:
- API, 接口, 服务, 数据库, 后端
- 认证, 授权, 中间件, 缓存
- Redis, PostgreSQL, MongoDB
- Authentication, Authorization, Middleware

Full-stack keywords:
- 全栈, 完整功能, 端到端, full-stack
- 前后端, 整体实现, complete feature

## Phase 0A: Pattern Loading (Automatic)
Actions:
1. Detect task type (frontend/backend/full-stack).
2. Load relevant pattern library:
   - Frontend: `.agent/skills/frontend-patterns/SKILL.md`
   - Backend: `.agent/skills/backend-patterns/SKILL.md`
   - Full-stack: both
3. Extract 3-5 relevant patterns and examples.
4. Record a short PatternContext (bullets only).

Output snippet:
```
PatternContext
- Task type: frontend
- Patterns: Form handling, useForm hook, error boundaries
- Risks: validation edge cases
```

## Phase 0B: Codebase Exploration (Conditional)
Trigger:
- Auto if request references existing code or integration points.
- `--force-explore` always explores, `--no-explore` skips.

Actions:
- Use `rg` to find related files and entry points.
- Read 3-8 key files to learn conventions.
- Note integration points and constraints.

## Phase 1: Research (Local-first)
Actions:
- Identify library versions from `package.json` and lockfiles.
- Read local docs or README files.
- If missing and user allows, use web for version-accurate docs.

Output: short ResearchPack summary with version + 2-3 APIs or usage notes.

## Phase 2: Planning (Minimal-change first)
Actions:
- Compare 2 approaches:
  - Minimal change (default)
  - Clean architecture (optional)
- Select one and produce an Implementation Plan:
  - Files to modify/create
  - Step-by-step sequence
  - Rollback plan
  - Risks
  - Pattern references

## Phase 3: Implementation (Plan-driven)
Actions:
- Execute plan with small, reversible steps.
- Keep diffs minimal unless user asks for refactor.
- If user requested TDD, write tests first.

## Phase 4: Review (Self-check)
Actions:
- Verify plan compliance, tests run (if any), and regression risks.
- Call out deviations and open questions.

## Output Template (Required)
```
[ANALYST]
- Goal:
- Task type:
- Constraints:
- PatternContext:

[ARCHITECT]
- Approach:
- Key components:
- Files touched:
- Risks:

[EXECUTOR]
- Actions:
- Changes:
- Tests:

[REVIEWER]
- Verification:
- Risks:
- Follow-ups:
```

## Examples
Example 1 (frontend):
```
start-dev 实现用户登录表单，包含邮箱和密码验证
```

Example 2 (backend):
```
start-dev Add JWT authentication middleware to Express API
```

Example 3 (full-stack):
```
start-dev 实现完整的用户认证功能，包括前端登录界面和后端API
```

## Notes
- Keep responses concise and actionable.
- Do not claim to have run tests unless actually executed.
- If exploration is skipped, explicitly say so.
