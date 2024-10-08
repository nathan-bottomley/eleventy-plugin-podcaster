# Hosting your site

However, your podcast episode files should be hosted somewhere else, preferably on a Content Delivery Network (CDN), which will let your listeners download your episodes promptly and quickly.

I host my podcast episode files in [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces), which is inexpensive and not particularly difficult to set up. But there are many other options available, including Cloudflare and Amazon S3 with Cloudfront.

Your CDN host will assign URLs to each of your podcast episodes: you will tell  **Podcaster** about these URLs by defining `podcast.episodeUrlBase` as the base URL for all of your podcast episodes, like this: `https://example-podcast.sfo3.digitaloceanspaces.com`.

To deploy your episodes to your CDN host, you can write an NPM script using `rclone`, `rsync` or `s3cmd`, depending on your setup.

Here's the script that I use to deploy the episodes for one of my sites to a DigitalOcean Space.

```sh
rclone sync episodes/ digitalocean:startlingbarbarabain -P --exclude .DS_Store
```
