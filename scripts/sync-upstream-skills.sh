#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM_REF="upstream/main"
SKIP_FETCH="false"

usage() {
  cat <<'EOF'
Usage: ./scripts/sync-upstream-skills.sh [options]

Sync upstream skills snapshot into .upstream/skills for local merge/governance.

Options:
  --ref <git-ref>   Upstream ref to sync (default: upstream/main)
  --skip-fetch      Skip git fetch upstream
  --help            Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref)
      UPSTREAM_REF="$2"
      shift 2
      ;;
    --skip-fetch)
      SKIP_FETCH="true"
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

cd "$ROOT_DIR"

if [[ "$SKIP_FETCH" != "true" ]]; then
  git fetch upstream
fi

if ! git rev-parse --verify "$UPSTREAM_REF" >/dev/null 2>&1; then
  echo "Upstream ref not found: $UPSTREAM_REF" >&2
  exit 1
fi

SKILLS_DIR=""
for candidate in "skills" ".agent/skills" ".codex/skills"; do
  if git cat-file -e "$UPSTREAM_REF:$candidate" 2>/dev/null; then
    SKILLS_DIR="$candidate"
    break
  fi
done

if [[ -z "$SKILLS_DIR" ]]; then
  echo "No skills directory found in $UPSTREAM_REF (tried skills/.agent/skills/.codex/skills)." >&2
  exit 1
fi

TARGET_DIR="$ROOT_DIR/.upstream"
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

git archive "$UPSTREAM_REF" "$SKILLS_DIR" | tar -x -C "$TARGET_DIR"

if [[ "$SKILLS_DIR" != "skills" ]]; then
  mkdir -p "$TARGET_DIR/skills"
  cp -R "$TARGET_DIR/$SKILLS_DIR/." "$TARGET_DIR/skills/"
fi

echo "Synced upstream skills:"
echo "  ref: $UPSTREAM_REF"
echo "  source path: $SKILLS_DIR"
echo "  target: $TARGET_DIR/skills"
