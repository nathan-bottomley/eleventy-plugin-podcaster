import podcastFeed from './src/podcastFeed.js'
import podcastData from './src/podcastData.js'
import episodeData from './src/episodeData.js'
import calculateFilenameSizeAndDuration from './src/calculateFilenameSizeAndDuration.js'
import readableFilters from './src/readableFilters.js'
import excerpts from './src/excerpts.js'
import drafts from './src/drafts.js'
import pageTitle from './src/pageTitle.js'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addPlugin(podcastFeed, options)
  eleventyConfig.addPlugin(podcastData, options)
  eleventyConfig.addPlugin(episodeData, options)
  eleventyConfig.addPlugin(calculateFilenameSizeAndDuration, options)

  // Filters

  eleventyConfig.addPlugin(readableFilters, options)

  // Optional features

  if (options.handleExcerpts) {
    eleventyConfig.addPlugin(excerpts, options)
  }
  if (options.handleDrafts) {
    eleventyConfig.addPlugin(drafts, options)
  }
  if (options.handlePageTitle) {
    eleventyConfig.addPlugin(pageTitle, options)
  }
}
