import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test("when there's a page title and site.title is provided, pageTitle is calculated correctly", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handlePageTitles: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addGlobalData('site.title', 'Flight Through Entirety')
      eleventyConfig.addTemplate('episode-1.md', '{{ pageTitle }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('Episode 1 · Flight Through Entirety'))
})

test('when a custom separator is provided it gets used', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handlePageTitles: '|' })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addGlobalData('site.title', 'Flight Through Entirety')
      eleventyConfig.addTemplate('episode-1.md', '{{ pageTitle }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('Episode 1 | Flight Through Entirety'))
})

test('when the page title and site.title are the same, pageTitle is calculated correctly', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handlePageTitles: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addGlobalData('site.title', 'Flight Through Entirety')
      eleventyConfig.addTemplate('episode-1.md', '{{ pageTitle }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Flight Through Entirety',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('Flight Through Entirety'))
  t.false(item.content.includes('Flight Through Entirety · Flight Through Entirety'))
})

test("when site.title isn't provided, podcast.title is used instead", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handlePageTitles: true })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addGlobalData('podcast.title', 'Flight Through Entirety')
      eleventyConfig.addTemplate('episode-1.md', '{{ pageTitle }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('Episode 1 · Flight Through Entirety'))
})
