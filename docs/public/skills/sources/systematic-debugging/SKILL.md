---
name: 系统化排查
description: >-
  遇到任何 bug、测试失败、构建失败或意外行为时，在动手修之前使用。尤其适用于时间紧、"就改一行试试"很诱人、已经试过几次都没修好、或上一版修复无效的场景。核心是先找到根因再修，修症状不算修好。
---

# 系统化排查（Systematic Debugging）

改编自 obra/superpowers（MIT License），原作者 Jesse Vincent

## 触发条件

任何技术问题都适用：测试失败、线上 bug、行为异常、性能问题、构建失败、联调问题。

**尤其要用**（这些时候最想跳过流程，但也最不能跳过）：

- 时间紧、线上着火——紧急情况最容易让人靠猜
- "就改一行试试"看起来很明显
- 已经试过好几次修复都没好
- 上一版修复没生效
- 你还没完全理解这个问题

**不要跳过**：问题看起来很简单（简单 bug 也有根因）；你在赶时间（赶时间瞎试保证返工）；有人催你立刻修好（系统化比乱试更快）。

## 核心思想

**永远先找到根因，再动手修。修症状不算修好，是失败。**

**违反这套流程的字面，就是违反排查的精神。**

## 铁律

```
没有先做根因调查，就不许提修复方案。
```

第一阶段没做完，就不能谈修。

## 四个阶段（必须按顺序走完）

### 第一阶段：根因调查

**动手修之前，必须先做完这五件事：**

**1. 认真读报错**。不要跳过 error 和 warning——答案经常就写在里面。堆栈从头读到尾，记下行号、文件路径、错误码。

**2. 稳定复现**。你能可靠地触发它吗？精确步骤是什么？每次都出现吗？如果复现不了，先去收集更多数据，不要靠猜。

**3. 查最近的改动**。什么改动可能引入了这个问题？看 git diff、最近提交、新依赖、配置变更、环境差异。

**4. 多组件系统：先加诊断，再下结论**。当链路穿过多个组件（CI→构建→签名，API→服务→数据库），在提修复之前，**给每个组件边界加诊断日志**：

```
对每个组件边界：
  - 进组件的数据是什么，记下来
  - 出组件的数据是什么，记下来
  - 环境变量/配置有没有透传过去，验证
  - 每一层的状态都检查

跑一次，把"断在哪一层"的证据拿到手，
再分析证据定位坏掉的组件，
再去深挖那个组件。
```

一次运行就能告诉你：是哪一层断了（比如密钥→流水线通了，流水线→构建脚本断了）。

**5. 追踪数据流**。当错误藏在很深的调用栈里，从坏值出发一路往上问：这个坏值从哪来？谁传进来的？一直追到源头。**在源头修，不在症状处修。**

### 第二阶段：模式分析

动手之前先找规律：

1. **找能跑的例子**：同一个代码库里，有没有跟坏掉的很像、但能跑的代码？
2. **把参考实现完整读一遍**：如果是在套用某个模式，把参考实现**逐行读完**，不要扫一眼。一知半解地套模式，保证出 bug。
3. **列出所有差异**：能跑的和坏掉的，到底哪里不一样？每一条差异都列出来，再小也别放过。不要假设"这点差别不可能有影响"。
4. **理解依赖**：这块代码依赖什么？需要哪些配置、环境？它做了哪些假设？

### 第三阶段：假设与验证

走科学方法：

1. **一次只提一个假设**。说清楚、写下来："我认为根因是 X，因为 Y。"要具体，不要含糊。
2. **最小化测试**。做**最小**的改动来验证假设。一次只动一个变量。不要一次修好几个地方。
3. **验证了再往下走**。好了 → 进第四阶段。没好 → 提**新**的假设。**不许在没验证的修复上继续叠修复。**
4. **不知道就说不知道**。"X 这块我没理解"——说出来，不要装懂。去求助，去查资料。

### 第四阶段：实现修复

**修根因，不修症状：**

