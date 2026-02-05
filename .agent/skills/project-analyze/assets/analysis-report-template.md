# Project Analysis Report

**Project Name**: [Project Name]
**Location**: [File Path]
**Analysis Date**: [YYYY-MM-DD]
**Analyzer**: ProjectMind v2.0
**Analysis Duration**: [XX seconds]

---

## Executive Summary

**Project Type**: [React SPA / Express API / Library / Monorepo / etc.]
**Complexity**: [Low / Medium / High / Very High]
**Health Score**: [XX/100]
**Maintainability**: [Excellent / Good / Fair / Poor]

**Quick Stats**:
- Total Files: [X,XXX]
- Lines of Code: [XXX,XXX]
- Dependencies: [XX direct, XXX transitive]
- Test Coverage: [XX%]
- Technical Debt: [Low / Medium / High]

---

## Architecture Overview

### Stack

**Frontend**:
- Framework: [React 18.2.0 / Vue 3 / Angular / etc.]
- Build Tool: [Vite / Webpack / etc.]
- UI Library: [Material-UI / Ant Design / etc.]
- State Management: [Redux / MobX / Zustand / etc.]

**Backend** (if applicable):
- Runtime: [Node.js 18.x / Python 3.11 / etc.]
- Framework: [Express / Fastify / Django / etc.]
- Database: [PostgreSQL / MongoDB / etc.]
- ORM: [Prisma / TypeORM / etc.]

**Infrastructure**:
- Containerization: [Docker / none]
- Orchestration: [Kubernetes / Docker Compose / none]
- CI/CD: [GitHub Actions / GitLab CI / etc.]

---

### Architecture Pattern

**Primary Pattern**: [Pattern Name]

```
[ASCII diagram or description of architecture]

Example for MVC:
┌─────────────────┐
│   Controllers   │ ← HTTP Requests
└────────┬────────┘
         │
    ┌────▼────┐
    │ Services │ ← Business Logic
    └────┬────┘
         │
    ┌────▼────┐
    │ Models   │ ← Data Access
    └─────────┘
         │
    ┌────▼────┐
    │ Database │
    └─────────┘
```

**Key Characteristics**:
- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]

---

## Project Structure

### Directory Layout

```
project-root/
├── src/                    [XXX files, XXX KB]
│   ├── components/         [XX files] - Reusable UI components
│   ├── pages/              [XX files] - Page-level components
│   ├── services/           [XX files] - Business logic
│   ├── utils/              [XX files] - Utility functions
│   └── types/              [XX files] - TypeScript definitions
├── tests/                  [XXX files, XX% coverage]
├── public/                 [Static assets]
├── config/                 [Configuration files]
└── docs/                   [Documentation]
```

### File Distribution

| Type | Count | Percentage | Total Size |
|------|-------|------------|------------|
| TypeScript/JavaScript | [XXX] | [XX%] | [XXX KB] |
| Tests | [XXX] | [XX%] | [XXX KB] |
| Config | [XX] | [X%] | [XX KB] |
| Documentation | [XX] | [X%] | [XX KB] |
| Other | [XX] | [X%] | [XX KB] |

---

## Dependencies Analysis

### Direct Dependencies ([XX] total)

**Production Dependencies** ([XX]):
- `[package-1]@[version]` - [Purpose]
- `[package-2]@[version]` - [Purpose]
- `[package-3]@[version]` - [Purpose]
- ... [See full list in package.json]

**Development Dependencies** ([XX]):
- `[package-1]@[version]` - [Purpose]
- `[package-2]@[version]` - [Purpose]
- ... [See full list in package.json]

### Dependency Health

| Metric | Value | Status |
|--------|-------|--------|
| Total Dependencies | [XXX] | [✅ / ⚠️ / ❌] |
| Outdated | [XX] ([XX%]) | [✅ / ⚠️ / ❌] |
| Security Vulnerabilities | [XX] | [✅ / ⚠️ / ❌] |
| Duplicate Dependencies | [XX] | [✅ / ⚠️ / ❌] |
| Average Dependency Age | [X.X years] | [✅ / ⚠️ / ❌] |

### Critical Outdated Dependencies

| Package | Current | Latest | Severity | Action Required |
|---------|---------|--------|----------|-----------------|
| [package-1] | [1.0.0] | [2.5.0] | [High] | [Breaking changes] |
| [package-2] | [3.2.1] | [4.0.0] | [Medium] | [Feature updates] |

