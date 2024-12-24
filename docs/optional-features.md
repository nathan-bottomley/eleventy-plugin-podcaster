# Optional features

**Podcaster** includes some optional features which you might find useful for your podcasting website. These features are turned off by default, in case you want to implement them some other way. You can enable one or both of them when you include the plugin in your eleventy configuration file, like this:

```js
// eleventy.config.js

import podcasterPlugin from 'eleventy-plugin-podcaster'

export default function (eleventyConfig) {
  .
  .
  eleventyConfig.addPlugin(podcasterPlugin, {
    handleDrafts: true,
    handleExcerpts: true,
    readableDateLocale: 'en-GB'
  })
  .
  .
}
```

## Drafts

If `handleDrafts` is set to `true`, the plugin will allow you to designate posts as drafts by including `draft: true` in their front matter (or elsewhere in the data cascade). By default, drafts will be included in the build when Eleventy is running in `serve` or `watch` mode, but will be excluded in `build` mode. You can override this default behaviour by setting the `BUILD_DRAFTS` environment variable to `true` or `false`.

## Excerpts

If `handleExcerpts` is set to `true`, the plugin will create excerpts for your podcast episode posts. Excerpts are shortened versions of your final content, which you can use on index pages or topic pages or guest pages instead of your complete post.

Excerpts are available in a template as `{{ excerpt }}`, but you will probably access them from a collection item, where they are available as `{{ item.data.excerpt }}`. Excerpts are HTML fragments.

**Podcaster** defines the excerpt in one of three ways, in order of priority.

1. As an `excerpt` field in the post's front matter. This should be written in Markdown.
2. The part of the post between the excerpt delimiters `<!---excerpt-->` and `<!---endexcerpt-->` .
3. The first paragraph in the post which is not nested inside another tag. (This is so that a blockquote at the beginning of a post isn't included in the excerpt.)

## `readableDate` filter

**Podcaster** optionally provides a `readableDate` filter, to match `readableDuration` and `readableSize`. It transforms a date into a localised string, which usually includes weekday, day of month, month and year.

To make **Podcaster** provide this filter, pass a locale string as one of the options when you're adding the plugin to your config file. In English, the two most common locale strings are `'en-GB'` and `'en-US'`.
