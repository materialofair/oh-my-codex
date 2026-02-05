#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_SRC="$ROOT_DIR/.codex/skills"
if [[ -d "$ROOT_DIR/.agent/skills" ]]; then
  SKILLS_SRC="$ROOT_DIR/.agent/skills"
fi
RULES_SRC="$ROOT_DIR/templates/rules"
GLOBAL_SKILLS="$HOME/.codex/skills"
GLOBAL_RULES="$HOME/.codex/rules"
PROJECT_RULES="$PWD/.codex/rules"

RULES="false"
MCP="false"
ENABLE_COLLAB="false"
PROJECT="false"
ALL="false"

usage() {
  cat <<'USAGE'
Usage: ./scripts/install-codex.sh [options]

Options:
  --all             Install skills + rules + mcp config + plan mode
  --rules           Install rules (defaults to global ~/.codex/rules)
  --mcp             Generate MCP config
  --enable-collab   Enable Codex plan mode (features.collaboration_modes = true)
  --project         Use project-local config/rules (./.codex)
  --help            Show this help

Environment:
  FORCE_OVERWRITE=1 Force overwrite when installing skills/rules
  SKIP_OVERWRITE=1  Only install missing files (incremental)
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --all) ALL="true" ;;
    --rules) RULES="true" ;;
    --mcp) MCP="true" ;;
    --enable-collab) ENABLE_COLLAB="true" ;;
    --project) PROJECT="true" ;;
    --help) usage; exit 0 ;;
  esac
done

if [[ "$ALL" == "true" ]]; then
  RULES="true"
  MCP="true"
  ENABLE_COLLAB="true"
fi

if [[ ! -d "$SKILLS_SRC" ]]; then
  echo "Missing skills directory: $SKILLS_SRC" >&2
  exit 1
fi

mkdir -p "$GLOBAL_SKILLS"

install_dir() {
  local src="$1"
  local dest="$2"
  local label="$3"
  local rsync_opts=("-a")

  mkdir -p "$dest"
  if [[ "${FORCE_OVERWRITE:-}" == "1" ]]; then
    rsync_opts=("-a")
  elif [[ "${SKIP_OVERWRITE:-}" == "1" ]]; then
    rsync_opts=("-a" "--ignore-existing")
  elif [[ -d "$dest" ]] && [[ -n "$(ls -A "$dest" 2>/dev/null)" ]]; then
    local answer="n"
    read -r -p "覆盖已存在的 $label 同名文件? [y/N]: " answer
    case "$answer" in
      y|Y) rsync_opts=("-a") ;;
      *) rsync_opts=("-a" "--ignore-existing") ;;
    esac
  fi

  rsync "${rsync_opts[@]}" "$src/" "$dest/"
}

install_dir "$SKILLS_SRC" "$GLOBAL_SKILLS" "skills"

echo "Installed skills to $GLOBAL_SKILLS"

if [[ "$RULES" == "true" ]]; then
  if [[ ! -d "$RULES_SRC" ]]; then
    echo "Missing rules templates: $RULES_SRC" >&2
    exit 1
  fi
  if [[ "$PROJECT" == "true" ]]; then
    install_dir "$RULES_SRC" "$PROJECT_RULES" "rules (project)"
    echo "Installed rules to $PROJECT_RULES"
  else
    install_dir "$RULES_SRC" "$GLOBAL_RULES" "rules (global)"
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
