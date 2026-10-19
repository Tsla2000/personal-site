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
}

export interface SkillFilterOption {
  id: string
  labelZh: string
  labelEn: string
  skillIds: readonly string[]
}

export const SKILL_TYPE_FILTERS: readonly SkillFilterOption[] = [
  { id: 'writing', labelZh: '写作', labelEn: 'Writing', skillIds: ['de-ai-writing'] },
  { id: 'ui', labelZh: 'UI', labelEn: 'UI', skillIds: ['ai-ui-design'] },
  { id: 'diagram', labelZh: '图解', labelEn: 'Diagram', skillIds: ['diagram-design'] },
  { id: 'anatomy', labelZh: '解剖', labelEn: 'Anatomy', skillIds: ['anatomy'] },
  { id: 'cover', labelZh: '封面', labelEn: 'Cover', skillIds: ['cover_image_gen'] },
  { id: 'connector', labelZh: '连接', labelEn: 'Connector', skillIds: ['custom_connector_setup'] },
  {
    id: 'method',
    labelZh: '方法',
    labelEn: 'Method',
    skillIds: ['writing-skills', 'brainstorming', 'systematic-debugging', 'verification-before-completion', 'writing-plans']
  }
]

/** 只保留和类型筛选结果不同的场景。产品前端等于 UI，接入服务等于连接。 */
export const SKILL_SCENE_FILTERS: readonly SkillFilterOption[] = [
  {
    id: 'site',
    labelZh: '官网内容',
    labelEn: 'Site content',
    skillIds: ['de-ai-writing', 'diagram-design', 'cover_image_gen']
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
    ...skillFiles('custom_connector_setup')
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
  }
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
 * 没有浏览量或下载量。热门是固定展示顺序：有详情页的封面图生成在前。
 * 这不是实时热度。
 */
const SKILL_POPULAR_IDS = [
  'cover_image_gen',
  'de-ai-writing',
  'diagram-design',
  'ai-ui-design',
  'anatomy',
  'custom_connector_setup',
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
 * 推荐：目录数组的现有顺序，也是页面默认顺序。
 * 热门：SKILL_POPULAR_IDS。没有真实指标。
 * 最新：没有发布日期，按目录顺序倒序，后写入的技能靠前。
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
  return [...skills]
}

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
