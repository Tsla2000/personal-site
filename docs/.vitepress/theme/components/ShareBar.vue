<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import QRCode from 'qrcode'
import { siWechat, siSinaweibo, siXiaohongshu } from 'simple-icons'

interface Platform {
  key: string
  name: string
  tip: string
  svg: string
  color: string
  shareUrl?: (url: string, title: string) => string
}

const platforms: Platform[] = [
  { key: 'wechat', name: '微信', tip: '微信扫码，在微信中打开', svg: siWechat.svg, color: '#07C160' },
  {
    key: 'weibo', name: '微博', tip: '微博扫码分享', svg: siSinaweibo.svg, color: '#E6162D',
    shareUrl: (url, title) =>
      'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) +
      '&title=' + encodeURIComponent(title)
  },
  { key: 'xiaohongshu', name: '小红书', tip: '小红书扫码打开', svg: siXiaohongshu.svg, color: '#FF2442' }
]

const LINK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'

const mounted = ref(false)
const coarse = ref(false) // 触屏：hover 不可用，改用点击切换
const openKey = ref<string | null>(null)
const qrCache = ref<Record<string, string>>({})
const copied = ref(false)
const root = ref<HTMLElement | null>(null)
let pageUrl = ''
let pageTitle = ''
let copyTimer: ReturnType<typeof setTimeout> | null = null

function canonicalUrl(): string {
  try {
    const el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (el && el.href) return el.href
  } catch { /* 忽略 */ }
  return location.href
}

async function qrFor(key: string): Promise<void> {
  if (qrCache.value[key] || !pageUrl) return
  try {
    qrCache.value[key] = await QRCode.toDataURL(pageUrl, { width: 168, margin: 1 })
  } catch { /* 忽略 */ }
}

function show(key: string): void {
  openKey.value = key
  void qrFor(key)
}
function hide(): void {
  openKey.value = null
}
function toggle(key: string): void {
  if (openKey.value === key) hide()
  else show(key)
}

function onPlatformClick(p: Platform): void {
  if (p.shareUrl) {
    window.open(p.shareUrl(pageUrl, pageTitle), '_blank', 'noopener,noreferrer')
    return
  }
  if (coarse.value) toggle(p.key)
}

async function copyLink(): Promise<void> {
  hide()
  try {
    await navigator.clipboard.writeText(pageUrl)
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = pageUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    } catch { /* 忽略 */ }
  }
  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copied.value = false }, 1600)
}

function onDocClick(e: MouseEvent): void {
  if (root.value && !root.value.contains(e.target as Node)) hide()
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') hide()
}

onMounted(() => {
  mounted.value = true
  try {
    coarse.value = window.matchMedia('(pointer: coarse)').matches
  } catch { /* 忽略 */ }
  pageUrl = canonicalUrl()
  pageTitle = document.title
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div v-if="mounted" ref="root" class="share-bar">
    <span class="share-label">分享到</span>
    <div
      v-for="p in platforms"
      :key="p.key"
      class="share-item"
      @mouseenter="!coarse && show(p.key)"
      @mouseleave="!coarse && hide()"
    >
      <button
        class="share-btn"
        :style="{ '--brand': p.color }"
        :aria-label="'分享到' + p.name"
        @click="onPlatformClick(p)"
        v-html="p.svg"
      ></button>
      <span class="share-name">{{ p.name }}</span>
      <div v-show="openKey === p.key" class="qr-pop">
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
    <div class="share-item">
      <button class="share-btn" aria-label="复制链接" @click="copyLink" v-html="LINK_SVG"></button>
      <span class="share-name">{{ copied ? '已复制' : '复制链接' }}</span>
    </div>
  </div>
</template>

<style scoped>
.share-bar {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin: 40px 0 8px;
}
.share-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  padding-top: 11px;
  white-space: nowrap;
}
.share-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s, border-color 0.2s, transform 0.2s;
}
.share-btn:hover {
  color: var(--brand, var(--vp-c-brand-1));
  border-color: var(--brand, var(--vp-c-brand-1));
  transform: translateY(-2px);
}
.share-btn :deep(svg) {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
.share-name {
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
.qr-pop {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  width: 196px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  padding: 12px 12px 10px;
  text-align: center;
  z-index: 40;
}
.qr-pop img {
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
@media (max-width: 640px) {
  .share-bar {
    gap: 16px;
  }
}
</style>
