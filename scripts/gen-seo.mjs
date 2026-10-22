// 构建时生成 SEO 文件:扫描 docs/**/*.md,输出
//   - docs/public/feed.xml    (RSS,只收录带 title+date 的文章页)
//   - docs/public/sitemap.xml  (全部真实页面,含 /en/;lastmod 用 git 提交时间,不用构建时的 mtime)
//   - docs/.vitepress/i18n-pairs.json (中英都有的路径,给导航语言切换)
// 英文文章不写入中文 RSS、首页 Latest、归档和 articles.json,避免中文站列表被英文稿挤掉。
//   - docs/public/_headers     (Cloudflare Pages 缓存:哈希资源 immutable,图片长缓存,HTML 重新验证)
//   - docs/public/robots.txt   (sitemap 地址跟随部署目标)
//   - docs/public/llms.txt      (给 AI 看的站点说明书:栏目+文章摘要+链接,随构建自动更新)
//   - docs/public/articles.json (给「我的收藏」页:文章 key/title/date/updated,updated 取 git 最后提交时间)
//   - 重写 docs/index.md 的 LATEST 板块(站内链接带 base 前缀)
// 部署目标由环境变量决定:BASE_PATH(默认 '/';GitHub Pages 构建时传 '/personal-site/'),
// SITE_URL(默认 https://mangofund.github.io;Cloudflare Pages 构建时传 https://xxx.pages.dev),
// CANONICAL_URL(默认=SITE_URL 去 base;GitHub Pages 镜像构建时传新域名,使 canonical/sitemap 指向新站)。
// 在 package.json 的 docs:build 中于 vitepress build 之前运行。
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const DOCS_DIR = fileURLToPath(new URL('../docs/', import.meta.url))
const PUBLIC_DIR = join(DOCS_DIR, 'public')
const REPO_DIR = fileURLToPath(new URL('../', import.meta.url))
const CONTENT_DATES_PATH = fileURLToPath(new URL('./content-dates.json', import.meta.url))
// 图片文件名不带内容哈希,缓存 30 天;替换同名文件后最多一个月生效。
const IMAGE_CACHE_SECONDS = 60 * 60 * 24 * 30
// Vite 内容哈希资源可以缓存一年且 immutable。
const HASHED_ASSET_CACHE_SECONDS = 60 * 60 * 24 * 365
const _rawDomain = (process.env.SITE_URL ?? 'https://mangofund.github.io').replace(/\/$/, '')
// 容错:没写 https:// 时自动补上,避免 canonical 写出裸域名
const SITE_DOMAIN = /^https?:\/\//i.test(_rawDomain) ? _rawDomain : `https://${_rawDomain}`
const BASE_PATH = process.env.BASE_PATH ?? '/'
const baseNoSlash = BASE_PATH.endsWith('/') && BASE_PATH.length > 1 ? BASE_PATH.slice(0, -1) : BASE_PATH === '/' ? '' : BASE_PATH
const SITE_URL = SITE_DOMAIN + baseNoSlash
// 规范域名:缺省=部署域名(去 base);GitHub Pages 镜像构建时通过 CANONICAL_URL 传入新域名,
// 使 sitemap/feed/robots.txt 指向新站(搜索引擎只收新站)
const _rawCanon = (process.env.CANONICAL_URL ?? SITE_DOMAIN).replace(/\/$/, '')
const CANONICAL_URL = /^https?:\/\//i.test(_rawCanon) ? _rawCanon : `https://${_rawCanon}`
const SITE_TITLE = 'PRO的茶里芒果'
const SITE_DESC = 'AI、投资、产品，以及一些关于世界如何运行的思考。'

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) {
      if (name === 'public' || name === 'node_modules') continue
      out.push(...walk(p))
    } else if (name.endsWith('.md')) {
      out.push(p)
    }
  }
  return out
}

