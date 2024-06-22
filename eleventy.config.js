import { readFile } from 'node:fs/promises'
import { DateTime } from 'luxon'
import rssPlugin from '@11ty/eleventy-plugin-rss'

const podcastData = JSON.parse(await readFile('./src/_data/podcast.json'))

const podcastFeedTemplate = `
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  >
  <channel>
    <title>{{ podcast.title }}</title>
    <itunes:subtitle>{{ podcast.subtitle }}</itunes:subtitle>
    <description>{{ podcast.description }}</description>
    <link>{{ site.url }}</link>
    <atom:link href="{{ permalink | htmlBaseUrl(site.url) }}" rel="self" type="application/rss+xml" />
    <itunes:owner>
      <itunes:name>{{ podcast.owner.name }}</itunes:name>
      <itunes:email>{{ podcast.owner.email }}</itunes:email>
    </itunes:owner>
    <itunes:author>{{ podcast.author }}</itunes:author>
    <itunes:category text="{{ podcast.category }}">
      <itunes:category text="{{ podcast.subcategory }}" />
    </itunes:category>
    <itunes:image href="{{ podcast.imagePath | htmlBaseUrl(site.url) }}"></itunes:image>
    <itunes:explicit>{{ podcast.explicit }}</itunes:explicit>
    {% if podcast.type %}
    <itunes:type>{{ podcast.type }}</itunes:type>
    {% endif %}
    <language>{{ podcast.language }}</language>
    <copyright>{% copyright %}</copyright>
    <pubDate>{{ collections.post | getNewestCollectionItemDate | dateToRfc3339 }}</pubDate>
    <lastBuildDate>{% feedLastBuildDate %}</lastBuildDate>
    <generator>{{ eleventy.generator }}</generator>
    {% asyncEach post in collections.post | reverse %}
    <item>
      <title>{{ post.data.title }}</title>
      <link>{{ post.url | htmlBaseUrl(site.url) }}</link>
      <pubDate>{{ post.date | dateToRfc3339 }}</pubDate>
      {% if post.data.seasonNumber -%}
      <itunes:season>{{ post.data.seasonNumber }}</itunes:season>
      {%- endif %}
      <itunes:episode>{{ post.data.episodeNumber }}</itunes:episode>
      <itunes:summary>{{ post.content | striptags(true) | truncate(800) }}</itunes:summary>
      <description>{{ post.content | striptags(true) | truncate(800) }}</description>
      <content:encoded>
        <![CDATA[{% include "feed-episode.njk" -%}]]>
      </content:encoded>
      <enclosure url="{% episodeUrl post.data.episodeFile %}" length="{{ post.data.episodeSize }}" type="audio/mp3"></enclosure>
      <itunes:duration>{{ post.data.episodeDuration }}</itunes:duration>
      {%- if post.data.guid != undefined %}
      <guid isPermalink="false">{{ post.data.guid }}</guid>
      {% else %}
      <guid isPermalink="true">{{ post.url | htmlBaseUrl(site.url) }}</guid>
      {% endif -%}
      {%- if post.data.explicit != undefined %}
      <itunes:explicit>{{ post.data.explicit }}</itunes:explicit>
      {% endif -%}
      {%- if post.data.episodeType != undefined %}
      <itunes:episodeType>{{ post.data.episodeType }}</itunes:episodeType>
      {% endif -%}
    </item>
    {% endeach -%}
  </channel>
</rss>
`
export default async function (eleventyConfig) {
  await eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })
  eleventyConfig.addShortcode('copyright', () => {
    const startingYear = podcastData.startingYear
    const currentYear = DateTime.now().year
    if (startingYear === currentYear) {
      return `© ${startingYear} ${podcastData.copyright}`
    } else {
      return `© ${startingYear}–${currentYear} ${podcastData.copyright}`
    }
  })
  eleventyConfig.addShortcode('feedLastBuildDate', () =>
    DateTime.now().toRFC2822()
  )
  eleventyConfig.addShortcode('episodeUrl', function (filename) {
    const episodePrefix = podcastData.episodePrefix
    return encodeURI(`${episodePrefix}${filename}`)
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
  eleventyConfig.addGlobalData('eleventyComputed.permalink', () => {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false
      } else if (data.tags?.includes('post')) {
        return `/season/${data.seasonNumber}/episode/${data.episodeNumber}/`
      } else {
        return data.permalink
      }
    }
  })
  eleventyConfig.addGlobalData('eleventyComputed.eleventyExcludeFromCollections', () => {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return true
      } else {
        return data.eleventyExcludeFromCollections
      }
    }
  })
  eleventyConfig.addTemplate('feed.njk', podcastFeedTemplate, {
    permalink: '/feed/podcast',
    eleventyExcludeFromCollections: true,
    eleventyImport: {
      collections: ['post']
    }
  })
}
