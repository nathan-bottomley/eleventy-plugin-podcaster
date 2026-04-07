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
      if (!isEpisodePost(data, options)) return

      if (!data.episode.filename) {
        warnOrThrow(`Episode filename is required (${data.page.inputPath})`)
      }
    }
  })
}
