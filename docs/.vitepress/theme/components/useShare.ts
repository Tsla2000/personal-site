import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import QRCode from 'qrcode'
import { siWechat, siSinaweibo, siXiaohongshu } from 'simple-icons'

export interface SharePlatform {
  key: string
  name: string
  tip: string
  svg: string
  color: string
  shareUrl?: (url: string, title: string) => string
}

export const LINK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'

export function useShare() {
  const platforms: SharePlatform[] = [
    { key: 'wechat', name: '微信', tip: '微信扫码，在微信中打开', svg: siWechat.svg, color: '#07C160' },
    {
      key: 'weibo', name: '微博', tip: '微博扫码分享', svg: siSinaweibo.svg, color: '#E6162D',
      shareUrl: (url: string, title: string) =>
        'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) +
        '&title=' + encodeURIComponent(title)
    },
    { key: 'xiaohongshu', name: '小红书', tip: '小红书扫码打开', svg: siXiaohongshu.svg, color: '#FF2442' }
  ]

  const pageUrl = ref('')
  const pageTitle = ref('')
  const openKey = ref<string | null>(null)
  const qrCache = ref<Record<string, string>>({})
  const copied = ref(false)
  const coarse = ref(false) // 触屏：hover 不可用，改用点击切换
  let copyTimer: ReturnType<typeof setTimeout> | null = null

  function init(): void {
    try {
      coarse.value = window.matchMedia('(pointer: coarse)').matches
    } catch { /* 忽略 */ }
    try {
      const el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      pageUrl.value = (el && el.href) || location.href
    } catch {
      pageUrl.value = location.href
    }
    try {
      pageTitle.value = document.title
    } catch { /* 忽略 */ }
  }

  function resetForRoute(): void {
    init()
    qrCache.value = {}
    openKey.value = null
    copied.value = false
  }

  // SPA 切文章时刷新 URL（组件不重建，onMounted 不会再跑）
  try {
    const route = useRoute()
    watch(() => route.path, resetForRoute)
  } catch { /* 非路由上下文忽略 */ }

  async function qrFor(key: string): Promise<void> {
    if (qrCache.value[key] || !pageUrl.value) return
    try {
      qrCache.value[key] = await QRCode.toDataURL(pageUrl.value, { width: 168, margin: 1 })
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

  function openPlatform(p: SharePlatform): void {
    if (!p.shareUrl) return
    window.open(p.shareUrl(pageUrl.value, pageTitle.value), '_blank', 'noopener,noreferrer')
  }

  function onBtnClick(p: SharePlatform): void {
    if (p.shareUrl && !coarse.value) {
      openPlatform(p)
      return
    }
    if (coarse.value) toggle(p.key)
    // 桌面端非分享链接按钮：hover 已处理展示，点击无需额外动作
  }

  async function copyLink(): Promise<void> {
    hide()
    try {
      await navigator.clipboard.writeText(pageUrl.value)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = pageUrl.value
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

  function cleanup(): void {
    if (copyTimer) clearTimeout(copyTimer)
  }

  return {
    platforms, pageUrl, pageTitle, openKey, qrCache, copied, coarse,
    init, show, hide, toggle, onBtnClick, copyLink, cleanup
  }
}
