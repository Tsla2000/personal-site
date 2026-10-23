import DefaultTheme from 'vitepress/theme'
import { useData, inBrowser } from 'vitepress'
import type { EnhanceAppContext, Router } from 'vitepress'
import { nextTick, h, defineAsyncComponent } from 'vue'
import type { App, Ref } from 'vue'
import ShareBar from './components/ShareBar.vue'
import ShareRail from './components/ShareRail.vue'
import Twikoo from './components/Twikoo.vue'
import UsefulButton from './components/UsefulButton.vue'
import FollowButton from './components/FollowButton.vue'
import UpdateBanner from './components/UpdateBanner.vue'
import LangSwitch from './components/LangSwitch.vue'
import WechatNav from './components/WechatNav.vue'
import './custom.css'

// 技能卡片、详情和归档侧栏依赖 homeSkills 大数据表，只在技能相关页面用到，异步拆包，不进全站公共 theme chunk
const SkillShowcase = defineAsyncComponent(() => import('./components/SkillShowcase.vue'))
const SkillDetail = defineAsyncComponent(() => import('./components/SkillDetail.vue'))
const ArchiveSidebar = defineAsyncComponent(() => import('./components/ArchiveSidebar.vue'))

// ---------- 哈苏式机械快门音效（Web Audio 合成）：反光板"咔" + 快门"嚓" ----------
let audioCtx: AudioContext | null = null
let noiseBuf: AudioBuffer | null = null

function ensureAudio(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      audioCtx = new AC()
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    return audioCtx
  } catch {
    return null
  }
}

function getNoise(ctx: AudioContext): AudioBuffer {
  if (!noiseBuf) {
    const len = Math.floor(ctx.sampleRate * 0.3)
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  }
  return noiseBuf
}

// 带通噪声 burst：机械部件的"咔哒"质感
function burst(
  ctx: AudioContext,
  t0: number,
  freq: number,
  q: number,
  dur: number,
  peak: number
) {
  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  src.loop = true
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = freq
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f)
  f.connect(g)
  g.connect(ctx.destination)
  src.start(t0)
  src.stop(t0 + dur + 0.05)
}

// 低频 thump：机身共振的"闷"感
function thump(
  ctx: AudioContext,
  t0: number,
  f0: number,
  f1: number,
  dur: number,
  peak: number
) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(f0, t0)
  osc.frequency.exponentialRampToValueAtTime(f1, t0 + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function playShutterSound(toDark: boolean) {
  const ctx = ensureAudio()
  if (!ctx) return
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = ctx.currentTime + 0.01
    const bright = toDark ? 0.85 : 1.12 // 关灯稍闷，开灯稍亮
    burst(ctx, t, 780 * bright, 0.9, 0.075, 0.32) // 反光板抬起 "咔"
    thump(ctx, t, 165, 62, 0.095, 0.24)
    burst(ctx, t + 0.075, 2700 * bright, 1.1, 0.05, 0.28) // 快门 "嚓"
    thump(ctx, t + 0.075, 230, 95, 0.05, 0.14)
  } catch {
    /* 忽略 */
  }
}

type StartViewTransition = (cb: () => Promise<void> | void) => { readonly ready: Promise<void> }
const APPEARANCE_KEY = 'vitepress-theme-appearance'

// ---------- 自定义明暗切换：圆形展开过渡 + 快门音效，处处兜底保证可点 ----------
function toggleAppearance(event: MouseEvent, app: App) {
  // 解析 isDark：优先走 ref，失败则回退读 DOM，保证切换永远可用
  let isDarkRef: Ref<boolean> | null = null
  try {
    const data = app.runWithContext(() => useData()) as { isDark?: Ref<boolean> }
    if (data && data.isDark) isDarkRef = data.isDark
  } catch {
    isDarkRef = null
  }

  const el = document.documentElement
  const toDark = isDarkRef ? !isDarkRef.value : !el.classList.contains('dark')

  playShutterSound(toDark)

  const apply = () => {
    if (isDarkRef) {
      isDarkRef.value = toDark
    } else {
      // 终极回退：直接操作 DOM + 持久化
      el.classList.toggle('dark', toDark)
      try {
        localStorage.setItem(APPEARANCE_KEY, toDark ? 'dark' : 'light')
      } catch {
        /* 忽略 */
      }
    }
  }

  let startVT: StartViewTransition | undefined
  try {
    const raw = (document as unknown as { startViewTransition?: StartViewTransition })
      .startViewTransition
    // 必须保留 document 接收者，裸调用会抛 Illegal invocation
    startVT = typeof raw === 'function' ? (cb) => raw.call(document, cb) : undefined
  } catch {
    startVT = undefined
  }
  let reduceMotion = false
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    /* 忽略 */
  }

  if (!startVT || reduceMotion) {
    apply()
    return
  }

  try {
    // 渐隐渐现由 CSS ::view-transition-new(root) 的 keyframes 完成，这里只负责快照翻转
    startVT(async () => {
      apply()
      el.classList.toggle('dark', toDark) // 与 watcher 幂等，确保过渡快照正确
      await nextTick()
    })
  } catch {
    apply()
  }
}

