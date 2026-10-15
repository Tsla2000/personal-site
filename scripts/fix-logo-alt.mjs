// 构建后修复：VitePress 默认主题渲染导航栏 logo 时不带 alt 文字，
// Bing 会把全站每个页面的 logo 报成"缺少图像 Alt 属性"。
// 本脚本在 vitepress build 之后遍历 dist HTML，给 logo img 补上 alt。
// 用法：node scripts/fix-logo-alt.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = new URL('../docs/.vitepress/dist/', import.meta.url).pathname
const ALT = 'PRO的茶里芒果'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p, []))
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

let fixed = 0
for (const p of walk(DIST)) {
  const html = readFileSync(p, 'utf8')
  // 只处理导航栏 logo（class 含 VPImage logo），把空 alt（alt 或 alt=""）换成描述文字；
  // 已有实质 alt 的不动
  const next = html.replace(
    /<img(?=[^>]*class="VPImage logo")[^>]*>/g,
    (tag) => tag.replace(/\salt(?="")?(?=[\s>])/, ` alt="${ALT}"`)
  )
  if (next !== html) {
    writeFileSync(p, next)
    fixed++
  }
}
console.log(`[fix-logo-alt] ${fixed} 个页面补了 logo alt`)
