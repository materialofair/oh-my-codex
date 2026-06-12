#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_ROOT"
}
trap cleanup EXIT

FIXTURE_REPO="$TMP_ROOT/impeccable-fixture"
WORK_REPO="$TMP_ROOT/work"

mkdir -p "$FIXTURE_REPO/.agents/skills/impeccable"
cat > "$FIXTURE_REPO/.agents/skills/impeccable/SKILL.md" <<'EOF'
---
name: impeccable
description: Use when refining UI design quality with deterministic visual checks
version: 0.1.0
source: impeccable
---

# Impeccable

Fixture skill.
EOF

git -C "$FIXTURE_REPO" init -q -b main
git -C "$FIXTURE_REPO" add .agents/skills/impeccable/SKILL.md
git -C "$FIXTURE_REPO" \
  -c core.hooksPath=/dev/null \
  -c user.name="oh-my-codex test" \
  -c user.email="test@example.invalid" \
  commit -q -m "fixture impeccable skill"

mkdir -p "$WORK_REPO/scripts"
cp "$ROOT_DIR/scripts/sync-upstream-skills.sh" "$WORK_REPO/scripts/sync-upstream-skills.sh"
chmod +x "$WORK_REPO/scripts/sync-upstream-skills.sh"

git -C "$WORK_REPO" init -q -b main
git -C "$WORK_REPO" remote add impeccable "$FIXTURE_REPO"

OMCODEX_USE_GIT_FOR_IMPECCABLE=1 "$WORK_REPO/scripts/sync-upstream-skills.sh" --source impeccable

SYNCED_SKILL="$WORK_REPO/.agent/skills/upstream/impeccable/impeccable/SKILL.md"
if [[ ! -f "$SYNCED_SKILL" ]]; then
  echo "Expected synced skill missing: $SYNCED_SKILL" >&2
  exit 1
fi

if ! grep -q "name: impeccable" "$SYNCED_SKILL"; then
  echo "Synced skill content did not match fixture." >&2
  exit 1
fi

echo "Sync upstream skills tests passed."
