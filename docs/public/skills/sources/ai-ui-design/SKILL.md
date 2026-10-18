---
name: AI界面设计规范
description: >-
  做聊天界面、AI
  产品前端、对话框、工具调用卡片、设计令牌或动效时使用（React/Tailwind），提供令牌结构、弹簧参数、中文输入法守卫、流式滚动、工具确认卡、安全沙箱与验收清单。
---
# AI 界面设计规范

适用：AI 聊天 / Agent 产品的前端界面，包括消息流、输入框、工具调用卡片、预览面板、设置弹层。默认技术栈为 React 18+、Tailwind、Framer Motion；其他栈只需照搬原则。

参考代码目录：`/home/box/agent-data/workflows/ai-2/references/`（下文写作 `references/`）。代码片段为 MIT 许可改编，复制时保留 `references/ATTRIBUTION.md` 与 `references/LICENSE-open-claude-ui.txt`。

## 0. 开工前

1. 向调用方确认品牌色：主色、hover、active、焦点环（40% 透明度）、品牌底上的文字色。未提供时用中性灰占位，并在交付时明确标注"品牌色待填"，**不得自行套用任何知名产品的品牌色**。
2. 从 `references/tokens.css` 复制令牌，填 `--brand-*` 占位值。
3. 所有颜色、圆角、间距、字号只能引用令牌；组件内禁止出现裸 HEX。

## 1. 设计令牌结构

**表面阶梯（Surface 0–3）**：靠相邻层 1%–3% 亮度差分层，而不是粗边框。
- `surface-0` 页面画布 → `surface-1` 侧栏/次级卡片 → `surface-2` 输入底盘/弹层 → `surface-3` hover/选中。
- 避免纯白 `#fff` 大面积和纯黑 `#000` 底（代码块除外），暗色模式同样四层。

**文字**：primary（正文）、secondary（时间戳、说明）、tertiary（仅占位符/禁用）。正文对比度 ≥ 4.5:1。

**边框**：发丝线 `border-subtle`（6%–8% 透明度）、`border-card`、`border-strong`。
- **单层描边原则**：外框已有边框时，内部按钮与 chip 不再加边框（用 `surface-3` 底色区分）。

**焦点环**：双环——内环与背景同色、外环用品牌色 40%：`box-shadow: 0 0 0 2px var(--surface-0), 0 0 0 4px var(--brand-ring)`。只在 `:focus-visible` 显示，不可直接删除 outline 而不替代。

**圆角语义**（不要按心情选）：pill 9999 / 输入框 20 / 消息气泡 18 / 对话框 16 / 代码块 12 / 卡片 10 / 按钮 8 / chip 6。

**间距**：4px 基准（4/8/12/16/20/24/32/48）。**字号**：12/13/15/17/20/24，正文行高 1.6。字体栈必须包含中文字体（PingFang SC / Microsoft YaHei）。所有动态数字（计时、token 数、行号）使用 `tabular-nums`。

**滚动边缘渐隐**：用多档非线性 mask（`.scroll-fade-y`），到顶/到底时对应边的渐隐归零。

## 2. 动效与弹簧参数

从 `references/motion.ts` 导入，不要临时写参数，也不要 `transition: all .3s linear`。

| 预设 | stiffness / damping / mass | 特征 | 场景 |
|---|---|---|---|
| `SPRING_PRESS` | 600 / 30 / 1 | ζ≈0.61，快、轻微回弹 | 按钮按压、Tab/分段切换 |
| `SPRING_REVEAL` | 320 / 28 / 1 | ζ≈0.78，几乎无超调 | 弹层、卡片展开、消息入场、思考区展开 |
| `SPRING_DELIGHT` | 380 / 18 / 1 | ζ≈0.46，明显回弹 | 成功勾选、点赞（慎用，单屏最多一处） |
| `SPRING_SNAP` | 1200 / 80 / 0.1 | 过阻尼，零超调 | 拖拽吸附、分栏归位、抽屉关闭 |

CSS 缓动备选：`--ease-out-expo`（阴影、焦点、淡入）、`--ease-decel`（面板滑入）。时长档：70ms 微反馈、120ms 状态切换、300ms 面板。

规则：
- 按压反馈 `active:scale-[0.98]`。
- 流式输出期间正在生成的文本**不加**入场动画（会抖）。
- 必须尊重 `prefers-reduced-motion`：关闭位移/缩放，只保留透明度变化。
- 拖拽类交互设 4px 移动死区，防止点击被误判为拖拽。

## 3. 中文输入法（IME）守卫 —— 必做

中日韩用户用输入法选词时按 Enter 是"确认候选词"，**绝不能触发发送**。

```tsx
const composing = useRef(false);

<textarea
  onCompositionStart={() => { composing.current = true; }}
  // Safari 会在 compositionend 后再派发一次 Enter keydown，延后一帧清除
  onCompositionEnd={() => setTimeout(() => { composing.current = false; }, 0)}
  onKeyDown={(e) => {
    if (composing.current || e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
/>
```

完整 Hook：`references/useImeSafeEnter.ts`。同样的守卫要加到：`/` 命令菜单和 `@` 提及菜单的 Enter/Tab 选中、搜索框回车提交、任何 Enter 触发的表单。
- Shift+Enter 换行；发送函数自身也检查 `composing`（防按钮点击竞态）。
- 输入框高度随内容伸缩（最小约 48px，最大约 384px 后内部滚动）。

## 4. 流式输出滚动图钉

问题：模型逐字输出时，用户往上翻看历史会被强行拉回底部。

