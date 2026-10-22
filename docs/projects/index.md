---
title: 项目
description: 我在做的产品，和朋友们做的开源项目。目前包括 Chrome 扩展 XMade、必应每日壁纸 for Mac。
---

<script setup>
import { withBase } from 'vitepress'
const xmadeImg = withBase('/images/projects/xmade.jpg')
const bingImg = withBase('/images/bing-wallpaper/cover.jpg')
const storeUrl = 'https://chromewebstore.google.com/detail/xmade-twitter-video-downl/bgopfpaklpnjmjbngflljdnjnblhnbjm'
</script>

# 项目

<div class="project-list">
  <article class="project-tile">
    <a class="skill-thumb" :href="storeUrl" target="_blank" rel="noopener">
      <img :src="xmadeImg" alt="XMade：一键下载 X 上的推文、视频和长文" width="800" height="450" loading="eager" decoding="async" />
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
  <article class="project-tile">
    <a class="skill-thumb" href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">
      <img :src="bingImg" alt="必应每日壁纸 for Mac：每天自动把必应每日图片设成桌面" width="800" height="450" loading="lazy" decoding="async" />
    </a>
    <h3><a href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">必应每日壁纸 for Mac</a></h3>
    <p class="skill-pitch">朋友 fairzy 的开源应用：用 REA 逆向 Windows 官方必应壁纸的行为，在 macOS 上用 Swift 原生复刻。只占菜单栏，每天自动换上必应每日图片，MIT 开源，免费。</p>
    <div class="skill-foot">
      <span class="skill-chip">macOS 应用 · 开源</span>
      <div class="skill-controls">
        <a class="skill-zip" href="/ai/products/bing-wallpaper-for-mac">看介绍 →</a>
        <a class="skill-zip" href="https://github.com/fairzy/bingwallpaper-for-mac" target="_blank" rel="noopener">GitHub →</a>
      </div>
    </div>
  </article>
</div>
