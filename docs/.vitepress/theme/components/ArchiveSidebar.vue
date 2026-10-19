<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { homeSkills, homeShowcaseSkills, skillPagePath } from '../homeSkills'

// 归档页右侧栏:技能商店 / 项目 / 订阅。技能取编辑推荐前 4 个,总数跟随技能目录。
const ARCHIVE_SKILL_LIMIT = 4
const skills = homeShowcaseSkills(homeSkills, ARCHIVE_SKILL_LIMIT).map((skill) => ({
  id: skill.id,
  name: skill.nameZh,
  pitch: skill.pitchZh,
  chip: skill.chipZh,
  image: withBase(skill.image),
  href: withBase(skillPagePath(skill, false, false) ?? '/skills/')
}))
const skillTotal = homeSkills.length

// 项目目前只有 XMade,与 docs/projects/index.md 保持一致
const project = {
  name: 'XMade',
  pitch: '一键下载 X 上的推文、视频和长文，整理好直接推送到公众号草稿。',
  chip: 'Chrome 扩展',
  image: withBase('/images/projects/xmade.jpg'),
  href: withBase('/projects/')
}

const RSS_URL = 'https://promangofund.com/feed.xml'
const copied = ref(false)
function copyRss(): void {
  try {
    void navigator.clipboard.writeText(RSS_URL).then(() => {
      copied.value = true
      window.setTimeout(() => (copied.value = false), 1600)
    })
  } catch {
    /* 忽略 */
  }
}
</script>

<template>
  <aside class="archive-side" aria-label="侧栏">
    <section class="side-card">
      <div class="side-head">
        <h2>技能商店</h2>
        <a :href="withBase('/skills/')">全部 {{ skillTotal }} 个 →</a>
      </div>
      <ul class="side-skills">
        <li v-for="skill in skills" :key="skill.id">
          <a class="side-skill" :href="skill.href">
            <img :src="skill.image" :alt="skill.name" width="96" height="54" loading="lazy" decoding="async" />
            <span>
              <strong>{{ skill.name }}</strong>
              <small>{{ skill.pitch }}</small>
            </span>
          </a>
        </li>
      </ul>
    </section>

    <section class="side-card">
      <div class="side-head">
        <h2>项目</h2>
        <a :href="project.href">查看 →</a>
      </div>
      <a class="side-skill side-project" :href="project.href">
        <img :src="project.image" :alt="project.name" width="96" height="54" loading="lazy" decoding="async" />
        <span>
          <strong>{{ project.name }}<span class="archive-chip">{{ project.chip }}</span></strong>
          <small>{{ project.pitch }}</small>
        </span>
      </a>
    </section>

    <section class="side-card">
      <div class="side-head">
        <h2>订阅</h2>
      </div>
      <p class="side-note">新文章发布后 RSS 会同步更新，也可以收藏本站，回访时提醒你有新文章。</p>
      <div class="side-actions">
        <button type="button" class="side-btn" @click="copyRss">{{ copied ? '已复制 RSS 地址' : '复制 RSS 地址' }}</button>
        <a class="side-btn side-btn-primary" :href="withBase('/subscribe/')">去订阅</a>
      </div>
    </section>
  </aside>
</template>
