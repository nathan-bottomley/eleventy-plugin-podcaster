import { DateTime, Duration } from 'luxon'
import hr from '@tsmx/human-readable'
import rssPlugin from '@11ty/eleventy-plugin-rss'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import calculateFilenameSizeAndDuration from './src/calculateFilenameSizeAndDuration.js'
import excerpts from './src/excerpts.js'
import drafts from './src/drafts.js'

export default function (eleventyConfig, options = {}) {
  if (!('addTemplate' in eleventyConfig)) {
    console.log('[eleventy-plugin-podcasting] WARN Eleventy plugin compatibility: Virtual Templates are required for this plugin — please use Eleventy v3.0 or newer.')
  }

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.feedPath', () => {
    return data => data.podcast.feedPath || '/feed/podcast.xml'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.imagePath', () => {
    return data => data.podcast.imagePath || '/img/podcast-logo.jpg'
  })

  function calculateCopyrightNotice () {
    return data => {
      const thisYear = DateTime.now().year
      let yearRange
      if (!data.podcast.startingYear || data.podcast.startingYear === thisYear) {
        yearRange = thisYear
      } else {
        yearRange = `${data.podcast.startingYear}–${thisYear}`
      }
      return `© ${yearRange} ${data.podcast.copyright || data.podcast.author}`
    }
  }

  eleventyConfig.addGlobalData(
    'eleventyComputed.podcast.copyrightNotice',
    calculateCopyrightNotice
  )

  eleventyConfig.addGlobalData(
    'eleventyComputed.copyrightNotice',
    calculateCopyrightNotice
  )

  eleventyConfig.addGlobalData(
    'podcast.feedLastBuildDate',
    DateTime.now().toRFC2822()
  )

  eleventyConfig.addGlobalData('eleventyComputed.episode.url', () => {
    return data => {
      if (!data.tags?.includes('podcastEpisode')) return

      const episodeUrlBase = data.podcast.episodeUrlBase
      const filename = data.episode.filename
      return new URL(filename, episodeUrlBase).toString()
    }
  })

  eleventyConfig.addShortcode('year', () => DateTime.now().year)

  if (options.readableDateLocale) {
    eleventyConfig.addFilter('readableDate', function (date) {
      if (date instanceof Date) {
        date = date.toISOString()
      }
      const result = DateTime.fromISO(date, {
        zone: 'UTC'
      })
      return result.setLocale(options.readableDateLocale).toLocaleString(DateTime.DATE_HUGE)
    })
  }

  if (options.calculatePageTitle) {
    const separator = options.calculatePageTitle === true ? '&middot;' : options.calculatePageTitle

    eleventyConfig.addGlobalData('eleventyComputed.pageTitle', () => {
      return data => {
        const siteTitle = data.site?.title || data.podcast.title
        if (data.title && data.title.length > 0 && data.title !== siteTitle) {
          return `${data.title} ${separator} ${siteTitle}`
        } else {
          return siteTitle
        }
      }
    })
  }

  eleventyConfig.addFilter('readableDuration', (seconds, omitLeadingZero) => {
    if (!seconds) return '0:00:00'
    if (omitLeadingZero && seconds < 3600) {
      return Duration.fromMillis(seconds * 1000).toFormat('mm:ss')
    }
    return Duration.fromMillis(seconds * 1000).toFormat('h:mm:ss')
  })

  eleventyConfig.addFilter('readableSize', (bytes, fixedPrecision) =>
    (fixedPrecision)
      ? hr.fromBytes(bytes, { fixedPrecision })
      : hr.fromBytes(bytes)
  )

  const podcastFeedPath = path.join(import.meta.dirname, './src/podcastFeed.njk')

  eleventyConfig.addTemplate('feed.njk', readFileSync(podcastFeedPath), {
    eleventyExcludeFromCollections: true,
    eleventyImport: {
      collections: ['podcastEpisode']
    }
  })

  if (options.handleEpisodePermalinks) {
    eleventyConfig.addGlobalData('eleventyComputed.permalink', () => {
      return data => {
        if (data.permalink) return data.permalink

        if (data.tags?.includes('podcastEpisode')) {
          if (data.episode?.seasonNumber) {
            return `/s${data.episode.seasonNumber}/e${data.episode.episodeNumber}/`
          } else {
            return `/${data.episode.episodeNumber}/`
          }
        }
      }
    })
  }

  eleventyConfig.addPlugin(calculateFilenameSizeAndDuration, options)
  eleventyConfig.addPlugin(excerpts, options)
  eleventyConfig.addPlugin(drafts, options)
}
