#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

RULES="false"
MCP="false"
ENABLE_COLLAB="false"
PROJECT="false"
ALL="false"
ENABLE_CONTEXT7="false"

usage() {
  cat <<'USAGE'
Usage: ./scripts/install-codex.sh [options]

Options:
  --all               Install skills + prompts + rules + config
  --rules             Install skills + prompts + rules
  --mcp               Install skills + prompts + config
  --enable-collab     Alias of --mcp (kept for compatibility)
  --enable-context7   Add context7 MCP block when writing config
  --project           Use project-local scope (.codex/*)
  --help              Show this help

Environment:
  FORCE_OVERWRITE=1   Force overwrite existing files
  SKIP_OVERWRITE=1    Keep existing files (default behavior)
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --all) ALL="true" ;;
    --rules) RULES="true" ;;
    --mcp) MCP="true" ;;
    --enable-collab) ENABLE_COLLAB="true" ;;
    --enable-context7) ENABLE_CONTEXT7="true" ;;
    --project) PROJECT="true" ;;
    --help) usage; exit 0 ;;
  esac
done

if [[ "$ALL" == "true" ]]; then
  RULES="true"
  MCP="true"
  ENABLE_COLLAB="true"
fi

scope="user"
if [[ "$PROJECT" == "true" ]]; then
  scope="project-local"
fi

cli_args=(setup --scope "$scope")

if [[ "${FORCE_OVERWRITE:-}" == "1" ]]; then
  cli_args+=(--force)
fi

# Preserve old script semantics:
# - default: skills + prompts
# - --rules: skills + prompts + rules
# - --mcp/--enable-collab: skills + prompts + config
# - --all: skills + prompts + rules + config
if [[ "$RULES" != "true" ]]; then
  cli_args+=(--no-rules)
fi

if [[ "$MCP" != "true" && "$ENABLE_COLLAB" != "true" ]]; then
  cli_args+=(--no-config)
fi

if [[ "$ENABLE_CONTEXT7" == "true" ]]; then
  cli_args+=(--enable-context7)
fi

cd "$ROOT_DIR"
node ./bin/omcodex.js "${cli_args[@]}"
