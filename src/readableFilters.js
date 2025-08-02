import { DateTime, Duration } from 'luxon'
import hr from '@tsmx/human-readable'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addFilter('readableDate', function (date) {
    const readableDateLocale = options.readableDateLocale ?? 'en-AU'
    if (date instanceof Date) {
      date = date.toISOString()
    }
    const result = DateTime.fromISO(date, {
      zone: 'UTC'
    })
    return result.setLocale(readableDateLocale).toLocaleString(DateTime.DATE_HUGE)
  })

  eleventyConfig.addFilter('readableDuration', (seconds, length) => {
    if (!seconds) return '0:00:00'
    if (length === 'long') {
      return Duration.fromMillis(seconds * 1000)
        .shiftTo('days', 'hours', 'minutes', 'seconds')
        .toHuman()
    } else if (seconds < 60 * 60) {
      return Duration.fromMillis(seconds * 1000).toFormat('mm:ss')
    } else {
      return Duration.fromMillis(seconds * 1000).toFormat('h:mm:ss')
    }
  })

  eleventyConfig.addFilter('readableSize', (bytes, fixedPrecision = 1) =>
    hr.fromBytes(bytes, { fixedPrecision })
  )
}
