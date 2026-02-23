# Notify Extension (Custom Plugins)

`oh-my-codex` supports additive notify plugins under `.omcodex/notify/*.mjs`.

## Quick Start

```bash
omcodex notify init
omcodex notify status
omcodex notify validate
OMX_NOTIFY_PLUGINS=1 omcodex notify test
```

Primary plugin directory:

- `.omcodex/notify/`

Legacy compatibility directory:

- `.omcodex/notify-plugins/`

## Enablement Model

Plugins are disabled by default.

Enable dispatch explicitly:

```bash
export OMX_NOTIFY_PLUGINS=1
```

Optional timeout tuning (default `1500ms`):

```bash
export OMX_NOTIFY_PLUGIN_TIMEOUT_MS=1500
```

## Supported Events

- `turn-complete`
- `session-start`
- `session-end`
- `session-idle`
- `needs-input`
- `pre-tool-use`
- `post-tool-use`

## Team Auto-Advance Integration

When team state is started with auto mode:

```bash
omcodex team start "your task" --auto
```

notify events can advance team phases automatically:

- `turn-complete`: `team-plan -> team-prd -> team-exec`, and can complete `team-verify`
- `post-tool-use`: can move `team-exec -> team-verify`
- failure-like messages in notify context can trigger `team-fix`

## Plugin Contract

Each plugin must export:

```js
export async function onNotifyEvent(event, sdk) {
  // handle event
}
```

SDK surface includes:

- `sdk.log.info|warn|error(...)`
- `sdk.state.read|write|delete(...)`

## Logs

Dispatch and plugin logs are written to:

- `.omcodex/logs/notify-YYYY-MM-DD.jsonl`
