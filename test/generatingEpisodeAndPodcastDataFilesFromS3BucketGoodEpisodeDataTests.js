import test from 'ava'
import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

const fixture = './fixtures/generatingEpisodeAndPodcastDataFilesFromS3BucketGoodEpisodeData'
const s3BucketEpisodeDataPath = path.join(process.cwd(), 'fixtures/s3Buckets/goodEpisodeData/episodeData.json')
const episodeDataPath = path.join(process.cwd(), `${fixture}/src/_data/episodeData.json`)
const podcastDataPath = path.join(process.cwd(), `${fixture}/src/_data/podcastData.json`)

test.beforeEach(async (t) => {
  const eleventy = new Eleventy(
  `${fixture}/src`,
  `${fixture}/_site`,
  {
    configPath: `${fixture}/eleventy.config.js`
  })
  t.context.build = await eleventy.toJSON()
})

test.serial('the `episodeData.json` file is generated', async (t) => {
  t.true(existsSync(episodeDataPath))
})

test.serial('the `episodeData.json` file is correct', async (t) => {
  const episodeData = JSON.parse(readFileSync(episodeDataPath))
  const expectedEpisodeData = {
    '2GAB 1, The Star Beast.mp3': {
      size: 32004399,
      duration: 1947.2979591836734
    },
    '2GAB 2, Wild Blue Yonder.mp3': {
      size: 28683178,
      duration: 1587.7485714285715
    }
  }
  t.like(episodeData, expectedEpisodeData)
})

test.serial('the `episodeData.json` file is added to the S3 bucket', async (t) => {
  t.true(existsSync(s3BucketEpisodeDataPath))
})

test.serial('the `podcastData.json` file is generated', async (t) => {
  t.true(existsSync(podcastDataPath))
})

test.serial('the `podcastData.json` file is correct', async (t) => {
  const podcastData = JSON.parse(readFileSync(podcastDataPath))
  const expectedPodcastData = {
    numberOfEpisodes: 2,
    totalSize: 60687577,
    totalDuration: 3535.046530612245
  }
  t.deepEqual(podcastData, expectedPodcastData)
})

test.afterEach.always(async (t) => {
  try {
    unlinkSync(episodeDataPath)
  } catch (error) {
    console.error(`Failed to delete ${episodeDataPath}:`, error)
  }
  try {
    unlinkSync(podcastDataPath)
  } catch (error) {
    console.error(`Failed to delete ${podcastDataPath}:`, error)
  }
})
