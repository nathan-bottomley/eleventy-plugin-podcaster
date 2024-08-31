# Episode information

The important information about each of your podcast episodes — the title, the date, the filename, the episode number, the size, the duration — should be made available in an `episode` object in the frontmatter of a post with an `episode` tag, like this:

```yaml
---
tags:
  - episode
episode:
  filename: 
  seasonNumber: 1
  episodeNumber: 1
  size: 61231442
  duration: "0:54:43"
  explicit: no
  type: episode
---
```

Here's a detailed description of the data you need to provide here.

| field | value |
| ----- | ----- |
| `filename` | The filename of the episode's audio file |

> [!NOTE]
This does seem like a lot of data to have to supply, but some of it is optional, and some of it can be supplied in simpler ways using things like directory data files or `eleventyComputed`.

jkghykjhgkj
