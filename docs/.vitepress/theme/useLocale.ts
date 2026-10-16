import { computed } from 'vue'
import { useRoute } from 'vitepress'

export function useIsEnglish() {
  const route = useRoute()
  return computed(() => {
    const path = route.path || ''
    return path === '/en' || path === '/en/' || path.startsWith('/en/')
  })
}
