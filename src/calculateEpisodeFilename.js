import isEpisodePost from './isEpisodePost.js'

function findMatchingFilename (episodeData, thisEpisode) {
  const filenameSeasonAndEpisodePattern =
    /\bs(?<seasonNumber>\d+)\s*e(?<episodeNumber>\d+)\b/i
  const filenameEpisodePattern = /\b(?<episodeNumber>\d+)\b/
  const { seasonNumber, episodeNumber } = thisEpisode

  for (const file of Object.keys(episodeData)) {
    if (seasonNumber && episodeNumber) {
      const seasonAndEpisodeMatch = file.match(filenameSeasonAndEpisodePattern)
      if (seasonAndEpisodeMatch) {
        const matchedSeasonNumber = parseInt(seasonAndEpisodeMatch.groups.seasonNumber)
        const matchedEpisodeNumber = parseInt(seasonAndEpisodeMatch.groups.episodeNumber)
        if (matchedSeasonNumber === seasonNumber &&
            matchedEpisodeNumber === episodeNumber) {
          return file
        }
      }
    } else if (episodeNumber) {
      const episodeMatch = file.match(filenameEpisodePattern)
      if (episodeMatch) {
        const matchedEpisodeNumber = parseInt(episodeMatch.groups.episodeNumber)
        if (matchedEpisodeNumber === episodeNumber) {
          return file
        }
      }
    }
  }
}

export default function (eleventyConfig, options) {
  eleventyConfig.addGlobalData('eleventyComputed.episode.filename', () => {
    return data => {
      if (data.episode.filename) return data.episode.filename
      if (!isEpisodePost(data, options)) return

      return findMatchingFilename(data.episodeData, data.episode)
    }
  })
}
