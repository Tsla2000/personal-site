import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type HeadConfig } from 'vitepress'

const base = process.env.BASE_PATH ?? '/'
// 部署目标域名:Cloudflare Pages 构建时通过环境变量 SITE_URL 传入(如 https://xxx.pages.dev);缺省为 GitHub Pages 地址
// 容错:没写 https:// 时自动补上,避免 canonical 写出裸域名
const _rawSiteUrl = (process.env.SITE_URL ?? 'https://tsla2000.github.io').replace(/\/$/, '')
const SITE_URL = /^https?:\/\//i.test(_rawSiteUrl) ? _rawSiteUrl : `https://${_rawSiteUrl}`
// 规范域名:搜索引擎认定的主域名。GitHub Pages 镜像构建时通过 CANONICAL_URL 传入新域名,
// 使旧站每页 canonical/og:url 指向新站对应页面(去 base 前缀);缺省=本站地址
const _rawCanon = (process.env.CANONICAL_URL ?? SITE_URL).replace(/\/$/, '')
const CANONICAL_URL = /^https?:\/\//i.test(_rawCanon) ? _rawCanon : `https://${_rawCanon}`
const SITE_TITLE = 'PRO的茶里芒果'
const SITE_DESC = 'AI、投资、产品，以及一些关于世界如何运行的思考。'
const EN_TITLE = "Pro's MangoFund"
const EN_DESC = 'Notes on AI products, side hustles, investing, and digital products.'
const DOCS_DIR = fileURLToPath(new URL('..', import.meta.url))
const GITHUB_PROFILE = 'https://github.com/tsla2000'
const GITHUB_REPO = 'https://github.com/tsla2000/personal-site'
// 站长 X 用户名，不要带 @。填 TODO 或留空时不输出 X 图标和 twitter 账号 meta。
const X_HANDLE = 'PRO_AI_99T'

function configuredXHandle(handle: string): string | null {
  const trimmed = handle.trim().replace(/^@/, '')
  if (!trimmed || /todo/i.test(trimmed)) return null
  if (!/^[A-Za-z0-9_]{1,15}$/.test(trimmed)) return null
  return trimmed
}

const xHandle = configuredXHandle(X_HANDLE)
const xProfile = xHandle ? `https://x.com/${xHandle}` : ''
const authorSameAs = [GITHUB_PROFILE, ...(xProfile ? [xProfile] : [])]

// 把 base 尾斜杠统一去掉,避免拼接出双斜杠
const baseNoSlash = base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base === '/' ? '' : base

/** frontmatter 的 relativePath -> 站内规范路径(不带 base),cleanUrls 风格 */
function pagePath(relativePath: string): string {
  let p = relativePath.replace(/\.md$/, '')
  if (p === 'index') return '/'
  if (p.endsWith('/index')) p = p.slice(0, -'/index'.length)
  return '/' + p
}

/** 去掉 locale 前缀后的 slug。首页为 index。 */
function localeSlug(relativePath: string): { english: boolean; slug: string } {
  let slug = relativePath.replace(/\.md$/, '')
  const english = slug === 'en' || slug.startsWith('en/')
  if (english) slug = slug === 'en' ? 'index' : slug.slice('en/'.length)
  return { english, slug }
}

function markdownPath(slug: string, english: boolean): string {
  if (english) return slug === 'index' ? 'en/index.md' : `en/${slug}.md`
  return `${slug}.md`
}

