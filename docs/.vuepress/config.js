module.exports = {
  title: 'Environment Indicator 环境指示器',
  description: 'Environment Indicator 环境指示器',
  themeConfig: {
    logo: '/indicator.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Chrome', link: 'https://chrome.google.com/webstore/detail/environment-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl?hl=zh-CN&authuser=0' },
      { text: 'Firefox', link: 'https://addons.mozilla.org/zh-CN/firefox/addon/env-indicator/' },
    ],

    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'gaoliang/env-indicator',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: '查看源码',

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: 'gaoliang/env-indicator',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'main',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！'
  }
}
