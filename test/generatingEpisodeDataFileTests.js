import test from 'ava'
import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

const fixture = './fixtures/generatingEpisodesDataFile'
const episodeDataFilePath = path.join(process.cwd(), `${fixture}/src/_data/episodeData.json`)

test.afterEach('delete episodesData file', async (t) => {
  unlinkSync(episodeDataFilePath)
})

test.serial('the `episodesData.json` file is generated', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  t.true(existsSync(episodeDataFilePath))
})

test.serial('the `episodesData.json` file is correct', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  const episodesData = JSON.parse(readFileSync(episodeDataFilePath))
  const expectedEpisodesData = {
    '2GAB 1, The Star Beast.mp3': {
      size: 32004399,
      duration: 1947.2979591836734
    },
    '2GAB 2, Wild Blue Yonder.mp3': {
      size: 28683178,
      duration: 1587.7485714285715
    }
  }
  t.deepEqual(episodesData, expectedEpisodesData)
})