1. **先写出失败的测试用例**。最简单的复现：能自动化就写自动化测试，没有测试框架就写一次性脚本。**修之前必须有**。
2. **一次只做一处修复**。针对已确认的根因，一次改一处。不许"顺手"优化，不许打包重构。
3. **验证修复**：测试现在过了？别的测试没坏？问题真的解决了？
4. **修不好就停**。数一下：这是第几次修复尝试？
   - < 3 次：带着新信息回到第一阶段，重新分析。
   - **≥ 3 次：停下来，质疑架构（见下），不许直接试第 4 次。**

**5. 三次都失败：质疑架构**。出现这种模式就是架构问题，不是假设问题：

- 每次修复都在不同地方挖出新的共享状态/耦合/问题
- 修复需要"大规模重构"才能落地
- 每次修复都在别处造出新症状

停下来问根本问题：这个模式本身成立吗？我们是不是靠惯性在坚持？是该重构架构，还是继续修症状？**先跟你的搭档讨论，再决定要不要有第 4 次尝试。** 这不是"假设错了"，这是"架构错了"。

## 红线：出现这些念头就停下，回到第一阶段

- "先快速修一下，根因以后再查"
- "改一下 X 看看行不行"
- "多改几处一起跑测试"
- "测试先跳过，我手动验证"
- "大概是 X，我修一下"
- "没完全理解，但这个也许管用"
- "模式是这么说的，但我改一改用"
- 还没追踪数据流就开始列修复方案
- **"再试一次"**（已经试过 2+ 次了）
- 每次修复都在不同地方挖出新问题

**以上任何一条的意思都是：停。回第一阶段。3+ 次失败就去质疑架构。**

## 搭档在暗示"你错了"的信号

- "这个难道没发生吗？"——你没验证就假设了
- "能不能让我们看到……"——你本该加证据收集
- "别猜了"——你在没理解的情况下提修复
- "再深想一层"——去质疑根本，不要只修症状
- "我们卡住了？"（不耐烦）——你的路子不对

看到这些：停，回第一阶段。

## 常见借口对照表

| 借口 | 现实 |
|---|---|
| "问题很简单，不用走流程" | 简单问题也有根因。流程对小 bug 很快。 |
| "紧急，没时间走流程" | 系统化排查**比**瞎试更快。 |
| "先试一下，再调查" | 第一次修复会定调子。一开始就做对。 |
| "确认修好了再补测试" | 没测试的修复立不住。先有失败测试才能证明。 |
| "一次多修几处省时间" | 分不清哪处起的作用，还会引入新 bug。 |
| "参考太长，我改一改套用" | 一知半解保证出 bug。完整读完。 |
| "我看到问题了，直接修" | 看到症状 ≠ 理解根因。 |
| "再试一次"（2+ 次失败后） | 3+ 次失败 = 架构问题。质疑模式，别再修了。 |

## 快速参考

| 阶段 | 关键动作 | 完成标准 |
|---|---|---|
| **1. 根因** | 读报错、稳定复现、查改动、收证据、追数据流 | 知道"是什么"和"为什么" |
| **2. 模式** | 找能跑的例子、完整读参考、列差异 | 定位差异点 |
| **3. 假设** | 提单一假设、最小化测试 | 假设被证实或换新假设 |
| **4. 实现** | 先写失败测试、单点修复、验证 | bug 解决、测试全过 |

## 查到最后发现"没有根因"怎么办

如果系统化调查走完，确认问题真是环境性的、时序相关的或外部的：流程你走完了，把调查过程记下来，做合适的兜底（重试、超时、报错信息），加上监控和日志方便下次查。**但**：95% 的"没有根因"其实是调查没做完。

---

## English Version

Adapted from obra/superpowers (MIT License) by Jesse Vincent.

### When to use

Use for ANY technical issue — test failures, production bugs, unexpected behavior, performance problems, build failures, integration issues — BEFORE proposing fixes. Use it ESPECIALLY when: you're under time pressure, "just one quick fix" looks obvious, you've already tried multiple fixes, the previous fix didn't work, or you don't fully understand the issue. Never skip it because the issue "looks simple", you're in a hurry, or someone wants it fixed NOW — systematic debugging is faster than thrashing.

