---
title: Projects
description: Products on this site. XMade is a Chrome extension for saving posts from X.
---

<script setup>
import { withBase } from 'vitepress'
const xmadeImg = withBase('/images/projects/xmade.jpg')
const storeUrl = 'https://chromewebstore.google.com/detail/xmade-twitter-video-downl/bgopfpaklpnjmjbngflljdnjnblhnbjm'
</script>

# Projects

<div class="project-list">
  <article class="skill-tile">
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
</div>
