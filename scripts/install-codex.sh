#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_SRC="$ROOT_DIR/.codex/skills"
RULES_SRC="$ROOT_DIR/templates/rules"
GLOBAL_SKILLS="$HOME/.codex/skills"
GLOBAL_RULES="$HOME/.codex/rules"
PROJECT_RULES="$PWD/.codex/rules"

PROMPTS="false"
RULES="false"
MCP="false"
ENABLE_COLLAB="false"
PROJECT="false"
ALL="false"

usage() {
  cat <<'USAGE'
Usage: ./scripts/install-codex.sh [options]

Options:
  --all             Install skills + prompts + rules + mcp config + plan mode
  --prompts         Generate /prompts shortcuts
  --rules           Install rules (defaults to global ~/.codex/rules)
  --mcp             Generate MCP config
  --enable-collab   Enable Codex plan mode (features.collaboration_modes = true)
  --project         Use project-local config/rules (./.codex)
  --help            Show this help
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --all) ALL="true" ;;
    --prompts) PROMPTS="true" ;;
    --rules) RULES="true" ;;
    --mcp) MCP="true" ;;
    --enable-collab) ENABLE_COLLAB="true" ;;
    --project) PROJECT="true" ;;
    --help) usage; exit 0 ;;
  esac
done

if [[ "$ALL" == "true" ]]; then
  PROMPTS="true"
  RULES="true"
  MCP="true"
  ENABLE_COLLAB="true"
fi

if [[ ! -d "$SKILLS_SRC" ]]; then
  echo "Missing skills directory: $SKILLS_SRC" >&2
  exit 1
fi

mkdir -p "$GLOBAL_SKILLS"
rsync -a "$SKILLS_SRC/" "$GLOBAL_SKILLS/"

echo "Installed skills to $GLOBAL_SKILLS"

if [[ "$PROMPTS" == "true" ]]; then
  "$ROOT_DIR/scripts/generate-codex-prompts.sh"
fi

if [[ "$RULES" == "true" ]]; then
  if [[ ! -d "$RULES_SRC" ]]; then
    echo "Missing rules templates: $RULES_SRC" >&2
    exit 1
  fi
  if [[ "$PROJECT" == "true" ]]; then
    mkdir -p "$PROJECT_RULES"
    rsync -a "$RULES_SRC/" "$PROJECT_RULES/"
    echo "Installed rules to $PROJECT_RULES"
  else
    mkdir -p "$GLOBAL_RULES"
    rsync -a "$RULES_SRC/" "$GLOBAL_RULES/"
    echo "Installed rules to $GLOBAL_RULES"
  fi
fi

if [[ "$MCP" == "true" || "$ENABLE_COLLAB" == "true" ]]; then
  MCP_ARGS=()
  if [[ "$PROJECT" == "true" ]]; then
    MCP_ARGS+=("--project")
  fi
  if [[ "$ENABLE_COLLAB" == "true" ]]; then
    MCP_ARGS+=("--enable-collab")
  fi
  "$ROOT_DIR/scripts/generate-codex-mcp-config.sh" "${MCP_ARGS[@]}"
fi
