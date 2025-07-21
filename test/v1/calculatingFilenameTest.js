import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'

test('the generated `episodesData.json` file is used to calculate filenames from the episode number', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/calculatingFilename/src',
    './fixtures/calculatingFilename/_site',
    {
      configPath: './fixtures/calculatingFilename/eleventy.config.js'
    })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  const episodes = feedData.rss.channel.item
  t.true(episodes.some(episode => episode.description === 'filename: episode-1.mp3'))
  t.true(episodes.some(episode => episode.description === 'filename: episode-2.mp3'))
})

test('the generated `episodesData.json` file is used to calculate filenames from the episode and season number', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/calculatingFilenameWithSeason/src',
    './fixtures/calculatingFilenameWithSeason/_site',
    {
      configPath: './fixtures/calculatingFilenameWithSeason/eleventy.config.js'
    })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  const episodes = feedData.rss.channel.item
  t.true(episodes.some(episode => episode.description === 'filename: S2E1.mp3'))
  t.true(episodes.some(episode => episode.description === 'filename: S2E2.mp3'))
})
