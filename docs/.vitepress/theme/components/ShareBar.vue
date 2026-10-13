<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useShare, LINK_SVG } from './useShare'

const {
  platforms, pageUrl, pageTitle, openKey, qrCache, copied, coarse,
  init, show, hide, onBtnClick, copyLink, cleanup
} = useShare()

const mounted = ref(false)
const narrow = ref(true) // 宽屏走左侧悬浮栏，这里只在窄屏显示
const root = ref<HTMLElement | null>(null)

function updateWidth(): void {
  try {
    narrow.value = !window.matchMedia('(min-width: 1280px)').matches
  } catch {
    narrow.value = true
  }
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
  updateWidth()
  window.addEventListener('resize', updateWidth)
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  cleanup()
})
</script>

<template>
  <div v-if="mounted && narrow" ref="root" class="share-bar">
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
        @click="onBtnClick(p)"
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
