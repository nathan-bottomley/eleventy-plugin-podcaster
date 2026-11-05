export default function (eleventyConfig) {
  eleventyConfig.addFilter('episodeMimeType', (filename) => {
    const mimeTypes = {
      mp3: 'audio/mpeg',
      m4a: 'audio/x-m4a'
    }
    const extension = filename.split('.').pop()
    return mimeTypes[extension] || 'audio/mpeg'
  })
}
