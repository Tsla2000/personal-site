<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import {
  SKILL_FILTER_ALL,
  SKILL_SCENE_FILTERS,
  SKILL_SORTS,
  SKILL_SORT_RECOMMENDED,
  SKILL_TYPE_FILTERS,
  homeShowcaseSkills,
  skillsForFilter,
  skillPagePath,
  sortSkills,
  type HomeSkill,
  type SkillFilterOption,
  type SkillSortId
} from '../homeSkills'
import { useSkillCopy, type SkillActionSource } from '../useSkillCopy'
import { useBarePath } from '../useLocale'
import { loadSkillHeat, skillHeat } from '../skillHeat'

const barePath = useBarePath()
const { isEnglish, feedbackBySkillId, buttonLabel, buttonAriaLabel, zipLabel, zipAriaLabel, copySkill, trackDownload } = useSkillCopy()
onMounted(loadSkillHeat)
const activeFilterId = ref(SKILL_FILTER_ALL)
const activeSortId = ref<SkillSortId>(SKILL_SORT_RECOMMENDED)

const onCatalog = computed(() => {
  const path = barePath.value.replace(/\/$/, '') || '/'
  return path === '/skills' || path === '/en/skills'
})

const visibleSkills = computed(() => {
  const filtered = skillsForFilter(onCatalog.value ? activeFilterId.value : SKILL_FILTER_ALL)
  if (!onCatalog.value) return homeShowcaseSkills(filtered, undefined, skillHeat.value)
  return sortSkills(filtered, activeSortId.value, skillHeat.value)
})

const skillCountText = computed(() => {
  const count = visibleSkills.value.length
  if (!isEnglish.value) return `${count} 个 Skills`
  return count === 1 ? '1 Skill' : `${count} Skills`
})

function filterLabel(filter: SkillFilterOption): string {
  return isEnglish.value ? filter.labelEn : filter.labelZh
}

function selectFilter(filterId: string): void {
  activeFilterId.value = filterId
}

function sortLabel(sort: (typeof SKILL_SORTS)[number]): string {
  return isEnglish.value ? sort.labelEn : sort.labelZh
}

function selectSort(sortId: SkillSortId): void {
  activeSortId.value = sortId
}

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

const actionSource = computed<SkillActionSource>(() => (onCatalog.value ? 'catalog' : 'home'))

/** 技能卡视频：进入视野自动静音循环播放，滚出暂停；系统要求减少动态时不自动播 */
const showcaseRoot = ref<HTMLElement | null>(null)
let thumbObserver: IntersectionObserver | null = null

function setupThumbAutoplay(): void {
  thumbObserver?.disconnect()
  thumbObserver = null
  const root = showcaseRoot.value
  if (!root) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const videos = root.querySelectorAll<HTMLVideoElement>('video.skill-thumb-video')
  if (videos.length === 0) return
  thumbObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target as HTMLVideoElement
        if (entry.isIntersecting) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      })
    },
    { threshold: 0.2 }
  )
  videos.forEach((v) => thumbObserver!.observe(v))
}

onMounted(() => {
  void nextTick(setupThumbAutoplay)
})
watch(visibleSkills, () => {
  void nextTick(setupThumbAutoplay)
})
onUnmounted(() => {
  thumbObserver?.disconnect()
})
</script>

