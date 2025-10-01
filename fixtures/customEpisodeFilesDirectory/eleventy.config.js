import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    episodeFilesDirectory: '../episode-files'
  })
  eleventyConfig.setQuietMode(true)
  console.log(`custom directory test input dir ${eleventyConfig.directories.input}`)
}

export const config = {
  dir: {
    input: 'fixtures/customEpisodeFilesDirectory/src'
  }
}
