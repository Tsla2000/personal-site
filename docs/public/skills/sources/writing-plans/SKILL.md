---
name: 写计划
description: >-
  手里已经有一份需求或规格说明、要做多步骤任务、在动手写代码之前使用。把规格拆成一个没见过代码库的工程师也能一步步执行的实现计划时触发；一两步就能做完的小事不适用。
---

# 写计划（Writing Plans）

改编自 obra/superpowers（MIT License），原作者 Jesse Vincent

## 触发条件

- 手里有一份 spec 或需求文档，任务要分多步做，**还没碰代码** → 用这个技能先写实现计划。
- 需要把"要做什么"拆成"一步一步怎么做"，交给别人（或未来的你/子代理）执行 → 用这个技能。
- **不适用**：一两步就能做完的小事；需求本身还不清楚（先用"头脑风暴"把需求聊清楚，出了书面设计再来写计划）。

## 概述

给**一个没见过这个代码库、也没见过这份 spec 的工程师**写实现计划。假设他懂这门语言、知道怎么写地道的代码——只要你告诉他精确的接口和精确的测试，他就能写出来；计划里没写死的地方，他会做合理的选择。

**他不知道、必须由你写进计划的**：改哪些文件、用什么名字和签名、spec 里定的哪些值、每个任务靠哪个测试证明。把整个计划拆成一口一口的任务。DRY、YAGNI、TDD、频繁提交。

**开始时先声明**："我正在用写计划（writing-plans）技能创建实现计划。"

**计划存哪**：`docs/superpowers/plans/YYYY-MM-DD-<功能名>.md`（用户有自己的存放偏好就听用户的）。

## 范围检查

如果 spec 覆盖了多个独立子系统，正常应该在头脑风暴阶段就拆成多个子 spec。如果没拆，现在提议拆：**一个子系统一份计划**，每份计划自己就能产出可工作、可测试的软件。

## 先定文件结构，再拆任务

在定义任务之前，先画出**哪些文件会被创建或修改、每个文件负责什么**。分解的决策在这里锁定：

- 按清晰的边界和接口设计单元，每个文件一个明确职责。
- 你一次能装进脑子的代码量是有限的，文件越聚焦，你的修改越可靠。小而专的文件优于什么都干的大文件。
- 一起改的文件放一起。按职责拆，不按技术分层拆。
- 在已有代码库里，沿用既有模式。如果库里本来就是大文件风格，不要单方面重构——但如果你要改的那个文件已经臃肿到难以下手，计划里包含一次拆分是合理的。

文件结构定下来，任务分解就有了依据：**每个任务产出的改动要自成一体、能独立讲清楚**。

## 任务要多大

任务是"自带完整测试循环、值得一次独立评审"的最小单位。划边界时：搭建、配置、脚手架、文档这些步骤，折进需要它们的那个任务里；只在"评审人可能想拒绝 A 但通过 B"的地方才拆开。**每个任务结束时都有一个可独立测试的交付物。**

## 步骤粒度

**每个步骤 = 一个动作 + 一个可检查的结果**：

- "写出失败的测试"——一个步骤
- "跑一遍，确认它失败"——一个步骤
- "写最少代码让测试通过"——一个步骤
- "跑测试，确认全过"——一个步骤
- "提交"——一个步骤

## 计划文档头（每份计划必须以这个开头）

```markdown
# [功能名] 实现计划

> **给 Agent 执行者**：REQUIRED SUB-SKILL：用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，按任务逐个实现本计划。步骤用 checkbox（`- [ ]`）语法跟踪。

**目标**：[一句话：这次建什么]

**架构**：[2-3 句：用什么思路]

**技术栈**：[关键技术/库]

**Spec**：[这份计划实现的设计文档路径——计划是依据 spec 论证的，spec 要跟计划一起走，执行者两个都读]

## 全局约束

[spec 里的项目级要求——版本下限、依赖限制、命名和文案规则、平台要求——每条一行，数值从 spec 逐字抄。每个任务的要求都默认包含这一节。]

## 评审焦点

[spec 暗示了、但没有任何任务的测试会覆盖的五类输入或失败模式——最可能咬到真实用户的优先。每行写：输入/条件 + 一个正常人会期待的行为。spec 是愿景文档：它说软件必须做什么，没说软件会遇到什么；它的沉默不等于允许程序在那种输入下崩掉。先对着 spec 写好这份清单，一次写完。然后给每一行，在归属它的任务里加上钉住它的测试，用那个任务自己的步骤风格写。]

---
```

## 任务结构

````markdown
### 任务 N：[组件名]

**文件：**
- 新建：`exact/path/to/file.py`
- 修改：`exact/path/to/existing.py:123-145`
- 测试：`tests/exact/path/to/test.py`

