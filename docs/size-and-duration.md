# Size and duration

The simplest way of telling **Podcaster** the size and duration of your podcast episode files is by including that information in the front matter of each episode's post, like this:

```yaml
episode:
  size: 61231442 # bytes
  duration: 3778.482 # seconds
```

However, you can also get **Podcaster** to analyses your podcast's episode files and find that information for you.

To do this, you need a directory which contains all of your podcast's episode files. **Podcaster** assumes that this is an `episodes` folder at the top level of your project. If it finds the folder, it will analyse all of its `.mp3` files, find their size and duration, and save that information in a JSON file called `episodesData.json` in your project's data directory.

```json
{
  "500YD S1E1, Entering a New Phase (The Power of the Daleks).mp3": {
    "size": 61231442,
    "duration": 3778.482
  }
}
```

During the build, **Podcaster** will use this JSON file behind the scenes to retrieve `episode.size` and `episode.duration`, both in the podcast feed and in your templates, using the filename you have provided as `episode.filename`.

You can specify another folder for **Podcaster** to use when you include **Podcaster** in your configuration file by specifying a relative or absolute path like this.

```js
import Podcaster from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  .
  .
  eleventyConfig.addPlugin(Podcaster, {
    episodesDir: '~/episodes'
  })
  .
  .
}
```

## Why `episodesData.json`?

When you're building your site locally, you can easily point **Podcaster** at a local directory full of your podcast's episode files and then run your build.

But if you host your site on a Jamstack provider and it's building your site for you, it won't have access to a directory like that. (Your podcast files are too big to store in your repository.)

And so with **Podcaster** you can run your build locally first and then commit the resulting `episodesData.json` file to your repository. If you do that, the build process on your host will use the information in that file to work our the size and duration of your episodes.

## Skipping the process

When Eleventy is running in `--serve` mode,**Podcaster** will analyse your MP3 files only once during a session. To get it to run the analysis again, you need to restart the web server.

If you don't want to run the analysis during a build, you can just set the environment variable `SKIP_EPISODE_CALCULATIONS` to `true`.

```sh
SKIP_EPISODE_CALCULATIONS=true npx @11ty/eleventy --serve
```
