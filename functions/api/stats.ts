// 统计查询:GET /api/stats?from=YYYY-MM-DD&to=YYYY-MM-DD&token=xxx
// token 在 Cloudflare Pages 环境变量 STATS_TOKEN 里配置,每日 cron 用它拉数
interface Env {
  STATS_KV?: KVNamespace
  STATS_TOKEN?: string
}

function parseDay(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return Number.isNaN(d.getTime()) ? null : d
}

function fmtDay(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const expected = context.env.STATS_TOKEN || ''
  const token = url.searchParams.get('token') || ''
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }
  const kv = context.env.STATS_KV
  if (!kv) {
    return new Response(JSON.stringify({ error: 'not_configured' }), {
      status: 503,
      headers: { 'content-type': 'application/json' }
    })
  }
  const toParam = url.searchParams.get('to') || ''
  const fromParam = url.searchParams.get('from') || toParam
  const from = parseDay(fromParam)
  const to = parseDay(toParam) || from
  if (!from || !to) {
    return new Response(JSON.stringify({ error: 'bad_date' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    })
  }
  // 最多 32 天,防止滥用
  const days: string[] = []
  const cur = new Date(from.getTime())
  while (cur.getTime() <= to.getTime() && days.length < 32) {
    days.push(fmtDay(cur))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  const out: Record<string, unknown> = {}
  for (const d of days) {
    try {
      const raw = await kv.get(`stats:${d}`)
      out[d] = raw
        ? JSON.parse(raw)
        : { pv: 0, bookmark: 0, unbookmark: 0, useful: 0, paths: {} }
    } catch {
      out[d] = { pv: 0, bookmark: 0, unbookmark: 0, useful: 0, paths: {} }
    }
  }
  // 访客明细(留存计算用):&visitors=1 时附带全部访客记录的 {f:首访日,c:首触渠道,l:最近访问日}
  // 不含访客 ID;个人站量级下全量枚举足够(上限 1000 条,超出截断并标注)
  if (url.searchParams.get('visitors') === '1') {
    const visitors: Array<{ f: string; c: string; l: string }> = []
    try {
      let cursor: string | undefined
      for (let page = 0; page < 5 && visitors.length < 1000; page++) {
        const listed = await kv.list({ prefix: 'v:', cursor, limit: 200 })
        for (const k of listed.keys) {
          if (visitors.length >= 1000) break
          const raw = await kv.get(k.name)
          if (!raw) continue
          try {
            const rec = JSON.parse(raw)
            if (rec && rec.f && rec.l) visitors.push({ f: rec.f, c: rec.c || 'direct', l: rec.l })
          } catch {
            /* 跳过坏记录 */
          }
        }
        if (listed.list_complete) break
        cursor = listed.cursor
      }
    } catch {
      /* 访客枚举失败不影响日计数返回 */
    }
    out['visitors'] = visitors
    out['visitors_truncated'] = visitors.length >= 1000
  }
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json' }
  })
}

export const onRequestPost: PagesFunction = async () => {
  return new Response(null, { status: 405 })
}
