# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` — or **Podcaster**, as we will call it from now on — lets you use Eleventy to create a podcast. **Podcaster** creates the podcast feed that you submit to Apple Podcasts, Spotify or any other podcast directory. And by providing information about podcasts to your templates, **Podcaster** helps you to create a home page for your podcast, with pages for individual episodes, guests, topics, seasons or anything else at all.

Plenty of services exist that will host your podcast online — [Spotify][], [Acast][], [Podbean][], [Buzzsprout][], [Blubrry][]. But none of these will allow you to own your podcast's presence on the web, and none of them will give you the freedom to create a site that presents your podcast in a way that reflects its tone, its philosophy and its concerns.

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

## About your podcast

Once you've installed **Podcaster** in your Eleventy project, the next step is to provide it with information about your podcast — the title, the owner, the category, the subcategory and so on. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file.

Here's a simple example.

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

## About the episodes

For each podcast episode you create, you will also create a Eleventy template containing the information about the episode — the title, the release date, the episode number, the filename and so on. This template will have the tag `podcastEpisode`; its front matter will contain all of the information about the episode, and its content will contain the episode's shownotes.

## The podcast episodes themselves

These will be audio files — MP3s, usually — and you will store them in an `/episodes` folder at the top level of your project.

## Your podcast feed

The episodes themselves will be audio files — MP3s, usually — contained in an  `/episodes` folder at the top level of your project.

Podcast episode files tend to be too large to commit to a remote repository. This isn't an insurmountable problem. You find out how to deal with it here: [The episodes themselves](/docs/episodes.md).

The `content` of each episode's post will be the shownotes — whether a single paragraph, a list of links or a full-scale blog entry.

You can find out more about podcast shownotes here: [Your episodes' shownotes](/docs/shownotes.md).

## Using podcast data on your site

## Optional features

**Podcaster** also implements some optional features which are useful for creating podcast websites — **drafts** and **excerpts**. You can find out more about them here: [Optional features](docs/optional-features.md).

## Podcaster in action

I started podcasting and creating podcasting websites in 2014. At first I used Squarespace, then WordPress, then Jekyll, before finally settling on Eleventy late in 2022.

I now have seven podcast websites powered by Eleventy, and **Podcaster** was derived from the code I used to create them and devised to support them all.

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
