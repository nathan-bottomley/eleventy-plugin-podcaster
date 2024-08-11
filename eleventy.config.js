import { DateTime } from 'luxon'
import rssPlugin from '@11ty/eleventy-plugin-rss'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export default function (eleventyConfig) {
  if (!('addTemplate' in eleventyConfig)) {
    console.log('[eleventy-plugin-podcasting] WARN Eleventy plugin compatibility: Virtual Templates are required for this plugin — please use Eleventy v3.0 or newer.')
  }

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })

  // feed defaults

  eleventyConfig.addGlobalData('eleventyComputed.podcast.feedPath', () => {
    return data => data.podcast.feedPath || '/feed/podcast.xml'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.imagePath', () => {
    return data => data.podcast.imagePath || '/img/podcast-logo.jpg'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.type', () => {
    return data => data.podcast.type || 'episodic'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.copyrightNotice', () => {
    return data => {
      const thisYear = DateTime.now().year
      let yearRange
      if (!data.podcast.startingYear || data.podcast.startingYear === thisYear) {
        yearRange = thisYear
      } else {
        yearRange = `${data.podcast.startingYear}–${thisYear}`
      }
      return `© ${yearRange} ${data.podcast.copyright}`
    }
  })

  eleventyConfig.addShortcode('feedLastBuildDate', () =>
    DateTime.now().toRFC2822()
  )

  eleventyConfig.addGlobalData('eleventyComputed.episodeUrl', function (filename) {
    return data => {
      const episodePrefix = data.podcast.episodePrefix
      return encodeURI(`${episodePrefix}${data.episodeFilename}`)
    }
  })

  eleventyConfig.addShortcode('year', () => DateTime.now().year)
  eleventyConfig.addFilter('readableDate', function (date) {
    if (date instanceof Date) {
      date = date.toISOString()
    }
    const result = DateTime.fromISO(date, {
      zone: 'UTC'
    })
    return result.setLocale('en-GB').toLocaleString(DateTime.DATE_HUGE)
  })

  const podcastFeedPath = path.join(import.meta.dirname, './src/podcastFeed.njk')

  eleventyConfig.addTemplate('feed.njk', readFileSync(podcastFeedPath), {
    eleventyExcludeFromCollections: true,
    eleventyImport: {
      collections: ['post']
    }
  })
}
