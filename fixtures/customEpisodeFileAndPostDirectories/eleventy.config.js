import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Podcaster, {
    episodePostsDirectory: 'posts',
    episodeFilesDirectory: '../episodes'
  })
  eleventyConfig.setQuietMode(false)
}
