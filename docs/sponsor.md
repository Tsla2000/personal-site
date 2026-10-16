---
title: 请我喝杯咖啡
description: 如果本站的内容对你有帮助，欢迎请我喝杯咖啡，你的支持是我持续创作的动力。
noindex: true
comments: false
---

<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'

const selectedMethod = ref('wechat')
const paypalSponsorUrl = 'https://www.paypal.com/ncp/payment/Y7FQDYNC3MP2L'
const wechatPaySrc = withBase('/images/sponsor-wechat-qr.png')
const alipaySrc = withBase('/images/sponsor-alipay-qr.png')

const paymentMethods = [
  { id: 'wechat', label: '微信支付' },
  { id: 'alipay', label: '支付宝' },
  { id: 'paypal', label: 'PayPal' },
]

function selectMethod(methodId) {
  selectedMethod.value = methodId
}
</script>

<div class="sponsor-hero">
  <div class="sponsor-emoji">☕</div>
  <h1>请我喝杯咖啡</h1>
  <p class="sponsor-sub">每一杯咖啡，都是对独立创作的支持</p>
</div>

<p class="qr-lead">用微信或支付宝扫码，或点 PayPal 链接赞助。</p>

<div class="pay-switch-wrap">
  <div class="pay-switch" role="tablist" aria-label="赞助方式">
    <button
      v-for="paymentMethod in paymentMethods"
      :key="paymentMethod.id"
      type="button"
      role="tab"
      class="pay-switch-btn"
      :id="'pay-tab-' + paymentMethod.id"
      :class="{ active: selectedMethod === paymentMethod.id }"
      :aria-selected="selectedMethod === paymentMethod.id"
      @click="selectMethod(paymentMethod.id)"
    >
      {{ paymentMethod.label }}
    </button>
  </div>
</div>

<div
  v-if="selectedMethod !== 'paypal'"
  class="qr-grid"
  role="tabpanel"
  :aria-labelledby="selectedMethod === 'alipay' ? 'pay-tab-alipay' : 'pay-tab-wechat'"
>
  <figure class="qr-card" :class="{ active: selectedMethod === 'wechat' }">
    <figcaption>微信支付</figcaption>
    <img
      :src="wechatPaySrc"
      alt="微信支付收款码"
      width="600"
      height="600"
    />
  </figure>
  <figure class="qr-card" :class="{ active: selectedMethod === 'alipay' }">
    <figcaption>支付宝</figcaption>
    <img
      :src="alipaySrc"
      alt="支付宝收款码"
      width="720"
      height="720"
    />
  </figure>
</div>

<div
  v-else
  class="paypal-panel"
  role="tabpanel"
  aria-labelledby="pay-tab-paypal"
>
  <a
    class="paypal-btn"
    :href="paypalSponsorUrl"
    target="_blank"
    rel="noopener noreferrer"
  >用 PayPal 赞助</a>
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
.qr-lead {
  margin: 8px 0 16px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  text-align: center;
}
.pay-switch-wrap {
  display: flex;
  justify-content: center;
  margin: 0 0 20px;
}
.pay-switch {
  display: inline-flex;
  gap: 4px;
  max-width: 100%;
  padding: 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}
.pay-switch-btn {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.pay-switch-btn:hover {
  color: var(--vp-c-text-1);
}
.pay-switch-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.pay-switch-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.qr-grid {
  --qr-size: 200px;
  display: grid;
  grid-template-columns: repeat(2, var(--qr-size));
  justify-content: center;
  gap: 28px;
  align-items: start;
  margin: 0 0 8px;
}
.qr-card {
  margin: 0;
  min-width: 0;
}
.qr-card img {
  display: block;
  width: var(--qr-size);
  height: auto;
  border-radius: 12px;
}
.qr-card.active img {
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}
.qr-card figcaption {
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-style: normal;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 1.4;
  text-align: center;
}
.qr-card.active figcaption {
  color: var(--vp-c-brand-1);
}
.paypal-panel {
  display: flex;
  justify-content: center;
  margin: 8px 0 16px;
}
.paypal-btn,
.paypal-btn:hover {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 12px 28px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
}
.paypal-btn:hover {
  background: var(--vp-c-brand-soft);
}
.paypal-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
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
  .pay-switch-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  .qr-grid {
    grid-template-columns: var(--qr-size);
    gap: 20px;
  }
}
</style>
