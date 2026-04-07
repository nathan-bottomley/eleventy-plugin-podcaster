import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

async function withCapturedWarnings (fn) {
  const warnings = []
  const warn = console.warn
  console.warn = (msg) => warnings.push(msg)
  try {
    return { result: await fn(), warnings }
  } finally {
    console.warn = warn
  }
}

async function withSuppressedStderr (fn) {
  const write = process.stderr.write.bind(process.stderr)
  process.stderr.write = () => true
  try {
    return await fn()
  } finally {
    process.stderr.write = write
  }
}

test.serial('the default behaviour is unchanged when the validation option is false', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: false })
      eleventyConfig.addTemplate('episode-posts/2020-01-10-s18e3.md', '# Season 18, Episode 3', {
        title: 'Season 18, Episode 3',
        episode: {
          filename: 's18e3.mp3'
        }
      })
    }
  })
  const errors = []
  const error = console.error
  console.error = (msg) => errors.push(msg)
  await eleventy.toJSON()
  console.error = error
  t.true(errors.some(e => e.includes('No site URL found')))
})

test.serial("an error is thrown in build mode when there's no episode filename", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      // eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/2020-01-10-s18e3.md', '# Season 18, Episode 3', {
        title: 'Season 18, Episode 3',
        episode: {
          filename: null
        }
      })
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Episode filename is required (./test/episode-posts/2020-01-10-s18e3.md)'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("a warning is logged in serve mode when there's no episode filename", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'serve',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      // eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/2020-01-10-s18e3.md', '# Season 18, Episode 3', {
        title: 'Season 18, Episode 3',
        episode: {
          filename: null
        }
      })
    }
  })
  const { warnings } = await withCapturedWarnings(() => eleventy.toJSON())
  const expectedWarning = 'Episode filename is required (./test/episode-posts/2020-01-10-s18e3.md)'
  t.true(warnings.some(w => w.includes(expectedWarning)), JSON.stringify(warnings))
})
