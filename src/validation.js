import isEpisodePost from './isEpisodePost.js'

function warn (message) {
  console.warn(`[podcaster] ${message}`)
}

function warnOrThrow (message) {
  if (process.env.ELEVENTY_RUN_MODE === 'build') {
    throw new Error(`[podcaster] ${message}`)
  } else {
    console.warn(`[podcaster] ${message}`)
  }
}

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addGlobalData('eleventyDataSchema', () => {
    return (data) => {
      if (!options.validation) return

      // podcast data

      if (!(data.podcast.siteUrl || data.site?.url)) {
        warnOrThrow('Site URL is required')
      }
      if (!data.podcast.title) {
        warnOrThrow('Podcast title is required')
      }
      if (!data.podcast.description) {
        warnOrThrow('Podcast description is required')
      }
      if (!data.podcast.language) {
        warnOrThrow('Podcast language is required')
      }
      if (!data.podcast.category) {
        warnOrThrow('Podcast category is required')
      }
      if (!data.podcast.author) {
        warnOrThrow('Podcast author is required')
      }

      // episode data

      if (isEpisodePost(data, options)) {
        if (!data.title) {
          warnOrThrow(`Episode title is required (${data.page.inputPath})`)
        }
        if (!data.episode.filename) {
          warnOrThrow(`Episode filename is required (${data.page.inputPath})`)
        }
        if (!data.episode.size) {
          warnOrThrow(`Episode size is required (${data.page.inputPath})`)
        }
        if (!data.episode.episodeNumber) {
          warn(`Episode number is recommended (${data.page.inputPath})`)
        }
        if (!data.episode.duration) {
          warn(`Episode duration is recommended (${data.page.inputPath})`)
        }
      }
    }
  })
}
