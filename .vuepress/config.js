module.exports = {
  title: 'RJ Salvador',
  description: [
    'Portfolio & other goods',
    'Kludging JS since 2012',
    'Wrestling CSS since 2012',
    'Fixing HTML since 2012',
  ],
  themeConfig: {
    nav: [
      { text: 'Software', link: '/software/' },
      { text: 'Music', link: '/music/' },
      { text: 'Art & Misc', link: '/art/' },
    ]
  },
  head: [
    ['link', { rel: 'icon', href: `/images/icons/icon.png` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/images/icons/icon.png` }],
    ['link', { rel: 'mask-icon', href: '/images/icons/icon.png', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/images/icons/icon.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['link', { rel: 'stylesheet', href: `https://fonts.googleapis.com/css?family=Open+Sans:400|Special+Elite` }],
  ],
  dest: '.dist'
}
