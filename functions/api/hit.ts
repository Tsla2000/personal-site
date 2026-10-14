// 第一方统计:页面埋点 POST {t:'pv'|'bookmark'|'unbookmark'|'useful', p:path}
// 按北京时间日期存 KV:stats:YYYY-MM-DD -> {pv,bookmark,unbookmark,useful,paths:{}}
// KV 未绑定时静默 204,不影响站点(用户在 Cloudflare 后台绑好 STATS_KV 后自动开始计数)
interface Env {
  STATS_KV?: KVNamespace
}

const TYPES = new Set(['pv', 'bookmark', 'unbookmark', 'useful'])

function beijingDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const kv = context.env.STATS_KV
    if (!kv) return new Response(null, { status: 204 })
    let body: Record<string, unknown> = {}
    try {
      body = (await context.request.json()) as Record<string, unknown>
    } catch {
      return new Response(null, { status: 204 })
    }
    const t = typeof body.t === 'string' ? body.t : ''
    const p = typeof body.p === 'string' ? body.p.slice(0, 200) : ''
    if (!TYPES.has(t)) return new Response(null, { status: 204 })
    const key = `stats:${beijingDate()}`
    let cur: Record<string, any> = {}
    try {
      const raw = await kv.get(key)
      if (raw) cur = JSON.parse(raw)
    } catch {
      cur = {}
    }
    cur[t] = (cur[t] || 0) + 1
    if (t === 'pv' && p) {
      cur.paths = cur.paths || {}
      cur.paths[p] = (cur.paths[p] || 0) + 1
    }
    // 25MB 上限内;个人站每天几百次写入,KV 免费额度足够
    await kv.put(key, JSON.stringify(cur))
    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 204 })
  }
}

export const onRequestGet: PagesFunction = async () => {
  return new Response(null, { status: 405 })
}
