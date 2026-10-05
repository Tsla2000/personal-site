# 个人知识网站

这是一个基于 VitePress 的个人知识库、公开博客与项目主页。

## 本地运行

```bash
npm install
npm run docs:dev
```

## 构建与预览

```bash
npm run docs:build
npm run docs:preview
```

文章全部位于 `docs/` 下，以 Markdown 文件作为唯一数据源。新增文章时，添加 Frontmatter 后放入对应分类目录即可。

部署工作流位于 `.github/workflows/deploy.yml`，推送到 `main` 分支后会自动构建并发布到 GitHub Pages。

## Pages 路径与自定义域名

项目 Pages 默认使用仓库名作为路径前缀，工作流会自动设置 `BASE_PATH`。如果以后绑定自定义域名，将工作流中的 `BASE_PATH` 改为 `/`，并在仓库的 Pages 设置中配置域名即可；文章内容不需要修改。
