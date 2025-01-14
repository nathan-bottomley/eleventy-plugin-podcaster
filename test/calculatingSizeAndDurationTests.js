import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'

test('the generated `episodesData.json` file is used to calculate size and duration', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/calculatingSizeAndDuration/src',
    './fixtures/calculatingSizeAndDuration/_site',
    {
      configPath: './fixtures/calculatingSizeAndDuration/eleventy.config.js'
    })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  const episodes = feedData.rss.channel.item
  t.true(episodes.some(episode => episode.description === 'size: 28683178. duration: 1587.905'))
  t.true(episodes.some(episode => episode.description === 'size: 32004399. duration: 1947.481'))
})
