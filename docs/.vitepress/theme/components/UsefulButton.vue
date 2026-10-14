<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

// 「觉得有用」按钮：不显示任何数字，只往 Umami 发自定义事件，
// 数字只有站长在 Umami 后台看得到。呼应 @songsong 的结论：
// 收藏才是干货指标，但公开计数器在冷启动期是负向证明。
const { page } = useData()
const clicked = ref(false)
const mounted = ref(false)

const LS_KEY = 'useful-clicked:'

function storageKey(): string {
  try {
    return LS_KEY + page.value.relativePath
  } catch {
    return LS_KEY + 'unknown'
  }
}

function track(): void {
  try {
    const u = (window as unknown as { umami?: { track?: (name: string, data?: Record<string, string>) => void } }).umami
    if (u && typeof u.track === 'function') {
      u.track('article-useful', { path: page.value.relativePath })
    }
  } catch {
    /* 统计失败不影响阅读 */
  }
  // 第一方统计(每日日报用)
  try {
    ;(window as unknown as { __statBeacon?: (t: string, p?: string) => void }).__statBeacon?.(
      'useful',
      page.value.relativePath
    )
  } catch {
    /* 忽略 */
  }
}

function onClick(): void {
  if (clicked.value) return
  clicked.value = true
  track()
  try {
    localStorage.setItem(storageKey(), '1')
  } catch {
    /* 忽略 */
  }
}

onMounted(() => {
  mounted.value = true
  try {
    clicked.value = localStorage.getItem(storageKey()) === '1'
  } catch {
    clicked.value = false
  }
})
</script>

<template>
  <div v-if="mounted" class="useful-wrap">
    <button
      class="useful-btn"
      :class="{ done: clicked }"
      :disabled="clicked"
      @click="onClick"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.2L5 21V4a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ clicked ? '已记录，谢谢！' : '觉得有用' }}</span>
    </button>
  </div>
</template>

<style scoped>
.useful-wrap {
  margin: 40px 0 8px;
  display: flex;
  justify-content: center;
}
.useful-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, transform 0.2s;
}
.useful-btn:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.useful-btn:disabled {
  cursor: default;
}
.useful-btn.done {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.useful-btn svg {
  width: 16px;
  height: 16px;
}
</style>
