import test from 'ava'
import Eleventy from '@11ty/eleventy'
import podcasterPlugin from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

test('podcastEpisode template produces <item> tag in feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('episode-2.md', '# Episode 2', {
        tags: ['podcastEpisode'],
        date: '2020-01-02',
        title: 'Episode 2',
        permalink: '/2/',
        episode: { filename: 'episode-2.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.like(feedData, { rss: { channel: { item: [{ title: 'Episode 2' }, { title: 'Episode 1' }] } } })
})

test('episode.url consists of the episode prefix plus the episode filename', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
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
  t.true(item.content.includes('https://example.com/episode-1.mp3'))
})

test('episode.url is percent encoded', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('https://example.com/episode%201.mp3'), item.content)
})

test('a local link in podcast episode content is converted to an absolute URL', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'podcast.siteUrl',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  t.true(item.content.includes('https://example.com/episode-1.mp3'))
})

test('site.url is used if podcast.siteUrl is absent', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'site.url',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'podcast.imagePath',
        '/img/podcast-logo.jpg'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  t.true(item.content.includes('https://example.com/img/podcast-logo.jpg'))
})
