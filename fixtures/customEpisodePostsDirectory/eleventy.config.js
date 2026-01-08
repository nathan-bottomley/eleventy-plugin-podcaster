import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    episodePostsDirectory: 'custom-episode-posts'
  })
  eleventyConfig.setQuietMode(true)
}
