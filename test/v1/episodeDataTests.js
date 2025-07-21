import test from 'ava'
import Eleventy from '@11ty/eleventy'
import Podcaster from 'eleventy-plugin-podcaster'
import { XMLParser } from 'fast-xml-parser'

test('podcastEpisode template produces <item> tag in feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('episode-2.md', '# Episode 2', {
        tags: ['podcastEpisode'],
        date: '2020-01-02',
        title: 'Episode 2',
        permalink: '/2/',
        episode: { filename: 'episode-2.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.like(feedData.rss.channel.item, [{ title: 'Episode 2' }, { title: 'Episode 1' }])
})

// title

test('if podcast.title is provided, it is used instead of the post title', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: {
          filename: 'episode-1.mp3',
          title: 'Podcast Episode 1'
        }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item.title, 'Podcast Episode 1')
})

// itunes Title

test('itunes:title tag is omitted if episode.itunesTitle is absent', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('itunes:title' in feedData.rss.channel.item)
})

test('itunes:title tag exists if episode.itunesTitle is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: {
          filename: 'episode-1.mp3',
          itunesTitle: 'iTunes Title'
        }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:title'], 'iTunes Title')
})

// link

test('site.url is used if podcast.siteUrl is absent', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'site.url',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'podcast.imagePath',
        '/img/podcast-logo.jpg'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.link, 'https://example.com/')
})

// guid

test("if guid isn't provided, it defaults to the URL", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'site.url',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  t.true(item.content.includes('<guid isPermaLink="true">https://example.com/1/</guid>', item.content))
})

test('if guid is provided, it is used and isPermaLink is false', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'site.url',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3' },
        guid: 'https://example.com/?p=12'
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  t.true(item.content.includes('<guid isPermaLink="false">https://example.com/?p=12</guid>', item.content))
})

// pubDate

test("pubDate is the date of the posts' publication'", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
      eleventyConfig.addTemplate('episode-2.md', '# Episode 2', {
        tags: ['podcastEpisode'],
        date: '2020-01-02',
        title: 'Episode 2',
        permalink: '/2/',
        episode: { filename: 'episode-2.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.like(feedData.rss.channel.item, [{ pubDate: '2020-01-02T00:00:00Z' }, { pubDate: '2020-01-01T00:00:00Z' }])
})

// description

test("if description is provided, it is used as the feed's description and itunes:summary", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', "This is the post's content", {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3', description: "This is the post's description" }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const parser = new XMLParser()
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item.description, "This is the post's description")
  t.is(feedData.rss.channel.item['itunes:summary'], "This is the post's description")
})

test("if podcast.description isn't provided, the feed's description and itunes:summary will be like the start of the content, only without html", async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', "This **is** the post's _content_", {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const parser = new XMLParser()
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item.description, "This is the post's content")
  t.is(feedData.rss.channel.item['itunes:summary'], "This is the post's content")
})

test('An ampersand in the episode content ends up encoded as &amp; in the description in the feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', 'A game of Bat’leths & BiHnuchs takes a surprising turn', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const parser = new XMLParser({ processEntities: false })
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item.description, 'A game of Bat’leths &amp; BiHnuchs takes a surprising turn')
  t.is(feedData.rss.channel.item['itunes:summary'], 'A game of Bat’leths &amp; BiHnuchs takes a surprising turn')
})

// content

test('a local link in podcast episode content is converted to an absolute URL', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addGlobalData(
        'podcast.siteUrl',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  t.true(item.content.includes('https://example.com/episode-1.mp3'))
})

// episode size and duration

test('size and duration are included in the feed if explicitly specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '# Episode 1', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: {
          filename: 'episode-1.mp3',
          size: 32004399,
          duration: 1947.481
        }
      })
      eleventyConfig.addTemplate('episode-2.md', '# Episode 2', {
        tags: ['podcastEpisode'],
        date: '2020-01-02',
        title: 'Episode 2',
        permalink: '/2/',
        episode: {
          filename: 'episode-2.mp3',
          size: 28683178,
          duration: 1587.905
        }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.like(feedData.rss.channel.item, [{ enclosure: { '@_length': '28683178' }, 'itunes:duration': '0:26:27' }, { enclosure: { '@_length': '32004399' }, 'itunes:duration': '0:32:27' }])
})

