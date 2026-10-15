// SEO 自动化检查：构建后运行，检查 dist/ 产物
// 用法：node scripts/check-seo.mjs
// 退出码：0=通过，1=有 P0/P1 级问题
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIST = new URL('../docs/.vitepress/dist/', import.meta.url).pathname
const errors = []  // P0: 阻止发布
const warnings = [] // P1: 需要关注

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p, []))
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

function getMeta(html, name) {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`, 'i'))
  return m ? m[1] : null
}

const pages = walk(DIST)
console.log(`[check-seo] 检查 ${pages.length} 个页面...`)

// 1. 每个页面有唯一的 title（跳过 GSC 验证文件等特殊页面）
const skipFiles = ['google', '404.html']
const titles = new Map()
for (const p of pages) {
  if (skipFiles.some(s => p.includes(s))) continue
  const html = readFileSync(p, 'utf8')
  const m = html.match(/<title>([^<]+)<\/title>/)
  const title = m ? m[1].trim() : null
  if (!title) {
    errors.push(`${p}: 缺少 <title>`)
  } else {
    if (titles.has(title)) titles.get(title).push(p)
    else titles.set(title, [p])
  }
}
for (const [t, ps] of titles) {
  if (ps.length > 1 && !t.includes('404')) {
    warnings.push(`重复 title "${t.slice(0, 30)}...": ${ps.length} 个页面`)
  }
}

// 2. 每个页面有 description（跳过特殊页面，允许首页等用默认）
for (const p of pages) {
  if (p.endsWith('404.html') || p.includes('google')) continue
  const html = readFileSync(p, 'utf8')
  const desc = getMeta(html, 'description')
  if (!desc) errors.push(`${p}: 缺少 meta description`)
}

// 3. canonical 存在且格式正确（本地构建用默认域名，线上用环境变量）
// 允许的域名：环境变量 CANONICAL_URL 或默认的 github.io（本地构建）
const allowedDomains = ['https://promangofund.com', 'https://tsla2000.github.io', 'https://mangofund.pages.dev']
for (const p of pages) {
  if (p.includes('google')) continue
  const html = readFileSync(p, 'utf8')
  const m = html.match(/<link rel="canonical" href="([^"]+)"/)
  if (!m) {
    errors.push(`${p}: 缺少 canonical`)
  } else if (!allowedDomains.some(d => m[1].startsWith(d))) {
    warnings.push(`${p}: canonical 域名异常: ${m[1]}`)
  }
}

// 4. 检查 sitemap.xml 存在，并覆盖实际可访问的页面（含原先被 draft/noindex 排除的）
const REQUIRED_SITEMAP_PATHS = [
  '/ai/coding/muse-seo-automation',
  '/subscribe',
  '/guestbook',
  '/sponsor',
  '/about/timeline'
]
const sitemap = join(DIST, 'sitemap.xml')
if (!existsSync(sitemap)) {
  errors.push('缺少 sitemap.xml')
} else {
  const sm = readFileSync(sitemap, 'utf8')
  const urls = (sm.match(/<loc>/g) || []).length
  console.log(`[check-seo] sitemap.xml: ${urls} 个 URL`)
  for (const path of REQUIRED_SITEMAP_PATHS) {
    if (!new RegExp(`<loc>[^<]*${path}</loc>`).test(sm)) {
      errors.push(`sitemap 缺少 ${path}`)
    }
  }
  const lastmods = [...sm.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1])
  if (lastmods.length !== urls) errors.push('sitemap 有 URL 缺少 lastmod')
  const uniqueLastmods = new Set(lastmods)
  if (urls > 5 && uniqueLastmods.size === 1) {
    errors.push(`sitemap lastmod 全部相同 (${[...uniqueLastmods][0]})，疑似用了构建时间`)
  }
  for (const value of lastmods) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(value)) errors.push(`sitemap lastmod 格式异常: ${value}`)
  }
}

// 4b. Cloudflare Pages 缓存头：哈希资源 immutable，图片长缓存，HTML 重新验证
const headersFile = join(DIST, '_headers')
if (!existsSync(headersFile)) {
  errors.push('缺少 _headers')
} else {
  const headers = readFileSync(headersFile, 'utf8')
  if (!headers.includes('/assets/*') || !headers.includes('immutable')) {
    errors.push('_headers 未给 /assets/* 设置 immutable 长缓存')
  }
  if (!headers.includes('/images/*') || !headers.includes('max-age=2592000')) {
    errors.push('_headers 未给 /images/* 设置长缓存')
  }
  if (!headers.includes('must-revalidate')) {
    errors.push('_headers 未让 HTML 重新验证')
  }
}

// 4c. 首页必须有包含站名和定位的 H1
const homeHtmlPath = join(DIST, 'index.html')
if (!existsSync(homeHtmlPath)) {
  errors.push('缺少首页 index.html')
} else {
  const homeHtml = readFileSync(homeHtmlPath, 'utf8')
  const h1s = homeHtml.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || []
  if (h1s.length === 0) errors.push('首页缺少 H1')
  else if (!h1s.some((h1) => h1.includes('PRO的茶里芒果') && h1.includes('思考'))) {
    errors.push('首页 H1 未同时包含站名和定位')
  }
}

// 4d. 审计点名的大图必须压到 150KB 以内；多图文章除首图外应懒加载
const MAX_IMAGE_BYTES = 150000
const auditedImages = [
  'images/about-map.webp',
  'images/ai-guide-railway.webp',
  'images/ai-guide-core-satellite.webp',
  'images/tesla-energy.webp',
  'images/wealth-option.webp',
  'images/coding-leverage-distance.webp',
  'images/liuliangzhu-seven-steps.jpg'
]
for (const rel of auditedImages) {
  const imgPath = join(DIST, rel)
  if (!existsSync(imgPath)) {
    errors.push(`缺少图片 ${rel}`)
    continue
  }
  const size = statSync(imgPath).size
  if (size > MAX_IMAGE_BYTES) errors.push(`${rel} 仍有 ${size} 字节，超过 150KB`)
}
const multiImagePage = pages.find((p) => p.includes('ai-stage-invest-guide'))
if (multiImagePage) {
  const html = readFileSync(multiImagePage, 'utf8')
  const imgs = html.match(/<img\b[^>]*>/g) || []
  const lazyCount = imgs.filter((tag) => /loading="lazy"/.test(tag)).length
  if (imgs.length > 1 && lazyCount === 0) errors.push('文章图片未懒加载')
}

// 5. 检查 robots.txt
const robots = join(DIST, 'robots.txt')
if (!existsSync(robots)) warnings.push('缺少 robots.txt')

// 6. 意外 noindex（timeline 和草稿是预期的）
// 草稿页通过 gen-seo.mjs 已从 sitemap 排除，但 HTML 仍会生成，noindex 是正确的
const expectedNoindex = ['timeline', 'muse-seo-automation', 'guestbook', 'sponsor', 'subscribe']  // timeline/guestbook/sponsor/subscribe: 主动 noindex；muse-seo-automation: 正文里出现该词
for (const p of pages) {
  const html = readFileSync(p, 'utf8')
  if (html.includes('noindex') && !expectedNoindex.some(s => p.includes(s))) {
    warnings.push(`${p}: 发现 noindex（确认是否预期）`)
  }
}

// 7. 图片 alt 检查（抽查文章页；完全缺失或空 alt 都算问题——Bing 会把空 alt 也判为缺失，
//    2026-10-15 教训：导航栏 logo 的空 alt 全站被报，靠 fix-logo-alt.mjs 在构建后补）
let imgNoAlt = 0
const noAltPages = new Set()
for (const p of pages) {
  if (!p.includes('/ai/') && !p.includes('/thinking/') && !p.includes('/investment/')) continue
  const html = readFileSync(p, 'utf8')
  const imgs = html.match(/<img[^>]*>/g) || []
  for (const img of imgs) {
    const m = img.match(/\salt(?:="([^"]*)")?(?=[\s>])/)
    if (!m || (m[1] !== undefined && m[1].trim() === '')) {
      imgNoAlt++
      noAltPages.add(p.split('/dist/')[1])
    }
  }
}
if (imgNoAlt > 0) warnings.push(`${imgNoAlt} 张图片缺 alt 或 alt 为空（${noAltPages.size} 个页面）：${[...noAltPages].slice(0, 3).join(', ')}${noAltPages.size > 3 ? '…' : ''}`)

// 输出结果
console.log('')
if (errors.length === 0 && warnings.length === 0) {
  console.log('[check-seo] ✅ 全部通过')
} else {
  if (errors.length > 0) {
    console.log(`[check-seo] ❌ ${errors.length} 个错误（P0）:`)
    errors.forEach(e => console.log(`  - ${e}`))
  }
  if (warnings.length > 0) {
    console.log(`[check-seo] ⚠️ ${warnings.length} 个警告（P1）:`)
    warnings.forEach(w => console.log(`  - ${w}`))
  }
}
process.exit(errors.length > 0 ? 1 : 0)
