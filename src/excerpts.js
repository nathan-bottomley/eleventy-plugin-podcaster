import * as htmlparser2 from 'htmlparser2'
import render from 'dom-serializer'
import markdownIt from 'markdown-it'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addGlobalData('eleventyComputed.excerpt', () => {
    if (!options.handleExcerpts) return

    return (data) => {
      if (!data.tags?.includes('podcastEpisode')) return

      const md = markdownIt()
      if (data.excerpt) {
        return md.render(data.excerpt)
      }
      let content = data.page.rawInput
      if (data.page.templateSyntax.includes('md')) {
        content = md.render(content)
      }
      const dom = htmlparser2.parseDocument(content)
      const paragraph = dom.children.find(item => item.type === 'tag' && item.name === 'p')
      if (paragraph) {
        return render(paragraph)
      }
    }
  })
}
