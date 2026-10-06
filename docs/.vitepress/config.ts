import { defineConfig, type HeadConfig } from 'vitepress'

const base = process.env.BASE_PATH ?? '/'
const SITE_URL = 'https://tsla2000.github.io'
const SITE_TITLE = 'PRO的茶里芒果'
const SITE_DESC = 'AI、投资、产品，以及一些关于世界如何运行的思考。'

// 把 base 尾斜杠统一去掉,避免拼接出双斜杠
const baseNoSlash = base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base === '/' ? '' : base

/** frontmatter 的 relativePath -> 站内规范路径(不带 base),cleanUrls 风格 */
function pagePath(relativePath: string): string {
  let p = relativePath.replace(/\.md$/, '')
  if (p === 'index') return '/'
  if (p.endsWith('/index')) p = p.slice(0, -'/index'.length)
  return '/' + p
}

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: SITE_TITLE,
  description: SITE_DESC,
  cleanUrls: true,
  appearance: true,
  lastUpdated: true,
  // sitemap 由 scripts/gen-seo.mjs 自行生成到 public/(VitePress 内置 sitemap 不拼接 base 路径,故不用它)
  themeConfig: {
    logo: undefined,
    siteTitle: SITE_TITLE,
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI', link: '/ai/' },
      { text: '投资', link: '/investment/' },
      { text: '产品', link: '/products/' },
      { text: '思考', link: '/thinking/' },
      { text: '阅读', link: '/reading/' },
      { text: '关于', link: '/about/' }
    ],
    sidebar: {
      '/ai/': [
        { text: 'AI', link: '/ai/' },
        { text: '趋势', items: [{ text: 'AI 产业的下一阶段', link: '/ai/trends/next-stage' }] },
        { text: 'Agent', items: [{ text: 'AI Agent 会成为下一代操作系统吗？', link: '/ai/agents/agent-os' }] },
        { text: 'Coding', items: [{ text: 'AI 编程的真正杠杆', link: '/ai/coding/ai-coding-leverage' }, { text: '我是如何用 Muse 自动化部署个人网站的', link: '/ai/coding/muse-auto-deploy' }] }
      ],
      '/investment/': [
        { text: '投资', link: '/investment/' },
        { text: '美股与长期主义', items: [{ text: 'Tesla 的长期价值究竟来自汽车吗？', link: '/investment/tesla/long-term-value' }] },
        { text: '美股策略', items: [{ text: 'AI 进行到哪一步了？普通人如何投资美股', link: '/investment/us-stocks/ai-stage-invest-guide' }] }
      ],
      '/thinking/': [
        { text: '思考', link: '/thinking/' },
        { text: '长期思考', items: [{ text: '财富的第一性原理是什么？', link: '/thinking/wealth/first-principles' }] }
      ],
      '/reading/': [{ text: '阅读', link: '/reading/' }],
      '/about/': [
        { text: '关于', link: '/about/' },
        { text: '项目', link: '/about/projects' },
        { text: '时间线', link: '/about/timeline' }
      ]
    },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/tsla2000/personal-site' }],
    footer: {
      message: '记录正在发生的事情，也记录自己如何理解它们。',
      copyright: '© 2026 PRO的茶里芒果'
    },
    outline: { level: [2, 3] },
    editLink: { pattern: 'https://github.com/tsla2000/personal-site/edit/main/docs/:path' }
  },

  // 每页自动输出 canonical + Open Graph / Twitter Card,取值来自该页 frontmatter
  transformHead({ pageData }) {
    const fm = pageData.frontmatter ?? {}
    const url = `${SITE_URL}${baseNoSlash}${pagePath(pageData.relativePath)}`
    const title = typeof fm.title === 'string' && fm.title ? fm.title : SITE_TITLE
    const desc = typeof fm.description === 'string' && fm.description ? fm.description : SITE_DESC
    const isHome = pageData.relativePath === 'index.md'

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:site_name', content: SITE_TITLE }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }]
    ]

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
    return head
  },

  head: [
    // RSS 订阅入口
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} RSS`, href: `${baseNoSlash}/feed.xml` }],

    // ---- 访问统计(Umami 已启用,见 ANALYTICS_SETUP.md) ----
    ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '9be496a4-8003-46ab-9f02-de2fa19abab4' }],
    // Plausible(备用,未启用):
    // ['script', { defer: '', 'data-domain': 'tsla2000.github.io', src: 'https://plausible.io/js/script.js' }]
  ]
})
