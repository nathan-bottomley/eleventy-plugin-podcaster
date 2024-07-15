import test from 'ava'
import Eleventy from '@11ty/eleventy'
import podcastingPlugin from 'eleventy-plugin-podcasting'
import { XMLParser } from 'fast-xml-parser'

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
  t.like(build, [{ url: '/feed/podcast' }])
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
