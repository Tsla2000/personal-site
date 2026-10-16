<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { useIsEnglish } from '../useLocale'

// 回访更新提醒:只对点了「收藏本站」的用户生效。
// 每次加载记录访问时间,用构建时生成的 articles.json 比对:
// 上次访问之后有 updated 的文章,就弹横幅"上次来之后更新了 N 篇"。
const LS_FOLLOW = 'site-follow:v1'
const LS_VISIT = 'site-lastvisit:v1'
const LS_DISMISS = 'update-banner-dismissed'

const count = ref(0)
const visible = ref(false)
const isEnglish = useIsEnglish()

onMounted(async () => {
  let followed = false
  let lastVisit = 0
  try {
    followed = !!localStorage.getItem(LS_FOLLOW)
    lastVisit = Number(localStorage.getItem(LS_VISIT) || 0)
  } catch {
    /* 忽略 */
  }
  const now = Date.now()
  try {
    localStorage.setItem(LS_VISIT, String(now))
  } catch {
    /* 忽略 */
  }
  if (!followed || !lastVisit) return
  try {
    if (sessionStorage.getItem(LS_DISMISS) === '1') return
  } catch {
    /* 忽略 */
  }
  try {
    const r = await fetch(withBase('/articles.json'))
    if (!r.ok) return
    const list = (await r.json()) as Array<{ updated: string }>
    let n = 0
    for (const a of list) {
      const u = new Date(a.updated).getTime()
      if (!Number.isNaN(u) && u > lastVisit + 1000) n++
    }
    if (n > 0) {
      count.value = n
      visible.value = true
    }
  } catch {
    /* 忽略 */
  }
})

function dismiss(): void {
  visible.value = false
  try {
    sessionStorage.setItem(LS_DISMISS, '1')
  } catch {
    /* 忽略 */
  }
}
</script>

<template>
  <div v-if="visible" class="update-banner">
    <a :href="withBase('/archive')">{{ isEnglish ? `${count} updated since your last visit →` : `上次来之后更新了 ${count} 篇 →` }}</a>
    <button class="ub-close" :aria-label="isEnglish ? 'Close' : '关闭'" @click="dismiss">×</button>
  </div>
</template>

<style scoped>
.update-banner {
  position: fixed;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px 10px 18px;
  border-radius: 999px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
  font-size: 14px;
  white-space: nowrap;
}
.update-banner a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.ub-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 17px;
  line-height: 1;
  padding: 2px 4px;
}
.ub-close:hover {
  color: var(--vp-c-text-1);
}
</style>
