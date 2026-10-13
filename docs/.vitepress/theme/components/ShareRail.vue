<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useShare, LINK_SVG } from './useShare'

const {
  platforms, pageUrl, pageTitle, openKey, qrCache, copied, coarse,
  init, show, hide, onBtnClick, copyLink, cleanup
} = useShare()

const { page } = useData()
const route = useRoute()

const mounted = ref(false)
const visible = ref(false)
const leftPx = ref(16)
const root = ref<HTMLElement | null>(null)

// 只在宽屏文档页显示；left 用 JS 实测文章左边缘，保证贴在文章左侧
function update(): void {
  if (typeof window === 'undefined') return
  let isHome = false
  try {
    const fm = page.value.frontmatter as Record<string, unknown> | undefined
    isHome = page.value.relativePath === 'index.md' || fm?.layout === 'home'
  } catch { /* 忽略 */ }
  let wide = false
  try {
    wide = window.matchMedia('(min-width: 1280px)').matches
  } catch { /* 忽略 */ }
  const article = document.querySelector('.VPDoc .vp-doc') as HTMLElement | null
  visible.value = mounted.value && !isHome && wide && !!article
  if (article) {
    const r = article.getBoundingClientRect()
    leftPx.value = Math.max(12, Math.round(r.left - 78))
  }
  if (!visible.value) hide()
}

function onDocClick(e: MouseEvent): void {
  if (root.value && !root.value.contains(e.target as Node)) hide()
}
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') hide()
}

onMounted(() => {
  mounted.value = true
  init()
  update()
  window.addEventListener('resize', update)
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
  watch(() => route.path, () => nextTick(update))
  watch(() => page.value.relativePath, () => nextTick(update))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', update)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  cleanup()
})
</script>

<template>
  <div v-if="visible" ref="root" class="share-rail" :style="{ left: leftPx + 'px' }">
    <div
      v-for="p in platforms"
      :key="p.key"
      class="rail-item"
      @mouseenter="!coarse && show(p.key)"
      @mouseleave="!coarse && hide()"
    >
      <button
        class="rail-btn"
        :style="{ '--brand': p.color }"
        :aria-label="'分享到' + p.name"
        @click="onBtnClick(p)"
        v-html="p.svg"
      ></button>
      <span class="rail-name">{{ p.name }}</span>
      <div v-show="openKey === p.key" class="rail-pop">
        <img v-if="qrCache[p.key]" :src="qrCache[p.key]" alt="分享二维码" />
        <div v-else class="qr-loading">生成中…</div>
        <p class="qr-tip">{{ p.tip }}</p>
        <a
          v-if="p.shareUrl"
          :href="p.shareUrl(pageUrl, pageTitle)"
          target="_blank"
          rel="noopener noreferrer"
          class="qr-go"
        >去微博分享 →</a>
      </div>
    </div>
    <div class="rail-item">
      <button class="rail-btn" aria-label="复制链接" @click="copyLink" v-html="LINK_SVG"></button>
      <span class="rail-name">{{ copied ? '已复制' : '复制链接' }}</span>
    </div>
  </div>
</template>

<style scoped>
.share-rail {
  position: fixed;
  top: 168px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.rail-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.rail-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--vp-shadow-2);
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s, border-color 0.2s, transform 0.2s;
}
.rail-btn:hover {
  color: var(--brand, var(--vp-c-brand-1));
  border-color: var(--brand, var(--vp-c-brand-1));
  transform: translateY(-2px);
}
.rail-btn :deep(svg) {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
.rail-name {
  font-size: 11px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
.rail-pop {
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  width: 196px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  padding: 12px 12px 10px;
  text-align: center;
  z-index: 40;
}
.rail-pop img {
  width: 168px;
  height: 168px;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
  background: #fff;
}
.qr-loading {
  width: 168px;
  height: 168px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0 auto;
}
.qr-tip {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 8px 0 0;
  line-height: 1.5;
}
.qr-go {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.qr-go:hover {
  text-decoration: underline;
}
</style>
