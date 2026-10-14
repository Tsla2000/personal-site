---
title: 订阅更新
description: 收藏本站，文章有更新时回访会收到提醒；也可以用 RSS 订阅。
noindex: true
comments: false
---

<script setup>
function copyRss() {
  const url = 'https://promangofund.com/feed.xml'
  try {
    navigator.clipboard.writeText(url).then(() => {
      const el = document.getElementById('rss-copied')
      if (el) el.style.display = 'inline'
    })
  } catch {}
}
</script>

# 订阅更新

<FollowButton />

## RSS 订阅

习惯用 RSS 阅读器的话，订阅这个地址：

`https://promangofund.com/feed.xml` <button class="rss-copy" @click="copyRss">复制</button> <span id="rss-copied" style="display:none;font-size:12px;color:var(--vp-c-brand-1)">已复制</span>

## 浏览器收藏夹

也可以按 <kbd>Ctrl</kbd>+<kbd>D</kbd>（Mac 上是 <kbd>Cmd</kbd>+<kbd>D</kbd>）把本站加入浏览器收藏夹。

<style scoped>
.rss-copy {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.rss-copy:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
kbd {
  font-size: 12px;
  padding: 2px 6px;
  border: 1px solid var(--vp-c-border);
  border-bottom-width: 2px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
</style>