**接口：**
- 消费：[这个任务用到的、来自前面任务的东西——精确签名]
- 产出：[后面任务依赖的东西——精确的函数名、参数和返回类型。任务的执行者只能看到自己的任务，这一块是他知道相邻任务用了什么名字和类型的唯一途径。]

- [ ] **步骤 1：写出失败的测试**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **步骤 2：跑测试，确认失败**

运行：`pytest tests/path/test.py::test_name -v`
预期：FAIL，"function not defined"

- [ ] **步骤 3：在 `exact/path/to/file.py` 实现 `function(input: InputType) -> ResultType`**

签名和测试定不下来的选择，用一句话说思路（调哪个库、用哪个数据结构）；只有签名和测试都定不下来的算法，才贴代码块。

- [ ] **步骤 4：跑测试，确认通过**

运行：`pytest tests/path/test.py::test_name -v`
预期：PASS

- [ ] **步骤 5：提交**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## 一个步骤里装什么

**标准：执行者看完这一步，能写出"唯一合理"的东西。** 这就是全部要求：无歧义，不求完备。每种步骤只装让它无歧义的东西，多余的一概不装：

- **测试步骤**：测试名 + 断言（贴代码），断言里的值用 spec 的原值。
- **代码步骤**：精确签名（名、参数、返回类型）+ 所在文件 + spec 钉死的取值。函数体由执行者写。只有"签名和测试都定不下来的算法"或"spec 逐字定的文案"才出现正文。
- **验证步骤**：运行哪条命令 + 什么样的输出算过。
- **引用别的任务**：那个任务的"接口"块说了用什么，计划里不重复贴它的代码。

**计划是"执行者自己做不了的那些决定"的集合。** 计划比它描述的代码还长，说明你把代码写了两遍。反过来，"TBD"、"处理边界情况"、"加适当的校验"、"给上面写测试"、某个任务没定义的函数/类型——这些一行决定都没做的句子是另一种失败，自查时两边都要抓。

## 自查（写完计划自己跑一遍，不是派子代理）

**1. Spec 覆盖**：把 spec 每节/每条需求过一遍，每条都能指到一个实现它的任务吗？列出缺口。

**2. 步骤扫描**：每个步骤都要让执行者写出唯一合理的东西，且不多装：没做决定的行是缺口，签名和测试已定还能推导出的函数体是复述。两边都修。

**3. 类型一致**：后面任务里用的类型、方法签名、属性名，跟前面任务定义的一致吗？任务 3 里叫 `clearLayers()`、任务 7 里写成 `clearFullLayers()` 就是 bug。

**4. 评审焦点**：spec 暗示的每类输入/失败模式，都有任务的测试覆盖吗？最可能咬人的五条进"评审焦点"节，每行在归属任务里加上测试。空章节的意思是"你检查过，确实没有"，不是"你跳过了"。

**5. 篇幅比例**：计划跟 spec 比一比。计划比 spec 长几倍，说明写的是程序的复述，不是计划。如果代码块占了文档大头，把函数体换成签名、测试名和断言，再检查每步是否仍然无歧义。

发现问题就地修，不用重新自查。发现 spec 有需求没任务，加任务。

## 执行交接

计划存好、自查完，把链接发给你的搭档读。如果他**已经**明确给过执行方式：请他审计划、确认计划符合他的想法；等他确认后再实现，用他指定的方式。如果**没给**：

**"计划已完成，存在 `docs/superpowers/plans/<文件名>.md`。请审阅。这份计划是否符合你的想法？你希望用哪种执行方式？**

- **子代理驱动**：每个任务由 fresh 子代理实现、fresh 评审人检查通过后再做下一个，最后再做一次全分支评审。最彻底；每个任务和每次评审都烧一个 fresh 上下文。
- **本机直做**：我在这个会话里自己实现所有任务，最后找一个最强的 fresh 评审人审全分支。最便宜最快；结尾才有独立评审。用中等模型跑会话也行，因为设计都在计划里了。

**这份计划我推荐<二选一>，因为<从计划里找一句话：任务之间接口依赖多深、任务有多少、带着 bug 上线代价多大>。计划符合你的想法吗，用哪种方式执行？"**

**如果选了子代理驱动**：**REQUIRED SUB-SKILL**：用 superpowers:subagent-driven-development。**如果选了本机直做**：**REQUIRED SUB-SKILL**：用 superpowers:executing-plans。

---

## English Version

Adapted from obra/superpowers (MIT License) by Jesse Vincent.

### When to use

Use when you have a spec or requirements for a multi-step task, before touching code — to turn the spec into an implementation plan an engineer unfamiliar with the codebase can execute step by step. Not for one- or two-step tasks, and not when requirements are still unclear (brainstorm first; write the plan after the design document exists).

