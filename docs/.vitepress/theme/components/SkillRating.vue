<script setup lang="ts">
import { ref } from 'vue'
import { trackEvent } from '../analytics'
import { useIsEnglish } from '../useLocale'
import { markSkillRated, type SkillActionSource } from '../useSkillCopy'

// 复制技能后的轻反馈：不显示任何数字，只往 Umami 发事件。
// 👎 再追问一个原因，这才是能用来改技能的数据。
const props = defineProps<{ skillId: string; source: SkillActionSource }>()
const emit = defineEmits<{ (e: 'done', skillId: string): void }>()
const isEnglish = useIsEnglish()

type Step = 'ask' | 'reason' | 'thanks'
const step = ref<Step>('ask')

const REASONS = [
  { id: 'no-effect', zh: '没效果', en: 'Did not work' },
  { id: 'too-complex', zh: '太复杂', en: 'Too complex' },
  { id: 'not-for-me', zh: '不适合我', en: 'Not for me' }
]

function base() {
  return {
    skill_id: props.skillId,
    source: props.source,
    language: isEnglish.value ? 'en' : 'zh'
  }
}

function finish(): void {
  markSkillRated(props.skillId)
  step.value = 'thanks'
  window.setTimeout(() => emit('done', props.skillId), 1800)
}

function up(): void {
  trackEvent('skill_rating', { ...base(), rating: 'up' })
  finish()
}

function down(): void {
  trackEvent('skill_rating', { ...base(), rating: 'down' })
  step.value = 'reason'
}

function pickReason(reason: string): void {
  trackEvent('skill_rating_reason', { ...base(), reason })
  finish()
}

function skip(): void {
  markSkillRated(props.skillId)
  emit('done', props.skillId)
}
</script>

<template>
  <div class="skill-rating" role="group" :aria-label="isEnglish ? 'Skill feedback' : '技能反馈'">
    <template v-if="step === 'ask'">
      <span class="skill-rating-q">{{ isEnglish ? 'Worth it?' : '用了觉得好？' }}</span>
      <button type="button" class="skill-rating-btn" :aria-label="isEnglish ? 'Helpful' : '有用'" @click="up">👍</button>
      <button type="button" class="skill-rating-btn" :aria-label="isEnglish ? 'Not helpful' : '没帮助'" @click="down">👎</button>
      <button type="button" class="skill-rating-skip" :aria-label="isEnglish ? 'Dismiss' : '关闭'" @click="skip">×</button>
    </template>
    <template v-else-if="step === 'reason'">
      <span class="skill-rating-q">{{ isEnglish ? 'What went wrong?' : '哪里不够好？' }}</span>
      <button
        v-for="r in REASONS"
        :key="r.id"
        type="button"
        class="skill-rating-reason"
        @click="pickReason(r.id)"
      >{{ isEnglish ? r.en : r.zh }}</button>
    </template>
    <span v-else class="skill-rating-q" aria-live="polite">{{ isEnglish ? 'Thanks for the feedback' : '谢谢反馈' }}</span>
  </div>
</template>
