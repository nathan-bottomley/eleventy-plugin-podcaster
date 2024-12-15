# Size and duration

The simplest way of telling **Podcaster** the size and duration of your podcast episode files is by including that information in the front matter of each episode's post, like this:

```yaml
episode:
  size: 61231442 # size in bytes
  duration: "1:02:58"
```

However, you can just get **Podcaster** to calculate that information for you. 

Before **Podcaster** builds your site, it looks for an `/episodes` folder at the top level of your project. If it finds it, it will calculate the size and duration of all of the `.mp3` files it finds there, and it will save that information in a JSON file called `episodesData.json` in your project's data file.

```json
{
  "500YD S1E1, Entering a New Phase (The Power of the Daleks).mp3": {
    "size": 61231442,
    "duration": "1:02:58"
  }
}
```

During the build, it will use that JSON file behind the scenes to retrieve `episode.size` and `episode.duration`, both in the podcast feed and in your templates, using the filename you have provided as `episode.filename`.

## Why `episodesData.json`?
