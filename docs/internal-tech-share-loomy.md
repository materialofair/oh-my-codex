# loomy开发实战——以及它背后那套 Claude Code 工作台

# 基本信息

| **产品/项目名称** | loomy（桌面 AI 助手应用） |
| -------------------- | ------------------------------------------------------------ |
| **主要技术栈** | 产品侧：Electron 40、React 19、Vite 7（JS / JSX、pnpm、Node 22+），内置 OpenCode 运行时。开发侧：Claude Code + 自研工作台（`oh-my-codex` / `claudecode-omc`）、Markdown Skills、agents / commands、MCP |
| **团队规模** | 个人独立开发，产品与配套工具均一人完成 |
| **业务效果感知** | 用 Claude Code 加一套自己搭的开发工作台，把 loomy 从想法推进到可打包交付的桌面产品；AI 编程从一次性问答变成可复用的开发流程，重复配置、调试乱试和返工明显减少 |
| **使用的大模型工具** | Claude Code、OpenAI Codex CLI |

# 分享目标

分享使用大模型辅助，对 loomy 桌面 AI 助手应用进行从想法到可打包交付的完整开发实践，包括需求梳理、代码分析理解、工作台方案设计、代码实现、调试定位、测试验证、评审合并完整流程，以及完成后的 AI 编程工作流治理经验总结。

# 验证结论

| 交付物 | 交付物类型 | 项目状态 | 项目复杂性 | 提效比例 |
| :----- | :--------- | :------- | :--------- | :------- |
| loomy（桌面 AI 助手应用） | Electron 桌面端 AI 编程助手产品 | 持续迭代，已可打包 DMG、本地测试通过 | 复杂 | 约 50%（复用已有工作台后，loomy 开发 / 交付的整体提效感知） |
| `oh-my-codex`（自研开发工具） | Codex skill pack / workflow orchestration CLI | 持续迭代，可本地安装使用 | 复杂 | 约 30%（配置准备、skill 选择、调试与验证链路等重复操作的感知提效） |
| `claudecode-omc`（自研开发工具） | Claude Code harness / 多源能力治理工具 | 持续迭代，与 Codex 侧形成姊妹方案 | 复杂 | 约 30%（多源治理、工作流复用的感知提效） |
| Prompt Optimizer（自研开发工具） | 任务入口与 skill 路由能力 | 新增 / 增强 | 中等 | 降低模糊需求整理、skill 选择和执行链路编排成本 |

# 案例简介

这个案例真正交付的产品是 loomy，loony的背后是众多研发小伙伴的努力，今天我只讲我个人开发loomy和用的工具，其他的伙伴也都有各自宝贵的经验

![AI 技能工作台：把散落能力收进可治理的本地工作台](assets/internal-tech-share-ai-skill-workbench/workbench-hero.png)
在讲loomy之前，我想讲我今年一年份就开发的一个工具，它最早叫 `oh-my-codex`，本来只是个很小的本地配置管理工具，用来对付 Codex 日常里的几个重复麻烦：skills 散在不同目录、prompts 和 rules 要手动复制、AGENTS.md 老得重整、MCP 配置每个环境都得维护、常用工作流只能靠脑子记。这些事单看都不大，可任务一复杂就会拖累 AI 编程的稳定性。真正拖慢交付的，往往是上下文不稳、执行方式没法复用、验证靠临时发挥。

做 loomy 的时候，这套早就攒好的工具正好派上用场。它后来也从“复制配置”长成了“治理能力来源”：现在 `oh-my-codex` 面向 OpenAI Codex CLI，NPM 包名是 `oh-my-codex-cli`，当前版本 `1.1.7`，定位是 skill pack 和 workflow orchestration 工具，会把 Local、oh-my-codex、superpowers、ECC 等来源的 skills 筛选、合并、处理冲突，再装进 Codex 运行时。

对应地，`claudecode-omc` 面向 Claude Code。两者的运行时边界不一样：Claude Code 有 commands、agents、hooks、CLAUDE.md、settings、HUD；Codex 主要围绕 skills、AGENTS.md、`.codex/config.toml`、MCP servers、`.codex/agents/*.toml` 和 notify 扩展。所以这两个项目不是互相照搬一份代码，而是把同一套治理思路放进两个不同的运行时。

