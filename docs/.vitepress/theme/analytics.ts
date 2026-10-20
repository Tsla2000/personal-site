type AnalyticsEventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: AnalyticsEventData) => void
    }
  }
}

/**
 * Track only product-level actions. Never send prompts, clipboard contents,
 * file contents, emails, account identifiers, or other user-provided data.
 * The site remains functional when analytics is blocked or not configured.
 */
// 同步给第一方统计,用于技能热度排行(只传技能 id 与动作,不含任何用户数据)
const SKILL_STAT_ACTIONS: Record<string, string> = {
  skill_view: 'view',
  skill_copy: 'copy',
  skill_download: 'download',
  skill_like: 'like'
}

function forwardSkillStat(name: string, data: AnalyticsEventData): void {
  const action = SKILL_STAT_ACTIONS[name]
  if (!action || typeof data.skill_id !== 'string' || data.result === 'failed') return
  try {
    ;(window as unknown as { __statBeacon?: (t: string, p?: string) => void }).__statBeacon?.(
      'skill',
      `${action}:${data.skill_id}`
    )
  } catch {
    /* 统计失败不影响使用 */
  }
}

export function trackEvent(name: string, data: AnalyticsEventData = {}): void {
  if (typeof window === 'undefined') return
  forwardSkillStat(name, data)
  try {
    window.umami?.track(name, data)
  } catch {
    // Analytics must never interfere with copy, download, or navigation.
  }
}
