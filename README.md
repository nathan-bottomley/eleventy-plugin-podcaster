# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` — or **Podcaster**, as we will call it from now on — lets you use Eleventy to create a podcast and its accompanying website. **Podcaster** creates the podcast feed that you submit to Apple Podcasts, Spotify or any other podcast directory. **Podcaster** also provides information about your podcast to your Eleventy templates so that you can create the pages for your podcast's website — pages for individual episodes, guests, topics, seasons or anything else at all.

Plenty of services exist that will host your podcast online — [Spotify][], [Acast][], [Podbean][], [Buzzsprout][], [Blubrry][]. But none of these will allow you to own your podcast's presence on the web, and none of them will give you the freedom to create a site that presents your podcast in a way that reflects its tone, style and branding.

But **Podcaster** will.

[Spotify]: https://podcasters.spotify.com
[Acast]: https://www.acast.com
[Podbean]: https://www.podbean.com
[Buzzsprout]: https://www.buzzsprout.com
[Blubrry]: https://blubrry.com

## Installation

To install the npm package, type this at the command line:

```shell
npm install eleventy-plugin-podcaster
```

And then include the plugin in your Eleventy configuration file.

```js
// eleventy.config.js

import podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  .
  .
  eleventyConfig.addPlugin(podcaster)
  .
  .
}
```

## Podcast information

Once you've installed **Podcaster** in your Eleventy project, the next step is to provide it with information about your podcast — the title, the owner, the category, the subcategory and so on. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file.

Here's an example.

```json
{
  "title": "Flight Through Entirety: A Doctor Who Podcast",
  "description": "Flying through the entirety of Doctor Who. Originally with cake, but now with guests.",
  "siteUrl": "https://flightthroughentirety.com",
  "author": "Flight Through Entirety",
  "category": "TV & Film",
  "language": "en-AU",
}
```

[Read more about podcast information.](docs/podcast-information.md)

## Episode information

For each podcast episode you create, you will also create a Eleventy template containing the information about it — the title, the release date, the episode number, the filename and so on. This template will have the tag `podcastEpisode`; its front matter will contain all of the information about the episode — title, release date, episode number and so on — and its content will contain the episode's show notes.

Here's an example.

```yaml
---
title: Entering a new Phase
date: 2024-04-14
tags:
  - podcastEpisode
episode:
  filename: 500YD S1E1, Entering a New Phase.mp3
  seasonNumber: 1
  episodeNumber: 1
---
A big week for beginnings this week, with a new Doctor, a new origin story for the Daleks, and a whole new approach to defeating the bad guys. Oh, and a new podcast to discuss them all on. So let's welcome Patrick Troughton to the studio floor, as we discuss _The Power of the Daleks_.

```

[Read more about episode information.](docs/episode-information.md)

## Episode files

Your podcast episode files will be audio files — MP3s, usually. You will normally put these in an `/episodes` folder at the top level of your project.

For each of your podcast episode files, **Podcaster** needs three important pieces of information: the filename, the size in bytes and the duration. You can provide this information in [your episode templates' front matter](docs/episode-information.md), but **Podcaster** can calculate the size and duration for you, depending on how your project is set up.

[Read more about calculating episode size and duration.](size-and-duration.md)

## The podcast feed

To create your podcast feed, **Podcaster** needs both the information you've provided about your podcast and the information you've provided about your individual episodes.

By default, your podcast feed will be located at `/feed/podcast.xml`, which means that the URL you submit to Apple Podcasts or Spotify (or wherever) will be `{{ podcast.siteUrl }}/feed/podcast.xml`

## Using podcast information and episode information in templates

All the podcast and episode information you provide are made available to your templates through the data cascade, including `title`, `date` and `excerpt`, as well as fields on the `podcast` and `episode` objects.

Here's how you could use this information to describe a single podcast episode in a Liquid template.

```liquid
<article>
  <h1>{{ title }}</h1>
  <div class="episode-number">Episode {{ episode.episodeNumber }}</div>
  <div class="release-date">{{ date | date: "%A %-e %B %Y" }}</div>
  <section class="content">
    {{ content }}
  </section>
  <audio controls src="{{ episode.url }}" preload="none">
  <p class="audio-details">
    Episode {{ episode.episodeNumber }}: {{ title }}
    | Recorded on {{ recording_date | date: "%A %-e %B %Y" }}
    | Duration {{ episode.duration }}
    | <a download href="{{ episode.url }}">Download</a>
  </p>
</article>
```

All podcast episode templates belong to the `collections.podcastEpisode` collection, which means you can list several episodes on a single page using [Eleventy's pagination feature][pagination]. In that case, each episode's  information will be available its [collection item data structure][item].

[pagination]: https://www.11ty.dev/docs/pagination/
[item]: https://www.11ty.dev/docs/collections/#collection-item-data-structure

[Read more about podcast and episode information in templates.](docs/templates.md)

## Hosting your podcast

**Podcaster** works well when you deploy your podcast website using one of the two most common methods for deploying an Eleventy website:

1. uploading your output directory (usually `_site`) to a web host
2. linking your GitHub repository to [one of the Jamstack providers listed in the Eleventy documentation][jamstack]

[jamstack]: https://www.11ty.dev/docs/deployment/#jamstack-providers

### 1. Uploading your output directory to a web host

If you upload your output directory to a web host, you might be able to host your podcast episode files as part of your site, perhaps in an `/episodes` subdirectory.

### 2. Linking your GitHub repository to a Jamstack provider

If you link your GitHub repository to a Jamstack provider, or if you don't want to host your podcast episode files as part of your site, you need to host them somewhere where they each get assigned a public URL. And if your podcast has a large international audience, it should also be somewhere where they can be served by a content delivery network.

This might be the most complicated part of setting up a podcast website. [Read on for information about hosting your podcast.](docs/hosting.md)

## Optional features

**Podcaster** also implements some optional features which are useful for creating podcast websites — **drafts** and **excerpts**.

## Podcaster in action

I started podcasting and creating podcasting websites in 2014. At first I used Squarespace, then WordPress, then Jekyll, before finally settling on Eleventy late in 2022.

I now have seven podcast websites powered by Eleventy, and **Podcaster** was derived from the code I used to create them and is now being used to support them all.

Here's a list of them:

- [Flight Through Entirety](https://flightthroughentirety.com), a _Doctor Who_ podcast flying through the entirety of the show's 60-something-year history.
- [Untitled Star Trek Project](https://untitledstartrekproject.com), a _Star Trek_ commentary podcast, where two friends watch _Star Trek_ episodes from across the franchise, chosen (nearly) at random using [a page on the podcast website](https://untitledstartrekproject.com/randomiser).
- [500 Year Diary](https://500yeardiary), another _Doctor Who_ podcast, where we look at the show's themes and ideas and some of the people involved in its creation.
- [The Second Great and Bountiful Human Empire](https://thesecondgreatandbountifulhumanempire.com), a _Doctor Who_ flashcast, where we give our initial reactions to each episode of the post-2023 era of the show.
- [Startling Barbara Bain](https://startlingbarbarabain), a commentary podcast on _Space: 1999_, a lavish and generally ridiculous British scifi show from the 1970s.
- [Maximum Power](https://maximumpowerpodcast.com), a podcast about _Blakes 7_, a less lavish but more ridiculous British scifi show from the 1970s.
- [Bondfinger](https://bondfinger.com), a James Bond commentary podcast that soon ran out of James Bond films and ended up spending its time drinking and watching terrible TV shows from the 1960s.

## Licence

This plugin is available as open source under the terms of the [ISC License](https://opensource.org/licenses/ISC).