说到底，loomy 是要交付的产品，这套工具是我开发它的方法。下面五个场景，前四个讲这套方法本身怎么设计，最后一个讲它怎么把 loomy 一个月的真实开发扛下来。开发 loomy 这一路，真正卡人的 AI 编程痛点主要有五个：

- 自己攒的 AI 编程能力散落在提示词、配置、临时记忆和上游仓库里，换个项目就得重搭。
- skill、agent、command、MCP 的来源越来越多，光靠脑子记名字、手动挑，成本越来越高。
- 上游能力一更新，要是没有 local-first 和冲突治理，自己长期调出来的经验容易被悄悄覆盖。
- 想吸收 superpowers、BMAD 这些上游工作流的方法论，又怕它们的原则、闸门和我自己 track 里的代码事实混在一起，越攒越乱、没法稳定复用。
- setup、验证、review、debug 这些链路不稳，同一套流程很难在不同项目、不同会话里复现。

# 提效场景介绍

每个场景都围绕同一个目标：让 AI 编程的流程更稳、更能复用，而不只是让 AI 多答几句。

## 场景一：多源 skills / agents / MCP 治理

要解决的问题：AI 工程能力来源越来越多，本地 skills、上游 skills、agents、commands、MCP 配置都可能重名、重复或互相覆盖。如果只是把目录复制到运行时，短期看能力变多了，长期会出现冲突不可解释、更新不可控、不知道该信哪一份的问题。

实践方式：`oh-my-codex` 采用 local-first 的多源治理结构，把本地能力和上游能力分层管理。

```text
.agent/
├── skills/
│   ├── local/
│   └── upstream/
│       ├── oh-my-codex/
│       ├── superpowers/
│       └── ecc/
└── curation/
```

其中 `.agent/skills/local/` 是本地 source of truth，`.agent/skills/upstream/` 是上游输入，`.agent/curation/*.json` 决定哪些上游能力进入运行时。`src/merge/skill-merger.js` 负责多源 skill 合并和冲突处理，`src/config/generator.js` 负责生成 Codex 的 managed config block。

![Local-first 多源工作台架构](assets/internal-tech-share-ai-skill-workbench/local-first-architecture.png)

达到的效果：上游能力可以被吸收，但不会悄悄接管本地经验。可以先把自己的最佳实践沉淀在 local，再按需引入 oh-my-codex、superpowers、ECC 等来源。能力扩展从”复制目录”变成”同步、声明、筛选、合并、安装”。

案例经验总结：AI 能力治理不能只追求数量。skill 多了以后，关键问题会从”有没有”变成”谁进入运行时、谁覆盖谁、谁只是参考”。local-first 可以保护长期调出来的工作方式，让上游成为输入，而不是最终答案。

## 场景二：同名冲突和版本更新治理

要解决的问题：`security-review`、`verification-loop`、`prompt-optimizer` 这类能力在不同来源里都可能存在。同名不代表内容一致，版本更新也不代表更合用。如果没有明确规则，使用时根本不知道到底调用了哪一个 skill。

实践方式：在合并阶段显式处理 exact name、similar description、same intent 等冲突。`oh-my-codex` 侧强调 local-first：本地 fork 不应该被上游 SemVer 默认覆盖。`claudecode-omc` 侧则结合用户显式 preference、quality score、SemVer、local priority 和 source priority 做决策。

![多源 skill 冲突治理决策梯](assets/internal-tech-share-ai-skill-workbench/conflict-resolution-ladder.png)

达到的效果：冲突不再靠人工猜。可以知道一个 skill 为什么被选择，另一个同名来源为什么没有进入运行时。升级上游能力时，也能先检查影响，再决定是否采用。

案例经验总结：AI 编程里的很多规则不是一次性写对的，而是从长期使用中慢慢调出来的。本地 skill 可能版本号不高，但更贴自己的代码风格、验证习惯和工具边界。治理系统要尊重这种本地经验。

## 场景三：把上游工作流方法论归档进 conductor（intent 层治理）

