import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 站点 base 前缀（镜像站 BASE_PATH=/personal-site/）。
 * import.meta.env.BASE_URL 由 Vite 在构建时静态替换，SSR 与客户端都可用。
 */
function basePrefix(): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return base === '/' ? '' : base
}

/**
 * 去掉路径里的 base 前缀。
 * VitePress 在 SSR/构建时 route.path 会带上 base（如 /personal-site/en/skills/），
 * 直接按 '/en' 开头判断会在镜像站下失效。
 */
export function stripBasePrefix(path: string): string {
  const prefix = basePrefix()
  const p = path || '/'
  if (prefix && (p === prefix || p.startsWith(prefix + '/'))) {
    return p.slice(prefix.length) || '/'
  }
  return p
}

function isEnglishPath(path: string): boolean {
  const normalized = stripBasePrefix(path).replace(/\/$/, '') || '/'
  return normalized === '/en' || normalized.startsWith('/en/')
}

/** 当前路由是否在英文区（/en 前缀），base 感知。 */
export function useIsEnglish(): ComputedRef<boolean> {
  const route = useRoute()
  return computed(() => isEnglishPath(route.path))
}

/** 去掉 base 前缀的当前路径，供需要按路径判断的组件使用。 */
export function useBarePath(): ComputedRef<string> {
  const route = useRoute()
  return computed(() => stripBasePrefix(route.path || '/'))
}
