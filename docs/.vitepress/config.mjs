import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '好想下班...',
  description: '玩游戏，看电影，写代码，认真生活。',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: 'cleeshark' }]
  ],
  themeConfig: {
    siteTitle: '好想下班...',
    logo: null,
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about/' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: '文章',
          items: [
            { text: 'oh：OpenHarmony 编译命令管理工具', link: '/posts/oh-openharmony-build-tool' },
            { text: 'Hello world', link: '/posts/hello-world' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cleeshark/cleeshark.github.io' }
    ],
    footer: {
      message: '玩游戏，看电影，写代码，认真生活。',
      copyright: 'Copyright © 2026-present cleeshark'
    },
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
