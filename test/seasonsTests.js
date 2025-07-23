import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'

test.before(async (t) => {
  const eleventy = new Eleventy(
    './fixtures/seasons',
    './fixtures/seasons/_site',
    {
      configPath: './fixtures/seasons/eleventy.config.js'
    })
  t.context.build = await eleventy.toJSON()
  console.log(t.context.build)
  t.context.feed = t.context.build.find(
    item => item.inputPath === './fixtures/seasons/feed.njk'
  )
  t.context.episodePosts = t.context.build.filter(
    item => item.inputPath.startsWith('./fixtures/seasons/episodePosts/')
  )
})

// building the site

test('builds without errors', (t) => {
  const { build } = t.context

  t.true(Array.isArray(build))
  t.true(build.length > 0)
})

// feed data is correct

test('episodes in feed have links with season numbers', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].link, 'https://500yeardiary.com/s2/e2/')
  t.is(episodes[1].link, 'https://500yeardiary.com/s2/e1/')
  t.is(episodes[2].link, 'https://500yeardiary.com/s1/e2/')
  t.is(episodes[3].link, 'https://500yeardiary.com/s1/e1/')
})

test('episodes in feed have episode urls with season numbers', (t) => {
  const { feed } = t.context
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].enclosure['@_url'], 'https://500yeardiary.com/episodes/500YD%20S2E2,%20The%20Show%20as%20We%20Know%20It%20(The%20Moonbase).mp3')
  t.is(episodes[1].enclosure['@_url'], 'https://500yeardiary.com/episodes/500YD%20S2E1,%20Daleks%20Daleks%20(The%20Dalek%20Invasion%20of%20Earth).mp3')
  t.is(episodes[2].enclosure['@_url'], 'https://500yeardiary.com/episodes/500YD%20S1E2,%20The%20Pertwee%20I%20Have%20in%20My%20Head%20(Spearhead%20from%20Space).mp3')
  t.is(episodes[3].enclosure['@_url'], 'https://500yeardiary.com/episodes/500YD%20S1E1,%20Entering%20a%20New%20Phase%20(The%20Power%20of%20the%20Daleks).mp3')
})

test('episodes in feed have season numbers', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0]['itunes:season'], 2)
  t.is(episodes[1]['itunes:season'], 2)
  t.is(episodes[2]['itunes:season'], 1)
  t.is(episodes[3]['itunes:season'], 1)
})

test('episodes in feed have episode numbers', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0]['itunes:episode'], 2)
  t.is(episodes[1]['itunes:episode'], 1)
  t.is(episodes[2]['itunes:episode'], 2)
  t.is(episodes[3]['itunes:episode'], 1)
})

// episode posts are generated correctly

test('episode posts have permalinks that match their episode numbers', (t) => {
  const { episodePosts } = t.context
  t.is(episodePosts[0].url, '/s1/e1/')
  t.is(episodePosts[1].url, '/s1/e2/')
  t.is(episodePosts[2].url, '/s2/e1/')
  t.is(episodePosts[3].url, '/s2/e2/')
})

test('episode posts can display their season and episode number correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('Season 1, Episode 1'))
  t.true(episodePosts[1].content.includes('Season 1, Episode 2'))
  t.true(episodePosts[2].content.includes('Season 2, Episode 1'))
  t.true(episodePosts[3].content.includes('Season 2, Episode 2'))
})
