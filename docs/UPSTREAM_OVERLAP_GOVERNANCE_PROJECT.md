# Upstream/Fork Skill 重合治理项目

本项目的治理目标不是“盲目迁移 upstream 全量 skill”，而是：

1. 先识别 fork 与 upstream 的 **重合 skill**（同名能力）。
2. 对重合项做兼容性判定与合并策略修复。
3. 让安装/合并默认走“治理后可用版本”，避免 upstream 未治理内容回流。

## 当前策略

1. 重合分析命令：`npm run governance:skills:overlap`
2. 双源治理命令：`npm run governance:skills:sources -- --skip-fetch --llm-mode heuristic`
3. patch 生成命令：`npm run governance:skills:patches`
4. 默认合并偏好：重合 skill 自动做质量评分，择优选择（可被 `.codex/merge-config.json` 显式偏好覆盖）
5. setup 合并配置加载顺序：
   - `.codex/merge-config.json`（用户/项目显式配置优先）
   - `templates/merge-config.json`（仓库治理默认）
6. setup 合并策略：重合 skill 不删除、不过滤；在合并阶段按质量评分选 winner（fork/upstream）。

## 为什么优先 fork

当前 fork skill 集已通过本仓库治理门禁；upstream 重合项里仍有 blocker（例如 legacy slash/non-codex runtime）。  
因此当前质量评分通常会倾向 fork，但如果 upstream 某项质量分更高，会自动选 upstream。

## 交付物

1. 重合治理报告：
   - `.omcodex/reports/skill-overlap-governance-latest.json`
   - `.omcodex/reports/skill-overlap-governance-latest.md`
2. 双源治理报告：
   - `.omcodex/reports/skill-governance-sources/fork/*`
   - `.omcodex/reports/skill-governance-sources/upstream/*`

## 收口标准

1. 重合 skill 的 quality winner 结果可解释、可复现（同一输入同一结果）。
2. 每次 upstream 同步后，重新跑 `governance:skills:sources` 与 overlap 报告验证。
