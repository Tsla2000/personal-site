import { onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import { SKILL_COPY_FEEDBACK_MS, type HomeSkill } from './homeSkills'
import { useIsEnglish } from './useLocale'

const skillPromptCache = new Map<string, string>()

type CopyFeedback = '' | 'copied' | 'failed'

export function useSkillCopy() {
  const isEnglish = useIsEnglish()
  const feedbackBySkillId = ref<Record<string, CopyFeedback>>({})
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
    if (!text.startsWith('---\n') || !text.includes(`name: ${skill.id}`) || !text.includes('# ')) {
      throw new Error(`skill prompt ${skill.id} is not the full SKILL.md`)
    }
    skillPromptCache.set(skill.id, text)
    return text
  }

  async function copySkill(skill: HomeSkill): Promise<void> {
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
    clearFeedbackLater(skill.id)
  }

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    for (const timerId of resetTimerBySkillId.values()) window.clearTimeout(timerId)
    resetTimerBySkillId.clear()
  })

  return { isEnglish, feedbackBySkillId, buttonLabel, buttonAriaLabel, zipLabel, zipAriaLabel, copySkill }
}
