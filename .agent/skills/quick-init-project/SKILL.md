---
name: quick-init-project
description: This skill should be used when the user asks to "快速初始化项目", "根据需求推荐全栈还是前端/后端", "初始化 monorepo", "生成项目脚手架方案", "project bootstrap recommendation", or "fullstack vs frontend vs backend decision".
version: 0.1.0
argument-hint: <product requirement or idea>
source: fork
checksum: 5d6ece0635e703755dde1b33b636654a8ebe7f61999d4f6772ab3a3282fab9e6
updated_at: 2026-02-26T06:20:35.931Z
---


# Quick Init Project Skill

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

> Codex invocation: use `$quick-init-project ...` or `quick-init-project: ...`

输入需求后，输出“项目模式决策 + 技术栈 + 目录结构 + 初始化命令”的完整启动方案。

## Purpose

用最少信息在 5-10 分钟内完成以下动作：
1. 在 `full-stack` / `frontend-only` / `backend-only` / `demo` 之间做可解释决策。
2. 优先选择训练数据密集、生态成熟、样例丰富的技术栈。
3. 默认给出 `Monorepo + 模块化分层` 结构，并在不适合时降级。
4. 输出可直接执行的初始化命令和首批目录结构。

## Research Baseline (as of 2026-02-26)

决策默认基于以下公开信号：
- Stack Overflow Developer Survey 2024: Node.js 40.8%, React 39.5%, Next.js 17.9%, NestJS 5.8%
- State of JS 2024: 67% respondents write more TypeScript than JavaScript
- State of CSS 2024: Tailwind CSS usage significantly leads CSS framework category
- npm weekly downloads (2026-02-18 to 2026-02-24):
  - `typescript`: 131,004,723
  - `react`: 96,415,450
  - `tailwindcss`: 60,494,373
  - `next`: 36,026,759
  - `@nestjs/core`: 7,290,173

## Input Contract

至少提取以下输入；缺失时先按默认值执行并标注假设：
- Product goal: 目标用户与核心场景
- Delivery speed: `urgent (<1 week)` / `normal (2-4 weeks)` / `long (>4 weeks)`
- Team shape: 偏前端 / 偏后端 / 全栈
- Runtime: web / api / both
- Data complexity: low / medium / high

默认假设：`normal + 小团队 + web-first + medium complexity`。

## Mode Selection

### Step 1: Hard Gates

按顺序检查，命中即直接选模式：
1. 只做概念演示、验证想法、不要求生产可用 -> `demo`
2. 后端已存在且 API 契约稳定，只需交付 UI -> `frontend-only`
3. 前端消费方已存在，只需交付 API/服务 -> `backend-only`
4. 前后端同时交付且接口会频繁联动 -> 进入打分（通常 `full-stack`）

### Step 2: Weighted Scoring (0-100)

维度打分范围 `1-5`：
- Requirement complexity (weight 25)
- Delivery speed pressure (weight 20)
- Team skill fitness (weight 20)
- Deployment constraint strength (weight 15)
- Data/state complexity (weight 20)

模式目标画像：
- `full-stack`: [4, 3, 4, 3, 4]
- `frontend-only`: [2, 4, 4, 3, 2]
- `backend-only`: [3, 3, 4, 4, 4]
- `demo`: [1, 5, 3, 1, 1]

计算：
- `fit = 5 - abs(actual - target)`
- `modeScore = Σ(fit/5 * weight)`

决策规则：
1. Top score < 60 -> fallback to `demo` + 输出信息缺口
2. Top1 - Top2 >= 8 -> 直接选 Top1
3. 差值 < 8 -> 依次比较 `delivery speed`、`team skill fitness`、`change surface`

## Tech Stack Policy (Data-Dense First)

### Preferred Default Stack

- Language: `TypeScript`
- Frontend: `React + Next.js (App Router) + Tailwind CSS`
- Backend: `NestJS (REST-first) + OpenAPI`
- Package manager: `pnpm`
- Repository: `Monorepo` (pnpm workspaces)
- Task orchestration: `Turborepo` (default), upgrade to `Nx` when governance is required
- Quality baseline: `ESLint + Prettier + Vitest + Playwright`

### Escalation to Nx

从 Turborepo 升级到 Nx 的触发条件：
- 项目数量 >= 6 个包/应用
- 需要强制模块边界（lint-level boundaries）
- 需要成熟的 affected execution 与更强治理

