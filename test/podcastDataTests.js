import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

test('RSS feed template renders', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const feed = build[0].content
  t.true(XMLValidator.validate(feed))
})

test('RSS feed is valid XML', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.truthy(feedData)
})

test('feed renders at /feed/podcast.xml by default', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  t.is(build[0].url, '/feed/podcast.xml')
})

test('feed renders at podcast.feedPath if set', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        feedPath: '/feed.xml',
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  t.is(build[0].url, '/feed.xml')
})

test('RSS feed contains correct information', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        title: 'Test Podcast',
        siteUrl: 'https://example.com',
        description: 'A test podcast with excellent content. With cake.',
        language: 'en-AU',
        category: 'TV & Film',
        subcategory: 'TV Reviews',
        author: 'Test Author',
        owner: {
          name: 'Test Owner',
          email: 'test@example.com'
        }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(build[0].content)
  t.like(feedData.rss.channel, {
    title: 'Test Podcast',
    link: 'https://example.com',
    'atom:link': {
      '@_href': 'https://example.com/feed/podcast.xml',
      '@_rel': 'self',
      '@_type': 'application/rss+xml'
    },
    description: 'A test podcast with excellent content. With cake.',
    language: 'en-AU',
    'itunes:category': {
      // XMLparser removes the entity, but it's in the feed
      '@_text': 'TV & Film',
      'itunes:category': {
        '@_text': 'TV Reviews'
      }
    },
    'itunes:author': 'Test Author',
    'itunes:owner': {
      'itunes:name': 'Test Owner',
      'itunes:email': 'test@example.com'
    }
  })
})

// CALCULATED OR SPECIAL PROPERTIES

// copyright

test('copyright defaults to year and author name', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        author: 'Test Author',
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const year = new Date().getFullYear()
  const feedData = parser.parse(build[0].content)
  t.like(feedData, { rss: { channel: { copyright: `© ${year} Test Author` } } })
})

test('copyright can be set to a range with startingYear', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        copyright: 'Test Copyright',
        startingYear: 2020,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const year = new Date().getFullYear()
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel.copyright, `© 2020–${year} Test Copyright`)
})

test("copyright isn't expressed as a range when startingYear is this year", async t => {
  const year = new Date().getFullYear()
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        copyright: 'Test Copyright',
        startingYear: year,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel.copyright, `© ${year} Test Copyright`)
})

// pubDate

// lastBuildDate

test('lastBuildDate is set to the current date and time in RFC2822 format', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  const lastBuildDate = new Date(feedData.rss.channel.lastBuildDate)
  t.true(lastBuildDate instanceof Date)
  t.true(!isNaN(lastBuildDate))
})

// image

test('image path defaults to "/img/podcast-logo.jpg"', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addGlobalData('podcast', {
        siteUrl: 'https://example.com'
      })
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(build[0].content)
  const itunesImage = feedData.rss.channel['itunes:image']['@_href']
  t.is(itunesImage, 'https://example.com/img/podcast-logo.jpg')
})

// categories

test('<itunes:category> works if no subcategory is set', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        category: 'TV & Film',
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel['itunes:category']['@_text'], 'TV & Film')
})

// explicit

test('<itunes:explicit> defaults to not existing', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:explicit' in feedData.rss.channel)
})

test('<itunes:explicit> can be set to true', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        explicit: true,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.true(feedData.rss.channel['itunes:explicit'])
})

test('<itunes:explicit> can be set to false', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        explicit: false,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false(feedData.rss.channel['itunes:explicit'])
})

// type

test('<itunes:type> defaults to not existing', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:type' in feedData.rss.channel)
})

test('<itunes:type> can be set to episodic', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        type: 'episodic',
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel['itunes:type'], 'episodic')
})

test('<itunes:type> can be set to serial', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        type: 'serial',
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel['itunes:type'], 'serial')
})

// complete

test('<itunes:complete> defaults to not existing', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:complete' in feedData.rss.channel)
})

test('<itunes:complete> can be set to true', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        complete: true,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel['itunes:complete'], 'yes')
})

test("<itunes:complete> doesn't exist when set to false", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        complete: false,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:complete' in feedData.rss.channel)
})

// block

test('<itunes:block> defaults to not existing', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.siteUrl', 'https://example.com')
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:block' in feedData.rss.channel)
})

test('<itunes:block> can be set to true', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        block: true,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.is(feedData.rss.channel['itunes:block'], 'yes')
})

test("<itunes:block> doesn't exist when set to false", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast', {
        block: false,
        siteUrl: 'https://example.com'
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const feedData = parser.parse(build[0].content)
  t.false('itunes:block' in feedData.rss.channel)
})
