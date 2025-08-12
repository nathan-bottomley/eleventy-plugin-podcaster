import { Duration } from 'luxon'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { createWriteStream, unlinkSync } from 'node:fs'
import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import 'dotenv/config'
import { parseFile as parseFileMetadata, parseBuffer as parseBufferMetadata } from 'music-metadata'
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
      duration: episodeDuration
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

function getS3Client (options) {
  if (options.s3Client) return options.s3Client

  if (options.s3ClientEndpoint) {
    return new S3Client({
      forcePathStyle: true,
      endpoint: options.s3ClientEndpoint,
      region: options.s3ClientRegion,
      credentials: {
        accessKeyId: process.env.S3_SECRET_KEY,
        secretAccessKey: process.env.S3_ACCESS_KEY
      }
    })
  }
}

async function readEpisodeDataFromS3Bucket (s3Client, s3BucketName) {
  const list = await s3Client.send(new ListObjectsCommand({ Bucket: s3BucketName }))
  const result = {}
  for (const item of list.Contents ?? []) {
    if (!item.Key.endsWith('.mp3')) continue

    const { Key: filename, Size: size, LastModified: lastModified } = item
    const getObjectResponse = await s3Client.send(new GetObjectCommand({ Bucket: s3BucketName, Key: filename }))
    const chunks = []
    let metadata
    if (typeof getObjectResponse.Body.pipe === 'function') {
      // this is to cope with the behaviour of the mock, which doesn't return an iterator full of chunks
      const tempFilename = path.join(process.cwd(), filename)
      const file = createWriteStream(tempFilename)
      getObjectResponse.Body.pipe(file)
      await new Promise((resolve, reject) => {
        file.on('finish', resolve)
        file.on('error', reject)
      })
      metadata = await parseFileMetadata(tempFilename, { duration: true })
      unlinkSync(tempFilename)
    } else {
      for await (const chunk of getObjectResponse.Body) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)
      metadata = await parseBufferMetadata(buffer, null, { duration: true })
    }
    const duration = metadata.format.duration
    result[filename] = { size, lastModified, duration }
  }
  return result
}

async function writeEpisodeDataToS3Bucket (s3Client, s3BucketName, episodeData) {
  await s3Client.send(new PutObjectCommand({
    Bucket: s3BucketName,
    Key: 'episodeData.json',
    Body: JSON.stringify(episodeData, null, 2),
    ContentType: 'application/json'
  }))
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

export default function (eleventyConfig, options = {}) {
  let firstRun = true
  eleventyConfig.on('eleventy.before', async ({ directories }) => {
    if (!firstRun || process.env.SKIP_EPISODE_CALCULATIONS === 'true') return
    firstRun = false

    const episodeFilesDirectory = path.join(directories.input, 'episodeFiles')
    let episodeData
    if (existsSync(episodeFilesDirectory)) {
      episodeData = await readEpisodeDataLocally(episodeFilesDirectory)
    } else if (options.s3Client || options.s3ClientEndpoint) {
      const s3Client = getS3Client(options)
      const s3BucketName = options.s3BucketName
      episodeData = await readEpisodeDataFromS3Bucket(s3Client, s3BucketName)
      await writeEpisodeDataToS3Bucket(s3Client, s3BucketName, episodeData)
    } else {
      return
    }
    const podcastData = calculatePodcastData(episodeData)
    await writePodcastDataLocally(episodeData, podcastData, directories)
    reportPodcastData(podcastData)
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
