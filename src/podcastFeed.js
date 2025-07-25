import rssPlugin from '@11ty/eleventy-plugin-rss'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export default function (eleventyConfig, options = {}) {
  if (!('addTemplate' in eleventyConfig)) {
    console.error('[eleventy-plugin-podcasting] Eleventy plugin compatibility: Virtual Templates are required for this plugin — please use Eleventy v3.0 or newer.')
  }

  const podcastFeedPath = path.join(import.meta.dirname, './podcastFeed.njk')

  eleventyConfig.addTemplate('feed.njk', readFileSync(podcastFeedPath), {
    eleventyExcludeFromCollections: true,
    eleventyImport: {
      collections: ['podcastEpisode']
    }
  })

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })

  eleventyConfig.addCollection('podcastEpisode', (collectionApi) => {
    return collectionApi.getFilteredByGlob('**/episodePosts/*')
  })
}
