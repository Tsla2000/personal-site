import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import './custom.css'

// 明暗切换音效：关灯是下行的"咔哒"，开灯是上行的"叮"，用 Web Audio 现场合成，无需音频文件
let audioCtx: AudioContext | null = null

function playToggleSound(toDark: boolean) {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!audioCtx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      audioCtx = new AC()
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    const t = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = toDark ? 'triangle' : 'sine'
    osc.frequency.setValueAtTime(toDark ? 520 : 440, t)
    osc.frequency.exponentialRampToValueAtTime(toDark ? 240 : 880, t + 0.1)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.09, t + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(t)
    osc.stop(t + 0.2)
  } catch {
    /* 音效失败不影响主题切换 */
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp(_ctx: EnhanceAppContext) {
    if (typeof window === 'undefined') return
    document.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest?.('.VPSwitchAppearance')
      if (!el) return
      // 按钮自身的切换逻辑先执行，这里读到的是切换后的新状态
      requestAnimationFrame(() => {
        playToggleSound(document.documentElement.classList.contains('dark'))
      })
    })
  }
}
