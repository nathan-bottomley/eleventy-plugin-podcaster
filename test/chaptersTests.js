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
  t.context.episodePosts = t.context.build.filter(
    item => item.inputPath.startsWith('./fixtures/chapters/episode-posts/')
  )
})

// building the site

test('builds without errors', (t) => {
  const { build } = t.context

  t.true(Array.isArray(build))
  t.true(build.length > 0)
})

// chapters.json files

test('chapters.json files are generated', (t) => {
  const { build } = t.context

  t.true(build.some(item => item.url === '/s1/e1/chapters.json'))
  t.true(build.some(item => item.url === '/s1/e2/chapters.json'))
  t.false(build.some(item => item.url === '/s2/e1/chapters.json'))
  t.false(build.some(item => item.url === '/s2/e2/chapters.json'))
})

// podcast:chapters tag in feed
//
test('podcast:chapters tags exist in feed', (t) => {
  const { feed } = t.context
  t.true(feed.content.includes('<podcast:chapters'))
})

test('items with chapters have podcast:chapters tags', (t) => {
  const { feed } = t.context
  const parser = new XMLParser()
  const feedData = parser.parse(feed.content)
  const episodes = feedData.rss.channel.item
  t.true('podcast:chapters' in episodes[2])
  t.true('podcast:chapters' in episodes[3])
  t.false('podcast:chapters' in episodes[0])
  t.false('podcast:chapters' in episodes[1])
})

test('chapter durations are converted into seconds', (t) => {
  const { build } = t.context
  const chaptersData = [
    build.find(item => item.url === '/s1/e1/chapters.json').content,
    build.find(item => item.url === '/s1/e2/chapters.json').content
  ]
  t.deepEqual(JSON.parse(chaptersData[0]).map(x => x.startTime), [0, 300, 600])
  t.deepEqual(JSON.parse(chaptersData[1]).map(x => x.startTime), [0, 300, 600])
})
