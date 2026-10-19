import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_SKILLS = join(ROOT, 'docs', 'public', 'skills')
const SOURCE_ROOT = join(PUBLIC_SKILLS, 'sources')
const ZIP_ROOT = join(PUBLIC_SKILLS, 'zips')
const MANIFEST_PATH = join(ROOT, 'docs', '.vitepress', 'theme', 'data', 'skill-packages.json')

const REQUIRED_PHRASES = {
  'de-ai-writing': ['永远读最新版', 'name: 去AI味写作'],
  'ai-ui-design': ['禁止出现裸 HEX', 'name: AI界面设计规范'],
  'diagram-design': ['Forty-five visual types', 'name: diagram-design'],
  anatomy: ['Node.js 20.10+', 'name: anatomy'],
  cover_image_gen: ['quality=92', '黄底高亮', 'name: cover_image_gen'],
  custom_connector_setup: ['Never store a secret', 'name: custom_connector_setup'],
  'personal-site-build': ['name: 个人网站搭建', '飞书'],
  'frontend-design': ['name: frontend-design', 'LICENSE.txt'],
  'ui-design-refs': ['name: UI设计参考清单', 'ui-catalog.md'],
  'haiwai-new-keyword-launch': ['name: 出海新词上站', 'Google Trends 词根法'],
  'haiwai-monetize-convert': ['name: 出海变现转化', '假生成'],
  'ai-project-delivery': ['name: AI 项目交付', '可追踪的工程流程'],
  'writing-skills': ['改编自 obra/superpowers（MIT License），原作者 Jesse Vincent', 'name: 技能编写'],
  brainstorming: ['改编自 obra/superpowers（MIT License），原作者 Jesse Vincent', 'name: 头脑风暴'],
  'systematic-debugging': ['改编自 obra/superpowers（MIT License），原作者 Jesse Vincent', 'name: 系统化排查'],
  'verification-before-completion': ['改编自 obra/superpowers（MIT License），原作者 Jesse Vincent', 'name: 交付前验证'],
  'writing-plans': ['改编自 obra/superpowers（MIT License），原作者 Jesse Vincent', 'name: 写计划']
}

const MIN_ZIP_BYTES = {
  'de-ai-writing.zip': 20000,
  'ai-ui-design.zip': 10000,
  'diagram-design.zip': 200000,
  'anatomy.zip': 100000,
  'cover-image-gen.zip': 2000,
  'custom-connector-setup.zip': 20000,
  'personal-site-build.zip': 6000,
  'frontend-design.zip': 7000,
  'ui-design-refs.zip': 4500,
  'haiwai-new-keyword-launch.zip': 4000,
  'haiwai-monetize-convert.zip': 4000,
  'ai-project-delivery.zip': 4000,
  'writing-skills.zip': 2000,
  'brainstorming.zip': 2000,
  'systematic-debugging.zip': 2000,
  'verification-before-completion.zip': 2000,
  'writing-plans.zip': 2000,
  'website-launch-check.zip': 1000,
  'content-repurpose.zip': 1000,
  'browser-automation.zip': 1000,
  'data-analysis.zip': 1000
}

const MINIMUM_PACKAGE_COUNT = 6
const packages = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
const manifest = packages
if (!Array.isArray(packages) || packages.length < MINIMUM_PACKAGE_COUNT || manifest.length !== packages.length) {
  const actualCount = Array.isArray(packages) ? packages.length : 0
  throw new Error(`技能包清单必须与 packages 等长，且至少 ${MINIMUM_PACKAGE_COUNT} 个，当前是 ${actualCount} 个`)
}

mkdirSync(ZIP_ROOT, { recursive: true })

for (const item of manifest) {
  const skillPath = join(SOURCE_ROOT, item.dir, 'SKILL.md')
  const zipPath = join(ZIP_ROOT, item.zipFile)
  if (!existsSync(skillPath)) throw new Error(`缺少 ${skillPath}`)
  // New first-party skills can be packaged during build; existing reviewed ZIPs remain unchanged.
  if (!existsSync(zipPath)) {
    execFileSync('zip', ['-q', '-X', '-r', zipPath, item.dir], { cwd: SOURCE_ROOT })
  }
  if (item.promptPath !== `/skills/sources/${item.dir}/SKILL.md`) {
    throw new Error(`${item.id} 的 promptPath 与目录不一致`)
  }
  if (item.zipPath !== `/skills/zips/${item.zipFile}`) {
    throw new Error(`${item.id} 的 zipPath 与文件名不一致`)
  }
  if (item.promptName == null || item.promptName === '') {
    throw new Error(`${item.id} 缺少 promptName`)
  }

  const served = readFileSync(skillPath)
  const packed = execFileSync('unzip', ['-p', zipPath, item.zipSkillEntry], { maxBuffer: 8 * 1024 * 1024 })
  if (!served.equals(packed)) {
    throw new Error(`${item.zipFile} 里的 SKILL.md 与站点复制正文不一致`)
  }
  const listing = execFileSync('unzip', ['-Z1', zipPath], { encoding: 'utf8' })
  const entries = listing.split('\n').map((line) => line.trim()).filter(Boolean)
  if (entries.length < 2) throw new Error(`${item.zipFile} 不是完整技能包`)
  if (!entries.includes(item.zipSkillEntry)) throw new Error(`${item.zipFile} 缺少 ${item.zipSkillEntry}`)

  const zipBytes = statSync(zipPath).size
  const minimum = MIN_ZIP_BYTES[item.zipFile]
  if (!minimum || zipBytes < minimum) {
    throw new Error(`${item.zipFile} 只有 ${zipBytes} 字节，不像上传的完整技能包`)
  }

  const text = served.toString('utf8')
  if (!text.startsWith('---\n') || text.length < 800) {
    throw new Error(`${item.id} 的 SKILL.md 不是完整技能正文`)
  }
  for (const phrase of REQUIRED_PHRASES[item.id] || []) {
    if (!text.includes(phrase)) throw new Error(`${item.id} 的 SKILL.md 缺少「${phrase}」`)
  }
  console.log(`verified ${item.zipFile} (${zipBytes} bytes, ${entries.length} files)`)
}
