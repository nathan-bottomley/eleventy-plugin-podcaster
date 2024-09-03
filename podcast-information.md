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
  "episodeUrlPrefix": "https://example.fte-cdn.com/",
  "explicit": false,
  "type": "episodic",
  "complete": "no",
  "language": "en-AU",
  "copyright": "Flight Through Entirety",
  "startingYear": 2014
}
```

Here's a detailed description of the data you need to provide here.

| field | value |
| ----- | ----- |
| `feedPath` | The path where the podcast feed will be located. Defaults to `/feed/podcast.xml`. |
| `title` | The title of your podcast. |
| `subtitle` | A short description of your podcast. The most popular podcast applications don't display this information, so it's probably safe to make this the same as the `description` field. |
| `description` | A short description of your podcast. The most popular podcast applications prominently display this information. |
| `siteUrl` | The URL of your podcast website. The most popular podcast applications use this to provide a link to your website. It's also used by this plugin to convert relative links to absolute links in your feed. |
| `owner` | An optional object in the form `{ name, email }` Apple Podcasts has deprecated this, and an email in a podcast feed will attract some spam. However, some podcast directories, like Castbox, will use the email address to identify you when you want to claim ownership of a podcast in their directory. |
| `author` | The creator or creators of the podcast. The most popular podcast applications prominently display this information. |
| `category` and `subcategory` | The category and subcategory for the podcast. These are described in detail in [this Apple support document](https://podcasters.apple.com/support/1691-apple-podcasts-categories). Used by podcast directories to help listeners find the podcast. |
| `summary` | A short description of your podcast. The most popular podcast applications don't display this information, so it's probably safe to make this the same as the `description` field. |
| `imagePath` | The path to your podcast logo, which should be a JPEG or PNG file 3000 × 3000 pixels in size. (You can find more detailed specifications in [this Apple support document](https://podcasters.apple.com/support/896-artwork-requirements#shows)). Defaults to `/img/podcast-logo.jpg`. |
| `explicit` | Warns listeners that your podcast contains explicit language. In Apple Podcasts, if you include this with the value `true`, your podcast and its episodes will be badged with an 🄴 to indicate that they use explicit language. Some of the most popular podcast applications ignore this field. |
| `type` | Two possible values: `episodic` and `serial`. Defaults to `episodic`, which means that the podcast can be listened to in no particular order. Narrative podcasts (like _Serial_) should be marked as `serial`. |
| `complete` | Indicates that a podcast is complete and that no new episodes should be expected, in which case it should have the value `true`. Should be omitted otherwise. |
| `language` | A code that specifies the language of the feed (rather than the podcast). You can find [a list of permissible codes][lang] at the RSS Advisory Board's website. |
| `copyright` | An optional field specifying who has the copyright on the podcast. If omitted, the value supplied for `author` is used instead. |
| `startingYear` | The year your podcast started. Used to express the copyright date as a range (_"© 2014–2024 Flight Through Entirety"_). It's optional: if it's omitted, the copyright date will just be the current year. |

[lang]: https://www.rssboard.org/rss-language-codes

## Using podcast data in your templates

<https://help.apple.com/itc/podcasts_connect/>
