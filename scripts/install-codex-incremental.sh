#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKIP_OVERWRITE=1 "$ROOT_DIR/scripts/install-codex.sh" "$@"
