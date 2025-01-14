import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    episodeFilenamePattern: /S(?<seasonNumber>\d+)E(?<episodeNumber>\d+).mp3/
  })
}
