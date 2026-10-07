import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import type { EnhanceAppContext } from 'vitepress'
import { nextTick } from 'vue'
import type { Ref } from 'vue'
import './custom.css'

// ---------- 明暗切换音效：关灯下行"咔哒"，开灯上行"叮" ----------
let audioCtx: AudioContext | null = null

function playToggleSound(toDark: boolean) {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      audioCtx = new AC()
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    const t = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = toDark ? 'triangle' : 'sine'
    osc.frequency.setValueAtTime(toDark ? 520 : 440, t)
    osc.frequency.exponentialRampToValueAtTime(toDark ? 240 : 880, t + 0.12)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(t)
    osc.stop(t + 0.3)
  } catch {
    /* 音效失败不影响主题切换 */
  }
}

type StartViewTransition = (cb: () => Promise<void> | void) => { readonly ready: Promise<void> }

// ---------- 自定义明暗切换：从点击处圆形展开 + 音效 ----------
function toggleAppearance(event: MouseEvent, app: EnhanceAppContext['app']) {
  const { isDark } = app.runWithContext(() => useData()) as { isDark: Ref<boolean> }
  const toDark = !isDark.value
  playToggleSound(toDark)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startVT = (document as unknown as { startViewTransition?: StartViewTransition })
    .startViewTransition
  if (!startVT || reduceMotion) {
    isDark.value = toDark
    return
  }

  const x = event?.clientX ?? window.innerWidth - 60
  const y = event?.clientY ?? 48
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  const transition = startVT(async () => {
    isDark.value = toDark
    // 直接同步 class，保证过渡的新快照就是目标主题
    document.documentElement.classList.toggle('dark', toDark)
    await nextTick()
  })
  transition.ready.then(() => {
    document.documentElement.animate(
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
  }).catch(() => {})
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    // 覆盖主题默认的明暗切换（VPSwitchAppearance 通过 inject('toggle-appearance') 调用）
    app.provide('toggle-appearance', (event: MouseEvent) => toggleAppearance(event, app))
  }
}