<template>
  <div ref="showcaseRoot" :class="{ 'skill-browse-layout': onCatalog }">
    <nav v-if="onCatalog" class="skill-filters" :aria-label="isEnglish ? 'Filter skills' : '筛选技能'">
      <div class="skill-filter-group">
        <p class="skill-filter-label">{{ isEnglish ? 'Type' : '类型' }}</p>
        <button
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeFilterId === SKILL_FILTER_ALL }"
          :aria-pressed="activeFilterId === SKILL_FILTER_ALL"
          @click="selectFilter(SKILL_FILTER_ALL)"
        >
          {{ isEnglish ? 'All' : '全部' }}
        </button>
        <button
          v-for="filter in SKILL_TYPE_FILTERS"
          :key="filter.id"
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeFilterId === filter.id }"
          :aria-pressed="activeFilterId === filter.id"
          @click="selectFilter(filter.id)"
        >
          {{ filterLabel(filter) }}
        </button>
      </div>
      <div class="skill-filter-group">
        <p class="skill-filter-label">{{ isEnglish ? 'Scenario' : '场景' }}</p>
        <button
          v-for="filter in SKILL_SCENE_FILTERS"
          :key="filter.id"
          type="button"
          class="skill-filter"
          :class="{ 'is-active': activeFilterId === filter.id }"
          :aria-pressed="activeFilterId === filter.id"
          @click="selectFilter(filter.id)"
        >
          {{ filterLabel(filter) }}
        </button>
      </div>
    </nav>
    <div class="skill-catalog-main">
      <div v-if="onCatalog" class="skill-catalog-bar">
        <p class="skill-count">{{ skillCountText }}</p>
        <div
          class="skill-sort"
          role="group"
          :aria-label="isEnglish ? 'Sort skills' : '排序技能'"
        >
          <button
            v-for="sort in SKILL_SORTS"
            :key="sort.id"
            type="button"
            class="skill-sort-option"
            :class="{ 'is-active': activeSortId === sort.id }"
            :aria-pressed="activeSortId === sort.id"
            @click="selectSort(sort.id)"
          >{{ sortLabel(sort) }}</button>
        </div>
      </div>
      <div class="skill-catalog">
    <p v-if="onCatalog && visibleSkills.length === 0" class="skill-filter-empty">
      {{ isEnglish ? 'No skills match this filter.' : '没有符合这个筛选的技能。' }}
    </p>
    <article v-for="(skill, index) in visibleSkills" :id="skill.id" :key="skill.id" class="skill-tile">
      <a v-if="hrefFor(skill)" class="skill-thumb" :href="hrefFor(skill) || undefined">
        <video
          v-if="skill.video"
          class="skill-thumb-video"
          :src="withBase(skill.video)"
          :poster="withBase(skill.image)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          muted
          loop
          playsinline
          preload="metadata"
        />
        <img
          v-else
          :src="withBase(skill.image)"
          :alt="imageAltFor(skill)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
      </a>
      <div v-else class="skill-thumb">
        <video
          v-if="skill.video"
          class="skill-thumb-video"
          :src="withBase(skill.video)"
          :poster="withBase(skill.image)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          muted
          loop
          playsinline
          preload="metadata"
        />
        <img
          v-else
          :src="withBase(skill.image)"
          :alt="imageAltFor(skill)"
          :width="skill.imageWidth"
          :height="skill.imageHeight"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
      </div>
      <h3>
        <a v-if="hrefFor(skill)" :href="hrefFor(skill) || undefined">{{ titleFor(skill) }}</a>
        <span v-else>{{ titleFor(skill) }}</span>
      </h3>
      <p class="skill-pitch">{{ pitchFor(skill) }}</p>
      <div class="skill-foot">
        <span class="skill-chip">{{ chipFor(skill) }}</span>
        <div class="skill-controls">
          <button
            type="button"
            class="skill-copy"
            :class="{ 'is-copied': feedbackBySkillId[skill.id] === 'copied' }"
            :aria-label="buttonAriaLabel(skill, titleFor(skill))"
            @click="copySkill(skill, actionSource)"
          >
            <span aria-live="polite">{{ buttonLabel(skill.id) }}</span>
          </button>
          <a
            class="skill-zip"
            :href="withBase(skill.zipPath)"
            :download="skill.zipFile"
            :aria-label="zipAriaLabel(titleFor(skill))"
            @click="trackDownload(skill, actionSource)"
          >{{ zipLabel() }}</a>
        </div>
      </div>
    </article>
      </div>
    </div>
  </div>
</template>
