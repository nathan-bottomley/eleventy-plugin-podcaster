# eleventy-plugin-podcasting 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcasting` converts an Eleventy blog into a podcast site. It provides you with all the functionality you need to make your podcast fully accessible from your site, and it creates a podcast feed which you can submit to Apple Podcasts, Spotify or any other podcast directory.

## Installation

To install the npm package, type this at the command-line:

```shell
npm install eleventy-plugin-podcasting
```

And then include the plugin in your Eleventy configuration file.

```js
import podcastingPlugin from 'eleventy-plugin-podcasting'

export default function (eleventyConfig) {
  .
  .
  eleventyConfig.addPlugin(podcastingPlugin)
  .
  .
}
```

## Usage

To create a podcast feed, you need these three things:

1. Information about your podcast
2. Information about the individual episodes
3. The episodes themselves

Here's how you provide those things in your site.

### Information about your podcast

The important information about your podcast — the title, the owner, the category, the subcategory and so on — should be made available as fields in a `podcast` object in the data cascade. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file, like this:

```json
{
  "feedPath": "/podcast.xml",
  "title": "Flight Through Entirety: A Doctor Who Podcast",
  "subtitle": "Flying through the entirety of Doctor Who. Originally with cake,but now with guests.", 
  "description": "Flying through the entirety of Doctor Who. Originally with cake,but now with guests.",
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
  "startingYear": 2014
}
```

> [!NOTE]
> You can find out more about what this information is and what it means here: [Information about your podcast](podcast-information.md).

### Information about the individual episodes

Each podcast episode will have a corresponding post with the tag `episode`. In the front matter of that post, there will be an `episode` record containing information about the podcast episode. The content of the post will be the shownotes — whether a single paragraph, a list of links or a full-scale blog entry.

```yaml
---
episode:
  title: Entering a New Phase
  date:
  filename: 
  seasonNumber: 1
  episodeNumber: 1
  size: 
  duration:
  explicit: yes
  type: 
---
```

> [!NOTE]
> You can find out more about what this information is and what it means — including some ways of getting the plugin to calculate some of these details for you automatically — here: [Information about your episodes](episode-information.md).

### The episodes themselves

The episodes themselves will be audio files — MP3s, usually — contained in an  `/episodes` folder at the top level of your project.

> [!WARNING]
> Podcast episode files tend to be large, too large to commit to your repository. This isn't an insurmountable problem. You find out how to solve it here: [The episodes themselves](episodes.md).

### `eleventy-plugin-podcast` in action

I've been using `jekyll-podcast` to create podcast websites since the middle of 2021, after hosting podcasts with WordPress for a number of years. It has allowed me to take more control of my podcast sites, and to spend my time writing HTML and Sass (and Ruby, I guess) instead of wrestling with WordPress plugins and PHP.

If you would like to see some podcasts powered by `jekyll-podcast`, here's a list of the podcasts I'm currently running.

- [Flight Through Entirety](https://flightthroughentirety.com), a _Doctor Who_ podcast flying through the entirety of the show's 60-year history.
- [Bondfinger](https://bondfinger.com), a James Bond commentary podcast that has run out of James Bond films and now spends its time drinking and watching terrible TV shows from the 1960s mostly.
- [Jodie into Terror](https://jodieintoterror.com), a _Doctor Who_ flashcast in which we give our (intermittently) enthusiastic hot takes on the most recent era of _Doctor Who_ mere days after each episode's first broadcast in the UK.
- [Untitled Star Trek Project](https://untitledstartrekproject.com), a _Star Trek_ commentary podcast in which two friends watch _Star Trek_ episodes from any series, chosen (nearly) at random by [a page on the podcast website](https://untitledstartrekproject.com/randomiser).

## License

This plugin is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
