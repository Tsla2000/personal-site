---
title: PRO的茶里芒果
titleTemplate: AI、投资与长期思考的中文个人博客
description: AI、投资、产品，以及一些关于世界如何运行的思考。
keywords: PRO的茶里芒果, AI 趋势, Claude, AI Agent, AI 编程, 美股投资, 特斯拉, 价值投资, 长期主义, Agent Skills
aside: false
---

<script setup>
import { withBase } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'
const xmadeImg = withBase('/images/projects/xmade.jpg')
const storeUrl = 'https://chromewebstore.google.com/detail/xmade-twitter-video-downl/bgopfpaklpnjmjbngflljdnjnblhnbjm'

// 首页头条轮播:每 5 秒切换,图与下方文字同步;悬停暂停,圆点和箭头可手动切
let hcStop = null
onMounted(() => {
  const root = document.querySelector('[data-carousel]')
  if (!root) return
  const slides = [...root.querySelectorAll('.hc-slide')]
  const panels = [...root.querySelectorAll('.hc-panel')]
  const dots = [...root.querySelectorAll('.hc-dot')]
  if (slides.length < 2) return
  let cur = 0
  let timer = null
  const show = (n) => {
    cur = (n + slides.length) % slides.length
    slides.forEach((el, i) => el.classList.toggle('is-active', i === cur))
    panels.forEach((el, i) => el.classList.toggle('is-active', i === cur))
    dots.forEach((el, i) => el.classList.toggle('is-active', i === cur))
  }
  const play = () => { stop(); timer = setInterval(() => show(cur + 1), 5000) }
  const stop = () => { if (timer) { clearInterval(timer); timer = null } }
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); play() }))
  root.querySelector('.hc-prev')?.addEventListener('click', () => { show(cur - 1); play() })
  root.querySelector('.hc-next')?.addEventListener('click', () => { show(cur + 1); play() })
  root.addEventListener('mouseenter', stop)
  root.addEventListener('mouseleave', play)
  play()
  hcStop = stop
})
onUnmounted(() => { if (hcStop) hcStop() })
</script>

<!-- Latest 板块由构建脚本按当次部署目标自动生成。技能卡链到 /skills/，相对路径兼容 GitHub Pages 与 Cloudflare Pages。-->
<div class="home-page">
  <section class="home-section home-latest">
