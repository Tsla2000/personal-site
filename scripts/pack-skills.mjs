import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildStoredZip, readStoredZip } from './skill-zip.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_SKILLS = join(ROOT, 'docs', 'public', 'skills')
const SOURCE_ROOT = join(PUBLIC_SKILLS, 'sources')
const ZIP_ROOT = join(PUBLIC_SKILLS, 'zips')
const MANIFEST_PATH = join(ROOT, 'docs', '.vitepress', 'theme', 'data', 'skill-packages.json')
const MIN_SKILL_CHARS = 800

const REQUIRED_PHRASES = {
  'de-ai-writing': ['永远读最新版', '风格档案优先', '最小改动'],
  'ai-ui-design': ['禁止裸 HEX', 'tokens.css'],
  'diagram-design': ['#f8f8f5', '#26332d', '#355c4b'],
  anatomy: ['Node 20.10+', 'diagram-design'],
  cover_image_gen: ['quality 92', '黄底高亮'],
  custom_connector_setup: ['密钥不进文件/日志', '已审核工具']
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
if (!Array.isArray(manifest) || manifest.length !== 6) {
  throw new Error('技能包清单必须正好包含 6 个技能')
}

mkdirSync(ZIP_ROOT, { recursive: true })

for (const item of manifest) {
  const packageDir = join(SOURCE_ROOT, item.dir)
  const skillPath = join(packageDir, 'SKILL.md')
  const readmePath = join(packageDir, 'README.md')
  if (!existsSync(skillPath)) throw new Error(`缺少 ${skillPath}`)
  if (!existsSync(readmePath)) throw new Error(`缺少 ${readmePath}`)
  if (item.promptPath !== `/skills/sources/${item.dir}/SKILL.md`) {
    throw new Error(`${item.id} 的 promptPath 与目录不一致`)
  }
  if (item.zipPath !== `/skills/zips/${item.zipFile}`) {
    throw new Error(`${item.id} 的 zipPath 与文件名不一致`)
  }

  const skillText = readFileSync(skillPath, 'utf8')
  if (!skillText.startsWith('---\n') || !skillText.includes(`name: ${item.id}`) || skillText.length < MIN_SKILL_CHARS) {
    throw new Error(`${item.id} 的 SKILL.md 不是可安装的完整技能正文`)
  }
  for (const phrase of REQUIRED_PHRASES[item.id] || []) {
    if (!skillText.includes(phrase)) throw new Error(`${item.id} 的 SKILL.md 缺少「${phrase}」`)
  }

  const readmeText = readFileSync(readmePath, 'utf8')
  const zip = buildStoredZip([
    { name: `${item.dir}/SKILL.md`, data: skillText },
    { name: `${item.dir}/README.md`, data: readmeText }
  ])
  const packed = readStoredZip(zip)
  const packedSkill = packed.find((entry) => entry.name === `${item.dir}/SKILL.md`)
  const packedReadme = packed.find((entry) => entry.name === `${item.dir}/README.md`)
  if (!packedSkill || packedSkill.data.toString('utf8') !== skillText) {
    throw new Error(`${item.zipFile} 里的 SKILL.md 与源文件不一致`)
  }
  if (!packedReadme || packedReadme.data.toString('utf8') !== readmeText) {
    throw new Error(`${item.zipFile} 里的 README.md 与源文件不一致`)
  }
  writeFileSync(join(ZIP_ROOT, item.zipFile), zip)
  console.log(`packed ${item.zipFile} (${zip.length} bytes)`)
}
