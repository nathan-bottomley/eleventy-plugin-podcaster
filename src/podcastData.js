import { DateTime } from 'luxon'

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData('eleventyComputed.podcast.feedPath', () => {
    return data => data.podcast.feedPath || '/feed/podcast.xml'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.imagePath', () => {
    return data => data.podcast.imagePath || '/img/podcast-logo.jpg'
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcast.episodeUrlBase', () => {
    return data => {
      if (data.podcast.episodeUrlBase) return data.podcast.episodeUrlBase
      let siteUrl
      try {
        siteUrl = data.podcast.siteUrl || data.site.url
      } catch (e) {
        console.error('[eleventy-plugin-podcaster] No site URL found. Please set `siteUrl` in your podcast data.')
      }
      return URL.parse('episodes/', siteUrl)
    }
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
      return `© ${yearRange} ${data.podcast.copyright || data.podcast.author}`
    }
  })

  eleventyConfig.addGlobalData('podcast.feedLastBuildDate', DateTime.now().toRFC2822())
}
