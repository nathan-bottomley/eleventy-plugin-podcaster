import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test('readableDate filter works by default with en-AU locale', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('index.md', '{{ date | readableDate }}', {
        date: '2020-01-01',
        title: 'Readable Date test',
        permalink: '/1/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')

  t.regex(item.content, /Wednesday 1 January 2020/)
})

test('readableDate filter works with explicit locale specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { readableDateLocale: 'en-US' })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('index.md', '{{ date | readableDate }}', {
        date: '2020-01-01',
        title: 'Readable Date test',
        permalink: '/1/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')

  t.regex(item.content, /Wednesday, January 1, 2020/)
})
