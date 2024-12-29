# eleventy-plugin-podcaster 🕚⚡️🎈🐀🎤📲

`eleventy-plugin-podcaster` — or **Podcaster**, as we will call it from now on — lets you use Eleventy to create a podcast and its accompanying website. **Podcaster** creates the podcast feed that you submit to Apple Podcasts, Spotify or any other podcast directory. And it provides information about your podcast to your Eleventy templates. This means that you can include information about the podcast and its episodes on your podcast's website, creating pages for individual episodes, guests, topics, seasons or anything else at all.

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

## ➡ [Documentation and usage][docs]

On GitHub, you can find [detailed documentation][docs] about how to provide **Podcaster** with the information it needs to create your podcast feed and about how to use that information when creating the templates for your Eleventy site.

[docs]: https://github.com/nathan-bottomley/eleventy-plugin-podcaster/tree/main/docs

As well as creating your feed and providing information to your templates, **Podcaster** can optionally calculate the size and duration of your podcast MP3 files, as well as offering functionality for drafts and excerpts.

## Rationale

Plenty of services exist that will host your podcast online — [Spotify][], [Acast][], [Podbean][], [Buzzsprout][], [Blubrry][]. But none of these will allow you to own your podcast's presence on the web, and none of them will give you the freedom to create a site that presents your podcast in a way that reflects its premise, tone and style.

But **Podcaster** will.

[Spotify]: https://podcasters.spotify.com
[Acast]: https://www.acast.com
[Podbean]: https://www.podbean.com
[Buzzsprout]: https://www.buzzsprout.com
[Blubrry]: https://blubrry.com
