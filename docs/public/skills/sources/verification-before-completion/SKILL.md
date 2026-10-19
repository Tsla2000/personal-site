---
name: 交付前验证
description: >-
  在声称工作完成、修好、测试通过之前使用；提交代码、发 PR、宣布任务结束、进入下一项任务之前触发。要求先运行验证命令、看到真实输出，才能下任何"成功"类结论；先有证据，再下断言。
---

# 交付前验证（Verification Before Completion）

改编自 obra/superpowers（MIT License），原作者 Jesse Vincent

## 触发条件

- 你正准备说"做完了"、"修好了"、"测试过了"——任何成功/完成类的表述之前 → 用这个技能。
- 提交代码、创建 PR、标记任务完成、进入下一个任务、把工作交给别人之前 → 用这个技能。
- **规则覆盖**：原话、换说法、同义词、暗示成功——任何让人觉得"成了"的表达都算。包括对自己说"太好了"、"搞定"这类满意情绪。

## 核心思想

**先有证据，再下断言。永远。**

**违反这条规则的字面，就是违反它的精神。**

## 铁律

```
没有新鲜的验证证据，就不许声称完成。
```

这个消息里没跑过验证命令，就不能说它过了。"新鲜"指：就是为了这次断言、刚刚跑的那一次。

## 门禁流程（每次断言前走一遍）

```
在声称任何状态、表达任何满意之前：

1. 定位：哪条命令能证明这个断言？
2. 运行：把完整命令跑一遍（新鲜的、完整的）
3. 读：读完整输出，看退出码，数失败数
4. 验证：输出真的支持这个断言吗？
   - 不支持：按证据如实说当前状态
   - 支持：带着证据说出断言
5. 只有走完这五步，才能下断言

跳过任何一步 = 在撒谎，不是在验证
```

## 常见断言 vs 真正需要的证据

| 你想说 | 需要这个证据 | 这些不算数 |
|---|---|---|
| 测试通过了 | 测试命令输出：0 失败 | 上次跑过、"应该能过" |
| Lint 干净 | Linter 输出：0 错误 | 只查了一部分、推测 |
| 构建成功 | 构建命令退出码 0 | Lint 过了、日志"看起来"没问题 |
| Bug 修好了 | 跑原始复现步骤：通过 | 代码改了、想当然修好了 |
| 回归测试有效 | 红-绿循环走完并验证 | 测试只跑通过一次 |
| 代理干完了 | VCS diff 里能看到改动 | 代理自己说"成功了" |
| 需求都满足了 | 逐行对照清单逐项验证 | 测试过了（测试过 ≠ 需求全满足） |

## 红线：出现就停下

- 用"应该"、"大概"、"看起来"这类词
- 验证之前先表达满意（"太好了！"、"完美！"、"搞定！"）
- 没验证就准备提交/推送/PR
- 相信代理的成功汇报
- 靠部分验证下结论
- "就这一次"、"我累了想收工"
- **任何**没跑过验证就暗示成功的措辞

## 借口对照表

| 借口 | 现实 |
|---|---|
| "现在应该行了" | 去跑验证 |
| "我很有信心" | 信心 ≠ 证据 |
| "就这一次" | 没有例外 |
| "Lint 过了" | Lint ≠ 编译器 |
| "代理说成功了" | 独立验证 |
| "我累了" | 累不是理由 |
| "部分检查够了" | 部分检查证明不了任何事 |
| "我换了个说法，规则管不着" | 精神重于字面 |

## 关键模式（照着做）

**测试：**
```
✅ [跑测试命令] [看到：34/34 通过] "所有测试通过"
❌ "现在应该能过了" / "看着没问题"
```

**回归测试（TDD 红-绿）：**
```
✅ 写测试 → 跑（过）→ 回滚修复 → 跑（必须失败）→ 恢复 → 跑（过）
❌ "我写了回归测试"（没走红-绿验证就等于没写）
```

**构建：**
```
✅ [跑构建] [看到：退出码 0] "构建通过"
❌ "Lint 过了"（Lint 不检查编译）
```

**需求：**
```
✅ 重读计划 → 建检查清单 → 逐项验证 → 有缺口就报缺口
❌ "测试过了，这一阶段完成"
```

**交给代理做的事：**
```
✅ 代理说成功 → 查 VCS diff → 独立验证改动 → 按实际状态汇报
❌ 相信代理的汇报
```

## 什么时候用

**永远在以下动作之前**：任何成功/完成表述、任何满意情绪、任何对工作状态的正面评价、提交、PR、任务完成、进入下一项任务、把工作派给代理。

**规则管到**：原话、意译和同义词、暗示成功、**任何**让人觉得完成/正确的沟通。

---

## English Version

Adapted from obra/superpowers (MIT License) by Jesse Vincent.

### When to use

Use when about to claim work is complete, fixed, or passing — before committing, creating PRs, marking tasks done, or moving to the next task. It applies to exact phrases, paraphrases, synonyms, and implications of success — including expressing satisfaction ("Great!", "Done!") before verification.

### Core principle

**Evidence before claims, always.** Violating the letter of this rule is violating the spirit of this rule.

### The iron law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.
```

If you haven't run the verification command in this message, you cannot claim it passes. "Fresh" means: run just now, for this specific claim.

### The gate function

Before claiming any status or expressing satisfaction: (1) IDENTIFY — what command proves this claim? (2) RUN — execute the FULL command, fresh and complete. (3) READ — full output, check exit code, count failures. (4) VERIFY — does the output confirm the claim? If no, state the actual status with evidence; if yes, state the claim WITH evidence. (5) ONLY THEN make the claim. Skipping any step is lying, not verifying.

### Common failures

"Tests pass" requires test output with 0 failures — not a previous run, not "should pass". "Linter clean" requires 0 errors — not a partial check. "Build succeeds" requires exit 0 — linter passing doesn't prove compilation. "Bug fixed" requires the original symptom reproduction to pass — not just changed code. "Regression test works" requires a verified red-green cycle — not a single passing run. "Agent completed" requires visible VCS diffs — never the agent's own "success" report. "Requirements met" requires a line-by-line checklist — tests passing is not the same thing.

### Red flags — STOP

Using "should", "probably", "seems to"; expressing satisfaction before verification; about to commit/push/PR without verification; trusting agent success reports; relying on partial verification; "just this once"; being tired and wanting the work over; ANY wording implying success without having run verification.

### Rationalization prevention

"Should work now" → RUN the verification. "I'm confident" → confidence ≠ evidence. "Just this once" → no exceptions. "Linter passed" → linter ≠ compiler. "Agent said success" → verify independently. "I'm tired" → exhaustion ≠ excuse. "Partial check is enough" → partial proves nothing. "Different words so the rule doesn't apply" → spirit over letter.

### Key patterns

Tests: ✅ run the command, see "34/34 pass", then say "All tests pass" — never "should pass now". Regression tests: ✅ write → run (pass) → revert fix → run (MUST FAIL) → restore → run (pass); ❌ "I've written a regression test" without the red-green cycle. Build: ✅ run it, see exit 0; ❌ "linter passed". Requirements: ✅ re-read the plan, build a checklist, verify each item, report gaps. Agent delegation: ✅ agent reports success → check the VCS diff → verify independently → report the actual state.

### When to apply

ALWAYS before: any success/completion claim, any expression of satisfaction, any positive statement about work state, committing, PR creation, task completion, moving to the next task, delegating to agents. The rule covers exact phrases, paraphrases, synonyms, implications of success — ANY communication suggesting completion or correctness.
