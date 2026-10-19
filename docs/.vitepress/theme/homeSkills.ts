import skillPackages from './data/skill-packages.json'

export const SKILL_COPY_FEEDBACK_MS = 1600

export interface SkillDetailCopy {
  metaZh: string
  metaEn: string
  leadZh: string
  leadEn: string
  gainsZh: string[]
  gainsEn: string[]
  fitZh: string[]
  fitEn: string[]
  unfitZh: string[]
  unfitEn: string[]
  sampleZh: string
  sampleEn: string
  stepsZh: string[]
  stepsEn: string[]
  exampleTitleZh?: string
  exampleTitleEn?: string
  exampleInputZh?: string
  exampleInputEn?: string
  exampleOutputZh?: string
  exampleOutputEn?: string
  artifactsZh?: string[]
  artifactsEn?: string[]
  checksZh?: string[]
  checksEn?: string[]
}

export interface SkillFilterOption {
  id: string
  labelZh: string
  labelEn: string
  skillIds: readonly string[]
}

export const SKILL_TYPE_FILTERS: readonly SkillFilterOption[] = [
  { id: 'writing', labelZh: '写作', labelEn: 'Writing', skillIds: ['de-ai-writing', 'content-repurpose'] },
  { id: 'ui', labelZh: 'UI', labelEn: 'UI', skillIds: ['ai-ui-design', 'frontend-design', 'ui-design-refs'] },
  { id: 'site-build', labelZh: '建站', labelEn: 'Site build', skillIds: ['personal-site-build', 'website-launch-check'] },
  { id: 'diagram', labelZh: '图解', labelEn: 'Diagram', skillIds: ['diagram-design'] },
  { id: 'anatomy', labelZh: '解剖', labelEn: 'Anatomy', skillIds: ['anatomy'] },
  { id: 'cover', labelZh: '封面', labelEn: 'Cover', skillIds: ['cover_image_gen'] },
  { id: 'connector', labelZh: '连接', labelEn: 'Connector', skillIds: ['custom_connector_setup'] },
  { id: 'haiwai', labelZh: '出海', labelEn: 'Overseas', skillIds: ['haiwai-new-keyword-launch', 'haiwai-monetize-convert'] },
  { id: 'coding', labelZh: '开发', labelEn: 'Development', skillIds: ['ai-project-delivery'] },
  { id: 'automation', labelZh: '自动化', labelEn: 'Automation', skillIds: ['browser-automation'] },
  { id: 'analytics', labelZh: '数据分析', labelEn: 'Analytics', skillIds: ['data-analysis'] },
  { id: 'method', labelZh: '方法', labelEn: 'Method', skillIds: ['writing-skills', 'brainstorming', 'systematic-debugging', 'verification-before-completion', 'writing-plans'] }
]

/** 只保留和类型筛选结果不同的场景。产品前端等于 UI，接入服务等于连接。 */
export const SKILL_SCENE_FILTERS: readonly SkillFilterOption[] = [
  {
    id: 'site',
    labelZh: '官网内容',
    labelEn: 'Site content',
    skillIds: ['de-ai-writing', 'content-repurpose', 'diagram-design', 'cover_image_gen', 'personal-site-build', 'website-launch-check', 'frontend-design', 'ui-design-refs']
  },
  {
    id: 'figures',
    labelZh: '插图',
    labelEn: 'Figures',
    skillIds: ['diagram-design', 'anatomy']
  }
]

export const SKILL_FILTER_ALL = 'all'

export interface HomeSkill {
  id: string
  nameZh: string
  nameEn: string
  pitchZh: string
  pitchEn: string
  typeId: string
  chipZh: string
  chipEn: string
  image: string
  imageWidth: number
  imageHeight: number
  imageAltZh: string
  imageAltEn: string
  /** 复制时拉取的完整 SKILL.md，相对站点根路径 */
  promptPath: string
  /** SKILL.md frontmatter 里的 name，用来确认拉到的是这份正文 */
  promptName: string
  /** 技能包 ZIP，相对站点根路径 */
  zipPath: string
  zipFile: string
  /** 有详情页时为站内 slug，不含语言前缀，例如 skills/cover-image-gen */
  detailSlug?: string
  detail?: SkillDetailCopy
}

interface SkillPackageRef {
  id: string
  promptPath: string
  promptName: string
  zipPath: string
  zipFile: string
}

const packages = skillPackages as SkillPackageRef[]

function skillType(typeId: string): Pick<HomeSkill, 'typeId' | 'chipZh' | 'chipEn'> {
  const type = SKILL_TYPE_FILTERS.find((item) => item.id === typeId)
  if (!type) throw new Error(`missing skill type: ${typeId}`)
  return { typeId, chipZh: type.labelZh, chipEn: type.labelEn }
}

function skillFiles(id: string): Pick<HomeSkill, 'promptPath' | 'promptName' | 'zipPath' | 'zipFile'> {
  const item = packages.find((entry) => entry.id === id)
  if (!item) throw new Error(`missing skill package: ${id}`)
  return {
    promptPath: item.promptPath,
    promptName: item.promptName,
    zipPath: item.zipPath,
    zipFile: item.zipFile
  }
}

const SKILL_IMAGE_WIDTH = 800
const SKILL_IMAGE_HEIGHT = 450

