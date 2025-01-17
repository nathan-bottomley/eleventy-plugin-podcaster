# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` — or **Podcaster**, as we will call it from now on — is an Eleventy plugin which lets you create a podcast and its accompanying website. **Podcaster** creates the podcast feed that you submit to Apple Podcasts, Spotify or any other podcast directory. And it provides information about your podcast to your Eleventy templates. This means that you can include information about the podcast and its episodes on your podcast's website, creating pages for individual episodes, guests, topics, seasons or anything else at all.

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

Detailed and specific information about how to install and use **Podcaster** can be found in [the Documentation section](https://eleventy-plugin-podcaster.com/docs) of [the `eleventy-plugin-podcaster` site][Podcaster], but here's a quick summary.

[Podcaster]: https://eleventy-plugin-podcaster.com

**Podcaster** is an Eleventy plugin. You install it in your config file in the usual way. You usually provide it with information about your podcast — like its title, description and category — by creating a `podcast.json` file in the data directory. For each episode, you create a template with information in the front matter about that episode — its name, release date, filename, duration and so on.

Once you do this, **Podcaster** can create the RSS feed for your podcast. You can also create templates for various pages on your website and include on those pages the information you have provided about the podcast and its episodes.

> [!WARNING]
> **Podcaster** only works with Node 20 and later.
