#!/usr/bin/env bash
set -euo pipefail

AGENT_KB_HOME="${AGENT_KB_HOME:-$HOME/Agent-KB}"
PRIMARY_SCRIPT="$AGENT_KB_HOME/intelligent_summarizer.py"
FALLBACK_SCRIPT="$AGENT_KB_HOME/claude_kb_query_optimized.py"
STORE_SCRIPT="$AGENT_KB_HOME/claude_kb_store.py"
DB_JSON="$AGENT_KB_HOME/Agent-KB-GAIA/examples/open_deep_research/agent_kb/agent_kb_database.json"
CONFIG_FILE="$HOME/.agent_kb_config.json"

errors=0
warns=0

ok() { echo "[OK] $1"; }
warn() { echo "[WARN] $1"; warns=$((warns + 1)); }
fail() { echo "[FAIL] $1"; errors=$((errors + 1)); }

echo "Agent-KB health check"
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

if [ -f "$PRIMARY_SCRIPT" ]; then ok "primary script found: intelligent_summarizer.py"; else fail "missing primary script: $PRIMARY_SCRIPT"; fi
if [ -f "$FALLBACK_SCRIPT" ]; then ok "fallback script found: claude_kb_query_optimized.py"; else fail "missing fallback script: $FALLBACK_SCRIPT"; fi
if [ -f "$STORE_SCRIPT" ]; then ok "store script found: claude_kb_store.py"; else fail "missing store script: $STORE_SCRIPT"; fi

if [ -f "$DB_JSON" ]; then
  ok "knowledge DB found"
  if [ -w "$DB_JSON" ]; then
    ok "knowledge DB writable"
  else
    warn "knowledge DB not writable (recording may fail)"
  fi
else
  fail "knowledge DB missing: $DB_JSON"
fi

if [ -f "$CONFIG_FILE" ]; then
  ok "config file found: $CONFIG_FILE"
else
  warn "config file missing: $CONFIG_FILE (LLM summary may use fallback behavior)"
fi

if [ "${OPENAI_API_KEY:-}" != "" ]; then
  ok "OPENAI_API_KEY set"
else
  warn "OPENAI_API_KEY not set (some LLM paths may degrade)"
fi

echo
if [ "$errors" -gt 0 ]; then
  echo "Result: FAIL (errors=$errors, warnings=$warns)"
  exit 1
fi

echo "Result: PASS (warnings=$warns)"
