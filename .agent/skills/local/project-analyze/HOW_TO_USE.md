# Project Analyze - Detailed Usage Guide

## Overview

ProjectMind-powered intelligent project analysis providing 40-second architectural understanding through dependency graphs and pattern detection.

## Usage Scenarios

### Scenario 1: Quick Project Understanding

```
"Analyze this project structure"
```

**Output**:
- Architecture pattern (MVC, microservices, layered)
- Technology stack
- Dependency graph
- Key components and their relationships
- Potential issues

### Scenario 2: Onboarding New Developers

```
"Generate project overview for new team member"
```

Creates comprehensive onboarding document with:
- Codebase structure
- Module responsibilities
- Entry points and flows
- Development setup guide

### Scenario 3: Impact Analysis

```
"Analyze impact of changing UserService"
```

Shows:
- Direct dependents
- Transitive dependencies
- Affected test files
- Risk assessment

## Output Format

```markdown
## 📊 Project Analysis Report

### Overview
- **Architecture Pattern**: Layered Architecture (Backend)
- **Primary Language**: TypeScript (95%)
- **Framework**: Express.js + React
- **Build System**: Webpack + Jest

### Structure
```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── models/          # Data models (Sequelize)
├── utils/           # Shared utilities
└── config/          # Configuration
```

### Dependency Graph
```
controllers → services → models
           ↘ utils ↗
```

### Key Insights
1. **Layering**: Clean separation of concerns ✅
2. **Circular Dependencies**: None detected ✅
3. **Unused Modules**: 3 files in src/legacy/ ⚠️
4. **Test Coverage**: 72% (target: 80%) ⚠️

### Recommendations
1. Remove unused legacy files
2. Increase test coverage for services layer
3. Consider splitting large UserService (450 lines)
```

## Advanced Features

### Dependency Visualization

```
"Show dependency graph for authentication flow"
```

ASCII graph or recommendations for visualization tools.

### Architecture Pattern Detection

Automatically identifies:
- MVC
- Microservices
- Layered architecture
- Event-driven
- Hexagonal/Clean architecture

### Change Impact Prediction

```
"What breaks if I change PaymentService.processPayment?"
```

Lists all affected:
- Direct callers
- Tests
- Dependent modules

## Real-World Examples

### Example 1: Code Review Prep

```
"Analyze files changed in feature/auth-refactor"
```

Understand architectural impact before reviewing.

### Example 2: Refactoring Planning

```
"Identify tightly coupled modules"
```

Find refactoring opportunities to improve modularity.

### Example 3: Documentation Generation

```
"Generate architecture diagram documentation"
```

Auto-generate architecture docs from codebase analysis.

## Related Skills

- **quality-check**: Combines structure analysis with quality metrics
- **code-review**: Use insights to guide review focus
- **brainstorming**: Inform architectural brainstorming with current state
