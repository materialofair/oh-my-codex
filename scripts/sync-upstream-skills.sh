#!/usr/bin/env bash
set -eo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKIP_FETCH="false"
SOURCE="all"

# Upstream source definitions (parallel arrays for bash 3 compat)
UPSTREAM_NAMES=("oh-my-codex" "superpowers" "impeccable")
UPSTREAM_REMOTES=("upstream" "superpowers" "impeccable")
UPSTREAM_REFS=("upstream/main" "superpowers/main" "impeccable/main")
UPSTREAM_URLS=("https://github.com/Yeachan-Heo/oh-my-codex.git" "https://github.com/obra/superpowers.git" "https://github.com/pbakaus/impeccable.git")

usage() {
  cat <<'EOF'
Usage: ./scripts/sync-upstream-skills.sh [options]

Sync upstream skills into .agent/skills/upstream/<source>/ for local merge/governance.

Options:
  --source <name>   Upstream source to sync: oh-my-codex | superpowers | impeccable | all (default: all)
  --skip-fetch      Skip git fetch
  --help            Show this help

Sources:
  oh-my-codex    https://github.com/Yeachan-Heo/oh-my-codex (remote: upstream)
  superpowers    https://github.com/obra/superpowers (remote: superpowers)
  impeccable     https://github.com/pbakaus/impeccable (remote: impeccable)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source)
      SOURCE="$2"
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

# When --skip-fetch, if upstream skills already exist on disk, skip sync entirely
if [[ "$SKIP_FETCH" == "true" ]]; then
  all_present=true
  for name in "${UPSTREAM_NAMES[@]}"; do
    target_dir="$ROOT_DIR/.agent/skills/upstream/$name"
    if [[ ! -d "$target_dir" ]] || [[ -z "$(ls -A "$target_dir" 2>/dev/null)" ]]; then
      all_present=false
      break
    fi
  done
  if [[ "$all_present" == "true" ]]; then
    echo "Upstream skills already present on disk (--skip-fetch). Skipping sync."
    ls -d .agent/skills/upstream/*/
    exit 0
  fi
fi

get_index() {
  local needle="$1"
  for i in "${!UPSTREAM_NAMES[@]}"; do
    if [[ "${UPSTREAM_NAMES[$i]}" == "$needle" ]]; then
      echo "$i"
      return 0
    fi
  done
  return 1
}

write_source_manifest() {
  local target_dir="$1"
  local repo="$2"
  local ref="$3"
  local upstream_skills_path="$4"
  local adaptation="${5:-}"

  mkdir -p "$target_dir/.omc-source"
  if [[ -n "$adaptation" ]]; then
    cat > "$target_dir/.omc-source/manifest.json" <<EOF
{
  "source": "github",
  "repo": "$repo",
  "ref": "$ref",
  "skillsPath": ".",
  "upstreamSkillsPath": "$upstream_skills_path",
  "homepage": "https://github.com/$repo",
  "adaptations": [
    "$adaptation"
  ]
}
EOF
    return
  fi

  cat > "$target_dir/.omc-source/manifest.json" <<EOF
{
  "source": "github",
  "repo": "$repo",
  "ref": "$ref",
  "skillsPath": ".",
  "upstreamSkillsPath": "$upstream_skills_path",
  "homepage": "https://github.com/$repo"
}
EOF
}

normalize_impeccable_paths() {
  local target_dir="$1"

  TARGET_DIR="$target_dir" node <<'NODE'
const fs = require('fs');
const path = require('path');

const targetDir = process.env.TARGET_DIR;
const from = '.agents/skills/impeccable';
const to = '"$(omcodex skill path impeccable)"';
const textExtensions = new Set(['.md']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!textExtensions.has(path.extname(entry.name))) continue;

    const original = fs.readFileSync(fullPath, 'utf8');
    const next = original.split(from).join(to);
    if (next !== original) fs.writeFileSync(fullPath, next, 'utf8');
  }
}

walk(targetDir);
NODE
}

sync_github_api_source() {
  local name="$1"
  local repo="$2"
  local ref="$3"
  local upstream_skills_path="$4"
  local target_dir="$5"

  rm -rf "$target_dir"
  mkdir -p "$target_dir"

  REPO="$repo" REF="$ref" SOURCE_PATH="$upstream_skills_path" TARGET_DIR="$target_dir" node <<'NODE'
const fs = require('fs');
const path = require('path');

const repo = process.env.REPO;
const ref = process.env.REF;
const sourcePath = process.env.SOURCE_PATH.replace(/^\/+|\/+$/g, '');
const targetDir = process.env.TARGET_DIR;

function apiPath(input) {
  return input.split('/').map(encodeURIComponent).join('/');
}

async function readJson(url) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'oh-my-codex-upstream-sync',
  };
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${body.slice(0, 200)}`);
  }

  return response.json();
}

async function readContents(githubPath) {
  const url = `https://api.github.com/repos/${repo}/contents/${apiPath(githubPath)}?ref=${encodeURIComponent(ref)}`;
  return readJson(url);
}

async function copyEntry(entry) {
  const relativePath = path.relative(sourcePath, entry.path);
  const outputPath = path.join(targetDir, relativePath);

  if (entry.type === 'dir') {
    const children = await readContents(entry.path);
    for (const child of children) {
      await copyEntry(child);
    }
    return;
  }

  if (entry.type !== 'file') return;

  const file = await readContents(entry.path);
  if (file.encoding !== 'base64' || !file.content) {
    throw new Error(`Unsupported GitHub content encoding for ${entry.path}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(file.content, 'base64'));
}

(async () => {
  const rootEntries = await readContents(sourcePath);
  for (const entry of rootEntries) {
    await copyEntry(entry);
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
NODE

  if [[ "$name" == "impeccable" ]]; then
    normalize_impeccable_paths "$target_dir"
    write_source_manifest "$target_dir" "$repo" "$ref" "$upstream_skills_path" \
      "Codex script paths rewritten to use omcodex skill path impeccable."
  else
    write_source_manifest "$target_dir" "$repo" "$ref" "$upstream_skills_path"
  fi

  local count
  count=$(ls -d "$target_dir"/*/ 2>/dev/null | grep -v '/\.omc-source/$' | wc -l | tr -d ' ')
  echo "  Synced $count skills from github:$repo:$ref:$upstream_skills_path -> $target_dir"
}