// 第一方统计埋点 v2(Cloudflare Pages Function + KV,每日 cron 拉数出日报):
// 只在主站 promangofund.com 发,GitHub Pages 镜像站跳过,避免重复计数。
// 每条上报带渠道 c(UTM 优先,其次 referrer,站内跳转沿用会话渠道)和访客匿名 ID v
// (localStorage 随机 ID,仅用于新访/回访与留存,不含任何个人信息)。
// 有效访问 ev:单页停留 >=10 秒且滚动深度 >=25%,每页只报一次。
// 站长排除:打开任意页带 ?pm_owner=1 后,本浏览器所有上报带 o=1,服务端不计数;
// ?pm_owner=0 取消。解决站长自测污染数据。
// sendBeacon 即发即忘,KV 未绑定前接口返回 204,不影响站点。
function detectChannel(): string {
  try {
    const utm = new URLSearchParams(window.location.search).get('utm_source')
    if (utm) {
      const u = utm.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20)
      if (u === 'wx' || u === 'wechat') return 'wechat'
      if (u === 'twitter') return 'x'
      if (u === 'google' || u === 'bing' || u === 'baidu') return 'search'
      return u || 'direct'
    }
    const ref = document.referrer || ''
    if (!ref) return 'direct'
    const host = new URL(ref).hostname
    if (host === window.location.hostname) return 'direct'
    if (/google\.|bing\.com|baidu\.com|duckduckgo\.com|sogou\.com/.test(host)) return 'search'
    if (/x\.com|twitter\.com|(^|\.)t\.co$/.test(host)) return 'x'
    if (/weixin|wechat/.test(host)) return 'wechat'
    if (/github\.com/.test(host)) return 'github'
    return 'other'
  } catch {
    return 'direct'
  }
}

