import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test('excerpt is the first child <p> of the content not in a <blockquote>', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('index.md', '# Excerpts\n\n{% for post in  collections.podcastEpisode %}Excerpt is {{ post.data.excerpt }}{% endfor %}', { date: '2020-01-01', title: 'Excerpts', permalink: '/excerpts/' })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/excerpts/')
  t.true(item.content.includes('Excerpt is <p>non-blockquote paragraph</p>'), `Excerpt not included in '${item.content}'`)
})

test('if front matter excerpt is set, it is used after being converted to raw HTML', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' },
        excerpt: 'front matter **excerpt**'
      })
      eleventyConfig.addTemplate('index.md', '# Excerpts\n\n{% for post in collections.podcastEpisode %}Excerpt is {{ post.data.excerpt }}{% endfor %}', { date: '2020-01-01', title: 'Excerpts', permalink: '/excerpts/' })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/excerpts/')
  t.true(item.content.includes('<p>front matter <strong>excerpt</strong></p>'), `Excerpt not included in '${item.content}'`)
})

test('if excerpt is set using comment delimiters, it is used after being converted to raw HTML', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '# Episode 1\n\nfirst paragraph\n<!---excerpt-->\nsecond *paragraph*\n<!---endexcerpt-->\nthird paragraph\n', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('index.md', '# Excerpts\n\n{% for post in collections.podcastEpisode %}Excerpt is {{ post.data.excerpt }}{% endfor %}', { date: '2020-01-01', title: 'Excerpts', permalink: '/excerpts/' })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/excerpts/')
  t.true(item.content.includes('<p>second <em>paragraph</em></p>'), `Excerpt not included in '${item.content}'`)
})

const templateWithMultilineExcerpt =
`
# Episode 1

<!---excerpt-->

second _paragraph_

third **paragraph**

<!---endexcerpt-->

other stuff
`

test('if multiline excerpt is set using comment delimiters, it is used after being converted to raw HTML', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', templateWithMultilineExcerpt, {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('index.md', '# Excerpts\n\n{% for post in collections.podcastEpisode %}\n\n{{ post.data.excerpt }}\n\n{% endfor %}', { date: '2020-01-01', title: 'Excerpts', permalink: '/excerpts/' })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/excerpts/')
  t.true(item.content.includes('<p>second <em>paragraph</em></p>'), `Excerpt not included in '${item.content}'`)
})
