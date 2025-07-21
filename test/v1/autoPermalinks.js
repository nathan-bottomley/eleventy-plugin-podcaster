import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'

test("by default, Podcaster doesn't automatically do permalinks", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        episode: {
          filename: 'episode-1.mp3',
          itunesTitle: 'iTunes Title',
          episodeNumber: 12
        }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './test/episode-1.md')
  t.not(item.url, '/12/')
})

test('if enabled, the permalink of an episode will be its number', async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, {
        handleEpisodePermalinks: true
      })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        episode: {
          filename: 'episode-1.mp3',
          itunesTitle: 'iTunes Title',
          episodeNumber: 12
        }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './test/episode-1.md')
  t.is(item.url, '/12/')
})

test("if there's a season number, the permalink will include it", async (t) => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster, {
        handleEpisodePermalinks: true
      })
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        episode: {
          filename: 'episode-1.mp3',
          itunesTitle: 'iTunes Title',
          seasonNumber: 18,
          episodeNumber: 3
        }
      })
    }
  })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './test/episode-1.md')
  t.is(item.url, '/s18/e3/')
})

test('auto permalinks can be overridden by a directory data file', async (t) => {
  const eleventy = new Eleventy(
    './fixtures/autoPermalinks/src',
    './fixtures/autoPermalinks/_site',
    {
      configPath: './fixtures/autoPermalinks/eleventy.config.js'
    })

  const build = await eleventy.toJSON()
  const item = build.find(item => item.inputPath === './fixtures/autoPermalinks/src/posts/episode-1.md')
  t.is(item.url, '/overridden/')
})
