import test from 'ava'
import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

const fixture = './fixtures/generatingEpisodeAndPodcastDataFilesFromS3BucketNoEpisodeData'
const s3BucketEpisodeDataPath = path.join(process.cwd(), './fixtures/s3Buckets/noEpisodeData/cachedEpisodeData.json')
const cachedEpisodeDataPath = path.join(process.cwd(), `${fixture}/src/cachedEpisodeData.json`)

test.beforeEach(async (t) => {
  const eleventy = new Eleventy(
  `${fixture}/src`,
  `${fixture}/_site`,
  {
    configPath: `${fixture}/eleventy.config.js`
  })
  t.context.build = await eleventy.toJSON()
})

test.serial('the `cachedEpisodeData.json` file is generated', async (t) => {
  t.true(existsSync(cachedEpisodeDataPath))
})

test.serial('the `episodeData.json` file is correct', async (t) => {
  const episodeData = JSON.parse(readFileSync(cachedEpisodeDataPath))
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

test.afterEach.always(async (t) => {
  try {
    unlinkSync(s3BucketEpisodeDataPath)
  } catch (error) {
    console.error(`Failed to delete ${s3BucketEpisodeDataPath}`)
  }
  try {
    unlinkSync(cachedEpisodeDataPath)
  } catch (error) {
    console.error(`Failed to delete ${cachedEpisodeDataPath}:`, error)
  }
})
