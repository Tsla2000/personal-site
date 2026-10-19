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
export function trackEvent(name: string, data: AnalyticsEventData = {}): void {
  if (typeof window === 'undefined') return
  try {
    window.umami?.track(name, data)
  } catch {
    // Analytics must never interfere with copy, download, or navigation.
  }
}
