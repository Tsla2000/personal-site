---
title: 请我喝杯咖啡
description: 如果本站的内容对你有帮助，欢迎请我喝杯咖啡，你的支持是我持续创作的动力。
noindex: true
comments: false
---

<script setup>
import { ref } from 'vue'

const amounts = [18, 36, 66, 188]
const selected = ref(36)
const customAmount = ref('')
const showQR = ref(false)

function selectAmount(n) {
  selected.value = n
  customAmount.value = ''
  showQR.value = true
}

function useCustom() {
  const v = parseInt(customAmount.value, 10)
  if (v > 0) {
    selected.value = v
    showQR.value = true
  }
}
</script>

<div class="sponsor-hero">
  <div class="sponsor-emoji">☕</div>
  <h1>请我喝杯咖啡</h1>
  <p class="sponsor-sub">每一杯咖啡，都是对独立创作的支持</p>
</div>

## 选择金额

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
    placeholder="自定义金额"
    @keyup.enter="useCustom"
  />
  <button @click="useCustom">确定</button>
</div>

<div v-if="showQR" class="qr-section">
  <p class="qr-amount">赞助金额：<strong>¥{{ selected }}</strong></p>
  <p class="qr-tip">请使用微信或支付宝扫码赞助（二维码待补充）</p>
  <div class="qr-placeholder">
    <span>赞助二维码<br/>即将上线</span>
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
  padding: 48px 0 32px;
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
}
.amount-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 24px 0;
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
  margin-bottom: 24px;
}
.custom-amount input {
  flex: 1;
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
.qr-section {
  text-align: center;
  padding: 24px;
  border: 1px dashed var(--vp-c-border);
  border-radius: 12px;
  margin: 24px 0;
}
.qr-amount {
  font-size: 18px;
  margin-bottom: 8px;
}
.qr-tip {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 16px;
}
.qr-placeholder {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border: 2px dashed var(--vp-c-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
  text-align: center;
}
@media (max-width: 640px) {
  .amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