// episode.filename

test('episode.url consists of the episode prefix plus the episode filename', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('https://example.com/episode-1.mp3'))
})

test('episode.url is percent encoded', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode 1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const item = build.find(item => item.url === '/1/')
  t.true(item.content.includes('https://example.com/episode%201.mp3'), item.content)
})

// episode episodeNumber and seasonNumber

test('episode number and season number appear in the correct place in the feed', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      const episodeData = {
        filename: 'episode-S2E1.mp3',
        episodeNumber: 1,
        seasonNumber: 2
      }
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: episodeData
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:episode'], 1)
  t.is(feedData.rss.channel.item['itunes:season'], 2)
})

// episode.image

test('episode.image is omitted from the feed if not specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('itunes:image' in feedData.rss.channel.item)
})

test('episode.image works when just a path is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.siteUrl',
        'https://example.com'
      )
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', image: '/episode-1-logo.jpg' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:image']['@_href'], 'https://example.com/episode-1-logo.jpg')
})

test('episode.image works when a full URL is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.siteUrl',
        'https://example.com'
      )
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', image: 'https://cdn.example.com/episode-1-logo.jpg' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:image']['@_href'], 'https://cdn.example.com/episode-1-logo.jpg')
})

// episode.explicit

test('episode.explicit is omitted from the feed if not specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('itunes:explicit' in feedData.rss.channel.item)
})

test('episode.explicit is set to true if the value is true', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', explicit: true }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:explicit'], true)
})

test('episode.explicit is set to false if the value is false', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', explicit: false }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:explicit'], false)
})

// episode.type

test('episode.type is omitted from the feed if not specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('itunes:episodeType' in feedData.rss.channel.item)
})

test('episode.type can be successfully set', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', type: 'trailer' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:episodeType'], 'trailer')
})

// episode.transcript

test('episode.transcript is omitted from the feed if not specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('podcast:transcript' in feedData.rss.channel.item)
})

test('episode.transcript works when just a path is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.siteUrl',
        'https://example.com'
      )
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: '/ep-1.vtt' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_url'], 'https://example.com/ep-1.vtt')
})

test('episode.transcript works when a full URL is provided', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.siteUrl',
        'https://example.com'
      )
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com'
      )
      eleventyConfig.addTemplate('episode-1.md', '{{ episode.url }}', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', transcript: 'https://cdn.example.com/ep-1.vtt' }
      })
    }
  })

  const build = await eleventy.toJSON()
  const parser = new XMLParser({ ignoreAttributes: false })
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['podcast:transcript']['@_url'], 'https://cdn.example.com/ep-1.vtt')
})

// episode.block

test('episode.block is omitted from the feed if not specified', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData(
        'podcast.episodeUrlBase',
        'https://example.com/'
      )
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3' }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.false('itunes:block' in feedData.rss.channel.item)
})

test('episode.block is set to Yes if the value is true', async t => {
  const eleventy = new Eleventy('./test', './test/_site', {
    configPath: null,
    config (eleventyConfig) {
      eleventyConfig.addPlugin(Podcaster)
      eleventyConfig.addGlobalData('podcast.episodeUrlBase', 'https://example.com/')
      eleventyConfig.addTemplate('episode-1.md', '[Episode 1](/episode-1.mp3)', {
        tags: ['podcastEpisode'],
        date: '2020-01-01',
        title: 'Episode 1',
        permalink: '/1/',
        episode: { filename: 'episode-1.mp3', block: true }
      })
    }
  })
  const build = await eleventy.toJSON()
  const parser = new XMLParser()
  const item = build.find(item => item.url === '/feed/podcast.xml')
  const feedData = parser.parse(item.content)
  t.is(feedData.rss.channel.item['itunes:block'], 'Yes')
})
