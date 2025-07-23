import { Duration } from 'luxon'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { parseFile } from 'music-metadata'
import hr from '@tsmx/human-readable'
import chalk from 'chalk'

const convertSecondsToReadableDuration = seconds =>
  Duration.fromMillis(seconds * 1000)
    .shiftTo('days', 'hours', 'minutes', 'seconds')
    .toHuman()

export default function (eleventyConfig) {
  let firstRun = true
  eleventyConfig.on('eleventy.before', async ({ directories }) => {
    // don't keep recalculating episode data in serve mode
    if (!firstRun || process.env.SKIP_EPISODE_CALCULATIONS === 'true') return
    firstRun = false
    const episodesDir = path.join(directories.input, 'episodeFiles')
    if (!existsSync(episodesDir)) return

    const episodes = await readdir(episodesDir)
    const episodesData = {}
    let totalEpisodes = 0
    let totalSize = 0
    let totalDuration = 0

    for (const episode of episodes) {
      if (!episode.endsWith('.mp3')) continue

      totalEpisodes++
      const episodePath = path.join(episodesDir, episode)
      const episodeSize = (await stat(episodePath)).size
      totalSize += episodeSize
      const episodeMetadata = await parseFile(episodePath, { duration: true })
      const episodeDuration = episodeMetadata.format.duration
      totalDuration += episodeDuration
      episodesData[episode] = {
        size: episodeSize,
        duration: episodeDuration
      }
    }

    const dataDir = path.join(process.cwd(), directories.data)
    await writeFile(path.join(dataDir, 'episodeData.json'), JSON.stringify(episodesData, null, 2))

    console.log(chalk.yellow(`${totalEpisodes} episodes; ${hr.fromBytes(totalSize)}; ${convertSecondsToReadableDuration(totalDuration)}.`))
  })

  const filenameSeasonAndEpisodePattern =
    /^.*?\b[sS](?<seasonNumber>\d+)[eE](?<episodeNumber>\d+)\b.*\.mp3$/
  const filenameEpisodePattern = /^.*?\b(?<episodeNumber>\d+)\b.*\.mp3$/

  eleventyConfig.addGlobalData('eleventyComputed.episode.filename', () => {
    return data => {
      if (data.episode.filename) return data.episode.filename

      if (data.page.inputPath.includes('/episodePosts/') && data.episodeData) {
        for (const file of Object.keys(data.episodeData)) {
          const seasonAndEpisodeMatch = file.match(filenameSeasonAndEpisodePattern)
          if (seasonAndEpisodeMatch) {
            const matchedSeasonNumber = parseInt(seasonAndEpisodeMatch.groups.seasonNumber)
            const matchedEpisodeNumber = parseInt(seasonAndEpisodeMatch.groups.episodeNumber)
            if (matchedSeasonNumber === data.episode.seasonNumber &&
                matchedEpisodeNumber === data.episode.episodeNumber) {
              return file
            }
          }
          const episodeMatch = file.match(filenameEpisodePattern)
          if (episodeMatch) {
            const matchedEpisodeNumber = parseInt(episodeMatch.groups.episodeNumber)
            if (matchedEpisodeNumber === data.episode.episodeNumber) {
              return file
            }
          }
        }
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.size', () => {
    return data => {
      if (data.episode.size) return data.episode.size
      if (data.page.inputPath.includes('/episodePosts/') && data.episodeData) {
        return data.episodeData[data.episode.filename]?.size
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.duration', () => {
    return data => {
      if (data.episode.duration) return data.episode.duration

      if (data.page.inputPath.includes('/episodePosts/') && data.episodeData) {
        return data.episodeData[data.episode.filename]?.duration
      }
    }
  })
}