### Downgrade Rules

- 超短期 PoC 且只要可运行页面 -> 可降级到单仓单应用（非 monorepo）
- 后端单服务且无共享包 -> 可暂不启用 monorepo

## Architecture Templates

### 1) full-stack

```text
repo/
  apps/
    web/           # Next.js
    api/           # NestJS
  packages/
    ui/            # React shared components
    config/        # eslint/tsconfig/prettier shared config
    types/         # shared DTO/types
    sdk/           # typed API client
  turbo.json
  pnpm-workspace.yaml
  tsconfig.base.json
```

Layering rules:
- `apps/*` can depend on `packages/*`
- `packages/ui` cannot depend on `apps/*`
- `packages/types` must stay framework-agnostic

### 2) frontend-only

```text
repo/
  apps/web/
  packages/
    ui/
    config/
    types/
```

默认使用 `MSW` 或 mock server 解耦后端可用性。

### 3) backend-only

```text
repo/
  apps/api/
  packages/
    config/
    types/
    contracts/     # OpenAPI schema + generated clients
```

默认先交付 `OpenAPI` 与 health/readiness endpoints。

### 4) demo

```text
repo/
  apps/demo/
  packages/config/
```

限制范围：单条主流程 + 最少依赖 + 可快速演示。

## Execution Workflow

### Phase A: Requirement Parsing

输出 1 屏摘要：
- Problem statement
- Assumptions
- Unknowns

### Phase B: Mode Decision

输出：
- `Selected Mode`
- `Scores`
- `Hard Gate Hit` (if any)
- `Reasoning` (max 3 bullets)
- `Risk Note` (1 line)

### Phase C: Bootstrap Plan

每次都输出：
1. 目录结构
2. 初始化命令
3. 里程碑（Day 1 / Day 3 / Day 7）
4. 最小验证命令（lint/test/build/dev）

### Phase D: Command Generation

按模式生成首轮命令。默认命令模板：

```bash
pnpm dlx create-turbo@latest
pnpm install
pnpm -r lint
pnpm -r test
pnpm -r build
```

若 `frontend-only` 且非 monorepo：

```bash
pnpm create next-app@latest web --ts --tailwind --eslint --app
cd web && pnpm test
```

若 `backend-only` 且非 monorepo：

```bash
pnpm add -g @nestjs/cli
nest new api
cd api && pnpm test
```

## Output Format

每次执行必须返回：

```text
## Init Recommendation
- Selected Mode: <full-stack|frontend-only|backend-only|demo>
- Confidence: <HIGH|MEDIUM|LOW>

## Decision Evidence
- Hard Gate: <rule-id or none>
- Scores: full-stack=<n>, frontend-only=<n>, backend-only=<n>, demo=<n>
- Why: <3 bullets max>

## Recommended Stack
- Runtime: ...
- Frameworks: ...
- Repo Strategy: ...

## Bootstrap Commands
[exact commands here]

## Folder Blueprint
[tree here]

## 7-Day Plan
1. Day 1 ...
2. Day 3 ...
3. Day 7 ...

## Risks & Mitigations
- Risk: ...
- Mitigation: ...
```

## Quality Gates

在宣称“可初始化”之前必须满足：
1. 模式选择有可追踪依据（hard gate 或完整打分）
2. 技术栈包含 TypeScript，且说明为何不是默认栈时的原因
3. 命令可直接执行，不含占位符
4. 目录结构与模式一致
5. 给出至少一个风险与缓解

## Sources

- Stack Overflow Developer Survey 2024 (Technology): https://survey.stackoverflow.co/2024/technology
- State of JS 2024 (Usage): https://2024.stateofjs.com/en-US/usage/
- State of CSS 2024 (Tools): https://2024.stateofcss.com/en-US/tools/
- npm downloads API:
  - https://api.npmjs.org/downloads/point/last-week/typescript
  - https://api.npmjs.org/downloads/point/last-week/react
  - https://api.npmjs.org/downloads/point/last-week/tailwindcss
  - https://api.npmjs.org/downloads/point/last-week/next
  - https://api.npmjs.org/downloads/point/last-week/@nestjs/core
- Turborepo docs: https://turborepo.com/docs
- pnpm workspaces: https://pnpm.io/workspaces
- Nx monorepo docs: https://nx.dev/docs/features/maintain-typescript-monorepos
- TypeScript project references: https://www.typescriptlang.org/docs/handbook/project-references
