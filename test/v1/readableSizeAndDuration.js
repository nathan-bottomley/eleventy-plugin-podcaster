import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test('the readableSize filter converts bytes to something readable', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '1024 = {{ 1024 | readableSize }}\n32004399 = {{ 32004399 | readableSize }}\n28683178 = {{ 28683178 | readableSize }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('1024 = 1.02 kB'))
  t.true(item.content.includes('32004399 = 32.00 MB'))
  t.true(item.content.includes('28683178 = 28.68 MB'))
})

test('the readableSize filter, with a parameter of 1,  converts bytes to something readable to 1 decimal place', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '1024 = {{ 1024 | readableSize: 1 }}\n32004399 = {{ 32004399 | readableSize: 1 }}\n28683178 = {{ 28683178 | readableSize: 1 }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('1024 = 1.0 kB'))
  t.true(item.content.includes('32004399 = 32.0 MB'))
  t.true(item.content.includes('28683178 = 28.7 MB'))
})

test('the readableDuration filter converts seconds to something readable', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '3599 = {{ 3599 | readableDuration }}\n3600 = {{ 3600 | readableDuration }}\n1947.481 = {{ 1947.481 | readableDuration }}\n1587.905 = {{ 1587.905 | readableDuration }}', {
        permalink: '/size/'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/size/')
  t.true(item.content.includes('3599 = 0:59:59'))
  t.true(item.content.includes('3600 = 1:00:00'))
  t.true(item.content.includes('1947.481 = 0:32:27'))
  t.true(item.content.includes('1587.905 = 0:26:27'))
})

test('the readableDuration filter, with a parameter of true, converts seconds to something readable with the leading hours zero omitted', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleExcerpts: true })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('index.md', '3599 = {{ 3599 | readableDuration: true }}\n3600 = {{ 3600 | readableDuration: true }}\n1947.481 = {{ 1947.481 | readableDuration: true }}\n1587.905 = {{ 1587.905 | readableDuration: true }}', {
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
})
