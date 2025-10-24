# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` — or **Podcaster**, as we will call it from now on — is an Eleventy plugin which lets you create a podcast and its accompanying website.

- **Podcaster** creates the podcast feed that you submit to Apple Podcasts, Spotify or any other podcast directory.
- **Podcaster** also provides information about your podcast to your Eleventy templates. This means that you can describe the podcast and its episodes on your podcast website, creating pages for individual episodes, guests, topics, seasons or anything else at all.

Plenty of services exist that will host your podcast online — [Spotify][], [Acast][], [Podbean][], [Buzzsprout][], [Blubrry][]. But none of these will allow you to own your podcast's presence on the web, and none of them will give you the freedom to create a site that presents your podcast in a way that reflects its premise, tone and style.

[Spotify]: https://podcasters.spotify.com
[Acast]: https://www.acast.com
[Podbean]: https://www.podbean.com
[Buzzsprout]: https://www.buzzsprout.com
[Blubrry]: https://blubrry.com

But Eleventy and **Podcaster** will.

## Installation

To install the npm package, type this at the command line:

```shell
npm install eleventy-plugin-podcaster
```

And then include the plugin in your Eleventy configuration file.

```js
// eleventy.config.js

import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  .
  .
  eleventyConfig.addPlugin(Podcaster)
  .
  .
}
```

## ➡ [Documentation and usage][Podcaster]

[Podcaster]: https://eleventy-plugin-podcaster.com/docs

Detailed and specific information about how to install and use **Podcaster** can be found in [the Documentation section](docs/index.md) of the site, but here's a quick summary.

1. **Podcaster** is an Eleventy plugin. Create an Eleventy site and install the `eleventy-plugin-podcaster` plugin in the usual way.
2. In the data directory, create a `podcast.json` file. This will contain information about your podcast and its site — at the very least, its title, the URL of the site, a description, its language, and its category.
3. In the input directory, create an `episode-files` directory and put your podcast MP3s in there.
4. In the input directory, create an `episode-posts` directory. Here you will create a post for each episode, which will include information about the episode in its filename and front matter and which whill contain the episode description or show notes.
5. Create pages on your site for each of your episodes using the posts in the `episode-posts` directory. And you can also create index pages, topic pages, guest pages or anything you like — all using the information you have supplied to **Podcaster** in your `podcast.json` file and your episode posts.
6. Find a host for your site, and a CDN for your podcast episodes.

> [!WARNING]
> **Podcaster** requires Node 20 or later.