export const homeSkills: HomeSkill[] = [
  {
    id: 'de-ai-writing',
    nameZh: '去AI味写作',
    nameEn: 'De-AI Writing',
    pitchZh: '按你的口吻写，或把成稿里的机器味清掉。',
    pitchEn: 'Write in your voice, or strip the machine tone from a draft.',
    ...skillType('writing'),
    image: '/images/skills/de-ai-writing.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '去AI味写作封面：纸上的手写中文，旁边一支红笔',
    imageAltEn: 'Cover for De-AI Writing: handwritten Chinese on paper beside a red pen',
    ...skillFiles('de-ai-writing')
  },
  {
    id: 'ai-ui-design',
    nameZh: 'AI界面设计规范',
    nameEn: 'AI Interface Design Rules',
    pitchZh: 'AI 聊天和 Agent 前端的界面与交互规范。',
    pitchEn: 'Interface rules for AI chat and agent front ends.',
    ...skillType('ui'),
    image: '/images/skills/ai-ui-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'AI 聊天界面示意：左侧深色边栏，右侧是一段对话',
    imageAltEn: 'AI chat demo: a dark sidebar and a conversation on the right',
    ...skillFiles('ai-ui-design')
  },
  {
    id: 'diagram-design',
    nameZh: '图解设计',
    nameEn: 'Diagram Design',
    pitchZh: '45 种静态图解，输出一份自包含 HTML。',
    pitchEn: 'Forty-five static diagrams, each a self-contained HTML file.',
    ...skillType('diagram'),
    image: '/images/skills/diagram-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '内容飞轮图：创造、分发、互动，再把数据反馈回来',
    imageAltEn: 'Content flywheel: create, distribute, engage, then feed data back',
    ...skillFiles('diagram-design')
  },
  {
    id: 'anatomy',
    nameZh: '等轴测解剖图',
    nameEn: 'Isometric Anatomy',
    pitchZh: '把技术概念画成可交互的等轴测小仪器。',
    pitchEn: 'Draw a technical idea as an interactive isometric instrument.',
    ...skillType('anatomy'),
    image: '/images/skills/anatomy.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '等轴测解剖图：分层几何结构，侧面有标注线',
    imageAltEn: 'Isometric cutaway of a layered geometric structure with callout lines',
    ...skillFiles('anatomy')
  },
  {
    id: 'cover_image_gen',
    nameZh: '封面图生成',
    nameEn: 'Cover Image Generation',
    pitchZh: '3D 纸雕黏土风封面，同题三版，逐字验过再交付。',
    pitchEn: 'Paper-craft clay covers, three versions, Chinese title checked.',
    ...skillType('cover'),
    image: '/images/skills/cover_image_gen.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '封面图生成示意：3D 纸雕黏土风，中文标题是封面图生成',
    imageAltEn: 'Paper-craft clay cover with the Chinese title 封面图生成',
    ...skillFiles('cover_image_gen'),
    detailSlug: 'skills/cover-image-gen',
    detail: {
      metaZh: 'cover_image_gen · 个人演示',
      metaEn: 'cover_image_gen · personal demo',
      leadZh: '把定好的中文标题做成网站、公众号或 X 的封面。固定 3D 纸雕黏土风，同一题出三版构图，标题逐字验过再交付。',
      leadEn:
        'Turn a finished Chinese title into a cover for the site, WeChat, or X. The look stays 3D paper-craft and clay: three compositions, then a character-by-character check.',
      gainsZh: [
        '固定的 3D 纸雕与黏土风封面',
        '同一中文标题的 3 版构图',
        '标题逐字验收后，再交付 JPG'
      ],
      gainsEn: [
        'A cover locked to the 3D paper-craft and clay style',
        'Three compositions of the same Chinese title',
        'A character-by-character check, then a JPG'
      ],
      fitZh: [
        '网站、公众号、X 推文需要一张头图',
        '标题已经定了，想直接出图',
        '文章头图或技能卡片要统一的主视觉'
      ],
      fitEn: [
        'You need a header for the site, a WeChat post, or an X post',
        'The title is already set and you want the image',
        'An article or a skill card needs one consistent main visual'
      ],
      unfitZh: [
        '正文里的静态结构图。用 diagram-design',
        '可交互的等轴测拆解。用 anatomy',
        '改文案口吻。用去AI味写作',
        '主标题是英文。这套流程按中文大标题逐字验收'
      ],
      unfitEn: [
        'Static diagrams in the body. Use diagram-design',
        'Interactive isometric cutaways. Use anatomy',
        'Rewriting the voice of the copy. Use De-AI Writing',
        'A cover whose main title is English. This flow checks Chinese characters one by one'
      ],
      sampleZh:
        "做网站封面。风格用 3D 纸雕黏土风。标题 '封面图生成'，黄底高亮 '封面'。场景：暖色桌面上的黏土字。出 3 版，中文逐字验收。",
      sampleEn:
        "Make a site cover in the 3D paper-craft clay style. Title '封面图生成', highlight '封面' on yellow. Scene: clay letters on a warm desk. Three compositions, then check every Chinese character.",
      stepsZh: [
        '点「复制技能」，把整段技能文本交给 Grok Bot 或 Cursor。',
        '用上面这句话说明标题、黄底高亮的词，以及封面用在哪。',
        '收回三版构图，对一下标题每一个字，再选一张用。'
      ],
      stepsEn: [
        'Choose Copy skill, then paste the text into Grok Bot or Cursor.',
        'Use the line above for the title, the words highlighted on yellow, and where the cover will go.',
        'Check every character on the three compositions, then pick one.'
      ]
    }
  },
  {
    id: 'custom_connector_setup',
    nameZh: '自定义连接器 / MCP',
    nameEn: 'Custom Connectors & MCPs',
    pitchZh: '把还没内置的第三方服务接到官网或助手。',
    pitchEn: 'Connect a third-party service the site or assistant does not include yet.',
    ...skillType('connector'),
    image: '/images/skills/custom_connector_setup.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '自定义连接器示意：中心是 AI Agent，周围连着 GitHub、数据库和 Slack',
    imageAltEn: 'Custom connector diagram: an AI agent in the center, linked to GitHub, a database, and Slack',
    ...skillFiles('custom_connector_setup'),
    detailSlug: 'skills/custom-connectors-mcp',
    detail: {
  metaZh: "MCP / 第三方连接 · 演示案例",
  "metaEn": "MCP & Integrations · demo",
  leadZh: "以最小权限把外部服务接入 Agent，并明确工具边界、认证方式、错误处理和测试办法。示例是设计方案，不代表已连接某个真实账号。",
  "leadEn": "Connect an external service to an agent with least privilege, explicit tool boundaries, authentication, error handling, and tests. This is a design example, not a claim that a real account was connected.",
  "gainsZh": [
    "连接器架构与工具清单",
    "权限和凭据处理方案",
    "成功、失败与边界测试矩阵"
  ],
  "gainsEn": [
    "Connector architecture and tool inventory",
    "Permission and credential-handling plan",
    "Success, failure, and boundary test matrix"
  ],
  fitZh: [
    "需要 Agent 读取或操作第三方服务",
    "现成集成无法覆盖关键工作流",
    "必须控制权限与数据暴露范围"
  ],
  "fitEn": [
    "An agent needs to read or act on a third-party service",
    "Existing integrations do not cover a key workflow",
    "Permissions and data exposure must be controlled"
  ],
  "unfitZh": [
    "要求把密钥硬编码进前端",
    "希望绕过授权或访问控制",
    "不清楚要解决什么工作流，只想“接个 MCP”"
  ],
  "unfitEn": [
    "You want secrets hardcoded in a frontend",
    "You want to bypass authorization or access controls",
    "There is no defined workflow beyond 'add MCP'"
  ],
  sampleZh: "给一个项目管理服务设计只读 MCP：Agent 可搜索任务、读取详情和列出状态；默认不允许创建、删除或修改任务，所有凭据放在服务端。",
  "sampleEn": "Design a read-only MCP server for a project-management service: the agent can search tasks, read details, and list statuses. Creating, deleting, or modifying tasks is disabled by default, and credentials stay server-side.",
  stepsZh: [
    "说明服务 API、认证方式、必须完成的任务和数据敏感级别。",
    "先设计工具 schema、权限范围和错误响应，再写代码。",
    "用成功、无权限、空结果、限流和超时用例测试；写明未覆盖的权限。"
  ],
  "stepsEn": [
    "Describe the service API, authentication, required tasks, and data sensitivity.",
    "Design tool schemas, scopes, and error responses before coding.",
    "Test success, forbidden, empty, rate-limited, and timeout cases; document untested permissions."
  ],
  exampleTitleZh: "示例：为任务系统提供只读查询",
  "exampleTitleEn": "Example: read-only access to a task system",
  "exampleInputZh": "需求：让 Agent 按关键词查任务、读取详情和状态；不能创建、更新或删除任务。数据只允许在用户当前授权范围内返回。",
  "exampleInputEn": "Requirement: let an agent search tasks and read details/status, but not create, update, or delete them. Return data only within the user's authorized scope.",
  exampleOutputZh: "工具定义（示意）
    search_tasks(query, status?, limit?)
    get_task(task_id)
    list_statuses()
    权限：read-only
    拒绝策略：写操作返回明确的 permission_denied；凭据只在服务端保存；日志不记录 token。",
  "exampleOutputEn": "Tool contract (illustrative)
    search_tasks(query, status?, limit?)
    get_task(task_id)
    list_statuses()
    Scope: read-only
    Policy: write operations return permission_denied; credentials remain server-side; logs never include tokens.",
  artifactsZh: [
    "MCP 工具 schema 与参数说明",
    "认证和最小权限矩阵",
    "错误码与重试策略",
    "测试用例及安全边界"
  ],
  "artifactsEn": [
    "MCP tool schemas and parameter notes",
    "Authentication and least-privilege matrix",
    "Error codes and retry policy",
    "Test cases and security boundaries"
  ],
  checksZh: [
    "默认权限最小化",
    "没有密钥进入前端或日志",
    "拒绝越权请求并返回可理解的错误"
  ],
  "checksEn": [
    "Permissions are minimized by default",
    "No secrets appear in frontend code or logs",
    "Unauthorized requests are rejected with clear errors"
  ]
}
  },
  {
    id: 'personal-site-build',
    nameZh: '个人网站搭建',
    nameEn: 'Personal Site Builder',
    pitchZh: '飞书底稿 + UI 参考站，从 0 搭个人/品牌站。',
    pitchEn: 'Feishu brief plus UI refs to build a personal or brand site from scratch.',
    ...skillType('site-build'),
    image: '/images/skills/personal-site-build.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '个人网站搭建封面：浏览器里的个人站，旁边是飞书文档和参考站卡片',
    imageAltEn: 'Cover for Personal Site Builder: a browser site beside a Feishu doc and reference cards',
    ...skillFiles('personal-site-build')
  },
  {
    id: 'frontend-design',
    nameZh: '前端设计',
    nameEn: 'Frontend Design',
    pitchZh: 'Anthropic 官方前端设计 Skill，做出有辨识度、不像 AI 默认审美的页面。',
    pitchEn: 'Anthropic’s frontend-design skill for distinctive UI that avoids generic AI looks.',
    ...skillType('ui'),
    image: '/images/skills/frontend-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '前端设计封面：深色代码编辑器，旁边是一张暖色的独特网页',
    imageAltEn: 'Cover for Frontend Design: a dark code editor beside a warm, distinctive webpage',
    ...skillFiles('frontend-design'),
    detailSlug: 'skills/frontend-design',
    detail: {
  metaZh: "UI 改造 · 演示案例",
  "metaEn": "UI Redesign · demo",
  leadZh: "用明确的视觉方向、设计令牌和响应式验收，把一个普通页面改造成有辨识度的界面。示例描述交付格式，不冒充已生成的实际截图。",
  "leadEn": "Use a clear visual direction, design tokens, and responsive checks to turn a generic page into a distinctive interface. The example shows the deliverable format, not a fabricated screenshot.",
  "gainsZh": [
    "设计方向与参考依据",
    "颜色、字号、间距等设计令牌",
    "页面组件与响应式验收清单"
  ],
  "gainsEn": [
    "A visual direction with references",
    "Design tokens for color, type, and spacing",
    "Component map and responsive acceptance checks"
  ],
  fitZh: [
    "现有页面看起来像默认 AI 模板",
    "需要先定义设计语言再开始编码",
    "希望桌面与手机体验一致"
  ],
  "fitEn": [
    "An existing page looks like a generic AI template",
    "You need a design system before coding",
    "Desktop and mobile experiences must stay coherent"
  ],
  "unfitZh": [
    "没有任何需求就要求“做得高级”",
    "要求复制其他品牌的标志或整套设计",
    "只需要静态插图而非界面"
  ],
  "unfitEn": [
    "You only say 'make it premium' without requirements",
    "You want to copy another brand's logo or entire design",
    "You only need a static illustration"
  ],
  sampleZh: "为一款面向独立开发者的轻量项目管理工具设计首页。风格：编辑部式排版、暖白底、深色文字、单一强调色；先给设计令牌与区块结构，再实现桌面和移动端。",
  "sampleEn": "Design a homepage for a lightweight project-management tool for indie developers. Direction: editorial typography, warm white background, dark text, one accent color. Define tokens and sections before implementing desktop and mobile.",
  stepsZh: [
    "提供目标用户、页面目标、技术栈和现有截图。",
    "让 Agent 先提出视觉方向与令牌，不要直接堆特效。",
    "实现后检查 1440px、768px 和 390px 视口，修复溢出和层级问题。"
  ],
  "stepsEn": [
    "Provide target users, page goal, tech stack, and existing screenshots.",
    "Ask for a visual direction and tokens before adding effects.",
    "After implementation, check 1440px, 768px, and 390px viewports for overflow and hierarchy issues."
  ],
  exampleTitleZh: "示例：重做工具产品首页",
  "exampleTitleEn": "Example: redesign a tool-product homepage",
  "exampleInputZh": "页面目标：让第一次访问的人在 5 秒内理解产品用途并找到试用入口。约束：保留现有路由与功能，不引入新 UI 框架。",
  "exampleInputEn": "Goal: help first-time visitors understand the product in five seconds and find the trial CTA. Constraints: keep existing routes and functionality; do not add a new UI framework.",
  exampleOutputZh: "交付片段
    设计方向：编辑部式、克制、强调内容层级
    令牌：背景 #F7F5F0；文字 #202124；强调色 #356859
    区块：Hero / 使用流程 / 示例结果 / FAQ / CTA
    响应式验收：1440px、768px、390px；检查导航折行、卡片宽度与按钮触控区
    色值仅为演示提案，需与现有品牌系统协调后确认。",
  "exampleOutputEn": "Deliverable excerpt
    Direction: restrained editorial layout with clear content hierarchy
    Tokens: background #F7F5F0; text #202124; accent #356859
    Sections: hero / workflow / sample result / FAQ / CTA
    Responsive checks: 1440px, 768px, 390px; inspect nav wrapping, card width, and CTA touch target
    Colors are a demo proposal and should be reconciled with the existing brand system.",
  artifactsZh: [
    "设计方向与参考理由",
    "设计令牌表",
    "页面区块与组件清单",
    "三种视口的验收结果"
  ],
  "artifactsEn": [
    "Visual direction and rationale",
    "Design-token table",
    "Page-section and component inventory",
    "Acceptance results for three viewport sizes"
  ],
  checksZh: [
    "没有引入未经确认的新框架",
    "关键功能和路由保持不变",
    "截图或测试结果与实际实现一致"
  ],
  "checksEn": [
    "No unapproved framework is introduced",
    "Existing key functions and routes remain intact",
    "Screenshots and test results match the implementation"
  ]
}
  },
  {
    id: 'ui-design-refs',
    nameZh: 'UI设计参考清单',
    nameEn: 'UI Design Refs',
    pitchZh: '8 大类 60+ UI 参考站，按场景挑链接再交给 AI。',
    pitchEn: 'Sixty-plus UI reference sites in eight buckets for agent-assisted builds.',
    ...skillType('ui'),
    image: '/images/skills/ui-design-refs.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'UI设计参考清单封面：浅色桌面上的参考站拼贴与设计卡片',
    imageAltEn: 'Cover for UI Design Refs: a light desk collage of reference sites and design cards',
    ...skillFiles('ui-design-refs')
  },
  {
    id: 'haiwai-new-keyword-launch',
    nameZh: '出海新词上站',
    nameEn: 'Overseas New-Keyword Launch',
    pitchZh: 'Trends 词根法 + D0–D5 当天上站，抢 SEO/GEO 红利。',
    pitchEn: 'Trends root words plus a D0–D5 same-day launch for the SEO/GEO window.',
    ...skillType('haiwai'),
    image: '/images/skills/haiwai-new-keyword-launch.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '出海新词上站封面：浏览器里的新词站，旁边是上升的搜索趋势图',
    imageAltEn: 'Cover for Overseas New-Keyword Launch: a browser site beside a rising search-trend chart',
    ...skillFiles('haiwai-new-keyword-launch'),
    detailSlug: 'skills/overseas-new-keyword-launch',
    detail: {
  metaZh: "SEO / GEO 增长 · 演示案例",
  "metaEn": "SEO / GEO Growth · demo",
  leadZh: "把一个细分搜索需求转成可发布、可索引、可持续验证的落地页。关键词热度和搜索意图必须用当前数据源验证，不能凭空编造。",
  "leadEn": "Turn a niche search need into a publishable, indexable landing page with a measurable validation plan. Search demand and intent must be checked against current sources, never invented.",
  "gainsZh": [
    "关键词根词与意图分组",
    "落地页结构、标题与 FAQ 草案",
    "上线检查和观察指标"
  ],
  "gainsEn": [
    "Keyword roots grouped by intent",
    "Landing-page structure, title, and FAQ draft",
    "Launch checks and monitoring metrics"
  ],
  fitZh: [
    "小型 SaaS、工具站或数字产品试水新词",
    "希望快速验证一个搜索需求",
    "需要把 SEO 与 GEO 内容结构结合"
  ],
  "fitEn": [
    "A small SaaS, tool site, or digital product testing a new query",
    "You want to validate search demand quickly",
    "You need SEO and GEO-friendly content structure"
  ],
  "unfitZh": [
    "要求保证排名或流量",
    "没有数据来源却要求声称搜索量很高",
    "打算批量生成低价值、重复页面"
  ],
  "unfitEn": [
    "You expect guaranteed rankings or traffic",
    "You want high-volume claims without a data source",
    "You plan to mass-produce thin, duplicate pages"
  ],
  sampleZh: "假设要验证“meeting notes to action items”这个英文工具需求。先查 Trends、搜索结果和竞品页面，再决定是否建页；未核验的数据一律标待验证。",
  "sampleEn": "Suppose you want to validate demand for a 'meeting notes to action items' tool. Check Trends, search results, and competitor pages before building; mark any unverified data as a hypothesis.",
  stepsZh: [
    "输入目标用户、产品能力、目标国家与语言。",
    "先收集并记录关键词来源、日期和搜索意图，不把猜测写成搜索数据。",
    "输出页面草案并部署后，检查索引状态与实际曝光，再决定是否扩展。"
  ],
  "stepsEn": [
    "Provide target users, product capabilities, countries, and language.",
    "Record keyword sources, dates, and intent; never present guesses as search data.",
    "Draft the page, then check indexation and actual impressions before expanding."
  ],
  exampleTitleZh: "示例：验证一个英文工具词是否值得做页面",
  "exampleTitleEn": "Example: validate whether an English tool query deserves a page",
  "exampleInputZh": "产品：把会议纪要整理成行动项的网页工具。目标：英语用户。问题：用户是在找模板、操作教程，还是在线工具？",
  "exampleInputEn": "Product: a web tool that turns meeting notes into action items. Audience: English-speaking users. Question: are searchers looking for a template, a how-to guide, or an online tool?",
  exampleOutputZh: "交付草案
    主词（待验证）：meeting notes to action items
    页面标题草案：Turn Meeting Notes into Clear Action Items
    页面模块：输入示例 / 处理步骤 / 输出样例 / 隐私说明 / FAQ
    上线后观察：收录状态、展示次数、点击率、工具启动率
    注意：以上关键词与标题是演示假设，不代表已验证的搜索量或排名机会。",
  "exampleOutputEn": "Draft deliverable
    Candidate query (unverified): meeting notes to action items
    Title draft: Turn Meeting Notes into Clear Action Items
    Sections: input example / workflow / output sample / privacy / FAQ
    Monitor after launch: indexation, impressions, CTR, tool-start rate
    Note: the query and title are illustrative hypotheses, not verified demand or ranking opportunities.",
  artifactsZh: [
    "关键词与搜索意图表（附来源和日期）",
    "落地页大纲与标题草案",
    "FAQ 与结构化数据建议",
    "上线后验证指标表"
  ],
  "artifactsEn": [
    "Keyword and intent table with source and date",
    "Landing-page outline and title draft",
    "FAQ and structured-data recommendations",
    "Post-launch validation metrics"
  ],
  checksZh: [
    "每个搜索量或趋势结论都有来源和日期",
    "把假设与已验证事实分开",
    "不承诺排名、流量或被 AI 引用"
  ],
  "checksEn": [
    "Every demand or trend claim has a source and date",
    "Hypotheses are separated from verified facts",
    "No ranking, traffic, or AI-citation guarantees"
  ]
}
  },
  {
    id: 'haiwai-monetize-convert',
    nameZh: '出海变现转化',
    nameEn: 'Overseas Monetize & Convert',
    pitchZh: '假生成、锚定定价、留存入口与 Stripe 埋点风控，提升付费转化。',
    pitchEn: 'Fake generation, anchor pricing, retention hooks, and Stripe event risk controls to lift paid conversion.',
    ...skillType('haiwai'),
    image: '/images/skills/haiwai-monetize-convert.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '出海变现转化封面：定价卡片、转化漏斗和支付界面',
    imageAltEn: 'Cover for Overseas Monetize & Convert: pricing cards, a conversion funnel, and a payment screen',
    ...skillFiles('haiwai-monetize-convert')
  },
  {
    id: 'writing-skills',
    nameZh: '技能编写',
    nameEn: 'Writing Skills',
    pitchZh: '把可复用的工作方法写成 Agent 能直接用的技能。',
    pitchEn: 'Turn a repeatable workflow into a skill an agent can use.',
    ...skillType('method'),
    image: '/images/skills/writing-skills.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '技能编写封面：纸上写着技能编写四个字，旁边有齿轮和文档',
    imageAltEn: 'Cover for Writing Skills: the Chinese title with gears and documents',
    ...skillFiles('writing-skills')
  },
  {
    id: 'brainstorming',
    nameZh: '头脑风暴',
    nameEn: 'Brainstorming',
    pitchZh: '动手之前，先问对问题，把真正想要的东西聊清楚。',
    pitchEn: 'Before building, ask the right questions and pin down what you really want.',
    ...skillType('method'),
    image: '/images/skills/brainstorming.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '头脑风暴封面：纸雕风格的对话气泡和灯泡',
    imageAltEn: 'Cover for Brainstorming: paper-craft speech bubbles and a light bulb',
    ...skillFiles('brainstorming')
  },
  {
    id: 'systematic-debugging',
    nameZh: '系统化排查',
    nameEn: 'Systematic Debugging',
    pitchZh: '按四阶段排查：先找根因，再动手修。',
    pitchEn: 'Debug in four phases: find the root cause before you fix.',
    ...skillType('method'),
    image: '/images/skills/systematic-debugging.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '系统化排查封面：放大镜对准纸雕齿轮',
    imageAltEn: 'Cover for Systematic Debugging: a magnifier over paper-craft gears',
    ...skillFiles('systematic-debugging')
  },
  {
    id: 'verification-before-completion',
    nameZh: '交付前验证',
    nameEn: 'Verification Before Completion',
    pitchZh: '宣称完成之前，先拿出证据。',
    pitchEn: 'Evidence before claims: verify before you say done.',
    ...skillType('method'),
    image: '/images/skills/verification-before-completion.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '交付前验证封面：纸雕对勾和检查清单',
    imageAltEn: 'Cover for Verification Before Completion: a paper-craft checkmark and checklist',
    ...skillFiles('verification-before-completion')
  },
  {
    id: 'writing-plans',
    nameZh: '写计划',
    nameEn: 'Writing Plans',
    pitchZh: '多步骤任务先写成计划，再动手执行。',
    pitchEn: 'Write the plan first, then execute multi-step tasks.',
    ...skillType('method'),
    image: '/images/skills/writing-plans.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '写计划封面：纸雕台阶拾级而上，顶端有旗帜',
    imageAltEn: 'Cover for Writing Plans: paper-craft steps climbing to a flag',
    ...skillFiles('writing-plans')
  },
  {
    id: 'ai-project-delivery',
    nameZh: 'AI 项目交付',
    nameEn: 'AI Project Delivery',
    pitchZh: '从需求澄清到测试验收，让 AI Coding 的交付过程可追踪、可验证。',
    pitchEn: 'Make AI-assisted development traceable and verifiable, from requirements to testing.',
    ...skillType('coding'),
    image: '/images/skills/frontend-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '代码与网页界面示意图，代表 AI 项目的实现和验证过程',
    imageAltEn: 'Code and web interface illustration representing AI project implementation and verification',
    ...skillFiles('ai-project-delivery'),
    detailSlug: 'skills/ai-project-delivery',
    detail: {
  metaZh: "AI 项目交付 · 演示案例",
  "metaEn": "AI Project Delivery · demo",
  leadZh: "以一个具体需求为起点，把 AI Coding 从“改了代码”推进到可审查、可测试、可交接的交付。以下是演示场景，不代表真实客户项目或实测结果。",
  "leadEn": "Start from a concrete requirement and turn AI-assisted coding into a reviewable, testable handoff. This is an illustrative scenario, not a client case or measured result.",
  "gainsZh": [
    "需求澄清与边界清单",
    "可执行的实现任务与风险点",
    "测试证据、变更摘要和交接说明"
  ],
  "gainsEn": [
    "A clarified requirement and scope",
    "Actionable implementation tasks and risks",
    "Test evidence, change summary, and handoff notes"
  ],
  fitZh: [
    "让 AI 修改已有代码库",
    "功能跨多个文件或有回归风险",
    "需要把任务交给另一位开发者验收"
  ],
  "fitEn": [
    "Using AI to modify an existing repository",
    "Changes span files or risk regressions",
    "A developer needs a verifiable handoff"
  ],
  "unfitZh": [
    "只想随手问一段代码怎么写",
    "没有代码库，也不需要实现或验收",
    "要求跳过测试并宣称完成"
  ],
  "unfitEn": [
    "You only need a quick coding explanation",
    "There is no repository or implementation to verify",
    "You want to skip tests and claim completion"
  ],
  sampleZh: "为现有网页增加一个可筛选的技能目录。先阅读项目结构，不要重写无关模块；实现后运行构建和现有检查，列出改动文件、测试结果及未验证项。",
  "sampleEn": "Add a filterable skills catalog to an existing site. Inspect the repository first, avoid unrelated rewrites, run the build and existing checks, then report changed files, test results, and anything not verified.",
  stepsZh: [
    "把技能文本交给支持 Skills 的编程 Agent。",
    "提供仓库路径、目标行为、限制和验收标准。",
    "要求 Agent 先列计划，再实施；完成后逐项附上测试证据。"
  ],
  "stepsEn": [
    "Give the skill to a coding agent that supports Skills.",
    "Provide the repository, desired behavior, constraints, and acceptance criteria.",
    "Ask for a plan before implementation, then require evidence for each check."
  ],
  exampleTitleZh: "示例：为现有网站增加筛选功能",
  "exampleTitleEn": "Example: add filtering to an existing site",
  "exampleInputZh": "需求：目录页增加“类型”筛选；筛选后卡片数量、空状态与 URL 行为正确；不改变现有卡片样式。",
  "exampleInputEn": "Request: add a type filter to a catalog. Card counts, empty state, and URL behavior must remain correct without changing existing card styling.",
  exampleOutputZh: "交付摘要
    - 变更：筛选状态、卡片过滤逻辑、空状态
    - 验收：全部 / 单一类型 / 无匹配结果
    - 自动检查：构建、类型检查、SEO 检查
    - 待确认：真实移动端点击体验（若未在设备上验证）",
  "exampleOutputEn": "Handoff summary
    - Changes: filter state, card filtering, empty state
    - Checks: all items / one type / no matches
    - Automated: build, type checks, SEO checks
    - Follow-up: real-device touch behavior if not tested on a device",
  artifactsZh: [
    "需求与非目标清单",
    "按文件拆分的实现计划",
    "测试记录与变更摘要",
    "未验证项和回滚建议"
  ],
  "artifactsEn": [
    "Requirements and non-goals",
    "File-level implementation plan",
    "Test log and change summary",
    "Unverified items and rollback notes"
  ],
  checksZh: [
    "每条需求都有对应验收项",
    "报告中的测试结果来自实际命令或明确标为未验证",
    "没有夹带无关重构"
  ],
  "checksEn": [
    "Every requirement maps to an acceptance check",
    "Test results come from real commands or are marked unverified",
    "No unrelated refactor is included"
  ]
}
  },
  {
    id: 'website-launch-check',
    nameZh: '网站上线验收',
    nameEn: 'Website Launch QA',
    pitchZh: '发布前逐项检查核心路径、移动端、SEO、分享卡与回滚方案。',
    pitchEn: 'Verify core flows, mobile layout, SEO, share previews, and rollback before launch.',
    ...skillType('site-build'),
    image: '/images/skills/personal-site-build.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '网站上线验收：网页与发布检查清单',
    imageAltEn: 'Website launch QA: a webpage and release checklist',
    ...skillFiles('website-launch-check'),
    detailSlug: 'skills/website-launch-check',
    detail: {
  metaZh: "网站上线验收 · 演示案例",
  "metaEn": "Website Launch QA · demo",
  leadZh: "发布前用可复现的检查项找出阻断问题，而不是只凭视觉感觉说“没问题”。示例为演示流程，不代表已检查某个真实生产站。",
  "leadEn": "Use reproducible checks to find release blockers instead of declaring a site fine by appearance. This is a demo workflow, not an audit of a real production site.",
  "gainsZh": [
    "关键路径验收表",
    "SEO 与分享预览检查",
    "按严重程度排序的问题清单"
  ],
  "gainsEn": [
    "A core-flow acceptance checklist",
    "SEO and share-preview checks",
    "A severity-ranked issue list"
  ],
  fitZh: [
    "网站即将发布或刚改版",
    "有登录、表单、下载或支付等关键流程",
    "需要交付给负责人签字确认"
  ],
  "fitEn": [
    "A site is about to launch or was redesigned",
    "There are key flows such as forms, downloads, login, or payment",
    "A release owner needs sign-off evidence"
  ],
  "unfitZh": [
    "只想重新设计页面风格",
    "没有测试环境且拒绝标注未验证项",
    "希望仅凭一次构建就保证线上所有功能正常"
  ],
  "unfitEn": [
    "You only want to redesign the visual style",
    "There is no test environment and unverified items must be hidden",
    "You expect one build to guarantee every production flow"
  ],
  sampleZh: "检查一个即将发布的产品落地页：主按钮、注册表单、移动端菜单、404、OG 分享图、canonical、sitemap 和构建结果。",
  "sampleEn": "Check a product landing page before launch: primary CTA, signup form, mobile navigation, 404, Open Graph image, canonical URL, sitemap, and build result.",
  stepsZh: [
    "提供预览地址、生产域名、主要用户路径和发布方式。",
    "让 Agent 逐项记录预期、实际、证据与状态。",
    "先修复阻断项；只有真实部署结果返回成功后才标记已上线。"
  ],
  "stepsEn": [
    "Provide the preview URL, production domain, key user flows, and deployment method.",
    "Record expected behavior, actual behavior, evidence, and status for every check.",
    "Fix blockers first; mark deployed only after receiving a real successful deployment result."
  ],
  exampleTitleZh: "示例：一个产品落地页的发布前检查",
  "exampleTitleEn": "Example: pre-launch checks for a product landing page",
  "exampleInputZh": "环境：预览站。关键路径：打开首页 → 点击“开始使用” → 填写邮箱 → 提交。额外检查：手机宽度、404、分享图和站点地图。",
  "exampleInputEn": "Environment: preview site. Flow: open homepage → select Get Started → enter email → submit. Also check mobile width, 404, share image, and sitemap.",
  exampleOutputZh: "验收表（示例格式）
    项目             状态       证据
    构建             通过       npm run build
    注册提交         未验证     当前无测试账号
    移动端菜单       失败       390px 宽度下遮挡 CTA
    分享预览图       通过       OG 图片 URL 可访问
    结论：暂缓发布；先修复移动端遮挡，再补测注册流程。",
  "exampleOutputEn": "Acceptance table (illustrative format)
    Build             PASS       npm run build
    Signup submit     UNVERIFIED No test account
    Mobile navigation FAIL       CTA obscured at 390px
    Share image       PASS       OG image URL is reachable
    Decision: hold release; fix mobile overlap and test signup.",
  artifactsZh: [
    "发布阻断项 / 非阻断项列表",
    "关键路径验收表",
    "SEO 与社交分享预览清单",
    "部署状态与回滚步骤"
  ],
  "artifactsEn": [
    "Release blockers and non-blockers",
    "Core-flow acceptance table",
    "SEO and social preview checklist",
    "Deployment status and rollback steps"
  ],
  checksZh: [
    "区分通过、失败、未验证",
    "不伪造浏览器、设备或生产环境证据",
    "阻断问题有负责人可执行的修复建议"
  ],
  "checksEn": [
    "Distinguish pass, fail, and unverified",
    "Never fabricate browser, device, or production evidence",
    "Each blocker has an actionable remediation"
  ]
}
  },
  {
    id: 'content-repurpose',
    nameZh: '内容一稿多用',
    nameEn: 'Content Repurposing',
    pitchZh: '把一份原创素材改造成公众号、X、短帖和官网内容，保留事实与口吻。',
    pitchEn: 'Adapt one source into posts, articles, and web copy without losing facts or voice.',
    ...skillType('writing'),
    image: '/images/skills/de-ai-writing.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '内容一稿多用：同一份稿件整理成不同平台内容',
    imageAltEn: 'Content repurposing: one source adapted for multiple platforms',
    ...skillFiles('content-repurpose'),
    detailSlug: 'skills/content-repurpose',
    detail: {
  metaZh: "内容一稿多用 · 演示案例",
  "metaEn": "Content Repurposing · demo",
  leadZh: "从同一份原始素材出发，为不同平台重新组织内容，而不是机械缩写。下面是示例素材与交付片段；不添加未提供的事实、引语或数据。",
  "leadEn": "Start with one source and reshape it for each platform instead of mechanically shortening it. The source and deliverables below are illustrative; no unsupported facts, quotes, or metrics are added.",
  "gainsZh": [
    "一份母稿摘要与事实清单",
    "不同平台的独立版本",
    "待核实信息与发布前检查项"
  ],
  "gainsEn": [
    "A source brief and fact ledger",
    "Platform-specific versions",
    "A verification list for unresolved claims"
  ],
  fitZh: [
    "有文章、访谈、读书笔记或视频转写",
    "希望将一份素材拆成多平台内容",
    "需要保留个人口吻和事实边界"
  ],
  "fitEn": [
    "You have an article, interview, notes, or transcript",
    "One source needs to become multi-platform content",
    "You need to preserve voice and factual boundaries"
  ],
  "unfitZh": [
    "原始材料不完整却要求补造事实",
    "只想换标题而不考虑平台差异",
    "希望生成未经核验的引语或数据"
  ],
  "unfitEn": [
    "You want missing facts invented",
    "You only want a new headline without platform adaptation",
    "You need unverified quotes or numbers"
  ],
  sampleZh: "素材摘要：AI 编程让原型制作更快，但上线仍需要测试、用户反馈与维护。请保留这个边界，分别生成公众号提纲、X 短帖和官网 SEO 简介。",
  "sampleEn": "Source summary: AI coding speeds up prototyping, but launch still requires tests, user feedback, and maintenance. Preserve that boundary and create a WeChat outline, an X post, and an SEO description.",
  stepsZh: [
    "提供完整原文，并标注不能公开的内容。",
    "先提炼母稿、事实和不确定项，再按平台分别写。",
    "对照原文复核数字、人名、引用和语气后发布。"
  ],
  "stepsEn": [
    "Provide the full source and flag anything that must remain private.",
    "Extract the core brief, facts, and uncertainties before writing for each platform.",
    "Verify numbers, names, quotes, and tone against the source before publishing."
  ],
  exampleTitleZh: "示例：一份读书笔记拆成三种内容",
  "exampleTitleEn": "Example: turn one set of notes into three formats",
  "exampleInputZh": "原始观点：AI 能降低原型开发成本，但不能替代上线后的质量验证和用户反馈。没有统计数据，也没有可引用的研究。",
  "exampleInputEn": "Source claim: AI lowers prototype-development cost, but cannot replace post-launch quality checks and user feedback. No statistics or research quotes are provided.",
  exampleOutputZh: "公众号开头：AI 让做出第一个版本更便宜了，但“做出来”不等于“有人愿意用”。真正的验证从上线后才开始。
    X 短帖：AI 降低了原型成本，却没有取消产品验证。代码能运行，只能证明它暂时能运行；用户愿不愿意留下，是另一回事。
    官网描述：了解如何把 AI 辅助开发接入需求拆解、测试验收与用户反馈流程。",
  "exampleOutputEn": "WeChat opening: AI has made the first version cheaper to build, but 'built' does not mean 'wanted'. Real validation starts after launch.
    X post: AI lowers prototype costs; it does not remove product validation. Working code proves it runs for now—not that users will stay.
    SEO description: Learn how to connect AI-assisted development with requirements, testing, and user feedback.",
  artifactsZh: [
    "母稿摘要与事实边界",
    "公众号版本 / X 版本 / 官网描述",
    "各平台目标与字数说明",
    "待核实信息清单"
  ],
  "artifactsEn": [
    "Source brief and fact boundaries",
    "WeChat version / X version / SEO description",
    "Platform goals and length targets",
    "Unverified-information checklist"
  ],
  checksZh: [
    "所有事实都能回到原文",
    "没有虚构数字、引用和经历",
    "不同平台不是简单复制粘贴"
  ],
  "checksEn": [
    "Every factual claim traces back to the source",
    "No invented numbers, quotes, or experiences",
    "Platform versions are more than copy-paste"
  ]
}
  },
  {
    id: 'browser-automation',
    nameZh: '浏览器自动化流程',
    nameEn: 'Browser Automation Workflow',
    pitchZh: '把重复网页操作变成可验证、可恢复的流程，并为高风险动作保留确认。',
    pitchEn: 'Turn repetitive web tasks into verifiable, recoverable workflows with safe checkpoints.',
    ...skillType('automation'),
    image: '/images/skills/custom_connector_setup.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '浏览器自动化：网页流程与任务步骤',
    imageAltEn: 'Browser automation: a web workflow and task steps',
    ...skillFiles('browser-automation'),
    detailSlug: 'skills/browser-automation',
    detail: {
  metaZh: "浏览器自动化 · 演示案例",
  "metaEn": "Browser Automation · demo",
  leadZh: "把重复网页操作写成有状态、有验证、有恢复方案的流程。会发布、发送、付款或删除的动作需要明确授权，不以“点过按钮”当作成功。",
  "leadEn": "Turn repetitive browser work into a stateful workflow with verification and recovery. Publishing, sending, paying, or deleting requires explicit authorization; a click alone is not proof of success.",
  "gainsZh": [
    "步骤状态机与成功条件",
    "失败恢复与幂等策略",
    "人工确认点和执行日志"
  ],
  "gainsEn": [
    "A step state machine with success conditions",
    "Recovery and idempotency rules",
    "Human checkpoints and execution logs"
  ],
  fitZh: [
    "重复录入、整理和核对网页信息",
    "流程需要重试和失败恢复",
    "任务中有必须人工确认的动作"
  ],
  "fitEn": [
    "Repeated web entry, collection, and verification",
    "The workflow needs retries and recovery",
    "Some steps require human confirmation"
  ],
  "unfitZh": [
    "要求绕过验证码、权限或网站限制",
    "希望无人确认地批量发送或付款",
    "页面目标和完成条件不明确"
  ],
  "unfitEn": [
    "You want to bypass CAPTCHA, permissions, or site restrictions",
    "You want bulk sends or payments without confirmation",
    "The target and completion criteria are unclear"
  ],
  sampleZh: "从一份 CSV 读取待整理的草稿标题，在内容管理后台创建草稿但不发布；每次创建后重新读取列表，确认标题存在再继续。",
  "sampleEn": "Read draft titles from a CSV and create drafts in a content dashboard without publishing. After each creation, reread the list and confirm the title exists before proceeding.",
  stepsZh: [
    "明确输入文件、目标页面、登录权限和禁止动作。",
    "先跑 1 条样本，验证定位器、字段映射和成功提示。",
    "检查是否已创建再重试；涉及发布、发送或删除时先请求确认。"
  ],
  "stepsEn": [
    "Define the input file, target page, access permissions, and forbidden actions.",
    "Run one sample to verify locators, field mapping, and success signals.",
    "Check whether a record already exists before retrying; request confirmation for publish, send, or delete actions."
  ],
  exampleTitleZh: "示例：批量建立草稿，不自动发布",
  "exampleTitleEn": "Example: create drafts without publishing",
  "exampleInputZh": "输入 CSV：标题、正文摘要、目标栏目。目标：创建 5 条草稿；禁止点击“发布”；遇到重复标题时跳过并记录。",
  "exampleInputEn": "Input CSV: title, summary, destination category. Goal: create five drafts; never click Publish; skip and log duplicate titles.",
  exampleOutputZh: "执行记录（格式示例）
    01 草稿 A：已创建，列表中复核通过
    02 草稿 B：已存在，跳过
    03 草稿 C：失败，表单校验错误，停止自动重试
    人工确认：发布动作未执行
    说明：这只是日志模板，不代表真实网页操作已执行。",
  "exampleOutputEn": "Run log (format example)
    01 Draft A: created and confirmed in list
    02 Draft B: already exists, skipped
    03 Draft C: failed validation; automatic retry stopped
    Human checkpoint: publishing not performed
    This is a log template, not a claim that a real browser task ran.",
  artifactsZh: [
    "自动化步骤与状态机",
    "输入字段映射表",
    "成功 / 失败 / 跳过日志",
    "人工确认与恢复方案"
  ],
  "artifactsEn": [
    "Automation steps and state machine",
    "Input-field mapping",
    "Success / failure / skipped log",
    "Human checkpoint and recovery plan"
  ],
  checksZh: [
    "每步有可观察的成功条件",
    "非幂等操作不会盲目重试",
    "不绕过网站安全与访问控制"
  ],
  "checksEn": [
    "Every step has an observable success condition",
    "Non-idempotent actions are not blindly retried",
    "No bypassing site security or access controls"
  ]
}
  },
  {
    id: 'data-analysis',
    nameZh: '数据分析与决策',
    nameEn: 'Data Analysis & Decisions',
    pitchZh: '检查口径、拆解漏斗与分群，把数据结论转成下一步实验和动作。',
    pitchEn: 'Validate definitions, analyze funnels and cohorts, and turn findings into next actions.',
    ...skillType('analytics'),
    image: '/images/skills/diagram-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '数据分析：指标图表与业务漏斗',
    imageAltEn: 'Data analysis: metrics and a business funnel',
    ...skillFiles('data-analysis'),
    detailSlug: 'skills/data-analysis',
    detail: {
  metaZh: "数据分析与决策 · 演示案例",
  "metaEn": "Data Analysis & Decisions · demo",
  leadZh: "把原始数据变成可复算的判断和下一步实验。下方数字是明确标注的合成样例，只演示计算口径，不代表真实业务表现。",
  "leadEn": "Turn raw data into reproducible conclusions and the next experiment. The figures below are explicitly synthetic and demonstrate calculation methods, not real business performance.",
  "gainsZh": [
    "数据口径与质量检查",
    "漏斗 / 分群 / 趋势分析",
    "带成功阈值和停止条件的行动建议"
  ],
  "gainsEn": [
    "Metric definitions and data-quality checks",
    "Funnel, cohort, and trend analysis",
    "Actions with success thresholds and stop conditions"
  ],
  fitZh: [
    "有 CSV、事件日志或导出表格",
    "需要判断漏斗哪一步流失最大",
    "需要把分析结果转成实验"
  ],
  "fitEn": [
    "You have CSVs, event logs, or exported tables",
    "You need to find the largest funnel drop-off",
    "You need to turn analysis into an experiment"
  ],
  "unfitZh": [
    "数据来源与口径无法说明",
    "希望从相关性直接断言因果",
    "要求补造缺失数据或显著性结果"
  ],
  "unfitEn": [
    "Data sources and definitions are unknown",
    "You want causality inferred directly from correlation",
    "You want missing data or significance results invented"
  ],
  sampleZh: "用合成数据演示转化漏斗：曝光 1,000、点击 120、激活 60、付费 9。先复核分母，再算每步转化率，最后提出下一项低成本验证。",
  "sampleEn": "Use synthetic funnel data: 1,000 impressions, 120 clicks, 60 activations, and 9 payments. Verify denominators, calculate step conversion, then propose a low-cost validation.",
  stepsZh: [
    "提供原始文件、字段说明、时间范围和业务决策问题。",
    "先做数据质量检查，再统一去重规则、分母和时间窗口。",
    "交付可复算的计算表、结论、假设与下一步实验。"
  ],
  "stepsEn": [
    "Provide source files, field definitions, time window, and the decision to make.",
    "Check data quality, then standardize deduplication, denominators, and time windows.",
    "Deliver reproducible calculations, findings, hypotheses, and the next experiment."
  ],
  exampleTitleZh: "示例：定位合成转化漏斗的流失点",
  "exampleTitleEn": "Example: diagnose a synthetic conversion funnel",
  "exampleInputZh": "合成样本：曝光 1,000；点击 120；激活 60；付费 9。假设每个阶段按同一批用户去重，真实项目必须先验证这一点。",
  "exampleInputEn": "Synthetic sample: 1,000 impressions; 120 clicks; 60 activations; 9 payments. Assume each stage is deduplicated by the same users; verify this in a real project.",
  exampleOutputZh: "计算结果（合成数据）
    曝光 → 点击：120 / 1,000 = 12%
    点击 → 激活：60 / 120 = 50%
    激活 → 付费：9 / 60 = 15%
    曝光 → 付费：9 / 1,000 = 0.9%
    下一步：先拆分渠道和新老用户，再验证“点击到激活”是否存在可改善的体验问题。不能仅凭这组数据断言原因。",
  "exampleOutputEn": "Calculated from synthetic data
    Impression → click: 120 / 1,000 = 12%
    Click → activation: 60 / 120 = 50%
    Activation → payment: 9 / 60 = 15%
    Impression → payment: 9 / 1,000 = 0.9%
    Next: segment by channel and new/returning users, then test whether the click-to-activation step has an experience issue. This data alone cannot establish cause.",
  artifactsZh: [
    "数据口径与质量报告",
    "可复算的漏斗表",
    "事实 / 假设 / 结论分层",
    "下一项实验及成功阈值"
  ],
  "artifactsEn": [
    "Metric definitions and quality report",
    "Reproducible funnel table",
    "Facts, hypotheses, and conclusions separated",
    "Next experiment with a success threshold"
  ],
  checksZh: [
    "样例数字明确标为合成数据",
    "分子、分母、时间窗清楚",
    "相关性不被写成因果"
  ],
  "checksEn": [
    "Sample figures are clearly marked synthetic",
    "Numerators, denominators, and time windows are explicit",
    "Correlation is not presented as causation"
  ]
}
  },
]

