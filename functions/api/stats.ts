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
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json' }
  })
}

export const onRequestPost: PagesFunction = async () => {
  return new Response(null, { status: 405 })
}
