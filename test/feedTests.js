import test from 'ava'
import Eleventy from '@11ty/eleventy'
import podcastingPlugin from 'eleventy-plugin-podcasting'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

test('feed tests run', t => {
  t.pass()
})

test('RSS feed template renders', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
    }
  })
  const build = await eleventy.toJSON()
  const feed = build[0].content
  t.true(XMLValidator.validate(feed))
})

test('RSS feed contains correct information', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
      eleventyConfig.addGlobalData('podcast', {
        title: 'Test Podcast',
        subtitle: 'A test podcast. With cake.',
        description: 'A test podcast with excellent content. With cake.'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.like(feedData, {
    rss: {
      channel: {
        title: 'Test Podcast',
        'itunes:subtitle': 'A test podcast. With cake.',
        description: 'A test podcast with excellent content. With cake.'
      }
    }
  })
})

test('RSS feed is valid XML', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.truthy(feedData)
})

test('<itunes:type> defaults to episodic', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.like(feedData, { rss: { channel: { 'itunes:type': 'episodic' } } })
})

test('<itunes:type> can be set to serial', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
      eleventyConfig.addGlobalData('podcast', { type: 'serial' })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.like(feedData, { rss: { channel: { 'itunes:type': 'serial' } } })
})

test('<itunes:explicit> defaults to not existing', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:explicit' in feedData.rss.channel)
})

test('<itunes:explicit> can be set to true', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
      eleventyConfig.addGlobalData('podcast', { explicit: true })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.like(feedData, { rss: { channel: { 'itunes:explicit': true } } })
})

test('<itunes:explicit> can be set to false', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    config (eleventyConfig) {
      eleventyConfig.addPlugin(podcastingPlugin)
      eleventyConfig.addGlobalData('podcast', { explicit: false })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.like(feedData, { rss: { channel: { 'itunes:explicit': false } } })
})
