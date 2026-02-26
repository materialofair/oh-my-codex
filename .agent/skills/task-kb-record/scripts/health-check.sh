#!/usr/bin/env bash
set -euo pipefail

AGENT_KB_HOME="${AGENT_KB_HOME:-$HOME/Agent-KB}"
STORE_SCRIPT="$AGENT_KB_HOME/claude_kb_store.py"
QUERY_SCRIPT="$AGENT_KB_HOME/intelligent_summarizer.py"
DB_JSON="$AGENT_KB_HOME/Agent-KB-GAIA/examples/open_deep_research/agent_kb/agent_kb_database.json"

errors=0
warns=0

ok() { echo "[OK] $1"; }
warn() { echo "[WARN] $1"; warns=$((warns + 1)); }
fail() { echo "[FAIL] $1"; errors=$((errors + 1)); }

echo "Task KB Record health check"
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

if [ -f "$STORE_SCRIPT" ]; then ok "store script found"; else fail "missing store script: $STORE_SCRIPT"; fi
if [ -f "$QUERY_SCRIPT" ]; then ok "query script found"; else warn "missing query script: $QUERY_SCRIPT"; fi

if [ -f "$DB_JSON" ]; then
  ok "knowledge DB found"
  if [ -w "$DB_JSON" ]; then
    ok "knowledge DB writable"
  else
    fail "knowledge DB is not writable: $DB_JSON"
  fi
else
  fail "knowledge DB missing: $DB_JSON"
fi

echo
if [ "$errors" -gt 0 ]; then
  echo "Result: FAIL (errors=$errors, warnings=$warns)"
  exit 1
fi

echo "Result: PASS (warnings=$warns)"
