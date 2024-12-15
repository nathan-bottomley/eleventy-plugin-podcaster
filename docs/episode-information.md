# Episode information

Each episode of your podcast should have an associated Eleventy template, with a `podcastEpisode` tag. The front matter of this template will contain the necessary information about the episode, and the content of the template will be the show notes.

## Front matter

The important information about each of your podcast episodes — the title, the date, the filename, the episode number, the size, the duration — should be made available in an `episode` object in the front matter of a post with an `podcastEpisode` tag, like this:

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
  duration: 3283
  explicit: no
  episodeType: full
excerpt: >-
    A big week for beginnings this week, with a new Doctor, 
    a new origin story for the Daleks, and a whole new approach 
    to defeating the bad guys. Oh, and a new podcast to discuss 
    them all on. So let’s welcome Patrick Troughton to the studio
    floor, as we discuss _The Power of the Daleks_.
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
| `episode.episodeNumber` | The episode number. Needn't be unique, but the combination of `seasonNumber` and `episodeNumber` must be unique. | yes |
| `episode.size` | The size of the episode's audio file in bytes. | yes |
| `episode.duration` | The duration of the episode as a number of seconds. You can convert this to `h:mm:ss` format using Podcaster's `readableDuration` filter. | yes |
| `episode.explicit` | Warns listeners that this episode contains explicit language. Should be used for a single episode in a podcast that isn't itself marked as explicit. | no |
| `episode.type` | The type of episode. Defaults to `full`, meaning a full episode of the podcast. Other valid types are `trailer` and `bonus`. | no |
| `excerpt` | A shorter version of the content of the post, written in Markdown. For use in lists of episodes where the show notes are long. | no |

> [!TIP]
> It's possible for **Podcaster** to calculate the size and duration for each episode if it has access to your episode audio files. [Read more to find out how](docs/size-and-duration.md).

> [!TIP]
> It's also possible for **Podcaster** to automatically create an `excerpt` for each episode. [Read more to find out how](/docs/optional-features.md#excerpts).