### Security Vulnerabilities

| Package | Severity | CVE | Fix Available |
|---------|----------|-----|---------------|
| [package-1] | Critical | CVE-2023-XXXX | Yes (v2.3.1) |
| [package-2] | High | CVE-2023-YYYY | Yes (v1.5.0) |

---

## Component Analysis

### Layer Distribution

| Layer | Files | Percentage | Purpose |
|-------|-------|------------|---------|
| Presentation | [XXX] | [XX%] | UI components, pages |
| Business Logic | [XXX] | [XX%] | Services, models |
| Data Access | [XXX] | [XX%] | Repositories, APIs |
| Infrastructure | [XXX] | [XX%] | Config, utilities |

### Key Components

**Entry Points**:
- Main: `src/index.tsx:15`
- Server: `src/server.ts:42` (if applicable)
- CLI: `src/cli.ts:10` (if applicable)

**Core Modules** (most imported):
1. `src/utils/api.ts` - [XXX imports]
2. `src/services/auth.ts` - [XXX imports]
3. `src/components/Button.tsx` - [XXX imports]

**Hot Spots** (most frequently changed):
1. `src/pages/Dashboard.tsx` - [XXX commits]
2. `src/services/user.ts` - [XXX commits]
3. `src/utils/helpers.ts` - [XXX commits]

---

## Code Quality Metrics

### Complexity Metrics

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| Average File Size | [XXX lines] | < 300 lines | [✅ / ⚠️ / ❌] |
| Max File Size | [XXX lines] | < 500 lines | [✅ / ⚠️ / ❌] |
| Average Function Length | [XX lines] | < 50 lines | [✅ / ⚠️ / ❌] |
| Max Nesting Depth | [X levels] | < 4 levels | [✅ / ⚠️ / ❌] |
| Cyclomatic Complexity | [XX avg] | < 10 avg | [✅ / ⚠️ / ❌] |

### Code Duplication

| Type | Percentage | Status |
|------|------------|--------|
| Exact Duplicates | [X%] | [✅ / ⚠️ / ❌] |
| Similar Code Blocks | [XX%] | [✅ / ⚠️ / ❌] |

**Top Duplication Sources**:
1. `src/utils/validation.ts` - [X duplicates]
2. `src/components/Form/*.tsx` - [X similar patterns]

---

## Testing Analysis

### Test Coverage

| Category | Files | Coverage | Status |
|----------|-------|----------|--------|
| Overall | [XXX/XXX] | [XX%] | [✅ / ⚠️ / ❌] |
| Components | [XX/XX] | [XX%] | [✅ / ⚠️ / ❌] |
| Services | [XX/XX] | [XX%] | [✅ / ⚠️ / ❌] |
| Utils | [XX/XX] | [XX%] | [✅ / ⚠️ / ❌] |

### Test Quality

| Metric | Value | Status |
|--------|-------|--------|
| Total Tests | [XXX] | [Info] |
| Test/Code Ratio | [1:X] | [✅ / ⚠️ / ❌] |
| Average Test Length | [XX lines] | [✅ / ⚠️ / ❌] |
| Flaky Tests | [XX] | [✅ / ⚠️ / ❌] |

### Critical Gaps

**Untested Critical Paths**:
1. `src/services/payment.ts` - Payment processing (CRITICAL)
2. `src/services/auth.ts:45-120` - Authentication logic (HIGH)
3. `src/utils/encryption.ts` - Data encryption (HIGH)

---

## Technical Debt

### Overall Technical Debt Score: [XX/100]

**Classification**:
- 0-25: Critical - Immediate action required
- 26-50: High - Address in next sprint
- 51-75: Medium - Plan for refactoring
- 76-100: Low - Manageable

### Debt Breakdown

| Category | Issues | Estimated Effort | Priority |
|----------|--------|------------------|----------|
| Dead Code | [XX files] | [XX hours] | [High / Medium / Low] |
| Outdated Dependencies | [XX packages] | [XX hours] | [High / Medium / Low] |
| Code Duplication | [XX instances] | [XX hours] | [High / Medium / Low] |
| Missing Tests | [XXX functions] | [XX hours] | [High / Medium / Low] |
| Circular Dependencies | [X cycles] | [XX hours] | [High / Medium / Low] |
| TODO/FIXME Comments | [XXX items] | [XX hours] | [High / Medium / Low] |

### High-Priority Debt Items

