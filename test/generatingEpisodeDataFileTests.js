import test from 'ava'
import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

const fixture = './fixtures/generatingEpisodeAndPodcastDataFiles'
const cachedEpisodeDataPath = path.join(process.cwd(), `${fixture}/src/cachedEpisodeData.json`)

test.beforeEach(async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
})

test.serial('the `cachedEpisodeData.json` file is generated', async (t) => {
  t.true(existsSync(cachedEpisodeDataPath))
})

test.serial('the `cachedEpisodeData.json` file is correct', async (t) => {
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
  t.deepEqual(episodeData, expectedEpisodeData)
})

test.afterEach.always(async (t) => {
  try {
    unlinkSync(cachedEpisodeDataPath)
  } catch (error) {
    console.error(`Failed to delete ${cachedEpisodeDataPath}:`, error)
  }
})