export function skillsForFilter(filterId: string): HomeSkill[] {
  if (filterId === SKILL_FILTER_ALL) return homeSkills
  const selected = [...SKILL_TYPE_FILTERS, ...SKILL_SCENE_FILTERS].find((item) => item.id === filterId)
  if (!selected) return homeSkills
  const allowed = new Set(selected.skillIds)
  return homeSkills.filter((skill) => allowed.has(skill.id))
}

export const SKILL_SORT_RECOMMENDED = 'recommended'
export const SKILL_SORT_POPULAR = 'popular'
export const SKILL_SORT_NEWEST = 'newest'

export const SKILL_SORTS = [
  { id: SKILL_SORT_RECOMMENDED, labelZh: '推荐', labelEn: 'Recommended' },
  { id: SKILL_SORT_POPULAR, labelZh: '热门', labelEn: 'Popular' },
  { id: SKILL_SORT_NEWEST, labelZh: '最新', labelEn: 'Newest' }
] as const

export type SkillSortId = (typeof SKILL_SORTS)[number]['id']

/**
 * 没有浏览量或下载量。此固定排序是编辑推荐，不代表真实热度或下载数据。
 */
const SKILL_POPULAR_IDS = [
  'ai-project-delivery',
  'website-launch-check',
  'haiwai-new-keyword-launch',
  'frontend-design',
  'content-repurpose',
  'custom_connector_setup',
  'browser-automation',
  'data-analysis',
  'cover_image_gen',
  'personal-site-build',
  'haiwai-monetize-convert',
  'ui-design-refs',
  'de-ai-writing',
  'diagram-design',
  'ai-ui-design',
  'anatomy',
  'writing-skills',
  'brainstorming',
  'systematic-debugging',
  'verification-before-completion',
  'writing-plans'
] as const