要解决的问题：场景一、二治理的是“能力来源”——skill、agent、MCP 谁进运行时、谁覆盖谁。但还有一类来源同样会越攒越乱：方法论。superpowers 的 brainstorming / TDD / verification、BMAD-METHOD 的 PRD / 架构 / story / QA，这些上游工作流沉淀下来的是“该怎么做”的文档。做大功能时我会用 conductor 把一个需求拆成跨多会话的 track（Context→Spec→Plan→Implement，落到 `.omc/conductor/tracks/<slug>/` 的 `spec.md` / `plan.md` / `review.md`）。问题是：如果把上游方法论直接抄进这些 track 文件，方法论（原则、阶段闸门、检查清单）就会和代码事实（文件名、行号、测试数）混在一起。下次重跑、上游一更新，要么互相覆盖，要么我自己写的项目内容被冲掉，track 越用越不敢动。

实践方式：用 `conductor-distill` 把上游方法论“提炼并归档”进当前 track，而不是手抄。它从 superpowers / BMAD 的源文档里只抽 intent 层信号——原则、闸门、清单、角色期望——按固定映射写进 `spec.md` / `plan.md` / `review.md`。关键是两条硬约束：

- **只写在 marker block 里**：每段归档内容都用 `<!-- conductor:distilled BEGIN source=... -->` 包起来，幂等、可整块替换；block 之外的人工内容和代码内容一律原样保留，`--refresh` 时按 `source=` 精确换掉旧块，重跑不会污染其它内容。
- **intent 层 vs fact 层严格分离**：distilled block 里绝不写本仓库的文件名、代码符号、分支、测试结果——“就算仓库是空的这段也读得通”。代码拥有的事实留给代码，方法论留给文档，两层不抢地盘。

映射大致是：superpowers/brainstorming → spec 的“未批准不实现”设计闸门；writing-plans → plan 的小步骤粒度；TDD → plan 的 red-green-refactor 加 review 的 TDD 检查；verification-before-completion → review 的“先证据后结论”清单；BMAD 的 agent-pm / template-prd → spec 的 PRD 骨架，agent-qa → review 的 NFR / 风险 / 可追溯检查。

<!-- 配图建议：conductor-distill 的 intent 层 / fact 层分离与 marker block 归档示意（建议 assets/internal-tech-share-ai-skill-workbench/conductor-distill-intent-layer.png）-->

达到的效果：上游工作流的方法论可以被吸收进我长期的 track，但永远是“输入”而不是“最终答案”，也绝不会悄悄盖掉我已经写进 spec / plan 的项目判断。一个 track 跨 5–10 个会话做下来，方法论那一层始终幂等可重跑、可整块更新；要换上游版本，只动 marker block，不碰其余内容。

案例经验总结：这其实是把场景一、二的多源治理思路，从“能力来源”延伸到了“方法论来源”。同样是 local-first：上游的工作流文档是养料，不是规矩本身；同样要回答“谁进来、谁覆盖谁、谁只是参考”。区别在于这一层治理的是“该怎么做”，而代码事实是另一层、归代码管。两层一旦分清楚，吸收上游方法论才不会变成给自己埋雷。

## 场景四：Prompt Optimizer 降低入口成本

要解决的问题：当系统里只有十几个 skill 时，人还可以记住名字；到了几十个、上百个以后，人脑就不适合继续当路由器了。测试相关能力可能叫 `tdd`、`test-driven-development`、`tdd-generator`、`test-coverage`、`e2e`、`bdd-generator`；验证相关能力可能叫 `verify`、`verification-loop`、`verification-before-completion`。每次任务开始前都要先回忆名字，skill 反而会变成负担。

实践方式：把 Prompt Optimizer 放在任务入口，把自然语言请求转换成可执行、可验证的工作流。它不是单纯润色提示词，而是根据当前 skill catalog 做 scope assessment、意图识别、skill alias resolution 和执行链路推荐。

![Prompt Optimizer 把模糊请求编译成可执行工作流](assets/internal-tech-share-ai-skill-workbench/prompt-optimizer-compiler.png)

例如，用户输入：

```text
这个登录页偶尔跳不过去，你帮我看下，顺便把相关测试补一下。
```

Prompt Optimizer 应该识别出这是 bug fix + testing 的多意图任务，先要求复现和定位，再补回归测试，最后做最小修复和验证。整理后的执行链路可以是：

```text
systematic-debugging
→ trace / analyze
→ tdd 或 test-driven-development
→ 最小修复
→ verify
```

达到的效果：开发者不需要先背 skill 大全，也不需要每次手写完整工程提示词。模糊需求可以更稳定地进入调试、测试、实现、验证链路，减少因为提示词随意导致的返工。

