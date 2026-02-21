import readableDuration from './readableDuration.js'
import path from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { Writable } from 'node:stream'
import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { parseFile as parseFileMetadata, parseBuffer as parseBufferMetadata } from 'music-metadata'
import isEpisodePost from './isEpisodePost.js'

const isAudioFile = episodeFilename => episodeFilename.endsWith('.mp3') ||
                    episodeFilename.endsWith('.m4a')

async function calculateEpisodeDataLocally (episodeFilesDirectory) {
  const episodes = await readdir(episodeFilesDirectory)
  const episodeData = {}
  for (const episode of episodes) {
    if (!isAudioFile(episode)) continue

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
  if (episodeData === null) return null

  const episodeDataValues = Object.values(episodeData)
  const numberOfEpisodes = episodeDataValues.length
  const totalSize = episodeDataValues.map(x => x.size).reduce((x, y) => x + y, 0)
  const totalDuration = episodeDataValues.map(x => x.duration).reduce((x, y) => x + y, 0)
  return { numberOfEpisodes, totalSize, totalDuration }
}

function getS3Storage (options) {
  if (options.s3StorageObject) return options.s3StorageObject

  if (options.s3Storage) {
    return new S3Client({
      forcePathStyle: true,
      endpoint: options.s3Storage.endpoint,
      region: options.s3Storage.region,
      credentials: {
        accessKeyId: options.s3Storage.accessKey,
        secretAccessKey: options.s3Storage.secretKey
      }
    })
  }
}

async function getObjectFromS3Bucket (s3Storage, s3Bucket, key) {
  const getObjectResponse = await s3Storage.send(new GetObjectCommand({ Bucket: s3Bucket, Key: key }))

  const chunks = []
  if (typeof getObjectResponse.Body.pipe === 'function') {
    // this is to cope with the behaviour of the mock, which doesn't return an iterator full of chunks
    const writable = new Writable({
      write (chunk, encoding, callback) {
        chunks.push(chunk)
        callback()
      },
      final (callback) {
        callback()
      }
    })
    getObjectResponse.Body.pipe(writable)
    await new Promise((resolve, reject) => {
      writable.on('finish', resolve)
      writable.on('error', reject)
    })
  } else {
    for await (const chunk of getObjectResponse.Body) {
      chunks.push(chunk)
    }
  }
  const buffer = Buffer.concat(chunks)
  return { buffer, lastModified: getObjectResponse.LastModified }
}

async function getCachedEpisodeDataFromS3Bucket (s3Storage, s3Bucket) {
  try {
    const { buffer, lastModified } = await getObjectFromS3Bucket(s3Storage, s3Bucket, 'cachedEpisodeData.json')
    return { episodeData: JSON.parse(buffer.toString()), lastModified }
  } catch (err) {
    return { episodeData: {}, lastModified: null }
  }
}

async function calculateEpisodeDataFromS3Bucket (s3Storage, s3Bucket) {
  const cachedEpisodeData = await getCachedEpisodeDataFromS3Bucket(s3Storage, s3Bucket)
  const cachedEpisodeDataLastModifiedDate = (cachedEpisodeData.lastModified)
    ? new Date(cachedEpisodeData.lastModified)
    : null

  console.log(`Reading episode data from S3 bucket ${s3Bucket}`)
  const list = await s3Storage.send(new ListObjectsCommand({ Bucket: s3Bucket }))
  const result = { ...cachedEpisodeData.episodeData }
  for (const item of list.Contents ?? []) {
    if (!isAudioFile(item.Key)) continue

    const { Key: filename, Size: size, LastModified: lastModified } = item

    if (!(filename in result) ||
        !('size' in result[filename]) ||
        !('duration' in result[filename]) ||
        !cachedEpisodeDataLastModifiedDate ||
        cachedEpisodeDataLastModifiedDate < new Date(lastModified)) {
      const { buffer } = await getObjectFromS3Bucket(s3Storage, s3Bucket, filename)
      const metadata = await parseBufferMetadata(buffer, null, { duration: true })
      const duration = metadata.format.duration
      result[filename] = { size, duration }
    }
  }
  return result
}

async function cacheEpisodeDataToS3Bucket (s3Storage, s3Bucket, episodeData) {
  await s3Storage.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: 'cachedEpisodeData.json',
    Body: JSON.stringify(episodeData, null, 2),
    ContentType: 'application/json'
  }))
}

export default function (eleventyConfig, options = {}) {
  let cachedFunctionResult
  eleventyConfig.addGlobalData('episodeData', async () => {
    if (cachedFunctionResult) {
      return cachedFunctionResult
    }
    let episodeData = {}
    const cachedEpisodeDataPath = path.join(eleventyConfig.directories.input, 'cachedEpisodeData.json')
    if (options.episodeFilesDirectory &&
        existsSync(options.episodeFilesDirectory) &&
        process.env.SKIP_EPISODE_CALCULATIONS !== 'true') {
      episodeData = await calculateEpisodeDataLocally(options.episodeFilesDirectory)
      await writeFile(cachedEpisodeDataPath, JSON.stringify(episodeData, null, 2))
    } else if ((options.s3Storage || options.s3StorageObject) &&
               process.env.SKIP_EPISODE_CALCULATIONS !== 'true') {
      const s3Storage = getS3Storage(options)
      const s3Bucket = options.s3Storage.bucket
      episodeData = await calculateEpisodeDataFromS3Bucket(s3Storage, s3Bucket)
      cacheEpisodeDataToS3Bucket(s3Storage, s3Bucket, episodeData)
      await writeFile(cachedEpisodeDataPath, JSON.stringify(episodeData, null, 2))
    } else if (existsSync(cachedEpisodeDataPath)) {
      episodeData = JSON.parse(readFileSync(cachedEpisodeDataPath))
    }
    cachedFunctionResult = episodeData
    return episodeData
  })

  eleventyConfig.addGlobalData('eleventyComputed.podcastData', async () => {
    return (data) => calculatePodcastData(data.episodeData)
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.size', () => {
    return data => {
      if (data.episode.size) return data.episode.size
      if (isEpisodePost(data, options) && data.episodeData) {
        return data.episodeData[data.episode.filename]?.size
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.duration', () => {
    return data => {
      if (data.episode.duration) {
        const convertedReadableDuration = readableDuration.convertToSeconds(data.episode.duration)
        return convertedReadableDuration ?? data.episode.duration
      }

      if (isEpisodePost(data, options) && data.episodeData) {
        return data.episodeData[data.episode.filename]?.duration
      }
    }
  })
}
