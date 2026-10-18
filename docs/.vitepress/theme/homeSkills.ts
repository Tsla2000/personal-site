import skillClipboard from './data/skill-clipboard.json'

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

export interface HomeSkill {
  id: string
  nameZh: string
  nameEn: string
  pitchZh: string
  pitchEn: string
  chipZh: string
  chipEn: string
  image: string
  imageWidth: number
  imageHeight: number
  imageAltZh: string
  imageAltEn: string
  prompt: string
  /** 有详情页时为站内 slug，不含语言前缀，例如 skills/cover-image-gen */
  detailSlug?: string
  detail?: SkillDetailCopy
}

const clipboard = skillClipboard as Record<string, string>

function promptFor(id: string): string {
  const text = clipboard[id]
  if (!text) throw new Error(`missing skill clipboard: ${id}`)
  return text
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
    chipZh: '写作',
    chipEn: 'Writing',
    image: '/images/skills/de-ai-writing.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '去AI味写作封面：纸上的手写中文，旁边一支红笔',
    imageAltEn: 'Cover for De-AI Writing: handwritten Chinese on paper beside a red pen',
    prompt: promptFor('de-ai-writing')
  },
  {
    id: 'ai-ui-design',
    nameZh: 'AI界面设计规范',
    nameEn: 'AI Interface Design Rules',
    pitchZh: 'AI 聊天和 Agent 前端的界面与交互规范。',
    pitchEn: 'Interface rules for AI chat and agent front ends.',
    chipZh: 'UI',
    chipEn: 'UI',
    image: '/images/skills/ai-ui-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'AI 聊天界面示意：左侧深色边栏，右侧是一段对话',
    imageAltEn: 'AI chat demo: a dark sidebar and a conversation on the right',
    prompt: promptFor('ai-ui-design')
  },
  {
    id: 'diagram-design',
    nameZh: '图解设计',
    nameEn: 'Diagram Design',
    pitchZh: '45 种静态图解，输出一份自包含 HTML。',
    pitchEn: 'Forty-five static diagrams, each a self-contained HTML file.',
    chipZh: '图解',
    chipEn: 'Diagram',
    image: '/images/skills/diagram-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '内容飞轮图：创造、分发、互动，再把数据反馈回来',
    imageAltEn: 'Content flywheel: create, distribute, engage, then feed data back',
    prompt: promptFor('diagram-design')
  },
  {
    id: 'anatomy',
    nameZh: '等轴测解剖图',
    nameEn: 'Isometric Anatomy',
    pitchZh: '把技术概念画成可交互的等轴测小仪器。',
    pitchEn: 'Draw a technical idea as an interactive isometric instrument.',
    chipZh: '解剖',
    chipEn: 'Anatomy',
    image: '/images/skills/anatomy.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '等轴测解剖图：分层几何结构，侧面有标注线',
    imageAltEn: 'Isometric cutaway of a layered geometric structure with callout lines',
    prompt: promptFor('anatomy')
  },
  {
    id: 'cover_image_gen',
    nameZh: '封面图生成',
    nameEn: 'Cover Image Generation',
    pitchZh: '3D 纸雕黏土风封面，同题三版，逐字验过再交付。',
    pitchEn: 'Paper-craft clay covers, three versions, Chinese title checked.',
    chipZh: '封面',
    chipEn: 'Cover',
    image: '/images/skills/cover_image_gen.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '封面图生成示意：3D 纸雕黏土风，中文标题是封面图生成',
    imageAltEn: 'Paper-craft clay cover with the Chinese title 封面图生成',
    prompt: promptFor('cover_image_gen'),
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
    chipZh: '连接',
    chipEn: 'Connector',
    image: '/images/skills/custom_connector_setup.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '自定义连接器示意：中心是 AI Agent，周围连着 GitHub、数据库和 Slack',
    imageAltEn: 'Custom connector diagram: an AI agent in the center, linked to GitHub, a database, and Slack',
    prompt: promptFor('custom_connector_setup')
  }
]

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

export function freeBadgeLabel(english: boolean): string {
  return english ? 'Free for now' : '限时免费'
}
