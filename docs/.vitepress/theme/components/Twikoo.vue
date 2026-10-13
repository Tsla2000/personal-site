<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// Twikoo 后端地址，部署完成后填入（包含 https:// 前缀）
const ENVID = '__TWIKOO_ENVID__'

const { page } = useData()
const route = useRoute()
const container = ref<HTMLElement | null>(null)
let stopWatch: (() => void) | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let twikoo: any = null

// markdown 里 <Twikoo force /> 显式放置时不受 frontmatter 影响
const props = withDefaults(defineProps<{ force?: boolean }>(), { force: false })

// 留言板页用 frontmatter: comments=false 关掉自动注入的那份，避免重复
const show = computed(() => {
  if (props.force) return true
  try {
    return (page.value.frontmatter as Record<string, unknown>)?.comments !== false
  } catch {
    return true
  }
})

async function load(): Promise<void> {
  const el = container.value
  if (!el || typeof document === 'undefined') return
  if (!twikoo) {
    // twikoo 是纯浏览器 UMD 包，只能在客户端动态加载
    const mod = await import('twikoo')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twikoo = (mod as any).default || mod
  }
  el.innerHTML = ''
  twikoo.init({
    envId: ENVID,
    el,
    lang: 'zh-CN'
  })
}

onMounted(() => {
  void load()
  stopWatch = watch(() => route.path, () => void load())
})

onBeforeUnmount(() => {
  if (stopWatch) stopWatch()
})
</script>

<template>
  <div v-if="show" class="twikoo-block">
    <h2 class="twikoo-heading">评论</h2>
    <p class="twikoo-desc">无需登录，匿名即可留言（昵称自动生成，显示 IP 属地）</p>
    <div ref="container" class="twikoo-container"></div>
  </div>
</template>

<style scoped>
.twikoo-block {
  margin: 40px 0 8px;
}
.twikoo-block .twikoo-heading {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  padding: 0;
  border: none;
}
.twikoo-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}
.twikoo-container {
  min-height: 120px;
}
</style>