<!-- LATEST-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
    <div class="home-head">
      <h1>最新文章</h1>
      <nav class="home-topics" aria-label="文章栏目"><a class="home-topic" href="/ai/">AI<span>14</span></a><a class="home-topic" href="/investment/">投资<span>4</span></a><a class="home-topic" href="/thinking/">思考<span>4</span></a><a class="home-topic is-all" href="/archive">全部 22 篇 →</a></nav>
    </div>
    <div class="article-list latest-grid">
    <div class="home-carousel" data-carousel>
      <div class="hc-stage">
        <a class="hc-slide is-active" href="/ai/workflows/my-ai-skills-part-1"><img class="hc-img" src="/images/ai-skills-part1-cover.jpg" alt="我的 AI 技能包（上）：每天在用的 10 个技能，全部带演示视频" loading="eager" fetchpriority="high" decoding="async" /></a>
        <a class="hc-slide" href="/ai/workflows/my-ai-skills-part-2"><img class="hc-img" src="/images/ai-skills-part2-cover.jpg" alt="我的 AI 技能包（下）：另外 10 个每天在用的技能，全部带演示视频" loading="lazy" decoding="async" /></a>
        <a class="hc-slide" href="/ai/products/bing-wallpaper-for-mac"><img class="hc-img" src="/images/bing-wallpaper/cover.jpg" alt="必应每日壁纸 for Mac：用 REA 逆向 Windows 官方版，复刻到 macOS 的开源应用" loading="lazy" decoding="async" /></a>
        <button class="hc-arrow hc-prev" type="button" aria-label="上一篇">‹</button>
        <button class="hc-arrow hc-next" type="button" aria-label="下一篇">›</button>
        <div class="hc-dots"><button class="hc-dot is-active" type="button" aria-label="第 1 篇"></button><button class="hc-dot" type="button" aria-label="第 2 篇"></button><button class="hc-dot" type="button" aria-label="第 3 篇"></button></div>
      </div>
      <div class="hc-panels">
        <a class="hc-panel is-active" href="/ai/workflows/my-ai-skills-part-1">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-23">2026.10.23</time></span>
          <strong>我的 AI 技能包（上）：每天在用的 10 个技能，全部带演示视频</strong><small>我给自己攒了 22 个 AI 技能，这篇只写每天真在用的 10 个：去AI味写作、封面图生成、水彩插画、浏览器自动化、个人网站搭建、原理解剖图、图解设计、一稿多用、数据分析、出海新词上站。每个技能都配了一段 30 秒演示视频。</small>
        </a>
        <a class="hc-panel" href="/ai/workflows/my-ai-skills-part-2">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-23">2026.10.23</time></span>
          <strong>我的 AI 技能包（下）：另外 10 个每天在用的技能，全部带演示视频</strong><small>技能包下篇：AI 界面设计规范、前端设计、UI 设计参考清单、出海变现转化、技能编写、头脑风暴、系统化排查、交付前验证、网站上线验收、AI 项目交付。管设计、管变现、管排查、管交付，每个技能配一段 30 秒演示视频。</small>
        </a>
        <a class="hc-panel" href="/ai/products/bing-wallpaper-for-mac">
          <span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-22">2026.10.22</time></span>
          <strong>必应每日壁纸 for Mac：用 REA 逆向 Windows 官方版，复刻到 macOS 的开源应用</strong><small>微软官方必应壁纸只有 Windows 版。fairzy 用 REA 逆向官方版 1.1.469.0 的行为，用 Swift 在 macOS 上原生复刻：菜单栏应用、每 30 分钟检查新图、12 个市场、主题轮换，MIT 开源免费。</small>
        </a>
      </div>
    </div>
      <a class="article-card" href="/ai/products/claude-duet">
        <img class="article-card-thumb" src="/images/claude-duet/cover.jpg" alt="Anthropic上线官方AI 管家App：Claude Duet ，这不就是一直我在用的Muse和GrokBot吗？" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-22">2026.10.22</time></span><strong>Anthropic上线官方AI 管家App：Claude Duet ，这不就是一直我在用的Muse和GrokBot吗？</strong></div>
      </a>
      <a class="article-card" href="/ai/products/codex-usage-desktop-guide">
        <img class="article-card-thumb" src="/images/codex-usage/cover.jpg" alt="Codex Usage Desktop 使用指南：看清 Token 去向与剩余额度" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-21">2026.10.21</time></span><strong>Codex Usage Desktop 使用指南：看清 Token 去向与剩余额度</strong></div>
      </a>
      <a class="article-card" href="/investment/methodology/ai-invest-clear">
        <img class="article-card-thumb" src="/images/ai-invest-clear/cover.jpg" alt="AI 越成功，投资者越需要保持清醒" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">投资</span><time datetime="2026-10-18">2026.10.18</time></span><strong>AI 越成功，投资者越需要保持清醒</strong></div>
      </a>
      <a class="article-card" href="/ai/trends/claude-search-surge">
        <img class="article-card-thumb" src="/images/claude-search-surge/fig01_gt_compare.png" alt="Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude" loading="lazy" decoding="async" />
        <div class="article-card-body"><span class="article-card-meta"><span class="article-card-cat">AI</span><time datetime="2026-10-16">2026.10.16</time></span><strong>Claude 搜索热度是 OpenAI 的 13 倍？开发者为什么都在用 Claude</strong></div>
      </a>
    </div>
    <ul class="latest-rows">
      <li><a href="/thinking/life/global-living-system"><span class="latest-row-head"><span class="latest-row-title">别急着移民：未来十年，如何设计自己的全球生活系统</span><span class="latest-row-date">· <time datetime="2026-10-18">2026.10.18</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/global-living/cover.jpg" alt="别急着移民：未来十年，如何设计自己的全球生活系统" loading="lazy" decoding="async" /><span class="latest-row-desc">从身份、收入到资产、居住、医疗养老与家庭安排，建立一套能计算成本、能够调整、也允许退出的长期方案。</span></span></a></li>
      <li><a href="/investment/tesla/q3-earnings-preview"><span class="latest-row-head"><span class="latest-row-title">特斯拉 Q3 财报前瞻：会飞的 Roadster 之后，真正决定股价的是什么</span><span class="latest-row-date">· <time datetime="2026-10-16">2026.10.16</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/tesla-q3/cover.webp" alt="特斯拉 Q3 财报前瞻：会飞的 Roadster 之后，真正决定股价的是什么" loading="lazy" decoding="async" /><span class="latest-row-desc">Roadster 是营销，不是营收。10 月 21 日财报更该盯 FSD/Robotaxi、HW3 拿不到 v15，以及交付与利润率。</span></span></a></li>
      <li><a href="/ai/trends/anthropic-distillation-dispute"><span class="latest-row-head"><span class="latest-row-title">Anthropic 点名智谱和月之暗面，AI 蒸馏之争升级了</span><span class="latest-row-date">· <time datetime="2026-10-15">2026.10.15</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/distill/fig01_accusation_chain.png" alt="Anthropic 点名智谱和月之暗面，AI 蒸馏之争升级了" loading="lazy" decoding="async" /><span class="latest-row-desc">报告强调，蒸馏攻击真正想要的是模型的思考过程，并称三层防御已将被盗取的模型推理信息量减少约 90%–99%。</span></span></a></li>
      <li><a href="/ai/agents/x-auto-ops"><span class="latest-row-head"><span class="latest-row-title">我用 Muse 搭建了一套 X 账号自动化运营系统：从选题、写作到发布</span><span class="latest-row-date">· <time datetime="2026-10-13">2026.10.13</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/x-ops/x-ops-cover-watercolor.jpg" alt="我用 Muse 搭建了一套 X 账号自动化运营系统：从选题、写作到发布" loading="lazy" decoding="async" /><span class="latest-row-desc">把找选题、写文案、配图、发布、回评论拆成四层自动化流水线：规则文件 + 定时任务 + Agent 执行 + 状态管理，人只负责确认和验收。</span></span></a></li>
      <li><a href="/ai/coding/twikoo-anonymous-comments"><span class="latest-row-head"><span class="latest-row-title">如何让 Muse 给个人网站接入留言板和评论功能</span><span class="latest-row-date">· <time datetime="2026-10-13">2026.10.13</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/twikoo-architecture.webp" alt="如何让 Muse 给个人网站接入留言板和评论功能" loading="lazy" decoding="async" /><span class="latest-row-desc">给 VitePress 个人网站增加文章评论和独立留言板，记录使用 Muse 接入 Twikoo，以及配置 Vercel 和 MongoDB 时遇到的问题。</span></span></a></li>
      <li><a href="/ai/trends/rea-software-replicability"><span class="latest-row-head"><span class="latest-row-title">REA 逆向一切 App：互联网即将进入「软件可复制性」的新阶段</span><span class="latest-row-date">· <time datetime="2026-10-11">2026.10.11</time></span></span><span class="latest-row-body"><img class="latest-row-thumb" src="/images/rea/rea-cover.webp" alt="REA 逆向一切 App：互联网即将进入「软件可复制性」的新阶段" loading="lazy" decoding="async" /><span class="latest-row-desc">AI 逆向工程工具正在拉低&quot;看懂一个软件&quot;的成本。当功能越来越容易复制，软件公司的竞争优势会转移到哪里？</span></span></a></li>
    </ul>
    <!-- LATEST-END -->
  </section>

  <section class="home-section">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
      <h2>技能商店</h2>
      <a href="skills/" style="font-size:14px;color:#1d9bf0;white-space:nowrap;">进入技能商店 →</a>
    </div>
    <SkillShowcase />
  </section>

  <section class="home-section" id="projects">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
      <h2>项目</h2>
      <a href="projects/" style="font-size:14px;color:#1d9bf0;white-space:nowrap;">查看全部项目 →</a>
    </div>
    <div class="project-list">
      <article class="project-tile">
        <a class="skill-thumb" :href="storeUrl" target="_blank" rel="noopener">
          <img :src="xmadeImg" alt="XMade：一键下载 X 上的推文、视频和长文" width="800" height="450" loading="lazy" decoding="async" />
        </a>
        <h3><a :href="storeUrl" target="_blank" rel="noopener">XMade</a></h3>
        <p class="skill-pitch">Chrome 扩展：一键下载 X 上的推文、视频和长文，整理好直接推送到微信公众号草稿。我自己每天在用的工具。</p>
        <div class="skill-foot">
          <span class="skill-chip">Chrome 扩展</span>
          <div class="skill-controls">
            <a class="skill-zip" :href="storeUrl" target="_blank" rel="noopener">去 Chrome 应用店安装 →</a>
          </div>
        </div>
      </article>
    </div>
  </section>

</div>
