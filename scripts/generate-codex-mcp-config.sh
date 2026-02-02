#!/usr/bin/env bash
set -euo pipefail

MODE="global"
ENABLE_COLLAB="false"
ENABLE_CONTEXT7="false"

for arg in "$@"; do
  case "$arg" in
    --project) MODE="project" ;;
    --enable-collab) ENABLE_COLLAB="true" ;;
    --enable-context7) ENABLE_CONTEXT7="true" ;;
  esac
done

if [[ "$MODE" == "project" ]]; then
  CONFIG_DIR="$PWD/.codex"
else
  CONFIG_DIR="$HOME/.codex"
fi

CONFIG_FILE="$CONFIG_DIR/config.toml"

mkdir -p "$CONFIG_DIR"

if [[ ! -f "$CONFIG_FILE" ]]; then
  touch "$CONFIG_FILE"
fi

ensure_block() {
  local name="$1"
  local block="$2"
  if ! grep -q "^\[mcp_servers\.${name}\]" "$CONFIG_FILE" 2>/dev/null; then
    printf "\n%s\n" "$block" >> "$CONFIG_FILE"
    echo "Added MCP server: $name"
  else
    echo "MCP server already configured: $name"
  fi
}

enable_collab_mode() {
  if grep -q "^\[features\]" "$CONFIG_FILE"; then
    if grep -q "^collaboration_modes\s*=\s*true" "$CONFIG_FILE"; then
      echo "collaboration_modes already enabled"
    else
      # If [features] exists, append/replace line under it.
      # Simple approach: append to file (Codex reads last value).
      printf "\n[features]\ncollaboration_modes = true\n" >> "$CONFIG_FILE"
      echo "Enabled collaboration_modes"
    fi
  else
    printf "\n[features]\ncollaboration_modes = true\n" >> "$CONFIG_FILE"
    echo "Enabled collaboration_modes"
  fi
}

# OpenAI developer docs MCP (streamable HTTP)
openai_block=$'[mcp_servers.openaiDeveloperDocs]\nurl = "https://developers.openai.com/mcp"'

ensure_block "openaiDeveloperDocs" "$openai_block"

# Context7 docs MCP (stdio) - optional
context7_block=$'[mcp_servers.context7]\ncommand = "npx"\nargs = ["-y", "@upstash/context7-mcp"]'
if [[ "$ENABLE_CONTEXT7" == "true" ]]; then
  ensure_block "context7" "$context7_block"
else
  echo "Skipped context7 MCP (pass --enable-context7 to enable)"
fi

if [[ "$ENABLE_COLLAB" == "true" ]]; then
  enable_collab_mode
fi

echo "Done. Review $CONFIG_FILE if you want to customize." 
