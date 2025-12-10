import path from 'node:path'

import podcastFeed from './src/podcastFeed.js'
import podcastData from './src/podcastData.js'
import episodeData from './src/episodeData.js'
import calculateEpisodeSizeAndDuration from './src/calculateEpisodeSizeAndDuration.js'
import calculateEpisodeFilename from './src/calculateEpisodeFilename.js'

import readableFilters from './src/readableFilters.js'
import chapters from './src/chapters.js'
import excerpts from './src/excerpts.js'
import drafts from './src/drafts.js'
import pageTitle from './src/pageTitle.js'

export default function (eleventyConfig, options = {}) {
  const episodePostsDirectory = options.episodePostsDirectory ?? 'episode-posts'
  options.episodePostsDirectory = path.join(eleventyConfig.directories.input, episodePostsDirectory)
  const episodeFilesDirectory = options.episodeFilesDirectory ?? 'episode-files'
  options.episodeFilesDirectory = path.join(eleventyConfig.directories.input, episodeFilesDirectory)

  eleventyConfig.addPlugin(podcastFeed, options)
  eleventyConfig.addPlugin(podcastData, options)
  eleventyConfig.addPlugin(episodeData, options)
  eleventyConfig.addPlugin(calculateEpisodeSizeAndDuration, options)
  eleventyConfig.addPlugin(calculateEpisodeFilename, options)

  // Filters

  eleventyConfig.addPlugin(readableFilters, options)
  eleventyConfig.addPlugin(chapters, options)

  // Optional features

  if (options.optionalFeatures) {
    options.handleDrafts = true
    options.handleExcerpts = true
    options.handlePageTitle ??= true // preserve setting for custom separators
  }

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