// 极简 frontmatter 解析:只取 title / description / date / draft
function parseFrontmatter(file) {
  const raw = readFileSync(file, 'utf8')
  if (!raw.startsWith('---')) return null
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return null
  const fm = {}
  for (const line of raw.slice(3, end).split('\n')) {
    const m = line.match(/^([A-Za-z_]+):\s*(.*)$/)
    if (m) fm[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return fm
}

function toUrlPath(file) {
  let rel = relative(DOCS_DIR, file).split(sep).join('/')
  rel = rel.replace(/\.md$/, '')
  if (rel === 'index') return '/'
  // 目录首页真实 URL 带尾斜杠，与 config.ts pagePath() 保持一致（防 canonical 死循环）
  if (rel.endsWith('/index')) return '/' + rel.slice(0, -'/index'.length) + '/'
  return '/' + rel
}

function isEnglishDoc(file) {
  const rel = relative(DOCS_DIR, file).split(sep).join('/')
  return rel === 'en.md' || rel.startsWith('en/')
}

// 中英都存在的 slug（首页用空字符串）。给导航语言切换用。
function localeSlug(relNoExt) {
  const english = relNoExt === 'en' || relNoExt.startsWith('en/')
  let slug = english ? (relNoExt === 'en' ? 'index' : relNoExt.slice('en/'.length)) : relNoExt
  if (slug === 'index') slug = ''
  else if (slug.endsWith('/index')) slug = slug.slice(0, -'/index'.length)
  return { english, slug }
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const files = walk(DOCS_DIR).sort()

// 浅克隆(Cloudflare Pages 默认 depth=1)里,没在最新一次提交里改过的文件没有提交时间。
// 能连上远端时加深历史;失败也不中断构建,改走 frontmatter / scripts/content-dates.json。
function ensureGitHistory() {
  let shallow = false
  try {
    shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: REPO_DIR,
      encoding: 'utf8'
    }).trim() === 'true'
  } catch {
    return
  }
  if (!shallow) return
  try {
    execFileSync('git', ['fetch', '--deepen=400'], {
      cwd: REPO_DIR,
      stdio: 'ignore',
      timeout: 25000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
    })
  } catch {
    console.warn('[gen-seo] 浅克隆且无法加深历史,lastmod 回退到 frontmatter / content-dates.json')
  }
}

// 每个文件只保留最新一次提交的 committer 时间(%cI)。不用工作区 mtime:checkout/构建会把它刷成现在。
function loadGitDates() {
  const map = new Map()
  try {
    const out = execFileSync('git', ['log', '--format=%cI', '--name-only'], {
      cwd: REPO_DIR,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024
    })
    let pending = null
    for (const line of out.split('\n')) {
      const text = line.trim()
      if (!text) continue
      if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
        pending = text
        continue
      }
      if (pending && !map.has(text)) map.set(text, pending)
    }
  } catch {
    console.warn('[gen-seo] 读取 git 提交时间失败,lastmod 回退到 frontmatter / content-dates.json')
  }
  return map
}

function loadSnapshot() {
  try {
    const obj = JSON.parse(readFileSync(CONTENT_DATES_PATH, 'utf8'))
    return new Map(Object.entries(obj))
  } catch {
    return new Map()
  }
}

function repoRel(file) {
  return relative(REPO_DIR, file).split(sep).join('/')
}

