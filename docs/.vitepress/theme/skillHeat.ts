import { ref } from 'vue'

/** 技能热度分(技能 id -> 分数)。未加载或接口不可用时为 null,页面回退到编辑推荐顺序。 */
export const skillHeat = ref<Record<string, number> | null>(null)

let started = false

export function loadSkillHeat(): void {
  if (started || typeof window === 'undefined') return
  started = true
  fetch('/api/skill-rank')
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data && data.scores && typeof data.scores === 'object') skillHeat.value = data.scores
    })
    .catch(() => {
      /* 镜像站或接口不可用:保持编辑推荐顺序 */
    })
}
