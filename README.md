# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` — from now on referred to as **Podcaster** — lets you convert an Eleventy blog into a podcast website. It creates the podcast feed for you to submit to Apple Podcasts, Spotify or any other podcast directory. And it provides your templates with data about your podcast and its episodes — data you can use to create a home page for your podcast, as well as pages for individual episodes, guests, topics or anything else you like.

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

## Creating the feed

To create a podcast feed, you need these three things:

1. Information about your podcast
2. Information about the individual episodes
3. The episode audio files

Here's how you provide those things to your site.

### Information about your podcast

The important information about your podcast — the title, the owner, the category, the subcategory and so on — should be made available as fields in a `podcast` object in the data cascade. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file.

You can find out more about what this information is, what it looks like, and what it means here: [Information about your podcast](/docs/podcast-information.md).

### Information about the individual episodes

Each podcast episode will have a corresponding post with the tag `podcastEpisode`. The front matter of that post should contain information about the podcast episode.

You can find out more about this information here: [Information about your episodes](/docs/episode-information.md).

### The episodes themselves

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

## License

This plugin is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
