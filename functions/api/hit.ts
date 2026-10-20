// 第一方统计 v2:页面埋点 POST {t,p,c,v,o,m}
// t:'pv'|'ev'|'follow'|'unfollow'|'useful'|'bookmark'|'unbookmark'|'skill'
// t='skill' 时 p 为 '<view|copy|download|like>:<技能id>',累计到 KV skill:<id> -> {view,copy,download,like},
//   同一访客同一技能同一动作每天只计 1 次;汇总由 GET /api/skill-rank 提供(技能热度排行)
// c:渠道(wechat/x/search/github/direct/other 或 utm_source 原值净化后)
// m:投放位置 utm_medium(净化后,无则 'none'),分渠道记在 channels[ch].md 下
// v:访客匿名 ID(localStorage 随机 ID,第一方,无个人信息)
// o:1 = 站长本人浏览器,全部跳过不计数(解决自测污染)
// 按北京时间日期存 KV:stats:YYYY-MM-DD ->
//   {pv,follow,unfollow,useful,bookmark,unbookmark,paths:{},
//    channels:{<渠道>:{pv,ev,act,new,ret,av:[激活过的访客ID,当日去重],
//                      md:{<位置>:{pv,ev,act}}}}}
// 访客记录 KV:v:<vid> -> {f:首次日期,c:首触渠道,l:最近日期} 供留存计算
// KV 未绑定时静默 204,不影响站点
interface Env {
  STATS_KV?: KVNamespace
}

const TYPES = new Set(['pv', 'ev', 'bookmark', 'unbookmark', 'useful', 'follow', 'unfollow', 'skill'])
const SKILL_ACTIONS = new Set(['view', 'copy', 'download', 'like'])
const ACT_TYPES = new Set(['bookmark', 'useful', 'follow'])

function beijingDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d)
}

function sanitizeTag(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string') return fallback
  const c = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20)
  return c || fallback
}

function sanitizeChannel(raw: unknown): string {
  return sanitizeTag(raw, 'direct')
}

function sanitizeVid(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return /^[a-zA-Z0-9-]{8,48}$/.test(raw) ? raw : ''
}

async function countSkill(kv: KVNamespace, p: string, vid: string): Promise<void> {
  const [action, id] = p.split(':')
  if (!SKILL_ACTIONS.has(action) || !/^[A-Za-z0-9_-]{1,60}$/.test(id || '')) return
  if (vid) {
    const dkey = `sd:${beijingDate()}:${vid}:${action}:${id}`
    if (await kv.get(dkey)) return
    await kv.put(dkey, '1', { expirationTtl: 3 * 86400 })
  }
  const key = `skill:${id}`
  let cur: Record<string, number> = {}
  try {
    const raw = await kv.get(key)
    if (raw) cur = JSON.parse(raw)
  } catch {
    cur = {}
  }
  cur[action] = (cur[action] || 0) + 1
  await kv.put(key, JSON.stringify(cur))
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
    // 站长自测一律不计数
    if (body.o === 1 || body.o === '1') return new Response(null, { status: 204 })
    const t = typeof body.t === 'string' ? body.t : ''
    const p = typeof body.p === 'string' ? body.p.slice(0, 200) : ''
    if (!TYPES.has(t)) return new Response(null, { status: 204 })
    if (t === 'skill') {
      await countSkill(kv, p, sanitizeVid(body.v))
      return new Response(null, { status: 204 })
    }
    const ch = sanitizeChannel(body.c)
    const md = sanitizeTag(body.m, 'none')
    const vid = sanitizeVid(body.v)
    const today = beijingDate()
    const key = `stats:${today}`
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
    cur.channels = cur.channels || {}
    const cc = (cur.channels[ch] =
      cur.channels[ch] || { pv: 0, ev: 0, act: 0, new: 0, ret: 0, av: [] })
    cc.md = cc.md || {}
    const mm = (cc.md[md] = cc.md[md] || { pv: 0, ev: 0, act: 0 })
    if (t === 'pv') {
      cc.pv = (cc.pv || 0) + 1
      mm.pv = (mm.pv || 0) + 1
      // 访客首触/回访:只在 pv 时维护访客记录
      if (vid) {
        const vkey = `v:${vid}`
        let rec: Record<string, string> | null = null
        try {
          const raw = await kv.get(vkey)
          if (raw) rec = JSON.parse(raw)
        } catch {
          rec = null
        }
        if (!rec) {
          await kv.put(vkey, JSON.stringify({ f: today, c: ch, l: today }))
          cc.new = (cc.new || 0) + 1
        } else if (rec.l !== today) {
          // 跨日回访:记到首触渠道名下
          const first = sanitizeChannel(rec.c)
          const fc = (cur.channels[first] =
            cur.channels[first] || { pv: 0, ev: 0, act: 0, new: 0, ret: 0, av: [] })
          fc.ret = (fc.ret || 0) + 1
          rec.l = today
          await kv.put(vkey, JSON.stringify(rec))
        }
      }
    } else if (t === 'ev') {
      cc.ev = (cc.ev || 0) + 1
      mm.ev = (mm.ev || 0) + 1
    } else if (ACT_TYPES.has(t)) {
      // 激活按访客当日去重(无 vid 时直接计);计入时同步记到该次事件的位置名下
      cc.av = Array.isArray(cc.av) ? cc.av : []
      if (!vid) {
        cc.act = (cc.act || 0) + 1
        mm.act = (mm.act || 0) + 1
      } else if (!cc.av.includes(vid)) {
        cc.av.push(vid)
        if (cc.av.length > 300) cc.av = cc.av.slice(-300)
        cc.act = (cc.act || 0) + 1
        mm.act = (mm.act || 0) + 1
      }
    }
    await kv.put(key, JSON.stringify(cur))
    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 204 })
  }
}

export const onRequestGet: PagesFunction = async () => {
  return new Response(null, { status: 405 })
}
