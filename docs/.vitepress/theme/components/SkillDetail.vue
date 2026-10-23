<script setup lang="ts">
import SkillLike from './SkillLike.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { findSkill } from '../homeSkills'
import { useSkillCopy } from '../useSkillCopy'
import { trackEvent } from '../analytics'

const props = defineProps<{ skillId: string }>()
const { isEnglish, feedbackBySkillId, buttonLabel, buttonAriaLabel, zipLabel, zipAriaLabel, copySkill, trackDownload } = useSkillCopy()

const skill = computed(() => findSkill(props.skillId))
const detail = computed(() => skill.value?.detail)

const heroVideo = ref<HTMLVideoElement | null>(null)
const heroPlaying = ref(false)
function playHero(): void {
  if (heroVideo.value) heroVideo.value.muted = false
  heroVideo.value?.play()
}

/** 进入详情页自动播放：浏览器只允许静音自动播，声音由用户点音量键开启；系统要求减少动态时不自动播 */
function tryAutoplay(): void {
  const v = heroVideo.value
  if (!v) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  v.muted = true
  v.play().catch(() => {})
}
onMounted(tryAutoplay)
watch(() => props.skillId, () => {
  heroPlaying.value = false
  void nextTick(tryAutoplay)
})
const listHref = computed(() => withBase(isEnglish.value ? '/en/skills/' : '/skills/'))

function pick(zh: string, en: string): string {
  return isEnglish.value ? en : zh
}

const VIEWED_SKILLS_KEY = 'pmf:viewed-skills'

/** 只在本机记录看过哪些技能，用于判断是否回访；不生成也不上报任何用户标识 */
function markViewed(skillId: string): boolean {
  try {
    const viewed: string[] = JSON.parse(localStorage.getItem(VIEWED_SKILLS_KEY) || '[]')
    if (viewed.includes(skillId)) return true
    localStorage.setItem(VIEWED_SKILLS_KEY, JSON.stringify([...viewed, skillId]))
  } catch {
    /* 存储不可用时按首次访问处理 */
  }
  return false
}

function trackView(): void {
  if (!skill.value) return
  trackEvent('skill_view', {
    skill_id: skill.value.id,
    language: isEnglish.value ? 'en' : 'zh',
    returning: markViewed(skill.value.id)
  })
}

onMounted(trackView)
watch(() => props.skillId, trackView)
</script>

