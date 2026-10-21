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
  }
}
