import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    episodeFilenamePattern: /episode-(?<episodeNumber>\d+).mp3/
  })
}
