<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// GitHub Discussions 驱动（giscus），登录即 GitHub OAuth
const ATTRS: Record<string, string> = {
  'data-repo': 'Tsla2000/personal-site',
  'data-repo-id': 'R_kgDOU8Zpzg',
  'data-category': 'General',
  'data-category-id': 'DIC_kwDOU8Zpzs4DISj1',
  'data-mapping': 'pathname',
  'data-strict': '0',
  'data-reactions-enabled': '1',
  'data-emit-metadata': '0',
  'data-input-position': 'top',
  'data-theme': 'preferred_color_scheme',
  'data-lang': 'zh-CN'
}

const { page } = useData()
const route = useRoute()
const container = ref<HTMLElement | null>(null)
let stopWatch: (() => void) | null = null

// 留言板页用 frontmatter: comments=false 关掉文章底部那份，避免重复
const show = computed(() => {
  try {
    return (page.value.frontmatter as Record<string, unknown>)?.comments !== false
  } catch {
    return true
  }
})

function load(): void {
  const el = container.value
  if (!el || typeof document === 'undefined') return
  el.innerHTML = ''
  const s = document.createElement('script')
  s.src = 'https://giscus.app/client.js'
  for (const k of Object.keys(ATTRS)) s.setAttribute(k, ATTRS[k])
  s.setAttribute('crossorigin', 'anonymous')
  s.async = true
  el.appendChild(s)
}

onMounted(() => {
  load()
  stopWatch = watch(() => route.path, load)
})

onBeforeUnmount(() => {
  if (stopWatch) stopWatch()
})
</script>

<template>
  <div v-if="show" class="giscus-block">
    <h2 class="giscus-heading">评论</h2>
    <p class="giscus-desc">用 GitHub 账号登录即可参与讨论</p>
    <div ref="container" class="giscus-container"></div>
  </div>
</template>

<style scoped>
.giscus-block {
  margin: 40px 0 8px;
}
.giscus-block .giscus-heading {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  padding: 0;
  border: none;
}
.giscus-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}
.giscus-container {
  min-height: 120px;
}
</style>
