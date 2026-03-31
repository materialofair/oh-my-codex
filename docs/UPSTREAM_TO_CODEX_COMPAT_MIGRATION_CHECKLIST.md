# Upstream -> Codex 兼容迁移清单

更新时间：2026-03-31  
基线分支：`upstream/main`  
证据来源：
- `.omcodex/reports/skill-governance-sources/upstream/skill-llm-governance-latest.json`
- `scripts/check-skill-governance.sh` 对 upstream `skills/` 快照的实跑结果

## 1. 目标

将 upstream skill 集合迁移到当前 codex 治理基线，使其满足：

1. `governance:skills` 无 blocker。
2. `governance:skills:llm` 无 high severity blocker。
3. `eval:skills` 全部通过（当前已通过）。

## 2. 当前阻塞概览

### P0 - `legacy_slash_command`（18 个 skill）

需要将文档中的 `/xxx` 旧调用方式迁移为 codex 兼容调用（优先 `$skill` 形式或明确“调用对应 skill”）。

1. `skills/ask-claude/SKILL.md`
2. `skills/ask-gemini/SKILL.md`
3. `skills/autopilot/SKILL.md`
4. `skills/build-fix/SKILL.md`
5. `skills/cancel/SKILL.md`
6. `skills/code-review/SKILL.md`
7. `skills/frontend-ui-ux/SKILL.md`
8. `skills/git-master/SKILL.md`
9. `skills/help/SKILL.md`
10. `skills/note/SKILL.md`
11. `skills/plan/SKILL.md`
12. `skills/ralph-init/SKILL.md`
13. `skills/ralph/SKILL.md`
14. `skills/review/SKILL.md`
15. `skills/security-review/SKILL.md`
16. `skills/skill/SKILL.md`
17. `skills/swarm/SKILL.md`
18. `skills/ultraqa/SKILL.md`

### P0 - `non_codex_runtime`（4 个 skill）

需要移除或降级为“可选扩展”的非 codex 运行时指导（如 HUD/omx 专属、tmux 专属强依赖、插件/旧运行时路径假设）。

1. `skills/doctor/SKILL.md`
2. `skills/hud/SKILL.md`
3. `skills/pipeline/SKILL.md`
4. `skills/team/SKILL.md`

### P1 - `missing_structure`（3 个 skill）

需要补齐清晰的 workflow/instructions/usage 段落。

1. `skills/ecomode/SKILL.md`
2. `skills/pipeline/SKILL.md`
3. `skills/visual-verdict/SKILL.md`

## 3. 迁移执行批次（建议）

## Batch A（先清语法）

1. 统一替换 `/xxx` 调用示例为 `$xxx` 或“invoke <skill>”。
2. 保留历史别名时，标记为“legacy alias（兼容期）”，避免作为主调用方式。
3. 每改完 3-5 个 skill 跑一次治理脚本，避免大包失败难排查。

## Batch B（清运行时耦合）

1. `doctor`：将插件缓存、WebFetch、旧 hooks 路径等内容改为 codex 原生可执行检查。
2. `hud`：将 HUD/omx 双层架构描述改为“仅在 OMX 扩展存在时可用”，默认不作为 codex 基线要求。
3. `pipeline`：将 `team-exec`、`ralph-verify` 等对 omx runtime 强耦合内容拆为“可选后端”。
4. `team`：将 tmux/Claude CLI/omx team API 依赖降级为“扩展模式”，默认路径改为 codex native subagents。

## Batch C（补结构）

1. 给 `ecomode/pipeline/visual-verdict` 增加最小结构段落：
   - When to use
   - How to invoke
   - Step-by-step workflow
   - Output contract

## Batch D（治理资产收口）

1. 若确需短期保留遗留语义，补充受控 allowlist，并附过期时间。
2. 更新治理文档，声明 upstream 技能目录结构差异（`skills/` vs `.agent/skills`）。
3. 生成一次迁移报告（变更清单 + 门禁结果）。

## 4. 验证命令

在当前仓库执行：

```bash
source ~/.nvm/nvm.sh && nvm use default >/dev/null
npm run governance:skills
npm run governance:skills:llm -- --mode=heuristic
npm run eval:skills
npm run governance:skills:sources -- --skip-fetch --llm-mode heuristic
```

目标结果：

1. fork 与 upstream 两套检查均无 blocker（或仅允许在受控 allowlist 内）。
2. upstream `skill-llm-governance-latest.json` 中 `summary.severity.high = 0`。

## 5. 完成定义（DoD）

1. 上述 22 个阻塞项（18 + 4）全部处理完成。
2. 3 个结构性中等问题处理完成。
3. 双源治理脚本输出 `Failures: 0`。
4. 清单中所有条目标记为 done，并附对应 commit/PR 链接。
