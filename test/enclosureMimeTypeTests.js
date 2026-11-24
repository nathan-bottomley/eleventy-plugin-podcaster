import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

test('the enclosure has a type of audio/mpeg for an mp3 file', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item.enclosure['@_type'], 'audio/mpeg')
})

test('the enclosure has a type of audio/x-m4a for an m4a file', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.m4a' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item.enclosure['@_type'], 'audio/x-m4a')
})

test('the build does not crash when an episode has no resolvable filename', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '{{ episode.url }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: {}
      })
    }
  })

  await t.notThrowsAsync(() => eleventy.toJSON())
})
