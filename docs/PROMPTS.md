# Codex Custom Prompts (Deprecated)

This repo can generate `/prompts:<name>` shortcuts for Codex.
These are **deprecated** by OpenAI but still work today.

## Generate
```bash
./scripts/generate-codex-prompts.sh
```

## Example Usage
```
/prompts:autopilot TASK="build a todo app"
/prompts:ralph TASK="refactor auth"
```

## Why Deprecated
OpenAI recommends using **skills** instead of custom prompts for long-term stability.
