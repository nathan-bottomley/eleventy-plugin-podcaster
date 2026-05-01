export default function (eleventyConfig) {
  eleventyConfig.addFilter('transcriptMimeType', (filePath) => {
    const mimeTypes = {
      srt: 'application/x-subrip',
      vtt: 'text/vtt',
      json: 'application/json',
      html: 'text/html'
    }
    const extension = filePath.split('.').pop()
    return mimeTypes[extension] || 'text/plain'
  })
}
