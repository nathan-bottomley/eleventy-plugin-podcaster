import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Podcaster)
  eleventyConfig.setQuietMode(true)
}
