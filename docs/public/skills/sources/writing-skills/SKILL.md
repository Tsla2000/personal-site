---
name: 技能编写
description: >-
  当你想把一套验证过的经验、方法、工具或流程固化成可复用的 AI 技能文档（SKILL.md）时使用；新建技能、修改已有技能、或在发布前验证技能是否真正有效时触发。不是用来写一次性教程或叙事复盘的。
---

# 技能编写（Writing Skills）

改编自 obra/superpowers（MIT License），原作者 Jesse Vincent

## 触发条件

- 你发现了一套"下次还想再用"的经验、流程、判断方法或工具，想把它固化成文档，让未来的自己（或未来的 AI）能直接复用 → 用这个技能。
- 你要新建一个技能、修改一个已有技能、或在把技能投入使用前验证它是否真的有效 → 用这个技能。
- **不适用**：一次性解决方案、别人已经写得很清楚的标准实践、只适用于某个项目的约定（放项目说明文件里）、能用正则/校验自动化的机械约束（写成代码，别写成文档）。

## 核心思想

**写技能，就是给流程文档做测试驱动开发（TDD）。**

先写测试用例（用子代理跑压力场景），看它失败（记录没技能时的基线行为），再写技能（文档），看测试变绿（代理开始遵守），最后重构（堵上代理找到的新漏洞）。

核心原则：**如果你没亲眼看过一个没读技能的代理犯错，你就不知道这个技能到底要教什么。**

## 什么是"技能"

技能是一份**可复用的参考指南**：记录被验证有效的技术、模式或工具，帮助未来的代理找到并应用它们。

- **是**：可复用的技术、模式、工具、参考手册。
- **不是**：对"我某次怎么解决一个问题"的叙事复盘。太具体、不可复用的故事不要写进技能。

## TDD 映射：技能创建的红-绿-重构

| TDD 概念 | 对应到技能创建 |
|---|---|
| 测试用例 | 用子代理跑的压力场景 |
| 被测代码 | 技能文档（SKILL.md）本身 |
| 测试失败（红） | 没有技能时，代理违反规则（基线行为） |
| 测试通过（绿） | 有了技能后，代理遵守规则 |
| 重构 | 堵住新发现的漏洞，同时保持合规 |
| 先写测试 | **写技能之前先跑基线场景** |
| 看它失败 | 逐字记录代理用的借口和合理化话术 |
| 最小实现 | 只针对那些具体的违规行为写技能 |
| 看它通过 | 验证代理现在遵守了 |
| 重构循环 | 发现新借口 → 堵上 → 重新验证 |

## 什么值得写成技能

**值得写**：这套方法对你来说不是显而易见的；你以后还会反复查阅；它适用范围广（不是某个项目专属）；别人也能受益。

**不值得写**：一次性解法；别处已有标准文档；项目专属约定；机械约束（能自动化就自动化，文档留给需要判断力的地方）。

## 三种技能类型

1. **方法（Technique）**：有明确步骤可照做的具体做法。
2. **思维模式（Pattern）**：看待问题的一种方式、一种心智模型。
3. **参考（Reference）**：API 文档、语法手册、工具说明。

不同类型要用不同的测试方式（见"按类型测试"一节）。

## SKILL.md 的结构

**Frontmatter（YAML，两字段必填，总长度 ≤1024 字符）：**

- `name`：只用字母、数字、连字符（不要括号和特殊符号）。
- `description`：第三人称，**只写"什么时候用"**，不写"这个技能是做什么的"。
  - 以 "Use when…"（"当……时使用"）开头，聚焦触发条件。
  - 写具体的症状、场景和上下文，比如"测试有时过有时不过"。
  - **永远不要在 description 里总结技能的流程**。实测发现：一旦 description 概括了流程，代理就会照着 description 干，根本不读正文——曾有一个技能 description 写了"任务之间做代码评审"，正文流程图明明要求评审两次，代理却只做了一次。把 description 改成纯触发条件后，代理才老老实实去读流程图。
  - 尽量控制在 500 字符以内。

