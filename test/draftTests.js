import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

// These tests need to be run serially because they rely on setting and unsetting environment variables.

test.serial('drafts status is ignored if plugin added without handleDrafts option', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' },
        draft: true
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.false(item === undefined)
})

test.serial('drafts are built if INCLUDE_DRAFTS is absent and ELEVENTY_RUN_MODE is watch', async t => {
  process.env.INCLUDE_DRAFTS = ''
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    runMode: 'watch',
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleDrafts: true })
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' },
        draft: true
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.false(item === undefined)
})

test.serial('drafts are not built if INCLUDE_DRAFTS is absent and ELEVENTY_RUN_MODE is build', async t => {
  process.env.INCLUDE_DRAFTS = ''
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    runMode: 'build',
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleDrafts: true })
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' },
        draft: true
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item === undefined)
})

test.serial('drafts are not built if plugin added with handleDrafts option and INCLUDE_DRAFTS is false', async t => {
  process.env.INCLUDE_DRAFTS = 'false'
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleDrafts: true })
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' },
        draft: true
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item === undefined)
})

test.serial('drafts are built if plugin added with handleDrafts option and INCLUDE_DRAFTS is true', async t => {
  process.env.INCLUDE_DRAFTS = 'true'
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { handleDrafts: true })
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1\n\n> blockquote paragraph\n\nnon-blockquote paragraph', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' },
        draft: true
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.false(item === undefined)
})
