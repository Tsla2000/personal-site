import skillPackages from './data/skill-packages.json'
import { SKILL_EXAMPLES } from './skillExamples'
import { SKILL_DEMOS } from './skillDemos'

export const SKILL_COPY_FEEDBACK_MS = 1600

/** 详情页「实操示例」字段，全部可选；没填的技能不显示该区块 */
export interface SkillExampleCopy {
  exampleTitleZh: string
  exampleTitleEn: string
  exampleInputZh: string
  exampleInputEn: string
  exampleOutputZh: string
  exampleOutputEn: string
  /** 最终交付物 */
  artifactsZh: string[]
  artifactsEn: string[]
  /** 验收标准 */
  checksZh: string[]
  checksEn: string[]
}

/** 真实运行案例：提示语和技能实际产出的文字，原样收录 */
export interface SkillDemoText {
  kind: 'text'
  /** true=真实运行结果；false=示意 */
  real: boolean
  capturedAt: string
  model: string
  promptZh: string
  promptEn: string
  outputZh: string
  outputEn: string
  noteZh: string
  noteEn: string
}

export interface SkillDetailCopy extends Partial<SkillExampleCopy> {
  demo?: SkillDemoText
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
  { id: 'writing', labelZh: '写作', labelEn: 'Writing', skillIds: ['de-ai-writing', 'content-repurpose'] },
  { id: 'ui', labelZh: 'UI', labelEn: 'UI', skillIds: ['ai-ui-design', 'frontend-design', 'ui-design-refs'] },
  { id: 'site-build', labelZh: '建站', labelEn: 'Site build', skillIds: ['personal-site-build', 'website-launch-check'] },
  { id: 'diagram', labelZh: '图解', labelEn: 'Diagram', skillIds: ['diagram-design'] },
  { id: 'anatomy', labelZh: '解剖', labelEn: 'Anatomy', skillIds: ['anatomy'] },
  { id: 'cover', labelZh: '封面', labelEn: 'Cover', skillIds: ['cover_image_gen'] },
  { id: 'illustration', labelZh: '插图', labelEn: 'Illustration', skillIds: ['desk_watercolor'] },
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
    skillIds: ['de-ai-writing', 'content-repurpose', 'diagram-design', 'cover_image_gen', 'desk_watercolor', 'personal-site-build', 'website-launch-check', 'frontend-design', 'ui-design-refs']
  },
  {
    id: 'figures',
    labelZh: '插图',
    labelEn: 'Figures',
    skillIds: ['diagram-design', 'anatomy', 'desk_watercolor']
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
  /** 演示视频（站内相对路径）；有值时详情页头图用视频替换图片 */
  video?: string
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
    video: '/videos/skills-series/01-deai-writing.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '去AI味写作封面：纸上的手写中文，旁边一支红笔',
    imageAltEn: 'Cover for De-AI Writing: handwritten Chinese on paper beside a red pen',
    ...skillFiles('de-ai-writing'),
    detailSlug: 'skills/de-ai-writing',
    detail: {
      metaZh: 'de-ai-writing · 个人演示',
      metaEn: 'de-ai-writing · personal demo',
      leadZh: '从你的文章里提炼写作风格档案，之后按档案写新稿，或对成稿只做命中规则的最小清理，不碰观点和结构。',
      leadEn: 'Build a style profile from your own articles, then write new drafts to that profile — or clean a finished draft with minimal whitelist-only edits that never touch your views or structure.',
      gainsZh: [
        '一份从你 2 篇以上文章提炼的风格档案',
        '按档案写的初稿，口吻一次对齐',
        '成稿的去AI味清理：只改命中规则的'
      ],
      gainsEn: [
        'A style profile distilled from 2+ of your articles',
        'First drafts written to that profile, voice aligned in one pass',
        'De-AI cleanup of finished drafts: whitelist-only edits'
      ],
      fitZh: [
        '公众号文章、投资简报要按你的口吻写',
        '成稿有机器味，想清理但不动观点',
        '刚更新了写作提示词，要重建档案'
      ],
      fitEn: [
        'WeChat posts or investment briefings need your voice',
        'A finished draft smells machine-made but the views must stay',
        'You updated the writing prompt and need the profile rebuilt'
      ],
      unfitZh: [
        '从零起标题和选题。用 brainstorming',
        '要的是封面图。用 cover_image_gen',
        '把一篇旧文改成多平台版本。用 content-repurpose'
      ],
      unfitEn: [
        'Starting from zero on topics and titles. Use brainstorming',
        'You need a cover image. Use cover_image_gen',
        'Adapting one piece into multi-platform versions. Use content-repurpose'
      ],
      sampleZh: '按我的风格档案写一篇公众号草稿：讲 AI 搜索热度，短句一句一件事，拒绝无动词对仗金句。',
      sampleEn: 'Draft a WeChat post in my style profile: on AI search trends, one thing per short sentence, no verb-less golden couplets.',
      stepsZh: [
        '点「复制技能」，把技能文本交给 Agent。',
        '说明场景：按档案写新稿，还是清理成稿。',
        '写新稿先给 2 篇以上你的文章建档案；清理成稿只收命中规则的改动。'
      ],
      stepsEn: [
        'Choose Copy skill and hand the text to your agent.',
        'Say which scene: write to the profile, or clean a finished draft.',
        'New drafts need 2+ of your articles to build the profile; cleanup only takes whitelist hits.'
      ]
    }
  },
  {
    id: 'ai-ui-design',
    nameZh: 'AI界面设计规范',
    nameEn: 'AI Interface Design Rules',
    pitchZh: 'AI 聊天和 Agent 前端的界面与交互规范。',
    pitchEn: 'Interface rules for AI chat and agent front ends.',
    ...skillType('ui'),
    image: '/images/skills/ai-ui-design.jpg',
    video: '/videos/skills-series/11-ai-ui-design.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'AI界面设计规范封面：黏土手机里的 AI 聊天界面，周围是开关和设计网格',
    imageAltEn: 'AI chat demo: a dark sidebar and a conversation on the right',
    ...skillFiles('ai-ui-design'),
    detailSlug: 'skills/ai-ui-design',
    detail: {
      metaZh: 'ai-ui-design · 个人演示',
      metaEn: 'ai-ui-design · personal demo',
      leadZh: '给 AI 聊天与 Agent 前端定的界面与交互规范：设计令牌、弹簧动效参数、中文输入法守卫、流式滚动，一次定好不再返工。',
      leadEn: 'Interface and interaction rules for AI chat and agent front ends: design tokens, spring parameters, Chinese IME guards, streaming scroll — decided once, no rework.',
      gainsZh: [
        '令牌结构与弹簧动效参数',
        '中文输入法与流式滚动的守卫规则',
        '工具确认卡、安全沙箱与验收清单'
      ],
      gainsEn: [
        'Token structure and spring motion parameters',
        'Guard rules for Chinese IME and streaming scroll',
        'Tool confirmation cards, a safe sandbox, and an acceptance checklist'
      ],
      fitZh: [
        '做聊天界面、对话框、工具调用卡片',
        'Agent 前端的动效总觉得「AI 味很重」',
        '团队要一套能直接落地的 React/Tailwind 规范'
      ],
      fitEn: [
        'Building chat UIs, dialogs, or tool-call cards',
        'Your agent front end feels generically AI-made',
        'The team needs a React/Tailwind spec they can ship'
      ],
      unfitZh: [
        '要整站视觉方向。用 frontend-design',
        '找灵感参考站。用 ui-design-refs',
        '画静态图解。用 diagram-design'
      ],
      unfitEn: [
        'You need a whole-site visual direction. Use frontend-design',
        'You need inspiration references. Use ui-design-refs',
        'You need static diagrams. Use diagram-design'
      ],
      sampleZh: '按这个规范做一个 AI 聊天框：流式输出不跳动，中文输入法组合中不触发发送，工具调用走确认卡。',
      sampleEn: 'Build an AI chat box to this spec: streaming output never jumps, IME composition never sends, tool calls go through a confirmation card.',
      stepsZh: [
        '点「复制技能」，把规范交给前端 Agent。',
        '说明要做的组件：聊天框、工具卡还是整套前端。',
        '按验收清单逐项过：动效、输入法、流式、安全。'
      ],
      stepsEn: [
        'Choose Copy skill and hand the spec to your front-end agent.',
        'Say what to build: a chat box, tool cards, or the whole front end.',
        'Walk the acceptance checklist: motion, IME, streaming, safety.'
      ]
    }
  },
  {
    id: 'diagram-design',
    nameZh: '图解设计',
    nameEn: 'Diagram Design',
    pitchZh: '45 种静态图解，输出一份自包含 HTML。',
    pitchEn: 'Forty-five static diagrams, each a self-contained HTML file.',
    ...skillType('diagram'),
    image: '/images/skills/diagram-design.jpg',
    video: '/videos/skills-series/07-diagram-demo.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '图解设计封面：黏土流程图方块与纸箭头，放大镜落在其中一格',
    imageAltEn: 'Content flywheel: create, distribute, engage, then feed data back',
    ...skillFiles('diagram-design'),
    detailSlug: 'skills/diagram-design',
    detail: {
      metaZh: 'diagram-design · 个人演示',
      metaEn: 'diagram-design · personal demo',
      leadZh: '45 种静态图解，输出一份自包含 HTML：架构图、流程图、时序图、甘特图、桑基图都有，编辑风排版，直接嵌进文章。',
      leadEn: 'Forty-five static diagram types, each a self-contained HTML file: architecture, flowcharts, sequence, Gantt, Sankey — editorial layout, ready to embed.',
      gainsZh: [
        '45 种图解类型，一份自包含 HTML',
        '支持 .drawio、Mermaid、Excalidraw 导入',
        '站内品牌配色字体自动套用'
      ],
      gainsEn: [
        '45 diagram types, each a self-contained HTML file',
        'Imports from .drawio, Mermaid, and Excalidraw',
        'Site brand colors and fonts applied automatically'
      ],
      fitZh: [
        '文章里要一张讲清结构的配图',
        '手里有 drawio 或 Mermaid 草稿想美化',
        '要统一的出版级图解风格'
      ],
      fitEn: [
        'An article needs one figure that explains the structure',
        'You have a drawio or Mermaid draft to beautify',
        'You want one consistent editorial diagram style'
      ],
      unfitZh: [
        '要可交互的拆解。用 anatomy',
        '要封面图。用 cover_image_gen',
        '画 UI 界面。用 frontend-design'
      ],
      unfitEn: [
        'You need an interactive cutaway. Use anatomy',
        'You need a cover image. Use cover_image_gen',
        'You need UI screens. Use frontend-design'
      ],
      sampleZh: '画一张 AI Agent 系统架构图：四层结构，站内品牌配色，输出自包含 HTML。',
      sampleEn: 'Draw an AI agent system architecture diagram: four layers, site brand colors, self-contained HTML output.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说明图解类型和要表达的结构。',
        '有草稿就贴 Mermaid/drawio，没有就口述。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Name the diagram type and the structure to show.',
        'Paste a Mermaid/drawio draft if you have one, or describe it.'
      ]
    }
  },
  {
    id: 'anatomy',
    nameZh: '等轴测解剖图',
    nameEn: 'Isometric Anatomy',
    pitchZh: '把技术概念画成可交互的等轴测小仪器。',
    pitchEn: 'Draw a technical idea as an interactive isometric instrument.',
    ...skillType('anatomy'),
    image: '/images/skills/anatomy.jpg',
    video: '/videos/skills-series/06-anatomy.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '等轴测解剖图：分层几何结构，侧面有标注线',
    imageAltEn: 'Isometric cutaway of a layered geometric structure with callout lines',
    ...skillFiles('anatomy'),
    detailSlug: 'skills/anatomy',
    detail: {
      metaZh: 'anatomy · 个人演示',
      metaEn: 'anatomy · personal demo',
      leadZh: '把技术概念画成一台可交互的等轴测小仪器：表盘、旋钮、滑轨都能动，数字和模型同一套数据，读者一看就懂。',
      leadEn: 'Draw a technical idea as an interactive isometric instrument — dials, knobs, and rails that move, every number driven by the same model the reader sees.',
      gainsZh: [
        '可交互的等轴测 SVG 图解',
        '数字与驱动部件的同一套模型',
        '无框架依赖，也可用于 React/Next.js'
      ],
      gainsEn: [
        'An interactive isometric SVG figure',
        'One model driving both the numbers and the moving parts',
        'Framework-free, also works in React/Next.js'
      ],
      fitZh: [
        '技术博客、文档、落地页要一张镇场图',
        '想讲清一个系统、算法或组件的原理',
        '要 Linear 风的高级技术插图'
      ],
      fitEn: [
        'A technical blog, docs page, or landing page needs a hero figure',
        'You want to explain how a system, algorithm, or component works',
        'You want Linear-style premium technical illustration'
      ],
      unfitZh: [
        '要静态结构图。用 diagram-design',
        '要封面。用 cover_image_gen',
        '要 UI 界面。用 ai-ui-design'
      ],
      unfitEn: [
        'You need a static diagram. Use diagram-design',
        'You need a cover. Use cover_image_gen',
        'You need UI screens. Use ai-ui-design'
      ],
      sampleZh: '把 RAG 的检索流程画成一台等轴测小仪器：转动的旋钮是 top-k，表盘显示召回率。',
      sampleEn: 'Draw the RAG retrieval flow as an isometric instrument: a turning knob for top-k, a dial showing recall.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说明要解释的技术概念和关键数字。',
        '在浏览器里点一点，看部件和数字是否联动。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Name the technical idea and the key numbers.',
        'Click around in the browser and check the parts move with the numbers.'
      ]
    }
  },
  {
    id: 'cover_image_gen',
    nameZh: '封面图生成',
    nameEn: 'Cover Image Generation',
    pitchZh: '3D 纸雕黏土风封面，同题三版，逐字验过再交付。',
    pitchEn: 'Paper-craft clay covers, three versions, Chinese title checked.',
    ...skillType('cover'),
    image: '/images/skills/cover_image_gen.jpg',
    video: '/videos/skills-series/02-cover.mp4',
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
    id: 'desk_watercolor',
    nameZh: '暖纸水彩插画',
    nameEn: 'Warm Paper Watercolor',
    pitchZh: '暖纸水彩手绘插画：水彩墨线、琥珀色调、单一橙色点缀。',
    pitchEn: 'Warm paper watercolor illustrations: ink and wash, amber tones, one orange accent.',
    ...skillType('illustration'),
    image: '/images/skills/desk_watercolor.jpg',
    video: '/videos/skills-series/03-watercolor.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '暖纸水彩插画示意：3D 纸雕黏土风，中文标题是暖纸水彩插画',
    imageAltEn: 'Paper-craft clay card with the Chinese title 暖纸水彩插画',
    ...skillFiles('desk_watercolor'),
    detailSlug: 'skills/desk-watercolor',
    detail: {
      metaZh: 'desk_watercolor · 个人演示',
      metaEn: 'desk_watercolor · personal demo',
      leadZh: '暖纸水彩手绘风插画：水彩加墨线画在米色纸上，琥珀色调，全图只有一个橙色点缀。给文章、X 帖和网站配一张安静的手绘图，要写字时带短句手写字，逐字验过再交付。',
      leadEn:
        'Warm hand-drawn watercolor illustrations: ink and wash on cream paper, an amber palette, and exactly one orange accent. A quiet hand-drawn figure for articles, X posts, and the site, with short handwritten text when asked.',
      gainsZh: [
        '固定的暖纸水彩风：水彩墨线、米色纸纹、毛边',
        '单一橙色点缀，视线落点明确',
        '可带短句手写字，逐字验收后交付 JPG'
      ],
      gainsEn: [
        'A locked warm-paper watercolor look: ink and wash, cream paper grain, deckled edges',
        'One orange accent that carries the eye',
        'Optional short handwritten text, checked character by character, delivered as JPG'
      ],
      fitZh: [
        '公众号、网站文章要一张手绘风配图',
        'X 帖想配一张安静的氛围图',
        '图里要带一句手写短句或小标签'
      ],
      fitEn: [
        'A WeChat or site article needs a hand-drawn figure',
        'An X post wants a quiet, atmospheric image',
        'The image needs one short handwritten line or label'
      ],
      unfitZh: [
        '要带大标题的封面。用 cover_image_gen',
        '要讲结构的静态图解。用 diagram-design',
        '可交互的等轴测拆解。用 anatomy',
        '照片级写实图。这套是手绘水彩'
      ],
      unfitEn: [
        'You need a cover built around a big title. Use cover_image_gen',
        'You need a structural diagram. Use diagram-design',
        'You need an interactive isometric cutaway. Use anatomy',
        'You need photorealism. This is hand-drawn watercolor'
      ],
      sampleZh: '用水彩风画一张文章配图：窗边书桌，摊开的笔记本上画着一条上升曲线，旁边一个芒果，纸上不要字。',
      sampleEn:
        'Draw an article figure in the watercolor style: a desk by a lattice window, an open notebook with a rising curve, one mango beside it, no text on the papers.',
      stepsZh: [
        '点「复制技能」，把整段技能文本交给 Agent。',
        '说明场景、点缀物和光线；要写字时给出原文和落点。',
        '收图后逐项验收：色调、点缀、纸纹毛边，带字的逐字对。'
      ],
      stepsEn: [
        'Choose Copy skill, then hand the text to your agent.',
        'Describe the scene, the accent object, and the light; give exact text and placement when you want words.',
        'Check the result: palette, single accent, paper grain and edges, and every character when text was requested.'
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
      metaZh: 'custom_connector_setup · 个人演示',
      metaEn: 'custom_connector_setup · personal demo',
      leadZh: '把没有内置连接器的第三方服务，用它的 API 或 MCP 接进来：先走官方路线，再搭文档、做一次无害读取验证，沉淀成可复用的连接器文档。',
      leadEn: 'Connect a service with no bundled connector through its API or MCP: prefer official routes, then scaffold docs, verify with a harmless read, and save reusable connector docs.',
      gainsZh: [
        '官方 MCP / Zapier / Composio 优先的接入路线',
        '最小权限的工具 schema 与错误处理',
        '可复用的连接器文档，沉淀成技能'
      ],
      gainsEn: [
        'A connection route preferring official MCP, Zapier, or Composio',
        'Least-privilege tool schemas and error handling',
        'Reusable connector docs, saved as a skill'
      ],
      fitZh: [
        '想让助手读写某个第三方服务',
        '要给 Agent 加 MCP 客户端或自定义工具',
        '接完一次，以后还想复用'
      ],
      fitEn: [
        'You want your assistant to read/write a third-party service',
        'You need an MCP client or custom tools for your agent',
        'You want to reuse this connection later'
      ],
      unfitZh: [
        '只是查一下公开信息。用浏览器搜索',
        '要画流程图。用 diagram-design',
        '修连接失败的 bug。用 systematic-debugging'
      ],
      unfitEn: [
        'You just need public info. Use web search',
        'You need a flowchart. Use diagram-design',
        'You need to fix a broken connection. Use systematic-debugging'
      ],
      sampleZh: '把我的 Notion 数据库接进来：只读权限，先做一次无害读取验证，通过后再沉淀文档。',
      sampleEn: 'Connect my Notion database: read-only, verify with one harmless read first, then save the docs.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说明服务名、要读写什么、给什么权限。',
        '先跑一次无害读取，通了再保存连接器文档。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Name the service, what to read/write, and the permissions.',
        'Run one harmless read first, then save the connector docs.'
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
    video: '/videos/skills-series/05-sitebuild-demo.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '个人网站搭建封面：浏览器里的个人站，旁边是飞书文档和参考站卡片',
    imageAltEn: 'Cover for Personal Site Builder: a browser site beside a Feishu doc and reference cards',
    ...skillFiles('personal-site-build'),
    detailSlug: 'skills/personal-site-build',
    detail: {
      metaZh: 'personal-site-build · 个人演示',
      metaEn: 'personal-site-build · personal demo',
      leadZh: '从 0 搭个人或品牌站：先用飞书文档当内容底稿，再按品类挑 UI 参考站，让 AI 抓代码、截图和风格关键词后整合实现，发布前还有图片外链清理检查。',
      leadEn: 'Build a personal or brand site from scratch: start with a Feishu doc as the content brief, pick UI references by category, let AI harvest code, screenshots, and style keywords, then integrate — with an image-link cleanup check before launch.',
      gainsZh: [
        '内容底稿到页面的标准工作流',
        '8 大类 UI 参考站的挑选方法',
        '发布前图片外链清理检查'
      ],
      gainsEn: [
        'A standard brief-to-page workflow',
        'A method for picking UI references across eight buckets',
        'A pre-launch image-link cleanup check'
      ],
      fitZh: [
        '从 0 搭个人站、作品集或品牌站',
        '有内容底稿，不知道怎么变成页面',
        '改版时想系统性地对齐参考站'
      ],
      fitEn: [
        'Building a personal site, portfolio, or brand site from zero',
        'You have a content brief and need it turned into pages',
        'You want a systematic re-alignment to reference sites'
      ],
      unfitZh: [
        '上线前逐项验收。用 website-launch-check',
        '定整站视觉风格。用 frontend-design',
        '只画一张图解。用 diagram-design'
      ],
      unfitEn: [
        'You need a pre-launch checklist. Use website-launch-check',
        'You need the whole visual direction. Use frontend-design',
        'You need one diagram. Use diagram-design'
      ],
      sampleZh: '按我的飞书底稿搭个人站首页：挑 3 家参考站的导航和 hero 风格，移动端优先。',
      sampleEn: 'Build my personal homepage from the Feishu brief: borrow nav and hero styles from three reference sites, mobile first.',
      stepsZh: [
        '点「复制技能」，把技能交给建站 Agent。',
        '贴上飞书内容底稿链接，说明站点类型。',
        '按品类挑参考站，让 AI 抓风格后出页面。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your site-building agent.',
        'Paste the Feishu brief link and name the site type.',
        'Pick references by bucket and let AI harvest the styles into pages.'
      ]
    }
  },
  {
    id: 'frontend-design',
    nameZh: '前端设计',
    nameEn: 'Frontend Design',
    pitchZh: 'Anthropic 官方前端设计 Skill，做出有辨识度、不像 AI 默认审美的页面。',
    pitchEn: 'Anthropic’s frontend-design skill for distinctive UI that avoids generic AI looks.',
    ...skillType('ui'),
    image: '/images/skills/frontend-design.jpg',
    video: '/videos/skills-series/12-frontend-design.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '前端设计封面：深色代码编辑器，旁边是一张暖色的独特网页',
    imageAltEn: 'Cover for Frontend Design: a dark code editor beside a warm, distinctive webpage',
    ...skillFiles('frontend-design'),
    detailSlug: 'skills/frontend-design',
    detail: {
      metaZh: 'frontend-design · 个人演示',
      metaEn: 'frontend-design · personal demo',
      leadZh: 'Anthropic 官方的前端设计 Skill：像设计工作室的主创一样，给每个项目定有辨识度的视觉方向，配色、字体、排版都 deliberate，不做 AI 默认审美。',
      leadEn: 'Anthropic\'s official frontend-design skill: art-direct every project like a design studio lead — deliberate palette, typography, and layout, never the generic AI look.',
      gainsZh: [
        '不撞款的视觉方向与设计决策',
        '字体与排版的品味级选择',
        '敢冒险、但有依据的美学判断'
      ],
      gainsEn: [
        'A visual direction and design decisions that stand out',
        'Taste-level typography and layout choices',
        'Aesthetic risks with reasons behind them'
      ],
      fitZh: [
        '新页面长得像「AI 生成的」',
        '改版要做出识别度',
        '想让 AI 按设计主创的思路做 UI'
      ],
      fitEn: [
        'New pages look "AI-generated"',
        'A redesign needs a recognizable identity',
        'You want AI to design like a studio lead'
      ],
      unfitZh: [
        '要 AI 聊天专用的交互规范。用 ai-ui-design',
        '找参考灵感。用 ui-design-refs',
        '从 0 搭整站。用 personal-site-build'
      ],
      unfitEn: [
        'You need AI-chat-specific interaction rules. Use ai-ui-design',
        'You need reference inspiration. Use ui-design-refs',
        'You need a site from zero. Use personal-site-build'
      ],
      sampleZh: '给我的技能商店重做视觉方向：黏土纸雕风已经定了，往「高级手工感」再推一步，字体排印要大胆。',
      sampleEn: 'Re-art-direct my skills store: the clay paper-craft look is set, push it one step toward premium handcraft, and be bold with typography.',
      stepsZh: [
        '点「复制技能」，把技能交给设计 Agent。',
        '说明项目调性和「不要像谁」。',
        '让它先给定视觉方向，再出页面。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your design agent.',
        'Name the vibe and what it must not look like.',
        'Have it set the visual direction first, then build pages.'
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
    video: '/videos/skills-series/13-ui-design-refs.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'UI设计参考清单封面：浅色桌面上的参考站拼贴与设计卡片',
    imageAltEn: 'Cover for UI Design Refs: a light desk collage of reference sites and design cards',
    ...skillFiles('ui-design-refs'),
    detailSlug: 'skills/ui-design-refs',
    detail: {
      metaZh: 'ui-design-refs · 个人演示',
      metaEn: 'ui-design-refs · personal demo',
      leadZh: '8 大类 60+ UI 参考站：组件、动效、整站灵感、产品流程、微交互、配色素材、AI 建站、设计 Skill，按场景挑链接再交给 AI，商用前核对授权。',
      leadEn: 'Sixty-plus UI reference sites in eight buckets — components, motion, full-site inspiration, product flows, micro-interactions, palettes, AI site builders, design skills. Pick by scene, hand to AI, check licenses before commercial use.',
      gainsZh: [
        '8 大类 60+ 公开参考链接',
        '按场景挑选的接入要点',
        '商用授权核对提醒'
      ],
      gainsEn: [
        'Sixty-plus public references in eight buckets',
        'Per-scene notes on how to use each',
        'A commercial-license check reminder'
      ],
      fitZh: [
        '搭站或改版前找灵感',
        '想让 AI 学某类站的风格',
        '要组件库或动效的具体例子'
      ],
      fitEn: [
        'You need inspiration before building or redesigning',
        'You want AI to learn a certain style of site',
        'You need concrete component or motion examples'
      ],
      unfitZh: [
        '直接要一套设计规范。用 ai-ui-design',
        '定整站视觉方向。用 frontend-design',
        '从 0 搭站。用 personal-site-build'
      ],
      unfitEn: [
        'You need a ready design spec. Use ai-ui-design',
        'You need the visual direction set. Use frontend-design',
        'You need a site from zero. Use personal-site-build'
      ],
      sampleZh: '找 3 个微交互做得好的 SaaS 定价页参考，说明每个值得学的一点。',
      sampleEn: 'Find three SaaS pricing pages with great micro-interactions, and name one thing worth stealing from each.',
      stepsZh: [
        '点「复制技能」，把清单交给 Agent。',
        '说明场景：组件、动效还是整站灵感。',
        '挑中链接让 AI 抓代码或截图再动手。'
      ],
      stepsEn: [
        'Choose Copy skill and hand the list to your agent.',
        'Name the scene: components, motion, or full-site inspiration.',
        'Have AI harvest code or screenshots from your picks before building.'
      ]
    }
  },
  {
    id: 'haiwai-new-keyword-launch',
    nameZh: '出海新词上站',
    nameEn: 'Overseas New-Keyword Launch',
    pitchZh: 'Trends 词根法 + D0–D5 当天上站，抢 SEO/GEO 红利。',
    pitchEn: 'Trends root words plus a D0–D5 same-day launch for the SEO/GEO window.',
    ...skillType('haiwai'),
    image: '/images/skills/haiwai-new-keyword-launch.jpg',
    video: '/videos/skills-series/10-keyword-launch.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '出海新词上站封面：浏览器里的新词站，旁边是上升的搜索趋势图',
    imageAltEn: 'Cover for Overseas New-Keyword Launch: a browser site beside a rising search-trend chart',
    ...skillFiles('haiwai-new-keyword-launch'),
    detailSlug: 'skills/overseas-new-keyword-launch',
    detail: {
      metaZh: 'haiwai-new-keyword-launch · 个人演示',
      metaEn: 'haiwai-new-keyword-launch · personal demo',
      leadZh: '用 Google Trends 词根法找新词，四项检查判断值不值得立刻做，再按 D0–D5 SOP 当天上站、次日铺长尾：抢的是按周计的 SEO/GEO 红利。',
      leadEn: 'Find new keywords with the Google Trends root-word method, run the four checks, then ship the same day on the D0–D5 SOP and cover long-tails on day two — chasing an SEO/GEO window measured in weeks.',
      gainsZh: [
        'Trends 词根法 + 四项「做不做」检查',
        'D0–D5 当天上站 SOP',
        'SEO + GEO 双通道与工具链'
      ],
      gainsEn: [
        'The Trends root-word method plus four go/no-go checks',
        'A D0–D5 same-day launch SOP',
        'SEO + GEO coverage with the tool chain'
      ],
      fitZh: [
        '发现一个飙升的新词、新梗',
        '想做副业出海、梗站、新词站',
        '等得起验证，但等不起慢工'
      ],
      fitEn: [
        'You spotted a spiking new term or meme',
        'You want a side-project launch abroad: meme or keyword sites',
        'You can wait for validation but not for slow craft'
      ],
      unfitZh: [
        '已经有流量想提转化。用 haiwai-monetize-convert',
        '词已经红了很久，红利期过了',
        '要长期品牌站。用 personal-site-build'
      ],
      unfitEn: [
        'You have traffic and want conversion. Use haiwai-monetize-convert',
        'The term peaked long ago — the window closed',
        'You want a long-term brand site. Use personal-site-build'
      ],
      sampleZh: '这个词「AI yearbook」在 Trends 上飙升，跑一遍四项检查，值得做就按 D0 清单今天上站。',
      sampleEn: 'The term "AI yearbook" is spiking on Trends — run the four checks, and if it passes, ship today on the D0 checklist.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '贴上新词，跑四项检查：搜索量、竞争、域名、变现。',
        '通过就按 D0–D5 SOP 当天上站。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Paste the new term and run the four checks: volume, competition, domain, monetization.',
        'If it passes, ship the same day on the D0–D5 SOP.'
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
    video: '/videos/skills-series/14-monetize-convert.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '出海变现转化封面：定价卡片、转化漏斗和支付界面',
    imageAltEn: 'Cover for Overseas Monetize & Convert: pricing cards, a conversion funnel, and a payment screen',
    ...skillFiles('haiwai-monetize-convert'),
    detailSlug: 'skills/haiwai-monetize-convert',
    detail: {
      metaZh: 'haiwai-monetize-convert · 个人演示',
      metaEn: 'haiwai-monetize-convert · personal demo',
      leadZh: '站有流量之后的事：假生成提停留、锚定定价、照抄竞品再按数据改、Feed 与分享做留存、GA4 与支付埋点对齐、Stripe 风控，一套组合拳提付费转化。',
      leadEn: 'For after you have traffic: fake generation for dwell time, anchor pricing, copy competitors then revise by data, Feed and sharing for retention, aligned GA4 and payment events, Stripe risk controls — a combo to lift paid conversion.',
      gainsZh: [
        '锚定定价与套餐文案打法',
        'GA4、支付埋点与行为三件套对齐',
        'Stripe Radar/EFW 风控要点'
      ],
      gainsEn: [
        'Anchor pricing and plan copy tactics',
        'Aligned GA4, payment events, and the behavior trio',
        'Stripe Radar/EFW risk-control notes'
      ],
      fitZh: [
        '出海站有流量了，付费上不去',
        '定价和套餐页不知道怎么写',
        '想抄竞品但怕抄错'
      ],
      fitEn: [
        'Your overseas site has traffic but paid conversion lags',
        'You do not know how to write pricing and plan pages',
        'You want to copy competitors without copying blindly'
      ],
      unfitZh: [
        '还没流量。用 haiwai-new-keyword-launch 先搞流量',
        '只想做品牌站。用 personal-site-build',
        '修支付 bug。用 systematic-debugging'
      ],
      unfitEn: [
        'No traffic yet. Use haiwai-new-keyword-launch first',
        'You want a brand site. Use personal-site-build',
        'You need to fix a payment bug. Use systematic-debugging'
      ],
      sampleZh: '我的新词站每天 500 UV、0 付费：先对齐 GA4 和 Stripe 埋点，再按锚定定价重写套餐页。',
      sampleEn: 'My keyword site gets 500 daily UVs and zero paid conversions: align GA4 and Stripe events first, then rewrite the pricing page with anchor pricing.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '先对齐埋点：GA4、支付、行为三件套。',
        '按清单改定价、留存与风控，再看数据。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Align events first: GA4, payments, and the behavior trio.',
        'Revise pricing, retention, and risk controls per the checklist, then read the data.'
      ]
    }
  },
  {
    id: 'writing-skills',
    nameZh: '技能编写',
    nameEn: 'Writing Skills',
    pitchZh: '把可复用的工作方法写成 Agent 能直接用的技能。',
    pitchEn: 'Turn a repeatable workflow into a skill an agent can use.',
    ...skillType('method'),
    image: '/images/skills/writing-skills.jpg',
    video: '/videos/skills-series/15-writing-skills.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '技能编写封面：纸上写着技能编写四个字，旁边有齿轮和文档',
    imageAltEn: 'Cover for Writing Skills: the Chinese title with gears and documents',
    ...skillFiles('writing-skills'),
    detailSlug: 'skills/writing-skills',
    detail: {
      metaZh: 'writing-skills · 个人演示',
      metaEn: 'writing-skills · personal demo',
      leadZh: '把一套验证过的经验、方法或流程，写成 Agent 能直接用的 SKILL.md：什么时候写、怎么写、发布前怎么验证有效。',
      leadEn: 'Turn a proven method or workflow into a SKILL.md an agent can actually use: when to write one, how to write it, and how to verify it works before shipping.',
      gainsZh: [
        '技能文档的标准结构',
        '触发条件与边界的写法',
        '发布前的有效性验证方法'
      ],
      gainsEn: [
        'The standard structure of a skill document',
        'How to write triggers and boundaries',
        'A pre-ship effectiveness check'
      ],
      fitZh: [
        '有个反复用的工作方法想固化',
        '团队要沉淀 Agent 技能库',
        '写了技能但不确定好不好用'
      ],
      fitEn: [
        'You have a workflow you repeat and want to solidify',
        'The team needs an agent skill library',
        'You wrote a skill but are not sure it works'
      ],
      unfitZh: [
        '写一次性教程。用 de-ai-writing 按风格写',
        '头脑风暴新想法。用 brainstorming',
        '只是记笔记。用知识库'
      ],
      unfitEn: [
        'You need a one-off tutorial. Use de-ai-writing',
        'You need to brainstorm. Use brainstorming',
        'You just need notes. Use a knowledge base'
      ],
      sampleZh: '把我这套「新词站 D0 上站」的经验写成 SKILL.md，触发条件写清楚，发布前先验证一遍。',
      sampleEn: 'Turn my "new-keyword D0 launch" routine into a SKILL.md with clear triggers, and verify it once before shipping.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说明要固化的方法和它解决什么问题。',
        '写完先验证有效，再发布。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Name the method to solidify and the problem it solves.',
        'Verify it works before shipping.'
      ]
    }
  },
  {
    id: 'brainstorming',
    nameZh: '头脑风暴',
    nameEn: 'Brainstorming',
    pitchZh: '动手之前，先问对问题，把真正想要的东西聊清楚。',
    pitchEn: 'Before building, ask the right questions and pin down what you really want.',
    ...skillType('method'),
    image: '/images/skills/brainstorming.jpg',
    video: '/videos/skills-series/16-brainstorming.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '头脑风暴封面：纸雕风格的对话气泡和灯泡',
    imageAltEn: 'Cover for Brainstorming: paper-craft speech bubbles and a light bulb',
    ...skillFiles('brainstorming'),
    detailSlug: 'skills/brainstorming',
    detail: {
      metaZh: 'brainstorming · 个人演示',
      metaEn: 'brainstorming · personal demo',
      leadZh: '动手之前先问对问题：任何创造性工作，先把「你到底想要什么、为什么」聊清楚；需求已经完全明确的小事不适用。',
      leadEn: 'Ask the right questions before building: for any creative work, pin down what you really want and why first. Skip it for simple tasks with fully clear requirements.',
      gainsZh: [
        '问出真需求的提问框架',
        '需求缺关键信息时的澄清流程',
        '动手前对齐，避免返工'
      ],
      gainsEn: [
        'A questioning framework that surfaces real needs',
        'A clarification flow for missing key info',
        'Alignment before building, so no rework'
      ],
      fitZh: [
        '做新功能、建组件、加新能力前',
        '需求里缺关键信息',
        '对方说不清想要什么'
      ],
      fitEn: [
        'Before a new feature, component, or capability',
        'Key information is missing from the brief',
        'The other side cannot say what they want'
      ],
      unfitZh: [
        '需求已经完全明确。直接动手',
        '修 bug。用 systematic-debugging',
        '写多步骤计划。用 writing-plans'
      ],
      unfitEn: [
        'Requirements are fully clear. Just build',
        'You need to fix a bug. Use systematic-debugging',
        'You need a multi-step plan. Use writing-plans'
      ],
      sampleZh: '我想做个「已读」功能，先别写代码，问我几个问题把需求聊清楚。',
      sampleEn: 'I want a "read receipts" feature — do not code yet, ask me questions until the requirements are clear.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说出你的初步想法，允许它追问。',
        '聊到「要什么、为什么」都清楚再动手。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Share your rough idea and let it ask questions.',
        'Build only once the what and why are both clear.'
      ]
    }
  },
  {
    id: 'systematic-debugging',
    nameZh: '系统化排查',
    nameEn: 'Systematic Debugging',
    pitchZh: '按四阶段排查：先找根因，再动手修。',
    pitchEn: 'Debug in four phases: find the root cause before you fix.',
    ...skillType('method'),
    image: '/images/skills/systematic-debugging.jpg',
    video: '/videos/skills-series/17-systematic-debugging.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '系统化排查封面：放大镜对准纸雕齿轮',
    imageAltEn: 'Cover for Systematic Debugging: a magnifier over paper-craft gears',
    ...skillFiles('systematic-debugging'),
    detailSlug: 'skills/systematic-debugging',
    detail: {
      metaZh: 'systematic-debugging · 个人演示',
      metaEn: 'systematic-debugging · personal demo',
      leadZh: '遇到 bug 先别「改一行试试」：按四阶段排查——复现、定位、找根因、再修，修症状不算修好。',
      leadEn: 'When a bug hits, resist "change one line and see": debug in four phases — reproduce, isolate, find the root cause, then fix. Fixing symptoms does not count.',
      gainsZh: [
        '四阶段排查流程',
        '根因定位的方法',
        '时间紧时也不瞎试的纪律'
      ],
      gainsEn: [
        'A four-phase debugging flow',
        'Root-cause isolation methods',
        'The discipline to not guess under time pressure'
      ],
      fitZh: [
        'bug、测试失败、构建失败',
        '已经试过几次都没修好',
        '「就改一行试试」很诱人时'
      ],
      fitEn: [
        'Bugs, test failures, build failures',
        'You have tried several fixes and none worked',
        'When "just change one line and see" is tempting'
      ],
      unfitZh: [
        '动手前先验证完成标准。用 verification-before-completion',
        '需求不清。用 brainstorming',
        '只是想加个功能。直接做'
      ],
      unfitEn: [
        'You need completion criteria first. Use verification-before-completion',
        'Requirements are unclear. Use brainstorming',
        'You just want a feature. Build it'
      ],
      sampleZh: '这个支付回调偶发 500，已经改了两次都没好，按四阶段先找根因再动手。',
      sampleEn: 'This payment callback 500s intermittently and two fixes failed — run the four phases and find the root cause before touching code.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '先复现并描述现象，不要先改代码。',
        '定位到根因，修完再验证现象消失。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Reproduce and describe the symptom first — no code changes yet.',
        'Isolate the root cause, fix it, then verify the symptom is gone.'
      ]
    }
  },
  {
    id: 'verification-before-completion',
    nameZh: '交付前验证',
    nameEn: 'Verification Before Completion',
    pitchZh: '宣称完成之前，先拿出证据。',
    pitchEn: 'Evidence before claims: verify before you say done.',
    ...skillType('method'),
    image: '/images/skills/verification-before-completion.jpg',
    video: '/videos/skills-series/18-verification.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '交付前验证封面：纸雕对勾和检查清单',
    imageAltEn: 'Cover for Verification Before Completion: a paper-craft checkmark and checklist',
    ...skillFiles('verification-before-completion'),
    detailSlug: 'skills/verification-before-completion',
    detail: {
      metaZh: 'verification-before-completion · 个人演示',
      metaEn: 'verification-before-completion · personal demo',
      leadZh: '说「做完了」之前，先拿出证据：跑验证命令、看真实输出，有证据再下「成功」的结论。',
      leadEn: 'Before you say done, show evidence: run the verification commands, read the real output — evidence first, "success" claims after.',
      gainsZh: [
        '「完成」的证据标准',
        '验证命令先行的习惯',
        'PR 与交付的可信度'
      ],
      gainsEn: [
        'An evidence standard for "done"',
        'The habit of running verification commands first',
        'Credibility for PRs and deliveries'
      ],
      fitZh: [
        '提交代码、发 PR 之前',
        '宣布任务结束之前',
        '上次说修好了结果没好'
      ],
      fitEn: [
        'Before committing code or opening a PR',
        'Before declaring a task finished',
        'When "fixed" turned out not fixed last time'
      ],
      unfitZh: [
        '找 bug 根因。用 systematic-debugging',
        '规划多步骤任务。用 writing-plans',
        '纯讨论，不交付东西'
      ],
      unfitEn: [
        'You need a bug root cause. Use systematic-debugging',
        'You need a multi-step plan. Use writing-plans',
        'Pure discussion, no deliverable'
      ],
      sampleZh: '这个 PR 我改完了，跑一遍验证：测试、构建、线上检查，有输出再合。',
      sampleEn: 'This PR is done — run verification: tests, build, live checks. Merge only with output in hand.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说清楚「完成」长什么样：测试过、构建过、线上验过。',
        '逐项跑验证命令，贴输出再下结论。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Define what "done" looks like: tested, built, verified live.',
        'Run each verification command and cite output before claiming success.'
      ]
    }
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
    ...skillFiles('writing-plans'),
    detailSlug: 'skills/writing-plans',
    detail: {
      metaZh: 'writing-plans · 个人演示',
      metaEn: 'writing-plans · personal demo',
      leadZh: '手里有需求、多步骤任务，动手写代码之前：先把规格拆成没见过代码库的工程师也能一步步执行的实现计划。',
      leadEn: 'You have the requirements and a multi-step task: before coding, break the spec into an implementation plan any engineer — even one new to the repo — can execute step by step.',
      gainsZh: [
        '可执行的分步实现计划',
        '计划与验证绑定的写法',
        '大任务不跑偏的骨架'
      ],
      gainsEn: [
        'A step-by-step executable plan',
        'Plans written with verification attached',
        'A skeleton that keeps big tasks on track'
      ],
      fitZh: [
        '三步以上才能做完的任务',
        '要交给别人（或 Agent）执行',
        '上次边做边想，结果返工了'
      ],
      fitEn: [
        'Tasks that take three-plus steps',
        'Someone else — or an agent — will execute it',
        'Last time you improvised and it needed rework'
      ],
      unfitZh: [
        '一两步的小事。直接做',
        '需求还不清楚。用 brainstorming',
        '修 bug。用 systematic-debugging'
      ],
      unfitEn: [
        'One-or-two-step errands. Just do them',
        'Requirements are unclear. Use brainstorming',
        'You need to fix a bug. Use systematic-debugging'
      ],
      sampleZh: '需求是这样……先写个实现计划：拆步骤、标验证点，我确认后再动手。',
      sampleEn: 'Here are the requirements — write the implementation plan first: steps plus verification points. I will approve before you code.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '贴上需求或规格说明。',
        '审计划：步骤是否可执行、验证点是否齐。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Paste the requirements or spec.',
        'Review the plan: are the steps executable, are verification points complete?'
      ]
    }
  },
  {
    id: 'ai-project-delivery',
    nameZh: 'AI 项目交付',
    nameEn: 'AI Project Delivery',
    pitchZh: '从需求澄清到测试验收，让 AI Coding 的交付过程可追踪、可验证。',
    pitchEn: 'Make AI-assisted development traceable and verifiable, from requirements to testing.',
    ...skillType('coding'),
    image: '/images/skills/ai-project-delivery.jpg',
    video: '/videos/skills-series/20-delivery.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: 'AI项目交付封面：黏土机器人把带对勾的成品箱交给小人',
    imageAltEn: 'Code and web interface illustration representing AI project implementation and verification',
    ...skillFiles('ai-project-delivery'),
    detailSlug: 'skills/ai-project-delivery',
    detail: {
      metaZh: 'ai-project-delivery · 个人演示',
      metaEn: 'ai-project-delivery · personal demo',
      leadZh: '用 AI Coding Agent 做新功能、修问题或交付可运行项目时：把需求澄清、代码库勘察、实施计划、分步编码、测试验证组织成可追踪的工程流程。',
      leadEn: 'When building features, fixing issues, or shipping a runnable project with an AI coding agent: organize requirement clarification, repo recon, implementation planning, stepwise coding, and test verification into a traceable engineering flow.',
      gainsZh: [
        '需求澄清到交付的全流程',
        '每一步可追踪、可验证',
        '测试验收才算交付'
      ],
      gainsEn: [
        'A full flow from clarification to delivery',
        'Every step traceable and verifiable',
        'Delivery means tested and accepted'
      ],
      fitZh: [
        '让 AI 从 0 写一个功能',
        'AI 修 bug 总修不干净',
        '要交付一个能跑的项目'
      ],
      fitEn: [
        'You want AI to build a feature from zero',
        'AI bug fixes never quite land',
        'You need to ship a runnable project'
      ],
      unfitZh: [
        '先定实现计划。用 writing-plans',
        '修 bug 找根因。用 systematic-debugging',
        '纯前端视觉。用 frontend-design'
      ],
      unfitEn: [
        'You need an implementation plan first. Use writing-plans',
        'You need a bug root cause. Use systematic-debugging',
        'Pure front-end visuals. Use frontend-design'
      ],
      sampleZh: '用 AI 做个「导出 CSV」功能：先澄清需求、勘察代码库，再分步做，每步可验证。',
      sampleEn: 'Build an "export CSV" feature with AI: clarify requirements and recon the repo first, then build stepwise with verification.',
      stepsZh: [
        '点「复制技能」，把技能交给 Coding Agent。',
        '说清需求，让它先澄清再勘察代码库。',
        '按计划分步编码，每步测试验证。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your coding agent.',
        'State the requirements; have it clarify and recon the repo first.',
        'Code stepwise per the plan, verifying each step.'
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
    image: '/images/skills/website-launch-check.jpg',
    video: '/videos/skills-series/19-launch-check.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '网站上线验收封面：浏览器窗口里火箭发射，角上绿色对勾',
    imageAltEn: 'Website launch QA: a webpage and release checklist',
    ...skillFiles('website-launch-check'),
    detailSlug: 'skills/website-launch-check',
    detail: {
      metaZh: 'website-launch-check · 个人演示',
      metaEn: 'website-launch-check · personal demo',
      leadZh: '网站准备发布或刚改版：逐项验证页面、移动端、链接、表单、SEO、分享卡、性能、隐私与回滚，输出带证据的上线清单，「本地能跑」不算上线。',
      leadEn: 'For a site about to launch or just redesigned: verify pages, mobile, links, forms, SEO, share cards, performance, privacy, and rollback item by item — and ship an evidence-backed launch checklist. "Works locally" is not launched.',
      gainsZh: [
        '覆盖 9 大类的上线检查清单',
        '每一项都要证据，不口头通过',
        '回滚方案前置'
      ],
      gainsEn: [
        'A launch checklist across nine categories',
        'Evidence for every item, no verbal passes',
        'A rollback plan up front'
      ],
      fitZh: [
        '网站要发布了',
        '刚做完一次大改版',
        '上次上线漏了分享卡、移动端'
      ],
      fitEn: [
        'The site is about to go live',
        'You just finished a big redesign',
        'Last launch missed share cards or mobile'
      ],
      unfitZh: [
        '从 0 搭站。用 personal-site-build',
        '修线上 bug。用 systematic-debugging',
        '只改一处文案。小改直接发'
      ],
      unfitEn: [
        'You need a site from zero. Use personal-site-build',
        'You need to fix a live bug. Use systematic-debugging',
        'A tiny copy tweak. Just ship it'
      ],
      sampleZh: '网站改版完了，按清单验收：核心路径、移动端、SEO、分享卡、回滚，每项贴证据。',
      sampleEn: 'The redesign is done — run the checklist: core flows, mobile, SEO, share cards, rollback, with evidence per item.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '说明是新站发布还是改版验收。',
        '逐项检查，输出带证据的清单。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Say whether it is a new launch or a redesign check.',
        'Verify item by item and ship an evidence-backed list.'
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
    image: '/images/skills/content-repurpose.jpg',
    video: '/videos/skills-series/08-repurpose.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '内容一稿多用封面：一份文档分出手机、文章、视频三路',
    imageAltEn: 'Content repurposing: one source adapted for multiple platforms',
    ...skillFiles('content-repurpose'),
    detailSlug: 'skills/content-repurpose',
    detail: {
      metaZh: 'content-repurpose · 个人演示',
      metaEn: 'content-repurpose · personal demo',
      leadZh: '把一篇文章、访谈、视频转写或读书笔记，拆成公众号、X、短帖、邮件和网站的多种内容：先提炼母稿再按平台重组，保留事实与口吻，不机械缩写。',
      leadEn: 'Turn an article, interview, video transcript, or reading note into content for WeChat, X, short posts, email, and the web: distill the master draft first, then restructure per platform — facts and voice intact, no mechanical condensing.',
      gainsZh: [
        '一份母稿，多平台版本',
        '事实与作者口吻保留',
        '按平台重组而非逐段缩写'
      ],
      gainsEn: [
        'One master draft, many platform versions',
        'Facts and author voice preserved',
        'Restructured per platform, not condensed paragraph by paragraph'
      ],
      fitZh: [
        '写了一篇长文想多平台分发',
        '有访谈、视频转写要利用',
        '读书笔记想变成输出'
      ],
      fitEn: [
        'You wrote a long piece and want multi-platform distribution',
        'You have an interview or transcript to reuse',
        'Reading notes you want to turn into output'
      ],
      unfitZh: [
        '从零按风格写新稿。用 de-ai-writing',
        '只要封面图。用 cover_image_gen',
        '头脑风暴选题。用 brainstorming'
      ],
      unfitEn: [
        'You need a new draft in your voice from zero. Use de-ai-writing',
        'You just need a cover. Use cover_image_gen',
        'You need topic brainstorming. Use brainstorming'
      ],
      sampleZh: '把这篇访谈转写拆成：一条 X 长帖、一篇公众号草稿、3 条短帖，保留受访者原话。',
      sampleEn: 'Split this interview transcript into: one long X post, one WeChat draft, and three short posts — keep the interviewee quotes.',
      stepsZh: [
        '点「复制技能」，把技能和原文交给 Agent。',
        '说明要出哪些平台版本。',
        '先审母稿提炼，再审各平台版本。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it plus the source to your agent.',
        'Name the platform versions you want.',
        'Review the master distillation first, then each platform version.'
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
    image: '/images/skills/browser-automation.jpg',
    video: '/videos/skills-series/04-browser-demo.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '浏览器自动化流程封面：黏土机器人手臂在浏览器里点按钮',
    imageAltEn: 'Browser automation: a web workflow and task steps',
    ...skillFiles('browser-automation'),
    detailSlug: 'skills/browser-automation',
    detail: {
      metaZh: 'browser-automation · 个人演示',
      metaEn: 'browser-automation · personal demo',
      leadZh: '把重复的网页操作整理成可执行、可恢复的自动化流程：先识别页面状态与风险，再设计定位、验证、重试和人工确认，高风险动作永远留确认。',
      leadEn: 'Turn repetitive web work into executable, recoverable automation: first map page states and risks, then design selectors, verification, retries, and human confirmation — high-risk actions always keep a checkpoint.',
      gainsZh: [
        '可验证、可恢复的流程设计',
        '定位、重试与确认机制',
        '高风险动作的人工确认点'
      ],
      gainsEn: [
        'Verifiable, recoverable flow design',
        'Selector, retry, and confirmation mechanics',
        'Human checkpoints on high-risk actions'
      ],
      fitZh: [
        '重复的表单填写、后台录入',
        '定期要整理的网页资料',
        '流程怕断、断了怕不知道'
      ],
      fitEn: [
        'Repetitive form filling or backend entry',
        'Web research you compile regularly',
        'Flows that must not silently break'
      ],
      unfitZh: [
        '修自动化脚本的 bug。用 systematic-debugging',
        '一次性手动操作。直接做',
        '要画流程图。用 diagram-design'
      ],
      unfitEn: [
        'You need to debug the automation. Use systematic-debugging',
        'A one-off manual task. Just do it',
        'You need a flowchart. Use diagram-design'
      ],
      sampleZh: '把每周的报名表汇总做成自动化：表单定位、失败重试、提交前人工确认一次。',
      sampleEn: 'Automate the weekly signup-form roundup: form selectors, retries on failure, one human confirmation before submit.',
      stepsZh: [
        '点「复制技能」，把技能交给 Agent。',
        '描述重复操作和页面，标出高风险动作。',
        '先看流程设计，确认点齐了再跑。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it to your agent.',
        'Describe the repetitive work and the pages; flag high-risk actions.',
        'Review the flow design — confirm the checkpoints — then run.'
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
    image: '/images/skills/data-analysis.jpg',
    video: '/videos/skills-series/09-data-analysis.mp4',
    imageWidth: SKILL_IMAGE_WIDTH,
    imageHeight: SKILL_IMAGE_HEIGHT,
    imageAltZh: '数据分析与决策封面：黏土柱状图饼图与放大镜',
    imageAltEn: 'Data analysis: metrics and a business funnel',
    ...skillFiles('data-analysis'),
    detailSlug: 'skills/data-analysis',
    detail: {
      metaZh: 'data-analysis · 个人演示',
      metaEn: 'data-analysis · personal demo',
      leadZh: '从业务表格、事件日志或导出数据里建口径、查质量、拆漏斗与分群，产出能指导下一步动作的分析：先验证数据与计算，再给结论。',
      leadEn: 'Build definitions, check quality, and break down funnels and cohorts from business tables, event logs, or exports — producing analysis that drives next actions. Verify data and math before conclusions.',
      gainsZh: [
        '指标口径与数据质量检查',
        '漏斗、分群、趋势拆解',
        '能指导下一步实验的结论'
      ],
      gainsEn: [
        'Metric definitions and data-quality checks',
        'Funnel, cohort, and trend breakdowns',
        'Conclusions that drive next experiments'
      ],
      fitZh: [
        '看数据但不知道口径对不对',
        '转化掉了，要拆漏斗找原因',
        '要一个「下一步做什么」的答案'
      ],
      fitEn: [
        'You look at data but doubt the definitions',
        'Conversion dropped and you need the funnel broken down',
        'You want an answer to "what next"'
      ],
      unfitZh: [
        '只要一张好看的图。用 diagram-design',
        '修数据管道 bug。用 systematic-debugging',
        '做 Dashboard UI。用 ai-ui-design'
      ],
      unfitEn: [
        'You just want a pretty chart. Use diagram-design',
        'You need to fix the data pipeline. Use systematic-debugging',
        'You need dashboard UI. Use ai-ui-design'
      ],
      sampleZh: '这周付费转化掉了 30%：先查口径和数据质量，再拆漏斗分群，给我下一步验证动作。',
      sampleEn: 'Paid conversion dropped 30% this week: check definitions and data quality first, then break down funnels and cohorts, and give me next verification actions.',
      stepsZh: [
        '点「复制技能」，把技能和数据交给 Agent。',
        '说明业务问题和数据来源。',
        '先看口径与质量结论，再看拆解。'
      ],
      stepsEn: [
        'Choose Copy skill and hand it plus the data to your agent.',
        'Name the business question and the data source.',
        'Read the definitions and quality verdict first, then the breakdown.'
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
 * 编辑推荐的固定顺序，同时是热度数据不足（见 SKILL_HEAT_MIN_TOTAL）或接口不可用时的回退顺序。
 */
const SKILL_POPULAR_IDS = [
  'ai-project-delivery',
  'website-launch-check',
  'haiwai-new-keyword-launch',
  'frontend-design',
  'content-repurpose',
  'personal-site-build',
  'browser-automation',
  'data-analysis',
  'cover_image_gen',
  'custom_connector_setup',
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
  'writing-plans',
  'desk_watercolor'
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
/** 热度数据太少时排行没有意义,累计总分达到该值才启用真实热度排序。 */
export const SKILL_HEAT_MIN_TOTAL = 30

export type SkillHeat = Readonly<Record<string, number>> | null | undefined

function heatReady(heat: SkillHeat): heat is Readonly<Record<string, number>> {
  if (!heat) return false
  return Object.values(heat).reduce((sum, score) => sum + score, 0) >= SKILL_HEAT_MIN_TOTAL
}

/** 按热度分从高到低,同分按编辑推荐顺序。 */
function sortByHeat(skills: readonly HomeSkill[], heat: Readonly<Record<string, number>>): HomeSkill[] {
  return [...skills].sort((leftSkill, rightSkill) => {
    const diff = (heat[rightSkill.id] ?? 0) - (heat[leftSkill.id] ?? 0)
    if (diff !== 0) return diff
    return (popularRank.get(leftSkill.id) ?? Number.MAX_SAFE_INTEGER) - (popularRank.get(rightSkill.id) ?? Number.MAX_SAFE_INTEGER)
  })
}

export function sortSkills(skills: readonly HomeSkill[], sortId: SkillSortId, heat?: SkillHeat): HomeSkill[] {
  if (sortId === SKILL_SORT_NEWEST) return [...skills].reverse()
  if (sortId === SKILL_SORT_POPULAR) {
    if (heatReady(heat)) return sortByHeat(skills, heat)
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

/** 首页展示：有足够热度数据时按真实热度取前若干个，否则按编辑推荐顺序。 */
export function homeShowcaseSkills(
  skills: readonly HomeSkill[] = homeSkills,
  limit: number = HOME_SKILL_SHOWCASE_LIMIT,
  heat?: SkillHeat
): HomeSkill[] {
  if (limit <= 0) return []
  if (heatReady(heat)) return sortByHeat(skills, heat).slice(0, limit)
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

for (const [skillId, example] of Object.entries(SKILL_EXAMPLES)) {
  const skill = homeSkills.find((item) => item.id === skillId)
  if (!skill?.detail) throw new Error(`示例对应的技能不存在或没有详情: ${skillId}`)
  Object.assign(skill.detail, example)
}

for (const [skillId, demo] of Object.entries(SKILL_DEMOS)) {
  const skill = homeSkills.find((item) => item.id === skillId)
  if (!skill?.detail) throw new Error(`真实案例对应的技能不存在或没有详情: ${skillId}`)
  skill.detail.demo = demo
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
