import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'

test('when feedEpisodeContentTemplate is provided, it is used to populate the <content:encoded> tag', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/feedTemplate/src',
    './fixtures/feedTemplate/_site',
    {
      configPath: './fixtures/feedTemplate/eleventy.config.js'
    })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  const episodes = feedData.rss.channel.item
  t.true(episodes.some(episode => episode['content:encoded'] === 'feed-episode-content 1'))
  t.true(episodes.some(episode => episode['content:encoded'] === 'feed-episode-content 2'))
})

test('when feedEpisodeDescriptionTemplate is provided, it is used to populate the <description> tag', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/feedTemplate/src',
    './fixtures/feedTemplate/_site',
    {
      configPath: './fixtures/feedTemplate/eleventy.config.js'
    })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  const episodes = feedData.rss.channel.item
  t.true(episodes.some(episode => episode.description === 'feed-episode-description 1'))
  t.true(episodes.some(episode => episode.description === 'feed-episode-description 2'))
})

test('when feedEpisodeSummaryTemplate is provided, it is used to populate the <itunes:summary> tag', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/feedTemplate/src',
    './fixtures/feedTemplate/_site',
    {
      configPath: './fixtures/feedTemplate/eleventy.config.js'
    })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  const episodes = feedData.rss.channel.item
  t.true(episodes.some(episode => episode['itunes:summary'] === 'feed-episode-summary 1'))
  t.true(episodes.some(episode => episode['itunes:summary'] === 'feed-episode-summary 2'))
})
