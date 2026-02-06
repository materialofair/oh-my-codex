#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT_DIR/.agent/skills"
ALLOWLIST="$ROOT_DIR/.governance/skill-lint.allowlist"

if [[ ! -d "$SKILLS_DIR" ]]; then
  echo "Missing skills directory: $SKILLS_DIR" >&2
  exit 1
fi

if [[ ! -f "$ALLOWLIST" ]]; then
  echo "Missing allowlist file: $ALLOWLIST" >&2
  exit 1
fi

failures=0

check_blocker() {
  local rule_id="$1"
  local pattern="$2"
  local message="$3"
  local output
  output="$(rg -n -S --glob 'SKILL.md' "$pattern" "$SKILLS_DIR" || true)"
  if [[ -n "$output" ]]; then
    failures=$((failures + 1))
    echo "BLOCKER [$rule_id]: $message"
    echo "$output"
    echo
  fi
}

check_blocker "legacy_slash_verify" "Run:[[:space:]]*/verify" "Use explicit skill invocation (for example: \$verify), not legacy slash commands."
check_blocker "legacy_plugin_dir" "cc[[:space:]]+--plugin-dir" "Avoid plugin-specific runtime instructions in Codex skill docs."

task_api_output="$(rg -n -P --glob 'SKILL.md' "\\bTask\\s*\\(\\s*(\\{|subagent_type|model|prompt|run_in_background)" "$SKILLS_DIR" || true)"
if [[ -n "$task_api_output" ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_task_api]: Use role handoff format instead of Task(...) API syntax in skill docs."
  echo "$task_api_output"
  echo
fi

new_warnings=()
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  rel="${file#$ROOT_DIR/}"
  key="legacy_subagent_type:${rel}"
  if ! grep -Fxq "$key" "$ALLOWLIST"; then
    new_warnings+=("$key")
  fi
done < <(rg -l -S --glob 'SKILL.md' "Task\\(subagent_type=" "$SKILLS_DIR" || true)

if [[ ${#new_warnings[@]} -gt 0 ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_subagent_type]: New unapproved subagent API references found."
  printf '%s\n' "${new_warnings[@]}"
  echo
fi

new_slash_warnings=()
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  rel="${file#$ROOT_DIR/}"
  key="legacy_slash_command:${rel}"
  if ! grep -Fxq "$key" "$ALLOWLIST"; then
    new_slash_warnings+=("$key")
  fi
done < <(rg -l -P --glob 'SKILL.md' '(?:`|^\s*)/[a-z][a-z-]*(?=(?:\s|`|:|$))' "$SKILLS_DIR" || true)

if [[ ${#new_slash_warnings[@]} -gt 0 ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_slash_command]: New unapproved slash command references found."
  printf '%s\n' "${new_slash_warnings[@]}"
  echo
fi

if [[ "$failures" -gt 0 ]]; then
  echo "Skill governance check failed."
  exit 1
fi

echo "Skill governance check passed."