**正文建议结构**：概述（核心原则一两句）→ 触发条件（症状列表 + 不适用场景，决策不明显时可加小流程图）→ 核心模式（方法类用 before/after 对比）→ 快速参考（表格或要点）→ 实现细节（简单模式贴代码，重型参考拆文件）→ 常见错误（错在哪 + 怎么改）→ 真实效果（可选）。

## 让技能被发现（SDO）

### 1. 关键词覆盖

用代理搜索时会用的词：报错原文（"Hook timed out"）、症状词（flaky、hanging、zombie）、同义词（timeout/hang/freeze）、真实的命令和库名。

### 2. 命名用动词开头

- ✅ `creating-skills` 而不是 `skill-creation`
- ✅ 过程类用动名词：`debugging-with-logs`、`testing-skills`

### 3. 省 token（关键）

常被加载的技能每个 token 都算钱：入门流程类 <150 词，常加载技能全文 <200 词，其他 <500 词。

- 细节挪到 `--help`：别在文档里抄一遍所有命令行参数，写"运行 `--help` 查看"。
- 用交叉引用代替重复：别把别的技能的 20 行流程抄过来，写"**REQUIRED:** 使用 XXX 技能"。
- 例子能短则短，一个好例子胜过五个平庸例子；只用一种语言写例子。
- 不要重复被引用技能里已有的内容。

### 4. 引用其他技能的方式

只写技能名 + 明确标记，不用 `@` 链接（`@` 会强制立刻加载文件，烧掉大量上下文）：

- ✅ `**REQUIRED SUB-SKILL:** 使用 xxx`
- ❌ `@skills/xxx/SKILL.md`

## 文体要匹配失败类型

写指导之前，先给基线失败分类。给 A 类失败开的药方，用在 B 类上会起反作用：

| 基线失败 | 正确的文体 | 错误的文体 |
|---|---|---|
| 代理在压力下跳过/违反规则（懂，但不做） | 禁令 + 借口对照表 + 红线清单 | 软话（"建议……"、"可以考虑……"） |
| 代理照做了，但输出形状不对（结论被埋没、复述需求） | 肯定式配方：说清楚输出**是**什么、按什么顺序 | 禁令清单（"不要复述"、"不要叙事"） |
| 代理产出的东西漏了必填项 | 结构：在模板里加必填字段/槽位 | 模板旁边的文字提醒 |
| 行为应该随条件变化 | 条件式：绑定到可观察的谓词（"如果简报存在，就引用它"） | 无条件规则 + 例外条款 |

**规则**：不加" nuanced 条款"。"不要 X，除非……"会重新打开谈判——实测里给获胜配方加一句例外条款，效果就从稳定变吵闹。真有例外，就写成独立的条件句。

## 给纪律型技能"防杠"（Bulletproofing）

只适用于"代理懂规则但在压力下跳过"这类失败。核心是**把每个漏洞都明确堵死**：

- 别只说"先写测试再写代码，违反就删掉重来"，要把绕法逐条禁掉："不许留作参考、不许边测边改、不许偷看一眼——删掉就是删掉。"
- 早早立一条元原则：**"违反规则的字面，就是违反规则的精神。"** 这一句能掐掉整整一类"我这是遵循精神"的借口。
- 建**借口对照表**：基线测试里代理说过的每句借口都记下来，逐条写现实回应（"太简单不用测"→"简单的代码也会坏，测试只要 30 秒"）。
- 建**红线清单**：让代理能自我检查——"代码写在测试前面"、"我手动测过了"、"这次不一样，因为……"，出现任何一条就停下重来。

## 红-绿-重构：完整流程

**红：先写失败的测试（基线）**。在没有技能的情况下跑压力场景，记录代理的真实行为：它做了什么选择？用了哪些借口（逐字）？哪种压力触发了违规？

**绿：写最小技能**。只针对基线里发现的具体违规写，不为假想情况加料。然后用同一批场景跑**有**技能的版本，验证代理现在遵守了。

**重构：堵漏洞**。代理找到新借口？加明确的反制。重测，直到打不穿为止。

