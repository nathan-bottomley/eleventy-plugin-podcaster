import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

const parserOptions = {
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  preserveOrder: true
}

test("not providing options.feedStylesheet doesn't create xml-stylesheet PI in feed", async t => {
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
  const parser = new XMLParser(parserOptions)
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const result = parser.parse(item.content)
  t.false(result.some(item => '?xml-stylesheet' in item))
})

test('providing options.feedStylesheet creates xml-stylesheet PI in feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { feedStylesheet: '/xsl/feedStylesheet.xsl' })
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
  const parser = new XMLParser(parserOptions)
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const result = parser.parse(item.content)
  const pi = result.find(item => '?xml-stylesheet' in item)
  t.is(pi[':@']['@_href'], '/xsl/feedStylesheet.xsl')
  t.is(pi[':@']['@_type'], 'text/xsl')
})