### Overview

Write implementation plans for an engineer who has not seen this codebase or this spec. Assume they write idiomatic code in the project's language once they know the exact interface and the exact test, and that they will make a reasonable choice wherever the plan leaves one open. What they cannot know is what you decided: which files, which names and signatures, which values from the spec, which tests prove each task. Document those. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Announce at start: "I'm using the writing-plans skill to create the implementation plan." Save plans to `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md` (user preferences for location override).

### Scope check

If the spec covers multiple independent subsystems, it should have been split into sub-project specs during brainstorming. If it wasn't, propose splitting — one plan per subsystem, each producing working, testable software on its own.

### File structure first

Before defining tasks, map which files will be created or modified and what each owns — decomposition decisions get locked here. Design units with clear boundaries and one responsibility per file; prefer small focused files; files that change together live together; split by responsibility, not technical layer. In existing codebases follow established patterns (don't unilaterally restructure large-file codebases, though splitting an unwieldy file you're modifying is reasonable in-plan). Each task should produce self-contained, independently explainable changes.

### Task right-sizing

A task is the smallest unit carrying its own test cycle and worth a fresh reviewer's gate. Fold setup, configuration, scaffolding, and docs into the task whose deliverable needs them; split only where a reviewer could meaningfully reject one task while approving its neighbor. Each task ends with an independently testable deliverable.

### Step granularity

Each step is one action with a checkable result: "write the failing test" — step; "run it to confirm it fails" — step; "implement the minimal code" — step; "run tests, confirm pass" — step; "commit" — step.

### Plan document header

Every plan MUST start with: title; a note to agentic workers naming the REQUIRED SUB-SKILL (subagent-driven-development recommended, or executing-plans) with checkbox step syntax; **Goal** (one sentence); **Architecture** (2–3 sentences); **Tech Stack**; **Spec** (path to the design doc — the plan argues from the spec, so the spec travels with it); **Global Constraints** (project-wide requirements, exact values copied verbatim, one line each — implicitly included in every task); **Review Focus** (the five input classes or failure modes the spec implies but no task's tests exercise, most dangerous first — one line each naming the input/condition and expected behavior; the spec's silence on an input is not permission for it to break the program; each line gets its test added to the owning task).

### Task structure

Each task: component name; **Files** (create/modify with exact paths and line ranges/test paths); **Interfaces** (Consumes: exact signatures from earlier tasks; Produces: exact function names, parameter and return types later tasks rely on — the implementer sees only their own task); then checkbox steps: (1) write the failing test (name + assertions as code, spec's exact values); (2) run it, confirm FAIL with expected output; (3) implement the exact signature in the exact file (one line on approach where signature+test leave a choice; a code block only for an algorithm they don't determine); (4) run tests, confirm PASS; (5) commit.

### What a step contains

A step is done when the implementer can write exactly one reasonable thing from it — unambiguous, not complete. Test steps carry name + assertions; code steps carry exact signature + file + spec-pinned values (the implementer writes the body; bodies appear only for underdetermined algorithms or spec-fixed copy); verification steps carry the command + passing output; references to other tasks use that task's Interfaces block, never repeated code. A plan is the set of decisions the implementer cannot make alone. A plan longer than the code it describes has written the code twice; lines that decide nothing ("TBD", "handle edge cases", "add appropriate validation") are the opposite failure — the self-review catches both.

### Self-review

Run it yourself after writing the plan (not a subagent dispatch): (1) **Spec coverage** — every requirement maps to a task; list gaps. (2) **Step scan** — every step yields exactly one reasonable implementation, no more, no less. (3) **Type consistency** — names/signatures in later tasks match earlier definitions. (4) **Review Focus** — every implied input class has test coverage in its owning task; an empty section means you checked and found none. (5) **Proportion** — a plan several times longer than its spec is a transcript, not a plan; replace bodies with signatures, test names, and assertions. Fix issues inline; add tasks for uncovered requirements.

### Execution handoff

Save, self-review, then link the plan for your partner to read. If they already supplied an execution method, ask them to review and confirm it captures what they want, wait for confirmation, then use the preserved method. Otherwise ask them to review and choose: **Subagent-driven** — a fresh subagent per task, fresh reviewer before the next, whole-branch review at the end (most thorough; costs a fresh context per task and review); or **Native** — implement everything in-session, one fresh reviewer on the most capable model checks the whole branch at the end (cheapest and fastest). Recommend one of the two with one sentence from the plan (interface coupling between tasks, task count, cost of a shipped mistake), and ask: "Does the plan capture what you want, and which approach should we use?" Subagent-driven → REQUIRED SUB-SKILL superpowers:subagent-driven-development; Native → superpowers:executing-plans.
