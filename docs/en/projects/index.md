---
title: Projects
description: Products I build, and open-source projects by friends. Currently XMade, a Chrome extension for saving posts from X, and Bing Wallpaper for Mac.
---

<script setup>
import { withBase } from 'vitepress'
const xmadeImg = withBase('/images/projects/xmade.jpg')
const bingImg = withBase('/images/bing-wallpaper/cover.jpg')
const storeUrl = 'https://chromewebstore.google.com/detail/xmade-twitter-video-downl/bgopfpaklpnjmjbngflljdnjnblhnbjm'
</script>

# Projects

<div class="project-list">
  <article class="project-tile">
    <a class="skill-thumb" :href="storeUrl" target="_blank" rel="noopener">
      <img :src="xmadeImg" alt="XMade: one-click download of posts, videos, and long articles from X" width="800" height="450" loading="eager" decoding="async" />
    </a>
    <h3><a :href="storeUrl" target="_blank" rel="noopener">XMade</a></h3>
    <p class="skill-pitch">A Chrome extension that downloads posts, videos, and long articles from X, then sends them to WeChat Official Account drafts. It is a tool I use every day.</p>
    <div class="skill-foot">
      <span class="skill-chip">Chrome Extension</span>
      <div class="skill-controls">
        <a class="skill-zip" :href="storeUrl" target="_blank" rel="noopener">Install from the Chrome Web Store →</a>
      </div>
    </div>
  </article>
  <article class="project-tile">
    <a class="skill-thumb" href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">
      <img :src="bingImg" alt="Bing Wallpaper for Mac: the Bing daily photo as your desktop, automatically" width="800" height="450" loading="lazy" decoding="async" />
    </a>
    <h3><a href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">Bing Wallpaper for Mac</a></h3>
    <p class="skill-pitch">An open-source app: the behavior of the official Windows Bing Wallpaper, reverse-engineered with REA and rebuilt natively in Swift for macOS. Lives in the menu bar and sets the Bing daily photo as your desktop every day. MIT, free.</p>
    <div class="skill-foot">
      <span class="skill-chip">macOS app · Open source</span>
      <div class="skill-controls">
        <a class="skill-zip" href="/en/ai/products/bing-wallpaper-for-mac">Read the intro →</a>
        <a class="skill-zip" href="https://github.com/fairzy/bingwallpaper-for-mac" target="_blank" rel="noopener">GitHub →</a>
      </div>
    </div>
  </article>
</div>