/** 两种语言都有的页面才输出 hreflang。x-default 指向中文。 */
function hreflangAlternates(relativePath: string): { zh: string; en: string } | null {
  const { slug } = localeSlug(relativePath)
  if (!existsSync(join(DOCS_DIR, markdownPath(slug, false)))) return null
  if (!existsSync(join(DOCS_DIR, markdownPath(slug, true)))) return null
  const zhPath = pagePath(markdownPath(slug, false))
  const enPath = pagePath(markdownPath(slug, true))
  return { zh: `${CANONICAL_URL}${zhPath}`, en: `${CANONICAL_URL}${enPath}` }
}

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: SITE_TITLE,
  description: SITE_DESC,
  cleanUrls: true,
  appearance: true,
  // sitemap 由 scripts/gen-seo.mjs 自行生成到 public/(VitePress 内置 sitemap 不拼接 base 路径,故不用它)
  themeConfig: {
    logo: `${baseNoSlash}/images/mango-logo.png`,
    siteTitle: SITE_TITLE,
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI', link: '/ai/' },
      { text: '投资', link: '/investment/' },
      { text: '思考', link: '/thinking/' },
      { text: '项目', link: '/#projects' },
      { text: '留言板', link: '/guestbook/' },
      { text: '订阅', link: '/subscribe/' },
      { text: '关于', link: '/about/' }
    ],
    sidebar: {
      '/ai/': [
        { text: 'AI', link: '/ai/' },
        { text: '趋势', items: [{ text: 'Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude', link: '/ai/trends/claude-search-surge' }, { text: 'Anthropic 点名智谱和月之暗面，AI 蒸馏之争升级了', link: '/ai/trends/anthropic-distillation-dispute' }, { text: 'REA 逆向一切 App：互联网即将进入「软件可复制性」的新阶段', link: '/ai/trends/rea-software-replicability' }, { text: 'AI 产业的下一阶段', link: '/ai/trends/next-stage' }] },
        { text: 'Agent', items: [{ text: '我用 Muse 搭建了一套 X 账号自动化运营系统', link: '/ai/agents/x-auto-ops' }, { text: 'AI Agent 会成为下一代操作系统吗？', link: '/ai/agents/agent-os' }] },
        { text: 'Coding', items: [{ text: 'AI 编程的真正杠杆', link: '/ai/coding/ai-coding-leverage' }, { text: '我是如何用 Muse 自动化部署个人网站的', link: '/ai/coding/muse-auto-deploy' }] }
      ],
      '/investment/': [
        { text: '投资', link: '/investment/' },
        { text: '美股与长期主义', items: [{ text: '特斯拉 Q3 财报前瞻：会飞的 Roadster 之后，真正决定股价的是什么', link: '/investment/tesla/q3-earnings-preview' }, { text: 'Tesla 的长期价值究竟来自汽车吗？', link: '/investment/tesla/long-term-value' }] },
        { text: '美股策略', items: [{ text: 'AI 进行到哪一步了？普通人如何投资美股', link: '/investment/us-stocks/ai-stage-invest-guide' }] }
      ],
      '/thinking/': [
        { text: '思考', link: '/thinking/' },
        { text: '长期思考', items: [{ text: '财富的第一性原理是什么？', link: '/thinking/wealth/first-principles' }, { text: '当智能可以无限复制，什么才是真正稀缺？', link: '/thinking/first-principles/scarcity' }] },
        { text: 'AI 与社会', items: [{ text: 'AI 技术终将造福每个人吗？', link: '/thinking/society/ai-labor-capital' }] }
      ],
      '/about/': [
        { text: '关于', link: '/about/' },
        { text: '时间线', link: '/about/timeline' }
      ]
    },
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: GITHUB_REPO },
      ...(xProfile ? [{ icon: 'x' as const, link: xProfile }] : [])
    ],
    footer: {
      message: '每天做有价值的事情，人生永远要有 Plan B。',
      copyright: '© 2026 PRO的茶里芒果'
    },
    outline: { level: [2, 3] },
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式'
  },

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: SITE_TITLE,
      description: SITE_DESC
    },
    en: {
      label: 'English',
      lang: 'en',
      title: EN_TITLE,
      description: EN_DESC,
      themeConfig: {
        siteTitle: EN_TITLE,
        logoLink: '/en/',
        nav: [
          { text: 'Home', link: '/en/', activeMatch: '^/en/?$' },
          { text: 'AI', link: '/ai/' },
          { text: 'Investing', link: '/en/investment/tesla/q3-earnings-preview', activeMatch: '^/en/investment/' },
          { text: 'Thinking', link: '/thinking/' },
          { text: 'Projects', link: '/#projects' },
          { text: 'Guestbook', link: '/guestbook/' },
          { text: 'Subscribe', link: '/subscribe/' },
          { text: 'About', link: '/about/' }
        ],
        sidebar: {
          '/en/investment/': [
            {
              text: 'US stocks',
              items: [
                {
                  text: 'Tesla Q3 2026 Earnings Preview: What Actually Moves the Stock',
                  link: '/en/investment/tesla/q3-earnings-preview'
                }
              ]
            }
          ]
        },
        footer: {
          message: 'Do something valuable every day, and always keep a Plan B.',
          copyright: "© 2026 Pro's MangoFund"
        },
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        darkModeSwitchLabel: 'Appearance',
        darkModeSwitchTitle: 'Switch to dark mode',
        lightModeSwitchTitle: 'Switch to light mode',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Language',
        skipToContentLabel: 'Skip to content'
      }
    }
  },

  // 每页自动输出 canonical + Open Graph / Twitter Card,取值来自该页 frontmatter
  transformHead({ pageData }) {
    const fm = pageData.frontmatter ?? {}
    const isEn = pageData.relativePath.startsWith('en/')
    const siteTitle = isEn ? EN_TITLE : SITE_TITLE
    const siteDesc = isEn ? EN_DESC : SITE_DESC
    const localeLang = isEn ? 'en' : 'zh-CN'
    const ogLocale = isEn ? 'en_US' : 'zh_CN'
    const canonical = `${CANONICAL_URL}${pagePath(pageData.relativePath)}`
    const title = typeof fm.title === 'string' && fm.title ? fm.title : siteTitle
    const desc = typeof fm.description === 'string' && fm.description ? fm.description : siteDesc
    const isHome = pageData.relativePath === 'index.md' || pageData.relativePath === 'en/index.md'
    // 默认分享卡(1200x630);文章可在 frontmatter 里用 image: /images/xxx.png 覆盖(站内相对路径)
    const imgPath = typeof fm.image === 'string' && fm.image ? fm.image : '/images/social-card.png'
    const imgUrl = `${SITE_URL}${baseNoSlash}${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:locale', content: ogLocale }],
      ['meta', { property: 'og:site_name', content: siteTitle }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:image', content: imgUrl }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }],
      ['meta', { name: 'twitter:image', content: imgUrl }]
    ]
    if (xHandle) {
      head.push(['meta', { name: 'twitter:site', content: `@${xHandle}` }])
      head.push(['meta', { name: 'twitter:creator', content: `@${xHandle}` }])
    }
    if (typeof fm.keywords === 'string' && fm.keywords.trim()) {
      head.push(['meta', { name: 'keywords', content: fm.keywords.trim() }])
    }
    const alternates = hreflangAlternates(pageData.relativePath)
    if (alternates) {
      head.push(['link', { rel: 'alternate', hreflang: 'zh-CN', href: alternates.zh }])
      head.push(['link', { rel: 'alternate', hreflang: 'en', href: alternates.en }])
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: alternates.zh }])
    }

    if (fm.noindex === true) {
      head.push(['meta', { name: 'robots', content: 'noindex' }])
    }

    if (isHome) {
      head.push(['meta', { property: 'og:type', content: 'website' }])
    } else {
      head.push(['meta', { property: 'og:type', content: 'article' }])
      if (typeof fm.date === 'string' && fm.date) {
        const d = new Date(fm.date)
        if (!Number.isNaN(d.getTime())) {
          head.push(['meta', { property: 'article:published_time', content: d.toISOString() }])
        }
      }
    }

    // ---- 结构化数据 JSON-LD(供搜索引擎/AI 问答引擎摘取) ----
    // 首页 → WebSite;带 title 的文章页 → Article;frontmatter 写 faq: [{q, a}] 的页面追加 FAQPage
    const schemas: Record<string, unknown>[] = []
    const author = {
      '@type': 'Person',
      name: 'pro',
      url: `${CANONICAL_URL}/about/`,
      sameAs: authorSameAs
    }
    if (isHome) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteTitle,
        url: canonical,
        description: desc,
        inLanguage: localeLang,
        author
      })
      schemas.push({ '@context': 'https://schema.org', ...author })
    } else if (title) {
      const article: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: desc,
        url: canonical,
        mainEntityOfPage: canonical,
        inLanguage: localeLang,
        author,
        publisher: {
          '@type': 'Organization',
          name: siteTitle,
          logo: { '@type': 'ImageObject', url: `${CANONICAL_URL}/images/site-icon.png` }
        },
        image: imgUrl
      }
      if (typeof fm.date === 'string' && fm.date) {
        const d = new Date(fm.date)
        if (!Number.isNaN(d.getTime())) {
          article.datePublished = d.toISOString()
          article.dateModified = d.toISOString()
        }
      }
      schemas.push(article)
      const faqRaw = (fm as Record<string, unknown>).faq
      if (Array.isArray(faqRaw)) {
        const qa = faqRaw
          .filter((e): e is { q: string; a: string } =>
            !!e && typeof (e as { q?: unknown }).q === 'string' && typeof (e as { a?: unknown }).a === 'string')
          .map((e) => ({
            '@type': 'Question',
            name: e.q,
            acceptedAnswer: { '@type': 'Answer', text: e.a }
          }))
        if (qa.length > 0) {
          schemas.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa })
        }
      }
    }
    for (const s of schemas) {
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(s).replace(/<\//g, '<\\/')])
    }
    return head
  },

  // 图片懒加载：正文图片默认 loading="lazy"
  markdown: {
    config: (md) => {
      const defaultRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
      }
      md.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        const pageKey = String(env.relativePath || env.path || '')
        if (env.lazyImagePage !== pageKey) {
          env.lazyImagePage = pageKey
          env.lazyImageCount = 0
        }
        env.lazyImageCount += 1
        // 每页首图可能在首屏，不懒加载；其余图片懒加载。
        if (!token.attrGet('loading') && env.lazyImageCount > 1) {
          token.attrSet('loading', 'lazy')
        }
        if (!token.attrGet('decoding')) {
          token.attrSet('decoding', 'async')
        }
        return defaultRender(tokens, idx, options, env, self)
      }
    }
  },

  head: [
    // RSS 订阅入口
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} RSS`, href: `${baseNoSlash}/feed.xml` }],

    // 站点图标
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${baseNoSlash}/favicon.ico` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseNoSlash}/favicon-32x32.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${baseNoSlash}/favicon-16x16.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${baseNoSlash}/apple-touch-icon.png` }],

    // ---- 访问统计(Umami 已启用,见 ANALYTICS_SETUP.md) ----
    ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '9be496a4-8003-46ab-9f02-de2fa19abab4' }],
    // Plausible(备用,未启用):
    // ['script', { defer: '', 'data-domain': 'tsla2000.github.io', src: 'https://plausible.io/js/script.js' }]
  ]
})