<template>
  <div v-if="skill && detail" class="skill-detail">
    <div class="skill-hero">
      <div class="skill-thumb skill-hero-preview">
        <template v-if="skill.video">
          <video
            ref="heroVideo"
            :src="withBase(skill.video)"
            :poster="withBase(skill.image)"
            controls
            autoplay
            muted
            preload="metadata"
            playsinline
            style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#000"
            @play="heroPlaying = true"
            @pause="heroPlaying = false"
          />
          <button
            v-if="!heroPlaying"
            type="button"
            class="video-play-btn"
            :aria-label="pick('播放演示视频', 'Play demo video')"
            @click="playHero"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </button>
        </template>
        <img
          v-else
          :src="withBase(skill.image)"
          :alt="pick(skill.imageAltZh, skill.imageAltEn)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          decoding="async"
        />
      </div>
      <div class="skill-hero-copy">
        <p class="skill-kicker">
          <span class="skill-chip">{{ pick(skill.chipZh, skill.chipEn) }}</span>
          <span class="skill-meta">{{ pick(detail.metaZh, detail.metaEn) }}</span>
        </p>
        <h1>{{ pick(skill.nameZh, skill.nameEn) }}</h1>
        <p class="skill-lead">{{ pick(detail.leadZh, detail.leadEn) }}</p>
        <div class="skill-actions">
          <button
            type="button"
            class="skill-copy is-primary"
            :class="{ 'is-copied': feedbackBySkillId[skill.id] === 'copied' }"
            :aria-label="buttonAriaLabel(skill, pick(skill.nameZh, skill.nameEn))"
            @click="copySkill(skill, 'detail')"
          >
            <span aria-live="polite">{{ buttonLabel(skill.id) }}</span>
          </button>
          <a
            class="skill-zip is-detail"
            :href="withBase(skill.zipPath)"
            :download="skill.zipFile"
            :aria-label="zipAriaLabel(pick(skill.nameZh, skill.nameEn))"
            @click="trackDownload(skill, 'detail')"
          >{{ zipLabel() }}</a>
          <SkillLike :skill-id="skill.id" />
          <a class="skill-back" :href="listHref">{{ pick('返回技能列表', 'Back to skills') }}</a>
        </div>
      </div>
    </div>

    <div class="skill-fit">
      <section>
        <h2>{{ pick('你将获得', 'What you get') }}</h2>
        <ul>
          <li v-for="item in (isEnglish ? detail.gainsEn : detail.gainsZh)" :key="item">{{ item }}</li>
        </ul>
      </section>
      <section>
        <h2>{{ pick('适合', 'Good for') }}</h2>
        <ul>
          <li v-for="item in (isEnglish ? detail.fitEn : detail.fitZh)" :key="item">{{ item }}</li>
        </ul>
      </section>
      <section>
        <h2>{{ pick('不适合', 'Not a fit') }}</h2>
        <ul>
          <li v-for="item in (isEnglish ? detail.unfitEn : detail.unfitZh)" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>

    <section v-if="detail.exampleTitleZh" class="skill-example">
      <h2>{{ pick('实操示例', 'Practical example') }}</h2>
      <h3>{{ pick(detail.exampleTitleZh || '', detail.exampleTitleEn || '') }}</h3>
      <div class="skill-example-grid">
        <div>
          <p class="skill-example-label">{{ pick('输入 / 任务', 'Input / task') }}</p>
          <pre>{{ pick(detail.exampleInputZh || '', detail.exampleInputEn || '') }}</pre>
        </div>
        <div>
          <p class="skill-example-label">{{ pick('可见的交付成果', 'Visible deliverable') }}</p>
          <pre>{{ pick(detail.exampleOutputZh || '', detail.exampleOutputEn || '') }}</pre>
        </div>
      </div>
      <div class="skill-example-bottom">
        <div>
          <h3>{{ pick('最终交付物', 'Deliverables') }}</h3>
          <ul>
            <li v-for="item in (isEnglish ? detail.artifactsEn || [] : detail.artifactsZh || [])" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          <h3>{{ pick('验收标准', 'Acceptance checks') }}</h3>
          <ul>
            <li v-for="item in (isEnglish ? detail.checksEn || [] : detail.checksZh || [])" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
      <p class="skill-example-note">{{ pick('说明：示例用于展示技能的输入、输出和验收方式；除非明确注明，示例内容不代表已执行的真实客户项目或生产环境测试。', 'Note: examples demonstrate inputs, outputs, and acceptance criteria. Unless explicitly stated, they are not claims of real client work or production testing.') }}</p>
    </section>

    <section v-if="detail.demo" class="skill-example skill-demo">
      <h2>{{ pick(detail.demo.real ? '真实运行案例' : '效果示意', detail.demo.real ? 'Real run' : 'Illustrative output') }}</h2>
      <p class="skill-demo-meta">{{ detail.demo.model }} · {{ detail.demo.capturedAt }}</p>
      <div class="skill-example-grid">
        <div>
          <p class="skill-example-label">{{ pick('提示语', 'Prompt') }}</p>
          <pre>{{ pick(detail.demo.promptZh, detail.demo.promptEn) }}</pre>
        </div>
        <div>
          <p class="skill-example-label">{{ pick('技能的实际产出', 'Actual output') }}</p>
          <pre>{{ pick(detail.demo.outputZh, detail.demo.outputEn) }}</pre>
        </div>
      </div>
      <p class="skill-example-note">{{ pick(detail.demo.noteZh, detail.demo.noteEn) }}</p>
    </section>

    <section class="skill-about">
      <h2>{{ pick('关于此 Skill', 'About this skill') }}</h2>
      <div class="skill-chat">
        <span class="skill-chat-label">{{ pick('你说', 'You') }}</span>
        <p>{{ pick(detail.sampleZh, detail.sampleEn) }}</p>
      </div>
      <h3>{{ pick('怎么用', 'How to use') }}</h3>
      <ol>
        <li v-for="step in (isEnglish ? detail.stepsEn : detail.stepsZh)" :key="step">{{ step }}</li>
      </ol>
    </section>
  </div>
</template>
