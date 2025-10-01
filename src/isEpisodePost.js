import path from 'node:path'

export default function isEpisodePost (data, options) {
  if (data.page?.inputPath) {
    const importPath = path.normalize(data.page.inputPath)
    return importPath.startsWith(options.episodePostsDirectory)
  } else {
    return false
  }
}
