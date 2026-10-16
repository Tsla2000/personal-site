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

function getMetaAll(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || []
  const values = []
  const prop = new RegExp(`(?:name|property)="${name}"`)
  for (const tag of tags) {
    if (!prop.test(tag)) continue
    const content = tag.match(/content="([^"]*)"/)
    if (content) values.push(content[1])
  }
  return values
}

function readJsonLd(html, file) {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  const nodes = []
  for (const block of blocks) {
    try {
      nodes.push(JSON.parse(block[1].trim()))
    } catch {
      errors.push(`${file}: JSON-LD 无法解析`)
    }
  }
  return nodes
}

const AUTHOR_KEYS = ['@type', 'name', 'url', 'sameAs']

function assertKnownAuthor(file, author) {
  if (!author || author['@type'] !== 'Person' || author.name !== 'pro') {
    errors.push(`${file}: JSON-LD author 不是既有的 pro`)
    return
  }
  for (const key of Object.keys(author)) {
    if (!AUTHOR_KEYS.includes(key)) errors.push(`${file}: JSON-LD author 多了字段 ${key}`)
  }
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

// 4e. 英文站：sitemap 收录 /en/，双语文章互指 hreflang，html lang 与 og:locale 按语言分开
const enHome = join(DIST, 'en', 'index.html')
const enTesla = join(DIST, 'en', 'investment', 'tesla', 'q3-earnings-preview.html')
const zhTesla = join(DIST, 'investment', 'tesla', 'q3-earnings-preview.html')
if (!existsSync(enHome)) errors.push('缺少英文首页 /en/')
if (!existsSync(enTesla)) errors.push('缺少英文 Tesla Q3 文章')
if (existsSync(sitemap)) {
  const sm = readFileSync(sitemap, 'utf8')
  if (!/<loc>[^<]*\/en\/investment\/tesla\/q3-earnings-preview<\/loc>/.test(sm)) {
    errors.push('sitemap 缺少 /en/investment/tesla/q3-earnings-preview')
  }
  if (!/<loc>[^<]*\/en<\/loc>/.test(sm)) errors.push('sitemap 缺少 /en')
}
function hreflangTag(html, lang) {
  const tags = html.match(/<link\b[^>]*>/gi) || []
  return tags.find((tag) => tag.includes('rel="alternate"') && tag.includes(`hreflang="${lang}"`)) || ''
}
for (const file of [zhTesla, enTesla]) {
  if (!existsSync(file)) continue
  const html = readFileSync(file, 'utf8')
  for (const lang of ['zh-CN', 'en', 'x-default']) {
    if (!hreflangTag(html, lang)) errors.push(`${file}: 缺少 hreflang=${lang}`)
  }
  const xDefault = hreflangTag(html, 'x-default')
  if (xDefault && (xDefault.includes('/en/investment/') || !xDefault.includes('/investment/tesla/q3-earnings-preview'))) {
    errors.push(`${file}: x-default 未指向中文 Tesla 文章`)
  }
}
if (existsSync(enTesla)) {
  const html = readFileSync(enTesla, 'utf8')
  if (!/<html[^>]*\blang="en"/.test(html)) errors.push('英文 Tesla 文章 html lang 不是 en')
  if (getMeta(html, 'og:locale') !== 'en_US') errors.push('英文 Tesla 文章 og:locale 不是 en_US')
  const keywords = getMeta(html, 'keywords')
  if (!keywords || !/Tesla Q3 2026/i.test(keywords)) errors.push('英文 Tesla 文章缺少英文 keywords')
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || ''
  if (!title.includes('Tesla Q3 2026')) errors.push('英文 Tesla 文章 title 未包含 Tesla Q3 2026')
  const desc = getMeta(html, 'description') || ''
  if (!/Tesla Q3 2026/i.test(desc)) errors.push('英文 Tesla 文章 description 不是英文检索向描述')
  if (!html.includes('This is a personal note, not investment advice.')) {
    errors.push('英文 Tesla 文章缺少指定免责声明')
  }
}
if (existsSync(zhTesla)) {
  const html = readFileSync(zhTesla, 'utf8')
  if (!/<html[^>]*\blang="zh-CN"/.test(html)) errors.push('中文 Tesla 文章 html lang 不是 zh-CN')
  if (getMeta(html, 'og:locale') !== 'zh_CN') errors.push('中文 Tesla 文章 og:locale 不是 zh_CN')
}
if (existsSync(enHome)) {
  const html = readFileSync(enHome, 'utf8')
  if (!/<html[^>]*\blang="en"/.test(html)) errors.push('英文首页 html lang 不是 en')
  if (getMeta(html, 'og:locale') !== 'en_US') errors.push('英文首页 og:locale 不是 en_US')
  if (!html.includes("Pro's MangoFund")) errors.push('英文首页未出现 Pro\'s MangoFund')
  if (!html.includes('/en/ai/trends/claude-search-surge') && !html.includes('ai/trends/claude-search-surge')) {
    errors.push('英文首页文章列表缺少 Claude 搜索热度')
  }
  if (!html.includes('ai/coding/muse-auto-deploy')) {
    errors.push('英文首页文章列表缺少 Muse 自动部署')
  }
}

const enClaude = join(DIST, 'en', 'ai', 'trends', 'claude-search-surge.html')
const zhClaude = join(DIST, 'ai', 'trends', 'claude-search-surge.html')
if (!existsSync(enClaude)) errors.push('缺少英文 Claude 搜索热度文章')
if (existsSync(sitemap)) {
  const sm = readFileSync(sitemap, 'utf8')
  if (!/<loc>[^<]*\/en\/ai\/trends\/claude-search-surge<\/loc>/.test(sm)) {
    errors.push('sitemap 缺少 /en/ai/trends/claude-search-surge')
  }
  const claudeEntry = sm.match(/<url><loc>[^<]*\/en\/ai\/trends\/claude-search-surge<\/loc><lastmod>([^<]*)<\/lastmod><\/url>/)
  if (!claudeEntry) errors.push('sitemap 英文 Claude 文章缺少 lastmod')
  else if (!/^\d{4}-\d{2}-\d{2}/.test(claudeEntry[1])) errors.push('sitemap 英文 Claude lastmod 格式异常')
}
for (const file of [zhClaude, enClaude]) {
  if (!existsSync(file)) continue
  const html = readFileSync(file, 'utf8')
  for (const lang of ['zh-CN', 'en', 'x-default']) {
    if (!hreflangTag(html, lang)) errors.push(`${file}: 缺少 hreflang=${lang}`)
  }
  const xDefault = hreflangTag(html, 'x-default')
  if (xDefault && (xDefault.includes('/en/ai/') || !xDefault.includes('/ai/trends/claude-search-surge'))) {
    errors.push(`${file}: x-default 未指向中文 Claude 文章`)
  }
  const published = getMeta(html, 'article:published_time') || ''
  if (!published.startsWith('2026-10-16')) {
    errors.push(`${file}: article:published_time 不是 2026-10-16`)
  }
}
if (existsSync(enClaude)) {
  const html = readFileSync(enClaude, 'utf8')
  if (!/<html[^>]*\blang="en"/.test(html)) errors.push('英文 Claude 文章 html lang 不是 en')
  if (getMeta(html, 'og:locale') !== 'en_US') errors.push('英文 Claude 文章 og:locale 不是 en_US')
  const keywords = getMeta(html, 'keywords') || ''
  if (!/Claude vs (OpenAI|ChatGPT)/i.test(keywords) || !/Google Trends/i.test(keywords)) {
    errors.push('英文 Claude 文章缺少英文 keywords')
  }
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || ''
  if (!title.includes('Claude vs OpenAI on Google Trends')) errors.push('英文 Claude 文章 title 未对准搜索意图')
  const desc = getMeta(html, 'description') || ''
  if (!/Google Trends/i.test(desc) || !/94/.test(desc) || !/ChatGPT/i.test(desc)) {
    errors.push('英文 Claude 文章 description 不是英文检索向描述')
  }
  if (!html.includes('/images/claude-search-surge/fig01_gt_compare.png')) {
    errors.push('英文 Claude 文章未复用 Google Trends 原图')
  }
  if (!html.includes('Google Trends worldwide relative search interest')) {
    errors.push('英文 Claude 文章图片 alt 不是英文')
  }
  if (!html.includes('This is a personal note, not investment advice.')) {
    errors.push('英文 Claude 文章缺少免责声明')
  }
}
if (existsSync(zhClaude)) {
  const html = readFileSync(zhClaude, 'utf8')
  if (!/<html[^>]*\blang="zh-CN"/.test(html)) errors.push('中文 Claude 文章 html lang 不是 zh-CN')
  if (getMeta(html, 'og:locale') !== 'zh_CN') errors.push('中文 Claude 文章 og:locale 不是 zh_CN')
  if (!html.includes('Claude 搜索热度是 OpenAI 的 13 倍')) errors.push('中文 Claude 文章标题被改动')
}
const feedFile = join(DIST, 'feed.xml')
if (existsSync(feedFile)) {
  const feedXml = readFileSync(feedFile, 'utf8')
  if (feedXml.includes('/en/ai/trends/claude-search-surge') || feedXml.includes('/en/investment/')) {
    errors.push('中文 RSS 收录了英文文章')
  }
  if (!feedXml.includes('/ai/trends/claude-search-surge')) errors.push('中文 RSS 丢失了 Claude 搜索热度')
}
const articlesJson = join(DIST, 'articles.json')
if (existsSync(articlesJson)) {
  const articles = readFileSync(articlesJson, 'utf8')
  if (articles.includes('en/ai/trends/claude-search-surge') || articles.includes('en/investment/')) {
    errors.push('articles.json 收录了英文文章')
  }
}
if (existsSync(homeHtmlPath)) {
  const homeHtml = readFileSync(homeHtmlPath, 'utf8')
  const articleRows = homeHtml.match(/<a class="article-row"[^>]*>/g) || []
  if (articleRows.some((row) => /href="\/en\//.test(row))) {
    errors.push('中文首页列表出现了英文 URL')
  }
  if (!articleRows.some((row) => row.includes('href="/ai/trends/claude-search-surge"'))) {
    errors.push('中文首页丢失了 Claude 搜索热度')
  }
}

const enMuse = join(DIST, 'en', 'ai', 'coding', 'muse-auto-deploy.html')
const zhMuse = join(DIST, 'ai', 'coding', 'muse-auto-deploy.html')
if (!existsSync(enMuse)) errors.push('缺少英文 Muse 自动部署文章')
if (existsSync(sitemap)) {
  const sm = readFileSync(sitemap, 'utf8')
  if (!/<loc>[^<]*\/en\/ai\/coding\/muse-auto-deploy<\/loc>/.test(sm)) {
    errors.push('sitemap 缺少 /en/ai/coding/muse-auto-deploy')
  }
  const museEntry = sm.match(/<url><loc>[^<]*\/en\/ai\/coding\/muse-auto-deploy<\/loc><lastmod>([^<]*)<\/lastmod><\/url>/)
  if (!museEntry) errors.push('sitemap 英文 Muse 文章缺少 lastmod')
  else if (!/^\d{4}-\d{2}-\d{2}/.test(museEntry[1])) errors.push('sitemap 英文 Muse lastmod 格式异常')
}
function hreflangHref(html, lang) {
  const tag = hreflangTag(html, lang)
  const match = tag.match(/href="([^"]+)"/)
  return match ? match[1] : ''
}
const museHreflang = {}
for (const file of [zhMuse, enMuse]) {
  if (!existsSync(file)) continue
  const html = readFileSync(file, 'utf8')
  for (const lang of ['zh-CN', 'en', 'x-default']) {
    if (!hreflangTag(html, lang)) errors.push(`${file}: 缺少 hreflang=${lang}`)
  }
  const xDefault = hreflangTag(html, 'x-default')
  if (xDefault && (xDefault.includes('/en/ai/') || !xDefault.includes('/ai/coding/muse-auto-deploy'))) {
    errors.push(`${file}: x-default 未指向中文 Muse 文章`)
  }
  const zhAlt = hreflangHref(html, 'zh-CN')
  const enAlt = hreflangHref(html, 'en')
  if (!zhAlt.includes('/ai/coding/muse-auto-deploy') || zhAlt.includes('/en/ai/coding/')) {
    errors.push(`${file}: hreflang=zh-CN 未指向中文 Muse 文章`)
  }
  if (!enAlt.includes('/en/ai/coding/muse-auto-deploy')) {
    errors.push(`${file}: hreflang=en 未指向英文 Muse 文章`)
  }
  museHreflang[file] = { zhAlt, enAlt, xDefault: hreflangHref(html, 'x-default') }
  const published = getMeta(html, 'article:published_time') || ''
  if (!published.startsWith('2026-10-06')) {
    errors.push(`${file}: article:published_time 不是 2026-10-06`)
  }
  if (!html.includes('>中<') || !html.includes('>EN<')) {
    errors.push(`${file}: 语言切换标签不是 中/EN`)
  }
}
if (museHreflang[zhMuse] && museHreflang[enMuse]) {
  for (const key of ['zhAlt', 'enAlt', 'xDefault']) {
    if (museHreflang[zhMuse][key] !== museHreflang[enMuse][key]) {
      errors.push(`中英文 Muse 文章的 hreflang ${key} 不一致`)
    }
  }
}
if (existsSync(enMuse)) {
  const html = readFileSync(enMuse, 'utf8')
  if (!/<html[^>]*\blang="en"/.test(html)) errors.push('英文 Muse 文章 html lang 不是 en')
  if (getMeta(html, 'og:locale') !== 'en_US') errors.push('英文 Muse 文章 og:locale 不是 en_US')
  const keywords = getMeta(html, 'keywords') || ''
  if (!/Muse/i.test(keywords) || !/personal website/i.test(keywords) || !/AI coding agent/i.test(keywords)) {
    errors.push('英文 Muse 文章缺少英文 keywords')
  }
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || ''
  if (!title.includes('How to Automate a Personal Website Deploy with Muse')) {
    errors.push('英文 Muse 文章 title 未对准搜索意图')
  }
  const desc = getMeta(html, 'description') || ''
  if (!/AI coding agent/i.test(desc) || !/VitePress/i.test(desc) || !/GitHub Actions/i.test(desc) || !/personal website/i.test(desc)) {
    errors.push('英文 Muse 文章 description 不是英文检索向描述')
  }
  for (const image of ['/images/muse-deploy-home.png', '/images/muse-deploy-actions.png', '/images/muse-deploy-commits.png']) {
    if (!html.includes(image)) errors.push(`英文 Muse 文章未复用图片 ${image}`)
  }
  if (!html.includes('Homepage of the personal site, built with VitePress from Markdown')) {
    errors.push('英文 Muse 文章图片 alt 不是英文')
  }
  if (!html.includes('This is a personal note, not investment advice.')) {
    errors.push('英文 Muse 文章缺少免责声明')
  }
  if (!html.includes('vp-doc')) errors.push('英文 Muse 文章不是文档布局，有用按钮和访问统计可能不挂载')
  if (html.includes('<h2') && /<h2[^>]*>\s*(Preface|前言)/i.test(html)) {
    errors.push('英文 Muse 文章出现了前言小节')
  }
}
if (existsSync(zhMuse)) {
  const html = readFileSync(zhMuse, 'utf8')
  if (!/<html[^>]*\blang="zh-CN"/.test(html)) errors.push('中文 Muse 文章 html lang 不是 zh-CN')
  if (getMeta(html, 'og:locale') !== 'zh_CN') errors.push('中文 Muse 文章 og:locale 不是 zh_CN')
  if (!html.includes('我是如何用 Muse 自动化部署个人网站的')) errors.push('中文 Muse 文章标题被改动')
  const published = getMeta(html, 'article:published_time') || ''
  if (!published.startsWith('2026-10-06')) errors.push('中文 Muse 文章 article:published_time 不是 2026-10-06')
}
if (existsSync(feedFile)) {
  const feedXml = readFileSync(feedFile, 'utf8')
  if (feedXml.includes('/en/ai/coding/muse-auto-deploy')) errors.push('中文 RSS 收录了英文 Muse 文章')
  if (!feedXml.includes('/ai/coding/muse-auto-deploy')) errors.push('中文 RSS 丢失了 Muse 自动部署')
}
if (existsSync(articlesJson)) {
  const articles = readFileSync(articlesJson, 'utf8')
  if (articles.includes('en/ai/coding/muse-auto-deploy')) errors.push('articles.json 收录了英文 Muse 文章')
  if (!articles.includes('ai/coding/muse-auto-deploy.md')) errors.push('articles.json 丢失了中文 Muse 文章')
}
const archiveHtmlPath = join(DIST, 'archive.html')
if (existsSync(archiveHtmlPath)) {
  const archiveHtml = readFileSync(archiveHtmlPath, 'utf8')
  const archiveRows = archiveHtml.match(/<a class="article-row"[^>]*>/g) || []
  if (archiveRows.some((row) => /href="\/en\//.test(row))) {
    errors.push('中文归档收录了英文文章')
  }
  if (!archiveRows.some((row) => row.includes('href="/ai/coding/muse-auto-deploy"'))) {
    errors.push('中文归档丢失了 Muse 自动部署')
  }
}

// 4f. 英文 SEO：Article JSON-LD、Open Graph、三篇互链、/en/about
const EN_POSTS = {
  tesla: {
    file: enTesla,
    zhFile: zhTesla,
    headline: 'Tesla Q3 2026 Earnings Preview: What Actually Moves the Stock',
    zhHeadline: '特斯拉 Q3 财报前瞻',
    urlPath: '/en/investment/tesla/q3-earnings-preview',
    zhUrlPath: '/investment/tesla/q3-earnings-preview',
    datePrefix: '2026-10-16',
    imagePath: '/images/tesla-q3/cover.webp',
    descriptionPattern: /Tesla Q3 2026/i
  },
  claude: {
    file: enClaude,
    zhFile: zhClaude,
    headline: 'Claude vs OpenAI on Google Trends',
    zhHeadline: 'Claude 搜索热度是 OpenAI 的 13 倍',
    urlPath: '/en/ai/trends/claude-search-surge',
    zhUrlPath: '/ai/trends/claude-search-surge',
    datePrefix: '2026-10-16',
    imagePath: '/images/claude-search-surge/fig01_gt_compare.png',
    descriptionPattern: /Google Trends/i
  },
  muse: {
    file: enMuse,
    zhFile: zhMuse,
    headline: 'How to Automate a Personal Website Deploy with Muse',
    zhHeadline: '我是如何用 Muse 自动化部署个人网站的',
    urlPath: '/en/ai/coding/muse-auto-deploy',
    zhUrlPath: '/ai/coding/muse-auto-deploy',
    datePrefix: '2026-10-06',
    imagePath: '/images/muse-deploy-actions.png',
    descriptionPattern: /AI coding agent/i
  }
}

function assertOg(file, html, { locale, alternate, titleIncludes, urlPath, urlExcludes, imagePath, descriptionPattern }) {
  if (getMeta(html, 'og:locale') !== locale) errors.push(`${file}: og:locale 不是 ${locale}`)
  if (alternate && !getMetaAll(html, 'og:locale:alternate').includes(alternate)) {
    errors.push(`${file}: 缺少 og:locale:alternate=${alternate}`)
  }
  const ogTitle = getMeta(html, 'og:title') || ''
  if (titleIncludes && !ogTitle.includes(titleIncludes)) errors.push(`${file}: og:title 不匹配`)
  const ogUrl = getMeta(html, 'og:url') || ''
  if (urlPath && !ogUrl.includes(urlPath)) errors.push(`${file}: og:url 不正确`)
  if (urlExcludes && ogUrl.includes(urlExcludes)) errors.push(`${file}: og:url 不应包含 ${urlExcludes}`)
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || ''
  if (canonical && ogUrl && ogUrl !== canonical) errors.push(`${file}: og:url 与 canonical 不一致`)
  const ogDesc = getMeta(html, 'og:description') || ''
  if (descriptionPattern && !descriptionPattern.test(ogDesc)) errors.push(`${file}: og:description 不匹配`)
  if (getMeta(html, 'twitter:card') !== 'summary_large_image') errors.push(`${file}: twitter:card 不是 summary_large_image`)
  if (imagePath && !(getMeta(html, 'og:image') || '').includes(imagePath)) {
    errors.push(`${file}: og:image 未使用 ${imagePath}`)
  }
}

function assertArticleLd(file, html, { inLanguage, headline, urlPath, urlExcludes, datePrefix, imagePath, descriptionPattern, authorUrlIncludes, authorUrlExcludes }) {
  const article = readJsonLd(html, file).find((node) => node['@type'] === 'Article' || node['@type'] === 'BlogPosting')
  if (!article) {
    errors.push(`${file}: 缺少 Article JSON-LD`)
    return
  }
  if (article.inLanguage !== inLanguage) errors.push(`${file}: JSON-LD inLanguage 不是 ${inLanguage}`)
  if (!String(article.headline || '').includes(headline)) errors.push(`${file}: JSON-LD headline 不匹配`)
  if (descriptionPattern && !descriptionPattern.test(String(article.description || ''))) {
    errors.push(`${file}: JSON-LD description 不匹配`)
  }
  if (!String(article.url || '').includes(urlPath)) errors.push(`${file}: JSON-LD url 不正确`)
  if (urlExcludes && String(article.url || '').includes(urlExcludes)) errors.push(`${file}: JSON-LD url 不应包含 ${urlExcludes}`)
  if (!String(article.datePublished || '').startsWith(datePrefix)) errors.push(`${file}: JSON-LD datePublished 不正确`)
  if (imagePath && !String(article.image || '').includes(imagePath)) errors.push(`${file}: JSON-LD image 未使用文章封面`)
  assertKnownAuthor(file, article.author)
  const authorUrl = String(article.author?.url || '')
  if (authorUrlIncludes && !authorUrl.includes(authorUrlIncludes)) errors.push(`${file}: author url 未包含 ${authorUrlIncludes}`)
  if (authorUrlExcludes && authorUrl.includes(authorUrlExcludes)) errors.push(`${file}: author url 不应包含 ${authorUrlExcludes}`)
}

for (const [key, post] of Object.entries(EN_POSTS)) {
  if (!existsSync(post.file)) continue
  const html = readFileSync(post.file, 'utf8')
  assertArticleLd(post.file, html, {
    inLanguage: 'en',
    headline: post.headline,
    urlPath: post.urlPath,
    datePrefix: post.datePrefix,
    imagePath: post.imagePath,
    descriptionPattern: post.descriptionPattern,
    authorUrlIncludes: '/en/about',
    authorUrlExcludes: null
  })
  assertOg(post.file, html, {
    locale: 'en_US',
    alternate: 'zh_CN',
    titleIncludes: post.headline,
    urlPath: post.urlPath,
    imagePath: post.imagePath,
    descriptionPattern: post.descriptionPattern
  })
  if (!html.includes('More notes')) errors.push(`${post.file}: 缺少 More notes 内链`)
  for (const [otherKey, other] of Object.entries(EN_POSTS)) {
    if (otherKey === key) continue
    if (!html.includes(other.urlPath)) errors.push(`${post.file}: 缺少相关文章 ${other.urlPath}`)
  }
  if (!/href="\/en\/"/.test(html)) errors.push(`${post.file}: 缺少回到 /en/ 的链接`)
  if (existsSync(post.zhFile)) {
    const zhHtml = readFileSync(post.zhFile, 'utf8')
    assertArticleLd(post.zhFile, zhHtml, {
      inLanguage: 'zh-CN',
      headline: post.zhHeadline,
      urlPath: post.zhUrlPath,
      urlExcludes: '/en/',
      datePrefix: post.datePrefix,
      imagePath: post.imagePath,
      descriptionPattern: null,
      authorUrlIncludes: '/about',
      authorUrlExcludes: '/en/about'
    })
    assertOg(post.zhFile, zhHtml, {
      locale: 'zh_CN',
      alternate: 'en_US',
      titleIncludes: post.zhHeadline,
      urlPath: post.zhUrlPath,
      urlExcludes: '/en/',
      imagePath: post.imagePath,
      descriptionPattern: null
    })
    if (zhHtml.includes('More notes')) errors.push(`${post.zhFile}: 中文正文被写入了英文内链标题`)
    if (!zhHtml.includes(post.zhHeadline)) errors.push(`${post.zhFile}: 中文标题被改动`)
  }
}

const enAbout = join(DIST, 'en', 'about', 'index.html')
const zhAbout = join(DIST, 'about', 'index.html')
if (!existsSync(enAbout)) errors.push('缺少英文关于页 /en/about')
if (existsSync(sitemap)) {
  const sm = readFileSync(sitemap, 'utf8')
  if (!/<loc>[^<]*\/en\/about<\/loc>/.test(sm)) errors.push('sitemap 缺少 /en/about')
  if (!/<loc>[^<]*\/about<\/loc>/.test(sm)) errors.push('sitemap 缺少 /about')
}
if (existsSync(enAbout)) {
  const html = readFileSync(enAbout, 'utf8')
  if (!/<html[^>]*\blang="en"/.test(html)) errors.push('英文关于页 html lang 不是 en')
  if (!html.includes("Pro's MangoFund")) errors.push('英文关于页未出现 Pro\'s MangoFund')
  if (!html.includes('/about/') && !html.includes('href="/about"')) errors.push('英文关于页缺少中文关于链接')
  for (const post of Object.values(EN_POSTS)) {
    if (!html.includes(post.urlPath)) errors.push(`英文关于页缺少 ${post.urlPath}`)
  }
  if (!/href="\/en\/"/.test(html)) errors.push('英文关于页缺少回到 /en/ 的链接')
  if (!html.includes('>中<') || !html.includes('>EN<')) errors.push('英文关于页语言切换标签不是 中/EN')
  for (const lang of ['zh-CN', 'en', 'x-default']) {
    if (!hreflangTag(html, lang)) errors.push(`英文关于页缺少 hreflang=${lang}`)
  }
  const xDefault = hreflangHref(html, 'x-default')
  if (!xDefault.includes('/about') || xDefault.includes('/en/about')) {
    errors.push('英文关于页 x-default 未指向中文关于页')
  }
  const aboutLd = readJsonLd(html, enAbout).find((node) => node['@type'] === 'AboutPage')
  if (!aboutLd) errors.push('英文关于页缺少 AboutPage JSON-LD')
  else {
    if (aboutLd.inLanguage !== 'en') errors.push('英文关于页 JSON-LD inLanguage 不是 en')
    if (!String(aboutLd.name || '').includes("Pro's MangoFund")) errors.push('英文关于页 JSON-LD name 不是英文')
    if (!String(aboutLd.url || '').includes('/en/about')) errors.push('英文关于页 JSON-LD url 不正确')
    if (!String(aboutLd.description || '').includes("Pro's MangoFund")) errors.push('英文关于页 JSON-LD description 不是英文')
    assertKnownAuthor(enAbout, aboutLd.mainEntity)
  }
  assertOg(enAbout, html, {
    locale: 'en_US',
    alternate: 'zh_CN',
    titleIncludes: "Pro's MangoFund",
    urlPath: '/en/about',
    imagePath: '/images/social-card.png',
    descriptionPattern: /Pro's MangoFund/
  })
  if (getMeta(html, 'og:type') !== 'website') errors.push('英文关于页 og:type 不是 website')
}
if (existsSync(zhAbout)) {
  const html = readFileSync(zhAbout, 'utf8')
  if (!/<html[^>]*\blang="zh-CN"/.test(html)) errors.push('中文关于页 html lang 不是 zh-CN')
  if (!html.includes('我持续研究 AI、投资、产品与技术')) errors.push('中文关于页正文被改动')
  for (const lang of ['zh-CN', 'en', 'x-default']) {
    if (!hreflangTag(html, lang)) errors.push(`中文关于页缺少 hreflang=${lang}`)
  }
  const enAlt = hreflangHref(html, 'en')
  if (!enAlt.includes('/en/about')) errors.push('中文关于页 hreflang=en 未指向 /en/about')
  const aboutLd = readJsonLd(html, zhAbout).find((node) => node['@type'] === 'AboutPage')
  if (!aboutLd) errors.push('中文关于页缺少 AboutPage JSON-LD')
  else {
    if (aboutLd.inLanguage !== 'zh-CN') errors.push('中文关于页 JSON-LD inLanguage 不是 zh-CN')
    if (!String(aboutLd.name || '').includes('关于')) errors.push('中文关于页 JSON-LD name 不是中文')
    if (String(aboutLd.url || '').includes('/en/about')) errors.push('中文关于页 JSON-LD url 指向了英文')
    assertKnownAuthor(zhAbout, aboutLd.mainEntity)
    if (String(aboutLd.mainEntity?.url || '').includes('/en/about')) {
      errors.push('中文关于页 author url 指向了英文关于页')
    }
  }
  assertOg(zhAbout, html, {
    locale: 'zh_CN',
    alternate: 'en_US',
    titleIncludes: '关于',
    urlPath: '/about',
    urlExcludes: '/en/',
    imagePath: '/images/social-card.png',
    descriptionPattern: null
  })
}
if (existsSync(enHome)) {
  const html = readFileSync(enHome, 'utf8')
  if (!html.includes('English home of a personal site')) errors.push('英文首页缺少可索引的简介')
  if (!html.includes('/en/about')) errors.push('英文首页缺少关于页链接')
  const website = readJsonLd(html, enHome).find((node) => node['@type'] === 'WebSite')
  if (!website) errors.push('英文首页缺少 WebSite JSON-LD')
  else {
    if (website.inLanguage !== 'en') errors.push('英文首页 JSON-LD inLanguage 不是 en')
    if (website.name !== "Pro's MangoFund") errors.push('英文首页 JSON-LD name 不是 Pro\'s MangoFund')
    if (!String(website.url || '').includes('/en')) errors.push('英文首页 JSON-LD url 不正确')
    assertKnownAuthor(enHome, website.author)
  }
  assertOg(enHome, html, {
    locale: 'en_US',
    alternate: 'zh_CN',
    titleIncludes: "Pro's MangoFund",
    urlPath: '/en',
    imagePath: '/images/social-card.png',
    descriptionPattern: /Pro's MangoFund/
  })
  if (!html.includes('>中<') || !html.includes('>EN<')) errors.push('英文首页语言切换标签不是 中/EN')
}
if (existsSync(homeHtmlPath)) {
  const html = readFileSync(homeHtmlPath, 'utf8')
  const website = readJsonLd(html, homeHtmlPath).find((node) => node['@type'] === 'WebSite')
  if (!website) errors.push('中文首页缺少 WebSite JSON-LD')
  else if (website.inLanguage !== 'zh-CN' || website.name !== 'PRO的茶里芒果') {
    errors.push('中文首页 WebSite JSON-LD 语言或站名不正确')
  }
  if (getMeta(html, 'og:locale') !== 'zh_CN') errors.push('中文首页 og:locale 不是 zh_CN')
  if (!getMetaAll(html, 'og:locale:alternate').includes('en_US')) errors.push('中文首页缺少 og:locale:alternate=en_US')
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
