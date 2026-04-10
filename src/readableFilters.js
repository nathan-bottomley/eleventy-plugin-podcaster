import readableDuration from './readableDuration.js'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addFilter('readableDate', function (date) {
    const readableDateLocale = options.readableDateLocale ?? 'en-AU'
    return new Date(date).toLocaleDateString(readableDateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  })

  eleventyConfig.addFilter('readableDuration', (seconds, length) => {
    if (!seconds) return '0:00'
    if (length === 'long') {
      return readableDuration.longFormat(seconds)
    }
    return readableDuration.shortFormat(seconds)
  })

  eleventyConfig.addFilter('readableSize', (bytes, fixedPrecision = 1) => {
    if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(fixedPrecision)} kB`
    if (bytes < 1000 * 1000 * 1000) return `${(bytes / 1000 / 1000).toFixed(fixedPrecision)} MB`
    return `${(bytes / 1000 / 1000 / 1000).toFixed(fixedPrecision)} GB`
  })
}
