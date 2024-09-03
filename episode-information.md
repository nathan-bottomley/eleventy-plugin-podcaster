# Episode information

The important information about each of your podcast episodes — the title, the date, the filename, the episode number, the size, the duration — should be made available in an `episode` object in the frontmatter of a post with an `episode` tag, like this:

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
 size: 61231442
 duration: "0:54:43"
 explicit: no
 episodeType: full
---
```

Here's a detailed description of the data you need to provide here.

| field | value | required? |
| ----- | ----- | ----- |
| `title` | The title of the episode; this will also be the title of the post on the website. | yes |
| `date` | The release date of the episode; this will also be the date of the post on the website | yes |
| `tags` | Every episode post must have the tag `podcastEpisode` included in the `tags` array. Other tags are also permitted. | yes |
| `episode.filename` | The filename of the episode's audio file. | yes |
| `episode.seasonNumber` | The  season number. (Most podcasts don't group their episodes into seasons.) | no |
| `episode.episodeNumber` | The episode number. Needn't be unique, but the combination of `seasonNumber` and `episodeNumber` should be unique. | yes |
| `episode.size` | The size of the episode's audio file in bytes. | yes |
| `episode.duration` | The duration of the episode in `mm:ss` or `h:mm:ss` format. (Apple Podcasts recommends that the duration should be specified in seconds, but as far as I can tell, no one actually does this.) | yes |
| `episode.explicit` | Warns listeners that this episode contains explicit language. Should be used for a single episode in an podcast that isn't marked as explicit. | no |
| `episode.type` | The type of episode. Defaults to `full` if omitted, meaning a full episode of your podcast. Other valid types are `trailer` and `bonus`. | no |

 > [!TIP]
 > This seems like a lot of information to provide for each episode. However, `eleventy-plugin-podcaster` can calculate `episode.size` and `episode.duration` for you.
