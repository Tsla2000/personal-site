// 技能热度:GET /api/skill-rank -> {scores:{<技能id>:热度分}}
// 热度分 = 浏览*1 + 复制*3 + 下载*3 + 觉得有用*5,数据来自 hit.ts 写入的 KV skill:<id>
// 只返回综合分,不返回各项原始计数;前端据此排序,不展示数字
// KV 未绑定或读取失败时返回空 scores,前端回退到编辑推荐顺序
interface Env {
  STATS_KV?: KVNamespace
}

const WEIGHTS: Record<string, number> = { view: 1, copy: 3, download: 3, like: 5 }

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const scores: Record<string, number> = {}
  try {
    const kv = context.env.STATS_KV
    if (kv) {
      let cursor: string | undefined
      for (let page = 0; page < 3; page++) {
        const listed = await kv.list({ prefix: 'skill:', cursor, limit: 200 })
        for (const k of listed.keys) {
          const raw = await kv.get(k.name)
          if (!raw) continue
          const rec = JSON.parse(raw) as Record<string, number>
          let score = 0
          for (const [action, weight] of Object.entries(WEIGHTS)) score += (Number(rec[action]) || 0) * weight
          scores[k.name.slice('skill:'.length)] = score
        }
        if (listed.list_complete) break
        cursor = listed.cursor
      }
    }
  } catch {
    /* 返回已读到的部分 */
  }
  return new Response(JSON.stringify({ scores }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' }
  })
}
