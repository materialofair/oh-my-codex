#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT_DIR/.agent/skills/local"
ALLOWLIST="$ROOT_DIR/.governance/skill-lint.allowlist"
SKILLS_REL_PREFIX=".agent/skills/local"
ARTIFACT_GLOBS=(--glob 'SKILL.md' --glob 'commands/**/*.toml' --glob 'templates/workflow.md' --glob 'templates/rules/*.md')
COMMAND_GLOBS=(--glob 'commands/**/*.toml' --glob 'templates/workflow.md' --glob 'templates/rules/*.md')

usage() {
  cat <<'EOF'
Usage: ./scripts/check-skill-governance.sh [options]

Options:
  --skills-dir <path>          Skills root directory to scan
  --allowlist <path>           Allowlist file path
  --skills-rel-prefix <path>   Path prefix used for allowlist key mapping when skills-dir is outside repo
  --help                       Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skills-dir)
      SKILLS_DIR="$2"
      shift 2
      ;;
    --allowlist)
      ALLOWLIST="$2"
      shift 2
      ;;
    --skills-rel-prefix)
      SKILLS_REL_PREFIX="$2"
      shift 2
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

if [[ ! -d "$SKILLS_DIR" ]]; then
  echo "Missing skills directory: $SKILLS_DIR" >&2
  exit 1
fi

if [[ ! -f "$ALLOWLIST" ]]; then
  echo "Missing allowlist file: $ALLOWLIST" >&2
  exit 1
fi

failures=0

allowlist_key() {
  local file="$1"
  local rel

  if [[ "$file" == "$SKILLS_DIR/"* ]]; then
    rel="$SKILLS_REL_PREFIX/${file#$SKILLS_DIR/}"
  elif [[ "$file" == "$ROOT_DIR/"* ]]; then
    rel="${file#$ROOT_DIR/}"
  else
    rel="$file"
  fi

  printf '%s\n' "$rel"
}

check_blocker() {
  local rule_id="$1"
  local pattern="$2"
  local message="$3"
  local output
  output="$(rg -n -S "${ARTIFACT_GLOBS[@]}" "$pattern" "$SKILLS_DIR" || true)"
  if [[ -n "$output" ]]; then
    failures=$((failures + 1))
    echo "BLOCKER [$rule_id]: $message"
    echo "$output"
    echo
  fi
}

check_blocker "legacy_slash_verify" "Run:[[:space:]]*/verify" "Use explicit skill invocation (for example: \$verify), not legacy slash commands."
check_blocker "legacy_plugin_dir" "cc[[:space:]]+--plugin-dir" "Avoid plugin-specific runtime instructions in Codex skill docs or command protocols."

task_api_output="$(rg -n -P "${ARTIFACT_GLOBS[@]}" "\\bTask\\s*\\(\\s*(\\{|subagent_type|model|prompt|run_in_background)" "$SKILLS_DIR" || true)"
if [[ -n "$task_api_output" ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_task_api]: Use codex-native handoff format instead of Task(...) API syntax in skill docs or command protocols."
  echo "$task_api_output"
  echo
fi

task_output_refs="$(rg -n -S "${COMMAND_GLOBS[@]}" "TaskOutput" "$SKILLS_DIR" || true)"
if [[ -n "$task_output_refs" ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_task_output]: Use codex-native wait primitives instead of TaskOutput references."
  echo "$task_output_refs"
  echo
fi

gemini_runtime_refs="$(rg -n -S "${COMMAND_GLOBS[@]}" "gemini -i|~/.gemini/extensions|~/.claude/skills" "$SKILLS_DIR" || true)"
if [[ -n "$gemini_runtime_refs" ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [non_codex_skill_runtime]: Avoid Gemini/Claude-specific runtime paths in Codex skill docs or command protocols."
  echo "$gemini_runtime_refs"
  echo
fi

new_warnings=()
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  rel="$(allowlist_key "$file")"
  key="legacy_subagent_type:${rel}"
  if ! grep -Fxq "$key" "$ALLOWLIST"; then
    new_warnings+=("$key")
  fi
done < <(rg -l -S "${ARTIFACT_GLOBS[@]}" "Task\\(subagent_type=" "$SKILLS_DIR" || true)

if [[ ${#new_warnings[@]} -gt 0 ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_subagent_type]: New unapproved subagent API references found."
  printf '%s\n' "${new_warnings[@]}"
  echo
fi

new_slash_warnings=()
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  rel="$(allowlist_key "$file")"
  key="legacy_slash_command:${rel}"
  if ! grep -Fxq "$key" "$ALLOWLIST"; then
    new_slash_warnings+=("$key")
  fi
done < <(rg -l -P "${ARTIFACT_GLOBS[@]}" '(?:`|^\s*)/[a-z][a-z-]*(?=(?:\s|`|:|$))' "$SKILLS_DIR" || true)

if [[ ${#new_slash_warnings[@]} -gt 0 ]]; then
  failures=$((failures + 1))
  echo "BLOCKER [legacy_slash_command]: New unapproved slash command references found."
  printf '%s\n' "${new_slash_warnings[@]}"
  echo
fi

status_protocol_file="$SKILLS_DIR/conductor/commands/conductor/status.toml"
if [[ -f "$status_protocol_file" ]]; then
  if ! rg -q 'first track marked `\[~\]`|first track marked \[~\]' "$status_protocol_file"; then
    failures=$((failures + 1))
    echo "BLOCKER [conductor_status_priority]: conductor status protocol must explicitly prioritize the first [~] track."
    echo "$status_protocol_file"
    echo
  fi
  if ! rg -q "Do NOT sort by directory name|preserve the exact order of tracks as they appear in the file" "$status_protocol_file"; then
    failures=$((failures + 1))
    echo "BLOCKER [conductor_status_order]: conductor status protocol must explicitly preserve conductor/tracks.md order."
    echo "$status_protocol_file"
    echo
  fi
  if ! rg -q "Use the focus track only" "$status_protocol_file"; then
    failures=$((failures + 1))
    echo "BLOCKER [conductor_status_scope]: conductor status protocol must scope current/next fields to the focus track."
    echo "$status_protocol_file"
    echo
  fi
fi

if [[ "$failures" -gt 0 ]]; then
  echo "Skill governance check failed."
  exit 1
fi

echo "Skill governance check passed."
