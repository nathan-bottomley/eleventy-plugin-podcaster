import test from 'ava'
import Eleventy from '@11ty/eleventy'
import podcastingPlugin from 'eleventy-plugin-podcasting'

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
