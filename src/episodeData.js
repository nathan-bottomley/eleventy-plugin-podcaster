import isEpisodePost from './isEpisodePost.js'

export default function (eleventyConfig, options = {}) {
  const postFilenameSeasonAndEpisodePattern =
    /^[sS](?<seasonNumber>\d+)[eE](?<episodeNumber>\d+)/i
  const postFilenameEpisodePattern = /^(?:e|ep|episode-)(?<episodeNumber>\d+)/i

  eleventyConfig.addGlobalData('eleventyComputed.episode.seasonNumber', () => {
    return data => {
      if (data.episode?.seasonNumber) return data.episode.seasonNumber

      if (!isEpisodePost(data)) return

      const seasonAndEpisodeMatch = data.page.fileSlug.match(postFilenameSeasonAndEpisodePattern)
      if (seasonAndEpisodeMatch) {
        return parseInt(seasonAndEpisodeMatch.groups.seasonNumber, 10)
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.episodeNumber', () => {
    return data => {
      if (data.episode?.episodeNumber) return data.episode.episodeNumber

      if (!isEpisodePost(data)) return

      const seasonAndEpisodeMatch = data.page.fileSlug.match(postFilenameSeasonAndEpisodePattern)
      if (seasonAndEpisodeMatch) {
        return parseInt(seasonAndEpisodeMatch.groups.episodeNumber, 10)
      }
      const episodeMatch = data.page.fileSlug.match(postFilenameEpisodePattern)
      if (episodeMatch) {
        return parseInt(episodeMatch.groups.episodeNumber, 10)
      } else {
        console.error(`[eleventy-plugin-podcaster] Cannot determine episode number for ${data.page.inputPath}. Please ensure the file slug contains a number or set the episodeNumber explicitly in the front matter.`)
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.permalink', () => {
    return data => {
      if (data.permalink) return data.permalink

      if (data.episode?.seasonNumber && data.episode?.episodeNumber) {
        return `/s${data.episode.seasonNumber}/e${data.episode.episodeNumber}/`
      } else if (data.episode?.episodeNumber) {
        return `/${data.episode.episodeNumber}/`
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.url', () => {
    return data => {
      if (!isEpisodePost(data)) return

      const episodeUrlBase = data.podcast.episodeUrlBase
      const filename = data.episode.filename
      return URL.parse(filename, episodeUrlBase)
    }
  })
}
