#!/usr/bin/env bash
set -euo pipefail

AGENT_KB_HOME="${AGENT_KB_HOME:-$HOME/Agent-KB}"
PRIMARY_SCRIPT="$AGENT_KB_HOME/intelligent_summarizer.py"
FALLBACK_SCRIPT="$AGENT_KB_HOME/claude_kb_query_optimized.py"

errors=0
warns=0

ok() { echo "[OK] $1"; }
warn() { echo "[WARN] $1"; warns=$((warns + 1)); }
fail() { echo "[FAIL] $1"; errors=$((errors + 1)); }

echo "Task KB Lookup health check"
echo "AGENT_KB_HOME=$AGENT_KB_HOME"

if command -v python3 >/dev/null 2>&1; then
  ok "python3 found ($(python3 --version 2>&1))"
else
  fail "python3 not found"
fi

if [ -d "$AGENT_KB_HOME" ]; then
  ok "Agent-KB directory exists"
else
  fail "Agent-KB directory missing: $AGENT_KB_HOME"
fi

if [ -f "$PRIMARY_SCRIPT" ]; then ok "primary lookup script found"; else fail "missing primary script: $PRIMARY_SCRIPT"; fi
if [ -f "$FALLBACK_SCRIPT" ]; then ok "fallback lookup script found"; else warn "missing fallback script: $FALLBACK_SCRIPT"; fi

if [ "${OPENAI_API_KEY:-}" != "" ]; then
  ok "OPENAI_API_KEY set"
else
  warn "OPENAI_API_KEY not set (some LLM summary paths may degrade)"
fi

echo
if [ "$errors" -gt 0 ]; then
  echo "Result: FAIL (errors=$errors, warnings=$warns)"
  exit 1
fi

echo "Result: PASS (warnings=$warns)"