### Core principle

**ALWAYS find the root cause before attempting fixes. Symptom fixes are failure.** Violating the letter of this process is violating the spirit of debugging.

### The iron law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.
```

If you haven't completed Phase 1, you cannot propose fixes.

### The four phases

**Phase 1 — Root cause investigation (before ANY fix):** (1) Read error messages carefully — don't skip errors/warnings, read stack traces fully, note line numbers, paths, codes. (2) Reproduce consistently — exact steps, every time? If not reproducible, gather more data, don't guess. (3) Check recent changes — git diff, new dependencies, config changes, environment differences. (4) Multi-component systems: BEFORE proposing fixes, add diagnostic instrumentation at EACH component boundary — log what enters, log what exits, verify env/config propagation, check state at each layer. Run once to gather evidence of WHERE it breaks, then analyze, then dig into that component. (5) Trace data flow — when the error is deep in the stack, trace the bad value backward: where did it originate, who passed it in? Fix at the source, not the symptom.

**Phase 2 — Pattern analysis:** find working examples of similar code in the same codebase; read reference implementations COMPLETELY (don't skim); list every difference between working and broken, however small; understand dependencies, settings, and assumptions.

**Phase 3 — Hypothesis and testing:** form ONE specific hypothesis, written down ("I think X is the root cause because Y"); test with the SMALLEST possible change, one variable at a time; verify before continuing — if it worked go to Phase 4, if not form a NEW hypothesis, never stack fixes; if you don't know, say "I don't understand X", don't pretend.

**Phase 4 — Implementation:** create a failing test case FIRST (automated if possible, one-off script otherwise — mandatory before fixing); implement ONE fix addressing the root cause, no "while I'm here" improvements; verify (test passes, nothing else broke, issue truly resolved). If the fix doesn't work: STOP, count attempts — fewer than 3, return to Phase 1 with new information; **3 or more, STOP and question the architecture** (each fix reveals new coupling elsewhere, fixes need massive refactoring, each fix creates new symptoms). Discuss with your human partner before attempting more — this is a wrong architecture, not a failed hypothesis.

### Red flags — STOP and return to Phase 1

"Quick fix for now, investigate later", "just try changing X", "change several things and run tests", "skip the test, I'll verify manually", "it's probably X", "I don't fully understand but this might work", proposing solutions before tracing data flow, "one more fix attempt" after 2+ failures, each fix revealing a new problem in a different place. ALL mean: STOP, back to Phase 1; 3+ failures → question the architecture.

### Your partner's signals you're doing it wrong

"Is that not happening?" (you assumed without verifying), "Will it show us…?" (you should have gathered evidence), "Stop guessing" (fixes without understanding), "Ultra-think this" (question fundamentals), frustrated "We're stuck?" (your approach isn't working). When you hear these: STOP, back to Phase 1.

### Common rationalizations

"Too simple for process" → simple issues have root causes; the process is fast. "Emergency, no time" → systematic is FASTER than guess-and-check. "Try this first, then investigate" → the first fix sets the pattern; do it right from the start. "Test after confirming" → untested fixes don't stick. "Multiple fixes at once saves time" → can't isolate what worked, causes new bugs. "I see the problem" → seeing symptoms ≠ understanding root cause. "One more attempt" after 2+ failures → 3+ failures is architectural; question the pattern.

### Quick reference

Phase 1 Root Cause (read errors, reproduce, check changes, gather evidence) → understand WHAT and WHY. Phase 2 Pattern (working examples, full reference read) → identify differences. Phase 3 Hypothesis (one theory, minimal test) → confirmed or new hypothesis. Phase 4 Implementation (failing test first, single fix, verify) → bug resolved, tests pass.

### When the process reveals "no root cause"

If the issue is truly environmental, timing-dependent, or external: you've completed the process — document the investigation, implement appropriate handling (retry, timeout, error message), add monitoring/logging. But 95% of "no root cause" cases are incomplete investigation.
