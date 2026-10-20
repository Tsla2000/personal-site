---
title: UTM 链接生成
description: 站长工具：生成带渠道参数的站外链接。
noindex: true
comments: false
---

<script setup>
import { ref, computed } from 'vue'
const source = ref('wechat')
const medium = ref('footer')
const target = ref('https://promangofund.com/')
const campaign = ref('')
const copied = ref(false)
const clean = (s) => s.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
const link = computed(() => {
  try {
    const u = new URL(target.value.trim())
    const slug = campaign.value.trim() || u.pathname.split('/').filter(Boolean).pop()?.replace(/\.html$/, '') || 'home'
    u.searchParams.set('utm_source', source.value)
    u.searchParams.set('utm_medium', clean(medium.value) || 'link')
    u.searchParams.set('utm_campaign', clean(slug))
    return u.toString()
  } catch {
    return ''
  }
})
function copy() {
  if (!link.value) return
  navigator.clipboard.writeText(link.value).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  })
}
</script>

# UTM 链接生成

粘贴文章链接，选渠道和位置，复制带参数的链接。`campaign` 留空时取文章 slug。

<p><label>渠道
<select v-model="source">
  <option value="wechat">wechat（公众号）</option>
  <option value="x">x</option>
  <option value="github">github</option>
  <option value="other">other</option>
</select></label></p>

<p><label>位置 <input v-model="medium" placeholder="footer / top / reply" /></label></p>

<p><label>文章链接 <input v-model="target" style="width:100%" /></label></p>

<p><label>campaign（可选） <input v-model="campaign" placeholder="默认取文章 slug" /></label></p>

<p><code style="word-break:break-all">{{ link || '链接格式不对' }}</code></p>

<button @click="copy">{{ copied ? '已复制' : '复制链接' }}</button>

微信文末也可以直接用短链：`https://promangofund.com/wx/<文章路径>`，自动带 `utm_source=wechat&utm_medium=short`。X 同理用 `/x/…`。
