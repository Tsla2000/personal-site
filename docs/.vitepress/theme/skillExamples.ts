import type { SkillExampleCopy } from './homeSkills'

/** 技能详情页「实操示例」的文案。示例为演示用的输入/输出，不代表真实客户项目。 */
export const SKILL_EXAMPLES: Record<string, SkillExampleCopy> = {
  'de-ai-writing': {
    exampleTitleZh: '清理一段有机器味的成稿，只改命中规则的句子',
    exampleTitleEn: 'Clean a machine-sounding draft, touching only rule hits',
    exampleInputZh: [
      '任务：用我的风格档案，清理下面这段成稿，不动观点和结构。',
      '',
      '原文：',
      '在这个信息爆炸的时代，AI 搜索不仅是一种工具，更是一种全新的认知方式。',
      '它改变了我们获取信息的路径，重塑了内容的价值。'
    ].join('\n'),
    exampleInputEn: [
      'Task: using my style profile, clean the draft below without touching views or structure.',
      '',
      'Draft:',
      'In this age of information overload, AI search is not just a tool but a whole new way of knowing.',
      'It changes how we reach information and reshapes the value of content.'
    ].join('\n'),
    exampleOutputZh: [
      '清理后：',
      'AI 搜索这两年涨得很快。它先改的是找信息的路径：以前翻十个网页，现在先问一句。',
      '',
      '改动记录（只列命中项）：',
      '1. 删「在这个信息爆炸的时代」：套话开头，命中规则',
      '2. 「不仅……更是……」改成直接陈述：否定式对仗，命中规则',
      '3. 「重塑了内容的价值」：无动词落点的金句，改成档案里常用的具体说法',
      '未改动：观点（AI 搜索改变了找信息的方式）、两句的先后顺序'
    ].join('\n'),
    exampleOutputEn: [
      'Cleaned:',
      'AI search has grown fast in the past two years. The first thing it changed is the path to information: you used to open ten pages, now you ask once.',
      '',
      'Change log (rule hits only):',
      '1. Removed "In this age of information overload": filler opener, rule hit',
      '2. "not just ... but ..." turned into a direct statement: negation-parallel pattern, rule hit',
      '3. "reshapes the value of content": a slogan with no concrete anchor, replaced by the plain wording the profile uses',
      'Untouched: the view (AI search changed how people find information) and the order of the two sentences'
    ].join('\n'),
    artifactsZh: ['清理后的成稿', '逐条改动记录，标明命中的规则', '未改动项说明（观点、结构、限定词）'],
    artifactsEn: ['The cleaned draft', 'A change log naming the rule behind each edit', 'A list of what was deliberately left alone (views, structure, hedges)'],
    checksZh: ['没有新增姓名、数字、日期、引语或来源', '观点、结论和「可能 / 通常」这类限定词都还在', '每处改动都能对上一条规则或档案记录'],
    checksEn: ['No new names, numbers, dates, quotes or sources added', 'Views, conclusions and hedges such as "maybe" and "usually" are all still there', 'Every edit maps to a rule or a profile entry']
  },
  brainstorming: {
    exampleTitleZh: '一句话的需求，先聊清楚再动手',
    exampleTitleEn: 'A one-line request, clarified before any building',
    exampleInputZh: '我想做一个记账的小工具。',
    exampleInputEn: 'I want to build a small expense tracker.',
    exampleOutputZh: [
      'Agent 的第一条回复（只有两件事）：',
      '',
      '如果你不想回答问题、想让我直接开干，说一声就行。',
      '你上一次想记一笔账、却没有顺手的地方记，是在什么场景下？',
      '',
      '用户回答后，Agent 每条消息只问一个问题，逐步弄清：',
      '- 谁来用、多久记一次、记完要看什么',
      '- 平台和工具哪些你想自己定，哪些交给我',
      '- 做到什么程度算「够了」',
      '',
      '收尾：一份书面设计，写明目标、范围、你的决定和我替你做的决定（单独标注）。'
    ].join('\n'),
    exampleOutputEn: [
      "The agent's first reply (only two things):",
      '',
      "If you'd rather skip the questions and have me start building, just say so.",
      'Think of the last time you wanted to log an expense and had nowhere handy to do it. What was going on?',
      '',
      'After the answer, the agent asks one question per message and works out:',
      '- who uses it, how often, and what they want to see afterwards',
      '- which tools and platforms you want to choose and which you leave to me',
      '- what "good enough" looks like',
      '',
      'It ends with a written design: goal, scope, your decisions, and the decisions made for you (marked separately).'
    ].join('\n'),
    artifactsZh: ['一份书面设计（目标、范围、取舍）', '「你的决定」与「我替你做的决定」分开列出', '可以直接交给「写计划」的输入'],
    artifactsEn: ['A written design (goal, scope, trade-offs)', 'Your decisions and the agent\'s decisions listed separately', 'Input ready to hand to Writing Plans'],
    checksZh: ['第一句话给了跳过的出口，并且只问一个开放问题', '每条消息以一个问题结尾，没有挂一串示例答案', '没有把自己的选择写成「你同意过的」'],
    checksEn: ['The first message offers a way to skip and asks a single open question', 'Every message ends with one question, with no list of sample answers', "The agent's own choices are never written up as things you agreed to"]
  },
  'systematic-debugging': {
    exampleTitleZh: '线上构建突然失败：先找根因，不「改一行试试」',
    exampleTitleEn: 'A sudden build failure: root cause first, no "just try one line"',
    exampleInputZh: [
      '部署流水线今天起一直红，报错 Cannot find module "./config.json"。',
      '昨天还是好的，我已经试着重装了两次依赖，没用。'
    ].join('\n'),
    exampleInputEn: [
      'The deploy pipeline has been red since today, failing with Cannot find module "./config.json".',
      'It was green yesterday. I already reinstalled dependencies twice and it did not help.'
    ].join('\n'),
    exampleOutputZh: [
      '第一阶段 · 根因调查',
      '1. 读报错：报错在构建脚本第 12 行，不是业务代码',
      '2. 稳定复现：本地跑同一条命令，是否同样失败',
      '3. 查最近改动：对比昨天到今天的提交、依赖和 CI 配置',
      '4. 跨组件加诊断：在「提交 → CI → 构建脚本」每个边界打印文件列表与环境变量，找到断在哪一层',
      '5. 追数据流：config.json 是谁生成的、在哪一步该出现',
      '',
      '后三个阶段：对照能跑的构建找差异 → 一次只验证一个假设 → 先写失败用例，再做最小修复。',
      '没有拿到第一阶段的证据之前，不提修复方案。'
    ].join('\n'),
    exampleOutputEn: [
      'Phase 1 · Root cause investigation',
      '1. Read the error: it points at line 12 of the build script, not application code',
      '2. Reproduce reliably: does the same command fail locally?',
      '3. Check recent changes: diff commits, dependencies and CI config from yesterday to today',
      '4. Instrument each component boundary: print the file list and env vars at commit -> CI -> build script to find the layer where it breaks',
      '5. Trace the data flow: who generates config.json, and at which step should it appear?',
      '',
      'The next three phases: compare with a working build -> test one hypothesis at a time -> write a failing test, then make the smallest fix.',
      'No fix is proposed until Phase 1 has produced evidence.'
    ].join('\n'),
    artifactsZh: ['根因结论，附证据（日志、diff、边界输出）', '一个能复现问题的失败用例', '最小修复，以及修复后的验证结果'],
    artifactsEn: ['A root-cause statement backed by evidence (logs, diffs, boundary output)', 'A failing test that reproduces the problem', 'The smallest fix, plus the verification result after it'],
    checksZh: ['修复提出之前已经有根因证据', '修的是源头，不是报错出现的位置', '连续几次修复失败后，先质疑方案本身，而不是继续叠补丁'],
    checksEn: ['Root-cause evidence exists before any fix is proposed', 'The fix lands at the source, not where the error surfaced', 'After several failed fixes the agent questions the approach instead of stacking patches']
  },
  'writing-plans': {
    exampleTitleZh: '把一份规格拆成没见过代码库的人也能执行的计划',
    exampleTitleEn: 'Turn a spec into a plan someone new to the codebase can execute',
    exampleInputZh: [
      '规格：给站点加一个「最近阅读」模块，记录最近 5 篇文章，只存在浏览器本地。',
      '请写实现计划，先别动代码。'
    ].join('\n'),
    exampleInputEn: [
      'Spec: add a "recently read" module to the site that keeps the last 5 articles, stored only in the browser.',
      'Write the implementation plan. Do not touch code yet.'
    ].join('\n'),
    exampleOutputZh: [
      '我正在用写计划（writing-plans）技能创建实现计划。',
      '',
      '# 最近阅读 实现计划',
      '',
      '## 文件结构',
      '- 新建 recentReads.ts：读写本地存储，只负责数据',
      '- 新建 RecentReads.vue：只负责展示',
      '- 修改主题入口：挂载组件',
      '',
      '## 任务 1：存取最近阅读',
      '- [ ] 写出失败的测试：存入 6 条，只留最新 5 条',
      '- [ ] 跑一遍，确认它失败',
      '- [ ] 写最少代码让测试通过',
      '- [ ] 跑测试，确认全过',
      '- [ ] 提交',
      '',
      '## 任务 2：展示组件（同样的五步循环）'
    ].join('\n'),
    exampleOutputEn: [
      'I am using the writing-plans skill to create the implementation plan.',
      '',
      '# Recently Read Implementation Plan',
      '',
      '## File structure',
      '- New recentReads.ts: reads and writes local storage, data only',
      '- New RecentReads.vue: display only',
      '- Modify the theme entry: mount the component',
      '',
      '## Task 1: store and read recent items',
      '- [ ] Write the failing test: store 6 items, keep only the newest 5',
      '- [ ] Run it and confirm it fails',
      '- [ ] Write the minimum code to make it pass',
      '- [ ] Run the tests and confirm they all pass',
      '- [ ] Commit',
      '',
      '## Task 2: display component (same five-step loop)'
    ].join('\n'),
    artifactsZh: ['一份保存在 docs/superpowers/plans/ 下的计划文档', '文件结构表：每个文件的职责', '按任务拆分的步骤清单，每步一个动作加一个可检查结果'],
    artifactsEn: ['A plan document saved under docs/superpowers/plans/', 'A file map with one responsibility per file', 'Tasks broken into steps, each one action plus one checkable result'],
    checksZh: ['先定文件结构，再拆任务', '每个任务结束时都有可独立测试的交付物', '计划里没有「之后再补」「类似上面」这类占位说法'],
    checksEn: ['The file structure is settled before tasks are split', 'Every task ends with an independently testable deliverable', 'The plan has no placeholders such as "fill in later" or "similar to above"']
  },
  'haiwai-new-keyword-launch': {
    exampleTitleZh: '发现一个飙升的新词，判断值不值得马上做',
    exampleTitleEn: 'Spot a rising new keyword and decide whether to build now',
    exampleInputZh: [
      '我用词根 AI 在 Google Trends 的「搜索量上升」里看到一个新组合词。',
      '请按四点判断告诉我值不值得今天就做，并给出 D0 到 D5 的安排。'
    ].join('\n'),
    exampleInputEn: [
      'Using the root keyword AI, I found a new combination in the "Rising" list on Google Trends.',
      'Run the four-point check to tell me whether to build today, then give me the D0 to D5 plan.'
    ].join('\n'),
    exampleOutputZh: [
      '四点判断（缺数据的项标「待核实」，不编数字）',
      '1. 在飙升：是否出现在「搜索量上升」里',
      '2. 对比 GPTs：用 TrendsBar 把新词与 GPTs 放在一起看热度',
      '3. SERP 未被专门站占住：前排是教程 / 资讯 / Reddit 则机会大，已有垂直站则慎做',
      '4. 域名可买：.com 没了就买 .app 等贴词后缀',
      '',
      'D0：当天上首页（复刻竞品大站内页结构，第一版可以是静态页）',
      'D1–D2：不做功能，用长尾词批量铺内页',
      'D3：见流量先上登录',
      'D4：上支付与真实生成',
      'D5 往后：按数据调整，热度退潮就补低价包'
    ].join('\n'),
    exampleOutputEn: [
      'Four-point check (items without data are marked "to verify"; no invented numbers)',
      '1. Rising: does it appear in the "Rising" list?',
      '2. Compare with GPTs: put the keyword next to GPTs in TrendsBar and look at the heat',
      '3. SERP not held by a dedicated site: tutorials / news / Reddit on top means opportunity; a vertical site already there means caution',
      '4. Domain available: if the .com is gone, take a keyword-fitting suffix such as .app',
      '',
      'D0: homepage live the same day (copy the structure of a competitor inner page; a static page is fine for v1)',
      'D1-D2: no features, bulk-publish long-tail pages',
      'D3: once traffic shows up, add login first',
      'D4: add payment and real generation',
      'D5 onward: adjust by data; if the heat fades, add a low-price pack'
    ].join('\n'),
    artifactsZh: ['四点判断表，每项写明依据或「待核实」', 'D0 到 D5 的执行清单', '长尾词四个来源的取词计划'],
    artifactsEn: ['A four-point table with the evidence or "to verify" for each item', 'A D0 to D5 execution list', 'A plan for pulling long-tail terms from the four sources'],
    checksZh: ['任何一项明显为否就换下一个词，而不是硬做', '没有捏造流量、收入或搜索量数字', 'D0 的目标是一个当天可点开的站，而不是完整产品'],
    checksEn: ['One clear "no" means moving to the next keyword rather than forcing it', 'No traffic, revenue or search-volume figures are made up', 'D0 aims for a site that opens the same day, not a finished product']
  },
  'website-launch-check': {
    exampleTitleZh: '改版后上线前的验收，输出带证据的清单',
    exampleTitleEn: 'A pre-launch check after a redesign, with evidence for every line',
    exampleInputZh: '官网刚改完版，准备发到生产环境。请做上线验收，告诉我能不能发。',
    exampleInputEn: 'The site redesign is done and about to go to production. Run the launch check and tell me whether to ship.',
    exampleOutputZh: [
      '验收报告',
      '结论：有条件发布',
      '',
      '检查项',
      '- 首页 / 导航 / 主 CTA：通过（命令或截图为证）',
      '- 窄屏菜单：通过',
      '- 表单提交：未验证（预览环境没有后端权限）',
      '- title / description / canonical：失败，两个页面缺 canonical',
      '- 构建与 lint：通过（附真实命令和输出）',
      '',
      '阻断问题：无',
      '发布后修复：补 canonical',
      '观察项：表单提交，需在生产环境手动验证一次',
      '回滚方案：回退到上一次部署'
    ].join('\n'),
    exampleOutputEn: [
      'Launch report',
      'Verdict: ship with conditions',
      '',
      'Checks',
      '- Home / navigation / primary CTA: pass (command or screenshot attached)',
      '- Narrow-screen menu: pass',
      '- Form submission: not verified (no backend access in the preview)',
      '- title / description / canonical: fail, two pages are missing canonical',
      '- Build and lint: pass (real command and output attached)',
      '',
      'Blocking issues: none',
      'Fix after launch: add canonical tags',
      'Watch list: form submission, verify once by hand in production',
      'Rollback: revert to the previous deployment'
    ].join('\n'),
    artifactsZh: ['验收报告：结论、检查项、证据', '阻断 / 发布后修复 / 观察项三类问题清单', '回滚方案'],
    artifactsEn: ['A launch report with verdict, checks and evidence', 'Issues sorted into blocking / fix after launch / watch list', 'A rollback plan'],
    checksZh: ['没有环境权限的检查标「未验证」，不写成通过', '每一项都有命令、截图或页面地址作证据', '只有拿到真实部署结果才说「已上线」'],
    checksEn: ['Checks without environment access are marked "not verified", never "pass"', 'Every line has a command, screenshot or URL as evidence', '"Live" is only said once a real deployment result exists']
  },
  'ai-ui-design': {
    exampleTitleZh: '给 AI 聊天产品搭设计令牌，品牌色未提供时不乱套',
    exampleTitleEn: 'Set up design tokens for an AI chat product without borrowing a brand colour',
    exampleInputZh: '帮我做一个 AI 聊天界面的前端基础：暗色模式，React + Tailwind。品牌色我还没定。',
    exampleInputEn: 'Build the front-end foundation for an AI chat UI: dark mode, React + Tailwind. I have not picked a brand colour yet.',
    exampleOutputZh: [
      '开工前确认：品牌色未提供 → 用中性灰占位，交付时标注「品牌色待填」，不套用任何知名产品配色。',
      '',
      '令牌结构',
      '- 表面阶梯 surface-0 到 surface-3：靠相邻层 1%–3% 亮度差分层，不靠粗边框',
      '- 文字三档：primary / secondary / tertiary，正文对比度不低于 4.5:1',
      '- 焦点环：内环同背景色 + 外环品牌色 40%，只在 :focus-visible 出现',
      '- 圆角语义：输入框 20 / 消息气泡 18 / 卡片 10 / 按钮 8 / chip 6',
      '- 动态数字（计时、token 数）统一 tabular-nums',
      '',
      '组件里不出现裸 HEX，颜色、圆角、间距只引用令牌。',
      '待填项：--brand-primary / hover / active / ring'
    ].join('\n'),
    exampleOutputEn: [
      'Before starting: no brand colour given -> use neutral grey placeholders, mark the result "brand colour to fill in", and do not borrow any well-known product palette.',
      '',
      'Token structure',
      '- Surface ladder surface-0 to surface-3: layers separated by 1%-3% lightness steps rather than heavy borders',
      '- Three text tiers: primary / secondary / tertiary, body contrast at least 4.5:1',
      '- Focus ring: inner ring in the background colour + outer ring in the brand colour at 40%, shown only on :focus-visible',
      '- Radius semantics: input 20 / message bubble 18 / card 10 / button 8 / chip 6',
      '- Dynamic numbers (timers, token counts) use tabular-nums',
      '',
      'No raw HEX inside components; colours, radii and spacing come from tokens only.',
      'To fill in: --brand-primary / hover / active / ring'
    ].join('\n'),
    artifactsZh: ['一份填好占位值的令牌文件', '消息流、输入框的基础组件骨架', '待填的品牌色清单'],
    artifactsEn: ['A token file with placeholder values filled in', 'Starter components for the message stream and input box', 'A list of brand values still to be filled in'],
    checksZh: ['组件代码里搜不到裸 HEX', '没有直接删除 outline 而不提供替代焦点环', '字体栈里包含中文字体'],
    checksEn: ['No raw HEX values can be found in component code', 'outline is never removed without a replacement focus ring', 'The font stack includes a Chinese font']
  },
  'diagram-design': {
    exampleTitleZh: '把一段文字描述画成可发布的流程图',
    exampleTitleEn: 'Turn a written description into a publishable flowchart',
    exampleInputZh: '把「用户提交表单 → 校验 → 通过则写入数据库并发确认邮件，失败则返回错误提示」画成流程图，用在文章里。',
    exampleInputEn: 'Draw "user submits a form -> validate -> on success write to the database and send a confirmation email, on failure return an error message" as a flowchart for an article.',
    exampleOutputZh: [
      '1. 先检查样式指南：如果还是默认色板，先问你要不要按网站或品牌定制',
      '2. 选类型：流程图（含一个判断分支）',
      '3. 先删后加：只保留 5 个节点（提交、校验、写入并发邮件、返回错误、结束），不加装饰性节点',
      '4. 输出：一个自包含的 HTML 文件，内含内联 SVG，可导出 PNG',
      '',
      '节点之间的连线标出判断条件（通过 / 失败），颜色只用样式指南里的语义色。'
    ].join('\n'),
    exampleOutputEn: [
      '1. Check the style guide first: if it still uses the default palette, ask whether to customise it from your site or brand',
      '2. Pick the type: flowchart (with one decision branch)',
      '3. Delete before adding: keep only 5 nodes (submit, validate, write and send email, return error, end), no decorative nodes',
      '4. Output: one self-contained HTML file with inline SVG, exportable to PNG',
      '',
      'Edges carry the decision labels (pass / fail); colours come only from the semantic roles in the style guide.'
    ].join('\n'),
    artifactsZh: ['一个自包含的 HTML/SVG 图文件', '需要时导出的 PNG', '本次使用的样式指南说明'],
    artifactsEn: ['A self-contained HTML/SVG diagram file', 'A PNG export when needed', 'A note on which style guide was used'],
    checksZh: ['节点数量没有超出说明所需', '分支条件都标在连线上', '没有在带品牌的项目里悄悄使用默认配色'],
    checksEn: ['No more nodes than the explanation needs', 'Every branch condition is labelled on its edge', 'Default colours are not silently shipped into a branded project']
  },
  anatomy: {
    exampleTitleZh: '用一个实物比喻讲清一个算法',
    exampleTitleEn: 'Explain an algorithm through a physical machine',
    exampleInputZh: '我要给博客文章配一张交互图，解释「滑动窗口限流」是怎么工作的。想要有质感的等轴测风格。',
    exampleInputEn: 'I need an interactive figure for a blog post explaining how sliding-window rate limiting works. I want a crafted isometric look.',
    exampleOutputZh: [
      '做法',
      '1. 先打开最接近的示例（如刻度盘那个最小的例子）当参照',
      '2. 选实物比喻：一根带刻度的导轨，滑块是「窗口」，滑块里的小球是请求',
      '3. 用同一个模型驱动画面和读数：窗口里的请求数就是读数盘上的数字',
      '4. 画法：多个小而精确的实体零件，四档明暗，按正确的遮挡顺序绘制，动效缓动',
      '5. 用 Node 构建出独立 HTML，并用 Chrome 做检查',
      '',
      '界面：带标题、提示语和实时读数的卡片，支持亮色与暗色。'
    ].join('\n'),
    exampleOutputEn: [
      'Approach',
      '1. Open the closest shipped example first (for instance the small dial-gauge one) as a reference',
      '2. Choose a physical metaphor: a ruled rail whose slider is the "window", with balls inside it standing for requests',
      '3. Drive both the picture and the readout from one model: the number of requests inside the window is the number on the gauge',
      '4. Drawing: many small precise solids, four-tone shading, correct painter\'s order, calm eased motion',
      '5. Build to a standalone HTML page with Node and check it in Chrome',
      '',
      'Interface: a framed card with title, hint and live readout, in light and dark themes.'
    ].join('\n'),
    artifactsZh: ['一个独立的交互 HTML 页面（可嵌入文章）', '构建脚本', '亮色与暗色两套主题'],
    artifactsEn: ['A standalone interactive HTML page (embeddable in an article)', 'The build script', 'Light and dark themes'],
    checksZh: ['画面上每个数字都来自驱动动画的同一个模型', '零件遮挡顺序正确，没有穿帮', '用 Chrome 检查过实际渲染'],
    checksEn: ['Every number on screen comes from the same model that moves the parts', 'Painter\'s order is correct, with no overlapping glitches', 'The rendered result has been checked in Chrome']
  },
  cover_image_gen: {
    exampleTitleZh: '为一篇文章出 3 版封面，并逐字核对标题',
    exampleTitleEn: 'Produce three cover variants for an article and proof-read every character',
    exampleInputZh: '给文章《AI 搜索正在改变找信息的方式》做公众号封面，「AI 搜索」黄底高亮。',
    exampleInputEn: 'Make a WeChat cover for the article "AI Search Is Changing How We Find Information", with "AI Search" highlighted on yellow.',
    exampleOutputZh: [
      '提示词三段',
      '1. 风格锚点：3D paper craft and clay render, bright and playful, WeChat article cover composition',
      '2. 完整中文标题（单引号包裹），「AI 搜索」黄底高亮，其余词黑色加粗',
      '3. 场景一句：一个人从左侧撕开纸，露出的卡片上写着英文短标签',
      '',
      '出 3 版：人物在右 / 无人物标题大 / 人物在左',
      '验收：逐张打开，逐字核对中文标题，错字或乱码就重生；检查高亮是否落在指定词上',
      '交付：转成 JPG（quality=92）再交，因为公众号上传不认 WebP'
    ].join('\n'),
    exampleOutputEn: [
      'Three-part prompt',
      '1. Style anchor: 3D paper craft and clay render, bright and playful, WeChat article cover composition',
      '2. Full Chinese title in single quotes, "AI Search" on a yellow highlight, other words in bold black',
      '3. One-line scene: a person tearing the paper open from the left, revealing a card with a short English label',
      '',
      'Three variants: figure on the right / no figure with a large title / figure on the left',
      'Check: open each image and proof-read the title character by character; regenerate on any wrong or garbled character; confirm the highlight sits on the intended words',
      'Delivery: convert to JPG (quality=92) because WeChat upload does not accept WebP'
    ].join('\n'),
    artifactsZh: ['3 张不同构图的封面 JPG', '文件名区分版本', '逐字核对记录'],
    artifactsEn: ['Three cover JPGs with different compositions', 'File names that tell the versions apart', 'The character-by-character check notes'],
    checksZh: ['中文标题没有错字和乱码', '黄底高亮落在指定词上', '版面不拥挤，副标题短或没有'],
    checksEn: ['No wrong or garbled characters in the Chinese title', 'The yellow highlight sits on the intended words', 'The layout is not crowded and the subtitle is short or absent']
  },
  desk_watercolor: {
    exampleTitleZh: '为一篇文章画一张暖纸水彩插画',
    exampleTitleEn: 'Paint a warm watercolor illustration for an article',
    exampleInputZh: '给一篇讲「慢慢做副业」的文章配图：书桌、窗外有屋顶，不要文字。',
    exampleInputEn: 'Illustrate an article about taking a side project slowly: a desk, rooftops outside the window, no text.',
    exampleOutputZh: [
      '提示词按顺序组装：风格锚点 → 场景 → 点缀色 → 光线 → 排除项',
      '',
      '- 风格锚点：原样使用技能里固定的那一句（水彩与墨线、奶油色水彩纸、赭黄与琥珀、毛边纸边）',
      '- 场景：一张靠窗的书桌，摊开的纸和一杯茶，窗外是瓦片屋顶和远山',
      '- 点缀色：只有一个饱和的暖橙物件，比如一颗熟芒果；有两个就破坏风格',
      '- 光线：傍晚的柔和阳光透过格子窗，投下长而轻的影子',
      '- 排除：不要照片写实、不要 3D、不要霓虹色、不要锐利的数字边缘',
      '',
      '没有要求文字，所以纸、书和屏幕都保持空白。'
    ].join('\n'),
    exampleOutputEn: [
      'The prompt is assembled in order: style anchor -> scene -> accent -> light -> exclusions',
      '',
      '- Style anchor: the fixed sentence from the skill, used verbatim (watercolor and ink, cream paper, sepia and amber, deckled edges)',
      '- Scene: a desk by a window with open papers and a cup of tea, tiled rooftops and distant hills outside',
      '- Accent: exactly one saturated warm orange object, for example a ripe mango; two accents already break the style',
      '- Light: soft late-afternoon sun through a lattice window, long gentle shadows',
      '- Exclusions: no photorealism, no 3D render, no neon colours, no sharp digital edges',
      '',
      'No text was requested, so papers, books and screens stay blank.'
    ].join('\n'),
    artifactsZh: ['一张暖纸水彩风格的插画', '本次使用的完整提示词', '风格是否一致的自查结论'],
    artifactsEn: ['One watercolor-style illustration', 'The complete prompt that was used', 'A self-check on whether the style held'],
    checksZh: ['画面里只有一个饱和的橙色点缀', '纸张纹理贯穿整张图，边缘是毛边而不是硬裁切', '用户没要文字时画面里没有文字'],
    checksEn: ['Exactly one saturated orange accent in the image', 'Paper grain runs through the whole picture and the edge is deckled, not hard-cropped', 'No text appears when none was requested']
  },
  custom_connector_setup: {
    exampleTitleZh: '接入一个没有现成连接器的服务',
    exampleTitleEn: 'Connect a service that has no bundled connector',
    exampleInputZh: '我想让 Agent 读取我在某个项目管理工具里的任务列表，但没有现成的连接器。',
    exampleInputEn: 'I want the agent to read my task list in a project-management tool, but no connector exists for it.',
    exampleOutputZh: [
      '1. 先找现成路径：已有连接器 → Zapier / Composio 能否通过你的账号触达 → 服务商官方 MCP',
      '2. 都没有时才找官方 API 文档与认证指南，优先用服务商维护的客户端或口碑好的开源实现，钉死版本',
      '3. 凭证：通过专门的凭证请求流程拿，不在聊天里要密钥；认证方式、域名、位置第一次就按文档写对',
      '4. OAuth 只申请任务需要的最小权限',
      '5. 先用一次无害的只读调用验证连通（例如读取一个任务列表）',
      '6. 把连接器说明和复用方法存成文档，下次不用重来'
    ].join('\n'),
    exampleOutputEn: [
      '1. Look for an existing route first: bundled connector -> can Zapier / Composio reach it through your account -> the provider\'s official MCP',
      '2. Only if none exist, read the official API docs and auth guide; prefer the provider\'s maintained client or a reputable open-source one, with the version pinned',
      '3. Credentials: use the dedicated credential-request flow and never ask for a key in chat; get the auth scheme, hosts and placement right the first time from the docs',
      '4. For OAuth, request only the least scope the task needs',
      '5. Verify with one harmless read-only call (for example reading one task list)',
      '6. Save the connector notes and reuse steps as documentation so the next setup does not start over'
    ].join('\n'),
    artifactsZh: ['一个能用的连接，并验证过只读调用', '连接器说明文档（认证方式、域名、权限范围）', '可复用的使用步骤'],
    artifactsEn: ['A working connection verified with a read-only call', 'Connector documentation (auth scheme, hosts, scope)', 'Reusable usage steps'],
    checksZh: ['聊天记录里没有出现任何密钥或令牌', '第一次连通用的是只读调用，没有写入', '请求的权限没有超出任务需要'],
    checksEn: ['No key or token appears anywhere in the chat', 'The first call was read-only and wrote nothing', 'The requested scope does not exceed what the task needs']
  },
  'personal-site-build': {
    exampleTitleZh: '从零搭一个设计师作品集站',
    exampleTitleEn: 'Build a designer portfolio site from scratch',
    exampleInputZh: '我是独立设计师，想搭个人站展示作品并接单。还没有任何内容。',
    exampleInputEn: 'I am an independent designer who wants a personal site to show work and win commissions. I have no content yet.',
    exampleOutputZh: [
      '0. 开工前确认（写进简报）：你是谁 / 给谁看；站要完成什么（展示 + 接单，标优先级）；必备页面；技术栈；2–4 个品牌气质形容词。品牌色未定则先中性灰占位。',
      '1. 先建内容底稿（飞书文档或本地 Markdown）：简介短版和长版、项目案例、服务、联系方式、素材清单。以后改内容只改底稿。',
      '2. 选 UI 参考：作品集类每个品类挑 1–3 个，让 AI 抓结构、截图和风格关键词后按你的内容整合，不是照搬。',
      '3. 图片落地：底稿里的图下载到项目 assets/，不长期留外链。',
      '4. 发布前：全文搜索 feishu / lark / 临时外链残留。'
    ].join('\n'),
    exampleOutputEn: [
      '0. Confirm before starting (written into the brief): who you are and who it is for; what the site must do (showcase + get commissions, with priority); required pages; tech stack; 2-4 adjectives for the brand mood. If no brand colour is set, use neutral grey placeholders.',
      '1. Build a content draft first (a Feishu doc or local Markdown): short and long bio, case studies, services, contact, asset list. From then on, change content only in the draft.',
      '2. Pick UI references: 1-3 per category for portfolio sites, have the AI extract structure, screenshots and style keywords, then adapt them to your content rather than copy.',
      '3. Image handling: download images from the draft into the project assets/ folder and do not leave external links in production.',
      '4. Before launch: search the whole project for leftover feishu / lark / temporary external links.'
    ].join('\n'),
    artifactsZh: ['一份内容底稿', '带必备页面的站点第一版', '发布前的外链残留检查结果'],
    artifactsEn: ['A content draft', 'A first version of the site with the required pages', 'The leftover-external-link check result'],
    checksZh: ['改文案只需改底稿，不用到处改组件', '生产站里没有飞书等临时外链', '没有套用知名产品的品牌色'],
    checksEn: ['Copy changes need only the draft, not edits across components', 'No Feishu or other temporary links remain on the production site', 'No well-known product brand colours were borrowed']
  },
  'frontend-design': {
    exampleTitleZh: '给一个小众产品做有个性的落地页，而不是模板味',
    exampleTitleEn: 'Design a distinctive landing page for a niche product instead of a template',
    exampleInputZh: '帮我做一个手冲咖啡豆订阅服务的落地页。',
    exampleInputEn: 'Design a landing page for a hand-pour coffee bean subscription.',
    exampleOutputZh: [
      '1. 先落到具体题材：受众是喜欢自己研磨的人，页面的主要任务是让人订第一袋（如果简报没写，先提出方案并向你确认）',
      '2. 首屏用这个行业最有特征的东西：比如一页烘焙记录卡，而不是「大数字 + 小标签 + 渐变」的默认样式',
      '3. 字体是设计的性格：一到两个字体族，刻意选择，不用顺手就拿的默认字体；正文行宽不超过 80 个字符',
      '4. 避开常见的生成痕迹：不用泛滥的渐变点缀和千篇一律的卡片栅格',
      '5. 所有文案和内容用真实的题材内容，不用占位的「Lorem ipsum」'
    ].join('\n'),
    exampleOutputEn: [
      '1. Ground it in the subject: the audience is people who grind their own beans and the page\'s main job is to get the first bag ordered (if the brief does not say, propose it and confirm)',
      '2. Open with the most characteristic thing in this world, for example a roast card, rather than the default "big number + small label + gradient" treatment',
      '3. Typography carries the personality: one or two families chosen deliberately, not the defaults you reach for on any project; body line length under 80 characters',
      '4. Avoid common generated tells: no overused gradient accents and no identical card grids',
      '5. Use real subject-matter content throughout instead of placeholder text'
    ].join('\n'),
    artifactsZh: ['一份带明确审美方向的设计说明', '落地页的实现代码', '字体与配色选择的理由'],
    artifactsEn: ['A design note with a clear aesthetic direction', 'The landing-page implementation', 'Reasons for the type and colour choices'],
    checksZh: ['首屏从题材本身出发，不是通用模板', '字体选择有理由，行宽合理', '内容是真实题材内容而不是占位文字'],
    checksEn: ['The hero comes from the subject itself, not a generic template', 'Type choices have a reason and line length is sensible', 'Content is real subject matter rather than placeholder text']
  },
  'ui-design-refs': {
    exampleTitleZh: '为作品集站挑参考站，并写进实现简报',
    exampleTitleEn: 'Pick reference sites for a portfolio and write them into the build brief',
    exampleInputZh: '我在改版个人作品集，气质想要安静、编辑感。技术栈是 Vue。请帮我选 UI 参考。',
    exampleInputEn: 'I am redesigning a personal portfolio with a quiet, editorial mood. The stack is Vue. Help me pick UI references.',
    exampleOutputZh: [
      '1. 读你的气质、技术栈和是否商用',
      '2. 打开参考清单：每个品类最多挑 1–3 个链接（整站灵感、组件、配色素材）',
      '3. 对每个候选：打开页面 → 记下可复用点（布局 / 组件 / 动效 / 配色）→ 检查授权与栈兼容',
      '4. 写进实现简报：选中的链接 + 要借鉴的点 + 不要照搬的品牌资产',
      '',
      '硬规则：不一次引用超过 3 个重动效库；不原样搬参考站的 Logo、插画和品牌色；付费库没买就只作视觉参考。'
    ].join('\n'),
    exampleOutputEn: [
      '1. Read the mood, stack and whether it is for commercial use',
      '2. Open the catalog and take at most 1-3 links per category (whole-site inspiration, components, colour assets)',
      '3. For each candidate: open the page -> note what can be reused (layout / components / motion / colour) -> check licence and stack compatibility',
      '4. Write into the build brief: chosen links + what to borrow + brand assets not to copy',
      '',
      'Hard rules: never cite more than 3 heavy-motion libraries; never copy a reference site\'s logo, illustrations or brand colours as-is; use paid libraries you have not bought as visual reference only.'
    ].join('\n'),
    artifactsZh: ['一份实现简报：选中的链接、要借鉴的点、不照搬的资产', '每个候选的授权与栈兼容检查结果'],
    artifactsEn: ['A build brief: chosen links, what to borrow, assets not to copy', 'Licence and stack compatibility notes for each candidate'],
    checksZh: ['每个品类的链接不超过 3 个', '简报里写明了授权风险', '没有把参考站的品牌资产列为要用的素材'],
    checksEn: ['No more than 3 links per category', 'Licence risks are stated in the brief', 'No reference site\'s brand assets are listed as material to use']
  },
  'haiwai-monetize-convert': {
    exampleTitleZh: '出海站有了流量，决定怎么变现',
    exampleTitleEn: 'An overseas site is getting traffic; decide how to monetise it',
    exampleInputZh: '我的新词站每天有一些自然流量，已经上了登录，但还没接支付。下一步怎么走？',
    exampleInputEn: 'My new-keyword site gets some organic traffic a day and has login, but no payment yet. What next?',
    exampleOutputZh: [
      '先确认阶段：已有登录、无支付；变现形态要订阅、积分包还是两者；GA4 与后台订单表是否打通；是否接了行为观测工具。',
      '',
      '建议顺序',
      '1. 支付前：首页保留可点的生成入口（假生成也行），先把停留拉长',
      '2. 定价：高价一次性积分包做锚点，主推限时促销月订',
      '3. 套餐文案：先照抄一个竞品站，再按数据改；有订单没人付款就先改价值主张文案',
      '4. 埋点：让 GA4 与支付事件对齐，对账用后台订单表',
      '5. 风控：开 Stripe Radar；年付大单单独记账，不算稳定 MRR',
      '',
      '案例里的金额只能当参考，不是你的目标指标。'
    ].join('\n'),
    exampleOutputEn: [
      'Confirm the stage first: login but no payment; subscription, credit packs or both; whether GA4 and the order table are connected; whether behaviour tools are installed.',
      '',
      'Suggested order',
      '1. Before payment: keep a clickable generate entry on the homepage (a fake generation is fine) to lengthen time on site',
      '2. Pricing: a high-priced one-off credit pack as the anchor, with a limited-time monthly subscription as the main offer',
      '3. Plan copy: copy a competitor first, then adjust with data; if orders exist but nobody pays, change the value proposition copy first',
      '4. Tracking: align GA4 with payment events and reconcile against the order table',
      '5. Risk: turn on Stripe Radar; book large annual deals separately, not as stable MRR',
      '',
      'Figures in the case study are only for reference, not your target metrics.'
    ].join('\n'),
    artifactsZh: ['按阶段排好的变现行动清单', '定价与套餐文案草案', '埋点与对账检查表'],
    artifactsEn: ['A stage-ordered monetisation action list', 'Draft pricing and plan copy', 'A tracking and reconciliation checklist'],
    checksZh: ['没有把案例金额写成你的承诺指标', '年付大单没有被算进稳定月收入', '支付事件与分析事件能对上'],
    checksEn: ['Case-study figures are not written up as your promised targets', 'Large annual deals are not counted as stable monthly revenue', 'Payment events can be matched to analytics events']
  },
  'writing-skills': {
    exampleTitleZh: '把一套验证过的排查流程写成可复用的技能',
    exampleTitleEn: 'Write a proven troubleshooting routine into a reusable skill',
    exampleInputZh: '我总结出一套排查线上缓存问题的方法，想固化成一个 SKILL.md。',
    exampleInputEn: 'I have a method for diagnosing production cache issues and want to turn it into a SKILL.md.',
    exampleOutputZh: [
      '1. 先判断值不值得写：这套方法不显而易见、以后还会反复用、适用面不只一个项目 → 值得；一次性解法或项目专属约定 → 不写',
      '2. 红：先用子代理跑压力场景，在没有技能时逐字记录它犯的错和借口（基线行为）',
      '3. 绿：只针对这些具体违规写技能，再跑一遍确认代理开始遵守',
      '4. 重构：发现新借口就堵上，重新验证',
      '5. 内容形式：写成可复用的参考指南，不要写成「我某次怎么解决的」的叙事复盘'
    ].join('\n'),
    exampleOutputEn: [
      '1. Decide whether it is worth writing: the method is non-obvious, will be reused and applies beyond one project -> worth it; a one-off fix or a project-specific convention -> do not write it',
      '2. Red: run pressure scenarios with a subagent and record, word for word, the mistakes and excuses it makes without the skill (baseline behaviour)',
      '3. Green: write the skill against those specific violations only, then run again to confirm the agent now complies',
      '4. Refactor: close any new loopholes and re-verify',
      '5. Form: a reusable reference guide, not a narrative of how you solved it once'
    ].join('\n'),
    artifactsZh: ['一份 SKILL.md', '基线记录：没有技能时代理的错误与借口', '加了技能后的复测结果'],
    artifactsEn: ['A SKILL.md', 'Baseline notes: the agent\'s mistakes and excuses without the skill', 'Re-test results with the skill in place'],
    checksZh: ['写技能前亲眼看过代理在没有技能时犯错', '技能只针对记录到的违规行为', '内容是可复用指南而不是叙事复盘'],
    checksEn: ['The agent was seen failing without the skill before writing it', 'The skill targets only the recorded violations', 'The content is a reusable guide, not a story']
  },
  'verification-before-completion': {
    exampleTitleZh: '准备说「修好了」之前，先跑验证',
    exampleTitleEn: 'Run verification before saying "fixed"',
    exampleInputZh: '我刚改完一个登录 bug，请确认可以提交了。',
    exampleInputEn: 'I just fixed a login bug. Please confirm it is ready to commit.',
    exampleOutputZh: [
      '不会直接回答「应该可以」。门禁流程：',
      '1. 定位：哪条命令能证明这个断言？—— 原始复现步骤 + 测试命令',
      '2. 运行：现在完整跑一遍，不用上次的结果',
      '3. 读：读完整输出，看退出码，数失败数',
      '4. 验证：输出支持「修好了」吗？',
      '',
      '如果有 2 个测试失败：如实报告「2 个失败」和失败信息，不说通过。',
      '如果全绿：带着命令和输出说「复现步骤已通过，测试 0 失败」，再提交。',
      '',
      '「应该」「大概」「看起来」都是红线词。'
    ].join('\n'),
    exampleOutputEn: [
      'It will not answer "should be fine". The gate:',
      '1. Locate: which command proves the claim? The original reproduction steps plus the test command',
      '2. Run: run it in full now, not reuse an earlier result',
      '3. Read: read the whole output, check the exit code, count failures',
      '4. Verify: does the output support "fixed"?',
      '',
      'If 2 tests fail: report "2 failures" with the messages, not "passing".',
      'If all green: say "reproduction steps pass, 0 test failures" with the command and output, then commit.',
      '',
      '"Should", "probably" and "looks like" are red-flag words.'
    ].join('\n'),
    artifactsZh: ['验证命令与完整输出', '基于证据的状态结论', '未验证项清单（如果有）'],
    artifactsEn: ['The verification command and its full output', 'A status statement based on evidence', 'A list of anything not verified, if applicable'],
    checksZh: ['断言来自刚刚跑的那一次命令，不是上次的结果', '失败如实报告，没有被说成通过', '没有在验证前表达「搞定」之类的满意'],
    checksEn: ['The claim comes from a command run just now, not an earlier result', 'Failures are reported as failures, not as passes', 'No "done!" satisfaction is expressed before verification']
  },
  'ai-project-delivery': {
    exampleTitleZh: '给现有项目加一个功能，按交付流程走完',
    exampleTitleEn: 'Add a feature to an existing project and follow the delivery flow',
    exampleInputZh: '给我的网站加一个暗色模式切换，用户选择要记住。',
    exampleInputEn: 'Add a dark-mode toggle to my site and remember the user\'s choice.',
    exampleOutputZh: [
      '阶段 1 · 澄清：目标是页面可切换主题并记住选择；验收 3–7 条（点击切换、刷新后保持、无闪烁等）；范围不含重做配色；风险：无数据与权限变更。',
      '阶段 2 · 勘察：看目录与依赖、现有样式变量和测试命令，确认当前构建基线，列出准备修改的文件。',
      '阶段 3 · 计划：拆成小任务，每个任务写验证方法和失败时的恢复方式。',
      '之后分步编码、测试验证。',
      '',
      '交付说明包含：改了什么、为什么改、如何验证、哪些没验证、如何回滚。'
    ].join('\n'),
    exampleOutputEn: [
      'Stage 1 · Clarify: the goal is a page-level theme toggle that remembers the choice; 3-7 acceptance checks (toggle on click, persists after reload, no flash, etc.); scope excludes a palette redo; risk: no data or permission changes.',
      'Stage 2 · Survey: read the directory and dependencies, existing style variables and test commands, confirm the current build baseline, and list the files to change.',
      'Stage 3 · Plan: split into small tasks, each with a verification method and a recovery step if it fails.',
      'Then implement step by step and verify.',
      '',
      'The delivery note covers: what changed, why, how it was verified, what was not verified, and how to roll back.'
    ].join('\n'),
    artifactsZh: ['交付简报（目标、验收标准、范围、风险）', '实现代码与测试结果', '交付说明：改动、验证、未验证项、回滚方式'],
    artifactsEn: ['A delivery brief (goal, acceptance checks, scope, risks)', 'Code and test results', 'A delivery note: changes, verification, unverified items, rollback'],
    checksZh: ['没有顺手重写无关模块', '测试、构建结果都是真实运行得到的', '没有读取、输出或提交密钥'],
    checksEn: ['No unrelated modules were rewritten along the way', 'Test and build results come from real runs', 'No secrets were read, printed or committed']
  },
  'content-repurpose': {
    exampleTitleZh: '一篇长文拆成多平台内容',
    exampleTitleEn: 'Split one long article into several platform versions',
    exampleInputZh: '这是我写的一篇 3000 字公众号文章，请改成适合 X 和邮件的版本。',
    exampleInputEn: 'Here is my 3,000-word WeChat article. Turn it into versions for X and for email.',
    exampleOutputZh: [
      '1. 识别素材：记下核心论点、证据、案例、关键数字、可引用原句；缺口明确标出，不用常识补',
      '2. 母稿：3–5 句说明要回答什么问题、最值得传播的结论、支撑证据、必须保留的限制',
      '3. X 版本：一个清晰观点配一个可验证的理由；长线程按逻辑递进，不拆成空洞金句',
      '4. 邮件版本：先说读者为什么现在需要知道，再说下一步是什么',
      '5. 事实回查：所有数字、人名、日期、引语逐项对照原文',
      '',
      '交付：母稿摘要 + 两个可直接编辑的版本 + 每版的目标读者与字数 + 需要你确认的事实点'
    ].join('\n'),
    exampleOutputEn: [
      '1. Identify the material: note the core claim, evidence, cases, key numbers and quotable lines; mark any gaps rather than filling them with common sense',
      '2. Master summary: 3-5 sentences on the question answered, the most shareable conclusion, supporting evidence and the limits that must stay',
      '3. X version: one clear view with one verifiable reason; threads advance logically instead of becoming empty one-liners',
      '4. Email version: why the reader needs to know now, then what to do next',
      '5. Fact check: every number, name, date and quote checked against the original',
      '',
      'Delivered: master summary + two editable versions + target reader and length per version + facts for you to confirm'
    ].join('\n'),
    artifactsZh: ['母稿摘要', 'X 版本和邮件版本', '待作者确认的事实与敏感点'],
    artifactsEn: ['A master summary', 'The X and email versions', 'Facts and sensitive points for the author to confirm'],
    checksZh: ['没有加入原文没有的经历、数据或业绩', '作者的立场和限定没有被改掉', '数字、人名、日期、引语都和原文一致'],
    checksEn: ['No experiences, data or results that are absent from the original were added', 'The author\'s stance and hedges are intact', 'Numbers, names, dates and quotes match the original']
  },
  'browser-automation': {
    exampleTitleZh: '把重复的后台录入整理成可恢复的流程',
    exampleTitleEn: 'Turn repetitive back-office entry into a recoverable routine',
    exampleInputZh: '我每周要把一份表格里的 50 条记录手工录进某个网页后台，想让 Agent 帮忙。',
    exampleInputEn: 'Every week I type 50 rows from a spreadsheet into a web back office by hand and want an agent to help.',
    exampleOutputZh: [
      '1. 勘察：确认网站、登录状态、输入来源、完成条件，以及哪些操作会产生外部影响',
      '2. 状态机：进入页面 → 等待目标状态 → 读取当前值 → 填写 → 验证结果 → 记录结果；每步写明成功条件和超时处理',
      '3. 安全：先用 3 条做样本试跑，确认结果后再扩大；提交这类有外部影响的动作，除非你已明确授权，否则先确认',
      '4. 可靠性：用语义定位而非屏幕坐标；提交后重读页面确认；只对幂等操作自动重试，防止重复创建',
      '5. 不尝试绕过验证码或访问限制，遇到就停下交给你'
    ].join('\n'),
    exampleOutputEn: [
      '1. Survey: confirm the site, login state, input source, completion condition, and which actions have external effects',
      '2. State machine: open page -> wait for target state -> read current value -> fill -> verify result -> log result; each step has a success condition and timeout handling',
      '3. Safety: trial-run 3 rows first and widen only after checking; actions with external effects such as submitting need confirmation unless you have clearly authorised them',
      '4. Reliability: semantic locators instead of screen coordinates; re-read the page after each submit; auto-retry only idempotent actions to avoid duplicate records',
      '5. It does not try to bypass CAPTCHAs or access limits; it stops and hands over to you'
    ].join('\n'),
    artifactsZh: ['步骤表（含成功条件和失败恢复）', '输入输出约定与权限需求', '每条记录的结果日志'],
    artifactsEn: ['A step table with success conditions and recovery', 'Input/output conventions and permission needs', 'A per-record result log'],
    checksZh: ['批量操作之前先跑过小样本', '失败可以停止或恢复，不会无限重试', '日志里没有敏感字段'],
    checksEn: ['A small sample was run before the batch', 'Failures can stop or recover instead of retrying forever', 'No sensitive fields appear in the log']
  },
  'data-analysis': {
    exampleTitleZh: '付费转化率下降，先查口径再给结论',
    exampleTitleEn: 'Paid conversion fell: check definitions before drawing conclusions',
    exampleInputZh: '上周付费转化率比前一周低了很多，附上订单和访问事件导出。请分析原因并给出下一步。',
    exampleInputEn: 'Paid conversion dropped sharply last week compared with the week before. Order and visit event exports attached. Analyse the cause and suggest next steps.',
    exampleOutputZh: [
      '1. 决策问题：要决定的是继续投放、还是先修产品；观察单位是用户还是会话要先说清',
      '2. 数据质量：查空值、重复订单、时区、事件延迟、去重口径；两周的口径不一致就先指出，不直接比较',
      '3. 分析路径：按漏斗（访问 → 注册 → 下单 → 付费）逐步看转化，再按渠道、新老用户、版本分群，避免总体平均掩盖差异',
      '4. 结论格式：事实 / 可能解释 / 证据强弱 / 业务影响 / 建议动作，分开写，不把相关性写成因果',
      '5. 决策输出：1–3 个动作，写清目标指标、验证窗口、成功阈值和停止条件'
    ].join('\n'),
    exampleOutputEn: [
      '1. Decision question: whether to keep spending on acquisition or fix the product first; state whether the unit is users or sessions',
      '2. Data quality: check nulls, duplicate orders, time zones, event delay and dedup rules; if the two weeks use different definitions, say so instead of comparing directly',
      '3. Analysis path: walk the funnel (visit -> sign-up -> order -> paid), then segment by channel, new vs returning and version so the overall average does not hide differences',
      '4. Conclusion format: fact / possible explanation / strength of evidence / business impact / recommended action, kept separate, with no correlation presented as causation',
      '5. Decision output: 1-3 actions with target metric, validation window, success threshold and stop condition'
    ].join('\n'),
    artifactsZh: ['数据质量问题清单与影响说明', '漏斗与分群的计算结果（含分子分母与样本量）', '1–3 个带阈值的建议动作'],
    artifactsEn: ['A data-quality issue list with their effect on conclusions', 'Funnel and segment results with numerators, denominators and sample sizes', '1-3 recommended actions with thresholds'],
    checksZh: ['比较的是同口径、同时间窗的数据', '关键结果抽样复算过', '证据不足的原因写成待验证假设，不写成结论'],
    checksEn: ['Comparisons use the same definitions and time windows', 'Key results were spot-checked by recomputation', 'Causes without enough evidence are written as hypotheses to test, not conclusions']
  }
}
