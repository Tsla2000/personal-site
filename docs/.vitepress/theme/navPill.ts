import { inBrowser } from 'vitepress'

/** 加在 <html> 上。桌面端滚动过阈值后，导航收成居中毛玻璃胶囊。 */
export const NAV_PILL_CLASS = 'nav-pill'

/** 与 custom.css 里 min-width: 1100px 的胶囊媒体查询保持一致。 */
export const NAV_PILL_MIN_WIDTH_PX = 1100

const ENTER_VAR = '--vp-nav-pill-enter'
const EXIT_VAR = '--vp-nav-pill-exit'
const DEFAULT_ENTER_PX = 80
const DEFAULT_EXIT_PX = 40

function readPx(name: string, fallback: number): number {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
    const value = Number.parseFloat(raw)
    return Number.isFinite(value) ? value : fallback
  } catch {
    return fallback
  }
}

/**
 * 滚动超过 --vp-nav-pill-enter（默认 80px）时给 html 加上 nav-pill；
 * 回到 --vp-nav-pill-exit（默认 40px）以内再去掉，避免在阈值附近来回闪。
 * 窄屏不加这个 class，样式里用同一断点再挡一层。
 * 翻页后 VitePress 会 window.scrollTo，滚动事件本身就会把状态拨回去。
 */
export function setupNavPill(): void {
  if (!inBrowser) return
  try {
    const root = document.documentElement
    const desktop = window.matchMedia(`(min-width: ${NAV_PILL_MIN_WIDTH_PX}px)`)
    let frame = 0
    let enterPx = DEFAULT_ENTER_PX
    let exitPx = DEFAULT_EXIT_PX

    const readThresholds = (): void => {
      enterPx = readPx(ENTER_VAR, DEFAULT_ENTER_PX)
      exitPx = readPx(EXIT_VAR, DEFAULT_EXIT_PX)
      if (exitPx >= enterPx) exitPx = Math.max(0, enterPx - 1)
    }

    const apply = (): void => {
      frame = 0
      const y = window.scrollY || 0
      const active = root.classList.contains(NAV_PILL_CLASS)
      const next = desktop.matches && (active ? y > exitPx : y > enterPx)
      root.classList.toggle(NAV_PILL_CLASS, next)
    }

    const schedule = (): void => {
      if (frame) return
      frame = window.requestAnimationFrame(apply)
    }

    readThresholds()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('pageshow', schedule)
    desktop.addEventListener('change', () => {
      readThresholds()
      schedule()
    })
    schedule()
  } catch {
    /* 导航胶囊失败时保留默认顶栏 */
  }
}
