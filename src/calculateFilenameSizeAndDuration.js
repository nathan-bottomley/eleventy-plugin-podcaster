import { Duration } from 'luxon'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { parseFile as parseFileMetadata } from 'music-metadata'
import hr from '@tsmx/human-readable'
import chalk from 'chalk'

const convertSecondsToReadableDuration = seconds =>
  Duration.fromMillis(seconds * 1000)
    .shiftTo('days', 'hours', 'minutes', 'seconds')
    .toHuman()

const convertReadableDurationToSeconds = duration => {
  const durationPattern = /^(?:(?<hours>\d+):)?(?<minutes>\d{1,2}):(?<seconds>\d{2}(?:\.\d+)?)$/

  let match
  if (duration?.match) {
    match = duration.match(durationPattern)
  }

  if (match) {
    const hours = isNaN(parseInt(match.groups.hours))
      ? 0
      : parseInt(match.groups.hours)
    const minutes = parseInt(match.groups.minutes)
    const seconds = parseFloat(match.groups.seconds)
    return hours * 3600 + minutes * 60 + seconds
  }
}

async function readEpisodeDataLocally (episodeFilesDirectory) {
  const episodes = await readdir(episodeFilesDirectory)
  const episodeData = {}
  for (const episode of episodes) {
    if (!episode.endsWith('.mp3')) continue

    const episodePath = path.join(episodeFilesDirectory, episode)
    const episodeSize = (await stat(episodePath)).size
    const episodeMetadata = await parseFileMetadata(episodePath, { duration: true })
    const episodeDuration = episodeMetadata.format.duration
    episodeData[episode] = {
      size: episodeSize,
      duration: Math.round(episodeDuration * 1000) / 1000
    }
  }
  return episodeData
}

function calculatePodcastData (episodeData) {
  const episodeDataValues = Object.values(episodeData)
  const numberOfEpisodes = episodeDataValues.length
  const totalSize = episodeDataValues.map(x => x.size).reduce((x, y) => x + y)
  const totalDuration = episodeDataValues.map(x => x.duration).reduce((x, y) => x + y)
  return { numberOfEpisodes, totalSize, totalDuration }
}

function reportPodcastData (podcastData) {
  const { numberOfEpisodes, totalSize, totalDuration } = podcastData
  console.log(chalk.yellow(`${numberOfEpisodes} episodes; ${hr.fromBytes(totalSize)}; ${convertSecondsToReadableDuration(totalDuration)}.`))
}

async function writePodcastDataLocally (episodeData, podcastData, directories) {
  const dataDir = path.join(process.cwd(), directories.data)
  await writeFile(path.join(dataDir, 'episodeData.json'), JSON.stringify(episodeData, null, 2))
  await writeFile(path.join(dataDir, 'podcastData.json'), JSON.stringify(podcastData, null, 2))
}

function findMatchingFilename (episodeData, thisEpisode) {
  const filenameSeasonAndEpisodePattern =
    /^.*?\b[sS](?<seasonNumber>\d+)\s*[eE](?<episodeNumber>\d+)\b.*\.mp3$/
  const filenameEpisodePattern = /^.*?\b(?<episodeNumber>\d+)\b.*\.mp3$/
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

export default function (eleventyConfig) {
  let firstRun = true
  eleventyConfig.on('eleventy.before', async ({ directories }) => {
    if (!firstRun || process.env.SKIP_EPISODE_CALCULATIONS === 'true') return
    firstRun = false

    const episodeFilesDirectory = path.join(directories.input, 'episodeFiles')
    if (existsSync(episodeFilesDirectory)) {
      const episodeData = await readEpisodeDataLocally(episodeFilesDirectory)
      const podcastData = calculatePodcastData(episodeData)
      await writePodcastDataLocally(episodeData, podcastData, directories)
      reportPodcastData(podcastData)
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.filename', () => {
    return data => {
      if (data.episode.filename) return data.episode.filename
      if (!data.page.inputPath.includes('/episodePosts/')) return

      return findMatchingFilename(data.episodeData, data.episode)
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
      if (data.episode.duration) {
        const convertedReadableDuration = convertReadableDurationToSeconds(data.episode.duration)
        return convertedReadableDuration ?? data.episode.duration
      }

      if (data.page.inputPath.includes('/episodePosts/') && data.episodeData) {
        return data.episodeData[data.episode.filename]?.duration
      }
    }
  })
}
