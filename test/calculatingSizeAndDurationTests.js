import test from 'ava'
import Eleventy from '@11ty/eleventy'
import { XMLParser } from 'fast-xml-parser'
import Podcaster from 'eleventy-plugin-podcaster'

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

test('if duration is provided in frontmatter in `h:mm:ss` format, it is displayed in a template as a number of seconds', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episodePosts/episode-1.md', '# Episode 1\n\nduration: {{ episode.duration }}', {
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', duration: '24:58' }
      })
      eleventyConfig.addTemplate('episodePosts/episode-2.md', '# Episode 2\n\nduration: {{ episode.duration }}', {
        date: '2020-02-01',
        title: 'Episode 2',
        permalink: '/2/',
        episode: { filename: 'episode-2.mp3', duration: '1:23:12' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item1 = build.find(item => item.url === '/1/')
  t.true(item1.content.includes('duration: 1498'), `duration of 1498 not found in ${item1.content}`)
  const item2 = build.find(item => item.url === '/2/')
  t.true(item2.content.includes('duration: 4992'), `duration of 4992 not found in ${item2.content}`)
})