function assertPopularOrder(): void {
  const catalogIds = homeSkills.map((skill) => skill.id)
  const uniquePopularIds = new Set(SKILL_POPULAR_IDS)
  if (SKILL_POPULAR_IDS.length !== catalogIds.length || uniquePopularIds.size !== SKILL_POPULAR_IDS.length) {
    throw new Error('热门排序必须不重复地列出全部技能')
  }
  for (const skillId of SKILL_POPULAR_IDS) {
    if (!catalogIds.includes(skillId)) throw new Error(`热门排序含有未知技能 ${skillId}`)
  }
}

assertPopularOrder()

const popularRank = new Map<string, number>(SKILL_POPULAR_IDS.map((skillId, index) => [skillId, index]))

/**
 * 推荐与编辑推荐：优先展示 8 个有明确结果导向的工作流；最新：按目录录入顺序倒序。
 */
export function sortSkills(skills: readonly HomeSkill[], sortId: SkillSortId): HomeSkill[] {
  if (sortId === SKILL_SORT_NEWEST) return [...skills].reverse()
  if (sortId === SKILL_SORT_POPULAR) {
    return [...skills].sort((leftSkill, rightSkill) => {
      const leftRank = popularRank.get(leftSkill.id) ?? Number.MAX_SAFE_INTEGER
      const rightRank = popularRank.get(rightSkill.id) ?? Number.MAX_SAFE_INTEGER
      return leftRank - rightRank
    })
  }
  return [...skills].sort((leftSkill, rightSkill) => {
    const leftRank = popularRank.get(leftSkill.id) ?? Number.MAX_SAFE_INTEGER
    const rightRank = popularRank.get(rightSkill.id) ?? Number.MAX_SAFE_INTEGER
    return leftRank - rightRank
  })
}

