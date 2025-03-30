import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(Podcaster, {
    handlePermalinks: true
  })
}
