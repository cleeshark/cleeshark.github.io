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
2. 在 `docs/posts/index.md` 增加文章链接。
3. 如果要维护归档，在 `docs/archives/index.md` 增加记录。

## 评论功能

项目是纯静态站点，适合接入基于 GitHub Discussions 的 Giscus 评论，不需要自建服务端。

启用前需要在 GitHub 仓库中完成这些设置：

1. 打开仓库的 `Settings` -> `Features`，启用 `Discussions`。
2. 安装并启用 [giscus app](https://github.com/apps/giscus)。
3. 打开 [giscus.app/zh-CN](https://giscus.app/zh-CN)，填写仓库信息并选择 Discussion 分类。
4. 将页面生成的 `repo-id`、`category`、`category-id` 配置到 GitHub Actions Variables：
   - `GISCUS_REPO_ID`
   - `GISCUS_CATEGORY`
   - `GISCUS_CATEGORY_ID`

如果评论仓库不是当前仓库，还可以额外配置 `GISCUS_REPO`，格式为 `owner/repo`。

本地调试时可以临时设置同名环境变量后运行：

```bash
npm run docs:dev
```

未配置这些变量时，评论功能会保持关闭，不影响构建和部署。

## GitHub Pages 部署

仓库已经包含 `.github/workflows/deploy.yml`。推送到 `master` 或 `main` 后，GitHub Actions 会自动安装依赖、构建站点并发布。

第一次使用前，在 GitHub 仓库中设置：

1. 打开 `Settings` -> `Pages`。
2. 将 `Build and deployment` 的 `Source` 选择为 `GitHub Actions`。
3. 推送代码后等待 `Deploy blog` workflow 完成。
