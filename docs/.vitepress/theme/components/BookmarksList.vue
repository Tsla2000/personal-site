<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { withBase } from 'vitepress'

// 「我的收藏」页列表:从 localStorage 读收藏夹,用构建时生成的 articles.json
// 比对更新时间,有更新的显示角标。点进文章即视为"已看",角标清除。
const LS_KEY = 'mango-bookmarks-v1'

interface BM {
  title: string
  at: number
}
interface Article {
  key: string
  title: string
  date: string
  updated: string
}

const bookmarks = ref<Record<string, BM>>({})
const articles = ref<Record<string, Article>>({})
const loaded = ref(false)

function readAll(): Record<string, BM> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}') as Record<string, BM>
  } catch {
    return {}
  }
}

function saveAll(v: Record<string, BM>): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(v))
  } catch {
    /* 忽略 */
  }
}

function trackUnmark(path: string): void {
  try {
    const u = (window as unknown as { umami?: { track?: (n: string, d?: Record<string, string>) => void } }).umami
    if (u && typeof u.track === 'function') u.track('article-unbookmark', { path })
  } catch {
    /* 忽略 */
  }
}

onMounted(async () => {
  bookmarks.value = readAll()
  try {
    const r = await fetch(withBase('/articles.json'))
    if (r.ok) {
      const list = (await r.json()) as Article[]
      const map: Record<string, Article> = {}
      for (const a of list) map[a.key] = a
      articles.value = map
    }
  } catch {
    /* 忽略 */
  }
  loaded.value = true
})

interface Row {
  key: string
  title: string
  href: string
  updatedLabel: string
  hasUpdate: boolean
  at: number
}

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  for (const [key, bm] of Object.entries(bookmarks.value)) {
    const a = articles.value[key]
    const updatedMs = a?.updated ? new Date(a.updated).getTime() : 0
    const hasUpdate = updatedMs > bm.at + 1000
    out.push({
      key,
      title: a?.title || bm.title || key,
      href: withBase('/' + key.replace(/\.md$/, '')),
      updatedLabel: a?.updated ? a.updated.slice(0, 10).replace(/-/g, '.') : '',
      hasUpdate,
      at: bm.at
    })
  }
  out.sort((x, y) => Number(y.hasUpdate) - Number(x.hasUpdate) || y.at - x.at)
  return out
})

function unmark(key: string): void {
  const all = readAll()
  delete all[key]
  saveAll(all)
  bookmarks.value = all
  trackUnmark(key)
}

// 点进文章视为已看,更新角标清除
function markSeen(key: string): void {
  const all = readAll()
  if (all[key]) {
    all[key] = { ...all[key], at: Date.now() }
    saveAll(all)
  }
}
</script>

<template>
  <div v-if="!loaded" class="bm-loading">加载中…</div>
  <div v-else-if="rows.length === 0" class="bm-empty">
    <p>还没有收藏。</p>
    <p><a :href="withBase('/archive')">去文章归档逛逛 →</a></p>
  </div>
  <div v-else class="bm-list">
    <div v-for="r in rows" :key="r.key" class="bm-row">
      <a class="bm-main" :href="r.href" @click="markSeen(r.key)">
        <strong>{{ r.title }}</strong>
        <span v-if="r.hasUpdate" class="bm-badge">有更新</span>
        <small v-if="r.updatedLabel">更新于 {{ r.updatedLabel }}</small>
      </a>
      <button class="bm-unmark" @click="unmark(r.key)">取消收藏</button>
    </div>
  </div>
</template>

<style scoped>
.bm-loading,
.bm-empty {
  color: var(--vp-c-text-2);
  padding: 32px 0;
  text-align: center;
}
.bm-empty a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.bm-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}
.bm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.bm-main {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}
.bm-main strong {
  font-size: 15px;
  color: var(--vp-c-text-1);
}
.bm-main small {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.bm-badge {
  font-size: 12px;
  color: #fff;
  background: var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 2px 10px;
  white-space: nowrap;
}
.bm-unmark {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
}
.bm-unmark:hover {
  color: var(--vp-c-text-1);
}
</style>
