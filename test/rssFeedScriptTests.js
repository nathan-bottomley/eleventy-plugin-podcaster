import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

test("not providing options.rssFeedScript doesn't create <script> tag in feed", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('episode-posts/episode-2.md', '# Episode 2', {
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
  t.is(feedData.rss.channel.script, undefined)
})

test('providing options.rssFeedScript creates <script> tag in feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { rssFeedScript: '/js/feedScript.js' })
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('episode-posts/episode-2.md', '# Episode 2', {
        date: '2020-01-02',
        title: 'Episode 2',
        permalink: '/2/',
        episode: { filename: 'episode-2.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.script['@_src'], '/js/feedScript.js')
  t.is(feedData.rss.channel.script['@_xmlns'], 'http://www.w3.org/1999/xhtml')
})
