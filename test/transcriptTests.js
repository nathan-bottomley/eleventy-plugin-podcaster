import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

test('episode.transcript is omitted from the feed if not specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '[Episode 1](/episode-1.mp3)', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('podcast:transcript' in feedData.rss.channel.item)
})

test('episode.transcript works when just a path is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: '/ep-1.vtt' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_url'], 'https://example.com/ep-1.vtt')
})

test('episode.transcript works when a full URL is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1.vtt' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_url'], 'https://cdn.example.com/ep-1.vtt')
})

test('the podcast:transcript has a type of text/vtt when the transcript extension is .vtt', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1.vtt' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_type'], 'text/vtt')
})

test('the podcast:transcript has a type of text/html when the transcript extension is .html', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1.html' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_type'], 'text/html')
})

test('the podcast:transcript has a type of application/json when the transcript extension is .json', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1.json' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_type'], 'application/json')
})

test('the podcast:transcript has a type of application/x-subrip when the transcript extension is .srt', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1.srt' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_type'], 'application/x-subrip')
})

test('the podcast:transcript has a type of text/plain by default', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_type'], 'text/plain')
})
