<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useShare, LINK_SVG } from './useShare'
import type { SharePlatform } from './useShare'

const {
  platforms, pageUrl, pageTitle, openKey, qrCache, copied, coarse,
  init, show, hide, onBtnClick, copyLink, cleanup
} = useShare()

const { page } = useData()
const route = useRoute()

const mounted = ref(false)
const visible = ref(false)
const leftPx = ref(0)
const topPx = ref(160)
const root = ref<HTMLElement | null>(null)
const hintVisible = ref(false)

const RAIL_W = 44
const HINT_KEY = 'share-hint-dismissed-v1'
let rafId = 0
let hintTimer: ReturnType<typeof setTimeout> | null = null

// 只在宽屏文档页显示；落位在文章左侧：侧边导航栏与文章之间的空隙，
// 垂直方向与正文顶部对齐（标题 + meta 行之后的第一块正文内容）；
// 塞不下就隐藏，避免压住导航
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
  const sidebarEl = document.querySelector('.VPSidebar') as HTMLElement | null
  const sr = sidebarEl ? sidebarEl.getBoundingClientRect() : null
  const sidebarRight = sr && sr.width > 0 ? sr.right : 0

  const left = Math.round(r.left - RAIL_W - 20)
  if (left >= sidebarRight + 12) {
    leftPx.value = left
    // 正文顶部：meta 行之后的第一块正文内容
    const metaLine = article.querySelector('.meta-line') as HTMLElement | null
    let bodyTop: number | null = null
    if (metaLine) {
      const next = metaLine.nextElementSibling as HTMLElement | null
      if (next) bodyTop = next.getBoundingClientRect().top
    }
    if (bodyTop == null) {
      const h1 = article.querySelector('h1')
      bodyTop = h1 ? h1.getBoundingClientRect().bottom + 40 : r.top + 120
    }
    topPx.value = Math.max(104, Math.round(bodyTop))
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

function dismissHint(persist = true): void {
  hintVisible.value = false
  if (hintTimer) {
    clearTimeout(hintTimer)
    hintTimer = null
  }
  if (persist) {
    try {
      localStorage.setItem(HINT_KEY, '1')
    } catch { /* 忽略 */ }
  }
}

function onShareClick(p: SharePlatform): void {
  dismissHint()
  onBtnClick(p)
}
function onCopyClick(): void {
  dismissHint()
  copyLink()
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
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
  watch(() => route.path, () => nextTick(update))
  watch(() => page.value.relativePath, () => nextTick(update))
  // 手指提示：等入场动画播完再冒出来，展示几秒后自动收起；点过 × 就不再打扰
  try {
    if (!localStorage.getItem(HINT_KEY)) {
      hintTimer = setTimeout(() => {
        if (visible.value) hintVisible.value = true
        hintTimer = setTimeout(() => dismissHint(false), 6000)
      }, 1100)
    }
  } catch { /* 忽略 */ }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleUpdate)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  if (rafId) cancelAnimationFrame(rafId)
  if (hintTimer) clearTimeout(hintTimer)
  cleanup()
})
</script>

<template>
  <div v-if="visible" ref="root" class="share-rail" :style="{ left: leftPx + 'px', top: topPx + 'px' }">
    <Transition name="hint">
      <div v-if="hintVisible" class="share-hint">
        <span>👇 觉得有点意思，戳戳它分享吧</span>
        <button class="hint-close" aria-label="关闭提示" @click.stop="dismissHint()">×</button>
      </div>
    </Transition>
    <div
      v-for="(p, i) in platforms"
      :key="p.key"
      class="rail-item"
      :style="{ animationDelay: `${i * 80}ms` }"
      @mouseenter="!coarse && show(p.key)"
      @mouseleave="!coarse && hide()"
    >
      <button
        class="rail-btn"
        :style="{ '--brand': p.color }"
        :data-name="p.name"
        :aria-label="'分享到' + p.name"
        @click="onShareClick(p)"
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
    <div class="rail-divider" style="animation-delay: 240ms"></div>
    <div class="rail-item" style="animation-delay: 320ms">
      <button
        class="rail-btn"
        :class="{ copied }"
        :data-name="copied ? '已复制' : '复制链接'"
        aria-label="复制链接"
        @click="onCopyClick"
        v-html="LINK_SVG"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.share-rail {
  position: fixed;
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
  animation: rail-in 0.4s ease-out;
}
@keyframes rail-in {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
/* 手指提示气泡：胶囊顶部，手指往下指向组件 */
.share-hint {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  border-radius: 12px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--vp-c-bg-elv) 88%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--vp-shadow-3);
  z-index: 41;
}
.share-hint::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-top-color: var(--vp-c-border);
}
.hint-close {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.hint-close:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.hint-enter-active {
  animation: hint-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes hint-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}
.hint-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
/* 图标逐个弹簧弹出 */
.rail-item,
.rail-divider {
  animation: item-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
@keyframes item-pop {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
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
  transform: translateY(-2px);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--brand, var(--vp-c-brand-1)) 45%, transparent),
    0 6px 16px -6px color-mix(in srgb, var(--brand, var(--vp-c-brand-1)) 60%, transparent);
}
/* 悬停时图标俏皮地晃一下 */
.rail-btn:hover :deep(svg) {
  animation: wiggle 0.5s ease;
}
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-14deg) scale(1.25); }
  45% { transform: rotate(11deg) scale(1.25); }
  70% { transform: rotate(-6deg) scale(1.18); }
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
/* 二维码浮层朝右开（栏在左侧），带缩放淡入 */
.rail-pop {
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  transform-origin: left center;
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
  animation: pop-in 0.22s ease-out;
}
@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
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
@media (prefers-reduced-motion: reduce) {
  .share-rail,
  .share-rail * {
    animation: none !important;
  }
}
</style>
