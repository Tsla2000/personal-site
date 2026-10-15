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
const leftPx = ref(0)
const root = ref<HTMLElement | null>(null)

const RAIL_W = 44
let rafId = 0

// 只在宽屏文档页显示；运行时实测文章与右侧目录栏的位置，动态找空隙落位：
// 优先文章右侧、目录左侧的空隙，其次视口右边缘；都没空位就隐藏，避免压住目录
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
  if (!mounted.value || isHome || !wide || !article) {
    if (visible.value) visible.value = false
    hide()
    return
  }
  const r = article.getBoundingClientRect()
  const vw = window.innerWidth
  const asideEl = document.querySelector('.VPDocAside') as HTMLElement | null
  const ar = asideEl ? asideEl.getBoundingClientRect() : null
  const asideVisible = !!ar && ar.width > 0
  const asideLeft = asideVisible && ar ? ar.left : vw
  const asideRight = asideVisible && ar ? ar.right : 0

  let left = -1
  const c1 = Math.round(r.right + 20)
  if (c1 + RAIL_W <= asideLeft - 12) {
    left = c1
  } else {
    const c2 = vw - 14 - RAIL_W
    if (c2 >= asideRight + 12) left = c2
  }
  if (left >= 0) {
    leftPx.value = left
    if (!visible.value) visible.value = true
  } else {
    if (visible.value) visible.value = false
    hide()
  }
}

function scheduleUpdate(): void {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    rafId = 0
    update()
  })
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
  window.addEventListener('resize', scheduleUpdate)
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
  watch(() => route.path, () => nextTick(update))
  watch(() => page.value.relativePath, () => nextTick(update))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  if (rafId) cancelAnimationFrame(rafId)
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
        :data-name="p.name"
        :aria-label="'分享到' + p.name"
        @click="onBtnClick(p)"
        v-html="p.svg"
      ></button>
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
    <div class="rail-divider"></div>
    <div class="rail-item">
      <button
        class="rail-btn"
        :class="{ copied }"
        :data-name="copied ? '已复制' : '复制链接'"
        aria-label="复制链接"
        @click="copyLink"
        v-html="LINK_SVG"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.share-rail {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 44px;
  padding: 10px 0;
  border-radius: 22px;
  background: color-mix(in srgb, var(--vp-c-bg-elv) 72%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--vp-shadow-2);
  animation: rail-in 0.38s cubic-bezier(0.2, 0.7, 0.25, 1.15);
}
@keyframes rail-in {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(14px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}
.rail-item {
  position: relative;
  display: flex;
  justify-content: center;
}
.rail-btn {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0;
  transition: color 0.18s ease, background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}
.rail-btn:hover {
  color: var(--brand, var(--vp-c-brand-1));
  background: color-mix(in srgb, var(--brand, var(--vp-c-brand-1)) 12%, transparent);
  transform: scale(1.14);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--brand, var(--vp-c-brand-1)) 45%, transparent),
    0 6px 16px -6px color-mix(in srgb, var(--brand, var(--vp-c-brand-1)) 60%, transparent);
}
.rail-btn :deep(svg) {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
/* 悬停 tooltip，替代常驻文字标签 */
.rail-btn::after {
  content: attr(data-name);
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(6px);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--vp-shadow-2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.rail-btn:hover::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
.rail-btn.copied {
  color: var(--vp-c-brand-1);
}
.rail-divider {
  width: 20px;
  height: 1px;
  background: var(--vp-c-border);
  margin: 3px 0;
}
/* 二维码浮层改朝左开（栏在右侧） */
.rail-pop {
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  width: 188px;
  background: color-mix(in srgb, var(--vp-c-bg-elv) 88%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  box-shadow: var(--vp-shadow-3);
  padding: 12px 12px 10px;
  text-align: center;
  z-index: 40;
}
.rail-pop img {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
  background: #fff;
}
.qr-loading {
  width: 160px;
  height: 160px;
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
