import { DateTime, Duration } from 'luxon'
import hr from '@tsmx/human-readable'
import rssPlugin from '@11ty/eleventy-plugin-rss'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import calculateFilenameSizeAndDuration from './src/calculateFilenameSizeAndDuration.js'
// import excerpts from './src/excerpts.js'
// import drafts from './src/drafts.js'

export default function (eleventyConfig) {
  if (!('addTemplate' in eleventyConfig)) {
    console.log('[eleventy-plugin-podcasting] WARN Eleventy plugin compatibility: Virtual Templates are required for this plugin — please use Eleventy v3.0 or newer.')
  }

  eleventyConfig.addCollection('podcastEpisode', (collectionApi) => {
    return collectionApi.getFilteredByGlob('**/episodePosts/*')
  })

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })

  // Global podcast data

  eleventyConfig.addGlobalData('eleventyComputed.podcast.feedPath', () => {
    return data => data.podcast.feedPath || '/feed/podcast.xml'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.imagePath', () => {
    return data => data.podcast.imagePath || '/img/podcast-logo.jpg'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.episodeUrlBase', () => {
    return data => {
      if (data.podcast.episodeUrlBase) return data.podcast.episodeUrlBase

      const siteUrl = data.podcast.siteUrl || data.site.url
      return path.join(siteUrl, 'episodes')
    }
  })

  eleventyConfig.addGlobalData(
    'eleventyComputed.podcast.copyrightNotice',
    () => {
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
  )

  eleventyConfig.addGlobalData(
    'podcast.feedLastBuildDate',
    DateTime.now().toRFC2822()
  )

  // Global episode data

  eleventyConfig.addGlobalData(
    'eleventyComputed.episode.episodeNumber',
    () => {
      return data => {
        if (data.episode?.episodeNumber) return data.episode.episodeNumber

        if (data.page.inputPath.includes('/episodePosts/')) {
          const match = data.page.fileSlug.match(/(?<episodeNumber>\d+)/)
          if (match?.groups?.episodeNumber) {
            return parseInt(match.groups.episodeNumber, 10)
          } else {
            console.warn(`[eleventy-plugin-podcaster] Unable to determine episode number for ${data.page.inputPath}. Please ensure the file slug contains a number or set the episodeNumber explicitly in the front matter.`)
          }
        }
      }
    }
  )

  eleventyConfig.addGlobalData(
    'eleventyComputed.permalink',
    () => {
      return data => {
        if (data.permalink) return data.permalink

        if (data.episode?.episodeNumber) {
          return `/${data.episode.episodeNumber}/`
        }
      }
    }
  )

  eleventyConfig.addGlobalData('eleventyComputed.episode.url', () => {
    return data => {
      if (!data.page.inputPath.includes('/episodePosts/')) return

      const episodeUrlBase = data.podcast.episodeUrlBase
      const filename = data.episode.filename
      return path.join(episodeUrlBase, filename)
    }
  })

  eleventyConfig.addPlugin(calculateFilenameSizeAndDuration)

  // eleventyConfig.addShortcode('year', () => DateTime.now().year)

  // if (options.calculatePageTitle) {
  //   const separator = options.calculatePageTitle === true ? '&middot;' : options.calculatePageTitle

  //   eleventyConfig.addGlobalData('eleventyComputed.pageTitle', () => {
  //     return data => {
  //       const siteTitle = data.site?.title || data.podcast.title
  //       if (data.title && data.title.length > 0 && data.title !== siteTitle) {
  //         return `${data.title} ${separator} ${siteTitle}`
  //       } else {
  //         return siteTitle
  //       }
  //     }
  //   })
  // }

  // Filters

  eleventyConfig.addFilter('readableDate', function (date) {
    if (date instanceof Date) {
      date = date.toISOString()
    }
    const result = DateTime.fromISO(date, {
      zone: 'UTC'
    })
    return result.setLocale('en-AU').toLocaleString(DateTime.DATE_HUGE)
  })

  eleventyConfig.addFilter('readableDuration', (seconds) => {
    if (!seconds) return '0:00:00'
    if (seconds < 3600) {
      return Duration.fromMillis(seconds * 1000).toFormat('mm:ss')
    }
    return Duration.fromMillis(seconds * 1000).toFormat('h:mm:ss')
  })

  eleventyConfig.addFilter('readableSize', (bytes, fixedPrecision = 1) =>
    hr.fromBytes(bytes, { fixedPrecision })
  )

  // Podcast feed template

  const podcastFeedPath = path.join(import.meta.dirname, './src/podcastFeed.njk')

  eleventyConfig.addTemplate('feed.njk', readFileSync(podcastFeedPath), {
    eleventyExcludeFromCollections: true,
    eleventyImport: {
      collections: ['podcastEpisode']
    }
  })
}
