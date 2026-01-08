import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'
import { unlinkSync } from 'node:fs'
import path from 'node:path'

test.before(async (t) => {
  t.context.fixture = './fixtures/customEpisodeFilesDirectory'
  const eleventy = new Eleventy(
    `${t.context.fixture}/src`,
    `${t.context.fixture}/_site`,
    {
      configPath: `${t.context.fixture}/eleventy.config.js`
    })
  t.context.build = await eleventy.toJSON()
  t.context.feed = t.context.build.find(
    item => item.inputPath === `${t.context.fixture}/src/feed.njk`
  )
  t.context.episodePosts = t.context.build.filter(
    item => item.inputPath.startsWith(`${t.context.fixture}/src/episode-posts/`)
  )
})

// building the site

test('builds without errors', (t) => {
  const { build } = t.context

  t.true(Array.isArray(build))
  t.true(build.length > 0)
})

test('feed is generated', (t) => {
  const { feed } = t.context
  t.true(feed !== undefined)
  t.true(feed.url === '/feed/podcast.xml')
})

test('episode posts are generated', (t) => {
  const { episodePosts } = t.context
  t.true(Array.isArray(episodePosts))
  t.true(episodePosts.length === 3)
})

// feed tests

test('episodes in feed have titles', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].title, 'The Giggle')
  t.is(episodes[1].title, 'Wild Blue Yonder')
  t.is(episodes[2].title, 'The Star Beast')
})

test('episodes in feed have links', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].link, 'https://thesecondgreatandbountifulhumanempire.com/3/')
  t.is(episodes[1].link, 'https://thesecondgreatandbountifulhumanempire.com/2/')
  t.is(episodes[2].link, 'https://thesecondgreatandbountifulhumanempire.com/1/')
})

test('episodes in feed have guids', (t) => {
  const { feed } = t.context
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].guid['#text'], 'https://thesecondgreatandbountifulhumanempire.com/3/')
  t.is(episodes[1].guid['#text'], 'https://thesecondgreatandbountifulhumanempire.com/2/')
  t.is(episodes[2].guid['#text'], 'https://thesecondgreatandbountifulhumanempire.com/1/')
  t.is(episodes[0].guid['@_isPermaLink'], 'true')
  t.is(episodes[1].guid['@_isPermaLink'], 'true')
  t.is(episodes[2].guid['@_isPermaLink'], 'true')
})

test('episodes in feed have dates', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].pubDate, '2023-12-11T00:00:00Z')
  t.is(episodes[1].pubDate, '2023-12-04T00:00:00Z')
  t.is(episodes[2].pubDate, '2023-11-26T00:00:00Z')
})

test('episodes in feed have lengths', (t) => {
  const { feed } = t.context
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].enclosure['@_length'], '31527863')
  t.is(episodes[1].enclosure['@_length'], '28683178')
  t.is(episodes[2].enclosure['@_length'], '32004399')
})

test('episodes in feed have durations', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0]['itunes:duration'], '29:25')
  t.is(episodes[1]['itunes:duration'], '26:27')
  t.is(episodes[2]['itunes:duration'], '32:27')
})

test('episodes in feed have episode numbers', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0]['itunes:episode'], 3)
  t.is(episodes[1]['itunes:episode'], 2)
  t.is(episodes[2]['itunes:episode'], 1)
})

// after

test.after.always(async (t) => {
  const cachedEpisodeDataPath = path.join(process.cwd(), `${t.context.fixture}/src/cachedEpisodeData.json`)
  try {
    unlinkSync(cachedEpisodeDataPath)
  } catch (error) {
    console.error(`Failed to delete ${cachedEpisodeDataPath}:`, error)
  }
})