1. **[Debt Item 1]**
   - Location: [File path]
   - Issue: [Description]
   - Impact: [Severity and consequences]
   - Recommendation: [Fix strategy]
   - Effort: [Time estimate]

2. **[Debt Item 2]**
   - Location: [File path]
   - Issue: [Description]
   - Impact: [Severity and consequences]
   - Recommendation: [Fix strategy]
   - Effort: [Time estimate]

---

## Dependency Graph

### Internal Dependencies

**Module Dependency Depth**: [X levels]

```
Core Modules:
├── src/utils/api.ts
│   └── Imported by: [XX files]
├── src/services/auth.ts
│   └── Imported by: [XX files]
└── src/config/constants.ts
    └── Imported by: [XXX files]
```

### Circular Dependencies

**Status**: [None found / XX cycles detected]

**Detected Cycles**:
1. `src/services/user.ts` → `src/services/auth.ts` → `src/services/user.ts`
2. [Additional cycles if any]

**Recommendation**: [How to resolve]

---

## Performance Indicators

### Build Performance

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Cold Build Time | [XX seconds] | < 30s | [✅ / ⚠️ / ❌] |
| Hot Reload Time | [X seconds] | < 3s | [✅ / ⚠️ / ❌] |
| Bundle Size (gzipped) | [XXX KB] | < 500KB | [✅ / ⚠️ / ❌] |
| Chunks | [XX] | < 50 | [✅ / ⚠️ / ❌] |

### Runtime Performance Indicators

| Indicator | Assessment |
|-----------|------------|
| Lazy Loading | [Implemented / Not Used] |
| Code Splitting | [Effective / Minimal / None] |
| Tree Shaking | [Enabled / Disabled] |
| Caching Strategy | [Good / Needs Improvement] |

---

## Recommendations

### Immediate Actions (This Week)

1. **[Action 1]** - Priority: Critical
   - Issue: [Description]
   - Impact: [What happens if not fixed]
   - Steps: [How to fix]
   - Effort: [Time estimate]

2. **[Action 2]** - Priority: High
   - Issue: [Description]
   - Impact: [What happens if not fixed]
   - Steps: [How to fix]
   - Effort: [Time estimate]

### Short-Term Actions (This Month)

1. **[Action 1]**
2. **[Action 2]**
3. **[Action 3]**

### Long-Term Improvements (This Quarter)

1. **[Improvement 1]**
2. **[Improvement 2]**
3. **[Improvement 3]**

---

## Strengths

1. **[Strength 1]**
   - Description: [What's good]
   - Impact: [Why it matters]

2. **[Strength 2]**
   - Description: [What's good]
   - Impact: [Why it matters]

3. **[Strength 3]**
   - Description: [What's good]
   - Impact: [Why it matters]

---

## Risk Assessment

### High Risks

1. **[Risk 1]**
   - Likelihood: [High / Medium / Low]
   - Impact: [Critical / High / Medium]
   - Mitigation: [How to reduce risk]

2. **[Risk 2]**
   - Likelihood: [High / Medium / Low]
   - Impact: [Critical / High / Medium]
   - Mitigation: [How to reduce risk]

### Medium Risks

1. **[Risk 1]**
2. **[Risk 2]**

---

## Comparison to Benchmarks

### Industry Standards (Similar Projects)

| Metric | This Project | Industry Avg | Status |
|--------|--------------|--------------|--------|
| Test Coverage | [XX%] | 70-80% | [Above / On par / Below] |
| Dependencies | [XXX] | 50-150 | [Lean / Average / Heavy] |
| Technical Debt | [XX/100] | 60-80/100 | [Better / Similar / Worse] |
| Build Time | [XX s] | 20-40s | [Faster / Average / Slower] |

---

## Historical Trends

**Previous Analyses**:
- [YYYY-MM-DD]: Score [XX/100]
- [YYYY-MM-DD]: Score [XX/100]
- Current: Score [XX/100]

**Trend**: [Improving / Stable / Declining]

**Key Changes**:
- [Change 1 since last analysis]
- [Change 2 since last analysis]

---

## Conclusion

[2-3 paragraph summary of overall project health, key findings, and critical next steps]

**Overall Assessment**: [Excellent / Good / Fair / Needs Improvement / Critical]

**Next Review Recommended**: [Date or timeframe]

---

**Report Generated By**: ProjectMind v2.0
**Analysis Engine**: Knowledge Graph + Pattern Recognition
**Timestamp**: [YYYY-MM-DD HH:MM:SS]