function setupStatsBeacon(router: Router): void {
  if (!inBrowser) return
  let vid = ''
  let owner = false
  let channel = 'direct'
  let medium = 'none'
  try {
    const q = new URLSearchParams(window.location.search)
    if (q.get('pm_owner') === '1') window.localStorage.setItem('pm_owner', '1')
    if (q.get('pm_owner') === '0') window.localStorage.removeItem('pm_owner')
    owner = window.localStorage.getItem('pm_owner') === '1'
    vid = window.localStorage.getItem('pm_vid') || ''
    if (!vid) {
      vid =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
      window.localStorage.setItem('pm_vid', vid)
    }
    // 会话渠道:落地页渠道为准,站内跳转不漂移;新 UTM 到达时更新
    const detected = detectChannel()
    const sess = window.sessionStorage.getItem('pm_ch')
    if (q.get('utm_source') || !sess) {
      channel = detected
      window.sessionStorage.setItem('pm_ch', channel)
    } else {
      channel = sess
    }
    // 会话位置(utm_medium):与渠道同规则,新 UTM 到达时更新;无 medium 时记 'none'
    const rawMedium = (q.get('utm_medium') || '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
      .slice(0, 20)
    const sessMd = window.sessionStorage.getItem('pm_md')
    if (q.get('utm_source') || q.get('utm_medium') || !sessMd) {
      medium = rawMedium || 'none'
      window.sessionStorage.setItem('pm_md', medium)
    } else {
      medium = sessMd
    }
  } catch {
    /* 隐私模式等场景拿不到 storage 时降级为无 ID 计数 */
  }
  const beacon = (t: string, p = ''): void => {
    try {
      if (window.location.hostname !== 'promangofund.com') return
      const payload: Record<string, unknown> = { t, p, c: channel, v: vid, m: medium }
      if (owner) payload.o = 1
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/hit', blob)
    } catch {
      /* 忽略 */
    }
  }
  // 有效访问判定:停留 >=10s 且滚动 >=25%
  let evTimer: number | undefined
  let evScroll: (() => void) | undefined
  const armEffective = (path: string): void => {
    try {
      if (evTimer) window.clearInterval(evTimer)
      if (evScroll) window.removeEventListener('scroll', evScroll)
      let maxDepth = 0
      let fired = false
      const start = Date.now()
      evScroll = () => {
        const doc = document.documentElement
        const total = doc.scrollHeight - window.innerHeight
        const depth = total > 0 ? Math.min(1, window.scrollY / total) : 1
        if (depth > maxDepth) maxDepth = depth
      }
      window.addEventListener('scroll', evScroll, { passive: true })
      evScroll()
      evTimer = window.setInterval(() => {
        if (fired) return
        if (Date.now() - start >= 10000 && maxDepth >= 0.25) {
          fired = true
          beacon('ev', path)
          if (evTimer) window.clearInterval(evTimer)
        }
      }, 1000)
    } catch {
      /* 忽略 */
    }
  }
  try {
    ;(window as unknown as { __statBeacon?: (t: string, p?: string) => void }).__statBeacon = beacon
    beacon('pv', window.location.pathname)
    armEffective(window.location.pathname)
    router.onAfterRouteChanged(() => {
      beacon('pv', window.location.pathname)
      armEffective(window.location.pathname)
    })
  } catch {
    /* 忽略 */
  }
}

// ---------- 文章内嵌视频：统一加居中大播放按钮（与技能详情页同款 .video-play-btn） ----------
function enhanceArticleVideos(): void {
  document.querySelectorAll<HTMLVideoElement>('.vp-doc video').forEach((video) => {
    // 技能详情页头图视频由 SkillDetail 组件自带按钮；已增强过的跳过
    if (video.closest('.skill-thumb') || video.closest('.md-video-wrap')) return
    const wrap = document.createElement('div')
    wrap.className = 'md-video-wrap'
    video.parentNode?.insertBefore(wrap, video)
    wrap.appendChild(video)
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'video-play-btn'
    btn.setAttribute('aria-label', '播放视频')
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
    wrap.appendChild(btn)
    const sync = () => {
      btn.style.display = video.paused || video.ended ? 'flex' : 'none'
    }
    video.addEventListener('play', sync)
    video.addEventListener('pause', sync)
    video.addEventListener('ended', sync)
    btn.addEventListener('click', () => {
      void video.play()
    })
    sync()
  })
}

function setupVideoPlayButtons(router: Router): void {
  if (!inBrowser) return
  let queued = false
  const schedule = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      try {
        enhanceArticleVideos()
      } catch {
        /* 忽略 */
      }
    })
  }
  schedule()
  window.addEventListener('load', schedule)
  // 路由切换后新文章的视频也要增强；包裹已有回调（统计 beacon），不覆盖它
  const prev = router.onAfterRouteChanged
  router.onAfterRouteChanged = (to?: string) => {
    prev?.(to)
    window.setTimeout(schedule, 60)
  }
  // 水合后 DOM 才出现的视频靠观察器兜底
  const startObserver = () => {
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { childList: true, subtree: true })
  }
  if (document.body) startObserver()
  else document.addEventListener('DOMContentLoaded', startObserver)
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => [h(UpdateBanner), h(ShareRail)],
    'doc-footer-before': () => [h(UsefulButton), h(ShareBar), h(Twikoo)],
    'nav-bar-content-after': () => h(WechatNav)
  }),
  enhanceApp({ app, router }: EnhanceAppContext) {
    // 留言板页 markdown 里直接用 <Twikoo />
    app.component('Twikoo', Twikoo)
    app.component('LangSwitch', LangSwitch)
    app.component('SkillShowcase', SkillShowcase)
    app.component('SkillDetail', SkillDetail)
    app.component('ArchiveSidebar', ArchiveSidebar)
    // 订阅页 markdown 里直接用 <FollowButton />
    app.component('FollowButton', FollowButton)
    // 覆盖主题默认的明暗切换（VPSwitchAppearance 通过 inject('toggle-appearance') 调用）
    app.provide('toggle-appearance', (event: MouseEvent) => toggleAppearance(event, app))
    setupStatsBeacon(router)
    setupVideoPlayButtons(router)
  }
}
