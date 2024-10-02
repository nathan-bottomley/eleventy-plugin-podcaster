import test from 'ava'
import Eleventy from '@11ty/eleventy'
import podcasterPlugin from 'eleventy-plugin-podcaster'

test('excerpt tests run', t => {
  t.pass()
})

test('excerpt is the child <p> of the content not in a <blockquote>', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', { tags: ['podcastEpisode'], date: '2020-01-01', title: 'Episode 1', permalink: '/1/' })
      eleventyConfig.addTemplate('index.md', '# Excerpts\n\n{% for post in  collections.podcastEpisode %}Excerpt is {{ post.data.excerpt }}{% endfor %}', { date: '2020-01-01', title: 'Excerpts', permalink: '/excerpts/' })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/excerpts/')
  t.true(item.content.includes('Excerpt is <p>non-blockquote paragraph</p>'), `Excerpt not included in '${item.content}'`)
})

test('if front matter excerpt is set, it is used as raw HTML', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', { tags: ['podcastEpisode'], date: '2020-01-01', title: 'Episode 1', permalink: '/1/', excerpt: 'front matter **excerpt**' })
      eleventyConfig.addTemplate('index.md', '# Excerpts\n\n{% for post in collections.podcastEpisode %}Excerpt is {{ post.data.excerpt }}{% endfor %}', { date: '2020-01-01', title: 'Excerpts', permalink: '/excerpts/' })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/excerpts/')
  t.true(item.content.includes('<p>front matter <strong>excerpt</strong></p>'), `Excerpt not included in '${item.content}'`)
})