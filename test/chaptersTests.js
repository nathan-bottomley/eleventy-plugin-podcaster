import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'

test.before(async (t) => {
  const eleventy = new Eleventy(
    './fixtures/chapters',
    './fixtures/chapters/_site',
    {
      configPath: './fixtures/chapters/eleventy.config.js'
    })
  t.context.build = await eleventy.toJSON()
  t.context.feed = t.context.build.find(
    item => item.inputPath === './fixtures/chapters/feed.njk'
  )
  const parser = new XMLParser({ ignoreAttributes: false })
  t.context.feedData = parser.parse(t.context.feed.content)

  const episodes = t.context.feedData.rss.channel.item
  t.context.testEpisode = {
    withChapters1: episodes.find(item => item.title === 'Entering a New Phase'),
    withChapters2: episodes.find(item => item.title === 'The Pertwee I Have in My Head'),
    withoutChapters: episodes.find(item => item.title === 'Establishment Drag'),
    withChapterFile1: episodes.find(item => item.title === 'Daleks Daleks'),
    withChapterFile2: episodes.find(item => item.title === 'The Show as We Know It')
  }
})

// building the site

test('builds without errors', (t) => {
  const { build } = t.context

  t.true(Array.isArray(build))
  t.true(build.length > 0)
})

// chapters.json files

test('chapters.json files are generated for items with chapters', (t) => {
  const { build } = t.context

  t.true(build.some(item => item.url === '/s1/e1/chapters.json'))
  t.true(build.some(item => item.url === '/s1/e2/chapters.json'))
  t.false(build.some(item => item.url === '/s2/e1/chapters.json'))
  t.false(build.some(item => item.url === '/s2/e2/chapters.json'))
})

test('podcast:chapters tags exist in feed', (t) => {
  const { feed } = t.context
  t.true(feed.content.includes('<podcast:chapters'))
})

test('items with chapters have podcast:chapters tags', (t) => {
  const { testEpisode } = t.context
  t.true('podcast:chapters' in testEpisode.withChapters1)
  t.true('podcast:chapters' in testEpisode.withChapters2)
})

test('items with chapter file have podcast:chapters tags', (t) => {
  const { testEpisode } = t.context
  t.true('podcast:chapters' in testEpisode.withChapterFile1)
  t.true('podcast:chapters' in testEpisode.withChapterFile2)
})

test("items without chapters or chapter file don't have podcast:chapters tags", (t) => {
  const { testEpisode } = t.context
  t.false('podcast:chapters' in testEpisode.withoutChapters)
})

test('items with chapters have podcast:chapters tags containing URLs', (t) => {
  const { testEpisode } = t.context
  t.is(testEpisode.withChapters1['podcast:chapters']['@_url'], 'https://500yeardiary.example.com/s1/e1/chapters.json')
  t.is(testEpisode.withChapters2['podcast:chapters']['@_url'], 'https://500yeardiary.example.com/s1/e2/chapters.json')
})

test('items with chapter file have podcast:chapters tags containing URLs', (t) => {
  const { testEpisode } = t.context
  t.is(testEpisode.withChapterFile1['podcast:chapters']['@_url'], 'https://500yeardiary.example.com/chapters/the-dalek-invasion-of-earth.json')
  t.is(testEpisode.withChapterFile2['podcast:chapters']['@_url'], 'https://500yeardiary.example.com/chapters/the-moonbase.json')
})