规则（`references/useStreamScrollPin.ts`）：
- 距底部 ≤ 40px 视为"贴底"，只在贴底时自动跟随。
- 用户滚轮/触摸/键盘滚动后 150ms 内不执行自动滚动。
- 离底部 > 120px 显示"回到最新"浮动按钮（点击用 smooth 滚动）。
- 自动跟随用 `behavior: "auto"`，不用 smooth（追不上 token 速度）。
- 区分程序滚动与用户滚动，避免自己的 scrollTo 把图钉状态改掉。
- 用户发送新消息时强制回到底部并重新贴底。

## 5. 消息与流式状态

消息状态机：`sending → streaming → done`，以及 `error`、`stopped`（用户中止）。
- **sending**：气泡立即乐观插入，轻量指示（三点脉冲）。
- **streaming**：显示"停止生成"按钮；正在生成的段落不做位移动画；思考/推理区在生成中强制展开，结束后可折叠并显示耗时。
- **done**：显示复制（复制后对勾保持约 2.5s 再还原）、重试、反馈。
- **error**：原位显示错误与"重试"按钮；**失败消息内容要保留**（本地暂存），不能让用户重打。
- **stopped**：保留已生成内容并标注"已停止"。
- 限流 429/503：用 `references/useRateLimitBackoff.ts`——指数退避加 ±15% 抖动、读取 Retry-After 头、最多自动重试 3 次后转为手动重试，并显示倒计时。
- 用户消息：气泡（`radius-bubble`，`surface-2/3` 底）；助手消息：无边框、无气泡，按正文排版，最大行宽约 720px。
- 代码块：`surface-code` 底、语言标签、复制按钮；长代码可横向滚动，不自动换行打乱缩进。

## 6. 工具调用三态确认卡

参考 `references/ToolDecisionCard.tsx`（受控组件，状态由运行时驱动，不要在 UI 里假装执行）。

状态：`pending_approval → running → success | error`，拒绝时为 `denied`。

决议按钮：
1. **允许一次**（主按钮，默认焦点）——只授权本次调用。
2. **总是允许**——写入白名单；**破坏性操作（删除、付款、外发消息）不提供此项**。
3. **拒绝**——中断，并把"用户拒绝"回传给模型。

规则：
- 完整展示工具名、来源、参数（格式化 JSON、只读），不能只给摘要。
- 按风险分级（read / write / destructive）调整视觉强度；destructive 用 danger 色文案说明后果。
- 结果默认折叠，可展开；显示耗时。
- 状态文字放在 `aria-live="polite"` 区域；运行中 `aria-busy`。
- "总是允许"必须可在设置里撤销。

## 7. 无障碍

- 全部交互可键盘完成：Tab 顺序合理；列表/菜单用方向键漫游（roving tabindex），Home/End 跳首尾，Esc 关闭弹层并把焦点还给触发元素。
- 对话框：焦点陷阱、`role="dialog"` + `aria-modal`、打开时聚焦首个可操作元素。
- 新消息到达用 `aria-live="polite"` 播报（流式中不要逐 token 播报，完成后播报一次）。
- 纯图标按钮必须有 `aria-label`；点击区域 ≥ 32×32px（移动端 44×44）。
- 不只靠颜色传达状态（错误要有图标/文字）。
- 窄容器用容器查询（`@container`）逐级隐藏次要文字，避免中文单字折行。

## 8. 沙箱与 iframe 安全门

模型生成的 HTML/JS/SVG 一律视为不可信。参考 `references/SandboxedPreview.tsx`。
- 用 `srcdoc` + `sandbox="allow-scripts"`；**禁止同时给 `allow-scripts` 和 `allow-same-origin`**（等于沙箱失效）。
- 不给 `allow-top-navigation`、`allow-popups-to-escape-sandbox`、`allow-forms`（除非明确需要）。
- `postMessage` 接收端同时校验 `event.source === iframe.contentWindow` 与 origin，并对 `data` 做 schema 校验；发送时不用 `"*"` 传敏感数据。
- 下载、打开外链、剪贴板写入等需要用户手势触发（检查 `navigator.userActivation.isActive` 或经宿主二次确认）。
- 模型输出的 Markdown 渲染须消毒（禁 `<script>`、`on*` 属性、`javascript:` 链接）。
- 拖拽分栏经过 iframe 时加透明遮罩层，防止指针事件被吞；分栏双击恢复 50/50。

## 9. 验收清单

交付前逐条确认：

**令牌与视觉**
- [ ] 无裸 HEX；品牌色均为令牌，未填写的已标注"待填"
- [ ] 亮/暗模式都检查过；表面四层可区分；正文对比度 ≥ 4.5:1
- [ ] 单层描边原则；圆角符合语义表；动态数字用 tabular-nums

**输入与流式**
- [ ] 中文输入法选词按 Enter 不发送（实测拼音输入法，含 Safari）
- [ ] Shift+Enter 换行；输入框高度自适应且有上限
- [ ] 流式中上翻历史不被拉回；"回到最新"按钮出现/消失正确
- [ ] 停止生成、错误重试、失败消息保留、限流倒计时均可用

**工具调用**
- [ ] 三态完整；参数完整可见；破坏性操作无"总是允许"；拒绝会回传模型

**动效与无障碍**
- [ ] 只用四个弹簧预设或指定缓动；reduced-motion 生效
- [ ] 全键盘可操作；焦点环可见；对话框焦点陷阱；图标按钮有 aria-label

**安全**
- [ ] iframe 无 `allow-same-origin` + `allow-scripts` 组合；postMessage 校验 source/origin/data
- [ ] Markdown 已消毒；外链/下载需用户手势

**工程**
- [ ] `tsc --noEmit` 0 错误；无新增字体/音频等二进制资源（除非调用方提供授权文件）
- [ ] 若使用了 references 代码，已保留 ATTRIBUTION 与 MIT 许可证
