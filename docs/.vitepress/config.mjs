import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'

const siteName = '好想下班...'
const siteDescription = '玩游戏，看电影，写代码，认真生活。'
const siteAuthor = 'cleeshark'
const githubRepo = 'cleeshark/cleeshark.github.io'

function createCommentConfig() {
  const repo = process.env.GISCUS_REPO || githubRepo
  const repoId = process.env.GISCUS_REPO_ID
  const category = process.env.GISCUS_CATEGORY
  const categoryId = process.env.GISCUS_CATEGORY_ID

  if (!repoId || !category || !categoryId) {
    return false
  }

  return {
    type: 'giscus',
    label: '评论',
    mobileMinify: true,
    options: {
      repo,
      repoId,
      category,
      categoryId,
      mapping: 'pathname',
      inputPosition: 'top',
      lang: 'zh-CN',
      loading: 'lazy'
    }
  }
}

const blogTheme = getThemeConfig({
  author: siteAuthor,
  themeColor: 'el-blue',
  mermaid: false,
  comment: createCommentConfig(),
  homeTags: true,
  home: {
    name: siteName,
    motto: '个人博客',
    inspiring: [
      '玩游戏，看电影，写代码。',
      '把问题写清楚，把经验留下来。',
      '认真生活，也认真下班。'
    ],
    inspiringTimeout: 4200,
    pageSize: 6,
    avatarMode: 'split',
    blogInfoCollapsible: true,
    analysis: {
      articles: {
        title: ['文章', '随笔']
      }
    }
  },
  hotArticle: {
    title: '精选文章',
    pageSize: 6,
    empty: '暂无精选文章'
  },
  recommend: {
    title: '相关文章',
    pageSize: 6,
    style: 'card'
  },
  article: {
    readingTime: true,
    readingTimePosition: 'inline'
  },
  footer: {
    message: siteDescription,
    copyright: `Copyright © 2026-present ${siteAuthor}`
  }
})

export default defineConfig({
  ...blogTheme,
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ...(blogTheme.head || []),
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: siteAuthor }]
  ],
  themeConfig: {
    ...(blogTheme.themeConfig || {}),
    siteTitle: siteName,
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about/' }
    ],
    socialLinks: [
      { icon: 'github', link: `https://github.com/${githubRepo}` }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