案例经验总结：Prompt Optimizer 的价值不是推荐更多 skill，而是少推荐但推荐对。小修复不应该被过度编排，大任务也不应该缺少规划和持久上下文。入口质量本身就是 AI 工程能力的一部分。

## 场景五：在真实项目里跑通这套工作流（以 myloomy 桌面端为例）

要解决的问题：前四个场景讲的是治理、冲突、归档和入口，但都还停留在工作台本身。真正要回答的是另一个问题：让它接管一个项目一个月的日常开发，扛不扛得住？只在演示里顺手不算数，碰上真实代码和动不动出问题的 git 环境就露馅，那它不过是另一套好看的设想。

实践方式：我用这套工作台从头到尾开发了 myloomy，一个基于 Electron 40 + React 19 + Vite 7（JS/JSX、pnpm）的桌面 AI 助手应用，里面有多会话对话、按工作目录隔离的会话、Markdown / HTML 预览面板、模型选择、buddy 分享这些功能。一个月、上百个会话下来，我并没有去背什么固定链路；真正稳下来的，是它们自己长出来的几条高频路径：

```text
Bug（最高频，截图 + 一句中文描述就能起步）：
/analyze
→ systematic-debugging（先定位根因，禁止凭直觉改）
→ 最小修复
→ /review
→ 提交 / MR

新功能：
小功能 → start-dev（discover → research → plan → implement → verify）
大功能 → conductor（把 spec / plan 落到 .omc/conductor，让一个功能跨 5–10 个会话接着做）

模糊需求入口：
prompt-optimize（被调用最多的能力）
→ 把一句中文 bug 描述编译成带 systematic-debugging 文件清单的可执行 prompt
→ 粘进新会话执行

合并把关：
/review + code-review + santa-method 双评审
→ 合并前一次性挑出问题（某次在预览分支上挑出 9 个问题，含 3 个 P0）
```

![默认工作流在 myloomy 里的实际形态](assets/internal-tech-share-ai-skill-workbench/team-adoption-workflows.png)

这几条路径都是项目里真跑出来的。最典型的是 bug：比如“对话页打开文件时变三栏，右侧窗口拖宽，中间的输入框和文件卡片宽度不跟着收缩，溢出到右边”，一张截图加一句话，`/analyze`、定位、修、提交，就过去了。“浏览器配置成 edge、不重启进程还是走 chrome”“OpenRouter 自定义模型 ID 被改坏报 Model not found”“分享 buddy 后落地页和导入方都不显示头像”，走的也是同一条。

但得说实话，它不是魔法，摩擦一点不少。glab 令牌不支持提 MR，私有化 GitLab、gitee 加 SSH 公钥来回折腾了好一阵；vendored 的 opencode 二进制太大，`git commit` 直接被系统 OOM kill，`index.lock` 反复出现，最后是删掉那个文件才提交成功；有一次自动 merge 把仓库搞坏到 `git status failed with code 9`；手上只有 Mac、没有 Windows，本地复现不了，只能给 agent 写死一句“没有 Windows 数据不许声称已修复”。这些麻烦反而说清了它的用处：工作台不是替你把活干完，而是把“乱试乱改”逼成“先取证、先定位、再做最小修复、再评审”这套规矩，哪怕 git 已经坏掉、跨平台又复现不了，规矩照样压得住。

达到的效果：同一条 `analyze → debug → review → commit` 的链路，在几十个会话里被我反复用，不用每次重新想流程。常常一句话就能换来一大块产出，“符合预期”“你来帮我实现全部的功能”“不要分 4 次 PR，一把梭，全部干完，做好自测”。变化更明显的是我自己的 prompt：到后期普遍写得很死，file / line 精确、技能链路点名、还带一堆硬约束（“禁止凭直觉改代码”“禁止跳步”“禁止修改任何样式文件”），prompt-optimize 吐出来的东西干脆被我当模板反复用。

案例经验总结：一个月下来我的体会是，稳定的提效很少来自某个万能 skill，更多是几条高频链路在一个项目里被反复用熟。工作台最值钱的是两头：入口上，prompt-optimize 把一句模糊的中文需求编译成能直接跑的流程；合并前，review 和 santa-method 把问题拦在外面。中间那段全靠 analyze 接 systematic-debugging 这条规矩压着，先定位再动手。一个项目真用满一个月，比一次性推上百个 skill，更能说明这套东西到底有没有用。
