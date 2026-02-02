#!/usr/bin/env bash
set -euo pipefail

DEST_DIR="$HOME/.codex/prompts"
mkdir -p "$DEST_DIR"

# name|description|arg_hint|body_template
PROMPTS=(
  "autopilot|Full autonomous execution|TASK=\"<task>\"|autopilot: \$TASK"
  "ralph|Persistence until verified complete|TASK=\"<task>\"|ralph: \$TASK"
  "ultrawork|Maximum parallel execution|TASK=\"<task>\"|ulw \$TASK"
  "ultrapilot|Parallel autopilot|TASK=\"<task>\"|ultrapilot: \$TASK"
  "swarm|Coordinated multi-agent tasks|TASK=\"<task>\"|swarm: \$TASK"
  "pipeline|Sequential agent chaining|TASK=\"<task>\"|pipeline: \$TASK"
  "ecomode|Token-efficient execution|TASK=\"<task>\"|eco: \$TASK"
  "ultraqa|QA cycling until success|TASK=\"<goal>\"|ultraqa: \$TASK"
  "plan|Planning interview workflow|TASK=\"<task>\"|plan: \$TASK"
  "aireview|AI code review workflow|TASK=\"<scope>\"|aireview: \$TASK"
  "start-dev|Intelligent adaptive workflow|TASK=\"<feature>\"|start-dev: \$TASK"
  "review|Plan/code review|TASK=\"<task>\"|review: \$TASK"
  "analyze|Deep analysis/debugging|TASK=\"<issue>\"|analyze: \$TASK"
  "deepsearch|Thorough codebase search|TASK=\"<query>\"|deepsearch: \$TASK"
  "deepinit|Generate AGENTS.md hierarchy|TASK=\"<scope>\"|deepinit: \$TASK"
  "tdd|Test-driven development mode|TASK=\"<task>\"|tdd: \$TASK"
  "code-review|Comprehensive code review|TASK=\"<scope>\"|code-review: \$TASK"
  "security-review|Security review|TASK=\"<scope>\"|security-review: \$TASK"
  "build-fix|Fix build and type errors|TASK=\"<error>\"|build-fix: \$TASK"
  "learner|Extract reusable skill|TASK=\"<summary>\"|learner: \$TASK"
  "note|Save a note|TASK=\"<content>\"|note: \$TASK"
  "help|Show usage guide|TASK=\"<topic>\"|help: \$TASK"
)

for entry in "${PROMPTS[@]}"; do
  IFS='|' read -r name desc arg_hint body <<< "$entry"
  cat > "$DEST_DIR/$name.md" <<PROMPT
---
description: $desc
argument-hint: [$arg_hint]
---

$body
PROMPT
done

echo "Generated Codex custom prompts in $DEST_DIR"
