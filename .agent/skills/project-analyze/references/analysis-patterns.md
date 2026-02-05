# Project Analysis Patterns

## Overview

Common patterns and approaches for analyzing different types of projects using ProjectMind knowledge graph system.

---

## Pattern 1: Monolithic Web Application Analysis

**When**: Analyzing traditional web applications (Rails, Django, Express)

### Discovery Strategy

1. **Entry Points**
   - `package.json` / `Gemfile` / `requirements.txt` - dependencies
   - `server.js` / `app.py` / `config/routes.rb` - routing structure
   - `README.md` - project overview and setup

2. **Architecture Understanding**
   - Controllers/Views/Models (MVC pattern)
   - Middleware stack
   - Database schema and migrations
   - Asset pipeline

3. **Dependency Mapping**
   - External dependencies (npm, pip, gems)
   - Internal module dependencies
   - Database relationships
   - API endpoints

### Key Questions to Answer

- What's the request/response flow?
- How is authentication/authorization handled?
- What's the data model structure?
- How are background jobs processed?
- What's the deployment strategy?

### Analysis Output

```markdown
## Architecture: Monolithic MVC Web Application

**Stack**: [Framework + Database + Frontend]
**Entry Points**:
- Main server: `server.js:15`
- Routes: `routes/index.js`
- Database: `models/` (20 models)

**Key Components**:
- Authentication: Passport.js (JWT)
- Database: PostgreSQL + Sequelize ORM
- Frontend: React SPA (separate build)
- Background Jobs: Bull + Redis

**Complexity Indicators**:
- Controllers: 45 files
- Models: 20 entities
- Routes: 120 endpoints
- Migrations: 85 files
```

---

## Pattern 2: Microservices Architecture Analysis

**When**: Analyzing distributed service architectures

### Discovery Strategy

1. **Service Inventory**
   - List all service directories
   - Identify service boundaries
   - Map inter-service dependencies

2. **Communication Patterns**
   - REST APIs (OpenAPI specs)
   - Message queues (RabbitMQ, Kafka)
   - gRPC definitions
   - Event bus patterns

3. **Infrastructure**
   - Docker/Kubernetes configs
   - Service mesh (Istio, Linkerd)
   - API gateway
   - Service discovery

### Key Questions to Answer

- How many services are there?
- What's the service dependency graph?
- How do services communicate?
- What's the data ownership model?
- How is failure handled (circuit breakers)?

### Analysis Output

```markdown
## Architecture: Microservices (Event-Driven)

**Services**: 12 independent services
**Communication**:
- Sync: REST APIs (Express + Swagger)
- Async: RabbitMQ message bus
- API Gateway: Kong

**Service Map**:
- `user-service` → `auth-service`, `notification-service`
- `order-service` → `payment-service`, `inventory-service`
- `notification-service` → External: SendGrid, Twilio

**Key Patterns**:
- Event Sourcing: `order-service`, `inventory-service`
- CQRS: `reporting-service`
- Circuit Breaker: All external HTTP calls
- Saga Pattern: Order fulfillment workflow
```

---

## Pattern 3: Frontend SPA Analysis

**When**: Analyzing React, Vue, Angular applications

### Discovery Strategy

1. **Build Configuration**
   - Webpack/Vite/Parcel config
   - Environment variables
   - Build scripts

2. **Component Structure**
   - Component hierarchy
   - State management (Redux, MobX, Vuex)
   - Routing structure
   - API integration patterns

3. **Dependencies**
   - Core framework version
   - UI library (Material-UI, Ant Design)
   - Form handling
   - Data fetching (React Query, SWR)

### Key Questions to Answer

- What's the component organization strategy?
- How is global state managed?
- What's the routing structure?
- How are API calls handled?
- What's the build/deployment pipeline?

### Analysis Output

```markdown
## Architecture: React SPA with TypeScript

**Build**: Vite + TypeScript
**State Management**: Redux Toolkit + RTK Query
**Routing**: React Router v6 (20 routes)
**UI Framework**: Material-UI v5

**Component Structure**:
- Pages: 15 components (`src/pages/`)
- Shared: 40 components (`src/components/`)
- Hooks: 12 custom hooks (`src/hooks/`)
- Context: 3 contexts (Theme, Auth, Notifications)

**Key Patterns**:
- Compound Components: Form builders
- Render Props: Data fetching wrappers
- HOCs: Authentication guards
- Custom Hooks: API calls, form handling
```

---

## Pattern 4: Library/SDK Analysis

**When**: Analyzing reusable libraries and SDKs

### Discovery Strategy

1. **Public API Surface**
   - Exported functions/classes
   - TypeScript definitions
   - API documentation

2. **Internal Structure**
   - Core vs utilities
   - Internal dependencies
   - Extension points

3. **Build and Distribution**
   - Build pipeline (Rollup, TSC)
   - Package formats (CJS, ESM, UMD)
   - Browser vs Node.js support

### Key Questions to Answer

- What's the public API?
- What are the extension points?
- How is the library tested?
- What are the size/performance characteristics?
- What are the peer dependencies?

### Analysis Output

