---
title: 思考
description: 一些无法在短期内验证、但值得长期追踪的问题:稀缺性、财富、技术与社会。
layout: page
sidebar: false
pageClass: archive-discover
---

<script setup>
import { ref } from 'vue'
// 子栏目筛选:'all' 或子目录名;卡片和标签的绑定由 scripts/gen-seo.mjs 生成
const filter = ref('all')
</script>

<div class="archive-page">
<header class="archive-header">
<h1>思考</h1>
<p>一些无法在短期内验证、但值得长期追踪的问题。不追求结论，更在意把问题问准。</p>
</header>
<div class="archive-layout is-single">
<div class="archive-main">

<!-- THINKING-FEED-START:以下由 scripts/gen-seo.mjs 构建时自动生成,勿手工改 -->
<div class="archive-tabs" role="group" aria-label="按分类筛选"><button type="button" class="archive-tab" :aria-pressed="filter === 'all'" @click="filter = 'all'">全部<span>4</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'society'" @click="filter = 'society'">社会<span>1</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'first-principles'" @click="filter = 'first-principles'">第一性原理<span>1</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'wealth'" @click="filter = 'wealth'">财富<span>1</span></button><button type="button" class="archive-tab" :aria-pressed="filter === 'life'" @click="filter = 'life'">生活<span>1</span></button></div>
<div class="feed-list">
<a class="feed-row" href="/thinking/life/global-living-system" data-cat="life" v-show="filter === 'all' || filter === 'life'"><div class="feed-row-head"><strong>别急着移民：未来十年，如何设计自己的全球生活系统</strong><span class="feed-row-date"> · <time datetime="2026-10-18">2026.10.18</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/global-living/cover.jpg" alt="别急着移民：未来十年，如何设计自己的全球生活系统" loading="eager" fetchpriority="high" decoding="async" /></div><p>从身份、收入到资产、居住、医疗养老与家庭安排，建立一套能计算成本、能够调整、也允许退出的长期方案。</p></div></a>
<a class="feed-row" href="/thinking/society/ai-labor-capital" data-cat="society" v-show="filter === 'all' || filter === 'society'"><div class="feed-row-head"><strong>AI 技术终将造福每个人吗？</strong><span class="feed-row-date"> · <time datetime="2026-10-06">2026.10.06</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/labor-dilution.webp" alt="AI 技术终将造福每个人吗？" loading="lazy" decoding="async" /></div><p>AI 真正摧毁的不是工作，而是劳动的稀缺性；资本的产权毫发无伤，但超额利润正在被夷平。</p></div></a>
<a class="feed-row" href="/thinking/first-principles/scarcity" data-cat="first-principles" v-show="filter === 'all' || filter === 'first-principles'"><div class="feed-row-head"><strong>当智能可以无限复制，什么才是真正稀缺？</strong><span class="feed-row-date"> · <time datetime="2026-10-05">2026.10.05</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/scarcity-four.png" alt="当智能可以无限复制，什么才是真正稀缺？" loading="lazy" decoding="async" /></div><p>当智能的边际成本不断下降，稀缺性会迁移到哪里？</p></div></a>
<a class="feed-row" href="/thinking/wealth/first-principles" data-cat="wealth" v-show="filter === 'all' || filter === 'wealth'"><div class="feed-row-head"><strong>财富的第一性原理是什么？</strong><span class="feed-row-date"> · <time datetime="2026-09-10">2026.09.10</time></span></div><div class="feed-row-body"><div class="feed-row-thumb"><img class="archive-card-img" src="/images/wealth-option.webp" alt="财富的第一性原理是什么？" loading="lazy" decoding="async" /></div><p>财富不是数字的堆积，而是对未来资源调度能力的储存。</p></div></a>
</div>
<!-- THINKING-FEED-END -->

</div>
</div>
</div>
