import skillClipboard from './data/skill-clipboard.json'

export const SKILL_COPY_FEEDBACK_MS = 1600

export interface HomeSkill {
  id: string
  nameZh: string
  nameEn: string
  purposeZh: string
  purposeEn: string
  scenariosZh: string
  scenariosEn: string
  splitZh: string
  splitEn: string
  image: string
  imageWidth: number
  imageHeight: number
  imageAltZh: string
  imageAltEn: string
  prompt: string
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
    purposeZh: '从你本人文章提炼写作风格档案，再按档案写作；或对成稿做「最小改动」的去机器味清理。',
    purposeEn:
      'Build a writing-style profile from your own articles and write to that profile, or clean a finished draft with the smallest edits that remove the machine tone.',
    scenariosZh: '公众号长文、投资简报、X/社媒文案润色、按个人口吻重写。',
    scenariosEn: 'Long WeChat posts, investment briefs, polishing X and social copy, and rewrites in a personal voice.',
    splitZh: '只管文字语气与信息守恒；不做封面（cover_image_gen）、不做图解（diagram-design / anatomy）、不做产品 UI（AI界面设计规范）。',
    splitEn:
      'It only handles tone and keeping the information intact. It does not make covers (cover_image_gen), diagrams (diagram-design / anatomy), or product UI (AI interface design rules).',
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
    purposeZh: '做 AI 聊天 / Agent 产品前端时的设计令牌、动效、输入法守卫、流式滚动、工具确认卡与验收清单。',
    purposeEn:
      'Design tokens, motion, input-method guards, streaming scroll, tool confirmation cards, and a review checklist for AI chat and agent product front ends.',
    scenariosZh: '对话框、工具调用卡片、预览面板、设置弹层（默认 React + Tailwind）。',
    scenariosEn: 'Chat threads, tool-call cards, preview panels, and settings dialogs (React and Tailwind by default).',
    splitZh: '只管界面与交互规范；文案口吻用「去AI味写作」；配图/封面用 cover_image_gen；概念图解用 diagram-design 或 anatomy。',
    splitEn:
      'It only covers interface and interaction rules. Voice and wording use De-AI Writing. Illustrations and covers use cover_image_gen. Concept diagrams use diagram-design or anatomy.',
    image: '/images/skills/ai-ui-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'AI 聊天界面示意：左侧深色边栏，右侧是一段对话',
    imageAltEn: 'AI chat demo: a dark sidebar and a conversation on the right',
    prompt: promptFor('ai-ui-design')
  },
  {
    id: 'diagram-design',
    nameZh: '图解设计（diagram-design）',
    nameEn: 'Diagram Design',
    purposeZh: '45 种出版级静态图解（架构、时序、流程、飞轮、四象限、Sankey、甘特等），输出自包含 HTML（内联 SVG）。',
    purposeEn:
      '45 publication-grade static diagrams (architecture, sequence, flow, flywheel, quadrant, Sankey, Gantt, and more), exported as self-contained HTML with inline SVG.',
    scenariosZh: '官网文章插图、方案汇报、技术说明里的静态结构图。品牌配色已按 promangofund.com 定制。',
    scenariosEn:
      'Article figures, proposal decks, and static structure diagrams in technical notes. Brand colors are already set for promangofund.com.',
    splitZh: '静态图解用本技能；需要「像小机器一样可交互拆解」的等轴测图用 anatomy；文章封面用 cover_image_gen。',
    splitEn:
      'Use this skill for static diagrams. Use anatomy for an interactive isometric breakdown that works like a small machine. Use cover_image_gen for article covers.',
    image: '/images/skills/diagram-design.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '内容飞轮图：创造、分发、互动，再把数据反馈回来',
    imageAltEn: 'Content flywheel: create, distribute, engage, then feed data back',
    prompt: promptFor('diagram-design')
  },
  {
    id: 'anatomy',
    nameZh: '等轴测解剖图（anatomy）',
    nameEn: 'Isometric Anatomy',
    purposeZh: '把技术概念画成高精度、可交互的等轴测 SVG「小仪器」，零件与数字由同一模型驱动。',
    purposeEn:
      'Draw a technical idea as a precise, interactive isometric SVG instrument, with parts and numbers driven by the same model.',
    scenariosZh: '原理拆解、落地页/文档里的精品技术插画、需要动效与读数的说明图。',
    scenariosEn:
      'Principle breakdowns, featured technical illustrations on landing pages and docs, and figures that need motion and readouts.',
    splitZh: '交互解剖与动效用本技能；45 种静态业务图解用 diagram-design；社交/文章封面用 cover_image_gen。',
    splitEn:
      'Use this skill for interactive cutaways and motion. Use diagram-design for the 45 static business diagrams. Use cover_image_gen for social and article covers.',
    image: '/images/skills/anatomy.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '等轴测解剖图：分层几何结构，侧面有标注线',
    imageAltEn: 'Isometric cutaway of a layered geometric structure with callout lines',
    prompt: promptFor('anatomy')
  },
  {
    id: 'cover_image_gen',
    nameZh: '封面图生成（cover_image_gen）',
    nameEn: 'Cover Image Generation',
    purposeZh: '网站 / 公众号 / X 推文封面。固定 3D 纸雕与黏土风，中文大标题，同题出 3 版构图并逐字验字。',
    purposeEn:
      'Covers for the site, WeChat, and X posts. Fixed 3D paper-craft and clay style, large Chinese titles, three compositions of the same title, and a character-by-character check.',
    scenariosZh: '文章头图、推文大图、技能卡片主视觉。',
    scenariosEn: 'Article headers, large post images, and the main visual on a skill card.',
    splitZh: '只管封面大图；正文插图的静态图解 → diagram-design；交互解剖 → anatomy；文案 → 去AI味写作。',
    splitEn:
      'This skill only makes cover images. Static body diagrams go to diagram-design. Interactive cutaways go to anatomy. Copy goes to De-AI Writing.',
    image: '/images/skills/cover_image_gen.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '封面图生成示意：3D 纸雕黏土风，中文标题是封面图生成',
    imageAltEn: 'Paper-craft clay cover with the Chinese title 封面图生成',
    prompt: promptFor('cover_image_gen')
  },
  {
    id: 'custom_connector_setup',
    nameZh: '自定义连接器 / MCP',
    nameEn: 'Custom Connectors & MCPs',
    purposeZh: '为官网/助手接入尚未内置的第三方服务（官方 API 或 MCP），按「现成路线 → 凭证隔离 → 验证 → 沉淀文档」落地。',
    purposeEn:
      'Connect a third-party service that is not built in yet, through an official API or MCP, in this order: an existing route, isolated credentials, verification, then a written record.',
    scenariosZh: '新 SaaS API、官方 MCP server、Zapier/Composio 中转、自建 MCP 客户端脚手架。',
    scenariosEn: 'A new SaaS API, an official MCP server, a Zapier or Composio bridge, or a custom MCP client scaffold.',
    splitZh: '只管连接与凭证安全流程；接好后的业务文案用「去AI味写作」；产品 UI 用「AI界面设计规范」；对外封面用 cover_image_gen；概念图解用 diagram-design / anatomy。',
    splitEn:
      'It only covers the connection and credential-safety flow. After it is connected, business copy uses De-AI Writing, product UI uses the AI interface design rules, public covers use cover_image_gen, and concept diagrams use diagram-design or anatomy.',
    image: '/images/skills/custom_connector_setup.jpg',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '自定义连接器示意：中心是 AI Agent，周围连着 GitHub、数据库和 Slack',
    imageAltEn: 'Custom connector diagram: an AI agent in the center, linked to GitHub, a database, and Slack',
    prompt: promptFor('custom_connector_setup')
  }
]

export function skillCatalogHash(skillId: string, english: boolean): string {
  const catalogPath = english ? '/en/skills/' : '/skills/'
  return `${catalogPath}#${skillId}`
}
