import * as htmlparser2 from 'htmlparser2'
import render from 'dom-serializer'
import markdownIt from 'markdown-it'

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addGlobalData('eleventyComputed.excerpt', () => {
    return (data) => {
      if (!data.page.inputPath.includes('/episodePosts/')) return

      const md = markdownIt({
        html: true,
        typographer: true
      })

      // If an excerpt is set in front matter, use it
      if (data.excerpt) {
        return md.render(data.excerpt)
      }

      const content = data.page.rawInput
      const contentIsMarkdown = data.page.templateSyntax.includes('md')

      // If an excerpt is set using comment delimiters, use it
      const excerptPattern = /<!---excerpt-->\s*(.*?)\s*<!---endexcerpt-->/s
      const match = excerptPattern.exec(content)
      if (match && contentIsMarkdown) {
        return md.render(match[1])
      } else if (match) {
        return match[1]
      }

      // If an excerpt is not set, use the first paragraph not in a blockquote
      let htmlContent
      if (data.page.templateSyntax.includes('md')) {
        htmlContent = md.render(content)
      } // otherwise it's already HTML
      const dom = htmlparser2.parseDocument(htmlContent)
      const paragraph = dom.children.find(item => item.type === 'tag' && item.name === 'p')
      if (paragraph) {
        const result = render(paragraph, { encodeEntities: 'utf8' })
        return result
      }
    }
  })
}
