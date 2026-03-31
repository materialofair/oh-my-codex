---
name: help
description: Guide on using oh-my-codex skills
version: 0.1.0
source: fork
checksum: b65aef635ad7003dea8bc73a00bf4f36786a298050a83d70b716555e8772e5de
updated_at: 2026-02-11T15:02:15+08:00
---


# How OMC Works


## Native Subagent Protocol (Codex)

Codex supports native subagents. Delegate with `spawn_agent`, coordinate with `send_input`, collect via `wait`, and clean up with `close_agent`.

Execution preference:
1. Use native subagents first for independent workstreams (parallel when possible).
2. Merge results in main thread and run final verification.
3. Fallback only when delegation is blocked: use the `[ANALYST]`/`[ARCHITECT]`/`[EXECUTOR]`/`[REVIEWER]` structure in a single response.

Minimal orchestration pattern:
```text
spawn_agent -> send_input (optional) -> wait -> close_agent
```

> Codex invocation: use `$help ...` or `help: ...`


**You don't need to learn any commands!** OMC enhances Codex with intelligent behaviors that activate automatically.

## What Happens Automatically

| When You... | I Automatically... |
|-------------|-------------------|
| Give me a complex task | Parallelize and delegate to specialist agents |
| Ask me to plan something | Start a planning interview |
| Need something done completely | Persist until verified complete |
| Work on UI/frontend | Activate design sensibility |
| Say "stop" or "cancel" | Intelligently stop current operation |

## Magic Keywords (Optional Shortcuts)

You can include these words naturally in your request for explicit control:

| Keyword | Effect | Example |
|---------|--------|---------|
| **ralph** | Persistence mode | "ralph: fix all the bugs" |
| **ralplan** | Iterative planning | "ralplan this feature" |
| **ulw** | Max parallelism | "ulw refactor the API" |
| **plan** | Planning interview | "plan the new endpoints" |

**ralph includes ultrawork:** When you activate ralph mode, it automatically includes ultrawork's parallel execution. No need to combine keywords.

## Stopping Things

Just say:
- "stop"
- "cancel"
- "abort"

I'll figure out what to stop based on context.

## First Time Setup

If you haven't configured OMC yet:

```
$omc-setup
```

This is the **only command** you need to know. It downloads the configuration and you're done.

## 0.9+ Quick Tips

- Use `/apps` to browse available connectors and insert app prompts quickly.
- If prompted for tool approvals, use "allow and remember" for trusted tools to reduce repeated confirmations.
- Use `/debug-config` to inspect active config, skills paths, and runtime settings when behavior looks wrong.

## For 2.x Users

Your old commands still work! `$ralph`, `$ultrawork`, `$plan`, etc. all function exactly as before.

But now you don't NEED them - everything is automatic.

## Need More Help?

- **README**: https://github.com/Yeachan-Heo/oh-my-codex
- **Issues**: https://github.com/Yeachan-Heo/oh-my-codex/issues

---

*Version: 3.5.5*
