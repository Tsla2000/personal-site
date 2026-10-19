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
// SITE_URL(默认 https://tsla2000.github.io;Cloudflare Pages 构建时传 https://xxx.pages.dev),
// CANONICAL_URL(默认=SITE_URL 去 base;GitHub Pages 镜像构建时传新域名,使 canonical/sitemap 指向新站)。
// 在 package.json 的 docs:build 中于 vitepress build 之前运行。
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { execFileSync } from 'node:child_process'

const DOCS_DIR = new URL('../docs/', import.meta.url).pathname
const PUBLIC_DIR = join(DOCS_DIR, 'public')
const REPO_DIR = new URL('../', import.meta.url).pathname
const CONTENT_DATES_PATH = new URL('./content-dates.json', import.meta.url).pathname
// 图片文件名不带内容哈希,缓存 30 天;替换同名文件后最多一个月生效。
const IMAGE_CACHE_SECONDS = 60 * 60 * 24 * 30
// Vite 内容哈希资源可以缓存一年且 immutable。
const HASHED_ASSET_CACHE_SECONDS = 60 * 60 * 24 * 365
const _rawDomain = (process.env.SITE_URL ?? 'https://tsla2000.github.io').replace(/\/$/, '')
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
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length)
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

// ---- sitemap.xml:全部会构建出来的真实页面 ----
// 不再按 draft/noindex 剔除。这些 URL 已经在线上可访问(导航或正文链到它们),
// 旧逻辑把它们排除后,搜索引擎看到的 sitemap 和实际页面不一致。
// noindex 仍由页面自己的 meta 决定是否收录;RSS 继续只收正式文章。
const sitemapUrls = files
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
    image: fm.image || (readFileSync(file, 'utf8').match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] || '',
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
  const variants = path === '/' ? ['/'] : [path, `${path}/`]
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

// ---- 首页 Latest:取最新 3 篇文章,自动写入 docs/index.md ----
const latestRows = items.slice(0, 4).map((it) => {
  const sub = it.category ? it.category + ' · ' + it.description : it.description
  const image = it.image ? baseNoSlash + (it.image.startsWith('/') ? it.image : '/' + it.image) : ''
  const thumb = image
    ? '<img class="article-card-thumb" src="' + esc(image) + '" alt="' + esc(it.title) + '" loading="lazy" />'
    : '<div class="article-card-thumb article-card-placeholder"></div>'
  return '      <a class="article-card" href="' + it.urlPath + '">' +
    '\n        ' + thumb +
    '\n        <div class="article-card-body"><time>' + it.dateStr + '</time><strong>' + esc(it.title) + '</strong><small>' + esc(sub) + '</small></div>' +
    '\n      </a>'
}).join('\n')
const indexPath = join(DOCS_DIR, 'index.md')
const indexSrc = readFileSync(indexPath, 'utf8')
const latestHtml = `<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->\n    <div class="article-list">\n${latestRows}\n    </div>\n    <!-- LATEST-END -->`
const updated = indexSrc.replace(
  /<!-- LATEST-START[\s\S]*?<!-- LATEST-END -->/,
  latestHtml
)
if (updated !== indexSrc) writeFileSync(indexPath, updated)

// ---- 归档页:按年份分组,全部文章倒序,自动写入 docs/archive.md ----
const byYear = new Map()
for (const it of items) {
  const y = it.date.getFullYear()
  if (!byYear.has(y)) byYear.set(y, [])
  byYear.get(y).push(it)
}
const archiveSections = [...byYear.entries()]
  .sort((a, b) => b[0] - a[0])
  .map(([year, list]) => {
    const rows = list.map((it) => {
      const sub = it.category ? `${it.category} · ${it.description}` : it.description
      return `<a class="article-row" href="${it.urlPath}">
  <time>${it.dateStr}</time><div><strong>${esc(it.title)}</strong><small>${esc(sub)}</small></div>
</a>`
    }).join('\n')
    return `<h2>${year}（${list.length}）</h2>
<div class="article-list">
${rows}
</div>`
  }).join('\n')
const archivePath = join(DOCS_DIR, 'archive.md')
const archiveSrc = readFileSync(archivePath, 'utf8')
const archiveHtml = `<!-- ARCHIVE-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->\n${archiveSections}\n<!-- ARCHIVE-END -->`
const archiveUpdated = archiveSrc.replace(
  /<!-- ARCHIVE-START[\s\S]*?<!-- ARCHIVE-END -->/,
  archiveHtml
)
if (archiveUpdated !== archiveSrc) writeFileSync(archivePath, archiveUpdated)

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
