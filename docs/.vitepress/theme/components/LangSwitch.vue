<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import pairList from '../../i18n-pairs.json'
import { useBarePath } from '../useLocale'

const pairs = new Set(pairList)
const barePath = useBarePath()

const current = computed(() => normalizeRoute(barePath.value))

function normalizeRoute(path: string): { english: boolean; slug: string } {
  const trimmed = (path || '/').replace(/\/$/, '') || '/'
  const english = trimmed === '/en' || trimmed.startsWith('/en/')
  const bare = english ? (trimmed === '/en' ? '/' : trimmed.slice('/en'.length)) : trimmed
  if (bare === '/') return { english, slug: '' }
  return { english, slug: bare.replace(/^\//, '') }
}

function hrefFor(english: boolean): string {
  const slug = pairs.has(current.value.slug) ? current.value.slug : ''
  if (english) return withBase(slug ? `/en/${slug}` : '/en/')
  return withBase(slug ? `/${slug}` : '/')
}
</script>

<template>
  <nav class="lang-switch" aria-label="Language">
    <a
      :href="hrefFor(false)"
      :class="{ active: !current.english }"
      :aria-current="current.english ? undefined : 'page'"
    >中</a>
    <span class="sep" aria-hidden="true">/</span>
    <a
      :href="hrefFor(true)"
      :class="{ active: current.english }"
      :aria-current="current.english ? 'page' : undefined"
    >EN</a>
  </nav>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 0;
  margin-right: 4px;
  font-size: 13px;
  font-weight: 650;
  line-height: 1;
  white-space: nowrap;
}
.lang-switch a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}
.lang-switch a.active {
  color: var(--vp-c-brand-1);
}
.lang-switch .sep {
  color: var(--vp-c-text-3);
  font-weight: 500;
}
</style>
