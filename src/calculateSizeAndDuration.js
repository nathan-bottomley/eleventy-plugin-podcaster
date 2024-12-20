import { Duration } from 'luxon'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import mp3Duration from 'mp3-duration'
import hr from '@tsmx/human-readable'
import chalk from 'chalk'

const convertSecondsToReadableDuration = seconds =>
  Duration.fromMillis(seconds * 1000)
    .toFormat("d 'd' h 'h' m 'm' s.SSS 's'")

export default function (eleventyConfig, options = {}) {
  let firstRun = true
  eleventyConfig.on('eleventy.before', async ({ dir, directories }) => {
    // don't keep recalculating episode data in serve mode
    if (!firstRun || process.env.SKIP_EPISODE_CALCULATIONS === 'true') return
    firstRun = false

    const episodesDir = path.join(process.cwd(), options.episodesDir || 'episodes')
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
      const buffer = await readFile(episodePath)
      const episodeDuration = await mp3Duration(buffer)
      totalDuration += episodeDuration
      episodesData[episode] = {
        size: episodeSize,
        duration: episodeDuration
      }
    }

    const dataDir = path.join(process.cwd(), directories.data)
    await writeFile(path.join(dataDir, 'episodesData.json'), JSON.stringify(episodesData, null, 2))

    console.log(chalk.yellow(`${totalEpisodes} episodes; ${hr.fromBytes(totalSize)}; ${convertSecondsToReadableDuration(totalDuration)}.`))
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.size', () => {
    return data => {
      if (data.episode.size) return data.episode.size

      if (data.tags?.includes('podcastEpisode') && data.episodesData) {
        return data.episodesData[data.episode.filename]?.size
      }
    }
  })

  eleventyConfig.addGlobalData('eleventyComputed.episode.duration', () => {
    return data => {
      if (data.episode.duration) return data.episode.duration

      if (data.tags?.includes('podcastEpisode') && data.episodesData) {
        return data.episodesData[data.episode.filename]?.duration
      }
    }
  })
}