/** 首页技能商店展示编辑优先级最高的技能数量。目录页仍展示全部。 */
export const HOME_SKILL_SHOWCASE_LIMIT = 9

/** 首页展示：按编辑推荐顺序取前若干个。 */
export function homeShowcaseSkills(
  skills: readonly HomeSkill[] = homeSkills,
  limit: number = HOME_SKILL_SHOWCASE_LIMIT
): HomeSkill[] {
  if (limit <= 0) return []
  return sortSkills(skills, SKILL_SORT_RECOMMENDED).slice(0, limit)
}

function assertHomeShowcase(): void {
  const shown = homeShowcaseSkills()
  const recommended = sortSkills(homeSkills, SKILL_SORT_RECOMMENDED)
  const expectedCount = Math.min(HOME_SKILL_SHOWCASE_LIMIT, homeSkills.length)
  if (shown.length !== expectedCount) {
    throw new Error(`首页应展示最新 ${expectedCount} 个技能，实际 ${shown.length} 个`)
  }
  for (let index = 0; index < shown.length; index += 1) {
    if (shown[index]?.id !== recommended[index]?.id) {
      throw new Error('首页技能必须按编辑推荐顺序取前若干个')
    }
  }
}

assertHomeShowcase()

export function findSkill(skillId: string): HomeSkill | undefined {
  return homeSkills.find((skill) => skill.id === skillId)
}

export function skillCatalogHash(skillId: string, english: boolean): string {
  const catalogPath = english ? '/en/skills/' : '/skills/'
  return `${catalogPath}#${skillId}`
}

export function skillPagePath(skill: HomeSkill, english: boolean, onCatalog: boolean): string | null {
  if (skill.detailSlug) return english ? `/en/${skill.detailSlug}` : `/${skill.detailSlug}`
  if (onCatalog) return null
  return skillCatalogHash(skill.id, english)
}
