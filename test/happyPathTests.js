import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'
import { unlinkSync } from 'node:fs'
import path from 'node:path'

test.before(async (t) => {
  const eleventy = new Eleventy(
    './fixtures/happyPath',
    './fixtures/happyPath/_site',
    {
      configPath: './fixtures/happyPath/eleventy.config.js'
    })
  t.context.build = await eleventy.toJSON()
  console.log(t.context.build)
  t.context.episodePosts = t.context.build.filter(
    item => item.inputPath.startsWith('./fixtures/happyPath/episodePosts/')
  )
  t.context.feed = t.context.build.find(
    item => item.inputPath === './fixtures/happyPath/feed.njk'
  )
})

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

// podcast data in feed is correct

test('podcast data in feed is correct', (t) => {
  const { feed } = t.context
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(feed.content)
  t.is(feedData.rss.channel.title, 'The Second Great and Bountiful Human Empire')
  t.is(feedData.rss.channel.description, 'A Doctor Who flashcast by the people who brought you Flight Through Entirety')
  t.is(feedData.rss.channel.link, 'https://thesecondgreatandbountifulhumanempire.com')
  t.is(feedData.rss.channel['itunes:author'], 'Flight Through Entirety')
  t.is(feedData.rss.channel.language, 'en')
  t.is(feedData.rss.channel.copyright, `© ${new Date().getFullYear()} Flight Through Entirety`)
  t.is(feedData.rss.channel['itunes:category']['@_text'], 'TV & Film')
})

// episode data in feed is correct

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

test('episodes in feed have episode urls', (t) => {
  const { feed } = t.context
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.is(episodes[0].enclosure['@_url'], 'https:/thesecondgreatandbountifulhumanempire.com/episodes/TSGABHE 3, The Giggle.mp3')
  t.is(episodes[1].enclosure['@_url'], 'https:/thesecondgreatandbountifulhumanempire.com/episodes/TSGABHE 2, Wild Blue Yonder.mp3')
  t.is(episodes[2].enclosure['@_url'], 'https:/thesecondgreatandbountifulhumanempire.com/episodes/TSGABHE 1, The Star Beast.mp3')
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

// episode posts are generated correctly

test('episode posts have permalinks that match their episode numbers', (t) => {
  const { episodePosts } = t.context
  t.is(episodePosts[0].url, '/1/')
  t.is(episodePosts[1].url, '/2/')
  t.is(episodePosts[2].url, '/3/')
})

test('episode posts can display their titles correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('<h1>The Star Beast</h1>'))
  t.true(episodePosts[1].content.includes('<h1>Wild Blue Yonder</h1>'))
  t.true(episodePosts[2].content.includes('<h1>The Giggle</h1>'))
})

test('episode posts can display their dates correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('Date: Sunday 26 November 2023'))
  t.true(episodePosts[1].content.includes('Date: Monday 4 December 2023'))
  t.true(episodePosts[2].content.includes('Date: Monday 11 December 2023'))
})

test('episode posts can display their sizes correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('Size: 32.0 MB'))
  t.true(episodePosts[1].content.includes('Size: 28.7 MB'))
  t.true(episodePosts[2].content.includes('Size: 31.5 MB'))
})

test('episode posts can display their URLs correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('URL: https:/thesecondgreatandbountifulhumanempire.com/episodes/TSGABHE 1, The Star Beast.mp3'))
  t.true(episodePosts[1].content.includes('URL: https:/thesecondgreatandbountifulhumanempire.com/episodes/TSGABHE 2, Wild Blue Yonder.mp3'))
  t.true(episodePosts[2].content.includes('URL: https:/thesecondgreatandbountifulhumanempire.com/episodes/TSGABHE 3, The Giggle.mp3'))
})

test('episode posts can display their filenames correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('Filename: TSGABHE 1, The Star Beast.mp3'))
  t.true(episodePosts[1].content.includes('Filename: TSGABHE 2, Wild Blue Yonder.mp3'))
  t.true(episodePosts[2].content.includes('Filename: TSGABHE 3, The Giggle.mp3'))
})

test('episode posts can display their durations correctly', (t) => {
  const { episodePosts } = t.context
  t.true(episodePosts[0].content.includes('Duration: 32:27'))
  t.true(episodePosts[1].content.includes('Duration: 26:27'))
  t.true(episodePosts[2].content.includes('Duration: 29:25'))
})
// after

test.after.always(async (t) => {
  const episodeDataPath = path.join(process.cwd(), 'fixtures', 'happyPath', '_data', 'episodeData.json')
  try {
    unlinkSync(episodeDataPath)
    console.log(`Deleted ${episodeDataPath}`)
  } catch (error) {
    console.error(`Failed to delete ${episodeDataPath}:`, error)
  }
})
