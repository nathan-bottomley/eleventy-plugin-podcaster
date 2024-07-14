# eleventy-plugin-podcasting 🕚⚡️🎈🐀🎙️

`eleventy-plugin-podcasting` converts an Eleventy blog into a podcast site. It provides you with all the functionality you need to make your podcast fully accessible from your site, and it creates a podcast feed which you can submit to Apple Podcasts, Spotify or any other podcast directory.

## Installation

```shell
npm install eleventy-plugin-podcasting
```

## Usage

To create a podcast feed, you need these three things:

1. Information about your podcast
2. Information about the individual episodes
3. The episodes themselves

Here's how you provide those things in your site.

### Providing information about your podcast

The important information about your podcast — the title, the owner, the category, the subcategory and so on — should be made available in a `podcast` object in the data cascade. The easiest way to do this is to put all the information in your data directory in a `podcast.json` file.

```json
# podcast.json

{
  "title": "Flight Through Entirety: A Doctor Who Podcast",
  "subtitle": "Flying through the entirety of Doctor Who. Originally with cake,but now with guests.", 
  "description": "Flying through the entirety of Doctor Who. Originally with cake,but now with guests.", 
  "summary": "Flying through the entirety of Doctor Who. Originally with cake,but now with guests.", 
  "email": "flightthroughentirety@gmail.com",
  "language": "en-AU".
  "author": "Flight Through Entirety",
  "owner": "Nathan Bottomley",
  "explicit": false,
  "category": "TV & Film (# TODO: make sure this works without &amp;)",
  "subcategory": "TV Reviews",
  "complete": false
}
```

