<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { findSkill, freeBadgeLabel } from '../homeSkills'
import { useSkillCopy } from '../useSkillCopy'

const props = defineProps<{ skillId: string }>()
const { isEnglish, feedbackBySkillId, buttonLabel, buttonAriaLabel, copySkill } = useSkillCopy()

const skill = computed(() => findSkill(props.skillId))
const detail = computed(() => skill.value?.detail)
const listHref = computed(() => withBase(isEnglish.value ? '/en/skills/' : '/skills/'))
const freeLabel = computed(() => freeBadgeLabel(isEnglish.value))

function pick(zh: string, en: string): string {
  return isEnglish.value ? en : zh
}
</script>

<template>
  <div v-if="skill && detail" class="skill-detail">
    <div class="skill-hero">
      <div class="skill-thumb skill-hero-preview">
        <img
          :src="withBase(skill.image)"
          :alt="pick(skill.imageAltZh, skill.imageAltEn)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          decoding="async"
        />
      </div>
      <div class="skill-hero-copy">
        <p class="skill-kicker">
          <span class="skill-free">{{ freeLabel }}</span>
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
            @click="copySkill(skill)"
          >
            <span aria-live="polite">{{ buttonLabel(skill.id) }}</span>
          </button>
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
