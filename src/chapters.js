import readableDuration from './readableDuration.js'

export default (eleventyConfig, options = {}) => {
  eleventyConfig.addFilter('normalizeChaptersData', (data) => {
    const result = data.map(x => {
      if (x.startTime) {
        x.startTime = readableDuration.convertToSeconds(x.startTime) ?? x.startTime
      }
      return x
    })
    return JSON.stringify({
      version: '1.2.0',
      chapters: result
    }, null, 2)
  })
}
