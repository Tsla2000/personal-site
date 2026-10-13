<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// Twikoo 后端地址（Vercel 部署，2026-10-13）
const ENVID = 'https://twikoo-comments-iota.vercel.app'
// 前端 bundle 本地托管，避免 CDN 和打包器互操作问题
const TWIKOO_JS = '/js/twikoo.all.min.js'

const { page } = useData()
const route = useRoute()
const container = ref<HTMLElement | null>(null)
let stopWatch: (() => void) | null = null
let scriptEl: HTMLScriptElement | null = null

// markdown 里 <Twikoo force /> 显式放置时不受 frontmatter 影响
const props = withDefaults(defineProps<{ force?: boolean }>(), { force: false })

// 留言板页用 frontmatter: comments=false 关掉自动注入的那份，避免重复
const show = computed(() => {
  if (props.force) return true
  try {
    return (page.value.frontmatter as Record<string, unknown>)?.comments !== false
  } catch {
    return true
  }
})

function twikooReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    const w = window as unknown as Record<string, unknown>
    if (w.twikoo) return resolve()
    if (scriptEl) {
      scriptEl.addEventListener('load', () => resolve(), { once: true })
      scriptEl.addEventListener('error', () => reject(new Error('twikoo.js load failed')), { once: true })
      return
    }
    const s = document.createElement('script')
    s.src = TWIKOO_JS
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('twikoo.js load failed'))
    scriptEl = s
    document.head.appendChild(s)
  })
}

async function load(): Promise<void> {
  const el = container.value
  if (!el || typeof document === 'undefined') return
  try {
    await twikooReady()
    const w = window as unknown as Record<string, { init: (o: object) => void }>
    el.innerHTML = ''
    w.twikoo.init({
      envId: ENVID,
      el,
      lang: 'zh-CN'
    })
  } catch (e) {
    el.innerHTML = '<p class="twikoo-error">评论区加载失败，请稍后刷新重试</p>'
    console.error('[Twikoo]', e)
  }
}

onMounted(() => {
  void load()
  stopWatch = watch(() => route.path, () => void load())
})

onBeforeUnmount(() => {
  if (stopWatch) stopWatch()
})
</script>

<template>
  <div v-if="show" class="twikoo-block">
    <h2 class="twikoo-heading">评论</h2>
    <p class="twikoo-desc">无需登录，匿名即可留言（昵称自动生成，显示 IP 属地）</p>
    <div ref="container" class="twikoo-container"></div>
  </div>
</template>

<style scoped>
.twikoo-block {
  margin: 40px 0 8px;
}
.twikoo-block .twikoo-heading {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  padding: 0;
  border: none;
}
.twikoo-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}
.twikoo-container {
  min-height: 120px;
}
.twikoo-error {
  color: var(--vp-c-text-2);
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}
</style>
