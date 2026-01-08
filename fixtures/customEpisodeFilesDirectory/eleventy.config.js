import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    episodeFilesDirectory: '../episode-files'
  })
  eleventyConfig.setQuietMode(true)
}

export const config = {
  dir: {
    input: 'fixtures/customEpisodeFilesDirectory/src'
  }
}
