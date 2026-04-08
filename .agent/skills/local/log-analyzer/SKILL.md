---
name: Intelligent Log Analysis
description: Analyze browser console logs with 90% noise filtering. Debug web apps, check console errors, analyze JavaScript issues efficiently.
version: 0.1.0
source: fork
checksum: 4f02745fe3c443cd4110e3e83272f15500e762bfdfc2da9c4d5dab1d9aed04cc
updated_at: 2026-02-06T15:19:11+08:00
layer: utility
---


# Intelligent Log Analysis Skill

## When to Use This Skill

Automatically invoke this Skill when:
- User mentions "check logs", "console errors", "debug logs"
- User reports JavaScript errors or runtime issues
- User wants to analyze a running web application
- User needs to monitor browser console output
- Keywords: "logs", "console", "errors", "debugging", "Chrome DevTools"

## What This Skill Does

**Intelligent Log Analyzer** provides:
1. **90% Noise Filtering** - Removes repetitive framework logs
2. **Smart Deduplication** - Collapses identical logs into summaries
3. **Priority Detection** - Highlights [CLAUDE-*] markers
4. **Context Optimization** - Saves 10K-25K tokens vs raw logs

## Instructions

When this Skill is invoked:

### Step 1: Determine the Mode

Ask yourself what level of analysis is needed:
- **Quick Mode** (10s) - Fast error detection
- **Deep Mode** (60s) - Comprehensive analysis
- **Pure Mode** - Maximum context optimization
- **Claude-Priority** - Focus on [CLAUDE-*] markers
- **Errors-Only** - Critical issues only

### Step 2: Execute the Analysis

**IMPORTANT**: You MUST execute this bash command:

**Quick Mode (Default)**:
```bash
~/claude-log-system/claude_console_v2.sh [target] --quick
```

**Deep Mode**:
```bash
~/claude-log-system/claude_console_v2.sh [target] --deep
```

**Pure Mode**:
```bash
~/claude-log-system/claude_console_v2.sh [target] --pure
```

**Claude-Priority Mode**:
```bash
~/claude-log-system/claude_console_v2.sh [target] --claude-priority
```

**Errors-Only Mode**:
```bash
~/claude-log-system/claude_console_v2.sh [target] --errors-only
```

Where `[target]` is usually `localhost:PORT` (e.g., `localhost:3001`)

### Step 3: Analyze and Present

Organize the log output into:

```markdown
## 📊 Log Analysis Results

**Target**: [Application URL]
**Analysis Mode**: [Quick/Deep/Pure/Errors-Only]
**Duration**: [Time analyzed]

### 🔴 Critical Issues
[Errors and exceptions that need immediate attention]

### 🟡 Warnings & Important Patterns
[Repeated warnings, performance issues, degraded functionality]

### 🟢 System Health Indicators
[Successful operations, normal metrics]

### 💡 Recommendations
1. [Specific action to fix issue #1]
2. [Specific action to fix issue #2]
...

### 📈 Log Statistics
- Total logs captured: [number]
- After filtering: [number] (XX% reduction)
- Critical errors: [number]
- Warnings: [number]
```

### Step 4: Provide Context

Explain:
- What the errors mean
- Likely root causes
- Specific code locations if identifiable
- Next debugging steps

## Examples

### Example 1: Quick Error Check
**User**: "Check if there are any console errors on localhost:3001"

**You execute**:
```bash
~/claude-log-system/claude_console_v2.sh localhost:3001 --errors-only
```

**You present**: Filtered list of errors with explanations and fixes.

### Example 2: Deep Analysis
**User**: "Analyze all logs from my app, it's running slow"

**You execute**:
```bash
~/claude-log-system/claude_console_v2.sh localhost:3001 --deep
```

**You present**: Comprehensive analysis including performance warnings, network issues, and optimization suggestions.

## Intelligent Filtering Features

The system automatically:
- ✅ Collapses `[repeated 10x]` identical logs
- ✅ Aggregates progress bars and loading streams
- ✅ Prioritizes developer-marked `[CLAUDE-*]` logs
- ✅ Filters React/Vue/Angular framework noise
- ✅ Groups related error sequences

## Claude-Specific Log Markers

Developers can add markers for your attention:
- `[CLAUDE-CRITICAL]` - Immediate attention required
- `[CLAUDE-FOCUS]` - Important for analysis
- `[CLAUDE-INFO]` - Useful context
- `[CLAUDE-DEBUG]` - Debug information

Use `--claude-priority` mode to focus on these.

## Performance Characteristics

- **Log Reduction**: 80-95% fewer logs
- **Token Savings**: 10K-25K tokens saved
- **Analysis Time**: 10-60 seconds
- **Memory Usage**: Optimized with auto-cleanup

## Prerequisites

**Before executing**:
1. Chrome browser must be running
2. Target web page must be open
3. Script automatically sets debugging port (9222)

## Fallback Strategy

If the command fails:
1. Verify Chrome is running with the target page
2. Try extending timeout: `--timeout 60`
3. Check if page URL is correct
4. Manual Chrome DevTools as last resort

## Important Notes

- **Always execute** the bash command, don't simulate results
- **Analyze patterns**, not just list errors
- **Provide actionable fixes**, not just descriptions
- **Group related issues** for clarity
- **Suggest next steps** for debugging

## Common Use Cases

- Frontend debugging (React, Vue, Angular)
- API error investigation
- Performance bottleneck identification
- Memory leak detection
- Network request analysis
- Runtime error tracking
