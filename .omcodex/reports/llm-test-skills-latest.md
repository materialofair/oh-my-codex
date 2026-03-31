# Skills LLM Test Report

Generated At: 2026-03-07T16:36:18.822Z
Overall Pass: YES

| Step | Pass | Exit | Command |
|---|:---:|---:|---|
| skill-governance | Y | 0 | bash scripts/check-skill-governance.sh |
| skill-llm-governance | Y | 0 | node scripts/check-skill-llm-governance.js --mode=auto |
| skill-eval | Y | 0 | node scripts/eval-skills.js |
| skill-trigger-regression | Y | 0 | node .codex/skills/skill-tester/scripts/run-skill-tests.js --skill-path .codex/skills/skill-tester |

## skill-governance

```text
Skill governance check passed.

```

## skill-llm-governance

```text
Skill governance (LLM gate) completed: 88 skills
High=0 Medium=11 Low=2
Report: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/reports/skill-llm-governance-latest.json

```

## skill-eval

```text
Skill eval completed: 88 skills, avg=97.95, fail=0
Reports: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/reports/skill-eval-latest.json
Reports: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/reports/skill-eval-latest.md

```

## skill-trigger-regression

```text
Skill tester completed: pass=true
Report: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/reports/skill-tester-latest.json
Report: /Users/WangQiao/Desktop/github/ios-dev/ZeroNet-Space/openSource/oh-my-codex/.omcodex/reports/skill-tester-latest.md

```
