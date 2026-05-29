# Multi-Agent Research Troubleshooting

## Child Agents Unavailable

Use in-response role blocks:

```markdown
[EXPLORER]
[REVIEWER]
[DOCS]
[SYNTHESIS]
```

Keep each block evidence-based and cite local files or official docs.

## Network Unavailable

- Use local lockfiles, package metadata, and repository docs.
- Mark version-sensitive claims as unverified.
- Provide the exact source that should be checked later.

## Local Command Fails

Capture:

- command
- working directory
- exit code
- key output
- likely cause

Then continue with the best available static evidence.

## Conflicting Agent Results

Resolve by evidence priority:

1. Primary documentation or local source code
2. Reproducible command output
3. Repository docs
4. Agent inference

If the conflict remains unresolved, surface it as a decision risk.
