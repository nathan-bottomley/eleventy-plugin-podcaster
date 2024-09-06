# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` lets you convert an Eleventy blog into a podcast site. It creates the podcast feed for you to submit to Apple Podcasts, Spotify or any other podcast directory. And it provides your templates with data about your podcast and its episodes  data you can use to create a home page for your podcast, as well as pages for individual episodes, guests, topics or anything else you like.

## Installation

To install the npm package, type this at the command-line:

```shell
npm install eleventy-plugin-podcaster
```

And then include the plugin in your Eleventy configuration file.

```js
// eleventy.config.js

import podcasterPlugin from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  .
  .
  eleventyConfig.addPlugin(podcasterPlugin)
  .
  .
}
```

## Creating the feed

To create a podcast feed, you need these three things:

1. Information about your podcast
2. Information about the individual episodes
3. The episode audio files

Here's how you provde those things to your site.

### Information about your podcast

The important information about your podcast — the title, the owner, the category, the subcategory and so on — should be made available as fields in a `podcast` object in the data cascade. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file.

You can find out more about what this information is, what it looks like, and what it means here: [Information about your podcast](podcast-information.md).

### Information about the individual episodes

Each podcast episode will have a corresponding post with the tag `podcastEpisode`. The front matter of that post should contain information about the podcast episode.

You can find out more about this information here: [Information about your episodes](episode-information.md).

The `content` of each episode's post will be the shownotes — whether a single paragraph, a list of links or a full-scale blog entry.

You can find out more about podcast shownotes here: [Your episodes' shownotes](shownotes.md).

### The episodes themselves

The episodes themselves will be audio files — MP3s, usually — contained in an  `/episodes` folder at the top level of your project.

Podcast episode files tend to be too large to commit to a remote repository. This isn't an insurmountable problem. You find out how to deal with it here: [The episodes themselves](episodes.md).

## Using podcast data on your site

## `eleventy-plugin-podcaster` in action

I've been using the technology used to create  `jekyll-podcast` to create podcast websites since the middle of 2021, after hosting podcasts with WordPress for a number of years. It has allowed me to take more control of my podcast sites, and to spend my time writing HTML and Sass (and Ruby, I guess) instead of wrestling with WordPress plugins and PHP.

If you would like to see some podcasts powered by `eleventy-plugin-podcaster`, here's a list of the podcasts I'm currently running.

- [Flight Through Entirety](https://flightthroughentirety.com), a _Doctor Who_ podcast flying through the entirety of the show's 60-year history.
- [Bondfinger](https://bondfinger.com), a James Bond commentary podcast that has run out of James Bond films and now spends its time drinking and watching terrible TV shows from the 1960s mostly.
- [Untitled Star Trek Project](https://untitledstartrekproject.com), a _Star Trek_ commentary podcast in which two friends watch _Star Trek_ episodes from any series, chosen (nearly) at random by [a page on the podcast website](https://untitledstartrekproject.com/randomiser).

## License

This plugin is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
