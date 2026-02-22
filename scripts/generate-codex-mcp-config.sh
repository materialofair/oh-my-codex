#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="user"
ENABLE_CONTEXT7="false"

for arg in "$@"; do
  case "$arg" in
    --project) MODE="project-local" ;;
    --enable-context7) ENABLE_CONTEXT7="true" ;;
    --enable-collab) : ;; # compatibility no-op; collaboration_modes is managed in setup
  esac
done

args=(setup --scope "$MODE" --no-skills --no-prompts --no-rules)
if [[ "$ENABLE_CONTEXT7" == "true" ]]; then
  args+=(--enable-context7)
fi

cd "$ROOT_DIR"
node ./bin/omcodex.js "${args[@]}"
