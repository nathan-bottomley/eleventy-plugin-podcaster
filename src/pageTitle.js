export default function (eleventyConfig, options = {}) {
  const separator = (options.handlePageTitles === true)
    ? '&middot;'
    : options.handlePageTitles

  eleventyConfig.addGlobalData('eleventyComputed.pageTitle', () => {
    return data => {
      const siteTitle = data.site?.title || data.podcast.title
      if (data.title && data.title.length > 0 && data.title !== siteTitle) {
        return `${data.title} ${separator} ${siteTitle}`
      } else {
        return siteTitle
      }
    }
  })
}
