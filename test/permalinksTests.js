import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test('if specified in the filename, the permalink of an episode will be its number', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/2020-01-01-ep12.md', '# Episode 12', {
        title: 'Episode 12',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(
    item => item.inputPath === './test/episode-posts/2020-01-01-ep12.md'
  )
  t.is(item.url, '/12/')
})

test('if specified in the filename, the permalink will include the season and episode number', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/2020-01-10-s18e3.md', '# Season 18, Episode 3', {
        title: 'Season 18, Episode 3',
        episode: {
          filename: 'season-18-episode-3.mp3'
        }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './test/episode-posts/2020-01-10-s18e3.md')
  t.is(item.url, '/s18/e3/')
})

test('season and episode numbers can be provided in front matter instead of the filename', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com/')
      eleventyConfig.addTemplate('episode-posts/2020-01-10-episode.md', '# Season 18, Episode 3', {
        title: 'Season 18, Episode 3',
        episode: {
          episodeNumber: 3,
          seasonNumber: 18,
          filename: 'season-18-episode-3.mp3'
        }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './test/episode-posts/2020-01-10-episode.md')
  t.is(item.url, '/s18/e3/')
})

test('specified permalinks can be overridden by a directory data file using front matter data', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/permalinks/',
    './fixtures/permalinks/_site',
    {
      configPath: './fixtures/permalinks/eleventy.config.js'
    })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './fixtures/permalinks/episode-posts/2023-11-26-episode-1-the-star-beast.md')
  t.is(item.url, '/overridden/1/the-star-beast/')
})

test('an episode permalink pattern can be used to specify permalinks', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        siteUrl: 'https://example.com/',
        episodePermalinkPattern: '/season/{seasonNumber}/episode/{episodeNumber}/{titleSlug}/'
      })
      eleventyConfig.addTemplate('episode-posts/2020-01-01-s1e12.md', '# Season 1, Episode 12', {
        title: 'The Star Beast',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './test/episode-posts/2020-01-01-s1e12.md')
  console.log(JSON.stringify(item, null, 2))
  t.is(item.url, '/season/1/episode/12/the-star-beast/')
})
