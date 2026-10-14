<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'

// 收藏按钮:只在文章页显示。收藏夹存在 localStorage,「我的收藏」页读取展示,
// 文章更新后在收藏夹里显示「有更新」角标。
// 数字不公开显示;收藏/取消只往 Umami 发自定义事件,站长在后台看。
const { page } = useData()
const LS_KEY = 'mango-bookmarks-v1'
const marked = ref(false)
const mounted = ref(false)

interface BM {
  title: string
  at: number
}

function isArticle(): boolean {
  try {
    const fm = page.value.frontmatter as Record<string, unknown> | undefined
    return !!fm?.date && !!fm?.title
  } catch {
    return false
  }
}

function readAll(): Record<string, BM> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}') as Record<string, BM>
  } catch {
    return {}
  }
}

function writeAll(v: Record<string, BM>): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(v))
  } catch {
    /* 忽略 */
  }
}

function track(name: 'article-bookmark' | 'article-unbookmark'): void {
  try {
    const u = (window as unknown as { umami?: { track?: (n: string, d?: Record<string, string>) => void } }).umami
    if (u && typeof u.track === 'function') {
      u.track(name, { path: page.value.relativePath })
    }
  } catch {
    /* 统计失败不影响阅读 */
  }
  // 第一方统计(每日日报用)
  try {
    ;(window as unknown as { __statBeacon?: (t: string, p?: string) => void }).__statBeacon?.(
      name === 'article-bookmark' ? 'bookmark' : 'unbookmark',
      page.value.relativePath
    )
  } catch {
    /* 忽略 */
  }
}

function toggle(): void {
  const all = readAll()
  const key = page.value.relativePath
  if (all[key]) {
    delete all[key]
    track('article-unbookmark')
  } else {
    let title = ''
    try {
      title = String((page.value.frontmatter as Record<string, unknown>)?.title || '')
    } catch {
      /* 忽略 */
    }
    all[key] = { title, at: Date.now() }
    track('article-bookmark')
  }
  writeAll(all)
  marked.value = !!all[key]
}

onMounted(() => {
  mounted.value = true
  try {
    marked.value = !!readAll()[page.value.relativePath]
  } catch {
    marked.value = false
  }
})
</script>

<template>
  <div v-if="mounted && isArticle()" class="bookmark-wrap">
    <button class="bookmark-btn" :class="{ done: marked }" @click="toggle">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.2L5 21V4a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ marked ? '已收藏' : '收藏' }}</span>
    </button>
    <p v-if="marked" class="bookmark-hint">已加入<a :href="withBase('/bookmarks/')">我的收藏</a>，文章更新时会显示角标</p>
  </div>
</template>

<style scoped>
.bookmark-wrap {
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.bookmark-btn {
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
.bookmark-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.bookmark-btn.done {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.bookmark-btn svg {
  width: 16px;
  height: 16px;
}
.bookmark-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0;
}
.bookmark-hint a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
</style>
