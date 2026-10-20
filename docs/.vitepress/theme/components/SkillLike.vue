<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trackEvent } from '../analytics'
import { useIsEnglish } from '../useLocale'

// 技能详情页的「觉得有用」：不显示数字、不弹窗，只往 Umami 发 skill_like 事件。
const props = defineProps<{ skillId: string }>()
const isEnglish = useIsEnglish()
const clicked = ref(false)
const mounted = ref(false)

const key = () => 'skill-like:' + props.skillId

function onClick(): void {
  if (clicked.value) return
  clicked.value = true
  trackEvent('skill_like', { skill_id: props.skillId, language: isEnglish.value ? 'en' : 'zh' })
  try {
    localStorage.setItem(key(), '1')
  } catch {
    /* 忽略 */
  }
}

onMounted(() => {
  mounted.value = true
  try {
    clicked.value = localStorage.getItem(key()) === '1'
  } catch {
    clicked.value = false
  }
})
</script>

<template>
  <button v-if="mounted" type="button" class="skill-like" :class="{ done: clicked }" :disabled="clicked" @click="onClick">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
        :fill="clicked ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
    </svg>
    <span>{{ clicked ? (isEnglish ? 'Noted. Thank you.' : '已记录，谢谢！') : (isEnglish ? 'Useful' : '觉得有用') }}</span>
  </button>
</template>

<style scoped>
.skill-like {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-border);
  background: transparent;
  color: var(--vp-c-text-2);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.skill-like:hover:not(:disabled),
.skill-like.done {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.skill-like:disabled {
  cursor: default;
}
.skill-like svg {
  width: 15px;
  height: 15px;
}
</style>
