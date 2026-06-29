import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  author: 'cleeshark',
  themeColor: 'el-blue',
  mermaid: false,
  comment: false,
  homeTags: true,
  home: {
    name: '好想下班...',
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
    message: '玩游戏，看电影，写代码，认真生活。',
    copyright: 'Copyright © 2026-present cleeshark'
  }
})

export default defineConfig({
  ...blogTheme,
  lang: 'zh-CN',
  title: '好想下班...',
  description: '玩游戏，看电影，写代码，认真生活。',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ...(blogTheme.head || []),
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: 'cleeshark' }]
  ],
  themeConfig: {
    ...(blogTheme.themeConfig || {}),
    siteTitle: '好想下班...',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about/' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cleeshark/cleeshark.github.io' }
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
