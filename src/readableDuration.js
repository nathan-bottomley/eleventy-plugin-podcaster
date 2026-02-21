function pluralise (value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`
}

function toComponents (seconds) {
  return {
    d: Math.floor(seconds / 86400),
    h: Math.floor((seconds % 86400) / 3600),
    m: Math.floor((seconds % 3600) / 60),
    s: Math.round((seconds % 60) * 1000) / 1000
  }
}

export default {
  longFormat (seconds) {
    const { d, h, m, s } = toComponents(seconds)
    return [pluralise(d, 'day'), pluralise(h, 'hour'), pluralise(m, 'minute'), pluralise(s, 'second')].join(', ')
  },
  shortFormat (seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h === 0) {
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
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
