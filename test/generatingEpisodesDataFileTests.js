import test from 'ava'
import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

const fixture = './fixtures/generatingEpisodesDataFile'
const episodesDataFilePath = path.join(process.cwd(), `${fixture}/src/_data/episodesData.json`)

test.afterEach('delete episodesData file', async (t) => {
  unlinkSync(episodesDataFilePath)
})

test.serial('the `episodesData.json` file is generated', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  t.true(existsSync(episodesDataFilePath))
})

test.serial('the `episodesData.json` file is correct', async (t) => {
  const eleventy = new Eleventy(
    `${fixture}/src`,
    `${fixture}/_site`,
    {
      configPath: `${fixture}/eleventy.config.js`
    })
  await eleventy.toJSON()
  const episodesData = JSON.parse(readFileSync(episodesDataFilePath))
  const expectedEpisodesData = {
    '2GAB 1, The Star Beast.mp3': {
      size: 32004399,
      duration: 1947.481
    },
    '2GAB 2, Wild Blue Yonder.mp3': {
      size: 28683178,
      duration: 1587.905
    }
  }
  t.deepEqual(episodesData, expectedEpisodesData)
})
