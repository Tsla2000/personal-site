// 构建后补图：给 dist HTML 里本地 /images/ 的 <img> 补 width/height，
// 让浏览器在图片加载前预留位置，降低 CLS（claude-seo 技术审计项）。
// 已有 width 或 height 的不动；读不出尺寸的跳过。
// 用法：node scripts/fix-img-dims.mjs
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../docs/.vitepress/dist/', import.meta.url))
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p, []))
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

function sizeOf(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
  if (buf.length > 10 && buf.toString('ascii', 0, 3) === 'GIF') return [buf.readUInt16LE(6), buf.readUInt16LE(8)]
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buf.toString('ascii', 12, 16)
    if (kind === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)]
    if (kind === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
    if (kind === 'VP8L') {
      const b = buf.readUInt32LE(21)
      return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]
    }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue }
      const m = buf[i + 1]
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]
      i += 2 + buf.readUInt16BE(i + 2)
    }
  }
  return null
}

const cache = new Map()
function dims(src) {
  if (cache.has(src)) return cache.get(src)
  const rel = src.slice(BASE.length).split(/[?#]/)[0]
  const file = join(DIST, decodeURIComponent(rel))
  let d = null
  if (existsSync(file)) {
    try { d = sizeOf(readFileSync(file)) } catch { d = null }
  }
  cache.set(src, d)
  return d
}

let pages = 0, imgs = 0
for (const p of walk(DIST)) {
  const html = readFileSync(p, 'utf8')
  const next = html.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\s(?:width|height)=/.test(tag)) return tag
    const m = tag.match(/\ssrc="([^"]+)"/)
    if (!m || !m[1].startsWith(`${BASE}/images/`)) return tag
    const d = dims(m[1])
    if (!d || !d[0] || !d[1]) return tag
    imgs++
    return tag.replace(/<img\b/, `<img width="${d[0]}" height="${d[1]}"`)
  })
  if (next !== html) {
    writeFileSync(p, next)
    pages++
  }
}
console.log(`[fix-img-dims] ${pages} 个页面、${imgs} 张图补了宽高`)
