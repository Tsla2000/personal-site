import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { SKILL_COPY_FEEDBACK_MS, type HomeSkill } from './homeSkills'
import { useIsEnglish } from './useLocale'
import { trackEvent } from './analytics'

const skillPromptCache = new Map<string, string>()

const RATED_KEY = 'pmf:rated-skills'
const COPIED_KEY = 'pmf:copied-skills'
/** 复制后隔多久才问「好用吗」：复制不等于用过，给用户留出试用时间 */
const RATING_DELAY_MS = 30 * 60 * 1000

function readCopied(): Record<string, number> {
  try {
    const raw = JSON.parse(localStorage.getItem(COPIED_KEY) || '{}')
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  } catch {
    return {}
  }
}

function markSkillCopied(skillId: string): void {
  try {
    localStorage.setItem(COPIED_KEY, JSON.stringify({ ...readCopied(), [skillId]: Date.now() }))
  } catch {
    /* 忽略 */
  }
}

function readRated(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RATED_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

/** 记录已反馈的技能，之后不再弹出反馈条 */
export function markSkillRated(skillId: string): void {
  try {
    const rated = readRated()
    if (!rated.includes(skillId)) localStorage.setItem(RATED_KEY, JSON.stringify([...rated, skillId]))
  } catch {
    /* 忽略 */
  }
}

type CopyFeedback = '' | 'copied' | 'failed'

/** 事件发生的位置，用来区分首页卡片、技能目录和详情页的转化 */
export type SkillActionSource = 'home' | 'catalog' | 'detail'

export function useSkillCopy() {
  const isEnglish = useIsEnglish()
  const feedbackBySkillId = ref<Record<string, CopyFeedback>>({})
  const ratingOpenBySkillId = ref<Record<string, boolean>>({})
  const resetTimerBySkillId = new Map<string, number>()

  function buttonLabel(skillId: string): string {
    const feedback = feedbackBySkillId.value[skillId] || ''
    if (feedback === 'copied') return isEnglish.value ? 'Copied' : '已复制'
    if (feedback === 'failed') return isEnglish.value ? 'Copy failed' : '复制失败'
    return isEnglish.value ? 'Copy skill' : '复制技能'
  }

  function zipLabel(): string {
    return isEnglish.value ? 'Download ZIP' : '下载 ZIP'
  }

  function zipAriaLabel(title: string): string {
    return isEnglish.value ? `Download ${title} ZIP` : `下载 ${title} ZIP`
  }

  function buttonAriaLabel(skill: HomeSkill, title: string): string {
    const feedback = feedbackBySkillId.value[skill.id] || ''
    if (feedback === 'copied') return isEnglish.value ? `Copied ${title}` : `已复制 ${title}`
    if (feedback === 'failed') return isEnglish.value ? `Could not copy ${title}` : `未能复制 ${title}`
    return isEnglish.value ? `Copy skill ${title}` : `复制技能 ${title}`
  }

  function clearFeedbackLater(skillId: string): void {
    const existingTimer = resetTimerBySkillId.get(skillId)
    if (existingTimer) window.clearTimeout(existingTimer)
    const timerId = window.setTimeout(() => {
      const nextFeedback = { ...feedbackBySkillId.value }
      delete nextFeedback[skillId]
      feedbackBySkillId.value = nextFeedback
      resetTimerBySkillId.delete(skillId)
    }, SKILL_COPY_FEEDBACK_MS)
    resetTimerBySkillId.set(skillId, timerId)
  }

  async function writeClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      }
    } catch {
      /* 继续走下方兜底 */
    }
    try {
      const clipboardField = document.createElement('textarea')
      clipboardField.value = text
      clipboardField.setAttribute('readonly', '')
      clipboardField.style.position = 'fixed'
      clipboardField.style.top = '0'
      clipboardField.style.left = '-9999px'
      document.body.appendChild(clipboardField)
      clipboardField.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(clipboardField)
      return copied
    } catch {
      return false
    }
  }

  async function loadSkillPrompt(skill: HomeSkill): Promise<string> {
    const cached = skillPromptCache.get(skill.id)
    if (cached) return cached
    const response = await fetch(withBase(skill.promptPath))
    if (!response.ok) throw new Error(`skill prompt ${response.status}`)
    const text = await response.text()
    if (!text.startsWith('---\n') || !text.includes(`name: ${skill.promptName}`) || !text.includes('# ')) {
      throw new Error(`skill prompt ${skill.id} is not the full SKILL.md`)
    }
    skillPromptCache.set(skill.id, text)
    return text
  }

  async function copySkill(skill: HomeSkill, source: SkillActionSource): Promise<void> {
    let copied = false
    try {
      copied = await writeClipboard(await loadSkillPrompt(skill))
    } catch {
      copied = false
    }
    feedbackBySkillId.value = {
      ...feedbackBySkillId.value,
      [skill.id]: copied ? 'copied' : 'failed'
    }
    if (copied) markSkillCopied(skill.id)
    trackEvent('skill_copy', {
      skill_id: skill.id,
      language: isEnglish.value ? 'en' : 'zh',
      source,
      result: copied ? 'success' : 'failed'
    })
    clearFeedbackLater(skill.id)
  }

  function closeRating(skillId: string): void {
    const next = { ...ratingOpenBySkillId.value }
    delete next[skillId]
    ratingOpenBySkillId.value = next
  }

  function trackDownload(skill: HomeSkill, source: SkillActionSource): void {
    trackEvent('skill_download', {
      skill_id: skill.id,
      language: isEnglish.value ? 'en' : 'zh',
      source
    })
  }

  // 只在回访时检查：复制满 30 分钟且还没反馈过的技能才出反馈条
  onMounted(() => {
    const rated = readRated()
    const due: Record<string, boolean> = {}
    for (const [id, at] of Object.entries(readCopied())) {
      if (!rated.includes(id) && Date.now() - at >= RATING_DELAY_MS) due[id] = true
    }
    ratingOpenBySkillId.value = due
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    for (const timerId of resetTimerBySkillId.values()) window.clearTimeout(timerId)
    resetTimerBySkillId.clear()
  })

  return { isEnglish, ratingOpenBySkillId, closeRating, feedbackBySkillId, buttonLabel, buttonAriaLabel, zipLabel, zipAriaLabel, copySkill, trackDownload }
}