// frontmatter 的 date/updated 是内容时间。纯日期原样输出,避免被解析成 UTC 午夜后跨天。
function frontmatterInstant(fm, key) {
  if (!fm || !fm[key]) return null
  const raw = String(fm[key]).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function contentLastmod(file, fm, gitDates, snapshot) {
  const rel = repoRel(file)
  return gitDates.get(rel) || frontmatterInstant(fm, 'updated') || frontmatterInstant(fm, 'date') || snapshot.get(rel) || null
}

ensureGitHistory()
const gitDates = loadGitDates()
const snapshotDates = loadSnapshot()
const nextSnapshot = {}
for (const file of files) {
  const rel = repoRel(file)
  const instant = gitDates.get(rel) || snapshotDates.get(rel)
  if (instant) nextSnapshot[rel] = instant
}
const snapshotOut = JSON.stringify(
  Object.fromEntries(Object.keys(nextSnapshot).sort().map((key) => [key, nextSnapshot[key]])),
  null,
  2
) + '\n'
try {
  if (readFileSync(CONTENT_DATES_PATH, 'utf8') !== snapshotOut) writeFileSync(CONTENT_DATES_PATH, snapshotOut)
} catch {
  writeFileSync(CONTENT_DATES_PATH, snapshotOut)
}

// ---- sitemap.xml:全部会构建出来的真实页面,noindex 页除外 ----
// 2026-10-23 用户拍板:noindex 页移出 sitemap(Google 指引:noindex URL 不应进 sitemap)。
// 页面本身照常构建、可访问,只是不主动提交给搜索引擎;RSS 继续只收正式文章。
const sitemapUrls = files
  .filter((f) => parseFrontmatter(f)?.noindex !== 'true')
  .map((f) => {
    const fm = parseFrontmatter(f)
    const loc = CANONICAL_URL + toUrlPath(f)
    const lastmod = contentLastmod(f, fm, gitDates, snapshotDates)
    const lastmodTag = lastmod ? `<lastmod>${esc(lastmod)}</lastmod>` : ''
    return `  <url><loc>${esc(loc)}</loc>${lastmodTag}</url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`

// ---- feed.xml:只收录文章页(带 title+date,非草稿) ----
const items = []
for (const file of files) {
  if (isEnglishDoc(file)) continue  // 英文页不进中文 RSS / 首页 Latest / 归档
  const fm = parseFrontmatter(file)
  if (!fm || !fm.title || !fm.date) continue
  if (fm.draft === 'true') continue
  if (fm.noindex === 'true') continue  // noindex 页面不进 RSS
  const d = new Date(fm.date)
  if (Number.isNaN(d.getTime())) continue
  items.push({
    title: fm.title,
    description: fm.description || '',
    category: fm.category || '',
    image: fm.image || (readFileSync(file, 'utf8').match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] || ''),
    date: d,
    dateStr: fm.date.replace(/-/g, '.'),
    link: CANONICAL_URL + toUrlPath(file),
    urlPath: baseNoSlash + toUrlPath(file)
  })
}
items.sort((a, b) => b.date - a.date)

const feedItems = items
  .map(
    (it) => `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.link)}</link>
      <guid>${esc(it.link)}</guid>
      <pubDate>${it.date.toUTCString()}</pubDate>
      <description>${esc(it.description)}</description>
    </item>`
  )
  .join('\n')

const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <link>${CANONICAL_URL}/</link>
    <description>${esc(SITE_DESC)}</description>
    <language>zh-CN</language>
${feedItems}
  </channel>
</rss>
`

mkdirSync(PUBLIC_DIR, { recursive: true })
writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap)
writeFileSync(join(PUBLIC_DIR, 'feed.xml'), feed)

// ---- _headers:Cloudflare Pages 按请求路径匹配。----
// 同一个请求命中两条 Cache-Control 时,值会被逗号拼在一起,所以不要再写一条 /* 兜底。
const htmlCache = 'public, max-age=0, must-revalidate'
const headerBlocks = [
  '# 由 scripts/gen-seo.mjs 生成,勿手工改。',
  '# 哈希静态资源长期 immutable;图片长缓存;HTML / feed / sitemap 每次重新验证。',
  ''
]
function pushCache(pattern, value) {
  headerBlocks.push(`${pattern}\n  Cache-Control: ${value}\n`)
}
const seenHeaderPaths = new Set()
for (const file of files) {
  const path = toUrlPath(file)
  // toUrlPath 对目录首页已带尾斜杠，先归一化再生成「无斜杠/带斜杠」两版，避免出现 /about//
  const base = path === '/' ? '/' : path.replace(/\/$/, '')
  const variants = path === '/' ? ['/'] : [base, `${base}/`]
  for (const variant of variants) {
    if (seenHeaderPaths.has(variant)) continue
    seenHeaderPaths.add(variant)
    pushCache(variant, htmlCache)
  }
}
for (const asset of ['/feed.xml', '/sitemap.xml', '/robots.txt', '/llms.txt', '/articles.json', '/404.html']) {
  pushCache(asset, htmlCache)
}
pushCache('/assets/*', `public, max-age=${HASHED_ASSET_CACHE_SECONDS}, immutable`)
pushCache('/images/*', `public, max-age=${IMAGE_CACHE_SECONDS}`)
pushCache('/skills/sources/*', htmlCache)
pushCache('/skills/zips/*', htmlCache)
for (const icon of ['/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png']) {
  pushCache(icon, `public, max-age=${IMAGE_CACHE_SECONDS}`)
}
writeFileSync(join(PUBLIC_DIR, '_headers'), headerBlocks.join('\n'))
writeFileSync(join(PUBLIC_DIR, 'robots.txt'),
`# PRO的茶里芒果 - 爬虫访问策略
# AI 搜索与训练爬虫的官方文档：
# - OpenAI: https://platform.openai.com/docs/bots
# - Anthropic: https://support.claude.com/en/articles/8896518
# - Perplexity: https://docs.perplexity.ai/guides/bots

User-agent: *
Allow: /

# --- AI 搜索爬虫：明确允许 ---
# 用于 ChatGPT / Claude / Perplexity 的搜索结果展示，不用于模型训练
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# --- AI 用户触发抓取：明确允许 ---
# 用户在 ChatGPT / Claude 中主动要求访问页面时触发
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

# --- AI 训练爬虫：当前允许（与 User-agent: * 一致）---
# GPTBot 抓取的内容可能用于 OpenAI 模型训练
# ClaudeBot 抓取的内容可能用于 Anthropic 模型训练
# 如需排除，请将下方 Allow 改为 Disallow: /
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${CANONICAL_URL}/sitemap.xml
`)

// ---- llms.txt:给 AI 爬虫/问答引擎看的站点说明书(标题+一句话摘要+链接,随构建自动更新) ----
const llmsByCat = new Map()
for (const it of items) {
  const cat = it.category || '未分类'
  if (!llmsByCat.has(cat)) llmsByCat.set(cat, [])
  llmsByCat.get(cat).push(it)
}
const llmsSections = [...llmsByCat.entries()]
  .map(([cat, list]) => `## ${cat}\n\n${list.map((it) => `- [${it.title}](${it.link})：${it.description}（${it.dateStr}）`).join('\n')}`)
  .join('\n\n')
const enLlmsItems = []
for (const file of files) {
  if (!isEnglishDoc(file)) continue
  const fm = parseFrontmatter(file)
  if (!fm || !fm.title || !fm.date) continue
  if (fm.draft === 'true' || fm.noindex === 'true') continue
  const d = new Date(fm.date)
  if (Number.isNaN(d.getTime())) continue
  enLlmsItems.push({
    title: fm.title,
    description: fm.description || '',
    dateStr: fm.date.replace(/-/g, '.'),
    link: CANONICAL_URL + toUrlPath(file)
  })
}
enLlmsItems.sort((a, b) => b.dateStr.localeCompare(a.dateStr))
const enPageItems = []
for (const file of files) {
  if (!isEnglishDoc(file)) continue
  const fm = parseFrontmatter(file)
  if (!fm || !fm.title || !fm.description || fm.date) continue
  if (fm.draft === 'true' || fm.noindex === 'true') continue
  enPageItems.push({
    title: fm.title,
    description: fm.description,
    link: CANONICAL_URL + toUrlPath(file)
  })
}
enPageItems.sort((a, b) => a.title.localeCompare(b.title))
const enLlmsLines = [
  ...enLlmsItems.map((it) => `- [${it.title}](${it.link}): ${it.description} (${it.dateStr})`),
  ...enPageItems.map((it) => `- [${it.title}](${it.link}): ${it.description}`)
]
const enLlmsSection = enLlmsLines.length
  ? `\n## English\n\n${enLlmsLines.join('\n')}\n`
  : ''
const llms = `# ${SITE_TITLE}

> ${SITE_DESC}

中文个人知识库网站，主域名 ${CANONICAL_URL}/。内容围绕 AI、投资、产品思考展开，均为原创文章。

## 栏目

- [AI](${CANONICAL_URL}/ai)：AI 趋势、Agent、AI 编程
- [投资](${CANONICAL_URL}/investment)：美股与长期主义
- [思考](${CANONICAL_URL}/thinking)：财富、技术与社会
- [关于](${CANONICAL_URL}/about)

${llmsSections}
${enLlmsSection}
## 订阅

- RSS: ${CANONICAL_URL}/feed.xml
- Sitemap: ${CANONICAL_URL}/sitemap.xml
`
writeFileSync(join(PUBLIC_DIR, 'llms.txt'), llms)

// ---- 首页 Latest:横幅轮播 3 篇 + 图文小卡 4 篇 + 文字列表 6 篇,自动写入 docs/index.md ----
// 首屏尽量多露出文章:轮播占整行(横幅图 + 下方随轮播同步切换的标题摘要),下面 2×2 小卡,再下面是紧凑列表。
const LATEST_CAROUSEL = 3
const LATEST_CARDS = 4
const LATEST_ROWS = 6
const TOPIC_LINKS = { AI: '/ai/', 投资: '/investment/', 思考: '/thinking/' }
const imgPath = (it) => (it.image ? (it.image.startsWith('/') ? it.image : '/' + it.image) : '')
const isoDay = (it) => it.dateStr.replace(/\./g, '-')
const metaHtml = (it) => '<span class="article-card-meta">' + (it.category ? '<span class="article-card-cat">' + esc(it.category) + '</span>' : '') +
  '<time datetime="' + isoDay(it) + '">' + it.dateStr + '</time></span>'
const latestCard = (it) => {
  const image = imgPath(it)
  const thumb = image
    ? '<img class="article-card-thumb" src="' + esc(image) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async" />'
    : '<div class="article-card-thumb article-card-placeholder"></div>'
  return '      <a class="article-card" href="' + it.urlPath + '">' +
    '\n        ' + thumb +
    '\n        <div class="article-card-body">' + metaHtml(it) + '<strong>' + esc(it.title) + '</strong></div>' +
    '\n      </a>'
}
const carouselSlide = (it, i) => {
  const image = imgPath(it)
  // 第一张在首屏(LCP 候选),立即高优先级加载;其余懒加载
  const loadAttrs = i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'
  const media = image
    ? '<img class="hc-img" src="' + esc(image) + '" alt="' + esc(it.title) + '" ' + loadAttrs + ' decoding="async" />'
    : '<div class="hc-img article-card-placeholder"></div>'
  return '        <a class="hc-slide' + (i === 0 ? ' is-active' : '') + '" href="' + it.urlPath + '">' + media + '</a>'
}
const carouselPanel = (it, i) => {
  const desc = it.description ? '<small>' + esc(it.description) + '</small>' : ''
  return '        <a class="hc-panel' + (i === 0 ? ' is-active' : '') + '" href="' + it.urlPath + '">' +
    '\n          ' + metaHtml(it) +
    '\n          <strong>' + esc(it.title) + '</strong>' + desc +
    '\n        </a>'
}
// 置顶必读:check-seo 要求这些文章常驻首页图文卡区(小卡,轮播区不算);
// 不在卡区时与卡区最后一张交换位置;完全不在最新列表时顶替卡区最后一张
const PINNED_LATEST = ['/ai/trends/claude-search-surge']
const latestItems = items.slice(0, LATEST_CAROUSEL + LATEST_CARDS + LATEST_ROWS)
const CARD_ZONE_END = LATEST_CAROUSEL + LATEST_CARDS - 1
for (const path of PINNED_LATEST) {
  const idx = latestItems.findIndex((it) => it.urlPath === path)
  if (idx === CARD_ZONE_END) continue
  if (idx >= 0) {
    const tmp = latestItems[CARD_ZONE_END]
    latestItems[CARD_ZONE_END] = latestItems[idx]
    latestItems[idx] = tmp
  } else {
    const pinned = items.find((it) => it.urlPath === path)
    if (pinned) latestItems[CARD_ZONE_END] = pinned
  }
}
const carouselItems = latestItems.slice(0, LATEST_CAROUSEL)
const carouselSlides = carouselItems.map(carouselSlide).join('\n')
const carouselPanels = carouselItems.map(carouselPanel).join('\n')
const carouselDots = carouselItems.map((_, i) => '<button class="hc-dot' + (i === 0 ? ' is-active' : '') + '" type="button" aria-label="第 ' + (i + 1) + ' 篇"></button>').join('')
const carouselHtml = `    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
${carouselSlides}
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots">${carouselDots}</div>
      </div>
      <div class="hc-panels">
${carouselPanels}
      </div>
    </div>`
const latestCards = latestItems.slice(LATEST_CAROUSEL, LATEST_CAROUSEL + LATEST_CARDS).map(latestCard).join('\n')
// 第二部分和 AI 栏目页同一种列表:标题 · 日期 / 缩略图 + 摘要 / 分隔线,做成紧凑版
const latestRows = latestItems.slice(LATEST_CAROUSEL + LATEST_CARDS, LATEST_CAROUSEL + LATEST_CARDS + LATEST_ROWS).map((it) => {
  const image = imgPath(it)
  const thumb = image
    ? '<img class="latest-row-thumb" src="' + esc(image) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async" />'
    : '<span class="latest-row-thumb article-card-placeholder"></span>'
  return '      <li><a href="' + it.urlPath + '"><span class="latest-row-head"><span class="latest-row-title">' + esc(it.title) + '</span>' +
    '<span class="latest-row-date">· <time datetime="' + isoDay(it) + '">' + it.dateStr + '</time></span></span>' +
    '<span class="latest-row-body">' + thumb + '<span class="latest-row-desc">' + esc(it.description) + '</span></span></a></li>'
}).join('\n')
const topicCounts = new Map()
for (const it of items) if (it.category) topicCounts.set(it.category, (topicCounts.get(it.category) ?? 0) + 1)
const topicChips = [...topicCounts.entries()]
  .filter(([cat]) => TOPIC_LINKS[cat])
  .sort((a, b) => b[1] - a[1])
  .map(([cat, n]) => '<a class="home-topic" href="' + baseNoSlash + TOPIC_LINKS[cat] + '">' + esc(cat) + '<span>' + n + '</span></a>')
  .join('')
const latestHtml = `<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
    <div class="home-head">
      <h1>最新文章</h1>
      <nav class="home-topics" aria-label="文章栏目">${topicChips}<a class="home-topic is-all" href="${baseNoSlash}/archive">全部 ${items.length} 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
${carouselHtml}
${latestCards}
    </div>
    <ul class="latest-rows">
${latestRows}
    </ul>
    <!-- LATEST-END -->`
const indexPath = join(DOCS_DIR, 'index.md')
const indexSrc = readFileSync(indexPath, 'utf8')
const updated = indexSrc.replace(
  /<!-- LATEST-START[\s\S]*?<!-- LATEST-END -->/,
  latestHtml
)
if (updated !== indexSrc) writeFileSync(indexPath, updated)

// 首页 JSON-LD 用的最新文章清单(config.ts 的 transformHead 读取,生成 Blog.blogPost)
writeFileSync(join(DOCS_DIR, '.vitepress', 'latest-posts.json'), JSON.stringify(items.slice(0, 12).map((it) => ({
  title: it.title,
  description: it.description,
  category: it.category,
  url: it.link,
  date: it.date.toISOString(),
  image: imgPath(it) ? CANONICAL_URL + imgPath(it) : ''
}))))

// ---- 归档页:Discover 风格信息流,全部文章倒序,自动写入 docs/archive.md ----
// 每 4 篇一组:第 1 篇是横跨整行的头条大卡,后 3 篇是三列小卡。
// 分类筛选用 archive.md 里的 filter ref:v-show 控制显隐;头条位置按「全部」和「本分类」各算一份,
// 标成 hero-all / hero-cat,CSS 按当前筛选取对应那份,筛选后版式仍是一大三小。
const ARCHIVE_ALL = 'all'
// list 已按时间倒序;groupOf(it) 给出筛选分组名,tabs 的顺序为 [分组, 显示名];不传则按篇数排序、显示名即分组名。
// style 'list':单列列表(标题 · 日期 / 缩略图 + 摘要 / 分隔线),否则是一大三小的卡片流
function renderFeed(list, groupOf, tabs, style = 'cards') {
  const groupIndex = new Map()
  const cards = list.map((it, i) => {
    const group = groupOf(it)
    const gi = groupIndex.get(group) ?? 0
    groupIndex.set(group, gi + 1)
    const image = it.image ? (it.image.startsWith('/') ? it.image : '/' + it.image) : ''
    // 首张头条在首屏,立即高优先级加载;其余懒加载
    const loadAttrs = i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'
    const label = tabs?.find(([g]) => g === group)?.[1] ?? group
    const media = image
      ? `<img class="archive-card-img" src="${esc(image)}" alt="${esc(it.title)}" ${loadAttrs} decoding="async" />`
      : `<div class="archive-card-img archive-card-placeholder" aria-hidden="true"><span>${esc(label)}</span></div>`
    const cls = ['archive-card', i % 4 === 0 ? 'hero-all' : '', gi % 4 === 0 ? 'hero-cat' : ''].filter(Boolean).join(' ')
    const groupLiteral = JSON.stringify(group).replace(/"/g, "'")
    const show = `v-show="filter === '${ARCHIVE_ALL}' || filter === ${groupLiteral}"`
    const time = `<time datetime="${it.dateStr.replace(/\./g, '-')}">${it.dateStr}</time>`
    if (style === 'list') {
      return `<a class="feed-row" href="${it.urlPath}" data-cat="${esc(group)}" ${show}>` +
        `<div class="feed-row-head"><strong>${esc(it.title)}</strong><span class="feed-row-date"> · ${time}</span></div>` +
        `<div class="feed-row-body"><div class="feed-row-thumb">${media}</div><p>${esc(it.description)}</p></div></a>`
    }
    return `<a class="${cls}" href="${it.urlPath}" data-cat="${esc(group)}" ${show}>` +
      `<div class="archive-card-media">${media}</div>` +
      `<div class="archive-card-body"><strong>${esc(it.title)}</strong><p>${esc(it.description)}</p>` +
      `<div class="archive-card-meta"><span class="archive-chip">${esc(label)}</span>${time}</div></div></a>`
  })
  const tabList = (tabs ?? [...groupIndex.entries()].sort((a, b) => b[1] - a[1]).map(([g]) => [g, g]))
    .filter(([g]) => groupIndex.has(g))
  const tab = (id, label, count) => {
    const lit = JSON.stringify(id).replace(/"/g, "'")
    return `<button type="button" class="archive-tab" :aria-pressed="filter === ${lit}" @click="filter = ${lit}">${esc(label)}<span>${count}</span></button>`
  }
  const tabsHtml = `<div class="archive-tabs" role="group" aria-label="按分类筛选">` +
    tab(ARCHIVE_ALL, '全部', list.length) +
    tabList.map(([g, label]) => tab(g, label, groupIndex.get(g))).join('') + '</div>'
  if (style === 'list') return `${tabsHtml}\n<div class="feed-list">\n${cards.join('\n')}\n</div>`
  return tabsHtml +
    `\n<div class="archive-feed" :data-filter="filter === '${ARCHIVE_ALL}' ? 'all' : 'cat'">\n${cards.join('\n')}\n</div>`
}

function writeFeedBlock(mdPath, marker, html) {
  const src = readFileSync(mdPath, 'utf8')
  const block = `<!-- ${marker}-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->\n${html}\n<!-- ${marker}-END -->`
  const updated = src.replace(new RegExp(`<!-- ${marker}-START[\\s\\S]*?<!-- ${marker}-END -->`), block)
  if (updated !== src) writeFileSync(mdPath, updated)
}

writeFeedBlock(join(DOCS_DIR, 'archive.md'), 'ARCHIVE', renderFeed(items, (it) => it.category || '未分类'))

// ---- AI 栏目页:同归档页版式(无侧栏),收 docs/ai/ 下全部中文页面,按子目录筛选 ----
// workflows 等落地页没写 date,也不进 RSS/归档,这里用内容最后修改日期补上
const AI_TABS = [['trends', '趋势'], ['agents', 'Agent'], ['coding', 'Coding'], ['workflows', '工作流'], ['products', '产品'], ['thinking', '思考']]
// 栏目页共用:收 docs/<栏目>/ 下全部中文页面,按子目录筛选
function collectSectionItems(section) {
  const out = []
  for (const file of files) {
    const rel = relative(DOCS_DIR, file).split(sep).join('/')
    if (!rel.startsWith(`${section}/`) || rel === `${section}/index.md`) continue
    const fm = parseFrontmatter(file)
    if (!fm || !fm.title || fm.draft === 'true' || fm.noindex === 'true') continue
    const dateRaw = fm.date || String(contentLastmod(file, fm, gitDates, snapshotDates) || '').slice(0, 10)
    const d = new Date(dateRaw)
    if (!dateRaw || Number.isNaN(d.getTime())) continue
    out.push({
      title: fm.title,
      description: fm.description || '',
      group: rel.split('/')[1],
      image: fm.image || (readFileSync(file, 'utf8').match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] || ''),
      date: d,
      dateStr: dateRaw.replace(/-/g, '.'),
      urlPath: baseNoSlash + toUrlPath(file)
    })
  }
  return out.sort((a, b) => b.date - a.date)
}
writeFeedBlock(join(DOCS_DIR, 'ai', 'index.md'), 'AI-FEED', renderFeed(collectSectionItems('ai'), (it) => it.group, AI_TABS, 'list'))

const THINKING_TABS = [['society', '社会'], ['first-principles', '第一性原理'], ['wealth', '财富'], ['technology', '技术'], ['life', '生活']]
const INVESTMENT_TABS = [['tesla', 'Tesla'], ['us-stocks', '美股'], ['ai-infrastructure', 'AI 基础设施'], ['asset-allocation', '资产配置'], ['methodology', '方法论']]
writeFeedBlock(join(DOCS_DIR, 'thinking', 'index.md'), 'THINKING-FEED', renderFeed(collectSectionItems('thinking'), (it) => it.group, THINKING_TABS, 'list'))
writeFeedBlock(join(DOCS_DIR, 'investment', 'index.md'), 'INVESTMENT-FEED', renderFeed(collectSectionItems('investment'), (it) => it.group, INVESTMENT_TABS, 'list'))

// ---- articles.json:给「我的收藏」页用的文章清单(含更新时间) ----
// updated 取 git 最后提交时间(frontmatter 写了 updated 则优先),收藏夹用它判断"有更新"
const articleList = []
for (const file of files) {
  if (isEnglishDoc(file)) continue
  const fm = parseFrontmatter(file)
  if (!fm || !fm.title || !fm.date) continue
  if (fm.draft === 'true') continue
  if (fm.noindex === 'true') continue
  const d = new Date(fm.date)
  if (Number.isNaN(d.getTime())) continue
  const rel = relative(DOCS_DIR, file).split(sep).join('/')
  let updated = null
  if (fm.updated) {
    const ud = new Date(fm.updated)
    if (!Number.isNaN(ud.getTime())) updated = ud.toISOString()
  }
  if (!updated) updated = gitDates.get(repoRel(file)) || snapshotDates.get(repoRel(file)) || d.toISOString()
  // tags: [AI, X, 自动化] 解析成数组,给每日统计的热门页面配标题用
  let tags = []
  if (fm.tags) {
    const t = fm.tags.trim()
    if (t.startsWith('[') && t.endsWith(']')) {
      tags = t
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }
  articleList.push({ key: rel, title: fm.title, date: fm.date, updated, tags })
}
articleList.sort((a, b) => b.date.localeCompare(a.date))
writeFileSync(join(PUBLIC_DIR, 'articles.json'), JSON.stringify(articleList))

const zhSlugs = new Set()
const enSlugs = new Set()
for (const file of files) {
  const relNoExt = relative(DOCS_DIR, file).split(sep).join('/').replace(/\.md$/, '')
  const { english, slug } = localeSlug(relNoExt)
  if (english) enSlugs.add(slug)
  else zhSlugs.add(slug)
}
const pairs = [...zhSlugs].filter((slug) => enSlugs.has(slug)).sort()
const pairsPath = join(DOCS_DIR, '.vitepress', 'i18n-pairs.json')
const pairsOut = JSON.stringify(pairs, null, 2) + '\n'
try {
  if (readFileSync(pairsPath, 'utf8') !== pairsOut) writeFileSync(pairsPath, pairsOut)
} catch {
  writeFileSync(pairsPath, pairsOut)
}

const sitemapCount = sitemapUrls ? sitemapUrls.split('\n').length : 0
console.log(`[gen-seo] sitemap.xml: ${sitemapCount} urls, feed.xml: ${items.length} items, archive: ${items.length} posts, articles.json: ${articleList.length} articles, i18n pairs: ${pairs.length}`)
