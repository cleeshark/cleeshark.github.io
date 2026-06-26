# cleeshark.github.io

个人博客源码，基于 VitePress 构建，并通过 GitHub Actions 自动部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run docs:dev
```

## 构建

```bash
npm run docs:build
```

构建产物会生成到 `docs/.vitepress/dist`。

## 写文章

1. 在 `docs/posts` 新增 Markdown 文件。
2. 在 `docs/posts/README.md` 增加文章链接。
3. 如需侧边栏显示，在 `docs/.vitepress/config.mjs` 的 `sidebar` 中增加对应文件。
4. 如果要维护归档，在 `docs/archives/README.md` 增加记录。

## GitHub Pages 部署

仓库已经包含 `.github/workflows/deploy.yml`。推送到 `master` 或 `main` 后，GitHub Actions 会自动安装依赖、构建站点并发布。

第一次使用前，在 GitHub 仓库中设置：

1. 打开 `Settings` -> `Pages`。
2. 将 `Build and deployment` 的 `Source` 选择为 `GitHub Actions`。
3. 推送代码后等待 `Deploy blog` workflow 完成。
