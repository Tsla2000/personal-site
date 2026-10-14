<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 「收藏本站」按钮:点一下即关注本站(存在 localStorage)。
// 关注后每次回访,UpdateBanner 会用 articles.json 比对更新,有新文章就弹横幅提醒。
// 关注即以此刻为基准,历史文章不触发提醒。
const LS_FOLLOW = 'site-follow:v1'
const LS_VISIT = 'site-lastvisit:v1'

const followed = ref(false)
const mounted = ref(false)

function statBeacon(t: 'follow' | 'unfollow'): void {
  try {
    ;(window as unknown as { __statBeacon?: (t: string, p?: string) => void }).__statBeacon?.(t, '')
  } catch {
    /* 忽略 */
  }
  try {
    const u = (window as unknown as { umami?: { track?: (n: string, d?: Record<string, string>) => void } }).umami
    if (u && typeof u.track === 'function') u.track(t === 'follow' ? 'site-follow' : 'site-unfollow', {})
  } catch {
    /* 忽略 */
  }
}

function toggle(): void {
  try {
    if (followed.value) {
      localStorage.removeItem(LS_FOLLOW)
      followed.value = false
      statBeacon('unfollow')
    } else {
      localStorage.setItem(LS_FOLLOW, JSON.stringify({ at: Date.now() }))
      localStorage.setItem(LS_VISIT, String(Date.now()))
      followed.value = true
      statBeacon('follow')
    }
  } catch {
    /* 忽略 */
  }
}

onMounted(() => {
  mounted.value = true
  try {
    followed.value = !!localStorage.getItem(LS_FOLLOW)
  } catch {
    followed.value = false
  }
})
</script>

<template>
  <div v-if="mounted" class="follow-wrap">
    <button class="follow-btn" :class="{ done: followed }" @click="toggle">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ followed ? '已收藏本站' : '收藏本站' }}</span>
    </button>
    <p class="follow-hint">
      {{ followed ? '收藏成功，文章有更新时你回访会收到提醒' : '点一下收藏本站，文章有更新时你回访会收到提醒' }}
    </p>
  </div>
</template>

<style scoped>
.follow-wrap {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.follow-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, transform 0.2s;
}
.follow-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.follow-btn.done {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.follow-btn svg {
  width: 17px;
  height: 17px;
}
.follow-hint {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0;
  text-align: center;
}
</style>
