# Notify Extension (Custom Plugins)

`oh-my-codex` supports additive notify plugins under `.omx/notify/*.mjs`.

## Quick Start

```bash
omx notify init
omx notify status
omx notify validate
OMX_NOTIFY_PLUGINS=1 omx notify test
```

Primary plugin directory:

- `.omx/notify/`

Legacy compatibility directory:

- `.omx/notify-plugins/`

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

- `.omx/logs/notify-YYYY-MM-DD.jsonl`
