import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import type { EnhanceAppContext } from 'vitepress'
import { nextTick } from 'vue'
import type { App, Ref } from 'vue'
import './custom.css'

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
    burst(ctx, t, 780 * bright, 0.9, 0.075, 0.55) // 反光板抬起 "咔"
    thump(ctx, t, 165, 62, 0.095, 0.4)
    burst(ctx, t + 0.075, 2700 * bright, 1.1, 0.05, 0.45) // 快门 "嚓"
    thump(ctx, t + 0.075, 230, 95, 0.05, 0.22)
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

  const x = event?.clientX ?? window.innerWidth - 60
  const y = event?.clientY ?? 48
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  try {
    const transition = startVT(async () => {
      apply()
      el.classList.toggle('dark', toDark) // 与 watcher 幂等，确保过渡快照正确
      await nextTick()
    })
    transition.ready.then(() => {
      try {
        el.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 600,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)'
          }
        )
      } catch {
        /* 忽略 */
      }
    }).catch(() => {})
  } catch {
    apply()
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    // 覆盖主题默认的明暗切换（VPSwitchAppearance 通过 inject('toggle-appearance') 调用）
    app.provide('toggle-appearance', (event: MouseEvent) => toggleAppearance(event, app))
  }
}
