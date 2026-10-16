---
title: 请我喝杯咖啡
description: 如果本站的内容对你有帮助，欢迎请我喝杯咖啡，你的支持是我持续创作的动力。
noindex: true
comments: false
---

<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'

const amounts = [18, 36, 66, 188]
const selected = ref(36)
const customAmount = ref('')
const wechatPaySrc = withBase('/images/wechat-pay.png')
const alipaySrc = withBase('/images/alipay.png')

function selectAmount(n) {
  selected.value = n
  customAmount.value = ''
}

function useCustom() {
  const v = parseInt(customAmount.value, 10)
  if (v > 0) {
    selected.value = v
  }
}
</script>

<div class="sponsor-hero">
  <div class="sponsor-emoji">☕</div>
  <h1>请我喝杯咖啡</h1>
  <p class="sponsor-sub">每一杯咖啡，都是对独立创作的支持</p>
</div>

<p class="qr-lead">用微信或支付宝扫下面的码。金额在付款页填写，也可以先选一个参考金额。</p>

<div class="qr-grid">
  <figure class="qr-card">
    <figcaption>微信支付</figcaption>
    <img
      :src="wechatPaySrc"
      alt="微信支付收款码"
      width="1206"
      height="1638"
    />
  </figure>
  <figure class="qr-card">
    <figcaption>支付宝</figcaption>
    <img
      :src="alipaySrc"
      alt="支付宝收款码"
      width="1206"
      height="1808"
    />
  </figure>
</div>

## 选择金额

<p class="amount-note">扫码后输入 <strong>¥{{ selected }}</strong>。</p>

<div class="amount-grid">
  <button
    v-for="n in amounts"
    :key="n"
    class="amount-btn"
    :class="{ active: selected === n && !customAmount }"
    @click="selectAmount(n)"
  >
    <span class="amount-num">¥{{ n }}</span>
    <span class="amount-label">{{ n >= 100 ? '豪华大杯' : n >= 50 ? '大杯' : '中杯' }}</span>
  </button>
</div>

<div class="custom-amount">
  <input
    v-model="customAmount"
    type="number"
    min="1"
    inputmode="numeric"
    placeholder="自定义金额"
    @keyup.enter="useCustom"
  />
  <button type="button" @click="useCustom">确定</button>
</div>

## 为什么赞助

本站所有内容免费开放。你的赞助将用于：

- 服务器和域名费用
- 持续产出 AI、投资、产品方向的深度内容
- 开发更多像 Xmade 这样的实用工具

## 关于我

独立创作者，关注 AI、投资与产品。运营微信公众号「PRO的茶里芒果」，维护这个个人网站，开发 Chrome 扩展 Xmade。

---

<style scoped>
.sponsor-hero {
  text-align: center;
  padding: 28px 0 4px;
}
.sponsor-emoji {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 16px;
}
.sponsor-hero h1 {
  font-size: 32px;
  margin: 0 0 12px;
}
.sponsor-sub {
  color: var(--vp-c-text-2);
  font-size: 16px;
  margin-bottom: 0;
}
.amount-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 0 0 16px;
}
.amount-btn {
  padding: 20px 12px;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.15s ease;
}
.amount-btn:hover {
  border-color: var(--vp-c-brand-1);
}
.amount-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.amount-num {
  font-size: 24px;
  font-weight: 700;
}
.amount-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.custom-amount {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.custom-amount input {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 15px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.custom-amount button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.qr-lead,
.amount-note {
  margin: 8px 0 16px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  text-align: center;
}
.amount-note {
  margin-top: 0;
}
.qr-lead strong,
.amount-note strong {
  color: var(--vp-c-text-1);
}
.qr-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
  margin: 0 0 8px;
}
.qr-card {
  margin: 0;
  min-width: 0;
  padding: 10px 10px 14px;
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
}
.qr-card img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
}
.qr-card figcaption {
  margin: 2px 0 10px;
  color: #26332d;
  font-size: 15px;
  font-style: normal;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 1.4;
  text-align: center;
}
@media (max-width: 640px) {
  .sponsor-hero {
    padding-top: 8px;
  }
  .sponsor-emoji {
    font-size: 48px;
    margin-bottom: 8px;
  }
  .sponsor-hero h1 {
    font-size: 28px;
    margin-bottom: 8px;
  }
  .qr-lead {
    margin-bottom: 10px;
  }
  .amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .qr-grid {
    grid-template-columns: minmax(0, 360px);
    justify-content: center;
    gap: 16px;
  }
  .qr-card {
    padding: 8px 8px 10px;
  }
  .qr-card figcaption {
    margin: 2px 0 8px;
  }
}
</style>