>Explanations of all of the fields here can be found on [Apple's page about podcast feed tags](https://help.apple.com/itc/podcasts_connect/#/itcb54353390). A list of podcast categories and subcategories [can be found here](https://podcasters.apple.com/support/1691-apple-podcasts-categories).

You will also need to provide your podcast artwork, which should be a JPEG file 3000 × 3000 pixels in size. `jekyll-podcast` will expect to find this file at `/assets/images/podcast-logo.jpeg`.

### Providing information about your podcast episodes

Each post in the `_posts` directory will correspond to an episode of your podcast. So, for example, the publication date of the post will be the publication date of the episode, and the content of the post will be the episode's description or shownotes, which will (normally) be displayed in your listeners' podcast player.

Other information about your podcast episodes should be provided in each post's front matter. Here's an example.

```yaml
tags: #optional
- Series 6
- The Eleventh Doctor
contributors: #also optional
- Nathan Bottomley
podcast:
  # the episode number
  episode: 217
  # the episode filename, including the extension
  file: >-
    FTE 217, Gaslight Girlboss Ginger (Day of the Moon).mp3
  # optional
  recording_date: 2021-08-01
```

### The episode files

By default, you will store your episodes in `/assets/episodes`, and they will be served directly from your website.

If you use an analytics service that requires a URL prefix to track your episodes' data, you will need to provide that prefix as part of the `podcast` block in `_config.yml`.

```yaml
# _config.yml

podcast:
  tracking_prefix: https://dts.podtrac.com/redirect.mp3
```

If you use a CDN or an S3-compatible storage solution to host your podcast episodes, you will need to provide the URL for that sevice. You must also store your episodes in a folder called `/_episodes`, so that Jekyll doesn't include the episode files in the website it builds.

```yaml
# _config.yml

podcast:
  remote_episode_host: https://flight-through-entirety.us-east-1.linodeobjects.com
```

> If you store your episodes on some other service, you will have to take care of uploading the episodes to that service yourself. I generally write a build script using `rsync` or `s3cmd sync` to do this.

### Creating your podcast feed

If you set up your `_config.yml` file and the front matter of your posts as specified above, `jekyll-podcast` will have enough information to create your podcast feed.

Your podcast feed will appear in your `_site` directory at `feed/podcast`.

### Your shownotes

The contents of each episode's post will appear on the website, as usual, but it will also be used as the description or shownotes for your episode and displayed in your listeners' podcast players.

It's easy to make a podcast player show a different description from the post displayed on your site. Just create an include called `post-feed-content.html` in the `_includes` folder and use it to define the content that you want to appear in a podcast player. Here's an example.

```html
<!-- post-feed-content.html -->

<p>
  <em>
    {{ post.star_trek.series }}, 
    {{ post.star_trek.episode }}.
    First broadcast on {{ post.star_trek.broadcast | date: "%A, %e %B %Y" }}
  </em>
</p>

{{ post.content }}
```

### Podcast episode permalinks

Unlike a blog, a podcast website should have simple permalinks. Best practice tends to be just the episode number.

```url
https://flightthroughentirety.com/217
```

To make this possible, `jekyll-podcast` provides a `:podcast_episode` placeholder, which you can use in your default permalink definitions in `_config.yml`.

```yaml
# _config.yml

- scope:
    path: ""
    type: posts
  values:
    permalink: /:podcast_episode/
```

> You can combine this placeholder with other placeholders if you like. One possibility might be combining the episode number with the slug, like this:
>
> ```yaml
> # _config.yml
> 
> values:
>   permalink: /:podcast_episode-:slug/
> ```
>
>
> Remember to put the `/` at the end of the permalink pattern, so that you don't end up with the `.html` suffix at the end of your URLs.

### Podcast episode data

When `jekyll-podcast` builds your site, it analyses the podcast episodes in your `assets/episodes` folder (or your `_episodes` folder). As a result, the following information becomes available to your Liquid templates.

```liquid
{{ post.podcast.duration }} 
→ 0:57:22

{{ post.podcast.size_in_megabytes }}
→ 40.1 MB
```

You might want to consider adding the recording date to the podcast blog in the front matter of your posts, so that you can display it in your posts as well.

```yaml
podcast:
  recording_date: 2022-07-13
```

```liquid
{{ post.podcast.recording_date | date: "%A, %e %B %Y" }} 
→ Wednesday, 13 July 2022
```

### Including an `<audio>` tag

You should also create an include for your post so that your listeners can listen to the episodes on your website. The easiest way to do this is using an `<audio>` tag. `jekyll-podcast` provides a liquid filter called `episode_url`, which will add the correct URL to the filename you provide in your front matter.

Here's an example.

```html
<!-- _includes/audio-player.html -->

<audio controls preload="metadata" src="{{ post.podcast.file | episode_url }}"></audio>
```

### Podcast data

While `jekyll-podcast` is analysing your podcast files, it collects some interesting information about your podcast, and logs it to screen as part of the build process. This information includes the number of episodes, their total size in megabytes and their total duration (to the nearest millisecond).

```shell
236 episodes; 15786.9 MB; 9 d 16 h 6 min 25.577 s 
```

### Contributor pages

`jekyll-podcasts` has a feature which allows you to create bio pages for each of your contributors. These pages can include whatever information you like, including a chronological list of all of the episodes that a contributor has appeared in.

To get this to work, you need to create a Jekyll collection for your contributor pages. To do this, add a block like this to `_config.yml`.

```yaml
# _config.yml

collections:
  contributors:
    output: true
    permalink: /contributors/:slug/
```

Then create a layout for your contributor pages, and specify it as a default in `_config.yml`.

```yaml
# _config.yml

defaults:
  - scope:
      path: ""
      type: contributors
    values:
      layout: contributors-page
```

This layout should include the page content, and then iterate through the contributor's posts, which are all accessible to the layout and the page as `{{ page.posts }}`. Here's a simple example.

```html
<!-- contributors-page.html -->

<h1>page.title</h1>

{{ content }}

{% for post in page.posts %}
  <article>
    <h1>{{ post.title }}</h1>
    {{ post.content }}
  </article>
{% endfor %}
```

Now you can create the contributor's pages. Each page can contain a picture, a bio and anything else you want. So long as you set the layout in the front matter to `contributors-page`, the pages will display all of the episodes that the contributor is involved in.

To indicate which contributors are involved in a particular episode, just add a list of contributors to the front matter of the corresponding post.

```yaml
contributors:
- Jonathan Archer
- Gabriel Lorca
- Christopher Pike
- James T Kirk
```

> Originally this feature was called _Guest pages_, and it's still possible to call this feature whatever you want. Just provide an replacement name in plural form to the `podcast` block in `_config.yml` as the `contributors_alias`, like this:
>
>```yaml
> # _config.yml
>
> podcast:
>  contributors_alias: guests
> ```
>
> If you do this, you should also change the name of the collection and the default type in `_config.yml` as shown above.

### Tag pages

There are plenty of other implementations of tag pages for Jekyll blogs, and so this one just aims to be as simple as possible.

To specify an episode's tags, just list them in the post's front matter.

```yaml
tags:
- The Tenth Doctor
- Specials
- Christmas
```

That's it really. By default, the permalink of a tag page will be the slugified version of the tag's text.

If you want to specify permalinks for a tag, you can do that by creating a file in the data directory called `tag_permalinks.yaml` or `tag_permalinks.json`. It should be a hash, with the tag as the key and the permalink as the value.

```yaml
# tag_permalinks.yaml

"Star Trek: The Next Generation": /tng/
"Star Trek: Deep Space Nine": /ds9/
"Star Trek: Voyager": /voy/
```

To create a list of tag links attached to a post, you can use `jekyll-podcast`'s `tag_link` filter, like this.

```html
{% for tag in post.tags %}
  {{ tag | tag_link }}
{% endfor %}
```

### The `pagetitle` tag

The `{% pagetitle %}` Liquid tag can be placed in the `<head>` of your HTML layouts, and it will render a `<title>` tag for your page. This tag will consist of the title of your page (as specified in the front matter), followed by an em-dash, followed by the title of your site (as specified in `_config.yml`). If your page has no title or if its title is the same as your site's title, the tag will just contain your site's title.

### `jekyll-podcast` in action

I've been using `jekyll-podcast` to create podcast websites since the middle of 2021, after hosting podcasts with WordPress for a number of years. It has allowed me to take more control of my podcast sites, and to spend my time writing HTML and Sass (and Ruby, I guess) instead of wrestling with WordPress plugins and PHP.

If you would like to see some podcasts powered by `jekyll-podcast`, here's a list of the podcasts I'm currently running.

- [Flight Through Entirety](https://flightthroughentirety.com), a _Doctor Who_ podcast flying through the entirety of the show's 60-year history.
- [Bondfinger](https://bondfinger.com), a James Bond commentary podcast that has run out of James Bond films and now spends its time drinking and watching terrible TV shows from the 1960s mostly.
- [Jodie into Terror](https://jodieintoterror.com), a _Doctor Who_ flashcast in which we give our (intermittently) enthusiastic hot takes on the most recent era of _Doctor Who_ mere days after each episode's first broadcast in the UK.
- [Untitled Star Trek Project](https://untitledstartrekproject.com), a _Star Trek_ commentary podcast in which two friends watch _Star Trek_ episodes from any series, chosen (nearly) at random by [a page on the podcast website](https://untitledstartrekproject.com/randomiser).

<!--
## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and the created tag, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/furius95/jekyll-podcast>.

-->
## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
