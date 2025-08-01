import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    episodesDir: 'fixtures/generatingEpisodesDataFile/episodes',
    episodeFilenamePattern: /2GAB (?<episodeNumber>\d+),.*.mp3/
  })
}
