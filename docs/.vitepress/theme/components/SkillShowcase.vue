<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import { useIsEnglish } from '../useLocale'
import { SKILL_COPY_FEEDBACK_MS, homeSkills, skillCatalogHash, type HomeSkill } from '../homeSkills'

type CopyFeedback = '' | 'copied' | 'failed'

const isEnglish = useIsEnglish()
const feedbackBySkillId = ref<Record<string, CopyFeedback>>({})
const resetTimerBySkillId = new Map<string, number>()

function descriptionFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.descriptionEn : skill.descriptionZh
}

function imageAltFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.imageAltEn : skill.imageAltZh
}

function detailHref(skill: HomeSkill): string {
  return withBase(skillCatalogHash(skill.id, isEnglish.value))
}

function buttonLabel(skillId: string): string {
  const feedback = feedbackBySkillId.value[skillId] || ''
  if (feedback === 'copied') return isEnglish.value ? 'Copied' : '已复制'
  if (feedback === 'failed') return isEnglish.value ? 'Copy failed' : '复制失败'
  return isEnglish.value ? 'Copy skill' : '复制技能'
}

function buttonAriaLabel(skill: HomeSkill): string {
  const feedback = feedbackBySkillId.value[skill.id] || ''
  if (feedback === 'copied') {
    return isEnglish.value ? `Copied ${skill.name}` : `已复制 ${skill.name}`
  }
  if (feedback === 'failed') {
    return isEnglish.value ? `Could not copy ${skill.name}` : `未能复制 ${skill.name}`
  }
  return isEnglish.value ? `Copy skill ${skill.name}` : `复制技能 ${skill.name}`
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

async function copySkill(skill: HomeSkill): Promise<void> {
  const copied = await writeClipboard(skill.prompt)
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
</script>

<template>
  <div class="skill-list">
    <article v-for="(skill, index) in homeSkills" :id="skill.id" :key="skill.id" class="skill-card">
      <a class="skill-media" :href="detailHref(skill)">
        <img
          :src="withBase(skill.image)"
          :alt="imageAltFor(skill)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
      </a>
      <h3>
        <a :href="detailHref(skill)">{{ skill.name }}</a>
      </h3>
      <p>{{ descriptionFor(skill) }}</p>
      <button
        type="button"
        class="skill-copy"
        :class="{ 'is-copied': feedbackBySkillId[skill.id] === 'copied' }"
        :aria-label="buttonAriaLabel(skill)"
        @click="copySkill(skill)"
      >
        <span aria-live="polite">{{ buttonLabel(skill.id) }}</span>
      </button>
    </article>
  </div>
</template>
