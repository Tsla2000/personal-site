// 构建时生成 SEO 文件:扫描 docs/**/*.md,输出
//   - docs/public/feed.xml    (RSS,只收录带 title+date 的文章页)
//   - docs/public/sitemap.xml  (全站页面)
//   - docs/public/robots.txt   (sitemap 地址跟随部署目标)
//   - 重写 docs/index.md 的 LATEST 板块(站内链接带 base 前缀)
// 部署目标由环境变量决定:BASE_PATH(默认 '/';GitHub Pages 构建时传 '/personal-site/'),
// SITE_URL(默认 https://tsla2000.github.io;Cloudflare Pages 构建时传 https://xxx.pages.dev),
// CANONICAL_URL(默认=SITE_URL 去 base;GitHub Pages 镜像构建时传新域名,使 canonical/sitemap 指向新站)。
// 在 package.json 的 docs:build 中于 vitepress build 之前运行。
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DOCS_DIR = new URL('../docs/', import.meta.url).pathname
const PUBLIC_DIR = join(DOCS_DIR, 'public')
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

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const files = walk(DOCS_DIR).sort()

// ---- sitemap.xml:全站页面 ----
const sitemapUrls = files
  .map((f) => {
    const loc = CANONICAL_URL + toUrlPath(f)
    const lastmod = statSync(f).mtime.toISOString()
    return `  <url><loc>${esc(loc)}</loc><lastmod>${lastmod}</lastmod></url>`
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
  const fm = parseFrontmatter(file)
  if (!fm || !fm.title || !fm.date) continue
  if (fm.draft === 'true') continue
  const d = new Date(fm.date)
  if (Number.isNaN(d.getTime())) continue
  items.push({
    title: fm.title,
    description: fm.description || '',
    category: fm.category || '',
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
writeFileSync(join(PUBLIC_DIR, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${CANONICAL_URL}/sitemap.xml\n`)

// ---- 首页 Latest:取最新 3 篇文章,自动写入 docs/index.md ----
const latestRows = items.slice(0, 3).map((it) => {
  const sub = it.category ? `${it.category} · ${it.description}` : it.description
  return `      <a class="article-row" href="${it.urlPath}">
        <time>${it.dateStr}</time><div><strong>${esc(it.title)}</strong><small>${esc(sub)}</small></div>
      </a>`
}).join('\n')
const indexPath = join(DOCS_DIR, 'index.md')
const indexSrc = readFileSync(indexPath, 'utf8')
const latestHtml = `<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->\n    <div class="article-list">\n${latestRows}\n    </div>\n    <!-- LATEST-END -->`
const updated = indexSrc.replace(
  /<!-- LATEST-START[\s\S]*?<!-- LATEST-END -->/,
  latestHtml
)
if (updated !== indexSrc) writeFileSync(indexPath, updated)
console.log(`[gen-seo] sitemap.xml: ${files.length} urls, feed.xml: ${items.length} items`)
