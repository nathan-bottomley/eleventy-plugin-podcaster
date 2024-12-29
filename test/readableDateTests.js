import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test('readableDate filter does not exist by default', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addTemplate('index.md', '{{ date | readableDate }}', {
        date: '2020-01-01',
        title: 'Readable Date test',
        permalink: '/1/'
      })
    }
  })
  await t.throwsAsync(async () => { await eleventy.toJSON() },
    undefined,
    'Having trouble rendering liquid template ./test/index.md'
  )
})

test('readableDate filter exists when readableDateLocale is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { readableDateLocale: 'en-GB' })
      eleventyConfig.addTemplate('index.md', '{{ date | readableDate }}', {
        date: '2020-01-01',
        title: 'Readable Date test',
        permalink: '/1/'
      })
    }
  })
  const build = await eleventy.toJSON()
  console.log(build)
  t.regex(build[0].content, /Wednesday 1 January 2020/)
})
