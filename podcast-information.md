# Podcast information

The important information about your podcast — the title, the owner, the category, the subcategory and so on — should be made available as fields in a `podcast` object in the data cascade. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file, like this:

```json
{
  "feedPath": "/podcast.xml",
  "title": "Flight Through Entirety: A Doctor Who Podcast",
  "subtitle": "Flying through the entirety of Doctor Who. Originally with cake, but now with guests.", 
  "description": "Flying through the entirety of Doctor Who. Originally with cake, but now with guests.",
  "siteUrl": "https://flightthroughentirety.com",
  "owner": {
    "name": "Nathan Bottomley",
    "email": "nathan.bottomley@example.com"
  },
  "author": "Flight Through Entirety",
  "category": "TV & Film",
  "subcategory": "TV Reviews",
  "summary": "Flying through the entirety of Doctor Who. Originally with cake,but now with guests.",
  "imagePath": "/assets/images/podcast-logo.jpg",
  "explicit": false,
  "type": "episodic",
  "complete": "no",
  "language": "en-AU",
  "copyright": "Flight Through Entirety",
  "startingYear": 2014,
  "episodeUrlBase": "https://example.fte-cdn.com/",
  "feedEpisodeContentTemplate": "feed-episode.njk"
}
```

Here's a detailed description of the data you need to provide here.

| field | value | required? |
| ----- | ----- | --------- |
| `feedPath` | The path where the podcast feed will be located. Defaults to `/feed/podcast.xml`. | no |
| `title` | The title of your podcast. | yes |
| `subtitle` | A short description of your podcast. If you omit this the `description` field will be used instead. | no |
| `description` | A short description of your podcast. The most popular podcast applications prominently display this information. | yes |
| `siteUrl` | The URL of your podcast website. The most popular podcast applications use this to provide a link to your website. It's also used by this plugin to convert relative links to absolute links in your feed. | yes |
| `owner` | An optional object in the form `{ name, email }` You might want to omit this: Apple Podcasts has deprecated it, and an email in a podcast feed will attract some spam. However, some podcast directories, like Castbox, will use the email address to identify you when you try to claim ownership of a podcast in their directory. | no |
| `author` | The creator or creators of the podcast. The most popular podcast applications prominently display this information. | yes |
| `category` | The category for the podcast. Describes the kind of show it is. Valid categories are listed in [this Apple support document][categories]. Used by podcast directories to help listeners find the podcast. | yes |
| `subcategory` | The subcategory for the podcast. Valid subcategories are also listed in [the Apple support document][categories]. | no |
| `summary` | A description of your podcast. If you omit this the `description` field will be used instead. | no |
| `imagePath` | The path to your podcast logo, which should be a JPEG or PNG file 3000 × 3000 pixels in size. (You can find more detailed specifications in [this Apple support document](https://podcasters.apple.com/support/896-artwork-requirements#shows)). Defaults to `/img/podcast-logo.jpg`. | yes |
| `explicit` | Warns listeners that your podcast contains explicit language. In Apple Podcasts, if you include this with the value `true`, your podcast and its episodes will be badged with an 🄴 to indicate that they use explicit language. Some of the most popular podcast applications ignore this field. | no |
| `type` | Two possible values: `episodic` and `serial`. Defaults to `episodic`, which means that the podcast can be listened to in no particular order. Narrative podcasts (like _Serial_) should be marked as `serial`. | no |
| `complete` | Indicates that a podcast is complete and that no new episodes should be expected, in which case it should have the value `true`. Should be omitted otherwise. | no |
| `language` | A code that specifies the language of the feed (rather than the podcast). You can find [a list of permissible codes][lang] at the RSS Advisory Board's website. | yes |
| `copyright` | The copyright owner of the podcast. If omitted, the value supplied for `author` is used instead. | no |
| `startingYear` | The year your podcast started. Used to express the copyright date as a range (_"© 2014–2024 Flight Through Entirety"_). If this is omitted, the copyright date will just be the current year. | no |
| `episodeUrlBase` | If you store your podcast episodes on a CDN, or if you use a podcast analytics service, this is where you specify the base URL for them. If you don't specify this, it defaults to `https://{{ podcast.siteUrl }}/episodes/` | no |
| `feedEpisodeContentTemplate` | The name of an include template that will be used to create the shownotes of each episode. If it's omitted, the shownotes will just be the `content` of the episode's post. | no |

[categories]: https://podcasters.apple.com/support/1691-apple-podcasts-categories
[lang]: https://www.rssboard.org/rss-language-codes

## Using podcast data in your templates

<https://help.apple.com/itc/podcasts_connect/>
