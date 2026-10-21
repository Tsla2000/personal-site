# CLAUDE.md

个人站 PRO的茶里芒果（https://promangofund.com），VitePress 1.6 静态站。

## 协作约定

- 用简体中文回复；代码、命令、文件名保持原样。
- 站长额度有限：先读本文件，不要大范围探索；只读和任务相关的文件。
- 改文字、内容等低风险改动：只跑构建，不截图。改版式时才用浏览器预览，截图用小比例。
- 推到 `main` 即上线。改版类改动先推分支，给站长看预览地址，确认后再合并。

## 部署

- 主站：Cloudflare Pages（项目 `mangofund`），推 `main` 约 1 分钟上线。
- 分支预览：`https://<分支名把 / 换成 ->.mangofund.pages.dev`，例如 `feat-archive-discover.mangofund.pages.dev`。
- GitHub Pages 镜像（`.github/workflows/deploy.yml`）同时构建，canonical 指回主站。

## 命令

```bash
npm ci
SITE_URL=https://promangofund.com npm run docs:build   # 构建 + SEO 检查（check-seo 失败会报错）
npx vitepress preview docs --port 4173                 # 预览构建产物；重新构建后要重启预览，否则新资源 404
```

## 构建流水线（docs:build）

1. `patch-vitepress-locale.mjs`：修补 VitePress 英文首页的语言判断。
2. `pack-skills.mjs`：打包 `docs/public/skills` 下的技能 ZIP。
3. `gen-seo.mjs`：生成 sitemap / robots / feed / llms.txt / `_headers` / articles.json，
   并**重写** `docs/index.md` 的 LATEST 区块、`docs/archive.md` 的 ARCHIVE 区块和 `docs/ai/`、`docs/thinking/`、`docs/investment/` 三个栏目页 index.md 的 *-FEED 区块。
4. `vitepress build`，然后 `fix-logo-alt.mjs` 补 logo alt，`check-seo.mjs` 做 SEO 检查。

## 注意事项

- `docs/index.md`、`docs/archive.md` 里 `<!-- LATEST/ARCHIVE-START -->` 到 `-END` 之间是生成的，改样式要改 `scripts/gen-seo.mjs`，不要手改。
- 本地构建会改动 `scripts/content-dates.json` 和 `docs/public/articles.json`（git 时间格式差异），这是噪音，提交前 `git checkout --` 还原。
- 新文章：放进 `docs/<栏目>/` 下，frontmatter 写 `title`、`description`、`date`、`category`（AI / 投资 / 思考），可选 `image` 作封面和分享图。侧边栏在 `docs/.vitepress/config.ts` 的 `sidebar` 里手动加。
- 图片放 `docs/public/images/`，上传前压到 200KB 以内（宽度不超过 1600px）。
- 技能数据在 `docs/.vitepress/theme/homeSkills.ts`，首页技能卡、技能页、归档页侧栏都读它。相关组件是异步加载的，不进全站公共包。
- 归档页（`docs/archive.md`）用 `layout: page`，左 7 右 3；右侧栏是 `theme/components/ArchiveSidebar.vue`。
- AI 栏目页（`docs/ai/index.md`）用单列列表（标题 · 日期 / 缩略图 + 摘要 / 分隔线，样式 `.feed-row`），无侧栏，收 `docs/ai/` 下所有页面，按子目录筛选；子目录显示名在 `gen-seo.mjs` 的 `AI_TABS`。
- 主题入口 `docs/.vitepress/theme/index.ts`，全局样式 `theme/custom.css`，品牌色变量在文件开头。
