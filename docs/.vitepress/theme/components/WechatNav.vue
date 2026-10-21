<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const open = ref(false)
const banner = withBase('/images/wechat-search-banner-v.jpg')
</script>

<template>
  <div class="wechat-nav" @mouseenter="open = true" @mouseleave="open = false">
    <button
      class="wechat-nav-btn"
      type="button"
      aria-label="微信公众号：PRO的茶里芒果"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>
    </button>
    <div class="wechat-nav-pop" :class="{ show: open }">
      <img :src="banner" alt="微信搜一搜 PRO的茶里芒果" width="400" height="800" />
    </div>
  </div>
</template>

<style scoped>
.wechat-nav {
  position: relative;
  display: flex;
  align-items: center;
}
.wechat-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}
.wechat-nav-btn:hover {
  color: #07c160;
}
.wechat-nav-pop {
  position: absolute;
  top: 100%;
  right: -10px;
  padding-top: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
  z-index: 100;
}
.wechat-nav-pop.show {
  opacity: 1;
  visibility: visible;
  transform: none;
}
.wechat-nav-pop img {
  display: block;
  width: 400px;
  height: auto;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}
</style>
