---
title: Agent Skills 安装指南：如何在 Codex、Claude Code 等工具中使用 SKILL.md
description: 从下载 SKILL.md 到验证 Agent 是否正确调用，介绍 Agent Skills 的基本结构、安装思路、常见问题和安全检查，帮助新手把技能真正用起来。
keywords: Agent Skills 安装, SKILL.md, Codex Skills, Claude Code Skills, AI Agent 技能
aside: false
image: /images/workflows/agent-skills-install.jpg
---

# Agent Skills 安装指南：如何在 Codex、Claude Code 等工具中使用 SKILL.md

如果你刚接触 Agent Skills，最容易卡住的不是怎么写技能，而是下载后放在哪里、工具能不能识别，以及为什么它有时没有自动触发。

先记住一个关键点：**SKILL.md 是技能的说明文件，但不同工具发现和加载技能的方式可能不同。** 不要把某一个工具的目录规则当成所有工具的通用标准。

## Agent Skill 是什么？

一个 Skill 通常是一个文件夹，里面有一个 `SKILL.md`，可选地附带参考文档、脚本、模板或其他资源。文件开头通常通过 YAML frontmatter 声明 `name` 和 `description`，帮助 Agent 判断这个技能的用途和适用时机。

一个常见的目录结构如下：

```text
my-skill/
├── SKILL.md
├── references/
│   └── checklist.md
├── scripts/
│   └── validate.py
└── assets/
    └── report-template.md
```

并非每个技能都需要脚本。只包含稳定流程、决策规则和交付格式的技能，可以先从一个清晰的 `SKILL.md` 开始。

## 最简单的使用方式：下载、检查、放入工具识别的目录

### 第一步：下载技能包

从[技能商店](../../skills/)选择一个符合任务的技能。可以复制 `SKILL.md)，也可以下载完整 ZIP。

如果技能包含 `references/`、`scripts/` 或 `assets/`，优先使用 ZIP 并保留原目录结构；只复制主文件可能会导致引用的模板或脚本缺失。

### 第二步：先检查内容和权限

在运行前，至少检查以下内容：

- `SKILL.md` 的 `name` 和 `description` 是否清楚。
- 指令是否要求执行 shell 命令、访问网络、读取敏感文件或修改生产数据。
- 附带脚本做了什么，是否有不必要的依赖或权限要求。
- 是否引用了当前 ZIP 中不存在的相对路径。
- 技能来源、许可证和使用限制是否清楚。

Skill 是交给模型使用的指令和资源，不是天然安全的沙盒。不要因为它看起来只是 Markdown 就跳过检查。

### 第三步：按工具的官方方式安装

不同产品的 Skills 支持和目录约定可能随版本变化。安装前请核对官方文档，不要直接把下面的概念当成统一命令：

- **Codex：** 参考 [OpenAI 的 Skills 文档](https://developers.openai.com/plugins/concepts/skills)及[构建 Skills 指南](https://developers.openai.com/plugins/build/skills)。Codex 也提供 `$skill-creator`，可用于创建技能。
- **Claude Code：** 参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)，确认你当前版本支持的 Skills 目录、项目级与个人级配置。
- **OpenAI API：** 如果你是在 API 中使用技能，流程与本地文件安装不同。请阅读 [API Skills 指南](https://developers.openai.com/api/docs/guides/tools-skills)，了解技能包上传、版本和运行环境的要求。
- **其他 Agent 工具：** 查看对应工具的官方说明，确认它支持 Agent Skills 标准，还是需要专属格式或转换步骤。

### 第四步：用一个明确任务验证

安装后不要只问“你有没有加载技能”。用一个能观察结果的任务验证，例如：

```text
请使用刚安装的「网站上线验收」技能检查当前项目。
开始前先说明你能读取哪些文件、计划执行哪些检查。
请输出检查清单、实际检查结果、未执行的项目和发现的问题。
不要声称运行过任何未实际执行的命令。
```

检查结果是否体现了技能中的特定步骤、交付格式和限制。如果输出与普通对话完全相同，先检查工具是否发现了技能，再检查 `description` 是否清楚说明触发场景。

## 为什么技能没有自动触发？

常见原因有四种：

1. **工具没有发现它。** 文件放在了工具不扫描的位置，或当前产品版本不支持这种加载方式。
2. **描述过于模糊。** `description` 只写“帮助完成工作”，模型很难判断何时应该使用它。
3. **任务没有命中触发条件。** 用技能的具体目标描述任务，不要只问宽泛问题。
4. **技能本身没有可验证的流程。** 如果指令只有原则，没有步骤、分支条件和交付要求，就很难判断它是否发挥了作用。

## 如何降低上下文和 Token 成本？

技能本身不一定会在每次对话中完整注入；具体加载行为取决于工具。更重要的是控制技能的设计：

- 只在主文件保留触发条件、核心流程和验收标准。
- 将较长的参考资料拆到 `references/`，在需要时再读取。
- 把重复、确定性的计算交给脚本，而不是让模型反复推理。
- 避免同时启用多个职责重叠、规则互相冲突的技能。
- 为复杂工作拆分阶段，每阶段只传递必要的上下文和产物。

不要单纯追求文件越长越专业。真正值得付费的技能，价值在于稳定完成复杂工作、减少遗漏，并产出可以检查的结果，而不是消耗更多 Token。

## 从技能商店开始

如果你想直接试用，可以从[技能商店](../../skills/)挑选一个免费技能。建议先用低风险任务验证，再逐步将技能应用到真实项目。

你也可以继续阅读：

- [AI Coding 项目交付流程](./ai-project-delivery-workflow)
- [网站上线检查清单](./website-launch-checklist)
- [AI 数据分析工作流](./ai-data-analysis-workflow)

## 官方资料

- [OpenAI：Skills 概念](https://developers.openai.com/plugins/concepts/skills)
- [OpenAI：构建 Skills](https://developers.openai.com/plugins/build/skills)
- [OpenAI API：Skills 指南](https://developers.openai.com/api/docs/guides/tools-skills)
- [Anthropic：Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code/overview)
