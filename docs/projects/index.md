---
title: 项目
description: 我在做的产品。目前包括 Chrome 扩展 XMade。
---

<script setup>
import { withBase } from 'vitepress'
const xmadeImg = withBase('/images/projects/xmade.jpg')
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
</div>
