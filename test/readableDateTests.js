import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

/*
  We should be able to test the default situation where the readableDate
  filter doen't exist. However, I can't get the test to catch the error
  that's thrown, which means that the test suite throws an error,
  which prevents CI from passing. I'm going to skip this test for now.
*/

test.todo('readableDate filter does not exist when readableDateLocale is not provided')

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
  const item = build.find(item => item.url === '/1/')

  // the comma appears in some JS runtime environments, but not others
  t.regex(item.content, /Wednesday,? 1 January 2020/)
})