```markdown
## Architecture: Utility Library (Tree-shakeable ESM)

**Public API**: 45 functions across 6 categories
**Build**: Rollup + TypeScript
**Output**: ESM + CJS + UMD (5.2KB gzipped)

**API Categories**:
- Array utils: 12 functions
- Object utils: 10 functions
- String utils: 8 functions
- Date utils: 7 functions
- Function utils: 5 functions
- Async utils: 3 functions

**Key Characteristics**:
- Zero dependencies
- Tree-shakeable
- TypeScript native
- 100% test coverage (Jest)
- Browser + Node.js compatible
```

---

## Pattern 5: Monorepo Analysis

**When**: Analyzing projects with multiple packages

### Discovery Strategy

1. **Workspace Structure**
   - Package manager (npm workspaces, Yarn, pnpm, Lerna)
   - Package organization
   - Shared dependencies

2. **Inter-Package Dependencies**
   - Internal package dependencies
   - Shared configurations
   - Build orchestration

3. **Tooling**
   - Build pipeline (Nx, Turborepo)
   - Testing strategy
   - CI/CD setup

### Key Questions to Answer

- How many packages are there?
- What's the dependency graph?
- How are packages built and published?
- What's shared vs package-specific?
- How is versioning handled?

### Analysis Output

```markdown
## Architecture: Monorepo (pnpm workspaces)

**Packages**: 8 packages
**Structure**:
- `packages/core` - Core library
- `packages/react` - React bindings
- `packages/vue` - Vue bindings
- `packages/cli` - Command-line tool
- `apps/docs` - Documentation site
- `apps/playground` - Interactive playground

**Dependency Graph**:
- `@mylib/react` → `@mylib/core`
- `@mylib/vue` → `@mylib/core`
- `@mylib/cli` → `@mylib/core`
- `docs` → `@mylib/react`, `@mylib/vue`

**Build Orchestration**: Turborepo (3x faster builds)
**Shared Configs**: ESLint, TypeScript, Prettier
```

---

## Pattern 6: Legacy Codebase Analysis

**When**: Analyzing old or undocumented projects

### Discovery Strategy (Forensic Approach)

1. **Historical Analysis**
   - Git history (commit patterns, authors)
   - Last modification dates
   - Dead code detection

2. **Runtime Behavior**
   - Entry points and call graphs
   - Actual vs declared dependencies
   - Runtime errors and logs

3. **Refactoring Opportunities**
   - Code complexity metrics
   - Duplication detection
   - Outdated dependencies

### Key Questions to Answer

- What parts are actively maintained?
- What can be safely deleted?
- What dependencies are outdated?
- What's the test coverage?
- What are the biggest refactoring opportunities?

### Analysis Output

```markdown
## Architecture: Legacy Codebase (Needs Modernization)

**Age**: 7 years (first commit: 2018-03-15)
**Last Updated**: 3 months ago (partial)
**Technical Debt**: High

**Health Metrics**:
- Active Files: 340 / 890 (38%)
- Dead Code: ~550 files (62%)
- Outdated Dependencies: 45 / 67 (67%)
- Test Coverage: 23%

**Refactoring Priorities**:
1. Remove dead code (estimated 60% size reduction)
2. Update critical dependencies (12 security vulnerabilities)
3. Add tests for core business logic
4. Extract API layer (currently mixed with UI)

**Risk Assessment**:
- High: No tests for payment processing
- Medium: Outdated authentication library
- Low: UI framework version (still supported)
```

---

## Common Analysis Metrics

### Codebase Size
- Total files
- Lines of code
- File type distribution

### Complexity
- Average cyclomatic complexity
- Deepest nesting level
- Longest functions/files

### Dependencies
- Direct dependencies count
- Transitive dependencies count
- Dependency tree depth
- Outdated dependencies

### Maintainability
- Test coverage percentage
- Documentation coverage
- Code duplication percentage
- Technical debt ratio

### Activity
- Commit frequency
- Contributors count
- Last modification dates
- Hotspot files (most changed)

---

## Analysis Workflow Template

```markdown
# Project Analysis Workflow

## Phase 1: Discovery (5-10 minutes)
1. Read README.md and package.json
2. Identify project type and stack
3. Locate entry points
4. Map directory structure

## Phase 2: Deep Dive (15-20 minutes)
1. Analyze architecture pattern
2. Map dependencies (internal + external)
3. Identify key components
4. Understand data flow

## Phase 3: Assessment (5-10 minutes)
1. Calculate complexity metrics
2. Identify technical debt
3. Find refactoring opportunities
4. Document findings

## Phase 4: Reporting (10 minutes)
1. Summarize architecture
2. Highlight key insights
3. Provide recommendations
4. Create visual dependency graph
```

**Total Time**: 35-50 minutes for comprehensive analysis

---

## Quick Reference: Analysis by Project Type

| Project Type | Entry Point | Key Files | Analysis Focus |
|--------------|-------------|-----------|----------------|
| Express API | `server.js`, `app.js` | `routes/`, `controllers/` | Endpoints, middleware |
| React SPA | `index.tsx`, `App.tsx` | `components/`, `pages/` | Component structure, state |
| Library | `index.ts`, `package.json` | `src/`, `dist/` | Public API, build output |
| Monorepo | `package.json`, `pnpm-workspace.yaml` | `packages/`, `apps/` | Inter-package deps |
| Microservices | `docker-compose.yml` | Service directories | Service boundaries |
| CLI Tool | `bin/` scripts | `commands/` | Command structure |
