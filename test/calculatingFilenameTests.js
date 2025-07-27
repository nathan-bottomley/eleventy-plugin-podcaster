import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'

test('the generated `episodeData.json` file is used to calculate filenames from the episode number', async (t) => {
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
  t.is(
    episodes.find(item => item.title === 'Episode 1').description,
    'filename: 2GAB 1, The Star Beast.mp3'
  )
  t.is(
    episodes.find(item => item.title === 'Episode 2').description,
    'filename: 2gab-2-wild-blue-yonder.mp3'
  )
  t.is(
    episodes.find(item => item.title === 'Season 2, Episode 1').description,
    'filename: 500YD S2E1, Daleks Daleks (The Dalek Invasion of Earth).mp3'
  )
  t.is(
    episodes.find(item => item.title === 'Season 2, Episode 11').description,
    'filename: 500YD S2E11, Behind Her (The Well).mp3'
  )
})
