import { DateTime } from 'luxon'
import rssPlugin from '@11ty/eleventy-plugin-rss'

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
    <link>{{ podcast.siteUrl }}</link>
    <atom:link href="{{ permalink | htmlBaseUrl(podcast.siteUrl) }}" rel="self" type="application/rss+xml" />
    <itunes:owner>
      <itunes:name>{{ podcast.owner.name }}</itunes:name>
      <itunes:email>{{ podcast.owner.email }}</itunes:email>
    </itunes:owner>
    <itunes:author>{{ podcast.author }}</itunes:author>
    <itunes:category text="{{ podcast.category }}">
      <itunes:category text="{{ podcast.subcategory }}" />
    </itunes:category>
    <itunes:image href="{{ podcast.imagePath | htmlBaseUrl(podcast.siteUrl) }}"></itunes:image>
    <itunes:summary>{{ podcast.summary }}</itunes:summary>
    <itunes:explicit>{{ podcast.explicit or "no" }}</itunes:explicit>
    <itunes:type>{{ podcast.type or "episodic" }}</itunes:type>
    <itunes:complete>{{ podcast.complete or "no" }}</itunes:complete>
    <language>{{ podcast.language }}</language>
    <copyright>{{ podcast.copyrightNotice }}</copyright>
    <pubDate>{{ collections.post | getNewestCollectionItemDate | dateToRfc3339 }}</pubDate>
    <lastBuildDate>{% feedLastBuildDate %}</lastBuildDate>
    <generator>{{ eleventy.generator }}</generator>
    {% asyncEach post in collections.post | reverse %}
    <item>
      <title>{{ post.data.title }}</title>
      <link>{{ post.url | htmlBaseUrl(podcast.siteUrl) }}</link>
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
      <enclosure url="{{ post.data.episodeUrl }}" length="{{ post.data.episodeSize }}" type="audio/mp3"></enclosure>
      <itunes:duration>{{ post.data.episodeDuration }}</itunes:duration>
      {%- if post.data.guid != undefined %}
      <guid isPermalink="false">{{ post.data.guid }}</guid>
      {% else %}
      <guid isPermalink="true">{{ post.url | htmlBaseUrl(podcast.siteUrl) }}</guid>
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
export default function (eleventyConfig) {
  if (!('addTemplate' in eleventyConfig)) {
    console.log('[eleventy-plugin-podcasting] WARN Eleventy plugin compatibility: Virtual Templates are required for this plugin — please use Eleventy v3.0 or newer.')
  }

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
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
  eleventyConfig.addTemplate('feed.njk', podcastFeedTemplate, {
    permalink: '/feed/podcast',
    eleventyExcludeFromCollections: true,
    eleventyImport: {
      collections: ['post']
    }
  })
}
