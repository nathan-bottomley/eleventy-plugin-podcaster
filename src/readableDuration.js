import { Duration } from 'luxon'

export default {
  convertFromSeconds (seconds) {
    Duration.fromMillis(seconds * 1000)
      .shiftTo('days', 'hours', 'minutes', 'seconds')
      .toHuman()
  },
  convertToSeconds (duration) {
    const durationPattern = /^(?:(?<hours>\d+):)?(?<minutes>\d{1,2}):(?<seconds>\d{2}(?:\.\d+)?)$/

    let match
    if (duration?.match) {
      match = duration.match(durationPattern)
    }

    if (match) {
      const hours = isNaN(parseInt(match.groups.hours))
        ? 0
        : parseInt(match.groups.hours)
      const minutes = parseInt(match.groups.minutes)
      const seconds = parseFloat(match.groups.seconds)
      return hours * 3600 + minutes * 60 + seconds
    }
  }
}
