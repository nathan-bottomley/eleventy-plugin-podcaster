import test from 'ava'
import Eleventy from '@11ty/eleventy'
import podcasterPlugin from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

test('podcast data tests run', t => {
  t.pass()
})

test('podcastEpisode template produces <item> tag in feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcasterPlugin)
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', { tags: ['podcastEpisode'], date: '2020-01-01', title: 'Episode 1', permalink: '/1/' })
      eleventyConfig.addTemplate('episode-2.md', '# Episode 2', { tags: ['podcastEpisode'], date: '2020-01-02', title: 'Episode 2', permalink: '/2/' })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  // console.log(JSON.stringify(build, null, 2))
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.like(feedData, { rss: { channel: { item: [{ title: 'Episode 2' }, { title: 'Episode 1' }] } } })
})
