<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { homeSkills, skillPagePath, freeBadgeLabel, type HomeSkill } from '../homeSkills'
import { useSkillCopy } from '../useSkillCopy'

const route = useRoute()
const { isEnglish, feedbackBySkillId, buttonLabel, buttonAriaLabel, copySkill } = useSkillCopy()

const onCatalog = computed(() => {
  const path = (route.path || '/').replace(/\/$/, '') || '/'
  return path === '/skills' || path === '/en/skills'
})
const freeLabel = computed(() => freeBadgeLabel(isEnglish.value))

function titleFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.nameEn : skill.nameZh
}

function pitchFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.pitchEn : skill.pitchZh
}

function chipFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.chipEn : skill.chipZh
}

function imageAltFor(skill: HomeSkill): string {
  return isEnglish.value ? skill.imageAltEn : skill.imageAltZh
}

function hrefFor(skill: HomeSkill): string | null {
  const path = skillPagePath(skill, isEnglish.value, onCatalog.value)
  return path ? withBase(path) : null
}
</script>

<template>
  <div class="skill-catalog">
    <article v-for="(skill, index) in homeSkills" :id="skill.id" :key="skill.id" class="skill-tile">
      <a v-if="hrefFor(skill)" class="skill-thumb" :href="hrefFor(skill) || undefined">
        <img
          :src="withBase(skill.image)"
          :alt="imageAltFor(skill)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
        <span class="skill-free">{{ freeLabel }}</span>
      </a>
      <div v-else class="skill-thumb">
        <img
          :src="withBase(skill.image)"
          :alt="imageAltFor(skill)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
        <span class="skill-free">{{ freeLabel }}</span>
      </div>
      <h3>
        <a v-if="hrefFor(skill)" :href="hrefFor(skill) || undefined">{{ titleFor(skill) }}</a>
        <span v-else>{{ titleFor(skill) }}</span>
      </h3>
      <p class="skill-pitch">{{ pitchFor(skill) }}</p>
      <div class="skill-foot">
        <span class="skill-chip">{{ chipFor(skill) }}</span>
        <button
          type="button"
          class="skill-copy"
          :class="{ 'is-copied': feedbackBySkillId[skill.id] === 'copied' }"
          :aria-label="buttonAriaLabel(skill, titleFor(skill))"
          @click="copySkill(skill)"
        >
          <span aria-live="polite">{{ buttonLabel(skill.id) }}</span>
        </button>
      </div>
    </article>
  </div>
</template>
