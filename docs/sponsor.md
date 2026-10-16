---
title: 请我喝杯咖啡
description: 如果本站的内容对你有帮助，欢迎请我喝杯咖啡，你的支持是我持续创作的动力。
noindex: true
comments: false
---

<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

const PAYPAL_ME_PROFILE_URL = 'https://paypal.me/promangofund'
const paypalPresetAmounts = [3, 6, 9]

const selectedMethod = ref('wechat')
const customPaypalAmount = ref('')
const customPaypalLink = ref(null)
const wechatPaySrc = withBase('/images/sponsor-wechat-qr.png')
const alipaySrc = withBase('/images/sponsor-alipay-qr.png')

const paymentMethods = [
  { id: 'wechat', label: '微信支付' },
  { id: 'alipay', label: '支付宝' },
  { id: 'paypal', label: 'PayPal' },
]

const customPaypalHref = computed(() => paypalMeUrl(customPaypalAmount.value))

function selectMethod(methodId) {
  selectedMethod.value = methodId
}

function paypalPresetUrl(amount) {
  return `${PAYPAL_ME_PROFILE_URL}/${amount}USD`
}

function paypalMeUrl(rawAmount) {
  const amount = normalizePaypalAmount(rawAmount)
  if (!amount) return PAYPAL_ME_PROFILE_URL
  return `${PAYPAL_ME_PROFILE_URL}/${amount}USD`
}

function normalizePaypalAmount(rawAmount) {
  const trimmed = String(rawAmount ?? '').trim()
  if (!/^\d{1,7}(\.\d*)?$/.test(trimmed)) return ''
  const numericAmount = Number(trimmed)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return ''
  const cents = Math.round(numericAmount * 100)
  if (cents <= 0) return ''
  const wholeDollars = Math.floor(cents / 100)
  const remainderCents = cents % 100
  if (remainderCents === 0) return String(wholeDollars)
  return `${wholeDollars}.${String(remainderCents).padStart(2, '0')}`
}

function openCustomPaypal() {
  customPaypalLink.value?.click()
}
</script>

<div class="sponsor-hero">
  <div class="sponsor-emoji">☕</div>
  <h1>请我喝杯咖啡</h1>
  <p class="sponsor-sub">每一杯咖啡，都是对独立创作的支持</p>
</div>

<p class="qr-lead">用微信或支付宝扫码，或用 PayPal 选择金额赞助。</p>

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

<figure
  v-if="selectedMethod === 'wechat'"
  class="qr-card"
  role="tabpanel"
  aria-labelledby="pay-tab-wechat"
>
  <figcaption>微信支付</figcaption>
  <img
    :src="wechatPaySrc"
    alt="微信支付收款码"
    width="600"
    height="600"
  />
</figure>

<figure
  v-else-if="selectedMethod === 'alipay'"
  class="qr-card"
  role="tabpanel"
  aria-labelledby="pay-tab-alipay"
>
  <figcaption>支付宝</figcaption>
  <img
    :src="alipaySrc"
    alt="支付宝收款码"
    width="720"
    height="720"
  />
</figure>

<div
  v-else
  class="paypal-panel"
  role="tabpanel"
  aria-labelledby="pay-tab-paypal"
>
  <p class="paypal-note">点金额直接打开 PayPal。自定义金额留空时，在 PayPal 页面自行填写。</p>
  <div class="amount-grid">
    <a
      v-for="amount in paypalPresetAmounts"
      :key="amount"
      class="amount-btn"
      :href="paypalPresetUrl(amount)"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="amount-num">${{ amount }}</span>
    </a>
  </div>
  <div class="custom-amount">
    <input
      v-model="customPaypalAmount"
      type="number"
      min="0.01"
      step="0.01"
      inputmode="decimal"
      placeholder="自定义金额（USD）"
      aria-label="自定义 PayPal 金额（美元）"
      @keyup.enter="openCustomPaypal"
    />
    <a
      ref="customPaypalLink"
      class="paypal-go"
      :href="customPaypalHref"
      target="_blank"
      rel="noopener noreferrer"
    >跳转</a>
  </div>
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
.qr-card {
  --qr-size: 200px;
  width: var(--qr-size);
  margin: 0 auto 8px;
}
.qr-card img {
  display: block;
  width: var(--qr-size);
  height: auto;
  border-radius: 12px;
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
.paypal-panel {
  max-width: 420px;
  margin: 0 auto 16px;
}
.paypal-note {
  margin: 0 0 14px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
}
.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0 0 12px;
}
.amount-btn {
  padding: 16px 8px;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.amount-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.amount-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.amount-num {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}
.custom-amount {
  display: flex;
  gap: 8px;
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
.paypal-go,
.paypal-go:hover {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
}
.paypal-go:focus-visible {
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
}
</style>
