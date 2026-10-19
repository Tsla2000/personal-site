// VitePress 1.6.4 用 /${locale}/ 正则判断语言，英文首页 en/index.md
// 规范化后只剩 /en，匹配失败，客户端会把 /en/ 当成中文。
// 补上对 /${locale}/index.md 的判断，英文首页才会用 en locale。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const FILES = [
  join(ROOT, 'node_modules/vitepress/dist/client/shared.js')
]

const NEEDLE = 'isActive(relativePath, `/${key}/`, true)) || \'root\''
const PATCHED = '(isActive(relativePath, `/${key}/`, true) || isActive(relativePath, `/${key}/index.md`))) || \'root\''

let changed = false
for (const file of FILES) {
  const src = readFileSync(file, 'utf8')
  if (src.includes(PATCHED)) continue
  if (!src.includes(NEEDLE)) {
    console.error(`[patch-vitepress-locale] 未找到预期代码，VitePress 版本可能已变: ${file}`)
    process.exit(1)
  }
  writeFileSync(file, src.replace(NEEDLE, PATCHED))
  changed = true
  console.log(`[patch-vitepress-locale] 已修补 ${file}`)
}
if (!changed) console.log('[patch-vitepress-locale] 已是修补后的版本')
