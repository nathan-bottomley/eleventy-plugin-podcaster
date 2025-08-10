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

test('the readableSize filter converts bytes to something readable', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '1024 = {{ 1024 | readableSize }}\n28683178 = {{ 28683178 | readableSize }}\n32004399 = {{ 32004399 | readableSize }}\n1100000000 = {{ 1100000000 | readableSize }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('1024 = 1.0 kB'))
  t.true(item.content.includes('28683178 = 28.7 MB'))
  t.true(item.content.includes('32004399 = 32.0 MB'))
  t.true(item.content.includes('1100000000 = 1.1 GB'))
})

test('the readableSize filter uses the specified number of fixed decimal places', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '1024 = {{ 1024 | readableSize: 2 }}\n28683178 = {{ 28683178 | readableSize: 2 }}\n32004399 = {{ 32004399 | readableSize: 2 }}\n1100000000 = {{ 1100000000 | readableSize: 2 }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('1024 = 1.02 kB'))
  t.true(item.content.includes('28683178 = 28.68 MB'))
  t.true(item.content.includes('32004399 = 32.00 MB'))
  t.true(item.content.includes('1100000000 = 1.10 GB'))
})

test('the readableDuration filter converts seconds to colon separated values', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '3599 = {{ 3599 | readableDuration }}\n3600 = {{ 3600 | readableDuration }}\n1947.481 = {{ 1947.481 | readableDuration }}\n1587.905 = {{ 1587.905 | readableDuration }}\n86400 = {{ 86400 | readableDuration }}\n90000 = {{ 90000 | readableDuration }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('3599 = 59:59'))
  t.true(item.content.includes('3600 = 1:00:00'))
  t.true(item.content.includes('1947.481 = 32:27'))
  t.true(item.content.includes('1587.905 = 26:27'))
  t.true(item.content.includes('86400 = 24:00:00'))
  t.true(item.content.includes('90000 = 25:00:00'))
})

test('the readableDuration filter converts seconds to words if the word "long" is passed as the second argument', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '86399 = {{ 86399 | readableDuration: "long" }}\n86400 = {{ 86400 | readableDuration: "long" }}\n90000 = {{ 90000 | readableDuration: "long" }}\n100000.555 = {{ 100000.555 | readableDuration: "long" }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('86399 = 0 days, 23 hours, 59 minutes, 59 seconds'))
  t.true(item.content.includes('86400 = 1 day, 0 hours, 0 minutes, 0 seconds'))
  t.true(item.content.includes('90000 = 1 day, 1 hour, 0 minutes, 0 seconds'))
  t.true(item.content.includes('100000.555 = 1 day, 3 hours, 46 minutes, 40.555 seconds'))
})
