import { defineConfig } from 'vitepress'

const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'PRO的茶里芒果',
  description: 'AI、投资、产品，以及一些关于世界如何运行的思考。',
  cleanUrls: true,
  appearance: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://example.github.io/personal-site/'
  },
  themeConfig: {
    logo: undefined,
    siteTitle: 'PRO的茶里芒果',
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
        { text: 'Agent', items: [{ text: 'Agent 会成为下一代操作系统吗？', link: '/ai/agents/agent-os' }] },
        { text: 'Coding', items: [{ text: 'AI 编程的真正杠杆', link: '/ai/coding/ai-coding-leverage' }] }
      ],
      '/investment/': [
        { text: '投资', link: '/investment/' },
        { text: '美股与长期主义', items: [{ text: 'Tesla 的长期价值究竟来自汽车吗？', link: '/investment/tesla/long-term-value' }] }
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    footer: {
      message: '记录正在发生的事情，也记录自己如何理解它们。',
      copyright: '© 2026 PRO的茶里芒果'
    },
    outline: { level: [2, 3] },
    editLink: { pattern: 'https://github.com/your-name/personal-site/edit/main/docs/:path' }
  },
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'PRO的茶里芒果' }],
    ['meta', { property: 'og:description', content: 'AI、投资、产品，以及一些关于世界如何运行的思考。' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'PRO的茶里芒果 RSS', href: '/rss.xml' }]
  ]
})