sync_source() {
  local name="$1"
  local idx
  idx=$(get_index "$name") || { echo "Unknown source: $name" >&2; return 1; }
  local remote="${UPSTREAM_REMOTES[$idx]}"
  local ref="${UPSTREAM_REFS[$idx]}"
  local url="${UPSTREAM_URLS[$idx]}"
  local target_dir="$ROOT_DIR/.agent/skills/upstream/$name"
  local branch="$ref"
  if [[ "$ref" == "$remote/"* ]]; then
    branch="${ref#"$remote"/}"
  fi

  echo "Syncing $name..."

  if [[ "$name" == "impeccable" && "${OMCODEX_USE_GIT_FOR_IMPECCABLE:-}" != "1" ]]; then
    sync_github_api_source "$name" "pbakaus/impeccable" "$branch" ".agents/skills" "$target_dir"
    return
  fi

  # Ensure remote exists
  if ! git remote get-url "$remote" >/dev/null 2>&1; then
    echo "  Adding remote '$remote' -> $url"
    git remote add "$remote" "$url"
  fi

  # Fetch
  if [[ "$SKIP_FETCH" != "true" ]]; then
    git fetch --depth=1 "$remote" "$branch:refs/remotes/$remote/$branch"
  fi

  if ! git rev-parse --verify "$ref" >/dev/null 2>&1; then
    echo "  Upstream ref not found: $ref" >&2
    return 1
  fi

  # Detect skills directory in upstream
  local skills_dir=""
  for candidate in "skills" ".agent/skills" ".agents/skills" ".codex/skills"; do
    if git cat-file -e "$ref:$candidate" 2>/dev/null; then
      skills_dir="$candidate"
      break
    fi
  done

  if [[ -z "$skills_dir" ]]; then
    echo "  No skills directory found in $ref" >&2
    return 1
  fi

  # Extract skills to target
  rm -rf "$target_dir"
  mkdir -p "$target_dir"

  local tmp_dir
  tmp_dir=$(mktemp -d)
  git archive "$ref" "$skills_dir" | tar -x -C "$tmp_dir"

  # Copy skills (handle nested paths like .agent/skills/)
  cp -R "$tmp_dir/$skills_dir"/* "$target_dir/"
  rm -rf "$tmp_dir"

  local count
  count=$(ls -d "$target_dir"/*/ 2>/dev/null | wc -l | tr -d ' ')
  echo "  Synced $count skills from $ref:$skills_dir -> $target_dir"
}

if [[ "$SOURCE" == "all" ]]; then
  for name in "${UPSTREAM_NAMES[@]}"; do
    sync_source "$name"
  done
else
  if ! get_index "$SOURCE" >/dev/null 2>&1; then
    echo "Unknown source: $SOURCE" >&2
    echo "Available: ${UPSTREAM_NAMES[*]}" >&2
    exit 1
  fi
  sync_source "$SOURCE"
fi

echo ""
echo "Upstream skills synced successfully."
echo "  Layout: .agent/skills/upstream/<source>/"
ls -d .agent/skills/upstream/*/
