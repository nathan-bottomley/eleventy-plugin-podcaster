import test from 'ava'
import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

const fixture = './fixtures/generatingEpisodeAndPodcastDataFiles'
const episodeDataFilePath = path.join(process.cwd(), `${fixture}/src/_data/episodeData.json`)
const podcastDataFilePath = path.join(process.cwd(), `${fixture}/src/_data/podcastData.json`)

test.afterEach('delete episodesData file', async (t) => {
  unlinkSync(episodeDataFilePath)
  unlinkSync(podcastDataFilePath)
})

test.serial('the `episodeData.json` file is generated', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  t.true(existsSync(episodeDataFilePath))
})

test.serial('the `episodeData.json` file is correct', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  const episodeData = JSON.parse(readFileSync(episodeDataFilePath))
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

test.serial('the `podcastData.json` file is generated', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  t.true(existsSync(episodeDataFilePath))
})

test.serial('the `podcastData.json` file is correct', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  const podcastData = JSON.parse(readFileSync(podcastDataFilePath))
  const expectedPodcastData = {
    numberOfEpisodes: 2,
    totalSize: 60687577,
    totalDuration: 3535.046530612245
  }
  t.deepEqual(podcastData, expectedPodcastData)
})
