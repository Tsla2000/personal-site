import xOpsAutomationSkill from './data/x-ops-automation.skill.json'

export const SKILL_COPY_FEEDBACK_MS = 1600

export interface HomeSkill {
  id: string
  name: string
  descriptionZh: string
  descriptionEn: string
  image: string
  imageWidth: number
  imageHeight: number
  imageAltZh: string
  imageAltEn: string
  prompt: string
}

// 技能正文来自已发布的 x-ops-automation SKILL.md，复制按钮原样写入剪贴板。
export const homeSkills: HomeSkill[] = [
  {
    id: 'x-ops-automation',
    name: 'x-ops-automation',
    descriptionZh:
      'X 中文账号自动化运营：选题、写作规则、发帖前检查清单、风控红线和从零搭建顺序。复制后就是一份可交给 Agent 的 Skill。',
    descriptionEn:
      'Run a Chinese X account with topic rules, a pre-publish checklist, risk limits, and a setup order. Copy skill pastes the skill file for an agent.',
    image: '/images/x-ops/x-ops-cover.webp',
    imageWidth: 1920,
    imageHeight: 1280,
    imageAltZh: 'X 账号自动化运营示意：规则层、调度层、执行层和状态层',
    imageAltEn: 'Diagram of X account automation: rules, schedule, execution, and state',
    prompt: xOpsAutomationSkill.prompt
  }
]

export function skillCatalogHash(skillId: string, english: boolean): string {
  const catalogPath = english ? '/en/skills/' : '/skills/'
  return `${catalogPath}#${skillId}`
}
