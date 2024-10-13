export default (eleventyConfig, options = {}) => {
  if (!options.handleDrafts) return

  let hasLoggedAboutDrafts = false
  eleventyConfig.addPreprocessor('drafts', 'md', (data, _content) => {
    let shouldIncludeDrafts = false
    if (process.env.BUILD_DRAFTS === 'true') {
      shouldIncludeDrafts = true
    } else if (process.env.BUILD_DRAFTS === 'false') {
      shouldIncludeDrafts = false
    } else {
      shouldIncludeDrafts = (process.env.ELEVENTY_RUN_MODE !== 'build')
    }
    if (!hasLoggedAboutDrafts) {
      if (shouldIncludeDrafts) {
        console.log('Including drafts.')
      } else {
        console.log('Excluding drafts.')
      }
      hasLoggedAboutDrafts = true
    }
    if (data.draft && !shouldIncludeDrafts) {
      return false
    }
  })
}
