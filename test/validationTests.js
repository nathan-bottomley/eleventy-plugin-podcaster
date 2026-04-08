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

function addRequiredPodcastData (eleventyConfig) {
  eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
  eleventyConfig.addGlobalData('podcast.title', 'Flight Through Entirety')
  eleventyConfig.addGlobalData('podcast.description', 'A Doctor Who podcast')
  eleventyConfig.addGlobalData('podcast.language', 'en')
  eleventyConfig.addGlobalData('podcast.category', 'TV & Film')
  eleventyConfig.addGlobalData('podcast.author', 'FTE Studios')
}

const requiredEpisodeData = {
  title: 'Season 18, Episode 3',
  episode: {
    filename: 's18e3.mp3',
    size: 123456,
    duration: '5:00'
  }
}

function requiredEpisodeDataWith (overrides) {
  return {
    ...requiredEpisodeData,
    episode: { ...requiredEpisodeData.episode, ...overrides }
  }
}

test.serial('the default behaviour is unchanged when the validation option is false', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: false })
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const errors = []
  const error = console.error
  console.error = (msg) => errors.push(msg)
  await eleventy.toJSON()
  console.error = error
  t.true(errors.some(e => e.includes('No site URL found')), JSON.stringify(errors))
})

// podcast data

test.serial("a warning is logged in serve mode when there's no site URL", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'serve',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.siteUrl', null)
      eleventyConfig.addGlobalData('site.url', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const { warnings } = await withCapturedWarnings(() => eleventy.toJSON())
  const expectedWarning = 'Site URL is required'
  t.true(warnings.some(w => w.includes(expectedWarning)), JSON.stringify(warnings))
})

test.serial("an error is thrown in build mode when there's no site URL", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.siteUrl', null)
      eleventyConfig.addGlobalData('site.url', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Site URL is required'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no podcast title", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addGlobalData('podcast.title', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Podcast title is required'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no podcast description", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.description', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Podcast description is required'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no podcast language", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.language', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Podcast language is required'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no podcast category", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.category', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Podcast category is required'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no podcast author", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addGlobalData('podcast.author', null)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeData
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Podcast author is required'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

// episode data

test.serial("an error is thrown when there's no episode title", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        { ...requiredEpisodeData, title: null }
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Episode title is required (./test/episode-posts/2020-01-10-s18e3.md)'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no episode filename", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeDataWith({ filename: null })
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Episode filename is required (./test/episode-posts/2020-01-10-s18e3.md)'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("an error is thrown when there's no episode size", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeDataWith({ size: null })
      )
    }
  })
  const error = await withSuppressedStderr(() => t.throwsAsync(() => eleventy.toJSON()))
  const expectedError = 'Episode size is required (./test/episode-posts/2020-01-10-s18e3.md)'
  t.true(error.originalError.message.includes(expectedError), error.originalError.message)
})

test.serial("a warning is logged when there's no episode number", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-this-episode.md',
        '# Season 18, Episode 3',
        requiredEpisodeDataWith({ episodeNumber: null })
      )
    }
  })
  const { warnings } = await withCapturedWarnings(() => eleventy.toJSON())
  const expectedWarning = 'Episode number is recommended'
  t.true(warnings.some(w => w.includes(expectedWarning)), JSON.stringify(warnings))
})

test.serial("a warning is logged when there's no episode duration", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    runMode: 'build',
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, { validation: true })
      addRequiredPodcastData(eleventyConfig)
      eleventyConfig.addTemplate(
        'episode-posts/2020-01-10-s18e3.md',
        '# Season 18, Episode 3',
        requiredEpisodeDataWith({ duration: null })
      )
    }
  })
  const { warnings } = await withCapturedWarnings(() => eleventy.toJSON())
  const expectedWarning = 'Episode duration is recommended'
  t.true(warnings.some(w => w.includes(expectedWarning)), JSON.stringify(warnings))
})