**先微测措辞，再跑全场景**：全量压力场景又慢又贵。先用单次调用微测措辞本身——每次 1 个新鲜上下文、系统提示用真实环境、用户消息用"诱使犯错"的任务；**必须带无指导的对照组**（对照组都不犯错，说明没东西可修，直接停）；每种措辞 ≥5 次重复；每次命中的样本都要人工读一遍（模板回声和引用反例会伪装成命中）。

## 按类型测试

- **纪律型**（规则/要求，如 TDD）：学术题（懂不懂规则）+ 压力场景（扛不扛得住）+ 多重压力叠加（时间 + 沉没成本 + 疲劳）。成功标准：最大压力下仍遵守。
- **方法型**（how-to）：应用场景（会不会用）+ 变体场景（边缘情况）+ 信息缺失测试（说明有没有缺口）。成功标准：能用到新场景上。
- **思维模型型**：识别场景（认不认得出何时适用）+ 反例（知不知道何时不该用）。
- **参考型**：检索场景（找不找得到）+ 应用场景（找对了会不会用）+ 缺口测试。

## 常见"跳过测试"的借口

| 借口 | 现实 |
|---|---|
| "技能写得已经很清楚了" | 对你清楚 ≠ 对别的代理清楚。测。 |
| "只是个参考文档" | 参考文档也会有缺口和含糊处。测检索。 |
| "测试是过度工程" | 没测过的技能一定有毛病。15 分钟测试省几小时。 |
| "有问题再测" | "有问题"= 代理已经用不上了。发布前测。 |
| "我很有信心" | 过度自信保证出问题。照样测。 |

## 反模式

- ❌ **叙事体例子**："2025-10-03 那次，我们发现……"——太具体，不可复用。
- ❌ **多语言稀释**：同一例子写 JS/Python/Go 三版——质量平庸、维护负担。
- ❌ **流程图里写代码**：不能复制粘贴，难读。
- ❌ **无意义标签**：step1、helper2——标签要有语义。

## 铁律

```
没有先失败的测试，就不许写技能。
```

新技能和改技能都一样。没测试就写？删掉重来。没测试就改？同样违规。**没有例外**：不是"小补充"、不是"就加一节"、不是"文档更新"。

## 部署前检查清单

红阶段：3+ 压力场景（纪律型要叠加压力）→ 无技能跑基线并逐字记录 → 找借口模式。绿阶段：命名合规、frontmatter 完整、description 纯触发条件第三人称、关键词覆盖、文体匹配失败类型、措辞微测过、一个好例子、有技能跑场景验证合规。重构阶段：新借口加反制、建借口表和红线清单、重测到打不穿。质量：流程图只在决策不明显时用、有快速参考表、有常见错误节、无叙事、 supporting 文件只放工具或重型参考。**一次只部署一个技能**：不许批量写多个技能再一起测，当前这个没验证完不许动下一个。

---

## English Version

Adapted from obra/superpowers (MIT License) by Jesse Vincent.

### When to use

Use this when you want to turn a proven technique, workflow, or tool into a reusable AI skill document (SKILL.md) — creating a new skill, editing an existing one, or verifying a skill actually works before deploying it. Do NOT use it for one-off write-ups, narrative post-mortems, well-documented standard practices, project-specific conventions (those belong in project instructions), or mechanical constraints that can be automated with regex/validation (automate those; reserve documentation for judgment calls).

### Core idea

**Writing skills IS Test-Driven Development applied to process documentation.** Write test cases first (pressure scenarios run with subagents), watch them fail (baseline behavior without the skill), write the skill (the document), watch the tests pass (agents comply), then refactor (close newly found loopholes). Core principle: **if you didn't watch an agent fail without the skill, you don't know what the skill needs to teach.**

### What a skill is

A skill is a reference guide for proven techniques, patterns, or tools — not a narrative about how you solved one problem. Reusable: yes. Storytelling: no.

### TDD mapping

Test case → pressure scenario with a subagent. Production code → the SKILL.md document. RED → the agent violates the rule without the skill (baseline). GREEN → the agent complies with the skill present. Refactor → close loopholes while keeping compliance. Always run the baseline scenario BEFORE writing the skill, document the agent's exact rationalizations verbatim, write the minimal skill addressing those specific violations, then verify compliance and iterate.

### Skill types

**Technique** (concrete steps), **Pattern** (a way of thinking), **Reference** (API docs, syntax). Test each type differently: discipline skills with academic questions plus pressure scenarios (success = compliance under maximum pressure); technique skills with application and edge-case scenarios; pattern skills with recognition and counter-examples; reference skills with retrieval and gap testing.

### SKILL.md structure

Frontmatter requires `name` (letters, numbers, hyphens only) and `description` (max 1024 chars total). The description must be third-person, start with "Use when…", describe ONLY triggering conditions — never summarize the workflow. Why: testing showed that when a description summarized the process, agents followed the description instead of reading the skill (one agent did a single review where the flowchart required two). Keep it under 500 characters; use concrete symptoms, not language-specific details unless the skill is technology-specific.

### Skill Discovery Optimization (SDO)

Cover keywords agents would search for (error messages, symptom words like "flaky"/"hanging", synonyms, real tool names). Name skills verb-first (`creating-skills`, not `skill-creation`). Be token-efficient: getting-started workflows under ~150 words, frequently loaded skills under ~200 words, others under ~500 — move flag details to `--help`, cross-reference instead of repeating, compress examples to one excellent single-language example. Reference other skills by name with explicit markers (`**REQUIRED SUB-SKILL:** …`); never use `@` links, which force-load files and burn context.

### Match the form to the failure

Classify the baseline failure before writing guidance — the form that bulletproofs one failure type backfires on another. Rule-skipping under pressure → prohibitions + rationalization tables + red flags. Wrong-shaped output → a positive recipe stating what the output IS, in order. Missing required elements → structural REQUIRED fields in the template. Conditional behavior → conditionals keyed to observable predicates. No nuance clauses ("don't X unless…") — they reopen negotiation; express real exceptions as separate conditionals.

### Bulletproofing discipline skills

Close every loophole explicitly ("Delete it. Start over. No exceptions: don't keep it as reference, don't adapt it while testing, don't look at it — delete means delete"). Add the meta-principle early: **violating the letter of the rules is violating the spirit of the rules.** Build a rationalization table from verbatim baseline excuses, each paired with reality. Create a red-flags checklist so agents can catch themselves rationalizing.

### RED-GREEN-REFACTOR process

**RED:** run pressure scenarios WITHOUT the skill; document choices, verbatim rationalizations, and which pressures triggered violations. **GREEN:** write the minimal skill addressing those specific failures; re-run scenarios WITH the skill and verify compliance. **REFACTOR:** add explicit counters for new rationalizations; re-test until bulletproof. Micro-test wording before full scenarios: one fresh context per sample, realistic system prompt, a tempting task, always include a no-guidance control (if the control doesn't fail, stop), 5+ reps per variant, and manually read every flagged match.

### Anti-patterns

Narrative examples ("in session X we found…"), multi-language dilution, code inside flowcharts, meaningless labels (step1, helper2). One excellent runnable example beats many mediocre ones.

### The iron law

```
NO SKILL WITHOUT A FAILING TEST FIRST.
```

Applies to new skills AND edits. Wrote the skill before testing? Delete it and start over. Edited without testing? Same violation. No exceptions — not for "simple additions", not for "documentation updates".

### Deployment checklist

RED: 3+ pressure scenarios (combined pressures for discipline skills) → baseline run with verbatim documentation → identify rationalization patterns. GREEN: compliant name, complete frontmatter, trigger-only third-person description, keyword coverage, form matched to failure type, wording micro-tested, one excellent example, verified compliance with the skill. REFACTOR: new rationalizations countered, rationalization table and red-flags list built, re-tested until bulletproof. Quality: flowcharts only for non-obvious decisions, quick-reference table, common-mistakes section, no storytelling, supporting files only for tools or heavy reference. **Deploy one skill at a time** — never batch multiple skills without testing each; never move on before the current one is verified.
